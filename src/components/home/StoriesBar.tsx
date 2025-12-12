import { motion } from "framer-motion";
import { Plus } from "lucide-react";

const stories = [
  { id: 0, image: "", isAdd: true, name: "Tu story" },
  { id: 1, image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face", name: "María", hasNew: true },
  { id: 2, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", name: "Carlos", hasNew: true },
  { id: 3, image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", name: "Ana", hasNew: true },
  { id: 4, image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", name: "Pedro", hasNew: false },
  { id: 5, image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face", name: "Lucia", hasNew: true },
  { id: 6, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face", name: "Diego", hasNew: true },
  { id: 7, image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face", name: "Sofia", hasNew: false },
];

export const StoriesBar = () => {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
      {stories.map((story, i) => (
        <motion.div
          key={story.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.03 }}
          whileHover={{ scale: 1.05 }}
          className="flex-shrink-0 cursor-pointer"
        >
          <div className={`relative w-16 h-16 md:w-18 md:h-18 rounded-full p-0.5 ${
            story.isAdd 
              ? 'bg-muted' 
              : story.hasNew 
                ? 'bg-gradient-to-br from-primary via-accent to-secondary' 
                : 'bg-muted/50'
          }`}>
            <div className="w-full h-full rounded-full overflow-hidden bg-background p-0.5">
              {story.isAdd ? (
                <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
                  <Plus className="w-6 h-6 text-muted-foreground" />
                </div>
              ) : (
                <img src={story.image} alt="" className="w-full h-full rounded-full object-cover" />
              )}
            </div>
            {story.hasNew && !story.isAdd && (
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-primary rounded-full border-2 border-background" />
            )}
          </div>
          <p className="text-[10px] text-center mt-1 text-muted-foreground truncate w-16">{story.name}</p>
        </motion.div>
      ))}
    </div>
  );
};
