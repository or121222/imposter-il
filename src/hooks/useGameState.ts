import { useState, useCallback } from 'react';
import { getRandomWord, getTrollWords } from '@/data/gameCategories';

export type GamePhase = 'setup' | 'category' | 'passing' | 'reveal' | 'playing' | 'voting';

export interface Player {
  id: string;
  name: string;
  isImposter: boolean;
  hasSeenCard: boolean;
}

export interface GameSettings {
  imposterCount: number;
  timerEnabled: boolean;
  timerDuration: number; // in minutes
  imposterHint: boolean;
  trollMode: boolean;
}

export interface GameState {
  phase: GamePhase;
  players: Player[];
  settings: GameSettings;
  selectedCategory: string | null;
  secretWord: string;
  currentPlayerIndex: number;
  isTrollRound: boolean;
  trollWord: string | null;
}

const defaultSettings: GameSettings = {
  imposterCount: 1,
  timerEnabled: true,
  timerDuration: 5,
  imposterHint: true,
  trollMode: false,
};

const initialState: GameState = {
  phase: 'setup',
  players: [],
  settings: defaultSettings,
  selectedCategory: null,
  secretWord: '',
  currentPlayerIndex: 0,
  isTrollRound: false,
  trollWord: null,
};

export const useGameState = () => {
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
          isImposter: false,
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

    // Check for troll mode (10% chance)
    const isTrollRound = state.settings.trollMode && Math.random() < 0.1;
    let trollWord: string | null = null;

    if (isTrollRound) {
      const trollWords = getTrollWords();
      trollWord = trollWords[Math.floor(Math.random() * trollWords.length)];
    }

    // Get secret word
    const secretWord = getRandomWord(state.selectedCategory);

    // Assign imposters randomly
    const playerCount = state.players.length;
    const imposterCount = Math.min(state.settings.imposterCount, Math.floor(playerCount / 2));
    
    const shuffledIndices = [...Array(playerCount).keys()].sort(() => Math.random() - 0.5);
    const imposterIndices = new Set(shuffledIndices.slice(0, imposterCount));

    const playersWithRoles = state.players.map((player, index) => ({
      ...player,
      isImposter: isTrollRound ? true : imposterIndices.has(index), // In troll round, everyone is "imposter"
      hasSeenCard: false,
    }));

    // Shuffle player order for passing
    const shuffledPlayers = [...playersWithRoles].sort(() => Math.random() - 0.5);

    setState(prev => ({
      ...prev,
      phase: 'passing',
      players: shuffledPlayers,
      secretWord,
      currentPlayerIndex: 0,
      isTrollRound,
      trollWord,
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

      return {
        ...prev,
        players: newPlayers,
        currentPlayerIndex: allSeen ? 0 : nextIndex,
        phase: allSeen ? 'playing' : 'passing',
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

  const resetGame = useCallback(() => {
    setState(prev => ({
      ...initialState,
      players: prev.players.map(p => ({ ...p, isImposter: false, hasSeenCard: false })),
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
    resetGame,
    fullReset,
  };
};
