import { useState, useEffect, useRef } from 'react';

interface UseAnimatedCounterOptions {
  duration?: number;
  delay?: number;
  easing?: (t: number) => number;
}

// Easing function for smooth animation
const easeOutExpo = (t: number): number => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

export function useAnimatedCounter(
  endValue: number,
  isActive: boolean,
  options: UseAnimatedCounterOptions = {}
) {
  const { duration = 2000, delay = 0, easing = easeOutExpo } = options;
  const [currentValue, setCurrentValue] = useState(0);
  const startTime = useRef<number | null>(null);
  const animationFrame = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive) {
      setCurrentValue(0);
      return;
    }

    const animate = (timestamp: number) => {
      if (!startTime.current) {
        startTime.current = timestamp + delay;
      }

      const elapsed = timestamp - startTime.current;

      if (elapsed < 0) {
        animationFrame.current = requestAnimationFrame(animate);
        return;
      }

      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easing(progress);
      const newValue = Math.round(easedProgress * endValue);

      setCurrentValue(newValue);

      if (progress < 1) {
        animationFrame.current = requestAnimationFrame(animate);
      }
    };

    animationFrame.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      startTime.current = null;
    };
  }, [endValue, isActive, duration, delay, easing]);

  return currentValue;
}

// Component for animated currency display
interface AnimatedCurrencyProps {
  value: number;
  isActive: boolean;
  duration?: number;
  delay?: number;
  className?: string;
}

export function AnimatedCurrency({ 
  value, 
  isActive, 
  duration = 2000, 
  delay = 0,
  className = '' 
}: AnimatedCurrencyProps) {
  const animatedValue = useAnimatedCounter(value, isActive, { duration, delay });
  
  const formatted = new Intl.NumberFormat('en-EU', { 
    style: 'currency', 
    currency: 'EUR',
    maximumFractionDigits: 0 
  }).format(animatedValue);

  return <span className={className}>{formatted}</span>;
}
