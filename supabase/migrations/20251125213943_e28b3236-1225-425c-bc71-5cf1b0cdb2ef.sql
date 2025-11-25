-- ============================================
-- SISTEMA DE SEGURIDAD Y GOBERNANZA TAMV V3
-- Crear tablas primero, luego funciones
-- ============================================

-- 1. CREAR TABLA ENTITY_LOGS SI NO EXISTE
CREATE TABLE IF NOT EXISTS public.entity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  action VARCHAR(80) NOT NULL,
  actor_id UUID,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  prev_state JSONB,
  new_state JSONB,
  bookpi_hash TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_entity_logs_entity ON public.entity_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_entity_logs_actor ON public.entity_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_entity_logs_timestamp ON public.entity_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_entity_logs_hash ON public.entity_logs(bookpi_hash);

ALTER TABLE public.entity_logs ENABLE ROW LEVEL SECURITY;

-- Solo admins pueden ver logs
CREATE POLICY "Admins can view audit logs"
ON public.entity_logs FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Sistema puede insertar
CREATE POLICY "System can insert audit logs"
ON public.entity_logs FOR INSERT
TO authenticated
WITH CHECK (true);

-- 2. FUNCIÓN SIMPLE DE VALIDACIÓN DE ROLES
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Función múltiples roles
CREATE OR REPLACE FUNCTION public.has_any_role(_user_id UUID, _roles app_role[])
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = ANY(_roles)
  )
$$;

-- 3. FUNCIÓN PARA CREAR LOGS (BOOKPI)
CREATE OR REPLACE FUNCTION public.create_audit_log(
  p_entity_type VARCHAR,
  p_entity_id UUID,
  p_action VARCHAR,
  p_prev_state JSONB DEFAULT NULL,
  p_new_state JSONB DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_log_id UUID;
  v_hash TEXT;
BEGIN
  v_hash := encode(
    digest(
      p_entity_type || p_entity_id::text || p_action || 
      COALESCE(p_new_state::text, '') || NOW()::text,
      'sha512'
    ),
    'hex'
  );
  
  INSERT INTO public.entity_logs (
    entity_type, entity_id, action, actor_id,
    prev_state, new_state, bookpi_hash, metadata
  ) VALUES (
    p_entity_type, p_entity_id, p_action, auth.uid(),
    p_prev_state, p_new_state, v_hash, p_metadata
  ) RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;

-- 4. FUNCIÓN PERMISOS GRANULARES
CREATE OR REPLACE FUNCTION public.can_perform_action(
  p_user_id UUID,
  p_action TEXT,
  p_resource_type TEXT,
  p_resource_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF public.has_role(p_user_id, 'admin') THEN
    RETURN TRUE;
  END IF;
  
  RETURN CASE p_action
    WHEN 'moderate' THEN public.has_any_role(p_user_id, ARRAY['moderator', 'guardian']::app_role[])
    WHEN 'mint_nft' THEN public.has_role(p_user_id, 'artist')
    ELSE FALSE
  END;
END;
$$;

-- 5. VISTA DE SEGURIDAD
CREATE OR REPLACE VIEW public.security_dashboard AS
SELECT
  'active_users' as metric,
  COUNT(DISTINCT user_id)::INT as value
FROM public.user_roles
UNION ALL
SELECT
  'total_audit_logs' as metric,
  COUNT(*)::INT as value
FROM public.entity_logs
UNION ALL
SELECT
  'admin_count' as metric,
  COUNT(*)::INT as value
FROM public.user_roles
WHERE role = 'admin';

COMMENT ON FUNCTION public.has_role IS 'Valida roles con security definer';
COMMENT ON FUNCTION public.create_audit_log IS 'Auditoría inmutable BookPI con SHA-512';
COMMENT ON VIEW public.security_dashboard IS 'Métricas de seguridad';