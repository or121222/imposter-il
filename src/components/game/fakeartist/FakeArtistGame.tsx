import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import { PlayerInput } from '../PlayerInput';
import { ScoreBoard } from '../ScoreBoard';
import { DrawingCategorySelector } from './DrawingCategorySelector';
import { ArtistPassingScreen } from './ArtistPassingScreen';
import { ArtistRoleReveal } from './ArtistRoleReveal';
import { DrawingCanvas } from './DrawingCanvas';
import { ArtistVotingScreen } from './ArtistVotingScreen';
import { ArtistResults } from './ArtistResults';
import { GlobalControls, GlobalFooter } from '../GlobalControls';
import { useScoring, PlayerScore } from '@/hooks/useScoring';
import { useSoundEffects, setGlobalSoundEffects } from '@/hooks/useSoundEffects';
import { drawingCategories, getRandomDrawingWord, playerColors } from '@/data/drawingCategories';

type GamePhase = 'setup' | 'category' | 'passing' | 'reveal' | 'drawing' | 'voting' | 'results';

interface Player {
  id: string;
  name: string;
  color: string;
}

interface ArtistRole {
  playerId: string;
  isFake: boolean;
  word: string | null;
  category: string;
}

interface FakeArtistGameProps {
  onBack: () => void;
}

