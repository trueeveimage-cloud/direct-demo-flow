import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface ScrollTriggeredCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}

export function ScrollTriggeredCounter({
  end,
  duration = 2000,
  suffix = '',
  prefix = '',
  decimals = 0,
  className = ''
}: ScrollTriggeredCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();
    const startValue = 0;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function: ease-out-expo
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const currentValue = startValue + (end - startValue) * easeOutExpo;
      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  const displayValue = decimals > 0 
    ? count.toFixed(decimals)
    : Math.round(count).toLocaleString();

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {prefix}{displayValue}{suffix}
    </motion.span>
  );
}

// Animated percentage counter
export function PercentageCounter({
  end,
  duration = 2000,
  className = ''
}: Omit<ScrollTriggeredCounterProps, 'suffix'>) {
  return (
    <ScrollTriggeredCounter
      end={end}
      duration={duration}
      suffix="%"
      className={className}
    />
  );
}

// Animated currency counter
export function CurrencyCounter({
  end,
  duration = 2000,
  currency = '€',
  className = ''
}: Omit<ScrollTriggeredCounterProps, 'prefix'> & { currency?: string }) {
  return (
    <ScrollTriggeredCounter
      end={end}
      duration={duration}
      prefix={currency}
      className={className}
    />
  );
}
