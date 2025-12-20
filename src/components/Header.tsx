import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const location = useLocation();

  const navItems = [
    { path: '/', label: t('Hem', 'Home') },
    { path: '/demo', label: t('Gratis demo', 'Free Demo') },
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
          {/* Logo */}
          <Link to="/" className="font-heading font-bold text-xl tracking-tight">
            NordicSite<span className="text-accent">.</span>
          </Link>

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
            
            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === 'sv' ? 'en' : 'sv')}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded border border-border"
            >
              {lang === 'sv' ? 'EN' : 'SV'}
            </button>

            {/* CTA */}
            <Button asChild>
              <Link to="/demo">
                {t('Få en gratis webb-demo', 'Get a free website demo')}
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              onClick={() => setLang(lang === 'sv' ? 'en' : 'sv')}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded border border-border"
            >
              {lang === 'sv' ? 'EN' : 'SV'}
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
              <Button asChild className="w-full">
                <Link to="/demo" onClick={() => setIsOpen(false)}>
                  {t('Få en gratis webb-demo', 'Get a free website demo')}
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
