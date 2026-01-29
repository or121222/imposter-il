import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Settings, Users, Play, Bomb, HelpCircle, Zap } from 'lucide-react';
import { GlobalControls, GlobalFooter } from '../GlobalControls';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useBombCategories } from '@/hooks/useBombCategories';
import { useGameAudio } from '@/hooks/useGameAudio';
import { useBombPunishments } from '@/hooks/useBombPunishments';
import { useGlitchMode } from '@/hooks/useGlitchMode';
import { BombCategory } from '@/data/bombCategories';
import { BombCategoryEditor } from './BombCategoryEditor';
import { BombButton } from './BombButton';
import { BombExplosion } from './BombExplosion';
import { PunishmentEditor } from './PunishmentEditor';
import { PunishmentRoulette } from './PunishmentRoulette';
import { GlitchEffects } from './GlitchEffects';

type GamePhase = 'setup' | 'category' | 'playing' | 'exploded' | 'punishment';

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
  const [showPunishmentEditor, setShowPunishmentEditor] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [glitchModeEnabled, setGlitchModeEnabled] = useState(false);
  
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
  
  // Unified audio engine
  const { 
    initialize: initAudio,
    playSound, 
    startTicking, 
    stopTicking, 
    startDrone,
    updateDroneIntensity,
    stopDrone,
    stopAllSounds, 
    deactivate 
  } = useGameAudio();
  
  const {
    punishments,
    addPunishment,
    updatePunishment,
    deletePunishment,
    resetToDefaults: resetPunishments,
  } = useBombPunishments();

  const handleFakeExplosion = useCallback(() => {
    playSound('explosion');
  }, [playSound]);

  const {
    glitchState,
    checkGlitchOnPress,
    startPeriodicGlitches,
    stopPeriodicGlitches,
    clearGlitch,
  } = useGlitchMode({
    enabled: glitchModeEnabled,
    onFakeExplosion: handleFakeExplosion,
  });
  
  // Refs
  const timerRef = useRef<number | null>(null);

  // Load players and settings from localStorage
  useEffect(() => {
    const savedPlayers = localStorage.getItem('bomb_players');
    if (savedPlayers) {
      try {
        setPlayers(JSON.parse(savedPlayers));
      } catch (e) {
        console.error('Failed to load bomb players:', e);
      }
    }
    
    const savedGlitchMode = localStorage.getItem('bomb_glitch_mode');
    if (savedGlitchMode === 'true') {
      setGlitchModeEnabled(true);
    }
  }, []);

  // Save players to localStorage
  useEffect(() => {
    localStorage.setItem('bomb_players', JSON.stringify(players));
  }, [players]);

  // Save glitch mode setting
  useEffect(() => {
    localStorage.setItem('bomb_glitch_mode', String(glitchModeEnabled));
  }, [glitchModeEnabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllSounds();
      stopPeriodicGlitches();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [stopAllSounds, stopPeriodicGlitches]);

  // Timer logic
  useEffect(() => {
    if (phase === 'playing' && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Explosion!
            clearInterval(timerRef.current!);
            stopTicking();
            stopDrone();
            stopPeriodicGlitches();
            clearGlitch();
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
  }, [phase, playSound, stopTicking, stopDrone, stopPeriodicGlitches, clearGlitch]);

  // Update ticking and drone based on time remaining
  useEffect(() => {
    if (phase === 'playing' && timeLeft > 0 && totalTime > 0) {
      const intensity = 1 - (timeLeft / totalTime);
      startTicking(1 + intensity * 9);
      updateDroneIntensity(intensity);
    } else {
      stopTicking();
    }
  }, [phase, timeLeft, totalTime, startTicking, stopTicking, updateDroneIntensity]);

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
  const startGame = useCallback(async (category: BombCategory) => {
    // Initialize audio on user interaction (bypasses autoplay policy)
    await initAudio();
    
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
    
    // Start audio after user interaction
    startDrone();
    
    // Start periodic glitches if enabled
    if (glitchModeEnabled) {
      startPeriodicGlitches();
    }
    
    setPhase('playing');
  }, [usedWords, initAudio, startDrone, glitchModeEnabled, startPeriodicGlitches]);

  // Pass the bomb
  const passBomb = useCallback(() => {
    if (!selectedCategory) return;
    
    // Check for glitch event
    if (checkGlitchOnPress()) {
      return; // Glitch happened, don't pass
    }
    
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
  }, [selectedCategory, players.length, usedWords, playSound, checkGlitchOnPress]);

  // Continue after explosion - show punishment
  const handleExplosionComplete = useCallback(() => {
    setPhase('punishment');
  }, []);

  // Continue after punishment
  const handlePunishmentComplete = useCallback(() => {
    setPhase('category');
  }, []);

  // Handle back
  const handleBack = useCallback(() => {
    deactivate();
    stopPeriodicGlitches();
    clearGlitch();
    onBack();
  }, [deactivate, stopPeriodicGlitches, clearGlitch, onBack]);

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

          {/* Glitch Mode Toggle */}
          <div 
            className="glass-card p-4 mb-4 flex items-center justify-between"
            style={{ borderColor: 'hsl(280 100% 50% / 0.2)' }}
          >
            <div className="flex items-center gap-3">
              <Zap 
                className="w-5 h-5" 
                style={{ color: glitchModeEnabled ? 'hsl(280 100% 70%)' : 'hsl(280 50% 50%)' }} 
              />
              <div>
                <Label htmlFor="glitch-mode" className="font-bold cursor-pointer">
                  מצב קצר חשמלי ⚡
                </Label>
                <p className="text-xs text-muted-foreground">
                  הפתעות אקראיות במהלך המשחק
                </p>
              </div>
            </div>
            <Switch
              id="glitch-mode"
              checked={glitchModeEnabled}
              onCheckedChange={setGlitchModeEnabled}
            />
          </div>

          {/* Editor buttons */}
          <div className="flex gap-2 mb-4">
            <Button
              variant="outline"
              onClick={() => setShowCategoryEditor(true)}
              className="flex-1"
            >
              <Settings className="w-4 h-4 ml-2" />
              ערוך קטגוריות
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowPunishmentEditor(true)}
              className="flex-1"
            >
              🎰 ערוך עונשים
            </Button>
          </div>

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

        <PunishmentEditor
          isOpen={showPunishmentEditor}
          onClose={() => setShowPunishmentEditor(false)}
          punishments={punishments}
          onAddPunishment={addPunishment}
          onUpdatePunishment={updatePunishment}
          onDeletePunishment={deletePunishment}
          onResetToDefaults={resetPunishments}
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
                  העבירו את הטלפון מאחד לשני. ענו על השאלה ולחצו על הכפתור לפני שהפצצה מתפוצצת! המפסיד מקבל עונש מהגלגל 🎰
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
        className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
        style={{
          background: `linear-gradient(180deg, 
            hsl(${10 - intensity * 10} ${50 + intensity * 30}% ${8 - intensity * 4}%) 0%, 
            hsl(0 ${40 + intensity * 40}% ${4 - intensity * 2}%) 100%
          )`,
        }}
      >
        {/* Glitch Effects */}
        <GlitchEffects activeGlitch={glitchState.active} />

        {/* Back button */}
        <button
          onClick={() => {
            stopAllSounds();
            stopPeriodicGlitches();
            clearGlitch();
            setPhase('setup');
          }}
          className="absolute top-4 right-4 p-2 glass-card rounded-xl hover:bg-muted/40 transition-colors z-10"
        >
          <ArrowRight className="w-6 h-6" />
        </button>

        {/* Glitch mode indicator */}
        {glitchModeEnabled && (
          <motion.div
            className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
            style={{
              background: 'hsl(280 80% 50% / 0.2)',
              border: '1px solid hsl(280 80% 50% / 0.3)',
            }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Zap className="w-3 h-3" style={{ color: 'hsl(280 100% 70%)' }} />
            <span style={{ color: 'hsl(280 100% 70%)' }}>קצר חשמלי</span>
          </motion.div>
        )}

        {/* Current player */}
        {players.length > 0 && (
          <motion.div
            className="mb-6 text-center"
            key={currentPlayerIndex}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ transform: glitchState.active === 'reverse' ? 'scaleY(-1)' : undefined }}
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
          style={{ transform: glitchState.active === 'reverse' ? 'scaleY(-1)' : undefined }}
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
          flipped={glitchState.active === 'reverse'}
          position={glitchState.dodgePosition}
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
  if (phase === 'exploded') {
    return (
      <BombExplosion
        isExploded={true}
        currentPlayer={players.length > 0 ? players[currentPlayerIndex] : undefined}
        onContinue={handleExplosionComplete}
      />
    );
  }

  // Render punishment roulette
  if (phase === 'punishment') {
    return (
      <PunishmentRoulette
        isOpen={true}
        punishments={punishments}
        currentPlayer={players.length > 0 ? players[currentPlayerIndex] : undefined}
        onComplete={handlePunishmentComplete}
      />
    );
  }

  return null;
};

export default BombGame;
