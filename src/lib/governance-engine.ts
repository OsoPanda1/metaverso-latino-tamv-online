/**
 * GOVERNANCE ENGINE - TAMV DAO HÍBRIDA
 * Sistema de Gobernanza Descentralizada con Contrapesos Éticos
 * 
 * Implementa: PoCC (Proof of Contribution Consensus), 
 * Quorum Adaptativo, Multi-Sig, Guardianes Éticos
 */

import { PILLARS, CORE_RULES } from "./codex";

// ============================================
// TIPOS DE GOBERNANZA
// ============================================

export interface ContributionProof {
  userId: string;
  contributionType: 'code' | 'content' | 'moderation' | 'education' | 'community' | 'investment';
  value: number;
  timestamp: Date;
  verified: boolean;
  verifierId?: string;
}

export interface ReputationScore {
  userId: string;
  baseScore: number;
  contributionBonus: number;
  penaltyDeductions: number;
  timeDecay: number;
  finalScore: number;
  tier: 'novice' | 'contributor' | 'trusted' | 'guardian' | 'elder';
  lastUpdate: Date;
}

export interface VotingPower {
  userId: string;
  baseVotes: number;
  reputationMultiplier: number;
  delegatedVotes: number;
  effectiveVotes: number;
  constraints: string[];
}

export interface GovernanceProposal {
  id: string;
  title: string;
  description: string;
  category: 'technical' | 'financial' | 'community' | 'governance' | 'emergency';
  proposerId: string;
  createdAt: Date;
  votingStartsAt: Date;
  votingEndsAt: Date;
  executionDelay: number; // milliseconds
  requiredQuorum: number;
  votes: {
    for: Map<string, number>;
    against: Map<string, number>;
    abstain: Map<string, number>;
  };
  status: 'draft' | 'active' | 'passed' | 'rejected' | 'executed' | 'vetoed';
  guardianReviews: GuardianReview[];
  impactAssessment: ImpactAssessment;
  executionPayload?: Record<string, unknown>;
}

export interface GuardianReview {
  guardianId: string;
  guardianType: 'ethical' | 'technical' | 'legal' | 'cultural';
  decision: 'approve' | 'reject' | 'request_changes' | 'escalate';
  reasoning: string;
  pillarReference: keyof typeof PILLARS;
  timestamp: Date;
  binding: boolean;
}

export interface ImpactAssessment {
  financialImpact: number; // 0-1
  communityImpact: number;
  technicalRisk: number;
  reputationalRisk: number;
  reversibility: number;
  overallScore: number;
}

// ============================================
// CONFIGURACIÓN DE GOBERNANZA
// ============================================

export const GOVERNANCE_CONFIG = {
  // Quorum
  baseQuorum: 0.35,
  maxQuorum: 0.60,
  emergencyQuorum: 0.75,
  
  // Tiempos
  minVotingPeriod: 3 * 24 * 60 * 60 * 1000, // 3 días
  standardVotingPeriod: 7 * 24 * 60 * 60 * 1000, // 7 días
  emergencyVotingPeriod: 24 * 60 * 60 * 1000, // 24 horas
  executionDelay: 48 * 60 * 60 * 1000, // 48 horas
  
  // Reputación
  reputationDecayRate: 0.02, // 2% mensual
  maxReputationBonus: 2.0,
  minContributionThreshold: 10,
  
  // Guardianes
  guardianVetoThreshold: 0.67,
  requiredGuardianTypes: ['ethical', 'technical'] as const,
  
  // Anti-concentración
  maxVotingPower: 0.10, // 10% máximo del total
  hhiThreshold: 0.25, // Herfindahl-Hirschman Index
  
  // Tiers de reputación
  tierThresholds: {
    novice: 0,
    contributor: 100,
    trusted: 500,
    guardian: 1000,
    elder: 5000
  }
};

// ============================================
// CÁLCULO DE REPUTACIÓN (PoCC)
// ============================================

export function calculateReputationScore(
  contributions: ContributionProof[],
  penalties: number = 0,
  lastUpdate: Date = new Date()
): ReputationScore {
  // Calcular bonus por contribuciones
  const typeWeights: Record<ContributionProof['contributionType'], number> = {
    code: 1.5,
    content: 1.2,
    moderation: 1.3,
    education: 1.4,
    community: 1.1,
    investment: 0.8
  };
  
  let contributionBonus = 0;
  for (const contrib of contributions) {
    if (contrib.verified) {
      contributionBonus += contrib.value * typeWeights[contrib.contributionType];
    }
  }
  
  // Aplicar decay temporal
  const monthsSinceUpdate = (Date.now() - lastUpdate.getTime()) / (30 * 24 * 60 * 60 * 1000);
  const timeDecay = Math.pow(1 - GOVERNANCE_CONFIG.reputationDecayRate, monthsSinceUpdate);
  
  // Calcular score final
  const baseScore = 100; // Base para todos
  const finalScore = Math.max(0, (baseScore + contributionBonus - penalties) * timeDecay);
  
  // Determinar tier
  let tier: ReputationScore['tier'] = 'novice';
  for (const [tierName, threshold] of Object.entries(GOVERNANCE_CONFIG.tierThresholds)) {
    if (finalScore >= threshold) {
      tier = tierName as ReputationScore['tier'];
    }
  }
  
  return {
    userId: contributions[0]?.userId || '',
    baseScore,
    contributionBonus,
    penaltyDeductions: penalties,
    timeDecay,
    finalScore,
    tier,
    lastUpdate
  };
}

