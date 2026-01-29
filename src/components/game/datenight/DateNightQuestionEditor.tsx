import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, RotateCcw, Edit2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DateNightQuestion, DATE_NIGHT_CATEGORIES } from '@/data/dateNightQuestions';

interface DateNightQuestionEditorProps {
  isOpen: boolean;
  onClose: () => void;
  questions: DateNightQuestion[];
  onAddQuestion: (text: string, category: 'light' | 'medium' | 'deep') => void;
  onUpdateQuestion: (id: string, text: string, category: 'light' | 'medium' | 'deep') => void;
  onDeleteQuestion: (id: string) => void;
  onResetAll: () => void;
  isEdited: (id: string) => boolean;
  isCustom: (id: string) => boolean;
}

export const DateNightQuestionEditor = ({
  isOpen,
  onClose,
  questions,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
  onResetAll,
  isEdited,
  isCustom,
}: DateNightQuestionEditorProps) => {
  const [activeCategory, setActiveCategory] = useState<'light' | 'medium' | 'deep'>('light');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editCategory, setEditCategory] = useState<'light' | 'medium' | 'deep'>('light');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const filteredQuestions = questions.filter(q => q.category === activeCategory);

  const handleAddQuestion = () => {
    if (newQuestionText.trim()) {
      onAddQuestion(newQuestionText.trim(), activeCategory);
      setNewQuestionText('');
    }
  };

  const startEditing = (question: DateNightQuestion) => {
    setEditingId(question.id);
    setEditText(question.text);
    setEditCategory(question.category);
  };

  const saveEdit = () => {
    if (editingId && editText.trim()) {
      onUpdateQuestion(editingId, editText.trim(), editCategory);
      setEditingId(null);
      setEditText('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleResetAll = () => {
    onResetAll();
    setShowResetConfirm(false);
  };

  if (!isOpen) return null;

  const themeGradient = 'linear-gradient(135deg, hsl(330 90% 50%), hsl(280 90% 50%))';

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
          className="glass-card-strong max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'linear-gradient(135deg, hsl(330 40% 8% / 0.98), hsl(280 40% 6% / 0.98))',
            borderColor: 'hsl(330 60% 40% / 0.3)',
          }}
        >
          {/* Header */}
          <div className="p-4 border-b border-border/30 flex items-center justify-between">
            <h2 className="text-xl font-bold" style={{ color: 'hsl(330 80% 70%)' }}>
              עריכת שאלות 💕
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-muted/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Category tabs */}
          <div className="flex gap-1 p-3 border-b border-border/30">
            {DATE_NIGHT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === cat.id 
                    ? 'text-white' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                }`}
                style={{
                  background: activeCategory === cat.id ? cat.gradient : 'transparent',
                }}
              >
                {cat.emoji} {cat.name}
              </button>
            ))}
          </div>

          {/* Add new question */}
          <div className="p-3 border-b border-border/30">
            <div className="flex gap-2">
              <Input
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                placeholder="הוסף שאלה חדשה..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddQuestion();
                }}
              />
              <Button
                onClick={handleAddQuestion}
                disabled={!newQuestionText.trim()}
                style={{ background: themeGradient }}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Questions list */}
          <div className="flex-1 overflow-y-auto p-3">
            <div className="space-y-2">
              {filteredQuestions.map((question) => (
                <motion.div
                  key={question.id}
                  className="p-3 rounded-lg"
                  style={{
                    background: 'hsl(330 30% 15% / 0.4)',
                    border: `1px solid ${isCustom(question.id) || isEdited(question.id) 
                      ? 'hsl(330 60% 50% / 0.3)' 
                      : 'transparent'}`,
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {editingId === question.id ? (
                    <div className="space-y-2">
                      <Input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <select
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value as 'light' | 'medium' | 'deep')}
                          className="flex-1 px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm"
                        >
                          {DATE_NIGHT_CATEGORIES.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.emoji} {cat.name}
                            </option>
                          ))}
                        </select>
                        <Button size="sm" onClick={saveEdit} style={{ background: themeGradient }}>
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="flex-1 text-sm">{question.text}</p>
                      <div className="flex gap-1">
                        {(isCustom(question.id) || isEdited(question.id)) && (
                          <span 
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{ 
                              background: 'hsl(330 60% 50% / 0.2)',
                              color: 'hsl(330 80% 70%)',
                            }}
                          >
                            {isCustom(question.id) ? 'חדש' : 'נערך'}
                          </span>
                        )}
                        <button
                          onClick={() => startEditing(question)}
                          className="p-1.5 rounded-lg hover:bg-muted/60 transition-colors"
                        >
                          <Edit2 className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => onDeleteQuestion(question.id)}
                          className="p-1.5 rounded-lg hover:bg-destructive/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-destructive/70" />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border/30 flex justify-between">
            <Button
              variant="outline"
              onClick={() => setShowResetConfirm(true)}
              className="text-destructive border-destructive/30 hover:bg-destructive/10"
            >
              <RotateCcw className="w-4 h-4 ml-2" />
              איפוס לברירת מחדל
            </Button>
            <Button onClick={onClose} style={{ background: themeGradient }}>
              סיום
            </Button>
          </div>

          {/* Reset confirmation */}
          <AnimatePresence>
            {showResetConfirm && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="glass-card-strong p-6 max-w-xs text-center"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  style={{
                    background: 'hsl(330 30% 10% / 0.98)',
                  }}
                >
                  <p className="mb-4 font-medium">
                    האם אתם בטוחים? כל השינויים ימחקו.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowResetConfirm(false)}
                      className="flex-1"
                    >
                      ביטול
                    </Button>
                    <Button
                      onClick={handleResetAll}
                      className="flex-1 bg-destructive hover:bg-destructive/90"
                    >
                      אפס הכל
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
