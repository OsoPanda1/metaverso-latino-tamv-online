import { Sparkles, Music, Palette, Headphones, Play, Heart, Clock } from "lucide-react";
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
  image: string;
  artistAvatar: string;
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
  cover: string;
  artistAvatar: string;
}

// Real images for concerts
const mockConcerts: ConcertItem[] = [
  { 
    id: "1", 
    title: "Noche Cuántica", 
    artist: "DJ Anubis", 
    date: "HOY 22:00", 
    genre: "Electronic", 
    attendees: 15400, 
    isLive: true, 
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=350&fit=crop",
    artistAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },
  { 
    id: "2", 
    title: "Sinfonía Digital", 
    artist: "TAMV Orchestra", 
    date: "Mañana 20:00", 
    genre: "Classical XR", 
    attendees: 8900, 
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&h=350&fit=crop",
    artistAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
  },
  { 
    id: "3", 
    title: "Ritmos Ancestrales", 
    artist: "Aztec Beats", 
    date: "Viernes 21:00", 
    genre: "World Fusion", 
    attendees: 12300, 
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=350&fit=crop",
    artistAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
  },
  { 
    id: "4", 
    title: "Electro Dreams", 
    artist: "SynthMaster", 
    date: "Sábado 23:00", 
    genre: "Synthwave", 
    attendees: 9800, 
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=350&fit=crop",
    artistAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
  },
];

// Real artwork images
const mockArtworks: ArtworkItem[] = [
  { id: "1", title: "Nebulosa Emocional", artist: "Isabella AI", price: 2.5, likes: 1240, image: "https://images.unsplash.com/photo-1634017839464-5c339bbe3c35?w=400&h=400&fit=crop" },
  { id: "2", title: "Fractal Dreams", artist: "Anubis", price: 1.8, likes: 890, image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop" },
  { id: "3", title: "Ciudad Cuántica", artist: "VR Artists", price: 3.2, likes: 2100, image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&h=400&fit=crop" },
  { id: "4", title: "Ondas Sensoriales", artist: "SenseArt", price: 1.5, likes: 670, image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=400&fit=crop" },
  { id: "5", title: "Cosmos Interior", artist: "NightOwl", price: 4.2, likes: 3200, image: "https://images.unsplash.com/photo-1614850715649-1d0106293bd1?w=400&h=400&fit=crop" },
  { id: "6", title: "Sueño Azteca", artist: "MayaArt", price: 5.0, likes: 4500, image: "https://images.unsplash.com/photo-1633177317976-3f9bc45e1d1d?w=400&h=400&fit=crop" },
];

// Real music covers
const mockTracks: MusicTrack[] = [
  { id: "1", title: "Quantum Waves", artist: "DJ Anubis", duration: "4:32", plays: 125000, cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop", artistAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face" },
  { id: "2", title: "Isabella's Lullaby", artist: "TAMV Studio", duration: "3:45", plays: 89000, cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=200&h=200&fit=crop", artistAvatar: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=50&h=50&fit=crop&crop=face" },
  { id: "3", title: "Metaverse Anthem", artist: "Collective", duration: "5:12", plays: 234000, cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&h=200&fit=crop", artistAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face" },
  { id: "4", title: "Digital Dreams", artist: "SynthMaster", duration: "4:18", plays: 67000, cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=200&h=200&fit=crop", artistAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face" },
  { id: "5", title: "Cosmic Journey", artist: "SpaceBeats", duration: "6:45", plays: 156000, cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop", artistAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face" },
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

      {/* Conciertos - Horizontal Scroll with real images */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-primary" />
            <span className="font-bold">Conciertos Sensoriales</span>
            <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">XR Live</Badge>
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
              <div className="aspect-video relative">
                <img 
                  src={concert.image}
                  alt={concert.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-2xl">
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

              <div className="absolute bottom-0 left-0 right-0 p-4">
                <Badge className="mb-2 bg-white/20 text-white border-0 text-[10px]">{concert.genre}</Badge>
                <h4 className="font-bold text-white text-lg">{concert.title}</h4>
                <div className="flex items-center justify-between text-sm mt-2">
                  <div className="flex items-center gap-2">
                    <img 
                      src={concert.artistAvatar}
                      alt={concert.artist}
                      className="w-6 h-6 rounded-full object-cover border border-white/30"
                    />
                    <span className="text-white/80">{concert.artist}</span>
                  </div>
                  <span className="text-primary font-semibold">{concert.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Galería - Grid with real artwork images */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-secondary" />
            <span className="font-bold">Galería de Arte</span>
            <Badge className="bg-secondary/20 text-secondary border-secondary/30 text-xs">NFT</Badge>
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
              <img 
                src={artwork.image}
                alt={artwork.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              
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

      {/* Música - Compact List with real covers */}
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
              <div className="relative">
                <img 
                  src={track.cover}
                  alt={track.title}
                  className="w-12 h-12 rounded-lg object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="w-5 h-5 text-white" fill="currentColor" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate group-hover:text-accent transition-colors">{track.title}</p>
                <div className="flex items-center gap-2">
                  <img 
                    src={track.artistAvatar}
                    alt={track.artist}
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  <p className="text-xs text-muted-foreground">{track.artist}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {track.duration}
                </p>
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
