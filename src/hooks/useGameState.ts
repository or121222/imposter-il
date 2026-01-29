import { useState, useCallback } from 'react';
import { getRandomWordPair, getTrollWords, type Category } from '@/data/gameCategories';

export type GamePhase = 'setup' | 'category' | 'passing' | 'reveal' | 'starter' | 'playing' | 'voting' | 'results';

export type PlayerRole = 'civilian' | 'imposter' | 'jester' | 'confused' | 'accomplice';

export interface Player {
  id: string;
  name: string;
  role: PlayerRole;
  hasSeenCard: boolean;
}

export interface GameSettings {
  imposterCount: number;
  timerEnabled: boolean;
  timerDuration: number; // in minutes
  imposterHint: boolean;
  trollMode: boolean;
  jesterEnabled: boolean;
  confusedEnabled: boolean;
  accompliceEnabled: boolean;
  imposterNeverStarts: boolean;
}

export interface GameState {
  phase: GamePhase;
  players: Player[];
  settings: GameSettings;
  selectedCategory: string | null;
  secretWord: string;
  confusedWord: string; // Similar word for the confused player
  currentPlayerIndex: number;
  isTrollRound: boolean;
  trollWord: string | null;
  roundStarter: string | null; // Name of player who starts the round
  imposterName: string | null; // For accomplice to see
  votes: Record<string, string>; // voterId -> suspectId
}

const defaultSettings: GameSettings = {
  imposterCount: 1,
  timerEnabled: true,
  timerDuration: 5,
  imposterHint: true,
  trollMode: false,
  jesterEnabled: false,
  confusedEnabled: false,
  accompliceEnabled: false,
  imposterNeverStarts: true,
};

const initialState: GameState = {
  phase: 'setup',
  players: [],
  settings: defaultSettings,
  selectedCategory: null,
  secretWord: '',
  confusedWord: '',
  currentPlayerIndex: 0,
  isTrollRound: false,
  trollWord: null,
  roundStarter: null,
  imposterName: null,
  votes: {},
};

