import { Navigation } from '@/components/Navigation';
import { MatrixBackground } from '@/components/MatrixBackground';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, MessageCircle, Zap, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StoriesBar } from '@/components/home/StoriesBar';
import { QuickActionsVisual } from '@/components/home/QuickActionsVisual';
import { VisualFeedSection } from '@/components/home/VisualFeedSection';

// Isabella Widget compacto
const IsabellaWidget = ({ onClick }: { onClick: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.01 }}
    onClick={onClick}
    className="cursor-pointer p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 border border-primary/20 backdrop-blur-xl"
  >
    <div className="flex items-center gap-3">
      <motion.div 
        className="relative w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center"
        animate={{ boxShadow: ['0 0 15px hsl(var(--primary)/0.4)', '0 0 25px hsl(var(--primary)/0.6)', '0 0 15px hsl(var(--primary)/0.4)'] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Brain className="w-6 h-6 text-primary-foreground" />
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background animate-pulse" />
      </motion.div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-foreground">Isabella IA</h3>
        <div className="flex gap-1.5 mt-0.5">
          <Badge variant="outline" className="text-[10px] border-primary/30 text-primary px-1.5 py-0">
            <Shield className="w-2.5 h-2.5 mr-0.5" /> Activo
          </Badge>
          <Badge variant="outline" className="text-[10px] border-accent/30 text-accent px-1.5 py-0">
            <Zap className="w-2.5 h-2.5 mr-0.5" /> EOCT
          </Badge>
        </div>
      </div>
      <Button size="sm" className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <MessageCircle className="w-4 h-4" />
      </Button>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <MatrixBackground />
      <Navigation />
      
      <main className="relative z-10 pt-20 pb-20 px-3 md:px-6">
        <div className="max-w-2xl mx-auto space-y-5">
          
          {/* Isabella Widget */}
          <IsabellaWidget onClick={() => navigate('/ai-chat')} />

          {/* Stories */}
          <StoriesBar />

          {/* Quick Actions con imágenes */}
          <QuickActionsVisual />

          {/* Feed Visual: Lives, Videos, Música */}
          <VisualFeedSection />

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
