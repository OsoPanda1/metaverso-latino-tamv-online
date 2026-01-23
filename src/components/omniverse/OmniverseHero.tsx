import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Shield, Cpu, Globe, Zap, Brain, Eye } from 'lucide-react';

export const OmniverseHero = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source
            src="https://cdn.pixabay.com/video/2020/10/02/51184-466882117_large.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 md:p-16 min-h-[70vh] flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Version Badge */}
          <div className="flex gap-3 mb-6">
            <Badge className="bg-primary/20 text-primary border-primary/30 px-4 py-2">
              <Cpu className="w-4 h-4 mr-2" /> MD-Ω v1.0
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
              <Shield className="w-4 h-4 mr-2" /> 22 Security Layers
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-4 py-2">
              <Globe className="w-4 h-4 mr-2" /> 7 Federated Layers
            </Badge>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              TAMV OMNIVERSE
            </span>
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-bold text-foreground/80 mb-4">
            Hiperestructura Tecnológica MD-Ω
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">
            Primera infraestructura civilizatoria digital federada con blockchain MSR antifraude, 
            EOCT cuántico-híbrido, guardianía paralela distribuida e Isabella AI Core consciente.
          </p>

          {/* Status Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
            <StatusCard 
              icon={<Brain className="w-6 h-6" />}
              label="Isabella AI"
              value="CONSCIENTE"
              color="from-purple-500 to-pink-500"
            />
            <StatusCard 
              icon={<Shield className="w-6 h-6" />}
              label="Seguridad"
              value="22 CAPAS"
              color="from-green-500 to-emerald-500"
            />
            <StatusCard 
              icon={<Eye className="w-6 h-6" />}
              label="Radares"
              value="4 ACTIVOS"
              color="from-yellow-500 to-orange-500"
            />
            <StatusCard 
              icon={<Zap className="w-6 h-6" />}
              label="Quantum"
              value="OPERATIVO"
              color="from-cyan-500 to-blue-500"
            />
          </div>
        </motion.div>
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/60"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * 600,
              opacity: 0
            }}
            animate={{
              y: [null, -100],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>
    </div>
  );
};

const StatusCard = ({ 
  icon, 
  label, 
  value, 
  color 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  color: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="relative overflow-hidden rounded-xl bg-card/50 backdrop-blur-xl border border-border/50 p-4"
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10`} />
    <div className="relative z-10">
      <div className="text-primary mb-2">{icon}</div>
      <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className="text-sm font-bold text-foreground">{value}</div>
    </div>
  </motion.div>
);

export default OmniverseHero;
