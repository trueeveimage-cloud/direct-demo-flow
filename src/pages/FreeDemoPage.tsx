import { useState } from 'react';
import { CheckCircle2, Upload, ArrowRight, Loader2, Plus, X, Link, User, Palette, Globe, Package, FileImage, FileText, MapPin, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { AnimatedSection } from '@/components/AnimatedSection';

type FormStep = 1 | 2;

const packages = [
  { id: 'starter', name: 'Starter', pages: { sv: 'Upp till 3 sidor', en: 'Up to 3 pages' }, icon: '🚀' },
  { id: 'standard', name: 'Standard', pages: { sv: 'Upp till 5 sidor', en: 'Up to 5 pages' }, popular: true, icon: '⭐' },
  { id: 'pro', name: 'Pro', pages: { sv: 'Upp till 8 sidor', en: 'Up to 8 pages' }, icon: '💎' },
];

const styles = [
  { id: 'minimal', name: 'Minimal', icon: '○' },
  { id: 'luxury', name: 'Luxury', icon: '◆' },
  { id: 'bold', name: 'Bold', icon: '■' },
  { id: 'playful', name: 'Playful', icon: '★' },
  { id: 'corporate', name: 'Corporate', icon: '▣' },
];

const languages = [
  { id: 'sv', label: { sv: 'Svenska', en: 'Swedish' }, flag: '🇸🇪' },
  { id: 'en', label: { sv: 'Engelska', en: 'English' }, flag: '🇬🇧' },
  { id: 'both', label: { sv: 'Båda', en: 'Both' }, flag: '🌐' },
];

export default function FreeDemoPage() {
  const { t, lang } = useLanguage();
  const [step, setStep] = useState<FormStep>(1);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
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

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoLink || !businessName || !contactPerson || !email || !phone || !selectedStyle || !selectedLanguage || !selectedPackage) {
      toast({
        title: t('Fyll i alla fält', 'Fill in all fields'),
        description: t('Alla fält i steg 1 är obligatoriska.', 'All fields in step 1 are required.'),
        variant: 'destructive',
      });
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setSubmitted(true);
  };

  const step1Complete = demoLink && businessName && contactPerson && email && phone && selectedStyle && selectedLanguage && selectedPackage;

  if (submitted) {
    const pkg = packages.find(p => p.id === selectedPackage);
    return (
      <div className="min-h-screen section-padding py-20">
        <div className="container-narrow text-center">
          <AnimatedSection animation="scale-in">
            <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-10 h-10 text-accent" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              {t('Bra jobbat!', 'Great job!')}
            </h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto">
              {t(
                'Vi har mottagit din förfrågan. Du kommer att få ett mail med nästa steg för att bekräfta din plats.',
                'We\'ve received your request. You\'ll receive an email with next steps to confirm your slot.'
              )}
            </p>

            <Card className="max-w-sm mx-auto mb-10">
              <CardContent className="p-6">
                <div className="text-4xl mb-3">{pkg?.icon}</div>
                <p className="font-heading font-semibold text-xl mb-2">
                  {t('Valt paket', 'Selected package')}: {pkg?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t(
                    'Du kommer att kontaktas med betalningsinstruktioner.',
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
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 -left-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container-narrow relative">
        {/* Header */}
        <AnimatedSection animation="fade-up" className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            {t('Gratis webb-koncept (72h)', 'Free website concept demo (72h)')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {t(
              'Berätta om ditt företag så skapar vi ett koncept inom 72 timmar.',
              'Tell us about your business and we\'ll create a concept within 72 hours.'
            )}
          </p>
        </AnimatedSection>

        {/* Step Indicator */}
        <AnimatedSection animation="fade-up" delay={50} className="mb-12">
          <div className="flex items-center justify-center gap-0">
            {/* Step 1 */}
            <div className="flex items-center">
              <div className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300 ${
                step >= 1 
                  ? 'bg-accent text-accent-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step > 1 ? 'bg-accent-foreground/20' : 'bg-accent-foreground/10'
                }`}>
                  {step > 1 ? <Check className="w-4 h-4" /> : '1'}
                </div>
                <span className="font-medium hidden sm:inline">{t('Grundinfo', 'Basic info')}</span>
              </div>
            </div>

            {/* Progress line */}
            <div className="w-16 sm:w-24 h-1 mx-2">
              <div className="h-full bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-accent transition-all duration-500 ${step > 1 ? 'w-full' : 'w-0'}`}
                />
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-center">
              <div className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300 ${
                step >= 2 
                  ? 'bg-accent text-accent-foreground' 
                  : 'bg-muted text-muted-foreground'
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

        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-8">
            {/* Demo Link - First field */}
            <AnimatedSection animation="fade-up" delay={100}>
              <Card className="overflow-hidden border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <Link className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h2 className="font-heading font-semibold text-xl">
                        {t('Länk till er nuvarande webb/Instagram', 'Link to your current site/Instagram')}
                      </h2>
                      <p className="text-sm text-muted-foreground">{t('Obligatoriskt', 'Required')}</p>
                    </div>
                  </div>
                  <Input 
                    value={demoLink}
                    onChange={(e) => setDemoLink(e.target.value)}
                    required 
                    placeholder="https://instagram.com/mittforetag eller mittforetag.se"
                    className="text-lg h-14 bg-background"
                  />
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Contact Info */}
            <AnimatedSection animation="fade-up" delay={150}>
              <Card>
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
                      <Label className="text-sm font-medium">{t('Företagsnamn', 'Business Name')} *</Label>
                      <Input 
                        value={businessName} 
                        onChange={(e) => setBusinessName(e.target.value)} 
                        required 
                        placeholder={t('Ditt Företag AB', 'Your Company Ltd')}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">{t('Kontaktperson', 'Contact Person')} *</Label>
                      <Input 
                        value={contactPerson} 
                        onChange={(e) => setContactPerson(e.target.value)} 
                        required 
                        placeholder="Anna Andersson"
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">E-post *</Label>
                      <Input 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        type="email" 
                        required 
                        placeholder="anna@foretag.se"
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">{t('Telefon', 'Phone')} *</Label>
                      <Input 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        type="tel" 
                        required 
                        placeholder="+46 70 123 45 67"
                        className="h-12"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Style Selection */}
            <AnimatedSection animation="fade-up" delay={200}>
              <Card>
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <Palette className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="font-heading font-semibold text-xl">
                      {t('Välj stil', 'Choose style')}
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {styles.map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setSelectedStyle(style.id)}
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
                        <div className="text-2xl mb-2 opacity-60 group-hover:opacity-100 transition-opacity">{style.icon}</div>
                        <span className="text-sm font-medium">{style.name}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Language Selection */}
            <AnimatedSection animation="fade-up" delay={250}>
              <Card>
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="font-heading font-semibold text-xl">
                      {t('Språk på webbplatsen', 'Website language')}
                    </h2>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {languages.map((language) => (
                      <button
                        key={language.id}
                        type="button"
                        onClick={() => setSelectedLanguage(language.id)}
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
                        <div className="text-2xl mb-2">{language.flag}</div>
                        <span className="text-sm font-medium">
                          {lang === 'sv' ? language.label.sv : language.label.en}
                        </span>
                      </button>
                    ))}
                  </div>
                  {selectedLanguage === 'both' && (
                    <p className="text-sm text-muted-foreground mt-4 p-3 bg-accent/5 rounded-lg">
                      {t('Konceptet kommer stödja både svenska och engelska.', 'The concept will support both Swedish and English.')}
                    </p>
                  )}
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Package Selection */}
            <AnimatedSection animation="fade-up" delay={300}>
              <Card>
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <Package className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="font-heading font-semibold text-xl">
                      {t('Välj paket', 'Choose package')}
                    </h2>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    {packages.map((pkg) => (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => setSelectedPackage(pkg.id)}
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
                        <div className="text-3xl mb-3">{pkg.icon}</div>
                        <h3 className="font-heading font-semibold text-lg mb-1">{pkg.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {lang === 'sv' ? pkg.pages.sv : pkg.pages.en}
                        </p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Submit Button */}
            <AnimatedSection animation="fade-up" delay={350}>
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full sm:w-auto h-14 px-8 text-lg"
                  disabled={!step1Complete}
                >
                  {t('Fortsätt till steg 2', 'Continue to step 2')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                {!step1Complete && (
                  <p className="text-sm text-muted-foreground">
                    {t('Fyll i alla fält för att fortsätta', 'Fill in all fields to continue')}
                  </p>
                )}
              </div>
            </AnimatedSection>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-8">
            <AnimatedSection animation="fade-up">
              <Button type="button" variant="ghost" onClick={() => setStep(1)} className="mb-2 -ml-2">
                ← {t('Tillbaka till steg 1', 'Back to step 1')}
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
                        {t('Dra och släpp eller klicka för att ladda upp', 'Drag and drop or click to upload')}
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
                    rows={5}
                    className="resize-none"
                    placeholder={t('Klippning dam: 450 kr\nKlippning herr: 350 kr\nFärgning: från 800 kr', 'Women\'s haircut: 450 kr\nMen\'s haircut: 350 kr\nColoring: from 800 kr')}
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
                        {t('Ladda upp bilder på verksamheten', 'Upload photos of your business')}
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
                    <h2 className="font-heading font-semibold text-xl">
                      {t('Webbplatsbehov', 'Website Needs')}
                    </h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <Label className="text-sm font-medium mb-3 block">{t('Vilka sidor vill du ha?', 'Which pages do you want?')}</Label>
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
                          <label key={page.en} className="flex items-center gap-3 p-4 border-2 border-border rounded-xl cursor-pointer hover:border-accent/50 hover:bg-accent/5 transition-all duration-200 has-[:checked]:border-accent has-[:checked]:bg-accent/10">
                            <Checkbox />
                            <span className="text-sm font-medium">{t(page.sv, page.en)}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Custom Pages */}
                    <div className="pt-4 border-t border-border">
                      <Label className="text-sm font-medium mb-3 block">{t('Egen sida (valfri titel)', 'Custom page (title)')}</Label>
                      <div className="space-y-3">
                        {customPages.map((page, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <Input
                              value={page}
                              onChange={(e) => updateCustomPage(index, e.target.value)}
                              placeholder={t('T.ex. Behandlingar, Prislista, Team...', 'E.g. Treatments, Price list, Team...')}
                              className="h-12"
                            />
                            {customPages.length > 1 && (
                              <Button type="button" variant="ghost" size="icon" onClick={() => removeCustomPage(index)} className="shrink-0">
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={addCustomPage} className="mt-2">
                          <Plus className="w-4 h-4 mr-2" />
                          {t('Lägg till sida', 'Add page')}
                        </Button>
                      </div>
                    </div>

                    {/* Booking */}
                    <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-border">
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">{t('Behövs bokning?', 'Need booking?')}</Label>
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
                        <Label className="text-sm font-medium">{t('Vilken plattform?', 'Which platform?')}</Label>
                        <Input placeholder="Bokadirekt, Calendly, etc." className="h-12" />
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
                      {t('Övrig information', 'Additional information')}
                    </h2>
                  </div>
                  <Textarea
                    rows={4}
                    className="resize-none"
                    placeholder={t('Berätta mer om er verksamhet, speciella önskemål, etc.', 'Tell us more about your business, special requests, etc.')}
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
                        {t('Skicka förfrågan', 'Submit request')}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                  <p className="mt-4 text-sm text-muted-foreground">
                    {t('Du kommer att kontaktas med nästa steg.', 'You\'ll be contacted with next steps.')}
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>
          </form>
        )}
      </div>
    </div>
  );
}
