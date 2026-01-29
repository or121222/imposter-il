import { useCallback, useRef, useEffect } from 'react';

// Sound URLs from free sound libraries
const SOUNDS = {
  tick: 'https://cdn.pixabay.com/audio/2022/03/24/audio_58e537e31f.mp3',
  click: 'https://cdn.pixabay.com/audio/2022/10/30/audio_3b6d6a3d4a.mp3',
  explosion: 'https://cdn.pixabay.com/audio/2022/03/10/audio_0715f2e99f.mp3',
};

type SoundType = keyof typeof SOUNDS;

export const useBombSound = () => {
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  const tickIntervalRef = useRef<number | null>(null);
  const isActiveRef = useRef(true);

  // Preload sounds
  useEffect(() => {
    Object.entries(SOUNDS).forEach(([key, url]) => {
      const audio = new Audio(url);
      audio.preload = 'auto';
      audio.volume = key === 'explosion' ? 0.8 : 0.5;
      audioRefs.current[key] = audio;
    });

    return () => {
      // Cleanup all sounds on unmount
      stopAllSounds();
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  const playSound = useCallback((type: SoundType) => {
    if (!isActiveRef.current) return;
    
    const audio = audioRefs.current[type];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  }, []);

  const startTicking = useCallback((intensity: number = 1) => {
    // intensity: 1 = slow (1 tick per 1000ms), higher = faster
    // Clamp between 100ms and 1000ms
    const interval = Math.max(100, Math.min(1000, 1000 / intensity));
    
    // Clear existing interval
    if (tickIntervalRef.current) {
      clearInterval(tickIntervalRef.current);
    }

    // Start new interval
    tickIntervalRef.current = window.setInterval(() => {
      if (isActiveRef.current) {
        const audio = audioRefs.current['tick'];
        if (audio) {
          audio.currentTime = 0;
          // Increase volume as intensity increases
          audio.volume = Math.min(0.8, 0.3 + (intensity * 0.05));
          audio.playbackRate = Math.min(2, 0.8 + (intensity * 0.1));
          audio.play().catch(() => {});
        }
      }
    }, interval);
  }, []);

  const stopTicking = useCallback(() => {
    if (tickIntervalRef.current) {
      clearInterval(tickIntervalRef.current);
      tickIntervalRef.current = null;
    }
  }, []);

  const stopAllSounds = useCallback(() => {
    isActiveRef.current = false;
    stopTicking();
    Object.values(audioRefs.current).forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  }, [stopTicking]);

  const activate = useCallback(() => {
    isActiveRef.current = true;
  }, []);

  const deactivate = useCallback(() => {
    isActiveRef.current = false;
    stopAllSounds();
  }, [stopAllSounds]);

  return {
    playSound,
    startTicking,
    stopTicking,
    stopAllSounds,
    activate,
    deactivate,
  };
};
