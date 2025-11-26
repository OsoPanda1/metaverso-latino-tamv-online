import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Radio, Users, Clock, Gift, Eye, Sparkle, Video, Coins, Zap } from "lucide-react";

import { MatrixRainCanvas } from "@/components/xr-effects/MatrixRainCanvas";
import { HoloHexGridSVG } from "@/components/xr-effects/HoloHexGridSVG";
import { ParallaxMotion } from "@/components/xr-effects/ParallaxMotion";
import { TamvReactions } from "@/components/quantum/TamvReactions";
import { TamvLiveTicker } from "@/components/quantum/TamvLiveTicker";
import { TamvBadgeAnim } from "@/components/quantum/TamvBadgeAnim";
import { TamvTipInput } from "@/components/quantum/TamvTipInput";

interface LiveStream {
  id: string;
  title: string;
  description: string;
  status: string;
  viewer_count: number;
  max_viewers: number;
  total_earnings: number;
  scheduled_start: string;
  started_at: string;
}

const reactions = [
  { type: "chido", label: "Chido", emoji: "🤙", color: "bg-emerald-500" },
  { type: "chanclazo", label: "Chanclazo", emoji: "🩴", color: "bg-yellow-400" },
  { type: "alv", label: "ALV", emoji: "🚀", color: "bg-pink-500" },
  { type: "cmamo", label: "CMAMO", emoji: "🦙", color: "bg-sky-400" }
];

