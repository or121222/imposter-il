import { useState, useEffect, useCallback } from 'react';

export interface BombPunishment {
  id: string;
  text: string;
  isDefault: boolean;
}

const DEFAULT_PUNISHMENTS: BombPunishment[] = [
  { id: 'p1', text: 'שתה שוט 🥃', isDefault: true },
  { id: 'p2', text: 'עשה 20 שכיבות סמיכה 💪', isDefault: true },
  { id: 'p3', text: 'שלח אימוג\'י מוזר בקבוצה המשפחתית 📱', isDefault: true },
  { id: 'p4', text: 'תן לאחרים לעצב לך את השיער 💇', isDefault: true },
  { id: 'p5', text: 'תעשה חיקוי של חיה 🦁', isDefault: true },
  { id: 'p6', text: 'אסור לך לדבר סיבוב הבא 🤫', isDefault: true },
  { id: 'p7', text: 'תספר סיפור מביך על עצמך 😳', isDefault: true },
  { id: 'p8', text: 'תאכל משהו מהמקרר בלי לבחור 🍕', isDefault: true },
  { id: 'p9', text: 'תן לאדם משמאלך לשלוח הודעה מהטלפון שלך 📲', isDefault: true },
  { id: 'p10', text: 'רקוד 30 שניות בלי מוזיקה 💃', isDefault: true },
];

const STORAGE_KEY = 'bomb_punishments';

export const useBombPunishments = () => {
  const [punishments, setPunishments] = useState<BombPunishment[]>(DEFAULT_PUNISHMENTS);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge with defaults to ensure all default punishments exist
        const mergedPunishments = [...DEFAULT_PUNISHMENTS];
        parsed.forEach((p: BombPunishment) => {
          if (!p.isDefault) {
            mergedPunishments.push(p);
          } else {
            // Update default punishment text if edited
            const idx = mergedPunishments.findIndex(mp => mp.id === p.id);
            if (idx !== -1) {
              mergedPunishments[idx] = p;
            }
          }
        });
        setPunishments(mergedPunishments);
      } catch (e) {
        console.error('Failed to load punishments:', e);
      }
    }
  }, []);

  // Save to localStorage when punishments change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(punishments));
  }, [punishments]);

  const addPunishment = useCallback((text: string) => {
    const newPunishment: BombPunishment = {
      id: `custom_${Date.now()}`,
      text,
      isDefault: false,
    };
    setPunishments(prev => [...prev, newPunishment]);
  }, []);

  const updatePunishment = useCallback((id: string, text: string) => {
    setPunishments(prev => prev.map(p => 
      p.id === id ? { ...p, text } : p
    ));
  }, []);

  const deletePunishment = useCallback((id: string) => {
    setPunishments(prev => prev.filter(p => p.id !== id));
  }, []);

  const resetToDefaults = useCallback(() => {
    setPunishments(DEFAULT_PUNISHMENTS);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const getRandomPunishment = useCallback(() => {
    return punishments[Math.floor(Math.random() * punishments.length)];
  }, [punishments]);

  return {
    punishments,
    addPunishment,
    updatePunishment,
    deletePunishment,
    resetToDefaults,
    getRandomPunishment,
  };
};
