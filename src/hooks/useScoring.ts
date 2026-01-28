import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'imposter-player-scores';

export interface PlayerScore {
  id: string;
  name: string;
  wins: number;
  losses: number;
  gamesPlayed: number;
  isActive: boolean;
}

export const useScoring = () => {
  const [playerScores, setPlayerScores] = useState<PlayerScore[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setPlayerScores(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to load player scores:', error);
    }
  }, []);

  // Save to localStorage whenever scores change
  const saveToStorage = useCallback((scores: PlayerScore[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
    } catch (error) {
      console.error('Failed to save player scores:', error);
    }
  }, []);

  const addOrUpdatePlayer = useCallback((name: string) => {
    setPlayerScores(prev => {
      const existing = prev.find(p => p.name.toLowerCase() === name.toLowerCase());
      let updated: PlayerScore[];
      
      if (existing) {
        // Update existing player - set active
        updated = prev.map(p => 
          p.id === existing.id 
            ? { ...p, isActive: true }
            : p
        );
      } else {
        // Add new player
        const newPlayer: PlayerScore = {
          id: `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name,
          wins: 0,
          losses: 0,
          gamesPlayed: 0,
          isActive: true,
        };
        updated = [...prev, newPlayer];
      }
      
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const togglePlayerActive = useCallback((playerId: string) => {
    setPlayerScores(prev => {
      const updated = prev.map(p =>
        p.id === playerId ? { ...p, isActive: !p.isActive } : p
      );
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const recordWin = useCallback((playerName: string) => {
    setPlayerScores(prev => {
      const updated = prev.map(p =>
        p.name.toLowerCase() === playerName.toLowerCase()
          ? { ...p, wins: p.wins + 1, gamesPlayed: p.gamesPlayed + 1 }
          : p
      );
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const recordLoss = useCallback((playerName: string) => {
    setPlayerScores(prev => {
      const updated = prev.map(p =>
        p.name.toLowerCase() === playerName.toLowerCase()
          ? { ...p, losses: p.losses + 1, gamesPlayed: p.gamesPlayed + 1 }
          : p
      );
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const recordGameForAll = useCallback((activePlayerNames: string[]) => {
    setPlayerScores(prev => {
      const updated = prev.map(p => {
        if (activePlayerNames.some(name => name.toLowerCase() === p.name.toLowerCase())) {
          return { ...p, gamesPlayed: p.gamesPlayed + 1 };
        }
        return p;
      });
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const removePlayer = useCallback((playerId: string) => {
    setPlayerScores(prev => {
      const updated = prev.filter(p => p.id !== playerId);
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const resetScores = useCallback(() => {
    setPlayerScores(prev => {
      const updated = prev.map(p => ({
        ...p,
        wins: 0,
        losses: 0,
        gamesPlayed: 0,
      }));
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const getActivePlayers = useCallback(() => {
    return playerScores.filter(p => p.isActive);
  }, [playerScores]);

  const setAllInactive = useCallback(() => {
    setPlayerScores(prev => {
      const updated = prev.map(p => ({ ...p, isActive: false }));
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  return {
    playerScores,
    addOrUpdatePlayer,
    togglePlayerActive,
    recordWin,
    recordLoss,
    recordGameForAll,
    removePlayer,
    resetScores,
    getActivePlayers,
    setAllInactive,
  };
};
