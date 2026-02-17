import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface SaleBadgeProps {
  className?: string;
  variant?: 'floating' | 'inline' | 'corner';
}

export function SaleBadge({ className = '', variant = 'inline' }: SaleBadgeProps) {
  const { t } = useLanguage();

  if (variant === 'corner') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -12 }}
        animate={{ opacity: 1, scale: 1, rotate: -12 }}
        className={`absolute -top-2 -right-2 z-20 ${className}`}
      >
        <div className="px-3 py-1 rounded-lg bg-gradient-to-br from-amber-500/25 to-amber-400/15 border border-amber-400/50 backdrop-blur-sm">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-amber-600 dark:text-transparent dark:bg-gradient-to-r dark:from-amber-300 dark:via-yellow-200 dark:to-amber-400 dark:bg-clip-text">-25%</span>
        </div>
      </motion.div>
    );
  }

  if (variant === 'floating') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className={`fixed top-20 right-4 z-50 ${className}`}
      >
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-400/10 border border-amber-400/40 backdrop-blur-xl shadow-sm shadow-amber-500/10">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-sm font-bold tracking-wide text-amber-600 dark:text-transparent dark:bg-gradient-to-r dark:from-amber-300 dark:via-yellow-200 dark:to-amber-400 dark:bg-clip-text">{t('25% rabatt', '25% off')}</span>
        </div>
      </motion.div>
    );
  }

  // Default inline variant
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-400/10 border border-amber-400/40 text-xs font-bold tracking-wide ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
      <span className="text-amber-600 dark:text-transparent dark:bg-gradient-to-r dark:from-amber-300 dark:via-yellow-200 dark:to-amber-400 dark:bg-clip-text">{t('25% rabatt', '25% off')}</span>
    </motion.span>
  );
}
