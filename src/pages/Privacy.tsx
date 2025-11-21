import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Unlock, AlertTriangle } from "lucide-react";
import { Navigation } from "@/components/Navigation";

interface Permission {
  id: string;
  resource_type: string;
  granted_to: string;
  granted_to_type: string;
  permission_level: string;
  granted_at: string;
  revoked: boolean;
}

const Privacy = () => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPermissions();
      setupRealtime();
    }
  }, [user]);

  const fetchPermissions = async () => {
    try {
      const { data, error } = await supabase
        .from("data_permissions")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPermissions(data || []);
    } catch (error: any) {
      toast.error("Error al cargar permisos");
    } finally {
      setLoading(false);
    }
  };

  const setupRealtime = () => {
    const channel = supabase
      .channel("permissions-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "data_permissions",
          filter: `user_id=eq.${user?.id}`,
        },
        () => {
          fetchPermissions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const togglePermission = async (permissionId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("data_permissions")
        .update({ 
          revoked: !currentStatus,
          revoked_at: !currentStatus ? new Date().toISOString() : null 
        })
        .eq("id", permissionId);

      if (error) throw error;

      // Log de cambio de permiso
      await supabase.from("access_logs").insert({
        user_id: user?.id,
        event_type: !currentStatus ? "revoke" : "grant",
        resource_type: "permission",
        resource_id: permissionId,
      });

      toast.success(!currentStatus ? "Permiso revocado" : "Permiso restaurado");
      fetchPermissions();
    } catch (error: any) {
      toast.error("Error al cambiar permiso");
    }
  };

  const getResourceIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      profile: "👤",
      health: "🏥",
      emotions: "💭",
      art: "🎨",
      wallet: "💰",
      credentials: "🔐",
    };
    return icons[type] || "📦";
  };

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.resource_type]) {
      acc[permission.resource_type] = [];
    }
    acc[permission.resource_type].push(permission);
    return acc;
  }, {} as { [key: string]: Permission[] });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Panel de Privacidad
          </h1>
          <p className="text-muted-foreground mt-2">
            Control total sobre quién accede a tus datos · Revocación en tiempo real
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-green-500" />
                Activos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">
                {permissions.filter(p => !p.revoked).length}
              </div>
              <p className="text-sm text-muted-foreground">Permisos otorgados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Unlock className="h-5 w-5 text-red-500" />
                Revocados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-500">
                {permissions.filter(p => p.revoked).length}
              </div>
              <p className="text-sm text-muted-foreground">Permisos bloqueados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Zonas de Datos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-500">
                {Object.keys(groupedPermissions).length}
              </div>
              <p className="text-sm text-muted-foreground">Tipos de recursos</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedPermissions).map(([resourceType, perms]) => (
            <Card key={resourceType}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{getResourceIcon(resourceType)}</span>
                  <span className="capitalize">{resourceType}</span>
                  <Badge variant="outline" className="ml-auto">
                    {perms.length} permisos
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Gestiona el acceso a tu información de {resourceType}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {perms.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-md transition-all"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{permission.granted_to}</span>
                          <Badge variant="secondary" className="text-xs">
                            {permission.granted_to_type}
                          </Badge>
                          <Badge variant={permission.revoked ? "destructive" : "default"} className="text-xs">
                            {permission.permission_level}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Otorgado el {new Date(permission.granted_at).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        {permission.revoked ? (
                          <EyeOff className="h-5 w-5 text-red-500" />
                        ) : (
                          <Eye className="h-5 w-5 text-green-500" />
                        )}
                        <Switch
                          checked={!permission.revoked}
                          onCheckedChange={() =>
                            togglePermission(permission.id, permission.revoked)
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {permissions.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Lock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay permisos configurados</h3>
              <p className="text-muted-foreground">
                Cuando otorgues acceso a tus datos, aparecerán aquí para que puedas gestionarlos
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Privacy;
