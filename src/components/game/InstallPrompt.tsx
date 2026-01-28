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
  const [activeTab, setActiveTab] = useState<'chrome' | 'safari'>('chrome');

  useEffect(() => {
    const detected = detectBrowser();
    setActiveTab(detected === 'safari' ? 'safari' : 'chrome');
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

          {/* Modal - using flex centering instead of transforms */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              className="w-full max-w-md max-h-[90vh] pointer-events-auto"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div className="glass-card p-6 rounded-2xl overflow-y-auto max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
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

                {/* Browser tabs */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setActiveTab('chrome')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      activeTab === 'chrome'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/20 hover:bg-muted/40'
                    }`}
                  >
                    Chrome / Android
                  </button>
                  <button
                    onClick={() => setActiveTab('safari')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      activeTab === 'safari'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/20 hover:bg-muted/40'
                    }`}
                  >
                    Safari / iPhone
                  </button>
                </div>

                {/* Instructions based on selected tab */}
                {activeTab === 'safari' ? <SafariInstructions /> : <ChromeInstructions />}

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
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
