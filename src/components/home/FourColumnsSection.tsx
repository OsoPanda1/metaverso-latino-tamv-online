import { Users, Radio, Video, TrendingUp, Hash, Play, Heart, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GroupItem {
  id: string;
  name: string;
  members: number;
  gradient: string;
  emoji: string;
  isNew?: boolean;
}

interface ChannelItem {
  id: string;
  name: string;
  subscribers: number;
  gradient: string;
  emoji: string;
  isLive?: boolean;
}

interface LiveItem {
  id: string;
  title: string;
  streamer: string;
  viewers: number;
  gradient: string;
  emoji: string;
}

interface TrendItem {
  id: string;
  tag: string;
  posts: number;
  trending: "up" | "down" | "stable";
  emoji: string;
}

const mockGroups: GroupItem[] = [
  { id: "1", name: "Arte Digital LATAM", members: 12500, gradient: "from-violet-500 to-purple-600", emoji: "🎨", isNew: true },
  { id: "2", name: "Música Electrónica", members: 8900, gradient: "from-pink-500 to-rose-600", emoji: "🎵" },
  { id: "3", name: "Developers XR", members: 5600, gradient: "from-cyan-500 to-blue-600", emoji: "💻" },
  { id: "4", name: "Fotografía 360°", members: 3400, gradient: "from-amber-500 to-orange-600", emoji: "📸" },
  { id: "5", name: "NFT Collectors", members: 15200, gradient: "from-emerald-500 to-teal-600", emoji: "💎" },
  { id: "6", name: "Gaming VR", members: 22000, gradient: "from-red-500 to-pink-600", emoji: "🎮" },
];

const mockChannels: ChannelItem[] = [
  { id: "1", name: "TAMV Official", subscribers: 125000, gradient: "from-cyan-500 to-blue-600", emoji: "✨", isLive: true },
  { id: "2", name: "Isabella AI", subscribers: 89000, gradient: "from-purple-500 to-pink-600", emoji: "🤖" },
  { id: "3", name: "Crypto LATAM", subscribers: 67000, gradient: "from-amber-500 to-yellow-500", emoji: "₿" },
  { id: "4", name: "VR Gaming", subscribers: 45000, gradient: "from-red-500 to-orange-600", emoji: "🎮", isLive: true },
  { id: "5", name: "Art Collective", subscribers: 34000, gradient: "from-pink-500 to-purple-600", emoji: "🖼️" },
];

const mockLives: LiveItem[] = [
  { id: "1", title: "DJ Session Nocturna", streamer: "DJ Anubis", viewers: 15400, gradient: "from-purple-600 via-pink-500 to-red-500", emoji: "🎧" },
  { id: "2", title: "Tutorial DreamSpace", streamer: "TAMV Academy", viewers: 3200, gradient: "from-blue-500 via-cyan-400 to-teal-400", emoji: "📚" },
  { id: "3", title: "Meditación XR", streamer: "ZenMaster", viewers: 1800, gradient: "from-green-400 via-emerald-400 to-teal-500", emoji: "🧘" },
  { id: "4", title: "Gaming Battle Royale", streamer: "ProGamer", viewers: 28000, gradient: "from-red-500 via-orange-500 to-yellow-500", emoji: "🔥" },
];

const mockTrends: TrendItem[] = [
  { id: "1", tag: "TAMVOnline", posts: 125000, trending: "up", emoji: "🚀" },
  { id: "2", tag: "IsabellaAI", posts: 89000, trending: "up", emoji: "🤖" },
  { id: "3", tag: "MetaversoLATAM", posts: 67000, trending: "stable", emoji: "🌎" },
  { id: "4", tag: "DreamSpaces", posts: 45000, trending: "up", emoji: "✨" },
  { id: "5", tag: "CriptoArte", posts: 34000, trending: "up", emoji: "💎" },
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
                  <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-xl", group.gradient)}>
                    {group.emoji}
                  </div>
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
                  <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-xl relative", channel.gradient)}>
                    {channel.emoji}
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

        {/* Lives Column - Visual Cards */}
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
                  <div className={cn("aspect-video bg-gradient-to-br flex items-center justify-center", live.gradient)}>
                    <span className="text-4xl">{live.emoji}</span>
                    {/* Play button overlay */}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-xs font-medium text-white truncate">{live.title}</p>
                    <p className="text-[10px] text-white/70">{live.streamer}</p>
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
                  <span className="text-xl">{trend.emoji}</span>
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
