import { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { MatrixBackground } from '@/components/MatrixBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Brain, Network, Sparkles, Activity, Play, Heart, MessageCircle, 
  Users, Zap, TrendingUp, Star, Music, Video, Palette, Shield,
  Eye, Crown, Gift, Radio, Flame, Globe, Rocket, Gem, BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

// Partículas flotantes estilo metaverso
const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(50)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-primary/40 rounded-full"
        initial={{ 
          x: Math.random() * window.innerWidth, 
          y: Math.random() * window.innerHeight,
          scale: Math.random() * 0.5 + 0.5
        }}
        animate={{ 
          y: [null, Math.random() * -200 - 100],
          x: [null, (Math.random() - 0.5) * 100],
          opacity: [0.2, 0.8, 0]
        }}
        transition={{ 
          duration: Math.random() * 10 + 10, 
          repeat: Infinity, 
          ease: "linear",
          delay: Math.random() * 5
        }}
      />
    ))}
  </div>
);

// Orbs de energía estilo holográfico
const EnergyOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          width: 200 + i * 100,
          height: 200 + i * 100,
          background: `radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)`,
          filter: 'blur(40px)'
        }}
        initial={{ 
          x: Math.random() * 100 - 50 + '%', 
          y: Math.random() * 100 - 50 + '%' 
        }}
        animate={{ 
          x: [null, Math.random() * 20 - 10 + '%'],
          y: [null, Math.random() * 20 - 10 + '%'],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 15 + i * 5, 
          repeat: Infinity, 
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />
    ))}
  </div>
);

