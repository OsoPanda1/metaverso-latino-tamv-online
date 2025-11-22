import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingBag, Plus, ImageIcon, Sparkles, Rocket, Award, Globe } from "lucide-react";
import { toast } from "sonner";
import useFileUpload from "@/hooks/useFileUpload";
import { Badge } from "@/components/ui/Badge";
import { QuantumLoader } from "@/components/quantum/assets";

interface DigitalAsset {
  id: string;
  name: string;
  asset_type: string;
  file_url: string | null;
  is_public: boolean | null;
  metadata: any;
}

const Store = () => {
  const { user } = useAuth();
  const [assets, setAssets] = useState<DigitalAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    currency: "USD",
    file_url: "",
  });
  const { files, addFile, removeFile, previewFiles } = useFileUpload();

  const fetchAssets = async () => {
    const { data, error } = await supabase
      .from("digital_assets")
      .select("*")
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("No se pudieron cargar los productos");
    } else {
      setAssets(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  useEffect(() => {
    if (files.length > 0 && previewFiles.length > 0) {
      setForm((prev) => ({ ...prev, file_url: previewFiles[0] }));
    }
  }, [previewFiles]);

  const handleCreate = async () => {
    if (!user) {
      toast.error("Debes iniciar sesión para publicar en la tienda");
      return;
    }
    if (!form.name || !form.price) {
      toast.error("Nombre y precio son obligatorios");
      return;
    }

    setCreating(true);
    try {
      const { error } = await supabase.from("digital_assets").insert({
        user_id: user.id,
        asset_type: "product",
        name: form.name,
        file_url: form.file_url || null,
        is_public: true,
        metadata: {
          description: form.description,
          price: parseFloat(form.price),
          currency: form.currency,
          category: "store",
        },
      });

      if (error) throw error;

      toast.success("Producto publicado en la tienda");
      setForm({ name: "", description: "", price: "", currency: "USD", file_url: "" });
      fetchAssets();
    } catch (error: any) {
      toast.error(error.message || "Error al crear producto");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen quantum-bg">
      <Navigation />
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gradient mb-2 flex items-center gap-2"><ShoppingBag className="w-8 h-8 text-primary" /> Quantum TAMV Store</h1>
              <p className="text-muted-foreground">Activos digitales, regalos XR, avatares IA, arte Web4 y experiencias de la civilización Nexus.</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="quantum" className="px-3 py-2"><Sparkles className="w-4 h-4 mr-2" />XR Gift</Badge>
              <Badge variant="dashboard" className="px-3 py-2"><Rocket className="w-4 h-4 mr-2" />Metaverse</Badge>
              <Badge variant="secondary" className="px-3 py-2"><Award className="w-4 h-4 mr-2" />NFT/Art</Badge>
              <Badge variant="outline" className="px-3 py-2"><Globe className="w-4 h-4 mr-2" />All Digital</Badge>
            </div>
          </div>

          {user && (
            <Card className="mb-10 border-primary/30 glow-cyan animate-enter">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Plus className="w-4 h-4 text-primary" />Publicar nuevo activo digital</CardTitle>
                <CardDescription>Crea producto o regalo virtual para la tienda TAMV.</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label>Nombre</Label>
                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Avatar IA, XR Space, NFT, skin..." />
                  </div>
                  <div className="space-y-1">
                    <Label>Descripción</Label>
                    <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Características del regalo digital" />
                  </div>
                  <div className="space-y-1">
                    <Label>Vista previa, arte o asset (arrastra o selecciona)</Label>
                    <input type="file" accept="image/*,audio/*,video/*" className="hidden" id="upload-asset" onChange={e => addFile(e.target.files)} />
                    <Button as="label" htmlFor="upload-asset" className="w-full" variant="ghost"><ImageIcon className="w-5 h-5" /></Button>
                    <div className="flex gap-2 pt-2">
                      {previewFiles.map((url, i) => (<img key={i} src={url} alt="Preview" className="w-16 h-16 rounded-lg shadow" />))}
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-1 space-y-1">
                      <Label>Precio</Label>
                      <Input type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="10" />
                    </div>
                    <div className="w-28 space-y-1">
                      <Label>Moneda</Label>
                      <Input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })} />
                    </div>
                  </div>
                  <Button onClick={handleCreate} disabled={creating} className="w-full glow-cyan hover-scale">
                    {creating ? "Publicando..." : "Publicar en la tienda"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-primary" />Productos y regalos virtuales</h2>

          {loading ? <QuantumLoader visible /> : assets.length === 0 ? (
            <Card className="border-border/50">
              <CardContent className="py-10 text-center text-muted-foreground">Aún no hay productos públicos en la tienda.</CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assets.map((asset) => {
                const price = asset.metadata?.price;
                const currency = asset.metadata?.currency || "USD";
                const description = asset.metadata?.description || "Sin descripción";
                return (
                  <Card key={asset.id} className="border-border/60 hover:border-primary/60 hover-scale">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><ImageIcon className="w-4 h-4 text-primary" />{asset.name}</CardTitle>
                      <CardDescription>{description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3 items-start justify-between">
                      <div className="text-lg font-semibold">{price ? `${price} ${currency}` : "Sin precio"}</div>
                      {asset.file_url && (
                        <Button asChild variant="outline" className="hover-scale">
                          <a href={asset.file_url} target="_blank" rel="noreferrer">Ver asset</a>
                        </Button>
                      )}
                      <Badge variant="dashboard" className="px-2 py-1">TAMV Gift</Badge>
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

export default Store;
