import { useEffect, useCallback, useState } from 'react';

const STORAGE_KEY = 'nordicsite_demo_intake';

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

  // Check for saved data on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
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
  }, []);

  const saveData = useCallback((data: Omit<IntakeData, 'lastSaved'>) => {
    const toSave = { ...data, lastSaved: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    setSavedData(toSave);
    setHasSavedData(true);
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
