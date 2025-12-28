import { motion } from 'framer-motion';
import { Calendar, Settings, TrendingUp, Check, Gift, Sparkles, LayoutDashboard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface CheckoutUpsellsProps {
  businessType: string;
  wantsBooking: boolean | null;
  selectedPackage: string;
  onAddBooking?: () => void;
  onAddAdminPanel?: () => void;
}

// Business types that typically need booking
const bookingBusinessTypes = ['barber', 'nail', 'gym', 'clinic', 'cleaning'];

export function CheckoutUpsells({ 
  businessType, 
  wantsBooking, 
  selectedPackage,
  onAddBooking,
  onAddAdminPanel 
}: CheckoutUpsellsProps) {
  const { t } = useLanguage();
  
  const shouldShowBookingUpsell = !wantsBooking && bookingBusinessTypes.includes(businessType);
  
  return (
    <div className="space-y-4">
      {/* Booking System Upsell */}
      {shouldShowBookingUpsell && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden"
        >
          <Card className="border-2 border-accent/30 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{t('Bokningssystem', 'Booking System')}</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {t('Ökar konverteringar och minskar missade leads.', 'Increases conversions and reduces missed leads.')}
                  </p>
                  <ul className="space-y-1.5 mb-4">
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-accent" />
                      {t('Kunder bokar 24/7', 'Customers book 24/7')}
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-accent" />
                      {t('Automatiska påminnelser', 'Automatic reminders')}
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-accent" />
                      {t('Färre no-shows', 'Fewer no-shows')}
                    </li>
                  </ul>
                  <div className="flex items-center gap-3">
                    <Button onClick={onAddBooking} size="sm" className="gap-2">
                      <Calendar className="w-4 h-4" />
                      {t('Lägg till', 'Add')} +2 000 kr
                    </Button>
                    {selectedPackage === 'pro' && (
                      <span className="text-xs text-accent font-medium">{t('Ingår redan i Pro!', 'Already included in Pro!')}</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Admin Panel Upsell */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden"
      >
        <Card className="border border-border/50 hover:border-accent/30 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                <LayoutDashboard className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">{t('Adminpanel', 'Admin Panel')}</h4>
                  <span className="text-xs px-2 py-0.5 bg-accent/20 text-accent rounded-full font-medium">{t('Populär', 'Popular')}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {t('Se besökarstatistik, redigera innehåll, och hantera din webbplats.', 'View visitor stats, edit content, and manage your website.')}
                </p>
                <ul className="space-y-1.5 mb-4">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-accent" />
                    {t('Se var besökare kommer ifrån', 'See where visitors come from')}
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-accent" />
                    {t('Redigera texter & bilder', 'Edit text & images')}
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-accent" />
                    {t('Enkel kontrollpanel', 'Simple control panel')}
                  </li>
                </ul>
                <Button onClick={onAddAdminPanel} variant="outline" size="sm" className="gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  {t('Lägg till', 'Add')} +1 000 kr
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export function FreeInclusions() {
  const { t } = useLanguage();
  
  const freeFeatures = [
    { label: { sv: 'Mobilanpassad design', en: 'Mobile responsive design' }, icon: '📱' },
    { label: { sv: 'Google Maps-inbäddning', en: 'Google Maps embed' }, icon: '📍' },
    { label: { sv: 'Kassasystem', en: 'Checkout system' }, icon: '💳' },
    { label: { sv: 'Google Recensioner-sektion', en: 'Google Reviews section' }, icon: '⭐' },
    { label: { sv: 'Före/Efter-sektion', en: 'Before/After section' }, icon: '🔄' },
    { label: { sv: 'SSL-certifikat', en: 'SSL certificate' }, icon: '🔒' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-2 border-green-500/30 bg-gradient-to-br from-green-500/5 to-transparent">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Gift className="w-5 h-5 text-green-500" />
            <h4 className="font-semibold">{t('Ingår GRATIS', 'Included FREE')}</h4>
            <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-500 rounded-full font-medium">
              {t('Begränsad tid', 'Limited time')}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {freeFeatures.map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-sm p-2 rounded-lg bg-background/50">
                <span>{feature.icon}</span>
                <span>{t(feature.label.sv, feature.label.en)}</span>
                <span className="ml-auto text-xs font-bold text-green-500">FREE</span>
              </div>
            ))}
          </div>
          
          <p className="text-xs text-muted-foreground mt-3 text-center">
            {t('Gratis inkluderingar för begränsad tid.', 'Free inclusions for limited time.')}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
