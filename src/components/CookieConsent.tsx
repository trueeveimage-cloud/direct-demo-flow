import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';

const COOKIE_CONSENT_KEY = 'nomia_cookie_consent';

export function CookieConsent() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Small delay before showing for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
        >
          <div className="max-w-4xl mx-auto bg-background border border-border rounded-xl shadow-2xl shadow-black/20 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Icon */}
              <div className="hidden sm:flex w-10 h-10 bg-accent/10 rounded-lg items-center justify-center flex-shrink-0">
                <Cookie className="w-5 h-5 text-accent" />
              </div>

              {/* Content */}
              <div className="flex-grow">
                <h3 className="font-semibold text-sm mb-1">
                  {t('Vi använder cookies', 'We use cookies')}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {t(
                    'Vi använder cookies för att förbättra din upplevelse och analysera trafik. Genom att fortsätta godkänner du vår ',
                    'We use cookies to improve your experience and analyze traffic. By continuing, you agree to our '
                  )}
                  <Link to="/integritet" className="text-accent hover:underline">
                    {t('integritetspolicy', 'privacy policy')}
                  </Link>.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDecline}
                  className="flex-1 sm:flex-none text-xs"
                >
                  {t('Neka', 'Decline')}
                </Button>
                <Button
                  size="sm"
                  onClick={handleAccept}
                  className="flex-1 sm:flex-none text-xs"
                >
                  {t('Acceptera', 'Accept')}
                </Button>
              </div>

              {/* Close button - mobile only */}
              <button
                onClick={handleDecline}
                className="absolute top-2 right-2 sm:hidden p-1 text-muted-foreground hover:text-foreground"
                aria-label="Close"
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
