import { motion } from 'framer-motion';
import { Plus, Trash2, Pencil, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { type Category } from '@/data/gameCategories';
import { CustomCategoryModal } from './CustomCategoryModal';
import { EditCategoryModal } from './EditCategoryModal';

interface CategorySelectorProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string) => void;
  allCategories: Category[];
  onAddCategory: (category: Category) => void;
  onUpdateCategory: (categoryId: string, updates: Partial<Category>) => void;
  onRemoveCategory: (categoryId: string) => void;
  onResetCategory?: (categoryId: string) => void;
  isCustom: (categoryId: string) => boolean;
  isEdited: (categoryId: string) => boolean;
}

export const CategorySelector = ({ 
  selectedCategory, 
  onSelectCategory,
  allCategories,
  onAddCategory,
  onUpdateCategory,
  onRemoveCategory,
  onResetCategory,
  isCustom,
  isEdited,
}: CategorySelectorProps) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  const handleDeleteCategory = (e: React.MouseEvent, categoryId: string) => {
    e.stopPropagation();
    setCategoryToDelete(categoryId);
  };

  const handleEditCategory = (e: React.MouseEvent, category: Category) => {
    e.stopPropagation();
    setCategoryToEdit(category);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      onRemoveCategory(categoryToDelete);
      if (selectedCategory === categoryToDelete) {
        onSelectCategory(allCategories[0]?.id || '');
      }
      setCategoryToDelete(null);
    }
  };

  return (
    <>
      <div className="glass-card p-6 space-y-4">
        <div className="text-center">
          <h3 className="font-bold text-xl">בחרו קטגוריה</h3>
          <p className="text-sm text-muted-foreground">
            על מה תסובב המילה הסודית?
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {allCategories.map((category, index) => {
            const isCategoryCustom = isCustom(category.id);
            const isCategoryEdited = isEdited(category.id);
            
            return (
              <motion.button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={`category-card relative ${selectedCategory === category.id ? 'selected' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Edit/Delete buttons - show for all categories */}
                <div className="absolute top-2 left-2 flex gap-1 z-10">
                  <button
                    onClick={(e) => handleEditCategory(e, category)}
                    className="p-1 rounded-full bg-primary/20 hover:bg-primary/40 transition-colors"
                  >
                    <Pencil className="w-3 h-3 text-primary" />
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
                    <span className="text-xs text-primary">✎</span>
                  </div>
                )}

                <div className="text-3xl mb-2">{category.emoji}</div>
                <div className="font-medium text-sm">{category.name}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {category.wordPairs.length} מילים
                </div>
              </motion.button>
            );
          })}

          {/* Create new category button */}
          <motion.button
            onClick={() => setShowCreateModal(true)}
            className="category-card border-2 border-dashed border-primary/30 hover:border-primary/50 bg-primary/5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: allCategories.length * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-3xl mb-2">
              <Plus className="w-8 h-8 mx-auto text-primary" />
            </div>
            <div className="font-medium text-sm text-primary">צור קטגוריה חדשה</div>
            <div className="text-xs text-muted-foreground mt-1">
              הוסף מילים משלך
            </div>
          </motion.button>
        </div>
      </div>

      {/* Create Category Modal */}
      <CustomCategoryModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={onAddCategory}
      />

      {/* Edit Category Modal */}
      <EditCategoryModal
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
    </>
  );
};
