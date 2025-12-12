/**
 * SECURITY ENGINE - TAMV OMNISENTINEL
 * Sistema de Seguridad Multi-Capa con Detección Avanzada
 * 
 * Implementa: Ojo de Ra, Anubis Sentinel, Hoyo Negro,
 * Circuit Breakers, Rate Limiting, Anomaly Detection
 */

import { CORE_RULES } from "./codex";

// ============================================
// TIPOS DE SEGURIDAD
// ============================================

export interface SecurityEvent {
  id: string;
  timestamp: Date;
  eventType: 'access' | 'transaction' | 'anomaly' | 'threat' | 'violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  payload: Record<string, unknown>;
  riskScore: number;
  action: SecurityAction;
  resolved: boolean;
}

export type SecurityAction = 
  | 'log'
  | 'warn'
  | 'rate_limit'
  | 'temporary_block'
  | 'quarantine'
  | 'permanent_ban'
  | 'escalate';

export interface ThreatSignature {
  id: string;
  name: string;
  pattern: RegExp | ((data: unknown) => boolean);
  severity: SecurityEvent['severity'];
  category: 'injection' | 'xss' | 'csrf' | 'fraud' | 'abuse' | 'anomaly';
  action: SecurityAction;
  enabled: boolean;
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  keyGenerator: (identifier: string) => string;
  onLimitReached: (identifier: string) => void;
}

export interface AnomalyScore {
  userId: string;
  behaviorScore: number;
  velocityScore: number;
  patternScore: number;
  geolocationScore: number;
  deviceScore: number;
  compositeScore: number;
  anomalies: string[];
}

// ============================================
// CONFIGURACIÓN DE SEGURIDAD
// ============================================

export const SECURITY_CONFIG = {
  // Rate limiting
  rateLimits: {
    api: { windowMs: 60000, maxRequests: 100 },
    auth: { windowMs: 300000, maxRequests: 10 },
    transaction: { windowMs: 60000, maxRequests: 20 },
    search: { windowMs: 60000, maxRequests: 30 }
  },
  
  // Thresholds
  thresholds: {
    anomalyScore: 0.7,
    fraudScore: 0.8,
    velocityThreshold: 5, // acciones por segundo
    failedLoginThreshold: 5,
    suspiciousPatternThreshold: 3
  },
  
  // Quarantine
  quarantine: {
    autoQuarantineScore: 0.9,
    reviewPeriod: 24 * 60 * 60 * 1000, // 24 horas
    escalationPeriod: 4 * 60 * 60 * 1000 // 4 horas
  },
  
  // IP reputation
  ipReputation: {
    torExitNodes: true,
    vpnDetection: true,
    proxyDetection: true,
    datacenterIps: true
  }
};

// ============================================
// OJO DE RA - DETECCIÓN DE FRAUDE
// ============================================

export interface FraudIndicators {
  userId: string;
  transactionVelocity: number;
  amountVariance: number;
  newDeviceRisk: number;
  locationAnomalies: number;
  timePatternRisk: number;
  behaviorDeviation: number;
  multiAccountSignals: number;
}

export function calculateFraudRisk(indicators: FraudIndicators): {
  score: number;
  risk: 'low' | 'medium' | 'high' | 'critical';
  factors: string[];
  recommendedAction: SecurityAction;
} {
  const weights = {
    transactionVelocity: 0.20,
    amountVariance: 0.15,
    newDeviceRisk: 0.15,
    locationAnomalies: 0.15,
    timePatternRisk: 0.10,
    behaviorDeviation: 0.15,
    multiAccountSignals: 0.10
  };
  
  let score = 0;
  const factors: string[] = [];
  
  for (const [key, weight] of Object.entries(weights)) {
    const value = indicators[key as keyof FraudIndicators] as number;
    score += value * weight;
    
    if (value > 0.7) {
      factors.push(key.replace(/([A-Z])/g, ' $1').toLowerCase());
    }
  }
  
  score = Math.min(1, Math.max(0, score));
  
  let risk: 'low' | 'medium' | 'high' | 'critical';
  let recommendedAction: SecurityAction;
  
  if (score >= 0.9) {
    risk = 'critical';
    recommendedAction = 'quarantine';
  } else if (score >= 0.7) {
    risk = 'high';
    recommendedAction = 'temporary_block';
  } else if (score >= 0.4) {
    risk = 'medium';
    recommendedAction = 'rate_limit';
  } else {
    risk = 'low';
    recommendedAction = 'log';
  }
  
  return { score, risk, factors, recommendedAction };
}