export const FakeArtistGame = ({ onBack }: FakeArtistGameProps) => {
  const [phase, setPhase] = useState<GamePhase>('setup');
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [secretWord, setSecretWord] = useState<string>('');
  const [categoryName, setCategoryName] = useState<string>('');
  const [categoryEmoji, setCategoryEmoji] = useState<string>('');
  const [roles, setRoles] = useState<ArtistRole[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [hasSeenRole, setHasSeenRole] = useState(false);
  const [drawingRound, setDrawingRound] = useState(1);
  const [maxDrawingRounds] = useState(2);
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [fakeGuessedCorrectly, setFakeGuessedCorrectly] = useState<boolean | null>(null);
  const [canvasData, setCanvasData] = useState<string | null>(null);
  const hasSyncedRef = useRef(false);
  
  const soundEffects = useSoundEffects();
  setGlobalSoundEffects(soundEffects);
  
  const {
    playerScores,
    addOrUpdatePlayer,
    togglePlayerActive,
    removePlayer: removePlayerScore,
    resetScores,
    getActivePlayers,
  } = useScoring();

  // Sync active players from localStorage - wait for playerScores to load
  useEffect(() => {
    // Wait for playerScores to load, then sync once
    if (playerScores.length === 0 || hasSyncedRef.current) return;
    
    const activePlayers = playerScores.filter(p => p.isActive);
    if (activePlayers.length === 0) return;
    
    hasSyncedRef.current = true;
    
    // Add all active players to the game at once
    setPlayers(activePlayers.map((player, index) => ({
      id: `artist-player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: player.name,
      color: playerColors[index % playerColors.length],
    })));
  }, [playerScores]);

  // Add player
  const handleAddPlayer = useCallback((name: string) => {
    const colorIndex = players.length % playerColors.length;
    const newPlayer: Player = {
      id: `artist-player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      color: playerColors[colorIndex],
    };
    setPlayers(prev => [...prev, newPlayer]);
    addOrUpdatePlayer(name);
    soundEffects.playSound('click');
  }, [players.length, addOrUpdatePlayer, soundEffects]);

  // Remove player from game
  const removePlayer = useCallback((id: string) => {
    setPlayers(prev => prev.filter(p => p.id !== id));
    soundEffects.playSound('click');
  }, [soundEffects]);

  // Toggle player active (sync with scoring)
  const handleTogglePlayerActive = useCallback((playerId: string) => {
    const player = playerScores.find(p => p.id === playerId);
    if (player) {
      togglePlayerActive(playerId);
      if (player.isActive) {
        // Deactivating - remove from game
        const gamePlayer = players.find(p => p.name.toLowerCase() === player.name.toLowerCase());
        if (gamePlayer) {
          setPlayers(prev => prev.filter(p => p.id !== gamePlayer.id));
        }
      } else {
        // Activating - add to game if not already there
        const alreadyInGame = players.some(p => p.name.toLowerCase() === player.name.toLowerCase());
        if (!alreadyInGame) {
          const colorIndex = players.length % playerColors.length;
          setPlayers(prev => [...prev, {
            id: `artist-player-${Date.now()}`,
            name: player.name,
            color: playerColors[colorIndex],
          }]);
        }
      }
    }
    soundEffects.playSound('click');
  }, [playerScores, togglePlayerActive, players, soundEffects]);

  // Start game with selected category
  const startGame = useCallback(() => {
    if (!selectedCategory || players.length < 3) return;

    const { word, category } = getRandomDrawingWord(selectedCategory);
    if (!word || !category) return;

    setSecretWord(word);
    setCategoryName(category.name);
    setCategoryEmoji(category.emoji);

    // Randomly select the fake artist
    const fakeIndex = Math.floor(Math.random() * players.length);

    // Assign roles
    const newRoles: ArtistRole[] = players.map((player, index) => ({
      playerId: player.id,
      isFake: index === fakeIndex,
      word: index === fakeIndex ? null : word,
      category: category.name,
    }));

    setRoles(newRoles);
    setCurrentPlayerIndex(0);
    setHasSeenRole(false);
    setPhase('passing');
    soundEffects.playSound('click');
  }, [selectedCategory, players, soundEffects]);

  // Handle role reveal
  const handleShowRole = useCallback(() => {
    setHasSeenRole(true);
    const role = roles[currentPlayerIndex];
    soundEffects.playSound(role.isFake ? 'imposter' : 'reveal');
  }, [roles, currentPlayerIndex, soundEffects]);

  // Move to next player or drawing phase
  const handleNextPlayer = useCallback(() => {
    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(prev => prev + 1);
      setHasSeenRole(false);
      setPhase('passing');
    } else {
      // All players have seen their roles, start drawing
      setCurrentPlayerIndex(0);
      setPhase('drawing');
    }
    soundEffects.playSound('click');
  }, [currentPlayerIndex, players.length, soundEffects]);

  // Handle drawing turn complete
  const handleDrawingComplete = useCallback((newCanvasData: string) => {
    setCanvasData(newCanvasData);
    
    const nextPlayerIndex = currentPlayerIndex + 1;
    
    if (nextPlayerIndex >= players.length) {
      // Round complete
      if (drawingRound >= maxDrawingRounds) {
        // All rounds complete, go to voting
        setPhase('voting');
      } else {
        // Start next round
        setDrawingRound(prev => prev + 1);
        setCurrentPlayerIndex(0);
      }
    } else {
      setCurrentPlayerIndex(nextPlayerIndex);
    }
    
    soundEffects.playSound('click');
  }, [currentPlayerIndex, players.length, drawingRound, maxDrawingRounds, soundEffects]);

  // Handle voting
  const handleVote = useCallback((voterId: string, suspectId: string) => {
    setVotes(prev => ({ ...prev, [voterId]: suspectId }));
    soundEffects.playSound('tick');
  }, [soundEffects]);

  // Handle voting complete
  const handleVotingComplete = useCallback(() => {
    setPhase('results');
    soundEffects.playSound('success');
  }, [soundEffects]);

  // Handle fake's guess result
  const handleFakeGuess = useCallback((correct: boolean) => {
    setFakeGuessedCorrectly(correct);
    soundEffects.playSound(correct ? 'imposter' : 'success');
  }, [soundEffects]);

  // Reset game
  const resetGame = useCallback(() => {
    setPhase('setup');
    setSelectedCategory(null);
    setSecretWord('');
    setCategoryName('');
    setCategoryEmoji('');
    setRoles([]);
    setCurrentPlayerIndex(0);
    setHasSeenRole(false);
    setDrawingRound(1);
    setVotes({});
    setFakeGuessedCorrectly(null);
    setCanvasData(null);
    soundEffects.playSound('click');
  }, [soundEffects]);

  const currentPlayer = players[currentPlayerIndex];
  const currentRole = roles[currentPlayerIndex];
  const fakePlayer = players.find(p => roles.find(r => r.playerId === p.id && r.isFake));

  return (
    <div className="min-h-screen p-4 flex flex-col pb-12">
      <div className="bg-glow" />

      {/* Global controls */}
      <GlobalControls showHelp={true} />

      <AnimatePresence mode="wait">
        {/* Setup Phase */}
        {phase === 'setup' && (
          <motion.div
            key="setup"
            className="flex-1 flex flex-col max-w-lg mx-auto w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -100 }}
          >
            {/* Back button */}
            <button
              onClick={onBack}
              className="self-start mb-4 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
              <span>חזרה</span>
            </button>

            <div className="py-4 text-center">
              <h1 className="text-3xl font-black text-gradient-secondary mb-2">הצייר המזויף</h1>
              <p className="text-muted-foreground text-sm">מי מצייר בלי לדעת מה?</p>
            </div>

            <div className="flex-1 space-y-4">
              {/* Score Board */}
              <ScoreBoard
                playerScores={playerScores}
                onResetScores={resetScores}
              />

              <PlayerInput
                players={players}
                allPlayers={playerScores}
                onAddPlayer={handleAddPlayer}
                onRemovePlayer={removePlayer}
                onTogglePlayer={handleTogglePlayerActive}
                onDeletePlayer={removePlayerScore}
              />

              <motion.button
                onClick={() => setPhase('category')}
                disabled={players.length < 3}
                className={`btn-neon-magenta w-full flex items-center justify-center gap-2 ${
                  players.length < 3 ? 'opacity-50 cursor-not-allowed' : 'pulse-glow'
                }`}
                whileHover={players.length >= 3 ? { scale: 1.02 } : {}}
                whileTap={players.length >= 3 ? { scale: 0.98 } : {}}
              >
                <span>המשך לבחירת קטגוריה</span>
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Category Selection */}
        {phase === 'category' && (
          <motion.div
            key="category"
            className="flex-1 flex flex-col max-w-lg mx-auto w-full"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <DrawingCategorySelector
              categories={drawingCategories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onBack={() => setPhase('setup')}
              onStart={startGame}
            />
          </motion.div>
        )}

        {/* Passing Screen */}
        {phase === 'passing' && currentPlayer && (
          <motion.div
            key={`passing-${currentPlayerIndex}`}
            className="flex-1 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ArtistPassingScreen
              playerName={currentPlayer.name}
              playerIndex={currentPlayerIndex + 1}
              totalPlayers={players.length}
              onReady={() => setPhase('reveal')}
            />
          </motion.div>
        )}

        {/* Role Reveal */}
        {phase === 'reveal' && currentPlayer && currentRole && (
          <motion.div
            key={`reveal-${currentPlayerIndex}`}
            className="flex-1 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ArtistRoleReveal
              playerName={currentPlayer.name}
              playerColor={currentPlayer.color}
              isFake={currentRole.isFake}
              word={currentRole.word}
              category={categoryName}
              categoryEmoji={categoryEmoji}
              hasSeenRole={hasSeenRole}
              onShowRole={handleShowRole}
              onNext={handleNextPlayer}
              isLastPlayer={currentPlayerIndex === players.length - 1}
            />
          </motion.div>
        )}

        {/* Drawing Phase */}
        {phase === 'drawing' && currentPlayer && (
          <motion.div
            key="drawing"
            className="flex-1 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DrawingCanvas
              currentPlayer={currentPlayer}
              round={drawingRound}
              maxRounds={maxDrawingRounds}
              playerIndex={currentPlayerIndex}
              totalPlayers={players.length}
              canvasData={canvasData}
              onComplete={handleDrawingComplete}
            />
          </motion.div>
        )}

        {/* Voting Phase */}
        {phase === 'voting' && (
          <motion.div
            key="voting"
            className="flex-1 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ArtistVotingScreen
              players={players}
              canvasData={canvasData}
              votes={votes}
              onVote={handleVote}
              onComplete={handleVotingComplete}
            />
          </motion.div>
        )}

        {/* Results Phase */}
        {phase === 'results' && fakePlayer && (
          <motion.div
            key="results"
            className="flex-1 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ArtistResults
              players={players}
              fakePlayer={fakePlayer}
              votes={votes}
              secretWord={secretWord}
              category={categoryName}
              fakeGuessedCorrectly={fakeGuessedCorrectly}
              onFakeGuess={handleFakeGuess}
              onPlayAgain={resetGame}
              onBackToHub={onBack}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global footer */}
      <GlobalFooter />
    </div>
  );
};

export default FakeArtistGame;
