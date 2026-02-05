 /**
  * TAMV WALLET ENGINE - Motor Económico Digital
  * Sistema financiero con TAMV Créditos, Blockchain MSR, y FairSplit
  * 
  * Proyecto TAMV DreamWorld v2.0
  * Autor: Edwin Oswaldo Castillo Trejo (Anubis Villaseñor)
  */
 
 export interface TAMVWallet {
   id: string;
   userId: string;
   balance: WalletBalance;
   tier: WalletTier;
   createdAt: Date;
   lastTransaction: Date;
   isVerified: boolean;
   kycLevel: KYCLevel;
   securityScore: number;
   msrAddress?: string;
   linkedPaymentMethods: PaymentMethod[];
 }
 
 export interface WalletBalance {
   credits: number;           // TAMV Credits ($0.20 venta / $0.15 recompra)
   tamvTokens: number;        // TAMV-T tokens
   msrBalance: number;        // MSR Blockchain balance
   lockedAmount: number;      // Fondos bloqueados (escrow, stakes)
   pendingWithdrawal: number; // Retiros pendientes
   royaltiesEarned: number;   // Regalías acumuladas
 }
 
 export type WalletTier = 
   | 'basic'        // Free - límites básicos
   | 'premium'      // $9.99/mes - límites aumentados
   | 'vip'          // $29.99/mes - sin comisiones
   | 'elite'        // $99.99/mes - cashback 5%
   | 'celestial'    // $499.99/mes - acceso total
   | 'enterprise';  // Custom - B2B
 
 export type KYCLevel = 'none' | 'basic' | 'enhanced' | 'full' | 'institutional';
 
 export interface PaymentMethod {
   id: string;
   type: 'card' | 'bank' | 'crypto' | 'paypal' | 'msr_wallet';
   provider: string;
   last4?: string;
   expiryDate?: string;
   isDefault: boolean;
   isVerified: boolean;
 }
 
 export interface WalletTransaction {
   id: string;
   walletId: string;
   type: TransactionType;
   amount: number;
   currency: 'credits' | 'tamv_tokens' | 'msr' | 'usd';
   status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
   timestamp: Date;
   description: string;
   metadata?: Record<string, unknown>;
   fee: number;
   netAmount: number;
   blockchainTxHash?: string;
   bookpiEntryId?: string;
 }
 
 export type TransactionType = 
   | 'deposit' 
   | 'withdrawal'
   | 'gift_sent'
   | 'gift_received'
   | 'purchase'
   | 'sale'
   | 'royalty'
   | 'subscription'
   | 'tip'
   | 'lottery_win'
   | 'referral_bonus'
   | 'creator_payout'
   | 'auction_bid'
   | 'auction_win';
 
 // Configuración de comisiones
 export const FEE_STRUCTURE = {
   deposit: 0,                    // Sin comisión de depósito
   withdrawal: 0.025,             // 2.5% retiro
   withdrawal_min: 1.00,          // Mínimo $1 de comisión
   gift_commission: 0.12,         // 12% en regalos
   marketplace_commission: 0.15,  // 15% marketplace
   premium_commission: 0.20,      // 20% contenido premium
   course_commission: 0.25,       // 25% cursos
   creator_share: 0.70,           // 70% para creadores (FairSplit)
   platform_share: 0.30,          // 30% plataforma
   royalty_cap: 0.15,             // 15% máximo royalties NFT
   phoenix_fund: 0.05,            // 5% al Fondo Fénix
 };
 
 // Límites por tier
 export const TIER_LIMITS: Record<WalletTier, {
   dailyWithdrawal: number;
   monthlyWithdrawal: number;
   singleTransaction: number;
   feeDiscount: number;
 }> = {
   basic: { dailyWithdrawal: 100, monthlyWithdrawal: 1000, singleTransaction: 50, feeDiscount: 0 },
   premium: { dailyWithdrawal: 500, monthlyWithdrawal: 5000, singleTransaction: 200, feeDiscount: 0.1 },
   vip: { dailyWithdrawal: 2000, monthlyWithdrawal: 20000, singleTransaction: 1000, feeDiscount: 0.25 },
   elite: { dailyWithdrawal: 10000, monthlyWithdrawal: 100000, singleTransaction: 5000, feeDiscount: 0.5 },
   celestial: { dailyWithdrawal: 50000, monthlyWithdrawal: 500000, singleTransaction: 25000, feeDiscount: 0.75 },
   enterprise: { dailyWithdrawal: Infinity, monthlyWithdrawal: Infinity, singleTransaction: Infinity, feeDiscount: 1.0 }
 };
 
 // Motor de Wallet
 export class WalletEngine {
   private wallets: Map<string, TAMVWallet> = new Map();
   private transactions: WalletTransaction[] = [];
   
   createWallet(userId: string): TAMVWallet {
     const wallet: TAMVWallet = {
       id: `wallet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
       userId,
       balance: {
         credits: 0,
         tamvTokens: 0,
         msrBalance: 0,
         lockedAmount: 0,
         pendingWithdrawal: 0,
         royaltiesEarned: 0
       },
       tier: 'basic',
       createdAt: new Date(),
       lastTransaction: new Date(),
       isVerified: false,
       kycLevel: 'none',
       securityScore: 50,
       linkedPaymentMethods: []
     };
     
     this.wallets.set(wallet.id, wallet);
     return wallet;
   }
   
   getWallet(walletId: string): TAMVWallet | undefined {
     return this.wallets.get(walletId);
   }
   
   getWalletByUserId(userId: string): TAMVWallet | undefined {
     return Array.from(this.wallets.values()).find(w => w.userId === userId);
   }
   
   async deposit(
     walletId: string, 
     amount: number, 
     paymentMethodId: string
   ): Promise<WalletTransaction> {
     const wallet = this.wallets.get(walletId);
     if (!wallet) throw new Error('Wallet not found');
     
     const transaction: WalletTransaction = {
       id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
       walletId,
       type: 'deposit',
       amount,
       currency: 'credits',
       status: 'pending',
       timestamp: new Date(),
       description: `Depósito de ${amount} créditos`,
       fee: 0,
       netAmount: amount
     };
     
     this.transactions.push(transaction);
     
     // Simular procesamiento
     setTimeout(() => {
       transaction.status = 'completed';
       wallet.balance.credits += amount;
       wallet.lastTransaction = new Date();
     }, 1000);
     
     return transaction;
   }
   
   async withdraw(
     walletId: string, 
     amount: number,
     destination: string
   ): Promise<WalletTransaction> {
     const wallet = this.wallets.get(walletId);
     if (!wallet) throw new Error('Wallet not found');
     if (wallet.balance.credits < amount) throw new Error('Insufficient balance');
     
     const tierLimits = TIER_LIMITS[wallet.tier];
     if (amount > tierLimits.singleTransaction) {
       throw new Error(`Transaction exceeds tier limit: ${tierLimits.singleTransaction}`);
     }
     
     const baseFee = amount * FEE_STRUCTURE.withdrawal;
     const feeDiscount = tierLimits.feeDiscount;
     const actualFee = Math.max(baseFee * (1 - feeDiscount), FEE_STRUCTURE.withdrawal_min);
     
     const transaction: WalletTransaction = {
       id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
       walletId,
       type: 'withdrawal',
       amount,
       currency: 'credits',
       status: 'pending',
       timestamp: new Date(),
       description: `Retiro de ${amount} créditos`,
       fee: actualFee,
       netAmount: amount - actualFee
     };
     
     wallet.balance.credits -= amount;
     wallet.balance.pendingWithdrawal += amount - actualFee;
     this.transactions.push(transaction);
     
     return transaction;
   }
   
   calculateFairSplit(amount: number, transactionType: TransactionType): {
     creatorAmount: number;
     platformAmount: number;
     phoenixFundAmount: number;
     totalFees: number;
   } {
     let commission = FEE_STRUCTURE.gift_commission;
     
     switch (transactionType) {
       case 'gift_sent':
       case 'gift_received':
         commission = FEE_STRUCTURE.gift_commission;
         break;
       case 'purchase':
       case 'sale':
         commission = FEE_STRUCTURE.marketplace_commission;
         break;
       case 'subscription':
         commission = FEE_STRUCTURE.premium_commission;
         break;
       default:
         commission = FEE_STRUCTURE.marketplace_commission;
     }
     
     const totalFees = amount * commission;
     const creatorAmount = amount * FEE_STRUCTURE.creator_share;
     const platformGross = amount * FEE_STRUCTURE.platform_share;
     const phoenixFundAmount = platformGross * FEE_STRUCTURE.phoenix_fund;
     const platformAmount = platformGross - phoenixFundAmount;
     
     return {
       creatorAmount,
       platformAmount,
       phoenixFundAmount,
       totalFees
     };
   }
   
   getTransactionHistory(walletId: string): WalletTransaction[] {
     return this.transactions.filter(tx => tx.walletId === walletId);
   }
   
   getWalletStats(walletId: string): {
     totalDeposits: number;
     totalWithdrawals: number;
     totalEarnings: number;
     totalSpent: number;
   } {
     const history = this.getTransactionHistory(walletId);
     
     return {
       totalDeposits: history
         .filter(tx => tx.type === 'deposit' && tx.status === 'completed')
         .reduce((sum, tx) => sum + tx.amount, 0),
       totalWithdrawals: history
         .filter(tx => tx.type === 'withdrawal' && tx.status === 'completed')
         .reduce((sum, tx) => sum + tx.netAmount, 0),
       totalEarnings: history
         .filter(tx => ['gift_received', 'royalty', 'creator_payout', 'lottery_win', 'referral_bonus'].includes(tx.type))
         .reduce((sum, tx) => sum + tx.netAmount, 0),
       totalSpent: history
         .filter(tx => ['gift_sent', 'purchase', 'subscription', 'tip', 'auction_bid'].includes(tx.type))
         .reduce((sum, tx) => sum + tx.amount, 0)
     };
   }
 }
 
 export const walletEngine = new WalletEngine();