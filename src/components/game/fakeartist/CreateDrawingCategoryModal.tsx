import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Plus } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import type { DrawingCategory } from '@/data/drawingCategories';

interface CreateDrawingCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: DrawingCategory) => void;
}

const EMOJI_OPTIONS = ['🎨', '🏠', '🦁', '🍕', '🚗', '🌳', '👁️', '⚽', '👨‍⚕️', '🎲', '🎯', '🎪', '🎭', '🎮', '💎', '🔥', '⚡', '✨', '🌟', '💫', '🌈'];

export const CreateDrawingCategoryModal = ({
  isOpen,
  onClose,
  onSave,
}: CreateDrawingCategoryModalProps) => {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🎨');
  const [words, setWords] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [newWord, setNewWord] = useState('');

  const handleAddWord = () => {
    const trimmed = newWord.trim();
    if (!trimmed) return;
    
    if (words.includes(trimmed)) {
      setError('מילה זו כבר קיימת');
      return;
    }
    
    setWords(prev => [...prev, trimmed]);
    setNewWord('');
    setError('');
  };

  const handleRemoveWord = (index: number) => {
    setWords(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!name.trim()) {
      setError('יש להזין שם לקטגוריה');
      return;
    }

    if (words.length < 3) {
      setError('יש להזין לפחות 3 מילים');
      return;
    }

    const newCategory: DrawingCategory = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      emoji,
      words,
    };

    onSave(newCategory);
    
    // Reset form
    setName('');
    setEmoji('🎨');
    setWords([]);
    setError('');
    setNewWord('');
    
    onClose();
  };

  const handleClose = () => {
    setName('');
    setEmoji('🎨');
    setWords([]);
    setError('');
    setNewWord('');
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
              <div className="mx-auto w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center mb-3">
                <Plus className="w-7 h-7 text-secondary" />
              </div>
              <h2 className="text-xl font-black">קטגוריה חדשה</h2>
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
                          ? 'bg-secondary/30 border-2 border-secondary scale-110' 
                          : 'bg-muted/30 hover:bg-muted/50'
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              {/* Words List */}
              <div>
                <label className="text-sm font-medium mb-2 block">מילים לציור ({words.length})</label>
                <div className="max-h-32 overflow-y-auto space-y-2 mb-3">
                  {words.map((word, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 p-2 rounded-lg bg-muted/20"
                    >
                      <span className="flex-1 text-sm truncate">{word}</span>
                      <button
                        onClick={() => handleRemoveWord(index)}
                        className="p-1 rounded-full hover:bg-destructive/20 text-destructive"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new word */}
                <div className="flex gap-2">
                  <Input
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                    placeholder="מילה חדשה לציור"
                    className="flex-1 h-9 text-sm"
                    dir="rtl"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddWord()}
                  />
                  <button
                    onClick={handleAddWord}
                    className="p-2 rounded-lg bg-secondary/20 hover:bg-secondary/30"
                    disabled={!newWord.trim()}
                  >
                    <Plus className="w-4 h-4 text-secondary" />
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-destructive text-sm text-center">{error}</p>
              )}
            </div>

            {/* Save button */}
            <motion.button
              onClick={handleSave}
              className="btn-neon-magenta w-full mt-6 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Save className="w-5 h-5" />
              <span>צור קטגוריה</span>
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
