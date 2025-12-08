import { Users, Radio, Video, TrendingUp, Hash, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface GroupItem {
  id: string;
  name: string;
  members: number;
  avatar: string;
  isNew?: boolean;
}

interface ChannelItem {
  id: string;
  name: string;
  subscribers: number;
  category: string;
}

interface LiveItem {
  id: string;
  title: string;
  streamer: string;
  viewers: number;
  thumbnail: string;
}

interface TrendItem {
  id: string;
  tag: string;
  posts: number;
  trending: "up" | "down" | "stable";
}

const mockGroups: GroupItem[] = [
  { id: "1", name: "Arte Digital LATAM", members: 12500, avatar: "AD", isNew: true },
  { id: "2", name: "Música Electrónica", members: 8900, avatar: "ME" },
  { id: "3", name: "Developers XR", members: 5600, avatar: "DX" },
  { id: "4", name: "Fotografía 360°", members: 3400, avatar: "F3" },
  { id: "5", name: "NFT Collectors", members: 15200, avatar: "NC" },
];

const mockChannels: ChannelItem[] = [
  { id: "1", name: "TAMV Official", subscribers: 125000, category: "Oficial" },
  { id: "2", name: "Isabella AI News", subscribers: 89000, category: "IA" },
  { id: "3", name: "Crypto LATAM", subscribers: 67000, category: "Finanzas" },
  { id: "4", name: "VR Gaming MX", subscribers: 45000, category: "Gaming" },
  { id: "5", name: "Art Collective", subscribers: 34000, category: "Arte" },
];

const mockLives: LiveItem[] = [
  { id: "1", title: "Concierto Virtual - DJ Anubis", streamer: "Anubis", viewers: 15400, thumbnail: "/placeholder.svg" },
  { id: "2", title: "Tutorial: Crear tu DreamSpace", streamer: "TAMV Academy", viewers: 3200, thumbnail: "/placeholder.svg" },
  { id: "3", title: "Sesión de Meditación XR", streamer: "ZenMaster", viewers: 1800, thumbnail: "/placeholder.svg" },
  { id: "4", title: "Debate: Futuro del Metaverso", streamer: "Panel Expertos", viewers: 5600, thumbnail: "/placeholder.svg" },
];

const mockTrends: TrendItem[] = [
  { id: "1", tag: "TAMVOnline", posts: 125000, trending: "up" },
  { id: "2", tag: "IsabellaAI", posts: 89000, trending: "up" },
  { id: "3", tag: "MetaversoLATAM", posts: 67000, trending: "stable" },
  { id: "4", tag: "DreamSpaces", posts: 45000, trending: "up" },
  { id: "5", tag: "CriptoArte", posts: 34000, trending: "down" },
  { id: "6", tag: "XRExperience", posts: 28000, trending: "up" },
];

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const ColumnCard = ({ title, icon: Icon, children, accentColor = "primary" }: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  accentColor?: string;
}) => (
  <Card className={cn(
    "p-4 h-[400px] flex flex-col",
    "bg-card/30 backdrop-blur-xl border-border/20",
    "hover:border-primary/30 transition-all duration-300",
    "shadow-[0_0_30px_hsl(var(--card)/0.3)]"
  )}>
    {/* Header */}
    <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/20">
      <div className="flex items-center gap-2">
        <div className={cn(
          "p-2 rounded-xl",
          accentColor === "primary" && "bg-primary/20",
          accentColor === "secondary" && "bg-secondary/20",
          accentColor === "accent" && "bg-accent/20",
          accentColor === "destructive" && "bg-destructive/20"
        )}>
          <Icon className={cn(
            "w-5 h-5",
            accentColor === "primary" && "text-primary",
            accentColor === "secondary" && "text-secondary",
            accentColor === "accent" && "text-accent",
            accentColor === "destructive" && "text-destructive"
          )} />
        </div>
        <h3 className="font-bold text-lg">{title}</h3>
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground" />
    </div>

    {/* Content */}
    <ScrollArea className="flex-1 -mr-4 pr-4">
      {children}
    </ScrollArea>

    {/* Iridescent bottom border */}
    <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
  </Card>
);

export const FourColumnsSection = () => {
  return (
    <section className="py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Groups Column */}
        <ColumnCard title="Grupos" icon={Users} accentColor="primary">
          <div className="space-y-3">
            {mockGroups.map((group) => (
              <div 
                key={group.id}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-primary/5 transition-colors cursor-pointer group"
              >
                <Avatar className="h-10 w-10 border-2 border-primary/30">
                  <AvatarFallback className="bg-primary/20 text-primary text-sm">
                    {group.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                      {group.name}
                    </span>
                    {group.isNew && (
                      <Badge className="bg-accent/20 text-accent text-[10px] px-1.5">NEW</Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{formatNumber(group.members)} miembros</span>
                </div>
              </div>
            ))}
          </div>
        </ColumnCard>

        {/* Channels Column */}
        <ColumnCard title="Canales" icon={Radio} accentColor="secondary">
          <div className="space-y-3">
            {mockChannels.map((channel) => (
              <div 
                key={channel.id}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/5 transition-colors cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <Radio className="w-5 h-5 text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-sm truncate block group-hover:text-secondary transition-colors">
                    {channel.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">{channel.category}</Badge>
                    <span className="text-xs text-muted-foreground">{formatNumber(channel.subscribers)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ColumnCard>

        {/* Lives Column */}
        <ColumnCard title="En Vivo" icon={Video} accentColor="destructive">
          <div className="space-y-3">
            {mockLives.map((live) => (
              <div 
                key={live.id}
                className="relative rounded-xl overflow-hidden cursor-pointer group"
              >
                <div className="aspect-video bg-gradient-to-br from-destructive/20 to-primary/20">
                  <img src={live.thumbnail} alt={live.title} className="w-full h-full object-cover opacity-70" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <Badge className="bg-destructive/90 text-[10px] mb-1 animate-pulse">
                    🔴 {formatNumber(live.viewers)} viendo
                  </Badge>
                  <p className="text-xs font-medium truncate">{live.title}</p>
                  <p className="text-[10px] text-muted-foreground">{live.streamer}</p>
                </div>
              </div>
            ))}
          </div>
        </ColumnCard>

        {/* Trends & Hashtags Column */}
        <ColumnCard title="Tendencias" icon={TrendingUp} accentColor="accent">
          <div className="space-y-2">
            {mockTrends.map((trend, index) => (
              <div 
                key={trend.id}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-accent/5 transition-colors cursor-pointer group"
              >
                <span className="text-lg font-bold text-muted-foreground w-6">{index + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <Hash className="w-4 h-4 text-accent" />
                    <span className="font-medium text-sm group-hover:text-accent transition-colors">
                      {trend.tag}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatNumber(trend.posts)} posts</span>
                </div>
                <TrendingUp className={cn(
                  "w-4 h-4",
                  trend.trending === "up" && "text-green-500",
                  trend.trending === "down" && "text-red-500 rotate-180",
                  trend.trending === "stable" && "text-muted-foreground rotate-90"
                )} />
              </div>
            ))}
          </div>
        </ColumnCard>
      </div>
    </section>
  );
};
