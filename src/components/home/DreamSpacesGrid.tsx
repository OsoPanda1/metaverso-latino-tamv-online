import { Play, Eye, Clock, Sparkles, Heart, MessageCircle, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DreamSpaceItem {
  id: string;
  title: string;
  gradient: string;
  views: number;
  duration: string;
  isLive?: boolean;
  creator: string;
  avatar: string;
  likes: number;
}

const mockDreamSpaces: DreamSpaceItem[] = [
  { id: "1", title: "Galaxia Onírica", gradient: "from-violet-600 via-purple-500 to-fuchsia-500", views: 12400, duration: "23:45", creator: "Isabella AI", avatar: "🌌", likes: 3200 },
  { id: "2", title: "Bosque Cuántico", gradient: "from-emerald-500 via-teal-400 to-cyan-400", views: 8900, duration: "15:30", isLive: true, creator: "Anubis", avatar: "🌲", likes: 1800 },
  { id: "3", title: "Ciudad Neón 2099", gradient: "from-pink-500 via-rose-500 to-red-500", views: 45000, duration: "1:02:15", creator: "TAMV Studio", avatar: "🏙️", likes: 8900 },
  { id: "4", title: "Océano Digital", gradient: "from-blue-500 via-cyan-400 to-teal-300", views: 23100, duration: "45:00", creator: "VR Artists", avatar: "🌊", likes: 4500 },
  { id: "5", title: "Templo Maya XR", gradient: "from-amber-500 via-orange-500 to-red-600", views: 67000, duration: "32:18", creator: "Cultura MX", avatar: "🏛️", likes: 12000, isLive: true },
  { id: "6", title: "Aurora Borealis", gradient: "from-green-400 via-cyan-500 to-blue-600", views: 18500, duration: "28:42", isLive: true, creator: "NaturXR", avatar: "🌈", likes: 5600 },
  { id: "7", title: "Dimensión Fractal", gradient: "from-indigo-600 via-purple-600 to-pink-600", views: 9200, duration: "19:55", creator: "MathArt", avatar: "🔮", likes: 2100 },
  { id: "8", title: "Jardín Zen", gradient: "from-lime-400 via-green-500 to-emerald-600", views: 31000, duration: "55:30", creator: "ZenMaster", avatar: "🧘", likes: 7800 },
  { id: "9", title: "Nebulosa Emocional", gradient: "from-fuchsia-500 via-purple-500 to-indigo-600", views: 14300, duration: "41:12", creator: "EmotiSpace", avatar: "💫", likes: 3400 },
  { id: "10", title: "Laberinto Sensorial", gradient: "from-rose-500 via-pink-500 to-purple-600", views: 27800, duration: "38:05", creator: "SenseVR", avatar: "🎭", likes: 6200 },
];

const formatViews = (views: number): string => {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return views.toString();
};

interface DreamSpaceCardProps {
  item: DreamSpaceItem;
  index: number;
}

const DreamSpaceCard = ({ item, index }: DreamSpaceCardProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.05, duration: 0.3 }}
    whileHover={{ scale: 1.05, zIndex: 10 }}
    className={cn(
      "group relative overflow-hidden rounded-2xl cursor-pointer",
      "bg-card/20 backdrop-blur-sm border border-border/10",
      "hover:shadow-[0_0_50px_rgba(0,0,0,0.5)]",
      "transition-all duration-300"
    )}
  >
    {/* Thumbnail with gradient */}
    <div className="relative aspect-[9/16] md:aspect-video overflow-hidden">
      <div className={cn("absolute inset-0 bg-gradient-to-br", item.gradient)} />
      
      {/* Animated particles overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse" />
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-white rounded-full animate-ping" />
        <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>
      
      {/* Avatar emoji as main visual */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-6xl md:text-7xl filter drop-shadow-2xl group-hover:scale-125 transition-transform duration-500">
          {item.avatar}
        </span>
      </div>
      
      {/* Play overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
        <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
          <Play className="w-7 h-7 text-black ml-1" fill="currentColor" />
        </div>
      </div>

      {/* Live badge */}
      {item.isLive && (
        <Badge className="absolute top-3 left-3 bg-red-500 text-white border-0 shadow-lg animate-pulse">
          <span className="w-2 h-2 bg-white rounded-full mr-2 animate-ping" />
          EN VIVO
        </Badge>
      )}

      {/* Duration */}
      {!item.isLive && (
        <Badge variant="secondary" className="absolute bottom-3 right-3 bg-black/70 text-white border-0 backdrop-blur-sm">
          <Clock className="w-3 h-3 mr-1" />
          {item.duration}
        </Badge>
      )}

      {/* Views counter */}
      <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm">
        <Eye className="w-3 h-3 text-white" />
        <span className="text-xs text-white font-medium">{formatViews(item.views)}</span>
      </div>

      {/* Gradient overlay for text */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
    </div>

    {/* Info */}
    <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
      <h3 className="font-bold text-sm text-white truncate drop-shadow-lg">
        {item.title}
      </h3>
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/80">{item.creator}</span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Heart className="w-3 h-3 text-red-400" fill="currentColor" />
            <span className="text-xs text-white/80">{formatViews(item.likes)}</span>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

export const DreamSpacesGrid = () => {
  const firstRow = mockDreamSpaces.slice(0, 5);
  const secondRow = mockDreamSpaces.slice(5, 10);

  return (
    <section className="py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-primary animate-pulse" />
          <h2 className="text-2xl font-bold text-gradient">DreamSpaces</h2>
        </div>
        <button className="text-sm text-primary hover:underline">Ver todos →</button>
      </div>

      {/* First Row - Scrollable on mobile */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide md:grid md:grid-cols-5 md:overflow-visible">
        {firstRow.map((item, i) => (
          <div key={item.id} className="min-w-[200px] md:min-w-0">
            <DreamSpaceCard item={item} index={i} />
          </div>
        ))}
      </div>

      {/* Second Row */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide md:grid md:grid-cols-5 md:overflow-visible">
        {secondRow.map((item, i) => (
          <div key={item.id} className="min-w-[200px] md:min-w-0">
            <DreamSpaceCard item={item} index={i + 5} />
          </div>
        ))}
      </div>
    </section>
  );
};
