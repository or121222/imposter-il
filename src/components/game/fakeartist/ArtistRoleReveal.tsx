import { motion } from 'framer-motion';
import { EyeOff, Palette, HelpCircle, ChevronLeft, Layers } from 'lucide-react';

interface ArtistRoleRevealProps {
  playerName: string;
  playerColor: string;
  isFake: boolean;
  word: string | null;
  category: string;
  categoryEmoji: string;
  hasSeenRole: boolean;
  onShowRole: () => void;
  onNext: () => void;
  isLastPlayer: boolean;
}

export const ArtistRoleReveal = ({
  playerName,
  playerColor,
  isFake,
  word,
  category,
  categoryEmoji,
  hasSeenRole,
  onShowRole,
  onNext,
  isLastPlayer,
}: ArtistRoleRevealProps) => {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Category Header - Above the card, matching CardReveal style */}
      <motion.div 
        className="w-full max-w-sm mb-6"
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', damping: 25, stiffness: 300 }}
      >
        <motion.div 
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary/15 via-secondary/10 to-secondary/5 border border-secondary/30 backdrop-blur-xl"
          animate={{
            boxShadow: [
              '0 0 20px hsl(var(--secondary) / 0.15), inset 0 0 20px hsl(var(--secondary) / 0.05)',
              '0 0 30px hsl(var(--secondary) / 0.25), inset 0 0 30px hsl(var(--secondary) / 0.08)',
              '0 0 20px hsl(var(--secondary) / 0.15), inset 0 0 20px hsl(var(--secondary) / 0.05)'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Shimmer effect overlay */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          </div>
          
          {/* Content */}
          <div className="relative flex items-center justify-center gap-4 px-6 py-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center border border-secondary/30">
              <Layers className="w-6 h-6 text-secondary" />
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
                קטגוריה
              </span>
              <span className="text-xl font-bold text-gradient-secondary">
                {categoryEmoji} {category}
              </span>
            </div>
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center border border-secondary/30 opacity-0">
              <Layers className="w-6 h-6 text-secondary" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Card - matching CardReveal style */}
      <motion.div
        className="glass-card-strong p-8 max-w-sm w-full text-center space-y-6"
        initial={{ rotateY: 90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      >
        {/* Player name with color indicator */}
        <div className="text-muted-foreground flex items-center justify-center gap-3">
          <div 
            className="w-5 h-5 rounded-full"
            style={{ 
              backgroundColor: playerColor,
              boxShadow: `0 0 12px ${playerColor}`,
            }}
          />
          <span>{playerName}</span>
        </div>

        {/* Role Card */}
        {!hasSeenRole ? (
          <motion.button
            onClick={onShowRole}
            className="w-full aspect-[4/3] glass-card flex flex-col items-center justify-center gap-4 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, hsl(320 100% 60% / 0.1), hsl(270 100% 60% / 0.1))',
              border: '2px dashed hsl(320 100% 60% / 0.5)',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <EyeOff className="w-12 h-12 text-muted-foreground" />
            <span className="text-muted-foreground">לחץ לחשיפת התפקיד</span>
          </motion.button>
        ) : (
          <motion.div
            className="space-y-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {isFake ? (
              <>
                <motion.div 
                  className="mx-auto w-24 h-24 rounded-full bg-secondary/20 flex items-center justify-center"
                  animate={{
                    boxShadow: [
                      '0 0 20px hsl(var(--secondary) / 0.3)',
                      '0 0 40px hsl(var(--secondary) / 0.5)',
                      '0 0 20px hsl(var(--secondary) / 0.3)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <HelpCircle className="w-12 h-12 text-secondary" />
                </motion.div>
                
                <h2 className="text-3xl font-black text-gradient-secondary">
                  אתה הצייר המזויף! 🎨
                </h2>
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-3 rounded-xl bg-secondary/10 border border-secondary/20"
                >
                  <p className="text-sm text-muted-foreground">המטרה שלך:</p>
                  <p className="font-bold text-secondary">לגלות מה המילה ולהשתלב בציור!</p>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div 
                  className="mx-auto w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center"
                  animate={{
                    boxShadow: [
                      '0 0 20px hsl(var(--primary) / 0.3)',
                      '0 0 40px hsl(var(--primary) / 0.5)',
                      '0 0 20px hsl(var(--primary) / 0.3)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Palette className="w-12 h-12 text-primary" />
                </motion.div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2">המילה שלך היא:</p>
                  <h2 className="word-reveal">
                    {word}
                  </h2>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Next Button */}
        {hasSeenRole && (
          <motion.button
            onClick={onNext}
            className="btn-neon-magenta w-full flex items-center justify-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <EyeOff className="w-5 h-5" />
            <span>{isLastPlayer ? 'התחל לצייר!' : 'הסתר והעבר הלאה'}</span>
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
};
