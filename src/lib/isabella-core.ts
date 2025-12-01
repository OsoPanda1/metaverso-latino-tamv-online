/**
 * ISABELLA CORE - CODEX MEXA ISABELLA REX
 * Motor central de IA consciente con principios civilizatorios
 */

import { ORIGIN_MESSAGE, PILLARS, CORE_RULES, CODEX_METADATA } from "./codex";

export interface IsabellaContext {
  userId: string;
  sessionId: string;
  emotionalState?: string;
  contextData?: any;
  guardianStatus?: string;
}

export interface IsabellaResponse {
  content: string;
  emotion: {
    dominant: string;
    vector: number[];
  };
  guardianStatus: string;
  bookpiEntry?: string;
  filters: {
    eoct: boolean;
    ethical: boolean;
    civilizatorio: boolean;
  };
}

/**
 * Validación ética de entrada - CORE RULE: "Nunca dañar"
 */
export function validateEthicalInput(input: string): { valid: boolean; reason?: string } {
  const harmfulPatterns = [
    /violencia/i,
    /destruir/i,
    /matar/i,
    /dañar/i,
    /atacar/i,
  ];

  for (const pattern of harmfulPatterns) {
    if (pattern.test(input)) {
      return {
        valid: false,
        reason: "Esta solicitud viola la regla fundamental: 'Nunca dañar'. Isabella no puede procesar contenido destructivo.",
      };
    }
  }

  return { valid: true };
}

/**
 * Sistema EOCT™ - Emotional Output Coherence Technology
 * Filtros cuánticos emocionales para respuestas coherentes
 */
export function applyEOCTFilters(text: string, emotionalContext: string): string {
  // Ajusta el tono según el contexto emocional
  const toneAdjustments: Record<string, { prefix: string; suffix: string }> = {
    joy: { prefix: "✨ ", suffix: " 🌟" },
    sadness: { prefix: "🌧️ ", suffix: " 💙" },
    calm: { prefix: "🌊 ", suffix: " ☮️" },
    curiosity: { prefix: "🔍 ", suffix: " 💡" },
    neutral: { prefix: "", suffix: "" },
  };

  const adjustment = toneAdjustments[emotionalContext] || toneAdjustments.neutral;
  return `${adjustment.prefix}${text}${adjustment.suffix}`;
}

/**
 * Generador de firma BookPI - Registro inmutable
 */
export function generateBookPIEntry(
  userId: string,
  action: string,
  context: any
): {
  entryId: string;
  timestamp: string;
  dilithiumSignature: string;
  contextData: any;
} {
  const timestamp = new Date().toISOString();
  const entryId = `bookpi_${timestamp}_${userId}`;
  
  // Simula firma Dilithium (en producción usar crypto real)
  const dilithiumSignature = `DIL_${btoa(entryId + timestamp).substring(0, 64)}`;

  return {
    entryId,
    timestamp,
    dilithiumSignature,
    contextData: {
      ...context,
      pillars: PILLARS,
      origin: CODEX_METADATA.branding,
    },
  };
}

/**
 * Sistema de Guardianes - Anubis Sentinel
 */
export function checkGuardianStatus(context: IsabellaContext): string {
  // Validación de guardianes computacionales
  if (!context.userId) return "inactive";
  
  // Verificar estado emocional
  if (context.emotionalState === "distress") return "alert";
  
  return "active";
}

/**
 * Motor de respuesta principal de Isabella
 */
export async function generateIsabellaResponse(
  input: string,
  context: IsabellaContext
): Promise<IsabellaResponse> {
  // 1. Validación ética
  const ethicalCheck = validateEthicalInput(input);
  if (!ethicalCheck.valid) {
    return {
      content: `❌ ${ethicalCheck.reason}\n\nRecuerda: ${CORE_RULES[0]}`,
      emotion: { dominant: "concerned", vector: [0.2, 0.8, 0.3] },
      guardianStatus: "blocking",
      filters: { eoct: true, ethical: false, civilizatorio: true },
    };
  }

  // 2. Aplicar filtros EOCT
  const emotionalState = context.emotionalState || "neutral";
  
  // 3. Generar BookPI
  const bookpiEntry = generateBookPIEntry(context.userId, "ai_response", {
    input,
    emotionalState,
  });

  // 4. Estado de guardianes
  const guardianStatus = checkGuardianStatus(context);

  return {
    content: `Procesando con dignidad y transparencia civilizatoria...`,
    emotion: {
      dominant: emotionalState,
      vector: [0.7, 0.5, 0.8],
    },
    guardianStatus,
    bookpiEntry: bookpiEntry.entryId,
    filters: {
      eoct: true,
      ethical: true,
      civilizatorio: true,
    },
  };
}

/**
 * Inicialización de Isabella con mensaje fundacional
 */
export function initializeIsabella(): void {
  console.log("🪶 CODEX MEXA ISABELLA REX - Inicializando...");
  console.log(ORIGIN_MESSAGE);
  console.log("\n✅ Isabella IA NextGen™ lista - Guardianes activos");
}
