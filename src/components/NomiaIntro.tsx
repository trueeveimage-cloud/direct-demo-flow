import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const INTRO_SEEN_KEY = 'nomia_intro_seen_v2';

interface NomiaIntroProps {
  onComplete: () => void;
}

export function NomiaIntro({ onComplete }: NomiaIntroProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Skip animation entirely
      setIsVisible(false);
      setShouldRender(false);
      onComplete();
      return;
    }

    // Auto-complete after animation
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        setShouldRender(false);
        onComplete();
      }, 500); // Wait for exit animation
    }, 2200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!shouldRender) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed inset-0 z-[9999] bg-background flex items-center justify-center overflow-hidden"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          {/* Shimmer sweep effect */}
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: '200%', opacity: [0, 0.6, 0] }}
            transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.3 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/30 to-transparent skew-x-12 pointer-events-none"
          />

          {/* Secondary shimmer */}
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: '200%', opacity: [0, 0.3, 0] }}
            transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.5 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none"
          />

          {/* Blur-to-sharp container */}
          <motion.div
            initial={{ filter: 'blur(12px)', scale: 0.9, opacity: 0 }}
            animate={{ filter: 'blur(0px)', scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            className="relative z-10"
          >
            {/* NOMIA text */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
              className="font-heading font-extrabold text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter text-center text-foreground"
            >
              Nomia<span className="text-accent">.</span>
            </motion.h1>
          </motion.div>

          {/* Subtle glow behind text */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.1 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="w-[500px] h-[250px] bg-accent/25 rounded-full blur-[120px]" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function useNomiaIntro() {
  const [hasSeenIntro, setHasSeenIntro] = useState<boolean | null>(null);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    // Check localStorage for seen flag
    const seen = localStorage.getItem(INTRO_SEEN_KEY);
    const hasSeen = seen === 'true';
    setHasSeenIntro(hasSeen);
    
    // Show intro only if not seen before
    if (!hasSeen) {
      setShowIntro(true);
    }
  }, []);

  const markIntroSeen = () => {
    localStorage.setItem(INTRO_SEEN_KEY, 'true');
    setHasSeenIntro(true);
    setShowIntro(false);
  };

  const replayIntro = () => {
    localStorage.removeItem(INTRO_SEEN_KEY);
    setHasSeenIntro(false);
    setShowIntro(true);
    // Force page reload to show intro properly
    window.location.reload();
  };

  return { hasSeenIntro, showIntro, markIntroSeen, replayIntro };
}
