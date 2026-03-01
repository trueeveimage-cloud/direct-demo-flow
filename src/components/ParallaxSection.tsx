import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  floatingElements?: boolean;
  accentGlow?: boolean;
  skewOnScroll?: boolean;
  scaleOnView?: boolean;
  rotate3D?: boolean;
}

// Simplified: removed useSpring (expensive), removed 3D transforms, removed floating elements
export const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  className,
  speed = 0.5,
  accentGlow = false,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Simple parallax Y - no spring, no 3D
  const y = useTransform(scrollYProgress, [0, 1], [50 * speed, -50 * speed]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      {accentGlow && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent/[0.05] rounded-full blur-[100px]" />
        </div>
      )}
      <motion.div style={{ y }} className="relative z-10">
        {children}
      </motion.div>
    </div>
  );
};

// Floating geometric shapes - removed
export const FloatingShapes: React.FC<{ className?: string }> = () => null;

// Letter-by-letter text reveal - REMOVED blur and 3D rotation (major perf hit)
interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className,
  delay = 0,
  stagger = 0.03,
}) => {
  const letters = text.split('');

  return (
    <motion.span
      className={cn("inline-flex flex-wrap", className)}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          className="inline-block"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
            },
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.span>
  );
};

// 3D tilt card - simplified to CSS-only hover
interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

export const TiltCard: React.FC<TiltCardProps> = ({ children, className }) => {
  return (
    <div className={cn("h-full transition-transform duration-300 hover:scale-[1.01]", className)}>
      {children}
    </div>
  );
};
