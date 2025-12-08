import { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VideoHeroProps {
  videoUrl?: string;
  posterUrl?: string;
  title?: string;
  subtitle?: string;
}

export const VideoHero = ({ 
  videoUrl = "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  posterUrl,
  title = "TAMV ONLINE",
  subtitle = "El Metaverso Latinoamericano"
}: VideoHeroProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

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
    <section className="relative w-full aspect-video max-h-[70vh] overflow-hidden rounded-3xl mx-auto">
      {/* Video Container */}
      <div className="absolute inset-0 bg-card/20 backdrop-blur-sm">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          poster={posterUrl}
          muted={isMuted}
          loop
          playsInline
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      </div>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />

      {/* Glass morphism overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">EN VIVO</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground">
            <span className="text-gradient">{title}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground">
            {subtitle}
          </p>

          {/* Controls */}
          <div className="flex items-center gap-3 pt-4">
            <Button
              size="lg"
              onClick={togglePlay}
              className="bg-primary/90 hover:bg-primary text-primary-foreground backdrop-blur-sm glow-cyan"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 mr-2" />
              ) : (
                <Play className="w-5 h-5 mr-2" />
              )}
              {isPlaying ? "Pausar" : "Reproducir"}
            </Button>

            <Button
              size="icon"
              variant="outline"
              onClick={toggleMute}
              className="bg-card/30 backdrop-blur-sm border-border/30 hover:bg-card/50"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </Button>

            <Button
              size="icon"
              variant="outline"
              className="bg-card/30 backdrop-blur-sm border-border/30 hover:bg-card/50"
            >
              <Maximize className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-4 right-4 w-20 h-20 border-t-2 border-r-2 border-primary/30 rounded-tr-3xl" />
      <div className="absolute bottom-4 left-4 w-20 h-20 border-b-2 border-l-2 border-secondary/30 rounded-bl-3xl" />
    </section>
  );
};
