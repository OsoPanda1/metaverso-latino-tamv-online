import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, MessageCircle, Music, Video, Image, Settings, 
  Search, Bell, User, Zap, ChevronUp, ChevronDown,
  Sparkles, Heart, Share2, Bookmark, Globe, Palette,
  ShoppingBag, GraduationCap, Shield, Wallet, Users,
  Radio, Headphones, Star, Gift, Trophy, Flame
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface ToolbarItem {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  href?: string;
  badge?: string;
}

interface FloatingToolbarProps {
  position: "left" | "right" | "top" | "bottom";
  items: ToolbarItem[];
  accentColor?: string;
}

export const FloatingToolbar = ({ position, items, accentColor = "primary" }: FloatingToolbarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const positionClasses = {
    left: "left-3 top-1/2 -translate-y-1/2 flex-col",
    right: "right-3 top-1/2 -translate-y-1/2 flex-col",
    top: "top-20 left-1/2 -translate-x-1/2 flex-row",
    bottom: "bottom-4 left-1/2 -translate-x-1/2 flex-row",
  };

  const glowColors = {
    primary: "shadow-[0_0_25px_hsl(190,95%,55%/0.4),inset_0_0_20px_hsl(190,95%,55%/0.1)]",
    secondary: "shadow-[0_0_25px_hsl(260,80%,65%/0.4),inset_0_0_20px_hsl(260,80%,65%/0.1)]",
    accent: "shadow-[0_0_25px_hsl(170,90%,50%/0.4),inset_0_0_20px_hsl(170,90%,50%/0.1)]",
    destructive: "shadow-[0_0_25px_hsl(0,85%,60%/0.4),inset_0_0_20px_hsl(0,85%,60%/0.1)]",
  };

  const borderGradients = {
    primary: "before:bg-gradient-to-b before:from-primary/60 before:via-primary/20 before:to-primary/60",
    secondary: "before:bg-gradient-to-b before:from-secondary/60 before:via-secondary/20 before:to-secondary/60",
    accent: "before:bg-gradient-to-b before:from-accent/60 before:via-accent/20 before:to-accent/60",
    destructive: "before:bg-gradient-to-b before:from-destructive/60 before:via-destructive/20 before:to-destructive/60",
  };

  const isVertical = position === "left" || position === "right";

  const handleItemClick = (item: ToolbarItem) => {
    if (item.href) {
      navigate(item.href);
    } else if (item.onClick) {
      item.onClick();
    }
  };

  return (
    <motion.div
      className={cn(
        "fixed z-50 flex items-center gap-2",
        positionClasses[position]
      )}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Toggle Button - Glassmorphism with iridescent border */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "relative p-3 rounded-2xl overflow-hidden",
          "bg-card/20 backdrop-blur-2xl",
          "border border-border/10",
          "hover:bg-card/40 transition-all duration-500",
          glowColors[accentColor as keyof typeof glowColors] || glowColors.primary,
          "group"
        )}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Iridescent border effect */}
        <div className="absolute inset-0 rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/70 to-transparent" />
          <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-accent/70 to-transparent" />
          <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-primary/70 to-transparent" />
        </div>

        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-10"
        >
          {isVertical ? (
            isExpanded ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />
          ) : (
            isExpanded ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />
          )}
        </motion.div>
      </motion.button>

      {/* Toolbar Items Container */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className={cn(
              "relative flex gap-1 p-2 rounded-3xl overflow-hidden",
              "bg-card/15 backdrop-blur-3xl",
              "border border-border/10",
              glowColors[accentColor as keyof typeof glowColors] || glowColors.primary,
              isVertical ? "flex-col" : "flex-row"
            )}
            initial={{ 
              opacity: 0, 
              scale: 0.6, 
              [isVertical ? "y" : "x"]: position === "left" || position === "top" ? -30 : 30 
            }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ 
              opacity: 0, 
              scale: 0.6, 
              [isVertical ? "y" : "x"]: position === "left" || position === "top" ? -30 : 30 
            }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* Animated iridescent borders */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none">
              {/* Top edge glow */}
              <motion.div 
                className="absolute top-0 left-4 right-4 h-px"
                style={{
                  background: "linear-gradient(90deg, transparent, hsl(190 95% 55% / 0.8), hsl(260 80% 65% / 0.8), hsl(170 90% 50% / 0.8), transparent)"
                }}
                animate={{ 
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              {/* Bottom edge glow */}
              <motion.div 
                className="absolute bottom-0 left-4 right-4 h-px"
                style={{
                  background: "linear-gradient(90deg, transparent, hsl(170 90% 50% / 0.8), hsl(260 80% 65% / 0.8), hsl(190 95% 55% / 0.8), transparent)"
                }}
                animate={{ 
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              />
              {/* Side edges */}
              <div className="absolute top-4 bottom-4 left-0 w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent" />
              <div className="absolute top-4 bottom-4 right-0 w-px bg-gradient-to-b from-transparent via-secondary/50 to-transparent" />
            </div>

            {/* Crystal inner glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

            {items.map((item, index) => (
              <motion.button
                key={index}
                className={cn(
                  "relative p-3 rounded-2xl group",
                  "hover:bg-primary/10 transition-all duration-300",
                  "focus:outline-none focus:ring-2 focus:ring-primary/30"
                )}
                onClick={() => handleItemClick(item)}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.04 }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
              >
                <item.icon className="w-5 h-5 text-foreground/60 group-hover:text-primary transition-colors duration-300" />
                
                {/* Badge if present */}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[8px] flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                )}

                {/* Tooltip */}
                <span className={cn(
                  "absolute whitespace-nowrap px-3 py-1.5 text-xs rounded-xl font-medium",
                  "bg-card/90 backdrop-blur-xl border border-border/20",
                  "shadow-[0_0_15px_hsl(190,95%,55%/0.2)]",
                  "opacity-0 group-hover:opacity-100 transition-all duration-200",
                  "pointer-events-none z-20",
                  isVertical 
                    ? position === "left" ? "left-full ml-3" : "right-full mr-3"
                    : "bottom-full mb-3 left-1/2 -translate-x-1/2"
                )}>
                  {item.label}
                </span>

                {/* Hover glow ring */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-md" />
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Enhanced toolbar configurations with navigation
export const leftToolbarItems: ToolbarItem[] = [
  { icon: Home, label: "Inicio", href: "/" },
  { icon: Search, label: "Buscar" },
  { icon: Globe, label: "Explorar", href: "/nexus" },
  { icon: Sparkles, label: "Isabella IA", href: "/ai-chat" },
  { icon: Users, label: "Comunidad", href: "/groups" },
  { icon: Shield, label: "Guardianes", href: "/guardians" },
];

export const rightToolbarItems: ToolbarItem[] = [
  { icon: Bell, label: "Notificaciones", badge: "3" },
  { icon: MessageCircle, label: "Mensajes", href: "/social-hub" },
  { icon: Wallet, label: "Wallet", href: "/credits" },
  { icon: User, label: "Perfil", href: "/profile" },
  { icon: Settings, label: "Configuración" },
];

export const topToolbarItems: ToolbarItem[] = [
  { icon: Video, label: "Lives", href: "/lives" },
  { icon: Music, label: "Música", href: "/music" },
  { icon: Palette, label: "Galería", href: "/gallery" },
  { icon: Zap, label: "Trending" },
];

export const bottomToolbarItems: ToolbarItem[] = [
  { icon: Heart, label: "Favoritos" },
  { icon: Share2, label: "Compartir" },
  { icon: Bookmark, label: "Guardar" },
  { icon: ShoppingBag, label: "Marketplace", href: "/marketplace" },
  { icon: GraduationCap, label: "Universidad", href: "/university" },
  { icon: Gift, label: "Gifts" },
];