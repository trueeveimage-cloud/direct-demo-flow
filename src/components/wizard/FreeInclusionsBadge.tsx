import { memo } from 'react';
import { motion } from 'framer-motion';
import { Gift, Check, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface FreeInclusionsBadgeProps {
  showBeforeAfter?: boolean;
  showReviews?: boolean;
}

function FreeInclusionsBadgeComponent({ showBeforeAfter = false, showReviews = false }: FreeInclusionsBadgeProps) {
  const { t } = useLanguage();

  const freeItems = [
    { id: 'mobile', label: t('Mobilanpassad', 'Mobile responsive'), price: '1 500 kr' },
    { id: 'maps', label: t('Google Maps', 'Google Maps'), price: '500 kr' },
    { id: 'checkout', label: t('Kassasystem', 'Checkout system'), price: '2 000 kr' },
    ...(showReviews ? [{ id: 'reviews', label: t('Google Recensioner', 'Google Reviews'), price: '1 000 kr' }] : []),
    ...(showBeforeAfter ? [{ id: 'beforeafter', label: t('Före/Efter-sektion', 'Before/After section'), price: '800 kr' }] : []),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/30 rounded-xl relative overflow-hidden"
    >
      {/* Limited time badge */}
      <div className="absolute top-0 right-0">
        <div className="bg-accent text-accent-foreground text-[10px] font-bold px-2 py-0.5 rounded-bl-lg flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5" />
          {t('Begränsad tid', 'Limited time')}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Gift className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-sm">{t('Ingår GRATIS', 'Included FREE')}</h3>
      </div>

      <div className="space-y-2">
        {freeItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-accent" />
              <span>{item.label}</span>
            </div>
            <span className="text-muted-foreground line-through text-xs">{item.price}</span>
          </motion.div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-accent/20 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{t('Totalt värde', 'Total value')}</span>
        <span className="font-bold text-accent line-through">
          {(1500 + 500 + 2000 + (showReviews ? 1000 : 0) + (showBeforeAfter ? 800 : 0)).toLocaleString()} kr
        </span>
      </div>
    </motion.div>
  );
}

export const FreeInclusionsBadge = memo(FreeInclusionsBadgeComponent);
