import { motion } from 'framer-motion';
import { gameCategories, type Category } from '@/data/gameCategories';

interface CategorySelectorProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string) => void;
}

export const CategorySelector = ({ selectedCategory, onSelectCategory }: CategorySelectorProps) => {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="text-center">
        <h3 className="font-bold text-xl">בחרו קטגוריה</h3>
        <p className="text-sm text-muted-foreground">
          על מה תסובב המילה הסודית?
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {gameCategories.map((category, index) => (
          <motion.button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`category-card ${selectedCategory === category.id ? 'selected' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-3xl mb-2">{category.emoji}</div>
            <div className="font-medium text-sm">{category.name}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {category.wordPairs.length} מילים
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
