import { motion } from "framer-motion";
import { Brain, Sparkles } from "lucide-react";

interface IsabellaAvatarProps {
  size?: "sm" | "md" | "lg" | "xl";
  emotion?: "neutral" | "happy" | "thinking" | "alert";
  speaking?: boolean;
}

const sizeMap = {
  sm: "w-10 h-10",
  md: "w-16 h-16",
  lg: "w-24 h-24",
  xl: "w-32 h-32",
};

const glowColors = {
  neutral: "from-primary via-accent to-secondary",
  happy: "from-yellow-400 via-orange-400 to-pink-400",
  thinking: "from-purple-500 via-indigo-500 to-blue-500",
  alert: "from-orange-500 via-red-500 to-pink-500",
};

export const IsabellaAvatar = ({ 
  size = "md", 
  emotion = "neutral",
  speaking = false 
}: IsabellaAvatarProps) => {
  return (
    <motion.div 
      className={`relative ${sizeMap[size]}`}
      animate={speaking ? { scale: [1, 1.05, 1] } : {}}
      transition={speaking ? { duration: 0.5, repeat: Infinity } : {}}
    >
      {/* Outer glow ring */}
      <motion.div
        className={`absolute inset-0 rounded-full bg-gradient-to-br ${glowColors[emotion]} blur-xl opacity-60`}
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Main avatar circle */}
      <div className={`relative ${sizeMap[size]} rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center overflow-hidden`}>
        {/* Inner pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.2),_transparent_60%)]" />
        
        {/* Brain icon */}
        <Brain className="w-1/2 h-1/2 text-primary-foreground relative z-10" />
        
        {/* Sparkle effects when speaking */}
        {speaking && (
          <>
            <motion.div
              className="absolute top-1 right-1"
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
            >
              <Sparkles className="w-3 h-3 text-white" />
            </motion.div>
            <motion.div
              className="absolute bottom-2 left-1"
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
            >
              <Sparkles className="w-2 h-2 text-white" />
            </motion.div>
          </>
        )}
      </div>
      
      {/* Status indicator */}
      <div className={`absolute bottom-0 right-0 w-1/4 h-1/4 rounded-full border-2 border-background ${
        speaking ? 'bg-green-500 animate-pulse' : 'bg-green-500'
      }`} />
    </motion.div>
  );
};
