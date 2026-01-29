import { useCallback, useRef, useEffect } from 'react';

// Sound URLs from free sound libraries
const SOUNDS = {
  tick: 'https://cdn.pixabay.com/audio/2022/03/24/audio_58e537e31f.mp3',
  click: 'https://cdn.pixabay.com/audio/2022/10/30/audio_3b6d6a3d4a.mp3',
  explosion: 'https://cdn.pixabay.com/audio/2022/03/10/audio_0715f2e99f.mp3',
  // Tension drone for background
  drone: 'https://cdn.pixabay.com/audio/2022/03/15/audio_59cf0d8c44.mp3',
};

type SoundType = keyof typeof SOUNDS;

interface SoundConfig {
  volume: number;
  playbackRate: number;
}

export const useBombSound = () => {
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  const tickIntervalRef = useRef<number | null>(null);
  const isActiveRef = useRef(true);
  const droneRef = useRef<HTMLAudioElement | null>(null);
  const currentIntensityRef = useRef(0);

  // Preload sounds
  useEffect(() => {
    Object.entries(SOUNDS).forEach(([key, url]) => {
      const audio = new Audio(url);
      audio.preload = 'auto';
      audio.volume = key === 'explosion' ? 0.8 : key === 'drone' ? 0.3 : 0.5;
      if (key === 'drone') {
        audio.loop = true;
        droneRef.current = audio;
      }
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

  // Start background drone music
  const startDrone = useCallback(() => {
    const drone = droneRef.current;
    if (drone && isActiveRef.current) {
      drone.currentTime = 0;
      drone.volume = 0.3;
      drone.playbackRate = 1;
      drone.play().catch(() => {
        // Ignore autoplay errors - will start after user interaction
      });
    }
  }, []);

  // Update drone based on intensity (0-1)
  const updateDroneIntensity = useCallback((intensity: number) => {
    currentIntensityRef.current = intensity;
    const drone = droneRef.current;
    if (drone) {
      // Volume: 30% -> 100%
      drone.volume = Math.min(1, 0.3 + intensity * 0.7);
      // Playback rate: 1x -> 1.5x
      drone.playbackRate = Math.min(1.5, 1 + intensity * 0.5);
    }
  }, []);

  const stopDrone = useCallback(() => {
    const drone = droneRef.current;
    if (drone) {
      drone.pause();
      drone.currentTime = 0;
    }
  }, []);

  const stopAllSounds = useCallback(() => {
    isActiveRef.current = false;
    stopTicking();
    stopDrone();
    Object.values(audioRefs.current).forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  }, [stopTicking, stopDrone]);

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
    startDrone,
    updateDroneIntensity,
    stopDrone,
    stopAllSounds,
    activate,
    deactivate,
  };
};
