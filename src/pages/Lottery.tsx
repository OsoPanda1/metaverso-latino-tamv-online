import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Coins, Trophy, TrendingUp, Users, Clock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import lotteryImg from "@/assets/lottery-visual.jpg";

const Lottery = () => {
  const { user } = useAuth();
  const [selectedTickets, setSelectedTickets] = useState(0);

  const handleBuyTickets = (quantity: number) => {
    if (!user) {
      toast.error("Debes iniciar sesión para participar");
      return;
    }
    
    setSelectedTickets(quantity);
    toast.success(`${quantity} boletos seleccionados para compra`);
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold text-gradient mb-4">
            Lotería TAMV
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            20,000 oportunidades mensuales · $1 USD por boleto · Distribución ética
          </p>
        </div>

        <Card className="mb-12 overflow-hidden">
          <div 
            className="h-[300px] bg-cover bg-center"
            style={{ backgroundImage: `url(${lotteryImg})` }}
          >
            <div className="h-full bg-gradient-to-t from-background/90 to-transparent flex items-end p-8">
              <div>
                <h2 className="text-4xl font-bold mb-2 text-gradient">Premio del Mes</h2>
                <p className="text-3xl font-bold">$10,000 USD</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6 text-center">
              <Trophy className="w-12 h-12 mx-auto mb-3 text-primary animate-pulse-glow" />
              <h3 className="text-2xl font-bold">$10,000</h3>
              <p className="text-muted-foreground">Premio Mayor</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="text-2xl font-bold">20,000</h3>
              <p className="text-muted-foreground">Participantes</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <Coins className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="text-2xl font-bold">$1</h3>
              <p className="text-muted-foreground">Por Boleto</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <Clock className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="text-2xl font-bold">15</h3>
              <p className="text-muted-foreground">Días Restantes</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Cómo Funciona
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-primary">1</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Compra Boletos</h4>
                  <p className="text-sm text-muted-foreground">
                    Adquiere boletos por $1 USD cada uno
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-primary">2</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Sorteo Mensual</h4>
                  <p className="text-sm text-muted-foreground">
                    Cada mes se realiza un sorteo transparente
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-primary">3</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Gana Premios</h4>
                  <p className="text-sm text-muted-foreground">
                    Múltiples premios distribuidos éticamente
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Comprar Boletos
              </CardTitle>
              <CardDescription>Selecciona la cantidad de boletos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {[1, 5, 10, 25, 50, 100].map((qty) => (
                  <Button
                    key={qty}
                    variant={selectedTickets === qty ? "default" : "outline"}
                    onClick={() => handleBuyTickets(qty)}
                    className="flex flex-col h-auto py-4"
                  >
                    <span className="text-2xl font-bold">{qty}</span>
                    <span className="text-xs text-muted-foreground">${qty} USD</span>
                  </Button>
                ))}
              </div>

              {selectedTickets > 0 && (
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex justify-between mb-2">
                    <span>Total Boletos:</span>
                    <span className="font-bold">{selectedTickets}</span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span>Total a Pagar:</span>
                    <span className="font-bold text-primary">${selectedTickets} USD</span>
                  </div>
                  <Button className="w-full glow-cyan hover-scale">
                    Confirmar Compra
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ganadores Recientes</CardTitle>
            <CardDescription>Últimos premios distribuidos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Usuario****123", prize: "$10,000", date: "Enero 2025" },
                { name: "Usuario****456", prize: "$5,000", date: "Diciembre 2024" },
                { name: "Usuario****789", prize: "$3,000", date: "Noviembre 2024" }
              ].map((winner, i) => (
                <div 
                  key={i}
                  className="flex items-center justify-between p-4 rounded-lg bg-card border"
                >
                  <div className="flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold">{winner.name}</p>
                      <p className="text-sm text-muted-foreground">{winner.date}</p>
                    </div>
                  </div>
                  <Badge variant="default" className="text-lg">
                    {winner.prize}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Lottery;
