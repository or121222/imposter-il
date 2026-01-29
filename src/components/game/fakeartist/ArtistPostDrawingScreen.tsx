import { motion } from 'framer-motion';
import { Vote, SkipForward, Palette } from 'lucide-react';

interface ArtistPostDrawingScreenProps {
  canvasData: string | null;
  onGoToVoting: () => void;
  onSkipToResults: () => void;
}

export const ArtistPostDrawingScreen = ({
  canvasData,
  onGoToVoting,
  onSkipToResults,
}: ArtistPostDrawingScreenProps) => {
  return (
    <motion.div
      className="flex-1 flex flex-col max-w-lg mx-auto w-full p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="glass-card p-6 mb-4 text-center">
        <motion.div
          className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4"
          animate={{
            boxShadow: [
              '0 0 20px hsl(var(--secondary) / 0.3)',
              '0 0 40px hsl(var(--secondary) / 0.5)',
              '0 0 20px hsl(var(--secondary) / 0.3)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Palette className="w-8 h-8 text-secondary" />
        </motion.div>
        <h2 className="text-2xl font-black text-gradient-secondary mb-2">
          הציור הושלם! 🎨
        </h2>
        <p className="text-muted-foreground">
          הגיע הזמן לגלות מי הצייר המזויף
        </p>
      </div>

      {/* Canvas Preview */}
      {canvasData && (
        <motion.div
          className="glass-card p-4 mb-4 flex-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <img
            src={canvasData}
            alt="Drawing"
            className="w-full h-full object-contain rounded-xl"
          />
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <motion.button
          onClick={onGoToVoting}
          className="btn-neon-magenta w-full flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Vote className="w-5 h-5" />
          <span>הצבעה</span>
        </motion.button>

        <motion.button
          onClick={onSkipToResults}
          className="glass-card w-full py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-muted/40 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <SkipForward className="w-5 h-5" />
          <span>דלג וחשוף תפקידים</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
