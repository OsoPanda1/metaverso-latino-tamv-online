 import { motion } from 'framer-motion';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Badge } from '@/components/ui/badge';
 import { Button } from '@/components/ui/button';
 import { Gift, Sparkles, Zap, Crown, Star, Heart } from 'lucide-react';
 import { DEFAULT_CGIFTS_CATALOG, type CGiftItem } from '@/lib/cgifts-engine';
 
 const rarityColors: Record<string, string> = {
   common: 'from-gray-400 to-gray-500 border-gray-400/30',
   rare: 'from-blue-400 to-blue-600 border-blue-400/30',
   epic: 'from-purple-400 to-purple-600 border-purple-400/30',
   legendary: 'from-yellow-400 to-orange-500 border-yellow-400/30',
   mythic: 'from-pink-400 to-purple-500 border-pink-400/30',
   celestial: 'from-cyan-300 via-purple-400 to-pink-500 border-cyan-300/30'
 };
 
 const rarityLabels: Record<string, string> = {
   common: 'Común',
   rare: 'Raro',
   epic: 'Épico',
   legendary: 'Legendario',
   mythic: 'Mítico',
   celestial: 'Celestial'
 };
 
 export const GiftsShowcase = () => {
   return (
     <div className="space-y-8">
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="text-center"
       >
         <div className="flex items-center justify-center gap-3 mb-4">
           <Gift className="w-10 h-10 text-primary" />
           <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
             CGIFTS 3D/XR
           </h2>
         </div>
         <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
           Regalos virtuales inmersivos con efectos 3D, feedback háptico, 
           y certificación blockchain MSR.
         </p>
       </motion.div>
 
       {/* Gift Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {DEFAULT_CGIFTS_CATALOG.map((gift, index) => (
           <motion.div
             key={gift.id}
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: index * 0.1 }}
           >
             <GiftCard gift={gift} />
           </motion.div>
         ))}
       </div>
 
       {/* Create Custom Gift CTA */}
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.5 }}
       >
         <Card className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10 border-primary/30">
           <CardContent className="p-8 text-center">
             <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
             <h3 className="text-2xl font-bold mb-2">Crea tu Propio Regalo NFT</h3>
             <p className="text-muted-foreground mb-4">
               Diseña regalos únicos, véndelos en el marketplace y gana royalties de por vida.
             </p>
             <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-500">
               <Sparkles className="w-4 h-4 mr-2" />
               Crear Regalo
             </Button>
           </CardContent>
         </Card>
       </motion.div>
     </div>
   );
 };
 
 const GiftCard = ({ gift }: { gift: CGiftItem }) => {
   const colorClass = rarityColors[gift.rarity] || rarityColors.common;
   
   return (
     <Card className={`relative overflow-hidden group hover:scale-105 transition-all duration-300 bg-gradient-to-b ${colorClass}`}>
       {/* Glow effect */}
       <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
       
       {/* NFT Badge */}
       {gift.isNFT && (
         <Badge className="absolute top-3 right-3 bg-purple-500 z-10">
           NFT
         </Badge>
       )}
       
       {/* Limited Edition */}
       {gift.limitedEdition && (
         <Badge className="absolute top-3 left-3 bg-yellow-500 z-10">
           #{gift.limitedEdition} Ed.
         </Badge>
       )}
       
       <CardHeader className="relative z-10 text-center pb-2">
         {/* Gift Icon/Animation placeholder */}
         <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center mb-4 group-hover:animate-pulse">
           <Gift className="w-12 h-12 text-white" />
         </div>
         <CardTitle className="text-lg text-white">{gift.name}</CardTitle>
         <Badge variant="outline" className="mx-auto bg-background/20 text-white border-white/30">
           {rarityLabels[gift.rarity]}
         </Badge>
       </CardHeader>
       
       <CardContent className="relative z-10 text-center">
         {/* Emotional Vector Preview */}
         <div className="flex justify-center gap-2 mb-4">
           {gift.emotionalVector.love > 0.7 && <Heart className="w-4 h-4 text-pink-300" />}
           {gift.emotionalVector.joy > 0.7 && <Star className="w-4 h-4 text-yellow-300" />}
           {gift.emotionalVector.excitement > 0.7 && <Zap className="w-4 h-4 text-orange-300" />}
         </div>
         
         {/* Effect Info */}
         <div className="text-xs text-white/70 mb-4 space-y-1">
           <div>✨ {gift.effect3D.particleCount.toLocaleString()} partículas</div>
           <div>⏱️ {(gift.effect3D.duration / 1000).toFixed(1)}s duración</div>
           {gift.effect3D.xrEnhanced && <div>🔮 XR Enhanced</div>}
         </div>
         
         {/* Price */}
         <div className="text-2xl font-bold text-white mb-3">
           {gift.price} créditos
         </div>
         
         <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30" variant="outline">
           <Gift className="w-4 h-4 mr-2" />
           Enviar Regalo
         </Button>
       </CardContent>
     </Card>
   );
 };
 
 export default GiftsShowcase;