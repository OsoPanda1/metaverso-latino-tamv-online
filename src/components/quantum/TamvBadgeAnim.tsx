import { Badge } from "@/components/ui/badge";

interface TamvBadgeAnimProps {
  text?: string;
  type?: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
}

export const TamvBadgeAnim = ({ text, type, variant = "default" }: TamvBadgeAnimProps) => {
  const displayText = text || (type === "live" ? "LIVE" : type?.toUpperCase() || "");
  return (
    <Badge variant={variant} className="animate-pulse-neon">
      {displayText}
    </Badge>
  );
};
