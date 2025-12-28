import { memo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Star, Camera, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { WizardFormData } from './wizardConfig';

interface CheckoutUpsellsProps {
  formData: WizardFormData;
  setFormData: (data: WizardFormData) => void;
}

// Business types that benefit from booking
const bookingBusinessTypes = ['barber', 'nail', 'gym', 'clinic', 'cleaning'];

// Business types that benefit from before/after
const beforeAfterBusinessTypes = ['barber', 'nail', 'car', 'cleaning', 'clinic'];

function CheckoutUpsellsComponent({ formData, setFormData }: CheckoutUpsellsProps) {
  const { t } = useLanguage();

  const showBookingUpsell = !formData.wantsBooking && bookingBusinessTypes.includes(formData.businessType);
  const showReviewsUpsell = !formData.wantsGoogleReviews;
  const showBeforeAfterUpsell = !formData.wantsBeforeAfter && beforeAfterBusinessTypes.includes(formData.businessType);

  if (!showBookingUpsell && !showReviewsUpsell && !showBeforeAfterUpsell) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-accent" />
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          {t('Rekommenderade tillägg', 'Recommended add-ons')}
        </h3>
      </div>

      {/* Booking System Upsell */}
      {showBookingUpsell && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-accent/5 border border-accent/20 rounded-xl space-y-3"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm">{t('Bokningssystem', 'Booking System')}</h4>
              <p className="text-xs text-muted-foreground mt-1">
                {t(
                  'Öka konverteringar och minska missade leads med online-bokning.',
                  'Increase conversions and reduce missed leads with online booking.'
                )}
              </p>
              <ul className="mt-2 space-y-1">
                {[
                  t('Kunder bokar direkt', 'Customers book directly'),
                  t('Automatiska påminnelser', 'Automatic reminders'),
                  t('Minska no-shows', 'Reduce no-shows'),
                ].map((benefit, i) => (
                  <li key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Check className="w-3 h-3 text-accent" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full border-accent/30 hover:bg-accent/10"
            onClick={() => setFormData({ ...formData, wantsBooking: true })}
          >
            {t('Lägg till bokning', 'Add booking')}
          </Button>
        </motion.div>
      )}

      {/* Google Reviews Upsell */}
      {showReviewsUpsell && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl space-y-3"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm">{t('Google Recensioner', 'Google Reviews')}</h4>
              <p className="text-xs text-muted-foreground mt-1">
                {t(
                  'Visa dina recensioner direkt på hemsidan för ökat förtroende.',
                  'Display your reviews directly on the website for increased trust.'
                )}
              </p>
              <ul className="mt-2 space-y-1">
                {[
                  t('Ökar förtroende', 'Increases trust'),
                  t('Högre konvertering', 'Higher conversion'),
                ].map((benefit, i) => (
                  <li key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Check className="w-3 h-3 text-yellow-500" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full border-yellow-500/30 hover:bg-yellow-500/10"
            onClick={() => setFormData({ ...formData, wantsGoogleReviews: true })}
          >
            {t('Lägg till recensioner', 'Add reviews')}
          </Button>
        </motion.div>
      )}

      {/* Before/After Upsell */}
      {showBeforeAfterUpsell && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl space-y-3"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
              <Camera className="w-5 h-5 text-purple-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm">{t('Före/Efter-sektion', 'Before/After Section')}</h4>
              <p className="text-xs text-muted-foreground mt-1">
                {t(
                  'Visa dina resultat med interaktiva före/efter-bilder.',
                  'Show your results with interactive before/after images.'
                )}
              </p>
              <ul className="mt-2 space-y-1">
                {[
                  t('Visar kvalitet', 'Shows quality'),
                  t('Ökar konverteringar', 'Increases conversions'),
                ].map((benefit, i) => (
                  <li key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Check className="w-3 h-3 text-purple-500" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full border-purple-500/30 hover:bg-purple-500/10"
            onClick={() => setFormData({ ...formData, wantsBeforeAfter: true })}
          >
            {t('Lägg till före/efter', 'Add before/after')}
          </Button>
        </motion.div>
      )}
    </div>
  );
}

export const CheckoutUpsells = memo(CheckoutUpsellsComponent);
