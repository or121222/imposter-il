import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Users } from 'lucide-react';

interface PlayerInputProps {
  players: { id: string; name: string }[];
  onAddPlayer: (name: string) => void;
  onRemovePlayer: (id: string) => void;
}

export const PlayerInput = ({ players, onAddPlayer, onRemovePlayer }: PlayerInputProps) => {
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
            {players.length} שחקנים • מינימום 3
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

      {/* Player chips */}
      <div className="flex flex-wrap gap-2 min-h-[48px]">
        <AnimatePresence mode="popLayout">
          {players.map((player, index) => (
            <motion.div
              key={player.id}
              className="player-chip group"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              layout
            >
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">
                {index + 1}
              </span>
              <span className="text-foreground">{player.name}</span>
              <button
                onClick={() => onRemovePlayer(player.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/20 rounded-full"
              >
                <X className="w-3 h-3 text-destructive" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {players.length === 0 && (
          <p className="text-muted-foreground text-sm py-2">
            אין שחקנים עדיין. הוסיפו לפחות 3 שחקנים כדי להתחיל!
          </p>
        )}
      </div>
    </div>
  );
};
