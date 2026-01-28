import { motion } from 'framer-motion';
import { ShieldCheck, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface MoneyBackGuaranteeProps {
  className?: string;
  variant?: 'compact' | 'full' | 'badge';
}

export function MoneyBackGuarantee({ className = '', variant = 'compact' }: MoneyBackGuaranteeProps) {
  const { t } = useLanguage();

  if (variant === 'badge') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 text-sm font-medium ${className}`}
      >
        <ShieldCheck className="w-4 h-4" />
        <span>{t('Pengarna tillbaka-garanti', 'Money-back guarantee')}</span>
      </motion.div>
    );
  }

  if (variant === 'full') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-xl bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent border border-green-500/20 ${className}`}
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-green-500/20">
            <ShieldCheck className="w-8 h-8 text-green-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">
              {t('100% Nöjd-garanti', '100% Satisfaction Guarantee')}
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              {t(
                'Om du inte gillar ditt designkoncept får du pengarna tillbaka. Ingen risk, inga frågor ställda.',
                "If you don't like your design concept, you get your money back. No risk, no questions asked."
              )}
            </p>
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium">
              <RefreshCw className="w-4 h-4" />
              <span>{t('5 dagars ångerrätt', '5-day refund period')}</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Compact variant
  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      <ShieldCheck className="w-4 h-4 text-green-500" />
      <span className="text-muted-foreground">
        {t('Pengarna tillbaka om du inte gillar konceptet', "Money back if you don't like the concept")}
      </span>
    </div>
  );
}
