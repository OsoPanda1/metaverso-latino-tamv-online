import { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { MatrixBackground } from '@/components/MatrixBackground';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Brain, Network, Sparkles, Plus, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    entities: 0,
    interactions: 0,
    assets: 0,
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
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast.error('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const statCards = [
    {
      title: 'Nexus Entities',
      value: stats.entities,
      icon: Network,
      description: 'Active digital entities',
      color: 'text-primary',
    },
    {
      title: 'AI Interactions',
      value: stats.interactions,
      icon: Brain,
      description: 'Total AI conversations',
      color: 'text-secondary',
    },
    {
      title: 'Digital Assets',
      value: stats.assets,
      icon: Sparkles,
      description: 'Stored assets',
      color: 'text-accent',
    },
  ];

  return (
    <>
      <MatrixBackground />
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 pb-12 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gradient mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back to your digital nexus</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {statCards.map((stat, index) => (
                <Card key={index} className="border-border/50 hover:border-primary/50 transition-all glow-cyan">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-3xl font-bold ${stat.color}`}>
                      {loading ? '...' : stat.value}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-primary/30 glow-cyan mb-8 animate-enter">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Acciones rápidas
                </CardTitle>
                <CardDescription>Accede a los módulos clave del Nexus.</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-4 gap-4">
                <Button onClick={() => navigate("/ai-chat")} className="h-auto py-6 flex flex-col items-center gap-2 glow-cyan hover-scale">
                  <Brain className="w-6 h-6" />
                  <span>Isabella</span>
                </Button>
                <Button onClick={() => navigate("/artworks")} variant="outline" className="h-auto py-6 flex flex-col items-center gap-2 border-primary/50 hover-scale">
                  <Sparkles className="w-6 h-6" />
                  <span>Artworks</span>
                </Button>
                <Button onClick={() => navigate("/metrics")} variant="outline" className="h-auto py-6 flex flex-col items-center gap-2 border-primary/50 hover-scale">
                  <Activity className="w-6 h-6" />
                  <span>Métricas</span>
                </Button>
                <Button onClick={() => navigate("/gallery")} variant="outline" className="h-auto py-6 flex flex-col items-center gap-2 border-primary/50 hover-scale">
                  <Network className="w-6 h-6" />
                  <span>Galería</span>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Sistema TAMV Activo</CardTitle>
                <CardDescription>ML, NFT, Pagos y Monitoreo funcionando</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Visita /artworks para ML recommendations y /metrics para monitoreo en tiempo real</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
