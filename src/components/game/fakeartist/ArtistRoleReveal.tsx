import { motion } from 'framer-motion';
import { Eye, EyeOff, Palette, HelpCircle, ChevronLeft, Layers } from 'lucide-react';

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
      className="glass-card-strong p-6 max-w-sm mx-auto w-full"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      {/* Category Header - Always visible */}
      <motion.div
        className="relative mb-6 p-4 rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, hsl(320 100% 60% / 0.15), hsl(270 100% 60% / 0.15))',
          border: '1px solid hsl(320 100% 60% / 0.3)',
        }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute inset-0 animate-shimmer"
            style={{
              background: 'linear-gradient(90deg, transparent, hsl(320 100% 60% / 0.2), transparent)',
            }}
          />
        </div>
        
        <div className="relative flex items-center justify-center gap-3">
          <Layers className="w-5 h-5 text-secondary" />
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">קטגוריה</p>
            <p className="text-lg font-bold text-secondary">
              {categoryEmoji} {category}
            </p>
          </div>
          <Layers className="w-5 h-5 text-secondary" />
        </div>
      </motion.div>

      {/* Player Name with Color Indicator */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div 
            className="w-6 h-6 rounded-full"
            style={{ 
              backgroundColor: playerColor,
              boxShadow: `0 0 15px ${playerColor}`,
            }}
          />
          <h2 className="text-xl font-bold">{playerName}</h2>
        </div>
        <p className="text-xs text-muted-foreground">הצבע שלך לציור</p>
      </div>

      {/* Role Card */}
      {!hasSeenRole ? (
        <motion.button
          onClick={onShowRole}
          className="w-full aspect-[4/3] glass-card flex flex-col items-center justify-center gap-4 mb-6 cursor-pointer"
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
          className="w-full aspect-[4/3] glass-card flex flex-col items-center justify-center gap-4 mb-6"
          style={{
            background: isFake
              ? 'linear-gradient(135deg, hsl(320 100% 60% / 0.2), hsl(270 100% 60% / 0.2))'
              : 'linear-gradient(135deg, hsl(186 100% 50% / 0.2), hsl(220 100% 60% / 0.2))',
            border: `2px solid ${isFake ? 'hsl(320 100% 60%)' : 'hsl(186 100% 50%)'}`,
            boxShadow: isFake
              ? '0 0 30px hsl(320 100% 60% / 0.3)'
              : '0 0 30px hsl(186 100% 50% / 0.3)',
          }}
          initial={{ scale: 0.8, rotateY: 180 }}
          animate={{ scale: 1, rotateY: 0 }}
          transition={{ type: 'spring', duration: 0.6 }}
        >
          {isFake ? (
            <>
              <HelpCircle className="w-16 h-16 text-secondary" />
              <div className="text-center">
                <h3 className="text-2xl font-black text-gradient-secondary mb-2">
                  אתה הצייר המזויף!
                </h3>
                <p className="text-muted-foreground text-sm">
                  נסה לגלות מה המילה ולהשתלב בציור
                </p>
              </div>
            </>
          ) : (
            <>
              <Palette className="w-16 h-16 text-primary" />
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">המילה שלך היא:</p>
                <h3 className="text-3xl font-black text-gradient-primary">
                  {word}
                </h3>
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
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>{isLastPlayer ? 'התחל לצייר!' : 'השחקן הבא'}</span>
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
      )}
    </motion.div>
  );
};