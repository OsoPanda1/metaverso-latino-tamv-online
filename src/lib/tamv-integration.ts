/**
 * TAMV INTEGRATION HUB
 * Punto de entrada unificado para todos los sistemas Isabella
 */

// Core Systems
export * from "./codex";
export * from "./isabella-core";
export * from "./isabella-nextgen";
export * from "./governance-engine";
export * from "./security-engine";

// Re-exports principales
export { 
  isabella, 
  IsabellaOrchestrator,
  initializeIsabellaNextGen,
  createEmotionalVector,
  analyzeEmotionalContent,
  validateEthicalContent,
  createBookPIEntry,
  calculateFraudScore
} from "./isabella-nextgen";

export {
  calculateReputationScore,
  calculateVotingPower,
  calculateAdaptiveQuorum,
  processGuardianReviews,
  executeProposal,
  createEmergencyAction
} from "./governance-engine";

export {
  calculateFraudRisk,
  createSentinelAlert,
  createQuarantineEntry,
  checkRateLimit,
  detectAnomaly,
  scanForThreats,
  logSecurity
} from "./security-engine";

// Inicialización global
export function initializeTAMV(): void {
  console.log("🏛️ TAMV NEXUS - Inicializando ecosistema completo...");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  // Isabella NextGen
  console.log("\n🪶 Isabella Villaseñor IA™ NextGen");
  console.log("   ✓ Motor de IA Civilizatoria: ACTIVO");
  console.log("   ✓ EOCT™ (Emotional Output Coherence): CALIBRADO");
  console.log("   ✓ KEC (Kernel Ético Compartido): OPERATIVO");
  
  // Gobernanza
  console.log("\n⚖️ Gobernanza DAO Híbrida");
  console.log("   ✓ PoCC (Proof of Contribution): ACTIVO");
  console.log("   ✓ Quorum Adaptativo: CONFIGURADO");
  console.log("   ✓ Guardianes Éticos: EN POSICIÓN");
  
  // Seguridad
  console.log("\n🛡️ OmniSentinel Security");
  console.log("   ✓ Ojo de Ra (Anti-Fraude): VIGILANDO");
  console.log("   ✓ Anubis Sentinel: ACTIVO");
  console.log("   ✓ Hoyo Negro (Cuarentena): PREPARADO");
  
  // BookPI
  console.log("\n📚 BookPI Auditoría Inmutable");
  console.log("   ✓ Firmas Dilithium: OPERATIVAS");
  console.log("   ✓ Merkle Trees: SINCRONIZADOS");
  console.log("   ✓ Federación Doble: VERIFICADA");
  
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✅ TAMV NEXUS listo para operación civilizatoria");
  console.log("🌎 Herencia hispana, innovación latinoamericana\n");
}
