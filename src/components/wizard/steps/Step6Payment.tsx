import { motion } from 'framer-motion';
import { Sparkles, CreditCard, Settings } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckoutUpsells } from '@/components/CheckoutUpsells';
import { CustomerTypeSelection, CustomerTypeData, calculateVat, isNonVatCountry } from './CustomerTypeSelection';
import { CheckoutTrustSection } from './CheckoutTrustSection';
import { WizardFormData, packages, carePlans, getBookingAddonPrice, getVerificationFee, getCurrencyFromLang, formatPrice as formatPriceFn, getPackagePrice, getCarePlanPrice, getAddonPrice } from '../wizardConfig';

interface Step6PaymentProps {
  formData: WizardFormData;
  setFormData: (data: WizardFormData) => void;
  isPostDemoFlow?: boolean;
  customerTypeData: CustomerTypeData;
  onCustomerTypeChange: (data: CustomerTypeData) => void;
  addedAdminPanel?: boolean;
  onAddAdminPanel?: () => void;
}

export function Step6Payment({ 
  formData, 
  setFormData, 
  isPostDemoFlow = false,
  customerTypeData,
  onCustomerTypeChange,
  addedAdminPanel = false,
  onAddAdminPanel
}: Step6PaymentProps) {
  const { t, lang } = useLanguage();
  const currency = getCurrencyFromLang(lang);

  const handleAddBooking = () => {
    setFormData({ ...formData, wantsBooking: true });
  };

  const handleAddAdminPanel = () => {
    if (onAddAdminPanel) {
      onAddAdminPanel();
    }
  };

  const pkg = packages.find(p => p.id === formData.selectedPackage);
  const carePlan = carePlans.find(c => c.id === formData.selectedCarePlan);
  const carePlanPriceValue = carePlan ? getCarePlanPrice(carePlan.id, formData.isYearlyCarePlan, currency) : 0;
  
  // Get prices based on currency
  const packagePrice = pkg ? getPackagePrice(pkg.id, currency) : 0;
  const bookingAddonPrice = getBookingAddonPrice(currency);
  const adminPanelPrice = getAddonPrice('adminPanel', currency);
  const verificationFee = getVerificationFee(currency);
  
  const bookingAddonCost = formData.wantsBooking && formData.selectedPackage !== 'pro' ? bookingAddonPrice : 0;
  const adminPanelCost = addedAdminPanel ? adminPanelPrice : 0;
  const packageTotal = packagePrice + bookingAddonCost + adminPanelCost;
  const oneTimeNet = isPostDemoFlow ? packageTotal - verificationFee : packageTotal;
  
  // Total today = one-time items + first care plan payment (both charged at checkout)
  const totalNetToday = oneTimeNet + carePlanPriceValue;

  // Use unified VAT calculation based on country
  const customerCountry = customerTypeData?.country || (lang === 'sv' ? 'SE' : 'US');
  const vatResult = calculateVat(
    totalNetToday,
    customerTypeData?.customerType || null,
    customerCountry,
    customerTypeData?.vatVerified || false
  );
  
  // Care plan VAT
  const carePlanVatResult = calculateVat(
    carePlanPriceValue,
    customerTypeData?.customerType || null,
    customerCountry,
    customerTypeData?.vatVerified || false
  );

  const formatPrice = (price: number) => formatPriceFn(price, currency);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Admin Panel Upsell - Prominent placement */}
      {!addedAdminPanel && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 bg-gradient-to-r from-primary/10 via-accent/10 to-accent/10 rounded-xl border border-accent/30"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-accent/20 rounded-lg">
              <Settings className="w-6 h-6 text-accent" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-lg mb-1">{t('Rekommenderat: Adminpanel', 'Recommended: Admin Panel')}</h4>
              <p className="text-sm text-muted-foreground mb-3">
                {t('Hantera din webbplats själv - redigera texter, bilder och se besöksstatistik i realtid.', 'Manage your website yourself - edit texts, images and view visitor statistics in real-time.')}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-accent">+{formatPrice(adminPanelPrice)}</span>
                <button
                  onClick={handleAddAdminPanel}
                  className="px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
                >
                  {t('Lägg till', 'Add')}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Customer Type Selection */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <CustomerTypeSelection 
          data={customerTypeData} 
          onChange={onCustomerTypeChange} 
        />
      </motion.div>

      {/* Order Summary Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent rounded-2xl border border-accent/20"
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-lg">{t('Beställningsöversikt', 'Order summary')}</h3>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span>{pkg?.name} {t('paket', 'package')}</span>
            <span className="font-medium">{formatPrice(packagePrice)}</span>
          </div>
          
          {formData.wantsBooking && (
            <div className="flex justify-between items-center text-sm">
              <span>{t('Bokningssystem', 'Booking system')}</span>
              <span className="font-medium">
                {formData.selectedPackage === 'pro' 
                  ? <span className="text-accent">{t('Ingår', 'Included')}</span>
                  : formatPrice(bookingAddonPrice)
                }
              </span>
            </div>
          )}

          {addedAdminPanel && (
            <div className="flex justify-between items-center text-sm">
              <span>{t('Adminpanel', 'Admin Panel')}</span>
              <span className="font-medium">{formatPrice(adminPanelPrice)}</span>
            </div>
          )}

          {isPostDemoFlow && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-accent font-medium">{t('Konceptrabatt', 'Concept discount')}</span>
              <span className="text-accent font-bold">-{formatPrice(verificationFee)}</span>
            </div>
          )}

          <div className="h-px bg-border my-2" />

          {/* VAT Breakdown - using unified calculation */}
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex justify-between items-center">
              <span>{t('Netto', 'Net')}</span>
              <span>{formatPrice(Math.round(totalNetToday))}</span>
            </div>
            {vatResult.showVat && vatResult.vatRate > 0 ? (
              <div className="flex justify-between items-center">
                <span>{t('Moms', 'VAT')} ({vatResult.vatRate}%)</span>
                <span>{formatPrice(vatResult.vatAmount)}</span>
              </div>
            ) : (
              <div className="flex justify-between items-center text-accent">
                <span>{t('Ingen moms', 'No VAT')}</span>
                <span>{formatPrice(0)}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center text-lg font-bold">
            <span>{t('Totalt idag', 'Total today')}</span>
            <span className="text-accent">
              {formatPrice(Math.round(totalNetToday + vatResult.vatAmount))}
            </span>
          </div>

          {carePlan && (
            <div className="pt-3 mt-3 border-t border-border/50">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-accent" />
                  {carePlan.name} {t('Webbvård', 'Web Care')}
                </span>
                <span className="text-sm font-semibold text-accent">
                  {formatPrice(carePlanPriceValue)}/{formData.isYearlyCarePlan ? t('år', 'year') : t('mån', 'month')}
                </span>
              </div>
              {/* VAT breakdown for care plan */}
              {carePlanVatResult.showVat && carePlanVatResult.vatRate > 0 && (
                <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>{t('Netto', 'Net')}</span>
                    <span>{formatPrice(Math.round(carePlanPriceValue))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('Moms', 'VAT')} ({carePlanVatResult.vatRate}%)</span>
                    <span>{formatPrice(carePlanVatResult.vatAmount)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-foreground">
                    <span>{t('Totalt', 'Total')}</span>
                    <span>{formatPrice(Math.round(carePlanPriceValue + carePlanVatResult.vatAmount))}/{formData.isYearlyCarePlan ? t('år', 'year') : t('mån', 'month')}</span>
                  </div>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                {t('Prenumerationen startar vid betalning.', 'Subscription starts upon payment.')}
              </p>
            </div>
          )}

          {/* Customer Type Badge */}
          {customerTypeData.customerType && (
            <div className="pt-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                customerTypeData.customerType === 'business' 
                  ? 'bg-blue-500/10 text-blue-500' 
                  : 'bg-accent/10 text-accent'
              }`}>
                {customerTypeData.customerType === 'business' 
                  ? `${t('Företag', 'Business')}: ${customerTypeData.companyName || '...'}`
                  : t('Privatperson', 'Private')
                }
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Trust Section */}
      <CheckoutTrustSection 
        selectedPackage={formData.selectedPackage} 
        isPostDemoFlow={isPostDemoFlow} 
      />

      {/* Additional Upsells (Booking) */}
      <CheckoutUpsells 
        businessType={formData.businessType}
        wantsBooking={formData.wantsBooking}
        selectedPackage={formData.selectedPackage}
        onAddBooking={handleAddBooking}
        onAddAdminPanel={handleAddAdminPanel}
        addedBooking={formData.wantsBooking || false}
        addedAdminPanel={addedAdminPanel}
      />
    </div>
  );
}
