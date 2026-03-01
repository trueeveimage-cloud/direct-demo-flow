import React from 'react';

// Film grain overlay for premium feel - pure CSS, zero JS overhead
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

// REMOVED: FloatingParticles was causing constant GPU repaints with 15-20 framer-motion elements
// Replaced with a static CSS-only version for subtle ambiance
export function FloatingParticles({ count = 20 }: { count?: number }) {
  // Return null - removed for performance. The grain overlay + ambient glow provide enough atmosphere.
  return null;
}

// Ambient glow backgrounds - static CSS only, no scroll tracking
export function AmbientGlow({ variant = 'default' }: { variant?: 'default' | 'hero' | 'subtle' }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-accent/[0.03] rounded-full blur-[180px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/[0.02] rounded-full blur-[150px]" />
    </div>
  );
}

// REMOVED scroll-linked transforms - replaced with pure CSS static glow
export function ScrollingAmbientGlow() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden hidden md:block motion-reduce:hidden">
      <div className="absolute top-[20%] left-[15%] w-[500px] h-[500px] bg-accent/[0.04] rounded-full blur-[150px]" />
      <div className="absolute bottom-[20%] right-[15%] w-[400px] h-[400px] bg-accent/[0.03] rounded-full blur-[120px]" />
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
      {showGrain && <GrainOverlay />}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// Cinematic text reveal - REMOVED blur filter (expensive GPU op)
import { motion } from 'framer-motion';

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
    up: { opacity: 0, y: 30 },
    left: { opacity: 0, x: -30 },
    right: { opacity: 0, x: 30 },
  };

  return (
    <motion.div
      initial={initial[direction]}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ 
        duration: 0.6, 
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
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent origin-left ${className}`}
    />
  );
}

// Section divider with dot
export function SectionDivider() {
  return (
    <div className="relative h-24 md:h-32 flex items-center justify-center">
      <div className="w-1.5 h-1.5 rounded-full bg-accent/40" />
      <div className="absolute w-px h-full bg-gradient-to-b from-transparent via-accent/15 to-transparent" />
    </div>
  );
}
