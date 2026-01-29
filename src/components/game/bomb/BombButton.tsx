import { motion } from 'framer-motion';
import { Bomb } from 'lucide-react';

interface BombButtonProps {
  onPress: () => void;
  intensity: number; // 0-1, increases as time runs out
  disabled?: boolean;
}

export const BombButton = ({ onPress, intensity, disabled }: BombButtonProps) => {
  // Calculate pulse speed based on intensity (faster as bomb is about to explode)
  const pulseDuration = Math.max(0.15, 1 - intensity * 0.85);
  
  // Calculate scale based on intensity
  const baseScale = 1 + intensity * 0.1;
  const pulseScale = baseScale + 0.05 + intensity * 0.15;
  
  // Calculate glow intensity
  const glowOpacity = 0.4 + intensity * 0.6;
  const glowSpread = 20 + intensity * 60;

  return (
    <motion.button
      onClick={onPress}
      disabled={disabled}
      className="relative w-56 h-56 sm:w-72 sm:h-72 rounded-full flex items-center justify-center focus:outline-none disabled:opacity-50"
      style={{
        background: `linear-gradient(135deg, 
          hsl(${15 - intensity * 15} 100% ${50 - intensity * 20}%), 
          hsl(${30 - intensity * 30} 100% ${40 - intensity * 20}%)
        )`,
        boxShadow: `
          0 0 ${glowSpread}px hsl(15 100% 50% / ${glowOpacity}),
          0 0 ${glowSpread * 2}px hsl(30 100% 50% / ${glowOpacity * 0.5}),
          inset 0 -10px 30px hsl(0 100% 30% / 0.4),
          inset 0 10px 30px hsl(45 100% 70% / 0.2)
        `,
      }}
      animate={{
        scale: [baseScale, pulseScale, baseScale],
      }}
      transition={{
        duration: pulseDuration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      whileTap={{ scale: baseScale * 0.95 }}
    >
      {/* Inner glow ring */}
      <motion.div
        className="absolute inset-4 rounded-full"
        style={{
          background: 'radial-gradient(circle, hsl(45 100% 70% / 0.3) 0%, transparent 70%)',
        }}
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: pulseDuration,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Danger stripes when high intensity */}
      {intensity > 0.5 && (
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: intensity - 0.5 }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                hsl(0 100% 40% / 0.3) 10px,
                hsl(0 100% 40% / 0.3) 20px
              )`,
            }}
          />
        </motion.div>
      )}
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        <motion.div
          animate={{
            rotate: intensity > 0.7 ? [-5, 5, -5] : 0,
          }}
          transition={{
            duration: 0.1,
            repeat: intensity > 0.7 ? Infinity : 0,
          }}
        >
          <Bomb 
            className="w-16 h-16 sm:w-20 sm:h-20" 
            style={{ 
              color: 'hsl(45 100% 90%)',
              filter: `drop-shadow(0 0 10px hsl(45 100% 70% / 0.8))`,
            }} 
          />
        </motion.div>
        <span 
          className="text-lg sm:text-xl font-black"
          style={{ 
            color: 'hsl(45 100% 95%)',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
          }}
        >
          העבר את הפצצה
        </span>
      </div>
      
      {/* Sparkle effects at high intensity */}
      {intensity > 0.6 && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: 'hsl(45 100% 80%)',
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </>
      )}
    </motion.button>
  );
};
