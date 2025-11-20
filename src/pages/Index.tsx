import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { Sparkles, Brain, Network, Zap, Shield, Rocket } from 'lucide-react';
import { useEffect } from 'react';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Intelligence',
      description: 'Advanced AI integration for intelligent interactions and decision-making',
    },
    {
      icon: Network,
      title: 'Digital Nexus',
      description: 'Connect and manage your digital entities in a unified metaverse ecosystem',
    },
    {
      icon: Zap,
      title: 'Real-time Processing',
      description: 'Lightning-fast processing with real-time updates and synchronization',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Enterprise-grade security with end-to-end encryption',
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-pulse-glow">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">The Advanced Metaverse</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold leading-tight">
              Enter the
              <span className="text-gradient block mt-2">Digital Nexus</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of digital interaction. Connect, create, and collaborate in an
              AI-powered metaverse ecosystem designed for tomorrow.
            </p>

            <div className="flex gap-4 justify-center flex-wrap pt-6">
              <Button
                size="lg"
                onClick={() => navigate('/auth')}
                className="text-lg px-8 glow-cyan animate-pulse-glow"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/auth')}
                className="text-lg px-8 border-primary/50 hover:border-primary"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-gradient">
            Powerful Features
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all duration-300 hover:glow-cyan group"
              >
                <feature.icon className="w-12 h-12 text-primary mb-4 group-hover:animate-pulse-glow" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-12 text-center bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30 glow-cyan">
            <h2 className="text-4xl font-bold mb-4 text-gradient">
              Ready to Enter the Nexus?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of users already exploring the digital frontier
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="text-lg px-12 glow-cyan"
            >
              Start Your Journey
            </Button>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
