import { motion } from 'framer-motion';
import { Bomb } from 'lucide-react';
import { useMemo } from 'react';

interface BombButtonProps {
  onPress: () => void;
  intensity: number; // 0-1, increases as time runs out
  disabled?: boolean;
  flipped?: boolean; // For glitch mode
  position?: { x: number; y: number } | null; // For dodge glitch
}

export const BombButton = ({ onPress, intensity, disabled, flipped, position }: BombButtonProps) => {
  // Memoize calculated values to prevent re-renders causing animation jumps
  const animationConfig = useMemo(() => {
    // Use stepped intensity to reduce animation re-triggers
    const steppedIntensity = Math.floor(intensity * 10) / 10;
    
    // Calculate pulse speed - smoother curve
    const pulseDuration = Math.max(0.2, 1.2 - steppedIntensity * 0.9);
    
    // Calculate glow intensity
    const glowOpacity = 0.4 + steppedIntensity * 0.6;
    const glowSpread = 20 + steppedIntensity * 60;
    
    return { pulseDuration, glowOpacity, glowSpread, steppedIntensity };
  }, [Math.floor(intensity * 10)]); // Only update when intensity changes by 0.1

  const { pulseDuration, glowOpacity, glowSpread, steppedIntensity } = animationConfig;

  const buttonStyle = useMemo(() => ({
    background: `linear-gradient(135deg, 
      hsl(${15 - steppedIntensity * 15} 100% ${50 - steppedIntensity * 20}%), 
      hsl(${30 - steppedIntensity * 30} 100% ${40 - steppedIntensity * 20}%)
    )`,
    boxShadow: `
      0 0 ${glowSpread}px hsl(15 100% 50% / ${glowOpacity}),
      0 0 ${glowSpread * 2}px hsl(30 100% 50% / ${glowOpacity * 0.5}),
      inset 0 -10px 30px hsl(0 100% 30% / 0.4),
      inset 0 10px 30px hsl(45 100% 70% / 0.2)
    `,
    transform: flipped ? 'scaleY(-1)' : undefined,
  }), [steppedIntensity, glowOpacity, glowSpread, flipped]);

  return (
    <motion.button
      onClick={onPress}
      disabled={disabled}
      className="relative w-56 h-56 sm:w-72 sm:h-72 rounded-full flex items-center justify-center focus:outline-none disabled:opacity-50"
      style={buttonStyle}
      animate={position ? { x: position.x, y: position.y } : { x: 0, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Smooth pulsing overlay instead of scale animation */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, hsl(45 100% 70% / 0.2) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: pulseDuration,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

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
      {steppedIntensity > 0.5 && (
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: steppedIntensity - 0.5 }}
          transition={{ duration: 0.3 }}
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
      <div className="relative z-10 flex flex-col items-center gap-3" style={{ transform: flipped ? 'scaleY(-1)' : undefined }}>
        <motion.div
          animate={steppedIntensity > 0.7 ? {
            rotate: [-3, 3, -3],
          } : { rotate: 0 }}
          transition={{
            duration: 0.15,
            repeat: steppedIntensity > 0.7 ? Infinity : 0,
            ease: 'easeInOut',
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
      
      {/* Sparkle effects at high intensity - use CSS animation for smoothness */}
      {steppedIntensity > 0.6 && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: 'hsl(45 100% 80%)',
                top: `${30 + i * 15}%`,
                left: `${25 + i * 15}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}
    </motion.button>
  );
};