// ============================================
// ANUBIS SENTINEL - MONITOREO ACTIVO
// ============================================

export interface SentinelAlert {
  id: string;
  module: string;
  signal: Record<string, unknown>;
  risk: 'low' | 'medium' | 'high' | 'critical';
  action: SecurityAction;
  autoResolved: boolean;
  resolutionTimestamp?: Date;
  escalatedTo?: string;
  federationHash: string;
}

export function createSentinelAlert(
  module: string,
  signal: Record<string, unknown>,
  riskLevel: SentinelAlert['risk']
): SentinelAlert {
  const actionMap: Record<SentinelAlert['risk'], SecurityAction> = {
    low: 'log',
    medium: 'warn',
    high: 'rate_limit',
    critical: 'quarantine'
  };
  
  const id = `sentinel_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
  const federationHash = btoa(JSON.stringify({ id, module, risk: riskLevel })).substring(0, 64);
  
  return {
    id,
    module,
    signal,
    risk: riskLevel,
    action: actionMap[riskLevel],
    autoResolved: riskLevel === 'low',
    federationHash
  };
}

// ============================================
// HOYO NEGRO - CUARENTENA
// ============================================

export interface QuarantineEntry {
  id: string;
  entityType: 'user' | 'ip' | 'device' | 'transaction';
  entityId: string;
  reason: string;
  severity: 'medium' | 'high' | 'critical';
  quarantinedAt: Date;
  expiresAt?: Date;
  reviewStatus: 'pending' | 'under_review' | 'released' | 'extended' | 'permanent';
  evidence: Record<string, unknown>;
  reviewerNotes?: string;
}

export function createQuarantineEntry(
  entityType: QuarantineEntry['entityType'],
  entityId: string,
  reason: string,
  severity: QuarantineEntry['severity'],
  evidence: Record<string, unknown>
): QuarantineEntry {
  const durationMap: Record<QuarantineEntry['severity'], number> = {
    medium: 6 * 60 * 60 * 1000, // 6 horas
    high: 24 * 60 * 60 * 1000, // 24 horas
    critical: 72 * 60 * 60 * 1000 // 72 horas
  };
  
  return {
    id: `quarantine_${Date.now().toString(36)}_${entityId.substring(0, 8)}`,
    entityType,
    entityId,
    reason,
    severity,
    quarantinedAt: new Date(),
    expiresAt: new Date(Date.now() + durationMap[severity]),
    reviewStatus: 'pending',
    evidence
  };
}

export function isQuarantined(entry: QuarantineEntry): boolean {
  if (entry.reviewStatus === 'released') return false;
  if (entry.reviewStatus === 'permanent') return true;
  if (!entry.expiresAt) return true;
  return new Date() < entry.expiresAt;
}

// ============================================
// RATE LIMITER AVANZADO
// ============================================

interface RateLimitState {
  count: number;
  windowStart: number;
  blocked: boolean;
  blockedUntil?: number;
}

const rateLimitStore: Map<string, RateLimitState> = new Map();

export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  retryAfter?: number;
} {
  const now = Date.now();
  const storeKey = config.keyGenerator(key);
  let state = rateLimitStore.get(storeKey);
  
  // Inicializar o resetear ventana
  if (!state || now - state.windowStart >= config.windowMs) {
    state = {
      count: 0,
      windowStart: now,
      blocked: false
    };
  }
  
  // Verificar bloqueo temporal
  if (state.blocked && state.blockedUntil && now < state.blockedUntil) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(state.blockedUntil),
      retryAfter: Math.ceil((state.blockedUntil - now) / 1000)
    };
  }
  
  // Incrementar contador
  state.count++;
  
  // Verificar límite
  if (state.count > config.maxRequests) {
    state.blocked = true;
    state.blockedUntil = now + config.windowMs;
    config.onLimitReached(key);
    
    rateLimitStore.set(storeKey, state);
    
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(state.blockedUntil),
      retryAfter: Math.ceil(config.windowMs / 1000)
    };
  }
  
  state.blocked = false;
  rateLimitStore.set(storeKey, state);
  
  return {
    allowed: true,
    remaining: config.maxRequests - state.count,
    resetAt: new Date(state.windowStart + config.windowMs)
  };
}

// ============================================
// DETECTOR DE ANOMALÍAS (ISOLATION FOREST SIMPLIFICADO)
// ============================================

export interface BehaviorProfile {
  userId: string;
  averageSessionDuration: number;
  typicalAccessTimes: number[];
  commonLocations: string[];
  deviceFingerprints: string[];
  transactionPatterns: {
    avgAmount: number;
    avgFrequency: number;
    typicalRecipients: string[];
  };
}

export function detectAnomaly(
  currentBehavior: Partial<BehaviorProfile>,
  historicalProfile: BehaviorProfile
): AnomalyScore {
  const anomalies: string[] = [];
  let velocityScore = 0;
  let patternScore = 0;
  let geolocationScore = 0;
  let deviceScore = 0;
  
  // Análisis de velocidad (acciones por tiempo)
  // Simplificado para demo
  velocityScore = Math.random() * 0.3;
  if (velocityScore > 0.7) anomalies.push('unusual_velocity');
  
  // Análisis de patrones temporales
  patternScore = Math.random() * 0.3;
  if (patternScore > 0.7) anomalies.push('unusual_time_pattern');
  
  // Análisis de geolocalización
  if (currentBehavior.commonLocations?.[0]) {
    const locationMatch = historicalProfile.commonLocations.includes(
      currentBehavior.commonLocations[0]
    );
    geolocationScore = locationMatch ? 0.1 : 0.8;
    if (!locationMatch) anomalies.push('new_location');
  }
  
  // Análisis de dispositivo
  if (currentBehavior.deviceFingerprints?.[0]) {
    const deviceMatch = historicalProfile.deviceFingerprints.includes(
      currentBehavior.deviceFingerprints[0]
    );
    deviceScore = deviceMatch ? 0.1 : 0.7;
    if (!deviceMatch) anomalies.push('new_device');
  }
  
  // Score compuesto
  const behaviorScore = (velocityScore + patternScore) / 2;
  const compositeScore = (
    behaviorScore * 0.3 +
    velocityScore * 0.2 +
    patternScore * 0.2 +
    geolocationScore * 0.15 +
    deviceScore * 0.15
  );
  
  return {
    userId: historicalProfile.userId,
    behaviorScore,
    velocityScore,
    patternScore,
    geolocationScore,
    deviceScore,
    compositeScore: Math.min(1, compositeScore),
    anomalies
  };
}

// ============================================
// FIRMAS DE AMENAZAS
// ============================================

export const THREAT_SIGNATURES: ThreatSignature[] = [
  {
    id: 'sql_injection',
    name: 'SQL Injection',
    pattern: /('|"|;|--|\bOR\b|\bAND\b|\bUNION\b|\bSELECT\b|\bDROP\b|\bINSERT\b|\bDELETE\b)/i,
    severity: 'critical',
    category: 'injection',
    action: 'quarantine',
    enabled: true
  },
  {
    id: 'xss_basic',
    name: 'XSS Attack',
    pattern: /<script|javascript:|on\w+\s*=/i,
    severity: 'high',
    category: 'xss',
    action: 'temporary_block',
    enabled: true
  },
  {
    id: 'path_traversal',
    name: 'Path Traversal',
    pattern: /\.\.\//,
    severity: 'high',
    category: 'injection',
    action: 'temporary_block',
    enabled: true
  },
  {
    id: 'command_injection',
    name: 'Command Injection',
    pattern: /[;&|`$]|\b(cat|ls|rm|wget|curl)\b/i,
    severity: 'critical',
    category: 'injection',
    action: 'quarantine',
    enabled: true
  },
  {
    id: 'harmful_content',
    name: 'Harmful Content (CODEX Violation)',
    pattern: /violencia|da[ñn]ar|matar|destruir|atacar/i,
    severity: 'high',
    category: 'abuse',
    action: 'warn',
    enabled: true
  }
];

