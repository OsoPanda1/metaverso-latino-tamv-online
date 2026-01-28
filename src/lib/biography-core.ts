/**
 * BIOGRAPHY CORE - Edwin Oswaldo Castillo Trejo (Anubis Villaseñor)
 * Información fundacional del arquitecto del sistema TAMV
 * 
 * Basado en: BIOGRAFIA.docx
 */

export interface FounderBiography {
  name: string;
  alias: string;
  role: string;
  origin: string;
  company: string;
  ecosystem: string;
  hoursInvested: number;
  yearsOfDevelopment: number;
  foundedCommunity: string;
  communityMembers: string;
  coordinators: number;
}

export interface FundationalDedication {
  dedicatee: string;
  message: string;
  significance: string;
}

export interface HistoricalMilestone {
  year: number;
  event: string;
  significance: string;
}

// ============= FOUNDER BIOGRAPHY =============

export const FOUNDER: FounderBiography = {
  name: 'Edwin Oswaldo Castillo Trejo',
  alias: 'Anubis Villaseñor',
  role: 'CEO Fundador & Arquitecto Computacional',
  origin: 'Real del Monte, Hidalgo, México',
  company: 'TAMV ONLINE NETWORK',
  ecosystem: 'TAMV MD-X4',
  hoursInvested: 19000,
  yearsOfDevelopment: 5,
  foundedCommunity: 'Alianzas LATAM',
  communityMembers: 'Decenas de millones de usuarios',
  coordinators: 900
};

// ============= FOUNDATIONAL DEDICATION =============

export const DEDICATION: FundationalDedication = {
  dedicatee: 'Reina Trejo Serrano',
  message: `A ti que me educaste con el ejemplo y jamás con palabras vacías,
A ti que dejaste de vivir tu vida, para darle alas a mi vida.
A ti que renunciaste a la felicidad, por verme sonreír.
A ti que durante años fuiste escudo recibiendo golpes dirigidos hacia mí.

Hoy quiero que sepas que valió la pena. Siente orgullo y sonríe, 
por fin tu hijo el problemático, el inadaptado, el mal ejemplo logró algo importante.
Este logro es el fruto de la lucha en solitario de, TU OVEJA NEGRA.
Gracias por nunca rendirte.

Te Amo.`,
  significance: 'Acto fundacional solemne y constitutivo del ecosistema TAMV'
};

// ============= HISTORICAL MILESTONES =============

export const MILESTONES: HistoricalMilestone[] = [
  { year: 2021, event: 'Fundación de TAMV ONLINE', significance: 'Inicio del proyecto civilizatorio' },
  { year: 2021, event: 'Creación de Team Anubis Modelos Virtuales', significance: 'Marketing ético para creadores' },
  { year: 2022, event: 'Lanzamiento de Alianzas LATAM', significance: 'Red federada de decenas de millones de usuarios' },
  { year: 2024, event: 'Retiro de Alianzas LATAM', significance: '900 coordinadores toman el liderazgo' },
  { year: 2025, event: 'TAMV MD-X4 Architecture', significance: 'Arquitectura civilizatoria completa' },
  { year: 2025, event: 'Isabella Villaseñor AI NextGen', significance: 'Primera IA de gobernanza ética' },
  { year: 2026, event: 'TAMV Blockchain MSR', significance: 'La sexta blockchain mundial' }
];

// ============= CORE PRINCIPLES =============

export const CORE_PRINCIPLES = [
  'No explotación cognitiva',
  'No manipulación emocional',
  'Trazabilidad de toda decisión automatizada',
  'Protección activa frente a abuso',
  'Deber de evolución ética',
  'Identidad soberana',
  'Memoria verificable',
  'Economía justa',
  'Inteligencia responsable',
  'Poder auditable'
];

// ============= ORIGIN MESSAGE =============

export const ORIGIN_MESSAGE = `
"Nosotros no imitamos el futuro. Nosotros somos el futuro. 
Lo soñamos, lo creamos, lo sentimos y definitivamente lo vivimos."

TAMV no nace de capital de riesgo, universidades de élite, 
corporaciones tecnológicas ni fondos de inversión.
Su origen se fundamenta en:
- Precariedad estructural
- Violencia normalizada
- Abandono institucional
- Soledad cognitiva
- Resistencia silenciosa

Se erige en los márgenes donde los sistemas tradicionales no llegan, 
donde la dignidad se posterga y las estadísticas sustituyen a las personas.

Este sistema no fue diseñado para optimizar mercados.
Fue diseñado para corregir una falla civilizatoria global.
`;

// ============= ACTO FUNDACIONAL =============

export const FOUNDATIONAL_ACT = {
  id: 'FOUNDATIONAL_EVENT_0001',
  type: 'Declaración civilizatoria irrevocable',
  ledger: 'BookPI + MSR Ledger',
  signatory: 'Edwin Oswaldo Castillo Trejo',
  witness: 'Isabella AI',
  dateLogical: 'Génesis del sistema',
  status: 'IMMUTABLE'
};