export default function Lives() {
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStream, setActiveStream] = useState<LiveStream | null>(null);
  const [tipDialog, setTipDialog] = useState(false);

  useEffect(() => {
    fetchStreams();
    const channel = supabase
      .channel("live_streams_changes")
      .on("postgres_changes",
        { event: "*", schema: "public", table: "live_streams" },
        fetchStreams
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
    // eslint-disable-next-line
  }, []);

  const fetchStreams = async () => {
    try {
      const { data, error } = await supabase
        .from("live_streams")
        .select("*")
        .in("status", ["live", "scheduled"])
        .order("started_at", { ascending: false, nullsFirst: false });
      if (error) throw error;
      setStreams(data || []);
    } catch (error: any) {
      toast.error("Error loading streams: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-gradient-to-r from-red-500 to-pink-400 text-white animate-glow";
      case "scheduled":
        return "bg-blue-500/10 text-blue-500";
      default:
        return "bg-zinc-800/80 text-zinc-200";
    }
  };

  // Parallax card tilt
  const handleMouse = (e:any, idx:number) => {
    let card = document.getElementById("livestream-card-" + idx);
    if (card) {
      const x = e.nativeEvent.offsetX;
      const y = e.nativeEvent.offsetY;
      const w = card.offsetWidth, h = card.offsetHeight;
      const xRot = ((y - h / 2) / h) * 14;
      const yRot = ((x - w / 2) / w) * -16;
      card.style.transform = `perspective(700px) rotateX(${xRot}deg) rotateY(${yRot}deg) scale(1.04)`;
    }
  };
  const resetMouse = (idx:number) => {
    let card = document.getElementById("livestream-card-" + idx);
    if (card) card.style.transform ="perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)";
  };

  return (
    <div className="relative min-h-screen bg-background p-0 overflow-x-hidden">
      {/* XR Effects: MatrixRain, HoloHexGrid, Parallax */}
      <MatrixRainCanvas className="fixed inset-0 z-0 opacity-90 pointer-events-none" rainColor="#19e3ff" />
      <HoloHexGridSVG className="fixed inset-0 z-10 pointer-events-none" nLayers={7} animate />
      <ParallaxMotion className="fixed inset-0 z-20 pointer-events-none" blobColor="#31baff" depth={5} fog shimmer />

      <div className="relative max-w-7xl mx-auto py-16 px-4 z-50">
        {/* Ticker and global XR badges */}
        <TamvLiveTicker streams={streams.filter(s=>s.status==="live")} />
        <div className="mb-10 mt-4 flex gap-5 items-center">
          <span className="text-5xl bg-clip-text text-transparent bg-gradient-to-br from-cyan-300 via-blue-400 to-pink-400 font-black drop-shadow-[0_2px_40px_#00fffc]" style={{letterSpacing:"-0.05em"}}>TAMV Live™ </span>
          <span className="ml-6 text-lg py-2 px-4 rounded-2xl glass-morph neon-glow flex items-center animate-pulse shadow-xl">
            <Eye className="w-5 h-5 mr-1" /> XR Ready
          </span>
          <Button size="sm" variant="outline" className="glass-morph text-blue-400 ml-12 font-bold">Start XR Stream</Button>
        </div>
        <p className="text-xl text-cyan-100/70 max-w-2xl mb-10 animate-fade-lr">Streaming civilizatorio XR. Monetiza, conecta y disfruta experiencias en tiempo real como nunca antes: MatrixRain interactivo, meta-badges, tips y reacciones “Chido”, “CMAMO”, “ALV” y más.</p>
          
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-9">
          {streams.map((stream, idx) => (
            <Card
              id={`livestream-card-${idx}`}
              key={stream.id}
              className={
                `glass-morph neon-glow animate-float shadow-2xl hover:shadow-[0_0_50px_#00ffee87]
                 transition-transform min-h-[23rem] hover:scale-[1.04] group border-2 border-cyan-500/10 relative`
              }
              onMouseMove={e => handleMouse(e, idx)}
              onMouseLeave={()=>resetMouse(idx)}
              style={{transition:'transform .14s cubic-bezier(.8, -.3,.23,1.4)'}}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <Radio className={`h-6 w-6 ${stream.status==="live" ? "text-red-500 animate-pulse drop-shadow-xl" : "text-muted-foreground"}`} />
                    {stream.status==="live" && <TamvBadgeAnim type="live" />}
                  </div>
                  <Badge className={getStatusColor(stream.status)}>
                    {stream.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <CardTitle className="line-clamp-2 text-shadow-glow">{stream.title}</CardTitle>
                  <Video className="w-7 h-7 text-cyan-400 opacity-60" />
                </div>
              </CardHeader>
              <CardContent>
                {stream.description && (
                  <p className="text-md text-cyan-100/80 mb-4 font-mono line-clamp-2 italic">{stream.description}</p>
                )}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-md text-cyan-200 font-medium drop-shadow">
                    <Users className="h-5 w-5" />
                    <span>{stream.viewer_count.toLocaleString()} viewers</span>
                    {stream.max_viewers>0 && <span className="ml-auto text-sm opacity-50">Peak: {stream.max_viewers}</span>}
                  </div>
                  {stream.status === "scheduled" && stream.scheduled_start && (
                    <div className="flex items-center gap-2 text-md text-blue-400">
                      <Clock className="h-5 w-5" />
                      <span>{new Date(stream.scheduled_start).toLocaleString()}</span>
                    </div>
                  )}
                  {stream.total_earnings > 0 && (
                    <div className="flex items-center gap-2 text-lg text-yellow-400 font-bold">
                      <Gift className="h-5 w-5" /><Coins className="h-5 w-5"/>
                      <span>{stream.total_earnings.toFixed(2)} TC earned</span>
                    </div>
                  )}
                </div>
                {/* XR Reactions */}
                <TamvReactions options={reactions} entityId={stream.id} motion neonGlow />
                {/* Monetization */}
                {stream.status === "live" && <TamvTipInput streamId={stream.id} />}
                {/* Watch/Join button */}
                <Button
                  className="mt-3 w-full glass-morph neon-glow text-white font-extrabold tracking-wide hover:scale-[1.04]"
                  disabled={stream.status !== "live"}
                  onClick={()=>setActiveStream(stream)}
                >
                  {stream.status === "live" ? <><Sparkle className="inline-block mr-2 animate-pulse" />Watch Live XR</> : "Scheduled"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {streams.length === 0 && !loading && (
          <Card className="mt-10 bg-gradient-to-br from-zinc-950 via-cyan-900/70 to-zinc-800 border-cyan-700 neon-glow animate-fade-lr">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <Radio className="h-16 w-16 text-gradient-glass mb-4 animate-spin" />
              <h3 className="text-2xl font-semibold mb-2 text-cyan-200">No Live Streams (for now)</h3>
              <p className="text-xl text-cyan-700">¡Vuelve luego para XR live, comunidad TAMV y experiencias jamás vistas!</p>
            </CardContent>
          </Card>
        )}

        {/* Stream overlay/modal (if watching) */}
        {activeStream && (
          <div className="fixed inset-0 bg-[#000a] z-50 flex items-center justify-center animate-fadein-fast">
            {/* Aquí iría el player XR embebido (WebRTC, Hls.js, Three.js, etc) */}
            <div className="bg-black/90 p-2 rounded-2xl relative w-full max-w-2xl shadow-2xl neon-glow">
              <div className="flex items-center gap-4 mb-3">
                <Radio className="text-red-500 animate-pulse" />
                <h2 className="text-xl font-bold text-cyan-200 flex-1">{activeStream.title}</h2>
                <Button onClick={()=>setActiveStream(null)} className="glass neon-glow">Salir</Button>
              </div>
              <div className="aspect-video bg-zinc-900 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <span className="text-cyan-200">[XR/Meta Stream Player Placeholder]</span>
              </div>
              <p className="text-cyan-100 text-lg">{activeStream.description}</p>
              <TamvReactions options={reactions} entityId={activeStream.id} large neonGlow />
              <TamvTipInput streamId={activeStream.id} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
