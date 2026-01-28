import { motion, AnimatePresence } from 'framer-motion';
import { X, Users2, Laugh, HelpCircle, UserPlus } from 'lucide-react';
import { VxToggle } from '@/components/ui/vx-toggle';
import type { GameSettings } from '@/hooks/useGameState';

interface RoleManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (settings: Partial<GameSettings>) => void;
}

export const RoleManagerModal = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}: RoleManagerModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal content */}
          <motion.div
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto z-[101] glass-card-strong p-6 rounded-2xl max-h-[85vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9, y: '-40%' }}
            animate={{ opacity: 1, scale: 1, y: '-50%' }}
            exit={{ opacity: 0, scale: 0.9, y: '-40%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 left-4 p-2 rounded-full hover:bg-muted/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="mx-auto w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                <Users2 className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-xl font-black">ניהול תפקידים מיוחדים</h2>
              <p className="text-sm text-muted-foreground mt-1">
                הפעילו תפקידים מיוחדים למשחק
              </p>
            </div>

            {/* Role toggles */}
            <div className="space-y-4">
              {/* Jester */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <Laugh className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-amber-500">הג'וקר 🃏</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        מנצח אם הקבוצה מצביעה עליו. רואה רק את שם הקטגוריה.
                      </p>
                    </div>
                  </div>
                  <VxToggle
                    aria-label="הג'וקר"
                    value={settings.jesterEnabled}
                    onValueChange={(value) => onUpdateSettings({ jesterEnabled: value })}
                  />
                </div>
              </div>

              {/* Confused */}
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <HelpCircle className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-purple-500">המבולבל 😵</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        מקבל מילה דומה למילה של האזרחים. לא יודע שהוא מבולבל!
                      </p>
                    </div>
                  </div>
                  <VxToggle
                    aria-label="המבולבל"
                    value={settings.confusedEnabled}
                    onValueChange={(value) => onUpdateSettings({ confusedEnabled: value })}
                  />
                </div>
              </div>

              {/* Accomplice */}
              <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                      <UserPlus className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-secondary">הסייען 🤝</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        יודע את המילה ומי המתחזה. עוזר למתחזה לנצח בסתר!
                      </p>
                    </div>
                  </div>
                  <VxToggle
                    aria-label="הסייען"
                    value={settings.accompliceEnabled}
                    onValueChange={(value) => onUpdateSettings({ accompliceEnabled: value })}
                  />
                </div>
              </div>
            </div>

            {/* Close button */}
            <motion.button
              onClick={onClose}
              className="btn-neon w-full mt-6"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              סיום
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
