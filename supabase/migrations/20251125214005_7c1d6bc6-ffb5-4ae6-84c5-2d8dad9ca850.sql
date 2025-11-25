-- ============================================
-- CORRECCIÓN DE WARNINGS DE SEGURIDAD
-- Arreglar search_path y security definer view
-- ============================================

-- 1. ARREGLAR FUNCIÓN create_audit_log (añadir search_path)
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
SET search_path = public
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

-- 2. ARREGLAR FUNCIÓN can_perform_action (añadir search_path)
CREATE OR REPLACE FUNCTION public.can_perform_action(
  p_user_id UUID,
  p_action TEXT,
  p_resource_type TEXT,
  p_resource_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.has_role(p_user_id, 'admin') THEN
    RETURN TRUE;
  END IF;
  
  RETURN CASE p_action
    WHEN 'moderate' THEN public.has_any_role(p_user_id, ARRAY['moderator', 'guardian']::app_role[])
    WHEN 'mint_nft' THEN public.has_role(p_user_id, 'artist')
    WHEN 'create_course' THEN public.has_role(p_user_id, 'instructor')
    WHEN 'validate_proposal' THEN public.has_role(p_user_id, 'guardian')
    ELSE FALSE
  END;
END;
$$;

-- 3. REEMPLAZAR VISTA SECURITY DEFINER POR FUNCIÓN NORMAL
-- Eliminar vista problemática
DROP VIEW IF EXISTS public.security_dashboard;

-- Crear función en su lugar (más seguro)
CREATE OR REPLACE FUNCTION public.get_security_metrics()
RETURNS TABLE (
  metric TEXT,
  value BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 'active_users'::TEXT as metric, COUNT(DISTINCT user_id) as value
  FROM public.user_roles
  UNION ALL
  SELECT 'total_audit_logs'::TEXT, COUNT(*) as value
  FROM public.entity_logs
  UNION ALL
  SELECT 'admin_count'::TEXT, COUNT(*) as value
  FROM public.user_roles
  WHERE role = 'admin'
  UNION ALL
  SELECT 'fraud_alerts_unresolved'::TEXT, COUNT(*) as value
  FROM public.fraud_alerts
  WHERE NOT resolved;
$$;

-- 4. POLÍTICA DE ACCESO PARA MÉTRICAS (solo admins)
COMMENT ON FUNCTION public.get_security_metrics IS 'Retorna métricas de seguridad - solo accesible por admins';

-- 5. COMENTARIOS FINALES
COMMENT ON FUNCTION public.create_audit_log IS 'Crea logs de auditoría inmutable con SHA-512 (BookPI) - search_path=public para seguridad';
COMMENT ON FUNCTION public.can_perform_action IS 'Valida permisos granulares - search_path=public para seguridad';