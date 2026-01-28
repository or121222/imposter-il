import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, Skull, Laugh, Users, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface HelpModalProps {
  fixedTrigger?: boolean;
  triggerClassName?: string;
  triggerIconClassName?: string;
}

export const HelpModal = ({
  fixedTrigger = true,
  triggerClassName,
  triggerIconClassName,
}: HelpModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={cn(
          'p-3 glass-card rounded-full hover:bg-muted/40 transition-colors',
          fixedTrigger && 'fixed top-4 left-4 z-50',
          triggerClassName,
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <HelpCircle className={cn('w-6 h-6 text-primary', triggerIconClassName)} />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Modal content */}
            <motion.div
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-lg mx-auto z-[101] glass-card-strong p-6 rounded-2xl max-h-[85vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9, y: '-40%' }}
              animate={{ opacity: 1, scale: 1, y: '-50%' }}
              exit={{ opacity: 0, scale: 0.9, y: '-40%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 left-4 p-2 rounded-full hover:bg-muted/40 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-black text-gradient-primary">איך משחקים?</h2>
                  <p className="text-muted-foreground mt-1">המדריך המהיר למתחזה</p>
                </div>

                {/* Basic rules */}
                <div className="space-y-4 text-right">
                  <div className="flex gap-3 items-start">
                    <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold flex-shrink-0">1</span>
                    <p>מעבירים את הטלפון בין המשתתפים.</p>
                  </div>

                  <div className="flex gap-3 items-start">
                    <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold flex-shrink-0">2</span>
                    <p>כולם מקבלים מילה חוץ מהמתחזה.</p>
                  </div>

                  <div className="flex gap-3 items-start">
                    <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold flex-shrink-0">3</span>
                    <p>כל אחד בתורו אומר משפט קצר על המילה.</p>
                  </div>

                  <div className="flex gap-3 items-start">
                    <span className="w-8 h-8 rounded-full bg-secondary/20 text-secondary flex items-center justify-center font-bold flex-shrink-0">🎯</span>
                    <p><strong className="text-primary">המטרה של הקבוצה:</strong> למצוא את המתחזה.</p>
                  </div>

                  <div className="flex gap-3 items-start">
                    <span className="w-8 h-8 rounded-full bg-secondary/20 text-secondary flex items-center justify-center font-bold flex-shrink-0">🕵️</span>
                    <p><strong className="text-secondary">המטרה של המתחזה:</strong> לא להיתפס, או לנחש את המילה!</p>
                  </div>
                </div>

                {/* Special roles section */}
                <div className="border-t border-muted/30 pt-6">
                  <h3 className="text-lg font-bold text-center mb-4 text-gradient-secondary">תפקידים מיוחדים</h3>
                  
                  <div className="space-y-4">
                    {/* Imposter */}
                    <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                          <Skull className="w-5 h-5 text-secondary" />
                        </div>
                        <h4 className="font-bold text-secondary">המתחזה 🕵️</h4>
                      </div>
                      <p className="text-sm text-muted-foreground text-right">
                        לא יודע את המילה הסודית. המטרה שלו להישאר מוסתר או לנחש את המילה בסוף המשחק.
                      </p>
                    </div>

                    {/* Accomplice */}
                    <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                          <UserPlus className="w-5 h-5 text-secondary" />
                        </div>
                        <h4 className="font-bold text-secondary">הסייען 🤝</h4>
                      </div>
                      <p className="text-sm text-muted-foreground text-right">
                        אתה בצד של המתחזה. אתה יודע את המילה ומי המתחזה. עזור לו לנצח בלי שירגישו!
                      </p>
                    </div>

                    {/* Jester */}
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                          <Laugh className="w-5 h-5 text-amber-500" />
                        </div>
                        <h4 className="font-bold text-amber-500">הג'וקר 🃏</h4>
                      </div>
                      <p className="text-sm text-muted-foreground text-right">
                        מנצח אם הקבוצה מצביעה עליו בטעות. המטרה שלו היא להיראות חשוד ולגרום לכולם לחשוד בו!
                      </p>
                    </div>

                    {/* Confused */}
                    <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <HelpCircle className="w-5 h-5 text-purple-500" />
                        </div>
                        <h4 className="font-bold text-purple-500">המבולבל 😵</h4>
                      </div>
                      <p className="text-sm text-muted-foreground text-right">
                        מקבל מילה דומה למילה של האזרחים (למשל: "כלב" ו"זאב"). הוא בטוח שהוא אזרח רגיל, אבל עלול להטעות את כולם!
                      </p>
                    </div>

                    {/* Civilians */}
                    <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <h4 className="font-bold text-primary">האזרחים 👥</h4>
                      </div>
                      <p className="text-sm text-muted-foreground text-right">
                        כולם מקבלים את אותה מילה סודית. המטרה שלהם לזהות את המתחזה ולהצביע עליו!
                      </p>
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="btn-neon w-full"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  הבנתי, בואו נשחק! 🎮
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
