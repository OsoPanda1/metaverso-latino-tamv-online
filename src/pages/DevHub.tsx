import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { MatrixBackground } from "@/components/MatrixBackground";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Code, Terminal, Database, Shield, Globe, Cpu, 
  GitBranch, Layers, Zap, BookOpen, FileCode, Server,
  Cloud, Lock, Eye, Activity, Box, Workflow,
  CheckCircle, AlertTriangle, XCircle, Clock,
  Play, RefreshCw, Download, Upload, Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

// Architecture L0-L3 Levels
const architectureLevels = [
  {
    level: "L0",
    name: "Núcleo UX",
    description: "SSR + streaming HTTP/3, navegación, feed, chat, Isabella Core",
    status: "active",
    services: ["SSR Engine", "Feed Service", "Chat Core", "Isabella Gateway"],
    color: "primary"
  },
  {
    level: "L1",
    name: "Servicios Críticos",
    description: "Pagos, media, identidad, OIDC + WebAuthn, SSI/DID, ZK proofs",
    status: "active",
    services: ["Payments SVC", "Media SVC", "Identity SVC", "Auth Gateway"],
    color: "secondary"
  },
  {
    level: "L2",
    name: "Experiencias Intensivas",
    description: "XR/3D, conciertos, DreamSpaces, DevHub, analytics, tienda",
    status: "active",
    services: ["XR Engine", "Concert SVC", "DreamSpaces", "Analytics"],
    color: "accent"
  },
  {
    level: "L3",
    name: "Orquestación & Gobernanza",
    description: "Isabella Core, hypermódulos, Sentinel, EOCT, BookPI, GEIA",
    status: "active",
    services: ["Isabella Core", "OmniSentinel", "BookPI", "GEIA Engine"],
    color: "destructive"
  }
];

// Technology Stack
const techStack = [
  { name: "WebGPU", category: "Render", status: "active", icon: Box },
  { name: "OpenXR/WebXR", category: "XR", status: "active", icon: Globe },
  { name: "glTF 2.0 + KTX2", category: "Assets", status: "active", icon: FileCode },
  { name: "OpenUSD", category: "Scenes", status: "beta", icon: Layers },
  { name: "WebRTC SFU", category: "RTC", status: "active", icon: Zap },
  { name: "NeRF/Gaussian", category: "4D", status: "experimental", icon: Cpu },
  { name: "SSI/DID", category: "Identity", status: "active", icon: Lock },
  { name: "CloudXR", category: "Streaming", status: "beta", icon: Cloud },
];

// System Metrics
const systemMetrics = [
  { name: "API Latency", value: "23ms", status: "healthy", trend: "down" },
  { name: "Error Rate", value: "0.02%", status: "healthy", trend: "stable" },
  { name: "Active Users", value: "12.4K", status: "healthy", trend: "up" },
  { name: "XR Sessions", value: "847", status: "healthy", trend: "up" },
  { name: "BookPI Events/s", value: "1.2K", status: "healthy", trend: "stable" },
  { name: "Guardian Alerts", value: "3", status: "warning", trend: "up" },
];

// Folio Status
const folioStatus = [
  { id: 0, name: "Origen", status: "immutable", integrity: "100%" },
  { id: 1, name: "Guardianes", status: "active", integrity: "99.8%" },
  { id: 2, name: "Cells/Twins", status: "active", integrity: "99.9%" },
  { id: 3, name: "Visual Engine", status: "active", integrity: "99.7%" },
  { id: 4, name: "Economía", status: "active", integrity: "99.9%" },
  { id: 5, name: "Observabilidad", status: "active", integrity: "100%" },
  { id: 6, name: "Onboarding", status: "active", integrity: "99.5%" },
];

