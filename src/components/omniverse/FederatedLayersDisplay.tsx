import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FEDERATED_LAYERS } from '@/lib/omniverse-architecture';
import { CheckCircle, Activity, Clock, Server } from 'lucide-react';

export const FederatedLayersDisplay = () => {
  return (
    <section className="py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            7 Capas Federadas
          </span>
        </h2>
        <p className="text-muted-foreground">
          Arquitectura civilizatoria con federaciones autónomas e interoperables
        </p>
      </div>

      <div className="grid gap-4">
        {FEDERATED_LAYERS.map((layer, index) => (
          <motion.div
            key={layer.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden bg-card/50 backdrop-blur-xl border-border/50 hover:border-primary/50 transition-all group">
              <div className="flex flex-col md:flex-row">
                {/* Layer Image */}
                <div className="md:w-48 h-32 md:h-auto relative overflow-hidden">
                  <img
                    src={getLayerImage(layer.id)}
                    alt={layer.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/80" />
                  <div 
                    className="absolute top-4 left-4 w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{ background: `linear-gradient(135deg, ${layer.color}, transparent)` }}
                  >
                    {layer.icon}
                  </div>
                </div>

                {/* Layer Content */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-1">
                        F{layer.id} — {layer.name}
                      </h3>
                      <code className="text-xs text-muted-foreground font-mono">
                        {layer.codename}
                      </code>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`${layer.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400'}`}
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {layer.status.toUpperCase()}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    {layer.description}
                  </p>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <MetricItem 
                      icon={<Server className="w-4 h-4" />}
                      label="Endpoints"
                      value={layer.endpoints}
                    />
                    <MetricItem 
                      icon={<Clock className="w-4 h-4" />}
                      label="Latencia"
                      value={`${layer.latencyMs}ms`}
                    />
                    <MetricItem 
                      icon={<Activity className="w-4 h-4" />}
                      label="Servicios"
                      value={layer.services.length}
                    />
                    <MetricItem 
                      icon={<CheckCircle className="w-4 h-4" />}
                      label="Entangled"
                      value={layer.entangled ? 'Sí' : 'No'}
                    />
                  </div>

                  {/* Protocols */}
                  <div className="flex flex-wrap gap-2">
                    {layer.protocols.slice(0, 4).map((protocol) => (
                      <Badge key={protocol} variant="secondary" className="text-xs">
                        {protocol}
                      </Badge>
                    ))}
                    {layer.protocols.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{layer.protocols.length - 4} más
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Health Bar */}
                <div className="md:w-32 p-4 flex flex-col justify-center items-center border-t md:border-t-0 md:border-l border-border/30">
                  <div className="text-2xl font-bold text-green-400 mb-1">100%</div>
                  <div className="text-xs text-muted-foreground mb-2">Health</div>
                  <Progress value={100} className="w-full h-2" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const MetricItem = ({ 
  icon, 
  label, 
  value 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string | number;
}) => (
  <div className="flex items-center gap-2">
    <div className="text-primary">{icon}</div>
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold text-foreground">{value}</div>
    </div>
  </div>
);

function getLayerImage(layerId: number): string {
  const images: Record<number, string> = {
    1: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop', // Identity/blockchain
    2: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop', // Data/servers
    3: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop', // Global network
    4: 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=400&h=300&fit=crop', // VR/XR
    5: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop', // Governance/law
    6: 'https://images.unsplash.com/photo-1642104704074-907c0698b98d?w=400&h=300&fit=crop', // Crypto/economy
    7: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop'  // Hardware/physical
  };
  return images[layerId] || images[1];
}

export default FederatedLayersDisplay;
