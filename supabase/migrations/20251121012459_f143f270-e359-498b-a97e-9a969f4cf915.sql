-- ID-NVIDA™: Sistema de Identidad Auto-Soberana
CREATE TABLE public.digital_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credential_type TEXT NOT NULL, -- 'foundational', 'age', 'membership', 'cell_access'
  did TEXT UNIQUE NOT NULL, -- Decentralized Identifier
  name TEXT NOT NULL,
  email TEXT,
  birthdate DATE,
  avatar_url TEXT,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'revoked', 'expired'
  guardian_signature TEXT,
  metadata JSONB DEFAULT '{}',
  shared_with JSONB DEFAULT '[]', -- Array de entidades con las que se compartió
  revocable BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.digital_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their credentials"
ON public.digital_credentials
FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their credentials"
ON public.digital_credentials
FOR SELECT
USING (auth.uid() = user_id);

-- Guardianes Computacionales
CREATE TABLE public.guardians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  guardian_type TEXT NOT NULL DEFAULT 'security', -- 'security', 'privacy', 'emotional'
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'inactive'
  trust_score NUMERIC DEFAULT 1.0 CHECK (trust_score >= 0 AND trust_score <= 1),
  config JSONB DEFAULT '{}',
  alerts_enabled BOOLEAN DEFAULT true,
  strict_mode BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.guardians ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their guardians"
ON public.guardians
FOR ALL
USING (auth.uid() = user_id);

-- Logs de Acceso y Seguridad
CREATE TABLE public.access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'access', 'share', 'revoke', 'anomaly', 'phishing_attempt'
  resource_type TEXT, -- 'credential', 'data', 'cell', 'fork'
  resource_id UUID,
  ip_address TEXT,
  user_agent TEXT,
  location JSONB,
  risk_level TEXT DEFAULT 'low', -- 'low', 'medium', 'high', 'critical'
  guardian_id UUID REFERENCES public.guardians(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.access_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their access logs"
ON public.access_logs
FOR SELECT
USING (auth.uid() = user_id);

-- Alertas de Guardianes
CREATE TABLE public.guardian_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  guardian_id UUID NOT NULL REFERENCES public.guardians(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL, -- 'anomaly', 'phishing', 'unauthorized_access', 'data_breach'
  severity TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  title TEXT NOT NULL,
  description TEXT,
  action_taken TEXT,
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.guardian_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their alerts"
ON public.guardian_alerts
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their alerts"
ON public.guardian_alerts
FOR UPDATE
USING (auth.uid() = user_id);

-- Diario Emocional
CREATE TABLE public.emotional_diary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_type TEXT NOT NULL DEFAULT 'text', -- 'text', 'voice', 'mixed'
  content TEXT,
  audio_url TEXT,
  sentiment TEXT, -- 'positive', 'negative', 'neutral', 'mixed'
  sentiment_score NUMERIC CHECK (sentiment_score >= -1 AND sentiment_score <= 1),
  emotions JSONB DEFAULT '[]', -- Array de emociones detectadas: ['happy', 'creative', 'anxious']
  tags TEXT[] DEFAULT '{}',
  is_private BOOLEAN DEFAULT true,
  voice_analysis JSONB, -- Análisis de voz: tono, ritmo, intensidad
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.emotional_diary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their diary entries"
ON public.emotional_diary
FOR ALL
USING (auth.uid() = user_id);

-- Permisos de Datos (para Panel de Privacidad)
CREATE TABLE public.data_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL, -- 'profile', 'health', 'emotions', 'art', 'wallet', 'credentials'
  resource_id UUID,
  granted_to TEXT NOT NULL, -- Cell/Fork/Service identifier
  granted_to_type TEXT NOT NULL, -- 'cell', 'fork', 'service', 'user'
  permission_level TEXT NOT NULL DEFAULT 'read', -- 'read', 'write', 'admin'
  granted_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  revoked BOOLEAN DEFAULT false,
  revoked_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.data_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their data permissions"
ON public.data_permissions
FOR ALL
USING (auth.uid() = user_id);

-- Índices para optimizar consultas
CREATE INDEX idx_digital_credentials_user_id ON public.digital_credentials(user_id);
CREATE INDEX idx_digital_credentials_status ON public.digital_credentials(status);
CREATE INDEX idx_guardians_user_id ON public.guardians(user_id);
CREATE INDEX idx_access_logs_user_id ON public.access_logs(user_id);
CREATE INDEX idx_access_logs_created_at ON public.access_logs(created_at DESC);
CREATE INDEX idx_guardian_alerts_user_id ON public.guardian_alerts(user_id);
CREATE INDEX idx_guardian_alerts_resolved ON public.guardian_alerts(resolved);
CREATE INDEX idx_emotional_diary_user_id ON public.emotional_diary(user_id);
CREATE INDEX idx_emotional_diary_created_at ON public.emotional_diary(created_at DESC);
CREATE INDEX idx_data_permissions_user_id ON public.data_permissions(user_id);
CREATE INDEX idx_data_permissions_revoked ON public.data_permissions(revoked);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_digital_credentials_updated_at
BEFORE UPDATE ON public.digital_credentials
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guardians_updated_at
BEFORE UPDATE ON public.guardians
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emotional_diary_updated_at
BEFORE UPDATE ON public.emotional_diary
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.guardian_alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.access_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.data_permissions;