import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Trophy, XCircle, HelpCircle, Check, X, RotateCcw, Home, User } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useHaptics } from '@/hooks/useHaptics';

interface Player {
  id: string;
  name: string;
  color: string;
}

interface ArtistResultsProps {
  players: Player[];
  fakePlayer: Player;
  votes: Record<string, string>;
  secretWord: string;
  category: string;
  fakeGuessedCorrectly: boolean | null;
  onFakeGuess: (correct: boolean) => void;
  onPlayAgain: () => void;
  onBackToHub: () => void;
}

export const ArtistResults = ({
  players,
  fakePlayer,
  votes,
  secretWord,
  category,
  fakeGuessedCorrectly,
  onFakeGuess,
  onPlayAgain,
  onBackToHub,
}: ArtistResultsProps) => {
  const [showGuessPhase, setShowGuessPhase] = useState(false);
  const [revealedFake, setRevealedFake] = useState(false);
  const sounds = useSoundEffects();
  const { vibrate } = useHaptics();

  // Count votes for each player
  const voteCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    players.forEach(p => counts[p.id] = 0);
    Object.values(votes).forEach(votedId => {
      if (counts[votedId] !== undefined) {
        counts[votedId]++;
      }
    });
    return counts;
  }, [players, votes]);

  // Find the most voted player
  const mostVotedPlayer = useMemo(() => {
    let maxVotes = 0;
    let mostVoted: Player | null = null;
    
    players.forEach(player => {
      if (voteCounts[player.id] > maxVotes) {
        maxVotes = voteCounts[player.id];
        mostVoted = player;
      }
    });
    
    return mostVoted;
  }, [players, voteCounts]);

  const fakeCaught = mostVotedPlayer?.id === fakePlayer.id;

  // Determine winner
  const artistsWin = useMemo(() => {
    if (!fakeCaught) return false;
    if (fakeGuessedCorrectly === null) return null; // Not yet determined
    return !fakeGuessedCorrectly;
  }, [fakeCaught, fakeGuessedCorrectly]);

  // Trigger confetti and sound when artists win
  useEffect(() => {
    if (artistsWin === true) {
      sounds.playSound('success');
      vibrate('success');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00FFFF', '#FF00FF', '#00FF00', '#FFFF00'],
      });
    } else if (artistsWin === false) {
      sounds.playSound('imposter');
      vibrate('error');
    }
  }, [artistsWin, sounds, vibrate]);

  // Handle guess button clicks
  const handleGuessYes = useCallback(() => {
    sounds.playSound('click');
    vibrate('medium');
    onFakeGuess(true);
  }, [sounds, vibrate, onFakeGuess]);

  const handleGuessNo = useCallback(() => {
    sounds.playSound('click');
    vibrate('medium');
    onFakeGuess(false);
  }, [sounds, vibrate, onFakeGuess]);

  // Handle continue to guess phase
  const handleContinueToGuess = useCallback(() => {
    sounds.playSound('click');
    vibrate('medium');
    setRevealedFake(true);
    setShowGuessPhase(true);
  }, [sounds, vibrate]);

  // Handle play again and back to hub
  const handlePlayAgain = useCallback(() => {
    sounds.playSound('click');
    vibrate('medium');
    onPlayAgain();
  }, [sounds, vibrate, onPlayAgain]);

  const handleBackToHub = useCallback(() => {
    sounds.playSound('click');
    vibrate('medium');
    onBackToHub();
  }, [sounds, vibrate, onBackToHub]);

  // Sorted players by votes
  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => voteCounts[b.id] - voteCounts[a.id]);
  }, [players, voteCounts]);

  const maxVotes = Math.max(...Object.values(voteCounts), 1);

  // If fake was caught and we haven't shown guess phase yet
  if (fakeCaught && !revealedFake) {
    return (
      <motion.div
        className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="glass-card-strong p-8 text-center w-full"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          <motion.div
            className="w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-6"
            style={{
              background: 'linear-gradient(135deg, hsl(320 100% 60%), hsl(270 100% 60%))',
              boxShadow: '0 0 40px hsl(320 100% 60% / 0.5)',
            }}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <XCircle className="w-12 h-12 text-white" />
          </motion.div>

          <h2 className="text-2xl font-black text-gradient-secondary mb-2">
            הצייר המזויף נתפס!
          </h2>

          <div className="flex items-center justify-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-full"
              style={{
                backgroundColor: fakePlayer.color,
                boxShadow: `0 0 15px ${fakePlayer.color}`,
              }}
            />
            <span className="text-xl font-bold">{fakePlayer.name}</span>
          </div>

          <p className="text-muted-foreground mb-6">
            אבל יש לו הזדמנות אחת לנחש את המילה!
          </p>

          <motion.button
            onClick={handleContinueToGuess}
            className="btn-neon-magenta w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            המשך לניחוש
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  // Guess phase
  if (showGuessPhase && fakeGuessedCorrectly === null) {
    return (
      <motion.div
        className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="glass-card-strong p-8 text-center w-full"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          <motion.div
            className="w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-6"
            style={{
              backgroundColor: fakePlayer.color,
              boxShadow: `0 0 40px ${fakePlayer.color}`,
            }}
          >
            <HelpCircle className="w-12 h-12 text-white" />
          </motion.div>

          <h2 className="text-xl font-black mb-4">
            {fakePlayer.name}, מה המילה?
          </h2>

          <div className="glass-card p-4 mb-6">
            <p className="text-sm text-muted-foreground mb-2">הקטגוריה הייתה:</p>
            <p className="text-xl font-bold text-primary">{category}</p>
          </div>

          <p className="text-muted-foreground mb-6">
            האם {fakePlayer.name} ניחש נכון?
          </p>

          <div className="flex gap-3">
            <motion.button
              onClick={handleGuessYes}
              className="flex-1 btn-neon-magenta flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Check className="w-5 h-5" />
              <span>כן!</span>
            </motion.button>
            <motion.button
              onClick={handleGuessNo}
              className="flex-1 btn-neon flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <X className="w-5 h-5" />
              <span>לא</span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Final results
  return (
    <motion.div
      className="flex-1 flex flex-col max-w-lg mx-auto w-full p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Winner Banner */}
      <motion.div
        className="glass-card-strong p-6 text-center mb-4"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <motion.div
          className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4"
          style={{
            background: artistsWin
              ? 'linear-gradient(135deg, hsl(186 100% 50%), hsl(220 100% 60%))'
              : 'linear-gradient(135deg, hsl(320 100% 60%), hsl(270 100% 60%))',
            boxShadow: artistsWin
              ? '0 0 40px hsl(186 100% 50% / 0.5)'
              : '0 0 40px hsl(320 100% 60% / 0.5)',
          }}
        >
          <Trophy className="w-10 h-10 text-white" />
        </motion.div>

        <h2 className={`text-2xl font-black mb-2 ${artistsWin ? 'text-gradient-primary' : 'text-gradient-secondary'}`}>
          {artistsWin ? 'הציירים ניצחו!' : 'הצייר המזויף ניצח!'}
        </h2>

        {!fakeCaught ? (
          <p className="text-muted-foreground">
            הצייר המזויף לא נתפס!
          </p>
        ) : fakeGuessedCorrectly ? (
          <p className="text-muted-foreground">
            {fakePlayer.name} ניחש את המילה נכון!
          </p>
        ) : (
          <p className="text-muted-foreground">
            {fakePlayer.name} לא הצליח לנחש את המילה
          </p>
        )}
      </motion.div>

      {/* Secret Word Reveal */}
      <div className="glass-card p-4 mb-4 text-center">
        <p className="text-sm text-muted-foreground mb-1">המילה הייתה:</p>
        <p className="text-2xl font-black text-primary">{secretWord}</p>
      </div>

      {/* The Fake Artist */}
      <div className="glass-card p-4 mb-4">
        <p className="text-sm text-muted-foreground mb-2 text-center">הצייר המזויף היה:</p>
        <div className="flex items-center justify-center gap-3">
          <div
            className="w-10 h-10 rounded-full"
            style={{
              backgroundColor: fakePlayer.color,
              boxShadow: `0 0 15px ${fakePlayer.color}`,
            }}
          />
          <span className="text-xl font-bold">{fakePlayer.name}</span>
        </div>
      </div>

      {/* Vote Results */}
      <div className="glass-card p-4 mb-4">
        <p className="text-sm text-muted-foreground mb-3 text-center">תוצאות ההצבעה:</p>
        <div className="space-y-2">
          {sortedPlayers.map((player) => (
            <div key={player.id} className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: player.color,
                }}
              >
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium flex-shrink-0 w-20 truncate">{player.name}</span>
              <div className="flex-1 h-6 bg-muted/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: player.color,
                    boxShadow: `0 0 10px ${player.color}`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(voteCounts[player.id] / maxVotes) * 100}%` }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                />
              </div>
              <span className="text-sm font-bold w-6 text-left">{voteCounts[player.id]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-auto">
        <motion.button
          onClick={handlePlayAgain}
          className="flex-1 btn-neon-magenta flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <RotateCcw className="w-5 h-5" />
          <span>משחק חדש</span>
        </motion.button>
        <motion.button
          onClick={handleBackToHub}
          className="flex-1 btn-neon flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Home className="w-5 h-5" />
          <span>תפריט ראשי</span>
        </motion.button>
      </div>
    </motion.div>
  );
};