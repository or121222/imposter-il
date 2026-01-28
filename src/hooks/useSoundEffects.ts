import { useCallback, useRef, useEffect } from 'react';

// Sound URLs from free sound libraries
const SOUNDS = {
  reveal: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c1b8b0bdb0.mp3', // whoosh
  imposter: 'https://cdn.pixabay.com/audio/2022/03/15/audio_115b9b5dd4.mp3', // dramatic
  click: 'https://cdn.pixabay.com/audio/2022/10/30/audio_3b6d6a3d4a.mp3', // click
  success: 'https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3', // success
  tick: 'https://cdn.pixabay.com/audio/2022/03/24/audio_58e537e31f.mp3', // tick
};

type SoundType = keyof typeof SOUNDS;

export const useSoundEffects = () => {
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  const soundEnabled = useRef(true);

  // Preload sounds
  useEffect(() => {
    Object.entries(SOUNDS).forEach(([key, url]) => {
      const audio = new Audio(url);
      audio.preload = 'auto';
      audio.volume = 0.5;
      audioRefs.current[key] = audio;
    });

    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  const playSound = useCallback((type: SoundType) => {
    if (!soundEnabled.current) return;
    
    const audio = audioRefs.current[type];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  }, []);

  const toggleSound = useCallback((enabled: boolean) => {
    soundEnabled.current = enabled;
  }, []);

  const isSoundEnabled = useCallback(() => soundEnabled.current, []);

  return {
    playSound,
    toggleSound,
    isSoundEnabled,
  };
};

// Create a singleton for global access
let globalSoundInstance: ReturnType<typeof useSoundEffects> | null = null;

export const getGlobalSoundEffects = () => {
  if (!globalSoundInstance) {
    // We'll initialize this when the hook is first used
    return null;
  }
  return globalSoundInstance;
};

export const setGlobalSoundEffects = (instance: ReturnType<typeof useSoundEffects>) => {
  globalSoundInstance = instance;
};