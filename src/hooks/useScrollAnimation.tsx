import { useEffect, useRef, useState } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const { threshold = 0.1, rootMargin = '50px', triggerOnce = true } = options;
  const ref = useRef<HTMLDivElement>(null);
  // Start as visible to prevent flash on initial render, then set to false after mount
  const [isVisible, setIsVisible] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // Small delay to prevent initial flash - element starts visible, then we track intersection
    const mountTimer = setTimeout(() => {
      setHasMounted(true);
      setIsVisible(false);
    }, 50);

    return () => clearTimeout(mountTimer);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;
    
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce, hasMounted]);

  return { ref, isVisible };
};
