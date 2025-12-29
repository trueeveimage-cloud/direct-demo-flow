import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
    }
  };

  const navItems = [
    { path: '/', label: t('Hem', 'Home') },
    { path: '/demo', label: t('Gratis koncept', 'Free Concept') },
    { path: '/priser', label: t('Priser', 'Pricing') },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/faq', label: 'FAQ' },
    { path: '/kontakt', label: t('Kontakt', 'Contact') },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="section-padding">
        <div className="container-wide flex items-center justify-between h-16">
          {/* Logo - Clean and minimal */}
          <a 
            href="/" 
            onClick={handleLogoClick}
            className="font-heading font-semibold text-2xl tracking-tight hover:opacity-80 transition-opacity"
          >
            Nomia<span className="text-accent">.</span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-foreground ${
                  isActive(item.path) ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            
            {/* Language Toggle - Flag only */}
            <button
              onClick={() => setLang(lang === 'sv' ? 'en' : 'sv')}
              className="w-9 h-9 flex items-center justify-center rounded border border-border hover:border-accent/50 hover:bg-accent/5 transition-all"
              aria-label={lang === 'sv' ? 'Switch to English' : 'Byt till svenska'}
              title={lang === 'sv' ? 'Switch to English' : 'Byt till svenska'}
            >
              <span className="text-xl leading-none">{lang === 'sv' ? '🇬🇧' : '🇸🇪'}</span>
            </button>

            {/* CTA */}
            <Button asChild className="group">
              <Link to="/demo">
                {t('Få ditt koncept', 'Get your concept')}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              onClick={() => setLang(lang === 'sv' ? 'en' : 'sv')}
              className="w-9 h-9 flex items-center justify-center rounded border border-border transition-all"
              aria-label={lang === 'sv' ? 'Switch to English' : 'Byt till svenska'}
            >
              <span className="text-xl leading-none">{lang === 'sv' ? '🇬🇧' : '🇸🇪'}</span>
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 -mr-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-border bg-background animate-fade-in">
          <nav className="section-padding py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block py-2 text-sm font-medium transition-colors ${
                  isActive(item.path) ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4">
              <Button asChild className="w-full group">
                <Link to="/demo" onClick={() => setIsOpen(false)}>
                  {t('Få ditt koncept (72h)', 'Get your concept (72h)')}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
