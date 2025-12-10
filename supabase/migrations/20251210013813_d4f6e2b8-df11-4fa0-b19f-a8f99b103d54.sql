
-- Corregir la vista con SECURITY INVOKER
DROP VIEW IF EXISTS federation_double_verification;

CREATE VIEW federation_double_verification 
WITH (security_invoker = true) AS
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

-- Crear storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES
  ('avatars', 'avatars', false, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('chat-files', 'chat-files', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'text/plain']),
  ('media-assets', 'media-assets', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'audio/mpeg', 'audio/wav']),
  ('voice-audio', 'voice-audio', false, 10485760, ARRAY['audio/mpeg', 'audio/wav', 'audio/webm', 'audio/ogg']),
  ('sensors', 'sensors', false, 5242880, ARRAY['application/json', 'text/plain'])
ON CONFLICT (id) DO NOTHING;

-- Políticas de storage para avatars
CREATE POLICY "Users read own avatars" ON storage.objects FOR SELECT 
  TO authenticated USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users upload own avatars" ON storage.objects FOR INSERT 
  TO authenticated WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users delete own avatars" ON storage.objects FOR DELETE 
  TO authenticated USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Políticas para chat-files
CREATE POLICY "Users read own chat files" ON storage.objects FOR SELECT 
  TO authenticated USING (bucket_id = 'chat-files' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users upload chat files" ON storage.objects FOR INSERT 
  TO authenticated WITH CHECK (bucket_id = 'chat-files' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Políticas para media-assets (público)
CREATE POLICY "Anyone reads media assets" ON storage.objects FOR SELECT 
  USING (bucket_id = 'media-assets');

CREATE POLICY "Authenticated upload media" ON storage.objects FOR INSERT 
  TO authenticated WITH CHECK (bucket_id = 'media-assets');

-- Políticas para voice-audio
CREATE POLICY "Users read own voice" ON storage.objects FOR SELECT 
  TO authenticated USING (bucket_id = 'voice-audio' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users upload voice" ON storage.objects FOR INSERT 
  TO authenticated WITH CHECK (bucket_id = 'voice-audio' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Políticas para sensors
CREATE POLICY "Users read own sensors" ON storage.objects FOR SELECT 
  TO authenticated USING (bucket_id = 'sensors' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users upload sensors" ON storage.objects FOR INSERT 
  TO authenticated WITH CHECK (bucket_id = 'sensors' AND (storage.foldername(name))[1] = auth.uid()::text);
