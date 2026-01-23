import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Sparkles, Users, Eye, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface VideoHeroProps {
  videoUrl?: string;
  posterUrl?: string;
  title?: string;
  subtitle?: string;
}

// High quality video sources for hero
const VIDEO_SOURCES = [
  "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-futuristic-devices-99786-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-network-connections-33089-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-network-lines-and-spheres-49612-large.mp4"
];

export const VideoHero = ({ 
  videoUrl = VIDEO_SOURCES[0],
  posterUrl = "https://images.unsplash.com/photo-1633177317976-3f9bc45e1d1d?w=1920&h=800&fit=crop",
  title = "TAMV",
  subtitle = "El Metaverso Latinoamericano • Isabella IA NextGen™"
}: VideoHeroProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full aspect-[21/9] max-h-[70vh] overflow-hidden rounded-3xl"
    >
      {/* Poster/Fallback Image */}
      <img 
        src={posterUrl}
        alt="TAMV Hero"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${videoLoaded ? 'opacity-0' : 'opacity-100'}`}
      />

      {/* Video */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
        poster={posterUrl}
        muted={isMuted}
        loop
        playsInline
        autoPlay
        onLoadedData={() => setVideoLoaded(true)}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30" />

      {/* Animated particles overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full"
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: '100%',
              opacity: 0.5 
            }}
            animate={{ 
              y: '-10%',
              opacity: [0.5, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Live indicator and stats */}
      <div className="absolute top-4 left-4 flex items-center gap-3 flex-wrap">
        <Badge className="bg-red-500 text-white border-0 shadow-lg animate-pulse px-3 py-1">
          <span className="w-2 h-2 bg-white rounded-full mr-2 animate-ping" />
          EN VIVO
        </Badge>
        <Badge variant="secondary" className="bg-black/50 text-white border-0 backdrop-blur-sm">
          <Eye className="w-3 h-3 mr-1" /> 24.5K
        </Badge>
        <Badge variant="secondary" className="bg-black/50 text-white border-0 backdrop-blur-sm">
          <Users className="w-3 h-3 mr-1" /> 1.2M usuarios
        </Badge>
        <Badge variant="secondary" className="bg-primary/30 text-primary border-primary/50 backdrop-blur-sm">
          <Zap className="w-3 h-3 mr-1" /> 7 Capas Federadas
        </Badge>
      </div>

      {/* Main Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Logo/Title */}
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="w-10 h-10 text-primary animate-pulse" />
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight">
              <span className="text-gradient drop-shadow-[0_0_30px_hsl(190,95%,55%/0.5)]">{title}</span>
            </h1>
            <Sparkles className="w-10 h-10 text-secondary animate-pulse" />
          </div>
          
          <p className="text-xl md:text-2xl text-white/90 font-medium max-w-2xl mx-auto">
            {subtitle}
          </p>

          {/* Federation Badge */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm px-3 py-1.5">
              🌌 Quantum Computing
            </Badge>
            <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm px-3 py-1.5">
              ⚛️ 4D Rendering
            </Badge>
            <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm px-3 py-1.5">
              🔐 Post-Quantum Security
            </Badge>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_30px_hsl(190,95%,55%/0.5)] px-8 text-lg h-14"
              onClick={() => window.location.href = '/dashboard'}
            >
              <Play className="w-5 h-5 mr-2" fill="currentColor" />
              Explorar Metaverso
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm h-14"
              onClick={() => window.location.href = '/ai-chat'}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Hablar con Isabella
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Video Controls */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={toggleMute}
          className="w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>
      </div>

      {/* Decorative gradient borders */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-primary to-secondary" />
      
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-primary/50 rounded-tl-3xl" />
      <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-secondary/50 rounded-tr-3xl" />
      <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-accent/50 rounded-bl-3xl" />
      <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-primary/50 rounded-br-3xl" />
    </motion.section>
  );
};
