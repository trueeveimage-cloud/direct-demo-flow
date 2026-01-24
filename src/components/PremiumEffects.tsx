import { useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Film grain overlay for premium feel
export function GrainOverlay() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[60] opacity-[0.02] mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

// Floating particles for ambient atmosphere
export function FloatingParticles({ count = 20 }: { count?: number }) {
  const particles = useMemo(() => 
    [...Array(count)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: 5 + Math.random() * 8,
      delay: Math.random() * 3,
      opacity: Math.random() * 0.25 + 0.05,
    })), [count]
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-accent"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 15 - 7.5, 0],
            opacity: [p.opacity, p.opacity * 1.5, p.opacity],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

// Ambient glow backgrounds
export function AmbientGlow({ variant = 'default' }: { variant?: 'default' | 'hero' | 'subtle' }) {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 500], [1, 0.3]);

  if (variant === 'subtle') {
    return (
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-accent/[0.03] rounded-full blur-[180px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/[0.02] rounded-full blur-[150px]" />
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <motion.div style={{ opacity }} className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[10%] w-[800px] h-[600px] bg-accent/[0.04] rounded-full blur-[200px]" />
        <div className="absolute top-[20%] right-[5%] w-[500px] h-[500px] bg-accent/[0.03] rounded-full blur-[150px]" />
        <div className="absolute bottom-[10%] left-[30%] w-[400px] h-[400px] bg-accent/[0.02] rounded-full blur-[120px]" />
      </motion.div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <motion.div 
        className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-accent/[0.04] rounded-full blur-[180px]"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/[0.03] rounded-full blur-[150px]"
        animate={{
          scale: [1.05, 1, 1.05],
          opacity: [0.6, 0.4, 0.6],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_70%)]" />
    </div>
  );
}

// Premium page wrapper with all effects
interface PremiumPageWrapperProps {
  children: React.ReactNode;
  className?: string;
  showGrain?: boolean;
  showParticles?: boolean;
  particleCount?: number;
  glowVariant?: 'default' | 'hero' | 'subtle';
}

export function PremiumPageWrapper({
  children,
  className = '',
  showGrain = true,
  showParticles = true,
  particleCount = 20,
  glowVariant = 'default',
}: PremiumPageWrapperProps) {
  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      <AmbientGlow variant={glowVariant} />
      {showParticles && <FloatingParticles count={particleCount} />}
      {showGrain && <GrainOverlay />}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// Cinematic text reveal
interface RevealTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right';
}

export function RevealText({ 
  children, 
  className = '',
  delay = 0,
  direction = 'up'
}: RevealTextProps) {
  const initial = {
    up: { opacity: 0, y: 50, filter: 'blur(10px)' },
    left: { opacity: 0, x: -50, filter: 'blur(10px)' },
    right: { opacity: 0, x: 50, filter: 'blur(10px)' },
  };

  return (
    <motion.div
      initial={initial[direction]}
      whileInView={{ opacity: 1, y: 0, x: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ 
        duration: 1, 
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Animated divider line
export function AnimatedLine({ className = '' }: { className?: string }) {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className={`h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent origin-left ${className}`}
    />
  );
}

// Section divider with dot
export function SectionDivider() {
  return (
    <div className="relative h-24 md:h-32 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-1.5 h-1.5 rounded-full bg-accent/40"
      />
      <motion.div
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute w-px h-full bg-gradient-to-b from-transparent via-accent/15 to-transparent"
      />
    </div>
  );
}
