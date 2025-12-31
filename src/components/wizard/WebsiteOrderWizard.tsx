import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2, Zap, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { PackageCompareModal } from '@/components/PackageCompareModal';
import { CarePlansCompareModal } from '@/components/CarePlansCompareModal';
import { AdminPanelUpsellModal } from '@/components/AdminPanelUpsellModal';

import { WizardStepper } from './WizardStepper';
import { OrderSummary } from './OrderSummary';
import { WizardBackground } from './WizardBackground';
import { Step1Contact } from './steps/Step1Contact';
import { Step2Package } from './steps/Step2Package';
import { Step3Pages } from './steps/Step3Pages';
import { Step4CarePlan } from './steps/Step4CarePlan';
import { Step5ProjectDetails } from './steps/Step5ProjectDetails';
import { Step6Payment } from './steps/Step6Payment';
import { CustomerTypeData, initialCustomerTypeData, validateCustomerType } from './steps/CustomerTypeSelection';
import { 
  WizardFormData, 
  FormStep, 
  initialFormData, 
  packages, 
  BOOKING_ADDON_PRICE,
  VERIFICATION_FEE 
} from './wizardConfig';

const STORAGE_KEY = 'nomia_wizard_data';
const SESSION_KEY = 'nomia_wizard_session';

interface WebsiteOrderWizardProps {
  isPostDemoFlow?: boolean;
  conceptLink?: string;
  onComplete?: () => void;
}

// Simplified step transitions for performance
const stepVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

