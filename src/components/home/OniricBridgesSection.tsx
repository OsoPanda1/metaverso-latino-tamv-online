import { Sparkles, Music, Palette, Headphones, Waves, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConcertItem {
  id: string;
  title: string;
  artist: string;
  date: string;
  genre: string;
  attendees: number;
  isLive?: boolean;
  image: string;
}

interface ArtworkItem {
  id: string;
  title: string;
  artist: string;
  price: number;
  likes: number;
  image: string;
}

interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  plays: number;
  genre: string;
}

const mockConcerts: ConcertItem[] = [
  { id: "1", title: "Noche Cuántica", artist: "DJ Anubis", date: "Hoy 22:00", genre: "Electronic", attendees: 15400, isLive: true, image: "/placeholder.svg" },
  { id: "2", title: "Sinfonía Digital", artist: "TAMV Orchestra", date: "Mañana 20:00", genre: "Classical XR", attendees: 8900, image: "/placeholder.svg" },
  { id: "3", title: "Ritmos Ancestrales", artist: "Aztec Beats", date: "Vie 21:00", genre: "World Fusion", attendees: 12300, image: "/placeholder.svg" },
];

const mockArtworks: ArtworkItem[] = [
  { id: "1", title: "Nebulosa Emocional", artist: "Isabella AI", price: 2.5, likes: 1240, image: "/placeholder.svg" },
  { id: "2", title: "Fractal Dreams", artist: "Anubis", price: 1.8, likes: 890, image: "/placeholder.svg" },
  { id: "3", title: "Ciudad Cuántica", artist: "VR Artists", price: 3.2, likes: 2100, image: "/placeholder.svg" },
  { id: "4", title: "Ondas Sensoriales", artist: "SenseArt", price: 1.5, likes: 670, image: "/placeholder.svg" },
];

const mockTracks: MusicTrack[] = [
  { id: "1", title: "Quantum Waves", artist: "DJ Anubis", duration: "4:32", plays: 125000, genre: "Electronic" },
  { id: "2", title: "Isabella's Lullaby", artist: "TAMV Studio", duration: "3:45", plays: 89000, genre: "Ambient" },
  { id: "3", title: "Metaverse Anthem", artist: "Collective", duration: "5:12", plays: 234000, genre: "Orchestral" },
  { id: "4", title: "Digital Dreams", artist: "SynthMaster", duration: "4:18", plays: 67000, genre: "Synthwave" },
  { id: "5", title: "Cosmic Journey", artist: "SpaceBeats", duration: "6:45", plays: 156000, genre: "Progressive" },
];

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export const OniricBridgesSection = () => {
  return (
    <section className="py-16 space-y-16">
      {/* Puentes Oníricos Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 backdrop-blur-sm border border-primary/30">
          <Waves className="w-5 h-5 text-primary animate-pulse" />
          <span className="text-lg font-semibold text-gradient">Puentes Oníricos</span>
          <Sparkles className="w-5 h-5 text-secondary animate-pulse" />
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Conecta con experiencias sensoriales únicas: conciertos inmersivos, arte digital y música del metaverso
        </p>
      </div>

      {/* Conciertos Sensoriales */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/30 backdrop-blur-sm">
              <Music className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Conciertos Sensoriales</h3>
              <p className="text-sm text-muted-foreground">Experiencias inmersivas 360° con audio espacial</p>
            </div>
          </div>
          <Button variant="outline" className="border-primary/50">Ver todos</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockConcerts.map((concert) => (
            <Card key={concert.id} className={cn(
              "relative overflow-hidden rounded-3xl group cursor-pointer",
              "bg-card/20 backdrop-blur-xl border-border/20",
              "hover:border-primary/40 hover:shadow-[0_0_40px_hsl(190,95%,55%/0.3)]",
              "transition-all duration-500"
            )}>
              <div className="aspect-[16/9] relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-secondary/20 to-accent/40" />
                <img src={concert.image} alt={concert.title} className="w-full h-full object-cover opacity-60" />
                
                {concert.isLive && (
                  <Badge className="absolute top-4 left-4 bg-destructive/90 animate-pulse">
                    🔴 EN VIVO
                  </Badge>
                )}
                
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-card/60 backdrop-blur-sm">
                    <Headphones className="w-3 h-3 mr-1" />
                    {formatNumber(concert.attendees)}
                  </Badge>
                </div>

                {/* Iridescent border */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent" />
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent via-primary to-secondary" />
                </div>
              </div>

              <div className="p-4 space-y-2">
                <Badge variant="outline" className="text-xs">{concert.genre}</Badge>
                <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{concert.title}</h4>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{concert.artist}</span>
                  <span className="text-primary">{concert.date}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Galería de Arte */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-secondary/30 to-accent/30 backdrop-blur-sm">
              <Palette className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Galería de Arte</h3>
              <p className="text-sm text-muted-foreground">Obras digitales exclusivas del metaverso</p>
            </div>
          </div>
          <Button variant="outline" className="border-secondary/50">Explorar galería</Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mockArtworks.map((artwork) => (
            <Card key={artwork.id} className={cn(
              "relative overflow-hidden rounded-2xl group cursor-pointer",
              "bg-card/20 backdrop-blur-xl border-border/20",
              "hover:border-secondary/40 hover:shadow-[0_0_30px_hsl(260,80%,65%/0.3)]",
              "transition-all duration-500"
            )}>
              <div className="aspect-square relative">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 via-primary/10 to-accent/30" />
                <img src={artwork.image} alt={artwork.title} className="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-500" />
                
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs font-medium truncate">{artwork.title}</p>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{artwork.artist}</span>
                    <span className="text-primary font-bold">{artwork.price} ETH</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Música */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-accent/30 to-primary/30 backdrop-blur-sm">
              <Headphones className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Música TAMV</h3>
              <p className="text-sm text-muted-foreground">Tracks exclusivos del ecosistema</p>
            </div>
          </div>
          <Button variant="outline" className="border-accent/50">Más música</Button>
        </div>

        <Card className="p-4 bg-card/20 backdrop-blur-xl border-border/20">
          <div className="space-y-2">
            {mockTracks.map((track, index) => (
              <div 
                key={track.id}
                className={cn(
                  "flex items-center gap-4 p-3 rounded-xl",
                  "hover:bg-accent/5 transition-colors cursor-pointer group"
                )}
              >
                <span className="text-lg font-bold text-muted-foreground w-8">{index + 1}</span>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center group-hover:shadow-[0_0_20px_hsl(170,90%,50%/0.3)] transition-shadow">
                  <Music className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate group-hover:text-accent transition-colors">{track.title}</p>
                  <p className="text-sm text-muted-foreground">{track.artist}</p>
                </div>
                <Badge variant="outline" className="hidden md:flex text-xs">{track.genre}</Badge>
                <span className="text-sm text-muted-foreground">{track.duration}</span>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Zap className="w-4 h-4" />
                  {formatNumber(track.plays)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
};