const DevHub = () => {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navigation />
      <MatrixBackground />

      <main className="relative z-10 pt-24 pb-20 px-4 md:px-8">
        <div className="container mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <Badge className="bg-primary/20 text-primary border-primary/30 px-4 py-2">
              <Terminal className="w-4 h-4 mr-2" />
              DevHub TAMV 2026
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="text-gradient">Núcleo Maestro Federado</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Arquitectura L0–L3, algoritmia híbrida 3D/4D, doble federación técnica y de dominios
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {systemMetrics.map((metric) => (
              <Card key={metric.name} className={cn(
                "p-4 bg-card/30 backdrop-blur-xl border-border/20",
                metric.status === "warning" && "border-yellow-500/30"
              )}>
                <div className="flex items-center justify-between mb-2">
                  <Activity className={cn(
                    "w-4 h-4",
                    metric.status === "healthy" ? "text-green-500" : "text-yellow-500"
                  )} />
                  {metric.trend === "up" && <Badge className="bg-green-500/20 text-green-400 text-[10px]">↑</Badge>}
                  {metric.trend === "down" && <Badge className="bg-blue-500/20 text-blue-400 text-[10px]">↓</Badge>}
                </div>
                <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                <p className="text-xs text-muted-foreground">{metric.name}</p>
              </Card>
            ))}
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="architecture" className="space-y-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 bg-card/30 backdrop-blur-xl p-2 rounded-2xl">
              <TabsTrigger value="architecture" className="data-[state=active]:bg-primary/20">
                <Layers className="w-4 h-4 mr-2" />Arquitectura
              </TabsTrigger>
              <TabsTrigger value="technologies" className="data-[state=active]:bg-primary/20">
                <Cpu className="w-4 h-4 mr-2" />Tecnologías
              </TabsTrigger>
              <TabsTrigger value="folios" className="data-[state=active]:bg-primary/20">
                <BookOpen className="w-4 h-4 mr-2" />Folios
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-primary/20">
                <Shield className="w-4 h-4 mr-2" />Seguridad
              </TabsTrigger>
              <TabsTrigger value="operations" className="data-[state=active]:bg-primary/20">
                <Workflow className="w-4 h-4 mr-2" />Operaciones
              </TabsTrigger>
            </TabsList>

            {/* Architecture Tab */}
            <TabsContent value="architecture" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {architectureLevels.map((level) => (
                  <Card 
                    key={level.level}
                    className={cn(
                      "p-6 bg-card/30 backdrop-blur-xl border-border/20 cursor-pointer",
                      "hover:border-primary/40 transition-all duration-300",
                      selectedLevel === level.level && "border-primary/60 shadow-[0_0_30px_hsl(190,95%,55%/0.2)]"
                    )}
                    onClick={() => setSelectedLevel(selectedLevel === level.level ? null : level.level)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <Badge className={cn(
                          "mb-2",
                          level.color === "primary" && "bg-primary/20 text-primary",
                          level.color === "secondary" && "bg-secondary/20 text-secondary",
                          level.color === "accent" && "bg-accent/20 text-accent",
                          level.color === "destructive" && "bg-destructive/20 text-destructive"
                        )}>
                          {level.level}
                        </Badge>
                        <h3 className="text-xl font-bold">{level.name}</h3>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{level.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {level.services.map((service) => (
                        <Badge key={service} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Federation Diagram */}
              <Card className="p-6 bg-card/30 backdrop-blur-xl border-border/20">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-primary" />
                  Doble Federación
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-primary">Eje Técnico (Cloud–Edge)</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5">
                        <Server className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">Edge</p>
                          <p className="text-xs text-muted-foreground">Prerender, validación, cues AV, sync &lt;100ms</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/5">
                        <Cloud className="w-5 h-5 text-secondary" />
                        <div>
                          <p className="font-medium">Cloud</p>
                          <p className="text-xs text-muted-foreground">IA, orquestación, persistencia, BookPI</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-secondary">Eje de Dominios (Isabella)</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {["Social", "Economy", "XR", "Dev", "Guardian", "Voice"].map((domain) => (
                        <div key={domain} className="p-2 rounded-xl bg-card/50 text-center">
                          <p className="text-sm font-medium">{domain}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Technologies Tab */}
            <TabsContent value="technologies" className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {techStack.map((tech) => (
                  <Card key={tech.name} className="p-4 bg-card/30 backdrop-blur-xl border-border/20 hover:border-primary/40 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <tech.icon className="w-6 h-6 text-primary" />
                      <Badge className={cn(
                        "text-[10px]",
                        tech.status === "active" && "bg-green-500/20 text-green-400",
                        tech.status === "beta" && "bg-yellow-500/20 text-yellow-400",
                        tech.status === "experimental" && "bg-purple-500/20 text-purple-400"
                      )}>
                        {tech.status}
                      </Badge>
                    </div>
                    <h4 className="font-bold">{tech.name}</h4>
                    <p className="text-xs text-muted-foreground">{tech.category}</p>
                  </Card>
                ))}
              </div>

              {/* Render Pipeline */}
              <Card className="p-6 bg-card/30 backdrop-blur-xl border-border/20">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Box className="w-5 h-5 text-accent" />
                  Pipeline 3D/4D
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-primary/5 space-y-2">
                    <h4 className="font-semibold text-primary">Determinista</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• LOD jerárquico</li>
                      <li>• Frustum/Occlusion culling</li>
                      <li>• Instancing/Batching</li>
                      <li>• Tiled rendering</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/5 space-y-2">
                    <h4 className="font-semibold text-secondary">Aprendizaje</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Adaptive scene streaming</li>
                      <li>• Predictive prefetch</li>
                      <li>• Quality scaler</li>
                      <li>• Routing cognitivo</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-accent/5 space-y-2">
                    <h4 className="font-semibold text-accent">Compresión</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Semántica perceptiva</li>
                      <li>• Fusión de partículas</li>
                      <li>• Priorización narrativa</li>
                      <li>• Oráculo TAMV</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Folios Tab */}
            <TabsContent value="folios" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {folioStatus.map((folio) => (
                  <Card key={folio.id} className="p-4 bg-card/30 backdrop-blur-xl border-border/20 hover:border-primary/40 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-primary/20 text-primary">Folio {folio.id}</Badge>
                      {folio.status === "immutable" ? (
                        <Lock className="w-4 h-4 text-yellow-500" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <h4 className="font-bold mb-2">{folio.name}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{folio.status}</span>
                      <span className="text-sm font-bold text-green-400">{folio.integrity}</span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-accent"
                        style={{ width: folio.integrity }}
                      />
                    </div>
                  </Card>
                ))}
              </div>

              {/* BookPI Events */}
              <Card className="p-6 bg-card/30 backdrop-blur-xl border-border/20">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5 text-secondary" />
                  BookPI Events Stream
                </h3>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    {[
                      { type: "ceremony.joined", user: "user_0x7a3", time: "hace 2s", level: "L2" },
                      { type: "mission.created", user: "user_0x8b1", time: "hace 5s", level: "L1" },
                      { type: "av.orchestrate", user: "system", time: "hace 8s", level: "L3" },
                      { type: "recognition.issued", user: "user_0x4c2", time: "hace 12s", level: "L2" },
                      { type: "risk.flagged", user: "sentinel", time: "hace 15s", level: "L3" },
                    ].map((event, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-card/50">
                        <Badge variant="outline" className="text-xs">{event.level}</Badge>
                        <code className="text-sm text-primary flex-1">{event.type}</code>
                        <span className="text-xs text-muted-foreground">{event.user}</span>
                        <span className="text-xs text-muted-foreground">{event.time}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 bg-card/30 backdrop-blur-xl border-border/20">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-primary" />
                    Identity-as-a-Sovereign-Service
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/5 border border-green-500/20">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium">OIDC + WebAuthn/Passkeys</p>
                        <p className="text-xs text-muted-foreground">Sin contraseñas, autenticación biométrica</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/5 border border-green-500/20">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium">SSI/DID + ZK Proofs</p>
                        <p className="text-xs text-muted-foreground">Identidad soberana, verificable sin exposición</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/5 border border-green-500/20">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium">Privacidad Diferencial</p>
                        <p className="text-xs text-muted-foreground">Agregación y anonimización de métricas</p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-card/30 backdrop-blur-xl border-border/20">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-secondary" />
                    OmniSentinel Status
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-card/50">
                      <span className="text-sm">CodeLedger Integrity</span>
                      <Badge className="bg-green-500/20 text-green-400">Verified</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-card/50">
                      <span className="text-sm">Rutas Rojas Protection</span>
                      <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-card/50">
                      <span className="text-sm">State Reconciler</span>
                      <Badge className="bg-green-500/20 text-green-400">Synced</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-card/50">
                      <span className="text-sm">IOC Engine</span>
                      <Badge className="bg-yellow-500/20 text-yellow-400">3 Alerts</Badge>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Operations Tab */}
            <TabsContent value="operations" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="h-auto p-6 flex flex-col items-center gap-3 bg-primary/20 hover:bg-primary/30 border border-primary/30">
                  <Play className="w-8 h-8" />
                  <span>Deploy Canario</span>
                </Button>
                <Button className="h-auto p-6 flex flex-col items-center gap-3 bg-secondary/20 hover:bg-secondary/30 border border-secondary/30">
                  <RefreshCw className="w-8 h-8" />
                  <span>Rollback</span>
                </Button>
                <Button className="h-auto p-6 flex flex-col items-center gap-3 bg-accent/20 hover:bg-accent/30 border border-accent/30">
                  <Settings className="w-8 h-8" />
                  <span>Configuración</span>
                </Button>
              </div>

              <Card className="p-6 bg-card/30 backdrop-blur-xl border-border/20">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Roadmap 90 Días
                </h3>
                <div className="space-y-4">
                  {[
                    { phase: "Fase 1", weeks: "1-3", title: "Infra & Observabilidad", status: "complete" },
                    { phase: "Fase 2", weeks: "4-6", title: "Edge, Media & XR", status: "active" },
                    { phase: "Fase 3", weeks: "7-9", title: "Identidad Soberana & Seguridad", status: "pending" },
                    { phase: "Fase 4", weeks: "10-12", title: "IA Orquestadora & Economía", status: "pending" },
                  ].map((item) => (
                    <div key={item.phase} className="flex items-center gap-4 p-4 rounded-xl bg-card/50">
                      {item.status === "complete" && <CheckCircle className="w-5 h-5 text-green-500" />}
                      {item.status === "active" && <RefreshCw className="w-5 h-5 text-primary animate-spin" />}
                      {item.status === "pending" && <Clock className="w-5 h-5 text-muted-foreground" />}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{item.phase}</Badge>
                          <span className="text-sm text-muted-foreground">Semanas {item.weeks}</span>
                        </div>
                        <p className="font-medium mt-1">{item.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default DevHub;