import { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { WizardBackground } from './WizardBackground';
import { WizardStepper } from './WizardStepper';
import { WizardSkeleton } from './WizardSkeleton';
import { AdminPanelUpsellModal } from '@/components/AdminPanelUpsellModal';
import { 
  WizardFormData, 
  CustomerTypeData,
  initialFormData, 
  initialCustomerTypeData,
  stepConfig,
  stepConfigPostDemo
} from './wizardConfig';
import { getCurrencyFromLang, getPackagePrice, getAddonPrice } from '@/config/currency';

interface WebsiteOrderWizardProps {
  isPostDemoFlow?: boolean;
  conceptLink?: string;
  onComplete?: () => void;
}

// Lazy load step components for better initial load performance
const Step1Contact = lazy(() => import('./steps/Step1Contact'));
const CustomerTypeSelection = lazy(() => import('./steps/CustomerTypeSelection'));
const Step2Package = lazy(() => import('./steps/Step2Package'));
const Step3Pages = lazy(() => import('./steps/Step3Pages'));
const Step4CarePlan = lazy(() => import('./steps/Step4CarePlan'));
const Step5ProjectDetails = lazy(() => import('./steps/Step5ProjectDetails'));
const Step6Payment = lazy(() => import('./steps/Step6Payment'));
const OrderSummary = lazy(() => import('./OrderSummary'));

const WebsiteOrderWizardComponent = ({ isPostDemoFlow = false, conceptLink, onComplete }: WebsiteOrderWizardProps) => {
  const { toast } = useToast();
  const { lang } = useLanguage();
  const t = (sv: string, en: string) => lang === 'sv' ? sv : en;
  
  // Use appropriate step config based on flow
  const currentStepConfig = isPostDemoFlow ? stepConfigPostDemo : stepConfig;
  const totalSteps = currentStepConfig.length;

  const [step, setStep] = useState(1);
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
  const [lastAttemptedStep, setLastAttemptedStep] = useState<number | null>(null);
  
  // Currency based on language
  const currency = getCurrencyFromLang(lang);

  // Update formData when conceptLink changes
  useEffect(() => {
    if (conceptLink) {
      setFormData(prev => ({ ...prev, conceptLink }));
    }
  }, [conceptLink]);

  // Helper for updating form data
  const updateFormData = useCallback((updates: Partial<WizardFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const updateCustomerTypeData = useCallback((updates: Partial<CustomerTypeData>) => {
    setCustomerTypeData(prev => ({ ...prev, ...updates }));
  }, []);

  // Get the actual step type from config
  const getCurrentStepType = () => currentStepConfig[step - 1];

  // Validation
  const validateStep = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    const stepType = getCurrentStepType();
    
    switch (stepType) {
      case 'contact':
        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = true;
        if (!formData.businessName.trim()) newErrors.businessName = true;
        if (!formData.contactPerson.trim()) newErrors.contactPerson = true;
        break;
      case 'customerType':
        if (!customerTypeData.type) newErrors.customerType = true;
        if (customerTypeData.type === 'company') {
          if (!customerTypeData.companyName?.trim()) newErrors.companyName = true;
          if (!customerTypeData.orgNumber?.trim()) newErrors.orgNumber = true;
          if (!customerTypeData.country) newErrors.country = true;
        }
        break;
      case 'package':
        if (!formData.selectedPackage) newErrors.selectedPackage = true;
        break;
      case 'pages':
        if (formData.selectedPages.length === 0 && formData.customPages.length === 0) newErrors.pages = true;
        break;
      case 'carePlan':
        // Care plan is optional
        break;
      case 'projectDetails':
        // All fields optional in this step
        break;
      case 'payment':
        // Validated on submit
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if we should show upsell modal (before payment step and hasn't added admin panel)
  const shouldShowUpsell = () => {
    const nextStepType = currentStepConfig[step];
    return nextStepType === 'payment' && !addedAdminPanel && !formData.wantsAdminPanel;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (shouldShowUpsell()) {
        setShowUpsellModal(true);
        setLastAttemptedStep(step + 1);
      } else {
        if (step < totalSteps) {
          setStep(step + 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    } else {
      toast({
        title: t('Fyll i alla obligatoriska fält', 'Please fill in all required fields'),
        variant: 'destructive'
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleUpsellAccept = () => {
    updateFormData({ wantsAdminPanel: true });
    setAddedAdminPanel(true);
    setShowUpsellModal(false);
    if (lastAttemptedStep) {
      setStep(lastAttemptedStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleUpsellDecline = () => {
    setAddedAdminPanel(true); // Mark as shown so we don't show again
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
    
    // Care plan monthly cost (first month is included in total)
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
    setIsSubmitting(true);
    
    try {
      // Prepare order data
      const orderData = {
        email: formData.email,
        business_name: formData.businessName,
        contact_person: formData.contactPerson,
        phone: formData.phone || null,
        current_website: formData.currentWebsite || null,
        customer_type: customerTypeData.type,
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
        custom_pages: formData.customPages,
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
          email: formData.email,
          businessName: formData.businessName,
          packageName: formData.selectedPackage,
          currency,
          language: lang,
          isPostDemoFlow,
          addons: {
            booking: formData.wantsBooking,
            adminPanel: formData.wantsAdminPanel,
            googleReviews: formData.wantsGoogleReviews,
            googleMaps: formData.wantsGoogleMaps,
            beforeAfter: formData.wantsBeforeAfter,
            checkoutSystem: formData.wantsCheckoutSystem,
          },
          carePlan: formData.selectedCarePlan,
          isYearlyCarePlan: formData.isYearlyCarePlan,
          customerType: customerTypeData.type,
          vatNumber: customerTypeData.vatNumber,
          vatVerified: customerTypeData.vatVerified,
        }
      });

      if (checkoutError) throw checkoutError;

      if (checkoutData?.url) {
        toast({ 
          title: t('Stripe-kassan öppnad', 'Stripe checkout opened'), 
          description: t('Slutför betalningen i det nya fönstret.', 'Complete payment in the new window.') 
        });
        // DON'T remove localStorage here - keep it so we don't lose data
        // The data will be cleared on the payment success page instead
        setSubmitted(true);
        onComplete?.();
        window.location.href = checkoutData.url;
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: t('Något gick fel', 'Something went wrong'),
        description: t('Försök igen eller kontakta oss.', 'Please try again or contact us.'),
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render current step
  const renderStep = () => {
    const stepType = getCurrentStepType();
    const stepProps = { formData, updateFormData, errors, currency, lang, t };
    
    return (
      <Suspense fallback={<WizardSkeleton />}>
        {stepType === 'contact' && <Step1Contact {...stepProps} />}
        {stepType === 'customerType' && (
          <CustomerTypeSelection 
            customerTypeData={customerTypeData}
            updateCustomerTypeData={updateCustomerTypeData}
            errors={errors}
            lang={lang}
            t={t}
          />
        )}
        {stepType === 'package' && <Step2Package {...stepProps} isPostDemoFlow={isPostDemoFlow} />}
        {stepType === 'pages' && <Step3Pages {...stepProps} />}
        {stepType === 'carePlan' && <Step4CarePlan {...stepProps} />}
        {stepType === 'projectDetails' && <Step5ProjectDetails {...stepProps} />}
        {stepType === 'payment' && (
          <Step6Payment 
            {...stepProps}
            customerTypeData={customerTypeData}
            calculateTotal={calculateTotal}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            isPostDemoFlow={isPostDemoFlow}
          />
        )}
      </Suspense>
    );
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
      <WizardBackground />
      
      <div className="container-wide relative z-10 max-w-6xl mx-auto px-3 sm:px-6">
        {/* Stepper */}
        <WizardStepper 
          currentStep={step} 
          totalSteps={totalSteps}
          stepConfig={currentStepConfig}
          lang={lang}
        />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Form Area */}
          <div className="lg:col-span-2">
            <motion.div 
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-4 sm:p-6 md:p-8"
            >
              {renderStep()}
              
              {/* Navigation */}
              {getCurrentStepType() !== 'payment' && (
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
            </motion.div>
          </div>
          
          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Suspense fallback={<WizardSkeleton />}>
              <OrderSummary 
                formData={formData}
                customerTypeData={customerTypeData}
                calculateTotal={calculateTotal}
                currency={currency}
                lang={lang}
                t={t}
                isPostDemoFlow={isPostDemoFlow}
              />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Admin Panel Upsell Modal */}
      <AdminPanelUpsellModal
        isOpen={showUpsellModal}
        onAccept={handleUpsellAccept}
        onDecline={handleUpsellDecline}
        currency={currency}
        lang={lang}
      />
    </div>
  );
};

export default WebsiteOrderWizardComponent;
