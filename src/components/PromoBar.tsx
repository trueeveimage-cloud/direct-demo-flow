import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function PromoBar() {
  const { t } = useLanguage();
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the bar before
    const wasDismissed = sessionStorage.getItem('promoBarDismissed');
    if (wasDismissed) {
      setDismissed(true);
      return;
    }

    // Show after 5 seconds
    const timer = setTimeout(() => {
      setShow(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    sessionStorage.setItem('promoBarDismissed', 'true');
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none"
        >
          <div className="max-w-lg mx-auto bg-gradient-to-r from-accent/90 to-accent rounded-xl shadow-2xl p-4 pointer-events-auto border border-accent-foreground/10">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent-foreground/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-accent-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-accent-foreground">
                  {t('Gratis koncept på 72h', 'Free concept in 72h')}
                </p>
                <p className="text-xs text-accent-foreground/70 truncate">
                  {t('Se din hemsida innan du betalar', 'See your website before you pay')}
                </p>
              </div>
              <Button
                asChild
                size="sm"
                variant="secondary"
                className="flex-shrink-0"
              >
                <Link to="/demo" onClick={handleDismiss}>
                  {t('Börja', 'Start')}
                </Link>
              </Button>
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 p-1 text-accent-foreground/60 hover:text-accent-foreground transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
