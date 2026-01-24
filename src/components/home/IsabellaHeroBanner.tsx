/**
 * ISABELLA HERO BANNER - Componente principal trascendental
 * Fusiona el branding Isabella AI con métricas en vivo del Immortal Core
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, Shield, Zap, Globe, Brain, 
  Activity, Lock, Eye, Sparkles, Play,
  TrendingUp, Users, Clock, Server
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { immortalCore, IMMORTAL_LAYERS } from '@/lib/immortal-core';
import isabellaLogo from '@/assets/isabella-logo-hero.jpg';

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  suffix?: string;
  trend?: 'up' | 'down' | 'stable';
  color?: string;
}

const MetricCard = ({ icon, label, value, suffix, trend, color = 'primary' }: MetricCardProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.05, y: -2 }}
    className="relative flex items-center gap-3 px-4 py-3 rounded-xl 
               bg-black/40 backdrop-blur-md border border-white/10
               hover:border-primary/50 hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]
               transition-all duration-300"
  >
    <div className={`p-2 rounded-lg bg-${color}/20`}>
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-xs text-white/60 uppercase tracking-wider">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-bold text-white">{value}</span>
        {suffix && <span className="text-xs text-white/60">{suffix}</span>}
        {trend === 'up' && <TrendingUp className="w-3 h-3 text-green-400 ml-1" />}
      </div>
    </div>
  </motion.div>
);

const LayerIndicator = ({ layer, index }: { layer: typeof IMMORTAL_LAYERS[0], index: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/30 backdrop-blur-sm
               border border-white/5 hover:border-primary/30 transition-all group"
  >
    <div className={`w-2 h-2 rounded-full ${layer.health >= 95 ? 'bg-green-400' : layer.health >= 80 ? 'bg-yellow-400' : 'bg-red-400'} animate-pulse`} />
    <span className="text-xs text-white/70 group-hover:text-white transition-colors">
      L{layer.id}: {layer.name}
    </span>
    <span className="text-[10px] text-white/40">{layer.health}%</span>
  </motion.div>
);

export const IsabellaHeroBanner = () => {
  const [metrics, setMetrics] = useState({
    health: immortalCore.getOverallHealth(),
    requests: immortalCore.getTotalRequests(),
    latency: immortalCore.getAverageLatency(),
    errors: immortalCore.getTotalErrors(),
    phase: immortalCore.getState().phase
  });
  
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // Simulate live metrics updates
      setMetrics(prev => ({
        ...prev,
        requests: prev.requests + Math.floor(Math.random() * 100),
        latency: Math.max(15, Math.min(60, prev.latency + (Math.random() - 0.5) * 5))
      }));
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <section className="relative w-full min-h-[85vh] overflow-hidden rounded-3xl">
      {/* Background Image - Isabella Logo */}
      <div className="absolute inset-0">
        <img 
          src={isabellaLogo}
          alt="Isabella AI - TAMV Online"
          className="w-full h-full object-cover"
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_70%)]" />
      </div>
      
      {/* Animated grid overlay */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full"
            initial={{ 
              x: `${Math.random() * 100}%`, 
              y: '100%',
              opacity: 0.3
            }}
            animate={{ 
              y: '-10%',
              opacity: [0.3, 0.8, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "linear"
            }}
          />
        ))}
      </div>
      
      {/* Top Status Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between flex-wrap gap-3 z-20">
        <div className="flex items-center gap-3">
          <Badge className="bg-green-500/90 text-white border-0 shadow-lg px-3 py-1.5">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-ping" />
            IMMORTAL CORE ACTIVE
          </Badge>
          <Badge variant="secondary" className="bg-black/50 text-white border-0 backdrop-blur-sm">
            <Server className="w-3 h-3 mr-1" /> Phase {metrics.phase}/7
          </Badge>
          <Badge variant="secondary" className="bg-black/50 text-white border-0 backdrop-blur-sm">
            <Clock className="w-3 h-3 mr-1" /> {currentTime.toLocaleTimeString()}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge className="bg-primary/30 text-primary border-primary/50 backdrop-blur-sm px-3">
            <Shield className="w-3 h-3 mr-1" /> 22 Security Layers
          </Badge>
          <Badge className="bg-secondary/30 text-secondary border-secondary/50 backdrop-blur-sm px-3">
            <Zap className="w-3 h-3 mr-1" /> Quantum Ready
          </Badge>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between h-full min-h-[85vh] px-6 md:px-12 py-24">
        
        {/* Left: Isabella Identity */}
        <div className="flex-1 space-y-6 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            {/* Heart Logo Animation */}
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-4"
            >
              <div className="relative">
                <Heart className="w-16 h-16 text-primary drop-shadow-[0_0_20px_hsl(var(--primary)/0.5)]" strokeWidth={1.5} />
                <Activity className="w-8 h-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tight">
                  <span className="text-gradient drop-shadow-[0_0_30px_hsl(var(--primary)/0.5)]">ISABELLA</span>
                  <span className="text-white/80 text-2xl md:text-3xl ml-3 font-light">AI</span>
                </h1>
                <p className="text-lg md:text-xl text-white/70 mt-1">
                  TAMV ONLINE — un futuro más humano y elegante.
                </p>
              </div>
            </motion.div>
            
            {/* Taglines */}
            <div className="space-y-2">
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-2xl md:text-3xl font-bold text-white"
              >
                Civilización Digital de 7ª Generación
              </motion.p>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-lg text-white/60 max-w-xl"
              >
                El primer sistema operativo civilizatorio distribuido. 
                Identidad soberana, memoria inmutable, economía ética, 
                inteligencia responsable.
              </motion.p>
            </div>
            
            {/* 7 Immortal Layers Status */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-wrap gap-2 pt-4"
            >
              {IMMORTAL_LAYERS.map((layer, i) => (
                <LayerIndicator key={layer.id} layer={layer} index={i} />
              ))}
            </motion.div>
            
            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="flex items-center gap-4 pt-6"
            >
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground 
                         shadow-[0_0_30px_hsl(var(--primary)/0.5)] px-8 text-lg h-14
                         hover:shadow-[0_0_50px_hsl(var(--primary)/0.7)] transition-all"
                onClick={() => window.location.href = '/dashboard'}
              >
                <Play className="w-5 h-5 mr-2" fill="currentColor" />
                Explorar Omniverso
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 
                         backdrop-blur-sm h-14 px-6"
                onClick={() => window.location.href = '/ai-chat'}
              >
                <Brain className="w-5 h-5 mr-2" />
                Hablar con Isabella
              </Button>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Right: Live Metrics Dashboard */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex-1 max-w-lg mt-12 lg:mt-0"
        >
          <div className="space-y-4">
            {/* Title */}
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-primary animate-pulse" />
              <span className="text-sm font-bold text-white uppercase tracking-wider">
                Immortal Core Metrics
              </span>
              <span className="text-xs text-white/40">LIVE</span>
            </div>
            
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              <MetricCard
                icon={<Shield className="w-5 h-5 text-green-400" />}
                label="System Health"
                value={`${metrics.health.toFixed(1)}`}
                suffix="%"
                trend="up"
              />
              <MetricCard
                icon={<Zap className="w-5 h-5 text-yellow-400" />}
                label="Requests"
                value={formatNumber(metrics.requests)}
                suffix="/mo"
                trend="up"
              />
              <MetricCard
                icon={<Clock className="w-5 h-5 text-blue-400" />}
                label="Avg Latency"
                value={Math.round(metrics.latency)}
                suffix="ms"
                trend="stable"
              />
              <MetricCard
                icon={<Eye className="w-5 h-5 text-purple-400" />}
                label="Errors"
                value={metrics.errors}
                suffix="total"
              />
              <MetricCard
                icon={<Lock className="w-5 h-5 text-red-400" />}
                label="Threat Level"
                value="0.02"
                suffix="%"
                trend="down"
              />
              <MetricCard
                icon={<Globe className="w-5 h-5 text-cyan-400" />}
                label="Uptime"
                value="99.99"
                suffix="%"
                trend="up"
              />
            </div>
            
            {/* Financial Preview */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="mt-6 p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 
                       border border-green-500/30 backdrop-blur-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-400 uppercase tracking-wider">Proyección Mes 12</p>
                  <p className="text-2xl font-bold text-white">$50M MXN</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-green-400 uppercase tracking-wider">Profit</p>
                  <p className="text-xl font-bold text-green-400">+$42.8M</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Bottom gradient border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
      
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-primary/30 rounded-tl-3xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-secondary/30 rounded-tr-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-accent/30 rounded-bl-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-primary/30 rounded-br-3xl pointer-events-none" />
    </section>
  );
};
