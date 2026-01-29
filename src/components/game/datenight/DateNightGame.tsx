import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Heart, Users, Settings, Play, HelpCircle, Check, X, RotateCcw, Sparkles, Share2, Volume2, VolumeX } from 'lucide-react';
import { GlobalControls, GlobalFooter } from '../GlobalControls';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDateNightQuestions } from '@/hooks/useDateNightQuestions';
import { useGameAudio } from '@/hooks/useGameAudio';
import { DATE_NIGHT_CATEGORIES, DateNightQuestion, getScoreMessage } from '@/data/dateNightQuestions';
import { DateNightQuestionEditor } from './DateNightQuestionEditor';
import confetti from 'canvas-confetti';

type GamePhase = 'setup' | 'mode' | 'playing' | 'results';
type GameMode = 'light' | 'medium' | 'deep' | 'crazy';

interface DateNightGameProps {
  onBack: () => void;
}

export const DateNightGame = ({ onBack }: DateNightGameProps) => {
  // State
  const [phase, setPhase] = useState<GamePhase>('setup');
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gameQuestions, setGameQuestions] = useState<DateNightQuestion[]>([]);
  const [matches, setMatches] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [showQuestionEditor, setShowQuestionEditor] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [allQuestionsPool, setAllQuestionsPool] = useState<DateNightQuestion[]>([]);

  // Audio refs for background music
  const audioContextRef = useRef<AudioContext | null>(null);
  const musicOscillatorsRef = useRef<OscillatorNode[]>([]);
  const musicGainRef = useRef<GainNode | null>(null);

  // Hooks
  const {
    questions,
    getQuestionsByCategory,
    getAllQuestions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    resetAllQuestions,
    isEdited,
    isCustom,
  } = useDateNightQuestions();

  const { initialize: initAudio, playSound } = useGameAudio();

  // Load saved player names
  useEffect(() => {
    const saved1 = localStorage.getItem('datenight_player1');
    const saved2 = localStorage.getItem('datenight_player2');
    if (saved1) setPlayer1(saved1);
    if (saved2) setPlayer2(saved2);
  }, []);

  // Save player names
  useEffect(() => {
    if (player1) localStorage.setItem('datenight_player1', player1);
    if (player2) localStorage.setItem('datenight_player2', player2);
  }, [player1, player2]);

  // Background music player
  const startBackgroundMusic = useCallback(() => {
    if (!musicEnabled) return;
    
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = ctx;
      
      // Create a master gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.08, ctx.currentTime);
      masterGain.connect(ctx.destination);
      musicGainRef.current = masterGain;
      
      // Romantic chord progression (Cmaj7 - Am7 - Fmaj7 - G7)
      const chordProgression = [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [220.00, 261.63, 329.63, 392.00], // Am7
        [174.61, 220.00, 261.63, 329.63], // Fmaj7
        [196.00, 246.94, 293.66, 349.23], // G7
      ];
      
      let currentChord = 0;
      
      const playChord = () => {
        // Stop previous oscillators
        musicOscillatorsRef.current.forEach(osc => {
          try { osc.stop(); } catch (e) {}
        });
        musicOscillatorsRef.current = [];
        
        if (!audioContextRef.current || audioContextRef.current.state === 'closed') return;
        
        const chord = chordProgression[currentChord % chordProgression.length];
        
        chord.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.type = i === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          
          // Gentle fade in/out
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.15 / chord.length, ctx.currentTime + 0.3);
          gain.gain.linearRampToValueAtTime(0.08 / chord.length, ctx.currentTime + 2.5);
          gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 3);
          
          osc.connect(gain);
          gain.connect(masterGain);
          
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 3);
          
          musicOscillatorsRef.current.push(osc);
        });
        
        currentChord++;
      };
      
      // Play first chord immediately
      playChord();
      
      // Continue playing chords
      const intervalId = setInterval(playChord, 3000);
      
      // Store interval to clear later
      (audioContextRef.current as any)._intervalId = intervalId;
    } catch (e) {
      console.warn('Failed to start background music:', e);
    }
  }, [musicEnabled]);

  const stopBackgroundMusic = useCallback(() => {
    musicOscillatorsRef.current.forEach(osc => {
      try { osc.stop(); } catch (e) {}
    });
    musicOscillatorsRef.current = [];
    
    if (audioContextRef.current) {
      const intervalId = (audioContextRef.current as any)._intervalId;
      if (intervalId) clearInterval(intervalId);
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopBackgroundMusic();
    };
  }, [stopBackgroundMusic]);

  // Toggle music
  const toggleMusic = useCallback(() => {
    if (musicEnabled) {
      stopBackgroundMusic();
    } else if (phase === 'playing') {
      startBackgroundMusic();
    }
    setMusicEnabled(!musicEnabled);
  }, [musicEnabled, phase, startBackgroundMusic, stopBackgroundMusic]);

  // Start game with selected mode
  const startGame = useCallback(async (mode: GameMode) => {
    await initAudio();
    setGameMode(mode);

    // Get questions based on mode
    let selectedQuestions: DateNightQuestion[];
    let fullPool: DateNightQuestion[];
    
    if (mode === 'crazy') {
      // Mix of all categories
      fullPool = [...getAllQuestions()].sort(() => Math.random() - 0.5);
    } else {
      fullPool = [...getQuestionsByCategory(mode)].sort(() => Math.random() - 0.5);
    }
    
    selectedQuestions = fullPool.slice(0, 10);
    setAllQuestionsPool(fullPool);
    
    setGameQuestions(selectedQuestions);
    setCurrentQuestionIndex(0);
    setMatches(0);
    setTotalAnswered(0);
    setPhase('playing');
    
    // Start background music
    if (musicEnabled) {
      startBackgroundMusic();
    }
  }, [initAudio, getAllQuestions, getQuestionsByCategory, musicEnabled, startBackgroundMusic]);

  // Continue game with more questions
  const continueGame = useCallback(() => {
    // Get next 10 questions from the pool
    const usedCount = gameQuestions.length;
    const remainingQuestions = allQuestionsPool.slice(usedCount);
    
    if (remainingQuestions.length === 0) {
      // Shuffle and restart if no more questions
      const reshuffled = [...allQuestionsPool].sort(() => Math.random() - 0.5);
      setAllQuestionsPool(reshuffled);
      setGameQuestions(reshuffled.slice(0, 10));
    } else {
      const nextBatch = remainingQuestions.slice(0, 10);
      setGameQuestions(prev => [...prev, ...nextBatch]);
    }
    
    setCurrentQuestionIndex(gameQuestions.length);
    setPhase('playing');
    
    if (musicEnabled && !audioContextRef.current) {
      startBackgroundMusic();
    }
  }, [gameQuestions, allQuestionsPool, musicEnabled, startBackgroundMusic]);

  // Handle match answer
  const handleMatch = useCallback(() => {
    playSound('match');
    setMatches(prev => prev + 1);
    setTotalAnswered(prev => prev + 1);

    if (currentQuestionIndex + 1 >= gameQuestions.length) {
      // Game over - show results
      stopBackgroundMusic();
      setTimeout(() => {
        setPhase('results');
        // Celebration confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ec4899', '#a855f7', '#8b5cf6', '#d946ef'],
        });
      }, 500);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, gameQuestions.length, playSound, stopBackgroundMusic]);

  // Handle no match answer
  const handleNoMatch = useCallback(() => {
    playSound('nomatch');
    setTotalAnswered(prev => prev + 1);

    if (currentQuestionIndex + 1 >= gameQuestions.length) {
      // Game over - show results
      stopBackgroundMusic();
      setTimeout(() => {
        setPhase('results');
      }, 500);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, gameQuestions.length, playSound, stopBackgroundMusic]);

  // Play again (new game)
  const playAgain = useCallback(() => {
    stopBackgroundMusic();
    setPhase('mode');
  }, [stopBackgroundMusic]);

  // Share results
  const shareResults = useCallback(async () => {
    const scoreMessage = getScoreMessage(syncPercentage);
    const shareText = `💕 ${player1} ו${player2} שיחקו בדייט לילי!\n\n🎯 אחוז סנכרון: ${syncPercentage}%\n${scoreMessage.emoji} ${scoreMessage.title}\n\n✅ ${matches} התאמות מתוך ${totalAnswered} שאלות\n\nנסו גם אתם! 💕`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'דייט לילי - תוצאות',
          text: shareText,
        });
      } catch (e) {
        // User cancelled or share failed - fallback to clipboard
        copyToClipboard(shareText);
      }
    } else {
      copyToClipboard(shareText);
    }
  }, [player1, player2, matches, totalAnswered]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Show a brief feedback - could add toast here
      alert('הועתק ללוח!');
    }).catch(() => {
      alert('לא הצלחנו להעתיק. נסו שוב.');
    });
  };

  // Handle back
  const handleBack = useCallback(() => {
    stopBackgroundMusic();
    onBack();
  }, [onBack, stopBackgroundMusic]);

  // Calculate sync percentage
  const syncPercentage = totalAnswered > 0 ? Math.round((matches / totalAnswered) * 100) : 0;

  // Romantic theme colors
  const themeGradient = 'linear-gradient(135deg, hsl(330 90% 50%), hsl(280 90% 50%))';
  const themeBg = 'radial-gradient(ellipse at center, hsl(330 60% 15% / 0.4) 0%, transparent 70%)';

  // Render setup phase
  if (phase === 'setup') {
    return (
      <div className="min-h-screen p-4 flex flex-col pb-16">
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ background: themeBg }}
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
                style={{ background: themeGradient }}
              >
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h1 
                className="text-2xl font-black"
                style={{ color: 'hsl(330 90% 65%)' }}
              >
                דייט לילי 💕
              </h1>
            </div>
            <button
              onClick={() => setShowHelp(true)}
              className="mr-auto p-2 glass-card rounded-xl hover:bg-muted/40 transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>

          {/* Player inputs */}
          <div 
            className="glass-card p-5 mb-4"
            style={{ borderColor: 'hsl(330 90% 50% / 0.2)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5" style={{ color: 'hsl(330 90% 65%)' }} />
              <h2 className="font-bold">הזוג הרומנטי</h2>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">שחקן/ית 1</label>
                <Input
                  value={player1}
                  onChange={(e) => setPlayer1(e.target.value)}
                  placeholder="השם שלך..."
                  className="text-center"
                />
              </div>
              <div className="flex justify-center">
                <Heart className="w-6 h-6" style={{ color: 'hsl(330 90% 60%)' }} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">שחקן/ית 2</label>
                <Input
                  value={player2}
                  onChange={(e) => setPlayer2(e.target.value)}
                  placeholder="השם של בן/בת הזוג..."
                  className="text-center"
                />
              </div>
            </div>
          </div>

          {/* Editor button */}
          <Button
            variant="outline"
            onClick={() => setShowQuestionEditor(true)}
            className="mb-4"
          >
            <Settings className="w-4 h-4 ml-2" />
            ערוך שאלות
          </Button>

          {/* Start button */}
          <motion.button
            onClick={() => setPhase('mode')}
            disabled={!player1.trim() || !player2.trim()}
            className="w-full py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: themeGradient,
              boxShadow: '0 0 30px hsl(330 90% 50% / 0.4)',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play className="w-5 h-5 inline ml-2" />
            בואו נתחיל!
          </motion.button>
        </div>

        <DateNightQuestionEditor
          isOpen={showQuestionEditor}
          onClose={() => setShowQuestionEditor(false)}
          questions={questions}
          onAddQuestion={addQuestion}
          onUpdateQuestion={updateQuestion}
          onDeleteQuestion={deleteQuestion}
          onResetAll={resetAllQuestions}
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
                  background: 'linear-gradient(135deg, hsl(330 50% 8% / 0.95), hsl(280 50% 6% / 0.95))',
                  borderColor: 'hsl(330 90% 50% / 0.3)',
                }}
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Heart className="w-8 h-8" style={{ color: 'hsl(330 90% 65%)' }} />
                  <h2 className="text-xl font-black" style={{ color: 'hsl(330 90% 65%)' }}>
                    איך משחקים?
                  </h2>
                </div>
                <div className="space-y-3 text-foreground/90 leading-relaxed text-sm">
                  <p>1. שבו גב אל גב או עצמו עיניים</p>
                  <p>2. קראו את השאלה ביחד</p>
                  <p>3. ספרו 3-2-1 והצביעו על התשובה</p>
                  <p>4. אם ענינו אותו דבר - נלחץ על ✓</p>
                  <p>5. בסוף תקבלו ציון סנכרון! 💕</p>
                </div>
                <Button
                  onClick={() => setShowHelp(false)}
                  className="w-full mt-6"
                  style={{ background: themeGradient }}
                >
                  הבנתי! 💕
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <GlobalFooter />
      </div>
    );
  }

  // Render mode selection
  if (phase === 'mode') {
    return (
      <div className="min-h-screen p-4 flex flex-col pb-16">
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ background: themeBg }}
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
              style={{ color: 'hsl(330 90% 65%)' }}
            >
              בחרו את הוייב 💕
            </h1>
          </div>

          {/* Mode cards */}
          <div className="space-y-3">
            {DATE_NIGHT_CATEGORIES.map((category, index) => (
              <motion.button
                key={category.id}
                onClick={() => startGame(category.id)}
                className="w-full p-4 rounded-xl text-right transition-all"
                style={{
                  background: 'hsl(330 30% 12% / 0.6)',
                  border: '1px solid hsl(330 50% 30% / 0.3)',
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: `0 0 25px ${category.glowColor}40`,
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                    style={{ background: category.gradient }}
                  >
                    {category.emoji}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>
              </motion.button>
            ))}

            {/* Crazy mode */}
            <motion.button
              onClick={() => startGame('crazy')}
              className="w-full p-4 rounded-xl text-right transition-all"
              style={{
                background: 'linear-gradient(135deg, hsl(340 80% 15% / 0.6), hsl(280 80% 15% / 0.6))',
                border: '1px solid hsl(310 70% 40% / 0.3)',
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: '0 0 25px hsl(310 90% 50% / 0.4)',
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                  style={{ 
                    background: 'linear-gradient(135deg, hsl(340 90% 50%), hsl(280 90% 50%))',
                  }}
                >
                  🎲
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">משוגע!</h3>
                  <p className="text-sm text-muted-foreground">רולטה של הכל מהכל!</p>
                </div>
                <Sparkles className="w-5 h-5" style={{ color: 'hsl(310 90% 60%)' }} />
              </div>
            </motion.button>
          </div>

          {/* Players info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {player1} 💕 {player2}
            </p>
          </div>
        </div>

        <GlobalFooter />
      </div>
    );
  }

  // Render playing phase
  if (phase === 'playing' && gameQuestions.length > 0) {
    const currentQuestion = gameQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / gameQuestions.length) * 100;

    return (
      <div 
        className="min-h-screen flex flex-col p-4 relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, hsl(330 50% 8%) 0%, hsl(280 50% 6%) 100%)',
        }}
      >
        {/* Animated background hearts */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl opacity-10"
              initial={{ 
                x: `${Math.random() * 100}%`, 
                y: '100%',
              }}
              animate={{ 
                y: '-10%',
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{ 
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: i * 1.5,
              }}
            >
              💕
            </motion.div>
          ))}
        </div>

        {/* Back button */}
        <button
          onClick={() => {
            stopBackgroundMusic();
            setPhase('mode');
          }}
          className="absolute top-4 right-4 p-2 glass-card rounded-xl hover:bg-muted/40 transition-colors z-10"
        >
          <ArrowRight className="w-6 h-6" />
        </button>

        {/* Music toggle */}
        <button
          onClick={toggleMusic}
          className="absolute top-4 left-4 p-2 glass-card rounded-xl hover:bg-muted/40 transition-colors z-10"
        >
          {musicEnabled ? (
            <Volume2 className="w-5 h-5" style={{ color: 'hsl(330 90% 65%)' }} />
          ) : (
            <VolumeX className="w-5 h-5 text-muted-foreground" />
          )}
        </button>

        {/* Progress bar */}
        <div className="w-full max-w-lg mx-auto mb-4 mt-12">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>שאלה {currentQuestionIndex + 1} מתוך {gameQuestions.length}</span>
            <span>{syncPercentage}% סנכרון</span>
          </div>
          <div 
            className="h-2 rounded-full overflow-hidden"
            style={{ background: 'hsl(330 30% 20%)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: themeGradient }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            key={currentQuestionIndex}
            className="glass-card-strong p-8 max-w-lg w-full mx-4 text-center"
            initial={{ scale: 0.9, opacity: 0, rotateY: -20 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            style={{
              background: 'linear-gradient(135deg, hsl(330 40% 12% / 0.9), hsl(280 40% 10% / 0.9))',
              borderColor: 'hsl(330 60% 40% / 0.3)',
              boxShadow: '0 0 40px hsl(330 90% 50% / 0.2)',
            }}
          >
            <div className="text-4xl mb-6">💕</div>
            <p 
              className="text-2xl font-bold leading-relaxed"
              style={{ color: 'hsl(330 80% 80%)' }}
            >
              {currentQuestion.text}
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              ספרו 3-2-1 והצביעו!
            </p>
          </motion.div>
        </div>

        {/* Answer buttons */}
        <div className="flex gap-4 max-w-lg mx-auto w-full mb-8">
          <motion.button
            onClick={handleNoMatch}
            className="flex-1 py-5 rounded-xl font-bold text-lg flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, hsl(0 70% 45%), hsl(0 60% 35%))',
              boxShadow: '0 0 20px hsl(0 70% 50% / 0.3)',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="w-6 h-6" />
            לא הסכמנו
          </motion.button>

          <motion.button
            onClick={handleMatch}
            className="flex-1 py-5 rounded-xl font-bold text-lg flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, hsl(140 70% 40%), hsl(160 60% 35%))',
              boxShadow: '0 0 20px hsl(140 70% 45% / 0.3)',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Check className="w-6 h-6" />
            הסכמנו!
          </motion.button>
        </div>
      </div>
    );
  }

  // Render results phase
  if (phase === 'results') {
    const scoreMessage = getScoreMessage(syncPercentage);

    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, hsl(330 50% 10%) 0%, hsl(280 50% 6%) 100%)',
        }}
      >
        {/* Animated hearts background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-3xl"
              initial={{ 
                x: `${Math.random() * 100}%`, 
                y: '100%',
                opacity: 0,
              }}
              animate={{ 
                y: '-10%',
                opacity: [0, 0.3, 0],
              }}
              transition={{ 
                duration: 6 + Math.random() * 3,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            >
              {['💕', '💖', '💗', '❤️', '💜'][i % 5]}
            </motion.div>
          ))}
        </div>

        <motion.div
          className="glass-card-strong p-8 max-w-md w-full text-center relative z-10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            background: 'linear-gradient(135deg, hsl(330 40% 12% / 0.95), hsl(280 40% 10% / 0.95))',
            borderColor: 'hsl(330 60% 40% / 0.3)',
            boxShadow: '0 0 60px hsl(330 90% 50% / 0.3)',
          }}
        >
          {/* Emoji */}
          <motion.div
            className="text-7xl mb-4"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {scoreMessage.emoji}
          </motion.div>

          {/* Players */}
          <p className="text-lg text-muted-foreground mb-2">
            {player1} 💕 {player2}
          </p>

          {/* Score */}
          <motion.div
            className="text-6xl font-black mb-2"
            style={{ 
              background: themeGradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5, delay: 0.3 }}
          >
            {syncPercentage}%
          </motion.div>

          {/* Title */}
          <h2 
            className="text-2xl font-black mb-2"
            style={{ color: 'hsl(330 80% 70%)' }}
          >
            {scoreMessage.title}
          </h2>
          <p className="text-muted-foreground mb-6">
            {scoreMessage.subtitle}
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: 'hsl(140 70% 60%)' }}>
                {matches}
              </div>
              <div className="text-xs text-muted-foreground">התאמות</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: 'hsl(0 70% 60%)' }}>
                {totalAnswered - matches}
              </div>
              <div className="text-xs text-muted-foreground">אי-התאמות</div>
            </div>
          </div>

          {/* Share button */}
          <motion.button
            onClick={shareResults}
            className="w-full py-3 rounded-xl font-bold text-base mb-4 flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, hsl(200 80% 50%), hsl(220 80% 50%))',
              boxShadow: '0 0 20px hsl(210 80% 50% / 0.3)',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Share2 className="w-5 h-5" />
            שתפו את התוצאה! 📲
          </motion.button>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleBack}
              variant="outline"
              className="flex-1"
            >
              חזרה לתפריט
            </Button>
            <Button
              onClick={continueGame}
              variant="outline"
              className="flex-1"
              style={{ borderColor: 'hsl(330 60% 50% / 0.5)' }}
            >
              <Play className="w-4 h-4 ml-2" />
              המשיכו!
            </Button>
          </div>
          
          <Button
            onClick={playAgain}
            className="w-full mt-3"
            style={{ background: themeGradient }}
          >
            <RotateCcw className="w-4 h-4 ml-2" />
            משחק חדש
          </Button>
        </motion.div>
      </div>
    );
  }

  return null;
};

export default DateNightGame;
