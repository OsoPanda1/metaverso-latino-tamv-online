import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { GUARDIAN_ENTITIES, ANTIFRAUD_RADARS } from '@/lib/omniverse-architecture';
import { Eye, Shield, Activity } from 'lucide-react';

export const GuardiansCluster = () => {
  return (
    <section className="py-12">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Guardians */}
        <div>
          <h2 className="text-2xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Guardianía Paralela Distribuida
            </span>
          </h2>
          
          <div className="space-y-4">
            {GUARDIAN_ENTITIES.map((guardian, index) => (
              <motion.div
                key={guardian.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-card/50 backdrop-blur-xl border-border/50 hover:border-primary/50 transition-all overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-3xl">
                          {guardian.icon}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${
                          guardian.status === 'vigilant' ? 'bg-green-500' :
                          guardian.status === 'responding' ? 'bg-yellow-500' : 'bg-gray-500'
                        }`} />
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-foreground">{guardian.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {guardian.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-primary mb-1">{guardian.role}</div>
                        <div className="text-xs text-muted-foreground">{guardian.domain}</div>
                      </div>

                      {/* Power Level */}
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{guardian.powerLevel}</div>
                        <div className="text-xs text-muted-foreground">Power</div>
                        <Progress value={guardian.powerLevel} className="w-16 h-1 mt-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Anti-Fraud Radars */}
        <div>
          <h2 className="text-2xl font-bold mb-6">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              4 Radares Antifraude
            </span>
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {ANTIFRAUD_RADARS.map((radar, index) => (
              <motion.div
                key={radar.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-card/50 backdrop-blur-xl border-border/50 hover:border-yellow-500/50 transition-all h-full">
                  <CardContent className="p-5">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl">{radar.icon}</div>
                      <Badge 
                        variant="outline" 
                        className={`${
                          radar.status === 'scanning' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                          radar.status === 'alert' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                          'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        <Activity className="w-3 h-3 mr-1 animate-pulse" />
                        {radar.status}
                      </Badge>
                    </div>

                    {/* Name & Codename */}
                    <h3 className="font-bold text-foreground mb-1">{radar.name}</h3>
                    <code className="text-xs text-muted-foreground font-mono">{radar.codename}</code>

                    {/* Function */}
                    <p className="text-xs text-muted-foreground mt-3 mb-4">
                      {radar.function}
                    </p>

                    {/* Stats */}
                    <div className="flex justify-between text-center border-t border-border/30 pt-3">
                      <div>
                        <div className="text-xl font-bold text-foreground">{radar.detections}</div>
                        <div className="text-[10px] text-muted-foreground">Detecciones</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-green-400">{radar.accuracy}%</div>
                        <div className="text-[10px] text-muted-foreground">Precisión</div>
                      </div>
                    </div>

                    {/* Radar Animation */}
                    <div className="mt-4 relative h-20 flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-primary/5 to-accent/5">
                      <motion.div
                        className="absolute w-24 h-24 border-2 border-primary/30 rounded-full"
                        animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <motion.div
                        className="absolute w-16 h-16 border-2 border-primary/40 rounded-full"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0.2, 0.6] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                      />
                      <Eye className="w-6 h-6 text-primary relative z-10" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuardiansCluster;
