import { motion } from 'framer-motion';
import { Play, User } from 'lucide-react';

interface RoundStarterScreenProps {
  starterName: string;
  onStart: () => void;
}

export const RoundStarterScreen = ({ starterName, onStart }: RoundStarterScreenProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div
        className="text-center space-y-8 max-w-md mx-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <h2 className="text-2xl font-bold text-muted-foreground">כל השחקנים ראו את הקלפים!</h2>
          <p className="text-lg text-muted-foreground">מי מתחיל את הסיבוב?</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
          className="relative"
        >
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl">
            <User className="w-16 h-16 text-primary-foreground" />
          </div>
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/20"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            {starterName}
          </h1>
          <p className="text-muted-foreground mt-2">מתחיל/ה ראשון/ה!</p>
        </motion.div>

        <motion.button
          onClick={onStart}
          className="btn-neon w-full flex items-center justify-center gap-2 pulse-glow"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Play className="w-5 h-5" />
          <span>התחל!</span>
        </motion.button>
      </motion.div>
    </div>
  );
};
