/**
 * OMNIVERSE DASHBOARD - Panel de control visual del ecosistema
 * Muestra las 7 capas federadas, seguridad, guardianes y blockchain
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Lock, Users, Database, Globe, Cpu, Brain,
  Zap, Activity, Eye, Server, Layers, Network, AlertTriangle,
  CheckCircle, Clock, TrendingUp
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FEDERATED_LAYERS, 
  SECURITY_LAYERS, 
  GUARDIAN_ENTITIES,
  ANTIFRAUD_RADARS,
  omniverseOrchestrator 
} from '@/lib/omniverse-architecture';

const layerIcons: Record<string, React.ReactNode> = {
  '🔐': <Lock className="w-5 h-5" />,
  '📚': <Database className="w-5 h-5" />,
  '🌐': <Globe className="w-5 h-5" />,
  '🌌': <Layers className="w-5 h-5" />,
  '⚖️': <Shield className="w-5 h-5" />,
  '💎': <Zap className="w-5 h-5" />,
  '🌍': <Network className="w-5 h-5" />
};

const FederatedLayerCard = ({ layer, index }: { layer: typeof FEDERATED_LAYERS[0], index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ scale: 1.02, y: -5 }}
    className="relative p-4 rounded-xl bg-card/40 backdrop-blur-md border border-border/30
             hover:border-primary/50 hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)]
             transition-all duration-300 cursor-pointer group"
  >
    {/* Status indicator */}
    <div className={`absolute top-3 right-3 w-3 h-3 rounded-full 
                   ${layer.status === 'active' ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`} />
    
    {/* Header */}
    <div className="flex items-center gap-3 mb-3">
      <div className="p-2 rounded-lg bg-primary/20 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        {layerIcons[layer.icon] || <Cpu className="w-5 h-5" />}
      </div>
      <div>
        <h4 className="font-bold text-sm text-foreground">{layer.name}</h4>
        <p className="text-[10px] text-muted-foreground font-mono">{layer.codename}</p>
      </div>
    </div>
    
    {/* Description */}
    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{layer.description}</p>
    
    {/* Metrics */}
    <div className="grid grid-cols-3 gap-2 text-center">
      <div className="p-2 rounded-lg bg-background/50">
        <p className="text-lg font-bold text-foreground">{layer.endpoints}</p>
        <p className="text-[10px] text-muted-foreground">Endpoints</p>
      </div>
      <div className="p-2 rounded-lg bg-background/50">
        <p className="text-lg font-bold text-foreground">{layer.latencyMs}<span className="text-xs">ms</span></p>
        <p className="text-[10px] text-muted-foreground">Latency</p>
      </div>
      <div className="p-2 rounded-lg bg-background/50">
        <p className="text-lg font-bold text-green-400">{layer.entangled ? '⚛️' : '—'}</p>
        <p className="text-[10px] text-muted-foreground">Quantum</p>
      </div>
    </div>
    
    {/* Protocols */}
    <div className="flex flex-wrap gap-1 mt-3">
      {layer.protocols.slice(0, 3).map((proto, i) => (
        <Badge key={i} variant="secondary" className="text-[9px] px-1.5 py-0.5 bg-secondary/30">
          {proto}
        </Badge>
      ))}
      {layer.protocols.length > 3 && (
        <Badge variant="secondary" className="text-[9px] px-1.5 py-0.5 bg-secondary/30">
          +{layer.protocols.length - 3}
        </Badge>
      )}
    </div>
  </motion.div>
);

const GuardianCard = ({ guardian, index }: { guardian: typeof GUARDIAN_ENTITIES[0], index: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.15 }}
    whileHover={{ scale: 1.05 }}
    className="relative p-4 rounded-xl bg-gradient-to-br from-card/60 to-card/30 
             backdrop-blur-md border border-border/20 
             hover:border-yellow-500/50 hover:shadow-[0_0_30px_hsl(45,100%,50%,0.2)]
             transition-all duration-300 text-center cursor-pointer"
  >
    <motion.div
      animate={{ 
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0]
      }}
      transition={{ duration: 3, repeat: Infinity }}
      className="text-4xl mb-2"
    >
      {guardian.icon}
    </motion.div>
    <h4 className="font-bold text-sm text-foreground">{guardian.name}</h4>
    <p className="text-xs text-muted-foreground">{guardian.role}</p>
    
    {/* Power Level */}
    <div className="mt-3">
      <Progress value={guardian.powerLevel} className="h-1.5" />
      <p className="text-[10px] text-muted-foreground mt-1">Power: {guardian.powerLevel}%</p>
    </div>
    
    {/* Status */}
    <Badge 
      className={`mt-2 text-[10px] ${
        guardian.status === 'vigilant' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
        guardian.status === 'responding' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
        'bg-gray-500/20 text-gray-400 border-gray-500/30'
      }`}
    >
      {guardian.status.toUpperCase()}
    </Badge>
  </motion.div>
);

