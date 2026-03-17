import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown, Sparkles, ShoppingCart, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { ThemeToggle } from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedLanguageText } from './AnimatedLanguageText';

// SVG Flag components
const SwedishFlag = () => (
  <svg viewBox="0 0 16 12" className="w-5 h-4" aria-hidden="true">
    <rect width="16" height="12" fill="#006AA7" />
    <rect x="5" width="2" height="12" fill="#FECC00" />
    <rect y="5" width="16" height="2" fill="#FECC00" />
  </svg>
);

const USFlag = () => (
  <svg viewBox="0 0 76 40" className="w-5 h-4" aria-hidden="true">
    <rect width="76" height="40" fill="#B22234"/>
    <path d="M0,4.6h76M0,12.3h76M0,20h76M0,27.7h76M0,35.4h76" stroke="#fff" strokeWidth="3.08"/>
    <rect width="30.4" height="21.5" fill="#3C3B6E"/>
    <g fill="#fff">
      <circle cx="3.8" cy="2.7" r="1.2"/><circle cx="10.1" cy="2.7" r="1.2"/>
      <circle cx="16.5" cy="2.7" r="1.2"/><circle cx="22.8" cy="2.7" r="1.2"/>
      <circle cx="6.9" cy="5.4" r="1.2"/><circle cx="13.3" cy="5.4" r="1.2"/>
      <circle cx="19.7" cy="5.4" r="1.2"/><circle cx="26.0" cy="5.4" r="1.2"/>
      <circle cx="3.8" cy="8.1" r="1.2"/><circle cx="10.1" cy="8.1" r="1.2"/>
      <circle cx="16.5" cy="8.1" r="1.2"/><circle cx="22.8" cy="8.1" r="1.2"/>
      <circle cx="6.9" cy="10.8" r="1.2"/><circle cx="13.3" cy="10.8" r="1.2"/>
      <circle cx="19.7" cy="10.8" r="1.2"/><circle cx="26.0" cy="10.8" r="1.2"/>
      <circle cx="3.8" cy="13.5" r="1.2"/><circle cx="10.1" cy="13.5" r="1.2"/>
      <circle cx="16.5" cy="13.5" r="1.2"/><circle cx="22.8" cy="13.5" r="1.2"/>
      <circle cx="6.9" cy="16.2" r="1.2"/><circle cx="13.3" cy="16.2" r="1.2"/>
      <circle cx="19.7" cy="16.2" r="1.2"/><circle cx="26.0" cy="16.2" r="1.2"/>
      <circle cx="3.8" cy="18.9" r="1.2"/><circle cx="10.1" cy="18.9" r="1.2"/>
      <circle cx="16.5" cy="18.9" r="1.2"/><circle cx="22.8" cy="18.9" r="1.2"/>
    </g>
  </svg>
);

const NorwegianFlag = () => (
  <svg viewBox="0 0 22 16" className="w-5 h-4" aria-hidden="true">
    <rect width="22" height="16" fill="#BA0C2F"/>
    <rect x="6" width="4" height="16" fill="#fff"/>
    <rect y="6" width="22" height="4" fill="#fff"/>
    <rect x="7" width="2" height="16" fill="#00205B"/>
    <rect y="7" width="22" height="2" fill="#00205B"/>
  </svg>
);

const DanishFlag = () => (
  <svg viewBox="0 0 37 28" className="w-5 h-4" aria-hidden="true">
    <rect width="37" height="28" fill="#C8102E"/>
    <rect x="12" width="4" height="28" fill="#fff"/>
    <rect y="12" width="37" height="4" fill="#fff"/>
  </svg>
);

const languageOptions: { value: Language; label: string; Flag: React.FC }[] = [
  { value: 'sv', label: 'Svenska', Flag: SwedishFlag },
  { value: 'no', label: 'Norsk', Flag: NorwegianFlag },
  { value: 'dk', label: 'Dansk', Flag: DanishFlag },
  { value: 'en', label: 'English', Flag: USFlag },
];

