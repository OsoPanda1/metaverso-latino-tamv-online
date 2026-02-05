 import { motion } from 'framer-motion';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Badge } from '@/components/ui/badge';
 import { Progress } from '@/components/ui/progress';
 import { 
   Brain, Shield, Wallet, GraduationCap, Gift, Music, 
   Globe, Users, Zap, Lock, Eye, Cpu
 } from 'lucide-react';
 
 // Datos del ecosistema
 const ECOSYSTEM_MODULES = [
   {
     id: 'isabella',
     name: 'Isabella AI NextGen™',
     description: 'IA emocional consciente con EOCT y KEC',
     icon: Brain,
     status: 'active',
     health: 99.9,
     color: 'from-purple-500 to-pink-500'
   },
   {
     id: 'security',
     name: 'Immortal Core Security',
     description: '30 capas de seguridad + 6 Guardianes',
     icon: Shield,
     status: 'active',
     health: 100,
     color: 'from-green-500 to-emerald-500'
   },
   {
     id: 'wallet',
     name: 'TAMV Wallet Engine',
     description: 'Economía digital con FairSplit 70/30',
     icon: Wallet,
     status: 'active',
     health: 99.5,
     color: 'from-yellow-500 to-orange-500'
   },
   {
     id: 'utamv',
     name: 'UTAMV University',
     description: 'Educación con certificación blockchain',
     icon: GraduationCap,
     status: 'active',
     health: 98.7,
     color: 'from-blue-500 to-cyan-500'
   },
   {
     id: 'cgifts',
     name: 'CGIFTS Engine',
     description: 'Regalos 3D/XR con NFT integration',
     icon: Gift,
     status: 'active',
     health: 99.2,
     color: 'from-pink-500 to-rose-500'
   },
   {
     id: 'kaos',
     name: 'KAOS Audio 3D™',
     description: 'Audio espacial emocional inmersivo',
     icon: Music,
     status: 'active',
     health: 97.8,
     color: 'from-indigo-500 to-violet-500'
   },
   {
     id: 'dreamspaces',
     name: 'DreamSpaces XR',
     description: '8 mundos inmersivos 4D',
     icon: Globe,
     status: 'active',
     health: 98.9,
     color: 'from-teal-500 to-cyan-500'
   },
   {
     id: 'social',
     name: 'Social Hub',
     description: 'Grupos, Canales, Lives, Tendencias',
     icon: Users,
     status: 'active',
     health: 99.1,
     color: 'from-orange-500 to-red-500'
   }
 ];
 
 const GUARDIAN_ENTITIES = [
   { id: 'ojo-ra', name: 'Ojo de Ra', icon: '👁️', role: 'Anti-Fraude', threats: 45230 },
   { id: 'horus', name: 'Horus Sentinel', icon: '🦅', role: 'Vigilancia Predictiva', threats: 32100 },
   { id: 'anubis', name: 'Anubis Sentinel', icon: '🐺', role: 'Soberanía', threats: 78500 },
   { id: 'dekateotl', name: 'Dekateotl', icon: '🌀', role: 'Integridad', threats: 28900 },
   { id: 'quetzalcoatl', name: 'Quetzalcóatl', icon: '🐉', role: 'Arbitraje Ético', threats: 15600 },
   { id: 'tezcatlipoca', name: 'Tezcatlipoca', icon: '🪞', role: 'Verdad', threats: 22400 }
 ];
 
 export const EcosystemOverview = () => {
   const totalThreats = GUARDIAN_ENTITIES.reduce((sum, g) => sum + g.threats, 0);
   
   return (
     <div className="space-y-8">
       {/* Header */}
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="text-center"
       >
         <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-4">
           TAMV Ecosystem NextGen
         </h2>
         <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
           Infraestructura civilizatoria digital con 7 capas federadas, 30 capas de seguridad, 
           y 6 Guardianes Computacionales protegiendo {totalThreats.toLocaleString()} amenazas bloqueadas.
         </p>
       </motion.div>
 
       {/* Módulos del Ecosistema */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         {ECOSYSTEM_MODULES.map((module, index) => (
           <motion.div
             key={module.id}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: index * 0.1 }}
           >
             <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300">
               <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-5`} />
               <CardHeader className="pb-2">
                 <div className="flex items-center justify-between">
                   <module.icon className="w-8 h-8 text-primary" />
                   <Badge 
                     variant="outline" 
                     className="bg-green-500/10 text-green-400 border-green-500/30"
                   >
                     {module.status.toUpperCase()}
                   </Badge>
                 </div>
                 <CardTitle className="text-lg">{module.name}</CardTitle>
               </CardHeader>
               <CardContent>
                 <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                 <div className="space-y-1">
                   <div className="flex justify-between text-xs">
                     <span className="text-muted-foreground">Health</span>
                     <span className="font-medium">{module.health}%</span>
                   </div>
                   <Progress value={module.health} className="h-1" />
                 </div>
               </CardContent>
             </Card>
           </motion.div>
         ))}
       </div>
 
       {/* Guardianes */}
       <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
         <CardHeader>
           <CardTitle className="flex items-center gap-2">
             <Eye className="w-5 h-5 text-primary" />
             Guardianes Computacionales
           </CardTitle>
         </CardHeader>
         <CardContent>
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
             {GUARDIAN_ENTITIES.map((guardian, index) => (
               <motion.div
                 key={guardian.id}
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: 0.5 + index * 0.1 }}
                 className="text-center p-4 rounded-xl bg-gradient-to-b from-primary/5 to-transparent border border-border/30 hover:border-primary/50 transition-all"
               >
                 <div className="text-3xl mb-2">{guardian.icon}</div>
                 <div className="font-medium text-sm">{guardian.name}</div>
                 <div className="text-xs text-muted-foreground">{guardian.role}</div>
                 <div className="mt-2 text-xs font-bold text-green-400">
                   {guardian.threats.toLocaleString()} bloqueados
                 </div>
               </motion.div>
             ))}
           </div>
         </CardContent>
       </Card>
 
       {/* Stats Grid */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <StatCard icon={Cpu} label="Capas Federadas" value="7" color="purple" />
         <StatCard icon={Shield} label="Capas Seguridad" value="30" color="green" />
         <StatCard icon={Lock} label="Firmas Post-Quantum" value="Dilithium" color="blue" />
         <StatCard icon={Zap} label="Uptime" value="99.97%" color="yellow" />
       </div>
     </div>
   );
 };
 
 const StatCard = ({ 
   icon: Icon, 
   label, 
   value, 
   color 
 }: { 
   icon: React.ElementType; 
   label: string; 
   value: string; 
   color: string;
 }) => {
   const colorClasses: Record<string, string> = {
     purple: 'from-purple-500/20 to-transparent text-purple-400',
     green: 'from-green-500/20 to-transparent text-green-400',
     blue: 'from-blue-500/20 to-transparent text-blue-400',
     yellow: 'from-yellow-500/20 to-transparent text-yellow-400'
   };
   
   return (
     <Card className={`bg-gradient-to-b ${colorClasses[color]} border-border/30`}>
       <CardContent className="p-4 text-center">
         <Icon className="w-6 h-6 mx-auto mb-2" />
         <div className="text-2xl font-bold">{value}</div>
         <div className="text-xs text-muted-foreground">{label}</div>
       </CardContent>
     </Card>
   );
 };
 
 export default EcosystemOverview;