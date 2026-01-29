import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Settings, Users, Play, Bomb, HelpCircle } from 'lucide-react';
import { GlobalControls, GlobalFooter } from '../GlobalControls';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useBombCategories } from '@/hooks/useBombCategories';
import { useBombSound } from '@/hooks/useBombSound';
import { BombCategory } from '@/data/bombCategories';
import { BombCategoryEditor } from './BombCategoryEditor';
import { BombButton } from './BombButton';
import { BombExplosion } from './BombExplosion';

type GamePhase = 'setup' | 'category' | 'playing' | 'exploded';

interface BombGameProps {
  onBack: () => void;
}

export const BombGame = ({ onBack }: BombGameProps) => {
  // State
  const [phase, setPhase] = useState<GamePhase>('setup');
  const [players, setPlayers] = useState<string[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<BombCategory | null>(null);
  const [currentWord, setCurrentWord] = useState('');
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [showCategoryEditor, setShowCategoryEditor] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  
  // Hooks
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    resetCategory,
    resetAll,
    isEdited,
    isCustom,
  } = useBombCategories();
  
  const { playSound, startTicking, stopTicking, stopAllSounds, deactivate } = useBombSound();
  
  // Refs
  const timerRef = useRef<number | null>(null);

  // Load players from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('bomb_players');
    if (saved) {
      try {
        setPlayers(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load bomb players:', e);
      }
    }
  }, []);

  // Save players to localStorage
  useEffect(() => {
    localStorage.setItem('bomb_players', JSON.stringify(players));
  }, [players]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllSounds();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [stopAllSounds]);

  // Timer logic
  useEffect(() => {
    if (phase === 'playing' && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Explosion!
            clearInterval(timerRef.current!);
            stopTicking();
            playSound('explosion');
            setPhase('exploded');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [phase, playSound, stopTicking]);

  // Update ticking based on time remaining
  useEffect(() => {
    if (phase === 'playing' && timeLeft > 0 && totalTime > 0) {
      const intensity = 1 - (timeLeft / totalTime);
      startTicking(1 + intensity * 9);
    } else {
      stopTicking();
    }
  }, [phase, timeLeft, totalTime, startTicking, stopTicking]);

  // Add player
  const handleAddPlayer = useCallback(() => {
    const name = newPlayerName.trim();
    if (name && !players.includes(name)) {
      setPlayers(prev => [...prev, name]);
      setNewPlayerName('');
    }
  }, [newPlayerName, players]);

  // Remove player
  const handleRemovePlayer = useCallback((name: string) => {
    setPlayers(prev => prev.filter(p => p !== name));
  }, []);

  // Start game with category
  const startGame = useCallback((category: BombCategory) => {
    setSelectedCategory(category);
    setUsedWords([]);
    setCurrentPlayerIndex(0);
    
    // Random time between 10-60 seconds
    const time = Math.floor(Math.random() * 51) + 10;
    setTotalTime(time);
    setTimeLeft(time);
    
    // Pick random word
    const availableWords = category.words.filter(w => !usedWords.includes(w));
    if (availableWords.length > 0) {
      const word = availableWords[Math.floor(Math.random() * availableWords.length)];
      setCurrentWord(word);
      setUsedWords(prev => [...prev, word]);
    } else {
      setCurrentWord(category.name);
    }
    
    setPhase('playing');
  }, [usedWords]);

  // Pass the bomb
  const passBomb = useCallback(() => {
    if (!selectedCategory) return;
    
    playSound('click');
    
    // Next player
    setCurrentPlayerIndex(prev => (prev + 1) % Math.max(1, players.length));
    
    // New word
    const availableWords = selectedCategory.words.filter(w => !usedWords.includes(w));
    if (availableWords.length > 0) {
      const word = availableWords[Math.floor(Math.random() * availableWords.length)];
      setCurrentWord(word);
      setUsedWords(prev => [...prev, word]);
    }
  }, [selectedCategory, players.length, usedWords, playSound]);

  // Continue after explosion
  const handleContinue = useCallback(() => {
    setPhase('category');
  }, []);

  // Handle back
  const handleBack = useCallback(() => {
    deactivate();
    onBack();
  }, [deactivate, onBack]);

  // Calculate intensity for visuals
  const intensity = totalTime > 0 ? 1 - (timeLeft / totalTime) : 0;

  // Render setup phase
  if (phase === 'setup') {
    return (
      <div className="min-h-screen p-4 flex flex-col pb-16">
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, hsl(15 100% 15% / 0.3) 0%, transparent 70%)',
          }}
        />
        
        <GlobalControls showHelp={false} />
        
        <div className="flex-1 flex flex-col max-w-lg mx-auto w-full">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={handleBack}
              className="p-2 glass-card rounded-xl hover:bg-muted/40 transition-colors"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, hsl(30 100% 50%), hsl(15 100% 50%))',
                }}
              >
                <Bomb className="w-6 h-6 text-white" />
              </div>
              <h1 
                className="text-2xl font-black"
                style={{ color: 'hsl(30 100% 60%)' }}
              >
                הפצצה 💣
              </h1>
            </div>
            <button
              onClick={() => setShowHelp(true)}
              className="mr-auto p-2 glass-card rounded-xl hover:bg-muted/40 transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>

          {/* Players section */}
          <div 
            className="glass-card p-4 mb-4"
            style={{ borderColor: 'hsl(30 100% 50% / 0.2)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5" style={{ color: 'hsl(30 100% 60%)' }} />
              <h2 className="font-bold">שחקנים (אופציונלי)</h2>
            </div>
            
            <div className="flex gap-2 mb-3">
              <Input
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="הוסף שחקן..."
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddPlayer();
                }}
              />
              <Button
                onClick={handleAddPlayer}
                style={{
                  background: 'linear-gradient(135deg, hsl(30 100% 50%), hsl(15 100% 50%))',
                }}
              >
                הוסף
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {players.map((player) => (
                <motion.div
                  key={player}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm"
                  style={{
                    background: 'hsl(30 80% 50% / 0.2)',
                    border: '1px solid hsl(30 80% 50% / 0.3)',
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <span>{player}</span>
                  <button
                    onClick={() => handleRemovePlayer(player)}
                    className="hover:text-destructive transition-colors"
                  >
                    ×
                  </button>
                </motion.div>
              ))}
              {players.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  אפשר לשחק גם בלי שמות 😉
                </p>
              )}
            </div>
          </div>

          {/* Category editor button */}
          <Button
            variant="outline"
            onClick={() => setShowCategoryEditor(true)}
            className="mb-4"
          >
            <Settings className="w-4 h-4 ml-2" />
            ערוך קטגוריות
          </Button>

          {/* Start button */}
          <motion.button
            onClick={() => setPhase('category')}
            className="w-full py-4 rounded-xl font-bold text-lg"
            style={{
              background: 'linear-gradient(135deg, hsl(30 100% 50%), hsl(15 100% 50%))',
              boxShadow: '0 0 30px hsl(30 100% 50% / 0.4)',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play className="w-5 h-5 inline ml-2" />
            בחר קטגוריה והתחל
          </motion.button>
        </div>

        <BombCategoryEditor
          isOpen={showCategoryEditor}
          onClose={() => setShowCategoryEditor(false)}
          categories={categories}
          onAddCategory={addCategory}
          onUpdateCategory={updateCategory}
          onDeleteCategory={deleteCategory}
          onResetCategory={resetCategory}
          onResetAll={resetAll}
          isEdited={isEdited}
          isCustom={isCustom}
        />

        {/* Help Modal */}
        <AnimatePresence>
          {showHelp && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHelp(false)}
            >
              <motion.div
                className="glass-card-strong p-6 max-w-md w-full"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: 'linear-gradient(135deg, hsl(0 70% 8% / 0.95), hsl(20 70% 6% / 0.95))',
                  borderColor: 'hsl(30 100% 50% / 0.3)',
                }}
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Bomb className="w-8 h-8" style={{ color: 'hsl(30 100% 60%)' }} />
                  <h2 className="text-xl font-black" style={{ color: 'hsl(30 100% 60%)' }}>
                    איך משחקים?
                  </h2>
                </div>
                <p className="text-center text-foreground/90 leading-relaxed">
                  העבירו את הטלפון מאחד לשני. ענו על השאלה ולחצו על הכפתור לפני שהפצצה מתפוצצת! המפסיד שותה. 🍺
                </p>
                <Button
                  onClick={() => setShowHelp(false)}
                  className="w-full mt-6"
                  style={{
                    background: 'linear-gradient(135deg, hsl(30 100% 50%), hsl(15 100% 50%))',
                  }}
                >
                  הבנתי! 💣
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <GlobalFooter />
      </div>
    );
  }

  // Render category selection
  if (phase === 'category') {
    return (
      <div className="min-h-screen p-4 flex flex-col pb-16">
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, hsl(15 100% 15% / 0.3) 0%, transparent 70%)',
          }}
        />
        
        <GlobalControls showHelp={false} />
        
        <div className="flex-1 flex flex-col max-w-lg mx-auto w-full">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setPhase('setup')}
              className="p-2 glass-card rounded-xl hover:bg-muted/40 transition-colors"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
            <h1 
              className="text-xl font-black"
              style={{ color: 'hsl(30 100% 60%)' }}
            >
              בחר קטגוריה 💣
            </h1>
          </div>

          {/* Categories grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category, index) => (
                <motion.button
                  key={category.id}
                  onClick={() => startGame(category)}
                  className="p-4 rounded-xl text-center transition-all"
                  style={{
                    background: 'hsl(0 50% 15% / 0.5)',
                    border: '1px solid hsl(30 100% 50% / 0.2)',
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ 
                    scale: 1.02,
                    borderColor: 'hsl(30 100% 50% / 0.5)',
                    boxShadow: '0 0 20px hsl(30 100% 50% / 0.3)',
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-3xl block mb-2">{category.emoji}</span>
                  <span className="font-semibold text-sm">{category.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
        
        <GlobalFooter />
      </div>
    );
  }

  // Render playing phase
  if (phase === 'playing') {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center p-4"
        style={{
          background: `linear-gradient(180deg, 
            hsl(${10 - intensity * 10} ${50 + intensity * 30}% ${8 - intensity * 4}%) 0%, 
            hsl(0 ${40 + intensity * 40}% ${4 - intensity * 2}%) 100%
          )`,
        }}
      >
        {/* Back button */}
        <button
          onClick={() => {
            stopAllSounds();
            setPhase('setup');
          }}
          className="absolute top-4 right-4 p-2 glass-card rounded-xl hover:bg-muted/40 transition-colors z-10"
        >
          <ArrowRight className="w-6 h-6" />
        </button>

        {/* Current player */}
        {players.length > 0 && (
          <motion.div
            className="mb-6 text-center"
            key={currentPlayerIndex}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm text-white/60 mb-1">תור של</p>
            <p 
              className="text-2xl font-black"
              style={{ color: 'hsl(45 100% 70%)' }}
            >
              {players[currentPlayerIndex]}
            </p>
          </motion.div>
        )}

        {/* Prompt/Word */}
        <motion.div
          className="mb-8 text-center"
          key={currentWord}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <p className="text-sm text-white/60 mb-2">{selectedCategory?.emoji} {selectedCategory?.name}</p>
          <p 
            className="text-3xl sm:text-4xl font-black"
            style={{ 
              color: 'hsl(30 100% 70%)',
              textShadow: `0 0 20px hsl(30 100% 50% / ${0.3 + intensity * 0.5})`,
            }}
          >
            {currentWord}
          </p>
        </motion.div>

        {/* Bomb Button */}
        <BombButton
          onPress={passBomb}
          intensity={intensity}
        />

        {/* Danger indicator at high intensity */}
        {intensity > 0.7 && (
          <motion.p
            className="mt-6 text-xl font-bold"
            style={{ color: 'hsl(0 100% 60%)' }}
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          >
            ⚠️ זהירות! ⚠️
          </motion.p>
        )}
      </div>
    );
  }

  // Render explosion
  return (
    <BombExplosion
      isExploded={phase === 'exploded'}
      currentPlayer={players.length > 0 ? players[currentPlayerIndex] : undefined}
      onContinue={handleContinue}
    />
  );
};

export default BombGame;
