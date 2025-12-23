import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'sv' | 'en';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (sv: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function detectLanguage(): Language {
  // Check browser language
  const browserLang = navigator.language || (navigator as any).userLanguage || '';
  // If Swedish, return Swedish
  if (browserLang.toLowerCase().startsWith('sv')) {
    return 'sv';
  }
  // Check timezone - Sweden is Europe/Stockholm
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (timezone === 'Europe/Stockholm') {
    return 'sv';
  }
  // Default to English for non-Swedish users
  return 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() => detectLanguage());

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
