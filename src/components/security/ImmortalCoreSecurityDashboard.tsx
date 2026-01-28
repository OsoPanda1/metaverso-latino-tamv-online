/**
 * IMMORTAL CORE SECURITY DASHBOARD - 30 Security Layers Visualization
 * Panel de control visual del sistema de seguridad blindado
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Lock, Eye, Zap, Server, Database, 
  Key, Network, Cloud, AlertTriangle, CheckCircle,
  Activity, TrendingUp, Users, Fingerprint
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  SECURITY_30_LAYERS, 
  GUARDIAN_ENTITIES_EXTENDED,
  ZERO_TRUST_CONFIG,
  security30Orchestrator,
  type SecurityLayer,
  type GuardianEntity
} from '@/lib/security-30-layers';

const categoryIcons: Record<string, React.ReactNode> = {
  'RLS': <Database className="w-4 h-4" />,
  'ENCRYPTION': <Lock className="w-4 h-4" />,
  'AUTH': <Fingerprint className="w-4 h-4" />,
  'NETWORK': <Network className="w-4 h-4" />,
  'DATA': <Server className="w-4 h-4" />,
  'AUDIT': <Eye className="w-4 h-4" />,
  'CRYPTO': <Key className="w-4 h-4" />,
  'ACCESS': <Users className="w-4 h-4" />,
  'BACKUP': <Cloud className="w-4 h-4" />,
  'QUANTUM': <Zap className="w-4 h-4" />
};

const statusColors: Record<string, string> = {
  'active': 'bg-green-500',
  'monitoring': 'bg-yellow-500',
  'alert': 'bg-orange-500',
  'critical': 'bg-red-500'
};

const SecurityLayerTile = ({ layer, index }: { layer: SecurityLayer; index: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.015, type: 'spring' }}
    whileHover={{ scale: 1.3, zIndex: 50 }}
    className={`relative aspect-square rounded cursor-pointer transition-all group
              ${statusColors[layer.status]}
              hover:shadow-[0_0_20px_currentColor]`}
    title={`L${layer.id}: ${layer.name}\n${layer.description}\nScore: ${layer.auditScore}%`}
  >
    {/* Tooltip on hover */}
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
                    opacity-0 group-hover:opacity-100 transition-opacity z-50
                    pointer-events-none">
      <div className="bg-popover/95 backdrop-blur-md rounded-lg p-3 shadow-xl 
                    border border-border min-w-[200px] text-left">
        <p className="font-bold text-sm text-foreground">L{layer.id}: {layer.name}</p>
        <p className="text-xs text-muted-foreground mt-1">{layer.description}</p>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="secondary" className="text-[10px]">{layer.category}</Badge>
          <span className="text-xs text-green-400">{layer.auditScore}%</span>
        </div>
      </div>
    </div>
  </motion.div>
);

const GuardianPanel = ({ guardian, index }: { guardian: GuardianEntity; index: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ scale: 1.02, x: 5 }}
    className="flex items-center gap-3 p-3 rounded-xl bg-card/30 backdrop-blur-sm 
             border border-border/20 hover:border-primary/40 transition-all"
  >
    <motion.div
      animate={{ 
        scale: [1, 1.1, 1],
        rotate: guardian.status === 'scanning' ? [0, 360] : 0
      }}
      transition={{ 
        scale: { duration: 2, repeat: Infinity },
        rotate: { duration: 3, repeat: Infinity, ease: 'linear' }
      }}
      className="text-3xl"
    >
      {guardian.icon}
    </motion.div>
    
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <h4 className="font-bold text-sm text-foreground truncate">{guardian.name}</h4>
        <Badge className={`text-[9px] ${
          guardian.status === 'vigilant' ? 'bg-green-500/20 text-green-400' :
          guardian.status === 'scanning' ? 'bg-blue-500/20 text-blue-400' :
          guardian.status === 'responding' ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-gray-500/20 text-gray-400'
        }`}>
          {guardian.status.toUpperCase()}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground truncate">{guardian.role}</p>
      <div className="flex items-center gap-2 mt-1">
        <Progress value={guardian.powerLevel} className="h-1 flex-1" />
        <span className="text-[10px] text-muted-foreground">{guardian.powerLevel}%</span>
      </div>
    </div>
    
    <div className="text-right">
      <p className="text-lg font-bold text-red-400">{(guardian.threatsBlocked / 1000).toFixed(1)}K</p>
      <p className="text-[10px] text-muted-foreground">Blocked</p>
    </div>
  </motion.div>
);

export const ImmortalCoreSecurityDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [animatedScore, setAnimatedScore] = useState(0);
  
  const overallScore = security30Orchestrator.getOverallScore();
  const activeLayers = security30Orchestrator.getActiveLayersCount();
  const totalThreatsBlocked = security30Orchestrator.getTotalThreatsBlocked();
  
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedScore(prev => {
        if (prev < overallScore) return prev + 1;
        return overallScore;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [overallScore]);
  
  const filteredLayers = selectedCategory 
    ? SECURITY_30_LAYERS.filter(l => l.category === selectedCategory)
    : SECURITY_30_LAYERS;
  
  const categories = [...new Set(SECURITY_30_LAYERS.map(l => l.category))];
  
  return (
    <section className="py-12 space-y-8">
      {/* Section Header */}
      <div className="text-center space-y-2">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3"
        >
          <Shield className="w-8 h-8 text-green-400 animate-pulse" />
          <h2 className="text-3xl md:text-4xl font-black">
            <span className="text-gradient">IMMORTAL CORE</span>
            <span className="text-foreground/80"> SECURITY</span>
          </h2>
        </motion.div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          30 Capas de Seguridad Blindada — Zero Trust Architecture — Post-Quantum Ready
        </p>
      </div>
      
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-center"
        >
          <p className="text-4xl font-black text-green-400">{animatedScore}%</p>
          <p className="text-sm text-muted-foreground">Security Score</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl bg-primary/10 border border-primary/30 text-center"
        >
          <p className="text-4xl font-black text-primary">{activeLayers}/30</p>
          <p className="text-sm text-muted-foreground">Active Layers</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-center"
        >
          <p className="text-4xl font-black text-red-400">{(totalThreatsBlocked / 1000).toFixed(0)}K</p>
          <p className="text-sm text-muted-foreground">Threats Blocked</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-center"
        >
          <p className="text-4xl font-black text-purple-400">6</p>
          <p className="text-sm text-muted-foreground">Guardian Entities</p>
        </motion.div>
      </div>
      
      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 30 Security Layers Grid */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-card/30 backdrop-blur-md border border-border/20">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-green-400" />
              <span className="font-bold text-foreground">30 Security Layers</span>
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-1">
              <Badge 
                variant={selectedCategory === null ? "default" : "secondary"}
                className="cursor-pointer text-xs"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Badge>
              {categories.map(cat => (
                <Badge 
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "secondary"}
                  className="cursor-pointer text-xs flex items-center gap-1"
                  onClick={() => setSelectedCategory(cat)}
                >
                  {categoryIcons[cat]}
                  {cat}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Layers Grid */}
          <div className="grid grid-cols-10 gap-1.5">
            <AnimatePresence mode="wait">
              {filteredLayers.map((layer, i) => (
                <SecurityLayerTile key={layer.id} layer={layer} index={i} />
              ))}
            </AnimatePresence>
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 text-xs text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500" /> Active</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-500" /> Monitoring</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-orange-500" /> Alert</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500" /> Critical</span>
          </div>
        </div>
        
        {/* Guardians Panel */}
        <div className="p-4 rounded-xl bg-card/30 backdrop-blur-md border border-border/20">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-yellow-400" />
            <span className="font-bold text-foreground">Guardian Entities</span>
          </div>
          
          <div className="space-y-3">
            {GUARDIAN_ENTITIES_EXTENDED.map((guardian, i) => (
              <GuardianPanel key={guardian.id} guardian={guardian} index={i} />
            ))}
          </div>
        </div>
      </div>
      
      {/* Zero Trust Config */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 via-primary/10 to-purple-500/10
                 border border-border/20 backdrop-blur-md"
      >
        <div className="flex flex-wrap items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-sm text-foreground">Zero Trust: {ZERO_TRUST_CONFIG.enabled ? 'ENABLED' : 'DISABLED'}</span>
          </div>
          <div className="w-px h-4 bg-border hidden md:block" />
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-green-400" />
            <span className="text-sm text-foreground">RLS Enforced: {ZERO_TRUST_CONFIG.rlsEnforced ? 'YES' : 'NO'}</span>
          </div>
          <div className="w-px h-4 bg-border hidden md:block" />
          <div className="flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-green-400" />
            <span className="text-sm text-foreground">MFA Required: {ZERO_TRUST_CONFIG.mfaRequired ? 'YES' : 'NO'}</span>
          </div>
          <div className="w-px h-4 bg-border hidden md:block" />
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-green-400" />
            <span className="text-sm text-foreground">Password: {ZERO_TRUST_CONFIG.minPasswordLength}+ chars</span>
          </div>
          <div className="w-px h-4 bg-border hidden md:block" />
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-foreground">Post-Quantum: DILITHIUM</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
