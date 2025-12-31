import { motion } from 'framer-motion';
import { Sparkles, CreditCard, Settings } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckoutUpsells } from '@/components/CheckoutUpsells';
import { CustomerTypeSelection, CustomerTypeData } from './CustomerTypeSelection';
import { CheckoutTrustSection } from './CheckoutTrustSection';
import { WizardFormData, packages, carePlans, BOOKING_ADDON_PRICE, VERIFICATION_FEE } from '../wizardConfig';

interface Step6PaymentProps {
  formData: WizardFormData;
  setFormData: (data: WizardFormData) => void;
  isPostDemoFlow?: boolean;
  customerTypeData: CustomerTypeData;
  onCustomerTypeChange: (data: CustomerTypeData) => void;
  addedAdminPanel?: boolean;
  onAddAdminPanel?: () => void;
}

const ADMIN_PANEL_PRICE = 100;
const VAT_RATE = 0.25; // 25% VAT

export function Step6Payment({ 
  formData, 
  setFormData, 
  isPostDemoFlow = false,
  customerTypeData,
  onCustomerTypeChange,
  addedAdminPanel = false,
  onAddAdminPanel
}: Step6PaymentProps) {
  const { t } = useLanguage();

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
  const carePlanPrice = carePlan ? (formData.isYearlyCarePlan ? carePlan.yearlyPrice : carePlan.monthlyPrice) : 0;
  const bookingAddonCost = formData.wantsBooking && formData.selectedPackage !== 'pro' ? BOOKING_ADDON_PRICE : 0;
  const adminPanelCost = addedAdminPanel ? ADMIN_PANEL_PRICE : 0;
  const packageTotal = (pkg?.price || 0) + bookingAddonCost + adminPanelCost;
  const totalToday = isPostDemoFlow ? packageTotal - VERIFICATION_FEE : packageTotal;

  // VAT calculations
  const isBusinessWithVat = customerTypeData.customerType === 'business' && customerTypeData.vatVerified;
  const isPrivate = customerTypeData.customerType === 'private';
  
  // For businesses with valid VAT in same country as seller (Sweden), show VAT breakdown
  // For businesses with valid VAT in other EU countries, reverse charge (0% VAT)
  const showVatBreakdown = isPrivate || (customerTypeData.customerType === 'business' && customerTypeData.country === 'SE');
  const vatAmount = showVatBreakdown ? totalToday * VAT_RATE : 0;
  const netAmount = showVatBreakdown ? totalToday : totalToday;

  const formatPrice = (price: number) => {
    return '€' + price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Admin Panel Upsell - Prominent placement */}
      {!addedAdminPanel && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-accent/10 rounded-xl border border-accent/30"
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
                <span className="text-lg font-bold text-accent">+€100</span>
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
            <span className="font-medium">{formatPrice(pkg?.price || 0)}</span>
          </div>
          
          {formData.wantsBooking && (
            <div className="flex justify-between items-center text-sm">
              <span>{t('Bokningssystem', 'Booking system')}</span>
              <span className="font-medium">
                {formData.selectedPackage === 'pro' 
                  ? <span className="text-accent">{t('Ingår', 'Included')}</span>
                  : formatPrice(BOOKING_ADDON_PRICE)
                }
              </span>
            </div>
          )}

          {addedAdminPanel && (
            <div className="flex justify-between items-center text-sm">
              <span>{t('Adminpanel', 'Admin Panel')}</span>
              <span className="font-medium">{formatPrice(ADMIN_PANEL_PRICE)}</span>
            </div>
          )}

          {isPostDemoFlow && (
            <div className="flex justify-between items-center text-sm text-accent">
              <span>{t('Verifieringsavgift betald', 'Verification fee paid')}</span>
              <span>-{formatPrice(VERIFICATION_FEE)}</span>
            </div>
          )}

          <div className="h-px bg-border my-2" />

          {/* VAT Breakdown for Business/Private */}
          {customerTypeData.customerType && (
            <>
              {showVatBreakdown ? (
                <>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>{t('Netto', 'Net')}</span>
                    <span>{formatPrice(Math.round(netAmount))}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>{t('Moms (25%)', 'VAT (25%)')}</span>
                    <span>{formatPrice(Math.round(vatAmount))}</span>
                  </div>
                </>
              ) : isBusinessWithVat && customerTypeData.country !== 'SE' ? (
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>{t('Omvänd moms (EU)', 'Reverse charge (EU)')}</span>
                  <span className="text-accent">€0</span>
                </div>
              ) : null}
            </>
          )}

          <div className="flex justify-between items-center text-lg font-bold">
            <span>{t('Totalt idag', 'Total today')}</span>
            <span className="text-accent">
              {formatPrice(showVatBreakdown ? totalToday + vatAmount : totalToday)}
            </span>
          </div>

          {carePlan && (
            <div className="pt-3 mt-3 border-t border-border/50">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                {t('Webbvård faktureras separat:', 'Web care billed separately:')}
              </p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm font-medium">{carePlan.name} {t('Webbvård', 'Web Care')}</span>
                <span className="text-sm font-semibold">
                  {formData.isYearlyCarePlan 
                    ? `€${carePlanPrice}/${t('år', 'year')}`
                    : `€${carePlanPrice}/${t('mån', 'month')}`
                  }
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {t('Du får en separat betalningslänk för webbvård efter beställningen.', 'You will receive a separate payment link for web care after your order.')}
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
