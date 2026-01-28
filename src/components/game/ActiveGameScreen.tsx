import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Users, Vote, RotateCcw, Skull, Trophy, AlertTriangle, UserPlus } from 'lucide-react';
import type { Player } from '@/hooks/useGameState';

interface ActiveGameScreenProps {
  players: Player[];
  timerEnabled: boolean;
  timerDuration: number; // in minutes
  isTrollRound: boolean;
  secretWord: string;
  confusedWord: string;
  onVote: () => void;
  onNewRound: () => void;
  onSkipToReveal: () => void;
  showResults: boolean;
}

export const ActiveGameScreen = ({
  players,
  timerEnabled,
  timerDuration,
  isTrollRound,
  secretWord,
  confusedWord,
  onVote,
  onNewRound,
  onSkipToReveal,
  showResults: initialShowResults,
}: ActiveGameScreenProps) => {
  const [timeLeft, setTimeLeft] = useState(timerDuration * 60);
  const [showResults, setShowResults] = useState(initialShowResults);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  useEffect(() => {
    if (!timerEnabled || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerEnabled, timeLeft]);

  useEffect(() => {
    setShowResults(initialShowResults);
  }, [initialShowResults]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const imposters = players.filter(p => p.role === 'imposter');
  const jesters = players.filter(p => p.role === 'jester');
  const confused = players.filter(p => p.role === 'confused');
  const accomplices = players.filter(p => p.role === 'accomplice');

  const handleRevealResults = () => {
    setShowResults(true);
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Timer */}
      {timerEnabled && !showResults && (
        <motion.div
          className="glass-card p-6 text-center mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Timer className="w-5 h-5 text-primary" />
            <span className="text-muted-foreground">זמן נותר</span>
          </div>
          <div className={`timer-display ${timeLeft < 30 ? 'animate-pulse' : ''}`}>
            {formatTime(timeLeft)}
          </div>
          {timeLeft === 0 && (
            <motion.p
              className="text-destructive font-bold mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              הזמן נגמר! הצביעו עכשיו!
            </motion.p>
          )}
        </motion.div>
      )}

      {/* Troll mode alert */}
      {isTrollRound && showResults && (
        <motion.div
          className="glass-card p-6 text-center mb-6 border-2 border-secondary"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <AlertTriangle className="w-6 h-6 text-secondary" />
            <span className="text-xl font-bold text-secondary">מצב טרול הופעל!</span>
          </div>
          <p className="text-muted-foreground">
            בהצלחה לכולם... כולכם קיבלתם מילים מוזרות! 🤪
          </p>
        </motion.div>
      )}

      {/* Players list */}
      <div className="glass-card p-4 mb-6 flex-1">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-primary" />
          <span className="font-bold">שחקנים</span>
          <span className="text-muted-foreground text-sm">({players.length})</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {players.map((player, index) => (
            <motion.div
              key={player.id}
              className={`p-3 rounded-xl flex items-center gap-2 transition-colors ${
                showResults && (player.role === 'imposter' || player.role === 'accomplice')
                  ? 'bg-secondary/20 border-2 border-secondary'
                  : showResults && player.role === 'jester'
                  ? 'bg-amber-500/20 border-2 border-amber-500'
                  : showResults && player.role === 'confused'
                  ? 'bg-primary/20 border-2 border-primary'
                  : selectedPlayer === player.id
                  ? 'bg-primary/20 border-2 border-primary'
                  : 'bg-muted/30 border border-transparent'
              } ${!showResults ? 'cursor-pointer hover:bg-muted/50' : ''}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => !showResults && setSelectedPlayer(player.id)}
            >
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                {index + 1}
              </span>
              <span className="text-sm font-medium truncate">{player.name}</span>
              {showResults && player.role === 'imposter' && (
                <Skull className="w-4 h-4 text-secondary mr-auto" />
              )}
              {showResults && player.role === 'accomplice' && (
                <UserPlus className="w-4 h-4 text-secondary mr-auto" />
              )}
              {showResults && player.role === 'jester' && (
                <span className="text-amber-500 mr-auto">🃏</span>
              )}
              {showResults && player.role === 'confused' && (
                <span className="text-primary mr-auto">😵</span>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            className="glass-card-strong p-6 mb-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Trophy className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold">תוצאות הסיבוב</h3>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
                <p className="text-sm text-muted-foreground mb-1">המילה הסודית הייתה:</p>
                <p className="text-2xl font-black text-gradient-primary">{secretWord}</p>
              </div>

              {confusedWord && confusedWord !== secretWord && confused.length > 0 && (
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
                  <p className="text-sm text-muted-foreground mb-1">המילה של המבולבל הייתה:</p>
                  <p className="text-xl font-black text-purple-500">{confusedWord}</p>
                </div>
              )}

              <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/30">
                <p className="text-sm text-muted-foreground mb-2">
                  {imposters.length > 1 ? 'המתחזים היו:' : 'המתחזה היה/הייתה:'}
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {imposters.map(imp => (
                    <span
                      key={imp.id}
                      className="px-3 py-1 rounded-full bg-secondary/20 text-secondary font-bold"
                    >
                      {imp.name}
                    </span>
                  ))}
                </div>
              </div>

              {accomplices.length > 0 && (
                <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/30">
                  <p className="text-sm text-muted-foreground mb-2">הסייען היה:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {accomplices.map(a => (
                      <span
                        key={a.id}
                        className="px-3 py-1 rounded-full bg-secondary/20 text-secondary font-bold"
                      >
                        {a.name} 🤝
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {jesters.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <p className="text-sm text-muted-foreground mb-2">הג'וקר היה:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {jesters.map(j => (
                      <span
                        key={j.id}
                        className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 font-bold"
                      >
                        {j.name} 🃏
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {confused.length > 0 && (
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
                  <p className="text-sm text-muted-foreground mb-2">המבולבל היה:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {confused.map(c => (
                      <span
                        key={c.id}
                        className="px-3 py-1 rounded-full bg-primary/20 text-primary font-bold"
                      >
                        {c.name} 😵
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action buttons */}
      <div className="space-y-3">
        {!showResults ? (
          <>
            <motion.button
              onClick={onVote}
              className="btn-neon-magenta w-full flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Vote className="w-5 h-5" />
              <span>הצבעה</span>
            </motion.button>
            <motion.button
              onClick={handleRevealResults}
              className="glass-card w-full py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-muted/40"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>דלג וחשוף תפקידים</span>
            </motion.button>
          </>
        ) : (
          <motion.button
            onClick={onNewRound}
            className="btn-neon w-full flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RotateCcw className="w-5 h-5" />
            <span>סיבוב חדש</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};
