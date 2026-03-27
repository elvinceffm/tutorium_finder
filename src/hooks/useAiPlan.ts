import { useState, useEffect } from 'react';
import { AiPlan } from '../types/ai';

const STORAGE_KEY_PREFIX = 'tutorium_ai_plan_semester_';

export const useAiPlan = (semester: number) => {
  const [activePlan, setActivePlan] = useState<AiPlan | null>(null);

  // Load from local storage on mount or when semester changes
  useEffect(() => {
    const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${semester}`);
    if (stored) {
      try {
        setActivePlan(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse saved AI plan", e);
        setActivePlan(null);
      }
    } else {
      setActivePlan(null);
    }
  }, [semester]);

  const savePlan = (plan: AiPlan) => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${semester}`, JSON.stringify(plan));
    setActivePlan(plan);
  };

  const clearPlan = () => {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${semester}`);
    setActivePlan(null);
  };

  return { activePlan, savePlan, clearPlan };
};