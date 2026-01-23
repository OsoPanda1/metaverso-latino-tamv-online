import { Play, Eye, Clock, Sparkles, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DreamSpaceItem {
  id: string;
  title: string;
  image: string;
  video?: string;
  views: number;
  duration: string;
  isLive?: boolean;
  creator: string;
  avatar: string;
  likes: number;
}

// Real images from Unsplash - metaverse/XR/digital art themes
const mockDreamSpaces: DreamSpaceItem[] = [
  { 
    id: "1", 
    title: "Galaxia Onírica", 
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&h=400&fit=crop",
    video: "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4",
    views: 12400, 
    duration: "23:45", 
    creator: "Isabella AI", 
    avatar: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=100&h=100&fit=crop&crop=face",
    likes: 3200 
  },
  { 
    id: "2", 
    title: "Bosque Cuántico", 
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&h=400&fit=crop",
    views: 8900, 
    duration: "15:30", 
    isLive: true, 
    creator: "Anubis", 
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    likes: 1800 
  },
  { 
    id: "3", 
    title: "Ciudad Neón 2099", 
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=400&fit=crop",
    video: "https://assets.mixkit.co/videos/preview/mixkit-going-down-a-curved-highway-through-a-city-at-night-41576-large.mp4",
    views: 45000, 
    duration: "1:02:15", 
    creator: "TAMV Studio", 
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    likes: 8900 
  },
  { 
    id: "4", 
    title: "Océano Digital", 
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop",
    views: 23100, 
    duration: "45:00", 
    creator: "VR Artists", 
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    likes: 4500 
  },
  { 
    id: "5", 
    title: "Templo Maya XR", 
    image: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=600&h=400&fit=crop",
    views: 67000, 
    duration: "32:18", 
    creator: "Cultura MX", 
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    likes: 12000, 
    isLive: true 
  },
  { 
    id: "6", 
    title: "Aurora Borealis", 
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&h=400&fit=crop",
    video: "https://assets.mixkit.co/videos/preview/mixkit-northern-lights-over-mountains-29037-large.mp4",
    views: 18500, 
    duration: "28:42", 
    isLive: true, 
    creator: "NaturXR", 
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    likes: 5600 
  },
  { 
    id: "7", 
    title: "Dimensión Fractal", 
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600&h=400&fit=crop",
    views: 9200, 
    duration: "19:55", 
    creator: "MathArt", 
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&crop=face",
    likes: 2100 
  },
  { 
    id: "8", 
    title: "Jardín Zen Digital", 
    image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&h=400&fit=crop",
    views: 31000, 
    duration: "55:30", 
    creator: "ZenMaster", 
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face",
    likes: 7800 
  },
  { 
    id: "9", 
    title: "Nebulosa Emocional", 
    image: "https://images.unsplash.com/photo-1464802686167-b939a6910659?w=600&h=400&fit=crop",
    views: 14300, 
    duration: "41:12", 
    creator: "EmotiSpace", 
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
    likes: 3400 
  },
  { 
    id: "10", 
    title: "Laberinto Sensorial", 
    image: "https://images.unsplash.com/photo-1633177317976-3f9bc45e1d1d?w=600&h=400&fit=crop",
    video: "https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-network-connections-33089-large.mp4",
    views: 27800, 
    duration: "38:05", 
    creator: "SenseVR", 
    avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100&h=100&fit=crop&crop=face",
    likes: 6200 
  },
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
      "hover:shadow-[0_0_50px_rgba(0,200,255,0.3)]",
      "transition-all duration-300"
    )}
  >
    {/* Thumbnail with real image */}
    <div className="relative aspect-[9/16] md:aspect-video overflow-hidden">
      {/* Background image */}
      <img 
        src={item.image} 
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />
      
      {/* Video on hover (if available) */}
      {item.video && (
        <video
          src={item.video}
          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          muted
          loop
          playsInline
          onMouseEnter={(e) => e.currentTarget.play()}
          onMouseLeave={(e) => e.currentTarget.pause()}
        />
      )}
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      
      {/* Play overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
    </div>

    {/* Info */}
    <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
      <h3 className="font-bold text-sm text-white truncate drop-shadow-lg">
        {item.title}
      </h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img 
            src={item.avatar} 
            alt={item.creator}
            className="w-6 h-6 rounded-full object-cover border border-white/30"
          />
          <span className="text-xs text-white/80">{item.creator}</span>
        </div>
        <div className="flex items-center gap-1">
          <Heart className="w-3 h-3 text-red-400" fill="currentColor" />
          <span className="text-xs text-white/80">{formatViews(item.likes)}</span>
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
          <Badge className="bg-primary/20 text-primary border-primary/30">4D XR</Badge>
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
