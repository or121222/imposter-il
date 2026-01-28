import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Vote, ChevronLeft, BarChart3, Trophy, SkipForward } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Player } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';

interface VotingScreenProps {
  players: Player[];
  onComplete: (votes: Record<string, string>) => void;
  onSkip: () => void;
}

export const VotingScreen = ({ players, onComplete, onSkip }: VotingScreenProps) => {
  const [currentVoterIndex, setCurrentVoterIndex] = useState(0);
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [showPassing, setShowPassing] = useState(true);
  const [selectedSuspect, setSelectedSuspect] = useState<string | null>(null);
  const sounds = useSoundEffects();

  const currentVoter = players[currentVoterIndex];
  const otherPlayers = players.filter(p => p.id !== currentVoter.id);

  const handleReveal = () => {
    sounds.playSound('click');
    setShowPassing(false);
  };

  const handleSelectSuspect = (playerId: string) => {
    sounds.playSound('tick');
    setSelectedSuspect(playerId);
  };

  const handleVote = () => {
    if (!selectedSuspect) return;
    sounds.playSound('click');

    const newVotes = { ...votes, [currentVoter.id]: selectedSuspect };
    setVotes(newVotes);
    
    if (currentVoterIndex < players.length - 1) {
      setCurrentVoterIndex(currentVoterIndex + 1);
      setShowPassing(true);
      setSelectedSuspect(null);
    } else {
      onComplete(newVotes);
    }
  };

  const handleSkip = () => {
    sounds.playSound('click');
    onSkip();
  };

  if (showPassing) {
    return (
      <motion.div
        className="min-h-screen flex flex-col items-center justify-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="glass-card-strong p-8 max-w-sm w-full text-center space-y-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <motion.div
            className="mx-auto w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center"
            animate={{ 
              boxShadow: [
                '0 0 20px hsl(var(--primary) / 0.3)',
                '0 0 40px hsl(var(--primary) / 0.5)',
                '0 0 20px hsl(var(--primary) / 0.3)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Vote className="w-10 h-10 text-primary" />
          </motion.div>

          <div>
            <h2 className="text-2xl font-black mb-2">תור להצביע!</h2>
            <p className="text-muted-foreground">
              העבירו את הטלפון ל:
            </p>
            <p className="text-3xl font-black text-gradient-primary mt-2">
              {currentVoter.name}
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            שחקן {currentVoterIndex + 1} מתוך {players.length}
          </p>

          <motion.button
            onClick={handleReveal}
            className="btn-neon w-full flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>אני {currentVoter.name}</span>
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen flex flex-col p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="glass-card p-6 mb-6 text-center">
        <h2 className="text-xl font-bold mb-1">{currentVoter.name}</h2>
        <p className="text-muted-foreground">מי לדעתך המתחזה?</p>
      </div>

      <div className="flex-1 space-y-3 mb-6">
        {otherPlayers.map((player, index) => (
          <motion.button
            key={player.id}
            onClick={() => handleSelectSuspect(player.id)}
            className={`w-full p-4 rounded-xl flex items-center gap-3 transition-all ${
              selectedSuspect === player.id
                ? 'bg-secondary/30 border-2 border-secondary'
                : 'glass-card hover:bg-muted/40'
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center">
              {index + 1}
            </span>
            <span className="font-medium text-lg">{player.name}</span>
            {selectedSuspect === player.id && (
              <span className="mr-auto text-secondary">🎯</span>
            )}
          </motion.button>
        ))}
      </div>

      <div className="space-y-3">
        <motion.button
          onClick={handleVote}
          disabled={!selectedSuspect}
          className={`btn-neon-magenta w-full flex items-center justify-center gap-2 ${
            !selectedSuspect ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          whileHover={selectedSuspect ? { scale: 1.02 } : {}}
          whileTap={selectedSuspect ? { scale: 0.98 } : {}}
        >
          <Vote className="w-5 h-5" />
          <span>אישור הצבעה</span>
        </motion.button>

        <motion.button
          onClick={handleSkip}
          className="glass-card w-full py-3 rounded-xl flex items-center justify-center gap-2 text-muted-foreground hover:bg-muted/40"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <SkipForward className="w-5 h-5" />
          <span>דלג על ההצבעה</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

interface VotingResultsProps {
  players: Player[];
  votes: Record<string, string>;
  onRevealRoles: () => void;
}

export const VotingResults = ({ players, votes, onRevealRoles }: VotingResultsProps) => {
  const sounds = useSoundEffects();
  
  // Count votes for each player
  const voteCounts: Record<string, number> = {};
  players.forEach(p => { voteCounts[p.id] = 0; });
  Object.values(votes).forEach(votedId => {
    if (voteCounts[votedId] !== undefined) {
      voteCounts[votedId]++;
    }
  });

  // Sort players by vote count
  const sortedPlayers = [...players].sort((a, b) => voteCounts[b.id] - voteCounts[a.id]);
  const maxVotes = Math.max(...Object.values(voteCounts));
  const eliminated = sortedPlayers.find(p => voteCounts[p.id] === maxVotes);

  // Check if imposter was caught
  const imposterCaught = eliminated && (eliminated.role === 'imposter' || eliminated.role === 'accomplice');

  // Fire confetti and play success sound if imposter was caught
  useEffect(() => {
    if (imposterCaught) {
      sounds.playSound('success');
      
      // Fire multiple confetti bursts
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#00f5ff', '#ff00aa', '#ffff00'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#00f5ff', '#ff00aa', '#ffff00'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      // Initial big burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f5ff', '#ff00aa', '#ffff00', '#00ff00'],
      });

      frame();
    }
  }, [imposterCaught, sounds]);

  const handleRevealRoles = () => {
    sounds.playSound('click');
    onRevealRoles();
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="glass-card p-6 mb-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BarChart3 className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold">תוצאות ההצבעה</h2>
        </div>
        <p className="text-muted-foreground">מי קיבל הכי הרבה קולות?</p>
      </div>

      {/* Vote bars */}
      <div className="flex-1 space-y-4 mb-6">
        {sortedPlayers.map((player, index) => {
          const count = voteCounts[player.id];
          const percentage = maxVotes > 0 ? (count / maxVotes) * 100 : 0;
          const isEliminated = player.id === eliminated?.id && count > 0;

          return (
            <motion.div
              key={player.id}
              className={`glass-card p-4 rounded-xl ${
                isEliminated ? 'border-2 border-secondary' : ''
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{player.name}</span>
                <span className={`font-bold ${isEliminated ? 'text-secondary' : 'text-primary'}`}>
                  {count} {count === 1 ? 'קול' : 'קולות'}
                </span>
              </div>
              <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${isEliminated ? 'bg-secondary' : 'bg-primary'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Eliminated player */}
      {eliminated && voteCounts[eliminated.id] > 0 && (
        <motion.div
          className={`glass-card-strong p-6 mb-6 text-center border-2 ${
            imposterCaught ? 'border-green-500' : 'border-secondary'
          }`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className={`w-6 h-6 ${imposterCaught ? 'text-green-500' : 'text-secondary'}`} />
            <span className={`text-lg font-bold ${imposterCaught ? 'text-green-500' : 'text-secondary'}`}>
              {imposterCaught ? '🎉 המתחזה נתפס!' : 'המודח:'}
            </span>
          </div>
          <p className={`text-2xl font-black ${imposterCaught ? 'text-green-500' : 'text-gradient-secondary'}`}>
            {eliminated.name}
          </p>
          {imposterCaught && (
            <p className="text-sm text-muted-foreground mt-2">האזרחים ניצחו! 🏆</p>
          )}
        </motion.div>
      )}

      <motion.button
        onClick={handleRevealRoles}
        className="btn-neon w-full flex items-center justify-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span>חשוף תפקידים</span>
        <ChevronLeft className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );
};
