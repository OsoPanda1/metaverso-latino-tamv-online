import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { QuantumLoader } from "@/components/quantum/QuantumLoader";
import { EmotionGlow } from "@/components/quantum/EmotionGlow";
import { AIGuardianStatus } from "@/components/quantum/AIGuardianStatus";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Camera, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { useFileUpload } from "@/hooks/useFileUpload";

// NUEVOS COMPONENTES XR/SOCIAL
import { TamvXRBackground } from "@/components/quantum/TamvXRBackground";
import { TamvPhotoGallery } from "@/components/quantum/TamvPhotoGallery";
import { TamvGroupsInCommon } from "@/components/quantum/TamvGroupsInCommon";
import { TamvChannelsInCommon } from "@/components/quantum/TamvChannelsInCommon";
import { TamvWishlist } from "@/components/quantum/TamvWishlist";
import { TamvReactions } from "@/components/quantum/TamvReactions";

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [emotion, setEmotion] = useState("neutral");
  const [guardianStatus, setGuardianStatus] = useState("active");
  const [profile, setProfile] = useState({
    username: "",
    full_name: "",
    bio: "",
    avatar_url: "",
  });

  // --- NUEVO STATE SOCIAL ---
  const [groups, setGroups] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  // ---

  const { uploading, uploadFile } = useFileUpload();

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      setEmotion("processing");
      setGuardianStatus("verifying");
      // Profile fetch
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      // Groups/channels/gallery/wishlist mock/fetch
      setGroups([{ name: "TAMV XR Devs", members: 78 }, { name: "Codex Aztek", members: 44 }]);
      setChannels([{ name: "🔮 XR Show", members: 22 }, { name: "🎙️ Codex Lounge", members: 17 }]);
      setGallery([
        { url: profile.avatar_url },
        { url: "https://images.unsplash.com/photo-1" },
        { url: "https://images.unsplash.com/photo-2" },
      ]);
      setWishlist([{ title: "Nuevo asset XR 2077", url: "#" }]);
      if (error) {
        toast.error("Error fetching profile");
        setEmotion("error");
        setGuardianStatus("blocked");
      } else if (data) {
        setProfile({
          username: data.username || "",
          full_name: data.full_name || "",
          bio: data.bio || "",
          avatar_url: data.avatar_url || "",
        });
        setEmotion("success");
        setGuardianStatus("active");
      }
      setLoading(false);
    };
    fetchProfile();
    // eslint-disable-next-line
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file, "avatars");
    if (url) setProfile((prev) => ({ ...prev, avatar_url: url }));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setEmotion("processing");
    setGuardianStatus("verifying");

    const { error } = await supabase
      .from("profiles")
      .update({
        username: profile.username,
        full_name: profile.full_name,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
      })
      .eq("id", user.id);

    if (error) {
      toast.error("Failed to update profile");
      setEmotion("error");
      setGuardianStatus("blocked");
    } else {
      toast.success("Profile updated successfully");
      setEmotion("success");
      setGuardianStatus("active");
    }
    setSaving(false);
  };

  if (loading) return <QuantumLoader />;

  // --- REACCIONES PERSONALIZADAS ---
  const reactions = [
    { type: "chido", label: "Chido", emoji: "🤙", color: "bg-emerald-500" },
    { type: "chanclazo", label: "Chanclazo", emoji: "🩴", color: "bg-yellow-400" },
    { type: "alv", label: "ALV", emoji: "🚀", color: "bg-pink-500" },
    { type: "cmamo", label: "CMAMO", emoji: "🦙", color: "bg-sky-400" },
  ];
  // ------------------------------

  return (
    <TamvXRBackground effect="matrixrain-holohex">
      <Navigation />
      <EmotionGlow emotion={emotion} />
      <AIGuardianStatus status={guardianStatus} />

      <div className="pt-16 pb-12 px-2 md:px-8">
        <div className="container mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-11 gap-8 glass-morph neon-matrix border-2 border-cyan-500/10 shadow-2xl animate-xr-panel">
          {/* Lado izquierdo: avatar, grupos y canales */}
          <div className="md:col-span-4 flex flex-col gap-6 items-center glass-blur-2xl p-6 rounded-2xl dark:backdrop-blur-md">
            <Avatar className="w-28 h-28 border-4 border-primary/70 shadow-xl avatar-3d-glow">
              <AvatarImage src={profile.avatar_url} alt={profile.username} />
              <AvatarFallback>{profile.username?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div className="w-full flex flex-col gap-2 mt-2 mb-4">
              <Label className="font-bold text-xl text-center">{profile.full_name}</Label>
              <p className="text-md text-center text-cyan-100">@{profile.username}</p>
            </div>
            <TamvGroupsInCommon groups={groups} />
            <TamvChannelsInCommon channels={channels} />
            <Button variant="outline" className="w-full mt-2 glass glowing">Join New Group</Button>
          </div>

          {/* Lado derecho: bio, edición, galería, wishlist, reactions */}
          <div className="md:col-span-7 flex flex-col gap-8 p-6 rounded-2xl bg-black/5 shadow-lg glass-panel-xr">
            <div>
              <CardTitle className="text-3xl text-gradient-glass font-bold mb-2">Quantum Metaprofile XR</CardTitle>
              <CardDescription>Civilizatorio | Web3 | Metaverse | XR | BookPI Audit</CardDescription>
            </div>
            <div>
              <Label htmlFor="bio">Bio / Manifesto</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Describe tu identidad TAMV/civilizatoria, logros, sueños, herencia."
                rows={5}
                className="mb-2 glass focus:neon-outline"
              />
              <Label htmlFor="avatar_url">Avatar (URL o Upload)</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="avatar_url"
                  value={profile.avatar_url}
                  onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
                  placeholder="https://tamv.com/avatar.jpg"
                />
                <input type="file" accept="image/*" onChange={handleAvatarUpload} id="avatar-upload" className="hidden" />
                <label htmlFor="avatar-upload">
                  <Button variant="ghost" className="p-2 cursor-pointer" disabled={uploading}><Camera className="w-5 h-5" /></Button>
                </label>
                <Button onClick={handleSave} disabled={saving} className="ml-auto px-5 glass-pulse">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Guardar</Button>
              </div>
            </div>
            <TamvPhotoGallery images={gallery} />
            {/* WISHLIST */}
            <TamvWishlist items={wishlist} />
            {/* REACCIONES CUSTOM */}
            <TamvReactions options={reactions} wishlistEnabled />
          </div>
        </div>
      </div>
    </TamvXRBackground>
  );
};

export default Profile;
