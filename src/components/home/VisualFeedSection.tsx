import { motion } from "framer-motion";
import { Play, Eye, Heart, Radio, Music, Palette, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

const liveStreams = [
  { id: 1, image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop", title: "Concierto XR", viewers: 2341, isLive: true },
  { id: 2, image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop", title: "DJ Session", viewers: 1567, isLive: true },
  { id: 3, image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop", title: "Festival Neon", viewers: 892, isLive: true },
];

const videoFeed = [
  { id: 1, image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=500&fit=crop", likes: 12400, views: 89000 },
  { id: 2, image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=500&fit=crop", likes: 8900, views: 45000 },
  { id: 3, image: "https://images.unsplash.com/photo-1634017839464-5c339bbe3c35?w=400&h=500&fit=crop", likes: 15600, views: 120000 },
  { id: 4, image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=500&fit=crop", likes: 6700, views: 34000 },
  { id: 5, image: "https://images.unsplash.com/photo-1614850715649-1d0106293bd1?w=400&h=500&fit=crop", likes: 21300, views: 156000 },
  { id: 6, image: "https://images.unsplash.com/photo-1633177317976-3f9bc45e1d1d?w=400&h=500&fit=crop", likes: 9800, views: 67000 },
];

const musicTracks = [
  { id: 1, cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop", plays: 45000 },
  { id: 2, cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=200&h=200&fit=crop", plays: 32000 },
  { id: 3, cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&h=200&fit=crop", plays: 78000 },
  { id: 4, cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=200&h=200&fit=crop", plays: 56000 },
];

export const VisualFeedSection = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Lives en vivo - Horizontal scroll */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Radio className="w-5 h-5 text-destructive animate-pulse" />
          <span className="font-bold text-foreground">EN VIVO</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
          {liveStreams.map((stream, i) => (
            <motion.div
              key={stream.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => navigate('/lives')}
              className="relative flex-shrink-0 w-48 h-28 rounded-2xl overflow-hidden cursor-pointer group"
            >
              <img src={stream.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute top-2 left-2 px-2 py-0.5 bg-destructive text-white text-[10px] font-bold rounded flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> LIVE
              </div>
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white text-xs font-medium truncate">{stream.title}</p>
                <div className="flex items-center gap-1 text-white/70 text-[10px]">
                  <Eye className="w-3 h-3" /> {stream.viewers.toLocaleString()}
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Play className="w-5 h-5 text-white" fill="white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Feed visual tipo Instagram/TikTok */}
      <div className="grid grid-cols-3 gap-1 md:gap-2">
        {videoFeed.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.02 }}
            className="relative aspect-[4/5] rounded-lg md:rounded-xl overflow-hidden cursor-pointer group"
          >
            <img src={item.image} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-4 text-white">
                <span className="flex items-center gap-1 text-sm font-bold">
                  <Heart className="w-5 h-5" fill="white" /> {(item.likes / 1000).toFixed(1)}K
                </span>
                <span className="flex items-center gap-1 text-sm font-bold">
                  <Eye className="w-5 h-5" /> {(item.views / 1000).toFixed(0)}K
                </span>
              </div>
            </div>
            <div className="absolute top-2 right-2">
              <Video className="w-4 h-4 text-white drop-shadow-lg" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Música - Covers horizontales */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Music className="w-5 h-5 text-accent" />
          <span className="font-bold text-foreground">MÚSICA</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
          {musicTracks.map((track, i) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05, rotate: 2 }}
              onClick={() => navigate('/music')}
              className="relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden cursor-pointer shadow-lg"
            >
              <img src={track.cover} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-1 left-1 right-1 text-center">
                <span className="text-white text-[9px]">{(track.plays / 1000).toFixed(0)}K ▶</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
