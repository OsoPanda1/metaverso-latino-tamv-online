import { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
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
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gradient mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back to your digital nexus</p>
          </div>

          {/* Stats Grid */}
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

          {/* Quick Actions */}
          <Card className="border-primary/30 glow-cyan mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Quick Actions
              </CardTitle>
              <CardDescription>Get started with these common tasks</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
              <Button
                onClick={() => navigate('/ai-chat')}
                className="h-auto py-6 flex flex-col items-center gap-2 glow-cyan"
              >
                <Brain className="w-6 h-6" />
                <span>AI Assistant</span>
              </Button>
              <Button
                onClick={() => navigate('/nexus')}
                variant="outline"
                className="h-auto py-6 flex flex-col items-center gap-2 border-primary/50"
              >
                <Network className="w-6 h-6" />
                <span>Manage Entities</span>
              </Button>
              <Button
                onClick={() => navigate('/assets')}
                variant="outline"
                className="h-auto py-6 flex flex-col items-center gap-2 border-primary/50"
              >
                <Sparkles className="w-6 h-6" />
                <span>Digital Assets</span>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions in the nexus</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No recent activity yet. Start by creating your first entity or chatting with AI!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
