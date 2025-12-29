import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const INTRO_SEEN_KEY = 'nomia_intro_seen';

interface NomiaIntroProps {
  onComplete: () => void;
}

export function NomiaIntro({ onComplete }: NomiaIntroProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Skip animation entirely
      setIsVisible(false);
      onComplete();
      return;
    }

    // Auto-complete after animation
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Wait for exit animation
    }, 1800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed inset-0 z-[100] bg-background flex items-center justify-center overflow-hidden"
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
            initial={{ filter: 'blur(8px)', scale: 0.95 }}
            animate={{ filter: 'blur(0px)', scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative z-10"
          >
            {/* NOMIA text */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="font-heading font-extrabold text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter text-center"
            >
              Nomia<span className="text-accent">.</span>
            </motion.h1>
          </motion.div>

          {/* Subtle glow behind text */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="w-[400px] h-[200px] bg-accent/20 rounded-full blur-[100px]" />
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
    const seen = localStorage.getItem(INTRO_SEEN_KEY);
    const hasSeen = seen === 'true';
    setHasSeenIntro(hasSeen);
    setShowIntro(!hasSeen);
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
  };

  return { hasSeenIntro, showIntro, markIntroSeen, replayIntro };
}
