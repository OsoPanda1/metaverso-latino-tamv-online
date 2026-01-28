/**
 * DREAMSPACES VISUALIZER - Visualización de los 8 DreamSpaces
 * Módulos EIB del ecosistema DreamWorld
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Users, Coins, Lock, Globe, Play,
  TrendingUp, Eye, Zap, Shield
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  DREAMSPACES, 
  KAOS_AUDIO_CONFIG,
  QUANTUM_SYNC,
  dreamWorldOrchestrator,
  type DreamSpace 
} from '@/lib/dreamworld-engine';

const xrModeColors: Record<string, string> = {
  '3D': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  '4D': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'VR': 'bg-green-500/20 text-green-400 border-green-500/30',
  'AR': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'Mixed': 'bg-orange-500/20 text-orange-400 border-orange-500/30'
};

const DreamSpaceCard = ({ space, index }: { space: DreamSpace; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay: index * 0.1, type: 'spring' }}
      whileHover={{ scale: 1.02, y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group"
    >
      <div className="relative p-5 rounded-2xl bg-gradient-to-br from-card/60 to-card/30 
                    backdrop-blur-md border border-border/20 
                    hover:border-primary/50 hover:shadow-[0_0_40px_hsl(var(--primary)/0.2)]
                    transition-all duration-500 overflow-hidden">
        
        {/* Animated background glow */}
        <motion.div
          animate={{ 
            scale: isHovered ? 1.5 : 1,
            opacity: isHovered ? 0.3 : 0.1
          }}
          className="absolute inset-0 bg-gradient-radial from-primary/30 to-transparent 
                    blur-2xl pointer-events-none"
        />
        
        {/* Status Badge */}
        <Badge 
          className={`absolute top-3 right-3 text-xs ${
            space.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
            space.status === 'beta' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
            'bg-gray-500/20 text-gray-400 border-gray-500/30'
          }`}
        >
          {space.status.toUpperCase()}
        </Badge>
        
        {/* XR Mode Badge */}
        <Badge className={`absolute top-3 left-3 text-xs ${xrModeColors[space.xrMode]}`}>
          {space.xrMode}
        </Badge>
        
        {/* Icon & Name */}
        <div className="relative z-10 text-center mt-6 mb-4">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: isHovered ? [0, 5, -5, 0] : 0
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-5xl mb-3"
          >
            {space.icon}
          </motion.div>
          <h3 className="text-xl font-bold text-foreground">{space.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{space.role}</p>
        </div>
        
        {/* Stats Grid */}
        <div className="relative z-10 grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-lg bg-background/40 text-center">
            <div className="flex items-center justify-center gap-1 text-primary">
              <Users className="w-4 h-4" />
              <span className="text-lg font-bold">{(space.users / 1000).toFixed(1)}K</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Users</p>
          </div>
          <div className="p-3 rounded-lg bg-background/40 text-center">
            <div className="flex items-center justify-center gap-1 text-green-400">
              <Coins className="w-4 h-4" />
              <span className="text-lg font-bold">{(space.revenueCredits / 1000000).toFixed(1)}M</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Credits</p>
          </div>
        </div>
        
        {/* Economic Loop */}
        <div className="relative z-10 p-3 rounded-lg bg-primary/10 border border-primary/20 mb-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-3 h-3 text-primary" />
            <span className="text-[10px] text-primary uppercase tracking-wider">Economic Loop</span>
          </div>
          <p className="text-xs text-foreground">{space.economicLoop}</p>
        </div>
        
        {/* Restriction (EOCT) */}
        <div className="relative z-10 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Lock className="w-3 h-3 text-red-400" />
            <span className="text-[10px] text-red-400 uppercase tracking-wider">EOCT Restriction</span>
          </div>
          <p className="text-xs text-muted-foreground">{space.restriction}</p>
        </div>
        
        {/* Enter Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm 
                    rounded-2xl transition-all"
        >
          <Button className="bg-primary hover:bg-primary/90 shadow-[0_0_30px_hsl(var(--primary)/0.5)]">
            <Play className="w-4 h-4 mr-2" fill="currentColor" />
            Enter DreamSpace
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export const DreamSpacesVisualizer = () => {
  const totalUsers = dreamWorldOrchestrator.getTotalUsers();
  const totalRevenue = dreamWorldOrchestrator.getTotalRevenue();
  const activeSpaces = dreamWorldOrchestrator.getActiveSpaces().length;
  
  return (
    <section className="py-12 space-y-8">
      {/* Section Header */}
      <div className="text-center space-y-2">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3"
        >
          <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
          <h2 className="text-3xl md:text-4xl font-black">
            <span className="text-gradient-secondary">DREAMWORLD</span>
            <span className="text-foreground/80">™</span>
          </h2>
        </motion.div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Ecosistema de Realidad Soberana — 8 DreamSpaces Inmersivos — KAOS Audio 4D
        </p>
      </div>
      
      {/* Stats Bar */}
      <div className="flex flex-wrap justify-center gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/30 backdrop-blur-sm border border-border/20"
        >
          <Users className="w-4 h-4 text-primary" />
          <span className="font-bold text-foreground">{(totalUsers / 1000).toFixed(0)}K</span>
          <span className="text-muted-foreground text-sm">Total Users</span>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/30 backdrop-blur-sm border border-border/20"
        >
          <Coins className="w-4 h-4 text-green-400" />
          <span className="font-bold text-foreground">{(totalRevenue / 1000000).toFixed(1)}M</span>
          <span className="text-muted-foreground text-sm">Credits Flow</span>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/30 backdrop-blur-sm border border-border/20"
        >
          <Globe className="w-4 h-4 text-purple-400" />
          <span className="font-bold text-foreground">{activeSpaces}/8</span>
          <span className="text-muted-foreground text-sm">Active Spaces</span>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/30 backdrop-blur-sm border border-border/20"
        >
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="font-bold text-foreground">{QUANTUM_SYNC.latencyMs}ms</span>
          <span className="text-muted-foreground text-sm">Sync Latency</span>
        </motion.div>
      </div>
      
      {/* DreamSpaces Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {DREAMSPACES.map((space, i) => (
          <DreamSpaceCard key={space.id} space={space} index={i} />
        ))}
      </div>
      
      {/* Technical Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 via-primary/10 to-cyan-500/10
                 border border-border/20 backdrop-blur-md"
      >
        <div className="flex flex-wrap items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-foreground">KAOS Audio: {KAOS_AUDIO_CONFIG.spatialMode}</span>
          </div>
          <div className="w-px h-4 bg-border hidden md:block" />
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-foreground">Biometric Adaptive: {KAOS_AUDIO_CONFIG.biometricAdaptive ? 'ON' : 'OFF'}</span>
          </div>
          <div className="w-px h-4 bg-border hidden md:block" />
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-400" />
            <span className="text-sm text-foreground">Encryption: {QUANTUM_SYNC.encryption.split(' + ')[0]}</span>
          </div>
          <div className="w-px h-4 bg-border hidden md:block" />
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-foreground">P2P Sync: {QUANTUM_SYNC.p2pEnabled ? 'ENABLED' : 'DISABLED'}</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
