import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Plus, Trash2, Pencil } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import type { Category, WordPair } from '@/data/gameCategories';

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  onSave: (categoryId: string, updates: Partial<Category>) => void;
  onDelete: (categoryId: string) => void;
}

const EMOJI_OPTIONS = ['🎲', '🎯', '🎪', '🎨', '🎭', '🎮', '🎱', '🎵', '🏆', '💎', '🔥', '⚡', '✨', '🌟', '💫', '🌈'];

export const EditCategoryModal = ({
  isOpen,
  onClose,
  category,
  onSave,
  onDelete,
}: EditCategoryModalProps) => {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🎲');
  const [wordPairs, setWordPairs] = useState<WordPair[]>([]);
  const [error, setError] = useState('');
  const [newWordA, setNewWordA] = useState('');
  const [newWordB, setNewWordB] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setEmoji(category.emoji);
      setWordPairs([...category.wordPairs]);
    }
  }, [category]);

  const handleAddWord = () => {
    if (!newWordA.trim()) return;
    
    const newPair: WordPair = {
      wordA: newWordA.trim(),
      wordB: newWordB.trim() || newWordA.trim(),
    };
    
    setWordPairs(prev => [...prev, newPair]);
    setNewWordA('');
    setNewWordB('');
  };

  const handleRemoveWord = (index: number) => {
    setWordPairs(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateWord = (index: number, wordA: string, wordB: string) => {
    setWordPairs(prev => prev.map((pair, i) => 
      i === index ? { wordA, wordB: wordB || wordA } : pair
    ));
    setEditingIndex(null);
  };

  const handleSave = () => {
    if (!name.trim()) {
      setError('יש להזין שם לקטגוריה');
      return;
    }

    if (wordPairs.length < 3) {
      setError('יש להזין לפחות 3 מילים');
      return;
    }

    if (category) {
      onSave(category.id, {
        name: name.trim(),
        emoji,
        wordPairs,
      });
    }
    
    onClose();
  };

  const handleDelete = () => {
    if (category) {
      onDelete(category.id);
      onClose();
    }
  };

  if (!category) return null;

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
                <Pencil className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-xl font-black">עריכת קטגוריה</h2>
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

              {/* Words List */}
              <div>
                <label className="text-sm font-medium mb-2 block">מילים ({wordPairs.length})</label>
                <div className="max-h-48 overflow-y-auto space-y-2 mb-3">
                  {wordPairs.map((pair, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 p-2 rounded-lg bg-muted/20"
                    >
                      {editingIndex === index ? (
                        <>
                          <Input
                            value={pair.wordA}
                            onChange={(e) => handleUpdateWord(index, e.target.value, pair.wordB)}
                            className="flex-1 h-8 text-sm"
                            dir="rtl"
                          />
                          <Input
                            value={pair.wordB}
                            onChange={(e) => handleUpdateWord(index, pair.wordA, e.target.value)}
                            className="flex-1 h-8 text-sm"
                            placeholder="מילה דומה"
                            dir="rtl"
                          />
                          <button
                            onClick={() => setEditingIndex(null)}
                            className="p-1 rounded-full text-primary"
                          >
                            ✓
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="flex-1 text-sm truncate">{pair.wordA}</span>
                          {pair.wordB !== pair.wordA && (
                            <span className="text-xs text-muted-foreground">({pair.wordB})</span>
                          )}
                          <button
                            onClick={() => setEditingIndex(index)}
                            className="p-1 rounded-full hover:bg-muted/40"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleRemoveWord(index)}
                            className="p-1 rounded-full hover:bg-destructive/20"
                          >
                            <Trash2 className="w-3 h-3 text-destructive" />
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add new word */}
                <div className="flex gap-2">
                  <Input
                    value={newWordA}
                    onChange={(e) => setNewWordA(e.target.value)}
                    placeholder="מילה חדשה"
                    className="flex-1 h-9 text-sm"
                    dir="rtl"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddWord()}
                  />
                  <Input
                    value={newWordB}
                    onChange={(e) => setNewWordB(e.target.value)}
                    placeholder="מילה דומה (אופציונלי)"
                    className="flex-1 h-9 text-sm"
                    dir="rtl"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddWord()}
                  />
                  <button
                    onClick={handleAddWord}
                    className="p-2 rounded-lg bg-primary/20 hover:bg-primary/30"
                    disabled={!newWordA.trim()}
                  >
                    <Plus className="w-4 h-4 text-primary" />
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-destructive text-sm text-center">{error}</p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mt-6">
              <motion.button
                onClick={handleDelete}
                className="p-3 rounded-xl bg-destructive/20 hover:bg-destructive/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Trash2 className="w-5 h-5 text-destructive" />
              </motion.button>
              <motion.button
                onClick={handleSave}
                className="btn-neon flex-1 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Save className="w-5 h-5" />
                <span>שמור שינויים</span>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
