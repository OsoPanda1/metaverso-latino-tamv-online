import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Shield, Plus, QrCode, Download, Trash2, Share2 } from "lucide-react";
import { Navigation } from "@/components/Navigation";

interface Credential {
  id: string;
  credential_type: string;
  did: string;
  name: string;
  email: string | null;
  status: string;
  issued_at: string;
  shared_with: any;
  revocable: boolean;
}

const IdNvida = () => {
  const { user } = useAuth();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCredential, setNewCredential] = useState({
    credential_type: "foundational",
    name: "",
    email: "",
  });

  useEffect(() => {
    if (user) {
      fetchCredentials();
    }
  }, [user]);

  const fetchCredentials = async () => {
    try {
      const { data, error } = await supabase
        .from("digital_credentials")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCredentials(data || []);
    } catch (error: any) {
      toast.error("Error al cargar credenciales");
    } finally {
      setLoading(false);
    }
  };

  const createCredential = async () => {
    if (!newCredential.name) {
      toast.error("El nombre es requerido");
      return;
    }

    try {
      const did = `did:tamv:${user?.id?.substring(0, 8)}-${Date.now()}`;
      
      const { error } = await supabase.from("digital_credentials").insert({
        user_id: user?.id,
        credential_type: newCredential.credential_type,
        did,
        name: newCredential.name,
        email: newCredential.email || user?.email,
        guardian_signature: `guardian-${Date.now()}`,
      });

      if (error) throw error;

      toast.success("Credencial creada exitosamente");
      setIsCreateOpen(false);
      setNewCredential({ credential_type: "foundational", name: "", email: "" });
      fetchCredentials();
    } catch (error: any) {
      toast.error("Error al crear credencial");
    }
  };

  const revokeCredential = async (credentialId: string) => {
    try {
      const { error } = await supabase
        .from("digital_credentials")
        .update({ status: "revoked" })
        .eq("id", credentialId);

      if (error) throw error;

      // Log de revocación
      await supabase.from("access_logs").insert({
        user_id: user?.id,
        event_type: "revoke",
        resource_type: "credential",
        resource_id: credentialId,
      });

      toast.success("Credencial revocada");
      fetchCredentials();
    } catch (error: any) {
      toast.error("Error al revocar credencial");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/10 text-green-500";
      case "revoked": return "bg-red-500/10 text-red-500";
      case "expired": return "bg-yellow-500/10 text-yellow-500";
      default: return "bg-gray-500/10 text-gray-500";
    }
  };

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ID-NVIDA™
            </h1>
            <p className="text-muted-foreground mt-2">
              Sistema de Identidad Auto-Soberana · Protegida · Auditable
            </p>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nueva Credencial
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nueva Credencial</DialogTitle>
                <DialogDescription>
                  Genera una nueva credencial verificable para tu identidad digital
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Credencial</Label>
                  <Select
                    value={newCredential.credential_type}
                    onValueChange={(value) =>
                      setNewCredential({ ...newCredential, credential_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="foundational">Fundacional</SelectItem>
                      <SelectItem value="age">Verificación de Edad</SelectItem>
                      <SelectItem value="membership">Membresía</SelectItem>
                      <SelectItem value="cell_access">Acceso Cell/Fork</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={newCredential.name}
                    onChange={(e) =>
                      setNewCredential({ ...newCredential, name: e.target.value })
                    }
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email (opcional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newCredential.email}
                    onChange={(e) =>
                      setNewCredential({ ...newCredential, email: e.target.value })
                    }
                    placeholder={user?.email || ""}
                  />
                </div>

                <Button onClick={createCredential} className="w-full">
                  Crear Credencial
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {credentials.map((credential) => (
            <Card key={credential.id} className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Shield className="h-8 w-8 text-primary" />
                  <Badge className={getStatusColor(credential.status)}>
                    {credential.status}
                  </Badge>
                </div>
                <CardTitle className="mt-4">{credential.name}</CardTitle>
                <CardDescription className="text-xs font-mono">
                  {credential.did}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tipo:</span>
                    <span className="font-medium capitalize">
                      {credential.credential_type.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Emitida:</span>
                    <span>{new Date(credential.issued_at).toLocaleDateString()}</span>
                  </div>
                  {credential.email && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="truncate ml-2">{credential.email}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <QrCode className="h-4 w-4 mr-1" />
                    QR
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share2 className="h-4 w-4 mr-1" />
                    Compartir
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="h-4 w-4 mr-1" />
                    Exportar
                  </Button>
                </div>

                {credential.revocable && credential.status === "active" && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={() => revokeCredential(credential.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Revocar Credencial
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {credentials.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tienes credenciales aún</h3>
              <p className="text-muted-foreground mb-4">
                Crea tu primera credencial verificable para comenzar
              </p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primera Credencial
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default IdNvida;
