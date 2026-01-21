import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const EXIT_POPUP_KEY = 'nomia_exit_popup_shown';
const EXIT_POPUP_PAGES = ['/', '/priser', '/pricing'];

export function ExitIntentPopup() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const hasShown = useRef(false);

  useEffect(() => {
    // Only show on specific pages
    const currentPath = window.location.pathname;
    const shouldShowOnPage = EXIT_POPUP_PAGES.some(p => currentPath === p || currentPath.startsWith(p));
    if (!shouldShowOnPage) return;

    // Check if already shown this session
    const wasShown = sessionStorage.getItem(EXIT_POPUP_KEY);
    if (wasShown) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Detect exit intent (mouse leaving toward top of page)
      if (e.clientY <= 5 && !hasShown.current) {
        hasShown.current = true;
        sessionStorage.setItem(EXIT_POPUP_KEY, 'true');
        setIsOpen(true);
      }
    };

    // Mobile: detect back button or scroll up at top
    const handleBeforeUnload = () => {
      if (!hasShown.current) {
        hasShown.current = true;
        sessionStorage.setItem(EXIT_POPUP_KEY, 'true');
      }
    };

    // Add slight delay before enabling
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
      window.addEventListener('beforeunload', handleBeforeUnload);
    }, 5000); // 5 second delay

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      toast({ title: t('Ange en giltig e-postadress', 'Enter a valid email'), variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      // Save email capture
      const { error } = await supabase.from('email_captures').insert({
        email: email.trim(),
        source: 'exit_popup',
      });

      if (error) {
        console.error('Email capture error:', error);
      }

      setSubmitted(true);
      toast({ title: t('Tack! Vi kontaktar dig snart.', 'Thanks! We\'ll be in touch soon.') });

      // Close after 2 seconds
      setTimeout(() => setIsOpen(false), 2000);
    } catch (err) {
      console.error('Submit error:', err);
      toast({ title: t('Något gick fel', 'Something went wrong'), variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-md"
          >
            <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-2xl border border-border relative">
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {!submitted ? (
                <>
                  {/* Icon */}
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Gift className="w-8 h-8 text-accent" />
                  </div>

                  {/* Content */}
                  <h2 className="text-2xl font-bold text-center mb-2">
                    {t('Vänta! Gratis designkoncept', 'Wait! Free design concept')}
                  </h2>
                  <p className="text-muted-foreground text-center mb-6">
                    {t(
                      'Få ett gratis designkoncept för ditt företag inom 72 timmar. Ingen förpliktelse.',
                      'Get a free design concept for your business within 72 hours. No obligation.'
                    )}
                  </p>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      type="email"
                      placeholder={t('Din e-postadress', 'Your email address')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12"
                      required
                    />
                    <Button type="submit" className="w-full h-12" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          {t('Ja, skicka mitt koncept', 'Yes, send my concept')}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    {t('Vi spammar aldrig. Avregistrera när som helst.', 'We never spam. Unsubscribe anytime.')}
                  </p>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-8 h-8 text-accent" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">
                    {t('Perfekt!', 'Perfect!')}
                  </h2>
                  <p className="text-muted-foreground">
                    {t('Vi kontaktar dig snart med ditt koncept.', 'We\'ll be in touch soon with your concept.')}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
