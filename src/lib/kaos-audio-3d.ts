 /**
  * KAOS AUDIO 3D™ - Motor de Audio Espacial Emocional
  * Sistema de audio inmersivo para DreamSpaces y XR
  * 
  * Proyecto TAMV DreamWorld v2.0
  * Autor: Edwin Oswaldo Castillo Trejo (Anubis Villaseñor)
  */
 
 export interface AudioSource3D {
   id: string;
   type: 'ambient' | 'positional' | 'emotional' | 'binaural' | 'haptic';
   position: { x: number; y: number; z: number };
   rotation: { x: number; y: number; z: number };
   volume: number;
   pitch: number;
   reverb: number;
   spatialBlend: number;
   emotionalVector: EmotionalAudioVector;
   url?: string;
   loop: boolean;
   autoPlay: boolean;
 }
 
 export interface EmotionalAudioVector {
   energy: number;     // 0-1: calm to energetic
   valence: number;    // 0-1: sad to happy
   depth: number;      // 0-1: shallow to profound
   tension: number;    // 0-1: relaxed to tense
   warmth: number;     // 0-1: cold to warm
 }
 
 export interface SpatialAudioConfig {
   enableHRTF: boolean;           // Head-Related Transfer Function
   enableDoppler: boolean;        // Doppler effect
   enableOcclusion: boolean;      // Wall occlusion
   enableReverbZones: boolean;    // Environmental reverb
   maxDistance: number;           // Maximum audible distance
   rolloffMode: 'linear' | 'logarithmic' | 'custom';
   listenerPosition: { x: number; y: number; z: number };
 }
 
 export interface ReverbZone {
   id: string;
   name: string;
   position: { x: number; y: number; z: number };
   size: { width: number; height: number; depth: number };
   preset: ReverbPreset;
   intensity: number;
 }
 
 export type ReverbPreset = 
   | 'cathedral' 
   | 'cave' 
   | 'underwater' 
   | 'forest' 
   | 'desert' 
   | 'space' 
   | 'dreamspace'
   | 'quantum_void';
 
 export interface AudioEmotionalFilter {
   name: string;
   lowPassFreq: number;
   highPassFreq: number;
   reverbMix: number;
   chorusMix: number;
   pitchShift: number;
   emotionalTarget: EmotionalAudioVector;
 }
 
 // Presets de audio emocional
 export const EMOTIONAL_AUDIO_PRESETS: Record<string, AudioEmotionalFilter> = {
   serene: {
     name: 'Serenidad',
     lowPassFreq: 8000,
     highPassFreq: 100,
     reverbMix: 0.6,
     chorusMix: 0.2,
     pitchShift: 0,
     emotionalTarget: { energy: 0.2, valence: 0.7, depth: 0.8, tension: 0.1, warmth: 0.8 }
   },
   euphoric: {
     name: 'Euforia',
     lowPassFreq: 16000,
     highPassFreq: 200,
     reverbMix: 0.3,
     chorusMix: 0.4,
     pitchShift: 0.5,
     emotionalTarget: { energy: 1.0, valence: 1.0, depth: 0.5, tension: 0.6, warmth: 0.9 }
   },
   mystical: {
     name: 'Místico',
     lowPassFreq: 6000,
     highPassFreq: 80,
     reverbMix: 0.9,
     chorusMix: 0.6,
     pitchShift: -0.3,
     emotionalTarget: { energy: 0.4, valence: 0.6, depth: 1.0, tension: 0.3, warmth: 0.5 }
   },
   cosmic: {
     name: 'Cósmico',
     lowPassFreq: 4000,
     highPassFreq: 60,
     reverbMix: 1.0,
     chorusMix: 0.8,
     pitchShift: -1.0,
     emotionalTarget: { energy: 0.3, valence: 0.5, depth: 1.0, tension: 0.2, warmth: 0.3 }
   },
   aztec_ritual: {
     name: 'Ritual Azteca',
     lowPassFreq: 10000,
     highPassFreq: 150,
     reverbMix: 0.7,
     chorusMix: 0.3,
     pitchShift: 0.2,
     emotionalTarget: { energy: 0.7, valence: 0.6, depth: 0.9, tension: 0.5, warmth: 0.7 }
   }
 };
 
 // Motor de Audio KAOS 3D
 export class KaosAudio3DEngine {
   private sources: Map<string, AudioSource3D> = new Map();
   private reverbZones: Map<string, ReverbZone> = new Map();
   private config: SpatialAudioConfig;
   private currentEmotionalState: EmotionalAudioVector;
   private audioContext: AudioContext | null = null;
 
   constructor(config?: Partial<SpatialAudioConfig>) {
     this.config = {
       enableHRTF: true,
       enableDoppler: true,
       enableOcclusion: true,
       enableReverbZones: true,
       maxDistance: 100,
       rolloffMode: 'logarithmic',
       listenerPosition: { x: 0, y: 0, z: 0 },
       ...config
     };
     
     this.currentEmotionalState = {
       energy: 0.5,
       valence: 0.5,
       depth: 0.5,
       tension: 0.3,
       warmth: 0.6
     };
   }
 
   async initialize(): Promise<void> {
     if (typeof window !== 'undefined') {
       this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
     }
     console.log('🎵 KAOS Audio 3D™ initialized');
   }
 
   addSource(source: AudioSource3D): void {
     this.sources.set(source.id, source);
   }
 
   removeSource(id: string): void {
     this.sources.delete(id);
   }
 
   getSource(id: string): AudioSource3D | undefined {
     return this.sources.get(id);
   }
 
   updateListenerPosition(position: { x: number; y: number; z: number }): void {
     this.config.listenerPosition = position;
     this.recalculateSpatialAudio();
   }
 
   private recalculateSpatialAudio(): void {
     this.sources.forEach(source => {
       const distance = this.calculateDistance(
         this.config.listenerPosition,
         source.position
       );
       
       // Aplicar atenuación por distancia
       const attenuation = this.calculateAttenuation(distance);
       source.volume = Math.max(0, source.volume * attenuation);
     });
   }
 
   private calculateDistance(
     a: { x: number; y: number; z: number },
     b: { x: number; y: number; z: number }
   ): number {
     return Math.sqrt(
       Math.pow(b.x - a.x, 2) +
       Math.pow(b.y - a.y, 2) +
       Math.pow(b.z - a.z, 2)
     );
   }
 
   private calculateAttenuation(distance: number): number {
     if (distance >= this.config.maxDistance) return 0;
     
     switch (this.config.rolloffMode) {
       case 'linear':
         return 1 - (distance / this.config.maxDistance);
       case 'logarithmic':
         return 1 / (1 + distance * 0.1);
       default:
         return 1 - (distance / this.config.maxDistance);
     }
   }
 
   setEmotionalState(state: Partial<EmotionalAudioVector>): void {
     this.currentEmotionalState = { ...this.currentEmotionalState, ...state };
     this.applyEmotionalFiltering();
   }
 
   private applyEmotionalFiltering(): void {
     // Encontrar el preset más cercano al estado emocional actual
     let bestMatch = 'serene';
     let bestScore = Infinity;
     
     Object.entries(EMOTIONAL_AUDIO_PRESETS).forEach(([key, preset]) => {
       const score = this.calculateEmotionalDistance(
         this.currentEmotionalState,
         preset.emotionalTarget
       );
       if (score < bestScore) {
         bestScore = score;
         bestMatch = key;
       }
     });
     
     console.log(`🎵 Emotional audio filter: ${bestMatch}`);
   }
 
   private calculateEmotionalDistance(
     a: EmotionalAudioVector,
     b: EmotionalAudioVector
   ): number {
     return (
       Math.pow(a.energy - b.energy, 2) +
       Math.pow(a.valence - b.valence, 2) +
       Math.pow(a.depth - b.depth, 2) +
       Math.pow(a.tension - b.tension, 2) +
       Math.pow(a.warmth - b.warmth, 2)
     );
   }
 
   addReverbZone(zone: ReverbZone): void {
     this.reverbZones.set(zone.id, zone);
   }
 
   getActiveReverbZone(): ReverbZone | undefined {
     const listenerPos = this.config.listenerPosition;
     
     for (const zone of this.reverbZones.values()) {
       if (this.isInsideZone(listenerPos, zone)) {
         return zone;
       }
     }
     return undefined;
   }
 
   private isInsideZone(
     pos: { x: number; y: number; z: number },
     zone: ReverbZone
   ): boolean {
     return (
       pos.x >= zone.position.x - zone.size.width / 2 &&
       pos.x <= zone.position.x + zone.size.width / 2 &&
       pos.y >= zone.position.y - zone.size.height / 2 &&
       pos.y <= zone.position.y + zone.size.height / 2 &&
       pos.z >= zone.position.z - zone.size.depth / 2 &&
       pos.z <= zone.position.z + zone.size.depth / 2
     );
   }
 
   getStats(): { sources: number; reverbZones: number; emotionalState: EmotionalAudioVector } {
     return {
       sources: this.sources.size,
       reverbZones: this.reverbZones.size,
       emotionalState: this.currentEmotionalState
     };
   }
 }
 
 export const kaosAudio3D = new KaosAudio3DEngine();