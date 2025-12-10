import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { MatrixBackground } from "@/components/MatrixBackground";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Shield, ShieldCheck, Globe, Server, Activity,
  AlertTriangle, Eye, Zap, Brain, Skull
} from "lucide-react";

interface FederationRecord {
  entity_type: string;
  entity_id: string;
  local_hash: string;
  continental_hash: string;
  local_at: string;
  continental_at: string;
  verified: boolean;
}

interface SystemStats {
  name: string;
  count: number;
  icon: any;
  color: string;
}

export default function Federation() {
  const [records, setRecords] = useState<FederationRecord[]>([]);
  const [stats, setStats] = useState<SystemStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch federation records via join (since we can't use the view directly)
        const { data: localData } = await supabase
          .from("federation_registry_local")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(100);

        const { data: contData } = await supabase
          .from("federation_registry_continental")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(100);

        // Match records
        const matched: FederationRecord[] = [];
        for (const local of (localData || [])) {
          const cont = contData?.find(
            c => c.entity_type === local.entity_type && 
                 c.entity_id === local.entity_id &&
                 c.hash === local.hash
          );
          if (cont) {
            matched.push({
              entity_type: local.entity_type,
              entity_id: local.entity_id,
              local_hash: local.hash,
              continental_hash: cont.hash,
              local_at: local.created_at,
              continental_at: cont.created_at,
              verified: local.hash === cont.hash
            });
          }
        }
        setRecords(matched);

        // Calculate stats
        const typeCounts: Record<string, number> = {};
        for (const r of matched) {
          typeCounts[r.entity_type] = (typeCounts[r.entity_type] || 0) + 1;
        }

        const iconMap: Record<string, any> = {
          id_nvida: Shield,
          blackhole: Skull,
          tamvcrum: AlertTriangle,
          eoct: Brain,
          anubis_sentinel: Eye,
          dekateotl: Zap,
          radar_mos: Activity,
          radar_ra: Eye,
          radar_quetzal: Globe,
          kaos_audio3d: Activity
        };

        const colorMap: Record<string, string> = {
          id_nvida: "text-cyan-400",
          blackhole: "text-red-400",
          tamvcrum: "text-yellow-400",
          eoct: "text-purple-400",
          anubis_sentinel: "text-amber-400",
          dekateotl: "text-emerald-400",
          radar_mos: "text-blue-400",
          radar_ra: "text-orange-400",
          radar_quetzal: "text-teal-400",
          kaos_audio3d: "text-pink-400"
        };

        setStats(
          Object.entries(typeCounts).map(([name, count]) => ({
            name,
            count,
            icon: iconMap[name] || Shield,
            color: colorMap[name] || "text-primary"
          }))
        );

      } catch (err) {
        console.error("Federation fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getEntityLabel = (type: string) => {
    const labels: Record<string, string> = {
      id_nvida: "ID-NVIDA",
      blackhole: "Hoyo Negro",
      tamvcrum: "TAMVCRUM",
      eoct: "EOCT",
      anubis_sentinel: "Anubis Sentinel",
      dekateotl: "Dekateotl",
      radar_mos: "Radar MOS",
      radar_ra: "Ojo de Ra",
      radar_quetzal: "Quetzalcóatl",
      kaos_audio3d: "Kaos Audio 3D"
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen relative">
      <MatrixBackground />
      <Navigation />
      
      <main className="relative z-10 container mx-auto px-4 py-8 pt-24">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30">
            <Globe className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gradient">
              Centro de Federación Doble
            </h1>
            <p className="text-muted-foreground">
              Verificación criptográfica Local + Continental
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardContent className="p-4 text-center">
              <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
              <div className="text-2xl font-bold text-emerald-400">
                {records.filter(r => r.verified).length}
              </div>
              <div className="text-xs text-muted-foreground">Verificados</div>
            </CardContent>
          </Card>

          {stats.slice(0, 4).map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.name} className="bg-card/50 backdrop-blur border-border/50">
                <CardContent className="p-4 text-center">
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-xl font-bold">{stat.count}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {getEntityLabel(stat.name)}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="records" className="space-y-4">
          <TabsList className="bg-card/50 backdrop-blur">
            <TabsTrigger value="records">Registros Federados</TabsTrigger>
            <TabsTrigger value="systems">Sistemas Activos</TabsTrigger>
            <TabsTrigger value="audit">Auditoría</TabsTrigger>
          </TabsList>

          <TabsContent value="records">
            <Card className="bg-card/50 backdrop-blur border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-primary" />
                  Registros de Doble Federación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  {loading ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Cargando registros...
                    </div>
                  ) : records.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No hay registros federados aún
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {records.map((record, i) => (
                        <div
                          key={`${record.entity_id}-${i}`}
                          className="p-4 rounded-lg bg-background/50 border border-border/50 hover:border-primary/30 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <Badge 
                              variant="outline" 
                              className="bg-primary/10 border-primary/30"
                            >
                              {getEntityLabel(record.entity_type)}
                            </Badge>
                            {record.verified ? (
                              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                                <ShieldCheck className="w-3 h-3 mr-1" />
                                Verificado
                              </Badge>
                            ) : (
                              <Badge variant="destructive">
                                Sin Verificar
                              </Badge>
                            )}
                          </div>
                          
                          <div className="text-xs font-mono text-muted-foreground space-y-1">
                            <div className="flex justify-between">
                              <span>Entity ID:</span>
                              <span className="text-foreground">{record.entity_id.slice(0, 16)}...</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Hash:</span>
                              <span className="text-cyan-400">{record.local_hash.slice(0, 24)}...</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Local:</span>
                              <span>{new Date(record.local_at).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Continental:</span>
                              <span>{new Date(record.continental_at).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="systems">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.name} className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/30 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-background/50 ${stat.color}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="font-semibold">{getEntityLabel(stat.name)}</div>
                          <div className="text-sm text-muted-foreground">
                            {stat.count} registros federados
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="audit">
            <Card className="bg-card/50 backdrop-blur border-primary/20">
              <CardContent className="p-6 text-center">
                <Shield className="w-16 h-16 mx-auto mb-4 text-primary/50" />
                <h3 className="text-lg font-semibold mb-2">Auditoría de Federación</h3>
                <p className="text-muted-foreground">
                  Panel de auditoría completo con trazabilidad BookPI y verificación cuántica.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