function WebsiteOrderWizardComponent({ 
  isPostDemoFlow = false, 
  conceptLink = '',
  onComplete 
}: WebsiteOrderWizardProps) {
  const { t, lang } = useLanguage();
  const [step, setStep] = useState<FormStep>(1);
  const [direction, setDirection] = useState(0);
  const [formData, setFormData] = useState<WizardFormData>({ ...initialFormData, conceptLink });
  const [customerTypeData, setCustomerTypeData] = useState<CustomerTypeData>(initialCustomerTypeData);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [addedAdminPanel, setAddedAdminPanel] = useState(false);
  const [showPackageCompare, setShowPackageCompare] = useState(false);
  const [showCarePlanCompare, setShowCarePlanCompare] = useState(false);
  const [showResumeBanner, setShowResumeBanner] = useState(false);
  const [showAdminPanelModal, setShowAdminPanelModal] = useState(false);
  const [adminPanelDecision, setAdminPanelDecision] = useState(false);

  // Check for saved data on mount
  useEffect(() => {
    const wasSessionActive = sessionStorage.getItem(SESSION_KEY);
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (stored && !wasSessionActive) {
      try {
        const parsed = JSON.parse(stored);
        if (Date.now() - parsed.lastSaved < 7 * 24 * 60 * 60 * 1000) {
          setShowResumeBanner(true);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    
    sessionStorage.setItem(SESSION_KEY, 'true');
  }, []);

  // Debounced auto-save
  const saveData = useCallback(() => {
    const toSave = { 
      ...formData, 
      step, 
      customerTypeData,
      addedAdminPanel,
      lastSaved: Date.now() 
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }, [formData, step, customerTypeData, addedAdminPanel]);

  useEffect(() => {
    const timer = setTimeout(saveData, 1000);
    return () => clearTimeout(timer);
  }, [formData, step, saveData]);

  const loadSavedData = useCallback(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setFormData({ ...parsed, conceptLink: conceptLink || parsed.conceptLink });
      setStep(parsed.step || 1);
      if (parsed.customerTypeData) setCustomerTypeData(parsed.customerTypeData);
      if (parsed.addedAdminPanel) setAddedAdminPanel(parsed.addedAdminPanel);
    }
    setShowResumeBanner(false);
  }, [conceptLink]);

  const clearSavedData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setFormData({ ...initialFormData, conceptLink });
    setStep(1);
    setCustomerTypeData(initialCustomerTypeData);
    setAddedAdminPanel(false);
    setShowResumeBanner(false);
  }, [conceptLink]);

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    if (!formData.businessName.trim()) newErrors.businessName = true;
    if (!formData.contactPerson.trim()) newErrors.contactPerson = true;
    if (!formData.email.trim()) newErrors.email = true;
    if (!formData.phone.trim()) newErrors.phone = true;
    if (!formData.businessType) newErrors.businessType = true;
    if (formData.businessType === 'other' && !formData.businessTypeOther.trim()) newErrors.businessTypeOther = true;
    if (!formData.websiteGoal) newErrors.websiteGoal = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    if (!formData.selectedPackage) newErrors.package = true;
    if (!formData.selectedStyle) newErrors.style = true;
    if (formData.selectedLanguage === 'custom' && !formData.customLanguages.trim()) newErrors.customLanguages = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    if (!formData.services.trim()) newErrors.services = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = useCallback(() => {
    if (step === 1 && !validateStep1()) {
      toast({ title: t('Fyll i alla obligatoriska fält', 'Fill in all required fields'), variant: 'destructive' });
      return;
    }
    if (step === 2 && !validateStep2()) {
      toast({ title: t('Välj paket och stil', 'Select package and style'), variant: 'destructive' });
      return;
    }
    if (step === 3 && !validateStep3()) {
      toast({ title: t('Fyll i dina tjänster och priser', 'Fill in your services and prices'), variant: 'destructive' });
      return;
    }
    setDirection(1);
    setStep((s) => Math.min(s + 1, 6) as FormStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step, formData, t]);

  const handlePrevStep = useCallback(() => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1) as FormStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const formatPrice = (price: number) => {
    return '€' + price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const ADMIN_PANEL_PRICE = 100;

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      const pkg = packages.find(p => p.id === formData.selectedPackage);
      const bookingAddonCost = formData.wantsBooking && formData.selectedPackage !== 'pro' ? BOOKING_ADDON_PRICE : 0;
      const adminPanelCost = addedAdminPanel ? ADMIN_PANEL_PRICE : 0;
      const totalPackagePrice = (pkg?.price || 0) + bookingAddonCost + adminPanelCost;

      // Submit form data for record keeping
      const formDataPayload = new FormData();
      formDataPayload.append('form_type', isPostDemoFlow ? 'Post-Demo Order' : 'Direct Checkout Order');
      formDataPayload.append('business_name', formData.businessName);
      formDataPayload.append('contact_person', formData.contactPerson);
      formDataPayload.append('email', formData.email);
      formDataPayload.append('phone', formData.phone);
      formDataPayload.append('business_type', formData.businessType === 'other' ? formData.businessTypeOther : formData.businessType);
      formDataPayload.append('website_goal', formData.websiteGoal);
      formDataPayload.append('selected_package', formData.selectedPackage);
      formDataPayload.append('package_price', formatPrice(totalPackagePrice));
      formDataPayload.append('selected_style', formData.selectedStyle);
      formDataPayload.append('primary_color', formData.noColorPreference ? 'No preference' : formData.primaryColor);
      formDataPayload.append('accent_color', formData.noColorPreference ? 'No preference' : formData.accentColor);
      formDataPayload.append('selected_language', formData.selectedLanguage === 'custom' ? formData.customLanguages : formData.selectedLanguage);
      formDataPayload.append('wants_booking', String(formData.wantsBooking));
      formDataPayload.append('booking_addon_cost', bookingAddonCost > 0 ? `+€${bookingAddonCost}` : 'Included');
      formDataPayload.append('selected_pages', formData.selectedPages.join(', '));
      formDataPayload.append('custom_pages', formData.customPages.filter(p => p.trim()).join(', '));
      formDataPayload.append('services', formData.services);
      formDataPayload.append('no_logo', String(formData.noLogo));
      formDataPayload.append('use_stock', String(formData.useStock));
      formDataPayload.append('business_followups', JSON.stringify(formData.businessFollowUps));
      formDataPayload.append('wants_google_maps', String(formData.wantsGoogleMaps));
      formDataPayload.append('google_maps_address', formData.googleMapsAddress);
      formDataPayload.append('wants_google_reviews', String(formData.wantsGoogleReviews));
      formDataPayload.append('google_business_link', formData.googleBusinessLink);
      formDataPayload.append('wants_before_after', String(formData.wantsBeforeAfter));
      formDataPayload.append('wants_checkout_system', String(formData.wantsCheckoutSystem));
      
      if (formData.wantsBooking) {
        formDataPayload.append('opening_hours', formData.openingHours);
        formDataPayload.append('appointment_lengths', formData.appointmentLengths.join(', ') + (formData.customAppointmentLength ? `, ${formData.customAppointmentLength}` : ''));
        formDataPayload.append('booking_services', JSON.stringify(formData.bookingServices.filter(s => s.name.trim())));
        formDataPayload.append('buffer_time', formData.bufferTime);
        formDataPayload.append('max_bookings_per_day', formData.maxBookingsPerDay);
        formDataPayload.append('advance_booking_days', formData.advanceBookingDays);
      }
      
      formDataPayload.append('selected_care_plan', formData.selectedCarePlan || 'none');
      formDataPayload.append('care_plan_billing', formData.isYearlyCarePlan ? 'yearly' : 'monthly');
      formDataPayload.append('page_notes', formData.pageNotes);
      formDataPayload.append('brand_preferences', formData.brandPreferences);
      formDataPayload.append('competitors', formData.competitors);
      formDataPayload.append('seo_keywords', formData.seoKeywords);
      formDataPayload.append('legal_pages', formData.legalPages.join(', '));
      formDataPayload.append('terms_explanation', formData.termsExplanation);
      formDataPayload.append('extra_notes', formData.extraNotes);
      formDataPayload.append('admin_panel', String(addedAdminPanel));
      if (isPostDemoFlow) {
        formDataPayload.append('concept_link', formData.conceptLink || conceptLink);
        formDataPayload.append('verification_fee_paid', formatPrice(VERIFICATION_FEE));
      }

      await fetch('https://getform.io/f/agdvpmpb', {
        method: 'POST',
        body: formDataPayload,
        headers: { 'Accept': 'application/json' },
      });

      // Use edge function for Stripe checkout
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      if (!SUPABASE_URL) {
        throw new Error('Payment not configured');
      }

      const response = await fetch(`${SUPABASE_URL}/functions/v1/create-package-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: formData.selectedPackage,
          email: formData.email,
          businessName: formData.businessName,
          contactPerson: formData.contactPerson,
          phone: formData.phone,
          selectedStyle: formData.selectedStyle,
          selectedLanguage: formData.selectedLanguage === 'custom' ? formData.customLanguages : formData.selectedLanguage,
          carePlanId: formData.selectedCarePlan,
          isYearly: formData.isYearlyCarePlan,
          wantsBooking: formData.wantsBooking,
          bookingAddonCost,
          addedAdminPanel,
          isPostDemoFlow,
          conceptLink: formData.conceptLink || conceptLink,
          // Customer type and VAT info
          customerType: customerTypeData.customerType,
          companyName: customerTypeData.companyName,
          orgNumber: customerTypeData.orgNumber,
          vatNumber: customerTypeData.vatNumber,
          vatVerified: customerTypeData.vatVerified,
          country: customerTypeData.country,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.url) {
        // Cache order data for confirmation email
        const orderDataForEmail = {
          email: formData.email,
          contactPerson: formData.contactPerson,
          businessName: formData.businessName,
          packageId: formData.selectedPackage,
          conceptLink: formData.conceptLink || conceptLink,
          wantsBooking: formData.wantsBooking,
          addedAdminPanel,
          selectedCarePlan: formData.selectedCarePlan,
          isYearlyCarePlan: formData.isYearlyCarePlan,
        };
        sessionStorage.setItem('pending_order', JSON.stringify(orderDataForEmail));
        
        window.open(data.url, '_blank');
        toast({ 
          title: t('Stripe-kassan öppnad', 'Stripe checkout opened'), 
          description: t('Slutför betalningen i det nya fönstret.', 'Complete payment in the new window.') 
        });
        localStorage.removeItem(STORAGE_KEY);
        setSubmitted(true);
        onComplete?.();
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({ 
        title: t('Något gick fel', 'Something went wrong'), 
        description: t('Försök igen senare.', 'Please try again later.'), 
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const pkg = useMemo(() => packages.find(p => p.id === formData.selectedPackage), [formData.selectedPackage]);

  if (submitted) {
    return (
      <div className="min-h-screen section-padding py-20 relative">
        <WizardBackground />
        <div className="container-narrow text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <motion.div 
              className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <CheckCircle2 className="w-10 h-10 text-accent" />
            </motion.div>
            <h1 className="text-4xl font-bold mb-4">{t('Tack för din beställning!', 'Thank you for your order!')}</h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-md mx-auto">
              {t('Vi har mottagit din beställning och börjar arbeta direkt.', 'We have received your order and will start working immediately.')}
            </p>
            <div className="p-6 bg-accent/10 rounded-xl inline-block mb-8">
              <p className="text-xl font-bold">{pkg?.name} — {formatPrice((pkg?.price || 0) - (isPostDemoFlow ? VERIFICATION_FEE : 0))}</p>
              <p className="text-muted-foreground">{t('Leverans inom', 'Delivery within')} {pkg?.delivery} {t('dagar', 'days')}</p>
            </div>
            <Button asChild><Link to="/">{t('Tillbaka till start', 'Back to home')}</Link></Button>
          </motion.div>
        </div>
      </div>
    );
  }

  const totalPrice = (pkg?.price || 0) + 
    (formData.wantsBooking && formData.selectedPackage !== 'pro' ? BOOKING_ADDON_PRICE : 0) +
    (addedAdminPanel ? ADMIN_PANEL_PRICE : 0) -
    (isPostDemoFlow ? VERIFICATION_FEE : 0);

  return (
    <div className="min-h-screen section-padding py-8 sm:py-12 relative overflow-hidden">
      <WizardBackground />
      
      <PackageCompareModal open={showPackageCompare} onOpenChange={setShowPackageCompare} />
      <CarePlansCompareModal open={showCarePlanCompare} onOpenChange={setShowCarePlanCompare} isYearly={formData.isYearlyCarePlan} />

      <div className="container-wide relative z-10 max-w-6xl mx-auto">
        {/* Resume Banner */}
        <AnimatePresence>
          {showResumeBanner && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto mb-4 sm:mb-6 p-3 sm:p-4 bg-accent/10 border border-accent/20 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4"
            >
              <div className="flex items-center gap-3">
                <RotateCcw className="w-5 h-5 text-accent flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">{t('Fortsätt där du slutade?', 'Continue where you left off?')}</p>
                  <p className="text-xs text-muted-foreground">{t('Vi har sparat dina svar.', 'We\'ve saved your answers.')}</p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="ghost" size="sm" onClick={clearSavedData} className="flex-1 sm:flex-initial">
                  {t('Börja om', 'Start over')}
                </Button>
                <Button size="sm" onClick={loadSavedData} className="flex-1 sm:flex-initial">
                  {t('Fortsätt', 'Continue')}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-accent/10 text-accent text-xs sm:text-sm font-medium mb-3 sm:mb-4">
            <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
            {isPostDemoFlow ? t('Slutför din beställning', 'Complete your order') : t('Beställ direkt', 'Order directly')}
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4">
            {t('Beställ din webbplats', 'Order your website')}
          </h1>
          <p className="text-sm sm:text-lg text-muted-foreground max-w-xl mx-auto px-4 sm:px-0">
            {isPostDemoFlow 
              ? t('Komplettera din beställning med mer information.', 'Complete your order with more details.')
              : t('Fyll i formuläret så börjar vi bygga din webbplats direkt.', 'Fill out the form and we\'ll start building your website right away.')
            }
          </p>
        </motion.div>

        {/* Step Indicator */}
        <WizardStepper currentStep={step} />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-[1fr,320px] gap-6 lg:gap-8">
          {/* Form Steps */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.15 }}
              className="min-w-0"
            >
              {step === 1 && (
                <Step1Contact formData={formData} setFormData={setFormData} errors={errors} showConceptOption={!isPostDemoFlow} />
              )}
              {step === 2 && (
                <Step2Package 
                  formData={formData} 
                  setFormData={setFormData} 
                  errors={errors} 
                  onComparePackages={() => setShowPackageCompare(true)}
                />
              )}
              {step === 3 && (
                <Step3Pages formData={formData} setFormData={setFormData} errors={errors} />
              )}
              {step === 4 && (
                <Step4CarePlan 
                  formData={formData} 
                  setFormData={setFormData} 
                  onCompareCarePlans={() => setShowCarePlanCompare(true)}
                />
              )}
              {step === 5 && (
                <Step5ProjectDetails 
                  formData={formData} 
                  setFormData={setFormData}
                />
              )}
              {step === 6 && (
                <Step6Payment 
                  formData={formData} 
                  setFormData={setFormData} 
                  isPostDemoFlow={isPostDemoFlow}
                  customerTypeData={customerTypeData}
                  onCustomerTypeChange={setCustomerTypeData}
                  addedAdminPanel={addedAdminPanel}
                  onAddAdminPanel={() => setAddedAdminPanel(true)}
                />
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6 sm:mt-8 gap-3">
                <Button 
                  variant="outline" 
                  onClick={handlePrevStep}
                  disabled={step === 1}
                  className="group"
                >
                  <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                  <span className="hidden sm:inline">{t('Tillbaka', 'Back')}</span>
                </Button>
                
                {step < 6 ? (
                  <Button size="lg" onClick={handleNextStep} className="group flex-1 sm:flex-initial sm:min-w-[160px]">
                    {t('Fortsätt', 'Continue')}
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                ) : (
                  <Button 
                    size="lg" 
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex-1 sm:flex-initial sm:min-w-[200px]"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        {t('Gå till betalning', 'Go to payment')}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="hidden lg:block">
            <OrderSummary 
              formData={formData} 
              isPostDemoFlow={isPostDemoFlow}
              currentStep={step}
              onCheckout={step === 6 ? handleSubmit : undefined}
              isLoading={isLoading}
              addedAdminPanel={addedAdminPanel}
            />
          </div>
        </div>

        {/* Mobile: Fixed bottom bar */}
        <div className="lg:hidden h-20" />
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="lg:hidden fixed bottom-0 left-0 right-0 p-3 bg-background/95 backdrop-blur-md border-t z-50"
        >
          <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
            {step === 6 && pkg ? (
              <>
                <div className="flex-shrink-0">
                  <p className="text-xs text-muted-foreground">{t('Totalt', 'Total')}</p>
                  <p className="text-lg font-bold">{formatPrice(totalPrice)}</p>
                </div>
                <Button size="lg" onClick={handleSubmit} disabled={isLoading} className="flex-1 max-w-[160px]">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('Betala', 'Pay')}
                </Button>
              </>
            ) : (
              <>
                <div className="flex-shrink-0 text-sm text-muted-foreground">
                  {t('Steg', 'Step')} {step}/6
                </div>
                <Button size="lg" onClick={handleNextStep} className="flex-1 max-w-[180px]">
                  {t('Fortsätt', 'Continue')} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export const WebsiteOrderWizard = memo(WebsiteOrderWizardComponent);
