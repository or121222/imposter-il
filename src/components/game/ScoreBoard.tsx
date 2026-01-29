import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RotateCcw, ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { PlayerScore } from '@/hooks/useScoring';

interface ScoreBoardProps {
  playerScores: PlayerScore[];
  onResetScores: () => void;
}

export const ScoreBoard = ({
  playerScores,
  onResetScores,
}: ScoreBoardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Sort by wins (descending)
  const sortedPlayers = [...playerScores].sort((a, b) => b.wins - a.wins);

  if (playerScores.length === 0) return null;

  return (
    <div className="glass-card p-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          <span className="font-bold">טבלת ניקוד</span>
          <span className="text-xs text-muted-foreground">
            ({playerScores.length} שחקנים)
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-2">
              {sortedPlayers.map((player, index) => (
                <motion.div
                  key={player.id}
                  className="p-3 rounded-xl flex items-center gap-3 bg-primary/10 border border-primary/30"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 && player.wins > 0
                      ? 'bg-amber-500/30 text-amber-500'
                      : index === 1 && player.wins > 0
                      ? 'bg-gray-400/30 text-gray-400'
                      : index === 2 && player.wins > 0
                      ? 'bg-amber-700/30 text-amber-700'
                      : 'bg-primary/20 text-primary'
                  }`}>
                    {index + 1}
                  </span>
                  
                  <span className="flex-1 font-medium truncate">{player.name}</span>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-green-500">{player.wins}W</span>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-destructive">{player.losses}L</span>
                  </div>
                </motion.div>
              ))}

              {/* Reset button */}
              <div className="pt-2">
                {showResetConfirm ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="flex-1 py-2 rounded-lg glass-card text-sm"
                    >
                      ביטול
                    </button>
                    <button
                      onClick={() => {
                        onResetScores();
                        setShowResetConfirm(false);
                      }}
                      className="flex-1 py-2 rounded-lg bg-destructive/20 text-destructive text-sm font-medium"
                    >
                      אפס הכל
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="w-full py-2 rounded-lg glass-card flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>אפס ניקוד</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
