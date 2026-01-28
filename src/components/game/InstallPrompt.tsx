import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Share, MoreVertical, Plus, Square, Home } from 'lucide-react';
import { useState, useEffect } from 'react';

interface InstallPromptProps {
  isOpen: boolean;
  onClose: () => void;
}

type Browser = 'chrome' | 'safari' | 'other';

const detectBrowser = (): Browser => {
  const ua = navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(ua);
  const isSafari = /safari/.test(ua) && !/chrome/.test(ua);
  
  if (isIOS || isSafari) return 'safari';
  if (/chrome/.test(ua)) return 'chrome';
  return 'other';
};

const ChromeInstructions = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-bold text-center mb-4">להתקנה בכרום:</h3>
    
    <div className="space-y-3">
      <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/20">
        <div className="p-3 rounded-full bg-primary/20">
          <MoreVertical className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <p className="font-medium">1. לחצו על שלוש הנקודות</p>
          <p className="text-sm text-muted-foreground">בפינה הימנית העליונה</p>
        </div>
      </div>

      <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/20">
        <div className="p-3 rounded-full bg-primary/20">
          <Plus className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <p className="font-medium">2. בחרו "הוסף למסך הבית"</p>
          <p className="text-sm text-muted-foreground">או "התקן אפליקציה"</p>
        </div>
      </div>

      <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/20">
        <div className="p-3 rounded-full bg-primary/20">
          <Home className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <p className="font-medium">3. לחצו "התקן"</p>
          <p className="text-sm text-muted-foreground">האפליקציה תופיע במסך הבית</p>
        </div>
      </div>
    </div>
  </div>
);

const SafariInstructions = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-bold text-center mb-4">להתקנה בספארי:</h3>
    
    <div className="space-y-3">
      <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/20">
        <div className="p-3 rounded-full bg-primary/20">
          <Share className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <p className="font-medium">1. לחצו על כפתור השיתוף</p>
          <p className="text-sm text-muted-foreground">המרובע עם החץ למעלה</p>
        </div>
      </div>

      <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/20">
        <div className="p-3 rounded-full bg-primary/20">
          <Square className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <p className="font-medium">2. גללו ובחרו "הוסף למסך הבית"</p>
          <p className="text-sm text-muted-foreground">Add to Home Screen</p>
        </div>
      </div>

      <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/20">
        <div className="p-3 rounded-full bg-primary/20">
          <Home className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <p className="font-medium">3. לחצו "הוסף"</p>
          <p className="text-sm text-muted-foreground">האפליקציה תופיע במסך הבית</p>
        </div>
      </div>
    </div>
  </div>
);

export const InstallPrompt = ({ isOpen, onClose }: InstallPromptProps) => {
  const [browser, setBrowser] = useState<Browser>('other');

  useEffect(() => {
    setBrowser(detectBrowser());
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md z-50"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="glass-card p-6 rounded-2xl h-full sm:h-auto overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Download className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold">התקנת האפליקציה</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-muted/40 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Instructions based on browser */}
              {browser === 'safari' ? <SafariInstructions /> : <ChromeInstructions />}

              {/* Close button */}
              <motion.button
                onClick={onClose}
                className="w-full mt-6 py-3 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                הבנתי!
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
