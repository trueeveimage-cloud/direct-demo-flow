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
import { supabase } from '@/integrations/supabase/client';

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
  getBookingAddonPrice,
  getVerificationFee
} from './wizardConfig';
import { getCurrencyFromLang, getPackagePrice, getAddonPrice } from '@/config/currency';

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

// Check for saved data on mount - show resume prompt if data exists
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Check if data is less than 7 days old and has meaningful content
        const hasContent = parsed.businessName || parsed.email || parsed.step > 1;
        if (hasContent && Date.now() - parsed.lastSaved < 7 * 24 * 60 * 60 * 1000) {
          setShowResumeBanner(true);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Detect when user returns from Stripe payment and redirect to success page
  useEffect(() => {
    if (!submitted) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // User returned to the tab - check if there's a pending order
        const pendingOrder = sessionStorage.getItem('pending_order');
        if (pendingOrder) {
          // Redirect to success page - Stripe will add session_id via success_url
          window.location.href = '/payment-success';
        }
      }
    };

    const handleFocus = () => {
      const pendingOrder = sessionStorage.getItem('pending_order');
      if (pendingOrder) {
        window.location.href = '/payment-success';
      }
    };

    // 30-second timeout fallback - auto-redirect if user doesn't return
    const timeoutId = setTimeout(() => {
      const pendingOrder = sessionStorage.getItem('pending_order');
      if (pendingOrder) {
        window.location.href = '/payment-success';
      }
    }, 30000);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [submitted]);

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

  const currency = getCurrencyFromLang(lang);
  
  const formatPriceLocal = (price: number) => {
    if (currency === 'EUR') {
      return '€' + price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    } else {
      return price.toLocaleString('sv-SE', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' kr';
    }
  };

  const ADMIN_PANEL_PRICE = getAddonPrice('adminPanel', currency);
  const BOOKING_ADDON_PRICE = getBookingAddonPrice(currency);
  const VERIFICATION_FEE = getVerificationFee(currency);

  const handleSubmit = async () => {
    // Validate customer type is selected
    if (!customerTypeData.customerType) {
      toast({ 
        title: t('Välj kundtyp', 'Select customer type'), 
        description: t('Du måste välja Privatperson eller Företag innan du kan fortsätta.', 'You must select Private or Business before continuing.'),
        variant: 'destructive' 
      });
      return;
    }

    // Validate business fields if business selected
    if (customerTypeData.customerType === 'business') {
      if (!customerTypeData.companyName || !customerTypeData.orgNumber || !customerTypeData.billingAddress) {
        toast({ 
          title: t('Fyll i företagsuppgifter', 'Fill in company details'), 
          description: t('Alla företagsuppgifter måste fyllas i.', 'All company details must be filled in.'),
          variant: 'destructive' 
        });
        return;
      }
    }

    setIsLoading(true);
    
    try {
      const pkg = packages.find(p => p.id === formData.selectedPackage);
      const pkgPrice = pkg ? getPackagePrice(pkg.id, currency) : 0;
      const bookingAddonCost = formData.wantsBooking && formData.selectedPackage !== 'pro' ? BOOKING_ADDON_PRICE : 0;
      const adminPanelCost = addedAdminPanel ? ADMIN_PANEL_PRICE : 0;
      const totalPackagePrice = pkgPrice + bookingAddonCost + adminPanelCost;

      // Save submission to database BEFORE payment redirect
      const orderSubmission = {
        submission_type: isPostDemoFlow ? 'post_demo_order' : 'direct_order',
        email: formData.email,
        business_name: formData.businessName,
        contact_person: formData.contactPerson,
        phone: formData.phone,
        business_type: formData.businessType === 'other' ? formData.businessTypeOther : formData.businessType,
        website_goal: formData.websiteGoal,
        selected_package: formData.selectedPackage,
        selected_style: formData.selectedStyle,
        selected_language: formData.selectedLanguage === 'custom' ? formData.customLanguages : formData.selectedLanguage,
        primary_color: formData.noColorPreference ? 'No preference' : formData.primaryColor,
        accent_color: formData.noColorPreference ? 'No preference' : formData.accentColor,
        selected_pages: formData.selectedPages,
        custom_pages: formData.customPages.filter(p => p.trim()),
        services: formData.services,
        wants_booking: formData.wantsBooking,
        opening_hours: formData.openingHours || null,
        appointment_lengths: formData.appointmentLengths.length > 0 ? formData.appointmentLengths : null,
        booking_services: JSON.parse(JSON.stringify(formData.bookingServices.filter(s => s.name.trim()))),
        buffer_time: formData.bufferTime || null,
        max_bookings_per_day: formData.maxBookingsPerDay || null,
        advance_booking_days: formData.advanceBookingDays || null,
        selected_care_plan: formData.selectedCarePlan || null,
        is_yearly_care_plan: formData.isYearlyCarePlan,
        legal_pages: formData.legalPages,
        terms_explanation: formData.termsExplanation || null,
        page_notes: formData.pageNotes || null,
        brand_preferences: formData.brandPreferences || null,
        competitors: formData.competitors || null,
        seo_keywords: formData.seoKeywords || null,
        extra_notes: formData.extraNotes || null,
        customer_type: customerTypeData.customerType || null,
        company_name: customerTypeData.companyName || null,
        org_number: customerTypeData.orgNumber || null,
        vat_number: customerTypeData.vatNumber || null,
        vat_verified: customerTypeData.vatVerified,
        country: customerTypeData.country || null,
        wants_admin_panel: addedAdminPanel,
        wants_google_maps: formData.wantsGoogleMaps,
        google_maps_address: formData.googleMapsAddress || null,
        wants_google_reviews: formData.wantsGoogleReviews,
        google_business_link: formData.googleBusinessLink || null,
        wants_before_after: formData.wantsBeforeAfter,
        wants_checkout_system: formData.wantsCheckoutSystem,
        concept_link: isPostDemoFlow ? (formData.conceptLink || conceptLink) : null,
        payment_status: 'pending',
        payment_amount: formatPriceLocal(totalPackagePrice),
        business_followups: JSON.parse(JSON.stringify(formData.businessFollowUps)),
      };

      const { data: insertedOrder, error: dbError } = await supabase
        .from('order_submissions')
        .insert([orderSubmission])
        .select('id')
        .maybeSingle();

      if (dbError) {
        console.error('Failed to save order:', dbError);
        // Continue anyway - don't block payment
      }

      // Store order ID for later payment status update
      if (insertedOrder?.id) {
        sessionStorage.setItem('pending_order_id', insertedOrder.id);
      }

      // Use edge function for Stripe checkout
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      if (!SUPABASE_URL) {
        throw new Error('Payment not configured');
      }

      const response = await fetch(`${SUPABASE_URL}/functions/v1/create-package-checkout`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
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
          // Currency for Stripe
          currency: currency,
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
              <Loader2 className="w-10 h-10 text-accent animate-spin" />
            </motion.div>
            <h1 className="text-4xl font-bold mb-4">{t('Slutför betalningen', 'Complete your payment')}</h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-md mx-auto">
              {t('Stripe-kassan har öppnats i ett nytt fönster. Slutför betalningen där för att slutföra din beställning.', 'Stripe checkout has opened in a new window. Complete the payment there to finalize your order.')}
            </p>
            <div className="p-6 bg-accent/10 rounded-xl inline-block mb-8">
              <p className="text-xl font-bold">{pkg?.name} — {formatPriceLocal((pkg ? getPackagePrice(pkg.id, currency) : 0) - (isPostDemoFlow ? VERIFICATION_FEE : 0))}</p>
              <p className="text-muted-foreground">{t('Leverans inom', 'Delivery within')} {pkg?.delivery} {t('dagar', 'days')}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" onClick={() => setSubmitted(false)}>
                {t('Tillbaka till beställningen', 'Back to order')}
              </Button>
              <Button asChild>
                <Link to="/">{t('Tillbaka till start', 'Back to home')}</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const totalPrice = (pkg ? getPackagePrice(pkg.id, currency) : 0) + 
    (formData.wantsBooking && formData.selectedPackage !== 'pro' ? BOOKING_ADDON_PRICE : 0) +
    (addedAdminPanel ? ADMIN_PANEL_PRICE : 0) -
    (isPostDemoFlow ? VERIFICATION_FEE : 0);

  return (
    <div className="min-h-screen section-padding py-6 sm:py-12 relative overflow-hidden">
      <WizardBackground />
      
      <PackageCompareModal open={showPackageCompare} onOpenChange={setShowPackageCompare} />
      <CarePlansCompareModal open={showCarePlanCompare} onOpenChange={setShowCarePlanCompare} isYearly={formData.isYearlyCarePlan} />
      <AdminPanelUpsellModal 
        open={showAdminPanelModal} 
        onOpenChange={setShowAdminPanelModal}
        onAccept={() => {
          setAddedAdminPanel(true);
          setShowAdminPanelModal(false);
          setAdminPanelDecision(true);
          handleSubmit();
        }}
        onDecline={() => {
          setShowAdminPanelModal(false);
          setAdminPanelDecision(true);
          handleSubmit();
        }}
      />

      <div className="container-wide relative z-10 max-w-6xl mx-auto px-3 sm:px-6">
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
        <div className="grid lg:grid-cols-[1fr,320px] gap-4 sm:gap-6 lg:gap-8">
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
              <div className="flex justify-between mt-4 sm:mt-8 gap-2 sm:gap-3">
                <Button 
                  variant="outline" 
                  onClick={handlePrevStep}
                  disabled={step === 1}
                  className="group h-11 sm:h-12 px-3 sm:px-4"
                  size="sm"
                >
                  <ArrowLeft className="w-4 h-4 sm:mr-2 transition-transform group-hover:-translate-x-1" />
                  <span className="hidden sm:inline">{t('Tillbaka', 'Back')}</span>
                </Button>
                
                {step < 6 ? (
                  <Button 
                    onClick={handleNextStep} 
                    className="group flex-1 sm:flex-initial sm:min-w-[160px] h-11 sm:h-12"
                  >
                    {t('Fortsätt', 'Continue')}
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                ) : (
                  <Button 
                    onClick={() => {
                      // Show admin panel popup if not already decided
                      if (!addedAdminPanel && !adminPanelDecision) {
                        setShowAdminPanelModal(true);
                      } else {
                        handleSubmit();
                      }
                    }}
                    disabled={isLoading}
                    className="flex-1 sm:flex-initial sm:min-w-[200px] h-11 sm:h-12"
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

          {/* Hide order summary sidebar on payment step */}
          {step !== 6 && (
            <div className="hidden lg:block">
              <OrderSummary 
                formData={formData} 
                isPostDemoFlow={isPostDemoFlow}
                currentStep={step}
                onCheckout={undefined}
                isLoading={isLoading}
                addedAdminPanel={addedAdminPanel}
              />
            </div>
          )}
        </div>

        {/* Mobile: Fixed bottom bar */}
        <div className="lg:hidden h-24" />
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="lg:hidden fixed bottom-0 left-0 right-0 p-3 bg-background/95 backdrop-blur-md border-t z-50 safe-area-bottom"
        >
          <div className="flex items-center justify-between gap-2 max-w-lg mx-auto">
            {step === 6 && pkg ? (
              <>
                <div className="flex-shrink-0 min-w-0">
                  <p className="text-[10px] text-muted-foreground">{t('Totalt', 'Total')}</p>
                  <p className="text-base font-bold truncate">{formatPriceLocal(totalPrice)}</p>
                </div>
                <Button 
                  onClick={() => {
                    if (!addedAdminPanel && !adminPanelDecision) {
                      setShowAdminPanelModal(true);
                    } else {
                      handleSubmit();
                    }
                  }} 
                  disabled={isLoading} 
                  className="flex-1 max-w-[140px] h-11"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('Betala', 'Pay')}
                </Button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium">{t('Steg', 'Step')} {step}/6</span>
                </div>
                <Button onClick={handleNextStep} className="flex-1 max-w-[160px] h-11">
                  {t('Fortsätt', 'Continue')} <ArrowRight className="w-4 h-4 ml-1" />
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
