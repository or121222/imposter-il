import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronLeft } from 'lucide-react';
import { useGameState } from '@/hooks/useGameState';
import { GameLogo } from '@/components/game/GameLogo';
import { PlayerInput } from '@/components/game/PlayerInput';
import { SettingsPanel } from '@/components/game/SettingsPanel';
import { CategorySelector } from '@/components/game/CategorySelector';
import { HelpModal } from '@/components/game/HelpModal';
import { PassingScreen } from '@/components/game/PassingScreen';
import { CardReveal } from '@/components/game/CardReveal';
import { ActiveGameScreen } from '@/components/game/ActiveGameScreen';

const ImposterGame = () => {
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
    resetGame,
  } = useGameState();

  const canStart = state.players.length >= 3 && state.selectedCategory;
  const maxImposters = Math.floor(state.players.length / 2) || 1;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background glow effect */}
      <div className="bg-glow" />

      {/* Help modal */}
      <HelpModal />

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
            <div className="py-8">
              <GameLogo size="md" />
            </div>

            <div className="flex-1 space-y-4">
              <PlayerInput
                players={state.players}
                onAddPlayer={addPlayer}
                onRemovePlayer={removePlayer}
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
                  onClick={startGame}
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
              onReveal={revealCard}
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
              onHide={markPlayerSeen}
            />
          </motion.div>
        )}

        {/* Active Game Phase */}
        {(state.phase === 'playing' || state.phase === 'voting') && (
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
              onVote={() => setPhase('voting')}
              onNewRound={resetGame}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImposterGame;
