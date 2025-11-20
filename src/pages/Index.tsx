import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { ThreeHeroScene } from "@/components/ThreeHeroScene";
import { Sparkles, Brain, Network, Zap, Shield, Rocket } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const features = [
    {
      icon: Brain,
      title: "AI Isabella",
      description: "Conversational AI agent that guides you through the nexus in real time.",
    },
    {
      icon: Network,
      title: "Digital Nexus",
      description: "Spaces, channels and groups interconnected in a living metaverse.",
    },
    {
      icon: Zap,
      title: "Realtime Core",
      description: "Entities and assets synchronized instantly across your experience.",
    },
    {
      icon: Shield,
      title: "Secure Identity",
      description: "Profiles, roles and access rules protegidos por un backend sólido.",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navigation />
      <ThreeHeroScene />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl animate-fade-in">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-enter hover-scale">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">TAMV • The Advanced Metaverse</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="block">Bienvenido al</span>
              <span className="text-gradient block mt-2">Nexus Digital</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Construye entidades, galerías, tiendas digitales y experiencias 3D en un ecosistema
              potenciado por IA. Isabella te acompaña en cada paso.
            </p>

            <div className="flex gap-4 justify-center flex-wrap pt-6">
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="text-lg px-8 glow-cyan animate-pulse-glow hover-scale"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Iniciar ahora
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/auth")}
                className="text-lg px-8 border-primary/50 hover:border-primary hover-scale"
              >
                Explorar la plataforma
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-gradient animate-fade-in">
            Módulos principales
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 bg-card/70 backdrop-blur border-border/60 hover:border-primary/60 transition-all duration-300 hover:glow-cyan hover-scale animate-scale-in"
              >
                <feature.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-12 text-center bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/40 glow-cyan animate-scale-in">
            <h2 className="text-4xl font-bold mb-4 text-gradient">
              ¿Listo para conectar con el Nexus?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Crea tu perfil, habla con Isabella y lanza tu propio universo digital.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="text-lg px-12 glow-cyan hover-scale"
            >
              Comenzar experiencia TAMV
            </Button>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
