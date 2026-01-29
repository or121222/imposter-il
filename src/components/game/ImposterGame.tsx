import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronLeft } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useCustomCategories } from '@/hooks/useCustomCategories';
import { useScoring } from '@/hooks/useScoring';
import { useSoundEffects, setGlobalSoundEffects } from '@/hooks/useSoundEffects';
import { useHaptics } from '@/hooks/useHaptics';
import { GameLogo } from '@/components/game/GameLogo';
import { PlayerInput } from '@/components/game/PlayerInput';
import { SettingsPanel } from '@/components/game/SettingsPanel';
import { CategorySelector } from '@/components/game/CategorySelector';
import { PassingScreen } from '@/components/game/PassingScreen';
import { CardReveal } from '@/components/game/CardReveal';
import { ActiveGameScreen } from '@/components/game/ActiveGameScreen';
import { RoundStarterScreen } from '@/components/game/RoundStarterScreen';
import { VotingScreen, VotingResults } from '@/components/game/VotingScreen';
import { ScoreBoard } from '@/components/game/ScoreBoard';
import { GlobalControls, GlobalFooter } from '@/components/game/GlobalControls';

interface ImposterGameProps {
  onBack?: () => void;
}

const ImposterGame = ({ onBack }: ImposterGameProps = {}) => {
  const { customCategories, addCategory, updateCategory, removeCategory } = useCustomCategories();
  const {
    playerScores,
    addOrUpdatePlayer,
    togglePlayerActive,
    recordWin,
    recordLoss,
    removePlayer: removePlayerScore,
    resetScores,
    getActivePlayers,
  } = useScoring();
  
  const {
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
    setVotes,
    resetGame,
  } = useGameState(customCategories);

  const soundEffects = useSoundEffects();
  const { vibrate } = useHaptics();
  const [showVotingResults, setShowVotingResults] = useState(false);
  const hasSyncedRef = useRef(false);

  // Set global sound instance for other components
  useEffect(() => {
    setGlobalSoundEffects(soundEffects);
  }, [soundEffects]);

  // Sync active players from localStorage - wait for playerScores to load
  useEffect(() => {
    // Wait for playerScores to load, then sync once
    if (playerScores.length === 0 || hasSyncedRef.current) return;
    
    const activePlayers = playerScores.filter(p => p.isActive);
    if (activePlayers.length === 0) return;
    
    hasSyncedRef.current = true;
    
    // Add all active players to the game
    activePlayers.forEach(player => {
      addPlayer(player.name);
    });
  }, [playerScores, addPlayer]);

  // Add players to scoring system when they are added
  const handleAddPlayer = (name: string) => {
    addPlayer(name);
    addOrUpdatePlayer(name);
  };

  // Handle toggling player active/inactive - sync with game players
  const handleTogglePlayerActive = (playerId: string) => {
    const player = playerScores.find(p => p.id === playerId);
    if (!player) return;
    
    togglePlayerActive(playerId);
    
    // If player is currently active (will be deactivated), remove from game
    if (player.isActive) {
      const gamePlayer = state.players.find(p => p.name.toLowerCase() === player.name.toLowerCase());
      if (gamePlayer) {
        removePlayer(gamePlayer.id);
      }
    } else {
      // If player is currently inactive (will be activated), add to game
      const alreadyInGame = state.players.some(p => p.name.toLowerCase() === player.name.toLowerCase());
      if (!alreadyInGame) {
        addPlayer(player.name);
      }
    }
  };

  // Delete player entirely (from both game and scoring)
  const handleDeletePlayer = (playerId: string) => {
    const player = playerScores.find(p => p.id === playerId);
    if (player) {
      // Remove from game state
      const gamePlayer = state.players.find(p => p.name.toLowerCase() === player.name.toLowerCase());
      if (gamePlayer) {
        removePlayer(gamePlayer.id);
      }
      // Remove from scoring
      removePlayerScore(playerId);
      soundEffects.playSound('click');
    }
  };

  const handleStartGame = () => {
    soundEffects.playSound('success');
    vibrate('success');
    startGame();
  };

  const handleRevealCard = () => {
    if (currentPlayer?.role === 'imposter') {
      soundEffects.playSound('imposter');
      vibrate('heavy');
    } else if (currentPlayer?.role === 'accomplice') {
      soundEffects.playSound('imposter');
      vibrate('heavy');
    } else {
      soundEffects.playSound('reveal');
      vibrate('medium');
    }
    revealCard();
  };

  const handleMarkSeen = () => {
    vibrate('light');
    markPlayerSeen();
  };

  const handleStartRound = () => {
    vibrate('success');
    setPhase('playing');
  };

  const handleGoToVoting = () => {
    vibrate('medium');
    setPhase('voting');
  };

  const handleVotingComplete = (votes: Record<string, string>) => {
    setVotes(votes);
    setShowVotingResults(true);
  };

  const handleSkipVoting = () => {
    setPhase('results');
  };

  const handleRevealRoles = () => {
    setShowVotingResults(false);
    setPhase('results');
  };

  const handleNewRound = () => {
    setShowVotingResults(false);
    resetGame();
  };

  const canStart = state.players.length >= 3 && state.selectedCategory;
  const maxImposters = Math.floor(state.players.length / 2) || 1;

  return (
    <div className="min-h-screen relative overflow-hidden pb-12">
      {/* Background glow effect */}
      <div className="bg-glow" />

      {/* Global controls */}
      <GlobalControls showHelp={true} />

      <AnimatePresence mode="wait">
        {/* Setup Phase */}
        {state.phase === 'setup' && (
          <motion.div
            key="setup"
            className="relative z-10 min-h-screen flex flex-col p-4 sm:p-6 max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -100 }}
          >
            {/* Back button */}
            {onBack && (
              <button
                onClick={onBack}
                className="self-start mb-4 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="w-5 h-5 rotate-180" />
                <span>חזרה</span>
              </button>
            )}

            <div className={onBack ? 'py-4' : 'py-8'}>
              <GameLogo size="md" />
            </div>

            <div className="flex-1 space-y-4">
              {/* Score Board */}
              <ScoreBoard
                playerScores={playerScores}
                onResetScores={resetScores}
              />

              <PlayerInput
                players={state.players}
                allPlayers={playerScores}
                onAddPlayer={handleAddPlayer}
                onRemovePlayer={removePlayer}
                onTogglePlayer={handleTogglePlayerActive}
                onDeletePlayer={handleDeletePlayer}
              />

              <SettingsPanel
                settings={state.settings}
                onUpdateSettings={updateSettings}
                maxImposters={maxImposters}
              />

              <motion.button
                onClick={() => setPhase('category')}
                disabled={state.players.length < 3}
                className={`btn-neon w-full flex items-center justify-center gap-2 ${
                  state.players.length < 3 ? 'opacity-50 cursor-not-allowed' : 'pulse-glow'
                }`}
                whileHover={state.players.length >= 3 ? { scale: 1.02 } : {}}
                whileTap={state.players.length >= 3 ? { scale: 0.98 } : {}}
              >
                <span>המשך לבחירת קטגוריה</span>
                <ChevronLeft className="w-5 h-5" />
              </motion.button>

              {state.players.length < 3 && (
                <p className="text-center text-sm text-muted-foreground">
                  הוסיפו עוד {3 - state.players.length} שחקנים כדי להתחיל
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Category Selection Phase */}
        {state.phase === 'category' && (
          <motion.div
            key="category"
            className="relative z-10 min-h-screen flex flex-col p-4 sm:p-6 max-w-2xl mx-auto"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <div className="py-6">
              <GameLogo size="sm" />
            </div>

            <div className="flex-1 space-y-4">
              <CategorySelector
                selectedCategory={state.selectedCategory}
                onSelectCategory={selectCategory}
                customCategories={customCategories}
                onAddCategory={addCategory}
                onUpdateCategory={updateCategory}
                onRemoveCategory={removeCategory}
              />

              <div className="flex gap-3">
                <motion.button
                  onClick={() => setPhase('setup')}
                  className="glass-card px-4 py-3 rounded-xl flex items-center gap-2 hover:bg-muted/40 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ChevronLeft className="w-5 h-5 rotate-180" />
                  <span>חזרה</span>
                </motion.button>

                <motion.button
                  onClick={handleStartGame}
                  disabled={!canStart}
                  className={`btn-neon flex-1 flex items-center justify-center gap-2 ${
                    !canStart ? 'opacity-50 cursor-not-allowed' : 'pulse-glow'
                  }`}
                  whileHover={canStart ? { scale: 1.02 } : {}}
                  whileTap={canStart ? { scale: 0.98 } : {}}
                >
                  <Play className="w-5 h-5" />
                  <span>התחל משחק!</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Passing Phase */}
        {state.phase === 'passing' && currentPlayer && (
          <motion.div
            key={`passing-${currentPlayer.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PassingScreen
              player={currentPlayer}
              onReveal={handleRevealCard}
            />
          </motion.div>
        )}

        {/* Reveal Phase */}
        {state.phase === 'reveal' && currentPlayer && (
          <motion.div
            key={`reveal-${currentPlayer.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CardReveal
              player={currentPlayer}
              secretWord={state.secretWord}
              confusedWord={state.confusedWord}
              categoryId={state.selectedCategory}
              showHint={state.settings.imposterHint}
              isTrollRound={state.isTrollRound}
              trollWord={state.trollWord}
              imposterName={state.imposterName}
              onHide={handleMarkSeen}
              customCategories={customCategories}
            />
          </motion.div>
        )}

        {/* Round Starter Phase */}
        {state.phase === 'starter' && state.roundStarter && (
          <motion.div
            key="starter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <RoundStarterScreen
              starterName={state.roundStarter}
              onStart={handleStartRound}
            />
          </motion.div>
        )}

        {/* Active Game Phase */}
        {state.phase === 'playing' && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ActiveGameScreen
              players={state.players}
              timerEnabled={state.settings.timerEnabled}
              timerDuration={state.settings.timerDuration}
              isTrollRound={state.isTrollRound}
              secretWord={state.secretWord}
              confusedWord={state.confusedWord}
              onVote={handleGoToVoting}
              onNewRound={handleNewRound}
              onSkipToReveal={handleSkipVoting}
              showResults={false}
            />
          </motion.div>
        )}

        {/* Voting Phase */}
        {state.phase === 'voting' && !showVotingResults && (
          <motion.div
            key="voting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <VotingScreen
              players={state.players}
              onComplete={handleVotingComplete}
              onSkip={handleSkipVoting}
            />
          </motion.div>
        )}

        {/* Voting Results */}
        {state.phase === 'voting' && showVotingResults && (
          <motion.div
            key="voting-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <VotingResults
              players={state.players}
              votes={state.votes}
              onRevealRoles={handleRevealRoles}
            />
          </motion.div>
        )}

        {/* Results Phase */}
        {state.phase === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ActiveGameScreen
              players={state.players}
              timerEnabled={false}
              timerDuration={0}
              isTrollRound={state.isTrollRound}
              secretWord={state.secretWord}
              confusedWord={state.confusedWord}
              onVote={() => {}}
              onNewRound={handleNewRound}
              onSkipToReveal={() => {}}
              showResults={true}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global footer */}
      <GlobalFooter />
    </div>
  );
};

export default ImposterGame;
