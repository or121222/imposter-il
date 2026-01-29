import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, RotateCcw, Edit2, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BombCategory } from '@/data/bombCategories';

interface BombCategoryEditorProps {
  isOpen: boolean;
  onClose: () => void;
  categories: BombCategory[];
  onAddCategory: (category: Omit<BombCategory, 'id' | 'isCustom'>) => void;
  onUpdateCategory: (id: string, updates: Partial<BombCategory>) => void;
  onDeleteCategory: (id: string) => void;
  onResetCategory: (id: string) => void;
  onResetAll: () => void;
  isEdited: (id: string) => boolean;
  isCustom: (id: string) => boolean;
}

export const BombCategoryEditor = ({
  isOpen,
  onClose,
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onResetCategory,
  onResetAll,
  isEdited,
  isCustom,
}: BombCategoryEditorProps) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryEmoji, setNewCategoryEmoji] = useState('🎯');
  const [newWord, setNewWord] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);

  if (!isOpen) return null;

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      onAddCategory({
        name: newCategoryName.trim(),
        emoji: newCategoryEmoji,
        words: [],
      });
      setNewCategoryName('');
      setNewCategoryEmoji('🎯');
      setShowAddCategory(false);
    }
  };

  const handleAddWord = (categoryId: string) => {
    if (newWord.trim()) {
      const category = categories.find(c => c.id === categoryId);
      if (category) {
        onUpdateCategory(categoryId, {
          words: [...category.words, newWord.trim()],
        });
        setNewWord('');
      }
    }
  };

  const handleRemoveWord = (categoryId: string, wordIndex: number) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      onUpdateCategory(categoryId, {
        words: category.words.filter((_, i) => i !== wordIndex),
      });
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="glass-card-strong p-6 max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'linear-gradient(135deg, hsl(0 70% 8% / 0.95), hsl(20 70% 6% / 0.95))',
            borderColor: 'hsl(15 100% 50% / 0.3)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black" style={{ color: 'hsl(30 100% 60%)' }}>
              עריכת קטגוריות 💣
            </h2>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onResetAll}
                className="text-xs"
              >
                <RotateCcw className="w-4 h-4 ml-1" />
                איפוס הכל
              </Button>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-muted/40 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Categories list */}
          <div className="flex-1 overflow-y-auto space-y-2 mb-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="rounded-xl overflow-hidden"
                style={{
                  background: 'hsl(0 50% 15% / 0.5)',
                  border: '1px solid hsl(15 100% 50% / 0.2)',
                }}
              >
                {/* Category header */}
                <div
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{category.emoji}</span>
                    {editingCategory === category.id ? (
                      <Input
                        value={category.name}
                        onChange={(e) => onUpdateCategory(category.id, { name: e.target.value })}
                        className="h-8 w-32 text-sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className="font-semibold">{category.name}</span>
                    )}
                    {isEdited(category.id) && (
                      <span className="text-xs text-amber-400">(נערך)</span>
                    )}
                    {isCustom(category.id) && (
                      <span className="text-xs text-green-400">(מותאם)</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground ml-2">
                      {category.words.length} מילים
                    </span>
                    {expandedCategory === category.id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>

                {/* Expanded content */}
                <AnimatePresence>
                  {expandedCategory === category.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/10"
                    >
                      <div className="p-3 space-y-3">
                        {/* Actions */}
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingCategory(editingCategory === category.id ? null : category.id)}
                          >
                            {editingCategory === category.id ? (
                              <>
                                <Save className="w-3 h-3 ml-1" />
                                שמור
                              </>
                            ) : (
                              <>
                                <Edit2 className="w-3 h-3 ml-1" />
                                ערוך שם
                              </>
                            )}
                          </Button>
                          {isEdited(category.id) && !isCustom(category.id) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onResetCategory(category.id)}
                            >
                              <RotateCcw className="w-3 h-3 ml-1" />
                              איפוס
                            </Button>
                          )}
                          {isCustom(category.id) && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => onDeleteCategory(category.id)}
                            >
                              <Trash2 className="w-3 h-3 ml-1" />
                              מחק
                            </Button>
                          )}
                        </div>

                        {/* Words list */}
                        <div className="flex flex-wrap gap-2">
                          {category.words.map((word, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-1 px-2 py-1 rounded-full text-sm"
                              style={{
                                background: 'hsl(30 80% 50% / 0.2)',
                                border: '1px solid hsl(30 80% 50% / 0.3)',
                              }}
                            >
                              <span>{word}</span>
                              <button
                                onClick={() => handleRemoveWord(category.id, index)}
                                className="hover:text-destructive transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Add word */}
                        <div className="flex gap-2">
                          <Input
                            value={newWord}
                            onChange={(e) => setNewWord(e.target.value)}
                            placeholder="הוסף מילה..."
                            className="flex-1 h-9"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleAddWord(category.id);
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            onClick={() => handleAddWord(category.id)}
                            style={{
                              background: 'linear-gradient(135deg, hsl(30 100% 50%), hsl(15 100% 50%))',
                            }}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Add new category */}
          {showAddCategory ? (
            <div className="p-4 rounded-xl" style={{ background: 'hsl(120 50% 15% / 0.3)', border: '1px solid hsl(120 50% 50% / 0.3)' }}>
              <div className="flex gap-2 mb-3">
                <Input
                  value={newCategoryEmoji}
                  onChange={(e) => setNewCategoryEmoji(e.target.value)}
                  className="w-16 text-center text-xl"
                  maxLength={2}
                />
                <Input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="שם הקטגוריה..."
                  className="flex-1"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleAddCategory}
                  className="flex-1"
                  style={{
                    background: 'linear-gradient(135deg, hsl(120 70% 40%), hsl(150 70% 40%))',
                  }}
                >
                  <Plus className="w-4 h-4 ml-1" />
                  הוסף קטגוריה
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowAddCategory(false)}
                >
                  ביטול
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={() => setShowAddCategory(true)}
              className="w-full"
              variant="outline"
            >
              <Plus className="w-4 h-4 ml-1" />
              הוסף קטגוריה חדשה
            </Button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
