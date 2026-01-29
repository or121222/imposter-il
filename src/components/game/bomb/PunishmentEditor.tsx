import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, RotateCcw, Edit2, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BombPunishment } from '@/hooks/useBombPunishments';

interface PunishmentEditorProps {
  isOpen: boolean;
  onClose: () => void;
  punishments: BombPunishment[];
  onAddPunishment: (text: string) => void;
  onUpdatePunishment: (id: string, text: string) => void;
  onDeletePunishment: (id: string) => void;
  onResetToDefaults: () => void;
}

export const PunishmentEditor = ({
  isOpen,
  onClose,
  punishments,
  onAddPunishment,
  onUpdatePunishment,
  onDeletePunishment,
  onResetToDefaults,
}: PunishmentEditorProps) => {
  const [newPunishment, setNewPunishment] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleAdd = () => {
    if (newPunishment.trim()) {
      onAddPunishment(newPunishment.trim());
      setNewPunishment('');
    }
  };

  const startEditing = (punishment: BombPunishment) => {
    setEditingId(punishment.id);
    setEditText(punishment.text);
  };

  const saveEdit = () => {
    if (editingId && editText.trim()) {
      onUpdatePunishment(editingId, editText.trim());
      setEditingId(null);
      setEditText('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="glass-card-strong p-6 max-w-md w-full max-h-[80vh] flex flex-col"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, hsl(0 70% 8% / 0.95), hsl(20 70% 6% / 0.95))',
              borderColor: 'hsl(30 100% 50% / 0.3)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 
                className="text-xl font-bold flex items-center gap-2"
                style={{ color: 'hsl(30 100% 60%)' }}
              >
                🎰 ערוך עונשים
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Add new punishment */}
            <div className="flex gap-2 mb-4">
              <Input
                value={newPunishment}
                onChange={(e) => setNewPunishment(e.target.value)}
                placeholder="עונש חדש..."
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAdd();
                }}
              />
              <Button
                onClick={handleAdd}
                style={{
                  background: 'linear-gradient(135deg, hsl(30 100% 50%), hsl(15 100% 50%))',
                }}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Punishments list */}
            <div className="flex-1 overflow-y-auto space-y-2">
              {punishments.map((punishment) => (
                <motion.div
                  key={punishment.id}
                  className="flex items-center gap-2 p-3 rounded-lg"
                  style={{
                    background: 'hsl(0 50% 15% / 0.5)',
                    border: '1px solid hsl(30 100% 50% / 0.2)',
                  }}
                  layout
                >
                  {editingId === punishment.id ? (
                    <>
                      <Input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit();
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                      />
                      <button
                        onClick={saveEdit}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-green-400"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-sm">{punishment.text}</span>
                      <button
                        onClick={() => startEditing(punishment)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-blue-400"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeletePunishment(punishment.id)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Reset button */}
            <Button
              variant="outline"
              onClick={onResetToDefaults}
              className="mt-4 w-full"
            >
              <RotateCcw className="w-4 h-4 ml-2" />
              איפוס לברירת מחדל
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
