import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SECURITY_LAYERS } from '@/lib/omniverse-architecture';
import { Shield, Lock, Eye, Brain, Wallet, Database, Cloud, Server, Activity, FileCheck, Cpu, Glasses, AlertTriangle, Scale, Users } from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  'network': <Cloud className="w-5 h-5" />,
  'transport': <Lock className="w-5 h-5" />,
  'identity': <Users className="w-5 h-5" />,
  'data': <Database className="w-5 h-5" />,
  'runtime': <Cpu className="w-5 h-5" />,
  'container': <Server className="w-5 h-5" />,
  'service': <Activity className="w-5 h-5" />,
  'api': <FileCheck className="w-5 h-5" />,
  'graph': <Eye className="w-5 h-5" />,
  'ai': <Brain className="w-5 h-5" />,
  'ml': <Brain className="w-5 h-5" />,
  'xr': <Glasses className="w-5 h-5" />,
  'wallet': <Wallet className="w-5 h-5" />,
  'blockchain': <Shield className="w-5 h-5" />,
  'storage': <Database className="w-5 h-5" />,
  'logging': <FileCheck className="w-5 h-5" />,
  'observability': <Eye className="w-5 h-5" />,
  'backup': <Cloud className="w-5 h-5" />,
  'quantum': <Cpu className="w-5 h-5" />,
  'governance': <Scale className="w-5 h-5" />,
  'legal': <Scale className="w-5 h-5" />,
  'human-safety': <Users className="w-5 h-5" />
};

export const SecurityLayersGrid = () => {
  const totalMitigations = SECURITY_LAYERS.reduce((sum, l) => sum + l.mitigations, 0);
  const activeCount = SECURITY_LAYERS.filter(l => l.status === 'active').length;

  return (
    <section className="py-12">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              22 Capas de Seguridad
            </span>
          </h2>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
            <Shield className="w-4 h-4 mr-2" />
            {activeCount}/22 Activas
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Arquitectura Zero-Trust con {totalMitigations} mitigaciones implementadas
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard 
          label="Capas Activas"
          value={`${activeCount}/22`}
          color="green"
        />
        <StatCard 
          label="Mitigaciones"
          value={totalMitigations}
          color="blue"
        />
        <StatCard 
          label="Amenazas Bloqueadas"
          value="0"
          color="yellow"
        />
        <StatCard 
          label="Score de Seguridad"
          value="100%"
          color="purple"
        />
      </div>

      {/* Layers Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {SECURITY_LAYERS.map((layer, index) => (
          <motion.div
            key={layer.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03 }}
          >
            <Card className="bg-card/50 backdrop-blur-xl border-border/50 hover:border-green-500/50 transition-all group h-full">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${
                  layer.status === 'active' ? 'bg-green-500/20 text-green-400' : 
                  layer.status === 'monitoring' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {categoryIcons[layer.category] || <Shield className="w-5 h-5" />}
                </div>
                <div className="text-xs font-mono text-muted-foreground mb-1">
                  L{String(layer.id).padStart(2, '0')}
                </div>
                <div className="text-xs font-semibold text-foreground line-clamp-2">
                  {layer.name}
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  {layer.mitigations} mitigaciones
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const StatCard = ({ 
  label, 
  value, 
  color 
}: { 
  label: string; 
  value: string | number; 
  color: 'green' | 'blue' | 'yellow' | 'purple';
}) => {
  const colorClasses = {
    green: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
    blue: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
    yellow: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30',
    purple: 'from-purple-500/20 to-pink-500/20 border-purple-500/30'
  };

  const textColors = {
    green: 'text-green-400',
    blue: 'text-blue-400',
    yellow: 'text-yellow-400',
    purple: 'text-purple-400'
  };

  return (
    <Card className={`bg-gradient-to-br ${colorClasses[color]} border backdrop-blur-xl`}>
      <CardContent className="p-4 text-center">
        <div className={`text-2xl font-bold ${textColors[color]}`}>{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  );
};

export default SecurityLayersGrid;
