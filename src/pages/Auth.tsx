import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Loader2, Shield, Brain, Globe } from 'lucide-react';
import { QuantumLoader } from "@/components/quantum/QuantumLoader";
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { MatrixBackground } from '@/components/MatrixBackground';

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ email: '', password: '', username: '' });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInData.email || !signInData.password) {
      toast.error('Por favor completa todos los campos');
      return;
    }
    setLoading(true);
    const { error } = await signIn(signInData.email, signInData.password);
    if (error) {
      toast.error(error.message || 'Error al iniciar sesión');
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpData.email || !signUpData.password || !signUpData.username) {
      toast.error('Por favor completa todos los campos');
      return;
    }
    if (signUpData.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setLoading(true);
    const { error } = await signUp(signUpData.email, signUpData.password, signUpData.username);
    if (error) {
      toast.error(error.message || 'Error al crear cuenta');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <MatrixBackground />
      
      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <Card className="w-full max-w-md relative z-10 border-primary/30 shadow-2xl backdrop-blur-xl bg-card/80">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 glow-cyan">
              <Sparkles className="w-10 h-10 text-primary animate-pulse" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-bold text-gradient">TAMV NEXUS</CardTitle>
            <CardDescription className="text-lg mt-2">El Metaverso Latinoamericano</CardDescription>
          </div>
          
          {/* Features preview */}
          <div className="flex justify-center gap-6 pt-2">
            <div className="flex flex-col items-center gap-1 text-muted-foreground">
              <Brain className="w-5 h-5 text-primary" />
              <span className="text-xs">Isabella IA</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-muted-foreground">
              <Shield className="w-5 h-5 text-secondary" />
              <span className="text-xs">Guardianes</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-muted-foreground">
              <Globe className="w-5 h-5 text-accent" />
              <span className="text-xs">DreamSpaces</span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Ingresar
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Registrarse
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={signInData.email}
                    onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                    className="bg-input/50 border-border/50 focus:border-primary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Contraseña</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={signInData.password}
                    onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                    className="bg-input/50 border-border/50 focus:border-primary"
                    required
                  />
                </div>
                <Button type="submit" className="w-full glow-cyan" disabled={loading}>
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Ingresar al Nexus'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-username">Nombre de Usuario</Label>
                  <Input
                    id="signup-username"
                    type="text"
                    placeholder="nexus_explorer"
                    value={signUpData.username}
                    onChange={(e) => setSignUpData({ ...signUpData, username: e.target.value })}
                    className="bg-input/50 border-border/50 focus:border-primary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                    className="bg-input/50 border-border/50 focus:border-primary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Contraseña</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                    className="bg-input/50 border-border/50 focus:border-primary"
                    required
                  />
                </div>
                <Button type="submit" className="w-full glow-cyan" disabled={loading}>
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Crear Cuenta'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <Button variant="ghost" onClick={() => navigate('/')} className="text-primary hover:text-primary/80">
              ← Volver al Inicio
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground mt-4">
            Al registrarte aceptas los términos del CODEX MEXA ISABELLA REX™
          </p>
        </CardContent>
        
        {loading && <QuantumLoader />}
      </Card>
    </div>
  );
};

export default Auth;
