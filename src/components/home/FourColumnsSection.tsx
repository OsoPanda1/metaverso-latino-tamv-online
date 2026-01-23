import { Users, Radio, Video, TrendingUp, Hash, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GroupItem {
  id: string;
  name: string;
  members: number;
  image: string;
  isNew?: boolean;
}

interface ChannelItem {
  id: string;
  name: string;
  subscribers: number;
  image: string;
  isLive?: boolean;
}

interface LiveItem {
  id: string;
  title: string;
  streamer: string;
  viewers: number;
  image: string;
  avatar: string;
}

interface TrendItem {
  id: string;
  tag: string;
  posts: number;
  trending: "up" | "down" | "stable";
  image: string;
}

// Real images for all sections
const mockGroups: GroupItem[] = [
  { id: "1", name: "Arte Digital LATAM", members: 12500, image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200&h=200&fit=crop", isNew: true },
  { id: "2", name: "Música Electrónica", members: 8900, image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop" },
  { id: "3", name: "Developers XR", members: 5600, image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&h=200&fit=crop" },
  { id: "4", name: "Fotografía 360°", members: 3400, image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=200&h=200&fit=crop" },
  { id: "5", name: "NFT Collectors", members: 15200, image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=200&h=200&fit=crop" },
  { id: "6", name: "Gaming VR", members: 22000, image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=200&h=200&fit=crop" },
];

const mockChannels: ChannelItem[] = [
  { id: "1", name: "TAMV Official", subscribers: 125000, image: "https://images.unsplash.com/photo-1633177317976-3f9bc45e1d1d?w=200&h=200&fit=crop", isLive: true },
  { id: "2", name: "Isabella AI", subscribers: 89000, image: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=200&h=200&fit=crop" },
  { id: "3", name: "Crypto LATAM", subscribers: 67000, image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=200&h=200&fit=crop" },
  { id: "4", name: "VR Gaming", subscribers: 45000, image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=200&h=200&fit=crop", isLive: true },
  { id: "5", name: "Art Collective", subscribers: 34000, image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop" },
];

const mockLives: LiveItem[] = [
  { id: "1", title: "DJ Session Nocturna", streamer: "DJ Anubis", viewers: 15400, image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=250&fit=crop", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { id: "2", title: "Tutorial DreamSpace", streamer: "TAMV Academy", viewers: 3200, image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&h=250&fit=crop", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
  { id: "3", title: "Meditación XR", streamer: "ZenMaster", viewers: 1800, image: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=250&fit=crop", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
  { id: "4", title: "Gaming Battle Royale", streamer: "ProGamer", viewers: 28000, image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=250&fit=crop", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
];

const mockTrends: TrendItem[] = [
  { id: "1", tag: "TAMVOnline", posts: 125000, trending: "up", image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&h=100&fit=crop" },
  { id: "2", tag: "IsabellaAI", posts: 89000, trending: "up", image: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=100&h=100&fit=crop" },
  { id: "3", tag: "MetaversoLATAM", posts: 67000, trending: "stable", image: "https://images.unsplash.com/photo-1614850715649-1d0106293bd1?w=100&h=100&fit=crop" },
  { id: "4", tag: "DreamSpaces", posts: 45000, trending: "up", image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=100&h=100&fit=crop" },
  { id: "5", tag: "CriptoArte", posts: 34000, trending: "up", image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=100&h=100&fit=crop" },
];

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export const FourColumnsSection = () => {
  return (
    <section className="py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Groups Column */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Users className="w-5 h-5 text-primary" />
            <span className="font-bold">Grupos</span>
          </div>
          <ScrollArea className="h-[350px]">
            <div className="space-y-2 pr-4">
              {mockGroups.map((group, i) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-primary/10 transition-colors cursor-pointer group"
                >
                  <img 
                    src={group.image} 
                    alt={group.name}
                    className="w-12 h-12 rounded-xl object-cover"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                        {group.name}
                      </span>
                      {group.isNew && (
                        <Badge className="bg-green-500 text-white text-[10px] px-1.5 py-0">NEW</Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{formatNumber(group.members)} miembros</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Channels Column */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Radio className="w-5 h-5 text-secondary" />
            <span className="font-bold">Canales</span>
          </div>
          <ScrollArea className="h-[350px]">
            <div className="space-y-2 pr-4">
              {mockChannels.map((channel, i) => (
                <motion.div
                  key={channel.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/10 transition-colors cursor-pointer group"
                >
                  <div className="relative">
                    <img 
                      src={channel.image} 
                      alt={channel.name}
                      className="w-12 h-12 rounded-xl object-cover"
                      loading="lazy"
                    />
                    {channel.isLive && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-background animate-pulse" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-sm truncate block group-hover:text-secondary transition-colors">
                      {channel.name}
                    </span>
                    <span className="text-xs text-muted-foreground">{formatNumber(channel.subscribers)} subs</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Lives Column - Visual Cards with real images */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Video className="w-5 h-5 text-red-500" />
            <span className="font-bold">En Vivo</span>
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </div>
          <ScrollArea className="h-[350px]">
            <div className="space-y-3 pr-4">
              {mockLives.map((live, i) => (
                <motion.div
                  key={live.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="relative rounded-xl overflow-hidden cursor-pointer group"
                >
                  <div className="aspect-video relative">
                    <img 
                      src={live.image} 
                      alt={live.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                        <Play className="w-5 h-5 text-black ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-red-500 text-white border-0 text-[10px]">
                      🔴 {formatNumber(live.viewers)}
                    </Badge>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <div className="flex items-center gap-2">
                      <img 
                        src={live.avatar}
                        alt={live.streamer}
                        className="w-6 h-6 rounded-full object-cover border border-white/30"
                      />
                      <div>
                        <p className="text-xs font-medium text-white truncate">{live.title}</p>
                        <p className="text-[10px] text-white/70">{live.streamer}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Trends Column */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <TrendingUp className="w-5 h-5 text-accent" />
            <span className="font-bold">Tendencias</span>
          </div>
          <ScrollArea className="h-[350px]">
            <div className="space-y-2 pr-4">
              {mockTrends.map((trend, index) => (
                <motion.div
                  key={trend.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-accent/10 to-transparent hover:from-accent/20 transition-colors cursor-pointer group"
                >
                  <span className="text-2xl font-bold text-muted-foreground/50 w-8">{index + 1}</span>
                  <img 
                    src={trend.image}
                    alt={trend.tag}
                    className="w-10 h-10 rounded-lg object-cover"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <Hash className="w-4 h-4 text-accent" />
                      <span className="font-semibold text-sm group-hover:text-accent transition-colors">
                        {trend.tag}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatNumber(trend.posts)} posts</span>
                  </div>
                  <TrendingUp className={cn(
                    "w-5 h-5",
                    trend.trending === "up" && "text-green-500",
                    trend.trending === "down" && "text-red-500 rotate-180",
                    trend.trending === "stable" && "text-muted-foreground rotate-90"
                  )} />
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </section>
  );
};
