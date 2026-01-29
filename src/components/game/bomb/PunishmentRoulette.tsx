import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BombPunishment } from '@/hooks/useBombPunishments';
import confetti from 'canvas-confetti';

interface PunishmentRouletteProps {
  isOpen: boolean;
  punishments: BombPunishment[];
  currentPlayer?: string;
  onComplete: () => void;
}

export const PunishmentRoulette = ({
  isOpen,
  punishments,
  currentPlayer,
  onComplete,
}: PunishmentRouletteProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayedPunishment, setDisplayedPunishment] = useState<string>('');
  const [finalPunishment, setFinalPunishment] = useState<string | null>(null);
  const [spinIndex, setSpinIndex] = useState(0);

  // Start spinning when opened
  useEffect(() => {
    if (isOpen && !isSpinning && !finalPunishment) {
      setIsSpinning(true);
      setFinalPunishment(null);
      
      // Pre-select the final punishment
      const selected = punishments[Math.floor(Math.random() * punishments.length)];
      
      // Spin through punishments quickly, then slow down
      let currentIndex = 0;
      let delay = 50;
      const maxSpins = 30;
      let spins = 0;
      
      const spin = () => {
        if (spins < maxSpins) {
          currentIndex = (currentIndex + 1) % punishments.length;
          setDisplayedPunishment(punishments[currentIndex].text);
          setSpinIndex(currentIndex);
          spins++;
          
          // Slow down as we approach the end
          if (spins > maxSpins - 10) {
            delay += 40;
          }
          
          setTimeout(spin, delay);
        } else {
          // Final reveal
          setDisplayedPunishment(selected.text);
          setIsSpinning(false);
          setFinalPunishment(selected.text);
          
          // Sad red confetti
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff0000', '#ff4444', '#ff6666', '#cc0000', '#990000'],
          });
        }
      };
      
      setTimeout(spin, 500);
    }
  }, [isOpen, isSpinning, finalPunishment, punishments]);

  // Reset when closed
  useEffect(() => {
    if (!isOpen) {
      setIsSpinning(false);
      setFinalPunishment(null);
      setDisplayedPunishment('');
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />

          {/* Content */}
          <motion.div
            className="relative z-10 text-center max-w-md w-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            {/* Title */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 
                className="text-3xl font-black mb-2"
                style={{ 
                  color: 'hsl(30 100% 60%)',
                  textShadow: '0 0 20px hsl(30 100% 50% / 0.5)',
                }}
              >
                🎰 העונש שלך! 🎰
              </h2>
              {currentPlayer && (
                <p className="text-lg text-white/70 mb-6">
                  {currentPlayer}, הנה מה שמגיע לך...
                </p>
              )}
            </motion.div>

            {/* Roulette display */}
            <motion.div
              className="glass-card-strong p-8 rounded-2xl mb-6 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, hsl(0 70% 12% / 0.95), hsl(20 70% 8% / 0.95))',
                borderColor: isSpinning ? 'hsl(45 100% 50% / 0.5)' : 'hsl(0 100% 50% / 0.5)',
                boxShadow: isSpinning 
                  ? '0 0 40px hsl(45 100% 50% / 0.3), inset 0 0 20px hsl(45 100% 50% / 0.1)'
                  : '0 0 40px hsl(0 100% 50% / 0.3), inset 0 0 20px hsl(0 100% 50% / 0.1)',
                transition: 'all 0.3s ease',
              }}
            >
              {/* Spinning effect lines */}
              {isSpinning && (
                <motion.div
                  className="absolute inset-0 opacity-20"
                  animate={{ 
                    backgroundPosition: ['0% 0%', '0% 100%'],
                  }}
                  transition={{ 
                    duration: 0.1, 
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 10px, hsl(45 100% 50%) 10px, hsl(45 100% 50%) 12px)',
                    backgroundSize: '100% 100px',
                  }}
                />
              )}

              <motion.p
                className="text-2xl sm:text-3xl font-bold relative z-10"
                style={{ 
                  color: finalPunishment ? 'hsl(0 100% 70%)' : 'hsl(45 100% 70%)',
                  textShadow: finalPunishment 
                    ? '0 0 20px hsl(0 100% 50% / 0.5)'
                    : '0 0 20px hsl(45 100% 50% / 0.5)',
                }}
                animate={isSpinning ? {
                  scale: [1, 1.05, 1],
                } : finalPunishment ? {
                  scale: [1, 1.1, 1],
                } : {}}
                transition={isSpinning ? {
                  duration: 0.1,
                  repeat: Infinity,
                } : {
                  duration: 0.5,
                  type: 'spring',
                }}
              >
                {displayedPunishment || '...'}
              </motion.p>
            </motion.div>

            {/* Continue button - only show after spinning stops */}
            <AnimatePresence>
              {finalPunishment && (
                <motion.button
                  onClick={onComplete}
                  className="px-8 py-4 rounded-xl font-bold text-lg"
                  style={{
                    background: 'linear-gradient(135deg, hsl(30 100% 50%), hsl(15 100% 50%))',
                    boxShadow: '0 0 20px hsl(30 100% 50% / 0.5)',
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  סיבוב הבא 🔄
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
