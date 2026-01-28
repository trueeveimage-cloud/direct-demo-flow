import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
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
        <div className="relative">
          <div className="absolute inset-0 bg-red-500 blur-md opacity-50" />
          <div className="relative bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            -25%
          </div>
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
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-amber-500 blur-lg opacity-40" />
          <div className="relative bg-gradient-to-r from-red-600 via-red-500 to-amber-500 text-white font-bold px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 border border-white/20">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">{t('25% RABATT', '25% SALE')}</span>
          </div>
        </div>
      </motion.div>
    );
  }

  // Default inline variant
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-bold shadow-lg ${className}`}
    >
      <Sparkles className="w-3 h-3" />
      {t('25% RABATT', '25% SALE')}
    </motion.span>
  );
}
