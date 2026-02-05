 import { motion } from 'framer-motion';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Badge } from '@/components/ui/badge';
 import { Button } from '@/components/ui/button';
 import { Check, Star, Crown, Sparkles, Zap, Shield } from 'lucide-react';
 import { MEMBERSHIP_CATALOG, type TAMVMembership } from '@/lib/tamv-membership';
 
 export const MembershipShowcase = () => {
   const displayMemberships = MEMBERSHIP_CATALOG.slice(0, 5); // Free to Celestial
   
   return (
     <div className="space-y-8">
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="text-center"
       >
         <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-yellow-500 to-secondary bg-clip-text text-transparent mb-4">
           Membresías TAMV
         </h2>
         <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
           Elige el nivel que impulse tu experiencia en el ecosistema más avanzado del mundo digital.
         </p>
       </motion.div>
 
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
         {displayMemberships.map((membership, index) => (
           <MembershipCard 
             key={membership.id} 
             membership={membership} 
             index={index} 
           />
         ))}
       </div>
 
       {/* Enterprise CTA */}
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.5 }}
       >
         <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 border-primary/30">
           <CardContent className="p-8 text-center">
             <Shield className="w-12 h-12 mx-auto mb-4 text-primary" />
             <h3 className="text-2xl font-bold mb-2">Enterprise & Institucional</h3>
             <p className="text-muted-foreground mb-4">
               Soluciones personalizadas para empresas, instituciones educativas y organizaciones gubernamentales.
             </p>
             <Button size="lg" variant="outline">
               Contactar Ventas
             </Button>
           </CardContent>
         </Card>
       </motion.div>
     </div>
   );
 };
 
 const MembershipCard = ({ 
   membership, 
   index 
 }: { 
   membership: TAMVMembership; 
   index: number;
 }) => {
   const tierIcons: Record<string, React.ElementType> = {
     free: Star,
     premium: Zap,
     vip: Crown,
     elite: Crown,
     celestial: Sparkles
   };
   
   const TierIcon = tierIcons[membership.tier] || Star;
   
   const tierColors: Record<string, string> = {
     free: 'from-gray-500/10 to-transparent border-gray-500/20',
     premium: 'from-blue-500/10 to-transparent border-blue-500/30',
     vip: 'from-purple-500/10 to-transparent border-purple-500/30',
     elite: 'from-yellow-500/10 to-transparent border-yellow-500/30',
     celestial: 'from-pink-500/10 via-purple-500/10 to-cyan-500/10 border-pink-500/30'
   };
 
   return (
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ delay: index * 0.1 }}
       className="h-full"
     >
       <Card className={`h-full relative overflow-hidden bg-gradient-to-b ${tierColors[membership.tier]} hover:scale-105 transition-all duration-300`}>
         {membership.isPopular && (
           <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-bl-lg font-medium">
             POPULAR
           </div>
         )}
         
         <CardHeader className="text-center pb-2">
           <TierIcon className="w-10 h-10 mx-auto mb-2 text-primary" />
           <CardTitle className="text-xl">{membership.name}</CardTitle>
           <div className="flex justify-center gap-1 mt-2">
             {membership.badges.slice(0, 3).map((badge, i) => (
               <span key={i} className="text-lg">{badge}</span>
             ))}
           </div>
         </CardHeader>
         
         <CardContent className="text-center">
           <div className="mb-4">
             <span className="text-3xl font-bold">${membership.monthlyPrice}</span>
             <span className="text-muted-foreground">/mes</span>
           </div>
           
           {membership.discountPercent > 0 && (
             <Badge variant="secondary" className="mb-4">
               Ahorra {membership.discountPercent}% anual
             </Badge>
           )}
           
           <ul className="text-left space-y-2 mb-6">
             {membership.features.slice(0, 4).map((feature) => (
               <li key={feature.id} className="flex items-start gap-2 text-sm">
                 <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                 <span className="text-muted-foreground">{feature.name}</span>
               </li>
             ))}
           </ul>
           
           <Button 
             className="w-full" 
             variant={membership.isPopular ? "default" : "outline"}
           >
             {membership.tier === 'free' ? 'Comenzar Gratis' : 'Suscribirse'}
           </Button>
         </CardContent>
       </Card>
     </motion.div>
   );
 };
 
 export default MembershipShowcase;