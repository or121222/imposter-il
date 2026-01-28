import { useState, useEffect, useCallback } from 'react';
import type { Category } from '@/data/gameCategories';

const STORAGE_KEY = 'imposter-custom-categories';

export const useCustomCategories = () => {
  const [customCategories, setCustomCategories] = useState<Category[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCustomCategories(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to load custom categories:', error);
    }
  }, []);

  // Save to localStorage whenever categories change
  const saveToStorage = useCallback((categories: Category[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    } catch (error) {
      console.error('Failed to save custom categories:', error);
    }
  }, []);

  const addCategory = useCallback((category: Category) => {
    setCustomCategories(prev => {
      const updated = [...prev, category];
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const removeCategory = useCallback((categoryId: string) => {
    setCustomCategories(prev => {
      const updated = prev.filter(c => c.id !== categoryId);
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const updateCategory = useCallback((categoryId: string, updates: Partial<Category>) => {
    setCustomCategories(prev => {
      const updated = prev.map(c => 
        c.id === categoryId ? { ...c, ...updates } : c
      );
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  return {
    customCategories,
    addCategory,
    removeCategory,
    updateCategory,
  };
};
