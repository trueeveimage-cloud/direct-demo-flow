import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'sv' | 'en';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (sv: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Detect if user is likely from Sweden based on browser settings
function detectSwedishUser(): boolean {
  if (typeof navigator === 'undefined') return false;
  
  // Check browser language preferences
  const languages = navigator.languages || [navigator.language];
  const isSwedish = languages.some(lang => 
    lang.toLowerCase().startsWith('sv')
  );
  
  if (isSwedish) return true;
  
  // Also check timezone as a backup indicator
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone === 'Europe/Stockholm') return true;
  } catch {
    // Ignore timezone detection errors
  }
  
  return false;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Initialize with null to prevent flash, then detect
  const [lang, setLang] = useState<Language>(() => {
    // Check localStorage first for returning users
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nomia_lang');
      if (saved === 'sv' || saved === 'en') return saved;
    }
    // For new users: Swedish for Swedish browsers, English for everyone else
    return detectSwedishUser() ? 'sv' : 'en';
  });

  // Persist language choice
  useEffect(() => {
    localStorage.setItem('nomia_lang', lang);
  }, [lang]);

  const t = (sv: string, en: string) => (lang === 'sv' ? sv : en);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
