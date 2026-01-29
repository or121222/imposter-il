import { useState, useCallback, useRef, useEffect } from 'react';

export type GlitchType = 'dodge' | 'fakeout' | 'blackout' | 'reverse' | null;

interface GlitchState {
  active: GlitchType;
  dodgePosition: { x: number; y: number } | null;
}

interface UseGlitchModeProps {
  enabled: boolean;
  onFakeExplosion: () => void;
  glitchChance?: number; // Default 15%
}

export const useGlitchMode = ({ enabled, onFakeExplosion, glitchChance = 0.15 }: UseGlitchModeProps) => {
  const [glitchState, setGlitchState] = useState<GlitchState>({
    active: null,
    dodgePosition: null,
  });
  
  const glitchTimeoutRef = useRef<number | null>(null);
  const periodicGlitchRef = useRef<number | null>(null);

  // Clear any active glitch
  const clearGlitch = useCallback(() => {
    setGlitchState({ active: null, dodgePosition: null });
    if (glitchTimeoutRef.current) {
      clearTimeout(glitchTimeoutRef.current);
      glitchTimeoutRef.current = null;
    }
  }, []);

  // Trigger a random glitch
  const triggerGlitch = useCallback(() => {
    if (!enabled) return;

    const glitchTypes: GlitchType[] = ['dodge', 'fakeout', 'blackout', 'reverse'];
    const randomGlitch = glitchTypes[Math.floor(Math.random() * glitchTypes.length)];

    switch (randomGlitch) {
      case 'dodge':
        // Button jumps to random position
        const x = (Math.random() - 0.5) * 200;
        const y = (Math.random() - 0.5) * 300;
        setGlitchState({ active: 'dodge', dodgePosition: { x, y } });
        // Return after 2 seconds
        glitchTimeoutRef.current = window.setTimeout(() => {
          setGlitchState({ active: null, dodgePosition: null });
        }, 2000);
        break;

      case 'fakeout':
        // Fake explosion - doesn't end the game
        setGlitchState({ active: 'fakeout', dodgePosition: null });
        onFakeExplosion();
        // Reset after flash
        glitchTimeoutRef.current = window.setTimeout(() => {
          setGlitchState({ active: null, dodgePosition: null });
        }, 500);
        break;

      case 'blackout':
        // Screen goes dark for 1.5 seconds
        setGlitchState({ active: 'blackout', dodgePosition: null });
        glitchTimeoutRef.current = window.setTimeout(() => {
          setGlitchState({ active: null, dodgePosition: null });
        }, 1500);
        break;

      case 'reverse':
        // Text/button flips upside down
        setGlitchState({ active: 'reverse', dodgePosition: null });
        glitchTimeoutRef.current = window.setTimeout(() => {
          setGlitchState({ active: null, dodgePosition: null });
        }, 3000);
        break;
    }
  }, [enabled, onFakeExplosion]);

  // Check for glitch on button press
  const checkGlitchOnPress = useCallback(() => {
    if (!enabled || glitchState.active) return false;
    
    if (Math.random() < glitchChance) {
      triggerGlitch();
      return true;
    }
    return false;
  }, [enabled, glitchChance, glitchState.active, triggerGlitch]);

  // Start periodic glitch checks
  const startPeriodicGlitches = useCallback(() => {
    if (!enabled) return;
    
    // Check every 5 seconds
    periodicGlitchRef.current = window.setInterval(() => {
      if (!glitchState.active && Math.random() < glitchChance) {
        triggerGlitch();
      }
    }, 5000);
  }, [enabled, glitchChance, glitchState.active, triggerGlitch]);

  // Stop periodic glitches
  const stopPeriodicGlitches = useCallback(() => {
    if (periodicGlitchRef.current) {
      clearInterval(periodicGlitchRef.current);
      periodicGlitchRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearGlitch();
      stopPeriodicGlitches();
    };
  }, [clearGlitch, stopPeriodicGlitches]);

  return {
    glitchState,
    checkGlitchOnPress,
    triggerGlitch,
    clearGlitch,
    startPeriodicGlitches,
    stopPeriodicGlitches,
    isGlitchActive: glitchState.active !== null,
  };
};
