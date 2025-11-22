import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Vote, ThumbsUp, ThumbsDown, TrendingUp, Users, Clock } from "lucide-react";
import { toast } from "sonner";
import daoImg from "@/assets/dao-governance.jpg";

interface Proposal {
  id: string;
  user_id: string;
  name: string;
  description: string;
  properties: {
    votes_for?: number;
    votes_against?: number;
    status?: string;
    category?: string;
    impact?: string;
  };
  created_at: string;
}

const DAO = () => {
  const { user } = useAuth();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newProposal, setNewProposal] = useState({
    name: "",
    description: "",
    category: "governance",
    impact: "medium"
  });

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const { data, error } = await supabase
        .from("nexus_entities")
        .select("*")
        .eq("entity_type", "dao_proposal")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProposals((data || []) as Proposal[]);
    } catch (error: any) {
      toast.error("Error al cargar propuestas");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProposal = async () => {
    if (!user) {
      toast.error("Debes iniciar sesión para crear propuestas");
      return;
    }

    if (!newProposal.name || !newProposal.description) {
      toast.error("Completa todos los campos");
      return;
    }

    try {
      const { error } = await supabase.from("nexus_entities").insert({
        user_id: user.id,
        entity_type: "dao_proposal",
        name: newProposal.name,
        description: newProposal.description,
        properties: {
          votes_for: 0,
          votes_against: 0,
          status: "active",
          category: newProposal.category,
          impact: newProposal.impact
        }
      });

      if (error) throw error;
      toast.success("Propuesta creada exitosamente");
      setNewProposal({ name: "", description: "", category: "governance", impact: "medium" });
      setIsCreating(false);
      fetchProposals();
    } catch (error: any) {
      toast.error("Error al crear propuesta");
    }
  };

  const handleVote = async (proposalId: string, voteType: "for" | "against") => {
    if (!user) {
      toast.error("Debes iniciar sesión para votar");
      return;
    }

    try {
      const proposal = proposals.find(p => p.id === proposalId);
      if (!proposal) return;

      const votes_for = (proposal.properties?.votes_for || 0) + (voteType === "for" ? 1 : 0);
      const votes_against = (proposal.properties?.votes_against || 0) + (voteType === "against" ? 1 : 0);

      const { error } = await supabase
        .from("nexus_entities")
        .update({
          properties: {
            ...proposal.properties,
            votes_for,
            votes_against
          }
        })
        .eq("id", proposalId);

      if (error) throw error;

      await supabase.from("entity_relationships").insert({
        source_entity_id: user.id,
        target_entity_id: proposalId,
        relationship_type: `voted_${voteType}`,
        metadata: { voted_at: new Date().toISOString() }
      });

      toast.success(`Voto registrado: ${voteType === "for" ? "A favor" : "En contra"}`);
      fetchProposals();
    } catch (error: any) {
      toast.error("Error al registrar voto");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/10 text-green-500";
      case "approved": return "bg-blue-500/10 text-blue-500";
      case "rejected": return "bg-red-500/10 text-red-500";
      default: return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <div 
        className="relative h-[400px] bg-cover bg-center"
        style={{ backgroundImage: `url(${daoImg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/50" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-5xl font-bold text-gradient mb-4 animate-fade-in">
            DAO TAMV
          </h1>
          <p className="text-xl text-foreground/90 max-w-2xl animate-fade-in">
            Gobernanza descentralizada · Voz de la comunidad · Decisiones transparentes
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6 text-center">
              <Vote className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="text-2xl font-bold">{proposals.length}</h3>
              <p className="text-muted-foreground">Propuestas Totales</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="text-2xl font-bold">
                {proposals.filter(p => p.properties?.status === "active").length}
              </h3>
              <p className="text-muted-foreground">Propuestas Activas</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="text-2xl font-bold">100%</h3>
              <p className="text-muted-foreground">Transparencia</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Propuestas de la Comunidad</h2>
            <p className="text-muted-foreground">Participa en las decisiones del ecosistema</p>
          </div>
          {user && (
            <Button 
              onClick={() => setIsCreating(!isCreating)} 
              className="glow-cyan"
            >
              {isCreating ? "Cancelar" : "Nueva Propuesta"}
            </Button>
          )}
        </div>

        {isCreating && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Crear Nueva Propuesta</CardTitle>
              <CardDescription>Comparte tu idea para mejorar el ecosistema TAMV</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Título de la Propuesta</Label>
                <Input
                  id="name"
                  value={newProposal.name}
                  onChange={(e) => setNewProposal({...newProposal, name: e.target.value})}
                  placeholder="Ej: Reducir comisiones del marketplace"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Descripción Detallada</Label>
                <Textarea
                  id="description"
                  value={newProposal.description}
                  onChange={(e) => setNewProposal({...newProposal, description: e.target.value})}
                  placeholder="Explica tu propuesta con detalle..."
                  rows={5}
                />
              </div>

              <Button onClick={handleCreateProposal} className="w-full glow-cyan">
                Publicar Propuesta
              </Button>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : proposals.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Vote className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay propuestas aún</h3>
              <p className="text-muted-foreground">Sé el primero en crear una propuesta</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {proposals.map((proposal) => (
              <Card key={proposal.id} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="mb-2">{proposal.name}</CardTitle>
                      <CardDescription>{proposal.description}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(proposal.properties?.status || "active")}>
                      {proposal.properties?.status || "Activa"}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-6">
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="w-5 h-5 text-green-500" />
                        <span className="font-semibold">{proposal.properties?.votes_for || 0}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ThumbsDown className="w-5 h-5 text-red-500" />
                        <span className="font-semibold">{proposal.properties?.votes_against || 0}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">
                          {new Date(proposal.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {user && proposal.properties?.status === "active" && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVote(proposal.id, "for")}
                          className="gap-1"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          A Favor
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVote(proposal.id, "against")}
                          className="gap-1"
                        >
                          <ThumbsDown className="w-4 h-4" />
                          En Contra
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DAO;
