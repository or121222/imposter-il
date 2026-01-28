import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X } from 'lucide-react';
import { useState } from 'react';

export const HelpModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 p-3 glass-card rounded-full hover:bg-muted/40 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <HelpCircle className="w-6 h-6 text-primary" />
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
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-lg mx-auto z-[101] glass-card-strong p-6 rounded-2xl"
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
