import { motion } from 'framer-motion';
import { Eye, EyeOff, Skull, Sparkles, Laugh, UserPlus } from 'lucide-react';
import type { Player } from '@/hooks/useGameState';
import { gameCategories } from '@/data/gameCategories';

interface CardRevealProps {
  player: Player;
  secretWord: string;
  confusedWord: string;
  categoryId: string | null;
  showHint: boolean;
  isTrollRound: boolean;
  trollWord: string | null;
  imposterName: string | null;
  onHide: () => void;
}

export const CardReveal = ({ 
  player, 
  secretWord, 
  confusedWord,
  categoryId, 
  showHint, 
  isTrollRound,
  trollWord,
  imposterName,
  onHide 
}: CardRevealProps) => {
  const category = gameCategories.find(c => c.id === categoryId);
  const { role } = player;

  // Determine what word to display based on role
  const getDisplayContent = () => {
    if (isTrollRound) {
      return { word: trollWord, type: 'troll' as const };
    }
    
    switch (role) {
      case 'imposter':
        return { word: null, type: 'imposter' as const };
      case 'jester':
        return { word: null, type: 'jester' as const };
      case 'confused':
        return { word: confusedWord, type: 'confused' as const };
      case 'accomplice':
        return { word: secretWord, type: 'accomplice' as const };
      default:
        return { word: secretWord, type: 'civilian' as const };
    }
  };

  const content = getDisplayContent();

  const renderCard = () => {
    if (content.type === 'imposter') {
      return (
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
      );
    }

    if (content.type === 'jester') {
      return (
        <motion.div
          className="space-y-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="mx-auto w-24 h-24 rounded-full bg-amber-500/20 flex items-center justify-center"
            animate={{ 
              boxShadow: [
                '0 0 20px rgba(245, 158, 11, 0.3)',
                '0 0 40px rgba(245, 158, 11, 0.5)',
                '0 0 20px rgba(245, 158, 11, 0.3)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Laugh className="w-12 h-12 text-amber-500" />
          </motion.div>

          <h2 className="text-3xl font-black text-amber-500">
            אתה הג'וקר! 🃏
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20"
          >
            <p className="text-sm text-muted-foreground">המטרה שלך:</p>
            <p className="font-bold text-amber-500">לגרום להם להצביע עליך!</p>
          </motion.div>

          {category && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10"
            >
              <p className="text-xs text-muted-foreground">הקטגוריה היא:</p>
              <p className="font-bold text-amber-400">{category.emoji} {category.name}</p>
            </motion.div>
          )}

          <p className="text-muted-foreground text-sm">
            תהיה חשוד, תבלבל אותם, תנצח! 😈
          </p>
        </motion.div>
      );
    }

    if (content.type === 'accomplice') {
      return (
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
            <UserPlus className="w-12 h-12 text-secondary" />
          </motion.div>

          <h2 className="text-3xl font-black text-secondary">
            אתה הסייען! 🤝
          </h2>

          <div>
            <p className="text-sm text-muted-foreground mb-2">המילה הסודית היא:</p>
            <h2 className="word-reveal">
              {content.word}
            </h2>
          </div>

          {imposterName && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-3 rounded-xl bg-secondary/10 border border-secondary/20"
            >
              <p className="text-sm text-muted-foreground">השותף שלך הוא:</p>
              <p className="font-bold text-secondary text-lg">{imposterName}</p>
            </motion.div>
          )}

          <p className="text-muted-foreground text-sm">
            עזור למתחזה לנצח בלי שירגישו!
          </p>
        </motion.div>
      );
    }

    // Confused looks exactly like civilian - no hints!
    if (content.type === 'confused') {
      return (
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
            <Eye className="w-12 h-12 text-primary" />
          </motion.div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">המילה שלך היא:</p>
            <h2 className="word-reveal">
              {content.word}
            </h2>
          </div>
        </motion.div>
      );
    }

    // Civilian or troll card
    return (
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
          {content.type === 'troll' ? (
            <Sparkles className="w-12 h-12 text-primary" />
          ) : (
            <Eye className="w-12 h-12 text-primary" />
          )}
        </motion.div>

        <div>
          <p className="text-sm text-muted-foreground mb-2">המילה שלך היא:</p>
          <h2 className="word-reveal">
            {content.word}
          </h2>
        </div>

        {content.type === 'troll' && (
          <p className="text-xs text-muted-foreground">
            משהו מוזר קורה פה... 🤔
          </p>
        )}
      </motion.div>
    );
  };

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
        {renderCard()}

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
