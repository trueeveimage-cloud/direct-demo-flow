import { useState, useRef } from 'react';
import { CheckCircle2, Upload, ArrowRight, Loader2, Plus, X, Link as LinkIcon, User, Palette, Globe, Package, FileImage, FileText, MapPin, Check, AlertCircle } from 'lucide-react';
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

type FormStep = 1 | 2;

const packages = [
  { id: 'starter', name: 'Starter', price: '4 900 kr', pages: { sv: 'Upp till 3 sidor', en: 'Up to 3 pages' }, maxPages: 3 },
  { id: 'standard', name: 'Standard', price: '7 900 kr', pages: { sv: 'Upp till 5 sidor', en: 'Up to 5 pages' }, popular: true, maxPages: 5 },
  { id: 'pro', name: 'Pro', price: '12 900 kr', pages: { sv: 'Upp till 8 sidor', en: 'Up to 8 pages' }, maxPages: 8 },
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
  const [upgradeReason, setUpgradeReason] = useState('');
  
  // Refs for auto-scroll
  const styleRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);
  const packageRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  
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
  
  // Step 2 state
  const [noLogo, setNoLogo] = useState(false);
  const [useStock, setUseStock] = useState(false);
  const [customPages, setCustomPages] = useState<string[]>(['']);
  const [selectedPages, setSelectedPages] = useState<string[]>([]);

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
    if (selectedPages.includes(page)) {
      setSelectedPages(selectedPages.filter(p => p !== page));
    } else {
      setSelectedPages([...selectedPages, page]);
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

  const checkPageLimit = () => {
    const total = getTotalPages();
    const limit = getCurrentPackageLimit();
    if (total > limit && selectedPackage) {
      setUpgradeReason('pages');
      setShowUpgradeModal(true);
      return false;
    }
    return true;
  };

  const checkBothLanguages = () => {
    if (selectedLanguage === 'both' && selectedPackage !== 'pro') {
      setUpgradeReason('language');
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
    
    if (!businessName.trim()) {
      newErrors.businessName = true;
    }
    if (!contactPerson.trim()) {
      newErrors.contactPerson = true;
    }
    if (!email.trim()) {
      newErrors.email = true;
    }
    if (!phone.trim()) {
      newErrors.phone = true;
    }
    if (!selectedStyle) {
      newErrors.style = true;
    }
    if (!selectedLanguage) {
      newErrors.language = true;
    }
    if (!selectedPackage) {
      newErrors.package = true;
    }
    
    setErrors(newErrors);
    
    // Auto-scroll to first error
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
    
    if (!checkBothLanguages()) {
      return;
    }
    
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkPageLimit()) {
      return;
    }
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setSubmitted(true);
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
                'Du kommer att få ett mail med nästa steg för att bekräfta din plats.',
                'You\'ll receive an email with next steps to confirm your slot.'
              )}
            </p>

            <Card className="max-w-sm mx-auto mb-10">
              <CardContent className="p-6">
                <p className="font-heading font-semibold text-xl mb-2">
                  {t('Valt paket', 'Selected package')}: {pkg?.name}
                </p>
                <p className="text-2xl font-bold text-accent mb-2">{pkg?.price}</p>
                <p className="text-sm text-muted-foreground">
                  {t(
                    'Du kontaktas med betalningsinstruktioner.',
                    'You\'ll be contacted with payment instructions.'
                  )}
                </p>
              </CardContent>
            </Card>

            <p className="text-muted-foreground">
              {t('Vi återkommer inom 24 timmar.', 'We\'ll get back to you within 24 hours.')}
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
                {t(
                  `Du har valt fler sidor än vad ditt paket inkluderar. Uppgradera för att fortsätta.`,
                  `You've selected more pages than your package includes. Upgrade to continue.`
                )}
              </p>
            )}
            {upgradeReason === 'language' && (
              <p className="text-muted-foreground">
                {t(
                  'Båda språken kräver Pro-paketet. Uppgradera för att inkludera svenska och engelska.',
                  'Both languages require the Pro package. Upgrade to include Swedish and English.'
                )}
              </p>
            )}
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowUpgradeModal(false)}>
              {t('Avbryt', 'Cancel')}
            </Button>
            {selectedPackage === 'starter' && (
              <>
                <Button onClick={() => upgradePackage('standard')}>
                  Standard (7 900 kr)
                </Button>
                <Button onClick={() => upgradePackage('pro')}>
                  Pro (12 900 kr)
                </Button>
              </>
            )}
            {selectedPackage === 'standard' && (
              <Button onClick={() => upgradePackage('pro')}>
                Pro (12 900 kr)
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="container-narrow relative">
        {/* Header */}
        <AnimatedSection animation="fade-up" className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            {t('Gratis webb-koncept', 'Free website concept')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {t('Koncept inom 72 timmar.', 'Concept within 72 hours.')}
          </p>
        </AnimatedSection>

        {/* Step Indicator */}
        <AnimatedSection animation="fade-up" delay={50} className="mb-12">
          <div className="flex items-center justify-center gap-0">
            <div className="flex items-center">
              <div className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300 ${
                step >= 1 ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step > 1 ? 'bg-accent-foreground/20' : 'bg-accent-foreground/10'
                }`}>
                  {step > 1 ? <Check className="w-4 h-4" /> : '1'}
                </div>
                <span className="font-medium hidden sm:inline">{t('Grundinfo', 'Basic info')}</span>
              </div>
            </div>

            <div className="w-16 sm:w-24 h-1 mx-2">
              <div className="h-full bg-muted rounded-full overflow-hidden">
                <div className={`h-full bg-accent transition-all duration-500 ${step > 1 ? 'w-full' : 'w-0'}`} />
              </div>
            </div>

            <div className="flex items-center">
              <div className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300 ${
                step >= 2 ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= 2 ? 'bg-accent-foreground/10' : ''
                }`}>
                  2
                </div>
                <span className="font-medium hidden sm:inline">{t('Detaljer', 'Details')}</span>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Verification Fee Notice - ONLY on this page */}
        <AnimatedSection animation="fade-up" delay={75} className="mb-8">
          <div className="p-4 bg-accent/10 rounded-xl border border-accent/20">
            <p className="text-sm text-center">
              <strong>{t('Verifieringsavgift (10%)', 'Verification fee (10%)')}</strong>: {' '}
              {t(
                'En liten avgift för att bekräfta din prioritetsplats. Helt återbetalningsbar om du avvisar konceptet. Dras av från slutpriset om du fortsätter.',
                'A small fee to confirm your priority slot. Fully refundable if you reject the concept. Deducted from final price if you proceed.'
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
                    <div>
                      <h2 className="font-heading font-semibold text-xl">
                        {t('Länk till er nuvarande webb/Instagram', 'Link to your current site/Instagram')}
                      </h2>
                      <p className="text-sm text-muted-foreground">{t('Valfritt', 'Optional')}</p>
                    </div>
                  </div>
                  <Input 
                    value={demoLink}
                    onChange={(e) => setDemoLink(e.target.value)}
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
                        <Label className={`text-sm font-medium ${errors.businessName ? 'text-destructive' : ''}`}>
                          {t('Företagsnamn', 'Business Name')} *
                        </Label>
                        <Input 
                          value={businessName} 
                          onChange={(e) => { setBusinessName(e.target.value); setErrors({...errors, businessName: false}); }} 
                          placeholder={t('Ditt Företag AB', 'Your Company Ltd')}
                          className={`h-12 ${errors.businessName ? 'border-destructive' : ''}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className={`text-sm font-medium ${errors.contactPerson ? 'text-destructive' : ''}`}>
                          {t('Kontaktperson', 'Contact Person')} *
                        </Label>
                        <Input 
                          value={contactPerson} 
                          onChange={(e) => { setContactPerson(e.target.value); setErrors({...errors, contactPerson: false}); }} 
                          placeholder="Anna Andersson"
                          className={`h-12 ${errors.contactPerson ? 'border-destructive' : ''}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className={`text-sm font-medium ${errors.email ? 'text-destructive' : ''}`}>E-post *</Label>
                        <Input 
                          value={email} 
                          onChange={(e) => { setEmail(e.target.value); setErrors({...errors, email: false}); }} 
                          type="email" 
                          placeholder="anna@foretag.se"
                          className={`h-12 ${errors.email ? 'border-destructive' : ''}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className={`text-sm font-medium ${errors.phone ? 'text-destructive' : ''}`}>
                          {t('Telefon', 'Phone')} *
                        </Label>
                        <Input 
                          value={phone} 
                          onChange={(e) => { setPhone(e.target.value); setErrors({...errors, phone: false}); }} 
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
                      <div>
                        <h2 className="font-heading font-semibold text-xl">
                          {t('Välj stil', 'Choose style')} *
                        </h2>
                        {errors.style && (
                          <p className="text-sm text-destructive flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {t('Välj en stil', 'Select a style')}
                          </p>
                        )}
                      </div>
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
                      <div>
                        <h2 className="font-heading font-semibold text-xl">
                          {t('Språk på webbplatsen', 'Website language')} *
                        </h2>
                        {errors.language && (
                          <p className="text-sm text-destructive flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {t('Välj ett språk', 'Select a language')}
                          </p>
                        )}
                      </div>
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

            {/* Package Selection */}
            <AnimatedSection animation="fade-up" delay={300}>
              <div ref={packageRef}>
                <Card className={errors.package ? 'border-destructive' : ''}>
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <Package className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h2 className="font-heading font-semibold text-xl">
                          {t('Välj paket', 'Choose package')} *
                        </h2>
                        {errors.package && (
                          <p className="text-sm text-destructive flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {t('Välj ett paket', 'Select a package')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      {packages.map((pkg) => (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => { setSelectedPackage(pkg.id); setErrors({...errors, package: false}); }}
                          className={`group relative p-6 border-2 rounded-xl text-left transition-all duration-300 hover:scale-[1.02] ${
                            selectedPackage === pkg.id 
                              ? 'border-accent bg-accent/10 shadow-lg shadow-accent/10' 
                              : 'border-border hover:border-accent/50 hover:bg-accent/5'
                          } ${pkg.popular ? 'ring-2 ring-accent/30' : ''}`}
                        >
                          {pkg.popular && (
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                              {t('Populärast', 'Most Popular')}
                            </span>
                          )}
                          {selectedPackage === pkg.id && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-accent-foreground" />
                            </div>
                          )}
                          <h3 className="font-heading font-semibold text-lg mb-1">{pkg.name}</h3>
                          <p className="text-xl font-bold text-accent mb-1">{pkg.price}</p>
                          <p className="text-sm text-muted-foreground">
                            {lang === 'sv' ? pkg.pages.sv : pkg.pages.en}
                          </p>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </AnimatedSection>

            {/* Submit Button */}
            <AnimatedSection animation="fade-up" delay={350}>
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
          <form onSubmit={handleSubmit} className="space-y-8">
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
                    <h2 className="font-heading font-semibold text-xl">
                      {t('Logotyp', 'Logo')}
                    </h2>
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
                    <Checkbox 
                      id="noLogo" 
                      checked={noLogo} 
                      onCheckedChange={(checked) => setNoLogo(checked as boolean)} 
                    />
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
                    <h2 className="font-heading font-semibold text-xl">
                      {t('Tjänster + priser', 'Services + prices')}
                    </h2>
                  </div>
                  <Textarea
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
                    <h2 className="font-heading font-semibold text-xl">
                      {t('Foton', 'Photos')}
                    </h2>
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
                    <Checkbox 
                      id="useStock" 
                      checked={useStock} 
                      onCheckedChange={(checked) => setUseStock(checked as boolean)} 
                    />
                    <Label htmlFor="useStock" className="font-normal cursor-pointer">
                      {t('Använd stockbilder', 'Use stock photos')}
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Website Needs */}
            <AnimatedSection animation="fade-up" delay={200}>
              <Card>
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h2 className="font-heading font-semibold text-xl">
                        {t('Sidor', 'Pages')}
                      </h2>
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
                      <Label className="text-sm font-medium mb-3 block">{t('Egen sida', 'Custom page')}</Label>
                      <div className="space-y-3">
                        {customPages.map((page, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <Input
                              value={page}
                              onChange={(e) => updateCustomPage(index, e.target.value)}
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

                    {/* Booking */}
                    <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-border">
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">{t('Bokning?', 'Booking?')}</Label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 p-3 border-2 border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors has-[:checked]:border-accent has-[:checked]:bg-accent/10">
                            <input type="radio" name="booking" value="yes" className="accent-accent" />
                            <span className="text-sm font-medium">{t('Ja', 'Yes')}</span>
                          </label>
                          <label className="flex items-center gap-2 p-3 border-2 border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors has-[:checked]:border-accent has-[:checked]:bg-accent/10">
                            <input type="radio" name="booking" value="no" className="accent-accent" />
                            <span className="text-sm font-medium">{t('Nej', 'No')}</span>
                          </label>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">{t('Plattform?', 'Platform?')}</Label>
                        <Input placeholder="Bokadirekt, Calendly..." className="h-12" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Additional Info */}
            <AnimatedSection animation="fade-up" delay={250}>
              <Card>
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="font-heading font-semibold text-xl">
                      {t('Övrigt', 'Other')}
                    </h2>
                  </div>
                  <Textarea
                    rows={3}
                    className="resize-none"
                    placeholder={t('Speciella önskemål...', 'Special requests...')}
                  />
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Submit */}
            <AnimatedSection animation="fade-up" delay={300}>
              <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
                <CardContent className="p-6 sm:p-8">
                  <Button type="submit" size="lg" className="w-full sm:w-auto h-14 px-10 text-lg" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        {t('Skickar...', 'Submitting...')}
                      </>
                    ) : (
                      <>
                        {t('Skicka', 'Submit')}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </AnimatedSection>
          </form>
        )}
      </div>
    </div>
  );
}
