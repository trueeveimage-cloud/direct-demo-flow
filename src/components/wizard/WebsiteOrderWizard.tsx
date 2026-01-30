import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { WizardBackground } from './WizardBackground';
import { WizardStepper } from './WizardStepper';
import { WizardSkeleton } from './WizardSkeleton';
import { WizardFooterControls } from './WizardFooterControls';
import { AdminPanelUpsellModal } from '@/components/AdminPanelUpsellModal';
import { PackageCompareModal } from '@/components/PackageCompareModal';
import { CarePlansCompareModal } from '@/components/CarePlansCompareModal';
import { 
  WizardFormData, 
  initialFormData, 
  FormStep
} from './wizardConfig';
import { getCurrencyFromLang, getPackagePrice, getAddonPrice } from '@/config/currency';
import { trackFunnelEvent, FunnelEvents } from '@/lib/posthog';
import { Step1Contact } from './steps/Step1Contact';
import { Step2Package } from './steps/Step2Package';
import { Step3Pages } from './steps/Step3Pages';
import { Step4CarePlan } from './steps/Step4CarePlan';
import { Step5ProjectDetails } from './steps/Step5ProjectDetails';
import { Step6Payment } from './steps/Step6Payment';
import { OrderSummary } from './OrderSummary';
import { CustomerTypeSelection, CustomerTypeData, initialCustomerTypeData } from './steps/CustomerTypeSelection';

interface WebsiteOrderWizardProps {
  isPostDemoFlow?: boolean;
  conceptLink?: string;
  onComplete?: () => void;
}

