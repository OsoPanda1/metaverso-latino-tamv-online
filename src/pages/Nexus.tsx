import { useEffect, useState, useRef, useCallback } from "react";
import { Navigation } from "@/components/Navigation";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
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
import { Camera, Loader2, Save, Users } from "lucide-react";
import { toast } from "sonner";
import { useFileUpload } from "@/hooks/useFileUpload";

// Mock XR Effects
import { MatrixRainCanvas } from "@/components/xr-effects/MatrixRainCanvas";
import { HoloHexGridSVG } from "@/components/xr-effects/HoloHexGridSVG";
import { ParallaxMotion } from "@/components/xr-effects/ParallaxMotion";

// Social/Media panels (list explicit, can be expanded if needed)
import { TamvPhotoGallery } from "@/components/quantum/TamvPhotoGallery";
import { TamvGroupsInCommon } from "@/components/quantum/TamvGroupsInCommon";
import { TamvChannelsInCommon } from "@/components/quantum/TamvChannelsInCommon";
import { TamvWishlist } from "@/components/quantum/TamvWishlist";
import { TamvReactions } from "@/components/quantum/TamvReactions";

const XR_VISUAL_COLORS = ["#00ffe1", "#2dc7ff", "#69f8dc", "#1b7fff", "#fff"];

