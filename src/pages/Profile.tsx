import { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { QuantumLoader } from "@/components/quantum/QuantumLoader";
import { EmotionGlow } from "@/components/quantum/EmotionGlow";
import { AIGuardianStatus } from "@/components/quantum/AIGuardianStatus";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { User, Save, Camera, Loader2, Globe, Github, Twitter, Linkedin, Award, Rocket } from 'lucide-react';
import { toast } from 'sonner';
import { useFileUpload } from '@/hooks/useFileUpload';

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
  });

  const { uploading, uploadFile } = useFileUpload();

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      setEmotion("processing");
      setGuardianStatus("verifying");
      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadFile(file, 'avatars');
    if (url) {
      setProfile((prev) => ({ ...prev, avatar_url: url }));
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setEmotion("processing");
    setGuardianStatus("verifying");

    const { error } = await supabase.from('profiles')
      .update({
        username: profile.username,
        full_name: profile.full_name,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
      })
      .eq('id', user.id);

    if (error) {
      toast.error('Failed to update profile');
      setEmotion("error");
      setGuardianStatus("blocked");
    } else {
      toast.success('Profile updated successfully');
      setEmotion("success");
      setGuardianStatus("active");
    }
    setSaving(false);
  };

  if (loading) return <QuantumLoader />;

  return (
    <div className="min-h-screen">
      <Navigation />
      <EmotionGlow emotion={emotion} />
      <AIGuardianStatus status={guardianStatus} />

      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card className="border-primary/30">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profile.avatar_url} alt={profile.username} />
                  <AvatarFallback>{profile.username?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl text-gradient">Quantum Metaprofile</CardTitle>
                  <CardDescription>Unified TAMV · Web3 · Metaverse · XR</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={profile.username}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  placeholder="nexus_explorer"
                />
              </div>
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Describe your unique TAMV identity..."
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="avatar_url">Avatar URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="avatar_url"
                    value={profile.avatar_url}
                    onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
                    placeholder="https://tamv.com/avatar.jpg"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <label htmlFor="avatar-upload">
                    <Button variant="ghost" className="p-2 cursor-pointer" disabled={uploading} asChild>
                      <span>
                        <Camera className="w-5 h-5" />
                      </span>
                    </Button>
                  </label>
                </div>
              </div>

              <Button onClick={handleSave} disabled={saving} className="w-full">
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
