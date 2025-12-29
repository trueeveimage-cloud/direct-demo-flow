import { motion } from 'framer-motion';
import { Shield, Clock, RefreshCw, CheckCircle, CreditCard } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { packages } from '../wizardConfig';

interface CheckoutTrustSectionProps {
  selectedPackage: string;
  isPostDemoFlow?: boolean;
}

export function CheckoutTrustSection({ selectedPackage, isPostDemoFlow = false }: CheckoutTrustSectionProps) {
  const { t } = useLanguage();
  
  const pkg = packages.find(p => p.id === selectedPackage);
  const deliveryDays = pkg?.delivery || 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="p-6 bg-gradient-to-br from-accent/5 to-accent/10 rounded-xl border border-accent/20 space-y-4"
    >
      {/* Secure Payment Badge */}
      <div className="flex items-center gap-3 pb-4 border-b border-accent/10">
        <div className="p-2 bg-accent/20 rounded-lg">
          <Shield className="w-5 h-5 text-accent" />
        </div>
        <div>
          <p className="font-semibold">{t('Säker betalning via Stripe', 'Secure payment via Stripe')}</p>
          <p className="text-xs text-muted-foreground">{t('256-bit SSL-kryptering', '256-bit SSL encryption')}</p>
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
                  {t('Din konceptavgift (€50) är redan avdragen', 'Your concept fee (€50) has been deducted')}
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
                {pkg?.name} {t('paket', 'package')} — {t('Starter 14d / Standard 10d / Pro 7d', 'Starter 14d / Standard 10d / Pro 7d')}
              </p>
            </div>
          </li>

          <li className="flex items-start gap-3">
            <RefreshCw className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">{t('Gratis revisioner ingår', 'Free revisions included')}</p>
              <p className="text-xs text-muted-foreground">
                {pkg?.id === 'starter' && t('1 revision', '1 revision')}
                {pkg?.id === 'standard' && t('2 revisioner', '2 revisions')}
                {pkg?.id === 'pro' && t('3 revisioner', '3 revisions')}
              </p>
            </div>
          </li>
        </ul>
      </div>

      {/* Refund Policy */}
      <div className="pt-3 border-t border-accent/10">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{t('Återbetalning:', 'Refund policy:')}</span>{' '}
          {t(
            'Om du inte är nöjd med slutresultatet efter alla inkluderade revisioner, kontakta oss så löser vi det.',
            'If you\'re not satisfied with the final result after all included revisions, contact us and we\'ll work it out.'
          )}
        </p>
      </div>
    </motion.div>
  );
}
