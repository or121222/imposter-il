import { useCallback, useRef, useEffect, useState } from 'react';

// Unified Audio Engine using Web Audio API for reliable cross-browser support
// Falls back to HTML5 Audio when available, synthesizes sounds when external files fail

interface AudioState {
  isInitialized: boolean;
  isEnabled: boolean;
}

// Singleton audio context - shared across all game instances
let sharedAudioContext: AudioContext | null = null;
let audioInitPromise: Promise<AudioContext> | null = null;

const getAudioContext = (): AudioContext => {
  if (!sharedAudioContext) {
    sharedAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return sharedAudioContext;
};

// Initialize audio context after user interaction
const initializeAudioContext = async (): Promise<AudioContext> => {
  if (audioInitPromise) return audioInitPromise;
  
  audioInitPromise = new Promise((resolve) => {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume().then(() => resolve(ctx)).catch(() => resolve(ctx));
    } else {
      resolve(ctx);
    }
  });
  
  return audioInitPromise;
};

// Synthesized sounds using Web Audio API oscillators
const synthesizeTick = (ctx: AudioContext, intensity: number = 1) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'square';
  osc.frequency.setValueAtTime(800 + intensity * 400, ctx.currentTime);
  
  gain.gain.setValueAtTime(0.15 + intensity * 0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.05);
};

const synthesizeClick = (ctx: AudioContext) => {
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
};

const synthesizeWhoosh = (ctx: AudioContext) => {
  // White noise filtered with sweep for whoosh effect
  const bufferSize = ctx.sampleRate * 0.3;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  
  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  
  source.buffer = buffer;
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1000, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(4000, ctx.currentTime + 0.15);
  filter.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.3);
  
  gain.gain.setValueAtTime(0.4, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
  
  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  
  source.start(ctx.currentTime);
};

const synthesizeReveal = (ctx: AudioContext) => {
  // Rising tone for reveal
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.2);
  
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.3);
};

const synthesizeImposter = (ctx: AudioContext) => {
  // Dramatic descending tone for imposter reveal
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc1.type = 'sawtooth';
  osc1.frequency.setValueAtTime(600, ctx.currentTime);
  osc1.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.5);
  
  osc2.type = 'square';
  osc2.frequency.setValueAtTime(300, ctx.currentTime);
  osc2.frequency.exponentialRampToValueAtTime(75, ctx.currentTime + 0.5);
  
  gain.gain.setValueAtTime(0.25, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
  
  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);
  
  osc1.start(ctx.currentTime);
  osc2.start(ctx.currentTime);
  osc1.stop(ctx.currentTime + 0.6);
  osc2.stop(ctx.currentTime + 0.6);
};

const synthesizeSuccess = (ctx: AudioContext) => {
  // Happy ascending arpeggio
  const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
  
  frequencies.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
    
    gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.1);
    gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + i * 0.1 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.3);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(ctx.currentTime + i * 0.1);
    osc.stop(ctx.currentTime + i * 0.1 + 0.3);
  });
};

const synthesizeExplosion = (ctx: AudioContext) => {
  // Loud noise burst with low frequency rumble
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
  
  gain.gain.setValueAtTime(0.8, ctx.currentTime);
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
};

const synthesizeScribble = (ctx: AudioContext) => {
  // Quick scratchy sound for drawing
  const bufferSize = ctx.sampleRate * 0.05;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.3;
  }
  
  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  
  source.buffer = buffer;
  filter.type = 'highpass';
  filter.frequency.setValueAtTime(2000, ctx.currentTime);
  
  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
  
  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  
  source.start(ctx.currentTime);
};

export type GameSoundType = 
  | 'tick' 
  | 'click' 
  | 'whoosh' 
  | 'reveal' 
  | 'imposter' 
  | 'success' 
  | 'explosion'
  | 'scribble'
  | 'match'
  | 'nomatch';

// Romantic match sound
const synthesizeMatch = (ctx: AudioContext) => {
  // Happy ascending two-note chime
  const frequencies = [523.25, 783.99]; // C5, G5
  
  frequencies.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
    
    gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + i * 0.12 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.4);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(ctx.currentTime + i * 0.12);
    osc.stop(ctx.currentTime + i * 0.12 + 0.4);
  });
};

// No match sound - softer descending tone
const synthesizeNoMatch = (ctx: AudioContext) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.2);
  
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.25);
};

