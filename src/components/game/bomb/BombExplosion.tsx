import { motion, AnimatePresence } from 'framer-motion';
import { Bomb } from 'lucide-react';

interface BombExplosionProps {
  isExploded: boolean;
  currentPlayer?: string;
  onContinue: () => void;
}

export const BombExplosion = ({ isExploded, currentPlayer, onContinue }: BombExplosionProps) => {
  return (
    <AnimatePresence>
      {isExploded && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Screen flash */}
          <motion.div
            className="absolute inset-0"
            initial={{ backgroundColor: 'hsl(45 100% 90%)' }}
            animate={{ 
              backgroundColor: ['hsl(45 100% 90%)', 'hsl(0 100% 20%)', 'hsl(0 70% 8%)'],
            }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Screen shake container */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{
              x: [0, -20, 20, -15, 15, -10, 10, -5, 5, 0],
              y: [0, 15, -15, 10, -10, 5, -5, 2, -2, 0],
            }}
            transition={{ duration: 0.5 }}
          >
            {/* Explosion particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 rounded-full"
                style={{
                  background: `hsl(${Math.random() * 60} 100% 60%)`,
                }}
                initial={{ 
                  x: 0, 
                  y: 0, 
                  scale: 0,
                  opacity: 1,
                }}
                animate={{ 
                  x: (Math.random() - 0.5) * 400,
                  y: (Math.random() - 0.5) * 400,
                  scale: [0, 2, 0],
                  opacity: [1, 1, 0],
                }}
                transition={{ 
                  duration: 1,
                  delay: i * 0.02,
                }}
              />
            ))}
            
            {/* Main explosion circle */}
            <motion.div
              className="absolute w-32 h-32 rounded-full"
              style={{
                background: 'radial-gradient(circle, hsl(45 100% 70%) 0%, hsl(30 100% 50%) 50%, hsl(15 100% 40%) 100%)',
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ 
                scale: [0, 3, 4],
                opacity: [1, 0.8, 0],
              }}
              transition={{ duration: 0.6 }}
            />
            
            {/* Content */}
            <motion.div
              className="relative z-10 text-center"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, type: 'spring', damping: 10 }}
            >
              <motion.div
                animate={{ 
                  rotate: [0, -10, 10, -10, 10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 0.5,
                  repeat: 2,
                }}
              >
                <Bomb 
                  className="w-24 h-24 mx-auto mb-6" 
                  style={{ 
                    color: 'hsl(45 100% 60%)',
                    filter: 'drop-shadow(0 0 20px hsl(30 100% 50%))',
                  }} 
                />
              </motion.div>
              
              <motion.h1
                className="text-6xl sm:text-8xl font-black mb-4"
                style={{ 
                  color: 'hsl(30 100% 60%)',
                  textShadow: `
                    0 0 20px hsl(30 100% 50%),
                    0 0 40px hsl(15 100% 50%),
                    0 4px 8px rgba(0,0,0,0.5)
                  `,
                }}
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                }}
              >
                BOOM!
              </motion.h1>
              
              {currentPlayer && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <p className="text-xl text-white/80 mb-2">הפצצה התפוצצה על</p>
                  <p 
                    className="text-3xl font-black"
                    style={{ color: 'hsl(45 100% 70%)' }}
                  >
                    {currentPlayer}
                  </p>
                  <p className="text-lg text-white/60 mt-2">🍺 שותה!</p>
                </motion.div>
              )}
              
              <motion.button
                onClick={onContinue}
                className="mt-8 px-8 py-4 rounded-xl font-bold text-lg"
                style={{
                  background: 'linear-gradient(135deg, hsl(30 100% 50%), hsl(15 100% 50%))',
                  boxShadow: '0 0 20px hsl(30 100% 50% / 0.5)',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                סיבוב הבא 🔄
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
