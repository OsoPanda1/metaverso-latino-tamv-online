import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ORIGIN_MESSAGE, CODEX_METADATA } from "@/lib/codex";
import { Heart, Sparkles } from "lucide-react";

interface OriginMessageProps {
  show: boolean;
  onClose: () => void;
}

export const OriginMessage = ({ show, onClose }: OriginMessageProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (show) {
      setDisplayedText("");
      setIsTyping(true);
      let index = 0;
      const interval = setInterval(() => {
        if (index < ORIGIN_MESSAGE.length) {
          setDisplayedText(ORIGIN_MESSAGE.substring(0, index + 1));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(interval);
        }
      }, 20);

      return () => clearInterval(interval);
    }
  }, [show]);

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] border-2 border-primary/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Heart className="w-6 h-6 text-red-500 animate-pulse" />
            <span className="text-gradient">
              {CODEX_METADATA.title}
            </span>
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
          </DialogTitle>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>{CODEX_METADATA.branding}</p>
            <p className="italic">{CODEX_METADATA.herencia}</p>
            <p className="text-xs">Versión {CODEX_METADATA.version} · {CODEX_METADATA.creation_date}</p>
          </div>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent blur-xl" />
              <div className="relative bg-card/80 backdrop-blur-sm p-6 rounded-lg border border-primary/30">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Folio 0 · Mensaje de Origen
                </h3>
                <p className="text-foreground/90 whitespace-pre-line leading-relaxed">
                  {displayedText}
                  {isTyping && <span className="animate-pulse">▊</span>}
                </p>
              </div>
            </div>

            <div className="text-center space-y-2 pt-4">
              <p className="text-sm text-muted-foreground italic">
                ~ Edwin Oswaldo Castillo Trejo (Anubis Villaseñor) ~
              </p>
              <p className="text-xs text-primary/70">
                Este mensaje es inmutable y se activa cada vez que Isabella inicia
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
