import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  ShoppingBag, Plus, ImageIcon, Sparkles, Rocket, Award, Globe, Diamond, Star
} from "lucide-react";
import { toast } from "sonner";
import { useFileUpload } from "@/hooks/useFileUpload";
import { Badge } from "@/components/ui/badge";
import { QuantumLoader } from "@/components/quantum/QuantumLoader";
import { MatrixRainCanvas } from "@/components/xr-effects/MatrixRainCanvas";
import { MiniAnubisGift, TamvStickerAnim, Tamv3DPreview } from "@/components/quantum/TamvGiftsAssetsExtra";

interface DigitalAsset {
  id: string;
  name: string;
  asset_type: string;
  file_url: string | null;
  is_public: boolean | null;
  metadata: any;
}

/* Legacy/histórico de gifts/anímate que DEBEN estar en la tienda (aunque no estén en BD) */
const LEGACY_GIFTS: DigitalAsset[] = [
  {
    id: "anubis",
    name: "Mini Anubis",
    asset_type: "gift",
    file_url: null,
    is_public: true,
    metadata: {
      description: "Mini Anubis: avatar guardián, animación exclusiva y spark imparables.",
      previewComponent: <MiniAnubisGift animate extraGlow guardian />,
      price: 14.99,
      currency: "USD",
      badge: "Rare",
      limited: true,
      origin: "TAMV Pioneers"
    },
  },
  {
    id: "pulse_sticker",
    name: "TAMV Pulse Sticker",
    asset_type: "sticker",
    file_url: null,
    is_public: true,
    metadata: {
      description: "Sticker animado, pulso glass morph, reacción instantánea.",
      previewComponent: <TamvStickerAnim styleType="pulse" />,
      price: 2.99,
      currency: "USD",
      badge: "Epic"
    }
  },
  {
    id: "xr_globe",
    name: "XR World Globe",
    asset_type: "3d",
    file_url: null,
    is_public: true,
    metadata: {
      description: "Globo XR interactivo, 3D y portal-ready.",
      previewComponent: <Tamv3DPreview asset="globe" />,
      price: 29,
      currency: "USD",
      badge: "XR",
      limited: true
    }
  },
  {
    id: "latam_sticker_jaguar",
    name: "Sticker Jaguar LATAM",
    asset_type: "sticker",
    file_url: null,
    is_public: true,
    metadata: {
      description: "Sticker vibrante LATAM: Jaguar saltando, fuerza y alegría.",
      previewComponent: <TamvStickerAnim styleType="jaguar" />,
      price: 1.75,
      currency: "USD",
      badge: "Cultural"
    }
  },
  {
    id: "team_anubis_award",
    name: "Award Team Anubis",
    asset_type: "award",
    file_url: null,
    is_public: true,
    metadata: {
      description: "Trofeo épico Team Anubis, glass morph y confetti holográfico.",
      previewComponent: <TamvStickerAnim styleType="award" />,
      price: 5.5,
      currency: "USD",
      badge: "Unique"
    }
  },
];

