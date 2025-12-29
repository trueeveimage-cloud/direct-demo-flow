import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const INTRO_SEEN_KEY = 'nomia_intro_seen_v2';

interface NomiaIntroProps {
  onComplete: () => void;
}

export function NomiaIntro({ onComplete }: NomiaIntroProps) {
  const [phase, setPhase] = useState<'enter' | 'visible' | 'exit' | 'done'>('enter');

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      setPhase('done');
      onComplete();
      return;
    }

    // Phase timing: enter -> visible -> exit -> done
    const enterTimer = setTimeout(() => setPhase('visible'), 100);
    const exitTimer = setTimeout(() => setPhase('exit'), 2000);
    const doneTimer = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'exit' ? 0 : 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed inset-0 z-[99999] bg-background flex items-center justify-center overflow-hidden"
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        zIndex: 99999,
      }}
    >
      {/* Shimmer sweep effect */}
      <motion.div
        initial={{ x: '-100%', opacity: 0 }}
        animate={{ x: '200%', opacity: [0, 0.7, 0] }}
        transition={{ duration: 1.4, ease: 'easeInOut', delay: 0.2 }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/40 to-transparent skew-x-12 pointer-events-none"
      />

      {/* Secondary shimmer - white highlight */}
      <motion.div
        initial={{ x: '-100%', opacity: 0 }}
        animate={{ x: '200%', opacity: [0, 0.25, 0] }}
        transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.4 }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
      />

      {/* Glow background */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1.2 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="w-[600px] h-[300px] bg-accent/30 rounded-full blur-[150px]" />
      </motion.div>

      {/* NOMIA text with blur-to-sharp effect */}
      <motion.div
        initial={{ filter: 'blur(20px)', scale: 0.85, opacity: 0 }}
        animate={{ 
          filter: phase === 'enter' ? 'blur(20px)' : 'blur(0px)', 
          scale: phase === 'enter' ? 0.85 : 1, 
          opacity: 1 
        }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10"
      >
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          className="font-heading font-extrabold text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] tracking-tighter text-center text-foreground select-none"
        >
          NOMIA<span className="text-accent">.</span>
        </motion.h1>
      </motion.div>
    </motion.div>
  );
}

// Hook to manage intro state
export function useNomiaIntro() {
  const [state, setState] = useState<{
    hasSeenIntro: boolean | null;
    showIntro: boolean;
    isLoading: boolean;
  }>({
    hasSeenIntro: null,
    showIntro: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check localStorage on mount
    const seen = localStorage.getItem(INTRO_SEEN_KEY) === 'true';
    setState({
      hasSeenIntro: seen,
      showIntro: !seen,
      isLoading: false,
    });
  }, []);

  const markIntroSeen = () => {
    localStorage.setItem(INTRO_SEEN_KEY, 'true');
    setState(prev => ({
      ...prev,
      hasSeenIntro: true,
      showIntro: false,
    }));
  };

  const replayIntro = () => {
    localStorage.removeItem(INTRO_SEEN_KEY);
    // Reload to show intro fresh
    window.location.reload();
  };

  return { 
    hasSeenIntro: state.hasSeenIntro, 
    showIntro: state.showIntro, 
    isLoading: state.isLoading,
    markIntroSeen, 
    replayIntro 
  };
}