/**
 * DREAMWORLD ENGINE - Motor del Metaverso TAMV
 * Basado en: dreamspaces.docx
 * 
 * DreamWorld no es un metaverso; es un Ecosistema de Realidad Soberana persistente.
 * Stack técnico: WebGPU, Rapier.js (WASM), Yjs sobre WebRTC
 */

// ============= DREAMSPACE TYPES =============

export interface DreamSpace {
  id: number;
  name: string;
  role: string;
  economicLoop: string;
  restriction: string;
  icon: string;
  status: 'active' | 'beta' | 'coming-soon';
  users: number;
  revenueCredits: number;
  xrMode: '3D' | '4D' | 'VR' | 'AR' | 'Mixed';
}

export interface KAOSAudioConfig {
  spatialMode: '3D' | '4D';
  materiality: boolean;
  biometricAdaptive: boolean;
  frequencyRange: [number, number];
  reverbEngine: string;
}

export interface SovereignShader {
  name: string;
  type: 'PBR' | 'NPR' | 'Volumetric' | 'Holographic';
  features: string[];
  gpuOptimized: boolean;
}

export interface QuantumSyncProtocol {
  name: string;
  latencyMs: number;
  p2pEnabled: boolean;
  stateImmutable: boolean;
  encryption: string;
}

// ============= 8 DREAMSPACES (EIB MODULES) =============

export const DREAMSPACES: DreamSpace[] = [
  {
    id: 1,
    name: 'Neo-Tokio 2099',
    role: 'Hub Comercial',
    economicLoop: 'Subasta de Publicidad y Terrenos',
    restriction: 'Anti-Spam Publicitario',
    icon: '🌃',
    status: 'active',
    users: 45000,
    revenueCredits: 2500000,
    xrMode: '4D'
  },
  {
    id: 2,
    name: 'Abismo de Marte',
    role: 'Minería de Recursos',
    economicLoop: 'Licencias, Seguros y Energía',
    restriction: 'Límite de Fatiga (Anti-Grind)',
    icon: '🔴',
    status: 'active',
    users: 32000,
    revenueCredits: 1800000,
    xrMode: 'VR'
  },
  {
    id: 3,
    name: 'Sector Zero',
    role: 'Supervivencia Co-op',
    economicLoop: 'Suministros y Respawn',
    restriction: 'Anti-Griefing',
    icon: '☢️',
    status: 'active',
    users: 28000,
    revenueCredits: 1200000,
    xrMode: 'Mixed'
  },
  {
    id: 4,
    name: 'Santuario',
    role: 'Bienestar / Arte',
    economicLoop: 'Venta de Semillas NFT y Zonas VIP',
    restriction: 'Prohibido Gamificar Ansiedad',
    icon: '🌸',
    status: 'active',
    users: 67000,
    revenueCredits: 3400000,
    xrMode: '3D'
  },
  {
    id: 5,
    name: 'Estación Orbital',
    role: 'Meta-Comercio',
    economicLoop: 'Fuel-Coin, Hangares y Naves',
    restriction: 'Transparencia de Probabilidades',
    icon: '🛸',
    status: 'beta',
    users: 18000,
    revenueCredits: 950000,
    xrMode: '4D'
  },
  {
    id: 6,
    name: 'Trono de Obsidiana',
    role: 'Gobernanza',
    economicLoop: 'Costo de Mociones y Asientos VIP',
    restriction: 'Voto Inalienable (No se compra)',
    icon: '👑',
    status: 'active',
    users: 12000,
    revenueCredits: 600000,
    xrMode: '3D'
  },
  {
    id: 7,
    name: 'Auditorio 4D',
    role: 'Cultura',
    economicLoop: 'Tickets Coleccionables y Merch',
    restriction: 'Límite de Gasto Compulsivo',
    icon: '🎭',
    status: 'active',
    users: 89000,
    revenueCredits: 4200000,
    xrMode: '4D'
  },
  {
    id: 8,
    name: 'Neo-Coliseo',
    role: 'Honor y Ranking',
    economicLoop: 'Skins, Patrocinios y Apuestas',
    restriction: 'Anti-Cheat Hard-Coded',
    icon: '⚔️',
    status: 'active',
    users: 52000,
    revenueCredits: 2800000,
    xrMode: 'VR'
  }
];

// ============= KAOS AUDIO ENGINE =============

export const KAOS_AUDIO_CONFIG: KAOSAudioConfig = {
  spatialMode: '4D',
  materiality: true,
  biometricAdaptive: true,
  frequencyRange: [8, 12], // Hz - Alpha waves for stress reduction
  reverbEngine: 'Convolution + Ray-traced'
};

// ============= SOVEREIGN SHADERS =============

export const SOVEREIGN_SHADERS: SovereignShader[] = [
  {
    name: 'PBR Sovereign',
    type: 'PBR',
    features: ['SSR Dynamic Reflections', 'Global Illumination', 'Subsurface Scattering', 'Parallax Occlusion'],
    gpuOptimized: true
  },
  {
    name: 'Holographic Aurora',
    type: 'Holographic',
    features: ['Chromatic Aberration', 'Fresnel Effect', 'Noise Distortion', 'Scanlines'],
    gpuOptimized: true
  },
  {
    name: 'Volumetric Nebula',
    type: 'Volumetric',
    features: ['Ray Marching', 'Density Fields', 'Light Scattering', 'Color Gradients'],
    gpuOptimized: false
  }
];

// ============= QUANTUM SYNC PROTOCOL =============

export const QUANTUM_SYNC: QuantumSyncProtocol = {
  name: 'Omega Protocol',
  latencyMs: 15,
  p2pEnabled: true,
  stateImmutable: true,
  encryption: 'CRYSTALS-Kyber + AES-256-GCM'
};

// ============= DREAMWORLD ORCHESTRATOR =============

export class DreamWorldOrchestrator {
  private dreamspaces: DreamSpace[] = DREAMSPACES;
  
  getTotalUsers(): number {
    return this.dreamspaces.reduce((sum, ds) => sum + ds.users, 0);
  }
  
  getTotalRevenue(): number {
    return this.dreamspaces.reduce((sum, ds) => sum + ds.revenueCredits, 0);
  }
  
  getActiveSpaces(): DreamSpace[] {
    return this.dreamspaces.filter(ds => ds.status === 'active');
  }
  
  getDreamSpaces(): DreamSpace[] {
    return this.dreamspaces;
  }
  
  getXRModes(): string[] {
    return [...new Set(this.dreamspaces.map(ds => ds.xrMode))];
  }
}

export const dreamWorldOrchestrator = new DreamWorldOrchestrator();
