import { useState, useEffect, useCallback } from 'react';
import { defaultBombCategories, BombCategory } from '@/data/bombCategories';

const STORAGE_KEY = 'bomb_custom_categories';
const EDITED_KEY = 'bomb_edited_categories';

export const useBombCategories = () => {
  const [customCategories, setCustomCategories] = useState<BombCategory[]>([]);
  const [editedCategories, setEditedCategories] = useState<Record<string, BombCategory>>({});

  // Load from localStorage on mount
  useEffect(() => {
    const savedCustom = localStorage.getItem(STORAGE_KEY);
    const savedEdited = localStorage.getItem(EDITED_KEY);
    
    if (savedCustom) {
      try {
        setCustomCategories(JSON.parse(savedCustom));
      } catch (e) {
        console.error('Failed to parse custom bomb categories:', e);
      }
    }
    
    if (savedEdited) {
      try {
        setEditedCategories(JSON.parse(savedEdited));
      } catch (e) {
        console.error('Failed to parse edited bomb categories:', e);
      }
    }
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customCategories));
  }, [customCategories]);

  useEffect(() => {
    localStorage.setItem(EDITED_KEY, JSON.stringify(editedCategories));
  }, [editedCategories]);

  // Get all categories (defaults with edits applied + custom)
  const getAllCategories = useCallback((): BombCategory[] => {
    const defaultsWithEdits = defaultBombCategories.map(cat => 
      editedCategories[cat.id] || cat
    );
    return [...defaultsWithEdits, ...customCategories];
  }, [editedCategories, customCategories]);

  // Add a custom category
  const addCategory = useCallback((category: Omit<BombCategory, 'id' | 'isCustom'>) => {
    const newCategory: BombCategory = {
      ...category,
      id: `custom_${Date.now()}`,
      isCustom: true,
    };
    setCustomCategories(prev => [...prev, newCategory]);
    return newCategory;
  }, []);

  // Update a category
  const updateCategory = useCallback((id: string, updates: Partial<BombCategory>) => {
    const isCustom = customCategories.some(c => c.id === id);
    
    if (isCustom) {
      setCustomCategories(prev => 
        prev.map(cat => cat.id === id ? { ...cat, ...updates } : cat)
      );
    } else {
      // Edit a default category
      const original = defaultBombCategories.find(c => c.id === id);
      if (original) {
        setEditedCategories(prev => ({
          ...prev,
          [id]: { ...original, ...prev[id], ...updates },
        }));
      }
    }
  }, [customCategories]);

  // Delete a category (only custom)
  const deleteCategory = useCallback((id: string) => {
    setCustomCategories(prev => prev.filter(cat => cat.id !== id));
  }, []);

  // Reset a default category to original
  const resetCategory = useCallback((id: string) => {
    setEditedCategories(prev => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  // Reset all to defaults
  const resetAll = useCallback(() => {
    setCustomCategories([]);
    setEditedCategories({});
  }, []);

  // Check if a category is edited
  const isEdited = useCallback((id: string) => {
    return !!editedCategories[id];
  }, [editedCategories]);

  // Check if a category is custom
  const isCustom = useCallback((id: string) => {
    return customCategories.some(c => c.id === id);
  }, [customCategories]);

  return {
    categories: getAllCategories(),
    addCategory,
    updateCategory,
    deleteCategory,
    resetCategory,
    resetAll,
    isEdited,
    isCustom,
  };
};
