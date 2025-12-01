import { Button } from "@/components/ui/button";

interface ReactionOption {
  type: string;
  label: string;
  emoji: string;
  color?: string;
}

interface TamvReactionsProps {
  onReact?: (reaction: string) => void;
  options?: ReactionOption[];
  entityId?: string;
  motion?: boolean;
  neonGlow?: boolean;
  parallax?: boolean;
  large?: boolean;
  wishlistEnabled?: boolean;
}

export const TamvReactions = ({ onReact, options, neonGlow, large }: TamvReactionsProps) => {
  const defaultReactions = ["❤️", "👍", "🎉", "🔥", "⚡"];
  const reactions = options ? options.map(o => o.emoji) : defaultReactions;

  return (
    <div className="flex gap-2">
      {reactions.map((emoji, idx) => (
        <Button
          key={idx}
          variant="outline"
          size={large ? "default" : "sm"}
          onClick={() => onReact?.(emoji)}
          className={`${large ? "text-2xl" : "text-xl"} hover:scale-125 transition-transform ${neonGlow ? "neon-glow" : ""}`}
        >
          {emoji}
        </Button>
      ))}
    </div>
  );
};