// ============================================
// PODER DE VOTO
// ============================================

export function calculateVotingPower(
  reputation: ReputationScore,
  delegatedVotes: number = 0,
  totalVotingPower: number = 10000
): VotingPower {
  // Multiplicador basado en tier
  const tierMultipliers: Record<ReputationScore['tier'], number> = {
    novice: 1.0,
    contributor: 1.2,
    trusted: 1.5,
    guardian: 2.0,
    elder: 2.5
  };
  
  const reputationMultiplier = tierMultipliers[reputation.tier];
  const baseVotes = Math.sqrt(reputation.finalScore); // Raíz cuadrada para limitar concentración
  const rawEffectiveVotes = (baseVotes * reputationMultiplier) + delegatedVotes;
  
  // Aplicar cap de concentración
  const maxAllowedVotes = totalVotingPower * GOVERNANCE_CONFIG.maxVotingPower;
  const effectiveVotes = Math.min(rawEffectiveVotes, maxAllowedVotes);
  
  const constraints: string[] = [];
  if (rawEffectiveVotes > maxAllowedVotes) {
    constraints.push(`Voto limitado al ${GOVERNANCE_CONFIG.maxVotingPower * 100}% del total`);
  }
  
  return {
    userId: reputation.userId,
    baseVotes,
    reputationMultiplier,
    delegatedVotes,
    effectiveVotes,
    constraints
  };
}

// ============================================
// QUORUM ADAPTATIVO
// ============================================

export function calculateAdaptiveQuorum(
  proposal: GovernanceProposal,
  currentParticipation: number
): number {
  const { baseQuorum, maxQuorum, emergencyQuorum } = GOVERNANCE_CONFIG;
  
  // Factor de impacto
  const impactFactor = proposal.impactAssessment.overallScore;
  
  // Factor de categoría
  const categoryModifiers: Record<GovernanceProposal['category'], number> = {
    technical: 0.05,
    financial: 0.15,
    community: 0,
    governance: 0.20,
    emergency: 0.30
  };
  
  const categoryMod = categoryModifiers[proposal.category];
  
  // Calcular quorum base
  let requiredQuorum = baseQuorum + (impactFactor * (maxQuorum - baseQuorum)) + categoryMod;
  
  // Emergencias tienen quorum especial
  if (proposal.category === 'emergency') {
    requiredQuorum = emergencyQuorum;
  }
  
  // Ajuste dinámico basado en participación histórica
  if (currentParticipation < 0.2) {
    requiredQuorum = Math.max(baseQuorum * 0.8, requiredQuorum * 0.9);
  }
  
  return Math.min(maxQuorum, Math.max(baseQuorum, requiredQuorum));
}

// ============================================
// EVALUACIÓN DE IMPACTO
// ============================================

export function assessProposalImpact(
  proposal: Partial<GovernanceProposal>,
  treasurySize: number = 1000000
): ImpactAssessment {
  // Análisis financiero
  const financialPayload = (proposal.executionPayload?.amount as number) || 0;
  const financialImpact = Math.min(1, financialPayload / (treasurySize * 0.1));
  
  // Análisis comunitario basado en categoría
  const communityImpactMap: Record<string, number> = {
    technical: 0.3,
    financial: 0.6,
    community: 0.8,
    governance: 0.9,
    emergency: 1.0
  };
  const communityImpact = communityImpactMap[proposal.category || 'community'] || 0.5;
  
  // Riesgo técnico
  const technicalRisk = proposal.category === 'technical' ? 0.7 : 0.3;
  
  // Riesgo reputacional
  const reputationalRisk = financialImpact * 0.5 + communityImpact * 0.3;
  
  // Reversibilidad
  const reversibility = proposal.category === 'governance' ? 0.3 : 0.7;
  
  // Score general
  const overallScore = (
    financialImpact * 0.25 +
    communityImpact * 0.25 +
    technicalRisk * 0.20 +
    reputationalRisk * 0.15 +
    (1 - reversibility) * 0.15
  );
  
  return {
    financialImpact,
    communityImpact,
    technicalRisk,
    reputationalRisk,
    reversibility,
    overallScore
  };
}

// ============================================
// REVISIÓN DE GUARDIANES
// ============================================

