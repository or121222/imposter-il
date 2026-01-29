import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, Palette, Plus, Pencil, Trash2, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import type { DrawingCategory } from '@/data/drawingCategories';
import { EditDrawingCategoryModal } from './EditDrawingCategoryModal';
import { CreateDrawingCategoryModal } from './CreateDrawingCategoryModal';

interface DrawingCategorySelectorProps {
  categories: DrawingCategory[];
  selectedCategory: string | null;
  onSelectCategory: (id: string) => void;
  onBack: () => void;
  onStart: () => void;
  onAddCategory: (category: DrawingCategory) => void;
  onUpdateCategory: (categoryId: string, updates: Partial<DrawingCategory>) => void;
  onRemoveCategory: (categoryId: string) => void;
  onResetCategory: (categoryId: string) => void;
  isCustom: (categoryId: string) => boolean;
  isEdited: (categoryId: string) => boolean;
}

export const DrawingCategorySelector = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onBack,
  onStart,
  onAddCategory,
  onUpdateCategory,
  onRemoveCategory,
  onResetCategory,
  isCustom,
  isEdited,
}: DrawingCategorySelectorProps) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<DrawingCategory | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const handleEditCategory = (e: React.MouseEvent, category: DrawingCategory) => {
    e.stopPropagation();
    setCategoryToEdit(category);
  };

  const handleDeleteCategory = (e: React.MouseEvent, categoryId: string) => {
    e.stopPropagation();
    setCategoryToDelete(categoryId);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      onRemoveCategory(categoryToDelete);
      if (selectedCategory === categoryToDelete) {
        onSelectCategory(categories[0]?.id || '');
      }
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
          <span>חזרה</span>
        </button>
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-secondary" />
          <span className="font-bold">בחירת קטגוריה</span>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category, index) => {
            const isCategoryCustom = isCustom(category.id);
            const isCategoryEdited = isEdited(category.id);
            
            return (
              <motion.button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={`category-card flex flex-col items-center gap-2 p-4 relative ${
                  selectedCategory === category.id ? 'selected' : ''
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  borderColor: selectedCategory === category.id 
                    ? 'hsl(320 100% 60%)' 
                    : undefined,
                  boxShadow: selectedCategory === category.id
                    ? '0 0 20px hsl(320 100% 60% / 0.4), 0 0 40px hsl(320 100% 60% / 0.2)'
                    : undefined,
                }}
              >
                {/* Edit/Delete buttons */}
                <div className="absolute top-2 left-2 flex gap-1 z-10">
                  <button
                    onClick={(e) => handleEditCategory(e, category)}
                    className="p-1 rounded-full bg-secondary/20 hover:bg-secondary/40 transition-colors"
                  >
                    <Pencil className="w-3 h-3 text-secondary" />
                  </button>
                  {isCategoryCustom && (
                    <button
                      onClick={(e) => handleDeleteCategory(e, category.id)}
                      className="p-1 rounded-full bg-destructive/20 hover:bg-destructive/40 transition-colors"
                    >
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </button>
                  )}
                </div>

                {/* Edited indicator */}
                {isCategoryEdited && !isCategoryCustom && (
                  <div className="absolute top-2 right-2">
                    <span className="text-xs text-secondary">✎</span>
                  </div>
                )}

                <span className="text-3xl">{category.emoji}</span>
                <span className="font-medium text-sm">{category.name}</span>
                <span className="text-xs text-muted-foreground">
                  {category.words.length} מילים
                </span>
              </motion.button>
            );
          })}

          {/* Create new category button */}
          <motion.button
            onClick={() => setShowCreateModal(true)}
            className="category-card border-2 border-dashed border-secondary/30 hover:border-secondary/50 bg-secondary/5 flex flex-col items-center gap-2 p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categories.length * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-8 h-8 text-secondary" />
            <span className="font-medium text-sm text-secondary">צור קטגוריה חדשה</span>
            <span className="text-xs text-muted-foreground">הוסף מילים משלך</span>
          </motion.button>
        </div>
      </div>

      {/* Start Button */}
      <motion.button
        onClick={onStart}
        disabled={!selectedCategory}
        className={`btn-neon-magenta w-full mt-6 flex items-center justify-center gap-2 ${
          !selectedCategory ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        whileHover={selectedCategory ? { scale: 1.02 } : {}}
        whileTap={selectedCategory ? { scale: 0.98 } : {}}
      >
        <span>התחל משחק!</span>
        <ChevronLeft className="w-5 h-5" />
      </motion.button>

      {/* Create Category Modal */}
      <CreateDrawingCategoryModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={onAddCategory}
      />

      {/* Edit Category Modal */}
      <EditDrawingCategoryModal
        isOpen={!!categoryToEdit}
        onClose={() => setCategoryToEdit(null)}
        category={categoryToEdit}
        onSave={onUpdateCategory}
        onDelete={onRemoveCategory}
        onReset={onResetCategory}
        isCustom={categoryToEdit ? isCustom(categoryToEdit.id) : false}
        isEdited={categoryToEdit ? isEdited(categoryToEdit.id) : false}
      />

      {/* Delete Confirmation */}
      {categoryToDelete && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div
            className="glass-card-strong p-6 rounded-2xl max-w-sm w-full text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3 className="text-lg font-bold mb-2">למחוק את הקטגוריה?</h3>
            <p className="text-muted-foreground text-sm mb-4">
              הפעולה הזו לא ניתנת לביטול
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setCategoryToDelete(null)}
                className="glass-card flex-1 py-3 rounded-xl hover:bg-muted/40"
              >
                ביטול
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 rounded-xl bg-destructive text-destructive-foreground font-medium"
              >
                מחק
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};