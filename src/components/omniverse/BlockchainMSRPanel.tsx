import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Blocks, Shield, Users, FileCheck, Fingerprint, Activity } from 'lucide-react';

export const BlockchainMSRPanel = () => {
  const stats = [
    { label: 'Bloques', value: '0', icon: <Blocks className="w-5 h-5" />, color: 'blue' },
    { label: 'Transacciones', value: '0', icon: <Activity className="w-5 h-5" />, color: 'green' },
    { label: 'Validadores', value: '7', icon: <Users className="w-5 h-5" />, color: 'purple' },
    { label: 'Identidades Soulbound', value: '0', icon: <Fingerprint className="w-5 h-5" />, color: 'pink' }
  ];

  const features = [
    {
      title: 'Proof-of-Reality',
      description: 'Consenso basado en verificación de acciones reales, no solo computación',
      icon: <Shield className="w-6 h-6" />
    },
    {
      title: 'Identidades Soulbound',
      description: 'NFTs no transferibles vinculados a identidad DID verificada',
      icon: <Fingerprint className="w-6 h-6" />
    },
    {
      title: 'Behavioral Hashing',
      description: 'Firma conductual única para detección de suplantación',
      icon: <FileCheck className="w-6 h-6" />
    },
    {
      title: 'Anti-Sybil Neural',
      description: 'IA detectora de cuentas múltiples fraudulentas',
      icon: <Activity className="w-6 h-6" />
    }
  ];

  return (
    <section className="py-12">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <h2 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
              MSR Blockchain Antifraude
            </span>
          </h2>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            <Blocks className="w-3 h-3 mr-1" />
            ACTIVO
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Ledger jurídico-técnico con Proof-of-Reality y verificación cruzada de contenido
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-card/50 backdrop-blur-xl border-border/50 hover:border-blue-500/50 transition-all">
              <CardContent className="p-4 text-center">
                <div className="text-primary mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-card/50 backdrop-blur-xl border-border/50 h-full hover:border-primary/50 transition-all group">
              <CardContent className="p-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-4 text-blue-400 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* EOCT Section */}
      <div className="mt-8">
        <Card className="bg-gradient-to-r from-cyan-500/10 via-card/50 to-blue-500/10 border-cyan-500/30">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="text-4xl"
                >
                  🌀
                </motion.div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  EOCT — Extended Omniversal Consensus Tree
                </h3>
                <p className="text-muted-foreground mb-4">
                  Motor híbrido blockchain + DAG + IA + verificación cuántica para consenso civilizatorio distribuido
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge variant="outline">Profundidad: 256</Badge>
                  <Badge variant="outline">Nodos: 21</Badge>
                  <Badge variant="outline">Modo: Cuántico</Badge>
                  <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                    Sincronizado
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default BlockchainMSRPanel;