const RadarCard = ({ radar, index }: { radar: typeof ANTIFRAUD_RADARS[0], index: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
    className="flex items-center gap-4 p-3 rounded-xl bg-card/30 backdrop-blur-sm 
             border border-border/20 hover:border-red-500/30 transition-all group"
  >
    <motion.div
      animate={{ rotate: radar.status === 'scanning' ? 360 : 0 }}
      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      className="text-3xl"
    >
      {radar.icon}
    </motion.div>
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <h4 className="font-bold text-sm text-foreground">{radar.name}</h4>
        <Badge className={`text-[9px] ${
          radar.status === 'scanning' ? 'bg-blue-500/20 text-blue-400' :
          radar.status === 'alert' ? 'bg-red-500/20 text-red-400' :
          'bg-gray-500/20 text-gray-400'
        }`}>
          {radar.status.toUpperCase()}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground">{radar.function}</p>
    </div>
    <div className="text-right">
      <p className="text-lg font-bold text-green-400">{radar.accuracy}%</p>
      <p className="text-[10px] text-muted-foreground">Accuracy</p>
    </div>
  </motion.div>
);

const SecurityGrid = () => {
  const activeCount = SECURITY_LAYERS.filter(l => l.status === 'active').length;
  
  return (
    <div className="p-4 rounded-xl bg-card/30 backdrop-blur-md border border-border/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-400" />
          <span className="font-bold text-foreground">22 Security Layers</span>
        </div>
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          {activeCount}/22 ACTIVE
        </Badge>
      </div>
      
      <div className="grid grid-cols-11 gap-1">
        {SECURITY_LAYERS.map((layer, i) => (
          <motion.div
            key={layer.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.02 }}
            whileHover={{ scale: 1.3 }}
            className={`aspect-square rounded-sm cursor-pointer transition-all
                      ${layer.status === 'active' ? 'bg-green-500' :
                        layer.status === 'monitoring' ? 'bg-yellow-500' :
                        layer.status === 'alert' ? 'bg-orange-500' : 'bg-red-500'}
                      hover:shadow-[0_0_10px_currentColor]`}
            title={`L${layer.id}: ${layer.name} - ${layer.status}`}
          />
        ))}
      </div>
      
      <div className="flex items-center justify-center gap-4 mt-3 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Active</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Monitoring</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" /> Alert</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Critical</span>
      </div>
    </div>
  );
};

export const OmniverseDashboard = () => {
  const omniverseState = omniverseOrchestrator.getState();
  
  return (
    <section className="py-12 space-y-10">
      {/* Section Header */}
      <div className="text-center space-y-2">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3"
        >
          <Layers className="w-8 h-8 text-primary animate-pulse" />
          <h2 className="text-3xl md:text-4xl font-black">
            <span className="text-gradient">OMNIVERSE</span>
            <span className="text-foreground/80"> MD-Ω</span>
          </h2>
        </motion.div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Hiperestructura Tecnológica Civilizatoria — 7 Capas Federadas, 22 Capas de Seguridad
        </p>
        <Badge className="bg-primary/20 text-primary border-primary/30">
          v{omniverseState.version} • Architect: {omniverseState.architect.split('(')[0].trim()}
        </Badge>
      </div>
      
      {/* 7 Federated Layers Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-lg">7 Capas Federadas</h3>
          <Badge variant="secondary" className="text-xs">
            {omniverseOrchestrator.getTotalEndpoints()} endpoints
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {FEDERATED_LAYERS.map((layer, i) => (
            <FederatedLayerCard key={layer.id} layer={layer} index={i} />
          ))}
        </div>
      </div>
      
      {/* Security + Guardians Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Grid */}
        <SecurityGrid />
        
        {/* Anti-Fraud Radars */}
        <div className="p-4 rounded-xl bg-card/30 backdrop-blur-md border border-border/20">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-red-400" />
            <span className="font-bold text-foreground">4 Anti-Fraud Radars</span>
          </div>
          <div className="space-y-2">
            {ANTIFRAUD_RADARS.map((radar, i) => (
              <RadarCard key={radar.id} radar={radar} index={i} />
            ))}
          </div>
        </div>
      </div>
      
      {/* Guardian Entities */}
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Brain className="w-5 h-5 text-yellow-400" />
          <h3 className="font-bold text-lg">Guardian Parallel Cluster</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {GUARDIAN_ENTITIES.map((guardian, i) => (
            <GuardianCard key={guardian.id} guardian={guardian} index={i} />
          ))}
        </div>
      </div>
      
      {/* Bottom Status Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-6 p-4 rounded-xl 
                 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10
                 border border-border/20 backdrop-blur-md"
      >
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span className="text-sm text-foreground">MSR Blockchain: Active</span>
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-foreground">EOCT: Quantum Mode</span>
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-foreground">Post-Quantum: Dilithium Active</span>
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-pink-400" />
          <span className="text-sm text-foreground">Isabella: Transcendent</span>
        </div>
      </motion.div>
    </section>
  );
};
