import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NomiaIntroProps {
  onComplete: () => void;
}

// Generate particles for the effect
function generateParticles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 0.3,
    duration: Math.random() * 1.5 + 0.8,
  }));
}

export function NomiaIntro({ onComplete }: NomiaIntroProps) {
  const [phase, setPhase] = useState<'enter' | 'visible' | 'morph' | 'done'>('enter');
  // Reduce particle count for smoother performance
  const particles = useMemo(() => generateParticles(25), []);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      setPhase('done');
      onComplete();
      return;
    }

    // Faster timing - start almost immediately
    const visibleTimer = setTimeout(() => setPhase('visible'), 20);
    const morphTimer = setTimeout(() => setPhase('morph'), 1000);
    const doneTimer = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 1400);

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
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], delay: phase === 'morph' ? 0.1 : 0 }}
      className="fixed inset-0 z-[99999] bg-background flex items-center justify-center overflow-hidden"
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        zIndex: 99999,
        perspective: '800px',
        willChange: 'opacity',
      }}
    >
      {/* Particle field - simplified for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-accent"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              willChange: 'transform, opacity',
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={phase !== 'enter' ? {
              opacity: [0, 0.8, 0.6, 0],
              scale: [0, 1, 1.2, 0],
              y: phase === 'morph' ? [0, -100] : [0, -30, -60],
            } : {}}
            transition={{
              duration: phase === 'morph' ? 0.5 : particle.duration,
              delay: particle.delay,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* Radial glow burst - simplified */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: phase === 'visible' ? [0, 0.6, 0.3] : phase === 'morph' ? 0 : 0,
          scale: phase === 'visible' ? [0.5, 1.3, 1.1] : phase === 'morph' ? 1.5 : 0.5,
        }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ willChange: 'transform, opacity' }}
      >
        <div className="w-[500px] h-[300px] bg-accent/25 rounded-full blur-[100px]" />
      </motion.div>

      {/* Shimmer sweep effect - faster */}
      <motion.div
        initial={{ x: '-100%', opacity: 0 }}
        animate={{ x: '200%', opacity: [0, 0.6, 0] }}
        transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.15 }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/40 to-transparent skew-x-12 pointer-events-none"
        style={{ willChange: 'transform, opacity' }}
      />

      {/* NOMIA text with smooth morph effect */}
      <motion.div
        initial={{ 
          filter: 'blur(12px)', 
          scale: 0.9, 
          opacity: 0,
        }}
        animate={{ 
          filter: phase === 'enter' ? 'blur(12px)' : 'blur(0px)', 
          scale: phase === 'morph' ? 0.6 : phase === 'enter' ? 0.9 : 1, 
          opacity: phase === 'morph' ? 0 : 1,
          y: phase === 'morph' ? '-30vh' : 0,
        }}
        transition={{ 
          duration: phase === 'morph' ? 0.5 : 0.4, 
          ease: [0.4, 0, 0.2, 1],
        }}
        className="relative z-10"
        style={{ willChange: 'transform, opacity, filter' }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1], delay: 0.05 }}
          className="font-heading font-extrabold text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] tracking-tighter text-center text-foreground select-none"
          style={{ 
            textShadow: phase === 'visible' 
              ? '0 0 60px hsl(var(--accent) / 0.4), 0 0 80px hsl(var(--accent) / 0.2)' 
              : 'none',
            willChange: 'transform, opacity',
          }}
        >
          NOMIA<span className="text-accent">.</span>
        </motion.h1>
      </motion.div>

    </motion.div>
  );
}

// Hook to manage intro state - only show once per session
export function useNomiaIntro() {
  const [state, setState] = useState<{
    showIntro: boolean;
    isLoading: boolean;
  }>({
    showIntro: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check if intro was already shown this session
    const hasSeenThisSession = sessionStorage.getItem('nomia_intro_seen');
    setState({
      showIntro: !hasSeenThisSession,
      isLoading: false,
    });
  }, []);

  const markIntroSeen = () => {
    sessionStorage.setItem('nomia_intro_seen', 'true');
    setState(prev => ({
      ...prev,
      showIntro: false,
    }));
  };

  const replayIntro = () => {
    sessionStorage.removeItem('nomia_intro_seen');
    window.location.reload();
  };

  return { 
    hasSeenIntro: false, 
    showIntro: state.showIntro, 
    isLoading: state.isLoading,
    markIntroSeen, 
    replayIntro 
  };
}