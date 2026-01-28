import { motion } from 'framer-motion';
import { Smartphone, ArrowLeft } from 'lucide-react';
import type { Player } from '@/hooks/useGameState';

interface PassingScreenProps {
  player: Player;
  onReveal: () => void;
}

export const PassingScreen = ({ player, onReveal }: PassingScreenProps) => {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="glass-card-strong p-8 max-w-sm w-full text-center space-y-8"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        {/* Icon */}
        <motion.div
          className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center"
          animate={{ 
            rotate: [-10, 10, -10],
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        >
          <Smartphone className="w-10 h-10 text-primary" />
        </motion.div>

        {/* Instructions */}
        <div className="space-y-2">
          <p className="text-muted-foreground">העבירו את הטלפון ל...</p>
          <h2 className="text-3xl font-black text-gradient-primary">
            {player.name}
          </h2>
        </div>

        {/* Reveal button */}
        <motion.button
          onClick={onReveal}
          className="btn-neon w-full pulse-glow flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>לחץ לחשיפה</span>
          <ArrowLeft className="w-5 h-5" />
        </motion.button>

        <p className="text-xs text-muted-foreground">
          רק {player.name} צריך/ה לראות את המסך הבא!
        </p>
      </motion.div>
    </motion.div>
  );
};
