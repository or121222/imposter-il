import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, Palette } from 'lucide-react';
import type { DrawingCategory } from '@/data/drawingCategories';

interface DrawingCategorySelectorProps {
  categories: DrawingCategory[];
  selectedCategory: string | null;
  onSelectCategory: (id: string) => void;
  onBack: () => void;
  onStart: () => void;
}

export const DrawingCategorySelector = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onBack,
  onStart,
}: DrawingCategorySelectorProps) => {
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
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`category-card flex flex-col items-center gap-2 p-4 ${
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
              <span className="text-3xl">{category.emoji}</span>
              <span className="font-medium text-sm">{category.name}</span>
              <span className="text-xs text-muted-foreground">
                {category.words.length} מילים
              </span>
            </motion.button>
          ))}
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
    </div>
  );
};