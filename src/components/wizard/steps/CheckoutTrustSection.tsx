import { motion } from 'framer-motion';
import { Shield, Clock, RefreshCw, CheckCircle, CreditCard, ShieldCheck, Lock, Star, Award, BadgeCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { packages } from '../wizardConfig';
import { CountdownTimer } from '@/components/CountdownTimer';
import { useRemainingSpots } from '@/hooks/useRemainingSpots';

interface CheckoutTrustSectionProps {
  selectedPackage: string;
  isPostDemoFlow?: boolean;
}

export function CheckoutTrustSection({ selectedPackage, isPostDemoFlow = false }: CheckoutTrustSectionProps) {
  const { t } = useLanguage();
  const { remainingSpots, isLoading: spotsLoading } = useRemainingSpots();
  
  const pkg = packages.find(p => p.id === selectedPackage);
  const deliveryDays = pkg?.delivery || 10;

  return (
    <div className="space-y-4">
      {/* Urgency Bar - Limited Spots + Countdown */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-accent/5 to-amber-500/10 border border-amber-500/20"
      >
        {/* Spots Left */}
        {!spotsLoading && remainingSpots > 0 && remainingSpots <= 5 && (
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-amber-400">
              {t('Endast', 'Only')} {remainingSpots} {t('platser kvar denna vecka', 'spots left this week')}
            </span>
          </div>
        )}
        
        {/* Countdown */}
        <CountdownTimer variant="compact" className="border-0 bg-transparent p-0" />
      </motion.div>

      {/* Premium Trust Badges */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-2"
      >
        <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-secondary/50 border border-border/50">
          <Lock className="w-5 h-5 text-accent" />
          <span className="text-[10px] sm:text-xs text-center font-medium">{t('256-bit SSL', '256-bit SSL')}</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-secondary/50 border border-border/50">
          <Shield className="w-5 h-5 text-accent" />
          <span className="text-[10px] sm:text-xs text-center font-medium">{t('Stripe-säkrad', 'Stripe-secured')}</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
          <ShieldCheck className="w-5 h-5 text-green-500" />
          <span className="text-[10px] sm:text-xs text-center font-medium text-green-400">{t('Pengarna tillbaka', 'Money back')}</span>
        </div>
      </motion.div>

      {/* Money-Back Guarantee - Prominent */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="p-5 bg-gradient-to-br from-green-500/15 via-green-500/10 to-green-500/5 rounded-xl border border-green-500/30"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-green-500/20 rounded-full">
            <Award className="w-6 h-6 text-green-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-green-400 mb-1">{t('100% Nöjd-garanti', '100% Satisfaction Guarantee')}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t(
                'Älskar du inte resultatet? Få full återbetalning inom 5 dagar. Vi tar all risk – du betalar bara för det du gillar.',
                "Don't love the result? Get a full refund within 5 days. We take all the risk – you only pay for what you love."
              )}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Customer Testimonial - Social Proof */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-4 rounded-xl bg-secondary/30 border border-border/50"
      >
        <div className="flex gap-0.5 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent" />
          ))}
        </div>
        <blockquote className="text-sm italic text-foreground mb-2">
          "{t(
            'Jag var skeptisk till att beställa online, men de levererade precis vad jag ville. Fantastisk service!',
            'I was skeptical about ordering online, but they delivered exactly what I wanted. Amazing service!'
          )}"
        </blockquote>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
            <BadgeCheck className="w-4 h-4 text-accent" />
          </div>
          <cite className="text-xs text-muted-foreground not-italic">
            — Erik S., {t('Restaurangägare', 'Restaurant Owner')}
          </cite>
        </div>
      </motion.div>

      {/* What Happens Next - Simplified */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="p-4 rounded-xl bg-secondary/20 border border-border/30"
      >
        <h4 className="font-medium text-sm mb-3 text-muted-foreground flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-accent" />
          {t('Efter betalning', 'After payment')}
        </h4>
        <ul className="space-y-2 text-sm">
          {isPostDemoFlow && (
            <li className="flex items-center gap-2 text-accent">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{t('Din konceptavgift avdragen', 'Concept fee deducted')}</span>
            </li>
          )}
          <li className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-accent flex-shrink-0" />
            <span>{t('Leverans inom', 'Delivery within')} {deliveryDays} {t('dagar', 'days')}</span>
          </li>
          <li className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-accent flex-shrink-0" />
            <span>
              {pkg?.id === 'starter' && t('10 revisioner ingår', '10 revisions included')}
              {pkg?.id === 'standard' && t('20 revisioner ingår', '20 revisions included')}
              {pkg?.id === 'pro' && t('Obegränsade revisioner', 'Unlimited revisions')}
            </span>
          </li>
          <li className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-accent flex-shrink-0" />
            <span>{t('Bekräftelsemail direkt', 'Confirmation email instantly')}</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
}
