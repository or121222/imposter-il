import { useCallback, useRef, useEffect } from 'react';

// Continuous Variable Speed Audio Engine for The Bomb game
// Uses Web Audio API for reliable synthesized sounds

export const useBombSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const isActiveRef = useRef(false);
  const intensityRef = useRef(0);
  const tickIntervalRef = useRef<number | null>(null);
  const isInitializedRef = useRef(false);

  // Initialize audio context
  const initialize = useCallback(async () => {
    if (isInitializedRef.current) return;
    
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      // Resume context if suspended (required after user interaction)
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      isInitializedRef.current = true;
    } catch (e) {
      console.warn('Failed to initialize audio context:', e);
    }
  }, []);

  // Play a synthesized tick sound
  const playTick = useCallback(() => {
    if (!audioContextRef.current || !isActiveRef.current) return;
    
    const ctx = audioContextRef.current;
    const intensity = intensityRef.current;
    
    try {
      // Create a click/tick sound using a short oscillator burst
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      // Higher pitch as intensity increases
      const baseFreq = 800 + intensity * 400;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, ctx.currentTime + 0.05);
      
      // Volume increases with intensity
      const volume = 0.15 + intensity * 0.25;
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      // Ignore errors
    }
  }, []);

  // Start continuous ticking with variable speed
  const startTicking = useCallback(() => {
    if (!isActiveRef.current) return;
    
    // Clear any existing interval
    if (tickIntervalRef.current) {
      clearInterval(tickIntervalRef.current);
    }
    
    // Start the tick loop
    const tick = () => {
      playTick();
      
      // Calculate next interval based on intensity
      // Goes from 1000ms at intensity 0 to 120ms at intensity 1
      const interval = Math.max(120, 1000 - intensityRef.current * 880);
      
      tickIntervalRef.current = window.setTimeout(tick, interval);
    };
    
    // Start immediately
    tick();
  }, [playTick]);

  // Stop ticking
  const stopTicking = useCallback(() => {
    if (tickIntervalRef.current) {
      clearTimeout(tickIntervalRef.current);
      tickIntervalRef.current = null;
    }
  }, []);

  // Update intensity (0-1)
  const updateIntensity = useCallback((intensity: number) => {
    intensityRef.current = Math.max(0, Math.min(1, intensity));
  }, []);

  // Play explosion sound
  const playExplosion = useCallback(() => {
    stopTicking();
    
    if (!audioContextRef.current) {
      // Create a temporary context if needed
      try {
        const tempCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        synthesizeExplosion(tempCtx);
      } catch (e) {
        console.warn('Explosion sound failed:', e);
      }
      return;
    }
    
    synthesizeExplosion(audioContextRef.current);
  }, [stopTicking]);

  // Synthesize explosion using Web Audio API
  const synthesizeExplosion = (ctx: AudioContext) => {
    try {
      // Create noise buffer for explosion
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
  };

  // Play click sound (for button press)
  const playClick = useCallback(() => {
    const ctx = audioContextRef.current;
    if (!ctx) return;
    
    try {
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
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
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
