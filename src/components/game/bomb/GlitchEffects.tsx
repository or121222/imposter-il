import { motion, AnimatePresence } from 'framer-motion';
import { GlitchType } from '@/hooks/useGlitchMode';

interface GlitchEffectsProps {
  activeGlitch: GlitchType;
}

export const GlitchEffects = ({ activeGlitch }: GlitchEffectsProps) => {
  return (
    <>
      {/* Blackout overlay */}
      <AnimatePresence>
        {activeGlitch === 'blackout' && (
          <motion.div
            className="fixed inset-0 z-[100] pointer-events-none"
            style={{ background: 'black' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            {/* Subtle text hint */}
            <motion.p
              className="absolute inset-0 flex items-center justify-center text-white/10 text-2xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 1.5 }}
            >
              ⚡ קצר חשמלי! ⚡
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fakeout flash */}
      <AnimatePresence>
        {activeGlitch === 'fakeout' && (
          <motion.div
            className="fixed inset-0 z-[100] pointer-events-none"
            initial={{ backgroundColor: 'hsl(0 100% 50%)' }}
            animate={{ 
              backgroundColor: ['hsl(0 100% 50%)', 'hsl(0 100% 70%)', 'transparent'],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Fake BOOM text */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: [0.5, 1.2, 0], opacity: [1, 1, 0] }}
              transition={{ duration: 0.4 }}
            >
              <span 
                className="text-6xl font-black"
                style={{ 
                  color: 'hsl(45 100% 70%)',
                  textShadow: '0 0 30px hsl(30 100% 50%)',
                }}
              >
                BOOM?
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen shake for glitches */}
      <AnimatePresence>
        {activeGlitch === 'fakeout' && (
          <motion.div
            className="fixed inset-0 z-[99] pointer-events-none"
            animate={{
              x: [0, -10, 10, -5, 5, 0],
              y: [0, 5, -5, 2, -2, 0],
            }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>
    </>
  );
};
