import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, ChevronDown, Sparkles, ShoppingCart, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ThemeToggle } from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

// SVG Flag components for consistent rendering
const SwedishFlag = () => (
  <svg viewBox="0 0 16 12" className="w-5 h-4" aria-hidden="true">
    <rect width="16" height="12" fill="#006AA7" />
    <rect x="5" width="2" height="12" fill="#FECC00" />
    <rect y="5" width="16" height="2" fill="#FECC00" />
  </svg>
);

const BritishFlag = () => (
  <svg viewBox="0 0 60 30" className="w-5 h-4" aria-hidden="true">
    <clipPath id="s"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
    <clipPath id="t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
    <g clipPath="url(#s)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
    </g>
  </svg>
);

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { lang, setLang, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show header when at top or scrolling up, hide when scrolling down
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProjectDropdownOpen(false);
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

  const navItems = [
    { path: '/portfolio', label: t('Portfolio', 'Portfolio') },
    { path: '/hur-det-fungerar', label: t('Hur det fungerar', 'How it works') },
    { path: '/priser', label: t('Tjänster', 'Services') },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.header 
      initial={{ y: 0 }}
      animate={{ y: visible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4"
    >
      {/* Floating pill navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2.5 rounded-full border bg-secondary/95 backdrop-blur-md border-border/80 shadow-lg"
      >
        {/* Logo */}
        <a 
          href="/" 
          onClick={handleLogoClick}
          className="font-heading font-semibold text-lg tracking-tight hover:opacity-80 transition-opacity px-2"
        >
          Nomia<span className="text-accent">.</span>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
                isActive(item.path) 
                  ? 'text-foreground bg-background/50' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/30'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-5 bg-border/50 mx-1" />

        {/* Right side controls */}
        <div className="hidden md:flex items-center gap-1">
          <ThemeToggle />
          
          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'sv' ? 'en' : 'sv')}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-background/50 transition-all"
            aria-label={lang === 'sv' ? 'Switch to English' : 'Byt till svenska'}
            title={lang === 'sv' ? 'Switch to English' : 'Byt till svenska'}
          >
            {lang === 'sv' ? <BritishFlag /> : <SwedishFlag />}
          </button>

          {/* CTA Dropdown Button */}
          <div className="relative" ref={dropdownRef}>
            <Button 
              size="sm" 
              className="rounded-full ml-1 group"
              onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
            >
              {t('Starta ditt projekt', 'Start your project')}
              <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${projectDropdownOpen ? 'rotate-180' : ''}`} />
            </Button>

            <AnimatePresence>
              {projectDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-64 bg-secondary/95 backdrop-blur-md border border-border rounded-2xl shadow-xl overflow-hidden z-50"
                >
                  <div className="p-3 space-y-2">
                    <Link
                      to="/demo"
                      onClick={() => setProjectDropdownOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-background/50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-accent" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{t('Gratis koncept', 'Free concept')}</div>
                        <div className="text-xs text-muted-foreground">{t('Inom 72 timmar', 'Within 72 hours')}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                    </Link>
                    
                    <Link
                      to="/bestall"
                      onClick={() => setProjectDropdownOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-background/50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{t('Beställ direkt', 'Order directly')}</div>
                        <div className="text-xs text-muted-foreground">{t('Hoppa över demo', 'Skip demo')}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                    </Link>
                    
                    <div className="border-t border-border/50 pt-2 mt-2">
                      <Link
                        to="/efter-demo"
                        onClick={() => setProjectDropdownOpen(false)}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-background/30 transition-colors text-sm text-muted-foreground hover:text-foreground"
                      >
                        <MessageSquare className="w-4 h-4" />
                        {t('Fått ditt koncept?', 'Received your concept?')}
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
          <button
            onClick={() => setLang(lang === 'sv' ? 'en' : 'sv')}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-all"
            aria-label={lang === 'sv' ? 'Switch to English' : 'Byt till svenska'}
          >
            {lang === 'sv' ? <BritishFlag /> : <SwedishFlag />}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-full hover:bg-background/50 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-4 right-4 md:hidden bg-secondary/95 backdrop-blur-md border border-border rounded-2xl shadow-xl overflow-hidden z-50"
          >
            <nav className="p-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block py-3 px-4 rounded-xl text-sm font-medium transition-colors ${
                    isActive(item.path) 
                      ? 'text-foreground bg-background/50' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/30'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              <div className="pt-3 mt-3 border-t border-border space-y-2">
                <Button asChild className="w-full rounded-xl group">
                  <Link to="/demo" onClick={() => setIsOpen(false)}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    {t('Gratis koncept', 'Free concept')}
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full rounded-xl group">
                  <Link to="/bestall" onClick={() => setIsOpen(false)}>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {t('Beställ direkt', 'Order directly')}
                  </Link>
                </Button>
                <Link
                  to="/efter-demo"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  {t('Fått ditt koncept?', 'Received your concept?')}
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
