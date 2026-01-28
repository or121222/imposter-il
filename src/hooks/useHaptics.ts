import { useCallback } from 'react';

type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning';

const patterns: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 25,
  heavy: 50,
  success: [10, 50, 30],
  error: [50, 30, 50, 30, 50],
  warning: [30, 20, 30],
};

export const useHaptics = () => {
  const vibrate = useCallback((pattern: HapticPattern = 'medium') => {
    if (!('vibrate' in navigator)) return;
    
    try {
      navigator.vibrate(patterns[pattern]);
    } catch {
      // Ignore vibration errors
    }
  }, []);

  const isSupported = 'vibrate' in navigator;

  return { vibrate, isSupported };
};
