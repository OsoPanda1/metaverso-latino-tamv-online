import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Users, Video, Hash, Plus } from "lucide-react";
import { toast } from "sonner";

interface NexusEntity {
  id: string;
  name: string;
  entity_type: string;
  description: string | null;
  properties: any;
}

const SocialHub = () => {
  const { user } = useAuth();
  const [entities, setEntities] = useState<NexusEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    type: "channel",
    description: "",
    videoUrl: "",
  });

  const fetchEntities = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("nexus_entities")
      .select("id, name, entity_type, description, properties")
      .eq("user_id", user.id)
      .in("entity_type", ["channel", "group", "room"] as any)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      toast.error("No se pudieron cargar los canales y grupos");
    } else {
      setEntities(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEntities();
  }, [user]);

  const handleCreate = async () => {
    if (!user) {
      toast.error("Debes iniciar sesión para crear canales");
      return;
    }
    if (!form.name) {
      toast.error("El nombre es obligatorio");
      return;
    }

    try {
      const { error } = await supabase.from("nexus_entities").insert({
        user_id: user.id,
        name: form.name,
        entity_type: form.type,
        description: form.description || null,
        properties: form.videoUrl ? { videoUrl: form.videoUrl } : {},
      });

      if (error) throw error;
      toast.success("Canal / grupo creado");
      setForm({ name: "", type: "channel", description: "", videoUrl: "" });
      fetchEntities();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error al crear canal");
    }
  };

  const iconForType = (type: string) => {
    if (type === "group") return Users;
    if (type === "room") return Video;
    return Hash;
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gradient mb-2">Canales &amp; Grupos</h1>
              <p className="text-muted-foreground">
                Organiza comunidades, chats y salas de videollamada.
              </p>
            </div>
          </div>

          <Card className="mb-10 border-primary/30 glow-cyan animate-enter">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" />
                Crear canal / grupo
              </CardTitle>
              <CardDescription>
                Define espacios de interacción. Para videollamadas, pega el enlace de tu plataforma
                favorita.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label>Nombre</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="#canal-general, Grupo Creativos..."
                  />
                </div>
                <div className="space-y-1">
                  <Label>Tipo</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={form.type === "channel" ? "default" : "outline"}
                      className="flex-1 hover-scale"
                      onClick={() => setForm({ ...form, type: "channel" })}
                    >
                      <Hash className="w-4 h-4 mr-2" /> Canal
                    </Button>
                    <Button
                      type="button"
                      variant={form.type === "group" ? "default" : "outline"}
                      className="flex-1 hover-scale"
                      onClick={() => setForm({ ...form, type: "group" })}
                    >
                      <Users className="w-4 h-4 mr-2" /> Grupo
                    </Button>
                    <Button
                      type="button"
                      variant={form.type === "room" ? "default" : "outline"}
                      className="flex-1 hover-scale"
                      onClick={() => setForm({ ...form, type: "room" })}
                    >
                      <Video className="w-4 h-4 mr-2" /> Sala
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label>Descripción</Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Propósito o temática del canal / grupo"
                  />
                </div>
                <div className="space-y-1">
                  <Label>URL de videollamada (opcional)</Label>
                  <Input
                    value={form.videoUrl}
                    onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                    placeholder="https://meet, zoom, jitsi..."
                  />
                </div>
                <Button onClick={handleCreate} className="w-full glow-cyan hover-scale">
                  Crear espacio
                </Button>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Tus espacios
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            </div>
          ) : entities.length === 0 ? (
            <Card className="border-border/50">
              <CardContent className="py-10 text-center text-muted-foreground">
                Aún no has creado canales, grupos o salas.
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {entities.map((entity) => {
                const Icon = iconForType(entity.entity_type);
                const videoUrl = entity.properties?.videoUrl;
                return (
                  <Card key={entity.id} className="border-border/60 hover:border-primary/60 hover-scale">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-primary" />
                        {entity.name}
                      </CardTitle>
                      <CardDescription className="capitalize">
                        {entity.entity_type === "room" ? "Sala de videollamada" : entity.entity_type}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {entity.description || "Sin descripción"}
                      </p>
                      {videoUrl && (
                        <Button asChild size="sm" variant="outline" className="hover-scale">
                          <a href={videoUrl} target="_blank" rel="noreferrer">
                            Unirse a videollamada
                          </a>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialHub;
