import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Mic, Eye, Github, Loader2 } from 'lucide-react';
import { QuantumLoader, EmotionGlow, AIGuardianStatus } from "@/components/quantum/assets"; // Importa assets flagship
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import useVoice from "@/hooks/useVoice"; // Hook para login por voz

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp, signInGoogle, signInGithub } = useAuth();
  const [loading, setLoading] = useState(false);

  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ email: '', password: '', username: '' });

  // Estado emocional/cognitivo audit trail
  const [emotion, setEmotion] = useState("neutral");
  const [guardianStatus, setGuardianStatus] = useState("active");

  // Login por voz
  const { recording, startRecording, stopRecording, transcript } = useVoice();
  const handleVoiceLogin = async () => {
    setLoading(true);
    // Aquí puedes procesar el transcript como autenticación biométrica
    if (transcript) {
      // Solo muestra ejemplo básico, integra lógica IA biométrica
      toast.success(`Autenticado por voz: ${transcript}`);
      setLoading(false);
      // navigate('/dashboard') // Si pasa autenticación
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(signInData.email, signInData.password);

    setEmotion("processing");
    setGuardianStatus("verifying");

    if (error) {
      toast.error(error.message || 'Failed to sign in');
      setEmotion("error");
      setGuardianStatus("blocked");
    } else {
      setEmotion("success");
      setGuardianStatus("active");
      navigate('/dashboard');
    }

    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (signUpData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      setLoading(false);
      setEmotion("error");
      return;
    }

    const { error } = await signUp(signUpData.email, signUpData.password, signUpData.username);

    setEmotion("processing");

    if (error) {
      toast.error(error.message || 'Failed to create account');
      setEmotion("error");
      setGuardianStatus("blocked");
    } else {
      setEmotion("success");
      setGuardianStatus("active");
      navigate('/dashboard');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 quantum-bg hologram-motion">
      <EmotionGlow emotion={emotion} />
      <AIGuardianStatus status={guardianStatus} />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow" />
      </div>

      <Card className="w-full max-w-md relative z-10 border-primary/30 glow-cyan shadow-xl backdrop-blur">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10 border border-primary/30 animate-pulse-glow">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gradient">Welcome to TAMV Nexus</CardTitle>
          <CardDescription>Enter the digital frontier</CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* Tab: SignIn */}
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="you@example.com"
                    value={signInData.email}
                    onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={signInData.password}
                    onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="w-full glow-cyan" disabled={loading}>
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                  </Button>
                  <Button variant="ghost" onClick={startRecording} disabled={recording} className="mic-btn hologram-motion" aria-label="Login por voz">
                    <Mic className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" disabled className="eye-btn" aria-label="Biometric soon">
                    <Eye className="w-5 h-5" />
                  </Button>
                </div>
                <div className="flex gap-2 justify-center mt-2">
                  <Button type="button" variant="outline" onClick={signInGoogle} className="flex gap-2" disabled={loading}>Google</Button>
                  <Button type="button" variant="outline" onClick={signInGithub} className="flex gap-2" disabled={loading}>
                    <Github className="w-5 h-5" /> Github
                  </Button>
                </div>
              </form>
            </TabsContent>

            {/* Tab: SignUp */}
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-username">Username</Label>
                  <Input
                    id="signup-username"
                    type="text"
                    placeholder="nexus_explorer"
                    value={signUpData.username}
                    onChange={(e) => setSignUpData({ ...signUpData, username: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full glow-cyan" disabled={loading}>
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <Button variant="link" onClick={() => navigate('/')} className="text-primary">Back to Home</Button>
          </div>
        </CardContent>
        {loading && <QuantumLoader visible />}
      </Card>
    </div>
  );
};

export default Auth;

          
