import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'sv' | 'en' | 'no' | 'dk';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (sv: string, en: string, overrides?: { no?: string; dk?: string }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Detect user's likely language based on browser settings
function detectLanguage(): Language {
  if (typeof navigator === 'undefined') return 'en';
  
  const languages = navigator.languages || [navigator.language];
  
  // Check for Norwegian
  const isNorwegian = languages.some(lang => 
    lang.toLowerCase().startsWith('nb') || lang.toLowerCase().startsWith('nn') || lang.toLowerCase() === 'no'
  );
  if (isNorwegian) return 'no';

  // Check for Danish
  const isDanish = languages.some(lang => lang.toLowerCase().startsWith('da'));
  if (isDanish) return 'dk';

  // Check for Swedish
  const isSwedish = languages.some(lang => lang.toLowerCase().startsWith('sv'));
  if (isSwedish) return 'sv';
  
  // Timezone fallback
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone === 'Europe/Stockholm') return 'sv';
    if (timezone === 'Europe/Oslo') return 'no';
    if (timezone === 'Europe/Copenhagen') return 'dk';
  } catch {
    // Ignore timezone detection errors
  }
  
  return 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nomia_lang');
      if (saved === 'sv' || saved === 'en' || saved === 'no' || saved === 'dk') return saved;
    }
    return detectLanguage();
  });

  useEffect(() => {
    localStorage.setItem('nomia_lang', lang);
  }, [lang]);

  const t = (sv: string, en: string, overrides?: { no?: string; dk?: string }) => {
    switch (lang) {
      case 'en': return en;
      case 'no': return overrides?.no ?? sv; // Default to Swedish
      case 'dk': return overrides?.dk ?? sv; // Default to Swedish
      case 'sv':
      default: return sv;
    }
  };

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
