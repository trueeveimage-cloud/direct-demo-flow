import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, FileText, Calendar, CreditCard, Check, Sparkles, MapPin, Star, Image, ShoppingCart, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { packages, carePlans, BOOKING_ADDON_PRICE, VERIFICATION_FEE, type WizardFormData } from './wizardConfig';

const ADMIN_PANEL_PRICE = 100;

interface OrderSummaryProps {
  formData: WizardFormData;
  isPostDemoFlow?: boolean;
  onCheckout?: () => void;
  isLoading?: boolean;
  currentStep: number;
  addedAdminPanel?: boolean;
}

function OrderSummaryComponent({ 
  formData, 
  isPostDemoFlow = false, 
  onCheckout,
  isLoading = false,
  currentStep,
  addedAdminPanel = false
}: OrderSummaryProps) {
  const { t, lang } = useLanguage();
  
  const pkg = packages.find(p => p.id === formData.selectedPackage);
  const carePlan = carePlans.find(c => c.id === formData.selectedCarePlan);
  const carePlanPrice = carePlan ? (formData.isYearlyCarePlan ? carePlan.yearlyPrice : carePlan.monthlyPrice) : 0;
  
  // Booking costs €200 except for Pro package where it's included
  const bookingCost = formData.wantsBooking && formData.selectedPackage !== 'pro' ? BOOKING_ADDON_PRICE : 0;
  const adminPanelCost = addedAdminPanel ? ADMIN_PANEL_PRICE : 0;
  const packageTotal = (pkg?.price || 0) + bookingCost + adminPanelCost;
  const totalToday = isPostDemoFlow ? packageTotal - VERIFICATION_FEE : packageTotal;

  const formatPrice = (price: number) => {
    return '€' + price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };
  
  // Count selected free features
  const freeFeatures = [
    { enabled: formData.wantsGoogleMaps, label: t('Google Maps', 'Google Maps'), icon: MapPin },
    { enabled: formData.wantsGoogleReviews, label: t('Google Recensioner', 'Google Reviews'), icon: Star },
    { enabled: formData.wantsBeforeAfter, label: t('Före/Efter', 'Before/After'), icon: Image },
    { enabled: formData.wantsCheckoutSystem, label: t('Kassasystem', 'Checkout'), icon: ShoppingCart },
  ].filter(f => f.enabled);

  const getTotalPages = () => {
    return formData.selectedPages.length + formData.customPages.filter(p => p.trim()).length;
  };

  // Don't show price until package is selected
  if (!pkg) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-secondary/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 sticky top-24"
      >
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-lg">{t('Din beställning', 'Your order')}</h3>
        </div>
        <p className="text-sm text-muted-foreground text-center py-8">
          {t('Välj ett paket för att se priset', 'Select a package to see the price')}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-secondary/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 sticky top-24"
    >
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-lg">{t('Din beställning', 'Your order')}</h3>
      </div>

      <div className="space-y-4">
        {/* Package */}
        <AnimatePresence mode="wait">
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between p-3 bg-background/50 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-medium">{pkg.name}</p>
                <p className="text-xs text-muted-foreground">{lang === 'sv' ? pkg.pages.sv : pkg.pages.en}</p>
              </div>
            </div>
            <p className="font-semibold">{formatPrice(pkg.price)}</p>
          </motion.div>
        </AnimatePresence>

        {/* Pages count */}
        {getTotalPages() > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex items-center justify-between px-3 py-2"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="w-4 h-4" />
              <span>{t('Valda sidor', 'Selected pages')}</span>
            </div>
            <span className="text-sm font-medium">{getTotalPages()} / {pkg.maxPages}</span>
          </motion.div>
        )}

        {/* Booking add-on - costs €200 or FREE for Pro */}
        <AnimatePresence>
          {formData.wantsBooking && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center justify-between px-3 py-2"
            >
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-accent" />
                <span>{t('Bokningssystem', 'Booking system')}</span>
              </div>
              <span className="text-sm font-medium text-accent">
                {formData.selectedPackage === 'pro' 
                  ? t('INGÅR', 'INCLUDED')
                  : `+${formatPrice(BOOKING_ADDON_PRICE)}`
                }
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Admin Panel add-on */}
        <AnimatePresence>
          {addedAdminPanel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center justify-between px-3 py-2"
            >
              <div className="flex items-center gap-2 text-sm">
                <LayoutDashboard className="w-4 h-4 text-accent" />
                <span>{t('Adminpanel', 'Admin Panel')}</span>
              </div>
              <span className="text-sm font-medium">+{formatPrice(ADMIN_PANEL_PRICE)}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Free Features */}
        <AnimatePresence>
          {freeFeatures.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-1"
            >
              {freeFeatures.map((feature) => (
                <div key={feature.label} className="flex items-center justify-between px-3 py-1.5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <feature.icon className="w-3.5 h-3.5 text-accent" />
                    <span>{feature.label}</span>
                  </div>
                  <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded">
                    {t('GRATIS', 'FREE')}
                  </span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Care plan - shown inline, not as separate billing */}
        <AnimatePresence>
          {carePlan && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center justify-between p-3 bg-accent/5 rounded-xl border border-accent/20"
            >
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">{carePlan.name}</span>
              </div>
              <span className="text-sm font-medium">
                €{carePlanPrice}/{formData.isYearlyCarePlan ? t('mån', 'mo') : t('mån', 'mo')}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Divider */}
        <div className="h-px bg-border my-4" />

        {/* Verification fee deduction (post-demo only) */}
        {isPostDemoFlow && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{t('Verifieringsavgift betald', 'Verification fee paid')}</span>
            <span className="text-accent">-{formatPrice(VERIFICATION_FEE)}</span>
          </div>
        )}

        {/* Total */}
        <motion.div
          layout
          className="flex items-center justify-between pt-2"
        >
          <div>
            <p className="text-sm text-muted-foreground">{t('Totalt idag', 'Total today')}</p>
            <p className="text-2xl font-bold">{formatPrice(totalToday)}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-accent" />
          </div>
        </motion.div>

        {/* Klarna mention */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
          <span className="font-bold">Klarna</span>
          <span>{t('Delbetala enkelt', 'Easy installments')}</span>
        </div>

        {/* Care plan recurring info - compact display */}
        {carePlan && (
          <p className="text-xs text-muted-foreground text-center">
            {formData.isYearlyCarePlan 
              ? `${t('Vårdplan', 'Care plan')}: €${carePlanPrice * 12}/${t('år', 'year')}`
              : `${t('Vårdplan', 'Care plan')}: €${carePlanPrice}/${t('mån', 'month')}`
            }
          </p>
        )}

        {/* Checkout button (only show on step 5) */}
        {currentStep === 5 && onCheckout && (
          <Button 
            size="lg" 
            className="w-full mt-4 h-14 text-base group"
            onClick={onCheckout}
            disabled={isLoading}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-accent-foreground border-t-transparent rounded-full"
              />
            ) : (
              <>
                {t('Gå till betalning', 'Go to payment')}
                <motion.span
                  className="ml-2"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </>
            )}
          </Button>
        )}
      </div>
    </motion.div>
  );
}

export const OrderSummary = memo(OrderSummaryComponent);