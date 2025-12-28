import { useEffect, useCallback, useState, useRef } from 'react';

const STORAGE_KEY = 'nomia_demo_intake';
const SESSION_KEY = 'nomia_session_active';
const DEBOUNCE_MS = 1000;

interface BookingServiceData {
  name: string;
  duration: string;
  price: string;
}

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
  // New fields
  businessType: string;
  businessTypeOther: string;
  websiteGoal: string;
  primaryColor: string;
  accentColor: string;
  noColorPreference: boolean;
  currentWebsite: string;
  // Booking requirements
  openingHours: string;
  appointmentLengths: string[];
  customAppointmentLength: string;
  bookingServices: BookingServiceData[];
  bufferTime: string;
  maxBookingsPerDay: string;
  advanceBookingDays: string;
  // ROI fields
  hasWebsite: boolean | null;
  businessGoal: string;
  targetCustomersPerWeek: string;
  averageOrderValue: string;
  revenueRange: string;
  websiteImpact: number;
  // Photos
  uploadedPhotoNames: string[];
  lastSaved: number;
}

export type { BookingServiceData };

export function useAutoSave() {
  const [hasSavedData, setHasSavedData] = useState(false);
  const [savedData, setSavedData] = useState<IntakeData | null>(null);
  const [lastSaveTime, setLastSaveTime] = useState<number | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const saveData = useCallback((data: Omit<IntakeData, 'lastSaved'>) => {
    // Debounce saves
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      const toSave = { ...data, lastSaved: Date.now() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      setSavedData(toSave);
      setLastSaveTime(Date.now());
    }, DEBOUNCE_MS);
  }, []);

  const saveDataImmediate = useCallback((data: Omit<IntakeData, 'lastSaved'>) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    const toSave = { ...data, lastSaved: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    setSavedData(toSave);
    setLastSaveTime(Date.now());
  }, []);

  const clearData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSavedData(null);
    setHasSavedData(false);
    setLastSaveTime(null);
  }, []);

  const dismissResume = useCallback(() => {
    setHasSavedData(false);
  }, []);

  return {
    hasSavedData,
    savedData,
    saveData,
    saveDataImmediate,
    clearData,
    dismissResume,
    lastSaveTime,
  };
}

export type { IntakeData };