export function processGuardianReviews(
  reviews: GuardianReview[]
): {
  approved: boolean;
  vetoed: boolean;
  reasoning: string[];
  pillarViolations: string[];
} {
  const requiredTypes = GOVERNANCE_CONFIG.requiredGuardianTypes;
  const reviewsByType = new Map<string, GuardianReview[]>();
  
  // Agrupar por tipo
  for (const review of reviews) {
    const existing = reviewsByType.get(review.guardianType) || [];
    existing.push(review);
    reviewsByType.set(review.guardianType, existing);
  }
  
  // Verificar que todos los tipos requeridos han revisado
  const missingTypes = requiredTypes.filter(t => !reviewsByType.has(t));
  if (missingTypes.length > 0) {
    return {
      approved: false,
      vetoed: false,
      reasoning: [`Falta revisión de guardianes: ${missingTypes.join(', ')}`],
      pillarViolations: []
    };
  }
  
  // Contar decisiones
  let approvals = 0;
  let rejections = 0;
  const reasoning: string[] = [];
  const pillarViolations: string[] = [];
  
  for (const review of reviews) {
    if (review.decision === 'approve') {
      approvals++;
    } else if (review.decision === 'reject') {
      rejections++;
      reasoning.push(`${review.guardianType}: ${review.reasoning}`);
      pillarViolations.push(PILLARS[review.pillarReference]);
    }
  }
  
  // Evaluar veto
  const totalReviews = approvals + rejections;
  const rejectionRate = totalReviews > 0 ? rejections / totalReviews : 0;
  const vetoed = rejectionRate >= GOVERNANCE_CONFIG.guardianVetoThreshold;
  
  return {
    approved: approvals > rejections && !vetoed,
    vetoed,
    reasoning,
    pillarViolations
  };
}

// ============================================
// CÁLCULO HHI (ANTI-CONCENTRACIÓN)
// ============================================

export function calculateHHI(votingPowers: VotingPower[]): {
  hhi: number;
  concentrated: boolean;
  topHolders: { userId: string; share: number }[];
} {
  const totalPower = votingPowers.reduce((sum, vp) => sum + vp.effectiveVotes, 0);
  if (totalPower === 0) {
    return { hhi: 0, concentrated: false, topHolders: [] };
  }
  
  // Calcular shares
  const shares = votingPowers.map(vp => ({
    userId: vp.userId,
    share: vp.effectiveVotes / totalPower
  }));
  
  // HHI = suma de cuadrados de las participaciones
  const hhi = shares.reduce((sum, s) => sum + Math.pow(s.share, 2), 0);
  
  // Top holders
  const topHolders = shares
    .sort((a, b) => b.share - a.share)
    .slice(0, 5);
  
  return {
    hhi,
    concentrated: hhi > GOVERNANCE_CONFIG.hhiThreshold,
    topHolders
  };
}

// ============================================
// EJECUTOR DE PROPUESTAS
// ============================================

export interface ExecutionResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  bookPIEntry: string;
  timestamp: Date;
}

export async function executeProposal(
  proposal: GovernanceProposal,
  signers: string[]
): Promise<ExecutionResult> {
  // Verificar multi-sig
  const requiredSigners = proposal.category === 'financial' ? 3 : 2;
  if (signers.length < requiredSigners) {
    return {
      success: false,
      error: `Se requieren ${requiredSigners} firmantes, solo hay ${signers.length}`,
      bookPIEntry: '',
      timestamp: new Date()
    };
  }
  
  // Verificar timelock
  const now = Date.now();
  const canExecuteAfter = proposal.votingEndsAt.getTime() + proposal.executionDelay;
  if (now < canExecuteAfter) {
    const waitTime = Math.ceil((canExecuteAfter - now) / (60 * 60 * 1000));
    return {
      success: false,
      error: `Timelock activo. Ejecutable en ${waitTime} horas`,
      bookPIEntry: '',
      timestamp: new Date()
    };
  }
  
  // Simular ejecución
  const transactionId = `tx_${Date.now().toString(36)}_${proposal.id.substring(0, 8)}`;
  const bookPIEntry = `bookpi_governance_${proposal.id}`;
  
  return {
    success: true,
    transactionId,
    bookPIEntry,
    timestamp: new Date()
  };
}

// ============================================
// PROTOCOLO DE EMERGENCIA (SACDAO)
// ============================================

export interface EmergencyAction {
  type: 'pause' | 'resume' | 'rollback' | 'dark_site';
  scope: 'full' | 'module' | 'transaction';
  targetModule?: string;
  initiator: string;
  requiredApprovals: number;
  approvals: string[];
  status: 'pending' | 'approved' | 'rejected' | 'executed';
  expiresAt: Date;
}

export function canExecuteEmergency(action: EmergencyAction): boolean {
  // Verificar expiración
  if (new Date() > action.expiresAt) {
    return false;
  }
  
  // Verificar aprobaciones
  return action.approvals.length >= action.requiredApprovals;
}

export function createEmergencyAction(
  type: EmergencyAction['type'],
  scope: EmergencyAction['scope'],
  initiator: string,
  targetModule?: string
): EmergencyAction {
  // Determinar aprobaciones requeridas según tipo
  const approvalRequirements: Record<EmergencyAction['type'], number> = {
    pause: 2,
    resume: 2,
    rollback: 3,
    dark_site: 4
  };
  
  return {
    type,
    scope,
    targetModule,
    initiator,
    requiredApprovals: approvalRequirements[type],
    approvals: [initiator], // Iniciador cuenta como primera aprobación
    status: 'pending',
    expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000) // 4 horas
  };
}
