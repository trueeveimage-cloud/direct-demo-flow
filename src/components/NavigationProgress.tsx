import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export function NavigationProgress() {
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const location = useLocation();

  useEffect(() => {
    // Start loading animation
    setIsNavigating(true);
    setProgress(0);

    // Animate progress
    const timer1 = setTimeout(() => setProgress(30), 50);
    const timer2 = setTimeout(() => setProgress(60), 150);
    const timer3 = setTimeout(() => setProgress(90), 300);
    const timer4 = setTimeout(() => {
      setProgress(100);
      // Hide after completion
      setTimeout(() => setIsNavigating(false), 200);
    }, 400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed top-0 left-0 right-0 z-[99999] h-1 bg-background/50 backdrop-blur-sm"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-accent via-amber-400 to-accent"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ 
              duration: 0.2, 
              ease: [0.4, 0, 0.2, 1]
            }}
            style={{
              boxShadow: '0 0 10px hsl(var(--accent)), 0 0 30px hsl(var(--accent) / 0.5)'
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
