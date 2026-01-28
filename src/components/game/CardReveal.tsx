import { motion } from 'framer-motion';
import { Eye, EyeOff, Skull, Sparkles } from 'lucide-react';
import type { Player } from '@/hooks/useGameState';
import { gameCategories } from '@/data/gameCategories';

interface CardRevealProps {
  player: Player;
  secretWord: string;
  categoryId: string | null;
  showHint: boolean;
  isTrollRound: boolean;
  trollWord: string | null;
  onHide: () => void;
}

export const CardReveal = ({ 
  player, 
  secretWord, 
  categoryId, 
  showHint, 
  isTrollRound,
  trollWord,
  onHide 
}: CardRevealProps) => {
  const category = gameCategories.find(c => c.id === categoryId);
  const isImposter = player.isImposter;

  // In troll mode, everyone sees the troll word
  const displayWord = isTrollRound ? trollWord : (isImposter ? null : secretWord);

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="glass-card-strong p-8 max-w-sm w-full text-center space-y-6"
        initial={{ rotateY: 90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      >
        {/* Player name */}
        <div className="text-muted-foreground">
          <span>{player.name}</span>
        </div>

        {/* Card content */}
        {isImposter && !isTrollRound ? (
          // Imposter card
          <motion.div
            className="space-y-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="mx-auto w-24 h-24 rounded-full bg-secondary/20 flex items-center justify-center"
              animate={{ 
                boxShadow: [
                  '0 0 20px hsl(var(--secondary) / 0.3)',
                  '0 0 40px hsl(var(--secondary) / 0.5)',
                  '0 0 20px hsl(var(--secondary) / 0.3)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Skull className="w-12 h-12 text-secondary" />
            </motion.div>

            <h2 className="word-reveal-imposter">
              אתה המתחזה! 🕵️
            </h2>

            {showHint && category && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-3 rounded-xl bg-secondary/10 border border-secondary/20"
              >
                <p className="text-sm text-muted-foreground">רמז: הקטגוריה היא</p>
                <p className="font-bold text-secondary">{category.emoji} {category.name}</p>
              </motion.div>
            )}

            {!showHint && (
              <p className="text-muted-foreground text-sm">
                נסה לגלות על מה מדברים... בלי להיתפס!
              </p>
            )}
          </motion.div>
        ) : (
          // Regular player card (or troll mode)
          <motion.div
            className="space-y-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="mx-auto w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center"
              animate={{ 
                boxShadow: [
                  '0 0 20px hsl(var(--primary) / 0.3)',
                  '0 0 40px hsl(var(--primary) / 0.5)',
                  '0 0 20px hsl(var(--primary) / 0.3)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {isTrollRound ? (
                <Sparkles className="w-12 h-12 text-primary" />
              ) : (
                <Eye className="w-12 h-12 text-primary" />
              )}
            </motion.div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">המילה שלך היא:</p>
              <h2 className="word-reveal">
                {displayWord}
              </h2>
            </div>

            {isTrollRound && (
              <p className="text-xs text-muted-foreground">
                משהו מוזר קורה פה... 🤔
              </p>
            )}
          </motion.div>
        )}

        {/* Hide button */}
        <motion.button
          onClick={onHide}
          className="btn-neon-magenta w-full flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <EyeOff className="w-5 h-5" />
          <span>הסתר והעבר הלאה</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
