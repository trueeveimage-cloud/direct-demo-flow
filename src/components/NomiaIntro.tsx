import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const INTRO_SEEN_KEY = 'nomia_intro_seen_v2';

interface NomiaIntroProps {
  onComplete: () => void;
}

// Generate particles for the effect
function generateParticles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    delay: Math.random() * 0.5,
    duration: Math.random() * 2 + 1,
  }));
}

export function NomiaIntro({ onComplete }: NomiaIntroProps) {
  const [phase, setPhase] = useState<'enter' | 'visible' | 'morph' | 'done'>('enter');
  const particles = useMemo(() => generateParticles(50), []);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      setPhase('done');
      onComplete();
      return;
    }

    // Phase timing: enter -> visible -> morph -> done
    const visibleTimer = setTimeout(() => setPhase('visible'), 100);
    const morphTimer = setTimeout(() => setPhase('morph'), 1800);
    const doneTimer = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 2600);

    return () => {
      clearTimeout(visibleTimer);
      clearTimeout(morphTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ 
        opacity: phase === 'morph' ? 0 : 1,
      }}
      transition={{ duration: 0.6, ease: 'easeInOut', delay: phase === 'morph' ? 0.2 : 0 }}
      className="fixed inset-0 z-[99999] bg-background flex items-center justify-center overflow-hidden"
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        zIndex: 99999,
        perspective: '1000px',
      }}
    >
      {/* Particle field */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-accent"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={phase !== 'enter' ? {
              opacity: [0, 1, 1, 0],
              scale: [0, 1, 1.5, 0],
              y: phase === 'morph' ? [0, -200] : [0, -50, -100],
              x: phase === 'morph' 
                ? [(particle.x - 50) * -2] 
                : [0, (Math.random() - 0.5) * 50],
            } : {}}
            transition={{
              duration: phase === 'morph' ? 0.8 : particle.duration + 1,
              delay: particle.delay,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* Radial glow burst */}
      <motion.div
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ 
          opacity: phase === 'visible' ? [0, 0.8, 0.4] : phase === 'morph' ? 0 : 0,
          scale: phase === 'visible' ? [0.3, 1.5, 1.2] : phase === 'morph' ? 2 : 0.3,
        }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="w-[800px] h-[400px] bg-accent/30 rounded-full blur-[180px]" />
      </motion.div>

      {/* Secondary radial rings */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: phase === 'visible' ? [0, 0.3, 0.15] : 0,
          scale: phase === 'visible' ? [0.5, 2, 2.5] : 0.5,
        }}
        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="w-[600px] h-[600px] border-2 border-accent/20 rounded-full" />
      </motion.div>

      {/* Shimmer sweep effect */}
      <motion.div
        initial={{ x: '-100%', opacity: 0 }}
        animate={{ x: '200%', opacity: [0, 0.8, 0] }}
        transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.3 }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/50 to-transparent skew-x-12 pointer-events-none"
      />

      {/* NOMIA text with 3D morph effect */}
      <motion.div
        initial={{ 
          filter: 'blur(20px)', 
          scale: 0.8, 
          opacity: 0,
          rotateX: 20,
          z: -100,
        }}
        animate={{ 
          filter: phase === 'enter' ? 'blur(20px)' : 'blur(0px)', 
          scale: phase === 'morph' ? 0.55 : phase === 'enter' ? 0.8 : 1, 
          opacity: phase === 'morph' ? 0 : 1,
          rotateX: phase === 'morph' ? -5 : phase === 'enter' ? 20 : 0,
          y: phase === 'morph' ? '-40vh' : 0,
          z: phase === 'morph' ? 50 : phase === 'enter' ? -100 : 0,
        }}
        transition={{ 
          duration: phase === 'morph' ? 0.7 : 0.6, 
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative z-10"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          className="font-heading font-extrabold text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] tracking-tighter text-center text-foreground select-none"
          style={{ 
            textShadow: phase === 'visible' 
              ? '0 0 80px hsl(var(--accent) / 0.5), 0 0 120px hsl(var(--accent) / 0.3)' 
              : 'none',
          }}
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