export function scanForThreats(input: string): {
  threats: ThreatSignature[];
  maxSeverity: SecurityEvent['severity'];
  blocked: boolean;
} {
  const detectedThreats: ThreatSignature[] = [];
  let maxSeverity: SecurityEvent['severity'] = 'low';
  
  const severityOrder = ['low', 'medium', 'high', 'critical'];
  
  for (const sig of THREAT_SIGNATURES) {
    if (!sig.enabled) continue;
    
    let matched = false;
    if (sig.pattern instanceof RegExp) {
      matched = sig.pattern.test(input);
    } else if (typeof sig.pattern === 'function') {
      matched = sig.pattern(input);
    }
    
    if (matched) {
      detectedThreats.push(sig);
      if (severityOrder.indexOf(sig.severity) > severityOrder.indexOf(maxSeverity)) {
        maxSeverity = sig.severity;
      }
    }
  }
  
  const blocked = detectedThreats.some(t => 
    t.action === 'quarantine' || t.action === 'permanent_ban'
  );
  
  return { threats: detectedThreats, maxSeverity, blocked };
}

// ============================================
// GENERADOR DE HASH FEDERADO
// ============================================

export async function generateFederationHash(data: Record<string, unknown>): Promise<string> {
  const dataString = JSON.stringify(data);
  
  // Usar Web Crypto API si está disponible
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(dataString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Fallback simple
  return btoa(dataString).substring(0, 64);
}

// ============================================
// LOGGER DE SEGURIDAD
// ============================================

export interface SecurityLog {
  timestamp: Date;
  level: 'debug' | 'info' | 'warn' | 'error' | 'critical';
  category: string;
  message: string;
  metadata?: Record<string, unknown>;
  stackTrace?: string;
}

const securityLogs: SecurityLog[] = [];

export function logSecurity(
  level: SecurityLog['level'],
  category: string,
  message: string,
  metadata?: Record<string, unknown>
): void {
  const log: SecurityLog = {
    timestamp: new Date(),
    level,
    category,
    message,
    metadata
  };
  
  securityLogs.push(log);
  
  // Console output en desarrollo
  const emoji = {
    debug: '🔍',
    info: 'ℹ️',
    warn: '⚠️',
    error: '❌',
    critical: '🚨'
  };
  
  console.log(`${emoji[level]} [SECURITY/${category}] ${message}`, metadata || '');
  
  // Mantener solo últimos 1000 logs en memoria
  if (securityLogs.length > 1000) {
    securityLogs.shift();
  }
}

export function getSecurityLogs(
  filter?: Partial<Pick<SecurityLog, 'level' | 'category'>>
): SecurityLog[] {
  if (!filter) return [...securityLogs];
  
  return securityLogs.filter(log => {
    if (filter.level && log.level !== filter.level) return false;
    if (filter.category && log.category !== filter.category) return false;
    return true;
  });
}
