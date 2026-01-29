import { motion } from 'framer-motion';
import { User, ChevronLeft } from 'lucide-react';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useHaptics } from '@/hooks/useHaptics';

interface ArtistPassingScreenProps {
  playerName: string;
  playerIndex: number;
  totalPlayers: number;
  onReady: () => void;
}

export const ArtistPassingScreen = ({
  playerName,
  playerIndex,
  totalPlayers,
  onReady,
}: ArtistPassingScreenProps) => {
  const sounds = useSoundEffects();
  const { vibrate } = useHaptics();

  const handleReady = () => {
    sounds.playSound('click');
    vibrate('medium');
    onReady();
  };

  return (
    <motion.div
      className="glass-card-strong p-8 max-w-sm mx-auto text-center"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
    >
      {/* Player indicator */}
      <div className="mb-6">
        <motion.div
          className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4"
          style={{
            background: 'linear-gradient(135deg, hsl(320 100% 60%), hsl(270 100% 60%))',
            boxShadow: '0 0 30px hsl(320 100% 60% / 0.5)',
          }}
          animate={{ 
            boxShadow: [
              '0 0 30px hsl(320 100% 60% / 0.5)',
              '0 0 50px hsl(320 100% 60% / 0.7)',
              '0 0 30px hsl(320 100% 60% / 0.5)',
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <User className="w-10 h-10 text-white" />
        </motion.div>
        
        <p className="text-sm text-muted-foreground mb-2">
          שחקן {playerIndex} מתוך {totalPlayers}
        </p>
        
        <h2 className="text-2xl font-black text-gradient-secondary">
          {playerName}
        </h2>
      </div>

      {/* Instructions */}
      <p className="text-muted-foreground mb-8">
        העבר את הטלפון ל-{playerName}
        <br />
        <span className="text-sm">ולחץ כשאתה מוכן לראות את התפקיד שלך</span>
      </p>

      {/* Ready button */}
      <motion.button
        onClick={handleReady}
        className="btn-neon-magenta w-full flex items-center justify-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span>אני מוכן!</span>
        <ChevronLeft className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );
};