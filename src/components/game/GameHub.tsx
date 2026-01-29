import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Users, HelpCircle, Download, Sparkles, Bomb, Heart, Eye, EyeOff, Brush, Timer, Flame, Zap } from 'lucide-react';
import { GameLogo } from './GameLogo';
import ImposterGame from './ImposterGame';
import FakeArtistGame from './fakeartist/FakeArtistGame';
import BombGame from './bomb/BombGame';
import DateNightGame from './datenight/DateNightGame';
import { GlobalControls, GlobalFooter } from './GlobalControls';
import { InstallPrompt } from './InstallPrompt';

type GameType = 'hub' | 'imposter' | 'artist' | 'bomb' | 'datenight';

interface GameCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  secondaryIcon?: React.ReactNode;
  gradient: string;
  glowColor: string;
  iconAnimation?: string;
  onPlay: () => void;
  onHelp: () => void;
}

const GameCard = ({ title, subtitle, icon, secondaryIcon, gradient, glowColor, iconAnimation, onPlay, onHelp }: GameCardProps) => (
  <motion.div
    className="relative glass-card p-3 cursor-pointer overflow-hidden group aspect-square flex flex-col"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.05, y: -8 }}
    whileTap={{ scale: 0.95 }}
    onClick={onPlay}
    style={{
      boxShadow: `0 0 40px ${glowColor}40, 0 0 80px ${glowColor}20, inset 0 1px 0 rgba(255,255,255,0.1)`,
    }}
  >
    {/* Animated border gradient */}
    <div 
      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{
        background: `linear-gradient(90deg, ${glowColor}, transparent, ${glowColor})`,
        backgroundSize: '200% 100%',
        animation: 'border-flow 3s ease infinite',
        padding: '2px',
        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        maskComposite: 'xor',
        WebkitMaskComposite: 'xor',
      }}
    />
    
    {/* Background gradient with enhanced glow */}
    <div 
      className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-500"
      style={{ background: gradient }}
    />
    
    {/* Animated particles/orbs */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-20 h-20 rounded-full blur-xl"
        style={{ background: glowColor, opacity: 0.3 }}
        animate={{
          x: ['-20%', '120%'],
          y: ['0%', '100%'],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute w-16 h-16 rounded-full blur-lg"
        style={{ background: glowColor, opacity: 0.2 }}
        animate={{
          x: ['120%', '-20%'],
          y: ['100%', '0%'],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear', delay: 1 }}
      />
    </div>
    
    {/* Shimmer effect */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(120deg, transparent 30%, ${glowColor}40 50%, transparent 70%)`,
        }}
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
      />
    </div>
    
    {/* Content */}
    <div className="relative z-10 flex flex-col items-center justify-center text-center gap-2 flex-1">
      {/* Icon container with glow ring */}
      <motion.div 
        className="relative p-4 rounded-2xl"
        style={{ 
          background: gradient,
          boxShadow: `0 0 30px ${glowColor}60, 0 4px 20px rgba(0,0,0,0.3)`,
        }}
        animate={{
          boxShadow: [
            `0 0 30px ${glowColor}60, 0 4px 20px rgba(0,0,0,0.3)`,
            `0 0 50px ${glowColor}80, 0 4px 30px rgba(0,0,0,0.4)`,
            `0 0 30px ${glowColor}60, 0 4px 20px rgba(0,0,0,0.3)`,
          ]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Rotating ring behind icon */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `conic-gradient(from 0deg, transparent, ${glowColor}, transparent)`,
            opacity: 0.3,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Icon wrapper */}
        <motion.div 
          className={`relative z-10 ${iconAnimation || ''}`}
          whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.4 }}
        >
          {icon}
        </motion.div>
        
        {/* Secondary floating icon */}
        {secondaryIcon && (
          <motion.div
            className="absolute -top-2 -right-2"
            animate={{ 
              y: [0, -4, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            {secondaryIcon}
          </motion.div>
        )}
      </motion.div>
      
      {/* Text with enhanced styling */}
      <div className="mt-1">
        <motion.h2 
          className="text-xl font-black mb-0.5 leading-tight"
          style={{
            textShadow: `0 0 20px ${glowColor}50`,
          }}
        >
          {title}
        </motion.h2>
        <p className="text-muted-foreground text-xs leading-tight font-medium">{subtitle}</p>
      </div>
    </div>
    
    {/* Help button with glow */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        onHelp();
      }}
      className="absolute top-2 left-2 p-1.5 rounded-full glass-card hover:bg-primary/20 transition-all duration-300 hover:scale-110 z-20"
    >
      <HelpCircle className="w-4 h-4 text-muted-foreground" />
    </button>
    
    {/* Play indicator */}
    <motion.div
      className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 1, repeat: Infinity }}
    >
      <Zap className="w-4 h-4" style={{ color: glowColor }} />
    </motion.div>
  </motion.div>
);

// Rules Modal Component
const RulesModal = ({ 
  isOpen, 
  onClose, 
  gameType 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  gameType: 'imposter' | 'artist' | 'bomb' | 'datenight'
}) => {
  if (!isOpen) return null;

  const imposterRules = [
    "כל השחקנים מקבלים מילה סודית - חוץ מהמתחזה!",
    "המתחזה לא יודע מה המילה ומנסה להסתיר את עצמו.",
    "השחקנים מתארים את המילה בתורות עם מילה אחת.",
    "בסוף - מצביעים! אם המתחזה נתפס, האזרחים מנצחים.",
    "אם המתחזה לא נתפס - הוא מנצח!",
  ];

  const artistRules = [
    "כולם מקבלים מילה וקטגוריה, חוץ מהמתחזה שמקבל רק קטגוריה.",
    "כל אחד בתורו מצייר קו אחד בלבד.",
    "המתחזה מנסה להבין מה מציירים ולהשתלב בציור.",
    "בסוף מצביעים. אם המתחזה נתפס – יש לו ניחוש אחד מה המילה כדי לנצח בכל זאת!",
  ];

  const bombRules = [
    "העבירו את הטלפון מאחד לשני בסיבוב.",
    "ענו על השאלה שמופיעה על המסך.",
    "לחצו על הכפתור כדי להעביר את הפצצה לשחקן הבא.",
    "מי שהפצצה מתפוצצת עליו - שותה! 🍺",
  ];

  const dateNightRules = [
    "שבו גב אל גב או עצמו עיניים.",
    "קראו את השאלה ביחד.",
    "ספרו 3-2-1 והצביעו על התשובה.",
    "אם ענינו אותו דבר - לחצו ✓",
    "בסוף תקבלו ציון סנכרון! 💕",
  ];

  const rules = gameType === 'imposter' ? imposterRules 
    : gameType === 'artist' ? artistRules 
    : gameType === 'bomb' ? bombRules 
    : dateNightRules;
  const title = gameType === 'imposter' ? 'המתחזה' 
    : gameType === 'artist' ? 'הצייר המזויף' 
    : gameType === 'bomb' ? 'הפצצה' 
    : 'דייט לילי';
  const gradient = gameType === 'imposter' 
    ? 'linear-gradient(135deg, hsl(186 100% 50%), hsl(220 100% 60%))'
    : gameType === 'artist' 
    ? 'linear-gradient(135deg, hsl(320 100% 60%), hsl(270 100% 60%))'
    : gameType === 'bomb'
    ? 'linear-gradient(135deg, hsl(30 100% 50%), hsl(15 100% 50%))'
    : 'linear-gradient(135deg, hsl(330 90% 55%), hsl(280 90% 50%))';

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="glass-card-strong p-6 max-w-md w-full"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div 
              className="p-2 rounded-xl"
              style={{ background: gradient }}
            >
            {gameType === 'imposter' ? (
              <Users className="w-6 h-6 text-white" />
            ) : gameType === 'artist' ? (
              <Palette className="w-6 h-6 text-white" />
            ) : gameType === 'bomb' ? (
              <Bomb className="w-6 h-6 text-white" />
            ) : (
              <Heart className="w-6 h-6 text-white" />
            )}
          </div>
          <h2 className="text-2xl font-black">{title}</h2>
          </div>

          <div className="space-y-3 mb-6">
            {rules.map((rule, index) => (
              <motion.div
                key={index}
                className="flex gap-3 items-start"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span 
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: gradient }}
                >
                  {index + 1}
                </span>
                <p className="text-sm text-foreground/90">{rule}</p>
              </motion.div>
            ))}
          </div>

          <button
            onClick={onClose}
            className="btn-neon w-full"
          >
            הבנתי!
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export const GameHub = () => {
  const [currentGame, setCurrentGame] = useState<GameType>('hub');
  const [rulesModal, setRulesModal] = useState<{ open: boolean; type: 'imposter' | 'artist' | 'bomb' | 'datenight' }>({
    open: false,
    type: 'imposter',
  });
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  if (currentGame === 'imposter') {
    return <ImposterGame onBack={() => setCurrentGame('hub')} />;
  }

  if (currentGame === 'artist') {
    return <FakeArtistGame onBack={() => setCurrentGame('hub')} />;
  }

  if (currentGame === 'bomb') {
    return <BombGame onBack={() => setCurrentGame('hub')} />;
  }

  if (currentGame === 'datenight') {
    return <DateNightGame onBack={() => setCurrentGame('hub')} />;
  }

  return (
    <div className="min-h-screen p-4 flex flex-col pb-16">
      <div className="bg-glow" />
      
      {/* Global controls - no help button on hub */}
      <GlobalControls showHelp={false} />

      <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full gap-8">
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="flex items-center justify-center gap-2 mb-2"
            animate={{ 
              textShadow: [
                '0 0 20px hsl(186 100% 50% / 0.5)',
                '0 0 40px hsl(186 100% 50% / 0.8)',
                '0 0 20px hsl(186 100% 50% / 0.5)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-black text-gradient-primary">ערב משחקים</h1>
            <Sparkles className="w-8 h-8 text-primary" />
          </motion.div>
          <p className="text-muted-foreground">בחרו משחק והתחילו לשחק!</p>
        </motion.div>

        {/* Game Cards - 2x2 Grid */}
        <div className="w-full grid grid-cols-2 gap-4">
          <GameCard
            title="המתחזה"
            subtitle="מי מסתיר את האמת?"
            icon={<Users className="w-10 h-10 text-white drop-shadow-lg" />}
            secondaryIcon={<Eye className="w-5 h-5 text-cyan-300" />}
            gradient="linear-gradient(135deg, hsl(186 100% 50%), hsl(220 100% 60%))"
            glowColor="hsl(186, 100%, 50%)"
            iconAnimation="animate-icon-bounce"
            onPlay={() => setCurrentGame('imposter')}
            onHelp={() => setRulesModal({ open: true, type: 'imposter' })}
          />

          <GameCard
            title="הצייר המזויף"
            subtitle="מי מצייר בלי לדעת מה?"
            icon={<Brush className="w-10 h-10 text-white drop-shadow-lg" />}
            secondaryIcon={<Palette className="w-5 h-5 text-pink-300" />}
            gradient="linear-gradient(135deg, hsl(320 100% 60%), hsl(270 100% 60%))"
            glowColor="hsl(320, 100%, 60%)"
            iconAnimation="animate-icon-pulse"
            onPlay={() => setCurrentGame('artist')}
            onHelp={() => setRulesModal({ open: true, type: 'artist' })}
          />

          <GameCard
            title="הפצצה"
            subtitle="תעביר לפני שזה מתפוצץ!"
            icon={<Bomb className="w-10 h-10 text-white drop-shadow-lg" />}
            secondaryIcon={<Flame className="w-5 h-5 text-orange-300 animate-icon-shake" />}
            gradient="linear-gradient(135deg, hsl(30 100% 50%), hsl(15 100% 50%))"
            glowColor="hsl(30, 100%, 50%)"
            iconAnimation="animate-icon-shake"
            onPlay={() => setCurrentGame('bomb')}
            onHelp={() => setRulesModal({ open: true, type: 'bomb' })}
          />

          <GameCard
            title="דייט לילי"
            subtitle="כמה אתם מכירים?"
            icon={<Heart className="w-10 h-10 text-white drop-shadow-lg" />}
            secondaryIcon={<Sparkles className="w-5 h-5 text-pink-200" />}
            gradient="linear-gradient(135deg, hsl(330 90% 55%), hsl(280 90% 50%))"
            glowColor="hsl(330, 90%, 55%)"
            iconAnimation="animate-heartbeat"
            onPlay={() => setCurrentGame('datenight')}
            onHelp={() => setRulesModal({ open: true, type: 'datenight' })}
          />
        </div>

        {/* Download button */}
        <motion.button
          onClick={() => setShowInstallPrompt(true)}
          className="w-full py-3 rounded-xl glass-card flex items-center justify-center gap-2 hover:bg-muted/40 transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Download className="w-5 h-5 text-primary" />
          <span className="font-medium">הורידו עכשיו</span>
        </motion.button>

        {/* Footer hint */}
        <motion.p
          className="text-xs text-muted-foreground/50 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          לחצו על ? לקריאת חוקי המשחק
        </motion.p>
      </div>

      <RulesModal
        isOpen={rulesModal.open}
        onClose={() => setRulesModal({ ...rulesModal, open: false })}
        gameType={rulesModal.type}
      />

      <InstallPrompt isOpen={showInstallPrompt} onClose={() => setShowInstallPrompt(false)} />

      {/* Global footer */}
      <GlobalFooter />
    </div>
  );
};

export default GameHub;
