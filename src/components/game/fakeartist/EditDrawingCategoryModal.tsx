import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Plus, Trash2, Pencil, RotateCcw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import type { DrawingCategory } from '@/data/drawingCategories';

interface EditDrawingCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: DrawingCategory | null;
  onSave: (categoryId: string, updates: Partial<DrawingCategory>) => void;
  onDelete?: (categoryId: string) => void;
  onReset?: (categoryId: string) => void;
  isCustom: boolean;
  isEdited: boolean;
}

const EMOJI_OPTIONS = ['🎨', '🏠', '🦁', '🍕', '🚗', '🌳', '👁️', '⚽', '👨‍⚕️', '🎲', '🎯', '🎪', '🎭', '🎮', '💎', '🔥', '⚡', '✨', '🌟', '💫', '🌈'];

export const EditDrawingCategoryModal = ({
  isOpen,
  onClose,
  category,
  onSave,
  onDelete,
  onReset,
  isCustom,
  isEdited,
}: EditDrawingCategoryModalProps) => {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🎨');
  const [words, setWords] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [newWord, setNewWord] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingWord, setEditingWord] = useState('');

  useEffect(() => {
    if (category) {
      setName(category.name);
      setEmoji(category.emoji);
      setWords([...category.words]);
      setError('');
    }
  }, [category]);

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

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditingWord(words[index]);
  };

  const handleConfirmEdit = () => {
    if (editingIndex === null) return;
    const trimmed = editingWord.trim();
    if (!trimmed) {
      handleRemoveWord(editingIndex);
    } else {
      setWords(prev => prev.map((w, i) => i === editingIndex ? trimmed : w));
    }
    setEditingIndex(null);
    setEditingWord('');
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

    if (category) {
      onSave(category.id, {
        name: name.trim(),
        emoji,
        words,
      });
    }
    
    onClose();
  };

  const handleDelete = () => {
    if (category && onDelete) {
      onDelete(category.id);
      onClose();
    }
  };

  const handleReset = () => {
    if (category && onReset) {
      onReset(category.id);
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
              <div className="mx-auto w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center mb-3">
                <Pencil className="w-7 h-7 text-secondary" />
              </div>
              <h2 className="text-xl font-black">עריכת קטגוריה</h2>
              {isEdited && !isCustom && (
                <p className="text-xs text-muted-foreground mt-1">קטגוריה זו נערכה</p>
              )}
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Category Name */}
              <div>
                <label className="text-sm font-medium mb-2 block">שם הקטגוריה</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="למשל: חפצים, חיות..."
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
                <div className="max-h-48 overflow-y-auto space-y-2 mb-3">
                  {words.map((word, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 p-2 rounded-lg bg-muted/20"
                    >
                      {editingIndex === index ? (
                        <>
                          <Input
                            value={editingWord}
                            onChange={(e) => setEditingWord(e.target.value)}
                            className="flex-1 h-8 text-sm"
                            dir="rtl"
                            autoFocus
                            onKeyPress={(e) => e.key === 'Enter' && handleConfirmEdit()}
                          />
                          <button
                            onClick={handleConfirmEdit}
                            className="p-1 rounded-full text-secondary"
                          >
                            ✓
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="flex-1 text-sm truncate">{word}</span>
                          <button
                            onClick={() => handleStartEdit(index)}
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

            {/* Action buttons */}
            <div className="flex gap-3 mt-6">
              {isCustom && onDelete && (
                <motion.button
                  onClick={handleDelete}
                  className="p-3 rounded-xl bg-destructive/20 hover:bg-destructive/30"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Trash2 className="w-5 h-5 text-destructive" />
                </motion.button>
              )}
              {!isCustom && isEdited && onReset && (
                <motion.button
                  onClick={handleReset}
                  className="p-3 rounded-xl bg-muted/30 hover:bg-muted/50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="אפס לברירת מחדל"
                >
                  <RotateCcw className="w-5 h-5" />
                </motion.button>
              )}
              <motion.button
                onClick={handleSave}
                className="btn-neon-magenta flex-1 flex items-center justify-center gap-2"
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
