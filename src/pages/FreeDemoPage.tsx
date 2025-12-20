import { useState } from 'react';
import { CheckCircle2, Upload, ArrowRight, Loader2, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { AnimatedSection } from '@/components/AnimatedSection';

type FormStep = 1 | 2;

const packages = [
  { id: 'starter', name: 'Starter', pages: { sv: 'Upp till 3 sidor', en: 'Up to 3 pages' } },
  { id: 'standard', name: 'Standard', pages: { sv: 'Upp till 5 sidor', en: 'Up to 5 pages' }, popular: true },
  { id: 'pro', name: 'Pro', pages: { sv: 'Upp till 8 sidor', en: 'Up to 8 pages' } },
];

const styles = ['Minimal', 'Luxury', 'Bold', 'Playful', 'Corporate'];
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

  if (submitted) {
    const pkg = packages.find(p => p.id === selectedPackage);
    return (
      <div className="section-padding py-20">
        <div className="container-narrow text-center">
          <AnimatedSection animation="scale-in">
            <div className="w-16 h-16 bg-accent-soft rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-3xl font-bold mb-4">
              {t('Bra jobbat!', 'Great job!')}
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {t(
                'Vi har mottagit din förfrågan. Du kommer att få ett mail med nästa steg för att bekräfta din plats.',
                'We\'ve received your request. You\'ll receive an email with next steps to confirm your slot.'
              )}
            </p>

            <div className="p-6 bg-secondary/50 rounded-lg border border-border max-w-sm mx-auto mb-8">
              <p className="font-heading font-semibold text-lg mb-2">
                {t('Valt paket', 'Selected package')}: {pkg?.name}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {t(
                  'Du kommer att kontaktas med betalningsinstruktioner.',
                  'You\'ll be contacted with payment instructions.'
                )}
              </p>
            </div>

            <p className="text-sm text-muted-foreground">
              {t('Vi återkommer inom 24 timmar.', 'We\'ll get back to you within 24 hours.')}
            </p>
          </AnimatedSection>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding py-12">
      <div className="container-narrow">
        <AnimatedSection animation="fade-up" className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            {t('Gratis webb-koncept (72h)', 'Free website concept demo (72h)')}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t(
              'Berätta om ditt företag så skapar vi ett koncept inom 72 timmar.',
              'Tell us about your business and we\'ll create a concept within 72 hours.'
            )}
          </p>
          
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-accent' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-accent text-accent-foreground' : 'bg-muted'}`}>1</div>
              <span className="text-sm font-medium hidden sm:inline">{t('Grundinfo', 'Basic info')}</span>
            </div>
            <div className="w-12 h-0.5 bg-border" />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-accent' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-accent text-accent-foreground' : 'bg-muted'}`}>2</div>
              <span className="text-sm font-medium hidden sm:inline">{t('Detaljer', 'Details')}</span>
            </div>
          </div>
        </AnimatedSection>

        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-8">
            {/* Demo Link - First field */}
            <AnimatedSection animation="fade-up" delay={50}>
              <section className="space-y-4">
                <h2 className="font-heading font-semibold text-xl border-b border-border pb-2">
                  {t('Länk till er nuvarande webb/Instagram', 'Link to your current site/Instagram')} *
                </h2>
                <Input 
                  value={demoLink}
                  onChange={(e) => setDemoLink(e.target.value)}
                  required 
                  placeholder="https://instagram.com/mittforetag eller mittforetag.se"
                  className="text-lg py-6"
                />
              </section>
            </AnimatedSection>

            {/* Contact Info */}
            <AnimatedSection animation="fade-up" delay={100}>
              <section className="space-y-4">
                <h2 className="font-heading font-semibold text-xl border-b border-border pb-2">
                  {t('Kontaktuppgifter', 'Contact Information')}
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('Företagsnamn', 'Business Name')} *</Label>
                    <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} required placeholder={t('Ditt Företag AB', 'Your Company Ltd')} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('Kontaktperson', 'Contact Person')} *</Label>
                    <Input value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} required placeholder="Anna Andersson" />
                  </div>
                  <div className="space-y-2">
                    <Label>E-post *</Label>
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="anna@foretag.se" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('Telefon', 'Phone')} *</Label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" required placeholder="+46 70 123 45 67" />
                  </div>
                </div>
              </section>
            </AnimatedSection>

            {/* Style Selection */}
            <AnimatedSection animation="fade-up" delay={150}>
              <section className="space-y-4">
                <h2 className="font-heading font-semibold text-xl border-b border-border pb-2">
                  {t('Välj stil', 'Choose style')} *
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {styles.map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setSelectedStyle(style)}
                      className={`p-4 border rounded-lg transition-all duration-200 ${
                        selectedStyle === style 
                          ? 'border-accent bg-accent-soft ring-2 ring-accent' 
                          : 'border-border hover:border-accent'
                      }`}
                    >
                      <span className="text-sm font-medium">{style}</span>
                    </button>
                  ))}
                </div>
              </section>
            </AnimatedSection>

            {/* Language Selection */}
            <AnimatedSection animation="fade-up" delay={200}>
              <section className="space-y-4">
                <h2 className="font-heading font-semibold text-xl border-b border-border pb-2">
                  {t('Språk på webbplatsen', 'Website language')} *
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {languages.map((language) => (
                    <button
                      key={language.id}
                      type="button"
                      onClick={() => setSelectedLanguage(language.id)}
                      className={`p-4 border rounded-lg transition-all duration-200 ${
                        selectedLanguage === language.id 
                          ? 'border-accent bg-accent-soft ring-2 ring-accent' 
                          : 'border-border hover:border-accent'
                      }`}
                    >
                      <span className="text-sm font-medium">
                        {lang === 'sv' ? language.label.sv : language.label.en}
                      </span>
                    </button>
                  ))}
                </div>
                {selectedLanguage === 'both' && (
                  <p className="text-sm text-muted-foreground">
                    {t('Konceptet kommer stödja både svenska och engelska.', 'The concept will support both Swedish and English.')}
                  </p>
                )}
              </section>
            </AnimatedSection>

            {/* Package Selection */}
            <AnimatedSection animation="fade-up" delay={250}>
              <section className="space-y-4">
                <h2 className="font-heading font-semibold text-xl border-b border-border pb-2">
                  {t('Välj paket', 'Choose package')} *
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {packages.map((pkg) => (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setSelectedPackage(pkg.id)}
                      className={`relative p-6 border rounded-lg text-left transition-all duration-200 ${
                        selectedPackage === pkg.id 
                          ? 'border-accent bg-accent-soft ring-2 ring-accent' 
                          : 'border-border hover:border-accent'
                      }`}
                    >
                      {pkg.popular && (
                        <span className="absolute -top-3 left-4 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded">
                          {t('Populärast', 'Most Popular')}
                        </span>
                      )}
                      <h3 className="font-heading font-semibold text-lg">{pkg.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {lang === 'sv' ? pkg.pages.sv : pkg.pages.en}
                      </p>
                    </button>
                  ))}
                </div>
              </section>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={300}>
              <Button type="submit" size="lg" className="w-full sm:w-auto">
                {t('Fortsätt till steg 2', 'Continue to step 2')}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </AnimatedSection>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-8">
            <AnimatedSection animation="fade-up">
              <Button type="button" variant="ghost" onClick={() => setStep(1)} className="mb-4">
                ← {t('Tillbaka till steg 1', 'Back to step 1')}
              </Button>
            </AnimatedSection>

            {/* Logo Upload */}
            <AnimatedSection animation="fade-up" delay={50}>
              <section className="space-y-4">
                <h2 className="font-heading font-semibold text-xl border-b border-border pb-2">
                  {t('Logotyp', 'Logo')}
                </h2>
                {!noLogo && (
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {t('Dra och släpp eller klicka för att ladda upp', 'Drag and drop or click to upload')}
                    </p>
                    <input type="file" className="hidden" accept="image/*" />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Checkbox id="noLogo" checked={noLogo} onCheckedChange={(checked) => setNoLogo(checked as boolean)} />
                  <Label htmlFor="noLogo" className="font-normal text-sm cursor-pointer">
                    {t('Jag har ingen logotyp', 'I don\'t have a logo')}
                  </Label>
                </div>
              </section>
            </AnimatedSection>

            {/* Services & Prices */}
            <AnimatedSection animation="fade-up" delay={100}>
              <section className="space-y-4">
                <h2 className="font-heading font-semibold text-xl border-b border-border pb-2">
                  {t('Tjänster + priser', 'Services + prices')}
                </h2>
                <Textarea
                  rows={4}
                  placeholder={t('Klippning dam: 450 kr\nKlippning herr: 350 kr\nFärgning: från 800 kr', 'Women\'s haircut: 450 kr\nMen\'s haircut: 350 kr\nColoring: from 800 kr')}
                />
              </section>
            </AnimatedSection>

            {/* Photos */}
            <AnimatedSection animation="fade-up" delay={150}>
              <section className="space-y-4">
                <h2 className="font-heading font-semibold text-xl border-b border-border pb-2">
                  {t('Foton', 'Photos')}
                </h2>
                {!useStock && (
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {t('Ladda upp bilder på verksamheten', 'Upload photos of your business')}
                    </p>
                    <input type="file" className="hidden" accept="image/*" multiple />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Checkbox id="useStock" checked={useStock} onCheckedChange={(checked) => setUseStock(checked as boolean)} />
                  <Label htmlFor="useStock" className="font-normal text-sm cursor-pointer">
                    {t('Använd stockbilder', 'Use stock photos')}
                  </Label>
                </div>
              </section>
            </AnimatedSection>

            {/* Website Needs with Custom Pages */}
            <AnimatedSection animation="fade-up" delay={200}>
              <section className="space-y-4">
                <h2 className="font-heading font-semibold text-xl border-b border-border pb-2">
                  {t('Webbplatsbehov', 'Website Needs')}
                </h2>
                <div className="space-y-2">
                  <Label>{t('Vilka sidor vill du ha?', 'Which pages do you want?')}</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
                      <label key={page.en} className="flex items-center gap-2 p-3 border border-border rounded-lg cursor-pointer hover:border-accent transition-colors has-[:checked]:border-accent has-[:checked]:bg-accent-soft">
                        <Checkbox />
                        <span className="text-sm">{t(page.sv, page.en)}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Custom Pages */}
                <div className="space-y-3 pt-4">
                  <Label>{t('Egen sida (valfri titel)', 'Custom page (title)')}</Label>
                  {customPages.map((page, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={page}
                        onChange={(e) => updateCustomPage(index, e.target.value)}
                        placeholder={t('T.ex. Behandlingar, Prislista, Team...', 'E.g. Treatments, Price list, Team...')}
                      />
                      {customPages.length > 1 && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeCustomPage(index)}>
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addCustomPage}>
                    <Plus className="w-4 h-4 mr-2" />
                    {t('Lägg till sida', 'Add page')}
                  </Button>
                </div>

                {/* Booking */}
                <div className="grid sm:grid-cols-2 gap-4 pt-4">
                  <div className="space-y-2">
                    <Label>{t('Behövs bokning?', 'Need booking?')}</Label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input type="radio" name="booking" value="yes" />
                        <span className="text-sm">{t('Ja', 'Yes')}</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="booking" value="no" />
                        <span className="text-sm">{t('Nej', 'No')}</span>
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('Vilken plattform?', 'Which platform?')}</Label>
                    <Input placeholder="Bokadirekt, Calendly, etc." />
                  </div>
                </div>
              </section>
            </AnimatedSection>

            {/* Additional Info */}
            <AnimatedSection animation="fade-up" delay={250}>
              <section className="space-y-4">
                <h2 className="font-heading font-semibold text-xl border-b border-border pb-2">
                  {t('Övrig information', 'Additional information')}
                </h2>
                <Textarea
                  rows={3}
                  placeholder={t('Berätta mer om er verksamhet, speciella önskemål, etc.', 'Tell us more about your business, special requests, etc.')}
                />
              </section>
            </AnimatedSection>

            {/* Submit */}
            <AnimatedSection animation="fade-up" delay={300}>
              <div className="pt-4">
                <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t('Skickar...', 'Submitting...')}
                    </>
                  ) : (
                    <>
                      {t('Skicka förfrågan', 'Submit request')}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
                <p className="mt-3 text-sm text-muted-foreground">
                  {t('Du kommer att kontaktas med nästa steg.', 'You\'ll be contacted with next steps.')}
                </p>
              </div>
            </AnimatedSection>
          </form>
        )}
      </div>
    </div>
  );
}
