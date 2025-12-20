import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-in' | 'fade-left' | 'fade-right' | 'scale-in' | 'blur-in';
  delay?: number;
  duration?: number;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className,
  animation = 'fade-up',
  delay = 0,
  duration = 600,
}) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const baseStyles = 'transition-all ease-out';
  
  const animationStyles = {
    'fade-up': {
      hidden: 'opacity-0 translate-y-8',
      visible: 'opacity-100 translate-y-0',
    },
    'fade-in': {
      hidden: 'opacity-0',
      visible: 'opacity-100',
    },
    'fade-left': {
      hidden: 'opacity-0 -translate-x-8',
      visible: 'opacity-100 translate-x-0',
    },
    'fade-right': {
      hidden: 'opacity-0 translate-x-8',
      visible: 'opacity-100 translate-x-0',
    },
    'scale-in': {
      hidden: 'opacity-0 scale-95',
      visible: 'opacity-100 scale-100',
    },
    'blur-in': {
      hidden: 'opacity-0 blur-sm',
      visible: 'opacity-100 blur-0',
    },
  };

  const currentAnimation = animationStyles[animation];

  return (
    <div
      ref={ref}
      className={cn(
        baseStyles,
        isVisible ? currentAnimation.visible : currentAnimation.hidden,
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};
