import { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { QuantumLoader, EmotionGlow, AIGuardianStatus } from "@/components/quantum/assets";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { User, Save, Camera, Loader2, Globe, Github, Twitter, Linkedin, Discord, Award, Rocket } from 'lucide-react';
import { toast } from 'sonner';
import useFileUpload from '@/hooks/useFileUpload';

// Fake function: Fetch/unify data from multiple networks/metaverses
const fetchMultiIdentity = async (userId: string) => {
  // SUPON que extrae data federada XR/Metaversos, redes sociales sync (replace with real APIs)
  return {
    social: [
      { network: "Twitter", username: "@QuantumTAMV", url: "https://twitter.com/QuantumTAMV", icon: <Twitter className="w-6 h-6 text-sky-500" /> },
      { network: "Github", username: "tamv-xr", url: "https://github.com/tamv-xr", icon: <Github className="w-6 h-6 text-black" /> },
      { network: "Discord", username: "TAMV#9999", url: "https://discord.gg/TAMV", icon: <Discord className="w-6 h-6 text-indigo-400" /> },
      { network: "LinkedIn", username: "Quantum TAMV", url: "https://linkedin.com/company/quantumtamv", icon: <Linkedin className="w-6 h-6 text-blue-800" /> },
    ],
    metaverse: [
      { world: "Decentraland", avatar: "Quantum_Ghost", url: "https://decentraland.org/profile/Quantum_Ghost", icon: <Rocket className="w-5 h-5 text-pink-600" /> },
      { world: "Roblox", username: "QuantumTAMV", url: "https://roblox.com/users/QuantumTAMV", icon: <Globe className="w-5 h-5 text-green-600" /> },
      { world: "OpenSea", address: "quantum.eth", url: "https://opensea.io/quantum.eth", icon: <Award className="w-5 h-5 text-indigo-700" /> },
    ],
    badges: [
      { label: "Founder XR", variant: "quantum", icon: <Rocket className="w-4 h-4 text-fuchsia-500" /> },
      { label: "AI Dev", variant: "dashboard", icon: <Award className="w-4 h-4 text-amber-400" /> },
      { label: "Web3 Verified", variant: "secondary" },
    ],
    activity: [
      { type: "XR Session", detail: "Decentraland (12h)", status: "active" },
      { type: "AI Chat", detail: "TAMV Isabella (312 msg)", status: "success" },
      { type: "NFT Mint", detail: "quantum.eth", status: "success" }
    ]
  };
};

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [emotion, setEmotion] = useState("neutral");
  const [guardianStatus, setGuardianStatus] = useState("active");
  const [profile, setProfile] = useState({
    username: '',
    full_name: '',
    bio: '',
    avatar_url: '',
    email: '',
    links: [],
    meta: {},
  });
  const [multiIdentity, setMultiIdentity] = useState<any>(null);
  const { files, addFile, removeFile, previewFiles } = useFileUpload();

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      setEmotion("processing"); setGuardianStatus("verifying");
      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (error) {
        toast.error('Error fetching profile'); setEmotion("error"); setGuardianStatus("blocked");
      } else if (data) {
        setProfile({
          username: data.username || '',
          full_name: data.full_name || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || '',
          email: data.email || user.email || '',
          links: [],
          meta: {},
        });
        setEmotion("success"); setGuardianStatus("active");
        // Multi-red/metaverse sync
        const multi = await fetchMultiIdentity(user.id);
        setMultiIdentity(multi);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  useEffect(() => {
    if (files.length > 0 && previewFiles.length > 0) {
      setProfile((prev) => ({ ...prev, avatar_url: previewFiles[0] }));
    }
    // eslint-disable-next-line
  }, [previewFiles]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setEmotion("processing"); setGuardianStatus("verifying");

    const { error } = await supabase.from('profiles')
      .update({
        username: profile.username,
        full_name: profile.full_name,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
        email: profile.email,
      })
      .eq('id', user.id);

    if (error) {
      toast.error('Failed to update profile'); setEmotion("error"); setGuardianStatus("blocked");
    } else {
      toast.success('Profile updated successfully'); setEmotion("success"); setGuardianStatus("active");
    }
    setSaving(false);
  };

  if (loading) return <QuantumLoader visible />;

  return (
    <div className="min-h-screen quantum-bg">
      <Navigation />
      <EmotionGlow emotion={emotion} />
      <AIGuardianStatus status={guardianStatus} />

      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card className="border-primary/30 glow-cyan shadow-quantum">
            <CardHeader>
              {/* Avatar + info */}
              <div className="flex items-center gap-4">
                <Avatar variant="quantum" status={guardianStatus} auditTrail="profile-avatar">
                  {profile.avatar_url && <AvatarImage src={profile.avatar_url} alt={profile.username} />}
                  <AvatarFallback fallbackLabel={profile.username[0] || "?"} />
                </Avatar>
                <div>
                  <CardTitle className="text-2xl text-gradient">Quantum Metaprofile</CardTitle>
                  <CardDescription>Unified TAMV · Web3 · Metaverse · XR</CardDescription>
                </div>
              </div>
              {/* Social/link list */}
              <div className="flex gap-2 flex-wrap pt-4">
                {multiIdentity?.social?.map((s, i) => (
                  <Button key={i} as="a" href={s.url} target="_blank" variant="outline" className="gap-2 px-3">
                    {s.icon}
                    {s.username}
                  </Button>
                ))}
              </div>
              {/* Metaverse */}
              <div className="flex gap-2 flex-wrap pt-2">
                {multiIdentity?.metaverse?.map((m, i) => (
                  <Button key={i} as="a" href={m.url} target="_blank" variant="ghost" className="gap-1 px-3 text-xs">
                    {m.icon}
                    {m.avatar || m.username || m.address}
                  </Button>
                ))}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Email/alias */}
              <div className="flex gap-2">
                <Input id="email" type="email" value={profile.email || ''} disabled className="w-1/2" />
                <Input id="username" value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} placeholder="nexus_explorer" className="w-1/2" />
              </div>
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input id="full_name" value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} placeholder="John Doe" />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} placeholder="Describe your unique TAMV identity..." rows={4} />
              </div>
              <div>
                <Label htmlFor="avatar_url">Avatar | IA Upload</Label>
                <div className="flex gap-2">
                  <Input id="avatar_url" value={profile.avatar_url} onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })} placeholder="https://tamv.com/avatar.jpg" />
                  <input type="file" accept="image/*" onChange={(e) => addFile(e.target.files)} className="hidden" id="avatar-upload" />
                  <Button as="label" htmlFor="avatar-upload" variant="ghost" className="p-2"><Camera className="w-5 h-5" /></Button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {previewFiles.map((url, idx) => (<img key={idx} src={url} alt="Preview" className="w-14 h-14 rounded-lg shadow" />))}
                </div>
              </div>

              {/* Badges globales */}
              <div className="flex gap-2 flex-wrap pt-2">
                {multiIdentity?.badges?.map((b, i) => (
                  <Badge key={i} variant={b.variant} className="px-3 py-1 flex gap-2 items-center">{b.icon}{b.label}</Badge>
                ))}
              </div>
              {/* Actividad/estado XR, IA, Web3 */}
              <div className="flex gap-2 flex-wrap pt-2">
                {multiIdentity?.activity?.map((a, i) => (
                  <Badge key={i} variant={a.status === "active" ? "quantum" : "dashboard"}>{a.type}: {a.detail}</Badge>
                ))}
              </div>
              {/* Save Button */}
              <Button onClick={handleSave} disabled={saving} className="w-full glow-cyan quantum-btn">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
