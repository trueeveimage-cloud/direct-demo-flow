import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'sv' | 'en';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (sv: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function detectLanguage(): Language {
  // Default to Swedish for this Swedish business
  // Check if explicitly set to English via browser settings
  const browserLang = navigator.language || (navigator as any).userLanguage || '';
  if (browserLang.toLowerCase().startsWith('en')) {
    // Only switch to English if explicitly English
    return 'en';
  }
  // Default to Swedish
  return 'sv';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Default to Swedish - this is a Swedish business
  const [lang, setLang] = useState<Language>('sv');

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
