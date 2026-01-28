import { motion } from 'framer-motion';
import { Shield, Clock, RefreshCw, CheckCircle, CreditCard, ShieldCheck, Lock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { packages } from '../wizardConfig';
import { CountdownTimer } from '@/components/CountdownTimer';

interface CheckoutTrustSectionProps {
  selectedPackage: string;
  isPostDemoFlow?: boolean;
}

export function CheckoutTrustSection({ selectedPackage, isPostDemoFlow = false }: CheckoutTrustSectionProps) {
  const { t } = useLanguage();
  
  const pkg = packages.find(p => p.id === selectedPackage);
  const deliveryDays = pkg?.delivery || 10;

  return (
    <div className="space-y-4">
      {/* Limited Time Countdown */}
      <CountdownTimer variant="compact" className="w-full justify-center" />
      
      {/* Main Trust Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 bg-gradient-to-br from-accent/5 to-accent/10 rounded-xl border border-accent/20 space-y-4"
      >
        {/* Trust Badges Row */}
        <div className="flex flex-wrap items-center justify-center gap-4 pb-4 border-b border-accent/10">
          <div className="flex items-center gap-2 text-sm">
            <Lock className="w-4 h-4 text-accent" />
            <span>{t('256-bit SSL', '256-bit SSL')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Shield className="w-4 h-4 text-accent" />
            <span>{t('Stripe-säkrad', 'Stripe-secured')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <span>{t('Pengarna tillbaka', 'Money back')}</span>
          </div>
        </div>

        {/* Secure Payment Badge */}
        <div className="flex items-center gap-3 pb-4 border-b border-accent/10">
          <div className="p-2 bg-accent/20 rounded-lg">
            <Shield className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="font-semibold">{t('Säker betalning via Stripe', 'Secure payment via Stripe')}</p>
            <p className="text-xs text-muted-foreground">{t('Bankkort, Klarna, Apple Pay & mer', 'Credit card, Klarna, Apple Pay & more')}</p>
          </div>
          <CreditCard className="w-8 h-8 ml-auto text-muted-foreground/50" />
        </div>

        {/* What Happens Next */}
        <div>
          <h4 className="font-medium text-sm mb-3 text-muted-foreground">
            {t('Vad händer härnäst?', 'What happens next?')}
          </h4>
          <ul className="space-y-3">
            {isPostDemoFlow && (
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">{t('Koncept godkänt', 'Concept approved')}</p>
                  <p className="text-xs text-muted-foreground">
                    {t('Din konceptavgift är redan avdragen', 'Your concept fee has been deducted')}
                  </p>
                </div>
              </li>
            )}
            
            <li className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">
                  {t('Leverans inom', 'Delivery within')} {deliveryDays} {t('dagar', 'days')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {pkg?.name} {t('paket', 'package')} — {t('Alla paket levereras inom 7 dagar', 'All packages delivered within 7 days')}
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <RefreshCw className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">{t('Gratis revisioner ingår', 'Free revisions included')}</p>
                <p className="text-xs text-muted-foreground">
                  {pkg?.id === 'starter' && t('10 revisioner', '10 revisions')}
                  {pkg?.id === 'standard' && t('20 revisioner', '20 revisions')}
                  {pkg?.id === 'pro' && t('Obegränsade revisioner', 'Unlimited revisions')}
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* Money-Back Guarantee */}
        <div className="pt-3 border-t border-accent/10 bg-green-500/5 -mx-6 px-6 pb-0 -mb-6 rounded-b-xl">
          <div className="flex items-start gap-3 py-4">
            <ShieldCheck className="w-6 h-6 text-green-500 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm mb-1">{t('100% Nöjd-garanti', '100% Satisfaction Guarantee')}</p>
              <p className="text-xs text-muted-foreground">
                {t(
                  'Om du inte är nöjd med slutresultatet efter alla inkluderade revisioner, kontakta oss så löser vi det. 5 dagars full ångerrätt på konceptet.',
                  "If you're not satisfied with the final result after all included revisions, contact us and we'll work it out. 5-day full refund on concept."
                )}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
