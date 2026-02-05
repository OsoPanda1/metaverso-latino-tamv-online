 /**
  * TAMV MEMBERSHIP SYSTEM
  * Sistema de membresías con 8 niveles oficiales
  * 
  * Proyecto TAMV DreamWorld v2.0
  * Autor: Edwin Oswaldo Castillo Trejo (Anubis Villaseñor)
  */
 
 export interface TAMVMembership {
   id: string;
   name: string;
   tier: MembershipTier;
   monthlyPrice: number;
   yearlyPrice: number;
   features: MembershipFeature[];
   limits: MembershipLimits;
   badges: string[];
   colorTheme: string;
   icon: string;
   isPopular: boolean;
   discountPercent: number;
 }
 
 export type MembershipTier = 
   | 'free'
   | 'premium'
   | 'vip'
   | 'elite'
   | 'celestial'
   | 'gold'
   | 'gold_plus'
   | 'enterprise'
   | 'institutional'
   | 'custom';
 
 export interface MembershipFeature {
   id: string;
   name: string;
   description: string;
   icon: string;
   included: boolean;
   limit?: number | 'unlimited';
 }
 
 export interface MembershipLimits {
   dailyMessages: number | 'unlimited';
   monthlyCredits: number;
   storageGB: number;
   concurrentStreams: number;
   xrQuality: 'low' | 'medium' | 'high' | 'ultra' | '4k';
   apiCallsPerDay: number | 'unlimited';
   isabellaQueries: number | 'unlimited';
   dreamspacesAccess: number | 'all';
   groupsLimit: number | 'unlimited';
   channelsLimit: number | 'unlimited';
   withdrawalFeeDiscount: number;
   prioritySupport: boolean;
   customAvatar: boolean;
   nftMinting: boolean;
   voiceMinutes: number | 'unlimited';
   lotteryTickets: number;
 }
 
 // Catálogo de membresías
 export const MEMBERSHIP_CATALOG: TAMVMembership[] = [
   {
     id: 'mem-free',
     name: 'Free',
     tier: 'free',
     monthlyPrice: 0,
     yearlyPrice: 0,
     features: [
       { id: 'basic-access', name: 'Acceso Básico', description: 'Acceso a la plataforma', icon: '🌐', included: true },
       { id: 'public-groups', name: 'Grupos Públicos', description: 'Unirse a grupos públicos', icon: '👥', included: true, limit: 10 },
       { id: 'basic-chat', name: 'Chat Básico', description: 'Mensajes limitados', icon: '💬', included: true, limit: 50 }
     ],
     limits: {
       dailyMessages: 50,
       monthlyCredits: 100,
       storageGB: 1,
       concurrentStreams: 0,
       xrQuality: 'low',
       apiCallsPerDay: 100,
       isabellaQueries: 10,
       dreamspacesAccess: 2,
       groupsLimit: 10,
       channelsLimit: 5,
       withdrawalFeeDiscount: 0,
       prioritySupport: false,
       customAvatar: false,
       nftMinting: false,
       voiceMinutes: 30,
       lotteryTickets: 0
     },
     badges: ['🆓'],
     colorTheme: 'gray',
     icon: '⭐',
     isPopular: false,
     discountPercent: 0
   },
   {
     id: 'mem-premium',
     name: 'Premium',
     tier: 'premium',
     monthlyPrice: 9.99,
     yearlyPrice: 99.99,
     features: [
       { id: 'premium-access', name: 'Acceso Premium', description: 'Todas las funciones básicas +', icon: '💎', included: true },
       { id: 'unlimited-groups', name: 'Grupos Ilimitados', description: 'Crea y únete sin límites', icon: '👥', included: true, limit: 'unlimited' },
       { id: 'hd-streaming', name: 'Streaming HD', description: 'Ver y transmitir en HD', icon: '📺', included: true },
       { id: 'isabella-pro', name: 'Isabella Pro', description: 'Consultas ampliadas', icon: '🤖', included: true, limit: 100 }
     ],
     limits: {
       dailyMessages: 500,
       monthlyCredits: 500,
       storageGB: 10,
       concurrentStreams: 2,
       xrQuality: 'medium',
       apiCallsPerDay: 1000,
       isabellaQueries: 100,
       dreamspacesAccess: 5,
       groupsLimit: 'unlimited',
       channelsLimit: 20,
       withdrawalFeeDiscount: 10,
       prioritySupport: false,
       customAvatar: true,
       nftMinting: false,
       voiceMinutes: 300,
       lotteryTickets: 1
     },
     badges: ['💎', '⚡'],
     colorTheme: 'blue',
     icon: '💎',
     isPopular: true,
     discountPercent: 17
   },
   {
     id: 'mem-vip',
     name: 'VIP',
     tier: 'vip',
     monthlyPrice: 29.99,
     yearlyPrice: 299.99,
     features: [
       { id: 'vip-access', name: 'Acceso VIP', description: 'Privilegios exclusivos', icon: '👑', included: true },
       { id: 'zero-fees', name: 'Sin Comisiones', description: 'En transacciones básicas', icon: '💰', included: true },
       { id: '4k-xr', name: 'XR en Alta Calidad', description: 'DreamSpaces en calidad alta', icon: '🔮', included: true },
       { id: 'priority-queue', name: 'Cola Prioritaria', description: 'Procesamiento más rápido', icon: '⚡', included: true }
     ],
     limits: {
       dailyMessages: 2000,
       monthlyCredits: 1500,
       storageGB: 50,
       concurrentStreams: 5,
       xrQuality: 'high',
       apiCallsPerDay: 5000,
       isabellaQueries: 500,
       dreamspacesAccess: 'all',
       groupsLimit: 'unlimited',
       channelsLimit: 50,
       withdrawalFeeDiscount: 25,
       prioritySupport: true,
       customAvatar: true,
       nftMinting: true,
       voiceMinutes: 'unlimited',
       lotteryTickets: 3
     },
     badges: ['👑', '⭐', '💫'],
     colorTheme: 'purple',
     icon: '👑',
     isPopular: false,
     discountPercent: 17
   },
   {
     id: 'mem-elite',
     name: 'Elite',
     tier: 'elite',
     monthlyPrice: 99.99,
     yearlyPrice: 999.99,
     features: [
       { id: 'elite-access', name: 'Acceso Elite', description: 'El nivel más alto de acceso', icon: '🏆', included: true },
       { id: 'cashback', name: 'Cashback 5%', description: 'En todas las compras', icon: '💸', included: true },
       { id: 'exclusive-events', name: 'Eventos Exclusivos', description: 'Conciertos y experiencias VIP', icon: '🎭', included: true },
       { id: 'personal-manager', name: 'Manager Personal', description: 'Atención personalizada', icon: '👔', included: true }
     ],
     limits: {
       dailyMessages: 'unlimited',
       monthlyCredits: 5000,
       storageGB: 200,
       concurrentStreams: 10,
       xrQuality: 'ultra',
       apiCallsPerDay: 'unlimited',
       isabellaQueries: 'unlimited',
       dreamspacesAccess: 'all',
       groupsLimit: 'unlimited',
       channelsLimit: 'unlimited',
       withdrawalFeeDiscount: 50,
       prioritySupport: true,
       customAvatar: true,
       nftMinting: true,
       voiceMinutes: 'unlimited',
       lotteryTickets: 10
     },
     badges: ['🏆', '👑', '🌟', '💎'],
     colorTheme: 'gold',
     icon: '🏆',
     isPopular: false,
     discountPercent: 17
   },
   {
     id: 'mem-celestial',
     name: 'Celestial',
     tier: 'celestial',
     monthlyPrice: 499.99,
     yearlyPrice: 4999.99,
     features: [
       { id: 'celestial-access', name: 'Acceso Celestial', description: 'Poder absoluto en TAMV', icon: '✨', included: true },
       { id: 'founders-club', name: 'Club de Fundadores', description: 'Acceso al círculo interno', icon: '🎖️', included: true },
       { id: 'revenue-share', name: 'Participación en Ingresos', description: 'Comparte las ganancias', icon: '📈', included: true },
       { id: 'beta-features', name: 'Funciones Beta', description: 'Acceso anticipado a todo', icon: '🔬', included: true },
       { id: 'custom-dreamspace', name: 'DreamSpace Personalizado', description: 'Tu propio mundo virtual', icon: '🌌', included: true }
     ],
     limits: {
       dailyMessages: 'unlimited',
       monthlyCredits: 25000,
       storageGB: 1000,
       concurrentStreams: 'unlimited' as any,
       xrQuality: '4k',
       apiCallsPerDay: 'unlimited',
       isabellaQueries: 'unlimited',
       dreamspacesAccess: 'all',
       groupsLimit: 'unlimited',
       channelsLimit: 'unlimited',
       withdrawalFeeDiscount: 75,
       prioritySupport: true,
       customAvatar: true,
       nftMinting: true,
       voiceMinutes: 'unlimited',
       lotteryTickets: 50
     },
     badges: ['✨', '🌟', '🏆', '👑', '💎', '🎖️'],
     colorTheme: 'gradient-celestial',
     icon: '✨',
     isPopular: false,
     discountPercent: 17
   }
 ];
 
 // Motor de Membresías
 export class MembershipEngine {
   private memberships: Map<string, TAMVMembership> = new Map();
   private userMemberships: Map<string, { tier: MembershipTier; expiresAt: Date }> = new Map();
   
   constructor() {
     MEMBERSHIP_CATALOG.forEach(mem => {
       this.memberships.set(mem.id, mem);
     });
   }
   
   getMemberships(): TAMVMembership[] {
     return Array.from(this.memberships.values());
   }
   
   getMembershipById(id: string): TAMVMembership | undefined {
     return this.memberships.get(id);
   }
   
   getMembershipByTier(tier: MembershipTier): TAMVMembership | undefined {
     return Array.from(this.memberships.values()).find(m => m.tier === tier);
   }
   
   getUserMembership(userId: string): { tier: MembershipTier; expiresAt: Date } | undefined {
     return this.userMemberships.get(userId);
   }
   
   async subscribeMembership(
     userId: string, 
     tier: MembershipTier,
     durationMonths: number
   ): Promise<{ tier: MembershipTier; expiresAt: Date }> {
     const expiresAt = new Date();
     expiresAt.setMonth(expiresAt.getMonth() + durationMonths);
     
     const subscription = { tier, expiresAt };
     this.userMemberships.set(userId, subscription);
     
     return subscription;
   }
   
   checkFeatureAccess(userId: string, featureId: string): boolean {
     const userMem = this.userMemberships.get(userId);
     if (!userMem) return false;
     
     const membership = this.getMembershipByTier(userMem.tier);
     if (!membership) return false;
     
     const feature = membership.features.find(f => f.id === featureId);
     return feature?.included ?? false;
   }
   
   getLimit(userId: string, limitKey: keyof MembershipLimits): number | string | boolean {
     const userMem = this.userMemberships.get(userId);
     if (!userMem) {
       const freeMem = this.getMembershipByTier('free');
       const limit = freeMem?.limits[limitKey];
       return typeof limit === 'boolean' ? limit : (limit ?? 0);
     }
     
     const membership = this.getMembershipByTier(userMem.tier);
     const limit = membership?.limits[limitKey];
     return typeof limit === 'boolean' ? limit : (limit ?? 0);
   }
 }
 
 export const membershipEngine = new MembershipEngine();