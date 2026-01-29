import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Users, Trash2 } from 'lucide-react';
import type { PlayerScore } from '@/hooks/useScoring';

interface PlayerInputProps {
  players: { id: string; name: string }[];
  allPlayers: PlayerScore[];
  onAddPlayer: (name: string) => void;
  onRemovePlayer: (id: string) => void;
  onTogglePlayer: (playerId: string) => void;
  onDeletePlayer: (playerId: string) => void;
}

export const PlayerInput = ({ 
  players, 
  allPlayers,
  onAddPlayer, 
  onRemovePlayer,
  onTogglePlayer,
  onDeletePlayer,
}: PlayerInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAddPlayer(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  // Sort players: active first, then inactive
  const sortedAllPlayers = [...allPlayers].sort((a, b) => {
    if (a.isActive === b.isActive) return 0;
    return a.isActive ? -1 : 1;
  });

  const activeCount = allPlayers.filter(p => p.isActive).length;

  return (
    <div className="glass-card p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Users className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-lg">שחקנים</h3>
          <p className="text-sm text-muted-foreground">
            {activeCount} פעילים • מינימום 3
          </p>
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="הוסף שחקן..."
          className="input-glass flex-1"
          autoComplete="off"
        />
        <motion.button
          type="submit"
          className="btn-neon px-4 py-3 rounded-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!inputValue.trim()}
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </form>

      {/* Player list */}
      <div className="space-y-2 min-h-[48px]">
        <p className="text-xs text-muted-foreground text-center">
          לחץ על שם כדי להפעיל/לכבות שחקן מהמשחק
        </p>
        
        <AnimatePresence mode="popLayout">
          {sortedAllPlayers.map((player) => (
            <motion.div
              key={player.id}
              className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                player.isActive
                  ? 'bg-primary/10 border border-primary/30'
                  : 'bg-muted/20 border border-transparent opacity-60'
              }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: player.isActive ? 1 : 0.6, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              layout
              onClick={() => onTogglePlayer(player.id)}
            >
              <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold ${
                player.isActive 
                  ? 'bg-primary/20 text-primary' 
                  : 'bg-muted/30 text-muted-foreground'
              }`}>
                {player.isActive ? '✓' : '✕'}
              </span>
              
              <span className={`flex-1 text-base font-medium ${
                !player.isActive ? 'text-muted-foreground line-through' : ''
              }`}>
                {player.name}
              </span>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeletePlayer(player.id);
                }}
                className="p-2 rounded-full hover:bg-destructive/20 opacity-50 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {allPlayers.length === 0 && (
          <p className="text-muted-foreground text-sm py-2 text-center">
            אין שחקנים עדיין. הוסיפו לפחות 3 שחקנים כדי להתחיל!
          </p>
        )}
      </div>
    </div>
  );
};
