import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, FileText, Calendar, CreditCard, Check, Sparkles, MapPin, Star, Image, ShoppingCart, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { packages, carePlans, getBookingAddonPrice, getVerificationFee, getCurrencyFromLang, formatPrice as formatPriceFn, getPackagePrice, getCarePlanPrice, getAddonPrice, type WizardFormData } from './wizardConfig';

const VAT_RATE = 0.25; // 25% VAT

interface CustomerTypeData {
  customerType: 'private' | 'business' | null;
  companyName: string;
  orgNumber: string;
  vatNumber: string;
  country: string;
  vatVerified: boolean;
  vatVerifiedAt: string | null;
}

interface OrderSummaryProps {
  formData: WizardFormData;
  isPostDemoFlow?: boolean;
  onCheckout?: () => void;
  isLoading?: boolean;
  currentStep: number;
  addedAdminPanel?: boolean;
  customerTypeData?: CustomerTypeData;
}

function OrderSummaryComponent({ 
  formData, 
  isPostDemoFlow = false, 
  onCheckout,
  isLoading = false,
  currentStep,
  addedAdminPanel = false,
  customerTypeData
}: OrderSummaryProps) {
  const { t, lang } = useLanguage();
  const currency = getCurrencyFromLang(lang);
  
  const pkg = packages.find(p => p.id === formData.selectedPackage);
  const carePlan = carePlans.find(c => c.id === formData.selectedCarePlan);
  const carePlanPriceValue = carePlan ? getCarePlanPrice(carePlan.id, formData.isYearlyCarePlan, currency) : 0;
  
  // Get prices based on currency
  const packagePrice = pkg ? getPackagePrice(pkg.id, currency) : 0;
  const bookingAddonPrice = getBookingAddonPrice(currency);
  const adminPanelPrice = getAddonPrice('adminPanel', currency);
  const checkoutAddonPrice = getAddonPrice('checkout', currency);
  const verificationFee = getVerificationFee(currency);
  
  // Booking costs extra except for Pro package where it's included
  const bookingCost = formData.wantsBooking && formData.selectedPackage !== 'pro' ? bookingAddonPrice : 0;
  const adminPanelCost = addedAdminPanel ? adminPanelPrice : 0;
  // Checkout system costs €50 for Starter, free for Standard/Pro
  const checkoutCost = formData.wantsCheckoutSystem && formData.selectedPackage === 'starter' ? checkoutAddonPrice : 0;
  const packageTotal = packagePrice + bookingCost + adminPanelCost + checkoutCost;
  const oneTimeNet = isPostDemoFlow ? packageTotal - verificationFee : packageTotal;
  
  // Total today = one-time items + first care plan payment (both charged at checkout)
  const totalNetToday = oneTimeNet + carePlanPriceValue;

  // VAT logic - matches edge function exactly
  // Show VAT if: private customer OR Swedish business OR non-verified EU business
  const shouldShowVat = !customerTypeData?.customerType || // Default to showing VAT before selection
    customerTypeData.customerType === 'private' ||
    (customerTypeData.customerType === 'business' && customerTypeData.country === 'SE') ||
    (customerTypeData.customerType === 'business' && !customerTypeData.vatVerified);

  const formatPrice = (price: number) => formatPriceFn(price, currency);
  
  // Count selected free features (exclude checkout for starter since it's paid)
  const freeFeatures = [
    { enabled: formData.wantsGoogleMaps, label: t('Google Maps', 'Google Maps'), icon: MapPin },
    { enabled: formData.wantsGoogleReviews, label: t('Google Recensioner', 'Google Reviews'), icon: Star },
    { enabled: formData.wantsBeforeAfter, label: t('Före/Efter', 'Before/After'), icon: Image },
    { enabled: formData.wantsCheckoutSystem && formData.selectedPackage !== 'starter', label: t('Kassasystem', 'Checkout'), icon: ShoppingCart },
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

  // On payment step (6), show "Order summary" title instead of "Your order"
  const isPaymentStep = currentStep === 6;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={isPaymentStep ? 'order-summary' : 'your-order'}
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="bg-secondary/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 sticky top-24"
      >
        <motion.div
          key={isPaymentStep ? 'summary-title' : 'order-title'}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex items-center gap-2 mb-6"
        >
          <Sparkles className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-lg">
            {isPaymentStep ? t('Ordersammanfattning', 'Order summary') : t('Din beställning', 'Your order')}
          </h3>
        </motion.div>

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
            <p className="font-semibold">{formatPrice(packagePrice)}</p>
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
                  : `+${formatPrice(bookingAddonPrice)}`
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
              <span className="text-sm font-medium">+{formatPrice(adminPanelPrice)}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Checkout System add-on - costs €50 for Starter, FREE for Standard/Pro */}
        <AnimatePresence>
          {formData.wantsCheckoutSystem && formData.selectedPackage === 'starter' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center justify-between px-3 py-2"
            >
              <div className="flex items-center gap-2 text-sm">
                <ShoppingCart className="w-4 h-4 text-accent" />
                <span>{t('Kassasystem', 'Checkout system')}</span>
              </div>
              <span className="text-sm font-medium">+{formatPrice(checkoutAddonPrice)}</span>
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

        {/* Care plan - shown as separate billing */}
        <AnimatePresence>
          {carePlan && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 bg-accent/5 rounded-xl border border-accent/20 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium">{carePlan.name} {t('Webbvård', 'Web Care')}</span>
                </div>
                <span className="text-sm font-medium">
                  {formatPrice(carePlanPriceValue)}/{formData.isYearlyCarePlan ? t('år', 'year') : t('mån', 'mo')}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {formData.isYearlyCarePlan 
                  ? t('Faktureras årligen', 'Billed yearly')
                  : t('Faktureras månadsvis', 'Billed monthly')
                }
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Divider */}
        <div className="h-px bg-border my-4" />

        {/* Concept discount (post-demo only) */}
        {isPostDemoFlow && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-accent font-medium">{t('Konceptrabatt', 'Concept discount')}</span>
            <span className="text-accent font-bold">-{formatPrice(verificationFee)}</span>
          </div>
        )}

        {/* VAT breakdown */}
        <div className="space-y-1 text-sm text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>{t('Netto', 'Net')}</span>
            <span>{formatPrice(Math.round(totalNetToday))}</span>
          </div>
          {shouldShowVat ? (
            <div className="flex items-center justify-between">
              <span>{t('Moms (25%)', 'VAT (25%)')}</span>
              <span>{formatPrice(Math.round(totalNetToday * VAT_RATE))}</span>
            </div>
          ) : (
            <div className="flex items-center justify-between text-accent">
              <span>{t('Omvänd moms (EU B2B)', 'Reverse charge (EU B2B)')}</span>
              <span>{formatPrice(0)}</span>
            </div>
          )}
        </div>

        {/* Total */}
        <motion.div
          layout
          className="flex items-center justify-between pt-2"
        >
          <div>
            <p className="text-sm text-muted-foreground">{t('Totalt idag', 'Total today')}</p>
            <p className="text-2xl font-bold">
              {formatPrice(Math.round(shouldShowVat ? totalNetToday * (1 + VAT_RATE) : totalNetToday))}
            </p>
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
    </AnimatePresence>
  );
}

export const OrderSummary = memo(OrderSummaryComponent);