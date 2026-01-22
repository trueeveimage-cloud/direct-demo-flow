import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  /** Speed multiplier: positive = moves slower than scroll, negative = moves opposite */
  speed?: number;
  /** Add floating elements in background */
  floatingElements?: boolean;
  /** Background gradient accent color */
  accentGlow?: boolean;
  /** Horizontal skew on scroll */
  skewOnScroll?: boolean;
  /** Scale up slightly as it comes into view */
  scaleOnView?: boolean;
  /** Rotate 3D effect */
  rotate3D?: boolean;
}

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  className,
  speed = 0.5,
  floatingElements = false,
  accentGlow = false,
  skewOnScroll = false,
  scaleOnView = false,
  rotate3D = false,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Parallax Y movement
  const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed]);
  const smoothY = useSpring(y, { damping: 30, stiffness: 100 });

  // Optional effects
  const skewX = useTransform(scrollYProgress, [0, 0.5, 1], [skewOnScroll ? 2 : 0, 0, skewOnScroll ? -2 : 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [scaleOnView ? 0.95 : 1, 1, 1, scaleOnView ? 0.95 : 1]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [rotate3D ? 5 : 0, 0, rotate3D ? -5 : 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      {/* Background floating shapes */}
      {floatingElements && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden hidden md:block">
          <motion.div
            style={{ y: useTransform(scrollYProgress, [0, 1], [0, -150]) }}
            className="absolute top-[10%] left-[5%] w-24 h-24 rounded-full bg-accent/10 blur-2xl"
          />
          <motion.div
            style={{ y: useTransform(scrollYProgress, [0, 1], [0, 200]) }}
            className="absolute top-[60%] right-[10%] w-32 h-32 rounded-full bg-accent/15 blur-3xl"
          />
          <motion.div
            style={{ y: useTransform(scrollYProgress, [0, 1], [50, -100]) }}
            className="absolute top-[30%] right-[30%] w-16 h-16 rounded-full bg-accent/20 blur-xl"
          />
        </div>
      )}

      {/* Accent glow background */}
      {accentGlow && (
        <motion.div
          style={{ opacity: useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 0.5, 0]) }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent/10 rounded-full blur-[100px]" />
        </motion.div>
      )}

      {/* Main content with parallax */}
      <motion.div
        style={{
          y: smoothY,
          skewX,
          scale,
          rotateX,
          opacity,
          transformPerspective: 1000,
        }}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
};

// Floating geometric shapes for visual flair
export const FloatingShapes: React.FC<{ className?: string }> = ({ className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  return (
    <div ref={ref} className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)}>
      {/* Triangle */}
      <motion.div
        style={{
          y: useTransform(scrollYProgress, [0, 1], [0, -200]),
          rotate: useTransform(scrollYProgress, [0, 1], [0, 180]),
          scale: useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.8]),
        }}
        className="absolute top-[15%] left-[8%] hidden md:block"
      >
        <div className="w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[50px] border-b-accent/20" />
      </motion.div>

      {/* Circle */}
      <motion.div
        style={{
          y: useTransform(scrollYProgress, [0, 1], [100, -100]),
          scale: useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.3, 1]),
        }}
        className="absolute top-[40%] right-[12%] w-16 h-16 rounded-full border-2 border-accent/30 hidden md:block"
      />

      {/* Square */}
      <motion.div
        style={{
          y: useTransform(scrollYProgress, [0, 1], [-50, 150]),
          rotate: useTransform(scrollYProgress, [0, 1], [0, 90]),
        }}
        className="absolute bottom-[25%] left-[15%] w-12 h-12 border-2 border-accent/20 hidden md:block"
      />

      {/* Dots pattern */}
      <motion.div
        style={{
          y: useTransform(scrollYProgress, [0, 1], [0, -80]),
          opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.6, 0.3]),
        }}
        className="absolute top-[60%] right-[25%] hidden md:block"
      >
        <div className="grid grid-cols-3 gap-3">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-accent/40" />
          ))}
        </div>
      </motion.div>

      {/* Lines */}
      <motion.div
        style={{
          y: useTransform(scrollYProgress, [0, 1], [50, -50]),
          scaleX: useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1, 0.5]),
        }}
        className="absolute top-[75%] left-[40%] w-32 h-0.5 bg-gradient-to-r from-transparent via-accent/30 to-transparent hidden md:block"
      />
    </div>
  );
};

// Letter-by-letter text reveal animation
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
      style={{ perspective: 1000 }}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          className="inline-block"
          style={{ transformStyle: 'preserve-3d' }}
          variants={{
            hidden: {
              opacity: 0,
              y: 50,
              rotateX: -90,
              filter: 'blur(10px)',
            },
            visible: {
              opacity: 1,
              y: 0,
              rotateX: 0,
              filter: 'blur(0px)',
              transition: {
                type: 'spring' as const,
                damping: 12,
                stiffness: 100,
              },
            },
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.span>
  );
};

// 3D tilt card effect on hover
interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

export const TiltCard: React.FC<TiltCardProps> = ({ children, className }) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Much more subtle: divide by 80 instead of 20
    const rotateX = (y - centerY) / 80;
    const rotateY = (centerX - x) / 80;

    ref.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("transition-transform duration-300 ease-out", className)}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
};
