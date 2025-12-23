import { useEffect, useCallback, useState } from 'react';

const STORAGE_KEY = 'nomia_demo_intake';
const SESSION_KEY = 'nomia_session_active';

interface IntakeData {
  step: number;
  demoLink: string;
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  selectedStyle: string;
  selectedLanguage: string;
  selectedPackage: string;
  noLogo: boolean;
  useStock: boolean;
  customPages: string[];
  selectedPages: string[];
  wantsBooking: boolean | null;
  bookingPlatform: string;
  extraNotes: string;
  services: string;
  lastSaved: number;
}

export function useAutoSave() {
  const [hasSavedData, setHasSavedData] = useState(false);
  const [savedData, setSavedData] = useState<IntakeData | null>(null);

  // Check for saved data on mount - only show resume prompt if returning from a closed session
  useEffect(() => {
    const wasSessionActive = sessionStorage.getItem(SESSION_KEY);
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (stored && !wasSessionActive) {
      // User is returning from a closed session - show resume prompt
      try {
        const parsed = JSON.parse(stored) as IntakeData;
        // Check if data is less than 7 days old
        if (Date.now() - parsed.lastSaved < 7 * 24 * 60 * 60 * 1000) {
          setSavedData(parsed);
          setHasSavedData(true);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    
    // Mark session as active
    sessionStorage.setItem(SESSION_KEY, 'true');
  }, []);

  const saveData = useCallback((data: Omit<IntakeData, 'lastSaved'>) => {
    const toSave = { ...data, lastSaved: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    setSavedData(toSave);
    // Don't set hasSavedData here - only for resume prompts
  }, []);

  const clearData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSavedData(null);
    setHasSavedData(false);
  }, []);

  const dismissResume = useCallback(() => {
    setHasSavedData(false);
  }, []);

  return {
    hasSavedData,
    savedData,
    saveData,
    clearData,
    dismissResume,
  };
}

export type { IntakeData };