export function WebsiteOrderWizard({ isPostDemoFlow = false, conceptLink, onComplete }: WebsiteOrderWizardProps) {
  const { toast } = useToast();
  const { lang } = useLanguage();
  const t = (sv: string, en: string) => lang === 'sv' ? sv : en;

  const [step, setStep] = useState<FormStep>(1);
  const [formData, setFormData] = useState<WizardFormData>(() => ({
    ...initialFormData,
    conceptLink: conceptLink || ''
  }));
  const [customerTypeData, setCustomerTypeData] = useState<CustomerTypeData>(initialCustomerTypeData);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  const [addedAdminPanel, setAddedAdminPanel] = useState(false);
  const [lastAttemptedStep, setLastAttemptedStep] = useState<FormStep | null>(null);
  const [showCarePlanCompare, setShowCarePlanCompare] = useState(false);
  const [showPackageCompare, setShowPackageCompare] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  // Currency based on language
  const currency = getCurrencyFromLang(lang);
  
  // Track wizard start on mount
  const hasTrackedStart = useRef(false);
  useEffect(() => {
    if (!hasTrackedStart.current) {
      hasTrackedStart.current = true;
      trackFunnelEvent('WIZARD_START', { wizard_type: isPostDemoFlow ? 'post_demo' : 'direct', step: 1 });
    }
  }, [isPostDemoFlow]);

  // Track step changes
  useEffect(() => {
    trackFunnelEvent('WIZARD_STEP', { wizard_type: isPostDemoFlow ? 'post_demo' : 'direct', step });
    
    // Track checkout start when reaching payment step
    if (step === 6) {
      trackFunnelEvent('CHECKOUT_START', { wizard_type: isPostDemoFlow ? 'post_demo' : 'direct' });
    }
  }, [step, isPostDemoFlow]);

  // Update formData when conceptLink changes
  useEffect(() => {
    if (conceptLink) {
      setFormData(prev => ({ ...prev, conceptLink }));
    }
  }, [conceptLink]);

  // Track if confetti has been shown for step 6
  const hasShownConfetti = useRef(false);

  // Auto scroll to top when step changes + confetti on payment step
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Show confetti when reaching payment step (step 6)
    if (step === 6 && !hasShownConfetti.current) {
      hasShownConfetti.current = true;
      // Small delay to let the page transition complete
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.3 },
          colors: ['#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A', '#FEF3C7']
        });
      }, 400);
    }
  }, [step]);

  // Validation with scroll-to-field functionality
  const validateStep = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    
    switch (step) {
      case 1:
        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = true;
        if (!formData.businessName.trim()) newErrors.businessName = true;
        if (!formData.contactPerson.trim()) newErrors.contactPerson = true;
        break;
      case 2:
        if (!formData.selectedPackage) newErrors.selectedPackage = true;
        break;
      case 3:
        if (formData.selectedPages.length === 0 && formData.customPages.filter(p => p.trim()).length === 0) {
          newErrors.pages = true;
        }
        break;
      case 4:
        // Care plan is now mandatory
        if (!formData.selectedCarePlan) newErrors.selectedCarePlan = true;
        break;
      case 5:
        // All fields optional in this step
        break;
      case 6:
        // Payment step - validated on submit
        if (!customerTypeData.customerType) newErrors.customerType = true;
        if (customerTypeData.customerType === 'business') {
          if (!customerTypeData.companyName?.trim()) newErrors.companyName = true;
          if (!customerTypeData.orgNumber?.trim()) newErrors.orgNumber = true;
        }
        if (!acceptedTerms) newErrors.acceptedTerms = true;
        break;
    }
    
    setErrors(newErrors);
    
    // Scroll to first error field and highlight it
    if (Object.keys(newErrors).length > 0) {
      const firstErrorKey = Object.keys(newErrors)[0];
      scrollToAndHighlight(firstErrorKey);
    }
    
    return Object.keys(newErrors).length === 0;
  };

  // Scroll to error field and add highlight animation
  const scrollToAndHighlight = (errorKey: string) => {
    // Map error keys to element IDs or data attributes
    const fieldSelectors: Record<string, string> = {
      email: '[data-field="email"], #email, input[type="email"]',
      businessName: '[data-field="businessName"], #businessName, input[name="businessName"]',
      contactPerson: '[data-field="contactPerson"], #contactPerson, input[name="contactPerson"]',
      selectedPackage: '[data-field="package"], .package-selection',
      pages: '[data-field="pages"], .page-selection',
      selectedCarePlan: '[data-field="carePlan"], .care-plan-selection',
      customerType: '[data-field="customerType"], .customer-type-selection',
      companyName: '[data-field="companyName"], #companyName, input[name="companyName"]',
      orgNumber: '[data-field="orgNumber"], #orgNumber, input[name="orgNumber"]',
      country: '[data-field="country"], #country, select[name="country"]',
      acceptedTerms: '#accept-terms',
    };
    
    const selector = fieldSelectors[errorKey];
    if (!selector) return;
    
    // Find the element
    const element = document.querySelector(selector) as HTMLElement;
    if (!element) return;
    
    // Scroll to element with offset
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Add highlight animation class after a small delay for scroll to complete
    setTimeout(() => {
      element.classList.add('error-highlight');
      
      // Focus if it's an input
      if (element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'TEXTAREA') {
        element.focus();
      }
      
      // Remove highlight after animation
      setTimeout(() => {
        element.classList.remove('error-highlight');
      }, 2000);
    }, 300);
  };

  // Check if we should show upsell modal (before payment step and hasn't added admin panel)
  const shouldShowUpsell = () => {
    return step === 5 && !addedAdminPanel && !formData.wantsAdminPanel;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (shouldShowUpsell()) {
        setShowUpsellModal(true);
        setLastAttemptedStep((step + 1) as FormStep);
      } else {
        if (step < 6) {
          setStep((step + 1) as FormStep);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    } else {
      // Show toast with scroll indicator
      toast({
        title: t('Fyll i alla obligatoriska fält', 'Please fill in all required fields'),
        description: t('Vi visar dig vad som saknas...', 'We\'re showing you what\'s missing...'),
        variant: 'destructive'
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as FormStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleUpsellAccept = () => {
    setFormData(prev => ({ ...prev, wantsAdminPanel: true }));
    setAddedAdminPanel(true);
    setShowUpsellModal(false);
    if (lastAttemptedStep) {
      setStep(lastAttemptedStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleUpsellDecline = () => {
    setAddedAdminPanel(true);
    setShowUpsellModal(false);
    if (lastAttemptedStep) {
      setStep(lastAttemptedStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Calculate pricing
  const calculateTotal = useMemo(() => {
    const packagePrice = getPackagePrice(formData.selectedPackage || 'standard', currency);
    let addons = 0;
    
    if (formData.wantsBooking) addons += getAddonPrice('booking', currency);
    if (formData.wantsAdminPanel) addons += getAddonPrice('adminPanel', currency);
    if (formData.wantsGoogleReviews) addons += getAddonPrice('googleReviews', currency);
    if (formData.wantsGoogleMaps) addons += getAddonPrice('googleMaps', currency);
    if (formData.wantsBeforeAfter) addons += getAddonPrice('beforeAfter', currency);
    if (formData.wantsCheckoutSystem) addons += getAddonPrice('checkoutSystem', currency);
    
    // Care plan monthly cost
    let carePlanMonthly = 0;
    if (formData.selectedCarePlan === 'basic') carePlanMonthly = getAddonPrice('carePlanBasic', currency);
    else if (formData.selectedCarePlan === 'plus') carePlanMonthly = getAddonPrice('carePlanPlus', currency);
    else if (formData.selectedCarePlan === 'premium') carePlanMonthly = getAddonPrice('carePlanPremium', currency);
    
    // Concept discount for post-demo flow
    const conceptDiscount = isPostDemoFlow ? getAddonPrice('verification', currency) : 0;
    
    return {
      packagePrice,
      addons,
      carePlanMonthly,
      conceptDiscount,
      total: packagePrice + addons + carePlanMonthly - conceptDiscount
    };
  }, [formData, currency, isPostDemoFlow]);

  // Submit handler
  const handleSubmit = async () => {
    if (!validateStep()) {
      toast({
        title: t('Fyll i alla obligatoriska fält', 'Please fill in all required fields'),
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Track wizard completion and checkout
    trackFunnelEvent('WIZARD_COMPLETE', { wizard_type: isPostDemoFlow ? 'post_demo' : 'direct' });
    trackFunnelEvent('CHECKOUT_COMPLETE', { 
      wizard_type: isPostDemoFlow ? 'post_demo' : 'direct',
      package: formData.selectedPackage,
      care_plan: formData.selectedCarePlan 
    });
    
    try {
      // Prepare order data
      const orderData = {
        email: formData.email,
        business_name: formData.businessName,
        contact_person: formData.contactPerson,
        phone: formData.phone || null,
        current_website: formData.currentWebsite || null,
        customer_type: customerTypeData.customerType,
        company_name: customerTypeData.companyName || null,
        org_number: customerTypeData.orgNumber || null,
        vat_number: customerTypeData.vatNumber || null,
        country: customerTypeData.country || null,
        selected_package: formData.selectedPackage,
        selected_style: formData.selectedStyle || null,
        selected_language: formData.selectedLanguage,
        primary_color: formData.primaryColor || null,
        accent_color: formData.accentColor || null,
        selected_pages: formData.selectedPages,
        custom_pages: formData.customPages.filter(p => p.trim()),
        legal_pages: formData.legalPages,
        page_notes: formData.pageNotes || null,
        wants_booking: formData.wantsBooking,
        wants_admin_panel: formData.wantsAdminPanel,
        wants_google_reviews: formData.wantsGoogleReviews,
        wants_google_maps: formData.wantsGoogleMaps,
        google_maps_address: formData.googleMapsAddress || null,
        wants_before_after: formData.wantsBeforeAfter,
        wants_checkout_system: formData.wantsCheckoutSystem,
        selected_care_plan: formData.selectedCarePlan || null,
        is_yearly_care_plan: formData.isYearlyCarePlan,
        brand_preferences: formData.brandPreferences || null,
        competitors: formData.competitors || null,
        seo_keywords: formData.seoKeywords || null,
        extra_notes: formData.extraNotes || null,
        concept_link: formData.conceptLink || null,
        submission_type: isPostDemoFlow ? 'post_demo_order' : 'direct_order',
        payment_status: 'pending',
        payment_amount: String(calculateTotal.total),
        vat_verified: customerTypeData.vatVerified
      };

      // Save to database first
      const { data: orderResult, error: orderError } = await supabase
        .from('order_submissions')
        .insert(orderData)
        .select('id')
        .single();

      if (orderError) throw orderError;

      // Create Stripe checkout session
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke('create-package-checkout', {
        body: {
          orderId: orderResult.id,
          packageId: formData.selectedPackage,
          email: formData.email,
          businessName: formData.businessName,
          contactPerson: formData.contactPerson,
          phone: formData.phone || '',
          conceptLink: formData.conceptLink || '',
          carePlanId: formData.selectedCarePlan || '',
          isYearly: formData.isYearlyCarePlan,
          wantsBooking: formData.wantsBooking,
          bookingAddonCost: formData.wantsBooking && formData.selectedPackage !== 'pro' ? getAddonPrice('booking', currency) : 0,
          addedAdminPanel: addedAdminPanel || formData.wantsAdminPanel,
          isPostDemoFlow,
          customerType: customerTypeData.customerType,
          companyName: customerTypeData.companyName || '',
          orgNumber: customerTypeData.orgNumber || '',
          vatNumber: customerTypeData.vatNumber || '',
          vatVerified: customerTypeData.vatVerified,
          country: customerTypeData.country || 'SE',
          currency,
          selectedStyle: formData.selectedStyle || '',
          selectedLanguage: formData.selectedLanguage || lang,
          wantsCheckoutSystem: formData.wantsCheckoutSystem,
        }
      });

      if (checkoutError) {
        console.error('Checkout error details:', JSON.stringify(checkoutError, null, 2));
        throw checkoutError;
      }

      console.log('Checkout response:', checkoutData);

      if (checkoutData?.url) {
        toast({ 
          title: t('Stripe-kassan öppnad', 'Stripe checkout opened'), 
          description: t('Slutför betalningen i det nya fönstret.', 'Complete payment in the new window.') 
        });
        setSubmitted(true);
        onComplete?.();
        window.location.href = checkoutData.url;
      } else {
        console.error('No URL in checkout response:', checkoutData);
        throw new Error('No checkout URL returned');
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      console.error('Error message:', error?.message);
      console.error('Error context:', error?.context);
      toast({
        title: t('Något gick fel', 'Something went wrong'),
        description: error?.message || t('Försök igen eller kontakta oss.', 'Please try again or contact us.'),
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render current step
  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1Contact formData={formData} setFormData={setFormData} customerTypeData={customerTypeData} setCustomerTypeData={setCustomerTypeData} errors={errors} />;
      case 2:
        return <Step2Package formData={formData} setFormData={setFormData} errors={errors} onComparePackages={() => setShowPackageCompare(true)} />;
      case 3:
        return <Step3Pages formData={formData} setFormData={setFormData} errors={errors} />;
      case 4:
        return <Step4CarePlan formData={formData} setFormData={setFormData} onCompareCarePlans={() => setShowCarePlanCompare(true)} errors={errors} />;
      case 5:
        return <Step5ProjectDetails formData={formData} setFormData={setFormData} />;
      case 6:
        return (
          <Step6Payment 
            formData={formData}
            setFormData={setFormData}
            isPostDemoFlow={isPostDemoFlow}
            customerTypeData={customerTypeData}
            onCustomerTypeChange={setCustomerTypeData}
            addedAdminPanel={addedAdminPanel || formData.wantsAdminPanel}
            onAddAdminPanel={() => {
              setFormData(prev => ({ ...prev, wantsAdminPanel: true }));
              setAddedAdminPanel(true);
            }}
            acceptedTerms={acceptedTerms}
            onAcceptTerms={setAcceptedTerms}
          />
        );
      default:
        return null;
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg">{t('Omdirigerar till betalning...', 'Redirecting to payment...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 sm:py-12 relative overflow-hidden">
      {/* Background Effects - matching demo page style */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>
      
      {/* Header Section */}
      <div className="text-center mb-6 sm:mb-8 px-4">
        <a href="/" className="inline-block font-heading font-semibold text-2xl tracking-tight hover:opacity-80 transition-opacity mb-4">
          Nomia<span className="text-accent">.</span>
        </a>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight mb-2">
          {t('Beställ din hemsida', 'Order your website')}
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
          {t('Fyll i formuläret så sätter vi igång med ditt projekt.', 'Fill out the form and we\'ll get started on your project.')}
        </p>
      </div>
      
      <div className="container-wide relative z-10 max-w-6xl mx-auto px-3 sm:px-6">
        {/* Stepper */}
        <WizardStepper 
          currentStep={step} 
          onStepClick={(s) => s < step && setStep(s)}
        />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Form Area */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div 
                key={step}
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ 
                  duration: 0.35, 
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-4 sm:p-6 md:p-8"
              >
                {renderStep()}
                
                {/* Navigation */}
                {step !== 6 && (
                  <div className="flex justify-between mt-8 pt-6 border-t border-border">
                    {step > 1 ? (
                      <Button variant="outline" onClick={handleBack}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {t('Tillbaka', 'Back')}
                      </Button>
                    ) : (
                      <div />
                    )}
                    
                    <Button onClick={handleNext} className="bg-primary hover:bg-primary/90">
                      {t('Nästa', 'Next')}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
                
                {/* Payment Step Submit */}
                {step === 6 && (
                  <div className="flex justify-between mt-8 pt-6 border-t border-border">
                    <Button variant="outline" onClick={handleBack}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      {t('Tillbaka', 'Back')}
                    </Button>
                    
                    <Button 
                      onClick={handleSubmit} 
                      disabled={isSubmitting}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {t('Bearbetar...', 'Processing...')}
                        </>
                      ) : (
                        t('Gå till betalning', 'Proceed to payment')
                      )}
                    </Button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <OrderSummary 
              formData={formData}
              isPostDemoFlow={isPostDemoFlow}
              currentStep={step}
              addedAdminPanel={addedAdminPanel || formData.wantsAdminPanel}
              customerTypeData={customerTypeData}
            />
          </div>
        </div>
        
        {/* Footer Controls */}
        <WizardFooterControls />
      </div>

      {/* Admin Panel Upsell Modal */}
      <AdminPanelUpsellModal
        open={showUpsellModal}
        onOpenChange={setShowUpsellModal}
        onAccept={handleUpsellAccept}
        onDecline={handleUpsellDecline}
      />
      
      {/* Package Compare Modal */}
      <PackageCompareModal
        open={showPackageCompare}
        onOpenChange={setShowPackageCompare}
      />
      
      {/* Care Plans Compare Modal */}
      <CarePlansCompareModal
        open={showCarePlanCompare}
        onOpenChange={setShowCarePlanCompare}
        isYearly={formData.isYearlyCarePlan}
      />
    </div>
  );
}

export default WebsiteOrderWizard;
