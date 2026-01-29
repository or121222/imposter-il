import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Vote, ChevronLeft, User } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  color: string;
}

interface ArtistVotingScreenProps {
  players: Player[];
  canvasData: string | null;
  votes: Record<string, string>;
  onVote: (voterId: string, suspectId: string) => void;
  onComplete: () => void;
}

export const ArtistVotingScreen = ({
  players,
  canvasData,
  votes,
  onVote,
  onComplete,
}: ArtistVotingScreenProps) => {
  const [currentVoterIndex, setCurrentVoterIndex] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [selectedSuspect, setSelectedSuspect] = useState<string | null>(null);

  const currentVoter = players[currentVoterIndex];
  const hasVoted = currentVoter && votes[currentVoter.id];

  const handleSelectSuspect = useCallback((suspectId: string) => {
    setSelectedSuspect(suspectId);
  }, []);

  const handleConfirmVote = useCallback(() => {
    if (!selectedSuspect || !currentVoter) return;

    onVote(currentVoter.id, selectedSuspect);

    if (currentVoterIndex < players.length - 1) {
      setCurrentVoterIndex(prev => prev + 1);
      setSelectedSuspect(null);
      setIsRevealing(false);
    } else {
      onComplete();
    }
  }, [selectedSuspect, currentVoter, currentVoterIndex, players.length, onVote, onComplete]);

  const handleShowVoting = useCallback(() => {
    setIsRevealing(true);
  }, []);

  if (!currentVoter) return null;

  // Passing screen before voting
  if (!isRevealing) {
    return (
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full">
        {/* Canvas Preview */}
        {canvasData && (
          <div className="glass-card p-4 mb-4">
            <img 
              src={canvasData} 
              alt="Drawing" 
              className="w-full rounded-xl"
            />
          </div>
        )}

        {/* Passing Card */}
        <motion.div
          className="glass-card-strong p-8 text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <motion.div
            className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4"
            style={{
              backgroundColor: currentVoter.color,
              boxShadow: `0 0 30px ${currentVoter.color}`,
            }}
          >
            <User className="w-10 h-10 text-white" />
          </motion.div>

          <p className="text-sm text-muted-foreground mb-2">
            הצבעה {currentVoterIndex + 1} מתוך {players.length}
          </p>

          <h2 className="text-2xl font-black text-gradient-secondary mb-6">
            {currentVoter.name}
          </h2>

          <p className="text-muted-foreground mb-6">
            העבר את הטלפון ולחץ כשאתה מוכן להצביע
          </p>

          <motion.button
            onClick={handleShowVoting}
            className="btn-neon-magenta w-full flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Vote className="w-5 h-5" />
            <span>הצבע עכשיו</span>
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Voting screen
  return (
    <div className="flex-1 flex flex-col max-w-lg mx-auto w-full">
      {/* Header */}
      <div className="glass-card p-4 mb-4 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: currentVoter.color,
            boxShadow: `0 0 15px ${currentVoter.color}`,
          }}
        >
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-bold">{currentVoter.name}</p>
          <p className="text-xs text-muted-foreground">
            מי לדעתך הצייר המזויף?
          </p>
        </div>
      </div>

      {/* Canvas Preview */}
      {canvasData && (
        <div className="glass-card p-4 mb-4">
          <img 
            src={canvasData} 
            alt="Drawing" 
            className="w-full rounded-xl"
          />
        </div>
      )}

      {/* Suspects List */}
      <div className="flex-1 space-y-2 overflow-y-auto mb-4">
        {players
          .filter(p => p.id !== currentVoter.id)
          .map((player, index) => (
            <motion.button
              key={player.id}
              onClick={() => handleSelectSuspect(player.id)}
              className={`w-full p-4 rounded-xl flex items-center gap-3 transition-all ${
                selectedSuspect === player.id
                  ? 'bg-secondary/20 border-2 border-secondary'
                  : 'glass-card hover:bg-muted/50'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: player.color,
                  boxShadow: selectedSuspect === player.id 
                    ? `0 0 20px ${player.color}` 
                    : undefined,
                }}
              >
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-lg">{player.name}</span>
            </motion.button>
          ))}
      </div>

      {/* Confirm Button */}
      <motion.button
        onClick={handleConfirmVote}
        disabled={!selectedSuspect}
        className={`btn-neon-magenta w-full flex items-center justify-center gap-2 ${
          !selectedSuspect ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        whileHover={selectedSuspect ? { scale: 1.02 } : {}}
        whileTap={selectedSuspect ? { scale: 0.98 } : {}}
      >
        <span>אישור הצבעה</span>
        <ChevronLeft className="w-5 h-5" />
      </motion.button>
    </div>
  );
};