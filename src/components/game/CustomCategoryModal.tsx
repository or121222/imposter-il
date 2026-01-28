import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Category, WordPair } from '@/data/gameCategories';

interface CustomCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Category) => void;
}

const EMOJI_OPTIONS = ['🎲', '🎯', '🎪', '🎨', '🎭', '🎮', '🎱', '🎵', '🏆', '💎', '🔥', '⚡', '✨', '🌟', '💫', '🌈'];

export const CustomCategoryModal = ({
  isOpen,
  onClose,
  onSave,
}: CustomCategoryModalProps) => {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🎲');
  const [wordsText, setWordsText] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!name.trim()) {
      setError('יש להזין שם לקטגוריה');
      return;
    }

    // Parse words - each line can be "wordA, wordB" or just "word"
    const lines = wordsText.split('\n').filter(line => line.trim());
    
    if (lines.length < 3) {
      setError('יש להזין לפחות 3 מילים');
      return;
    }

    const wordPairs: WordPair[] = lines.map(line => {
      const parts = line.split(',').map(p => p.trim());
      if (parts.length >= 2) {
        return { wordA: parts[0], wordB: parts[1] };
      }
      // If only one word, duplicate it for confused mode
      return { wordA: parts[0], wordB: parts[0] };
    });

    const category: Category = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      emoji,
      wordPairs,
    };

    onSave(category);
    
    // Reset form
    setName('');
    setEmoji('🎲');
    setWordsText('');
    setError('');
    onClose();
  };

  const handleClose = () => {
    setName('');
    setEmoji('🎲');
    setWordsText('');
    setError('');
    onClose();
  };

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
            onClick={handleClose}
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
              onClick={handleClose}
              className="absolute top-4 left-4 p-2 rounded-full hover:bg-muted/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="mx-auto w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                <Plus className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-xl font-black">צור קטגוריה חדשה</h2>
              <p className="text-sm text-muted-foreground mt-1">
                הוסיפו קטגוריה משלכם למשחק
              </p>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Category Name */}
              <div>
                <label className="text-sm font-medium mb-2 block">שם הקטגוריה</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="למשל: סרטים, משחקים..."
                  className="text-right"
                  dir="rtl"
                />
              </div>

              {/* Emoji Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">אייקון</label>
                <div className="flex flex-wrap gap-2">
                  {EMOJI_OPTIONS.map((e) => (
                    <button
                      key={e}
                      onClick={() => setEmoji(e)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${
                        emoji === e 
                          ? 'bg-primary/30 border-2 border-primary scale-110' 
                          : 'bg-muted/30 hover:bg-muted/50'
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              {/* Words Input */}
              <div>
                <label className="text-sm font-medium mb-2 block">רשימת מילים</label>
                <p className="text-xs text-muted-foreground mb-2">
                  מילה בכל שורה. אפשר להוסיף מילה דומה (למבולבל) עם פסיק: "פיצה, לחמניה"
                </p>
                <Textarea
                  value={wordsText}
                  onChange={(e) => setWordsText(e.target.value)}
                  placeholder={`פיצה, לחמניה\nהמבורגר, שניצל\nסושי, דג נא`}
                  className="min-h-[150px] text-right"
                  dir="rtl"
                />
              </div>

              {error && (
                <p className="text-destructive text-sm text-center">{error}</p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mt-6">
              <motion.button
                onClick={handleClose}
                className="glass-card px-4 py-3 rounded-xl flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                ביטול
              </motion.button>
              <motion.button
                onClick={handleSave}
                className="btn-neon flex-1 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="w-5 h-5" />
                <span>צור קטגוריה</span>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