const Store = () => {
  const { user } = useAuth();
  const [assets, setAssets] = useState<DigitalAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [filter, setFilter] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    currency: "USD",
    file_url: "",
  });
  const { uploadFile, uploading } = useFileUpload();

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file, "assets");
    if (url) {
      setForm((prev) => ({ ...prev, file_url: url }));
    }
  };

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

  // Filtro gifting/search
  const allAssets = [...LEGACY_GIFTS, ...assets].filter(a =>
    !filter ||
    a.name?.toLowerCase().includes(filter.toLowerCase()) ||
    a.metadata?.description?.toLowerCase().includes(filter.toLowerCase())
  );

  // --- RENDER ---
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* XR MatrixRain fondo */}
      <MatrixRainCanvas className="fixed inset-0 z-0 opacity-90 pointer-events-none" rainColor="#23bfff" />
      <Navigation />
      <div className="pt-24 pb-12 px-4 relative z-10">
        <div className="container mx-auto max-w-7xl">
          <header className="flex flex-wrap justify-between items-center mb-10 gap-6 animate-float-in">
            <div>
              <h1 className="text-4xl font-black text-gradient flex items-center gap-3 tracking-tighter mb-2">
                <ShoppingBag className="w-9 h-9 text-primary" /> Quantum TAMV Store
                <span className="ml-3 neon-glow animate-pulse px-4 py-2 rounded-2xl">XR Digital Gifts</span>
              </h1>
              <p className="text-xl text-cyan-300 max-w-[650px]">
                Compra, presume o regala los activos de civilización más épicos: gifts animados, skins XR, arte Web4 y el ¡legendario Mini Anubis!
              </p>
            </div>
            <div className="flex gap-2">
              <Badge variant="default" className="px-4 py-3 neon-glow">
                <Sparkles className="w-5 h-5 mr-2" />
                XR Gift
              </Badge>
              <Badge variant="secondary" className="px-4 py-3 neon-glow">
                <Rocket className="w-5 h-5 mr-2" /> Metaverse
              </Badge>
              <Badge variant="outline" className="px-3 py-3 text-yellow-400"><Diamond className="w-5 h-5 mr-2" />Exclusivos</Badge>
            </div>
          </header>

          <div className="flex flex-wrap gap-4 mb-8">
            <Input
              type="text"
              placeholder="Busca gifts, Anubis, stickers XR..."
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="w-[390px] glass neon-glow"
            />
          </div>

          {user && (
            <Card className="mb-12 border-primary/30 glass-morph animate-expand">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary" />
                  Publica un nuevo producto/gift
                </CardTitle>
                <CardDescription>
                  Sube tu propio regalo/asset XR para la tienda TAMV. ¡Anímate!
                </CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  <Label>Descripción</Label>
                  <Textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                  <Label>Vista previa</Label>
                  <input
                    type="file"
                    accept="image/*,audio/*,video/*"
                    className="hidden"
                    id="upload-asset"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="upload-asset">
                    <Button variant="ghost" className="w-full cursor-pointer" disabled={uploading}>
                      <ImageIcon className="w-5 h-5" />
                      {uploading ? "Subiendo..." : "Selecciona archivo"}
                    </Button>
                  </label>
                </div>
                <div className="space-y-2">
                  <Label>Precio</Label>
                  <Input type="number" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                  <Label>Moneda</Label>
                  <Input value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value.toUpperCase() })} />
                  <Button onClick={handleCreate} disabled={creating} className="w-full mt-6">
                    {creating ? "Publicando..." : "Publicar en tienda"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 animate-fadein">
            <ShoppingBag className="w-6 h-6 text-primary" /> Gifts, skins y assets XR
          </h2>

          {loading ? (
            <QuantumLoader />
          ) : allAssets.length === 0 ? (
            <Card className="border-border/50 glass">
              <CardContent className="py-16 text-center text-cyan-300 animate-fadein">
                🚫 No hay regalos ni assets todavía, ¡publica o sugiere uno!
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allAssets.map((asset) => {
                const price = asset.metadata?.price;
                const currency = asset.metadata?.currency || "USD";
                const description = asset.metadata?.description || "Sin descripción";
                const badge = asset.metadata?.badge || (asset.asset_type === "gift" ? "Gift" : "Asset");
                let preview = null;
                if (asset.metadata?.previewComponent) preview = asset.metadata.previewComponent;
                else if (asset.file_url) {
                  if (asset.asset_type === "audio")
                    preview = <audio src={asset.file_url} controls className="w-full" />;
                  else if (asset.asset_type === "video")
                    preview = <video src={asset.file_url} controls className="h-24 w-full rounded-lg" />;
                  else
                    preview = <img src={asset.file_url} alt={asset.name} className="w-full h-24 object-cover rounded-xl shadow-md" />;
                }
                return (
                  <Card key={asset.id} className="glass-morph neon-border animate-xr-float shadow-xl group hover:scale-[1.045] transition-all">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-primary" />
                        <span>{asset.name}</span>
                        {asset.id === "anubis" && (
                          <Badge className="glass badge-legend neon-glow bg-yellow-900/70 text-yellow-400 ml-3 animate-jump">Mini Anubis</Badge>
                        )}
                        {asset.asset_type === "gift" && <Badge className="ml-2 bg-emerald-600/20 text-emerald-300 border-emerald-400">Gift</Badge>}
                        {badge && <Badge className={`ml-2 glass ${badge==="Rare"
                          ? "text-yellow-400 border-yellow-300"
                          : badge==="Epic"
                          ? "text-pink-200 border-pink-400"
                          : badge==="XR"
                          ? "text-sky-300 border-sky-400"
                          : "text-slate-200"}`}>{badge}</Badge>}
                      </CardTitle>
                      <CardDescription className="text-base">{description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3 items-start">
                      {/* Vista previa mágica */}
                      <div className="w-full flex justify-center items-center my-2 min-h-[3rem]">{preview}</div>
                      <div className="text-lg font-semibold">{price ? `${price} ${currency}` : "Sin precio"}</div>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="secondary" className="px-2 py-1">TAMV Gift</Badge>
                        {asset.metadata?.limited && <Badge className="bg-yellow-300/10 text-yellow-500 border-yellow-400 animate-pulse">Limitado</Badge>}
                        {asset.metadata?.origin && <Badge className="glass">{asset.metadata.origin}</Badge>}
                      </div>
                      <Button
                        variant="outline"
                        className="w-full mt-2 glass hover:glass-morph hover:scale-[1.032] neon-glow"
                        onClick={() => toast.success(`¡Has seleccionado ${asset.name}!`)}
                      >
                        {asset.asset_type === "gift" ? "Regalar" : "Obtener"}
                      </Button>
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
