import { useState, useRef, useEffect, useCallback } from 'react';
import { CheckCircle2, Upload, ArrowRight, Loader2, Plus, X, Link as LinkIcon, User, Palette, Globe, Package, FileImage, FileText, MapPin, Check, AlertCircle, CreditCard, Trash2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { AnimatedSection } from '@/components/AnimatedSection';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { InfoTooltip } from '@/components/InfoTooltip';
import { PackageCompareModal } from '@/components/PackageCompareModal';
import { useAutoSave, type IntakeData } from '@/hooks/useAutoSave';

type FormStep = 1 | 2 | 3; // Added step 3 for payment

const packages = [
  { id: 'starter', name: 'Starter', price: 4900, priceDisplay: '4 900 kr', pages: { sv: 'Upp till 3 sidor', en: 'Up to 3 pages' }, maxPages: 3, delivery: 14, booking: false, features: { sv: ['Responsiv design', 'Mobil-först', 'Kontaktformulär', 'SEO-grundläggande', '1 revision'], en: ['Responsive design', 'Mobile-first', 'Contact form', 'Basic SEO', '1 revision'] }, bestFor: { sv: 'Nya företag', en: 'New businesses' } },
  { id: 'standard', name: 'Standard', price: 7900, priceDisplay: '7 900 kr', pages: { sv: 'Upp till 5 sidor', en: 'Up to 5 pages' }, popular: true, maxPages: 5, delivery: 10, booking: false, features: { sv: ['Allt i Starter', '2 revisioner', 'Google Maps', 'Sociala medier', 'Bildgalleri'], en: ['Everything in Starter', '2 revisions', 'Google Maps', 'Social media', 'Image gallery'] }, bestFor: { sv: 'Växande företag', en: 'Growing businesses' } },
  { id: 'pro', name: 'Pro', price: 12900, priceDisplay: '12 900 kr', pages: { sv: 'Upp till 8 sidor', en: 'Up to 8 pages' }, maxPages: 8, delivery: 7, booking: true, features: { sv: ['Allt i Standard', '3 revisioner', 'Bokningsintegration', 'Nyhetsbrev', 'Google Analytics', 'Prioriterad support'], en: ['Everything in Standard', '3 revisions', 'Booking integration', 'Newsletter', 'Google Analytics', 'Priority support'] }, bestFor: { sv: 'Etablerade företag', en: 'Established businesses' } },
];

const styles = [
  { id: 'minimal', name: 'Minimal' },
  { id: 'luxury', name: 'Luxury' },
  { id: 'bold', name: 'Bold' },
  { id: 'playful', name: 'Playful' },
  { id: 'corporate', name: 'Corporate' },
];

const languages = [
  { id: 'sv', label: { sv: 'Svenska', en: 'Swedish' } },
  { id: 'en', label: { sv: 'Engelska', en: 'English' } },
  { id: 'both', label: { sv: 'Båda', en: 'Both' } },
];

export default function FreeDemoPage() {
  const { t, lang } = useLanguage();
  const [step, setStep] = useState<FormStep>(1);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState('');
  const [shakePackage, setShakePackage] = useState(false);
  
  // Auto-save hook
  const { hasSavedData, savedData, saveData, clearData, dismissResume } = useAutoSave();
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  
  // Refs for auto-scroll
  const styleRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);
  const packageRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const pagesRef = useRef<HTMLDivElement>(null);
  
  // Validation state
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  
  // Step 1 state
  const [demoLink, setDemoLink] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [wantsBooking, setWantsBooking] = useState<boolean | null>(null);
  const [bookingPlatform, setBookingPlatform] = useState('');
  
  // Step 2 state
  const [noLogo, setNoLogo] = useState(false);
  const [useStock, setUseStock] = useState(false);
  const [customPages, setCustomPages] = useState<string[]>(['']);
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [services, setServices] = useState('');
  const [extraNotes, setExtraNotes] = useState('');

  // Check for saved data on mount
  useEffect(() => {
    if (hasSavedData && savedData) {
      setShowResumePrompt(true);
    }
  }, [hasSavedData, savedData]);

  // Auto-save with debounce
  const debouncedSave = useCallback(() => {
    const data: Omit<IntakeData, 'lastSaved'> = {
      step,
      demoLink,
      businessName,
      contactPerson,
      email,
      phone,
      selectedStyle,
      selectedLanguage,
      selectedPackage,
      noLogo,
      useStock,
      customPages,
      selectedPages,
      wantsBooking,
      bookingPlatform,
      extraNotes,
      services,
    };
    saveData(data);
  }, [step, demoLink, businessName, contactPerson, email, phone, selectedStyle, selectedLanguage, selectedPackage, noLogo, useStock, customPages, selectedPages, wantsBooking, bookingPlatform, extraNotes, services, saveData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (businessName || email || selectedPackage) {
        debouncedSave();
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [debouncedSave, businessName, email, selectedPackage]);

  const resumeFromSaved = () => {
    if (savedData) {
      setStep(savedData.step as FormStep);
      setDemoLink(savedData.demoLink || '');
      setBusinessName(savedData.businessName || '');
      setContactPerson(savedData.contactPerson || '');
      setEmail(savedData.email || '');
      setPhone(savedData.phone || '');
      setSelectedStyle(savedData.selectedStyle || '');
      setSelectedLanguage(savedData.selectedLanguage || '');
      setSelectedPackage(savedData.selectedPackage || '');
      setNoLogo(savedData.noLogo || false);
      setUseStock(savedData.useStock || false);
      setCustomPages(savedData.customPages || ['']);
      setSelectedPages(savedData.selectedPages || []);
      setWantsBooking(savedData.wantsBooking ?? null);
      setBookingPlatform(savedData.bookingPlatform || '');
      setExtraNotes(savedData.extraNotes || '');
      setServices(savedData.services || '');
    }
    setShowResumePrompt(false);
    dismissResume();
  };

  const startFresh = () => {
    clearData();
    setShowResumePrompt(false);
  };

  const addCustomPage = () => {
    setCustomPages([...customPages, '']);
  };

  const removeCustomPage = (index: number) => {
    setCustomPages(customPages.filter((_, i) => i !== index));
  };

  const updateCustomPage = (index: number, value: string) => {
    const updated = [...customPages];
    updated[index] = value;
    setCustomPages(updated);
  };

  const togglePage = (page: string) => {
    const total = getTotalPages();
    const limit = getCurrentPackageLimit();
    
    if (!selectedPages.includes(page)) {
      // Adding a page
      if (total >= limit) {
        setShakePackage(true);
        setTimeout(() => setShakePackage(false), 500);
        toast({
          title: t('Sidbegränsning', 'Page limit'),
          description: t('Du behöver ett större paket för fler sidor.', 'You need a larger package for more pages.'),
          variant: 'destructive',
        });
        setUpgradeReason('pages');
        setShowUpgradeModal(true);
        return;
      }
      setSelectedPages([...selectedPages, page]);
    } else {
      setSelectedPages(selectedPages.filter(p => p !== page));
    }
  };

  // Check page limits
  const getTotalPages = () => {
    return selectedPages.length + customPages.filter(p => p.trim()).length;
  };

  const getCurrentPackageLimit = () => {
    const pkg = packages.find(p => p.id === selectedPackage);
    return pkg?.maxPages || 0;
  };

  const checkBothLanguages = () => {
    if (selectedLanguage === 'both' && selectedPackage !== 'pro') {
      setUpgradeReason('language');
      setShowUpgradeModal(true);
      return false;
    }
    return true;
  };

  const checkBookingRequiresPro = () => {
    if (wantsBooking && selectedPackage !== 'pro') {
      setUpgradeReason('booking');
      setShowUpgradeModal(true);
      return false;
    }
    return true;
  };

  const scrollToElement = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    
    if (!businessName.trim()) newErrors.businessName = true;
    if (!contactPerson.trim()) newErrors.contactPerson = true;
    if (!email.trim()) newErrors.email = true;
    if (!phone.trim()) newErrors.phone = true;
    if (!selectedStyle) newErrors.style = true;
    if (!selectedLanguage) newErrors.language = true;
    if (!selectedPackage) newErrors.package = true;
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      if (newErrors.businessName || newErrors.contactPerson || newErrors.email || newErrors.phone) {
        scrollToElement(contactRef);
      } else if (newErrors.style) {
        scrollToElement(styleRef);
      } else if (newErrors.language) {
        scrollToElement(languageRef);
      } else if (newErrors.package) {
        scrollToElement(packageRef);
      }
      return false;
    }
    
    return true;
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep1()) {
      toast({
        title: t('Fyll i alla obligatoriska fält', 'Fill in all required fields'),
        description: t('Kontrollera de markerade fälten.', 'Check the highlighted fields.'),
        variant: 'destructive',
      });
      return;
    }
    
    if (!checkBothLanguages()) return;
    if (!checkBookingRequiresPro()) return;
    
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePayment = async () => {
    setIsLoading(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setSubmitted(true);
    clearData();
  };

  const upgradePackage = (newPackage: string) => {
    setSelectedPackage(newPackage);
    setShowUpgradeModal(false);
    toast({
      title: t('Paket uppgraderat!', 'Package upgraded!'),
      description: t(`Du har valt ${packages.find(p => p.id === newPackage)?.name}.`, `You've selected ${packages.find(p => p.id === newPackage)?.name}.`),
    });
  };

  const pkg = packages.find(p => p.id === selectedPackage);
  const verificationFee = pkg ? Math.round(pkg.price * 0.1) : 0;

  // Resume prompt
  if (showResumePrompt) {
    return (
      <div className="min-h-screen section-padding py-20">
        <div className="container-narrow">
          <AnimatedSection animation="scale-in" className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-2xl font-bold mb-4">
              {t('Fortsätt där du slutade', 'Continue where you left off')}
            </h1>
            <p className="text-muted-foreground mb-8">
              {t('Vi hittade sparade uppgifter. Vill du fortsätta?', 'We found saved data. Would you like to continue?')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={resumeFromSaved} size="lg">
                {t('Fortsätt', 'Continue')}
              </Button>
              <Button onClick={startFresh} variant="outline" size="lg">
                {t('Starta om', 'Start over')}
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen section-padding py-20">
        <div className="container-narrow text-center">
          <AnimatedSection animation="scale-in">
            <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-10 h-10 text-accent" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              {t('Tack!', 'Thank you!')}
            </h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto">
              {t(
                'Din betalning har tagits emot. Vi börjar med ditt koncept omedelbart.',
                'Your payment has been received. We\'ll start working on your concept immediately.'
              )}
            </p>

            <Card className="max-w-sm mx-auto mb-10">
              <CardContent className="p-6">
                <p className="font-heading font-semibold text-xl mb-2">
                  {t('Valt paket', 'Selected package')}: {pkg?.name}
                </p>
                <p className="text-muted-foreground text-sm mb-4">
                  {t('Leverans inom', 'Delivery within')} {pkg?.delivery} {t('dagar', 'days')}
                </p>
                <div className="p-3 bg-accent/10 rounded-lg">
                  <p className="text-sm">
                    {t('Betald verifieringsavgift', 'Paid verification fee')}: <strong>{verificationFee.toLocaleString()} kr</strong>
                  </p>
                </div>
              </CardContent>
            </Card>

            <p className="text-muted-foreground">
              {t('Du får ditt koncept inom 72 timmar.', 'You\'ll receive your concept within 72 hours.')}
            </p>
          </AnimatedSection>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen section-padding py-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 -left-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t('Uppgradering krävs', 'Upgrade required')}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {upgradeReason === 'pages' && (
              <p className="text-muted-foreground">
                {t('Du behöver ett större paket för fler sidor.', 'You need a larger package for more pages.')}
              </p>
            )}
            {upgradeReason === 'language' && (
              <p className="text-muted-foreground">
                {t('Båda språken kräver Pro-paketet.', 'Both languages require the Pro package.')}
              </p>
            )}
            {upgradeReason === 'booking' && (
              <p className="text-muted-foreground">
                {t('Bokningssystem kräver Pro-paketet.', 'Booking system requires the Pro package.')}
              </p>
            )}
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowUpgradeModal(false)}>
              {t('Avbryt', 'Cancel')}
            </Button>
            {selectedPackage === 'starter' && (
              <>
                <Button onClick={() => upgradePackage('standard')}>Standard</Button>
                <Button onClick={() => upgradePackage('pro')} className="bg-accent hover:bg-accent/90">
                  {t('Uppgradera till Pro', 'Upgrade to Pro')}
                </Button>
              </>
            )}
            {selectedPackage === 'standard' && (
              <Button onClick={() => upgradePackage('pro')} className="bg-accent hover:bg-accent/90">
                {t('Uppgradera till Pro', 'Upgrade to Pro')}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Compare Modal */}
      <PackageCompareModal open={showCompareModal} onOpenChange={setShowCompareModal} />

      <div className="container-narrow relative">
        {/* Header */}
        <AnimatedSection animation="fade-up" className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            {t('Gratis webb-koncept', 'Free website concept')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {t('Koncept inom 72 timmar.', 'Concept within 72 hours.')}
          </p>
        </AnimatedSection>

        {/* Step Indicator */}
        <AnimatedSection animation="fade-up" delay={50} className="mb-8">
          <div className="flex items-center justify-center gap-0">
            {[
              { num: 1, label: t('Grundinfo', 'Basic info') },
              { num: 2, label: t('Detaljer', 'Details') },
              { num: 3, label: t('Bekräfta', 'Confirm') },
            ].map((s, index) => (
              <div key={s.num} className="flex items-center">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  step >= s.num ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step > s.num ? 'bg-accent-foreground/20' : 'bg-accent-foreground/10'
                  }`}>
                    {step > s.num ? <Check className="w-3 h-3" /> : s.num}
                  </div>
                  <span className="font-medium text-sm hidden sm:inline">{s.label}</span>
                </div>
                {index < 2 && (
                  <div className="w-8 sm:w-16 h-1 mx-1">
                    <div className="h-full bg-muted rounded-full overflow-hidden">
                      <div className={`h-full bg-accent transition-all duration-500 ${step > s.num ? 'w-full' : 'w-0'}`} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Auto-save note */}
        <AnimatedSection animation="fade-up" delay={60} className="mb-6">
          <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg text-sm">
            <span className="text-muted-foreground">
              {t('Dina svar sparas automatiskt på denna enhet.', 'Your answers are saved automatically on this device.')}
            </span>
            <Button variant="ghost" size="sm" onClick={clearData} className="text-muted-foreground hover:text-foreground">
              <Trash2 className="w-4 h-4 mr-1" />
              {t('Rensa', 'Clear')}
            </Button>
          </div>
        </AnimatedSection>

        {/* Verification Fee Notice - ONLY on this page */}
        <AnimatedSection animation="fade-up" delay={75} className="mb-8">
          <div className="p-4 bg-accent/10 rounded-xl border border-accent/20">
            <p className="text-sm text-center">
              <strong>{t('Verifieringsavgift (10%)', 'Verification fee (10%)')}</strong>: {' '}
              {t(
                'En liten avgift som bekräftar att du är en seriös köpare. Helt återbetalningsbar om du avvisar konceptet. Dras av från slutpriset om du fortsätter.',
                'A small fee that confirms you\'re a serious buyer. Fully refundable if you reject the concept. Deducted from final price if you proceed.'
              )}
            </p>
          </div>
        </AnimatedSection>

        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-8">
            {/* Demo Link - Optional */}
            <AnimatedSection animation="fade-up" delay={100}>
              <Card className="overflow-hidden border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <LinkIcon className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-heading font-semibold text-xl">
                        {t('Länk till er nuvarande webb/Instagram', 'Link to your current site/Instagram')}
                      </h2>
                      <InfoTooltip 
                        content={t('Hjälper oss förstå din nuvarande närvaro online.', 'Helps us understand your current online presence.')}
                        example="instagram.com/mittforetag"
                      />
                    </div>
                    <span className="text-sm text-muted-foreground ml-auto">{t('Valfritt', 'Optional')}</span>
                  </div>
                  <Input 
                    value={demoLink}
                    onChange={(e) => setDemoLink(e.target.value)}
                    onBlur={debouncedSave}
                    placeholder="https://instagram.com/mittforetag"
                    className="text-lg h-14 bg-background"
                  />
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Contact Info */}
            <AnimatedSection animation="fade-up" delay={150}>
              <div ref={contactRef}>
                <Card className={errors.businessName || errors.contactPerson || errors.email || errors.phone ? 'border-destructive' : ''}>
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-accent" />
                      </div>
                      <h2 className="font-heading font-semibold text-xl">
                        {t('Kontaktuppgifter', 'Contact Information')}
                      </h2>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <div className="flex items-center gap-1">
                          <Label className={`text-sm font-medium ${errors.businessName ? 'text-destructive' : ''}`}>
                            {t('Företagsnamn', 'Business Name')} *
                          </Label>
                          <InfoTooltip content={t('Namnet på ditt företag eller verksamhet.', 'The name of your business or company.')} />
                        </div>
                        <Input 
                          value={businessName} 
                          onChange={(e) => { setBusinessName(e.target.value); setErrors({...errors, businessName: false}); }} 
                          onBlur={debouncedSave}
                          placeholder={t('Ditt Företag AB', 'Your Company Ltd')}
                          className={`h-12 ${errors.businessName ? 'border-destructive' : ''}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-1">
                          <Label className={`text-sm font-medium ${errors.contactPerson ? 'text-destructive' : ''}`}>
                            {t('Kontaktperson', 'Contact Person')} *
                          </Label>
                          <InfoTooltip content={t('Vem vi ska kontakta.', 'Who we should contact.')} />
                        </div>
                        <Input 
                          value={contactPerson} 
                          onChange={(e) => { setContactPerson(e.target.value); setErrors({...errors, contactPerson: false}); }} 
                          onBlur={debouncedSave}
                          placeholder="Anna Andersson"
                          className={`h-12 ${errors.contactPerson ? 'border-destructive' : ''}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-1">
                          <Label className={`text-sm font-medium ${errors.email ? 'text-destructive' : ''}`}>E-post *</Label>
                          <InfoTooltip content={t('Din e-postadress för kommunikation.', 'Your email address for communication.')} />
                        </div>
                        <Input 
                          value={email} 
                          onChange={(e) => { setEmail(e.target.value); setErrors({...errors, email: false}); }} 
                          onBlur={debouncedSave}
                          type="email" 
                          placeholder="anna@foretag.se"
                          className={`h-12 ${errors.email ? 'border-destructive' : ''}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-1">
                          <Label className={`text-sm font-medium ${errors.phone ? 'text-destructive' : ''}`}>
                            {t('Telefon', 'Phone')} *
                          </Label>
                          <InfoTooltip content={t('Telefonnummer för snabb kontakt.', 'Phone number for quick contact.')} />
                        </div>
                        <Input 
                          value={phone} 
                          onChange={(e) => { setPhone(e.target.value); setErrors({...errors, phone: false}); }} 
                          onBlur={debouncedSave}
                          type="tel" 
                          placeholder="+46 70 123 45 67"
                          className={`h-12 ${errors.phone ? 'border-destructive' : ''}`}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </AnimatedSection>

            {/* Style Selection */}
            <AnimatedSection animation="fade-up" delay={200}>
              <div ref={styleRef}>
                <Card className={errors.style ? 'border-destructive' : ''}>
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <Palette className="w-5 h-5 text-accent" />
                      </div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-heading font-semibold text-xl">
                          {t('Välj stil', 'Choose style')} *
                        </h2>
                        <InfoTooltip content={t('Vilken visuell stil passar ditt varumärke bäst?', 'Which visual style fits your brand best?')} />
                      </div>
                      {errors.style && (
                        <p className="text-sm text-destructive flex items-center gap-1 ml-auto">
                          <AlertCircle className="w-3 h-3" />
                          {t('Välj en stil', 'Select a style')}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {styles.map((style) => (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => { setSelectedStyle(style.id); setErrors({...errors, style: false}); }}
                          className={`group relative p-5 border-2 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                            selectedStyle === style.id 
                              ? 'border-accent bg-accent/10 shadow-lg shadow-accent/10' 
                              : 'border-border hover:border-accent/50 hover:bg-accent/5'
                          }`}
                        >
                          {selectedStyle === style.id && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-accent-foreground" />
                            </div>
                          )}
                          <span className="text-sm font-medium">{style.name}</span>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </AnimatedSection>

            {/* Language Selection */}
            <AnimatedSection animation="fade-up" delay={250}>
              <div ref={languageRef}>
                <Card className={errors.language ? 'border-destructive' : ''}>
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-accent" />
                      </div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-heading font-semibold text-xl">
                          {t('Språk på webbplatsen', 'Website language')} *
                        </h2>
                        <InfoTooltip content={t('Vilket språk ska webbplatsen ha? "Båda" kräver Pro-paketet.', 'What language should the website have? "Both" requires the Pro package.')} />
                      </div>
                      {errors.language && (
                        <p className="text-sm text-destructive flex items-center gap-1 ml-auto">
                          <AlertCircle className="w-3 h-3" />
                          {t('Välj ett språk', 'Select a language')}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {languages.map((language) => (
                        <button
                          key={language.id}
                          type="button"
                          onClick={() => { setSelectedLanguage(language.id); setErrors({...errors, language: false}); }}
                          className={`group relative p-5 border-2 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                            selectedLanguage === language.id 
                              ? 'border-accent bg-accent/10 shadow-lg shadow-accent/10' 
                              : 'border-border hover:border-accent/50 hover:bg-accent/5'
                          }`}
                        >
                          {selectedLanguage === language.id && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-accent-foreground" />
                            </div>
                          )}
                          <span className="text-sm font-medium">
                            {lang === 'sv' ? language.label.sv : language.label.en}
                          </span>
                          {language.id === 'both' && (
                            <p className="text-xs text-muted-foreground mt-1">Pro</p>
                          )}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </AnimatedSection>

            {/* Package Selection with full details */}
            <AnimatedSection animation="fade-up" delay={300}>
              <div ref={packageRef}>
                <Card className={`${errors.package ? 'border-destructive' : ''} ${shakePackage ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                          <Package className="w-5 h-5 text-accent" />
                        </div>
                        <div className="flex items-center gap-2">
                          <h2 className="font-heading font-semibold text-xl">
                            {t('Välj paket', 'Choose package')} *
                          </h2>
                          <InfoTooltip content={t('Välj det paket som passar dina behov. Du kan uppgradera senare.', 'Choose the package that fits your needs. You can upgrade later.')} />
                        </div>
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={() => setShowCompareModal(true)}>
                        {t('Jämför paket', 'Compare packages')}
                      </Button>
                    </div>
                    {errors.package && (
                      <p className="text-sm text-destructive flex items-center gap-1 mb-4">
                        <AlertCircle className="w-3 h-3" />
                        {t('Välj ett paket', 'Select a package')}
                      </p>
                    )}
                    <div className="grid md:grid-cols-3 gap-4">
                      {packages.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => { setSelectedPackage(p.id); setErrors({...errors, package: false}); }}
                          className={`group relative p-6 border-2 rounded-xl text-left transition-all duration-300 hover:scale-[1.02] ${
                            selectedPackage === p.id 
                              ? 'border-accent bg-accent/10 shadow-lg shadow-accent/10' 
                              : 'border-border hover:border-accent/50 hover:bg-accent/5'
                          } ${p.popular ? 'ring-2 ring-accent/30' : ''}`}
                        >
                          {p.popular && (
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                              {t('Populärast', 'Most Popular')}
                            </span>
                          )}
                          {selectedPackage === p.id && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-accent-foreground" />
                            </div>
                          )}
                          <h3 className="font-heading font-semibold text-lg mb-1">{p.name}</h3>
                          <p className="text-xl font-bold text-accent mb-1">{p.priceDisplay}</p>
                          <p className="text-sm text-muted-foreground mb-2">
                            {lang === 'sv' ? p.pages.sv : p.pages.en}
                          </p>
                          <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t border-border/50">
                            <p className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {t('Leverans', 'Delivery')}: {p.delivery} {t('dagar', 'days')}
                            </p>
                            <p className="text-muted-foreground/70">
                              {lang === 'sv' ? p.bestFor.sv : p.bestFor.en}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </AnimatedSection>

            {/* Booking System */}
            <AnimatedSection animation="fade-up" delay={350}>
              <Card>
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-heading font-semibold text-xl">
                        {t('Vill du ha ett bokningssystem?', 'Do you want a booking system?')}
                      </h2>
                      <InfoTooltip content={t('Bokningssystem kräver Pro-paketet.', 'Booking system requires the Pro package.')} />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setWantsBooking(true)}
                      className={`px-6 py-3 rounded-lg border-2 transition-all ${wantsBooking === true ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/50'}`}
                    >
                      {t('Ja', 'Yes')} {selectedPackage !== 'pro' && <span className="text-xs text-muted-foreground ml-1">(Pro)</span>}
                    </button>
                    <button
                      type="button"
                      onClick={() => setWantsBooking(false)}
                      className={`px-6 py-3 rounded-lg border-2 transition-all ${wantsBooking === false ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/50'}`}
                    >
                      {t('Nej', 'No')}
                    </button>
                  </div>
                  {wantsBooking && (
                    <div className="mt-4">
                      <Label className="text-sm font-medium mb-2 block">{t('Vilken plattform?', 'Which platform?')}</Label>
                      <Input 
                        value={bookingPlatform}
                        onChange={(e) => setBookingPlatform(e.target.value)}
                        placeholder="Bokadirekt, Calendly..."
                        className="h-12"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Submit Button */}
            <AnimatedSection animation="fade-up" delay={400}>
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <Button type="submit" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg">
                  {t('Fortsätt', 'Continue')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </AnimatedSection>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="space-y-8">
            <AnimatedSection animation="fade-up">
              <Button type="button" variant="ghost" onClick={() => setStep(1)} className="mb-2 -ml-2">
                ← {t('Tillbaka', 'Back')}
              </Button>
            </AnimatedSection>

            {/* Logo Upload */}
            <AnimatedSection animation="fade-up" delay={50}>
              <Card>
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <FileImage className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-heading font-semibold text-xl">{t('Logotyp', 'Logo')}</h2>
                      <InfoTooltip content={t('Ladda upp din logotyp i PNG, SVG eller JPG-format.', 'Upload your logo in PNG, SVG or JPG format.')} />
                    </div>
                  </div>
                  {!noLogo && (
                    <label className="block border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-accent hover:bg-accent/5 transition-all duration-300 cursor-pointer group">
                      <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3 group-hover:text-accent transition-colors" />
                      <p className="text-muted-foreground group-hover:text-foreground transition-colors">
                        {t('Klicka för att ladda upp', 'Click to upload')}
                      </p>
                      <input type="file" className="hidden" accept="image/*" />
                    </label>
                  )}
                  <div className="flex items-center gap-3 mt-4 p-3 bg-secondary/50 rounded-lg">
                    <Checkbox id="noLogo" checked={noLogo} onCheckedChange={(checked) => setNoLogo(checked as boolean)} />
                    <Label htmlFor="noLogo" className="font-normal cursor-pointer">
                      {t('Jag har ingen logotyp', 'I don\'t have a logo')}
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Services & Prices */}
            <AnimatedSection animation="fade-up" delay={100}>
              <Card>
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-heading font-semibold text-xl">{t('Tjänster + priser', 'Services + prices')}</h2>
                      <InfoTooltip content={t('Lista dina tjänster och priser.', 'List your services and prices.')} example="Klippning: 450 kr" />
                    </div>
                  </div>
                  <Textarea
                    value={services}
                    onChange={(e) => setServices(e.target.value)}
                    onBlur={debouncedSave}
                    rows={4}
                    className="resize-none"
                    placeholder={t('Klippning: 450 kr\nFärgning: 800 kr', 'Haircut: 450 kr\nColoring: 800 kr')}
                  />
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Photos */}
            <AnimatedSection animation="fade-up" delay={150}>
              <Card>
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <FileImage className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-heading font-semibold text-xl">{t('Foton', 'Photos')}</h2>
                      <InfoTooltip content={t('Ladda upp bilder på ditt företag, produkter eller tjänster.', 'Upload images of your business, products or services.')} />
                    </div>
                  </div>
                  {!useStock && (
                    <label className="block border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-accent hover:bg-accent/5 transition-all duration-300 cursor-pointer group">
                      <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3 group-hover:text-accent transition-colors" />
                      <p className="text-muted-foreground group-hover:text-foreground transition-colors">
                        {t('Ladda upp bilder', 'Upload photos')}
                      </p>
                      <input type="file" className="hidden" accept="image/*" multiple />
                    </label>
                  )}
                  <div className="flex items-center gap-3 mt-4 p-3 bg-secondary/50 rounded-lg">
                    <Checkbox id="useStock" checked={useStock} onCheckedChange={(checked) => setUseStock(checked as boolean)} />
                    <Label htmlFor="useStock" className="font-normal cursor-pointer">
                      {t('Använd stockbilder', 'Use stock photos')}
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Website Needs / Pages */}
            <AnimatedSection animation="fade-up" delay={200}>
              <div ref={pagesRef}>
                <Card>
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="font-heading font-semibold text-xl">{t('Sidor', 'Pages')}</h2>
                          <InfoTooltip content={t('Välj vilka sidor du vill ha på din webbplats.', 'Choose which pages you want on your website.')} />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {t(`Max ${getCurrentPackageLimit()} sidor`, `Max ${getCurrentPackageLimit()} pages`)} • {t(`Valda: ${getTotalPages()}`, `Selected: ${getTotalPages()}`)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { sv: 'Hem', en: 'Home' },
                          { sv: 'Tjänster', en: 'Services' },
                          { sv: 'Priser', en: 'Prices' },
                          { sv: 'Om oss', en: 'About' },
                          { sv: 'Galleri', en: 'Gallery' },
                          { sv: 'Kontakt', en: 'Contact' },
                          { sv: 'FAQ', en: 'FAQ' },
                          { sv: 'Hitta oss', en: 'Find us' },
                        ].map((page) => (
                          <button
                            type="button"
                            key={page.en}
                            onClick={() => togglePage(page.en)}
                            className={`flex items-center justify-center gap-2 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                              selectedPages.includes(page.en)
                                ? 'border-accent bg-accent/10'
                                : 'border-border hover:border-accent/50 hover:bg-accent/5'
                            }`}
                          >
                            {selectedPages.includes(page.en) && <Check className="w-4 h-4 text-accent" />}
                            <span className="text-sm font-medium">{t(page.sv, page.en)}</span>
                          </button>
                        ))}
                      </div>

                      {/* Custom Pages */}
                      <div className="pt-4 border-t border-border">
                        <div className="flex items-center gap-2 mb-3">
                          <Label className="text-sm font-medium">{t('Egen sida', 'Custom page')}</Label>
                          <InfoTooltip content={t('Lägg till egna sidtitlar för sidor som inte finns i listan.', 'Add custom page titles for pages not in the list.')} />
                        </div>
                        <div className="space-y-3">
                          {customPages.map((page, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <Input
                                value={page}
                                onChange={(e) => updateCustomPage(index, e.target.value)}
                                onBlur={debouncedSave}
                                placeholder={t('T.ex. Team, Behandlingar...', 'E.g. Team, Treatments...')}
                                className="h-12"
                              />
                              {customPages.length > 1 && (
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeCustomPage(index)} className="shrink-0">
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button type="button" variant="outline" size="sm" onClick={addCustomPage}>
                            <Plus className="w-4 h-4 mr-2" />
                            {t('Lägg till', 'Add')}
                          </Button>
                        </div>
                      </div>

                      {/* Vårdplan option */}
                      <div className="pt-4 border-t border-border">
                        <div className="p-4 bg-accent/5 rounded-xl border border-accent/20">
                          <div className="flex items-center gap-3">
                            <Checkbox id="carePlan" />
                            <div>
                              <Label htmlFor="carePlan" className="font-medium cursor-pointer">
                                {t('Lägg till månatlig webbvård', 'Add monthly care plan')}
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                {t('Hosting, uppdateringar och support. Rekommenderas.', 'Hosting, updates and support. Recommended.')}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </AnimatedSection>

            {/* Extra Notes */}
            <AnimatedSection animation="fade-up" delay={250}>
              <Card>
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-heading font-semibold text-xl">
                        {t('Extra önskemål / info', 'Extra notes')}
                      </h2>
                      <InfoTooltip content={t('Lägg till extra information eller önskemål.', 'Add extra information or requests.')} />
                    </div>
                    <span className="text-sm text-muted-foreground ml-auto">{t('Valfritt', 'Optional')}</span>
                  </div>
                  <Textarea
                    value={extraNotes}
                    onChange={(e) => setExtraNotes(e.target.value)}
                    onBlur={debouncedSave}
                    rows={3}
                    className="resize-none"
                    placeholder={t('Speciella önskemål...', 'Special requests...')}
                  />
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Submit */}
            <AnimatedSection animation="fade-up" delay={300}>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Button type="submit" size="lg" className="w-full sm:w-auto h-14 px-10 text-lg">
                  {t('Fortsätt till betalning', 'Continue to payment')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </AnimatedSection>
          </form>
        )}

        {step === 3 && (
          <div className="space-y-8">
            <AnimatedSection animation="fade-up">
              <Button type="button" variant="ghost" onClick={() => setStep(2)} className="mb-2 -ml-2">
                ← {t('Tillbaka', 'Back')}
              </Button>
            </AnimatedSection>

            {/* Payment Step */}
            <AnimatedSection animation="fade-up" delay={50}>
              <Card className="border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
                <CardContent className="p-6 sm:p-8">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="w-8 h-8 text-accent" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">
                      {t('Verifieringsavgift (10%)', 'Verification fee (10%)')}
                    </h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      {t(
                        'En liten avgift som bekräftar att du är en seriös köpare. Helt återbetalningsbar om du avvisar konceptet. Dras av från slutpriset om du fortsätter.',
                        'A small fee that confirms you\'re a serious buyer. Fully refundable if you reject the concept. Deducted from final price if you proceed.'
                      )}
                    </p>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-secondary/50 rounded-xl p-6 mb-8">
                    <h3 className="font-semibold mb-4">{t('Sammanfattning', 'Summary')}</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('Valt paket', 'Selected package')}</span>
                        <span className="font-medium">{pkg?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('Paketpris', 'Package price')}</span>
                        <span>{pkg?.priceDisplay}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('Leveranstid', 'Delivery time')}</span>
                        <span>{pkg?.delivery} {t('dagar', 'days')}</span>
                      </div>
                      <div className="border-t border-border pt-3 mt-3">
                        <div className="flex justify-between text-lg font-bold">
                          <span>{t('Verifieringsavgift (10%)', 'Verification fee (10%)')}</span>
                          <span className="text-accent">{verificationFee.toLocaleString()} kr</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handlePayment} 
                    size="lg" 
                    className="w-full h-14 text-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        {t('Behandlar...', 'Processing...')}
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        {t('Betala med Stripe', 'Pay with Stripe')} ({verificationFee.toLocaleString()} kr)
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        )}
      </div>
    </div>
  );
}