export const useGameState = (allCategories: Category[] = []) => {
  const [state, setState] = useState<GameState>(initialState);

  const addPlayer = useCallback((name: string) => {
    if (!name.trim()) return;
    setState(prev => ({
      ...prev,
      players: [
        ...prev.players,
        {
          id: Date.now().toString(),
          name: name.trim(),
          role: 'civilian',
          hasSeenCard: false,
        }
      ]
    }));
  }, []);

  const removePlayer = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      players: prev.players.filter(p => p.id !== id)
    }));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));
  }, []);

  const setPhase = useCallback((phase: GamePhase) => {
    setState(prev => ({ ...prev, phase }));
  }, []);

  const selectCategory = useCallback((categoryId: string) => {
    setState(prev => ({ ...prev, selectedCategory: categoryId }));
  }, []);

  const startGame = useCallback(() => {
    if (!state.selectedCategory || state.players.length < 3) return;

    // Check for troll mode (20% chance)
    const isTrollRound = state.settings.trollMode && Math.random() < 0.2;
    let trollWord: string | null = null;

    if (isTrollRound) {
      const trollWords = getTrollWords();
      trollWord = trollWords[Math.floor(Math.random() * trollWords.length)];
    }

    // Get secret word pair (for confused role)
    // Use allCategories which already includes both default and edited categories
    const { wordA, wordB } = getRandomWordPair(state.selectedCategory, allCategories);
    const secretWord = wordA;
    const confusedWord = wordB;

    // Assign roles
    const playerCount = state.players.length;
    const imposterCount = Math.min(state.settings.imposterCount, Math.floor(playerCount / 2));
    
    // Create shuffled indices for role assignment
    const shuffledIndices = [...Array(playerCount).keys()].sort(() => Math.random() - 0.5);
    
    // Assign imposters
    const imposterIndices = new Set(shuffledIndices.slice(0, imposterCount));
    
    // Calculate remaining civilian indices (excluding imposters)
    const civilianIndices = shuffledIndices.slice(imposterCount);
    
    // Assign special roles from civilian pool
    let jesterIndex: number | null = null;
    let confusedIndex: number | null = null;
    let accompliceIndex: number | null = null;
    
    if (state.settings.jesterEnabled && civilianIndices.length > 0) {
      jesterIndex = civilianIndices.shift()!;
    }
    
    if (state.settings.confusedEnabled && civilianIndices.length > 0) {
      confusedIndex = civilianIndices.shift()!;
    }

    if (state.settings.accompliceEnabled && civilianIndices.length > 0) {
      accompliceIndex = civilianIndices.shift()!;
    }

    const playersWithRoles = state.players.map((player, index) => {
      let role: PlayerRole = 'civilian';
      
      if (isTrollRound) {
        role = 'imposter'; // In troll round, everyone is "imposter"
      } else if (imposterIndices.has(index)) {
        role = 'imposter';
      } else if (index === jesterIndex) {
        role = 'jester';
      } else if (index === confusedIndex) {
        role = 'confused';
      } else if (index === accompliceIndex) {
        role = 'accomplice';
      }
      
      return {
        ...player,
        role,
        hasSeenCard: false,
      };
    });

    // Get imposter name for accomplice
    const imposterPlayer = playersWithRoles.find(p => p.role === 'imposter');
    const imposterName = imposterPlayer?.name || null;

    // Shuffle player order for passing
    const shuffledPlayers = [...playersWithRoles].sort(() => Math.random() - 0.5);

    setState(prev => ({
      ...prev,
      phase: 'passing',
      players: shuffledPlayers,
      secretWord,
      confusedWord,
      currentPlayerIndex: 0,
      isTrollRound,
      trollWord,
      imposterName,
      votes: {},
    }));
  }, [state.selectedCategory, state.players, state.settings]);

  const markPlayerSeen = useCallback(() => {
    setState(prev => {
      const newPlayers = [...prev.players];
      newPlayers[prev.currentPlayerIndex] = {
        ...newPlayers[prev.currentPlayerIndex],
        hasSeenCard: true,
      };

      const nextIndex = prev.currentPlayerIndex + 1;
      const allSeen = nextIndex >= prev.players.length;

      // Select round starter when all players have seen their cards
      let roundStarter = prev.roundStarter;
      if (allSeen) {
        // Filter eligible starters based on settings
        let eligiblePlayers = newPlayers;
        if (prev.settings.imposterNeverStarts && !prev.isTrollRound) {
          eligiblePlayers = newPlayers.filter(p => p.role !== 'imposter');
        }
        // Pick random starter from eligible players
        const starterPlayer = eligiblePlayers[Math.floor(Math.random() * eligiblePlayers.length)];
        roundStarter = starterPlayer.name;
      }

      return {
        ...prev,
        players: newPlayers,
        currentPlayerIndex: allSeen ? 0 : nextIndex,
        phase: allSeen ? 'starter' : 'passing',
        roundStarter,
      };
    });
  }, []);

  const revealCard = useCallback(() => {
    setState(prev => ({ ...prev, phase: 'reveal' }));
  }, []);

  const hideCard = useCallback(() => {
    setState(prev => ({ ...prev, phase: 'passing' }));
  }, []);

  const goToVoting = useCallback(() => {
    setState(prev => ({ ...prev, phase: 'voting' }));
  }, []);

  const setVotes = useCallback((votes: Record<string, string>) => {
    setState(prev => ({ ...prev, votes }));
  }, []);

  const goToResults = useCallback(() => {
    setState(prev => ({ ...prev, phase: 'results' as GamePhase }));
  }, []);

  const resetGame = useCallback(() => {
    setState(prev => ({
      ...initialState,
      players: prev.players.map(p => ({ ...p, role: 'civilian', hasSeenCard: false })),
      settings: prev.settings,
    }));
  }, []);

  const fullReset = useCallback(() => {
    setState(initialState);
  }, []);

  const currentPlayer = state.players[state.currentPlayerIndex];

  return {
    state,
    currentPlayer,
    addPlayer,
    removePlayer,
    updateSettings,
    setPhase,
    selectCategory,
    startGame,
    markPlayerSeen,
    revealCard,
    hideCard,
    goToVoting,
    setVotes,
    goToResults,
    resetGame,
    fullReset,
  };
};
