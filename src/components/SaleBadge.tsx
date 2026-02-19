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
        <div className="px-3 py-1 rounded-lg bg-accent/15 border border-accent/40 backdrop-blur-sm">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent">-25%</span>
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
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/15 border border-accent/40 backdrop-blur-xl shadow-sm shadow-accent/10">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-sm font-bold tracking-wide text-accent">{t('25% rabatt', '25% off')}</span>
        </div>
      </motion.div>
    );
  }

  // Default inline variant
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/15 border border-accent/40 text-xs font-bold tracking-wide ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
      <span className="text-accent">{t('25% rabatt', '25% off')}</span>
    </motion.span>
  );
}
