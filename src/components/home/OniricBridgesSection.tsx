import { Sparkles, Music, Palette, Headphones, Play, Heart, Eye, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ConcertItem {
  id: string;
  title: string;
  artist: string;
  date: string;
  genre: string;
  attendees: number;
  isLive?: boolean;
  gradient: string;
  emoji: string;
}

interface ArtworkItem {
  id: string;
  title: string;
  artist: string;
  price: number;
  likes: number;
  gradient: string;
  emoji: string;
}

interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  plays: number;
  gradient: string;
  emoji: string;
}

const mockConcerts: ConcertItem[] = [
  { id: "1", title: "Noche Cuántica", artist: "DJ Anubis", date: "HOY 22:00", genre: "Electronic", attendees: 15400, isLive: true, gradient: "from-purple-600 via-pink-500 to-red-500", emoji: "🎧" },
  { id: "2", title: "Sinfonía Digital", artist: "TAMV Orchestra", date: "Mañana 20:00", genre: "Classical XR", attendees: 8900, gradient: "from-blue-600 via-indigo-500 to-purple-500", emoji: "🎻" },
  { id: "3", title: "Ritmos Ancestrales", artist: "Aztec Beats", date: "Viernes 21:00", genre: "World Fusion", attendees: 12300, gradient: "from-amber-500 via-orange-500 to-red-600", emoji: "🪘" },
  { id: "4", title: "Electro Dreams", artist: "SynthMaster", date: "Sábado 23:00", genre: "Synthwave", attendees: 9800, gradient: "from-cyan-500 via-blue-500 to-purple-600", emoji: "⚡" },
];

const mockArtworks: ArtworkItem[] = [
  { id: "1", title: "Nebulosa Emocional", artist: "Isabella AI", price: 2.5, likes: 1240, gradient: "from-violet-500 via-purple-500 to-fuchsia-500", emoji: "🌌" },
  { id: "2", title: "Fractal Dreams", artist: "Anubis", price: 1.8, likes: 890, gradient: "from-pink-500 via-rose-500 to-red-500", emoji: "🔮" },
  { id: "3", title: "Ciudad Cuántica", artist: "VR Artists", price: 3.2, likes: 2100, gradient: "from-cyan-400 via-blue-500 to-indigo-600", emoji: "🏙️" },
  { id: "4", title: "Ondas Sensoriales", artist: "SenseArt", price: 1.5, likes: 670, gradient: "from-green-400 via-emerald-500 to-teal-600", emoji: "🌊" },
  { id: "5", title: "Cosmos Interior", artist: "NightOwl", price: 4.2, likes: 3200, gradient: "from-indigo-600 via-purple-600 to-pink-600", emoji: "✨" },
  { id: "6", title: "Sueño Azteca", artist: "MayaArt", price: 5.0, likes: 4500, gradient: "from-amber-500 via-yellow-500 to-orange-500", emoji: "🏛️" },
];

const mockTracks: MusicTrack[] = [
  { id: "1", title: "Quantum Waves", artist: "DJ Anubis", duration: "4:32", plays: 125000, gradient: "from-purple-500 to-pink-500", emoji: "🌊" },
  { id: "2", title: "Isabella's Lullaby", artist: "TAMV Studio", duration: "3:45", plays: 89000, gradient: "from-blue-500 to-cyan-500", emoji: "🌙" },
  { id: "3", title: "Metaverse Anthem", artist: "Collective", duration: "5:12", plays: 234000, gradient: "from-amber-500 to-red-500", emoji: "🚀" },
  { id: "4", title: "Digital Dreams", artist: "SynthMaster", duration: "4:18", plays: 67000, gradient: "from-pink-500 to-purple-500", emoji: "💫" },
  { id: "5", title: "Cosmic Journey", artist: "SpaceBeats", duration: "6:45", plays: 156000, gradient: "from-indigo-500 to-purple-500", emoji: "🌠" },
];

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export const OniricBridgesSection = () => {
  return (
    <section className="py-8 space-y-12">
      {/* Header */}
      <div className="flex items-center justify-center gap-3">
        <Sparkles className="w-6 h-6 text-primary animate-pulse" />
        <h2 className="text-2xl md:text-3xl font-bold text-gradient">Puentes Oníricos</h2>
        <Sparkles className="w-6 h-6 text-secondary animate-pulse" />
      </div>

      {/* Conciertos - Horizontal Scroll */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-primary" />
            <span className="font-bold">Conciertos Sensoriales</span>
          </div>
          <button className="text-sm text-primary hover:underline">Ver todos →</button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {mockConcerts.map((concert, i) => (
            <motion.div
              key={concert.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="min-w-[280px] md:min-w-[320px] relative rounded-2xl overflow-hidden cursor-pointer group"
            >
              <div className={cn("aspect-video bg-gradient-to-br flex items-center justify-center", concert.gradient)}>
                <span className="text-6xl filter drop-shadow-2xl group-hover:scale-125 transition-transform duration-500">{concert.emoji}</span>
                
                {/* Play overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                    <Play className="w-7 h-7 text-black ml-1" fill="currentColor" />
                  </div>
                </div>
              </div>
              
              {concert.isLive && (
                <Badge className="absolute top-3 left-3 bg-red-500 text-white border-0 animate-pulse">
                  🔴 EN VIVO
                </Badge>
              )}
              
              <div className="absolute top-3 right-3">
                <Badge variant="secondary" className="bg-black/60 text-white border-0 backdrop-blur-sm">
                  <Headphones className="w-3 h-3 mr-1" />
                  {formatNumber(concert.attendees)}
                </Badge>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                <Badge className="mb-2 bg-white/20 text-white border-0 text-[10px]">{concert.genre}</Badge>
                <h4 className="font-bold text-white text-lg">{concert.title}</h4>
                <div className="flex items-center justify-between text-sm text-white/80">
                  <span>{concert.artist}</span>
                  <span className="text-primary font-semibold">{concert.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Galería - Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-secondary" />
            <span className="font-bold">Galería de Arte</span>
          </div>
          <button className="text-sm text-secondary hover:underline">Explorar →</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {mockArtworks.map((artwork, i) => (
            <motion.div
              key={artwork.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br flex items-center justify-center", artwork.gradient)}>
                <span className="text-4xl filter drop-shadow-2xl group-hover:scale-125 transition-transform duration-500">{artwork.emoji}</span>
              </div>
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                <p className="text-xs font-bold text-white truncate">{artwork.title}</p>
                <div className="flex items-center justify-between text-[10px] text-white/80">
                  <span>{artwork.artist}</span>
                  <span className="text-green-400 font-bold">{artwork.price} ETH</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Heart className="w-3 h-3 text-red-400" fill="currentColor" />
                  <span className="text-[10px] text-white/80">{formatNumber(artwork.likes)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Música - Compact List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Headphones className="w-5 h-5 text-accent" />
            <span className="font-bold">Música TAMV</span>
          </div>
          <button className="text-sm text-accent hover:underline">Más música →</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {mockTracks.map((track, i) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-card/30 hover:bg-card/50 transition-colors cursor-pointer group"
            >
              <div className={cn("w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center text-xl", track.gradient)}>
                {track.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate group-hover:text-accent transition-colors">{track.title}</p>
                <p className="text-xs text-muted-foreground">{track.artist}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{track.duration}</p>
                <p className="text-[10px] text-muted-foreground flex items-center gap-1 justify-end">
                  <Play className="w-3 h-3" /> {formatNumber(track.plays)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
