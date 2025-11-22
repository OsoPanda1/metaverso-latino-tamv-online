import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Users, Shield, Brain, Heart, Briefcase, BookOpen } from "lucide-react";
import { toast } from "sonner";

interface Fork {
  id: string;
  name: string;
  sector: string;
  guardian_symbol: string;
  is_active: boolean;
  created_at: string;
}

const guardianIcons: Record<string, any> = {
  Tlaloc: Heart,
  Quetzalcóatl: Brain,
  Tlazoltéotl: BookOpen,
  Huitzilopochtli: Briefcase,
  Xólotl: Shield,
};

const sectorColors: Record<string, string> = {
  Salud: "bg-red-500/10 text-red-500",
  Arte: "bg-purple-500/10 text-purple-500",
  Educación: "bg-blue-500/10 text-blue-500",
  Comercio: "bg-green-500/10 text-green-500",
  Memoria: "bg-orange-500/10 text-orange-500",
};

export default function Forks() {
  const [forks, setForks] = useState<Fork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForks();
  }, []);

  const fetchForks = async () => {
    try {
      const { data, error } = await supabase
        .from("forks")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (error) throw error;
      setForks(data || []);
    } catch (error: any) {
      toast.error("Error loading forks: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Activity className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Forks™ Federados Sectoriales</h1>
          <p className="text-muted-foreground">Explore sectoral branches with DAO governance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forks.map((fork) => {
            const GuardianIcon = guardianIcons[fork.guardian_symbol] || Shield;
            return (
              <Card key={fork.id} className="hover:border-primary transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <GuardianIcon className="h-6 w-6 text-primary" />
                    <Badge className={sectorColors[fork.sector] || ""}>{fork.sector}</Badge>
                  </div>
                  <CardTitle>{fork.name}</CardTitle>
                  <CardDescription>Guardian: {fork.guardian_symbol}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Active Cells: {Math.floor(Math.random() * 50) + 10}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      Created {new Date(fork.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {forks.length === 0 && (
          <Card className="mt-8">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Users className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Forks Available</h3>
              <p className="text-muted-foreground">Sectoral forks will appear here</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}