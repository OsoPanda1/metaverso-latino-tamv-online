import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Shield, AlertCircle, CheckCircle, XCircle, Bell, BellOff } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { SecurityDashboard } from "@/components/features/SecurityDashboard";

interface Guardian {
  id: string;
  name: string;
  guardian_type: string;
  status: string;
  trust_score: number;
  alerts_enabled: boolean;
  strict_mode: boolean;
}

interface Alert {
  id: string;
  alert_type: string;
  severity: string;
  title: string;
  description: string | null;
  resolved: boolean;
  created_at: string;
  guardian_id: string;
}

const Guardians = () => {
  const { user } = useAuth();
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchGuardians();
      fetchAlerts();
      initializeDefaultGuardians();
      setupRealtime();
    }
  }, [user]);

  const initializeDefaultGuardians = async () => {
    try {
      const { data: existing } = await supabase
        .from("guardians")
        .select("*")
        .eq("user_id", user?.id);

      if (!existing || existing.length === 0) {
        const defaultGuardians = [
          { name: "Guardian de Seguridad", guardian_type: "security" },
          { name: "Guardian de Privacidad", guardian_type: "privacy" },
          { name: "Guardian Emocional", guardian_type: "emotional" },
        ];

        await supabase.from("guardians").insert(
          defaultGuardians.map(g => ({
            ...g,
            user_id: user?.id,
          }))
        );
        fetchGuardians();
      }
    } catch (error) {
      console.error("Error initializing guardians:", error);
    }
  };

  const fetchGuardians = async () => {
    try {
      const { data, error } = await supabase
        .from("guardians")
        .select("*")
        .eq("user_id", user?.id);

      if (error) throw error;
      setGuardians(data || []);
    } catch (error: any) {
      toast.error("Error al cargar guardianes");
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from("guardian_alerts")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setAlerts(data || []);
    } catch (error: any) {
      toast.error("Error al cargar alertas");
    }
  };

  const setupRealtime = () => {
    const channel = supabase
      .channel("guardian-alerts")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "guardian_alerts",
          filter: `user_id=eq.${user?.id}`,
        },
        (payload) => {
          toast.warning(`Nueva alerta: ${payload.new.title}`);
          fetchAlerts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const toggleAlerts = async (guardianId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("guardians")
        .update({ alerts_enabled: !currentStatus })
        .eq("id", guardianId);

      if (error) throw error;
      toast.success(!currentStatus ? "Alertas activadas" : "Alertas desactivadas");
      fetchGuardians();
    } catch (error: any) {
      toast.error("Error al cambiar alertas");
    }
  };

  const toggleStrictMode = async (guardianId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("guardians")
        .update({ strict_mode: !currentStatus })
        .eq("id", guardianId);

      if (error) throw error;
      toast.success(!currentStatus ? "Modo estricto activado" : "Modo estricto desactivado");
      fetchGuardians();
    } catch (error: any) {
      toast.error("Error al cambiar modo");
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from("guardian_alerts")
        .update({ resolved: true, resolved_at: new Date().toISOString() })
        .eq("id", alertId);

      if (error) throw error;
      toast.success("Alerta resuelta");
      fetchAlerts();
    } catch (error: any) {
      toast.error("Error al resolver alerta");
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low": return "bg-blue-500/10 text-blue-500";
      case "medium": return "bg-yellow-500/10 text-yellow-500";
      case "high": return "bg-orange-500/10 text-orange-500";
      case "critical": return "bg-red-500/10 text-red-500";
      default: return "bg-gray-500/10 text-gray-500";
    }
  };

  const getGuardianIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      security: "🔒",
      privacy: "🕵️",
      emotional: "💙",
    };
    return icons[type] || "🛡️";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const avgTrustScore = guardians.length > 0
    ? guardians.reduce((acc, g) => acc + g.trust_score, 0) / guardians.length
    : 0;

  const activeAlerts = alerts.filter(a => !a.resolved).length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Guardianes Computacionales
          </h1>
          <p className="text-muted-foreground mt-2">
            Protección proactiva · Monitoreo continuo · Alertas en tiempo real
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                TrustScore
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold">{(avgTrustScore * 100).toFixed(0)}%</div>
                <Progress value={avgTrustScore * 100} className="h-2" />
                <p className="text-sm text-muted-foreground">Nivel de integridad</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                Alertas Activas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-500">{activeAlerts}</div>
              <p className="text-sm text-muted-foreground">Requieren atención</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Guardianes Activos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">
                {guardians.filter(g => g.status === "active").length}
              </div>
              <p className="text-sm text-muted-foreground">Monitoreando</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <SecurityDashboard />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {guardians.map((guardian) => (
            <Card key={guardian.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getGuardianIcon(guardian.guardian_type)}</span>
                    <div>
                      <CardTitle>{guardian.name}</CardTitle>
                      <CardDescription className="capitalize">
                        {guardian.guardian_type}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={guardian.status === "active" ? "default" : "secondary"}>
                    {guardian.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>TrustScore</span>
                    <span className="font-semibold">{(guardian.trust_score * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={guardian.trust_score * 100} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {guardian.alerts_enabled ? (
                      <Bell className="h-4 w-4 text-primary" />
                    ) : (
                      <BellOff className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-sm">Alertas</span>
                  </div>
                  <Switch
                    checked={guardian.alerts_enabled}
                    onCheckedChange={() =>
                      toggleAlerts(guardian.id, guardian.alerts_enabled)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="text-sm">Modo Estricto</span>
                  </div>
                  <Switch
                    checked={guardian.strict_mode}
                    onCheckedChange={() =>
                      toggleStrictMode(guardian.id, guardian.strict_mode)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Historial de Alertas</CardTitle>
            <CardDescription>Últimas notificaciones de seguridad</CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-4 p-4 rounded-lg border bg-card"
                >
                  <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                    {alert.resolved ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <AlertCircle className="h-5 w-5" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{alert.title}</span>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {alert.alert_type}
                      </Badge>
                    </div>
                    {alert.description && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {alert.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(alert.created_at).toLocaleString()}
                    </p>
                  </div>

                  {!alert.resolved && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => resolveAlert(alert.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Resolver
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {alerts.length === 0 && (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No hay alertas registradas</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Guardians;
