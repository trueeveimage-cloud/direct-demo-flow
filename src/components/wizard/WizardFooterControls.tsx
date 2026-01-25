import { Moon, Sun, Globe } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useState } from 'react';

export function WizardFooterControls() {
  const { theme, setTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === 'dark';

  return (
    <div className="flex items-center justify-center gap-4 py-4 mt-8 border-t border-border/30">
      {/* Language Toggle */}
      <button
        onClick={() => setLang(lang === 'sv' ? 'en' : 'sv')}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/50 text-muted-foreground hover:text-foreground hover:border-border transition-colors text-sm"
        aria-label={t('Byt språk', 'Change language')}
      >
        <Globe className="w-4 h-4" />
        <span>{lang === 'sv' ? '🇸🇪 Svenska' : '🇺🇸 English'}</span>
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
            <span>{t('Ljust läge', 'Light mode')}</span>
          </>
        ) : (
          <>
            <Moon className="w-4 h-4" />
            <span>{t('Mörkt läge', 'Dark mode')}</span>
          </>
        )}
      </button>
    </div>
  );
}
