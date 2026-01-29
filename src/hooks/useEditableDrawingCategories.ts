import { useState, useEffect, useCallback } from 'react';
import { drawingCategories, type DrawingCategory } from '@/data/drawingCategories';

const STORAGE_KEY = 'fakeartist-edited-categories';
const CUSTOM_STORAGE_KEY = 'fakeartist-custom-categories';

export interface EditableDrawingCategoriesHook {
  allCategories: DrawingCategory[];
  customCategories: DrawingCategory[];
  addCategory: (category: DrawingCategory) => void;
  updateCategory: (categoryId: string, updates: Partial<DrawingCategory>) => void;
  removeCategory: (categoryId: string) => void;
  resetToDefault: (categoryId: string) => void;
  isCustom: (categoryId: string) => boolean;
  isEdited: (categoryId: string) => boolean;
  getRandomWord: (categoryId: string) => { word: string; category: DrawingCategory | null };
}

export const useEditableDrawingCategories = (): EditableDrawingCategoriesHook => {
  const [editedCategories, setEditedCategories] = useState<Record<string, Partial<DrawingCategory>>>({});
  const [customCategories, setCustomCategories] = useState<DrawingCategory[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      // Load edited default categories
      const storedEdits = localStorage.getItem(STORAGE_KEY);
      if (storedEdits) {
        const parsed = JSON.parse(storedEdits);
        if (typeof parsed === 'object') {
          setEditedCategories(parsed);
        }
      }

      // Load custom categories
      const storedCustom = localStorage.getItem(CUSTOM_STORAGE_KEY);
      if (storedCustom) {
        const parsed = JSON.parse(storedCustom);
        if (Array.isArray(parsed)) {
          setCustomCategories(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to load drawing categories:', error);
    }
  }, []);

  // Save edited categories to localStorage
  const saveEditsToStorage = useCallback((edits: Record<string, Partial<DrawingCategory>>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(edits));
    } catch (error) {
      console.error('Failed to save edited drawing categories:', error);
    }
  }, []);

  // Save custom categories to localStorage
  const saveCustomToStorage = useCallback((categories: DrawingCategory[]) => {
    try {
      localStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(categories));
    } catch (error) {
      console.error('Failed to save custom drawing categories:', error);
    }
  }, []);

  // Build all categories with edits applied
  const allCategories = [
    ...drawingCategories.map(cat => {
      const edits = editedCategories[cat.id];
      return edits ? { ...cat, ...edits } : cat;
    }),
    ...customCategories
  ];

  const addCategory = useCallback((category: DrawingCategory) => {
    setCustomCategories(prev => {
      const updated = [...prev, category];
      saveCustomToStorage(updated);
      return updated;
    });
  }, [saveCustomToStorage]);

  const updateCategory = useCallback((categoryId: string, updates: Partial<DrawingCategory>) => {
    // Check if it's a default category
    const isDefault = drawingCategories.some(c => c.id === categoryId);
    
    if (isDefault) {
      setEditedCategories(prev => {
        const updated = { ...prev, [categoryId]: { ...prev[categoryId], ...updates } };
        saveEditsToStorage(updated);
        return updated;
      });
    } else {
      // It's a custom category
      setCustomCategories(prev => {
        const updated = prev.map(c => 
          c.id === categoryId ? { ...c, ...updates } : c
        );
        saveCustomToStorage(updated);
        return updated;
      });
    }
  }, [saveEditsToStorage, saveCustomToStorage]);

  const removeCategory = useCallback((categoryId: string) => {
    // Can only remove custom categories
    setCustomCategories(prev => {
      const updated = prev.filter(c => c.id !== categoryId);
      saveCustomToStorage(updated);
      return updated;
    });
  }, [saveCustomToStorage]);

  const resetToDefault = useCallback((categoryId: string) => {
    setEditedCategories(prev => {
      const updated = { ...prev };
      delete updated[categoryId];
      saveEditsToStorage(updated);
      return updated;
    });
  }, [saveEditsToStorage]);

  const isCustom = useCallback((categoryId: string) => {
    return categoryId.startsWith('custom-');
  }, []);

  const isEdited = useCallback((categoryId: string) => {
    return !!editedCategories[categoryId];
  }, [editedCategories]);

  const getRandomWord = useCallback((categoryId: string): { word: string; category: DrawingCategory | null } => {
    const category = allCategories.find(c => c.id === categoryId);
    if (!category || category.words.length === 0) {
      return { word: "", category: null };
    }
    const word = category.words[Math.floor(Math.random() * category.words.length)];
    return { word, category };
  }, [allCategories]);

  return {
    allCategories,
    customCategories,
    addCategory,
    updateCategory,
    removeCategory,
    resetToDefault,
    isCustom,
    isEdited,
    getRandomWord,
  };
};
