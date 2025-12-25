import { motion, AnimatePresence } from 'framer-motion';
import { Package, FileText, Calendar, CreditCard, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { packages, carePlans, BOOKING_ADDON_PRICE, VERIFICATION_FEE, type WizardFormData } from './wizardConfig';

interface OrderSummaryProps {
  formData: WizardFormData;
  isPostDemoFlow?: boolean;
  onCheckout?: () => void;
  isLoading?: boolean;
  currentStep: number;
}

export function OrderSummary({ 
  formData, 
  isPostDemoFlow = false, 
  onCheckout,
  isLoading = false,
  currentStep 
}: OrderSummaryProps) {
  const { t, lang } = useLanguage();
  
  const pkg = packages.find(p => p.id === formData.selectedPackage);
  const carePlan = carePlans.find(c => c.id === formData.selectedCarePlan);
  const carePlanPrice = carePlan ? (formData.isYearlyCarePlan ? carePlan.yearlyPrice : carePlan.monthlyPrice) : 0;
  
  const bookingAddonCost = formData.wantsBooking && formData.selectedPackage !== 'pro' ? BOOKING_ADDON_PRICE : 0;
  const packageTotal = (pkg?.price || 0) + bookingAddonCost;
  const totalToday = isPostDemoFlow ? packageTotal - VERIFICATION_FEE : packageTotal;

  const formatPrice = (price: number) => {
    return price.toLocaleString('sv-SE').replace(/\s/g, ' ') + ' kr';
  };

  const getTotalPages = () => {
    return formData.selectedPages.length + formData.customPages.filter(p => p.trim()).length;
  };

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
          {pkg && (
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
          )}
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
            <span className="text-sm font-medium">{getTotalPages()} / {pkg?.maxPages || 0}</span>
          </motion.div>
        )}

        {/* Booking add-on */}
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
              <span className="text-sm font-medium">
                {formData.selectedPackage === 'pro' 
                  ? <span className="text-accent">{t('Ingår', 'Included')}</span>
                  : formatPrice(BOOKING_ADDON_PRICE)
                }
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Care plan */}
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
                <div>
                  <span className="text-sm font-medium">{carePlan.name} {t('vårdplan', 'care plan')}</span>
                  <p className="text-xs text-muted-foreground">
                    {formData.isYearlyCarePlan ? t('Årsvis (spara 20%)', 'Yearly (save 20%)') : t('Månadsvis', 'Monthly')}
                  </p>
                </div>
              </div>
              <span className="text-sm font-medium">{carePlanPrice} kr/{t('mån', 'mo')}</span>
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
          <svg className="w-10 h-4" viewBox="0 0 67 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.34 0H0v16h6.34V0zM13.7 0c0 2.75-1.1 5.39-3.06 7.33l4.64 8.67H8.13l-4.65-8.67C5.43 5.39 6.52 2.75 6.52 0h7.18zM14.35 0v16h6.34V0h-6.34zM40.32 3.8c-.86-.86-2.03-1.33-3.28-1.33a4.65 4.65 0 00-4.65 4.65c0 2.57 2.08 4.65 4.65 4.65 1.25 0 2.42-.48 3.28-1.33v1.08h5.55V2.72h-5.55v1.08zm-2.15 4.07c-.82 0-1.49-.67-1.49-1.49s.67-1.49 1.49-1.49 1.49.67 1.49 1.49-.67 1.49-1.49 1.49zM53.72 2.47c-1.3 0-2.43.47-3.24 1.33V2.72h-5.55v8.8h5.76V7.7c0-.82.67-1.49 1.49-1.49s1.49.67 1.49 1.49v3.82h5.76V6.38c0-2.16-1.75-3.91-3.91-3.91h-1.8zM67 11.52V2.72h-5.55v8.8H67zM67 0h-5.55v1.85H67V0zM28.74 11.52V0h-5.55v11.52h5.55zM24.34 12.35a2.78 2.78 0 002.78 2.78 2.78 2.78 0 002.78-2.78h-5.56z" fill="currentColor"/>
          </svg>
          <span>{t('Delbetala enkelt', 'Easy installments')}</span>
        </div>

        {/* Care plan recurring info */}
        {carePlan && (
          <p className="text-xs text-muted-foreground">
            + {formData.isYearlyCarePlan 
              ? `${carePlanPrice * 12} kr/${t('år', 'year')}` 
              : `${carePlanPrice} kr/${t('mån', 'month')}`
            } {t('för webbvård', 'for web care')}
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
