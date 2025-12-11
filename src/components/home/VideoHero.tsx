import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Sparkles, Users, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface VideoHeroProps {
  videoUrl?: string;
  posterUrl?: string;
  title?: string;
  subtitle?: string;
}

export const VideoHero = ({ 
  videoUrl = "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  posterUrl,
  title = "TAMV",
  subtitle = "Metaverso Latinoamericano"
}: VideoHeroProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

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
      className="relative w-full aspect-[21/9] max-h-[60vh] overflow-hidden rounded-3xl"
    >
      {/* Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        poster={posterUrl}
        muted={isMuted}
        loop
        playsInline
        autoPlay
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      {/* Live indicator */}
      <div className="absolute top-4 left-4 flex items-center gap-3">
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
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight">
              <span className="text-gradient">{title}</span>
            </h1>
            <Sparkles className="w-8 h-8 text-secondary animate-pulse" />
          </div>
          
          <p className="text-lg md:text-xl text-white/80 font-medium">
            {subtitle}
          </p>
          
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_30px_hsl(190,95%,55%/0.5)] px-8"
              onClick={() => window.location.href = '/dashboard'}
            >
              <Play className="w-5 h-5 mr-2" fill="currentColor" />
              Explorar
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
              onClick={() => window.location.href = '/ai-chat'}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Isabella IA
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Controls */}
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

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-primary to-secondary" />
    </motion.section>
  );
};