// Feed Card Inmersivo
const ImmersiveFeedCard = ({ 
  title, 
  subtitle, 
  icon: Icon, 
  gradient, 
  stats, 
  isLive,
  onClick 
}: {
  title: string;
  subtitle: string;
  icon: any;
  gradient: string;
  stats?: { views?: number; likes?: number };
  isLive?: boolean;
  onClick?: () => void;
}) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -5 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="relative group cursor-pointer"
  >
    <div className={`absolute inset-0 ${gradient} rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity`} />
    <Card className="relative overflow-hidden border-0 bg-card/40 backdrop-blur-xl hover:bg-card/60 transition-all">
      <div className={`absolute inset-0 ${gradient} opacity-5`} />
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${gradient}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {isLive && (
            <Badge className="bg-destructive text-white animate-pulse">
              <Radio className="w-3 h-3 mr-1" /> EN VIVO
            </Badge>
          )}
        </div>
        <h3 className="font-bold text-lg text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{subtitle}</p>
        {stats && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {stats.views && (
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" /> {stats.views.toLocaleString()}
              </span>
            )}
            {stats.likes && (
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" /> {stats.likes.toLocaleString()}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  </motion.div>
);

// Creator Stats Panel
const CreatorStatsPanel = ({ stats }: { stats: any }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-2xl" />
    <Card className="relative border-0 bg-card/30 backdrop-blur-2xl overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary" />
      <CardContent className="p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Seguidores', value: stats.followers || '0', icon: Users, color: 'text-primary' },
            { label: 'Vistas Totales', value: stats.views || '0', icon: Eye, color: 'text-accent' },
            { label: 'Interacciones', value: stats.interactions || '0', icon: Heart, color: 'text-destructive' },
            { label: 'Ganancias', value: `$${stats.earnings || '0'}`, icon: Gem, color: 'text-secondary' },
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
              <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

// Isabella AI Status Widget
const IsabellaWidget = ({ onClick }: { onClick: () => void }) => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    whileHover={{ scale: 1.02 }}
    onClick={onClick}
    className="cursor-pointer"
  >
    <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-br from-card/80 to-primary/5 backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
      <CardContent className="relative p-6">
        <div className="flex items-center gap-4">
          <motion.div 
            className="relative"
            animate={{ 
              boxShadow: ['0 0 20px hsl(var(--primary)/0.5)', '0 0 40px hsl(var(--primary)/0.8)', '0 0 20px hsl(var(--primary)/0.5)']
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Brain className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-card animate-pulse" />
          </motion.div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gradient">Isabella IA NextGen</h3>
            <p className="text-sm text-muted-foreground">Sistema Cognitivo Emocional Activo</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="border-primary/50 text-primary">
                <Shield className="w-3 h-3 mr-1" /> Guardianes Activos
              </Badge>
              <Badge variant="outline" className="border-accent/50 text-accent">
                <Zap className="w-3 h-3 mr-1" /> EOCT Online
              </Badge>
            </div>
          </div>
          <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
            <MessageCircle className="w-5 h-5 mr-2" /> Conversar
          </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

// Quick Actions Grid
const QuickActionsGrid = ({ navigate }: { navigate: any }) => {
  const actions = [
    { label: 'Crear Live', icon: Video, gradient: 'bg-gradient-to-br from-red-500 to-pink-500', path: '/lives' },
    { label: 'Subir Arte', icon: Palette, gradient: 'bg-gradient-to-br from-purple-500 to-indigo-500', path: '/artworks' },
    { label: 'Música', icon: Music, gradient: 'bg-gradient-to-br from-green-500 to-emerald-500', path: '/music' },
    { label: 'DreamSpaces', icon: Globe, gradient: 'bg-gradient-to-br from-cyan-500 to-blue-500', path: '/dreamspaces' },
    { label: 'Marketplace', icon: Gift, gradient: 'bg-gradient-to-br from-orange-500 to-amber-500', path: '/marketplace' },
    { label: 'Wallet', icon: Gem, gradient: 'bg-gradient-to-br from-violet-500 to-purple-500', path: '/credits' },
  ];

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
      {actions.map((action, i) => (
        <motion.div
          key={action.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(action.path)}
          className="cursor-pointer"
        >
          <div className={`${action.gradient} rounded-2xl p-4 aspect-square flex flex-col items-center justify-center gap-2 shadow-lg`}>
            <action.icon className="w-8 h-8 text-white" />
            <span className="text-xs text-white font-medium text-center">{action.label}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Trending Section
const TrendingSection = () => {
  const trending = [
    { tag: '#ConciertosXR', posts: '12.5K', trend: '+45%' },
    { tag: '#ArteDigital', posts: '8.2K', trend: '+32%' },
    { tag: '#IsabellaIA', posts: '6.8K', trend: '+78%' },
    { tag: '#MetaversoLatino', posts: '5.1K', trend: '+21%' },
  ];

  return (
    <Card className="border-0 bg-card/30 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-destructive" />
          <span className="text-gradient">Tendencias</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {trending.map((item, i) => (
          <motion.div
            key={item.tag}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <div>
              <div className="font-semibold text-foreground">{item.tag}</div>
              <div className="text-xs text-muted-foreground">{item.posts} publicaciones</div>
            </div>
            <Badge variant="outline" className="text-green-400 border-green-400/50">
              <TrendingUp className="w-3 h-3 mr-1" /> {item.trend}
            </Badge>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
};

// Live Streams Preview
const LiveStreamsPreview = ({ navigate }: { navigate: any }) => {
  const lives = [
    { title: 'Concierto Sensorial XR', viewers: 1234, host: 'ArtistaMX', isLive: true },
    { title: 'Clase de Arte Digital', viewers: 567, host: 'Maestro3D', isLive: true },
    { title: 'Gaming Metaverso', viewers: 890, host: 'GamerPro', isLive: true },
  ];

  return (
    <Card className="border-0 bg-card/30 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-destructive animate-pulse" />
            <span className="text-gradient">En Vivo Ahora</span>
          </span>
          <Button variant="ghost" size="sm" onClick={() => navigate('/lives')}>
            Ver todos
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {lives.map((live, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-destructive/10 to-transparent hover:from-destructive/20 transition-all cursor-pointer"
          >
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-destructive to-orange-500 flex items-center justify-center">
              <Play className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-foreground">{live.title}</div>
              <div className="text-xs text-muted-foreground">@{live.host}</div>
            </div>
            <div className="flex items-center gap-1 text-destructive">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">{live.viewers.toLocaleString()}</span>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    entities: 0,
    interactions: 0,
    assets: 0,
    followers: 0,
    views: 0,
    earnings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        const [entitiesRes, interactionsRes, assetsRes] = await Promise.all([
          supabase.from('nexus_entities').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
          supabase.from('ai_interactions').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
          supabase.from('digital_assets').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        ]);

        setStats({
          entities: entitiesRes.count || 0,
          interactions: interactionsRes.count || 0,
          assets: assetsRes.count || 0,
          followers: Math.floor(Math.random() * 10000),
          views: Math.floor(Math.random() * 100000),
          earnings: Math.floor(Math.random() * 5000)
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast.error('Error cargando estadísticas');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <MatrixBackground />
      <FloatingParticles />
      <EnergyOrbs />
      <Navigation />
      
      <main className="relative z-10 pt-24 pb-12 px-4 md:px-8">
        <div className="container mx-auto max-w-7xl space-y-8">
          
          {/* Header con bienvenida */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-block"
            >
              <Crown className="w-12 h-12 text-primary mx-auto mb-4" />
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="text-gradient">Bienvenido al Nexus</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tu centro de creación digital en el metaverso latinoamericano
            </p>
          </motion.div>

          {/* Isabella Widget */}
          <IsabellaWidget onClick={() => navigate('/ai-chat')} />

          {/* Creator Stats */}
          <CreatorStatsPanel stats={stats} />

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-gradient mb-6">Acciones Rápidas</h2>
            <QuickActionsGrid navigate={navigate} />
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Feed */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold text-gradient">Tu Feed Personalizado</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <ImmersiveFeedCard
                  title="Galería de Arte Digital"
                  subtitle="Explora las últimas creaciones"
                  icon={Palette}
                  gradient="bg-gradient-to-br from-purple-600 to-pink-600"
                  stats={{ views: 12500, likes: 890 }}
                  onClick={() => navigate('/gallery')}
                />
                <ImmersiveFeedCard
                  title="Conciertos Sensoriales"
                  subtitle="Experiencias inmersivas XR"
                  icon={Music}
                  gradient="bg-gradient-to-br from-cyan-600 to-blue-600"
                  stats={{ views: 8900, likes: 450 }}
                  isLive
                  onClick={() => navigate('/dreamspaces')}
                />
                <ImmersiveFeedCard
                  title="Comunidad Creadores"
                  subtitle="Conecta con artistas"
                  icon={Users}
                  gradient="bg-gradient-to-br from-green-600 to-emerald-600"
                  stats={{ views: 5600, likes: 320 }}
                  onClick={() => navigate('/social')}
                />
                <ImmersiveFeedCard
                  title="Marketplace DAO"
                  subtitle="Assets digitales únicos"
                  icon={Gem}
                  gradient="bg-gradient-to-br from-orange-600 to-red-600"
                  stats={{ views: 15200, likes: 1100 }}
                  onClick={() => navigate('/marketplace')}
                />
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              <LiveStreamsPreview navigate={navigate} />
              <TrendingSection />
            </div>
          </div>

          {/* Bottom Section - System Status */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-primary/20 bg-card/20 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-sm text-muted-foreground">Sistema Federado Activo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Guardianes: 100%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-accent" />
                      <span className="text-sm text-muted-foreground">EOCT: Operativo</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate('/metrics')}>
                    <BarChart3 className="w-4 h-4 mr-2" /> Ver Métricas
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
