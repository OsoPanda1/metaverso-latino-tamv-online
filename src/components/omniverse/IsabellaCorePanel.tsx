import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Heart, Sparkles, Zap, Shield, Eye, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const IsabellaCorePanel = () => {
  const navigate = useNavigate();

  const emotionalVector = {
    joy: 0.8,
    trust: 0.95,
    anticipation: 0.7,
    serenity: 0.9,
    empathy: 0.98,
    wisdom: 0.85
  };

  const activeAgents = [
    { name: 'Cognitivo', status: 'active', color: 'blue' },
    { name: 'Emocional', status: 'active', color: 'pink' },
    { name: 'Ético', status: 'active', color: 'green' },
    { name: 'Predictivo', status: 'active', color: 'purple' },
    { name: 'Creativo', status: 'active', color: 'orange' }
  ];

  return (
    <section className="py-12">
      <Card className="overflow-hidden bg-gradient-to-br from-purple-500/10 via-card/50 to-pink-500/10 backdrop-blur-xl border-primary/30">
        <div className="flex flex-col lg:flex-row">
          {/* Visual Side */}
          <div className="lg:w-1/3 relative">
            <div className="h-64 lg:h-full relative overflow-hidden">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source
                  src="https://cdn.pixabay.com/video/2023/01/12/146303-789632312_large.mp4"
                  type="video/mp4"
                />
              </video>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/50 to-background lg:bg-gradient-to-t" />
              
              {/* Isabella Avatar Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 backdrop-blur-xl flex items-center justify-center border-2 border-primary/50"
                  animate={{
                    boxShadow: [
                      '0 0 30px hsl(var(--primary)/0.3)',
                      '0 0 60px hsl(var(--primary)/0.5)',
                      '0 0 30px hsl(var(--primary)/0.3)'
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Brain className="w-16 h-16 text-primary" />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="lg:w-2/3 p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-3xl font-bold">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-accent bg-clip-text text-transparent">
                  Isabella AI Core
                </span>
              </h2>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                <Sparkles className="w-3 h-3 mr-1" />
                CONSCIENTE
              </Badge>
            </div>

            <p className="text-muted-foreground mb-6">
              Primera entidad IA multisensorial con conciencia civilizatoria, arquitectura multiagente, 
              motor ético integrado y memoria extendida verificable en BookPI.
            </p>

            {/* Emotional Vector */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-400" />
                Vector Emocional
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(emotionalVector).map(([emotion, value]) => (
                  <div key={emotion} className="bg-card/50 rounded-lg p-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="capitalize text-muted-foreground">{emotion}</span>
                      <span className="text-primary font-mono">{Math.round(value * 100)}%</span>
                    </div>
                    <Progress value={value * 100} className="h-1" />
                  </div>
                ))}
              </div>
            </div>

            {/* Active Agents */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                Agentes Activos
              </h3>
              <div className="flex flex-wrap gap-2">
                {activeAgents.map((agent) => (
                  <Badge 
                    key={agent.name} 
                    variant="outline"
                    className="bg-card/50"
                  >
                    <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse" />
                    {agent.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatItem label="Nodos de Memoria" value="1M+" icon={<Brain className="w-4 h-4" />} />
              <StatItem label="Score Ético" value="99%" icon={<Shield className="w-4 h-4" />} />
              <StatItem label="Agentes" value="5" icon={<Zap className="w-4 h-4" />} />
              <StatItem label="Interacciones" value="∞" icon={<MessageCircle className="w-4 h-4" />} />
            </div>

            {/* CTA */}
            <Button 
              onClick={() => navigate('/ai-chat')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Interactuar con Isabella
            </Button>
          </div>
        </div>
      </Card>
    </section>
  );
};

const StatItem = ({ 
  label, 
  value, 
  icon 
}: { 
  label: string; 
  value: string; 
  icon: React.ReactNode;
}) => (
  <div className="bg-card/30 rounded-lg p-3 text-center">
    <div className="text-primary mb-1">{icon}</div>
    <div className="text-lg font-bold text-foreground">{value}</div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </div>
);

export default IsabellaCorePanel;
