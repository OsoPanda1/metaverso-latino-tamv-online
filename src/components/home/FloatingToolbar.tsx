import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, MessageCircle, Music, Video, Image, Settings, 
  Search, Bell, User, Zap, ChevronUp, ChevronDown,
  Sparkles, Heart, Share2, Bookmark, Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolbarItem {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}

interface FloatingToolbarProps {
  position: "left" | "right" | "top" | "bottom";
  items: ToolbarItem[];
  accentColor?: string;
}

export const FloatingToolbar = ({ position, items, accentColor = "primary" }: FloatingToolbarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const positionClasses = {
    left: "left-4 top-1/2 -translate-y-1/2 flex-col",
    right: "right-4 top-1/2 -translate-y-1/2 flex-col",
    top: "top-20 left-1/2 -translate-x-1/2 flex-row",
    bottom: "bottom-6 left-1/2 -translate-x-1/2 flex-row",
  };

  const glowColors = {
    primary: "shadow-[0_0_20px_hsl(190,95%,55%/0.3)]",
    secondary: "shadow-[0_0_20px_hsl(260,80%,65%/0.3)]",
    accent: "shadow-[0_0_20px_hsl(170,90%,50%/0.3)]",
  };

  const isVertical = position === "left" || position === "right";

  return (
    <motion.div
      className={cn(
        "fixed z-50 flex items-center gap-1",
        positionClasses[position]
      )}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "p-3 rounded-2xl backdrop-blur-xl",
          "bg-card/40 border border-border/30",
          "hover:bg-card/60 transition-all duration-300",
          glowColors[accentColor as keyof typeof glowColors] || glowColors.primary,
          "group"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isVertical ? (
            isExpanded ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />
          ) : (
            isExpanded ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />
          )}
        </motion.div>
        
        {/* Iridescent glow effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 blur-sm" />
        </div>
      </motion.button>

      {/* Toolbar Items */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className={cn(
              "flex gap-1 p-2 rounded-2xl backdrop-blur-xl",
              "bg-card/30 border border-border/20",
              glowColors[accentColor as keyof typeof glowColors] || glowColors.primary,
              isVertical ? "flex-col" : "flex-row"
            )}
            initial={{ opacity: 0, scale: 0.8, [isVertical ? "y" : "x"]: isVertical ? -20 : -20 }}
            animate={{ opacity: 1, scale: 1, [isVertical ? "y" : "x"]: 0 }}
            exit={{ opacity: 0, scale: 0.8, [isVertical ? "y" : "x"]: isVertical ? -20 : -20 }}
            transition={{ duration: 0.2, staggerChildren: 0.05 }}
          >
            {/* Iridescent border effect */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 animate-pulse" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
            </div>

            {items.map((item, index) => (
              <motion.button
                key={index}
                className={cn(
                  "p-3 rounded-xl relative group",
                  "hover:bg-primary/10 transition-all duration-300",
                  "focus:outline-none focus:ring-2 focus:ring-primary/50"
                )}
                onClick={item.onClick}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <item.icon className="w-5 h-5 text-foreground/70 group-hover:text-primary transition-colors" />
                
                {/* Tooltip */}
                <span className={cn(
                  "absolute whitespace-nowrap px-2 py-1 text-xs rounded-lg",
                  "bg-card/90 backdrop-blur-sm border border-border/30",
                  "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                  "pointer-events-none z-10",
                  isVertical 
                    ? position === "left" ? "left-full ml-2" : "right-full mr-2"
                    : "bottom-full mb-2 left-1/2 -translate-x-1/2"
                )}>
                  {item.label}
                </span>

                {/* Hover glow */}
                <div className="absolute inset-0 rounded-xl bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300" />
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Predefined toolbar configurations
export const leftToolbarItems: ToolbarItem[] = [
  { icon: Home, label: "Inicio" },
  { icon: Search, label: "Buscar" },
  { icon: Globe, label: "Explorar" },
  { icon: Sparkles, label: "IA Isabella" },
];

export const rightToolbarItems: ToolbarItem[] = [
  { icon: Bell, label: "Notificaciones" },
  { icon: MessageCircle, label: "Mensajes" },
  { icon: User, label: "Perfil" },
  { icon: Settings, label: "Configuración" },
];

export const topToolbarItems: ToolbarItem[] = [
  { icon: Video, label: "Lives" },
  { icon: Music, label: "Música" },
  { icon: Image, label: "Galería" },
  { icon: Zap, label: "Trending" },
];

export const bottomToolbarItems: ToolbarItem[] = [
  { icon: Heart, label: "Me gusta" },
  { icon: Share2, label: "Compartir" },
  { icon: Bookmark, label: "Guardar" },
];
