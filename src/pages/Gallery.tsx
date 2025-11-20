import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ImageIcon, Palette, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface DigitalAsset {
  id: string;
  name: string;
  asset_type: string;
  file_url: string | null;
  is_public: boolean | null;
  metadata: any;
}

const Gallery = () => {
  const { user } = useAuth();
  const [assets, setAssets] = useState<DigitalAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    file_url: "",
  });

  const fetchAssets = async () => {
    const { data, error } = await supabase
      .from("digital_assets")
      .select("*")
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      toast.error("No se pudieron cargar las obras");
    } else {
      const filtered = (data || []).filter((a) => (a.metadata as any)?.category === "art");
      setAssets(filtered);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleCreate = async () => {
    if (!user) {
      toast.error("Debes iniciar sesión para publicar en la galería");
      return;
    }
    if (!form.name || !form.file_url) {
      toast.error("Nombre y URL de la obra son obligatorios");
      return;
    }

    setCreating(true);
    try {
      const { error } = await supabase.from("digital_assets").insert({
        user_id: user.id,
        asset_type: "image",
        name: form.name,
        file_url: form.file_url,
        is_public: true,
        metadata: {
          description: form.description,
          category: "art",
        },
      });

      if (error) throw error;

      toast.success("Obra agregada a la galería");
      setForm({ name: "", description: "", file_url: "" });
      fetchAssets();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error al crear obra");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gradient mb-2">Galería de Arte</h1>
              <p className="text-muted-foreground">
                Obras digitales expuestas en el Nexus.
              </p>
            </div>
          </div>

          {user && (
            <Card className="mb-10 border-primary/30 glow-cyan animate-enter">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-primary" />
                  Publicar obra
                </CardTitle>
                <CardDescription>Comparte arte digital con la comunidad.</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label>Nombre de la obra</Label>
                    <Input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Paisaje sintético, avatar, ilustración..."
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Descripción</Label>
                    <Textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Contexto, técnica o inspiración de la pieza"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label>URL de la imagen</Label>
                    <Input
                      value={form.file_url}
                      onChange={(e) => setForm({ ...form, file_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <Button onClick={handleCreate} disabled={creating} className="w-full glow-cyan hover-scale">
                    {creating ? "Publicando..." : "Publicar en la galería"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            Obras destacadas
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            </div>
          ) : assets.length === 0 ? (
            <Card className="border-border/50">
              <CardContent className="py-10 text-center text-muted-foreground">
                Aún no hay obras públicas en la galería.
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assets.map((asset) => (
                <Card key={asset.id} className="border-border/60 hover:border-primary/60 hover-scale overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    {asset.file_url ? (
                      <img
                        src={asset.file_url}
                        alt={asset.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <ImageIcon className="w-10 h-10 text-muted-foreground" />
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle>{asset.name}</CardTitle>
                    <CardDescription>{asset.metadata?.description || "Obra digital"}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
