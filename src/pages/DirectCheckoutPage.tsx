import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ArrowLeft, Check, Package, Palette, Globe, FileText, Users, Search, Scale, CreditCard, Clock, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { AnimatedSection } from '@/components/AnimatedSection';
import { InfoTooltip } from '@/components/InfoTooltip';
import { PackageCompareModal } from '@/components/PackageCompareModal';
import { CarePlansCompareModal } from '@/components/CarePlansCompareModal';

type FormStep = 1 | 2 | 3 | 4 | 5;

const packages = [
  { id: 'starter', name: 'Starter', price: 4900, priceDisplay: '4 900 kr', pages: { sv: 'Upp till 3 sidor', en: 'Up to 3 pages' }, maxPages: 3, delivery: 14, booking: false, features: { sv: ['Responsiv design', 'Kontaktformulär', 'SEO-grundläggande', '1 revision'], en: ['Responsive design', 'Contact form', 'Basic SEO', '1 revision'] }, bestFor: { sv: 'Nya företag', en: 'New businesses' } },
  { id: 'standard', name: 'Standard', price: 7900, priceDisplay: '7 900 kr', pages: { sv: 'Upp till 5 sidor', en: 'Up to 5 pages' }, popular: true, maxPages: 5, delivery: 10, booking: false, features: { sv: ['Allt i Starter', '2 revisioner', 'Google Maps', 'Sociala medier', 'Bildgalleri', 'Flerspråkstöd'], en: ['Everything in Starter', '2 revisions', 'Google Maps', 'Social media', 'Image gallery', 'Multi-language'] }, bestFor: { sv: 'Växande företag', en: 'Growing businesses' } },
  { id: 'pro', name: 'Pro', price: 12900, priceDisplay: '12 900 kr', pages: { sv: 'Upp till 8 sidor', en: 'Up to 8 pages' }, maxPages: 8, delivery: 7, booking: true, features: { sv: ['Allt i Standard', '3 revisioner', 'Bokningsintegration', 'Nyhetsbrev', 'Google Analytics', 'Prioriterad support', 'Flerspråkstöd'], en: ['Everything in Standard', '3 revisions', 'Booking integration', 'Newsletter', 'Google Analytics', 'Priority support', 'Multi-language'] }, bestFor: { sv: 'Etablerade företag', en: 'Established businesses' } },
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

const carePlans = [
  { id: 'basic', name: 'Basic', monthlyPrice: 249, yearlyPrice: 199, features: { sv: ['Hosting', 'Uppdateringar', 'Säkerhetskopiering'], en: ['Hosting', 'Updates', 'Backups'] } },
  { id: 'standard', name: 'Standard', monthlyPrice: 449, yearlyPrice: 359, popular: true, features: { sv: ['Allt i Basic', 'Domän ingår', 'Företagsmail', '1h ändringar/mån'], en: ['Everything in Basic', 'Domain included', 'Business email', '1h edits/month'] } },
  { id: 'pro', name: 'Pro', monthlyPrice: 749, yearlyPrice: 599, features: { sv: ['Allt i Standard', '3h ändringar/mån', 'Prioriterad support'], en: ['Everything in Standard', '3h edits/month', 'Priority support'] } },
];

export default function DirectCheckoutPage() {
  const { t, lang } = useLanguage();
  const [step, setStep] = useState<FormStep>(1);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPackageCompare, setShowPackageCompare] = useState(false);
  const [showCarePlanCompare, setShowCarePlanCompare] = useState(false);

  // Step 1: Contact info
  const [businessName, setBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Step 2: Package & Style
  const [selectedPackage, setSelectedPackage] = useState('standard');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('sv');
  const [wantsBooking, setWantsBooking] = useState<boolean | null>(null);
  const [bookingPlatform, setBookingPlatform] = useState('');

  // Step 3: Pages & Content
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [customPages, setCustomPages] = useState<string[]>(['']);
  const [services, setServices] = useState('');
  const [noLogo, setNoLogo] = useState(false);
  const [useStock, setUseStock] = useState(false);

  // Step 4: Care Plan
  const [selectedCarePlan, setSelectedCarePlan] = useState<string | null>('standard');
  const [isYearlyCarePlan, setIsYearlyCarePlan] = useState(false);

  // Step 5: Details & Payment
  const [pageNotes, setPageNotes] = useState('');
  const [brandPreferences, setBrandPreferences] = useState('');
  const [competitors, setCompetitors] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [legalPages, setLegalPages] = useState<string[]>([]);
  const [termsExplanation, setTermsExplanation] = useState('');
  const [extraNotes, setExtraNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const pkg = packages.find(p => p.id === selectedPackage);
  const carePlan = carePlans.find(c => c.id === selectedCarePlan);
  const carePlanPrice = carePlan ? (isYearlyCarePlan ? carePlan.yearlyPrice : carePlan.monthlyPrice) : 0;

  const pageOptions = [
    { id: 'home', label: { sv: 'Startsida', en: 'Home' } },
    { id: 'about', label: { sv: 'Om oss', en: 'About' } },
    { id: 'services', label: { sv: 'Tjänster', en: 'Services' } },
    { id: 'contact', label: { sv: 'Kontakt', en: 'Contact' } },
    { id: 'gallery', label: { sv: 'Galleri', en: 'Gallery' } },
    { id: 'pricing', label: { sv: 'Priser', en: 'Pricing' } },
    { id: 'team', label: { sv: 'Team', en: 'Team' } },
    { id: 'faq', label: { sv: 'FAQ', en: 'FAQ' } },
  ];

  const getTotalPages = () => {
    return selectedPages.length + customPages.filter(p => p.trim()).length;
  };

  const getCurrentPackageLimit = () => {
    return pkg?.maxPages || 0;
  };

  const togglePage = (pageId: string) => {
    const total = getTotalPages();
    const limit = getCurrentPackageLimit();

    if (!selectedPages.includes(pageId)) {
      if (total >= limit) {
        toast({
          title: t('Sidbegränsning', 'Page limit'),
          description: t('Du behöver ett större paket för fler sidor.', 'You need a larger package for more pages.'),
          variant: 'destructive',
        });
        return;
      }
      setSelectedPages([...selectedPages, pageId]);
    } else {
      setSelectedPages(selectedPages.filter(p => p !== pageId));
    }
  };

  const addCustomPage = () => {
    const total = getTotalPages();
    const limit = getCurrentPackageLimit();
    if (total >= limit) {
      toast({
        title: t('Sidbegränsning', 'Page limit'),
        description: t('Du behöver ett större paket för fler sidor.', 'You need a larger package for more pages.'),
        variant: 'destructive',
      });
      return;
    }
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

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    if (!businessName.trim()) newErrors.businessName = true;
    if (!contactPerson.trim()) newErrors.contactPerson = true;
    if (!email.trim()) newErrors.email = true;
    if (!phone.trim()) newErrors.phone = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    if (!selectedPackage) newErrors.package = true;
    if (!selectedStyle) newErrors.style = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && !validateStep1()) {
      toast({ title: t('Fyll i alla obligatoriska fält', 'Fill in all required fields'), variant: 'destructive' });
      return;
    }
    if (step === 2 && !validateStep2()) {
      toast({ title: t('Välj paket och stil', 'Select package and style'), variant: 'destructive' });
      return;
    }
    setStep((s) => Math.min(s + 1, 5) as FormStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setStep((s) => Math.max(s - 1, 1) as FormStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('form_type', 'Direct Checkout Order');
      formData.append('business_name', businessName);
      formData.append('contact_person', contactPerson);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('selected_package', selectedPackage);
      formData.append('package_price', pkg?.priceDisplay || '');
      formData.append('selected_style', selectedStyle);
      formData.append('selected_language', selectedLanguage);
      formData.append('wants_booking', String(wantsBooking));
      formData.append('booking_platform', bookingPlatform);
      formData.append('selected_pages', selectedPages.join(', '));
      formData.append('custom_pages', customPages.filter(p => p.trim()).join(', '));
      formData.append('services', services);
      formData.append('no_logo', String(noLogo));
      formData.append('use_stock', String(useStock));
      formData.append('selected_care_plan', selectedCarePlan || 'none');
      formData.append('care_plan_billing', isYearlyCarePlan ? 'yearly' : 'monthly');
      formData.append('care_plan_price', carePlanPrice + ' kr/month');
      formData.append('page_notes', pageNotes);
      formData.append('brand_preferences', brandPreferences);
      formData.append('competitors', competitors);
      formData.append('seo_keywords', seoKeywords);
      formData.append('legal_pages', legalPages.join(', '));
      formData.append('terms_explanation', termsExplanation);
      formData.append('extra_notes', extraNotes);

      const response = await fetch('https://getform.io/f/agdvpmpb', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
      });

      if (!response.ok) throw new Error('Form submission failed');
      
      setSubmitted(true);
    } catch (error) {
      toast({ 
        title: t('Något gick fel', 'Something went wrong'), 
        description: t('Försök igen senare.', 'Please try again later.'), 
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stepInfo = [
    { num: 1, label: t('Kontakt', 'Contact'), icon: Users },
    { num: 2, label: t('Paket', 'Package'), icon: Package },
    { num: 3, label: t('Sidor', 'Pages'), icon: FileText },
    { num: 4, label: t('Vårdplan', 'Care plan'), icon: Clock },
    { num: 5, label: t('Betalning', 'Payment'), icon: CreditCard },
  ];

  if (submitted) {
    return (
      <div className="min-h-screen section-padding py-20">
        <div className="container-narrow text-center">
          <AnimatedSection animation="scale-in">
            <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-10 h-10 text-accent" />
            </div>
            <h1 className="text-4xl font-bold mb-4">{t('Tack för din beställning!', 'Thank you for your order!')}</h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-md mx-auto">
              {t('Vi har mottagit din beställning och börjar arbeta direkt.', 'We have received your order and will start working immediately.')}
            </p>
            <div className="p-6 bg-accent/10 rounded-xl inline-block mb-8">
              <p className="text-xl font-bold">{pkg?.name} — {pkg?.priceDisplay}</p>
              <p className="text-muted-foreground">{t('Leverans inom', 'Delivery within')} {pkg?.delivery} {t('dagar', 'days')}</p>
              {carePlan && (
                <p className="text-sm text-accent mt-2">
                  + {carePlan.name} {t('vårdplan', 'care plan')}: {carePlanPrice} kr/mån
                </p>
              )}
            </div>
            <Button asChild><Link to="/">{t('Tillbaka till start', 'Back to home')}</Link></Button>
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

      <PackageCompareModal open={showPackageCompare} onOpenChange={setShowPackageCompare} />
      <CarePlansCompareModal open={showCarePlanCompare} onOpenChange={setShowCarePlanCompare} isYearly={isYearlyCarePlan} />

      <div className="container-wide relative">
        {/* Header */}
        <AnimatedSection animation="fade-up" className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            {t('Beställ direkt', 'Order directly')}
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            {t('Beställ din webbplats', 'Order your website')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {t('Fyll i formuläret så börjar vi bygga din webbplats direkt.', 'Fill out the form and we\'ll start building your website right away.')}
          </p>
        </AnimatedSection>

        {/* Step Indicator */}
        <AnimatedSection animation="fade-up" delay={50} className="mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-1 sm:gap-0">
            {stepInfo.map((s, index) => (
              <div key={s.num} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 sm:w-auto sm:h-auto sm:px-4 sm:py-2 rounded-full sm:rounded-lg transition-colors ${step === s.num ? 'bg-accent text-accent-foreground' : step > s.num ? 'bg-accent/20 text-accent' : 'bg-secondary text-muted-foreground'}`}>
                  <span className="w-6 h-6 rounded-full sm:bg-background/20 flex items-center justify-center text-xs sm:text-sm font-bold">
                    {step > s.num ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : s.num}
                  </span>
                  <span className="text-sm font-medium hidden sm:inline sm:ml-2">{s.label}</span>
                </div>
                {index < stepInfo.length - 1 && <div className="w-2 sm:w-8 h-0.5 bg-border mx-0.5 sm:mx-0" />}
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Step 1: Contact Info */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-lg mx-auto"
            >
              <div className="p-6 bg-secondary/50 rounded-xl space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-accent" />
                  <h2 className="font-semibold text-lg">{t('Kontaktuppgifter', 'Contact information')}</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className={errors.businessName ? 'text-destructive' : ''}>{t('Företagsnamn', 'Business name')} *</Label>
                    <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder={t('Ditt företagsnamn', 'Your business name')} className={`h-12 mt-1 ${errors.businessName ? 'border-destructive' : ''}`} />
                  </div>
                  <div>
                    <Label className={errors.contactPerson ? 'text-destructive' : ''}>{t('Kontaktperson', 'Contact person')} *</Label>
                    <Input value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} placeholder={t('Ditt namn', 'Your name')} className={`h-12 mt-1 ${errors.contactPerson ? 'border-destructive' : ''}`} />
                  </div>
                  <div>
                    <Label className={errors.email ? 'text-destructive' : ''}>{t('E-post', 'Email')} *</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="namn@exempel.se" className={`h-12 mt-1 ${errors.email ? 'border-destructive' : ''}`} />
                  </div>
                  <div>
                    <Label className={errors.phone ? 'text-destructive' : ''}>{t('Telefon', 'Phone')} *</Label>
                    <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="070 123 45 67" className={`h-12 mt-1 ${errors.phone ? 'border-destructive' : ''}`} />
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button size="lg" onClick={handleNextStep}>{t('Fortsätt', 'Continue')} <ArrowRight className="w-4 h-4" /></Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Package & Style */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Package Selection */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-lg flex items-center gap-2">
                    <Package className="w-5 h-5 text-accent" />
                    {t('Välj paket', 'Choose package')} *
                  </h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowPackageCompare(true)}>
                    {t('Jämför paket', 'Compare packages')}
                  </Button>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {packages.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedPackage(p.id);
                        // Reset booking if switching away from pro
                        if (p.id !== 'pro' && wantsBooking === true) {
                          setWantsBooking(null);
                        }
                      }}
                      className={`p-6 rounded-xl border-2 text-left transition-all relative ${selectedPackage === p.id ? 'border-accent bg-accent/5 shadow-lg' : errors.package ? 'border-destructive' : 'border-border hover:border-accent/50'}`}
                    >
                      {p.popular && <span className="absolute -top-3 left-4 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded">{t('Populärast', 'Popular')}</span>}
                      <h3 className="font-semibold text-xl mb-1">{p.name}</h3>
                      <p className="text-2xl font-bold text-accent mb-1">{p.priceDisplay}</p>
                      <p className="text-sm text-muted-foreground mb-2">{lang === 'sv' ? p.pages.sv : p.pages.en}</p>
                      <p className="text-xs text-muted-foreground">{t('Leverans', 'Delivery')}: {p.delivery} {t('dagar', 'days')}</p>
                      <ul className="mt-4 space-y-1">
                        {(lang === 'sv' ? p.features.sv : p.features.en).slice(0, 4).map((f, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm"><Check className="w-3 h-3 text-accent" />{f}</li>
                        ))}
                      </ul>
                    </button>
                  ))}
                </div>
              </div>

              {/* Style Selection */}
              <div className="mb-8">
                <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
                  <Palette className="w-5 h-5 text-accent" />
                  {t('Välj stil', 'Choose style')} *
                </h2>
                <div className="flex flex-wrap gap-3">
                  {styles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`px-6 py-3 rounded-lg border-2 transition-all ${selectedStyle === style.id ? 'border-accent bg-accent/10' : errors.style ? 'border-destructive' : 'border-border hover:border-accent/50'}`}
                    >
                      {style.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Selection */}
              <div className="mb-8">
                <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
                  <Globe className="w-5 h-5 text-accent" />
                  {t('Webbplatsens språk', 'Website language')}
                </h2>
                <div className="flex flex-wrap gap-3">
                  {languages.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setSelectedLanguage(l.id)}
                      className={`px-6 py-3 rounded-lg border-2 transition-all ${selectedLanguage === l.id ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/50'}`}
                    >
                      {lang === 'sv' ? l.label.sv : l.label.en}
                    </button>
                  ))}
                </div>
                {selectedLanguage === 'both' && selectedPackage === 'starter' && (
                  <p className="text-sm text-destructive mt-2">{t('Flerspråk kräver Standard eller Pro.', 'Multi-language requires Standard or Pro.')}</p>
                )}
              </div>

              {/* Booking */}
              <div className="mb-8 p-6 bg-secondary/50 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="font-semibold text-lg">{t('Vill du ha ett bokningssystem?', 'Do you want a booking system?')}</h2>
                  <InfoTooltip content={t('Vi skapar ditt helt egna bokningssystem integrerat med din webbplats. Integration med Bokadirekt, Calendly eller liknande.', 'We create your very own booking system integrated with your website. Integration with Bokadirekt, Calendly or similar.')} />
                </div>
                <p className="text-sm text-muted-foreground mb-4">{t('Vi skapar ditt helt egna bokningssystem.', 'We create your very own booking system.')}</p>
                <div className="flex gap-4 mb-4">
                  <button 
                    onClick={() => {
                      if (selectedPackage !== 'pro') {
                        toast({
                          title: t('Pro-paket krävs', 'Pro package required'),
                          description: t('Bokningssystem ingår endast i Pro-paketet. Vill du uppgradera?', 'Booking system is only included in the Pro package. Would you like to upgrade?'),
                        });
                        setSelectedPackage('pro');
                      }
                      setWantsBooking(true);
                    }} 
                    className={`px-6 py-3 rounded-lg border-2 transition-all ${wantsBooking === true ? 'border-accent bg-accent/10' : 'border-border'}`}
                  >
                    {t('Ja', 'Yes')}
                    {selectedPackage !== 'pro' && <span className="ml-2 text-xs text-accent">{t('(kräver Pro)', '(requires Pro)')}</span>}
                  </button>
                  <button onClick={() => setWantsBooking(false)} className={`px-6 py-3 rounded-lg border-2 transition-all ${wantsBooking === false ? 'border-accent bg-accent/10' : 'border-border'}`}>{t('Nej', 'No')}</button>
                </div>
                {wantsBooking && selectedPackage === 'pro' && (
                  <Input value={bookingPlatform} onChange={(e) => setBookingPlatform(e.target.value)} placeholder={t('Vilken bokningsplattform? (t.ex. Bokadirekt, Timely)', 'Which booking platform? (e.g. Calendly, Acuity)')} className="h-12" />
                )}
                {wantsBooking && selectedPackage !== 'pro' && (
                  <div className="p-3 bg-accent/10 rounded-lg border border-accent/30">
                    <p className="text-sm text-accent font-medium">{t('Du har uppgraderats till Pro för att inkludera bokningssystem.', 'You have been upgraded to Pro to include booking system.')}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={handlePrevStep}><ArrowLeft className="w-4 h-4" /> {t('Tillbaka', 'Back')}</Button>
                <Button size="lg" onClick={handleNextStep}>{t('Fortsätt', 'Continue')} <ArrowRight className="w-4 h-4" /></Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Pages & Content */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="p-6 bg-secondary/50 rounded-xl mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-accent" />
                    {t('Välj sidor', 'Choose pages')}
                  </h2>
                  <span className="text-sm text-muted-foreground">{getTotalPages()}/{getCurrentPackageLimit()} {t('sidor', 'pages')}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {pageOptions.map((page) => (
                    <button
                      key={page.id}
                      onClick={() => togglePage(page.id)}
                      className={`p-3 rounded-lg border-2 text-sm transition-all ${selectedPages.includes(page.id) ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/50'}`}
                    >
                      {lang === 'sv' ? page.label.sv : page.label.en}
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label>{t('Egna sidor', 'Custom pages')}</Label>
                  {customPages.map((page, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={page}
                        onChange={(e) => updateCustomPage(index, e.target.value)}
                        placeholder={t('Sidnamn...', 'Page name...')}
                        className="h-10"
                      />
                      {customPages.length > 1 && (
                        <Button variant="ghost" size="sm" onClick={() => removeCustomPage(index)}>✕</Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addCustomPage}>{t('+ Lägg till sida', '+ Add page')}</Button>
                </div>
              </div>

              <div className="p-6 bg-secondary/50 rounded-xl mb-6">
                <Label>{t('Beskriv dina tjänster', 'Describe your services')}</Label>
                <Textarea value={services} onChange={(e) => setServices(e.target.value)} placeholder={t('Vad erbjuder ditt företag?', 'What does your business offer?')} rows={3} className="mt-2" />
              </div>

              <div className="p-6 bg-secondary/50 rounded-xl mb-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{t('Bilder & Logotyp', 'Images & Logo')}</h3>
                  <InfoTooltip content={t('Ladda upp dina bilder och logotyp direkt nedan, eller kryssa i om du saknar material.', 'Upload your images and logo directly below, or check if you don\'t have materials.')} />
                </div>
                
                <div className="space-y-3">
                  <Label>{t('Ladda upp logotyp', 'Upload logo')}</Label>
                  <Input 
                    type="file" 
                    accept="image/*" 
                    className="h-12"
                    disabled={noLogo}
                  />
                </div>
                
                <div className="space-y-3">
                  <Label>{t('Ladda upp bilder', 'Upload images')}</Label>
                  <Input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    className="h-12"
                    disabled={useStock}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('Du kan välja flera bilder samtidigt.', 'You can select multiple images at once.')}
                  </p>
                </div>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox checked={noLogo} onCheckedChange={(c) => setNoLogo(c === true)} />
                  <span className="text-sm">{t('Jag har ingen logotyp (ni kan skapa en enkel)', 'I don\'t have a logo (you can create a simple one)')}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox checked={useStock} onCheckedChange={(c) => setUseStock(c === true)} />
                  <span className="text-sm">{t('Använd stockbilder (jag har inga egna bilder)', 'Use stock images (I don\'t have my own images)')}</span>
                </label>
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={handlePrevStep}><ArrowLeft className="w-4 h-4" /> {t('Tillbaka', 'Back')}</Button>
                <Button size="lg" onClick={handleNextStep}>{t('Fortsätt', 'Continue')} <ArrowRight className="w-4 h-4" /></Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Care Plan */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">{t('Lägg till månatlig webbvård?', 'Add monthly care?')}</h2>
                <p className="text-muted-foreground">{t('Håll din webbplats uppdaterad och säker.', 'Keep your website updated and secure.')}</p>
                <Button variant="ghost" size="sm" onClick={() => setShowCarePlanCompare(true)} className="mt-2">
                  {t('Jämför vårdplaner', 'Compare care plans')}
                </Button>
              </div>

              {/* Yearly Toggle */}
              <div className="flex items-center justify-center gap-3 mb-8">
                <span className={`text-sm ${!isYearlyCarePlan ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {t('Månadsvis', 'Monthly')}
                </span>
                <Switch checked={isYearlyCarePlan} onCheckedChange={setIsYearlyCarePlan} className="data-[state=checked]:bg-accent" />
                <span className={`text-sm ${isYearlyCarePlan ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {t('Årsvis', 'Yearly')}
                  <span className="ml-1 text-xs text-accent font-semibold">{t('Spara 20%', 'Save 20%')}</span>
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-6">
                {carePlans.map((c) => {
                  const price = isYearlyCarePlan ? c.yearlyPrice : c.monthlyPrice;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCarePlan(selectedCarePlan === c.id ? null : c.id)}
                      className={`p-6 rounded-xl border-2 text-left transition-all relative ${selectedCarePlan === c.id ? 'border-accent bg-accent/5 shadow-lg' : 'border-border hover:border-accent/50'}`}
                    >
                      {c.popular && <span className="absolute -top-3 left-4 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded">{t('Rekommenderas', 'Recommended')}</span>}
                      <h3 className="font-semibold text-xl mb-1">{c.name}</h3>
                      <div className="mb-4">
                        <span className="text-xl font-bold text-accent">{price} kr/mån</span>
                        {isYearlyCarePlan && (
                          <span className="ml-2 text-xs text-muted-foreground line-through">{c.monthlyPrice} kr/mån</span>
                        )}
                      </div>
                      <ul className="space-y-2">
                        {(lang === 'sv' ? c.features.sv : c.features.en).map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm"><Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />{f}</li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>


              <div className="flex justify-between mt-6 max-w-4xl mx-auto">
                <Button variant="outline" onClick={handlePrevStep}><ArrowLeft className="w-4 h-4" /> {t('Tillbaka', 'Back')}</Button>
                <Button size="lg" onClick={handleNextStep}>{t('Fortsätt', 'Continue')} <ArrowRight className="w-4 h-4" /></Button>
              </div>
            </motion.div>
          )}

          {/* Step 5: Details & Payment */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="space-y-6">
                <div className="p-6 bg-secondary/50 rounded-xl space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-accent" />
                    <h3 className="font-semibold">{t('Projektdetaljer (valfritt)', 'Project details (optional)')}</h3>
                  </div>
                  <div>
                    <Label>{t('Sidstruktur & anteckningar', 'Page structure & notes')}</Label>
                    <Textarea value={pageNotes} onChange={(e) => setPageNotes(e.target.value)} placeholder={t('Beskriv varje sida...', 'Describe each page...')} rows={3} className="mt-1" />
                  </div>
                  <div>
                    <Label>{t('Varumärke & preferenser', 'Brand & preferences')}</Label>
                    <Textarea value={brandPreferences} onChange={(e) => setBrandPreferences(e.target.value)} placeholder={t('Färger, typsnitt, ton...', 'Colors, fonts, tone...')} rows={2} className="mt-1" />
                  </div>
                  <div>
                    <Label>{t('Webbplatser du gillar (konkurrenter)', 'Websites you like (competitors)')}</Label>
                    <Input value={competitors} onChange={(e) => setCompetitors(e.target.value)} placeholder="https://..." className="h-12 mt-1" />
                  </div>
                  <div>
                    <Label>{t('SEO-sökord', 'SEO keywords')}</Label>
                    <Input value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} placeholder={t('Sökord, lokalområde...', 'Keywords, local area...')} className="h-12 mt-1" />
                  </div>
                </div>

                <div className="p-6 bg-secondary/50 rounded-xl space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Scale className="w-5 h-5 text-accent" />
                    <h3 className="font-semibold">{t('Juridiska sidor', 'Legal pages')}</h3>
                    <InfoTooltip content={t('Juridiska sidor som integritetspolicy och villkor är viktiga för att skydda ditt företag och uppfylla lagar som GDPR.', 'Legal pages like privacy policy and terms are important to protect your business and comply with laws like GDPR.')} />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-accent/5">
                      <Checkbox 
                        checked={legalPages.includes('GDPR')} 
                        onCheckedChange={(checked) => { 
                          if (checked) setLegalPages([...legalPages, 'GDPR']); 
                          else setLegalPages(legalPages.filter(p => p !== 'GDPR')); 
                        }} 
                      />
                      <span className="text-sm">GDPR</span>
                    </label>
                    
                    {/* Cookies - auto-selected and locked for Pro */}
                    <div className="relative">
                      <label 
                        className={`flex items-center gap-2 p-3 border rounded-lg ${selectedPackage === 'pro' ? 'bg-accent/10 border-accent/30 cursor-not-allowed' : 'cursor-pointer hover:bg-accent/5'}`}
                        title={selectedPackage === 'pro' ? t('Krävs för Pro-paketet pga Google Analytics', 'Required for Pro package due to Google Analytics') : ''}
                      >
                        <Checkbox 
                          checked={legalPages.includes('Cookies') || selectedPackage === 'pro'} 
                          disabled={selectedPackage === 'pro'}
                          onCheckedChange={(checked) => { 
                            if (selectedPackage !== 'pro') {
                              if (checked) setLegalPages([...legalPages, 'Cookies']); 
                              else setLegalPages(legalPages.filter(p => p !== 'Cookies')); 
                            }
                          }} 
                        />
                        <span className="text-sm">Cookies</span>
                        {selectedPackage === 'pro' && (
                          <InfoTooltip content={t('Cookies-sida krävs för Pro-paketet eftersom Google Analytics använder cookies för spårning.', 'Cookies page is required for Pro package because Google Analytics uses cookies for tracking.')} />
                        )}
                      </label>
                    </div>
                    
                    <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-accent/5">
                      <Checkbox 
                        checked={legalPages.includes(t('Villkor', 'Terms'))} 
                        onCheckedChange={(checked) => { 
                          if (checked) setLegalPages([...legalPages, t('Villkor', 'Terms')]); 
                          else {
                            setLegalPages(legalPages.filter(p => p !== t('Villkor', 'Terms'))); 
                            setTermsExplanation('');
                          }
                        }} 
                      />
                      <span className="text-sm">{t('Villkor', 'Terms')}</span>
                    </label>
                  </div>
                  
                  {legalPages.includes(t('Villkor', 'Terms')) && (
                    <div className="mt-4">
                      <Label className="flex items-center gap-2">
                        {t('Beskriv dina villkor', 'Describe your terms')} *
                        <InfoTooltip content={t('Förklara vilka villkor som gäller för dina tjänster, t.ex. avbokningsregler, betalningsvillkor, garantier.', 'Explain what terms apply to your services, e.g. cancellation rules, payment terms, guarantees.')} />
                      </Label>
                      <Textarea 
                        value={termsExplanation} 
                        onChange={(e) => setTermsExplanation(e.target.value)} 
                        placeholder={t('T.ex. avbokningsregler, betalningsvillkor, garantier...', 'E.g. cancellation rules, payment terms, guarantees...')} 
                        rows={3} 
                        className="mt-1" 
                      />
                    </div>
                  )}
                </div>

                <div className="p-6 bg-secondary/50 rounded-xl">
                  <Label>{t('Extra önskemål', 'Extra notes')}</Label>
                  <Textarea value={extraNotes} onChange={(e) => setExtraNotes(e.target.value)} placeholder={t('Speciella önskemål...', 'Special requests...')} rows={3} className="mt-1" />
                </div>

                {/* Order Summary */}
                <div className="p-6 bg-accent/10 rounded-xl border border-accent/30">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-accent" />
                    {t('Ordersammanfattning', 'Order summary')}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{pkg?.name} {t('webbpaket', 'web package')}</span>
                      <span>{pkg?.priceDisplay}</span>
                    </div>
                    {carePlan && (
                      <div className="flex justify-between">
                        <span>{carePlan.name} {t('vårdplan', 'care plan')} ({isYearlyCarePlan ? t('årsvis', 'yearly') : t('månadsvis', 'monthly')})</span>
                        <span>{carePlanPrice} kr/mån</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                      <span>{t('Totalt idag', 'Total today')}</span>
                      <span className="text-accent">{pkg?.priceDisplay}</span>
                    </div>
                    {carePlan && (
                      <p className="text-xs text-muted-foreground">
                        + {carePlanPrice} kr/mån {t('börjar efter leverans', 'starts after delivery')}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={handlePrevStep}><ArrowLeft className="w-4 h-4" /> {t('Tillbaka', 'Back')}</Button>
                  <Button size="lg" onClick={handleSubmit} disabled={isLoading} className="flex-1">
                    {isLoading ? (
                      <span className="flex items-center gap-2"><span className="animate-spin">⏳</span> {t('Bearbetar...', 'Processing...')}</span>
                    ) : (
                      <><CreditCard className="w-4 h-4" /> {t('Betala med Stripe', 'Pay with Stripe')} ({pkg?.priceDisplay})</>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
