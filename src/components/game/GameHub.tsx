import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Users, HelpCircle, Download, Sparkles, Bomb, Heart } from 'lucide-react';
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
  gradient: string;
  glowColor: string;
  onPlay: () => void;
  onHelp: () => void;
}

const GameCard = ({ title, subtitle, icon, gradient, glowColor, onPlay, onHelp }: GameCardProps) => (
  <motion.div
    className="relative glass-card p-6 cursor-pointer overflow-hidden group"
    whileHover={{ scale: 1.02, y: -4 }}
    whileTap={{ scale: 0.98 }}
    onClick={onPlay}
    style={{
      boxShadow: `0 0 30px ${glowColor}30, 0 0 60px ${glowColor}15`,
    }}
  >
    {/* Background gradient */}
    <div 
      className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity"
      style={{ background: gradient }}
    />
    
    {/* Shimmer effect */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div 
        className="absolute inset-0 animate-shimmer"
        style={{
          background: `linear-gradient(90deg, transparent, ${glowColor}20, transparent)`,
        }}
      />
    </div>
    
    {/* Content */}
    <div className="relative z-10 flex flex-col items-center text-center gap-4">
      <motion.div 
        className="p-4 rounded-2xl"
        style={{ 
          background: gradient,
          boxShadow: `0 0 20px ${glowColor}50`,
        }}
        whileHover={{ rotate: [0, -5, 5, 0] }}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.div>
      
      <div>
        <h2 className="text-2xl font-black mb-1">{title}</h2>
        <p className="text-muted-foreground text-sm">{subtitle}</p>
      </div>
      
      {/* Help button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onHelp();
        }}
        className="absolute top-3 left-3 p-2 rounded-full glass-card hover:bg-primary/20 transition-colors"
      >
        <HelpCircle className="w-5 h-5 text-muted-foreground" />
      </button>
    </div>
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
        <div className="w-full grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GameCard
              title="המתחזה"
              subtitle="מי מסתיר את האמת?"
              icon={<Users className="w-8 h-8 text-white" />}
              gradient="linear-gradient(135deg, hsl(186 100% 50%), hsl(220 100% 60%))"
              glowColor="hsl(186 100% 50%)"
              onPlay={() => setCurrentGame('imposter')}
              onHelp={() => setRulesModal({ open: true, type: 'imposter' })}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <GameCard
              title="הצייר המזויף"
              subtitle="מי מצייר בלי לדעת מה?"
              icon={<Palette className="w-8 h-8 text-white" />}
              gradient="linear-gradient(135deg, hsl(320 100% 60%), hsl(270 100% 60%))"
              glowColor="hsl(320 100% 60%)"
              onPlay={() => setCurrentGame('artist')}
              onHelp={() => setRulesModal({ open: true, type: 'artist' })}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GameCard
              title="הפצצה"
              subtitle="תעביר לפני שזה מתפוצץ! 💥"
              icon={<Bomb className="w-8 h-8 text-white" />}
              gradient="linear-gradient(135deg, hsl(30 100% 50%), hsl(15 100% 50%))"
              glowColor="hsl(30 100% 50%)"
              onPlay={() => setCurrentGame('bomb')}
              onHelp={() => setRulesModal({ open: true, type: 'bomb' })}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <GameCard
              title="דייט לילי"
              subtitle="כמה אתם מכירים אחד את השני? 💕"
              icon={<Heart className="w-8 h-8 text-white" />}
              gradient="linear-gradient(135deg, hsl(330 90% 55%), hsl(280 90% 50%))"
              glowColor="hsl(330 90% 55%)"
              onPlay={() => setCurrentGame('datenight')}
              onHelp={() => setRulesModal({ open: true, type: 'datenight' })}
            />
          </motion.div>
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