const Profile = () => {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [emotion, setEmotion] = useState("neutral");
  const [guardianStatus, setGuardianStatus] = useState("active");
  const [profile, setProfile] = useState({ username: '', full_name: '', bio: '', avatar_url: '' });
  const [groups, setGroups] = useState([]);
  const [channels, setChannels] = useState([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [xrLight, setXRLight] = useState(0);

  const { uploading, uploadFile } = useFileUpload();

  // --- Visual FX: Animate floated lights, MatrixRain activation, HoloGrid ---
  useEffect(() => {
    let frame = 0;
    let running = true;
    const step = () => {
      setXRLight((prev) => (prev + 1) % XR_VISUAL_COLORS.length);
      if (running) {
        frame = requestAnimationFrame(step);
      }
    };
    step();
    return () => { running = false; cancelAnimationFrame(frame); };
  }, []);

  // --- Fetch user profile and all panels ---
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setEmotion("processing");
    setGuardianStatus("verifying");
    const fetchProfile = async () => {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      // MOCK: Replace below with full API fetch logic for demo
      setGroups([
        { name: "XR Creators", members: 56, cover:"/xr-group-1.png" },
        { name: "Codex Masters", members: 41, cover:"/xr-group-2.png" }
      ]);
      setChannels([
        { name: "TAMV News", members: 99, icon:"📰"}, { name: "Civilizatorio Lounge", members: 28, icon:"🎙️"}
      ]);
      setGallery([
        { url: data?.avatar_url },
        { url: "/gallery-1.jpg" },
        { url: "/gallery-2.jpg" },
        { url: "/gallery-3.jpg" }
      ]);
      setWishlist([
        { title: "Asset MatrixRain", url: "#", description: "Fondo holográfico, XR ready", icon:"💠" },
        { title: "Avatar UltraXR", url: "#", description: "Ready para Metaverso", icon:"🦾" }
      ]);
      if (error) {
        toast.error('Error fetching profile');
        setEmotion("error");
        setGuardianStatus("blocked");
      } else if (data) {
        setProfile({
          username: data.username || '',
          full_name: data.full_name || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || '',
        });
        setEmotion("success");
        setGuardianStatus("active");
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  // Visual handler for avatar upload
  const handleAvatarUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file, 'avatars');
    if (url) {
      setProfile((prev) => ({ ...prev, avatar_url: url }));
      setGallery(prev => [{ url }, ...prev]);
    }
  };

  // Save profile logic
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setEmotion("processing");
    setGuardianStatus("verifying");
    const { error } = await supabase.from('profiles')
      .update({
        username: profile.username, full_name: profile.full_name,
        bio: profile.bio, avatar_url: profile.avatar_url,
      })
      .eq('id', user.id);
    if (error) {
      toast.error('Failed to update profile');
      setEmotion("error"); setGuardianStatus("blocked");
    } else {
      toast.success('Profile updated successfully');
      setEmotion("success"); setGuardianStatus("active");
    }
    setSaving(false);
  };

  // Chido/Chanclazo/ALV/CMAMO reactions
  const reactions = [
    { type: "chido", label: "Chido", emoji: "🤙", color: "bg-emerald-500" },
    { type: "chanclazo", label: "Chanclazo", emoji: "🩴", color: "bg-yellow-400" },
    { type: "alv", label: "ALV", emoji: "🚀", color: "bg-pink-500" },
    { type: "cmamo", label: "CMAMO", emoji: "🦙", color: "bg-cyan-400" },
  ];

  if (loading) return <QuantumLoader />;

  // --------------- RENDER PANEL XR/IMMERSIVE ---------------
  return (
    <div className="relative min-h-screen">
      {/* XR Layers: MatrixRain, HoloHexGrid, Parallax */}
      <MatrixRainCanvas className="absolute inset-0 z-0 opacity-80" rainColor={XR_VISUAL_COLORS[xrLight]} />
      <HoloHexGridSVG className="absolute inset-0 z-10 pointer-events-none" glowColor={XR_VISUAL_COLORS[(xrLight+2)%XR_VISUAL_COLORS.length]} nLayers={6} morph animate />
      <ParallaxMotion
        className="absolute inset-0 z-20 pointer-events-none"
        depth={6}
        blobColor={XR_VISUAL_COLORS[(xrLight+1)%XR_VISUAL_COLORS.length]}
        fog={true} shimmer={true}
      />

      {/* Main Profile Content */}
      <Navigation />
      <EmotionGlow emotion={emotion} />
      <AIGuardianStatus status={guardianStatus} />
      <div className="pt-24 pb-12 px-2">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-8 neon-glass-panel animate-xr-slide">
          {/* Left: Avatar, social, media */}
          <section className="md:col-span-4 flex flex-col gap-7 items-center p-8 rounded-3xl glass-morph neon-shadow shadow-xl animate-float-in">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-cyan-500/80 shadow-2xl" style={{boxShadow:"0 0 60px #23eaffb8"}}>
                <AvatarImage src={profile.avatar_url} alt={profile.username} />
                <AvatarFallback style={{fontSize:'2rem'}}>{profile.username?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div className="absolute top-2 right-2 animate-bounce-x">{groups.length > 0 && <Users className="w-6 h-6 text-cyan-400" />}</div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gradient-glass mb-1">{profile.full_name}</h2>
              <p className="text-cyan-100 text-lg mb-1">@{profile.username}</p>
              <div className="flex gap-2 mb-3">
                {groups.map(g => (
                  <span key={g.name} className="rounded-xl bg-cyan-800/70 px-3 py-1 text-cyan-300 animate-fade-in">{g.name}</span>
                ))}
              </div>
            </div>
            <TamvGroupsInCommon groups={groups} />
            <TamvChannelsInCommon channels={channels} />
            <TamvPhotoGallery images={gallery} />
          </section>

          {/* Right: Form, wishlist, reactions */}
          <section className="md:col-span-8 flex flex-col gap-8 p-10 rounded-3xl glass-panel-xr bg-black/10 shadow-2xl animate-float-in delay-1">
            <div className="flex justify-between items-center">
              <CardTitle className="text-4xl text-neon-glass font-extrabold">Quantum Metaprofile XR</CardTitle>
              <span className="text-gradient-glow text-xl hidden md:block drop-shadow-xl">Civilizatorio · XR · Audit · Web3</span>
            </div>
            <Label htmlFor="bio" className="text-lg font-bold">Bio / Manifesto</Label>
            <Textarea
              id="bio"
              value={profile.bio}
              onChange={e => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Describe tu identidad XR-TAMV, civilización, logros y sueños"
              rows={4}
              className="glass-morph bg-black/20 mb-2 text-lg"
            />
            <Label htmlFor="avatar_url" className="mt-4 text-lg font-bold">Avatar (URL o Upload)</Label>
            <div className="flex gap-3 items-center mb-2">
              <Input
                id="avatar_url"
                value={profile.avatar_url}
                onChange={e => setProfile({ ...profile, avatar_url: e.target.value })}
                placeholder="https://tamv.com/avatar.jpg"
                className="glass-morph neon-glow"
              />
              <input type="file" accept="image/*" id="avatar-upload" className="hidden" onChange={handleAvatarUpload} />
              <label htmlFor="avatar-upload">
                <Button variant="ghost" className="p-2" disabled={uploading}><Camera className="w-5 h-5" /></Button>
              </label>
              <Button onClick={handleSave} disabled={saving} className="ml-auto px-6 glass-morph neon-glow">
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 mr-2" />} Guardar
              </Button>
            </div>
            <TamvWishlist items={wishlist} shimmer onAdd={item => setWishlist([...wishlist, item])} />
            <TamvReactions options={reactions} entityId={user?.id} motion parallax neonGlow />
          </section>
        </div>
        {/* Floating or parallax blob/particles, e.g. */}
        <svg className="fixed right-0 bottom-0 z-50 pointer-events-none" width="600" height="400">
          <defs>
            <radialGradient id="g1" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#0ff" stopOpacity="1"/>
              <stop offset="100%" stopColor="#19f9d8" stopOpacity="0"/>
            </radialGradient>
          </defs>
          <ellipse cx={500+xrLight*10} cy="320" rx="120" ry="40" fill="url(#g1)" opacity="0.5" className="animate-pulse"/>
        </svg>
      </div>
    </div>
  );
};

export default Profile;
