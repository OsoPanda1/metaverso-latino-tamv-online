
-- =========================
-- Federación y verificación doble
-- =========================
CREATE TABLE IF NOT EXISTS federation_registry_local (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  hash text NOT NULL,
  signer text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS federation_registry_continental (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  hash text NOT NULL,
  signer text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_fed_local_lookup ON federation_registry_local (entity_type, entity_id, hash);
CREATE INDEX idx_fed_continental_lookup ON federation_registry_continental (entity_type, entity_id, hash);

ALTER TABLE federation_registry_local ENABLE ROW LEVEL SECURITY;
ALTER TABLE federation_registry_continental ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view federation local" ON federation_registry_local FOR SELECT USING (true);
CREATE POLICY "System can insert federation local" ON federation_registry_local FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view federation continental" ON federation_registry_continental FOR SELECT USING (true);
CREATE POLICY "System can insert federation continental" ON federation_registry_continental FOR INSERT WITH CHECK (true);

-- Vista de verificación doble
CREATE OR REPLACE VIEW federation_double_verification AS
SELECT 
  l.entity_type, 
  l.entity_id, 
  l.hash as local_hash, 
  c.hash as continental_hash,
  l.signer as local_signer,
  c.signer as continental_signer,
  l.created_at as local_at, 
  c.created_at as continental_at,
  CASE WHEN l.hash = c.hash THEN true ELSE false END as verified
FROM federation_registry_local l
JOIN federation_registry_continental c
  ON c.entity_type = l.entity_type 
  AND c.entity_id = l.entity_id;

-- =========================
-- Identidad id-nvida
-- =========================
CREATE TABLE IF NOT EXISTS id_nvida_identities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  biometric_hash text NOT NULL,
  device_fingerprint text,
  trust_score numeric DEFAULT 0,
  verified boolean DEFAULT false,
  quantum_signature text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE id_nvida_identities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own id-nvida" ON id_nvida_identities FOR ALL 
  TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- =========================
-- Hoyo Negro (Blackhole)
-- =========================
CREATE TABLE IF NOT EXISTS blackhole_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users,
  source text NOT NULL,
  signal jsonb NOT NULL,
  severity text CHECK (severity IN ('low','medium','high','critical')) NOT NULL,
  quarantined boolean DEFAULT true,
  resolution_status text DEFAULT 'pending',
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE blackhole_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view blackhole" ON blackhole_events FOR SELECT 
  USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "System inserts blackhole" ON blackhole_events FOR INSERT WITH CHECK (true);

CREATE INDEX idx_blackhole_severity ON blackhole_events (severity, created_at DESC);

-- =========================
-- TAMVCRUMS
-- =========================
CREATE TABLE IF NOT EXISTS tamvcrums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  context text NOT NULL,
  description text NOT NULL,
  action text NOT NULL,
  priority integer DEFAULT 5,
  status text CHECK (status IN ('open','mitigating','closed')) DEFAULT 'open',
  assigned_to uuid REFERENCES auth.users,
  resolution_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tamvcrums ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own tamvcrums" ON tamvcrums FOR SELECT 
  TO authenticated USING (user_id = auth.uid() OR assigned_to = auth.uid());
CREATE POLICY "Users create tamvcrums" ON tamvcrums FOR INSERT 
  TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own tamvcrums" ON tamvcrums FOR UPDATE 
  TO authenticated USING (user_id = auth.uid() OR assigned_to = auth.uid());

CREATE INDEX idx_tamvcrums_status ON tamvcrums (status, created_at DESC);

-- =========================
-- Motores EOCT
-- =========================
CREATE TABLE IF NOT EXISTS engines_eoct (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  version text NOT NULL,
  policy jsonb NOT NULL DEFAULT '{"threshold": 0.7}',
  quantum_filters jsonb DEFAULT '[]',
  active boolean DEFAULT true,
  last_execution timestamptz,
  execution_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE engines_eoct ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view active engines" ON engines_eoct FOR SELECT USING (active = true);
CREATE POLICY "Admins manage engines" ON engines_eoct FOR ALL 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- =========================
-- Radares MOS gemelos
-- =========================
CREATE TABLE IF NOT EXISTS radars_mos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pair_id uuid NOT NULL,
  role text CHECK (role IN ('alpha','beta')) NOT NULL,
  scope text NOT NULL,
  metrics jsonb DEFAULT '{}'::jsonb,
  health_status text DEFAULT 'healthy',
  last_ping timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE radars_mos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view radars" ON radars_mos FOR SELECT USING (true);
CREATE POLICY "System manages radars" ON radars_mos FOR ALL WITH CHECK (true);

CREATE INDEX idx_radars_mos_pair ON radars_mos (pair_id, role);

-- =========================
-- Ojo de Ra
-- =========================
CREATE TABLE IF NOT EXISTS radars_ra (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coverage text NOT NULL,
  signals jsonb NOT NULL,
  threat_level text DEFAULT 'normal',
  active_watchers integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE radars_ra ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view ra" ON radars_ra FOR SELECT USING (true);
CREATE POLICY "System manages ra" ON radars_ra FOR INSERT WITH CHECK (true);

-- =========================
-- Ojo de Quetzalcóatl
-- =========================
CREATE TABLE IF NOT EXISTS radars_quetzalcoatl (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coverage text NOT NULL,
  signals jsonb NOT NULL,
  wisdom_score numeric DEFAULT 0,
  prophecy_data jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE radars_quetzalcoatl ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view quetzal" ON radars_quetzalcoatl FOR SELECT USING (true);
CREATE POLICY "System manages quetzal" ON radars_quetzalcoatl FOR INSERT WITH CHECK (true);

-- =========================
-- Kaos Audio 3D
-- =========================
CREATE TABLE IF NOT EXISTS kaos_audio3d_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users,
  stream_id text,
  audio_url text,
  spatial_config jsonb DEFAULT '{"x": 0, "y": 0, "z": 0}',
  frequency_spectrum jsonb,
  duration_ms integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE kaos_audio3d_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own kaos" ON kaos_audio3d_events FOR SELECT 
  TO authenticated USING (user_id = auth.uid() OR user_id IS NULL);
CREATE POLICY "Users create kaos" ON kaos_audio3d_events FOR INSERT 
  TO authenticated WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- =========================
-- Anubis Sentinel
-- =========================
CREATE TABLE IF NOT EXISTS anubis_sentinel_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users,
  module text NOT NULL,
  signal jsonb NOT NULL,
  risk text CHECK (risk IN ('low','medium','high','critical')) NOT NULL,
  action text NOT NULL,
  auto_resolved boolean DEFAULT false,
  resolution_timestamp timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE anubis_sentinel_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own sentinel alerts" ON anubis_sentinel_alerts FOR SELECT 
  TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins view all sentinel" ON anubis_sentinel_alerts FOR SELECT 
  USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "System inserts sentinel" ON anubis_sentinel_alerts FOR INSERT WITH CHECK (true);

-- =========================
-- Dekateotl (reglas divinas)
-- =========================
CREATE TABLE IF NOT EXISTS dekateotl_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deity text NOT NULL,
  weight numeric NOT NULL DEFAULT 1.0,
  condition jsonb NOT NULL,
  effect jsonb NOT NULL,
  invocation_count integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE dekateotl_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view active rules" ON dekateotl_rules FOR SELECT USING (active = true);
CREATE POLICY "Admins manage rules" ON dekateotl_rules FOR ALL 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- =========================
-- Aztek Gods (reacciones)
-- =========================
CREATE TABLE IF NOT EXISTS aztek_gods_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users,
  module text NOT NULL,
  reaction text NOT NULL,
  deity_invoked text,
  power_level numeric DEFAULT 1.0,
  meta jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE aztek_gods_reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users create reactions" ON aztek_gods_reactions FOR INSERT 
  TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Anyone view reactions" ON aztek_gods_reactions FOR SELECT USING (true);

-- =========================
-- WebRTC Señalización mejorada
-- =========================
CREATE TABLE IF NOT EXISTS rtc_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id text NOT NULL,
  from_user uuid REFERENCES auth.users NOT NULL,
  to_user uuid REFERENCES auth.users,
  type text CHECK (type IN ('offer','answer','candidate','join','leave')) NOT NULL,
  payload jsonb NOT NULL,
  processed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE rtc_signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read signals" ON rtc_signals FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users write signals" ON rtc_signals FOR INSERT TO authenticated WITH CHECK (from_user = auth.uid());

CREATE INDEX idx_rtc_room ON rtc_signals (room_id, created_at DESC);

-- Habilitar realtime para señalización
ALTER PUBLICATION supabase_realtime ADD TABLE rtc_signals;

-- =========================
-- Items/Inventory mejorado
-- =========================
CREATE TABLE IF NOT EXISTS items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  description text,
  category text,
  base_price numeric NOT NULL DEFAULT 0,
  current_price numeric NOT NULL DEFAULT 0,
  stock integer NOT NULL DEFAULT 0,
  rarity text CHECK (rarity IN ('common','uncommon','rare','epic','legendary','mythic')) DEFAULT 'common',
  metadata jsonb DEFAULT '{}',
  published boolean DEFAULT false,
  federation_hash text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner manages items" ON items FOR ALL 
  TO authenticated USING (owner = auth.uid()) WITH CHECK (owner = auth.uid());
CREATE POLICY "Anyone view published items" ON items FOR SELECT USING (published = true);

-- =========================
-- Documentación DevHub
-- =========================
CREATE TABLE IF NOT EXISTS docs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  category text,
  tags text[] DEFAULT '{}',
  author_id uuid REFERENCES auth.users,
  views_count integer DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE docs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view docs" ON docs FOR SELECT USING (true);
CREATE POLICY "Admins manage docs" ON docs FOR ALL 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- =========================
-- Lessons para University
-- =========================
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses ON DELETE CASCADE,
  title text NOT NULL,
  content text,
  media_url text,
  duration_minutes integer DEFAULT 0,
  order_index integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view lessons" ON lessons FOR SELECT USING (true);
CREATE POLICY "Instructors manage lessons" ON lessons FOR ALL 
  TO authenticated USING (
    course_id IN (SELECT id FROM courses WHERE instructor_id = auth.uid())
  );

-- Insertar motores EOCT iniciales
INSERT INTO engines_eoct (name, version, policy, quantum_filters) VALUES
  ('emotional_filter', '1.0', '{"threshold": 0.7, "mode": "empathetic"}', '["joy", "sadness", "anger", "fear", "surprise"]'),
  ('threat_analyzer', '1.0', '{"threshold": 0.8, "mode": "defensive"}', '["malice", "deception", "harm"]'),
  ('harmony_balancer', '1.0', '{"threshold": 0.5, "mode": "equilibrium"}', '["balance", "peace", "conflict"]')
ON CONFLICT (name) DO NOTHING;

-- Insertar reglas Dekateotl iniciales
INSERT INTO dekateotl_rules (deity, weight, condition, effect) VALUES
  ('Quetzalcoatl', 1.5, '{"wisdom_required": 0.7}', '{"grant": "enlightenment", "boost": 1.2}'),
  ('Huitzilopochtli', 1.3, '{"courage_required": 0.8}', '{"grant": "strength", "boost": 1.5}'),
  ('Tlaloc', 1.2, '{"harmony_required": 0.6}', '{"grant": "abundance", "boost": 1.1}'),
  ('Tezcatlipoca', 1.4, '{"shadow_work": 0.9}', '{"grant": "transformation", "boost": 1.3}'),
  ('Xochiquetzal', 1.1, '{"creativity_required": 0.5}', '{"grant": "beauty", "boost": 1.0}')
ON CONFLICT DO NOTHING;
