interface MiniAnubisGiftProps {
  animate?: boolean;
  extraGlow?: boolean;
  guardian?: boolean;
}

export const MiniAnubisGift = ({ animate, extraGlow }: MiniAnubisGiftProps) => {
  return (
    <div className={`relative p-4 rounded-lg border border-primary/50 bg-gradient-to-br from-primary/10 to-secondary/10 ${animate ? "animate-pulse-neon" : ""} ${extraGlow ? "neon-glow" : ""}`}>
      <div className="text-6xl text-center mb-2">🐺</div>
      <p className="text-center font-bold text-primary">Mini Anubis</p>
      <p className="text-center text-sm text-muted-foreground">Guardián digital legendario</p>
    </div>
  );
};

export const TamvStickerAnim = ({ url, styleType }: { url?: string; styleType?: string }) => {
  return (
    <div className="inline-block animate-bounce">
      {url ? <img src={url} alt="Sticker" className="w-16 h-16" /> : <span className="text-4xl">✨</span>}
    </div>
  );
};

export const Tamv3DPreview = ({ model, asset }: { model?: string; asset?: string }) => {
  return (
    <div className="w-full h-64 bg-gradient-to-br from-background/50 to-primary/20 rounded-lg flex items-center justify-center border border-border/50">
      <p className="text-muted-foreground">Vista previa 3D</p>
    </div>
  );
};
