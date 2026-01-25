import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Scale, CreditCard, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';
import { InfoTooltip } from '@/components/InfoTooltip';
import { CheckoutUpsells } from '@/components/CheckoutUpsells';
import { CustomerTypeSelection, CustomerTypeData, calculateVat } from './CustomerTypeSelection';
import { CheckoutTrustSection } from './CheckoutTrustSection';
import { WizardFormData, packages, carePlans, getBookingAddonPrice, getVerificationFee, getCurrencyFromLang, formatPrice as formatPriceFn, getPackagePrice, getCarePlanPrice, getAddonPrice } from '../wizardConfig';

interface Step5PaymentProps {
  formData: WizardFormData;
  setFormData: (data: WizardFormData) => void;
  isPostDemoFlow?: boolean;
  customerTypeData: CustomerTypeData;
  onCustomerTypeChange: (data: CustomerTypeData) => void;
  addedAdminPanel?: boolean;
  onAddAdminPanel?: () => void;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.3, ease: "easeOut" as const }
  })
};

export function Step5Payment({ 
  formData, 
  setFormData, 
  isPostDemoFlow = false,
  customerTypeData,
  onCustomerTypeChange,
  addedAdminPanel = false,
  onAddAdminPanel
}: Step5PaymentProps) {
  const { t, lang } = useLanguage();
  const currency = getCurrencyFromLang(lang);
  const [addedBooking, setAddedBooking] = useState(false);

  const updateField = <K extends keyof WizardFormData>(field: K, value: WizardFormData[K]) => {
    setFormData({ ...formData, [field]: value });
  };

  const toggleLegalPage = (page: string, checked: boolean) => {
    if (checked) {
      updateField('legalPages', [...formData.legalPages, page]);
    } else {
      updateField('legalPages', formData.legalPages.filter(p => p !== page));
    }
  };

  const handleAddBooking = () => {
    setAddedBooking(true);
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
  
  const bookingAddonCost = (formData.wantsBooking || addedBooking) && formData.selectedPackage !== 'pro' ? bookingAddonPrice : 0;
  const adminPanelCost = addedAdminPanel ? adminPanelPrice : 0;
  // Include first year/month of care plan in total
  const carePlanCost = carePlanPriceValue;
  const packageTotal = packagePrice + bookingAddonCost + adminPanelCost + carePlanCost;
  const totalToday = isPostDemoFlow ? packageTotal - verificationFee : packageTotal;

  // Calculate VAT using the new country-based logic
  const customerCountry = customerTypeData?.country || (lang === 'sv' ? 'SE' : 'US');
  const vatResult = calculateVat(
    totalToday,
    customerTypeData?.customerType || null,
    customerCountry,
    customerTypeData?.vatVerified || false
  );

  const formatPrice = (price: number) => formatPriceFn(price, currency);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
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
          
          {(formData.wantsBooking || addedBooking) && (
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
            <div className="flex justify-between items-center text-sm text-accent">
              <span>{t('Verifieringsavgift betald', 'Verification fee paid')}</span>
              <span>-{formatPrice(verificationFee)}</span>
            </div>
          )}

          <div className="h-px bg-border my-2" />

          {/* VAT breakdown - only show if VAT applies */}
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex justify-between items-center">
              <span>{t('Netto', 'Net')}</span>
              <span>{formatPrice(Math.round(totalToday))}</span>
            </div>
            {vatResult.showVat && (
              vatResult.isReverseCharge ? (
                <div className="flex justify-between items-center text-accent">
                  <span>{t('Omvänd moms (EU B2B)', 'Reverse charge (EU B2B)')}</span>
                  <span>{formatPrice(0)}</span>
                </div>
              ) : vatResult.vatRate > 0 ? (
                <div className="flex justify-between items-center">
                  <span>{t('Moms', 'VAT')} ({vatResult.vatRate}%)</span>
                  <span>{formatPrice(vatResult.vatAmount)}</span>
                </div>
              ) : null
            )}
            {!vatResult.showVat && (
              <div className="flex justify-between items-center text-accent">
                <span>{t('Ingen moms', 'No VAT')}</span>
                <span>{formatPrice(0)}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center text-lg font-bold">
            <span>{t('Totalt idag', 'Total today')}</span>
            <span className="text-accent">{formatPrice(Math.round(totalToday + vatResult.vatAmount))}</span>
          </div>

          {carePlan && (
            <div className="flex justify-between items-center text-sm">
              <span>{carePlan.name} {t('Webbvård', 'Web Care')} ({formData.isYearlyCarePlan ? t('första året', 'first year') : t('första månaden', 'first month')})</span>
              <span className="font-medium">{formatPrice(carePlanPriceValue)}</span>
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

      {/* Upsells */}
      <CheckoutUpsells 
        businessType={formData.businessType}
        wantsBooking={formData.wantsBooking}
        selectedPackage={formData.selectedPackage}
        onAddBooking={handleAddBooking}
        onAddAdminPanel={handleAddAdminPanel}
        addedBooking={addedBooking}
        addedAdminPanel={addedAdminPanel}
      />

      {/* Project Details */}
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="p-6 bg-secondary/50 rounded-xl space-y-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-5 h-5 text-accent" />
          <h3 className="font-semibold">{t('Projektdetaljer (valfritt)', 'Project details (optional)')}</h3>
        </div>
        <div>
          <Label>{t('Sidstruktur & anteckningar', 'Page structure & notes')}</Label>
          <Textarea 
            value={formData.pageNotes} 
            onChange={(e) => updateField('pageNotes', e.target.value)} 
            placeholder={t('Beskriv varje sida...', 'Describe each page...')} 
            rows={3} 
            className="mt-1"
          />
        </div>
        <div>
          <Label>{t('Varumärke & preferenser', 'Brand & preferences')}</Label>
          <Textarea 
            value={formData.brandPreferences} 
            onChange={(e) => updateField('brandPreferences', e.target.value)} 
            placeholder={t('Färger, typsnitt, ton...', 'Colors, fonts, tone...')} 
            rows={2} 
            className="mt-1"
          />
        </div>
        <div>
          <Label>{t('Webbplatser du gillar (konkurrenter)', 'Websites you like (competitors)')}</Label>
          <Input 
            value={formData.competitors} 
            onChange={(e) => updateField('competitors', e.target.value)} 
            placeholder="https://..." 
            className="h-12 mt-1"
          />
        </div>
        <div>
          <Label>{t('SEO-sökord', 'SEO keywords')}</Label>
          <Input 
            value={formData.seoKeywords} 
            onChange={(e) => updateField('seoKeywords', e.target.value)} 
            placeholder={t('Sökord, lokalområde...', 'Keywords, local area...')} 
            className="h-12 mt-1"
          />
        </div>
      </motion.div>

      {/* Legal Pages */}
      <motion.div
        custom={1}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="p-6 bg-secondary/50 rounded-xl space-y-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <Scale className="w-5 h-5 text-accent" />
          <h3 className="font-semibold">{t('Juridiska sidor', 'Legal pages')}</h3>
          <InfoTooltip content={t('Juridiska sidor som integritetspolicy och villkor är viktiga för att skydda ditt företag och uppfylla lagar som GDPR.', 'Legal pages like privacy policy and terms are important to protect your business and comply with laws like GDPR.')} />
        </div>
        <div className="flex flex-wrap gap-3">
          <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-accent/5 transition-colors">
            <Checkbox 
              checked={formData.legalPages.includes('GDPR')} 
              onCheckedChange={(checked) => toggleLegalPage('GDPR', checked === true)}
            />
            <span className="text-sm">GDPR</span>
          </label>
          
          <label 
            className={`flex items-center gap-2 p-3 border rounded-lg transition-colors ${
              formData.selectedPackage === 'pro' 
                ? 'bg-accent/10 border-accent/30 cursor-not-allowed' 
                : 'cursor-pointer hover:bg-accent/5'
            }`}
          >
            <Checkbox 
              checked={formData.legalPages.includes('Cookies') || formData.selectedPackage === 'pro'} 
              disabled={formData.selectedPackage === 'pro'}
              onCheckedChange={(checked) => toggleLegalPage('Cookies', checked === true)}
            />
            <span className="text-sm">Cookies</span>
            {formData.selectedPackage === 'pro' && (
              <InfoTooltip content={t('Cookies-sida krävs för Pro-paketet eftersom Google Analytics använder cookies för spårning.', 'Cookies page is required for Pro package because Google Analytics uses cookies for tracking.')} />
            )}
          </label>
          
          <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-accent/5 transition-colors">
            <Checkbox 
              checked={formData.legalPages.includes('Terms')} 
              onCheckedChange={(checked) => toggleLegalPage('Terms', checked === true)}
            />
            <span className="text-sm">{t('Villkor', 'Terms')}</span>
          </label>
        </div>
        
        {formData.legalPages.includes('Terms') && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <Label className="text-sm">{t('Förklara dina villkor', 'Explain your terms')}</Label>
            <Textarea 
              value={formData.termsExplanation} 
              onChange={(e) => updateField('termsExplanation', e.target.value)} 
              placeholder={t('T.ex. betalningsvillkor, leveransvillkor, returpolicy...', 'E.g. payment terms, delivery terms, return policy...')}
              rows={2}
              className="mt-1"
            />
          </motion.div>
        )}
      </motion.div>

      {/* Extra Notes */}
      <motion.div
        custom={2}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="p-6 bg-secondary/50 rounded-xl"
      >
        <Label>{t('Övriga anteckningar', 'Additional notes')}</Label>
        <Textarea 
          value={formData.extraNotes} 
          onChange={(e) => updateField('extraNotes', e.target.value)} 
          placeholder={t('Något annat vi bör veta?', 'Anything else we should know?')}
          rows={3}
          className="mt-1"
        />
      </motion.div>
    </div>
  );
}
