import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navigation } from '@/components/Navigation';
import { MatrixBackground } from '@/components/MatrixBackground';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity, TrendingUp, Users, DollarSign, AlertTriangle, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Metric {
  metric_name: string;
  metric_value: number;
  recorded_at: string;
}

export default function SystemMetrics() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [fraudAlerts, setFraudAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
    fetchFraudAlerts();
    
    // Real-time updates
    const channel = supabase
      .channel('system_metrics_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'system_metrics' }, () => {
        fetchMetrics();
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'fraud_alerts' }, () => {
        fetchFraudAlerts();
      })
      .subscribe();

    const interval = setInterval(fetchMetrics, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  const fetchMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('system_metrics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setMetrics(data || []);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFraudAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('fraud_alerts')
        .select('*')
        .eq('resolved', false)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setFraudAlerts(data || []);
    } catch (error) {
      console.error('Error fetching fraud alerts:', error);
    }
  };

  const getMetricsByType = (type: string) => {
    return metrics
      .filter(m => m.metric_name === type)
      .slice(0, 20)
      .reverse()
      .map(m => ({
        time: new Date(m.recorded_at).toLocaleTimeString(),
        value: m.metric_value
      }));
  };

  const stats = [
    {
      title: 'Active Users',
      value: metrics.find(m => m.metric_name === 'active_users')?.metric_value || 0,
      icon: Users,
      color: 'text-cyan-500',
      change: '+12%'
    },
    {
      title: 'Transactions',
      value: metrics.find(m => m.metric_name === 'total_transactions')?.metric_value || 0,
      icon: DollarSign,
      color: 'text-green-500',
      change: '+8%'
    },
    {
      title: 'System Health',
      value: `${metrics.find(m => m.metric_name === 'system_health')?.metric_value || 100}%`,
      icon: Activity,
      color: 'text-blue-500',
      change: 'Stable'
    },
    {
      title: 'Security Score',
      value: `${metrics.find(m => m.metric_name === 'security_score')?.metric_value || 95}%`,
      icon: Shield,
      color: 'text-purple-500',
      change: '+2%'
    }
  ];

  return (
    <>
      <MatrixBackground />
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">Panel de Monitoreo TAMV</h1>
          <p className="text-muted-foreground">Métricas en tiempo real del ecosistema</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Usuarios Activos</CardTitle>
              <CardDescription>Últimas 20 mediciones</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={getMetricsByType('active_users')}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(190, 95%, 55%)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(190, 95%, 55%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(190 60% 25%)" />
                  <XAxis dataKey="time" stroke="hsl(180 30% 65%)" />
                  <YAxis stroke="hsl(180 30% 65%)" />
                  <Tooltip contentStyle={{ background: 'hsl(220 25% 10%)', border: '1px solid hsl(190 60% 25%)' }} />
                  <Area type="monotone" dataKey="value" stroke="hsl(190, 95%, 55%)" fillOpacity={1} fill="url(#colorUsers)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Transacciones</CardTitle>
              <CardDescription>Volumen de operaciones</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getMetricsByType('total_transactions')}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(190 60% 25%)" />
                  <XAxis dataKey="time" stroke="hsl(180 30% 65%)" />
                  <YAxis stroke="hsl(180 30% 65%)" />
                  <Tooltip contentStyle={{ background: 'hsl(220 25% 10%)', border: '1px solid hsl(190 60% 25%)' }} />
                  <Line type="monotone" dataKey="value" stroke="hsl(170, 90%, 50%)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Fraud Alerts */}
        {fraudAlerts.length > 0 && (
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                Alertas de Seguridad
              </CardTitle>
              <CardDescription>Eventos que requieren atención</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fraudAlerts.map(alert => (
                  <div key={alert.id} className="flex items-start gap-4 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'}>
                          {alert.severity}
                        </Badge>
                        <span className="text-sm font-semibold">{alert.alert_type}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Score de anomalía: {(alert.anomaly_score * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(alert.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
