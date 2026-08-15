import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Check, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { denyGoogleConsent, grantGoogleConsent } from '@/lib/googleAds';

const COOKIE_CONSENT_KEY = 'nomia_cookie_consent';

// Particle component for accept animation
const Particle = ({ delay, x, y }: { delay: number; x: number; y: number }) => (
  <motion.div
    className="absolute w-2 h-2 rounded-full bg-accent"
    initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
    animate={{
      opacity: [1, 1, 0],
      scale: [1, 1.5, 0],
      x: x * 100,
      y: y * 100,
    }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
  />
);

export function CookieConsent() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    // Ask before optional Google measurement can load.
    try {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!consent) {
        const timer = setTimeout(() => setIsVisible(true), 500);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      // localStorage not available, show banner anyway after 20 seconds
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    grantGoogleConsent();
    setIsAccepting(true);
    setShowParticles(true);
    
    // Wait for animation then hide
    setTimeout(() => {
      setIsVisible(false);
    }, 800);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    denyGoogleConsent();
    setIsDeclining(true);
    
    setTimeout(() => {
      setIsVisible(false);
    }, 600);
  };

  // Generate random particles
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    delay: i * 0.03,
    x: (Math.random() - 0.5) * 2,
    y: (Math.random() - 0.5) * 2 - 0.5,
  }));

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.9 }}
          animate={{ 
            y: isDeclining ? 20 : 0, 
            opacity: isDeclining ? 0 : 1, 
            scale: isDeclining ? 0.8 : 1,
            rotate: isDeclining ? -5 : 0,
          }}
          exit={{ y: 100, opacity: 0, scale: 0.9 }}
          transition={{ 
            type: 'spring', 
            damping: 20, 
            stiffness: 300,
            ...(isDeclining && { duration: 0.4 })
          }}
          className="fixed bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-50"
        >
          <motion.div 
            className="max-w-lg mx-auto relative"
            animate={isAccepting ? { scale: [1, 1.02, 0.95, 0] } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-accent/20 rounded-2xl blur-xl" />
            
            {/* Main card */}
            <motion.div 
              className="relative bg-background/95 backdrop-blur-xl border border-border/80 rounded-2xl shadow-2xl shadow-black/30 overflow-hidden"
              animate={isAccepting ? { 
                borderColor: 'hsl(var(--accent))',
                boxShadow: '0 0 40px hsl(var(--accent) / 0.3)'
              } : {}}
            >
              {/* Animated border gradient */}
              <motion.div 
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent, hsl(var(--accent) / 0.3), transparent)',
                  backgroundSize: '200% 100%',
                }}
                animate={{ backgroundPosition: ['100% 0%', '-100% 0%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />

              {/* Particles on accept */}
              <AnimatePresence>
                {showParticles && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible">
                    {particles.map((p) => (
                      <Particle key={p.id} delay={p.delay} x={p.x} y={p.y} />
                    ))}
                  </div>
                )}
              </AnimatePresence>

              <div className="relative p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* Animated cookie icon */}
                  <motion.div 
                    className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/5 rounded-xl flex items-center justify-center flex-shrink-0 border border-accent/20"
                    animate={isAccepting ? { 
                      rotate: [0, -10, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    } : { 
                      rotate: [0, 5, -5, 0] 
                    }}
                    transition={isAccepting ? { duration: 0.5 } : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <AnimatePresence mode="wait">
                      {isAccepting ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Check className="w-6 h-6 text-accent" />
                        </motion.div>
                      ) : isDeclining ? (
                        <motion.div
                          key="shield"
                          initial={{ scale: 1 }}
                          animate={{ scale: 0.8, opacity: 0.5 }}
                        >
                          <Shield className="w-6 h-6 text-muted-foreground" />
                        </motion.div>
                      ) : (
                        <motion.div key="cookie">
                          <Cookie className="w-6 h-6 text-accent" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Content */}
                  <div className="flex-grow">
                    <motion.h3 
                      className="font-semibold text-sm mb-1"
                      animate={isAccepting ? { color: 'hsl(var(--accent))' } : {}}
                    >
                      {isAccepting 
                        ? t('Tack!', 'Thanks!') 
                        : t('Vi använder cookies', 'We use cookies')
                      }
                    </motion.h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {isAccepting ? (
                        t('Din preferens har sparats.', 'Your preference has been saved.')
                      ) : (
                        <>
                          {t(
                            'Nödvändiga funktioner används alltid. Med ditt val kan vi även mäta vilka annonser som leder till riktiga förfrågningar. ',
                            'Essential functions are always used. With your choice, we can also measure which ads lead to genuine enquiries. '
                          )}
                          <Link to="/integritet" className="text-accent hover:underline">
                            {t('Läs mer', 'Learn more')}
                          </Link>
                        </>
                      )}
                    </p>
                  </div>

                  {/* Actions */}
                  {!isAccepting && !isDeclining && (
                    <motion.div 
                      className="flex items-center gap-2 w-full sm:w-auto"
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 1 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDecline}
                        className="flex-1 sm:flex-none text-xs group"
                      >
                        <motion.span
                          whileHover={{ x: -2 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          {t('Neka', 'Decline')}
                        </motion.span>
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleAccept}
                        className="flex-1 sm:flex-none text-xs group relative overflow-hidden"
                      >
                        <motion.span
                          className="relative z-10"
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          {t('Acceptera', 'Accept')}
                        </motion.span>
                        {/* Shine effect on hover */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                          whileHover={{ translateX: '100%' }}
                          transition={{ duration: 0.5 }}
                        />
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Bottom accent line */}
              <motion.div 
                className="h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isAccepting ? 1 : 0.5 }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
