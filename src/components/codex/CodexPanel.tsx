import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Book, Shield, Network, Eye, Lock, GraduationCap } from "lucide-react";
import { FOLIOS, ORIGIN_MESSAGE, PILLARS, CORE_RULES } from "@/lib/codex";

/**
 * Panel Visual del CODEX MEXA ISABELLA REX
 * Navegación interactiva por los 6 Folios
 */
export const CodexPanel = () => {
  const [selectedFolio, setSelectedFolio] = useState("0");

  const folioIcons: Record<string, any> = {
    "0": Book,
    "I": Shield,
    "II": Network,
    "III": Eye,
    "IV": Lock,
    "V": Shield,
    "VI": GraduationCap,
  };

  return (
    <Card className="w-full max-w-6xl mx-auto glass-morph neon-glow border-primary/30">
      <CardHeader className="border-b border-border/50">
        <CardTitle className="text-3xl font-bold text-gradient-glow flex items-center gap-3">
          <Book className="w-8 h-8" />
          CODEX MEXA ISABELLA REX
        </CardTitle>
        <p className="text-muted-foreground text-lg">
          Biblioteca Civilizatoria · Herencia LATAM · Tecnología Ética
        </p>
      </CardHeader>

      <CardContent className="p-6">
        <Tabs value={selectedFolio} onValueChange={setSelectedFolio}>
          <TabsList className="grid grid-cols-7 gap-2 mb-6">
            {FOLIOS.map((folio) => {
              const Icon = folioIcons[folio.id];
              return (
                <TabsTrigger
                  key={folio.id}
                  value={folio.id}
                  className="flex flex-col items-center gap-1 p-3"
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">Folio {folio.id}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {FOLIOS.map((folio) => (
            <TabsContent key={folio.id} value={folio.id} className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{folio.name}</h2>
                  <p className="text-muted-foreground">{folio.description || folio.desc}</p>
                </div>
                {folio.immutable && (
                  <Badge variant="secondary" className="neon-glow">
                    🔒 Inmutable
                  </Badge>
                )}
              </div>

              <ScrollArea className="h-[400px] rounded-lg border border-border/50 p-4 bg-background/50">
                {folio.id === "0" ? (
                  <div className="prose prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-lg leading-relaxed">
                      {ORIGIN_MESSAGE}
                    </div>
                    
                    <div className="mt-8 space-y-4">
                      <h3 className="text-xl font-bold text-primary">Pilares Fundamentales</h3>
                      {Object.entries(PILLARS).map(([key, value]) => (
                        <div key={key} className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                          <Shield className="w-5 h-5 text-primary mt-1" />
                          <div>
                            <h4 className="font-bold capitalize">{key}</h4>
                            <p className="text-sm text-muted-foreground">{value}</p>
                          </div>
                        </div>
                      ))}

                      <h3 className="text-xl font-bold text-primary mt-6">Reglas Fundamentales</h3>
                      {CORE_RULES.map((rule, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2">
                          <Badge>{idx + 1}</Badge>
                          <span>{rule}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {folio.modules && folio.modules.length > 0 && (
                      <div>
                        <h3 className="font-bold text-lg mb-3">Módulos</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {folio.modules.map((module, idx) => (
                            <Badge key={idx} variant="outline" className="p-2">
                              {module}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 p-4 rounded-lg bg-muted/50">
                      <p className="text-sm">
                        Este folio contiene la implementación técnica y filosófica
                        del sistema {folio.name}. Consulta la documentación completa
                        para detalles de implementación.
                      </p>
                    </div>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-sm text-center">
            <strong>CODEX MEXA ISABELLA REX</strong> · Versión 1.2 · 
            Herencia LATAM · Real del Monte, México 🇲🇽
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