export const useGameAudio = () => {
  const [audioState, setAudioState] = useState<AudioState>({
    isInitialized: false,
    isEnabled: true,
  });
  
  const tickIntervalRef = useRef<number | null>(null);
  const droneOscRef = useRef<OscillatorNode | null>(null);
  const droneGainRef = useRef<GainNode | null>(null);
  const isActiveRef = useRef(true);

  // Initialize audio on first user interaction
  const initialize = useCallback(async () => {
    if (audioState.isInitialized) return;
    
    try {
      await initializeAudioContext();
      setAudioState(prev => ({ ...prev, isInitialized: true }));
    } catch (e) {
      console.warn('Audio initialization failed:', e);
    }
  }, [audioState.isInitialized]);

  // Play a synthesized sound
  const playSound = useCallback((type: GameSoundType, intensity: number = 1) => {
    if (!audioState.isEnabled || !isActiveRef.current) return;
    
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      
      switch (type) {
        case 'tick':
          synthesizeTick(ctx, intensity);
          break;
        case 'click':
          synthesizeClick(ctx);
          break;
        case 'whoosh':
          synthesizeWhoosh(ctx);
          break;
        case 'reveal':
          synthesizeReveal(ctx);
          break;
        case 'imposter':
          synthesizeImposter(ctx);
          break;
        case 'success':
          synthesizeSuccess(ctx);
          break;
        case 'explosion':
          synthesizeExplosion(ctx);
          break;
        case 'scribble':
          synthesizeScribble(ctx);
          break;
        case 'match':
          synthesizeMatch(ctx);
          break;
        case 'nomatch':
          synthesizeNoMatch(ctx);
          break;
      }
    } catch (e) {
      console.warn('Sound playback failed:', e);
    }
  }, [audioState.isEnabled]);

  // Start repeating tick sound with dynamic intensity
  const startTicking = useCallback((intensity: number = 1) => {
    if (!isActiveRef.current) return;
    
    // Clear existing interval
    if (tickIntervalRef.current) {
      clearInterval(tickIntervalRef.current);
    }
    
    // Interval: faster as intensity increases (1000ms -> 100ms)
    const interval = Math.max(100, Math.min(1000, 1000 / intensity));
    
    tickIntervalRef.current = window.setInterval(() => {
      if (isActiveRef.current && audioState.isEnabled) {
        playSound('tick', intensity);
      }
    }, interval);
  }, [playSound, audioState.isEnabled]);

  const stopTicking = useCallback(() => {
    if (tickIntervalRef.current) {
      clearInterval(tickIntervalRef.current);
      tickIntervalRef.current = null;
    }
  }, []);

  // Start continuous tension drone
  const startDrone = useCallback(() => {
    if (!isActiveRef.current || !audioState.isEnabled) return;
    
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      
      // Stop existing drone
      if (droneOscRef.current) {
        droneOscRef.current.stop();
      }
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(55, ctx.currentTime); // Low A
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, ctx.currentTime);
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime);
      
      droneOscRef.current = osc;
      droneGainRef.current = gain;
    } catch (e) {
      console.warn('Drone start failed:', e);
    }
  }, [audioState.isEnabled]);

  // Update drone intensity (0-1)
  const updateDroneIntensity = useCallback((intensity: number) => {
    if (droneOscRef.current && droneGainRef.current) {
      const ctx = getAudioContext();
      // Volume: 10% -> 40%
      droneGainRef.current.gain.setTargetAtTime(0.1 + intensity * 0.3, ctx.currentTime, 0.1);
      // Frequency: 55Hz -> 110Hz
      droneOscRef.current.frequency.setTargetAtTime(55 + intensity * 55, ctx.currentTime, 0.1);
    }
  }, []);

  const stopDrone = useCallback(() => {
    if (droneOscRef.current) {
      try {
        droneOscRef.current.stop();
      } catch (e) {
        // Ignore if already stopped
      }
      droneOscRef.current = null;
      droneGainRef.current = null;
    }
  }, []);

  const stopAllSounds = useCallback(() => {
    stopTicking();
    stopDrone();
  }, [stopTicking, stopDrone]);

  const setEnabled = useCallback((enabled: boolean) => {
    setAudioState(prev => ({ ...prev, isEnabled: enabled }));
    if (!enabled) {
      stopAllSounds();
    }
  }, [stopAllSounds]);

  const activate = useCallback(() => {
    isActiveRef.current = true;
  }, []);

  const deactivate = useCallback(() => {
    isActiveRef.current = false;
    stopAllSounds();
  }, [stopAllSounds]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllSounds();
    };
  }, [stopAllSounds]);

  return {
    isInitialized: audioState.isInitialized,
    isEnabled: audioState.isEnabled,
    initialize,
    playSound,
    startTicking,
    stopTicking,
    startDrone,
    updateDroneIntensity,
    stopDrone,
    stopAllSounds,
    setEnabled,
    activate,
    deactivate,
  };
};

// Global instance for components that can't use hooks
let globalAudioInstance: ReturnType<typeof useGameAudio> | null = null;

export const setGlobalGameAudio = (instance: ReturnType<typeof useGameAudio>) => {
  globalAudioInstance = instance;
};

export const getGlobalGameAudio = () => globalAudioInstance;
