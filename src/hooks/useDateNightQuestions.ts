import { useState, useCallback, useEffect } from 'react';
import { DateNightQuestion, DEFAULT_QUESTIONS } from '@/data/dateNightQuestions';

const STORAGE_KEY = 'datenight_questions';

export const useDateNightQuestions = () => {
  const [questions, setQuestions] = useState<DateNightQuestion[]>([]);
  const [editedIds, setEditedIds] = useState<Set<string>>(new Set());

  // Load questions from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setQuestions(parsed.questions || DEFAULT_QUESTIONS);
        setEditedIds(new Set(parsed.editedIds || []));
      } catch {
        setQuestions(DEFAULT_QUESTIONS);
      }
    } else {
      setQuestions(DEFAULT_QUESTIONS);
    }
  }, []);

  // Save to localStorage whenever questions change
  useEffect(() => {
    if (questions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        questions,
        editedIds: Array.from(editedIds),
      }));
    }
  }, [questions, editedIds]);

  // Get questions by category
  const getQuestionsByCategory = useCallback((category: 'light' | 'medium' | 'deep') => {
    return questions.filter(q => q.category === category);
  }, [questions]);

  // Get all questions (for "crazy" mode - mix of all)
  const getAllQuestions = useCallback(() => {
    return questions;
  }, [questions]);

  // Add a new question
  const addQuestion = useCallback((text: string, category: 'light' | 'medium' | 'deep') => {
    const newQuestion: DateNightQuestion = {
      id: `custom_${Date.now()}`,
      text,
      category,
    };
    setQuestions(prev => [...prev, newQuestion]);
    setEditedIds(prev => new Set([...prev, newQuestion.id]));
  }, []);

  // Update an existing question
  const updateQuestion = useCallback((id: string, text: string, category: 'light' | 'medium' | 'deep') => {
    setQuestions(prev => prev.map(q => 
      q.id === id ? { ...q, text, category } : q
    ));
    setEditedIds(prev => new Set([...prev, id]));
  }, []);

  // Delete a question
  const deleteQuestion = useCallback((id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
    setEditedIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);

  // Reset a single question to default
  const resetQuestion = useCallback((id: string) => {
    const defaultQuestion = DEFAULT_QUESTIONS.find(q => q.id === id);
    if (defaultQuestion) {
      setQuestions(prev => prev.map(q => 
        q.id === id ? defaultQuestion : q
      ));
      setEditedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  }, []);

  // Reset all questions to defaults
  const resetAllQuestions = useCallback(() => {
    setQuestions(DEFAULT_QUESTIONS);
    setEditedIds(new Set());
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Check if a question was edited
  const isEdited = useCallback((id: string) => {
    return editedIds.has(id);
  }, [editedIds]);

  // Check if a question is custom (not in defaults)
  const isCustom = useCallback((id: string) => {
    return !DEFAULT_QUESTIONS.some(q => q.id === id);
  }, []);

  return {
    questions,
    getQuestionsByCategory,
    getAllQuestions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    resetQuestion,
    resetAllQuestions,
    isEdited,
    isCustom,
  };
};
