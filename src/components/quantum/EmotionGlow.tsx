interface EmotionGlowProps {
  emotion?: string;
  intensity?: number;
}

export const EmotionGlow = ({ emotion = 'neutral', intensity = 0.5 }: EmotionGlowProps) => {
  const emotionColors: Record<string, string> = {
    joy: 'hsl(45, 100%, 60%)',
    sadness: 'hsl(220, 70%, 50%)',
    anger: 'hsl(0, 80%, 55%)',
    fear: 'hsl(280, 60%, 50%)',
    neutral: 'hsl(180, 50%, 60%)',
    love: 'hsl(340, 80%, 60%)',
  };

  const color = emotionColors[emotion] || emotionColors.neutral;

  return (
    <div
      className="fixed inset-0 pointer-events-none transition-opacity duration-1000"
      style={{
        background: `radial-gradient(circle at 50% 50%, ${color}22, transparent 70%)`,
        opacity: intensity,
        mixBlendMode: 'screen',
      }}
    />
  );
};
