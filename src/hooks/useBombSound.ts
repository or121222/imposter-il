import { useCallback, useRef, useEffect } from 'react';

// Continuous Variable Speed Audio Engine for The Bomb game
// Uses external audio files for realistic mechanical clock ticking

const AUDIO_URLS = {
  tick: 'https://assets.mixkit.co/active_storage/sfx/2039/2039-preview.mp3', // Clock tick
  explosion: 'https://assets.mixkit.co/active_storage/sfx/209/209-preview.mp3', // Explosion
};

export const useBombSound = () => {
  const tickAudioRef = useRef<HTMLAudioElement | null>(null);
  const explosionAudioRef = useRef<HTMLAudioElement | null>(null);
  const isActiveRef = useRef(false);
  const intensityRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastTickTimeRef = useRef(0);
  const isInitializedRef = useRef(false);

  // Initialize audio elements
  const initialize = useCallback(async () => {
    if (isInitializedRef.current) return;
    
    try {
      // Create tick audio element
      tickAudioRef.current = new Audio(AUDIO_URLS.tick);
      tickAudioRef.current.preload = 'auto';
      tickAudioRef.current.loop = false;
      tickAudioRef.current.volume = 0.5;
      
      // Create explosion audio element
      explosionAudioRef.current = new Audio(AUDIO_URLS.explosion);
      explosionAudioRef.current.preload = 'auto';
      explosionAudioRef.current.volume = 0.8;
      
      // Preload by attempting to load
      await Promise.all([
        new Promise<void>((resolve) => {
          tickAudioRef.current!.addEventListener('canplaythrough', () => resolve(), { once: true });
          tickAudioRef.current!.load();
        }),
        new Promise<void>((resolve) => {
          explosionAudioRef.current!.addEventListener('canplaythrough', () => resolve(), { once: true });
          explosionAudioRef.current!.load();
        }),
      ]).catch(() => {
        // Ignore preload errors - we'll handle playback errors instead
      });
      
      isInitializedRef.current = true;
    } catch (e) {
      console.warn('Failed to initialize bomb sounds:', e);
    }
  }, []);

  // Play a single tick with current intensity
  const playTick = useCallback(() => {
    if (!tickAudioRef.current || !isActiveRef.current) return;
    
    const audio = tickAudioRef.current;
    const intensity = intensityRef.current;
    
    // Reset and play
    audio.currentTime = 0;
    
    // Volume: 40% -> 100% based on intensity
    audio.volume = Math.min(1, 0.4 + intensity * 0.6);
    
    // Playback rate: 1x -> 2.5x based on intensity
    audio.playbackRate = Math.min(2.5, 1 + intensity * 1.5);
    
    audio.play().catch(() => {
      // Ignore play errors (user hasn't interacted yet)
    });
  }, []);

  // Continuous tick loop using requestAnimationFrame
  const tickLoop = useCallback(() => {
    if (!isActiveRef.current) return;
    
    const now = performance.now();
    const intensity = intensityRef.current;
    
    // Interval between ticks: 1000ms -> 150ms based on intensity
    const interval = Math.max(150, 1000 - intensity * 850);
    
    if (now - lastTickTimeRef.current >= interval) {
      playTick();
      lastTickTimeRef.current = now;
    }
    
    animationFrameRef.current = requestAnimationFrame(tickLoop);
  }, [playTick]);

  // Start the ticking
  const startTicking = useCallback(() => {
    if (!isActiveRef.current) return;
    
    // Stop any existing loop
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    lastTickTimeRef.current = 0;
    animationFrameRef.current = requestAnimationFrame(tickLoop);
  }, [tickLoop]);

  // Stop the ticking
  const stopTicking = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  // Update intensity (0-1) - affects tick speed, volume, and pitch
  const updateIntensity = useCallback((intensity: number) => {
    intensityRef.current = Math.max(0, Math.min(1, intensity));
  }, []);

  // Play explosion sound
  const playExplosion = useCallback(() => {
    if (!explosionAudioRef.current) return;
    
    // Stop ticking
    stopTicking();
    
    const audio = explosionAudioRef.current;
    audio.currentTime = 0;
    audio.volume = 0.9;
    audio.playbackRate = 1;
    
    audio.play().catch(() => {
      // Fallback: synthesize explosion if file fails
      synthesizeExplosion();
    });
  }, [stopTicking]);

  // Fallback synthesized explosion using Web Audio API
  const synthesizeExplosion = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create noise buffer
      const bufferSize = ctx.sampleRate * 0.8;
      const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
      
      for (let channel = 0; channel < 2; channel++) {
        const data = buffer.getChannelData(channel);
        for (let i = 0; i < bufferSize; i++) {
          const decay = Math.exp(-i / (ctx.sampleRate * 0.2));
          data[i] = (Math.random() * 2 - 1) * decay;
        }
      }
      
      const source = ctx.createBufferSource();
      const lowpass = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      
      source.buffer = buffer;
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(2000, ctx.currentTime);
      lowpass.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.5);
      
      gain.gain.setValueAtTime(0.9, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      
      source.connect(lowpass);
      lowpass.connect(gain);
      gain.connect(ctx.destination);
      
      source.start(ctx.currentTime);
      
      // Add low rumble
      const rumble = ctx.createOscillator();
      const rumbleGain = ctx.createGain();
      
      rumble.type = 'sine';
      rumble.frequency.setValueAtTime(60, ctx.currentTime);
      rumble.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.6);
      
      rumbleGain.gain.setValueAtTime(0.5, ctx.currentTime);
      rumbleGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      
      rumble.connect(rumbleGain);
      rumbleGain.connect(ctx.destination);
      
      rumble.start(ctx.currentTime);
      rumble.stop(ctx.currentTime + 0.6);
    } catch (e) {
      console.warn('Synthesized explosion failed:', e);
    }
  }, []);

  // Play click sound (for button press)
  const playClick = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1000, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      console.warn('Click sound failed:', e);
    }
  }, []);

  // Stop all sounds
  const stopAllSounds = useCallback(() => {
    stopTicking();
    
    if (tickAudioRef.current) {
      tickAudioRef.current.pause();
      tickAudioRef.current.currentTime = 0;
    }
    
    if (explosionAudioRef.current) {
      explosionAudioRef.current.pause();
      explosionAudioRef.current.currentTime = 0;
    }
  }, [stopTicking]);

  // Activate sound system
  const activate = useCallback(() => {
    isActiveRef.current = true;
  }, []);

  // Deactivate sound system
  const deactivate = useCallback(() => {
    isActiveRef.current = false;
    stopAllSounds();
  }, [stopAllSounds]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllSounds();
      if (tickAudioRef.current) {
        tickAudioRef.current.src = '';
        tickAudioRef.current = null;
      }
      if (explosionAudioRef.current) {
        explosionAudioRef.current.src = '';
        explosionAudioRef.current = null;
      }
    };
  }, [stopAllSounds]);

  return {
    initialize,
    activate,
    deactivate,
    startTicking,
    stopTicking,
    updateIntensity,
    playExplosion,
    playClick,
    stopAllSounds,
  };
};
