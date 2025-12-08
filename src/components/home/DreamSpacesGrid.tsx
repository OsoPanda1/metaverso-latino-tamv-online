import { Play, Eye, Clock, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DreamSpaceItem {
  id: string;
  title: string;
  thumbnail: string;
  views: number;
  duration: string;
  isLive?: boolean;
  creator: string;
}

const mockDreamSpaces: DreamSpaceItem[] = [
  { id: "1", title: "Galaxia Onírica", thumbnail: "/placeholder.svg", views: 12400, duration: "23:45", creator: "Isabella AI" },
  { id: "2", title: "Bosque Cuántico", thumbnail: "/placeholder.svg", views: 8900, duration: "15:30", isLive: true, creator: "Anubis" },
  { id: "3", title: "Ciudad Neón 2099", thumbnail: "/placeholder.svg", views: 45000, duration: "1:02:15", creator: "TAMV Studio" },
  { id: "4", title: "Océano Digital", thumbnail: "/placeholder.svg", views: 23100, duration: "45:00", creator: "VR Artists" },
  { id: "5", title: "Templo Maya XR", thumbnail: "/placeholder.svg", views: 67000, duration: "32:18", creator: "Cultura MX" },
  { id: "6", title: "Aurora Borealis VR", thumbnail: "/placeholder.svg", views: 18500, duration: "28:42", isLive: true, creator: "NaturXR" },
  { id: "7", title: "Dimensión Fractal", thumbnail: "/placeholder.svg", views: 9200, duration: "19:55", creator: "MathArt" },
  { id: "8", title: "Jardín Zen Infinito", thumbnail: "/placeholder.svg", views: 31000, duration: "55:30", creator: "ZenMaster" },
  { id: "9", title: "Nebulosa Emocional", thumbnail: "/placeholder.svg", views: 14300, duration: "41:12", creator: "EmotiSpace" },
  { id: "10", title: "Laberinto Sensorial", thumbnail: "/placeholder.svg", views: 27800, duration: "38:05", creator: "SenseVR" },
];

const formatViews = (views: number): string => {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return views.toString();
};

interface DreamSpaceCardProps {
  item: DreamSpaceItem;
}

const DreamSpaceCard = ({ item }: DreamSpaceCardProps) => (
  <Card className={cn(
    "group relative overflow-hidden rounded-2xl cursor-pointer",
    "bg-card/30 backdrop-blur-sm border-border/20",
    "hover:border-primary/40 hover:shadow-[0_0_30px_hsl(190,95%,55%/0.2)]",
    "transition-all duration-500"
  )}>
    {/* Thumbnail */}
    <div className="relative aspect-video overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20" />
      <img 
        src={item.thumbnail} 
        alt={item.title}
        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
      />
      
      {/* Play overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-14 h-14 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-[0_0_20px_hsl(190,95%,55%/0.5)]">
          <Play className="w-6 h-6 text-primary-foreground ml-1" fill="currentColor" />
        </div>
      </div>

      {/* Duration / Live badge */}
      <div className="absolute bottom-2 right-2">
        {item.isLive ? (
          <Badge className="bg-destructive/90 text-destructive-foreground backdrop-blur-sm animate-pulse">
            <Sparkles className="w-3 h-3 mr-1" />
            EN VIVO
          </Badge>
        ) : (
          <Badge variant="secondary" className="bg-card/80 backdrop-blur-sm">
            <Clock className="w-3 h-3 mr-1" />
            {item.duration}
          </Badge>
        )}
      </div>

      {/* Iridescent top border */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>

    {/* Info */}
    <div className="p-3 space-y-1">
      <h3 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
        {item.title}
      </h3>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{item.creator}</span>
        <div className="flex items-center gap-1">
          <Eye className="w-3 h-3" />
          {formatViews(item.views)}
        </div>
      </div>
    </div>
  </Card>
);

export const DreamSpacesGrid = () => {
  const firstRow = mockDreamSpaces.slice(0, 5);
  const secondRow = mockDreamSpaces.slice(5, 10);

  return (
    <section className="py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-gradient">DreamSpaces</h2>
          <p className="text-muted-foreground">Experiencias inmersivas multisensoriales</p>
        </div>
        <Badge variant="outline" className="border-primary/50 text-primary">
          Ver todos
        </Badge>
      </div>

      {/* First Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {firstRow.map((item) => (
          <DreamSpaceCard key={item.id} item={item} />
        ))}
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {secondRow.map((item) => (
          <DreamSpaceCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};
