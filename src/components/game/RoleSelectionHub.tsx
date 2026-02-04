import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, Users, Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Player } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { CardReveal } from './CardReveal';
import type { Category } from '@/data/gameCategories';

interface RoleSelectionHubProps {
  players: Player[];
  secretWord: string;
  confusedWord: string;
  categoryId: string | null;
  showHint: boolean;
  isTrollRound: boolean;
  trollWord: string | null;
  imposterName: string | null;
  customCategories?: Category[];
  onPlayerViewed: (playerId: string) => void;
  onAllViewed: () => void;
}

export const RoleSelectionHub = ({
  players,
  secretWord,
  confusedWord,
  categoryId,
  showHint,
  isTrollRound,
  trollWord,
  imposterName,
  customCategories = [],
  onPlayerViewed,
  onAllViewed,
}: RoleSelectionHubProps) => {
  const sounds = useSoundEffects();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showReveal, setShowReveal] = useState(false);
  const [hasTriggeredCompletion, setHasTriggeredCompletion] = useState(false);

  const viewedCount = players.filter(p => p.hasSeenCard).length;
  const allViewed = viewedCount === players.length && players.length > 0;

  // Auto-transition when all players have viewed - only trigger once
  useEffect(() => {
    if (allViewed && !showReveal && !hasTriggeredCompletion) {
      setHasTriggeredCompletion(true);
      const timer = setTimeout(() => {
        sounds.playSound('success');
        onAllViewed();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [allViewed, showReveal, onAllViewed, sounds, hasTriggeredCompletion]);

  const handlePlayerClick = (player: Player) => {
    if (player.hasSeenCard) return;
    sounds.playSound('click');
    setSelectedPlayer(player);
    setShowReveal(true);
  };

  const handleRevealComplete = () => {
    if (selectedPlayer) {
      // First update the parent state
      onPlayerViewed(selectedPlayer.id);
    }
    // Then close the reveal modal
    setShowReveal(false);
    setSelectedPlayer(null);
  };

  // Calculate grid layout based on player count
  const getGridClass = () => {
    const count = players.length;
    if (count <= 4) return 'grid-cols-2';
    if (count <= 6) return 'grid-cols-3';
    if (count <= 9) return 'grid-cols-3';
    return 'grid-cols-4';
  };

  return (
    <AnimatePresence mode="wait">
      {showReveal && selectedPlayer ? (
        <motion.div
          key="reveal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <CardReveal
            player={selectedPlayer}
            secretWord={secretWord}
            confusedWord={confusedWord}
            categoryId={categoryId}
            showHint={showHint}
            isTrollRound={isTrollRound}
            trollWord={trollWord}
            imposterName={imposterName}
            onHide={handleRevealComplete}
            customCategories={customCategories}
          />
        </motion.div>
      ) : (
        <motion.div
          key="hub"
          className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Header */}
          <motion.div
            className="text-center mb-6 sm:mb-8"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <motion.div
              className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4"
              animate={{
                boxShadow: [
                  '0 0 20px hsl(var(--primary) / 0.3)',
                  '0 0 40px hsl(var(--primary) / 0.5)',
                  '0 0 20px hsl(var(--primary) / 0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Users className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            </motion.div>
            <h2 className="text-xl sm:text-2xl font-black text-gradient-primary mb-2">
              חלוקת תפקידים
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xs mx-auto">
              העבירו את הטלפון ביניכם. כל אחד לוחץ על השם שלו כדי לגלות את התפקיד.
            </p>
          </motion.div>

          {/* Progress indicator */}
          <motion.div
            className="glass-card px-4 py-2 rounded-full mb-6 flex items-center gap-2"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">
              {viewedCount} / {players.length} צפו בתפקיד
            </span>
          </motion.div>

          {/* Player Grid */}
          <motion.div
            className={`grid ${getGridClass()} gap-3 sm:gap-4 max-w-md w-full`}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {players.map((player, index) => {
              const hasViewed = player.hasSeenCard;
              
              return (
                <motion.button
                  key={player.id}
                  onClick={() => handlePlayerClick(player)}
                  disabled={hasViewed || allViewed}
                  className={`
                    relative aspect-square rounded-2xl p-3 sm:p-4
                    flex flex-col items-center justify-center gap-2
                    transition-all duration-300 overflow-hidden
                    ${hasViewed 
                      ? 'bg-muted/30 opacity-50 cursor-not-allowed' 
                      : 'glass-card-strong cursor-pointer hover:scale-105'
                    }
                  `}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  whileHover={!hasViewed && !allViewed ? { scale: 1.05 } : {}}
                  whileTap={!hasViewed && !allViewed ? { scale: 0.95 } : {}}
                >
                  {/* Animated border for unviewed */}
                  {!hasViewed && !allViewed && (
                    <>
                      {/* Pulsing glow effect */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl"
                        animate={{
                          boxShadow: [
                            '0 0 0 2px hsl(var(--primary) / 0.3), 0 0 20px hsl(var(--primary) / 0.2)',
                            '0 0 0 3px hsl(var(--primary) / 0.5), 0 0 30px hsl(var(--primary) / 0.4)',
                            '0 0 0 2px hsl(var(--primary) / 0.3), 0 0 20px hsl(var(--primary) / 0.2)',
                          ],
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      
                      {/* Rotating gradient border */}
                      <div className="absolute inset-0 rounded-2xl overflow-hidden">
                        <motion.div
                          className="absolute inset-[-50%] bg-gradient-conic from-primary via-secondary to-primary"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                          style={{ opacity: 0.3 }}
                        />
                        <div className="absolute inset-[2px] rounded-2xl bg-background/95" />
                      </div>
                    </>
                  )}

                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center justify-center gap-2">
                    {hasViewed ? (
                      <motion.div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-500/20 flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 10, stiffness: 200 }}
                      >
                        <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                      </motion.div>
                    ) : (
                      <motion.div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center text-lg sm:text-xl font-bold text-primary"
                        animate={!allViewed ? { 
                          scale: [1, 1.1, 1],
                        } : {}}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        {player.name.charAt(0)}
                      </motion.div>
                    )}
                    
                    <span className={`
                      text-sm sm:text-base font-semibold text-center line-clamp-1
                      ${hasViewed ? 'text-muted-foreground' : 'text-foreground'}
                    `}>
                      {player.name}
                    </span>

                    {hasViewed && (
                      <span className="text-xs text-green-500 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        צפה
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </motion.div>

          {/* All viewed message or start button */}
          <AnimatePresence>
            {allViewed && (
              <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <motion.div
                  className="glass-card-strong p-6 rounded-2xl space-y-4"
                  animate={{
                    boxShadow: [
                      '0 0 20px hsl(var(--primary) / 0.3)',
                      '0 0 40px hsl(var(--primary) / 0.5)',
                      '0 0 20px hsl(var(--primary) / 0.3)',
                    ],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Sparkles className="w-8 h-8 text-primary mx-auto" />
                  <p className="text-lg font-bold text-gradient-primary">
                    כולם ראו! המשחק מתחיל...
                  </p>
                  <motion.button
                    onClick={onAllViewed}
                    className="btn-neon w-full flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Play className="w-5 h-5" />
                    <span>התחל עכשיו</span>
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
