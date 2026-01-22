import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="p-2 rounded-lg border border-border text-muted-foreground overflow-hidden">
        <Sun className="w-4 h-4" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors overflow-hidden relative w-9 h-9 flex items-center justify-center"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ 
            y: theme === 'dark' ? 20 : -20, 
            opacity: 0,
            rotate: theme === 'dark' ? 90 : -90,
            scale: 0.5
          }}
          animate={{ 
            y: 0, 
            opacity: 1,
            rotate: 0,
            scale: 1
          }}
          exit={{ 
            y: theme === 'dark' ? -20 : 20, 
            opacity: 0,
            rotate: theme === 'dark' ? -90 : 90,
            scale: 0.5
          }}
          transition={{ 
            duration: 0.3, 
            ease: [0.22, 1, 0.36, 1]
          }}
          className="absolute"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
