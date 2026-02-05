 import { motion } from 'framer-motion';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Badge } from '@/components/ui/badge';
 import { Button } from '@/components/ui/button';
 import { Progress } from '@/components/ui/progress';
 import { 
   GraduationCap, Clock, Users, Star, BookOpen, 
   Trophy, Globe, Cpu, Palette, Briefcase
 } from 'lucide-react';
 import { DEFAULT_UTAMV_CATALOG, type CourseCategory } from '@/lib/utamv-university';
 
 const categoryIcons: Record<string, React.ElementType> = {
   technology: Cpu,
   ai_ml: Cpu,
   blockchain: Globe,
   xr_development: Globe,
   digital_arts: Palette,
   tamv_ecosystem: Star,
   business: Briefcase,
   health_wellness: GraduationCap
 };
 
 const categoryColors: Record<string, string> = {
   technology: 'from-blue-500 to-cyan-500',
   ai_ml: 'from-purple-500 to-pink-500',
   blockchain: 'from-green-500 to-emerald-500',
   xr_development: 'from-indigo-500 to-violet-500',
   digital_arts: 'from-pink-500 to-rose-500',
   tamv_ecosystem: 'from-yellow-500 to-orange-500',
   business: 'from-gray-500 to-slate-500',
   health_wellness: 'from-teal-500 to-green-500'
 };
 
 export const UniversityCatalog = () => {
   return (
     <div className="space-y-8">
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="text-center"
       >
         <div className="flex items-center justify-center gap-3 mb-4">
           <GraduationCap className="w-10 h-10 text-primary" />
           <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-blue-500 to-cyan-500 bg-clip-text text-transparent">
             UTAMV Universidad
           </h2>
         </div>
         <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
           Educación del futuro con certificaciones blockchain, experiencias XR inmersivas, 
           y tutorías con Isabella AI.
         </p>
       </motion.div>
 
       {/* Stats */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <StatCard icon={BookOpen} value="50+" label="Cursos" />
         <StatCard icon={Users} value="25K+" label="Estudiantes" />
         <StatCard icon={Trophy} value="15K+" label="Certificados" />
         <StatCard icon={Star} value="4.8" label="Rating Promedio" />
       </div>
 
       {/* Course Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         {DEFAULT_UTAMV_CATALOG.map((course, index) => (
           <motion.div
             key={course.id}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: index * 0.1 }}
           >
             <CourseCard course={course} />
           </motion.div>
         ))}
       </div>
 
       {/* CTA */}
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.5 }}
       >
         <Card className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border-blue-500/30">
           <CardContent className="p-8 text-center">
             <h3 className="text-2xl font-bold mb-2">¿Quieres ser instructor?</h3>
             <p className="text-muted-foreground mb-4">
               Comparte tu conocimiento y gana el 70% de las ventas de tus cursos.
             </p>
             <Button size="lg">
               Aplicar como Instructor
             </Button>
           </CardContent>
         </Card>
       </motion.div>
     </div>
   );
 };
 
 const CourseCard = ({ course }: { course: Partial<typeof DEFAULT_UTAMV_CATALOG[0]> }) => {
   const CategoryIcon = categoryIcons[course.category || 'technology'] || BookOpen;
   const colorClass = categoryColors[course.category || 'technology'] || 'from-blue-500 to-cyan-500';
   
   return (
     <Card className="h-full overflow-hidden group hover:border-primary/50 transition-all duration-300">
       {/* Thumbnail placeholder */}
       <div className={`h-32 bg-gradient-to-br ${colorClass} relative`}>
         <div className="absolute inset-0 flex items-center justify-center">
           <CategoryIcon className="w-16 h-16 text-white/30" />
         </div>
         {course.xrEnabled && (
           <Badge className="absolute top-2 right-2 bg-purple-500">XR</Badge>
         )}
         {course.price === 0 && (
           <Badge className="absolute top-2 left-2 bg-green-500">GRATIS</Badge>
         )}
       </div>
       
       <CardHeader className="pb-2">
         <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
           <Badge variant="outline" className="text-xs">
             {course.level}
           </Badge>
           <span className="flex items-center gap-1">
             <Clock className="w-3 h-3" />
             {Math.round((course.duration || 0) / 60)}h
           </span>
         </div>
         <CardTitle className="text-base line-clamp-2 group-hover:text-primary transition-colors">
           {course.title}
         </CardTitle>
       </CardHeader>
       
       <CardContent className="pt-0">
         <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
           {course.description}
         </p>
         
         <div className="flex items-center justify-between text-sm mb-3">
           <div className="flex items-center gap-1">
             <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
             <span className="font-medium">{course.rating}</span>
           </div>
           <div className="flex items-center gap-1 text-muted-foreground">
             <Users className="w-4 h-4" />
             {course.enrollments?.toLocaleString()}
           </div>
         </div>
         
         <div className="flex items-center justify-between">
           <span className="font-bold text-lg">
             {course.price === 0 ? 'Gratis' : `${course.price} créditos`}
           </span>
           <Button size="sm">Inscribirse</Button>
         </div>
       </CardContent>
     </Card>
   );
 };
 
 const StatCard = ({ 
   icon: Icon, 
   value, 
   label 
 }: { 
   icon: React.ElementType; 
   value: string; 
   label: string;
 }) => (
   <Card className="bg-gradient-to-b from-primary/5 to-transparent border-border/30">
     <CardContent className="p-4 text-center">
       <Icon className="w-6 h-6 mx-auto mb-2 text-primary" />
       <div className="text-2xl font-bold">{value}</div>
       <div className="text-xs text-muted-foreground">{label}</div>
     </CardContent>
   </Card>
 );
 
 export default UniversityCatalog;