// Animated hamburger icon that morphs to X
const AnimatedMenuIcon = ({ isOpen }: { isOpen: boolean }) => (
  <div className="w-5 h-5 relative flex flex-col justify-center items-center">
    <motion.span
      className="absolute w-5 h-0.5 bg-current rounded-full"
      animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 0 : -4 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    />
    <motion.span
      className="absolute w-5 h-0.5 bg-current rounded-full"
      animate={{ opacity: isOpen ? 0 : 1, scaleX: isOpen ? 0 : 1 }}
      transition={{ duration: 0.2 }}
    />
    <motion.span
      className="absolute w-5 h-0.5 bg-current rounded-full"
      animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? 0 : 4 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    />
  </div>
);

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const mobileLangDropdownRef = useRef<HTMLDivElement>(null);
  const { lang, setLang, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const currentLangOption = languageOptions.find(o => o.value === lang) || languageOptions[0];
  const CurrentFlag = currentLangOption.Flag;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 50) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProjectDropdownOpen(false);
      }
      const clickedInDesktopLang = langDropdownRef.current?.contains(event.target as Node);
      const clickedInMobileLang = mobileLangDropdownRef.current?.contains(event.target as Node);
      if (!clickedInDesktopLang && !clickedInMobileLang) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
    }
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const navItems = [
    { path: '/portfolio', label: t('Portfolio', 'Portfolio') },
    { path: '/hur-det-fungerar', label: t('Hur det fungerar', 'How it works', { no: 'Hvordan det fungerer', dk: 'Sådan fungerer det' }) },
    { path: '/om-oss', label: t('Om oss', 'About', { no: 'Om oss', dk: 'Om os' }) },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4 transition-transform duration-300 ease-in-out ${visible ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <nav className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2.5 rounded-full border bg-secondary/95 backdrop-blur-md border-border/80 shadow-lg animate-hero-fade-in">
        {/* Logo */}
        <a href="/" onClick={handleLogoClick} className="font-heading font-semibold text-lg tracking-tight hover:opacity-80 transition-opacity px-2">
          Nomia<span className="text-accent">.</span>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all ${isActive(item.path) ? 'text-foreground bg-background/50' : 'text-muted-foreground hover:text-foreground hover:bg-background/30'}`}>
              {item.label}
            </Link>
          ))}
          <div className="flex items-center gap-0.5">
            <Link to="/priser" className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all ${location.pathname === '/priser' ? 'text-foreground bg-background/50' : 'text-muted-foreground hover:text-foreground hover:bg-background/30'}`}>
              {t('Priser', 'Pricing', { no: 'Priser', dk: 'Priser' })}
            </Link>
            <Link to="/mer-info" className="w-5 h-5 flex items-center justify-center rounded-full text-muted-foreground hover:text-accent hover:bg-background/30 transition-all" title={t('Mer information', 'More info')} aria-label={t('Mer information', 'More info')}>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-5 bg-border/50 mx-1" />

        {/* Right side controls */}
        <div className="hidden md:flex items-center gap-1">
          <ThemeToggle />

          {/* Language Dropdown */}
          <div className="relative" ref={langDropdownRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-background/50 transition-all overflow-hidden"
              aria-label="Change language"
            >
              <CurrentFlag />
            </button>
            <AnimatePresence>
              {langDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-40 bg-secondary border border-border rounded-xl shadow-xl overflow-hidden z-50"
                >
                  {languageOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setLang(opt.value); setLangDropdownOpen(false); }}
                      className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm transition-colors ${lang === opt.value ? 'bg-background/50 text-foreground font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-background/30'}`}
                    >
                      <opt.Flag />
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CTA Dropdown Button */}
          <div className="relative" ref={dropdownRef}>
            <Button variant="outline" size="sm" className="rounded-full ml-1 group" onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}>
              {lang === 'en' ? (
                <AnimatedLanguageText text="Start your project" className="inline-flex" />
              ) : (
                <AnimatedLanguageText text={t('Starta ditt projekt', 'Start your project', { no: 'Start ditt prosjekt', dk: 'Start dit projekt' })} className="inline-flex" />
              )}
              <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${projectDropdownOpen ? 'rotate-180' : ''}`} />
            </Button>

            <AnimatePresence>
              {projectDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-64 bg-secondary border border-border rounded-2xl shadow-xl overflow-hidden z-50"
                >
                  <div className="p-3 space-y-2">
                    <Link to="/demo" onClick={() => setProjectDropdownOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-background/50 transition-colors group">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{t('Gratis koncept', 'Free concept', { no: 'Gratis konsept', dk: 'Gratis koncept' })}</div>
                        <div className="text-xs text-muted-foreground">{t('Inom 72 timmar', 'Within 72 hours', { no: 'Innen 72 timer', dk: 'Inden 72 timer' })}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                    </Link>
                    <Link to="/bestall" onClick={() => setProjectDropdownOpen(false)} className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/30 transition-colors group">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-amber-500" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm text-amber-500">{t('Beställ direkt', 'Order directly', { no: 'Bestill direkte', dk: 'Bestil direkte' })}</div>
                        <div className="text-xs text-amber-500/70">{t('Hoppa över demo', 'Skip demo', { no: 'Hopp over demo', dk: 'Spring demo over' })}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-amber-500/70 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                    </Link>
                    <div className="border-t border-border/50 pt-2 mt-2">
                      <Link to="/efter-demo" onClick={() => setProjectDropdownOpen(false)} className="flex items-center gap-2 p-2 rounded-lg hover:bg-background/30 transition-colors text-sm text-muted-foreground hover:text-foreground">
                        <MessageSquare className="w-4 h-4" />
                        {t('Fått ditt koncept?', 'Received your concept?', { no: 'Fått konseptet ditt?', dk: 'Modtaget dit koncept?' })}
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-1 ml-auto">
          <ThemeToggle />
          
          {/* Mobile Language Dropdown */}
          <div className="relative" ref={mobileLangDropdownRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="w-8 h-8 flex items-center justify-center rounded-full transition-all overflow-hidden"
              aria-label="Change language"
            >
              <CurrentFlag />
            </button>
            <AnimatePresence>
              {langDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-36 bg-secondary border border-border rounded-xl shadow-xl overflow-hidden z-50"
                >
                  {languageOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setLang(opt.value); setLangDropdownOpen(false); }}
                      className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm transition-colors ${lang === opt.value ? 'bg-background/50 text-foreground font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-background/30'}`}
                    >
                      <opt.Flag />
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-full hover:bg-background/50 transition-colors" aria-label="Toggle menu">
            <AnimatedMenuIcon isOpen={isOpen} />
          </button>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-4 right-4 md:hidden bg-secondary border border-border rounded-2xl shadow-xl overflow-hidden z-50"
          >
            <nav className="p-4 space-y-1">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={handleLinkClick} className={`block py-3 px-4 rounded-xl text-sm font-medium transition-colors ${isActive(item.path) ? 'text-foreground bg-background/50' : 'text-muted-foreground hover:text-foreground hover:bg-background/30'}`}>
                  {item.label}
                </Link>
              ))}
              <div className="flex items-center gap-1">
                <Link to="/priser" onClick={handleLinkClick} className={`flex-1 block py-3 px-4 rounded-xl text-sm font-medium transition-colors ${isActive('/priser') ? 'text-foreground bg-background/50' : 'text-muted-foreground hover:text-foreground hover:bg-background/30'}`}>
                  {t('Priser', 'Pricing')}
                </Link>
                <Link to="/mer-info" onClick={handleLinkClick} className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-accent hover:bg-background/30 transition-all" title={t('Mer information', 'More info')} aria-label={t('Mer information', 'More info')}>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="pt-3 mt-3 border-t border-border space-y-2">
                <Button asChild variant="outline" className="w-full rounded-xl group">
                  <Link to="/demo" onClick={handleLinkClick}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    {t('Gratis koncept', 'Free concept', { no: 'Gratis konsept' })}
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full rounded-xl group border-amber-500/50 text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 hover:border-amber-500/70">
                  <Link to="/bestall" onClick={handleLinkClick}>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {t('Beställ direkt', 'Order directly', { no: 'Bestill direkte', dk: 'Bestil direkte' })}
                  </Link>
                </Button>
                <Link to="/efter-demo" onClick={handleLinkClick} className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  {t('Fått ditt koncept?', 'Received your concept?', { no: 'Fått konseptet ditt?', dk: 'Modtaget dit koncept?' })}
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
