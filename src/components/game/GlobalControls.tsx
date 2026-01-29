import { motion } from 'framer-motion';
import { Volume2, VolumeX, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { HelpModal } from './HelpModal';
import { useTheme } from '@/hooks/useTheme';
import { useGameAudio } from '@/hooks/useGameAudio';

interface GlobalControlsProps {
  showHelp?: boolean;
}

export const GlobalControls = ({ showHelp = true }: GlobalControlsProps) => {
  const { theme, toggleTheme } = useTheme();
  const gameAudio = useGameAudio();
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Sync with audio state
  useEffect(() => {
    setSoundEnabled(gameAudio.isEnabled);
  }, [gameAudio.isEnabled]);

  const handleToggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    gameAudio.setEnabled(newState);
    if (newState) {
      gameAudio.playSound('click');
    }
  };

  return (
    <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
      {showHelp && <HelpModal fixedTrigger={false} />}

      <motion.button
        onClick={handleToggleSound}
        className="p-3 rounded-full glass-card hover:bg-muted/40 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {soundEnabled ? (
          <Volume2 className="w-6 h-6 text-primary" />
        ) : (
          <VolumeX className="w-6 h-6 text-muted-foreground" />
        )}
      </motion.button>

      <motion.button
        onClick={toggleTheme}
        className="p-3 rounded-full glass-card hover:bg-muted/40 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {theme === 'dark' ? (
          <Sun className="w-6 h-6 text-primary" />
        ) : (
          <Moon className="w-6 h-6 text-primary" />
        )}
      </motion.button>
    </div>
  );
};

export const GlobalFooter = () => {
  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 pointer-events-none">
      <p className="text-center text-xs text-muted-foreground">
        כל הזכויות שמורות ל - אור כהן
      </p>
    </div>
  );
};
