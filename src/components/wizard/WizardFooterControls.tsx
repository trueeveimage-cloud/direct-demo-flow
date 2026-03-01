import { Moon, Sun, Globe } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { useEffect, useState } from 'react';

const langLabels: Record<Language, string> = {
  sv: '🇸🇪 Svenska',
  no: '🇳🇴 Norsk',
  dk: '🇩🇰 Dansk',
  en: '🇺🇸 English',
};

const langOrder: Language[] = ['sv', 'no', 'dk', 'en'];

export function WizardFooterControls() {
  const { theme, setTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === 'dark';

  const nextLang = () => {
    const idx = langOrder.indexOf(lang);
    setLang(langOrder[(idx + 1) % langOrder.length]);
  };

  return (
    <div className="flex items-center justify-center gap-4 py-4 mt-8 mb-4 border-t border-border/30">
      {/* Language Toggle */}
      <button
        onClick={nextLang}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/50 text-muted-foreground hover:text-foreground hover:border-border transition-colors text-sm"
        aria-label={t('Byt språk', 'Change language', { no: 'Bytt språk', dk: 'Skift sprog' })}
      >
        <Globe className="w-4 h-4" />
        <span className="inline-flex items-center gap-1.5">{langLabels[lang]}</span>
      </button>

      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/50 text-muted-foreground hover:text-foreground hover:border-border transition-colors text-sm"
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? (
          <>
            <Sun className="w-4 h-4" />
            <span>{t('Ljust läge', 'Light mode', { no: 'Lyst modus', dk: 'Lys tilstand' })}</span>
          </>
        ) : (
          <>
            <Moon className="w-4 h-4" />
            <span>{t('Mörkt läge', 'Dark mode', { no: 'Mørk modus', dk: 'Mørk tilstand' })}</span>
          </>
        )}
      </button>
    </div>
  );
}
