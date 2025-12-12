import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const actions = [
  { 
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=200&h=200&fit=crop",
    label: "Live",
    path: "/lives",
    gradient: "from-red-500/80 to-pink-500/80"
  },
  { 
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop",
    label: "Arte",
    path: "/artworks",
    gradient: "from-purple-500/80 to-indigo-500/80"
  },
  { 
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop",
    label: "Música",
    path: "/music",
    gradient: "from-green-500/80 to-emerald-500/80"
  },
  { 
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=200&h=200&fit=crop",
    label: "Dreams",
    path: "/dreamspaces",
    gradient: "from-cyan-500/80 to-blue-500/80"
  },
  { 
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=200&fit=crop",
    label: "Shop",
    path: "/marketplace",
    gradient: "from-orange-500/80 to-amber-500/80"
  },
  { 
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=200&h=200&fit=crop",
    label: "Wallet",
    path: "/credits",
    gradient: "from-violet-500/80 to-purple-500/80"
  },
];

export const QuickActionsVisual = () => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
      {actions.map((action, i) => (
        <motion.div
          key={action.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(action.path)}
          className="flex-shrink-0 cursor-pointer group"
        >
          <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden ring-2 ring-primary/50 ring-offset-2 ring-offset-background">
            <img src={action.image} alt="" className="w-full h-full object-cover" />
            <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center`}>
              <span className="text-white text-xs font-bold">{action.label}</span>
            </div>
          </div>
          <p className="text-[10px] text-center mt-1 text-muted-foreground group-hover:text-foreground transition-colors">{action.label}</p>
        </motion.div>
      ))}
    </div>
  );
};
