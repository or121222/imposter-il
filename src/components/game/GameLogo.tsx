import { motion } from 'framer-motion';
import { Skull, Sparkles } from 'lucide-react';

interface GameLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export const GameLogo = ({ size = 'lg' }: GameLogoProps) => {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-5xl sm:text-6xl md:text-7xl',
  };

  const iconSizes = {
    sm: 24,
    md: 36,
    lg: 48,
  };

  return (
    <motion.div
      className="flex flex-col items-center gap-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Logo icon */}
      <motion.div
        className="relative"
        animate={{ 
          rotate: [0, -5, 5, 0],
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      >
        <div className="relative">
          <motion.div
            className="absolute inset-0 blur-xl bg-primary/40 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="relative glass-card p-6 rounded-full">
            <Skull 
              size={iconSizes[size]} 
              className="text-primary drop-shadow-[0_0_15px_hsl(var(--primary)/0.8)]" 
            />
          </div>
        </div>
        
        {/* Sparkle decorations */}
        <motion.div
          className="absolute -top-2 -right-2"
          animate={{ scale: [0.8, 1.2, 0.8], rotate: [0, 180, 360] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Sparkles size={20} className="text-secondary" />
        </motion.div>
        <motion.div
          className="absolute -bottom-1 -left-3"
          animate={{ scale: [1, 0.8, 1], rotate: [360, 180, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <Sparkles size={16} className="text-primary" />
        </motion.div>
      </motion.div>

      {/* Title */}
      <motion.h1
        className={`${sizeClasses[size]} font-black text-gradient-primary tracking-tight`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        המתחזה
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="text-muted-foreground text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        מי המרגל ביניכם?
      </motion.p>
    </motion.div>
  );
};
