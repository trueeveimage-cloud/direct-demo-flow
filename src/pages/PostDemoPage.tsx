import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, RefreshCcw, Globe, Shield, XCircle, ChevronDown, ChevronUp, Check, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { AnimatedSection } from '@/components/AnimatedSection';

const packages = [
  { 
    id: 'starter', 
    name: 'Starter', 
    pages: { sv: 'Upp till 3 sidor', en: 'Up to 3 pages' },
    features: {
      sv: ['Responsiv design', 'Mobil-först', 'Kontaktformulär', 'SEO-grundläggande', '1 revision'],
      en: ['Responsive design', 'Mobile-first', 'Contact form', 'Basic SEO', '1 revision']
    }
  },
  { 
    id: 'standard', 
    name: 'Standard', 
    pages: { sv: 'Upp till 5 sidor', en: 'Up to 5 pages' },
    popular: true,
    features: {
      sv: ['Allt i Starter', '2 revisioner', 'Google Maps integration', 'Sociala medier-länkar', 'Bildgalleri'],
      en: ['Everything in Starter', '2 revisions', 'Google Maps integration', 'Social media links', 'Image gallery']
    }
  },
  { 
    id: 'pro', 
    name: 'Pro', 
    pages: { sv: 'Upp till 8 sidor', en: 'Up to 8 pages' },
    features: {
      sv: ['Allt i Standard', '3 revisioner', 'Bokningsintegration', 'Nyhetsbrev-setup', 'Google Analytics', 'Prioriterad support'],
      en: ['Everything in Standard', '3 revisions', 'Booking integration', 'Newsletter setup', 'Google Analytics', 'Priority support']
    }
  },
];

const carePlans = [
  { 
    id: 'basic', 
    name: 'Basic',
    features: {
      sv: ['Hosting', 'Uppdateringar', 'Säkerhetskopiering', 'Uptime-övervakning'],
      en: ['Hosting', 'Updates', 'Backups', 'Uptime monitoring']
    }
  },
  { 
    id: 'standard', 
    name: 'Standard',
    popular: true,
    features: {
      sv: ['Allt i Basic', 'Domän ingår', 'Företagsmail', '1 timme ändringar/mån'],
      en: ['Everything in Basic', 'Domain included', 'Business email', '1 hour edits/month']
    }
  },
  { 
    id: 'pro', 
    name: 'Pro',
    features: {
      sv: ['Allt i Standard', '3 timmar ändringar/mån', 'Prioriterad support', 'Prestanda-optimering'],
      en: ['Everything in Standard', '3 hours edits/month', 'Priority support', 'Performance optimization']
    }
  },
];

export default function PostDemoPage() {
  const { t, lang } = useLanguage();
  const [selectedOption, setSelectedOption] = useState<'proceed' | 'refund' | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<string>('standard');
  const [selectedCarePlan, setSelectedCarePlan] = useState<string | null>('standard');
  const [expandedPackage, setExpandedPackage] = useState<string | null>(null);
  const [expandedCarePlan, setExpandedCarePlan] = useState<string | null>(null);

  const pkg = packages.find(p => p.id === selectedPackage);
  const care = carePlans.find(c => c.id === selectedCarePlan);

  if (selectedOption === 'proceed') {
    return (
      <div className="section-padding py-12">
        <div className="container-wide">
          {/* Step Indicator */}
          <AnimatedSection animation="fade-up" className="mb-12">
            <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
              {[
                { num: 1, label: t('Välj paket', 'Choose package') },
                { num: 2, label: t('Tillägg', 'Extras') },
                { num: 3, label: t('Bekräfta', 'Confirm') },
              ].map((step, index) => (
                <div key={step.num} className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentStep(step.num)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      currentStep === step.num 
                        ? 'bg-accent text-accent-foreground' 
                        : currentStep > step.num 
                          ? 'bg-accent/20 text-accent' 
                          : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    <span className="w-6 h-6 rounded-full bg-background/20 flex items-center justify-center text-sm font-bold">
                      {currentStep > step.num ? <Check className="w-4 h-4" /> : step.num}
                    </span>
                    <span className="text-sm font-medium hidden sm:inline">{step.label}</span>
                  </button>
                  {index < 2 && <div className="w-8 h-0.5 bg-border hidden sm:block" />}
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Step 1: Choose Package */}
          {currentStep === 1 && (
            <div>
              <AnimatedSection animation="fade-up" className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                  {t('Välj ditt webbpaket', 'Choose your website package')}
                </h1>
                <p className="text-muted-foreground">
                  {t('Välj det paket som passar dina behov.', 'Select the package that fits your needs.')}
                </p>
              </AnimatedSection>

              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {packages.map((p, index) => (
                  <AnimatedSection key={p.id} animation="fade-up" delay={index * 100}>
                    <button
                      onClick={() => setSelectedPackage(p.id)}
                      className={`w-full p-6 rounded-lg border-2 text-left transition-all duration-200 relative ${
                        selectedPackage === p.id 
                          ? 'border-accent bg-accent-soft ring-2 ring-accent shadow-lg' 
                          : 'border-border hover:border-accent bg-background'
                      }`}
                    >
                      {p.popular && (
                        <span className="absolute -top-3 left-4 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded">
                          {t('Populärast', 'Most Popular')}
                        </span>
                      )}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-heading font-semibold text-xl">{p.name}</h3>
                        {selectedPackage === p.id && <CheckCircle2 className="w-5 h-5 text-accent" />}
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {lang === 'sv' ? p.pages.sv : p.pages.en}
                      </p>
                      
                      {/* Collapsible features */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedPackage(expandedPackage === p.id ? null : p.id);
                        }}
                        className="flex items-center gap-2 text-sm text-accent hover:underline"
                      >
                        {t('Visa detaljer', 'Show details')}
                        {expandedPackage === p.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      
                      {expandedPackage === p.id && (
                        <ul className="mt-4 space-y-2 animate-fade-in">
                          {(lang === 'sv' ? p.features.sv : p.features.en).map((feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </button>
                  </AnimatedSection>
                ))}
              </div>

              <AnimatedSection animation="fade-up" delay={400} className="text-center mt-8">
                <Button size="lg" onClick={() => setCurrentStep(2)}>
                  {t('Fortsätt', 'Continue')}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </AnimatedSection>
            </div>
          )}

          {/* Step 2: Extras (Monthly Care) */}
          {currentStep === 2 && (
            <div>
              <AnimatedSection animation="fade-up" className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                  {t('Lägg till månatlig webbvård?', 'Add monthly care plan?')}
                </h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  {t(
                    'De flesta kunder väljer Standard-vårdplanen så att webbplatsen förblir snabb, uppdaterad och redigerbar. Avsluta när du vill.',
                    'Most clients choose the Standard Care Plan so the site stays fast, updated, and editable. Cancel anytime.'
                  )}
                </p>
              </AnimatedSection>

              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
                {carePlans.map((c, index) => (
                  <AnimatedSection key={c.id} animation="fade-up" delay={index * 100}>
                    <button
                      onClick={() => setSelectedCarePlan(selectedCarePlan === c.id ? null : c.id)}
                      className={`w-full p-6 rounded-lg border-2 text-left transition-all duration-200 relative ${
                        selectedCarePlan === c.id 
                          ? 'border-accent bg-accent-soft ring-2 ring-accent shadow-lg' 
                          : 'border-border hover:border-accent bg-background'
                      }`}
                    >
                      {c.popular && (
                        <span className="absolute -top-3 left-4 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded">
                          {t('Rekommenderas', 'Recommended')}
                        </span>
                      )}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-heading font-semibold text-xl">{c.name}</h3>
                        {selectedCarePlan === c.id ? (
                          <CheckCircle2 className="w-5 h-5 text-accent" />
                        ) : (
                          <Plus className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      
                      {/* Collapsible features */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedCarePlan(expandedCarePlan === c.id ? null : c.id);
                        }}
                        className="flex items-center gap-2 text-sm text-accent hover:underline"
                      >
                        {t('Visa detaljer', 'Show details')}
                        {expandedCarePlan === c.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      
                      {expandedCarePlan === c.id && (
                        <ul className="mt-4 space-y-2 animate-fade-in">
                          {(lang === 'sv' ? c.features.sv : c.features.en).map((feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </button>
                  </AnimatedSection>
                ))}
              </div>

              <AnimatedSection animation="fade-up" delay={400}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    {t('Tillbaka', 'Back')}
                  </Button>
                  <Button size="lg" onClick={() => setCurrentStep(3)}>
                    {selectedCarePlan 
                      ? t('Fortsätt med vårdplan', 'Continue with care plan')
                      : t('Fortsätt utan vårdplan', 'Continue without care plan')
                    }
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </AnimatedSection>
            </div>
          )}

          {/* Step 3: Confirm */}
          {currentStep === 3 && (
            <div className="max-w-2xl mx-auto">
              <AnimatedSection animation="fade-up" className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                  {t('Bekräfta din beställning', 'Confirm your order')}
                </h1>
                <p className="text-muted-foreground">
                  {t('Granska ditt val innan du fortsätter.', 'Review your selection before proceeding.')}
                </p>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={100}>
                <div className="bg-secondary/50 rounded-lg p-6 mb-6">
                  <h3 className="font-heading font-semibold text-lg mb-4">{t('Din beställning', 'Your order')}</h3>
                  
                  <div className="space-y-4">
                    {/* Package */}
                    <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                      <div>
                        <p className="font-medium">{t('Webbpaket', 'Website Package')}: {pkg?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {lang === 'sv' ? pkg?.pages.sv : pkg?.pages.en}
                        </p>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-accent" />
                    </div>

                    {/* Care Plan */}
                    {selectedCarePlan && care && (
                      <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                        <div>
                          <p className="font-medium">{t('Månatlig webbvård', 'Monthly Care')}: {care.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {t('Avsluta när du vill', 'Cancel anytime')}
                          </p>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-accent" />
                      </div>
                    )}

                    {/* Verification fee info */}
                    <div className="p-4 bg-accent-soft rounded-lg border border-accent/20">
                      <p className="text-sm">
                        <strong>{t('Verifieringsavgift (10%)', 'Verification fee (10%)')}</strong>: {' '}
                        {t(
                          'En liten avgift för att bekräfta din prioritetsplats. Helt återbetalningsbar om du avvisar konceptet. Dras av från slutpriset om du fortsätter.',
                          'A small fee to confirm your priority slot. Fully refundable if you reject the concept. Deducted from final price if you proceed.'
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={200}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>
                    {t('Tillbaka', 'Back')}
                  </Button>
                  <Button asChild size="lg">
                    <Link to="/kontakt">
                      {t('Kontakta oss för att slutföra', 'Contact us to complete')}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </AnimatedSection>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (selectedOption === 'refund') {
    return (
      <div className="section-padding py-20">
        <div className="container-narrow text-center">
          <AnimatedSection animation="scale-in">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <RefreshCcw className="w-8 h-8 text-muted-foreground" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              {t('Vi förstår', 'We understand')}
            </h1>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              {t(
                'Tack för att du provade vårt koncept. Vi behandlar din återbetalning inom 7 arbetsdagar.',
                'Thank you for trying our concept. We\'ll process your refund within 7 business days.'
              )}
            </p>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={100}>
            <div className="p-6 bg-secondary/50 rounded-lg max-w-md mx-auto mb-8">
              <h3 className="font-heading font-semibold mb-2">
                {t('Återbetalningsprocess', 'Refund Process')}
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2 text-left">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  {t('Begäran mottagen', 'Request received')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-muted-foreground mt-0.5 flex-shrink-0" />
                  {t('Behandlas (1-3 arbetsdagar)', 'Processing (1-3 business days)')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-muted-foreground mt-0.5 flex-shrink-0" />
                  {t('Verifieringsavgiften återbetalas till din betalningsmetod', 'Verification fee refunded to your payment method')}
                </li>
              </ul>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={200}>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {t(
                  'Vi skulle uppskatta om du kunde berätta varför konceptet inte passade dig.',
                  'We\'d appreciate if you could tell us why the concept didn\'t work for you.'
                )}
              </p>
              <Button asChild variant="outline">
                <Link to="/kontakt">
                  {t('Ge feedback', 'Give feedback')}
                </Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding py-20">
      <div className="container-narrow">
        <AnimatedSection animation="fade-up" className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            {t('Fått ditt koncept?', 'Got your concept?')}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t(
              'Grattis! Nu är det dags att bestämma hur du vill gå vidare.',
              'Congratulations! Now it\'s time to decide how you want to proceed.'
            )}
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <AnimatedSection animation="fade-right" delay={100}>
            <button
              onClick={() => setSelectedOption('proceed')}
              className="w-full p-8 bg-accent-soft border-2 border-accent rounded-lg text-left hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-accent/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-7 h-7 text-accent" />
              </div>
              <h2 className="font-heading font-semibold text-xl mb-2">
                {t('Jag gillar konceptet! 🎉', 'I love the concept! 🎉')}
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                {t(
                  'Fantastiskt! Låt oss fortsätta och bygga din riktiga webbplats.',
                  'Awesome! Let\'s continue and build your real website.'
                )}
              </p>
              <span className="inline-flex items-center gap-2 text-accent font-medium text-sm group-hover:gap-3 transition-all">
                {t('Fortsätt', 'Continue')}
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          </AnimatedSection>

          <AnimatedSection animation="fade-left" delay={200}>
            <button
              onClick={() => setSelectedOption('refund')}
              className="w-full p-8 bg-secondary/50 border border-border rounded-lg text-left hover:border-muted-foreground transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <XCircle className="w-7 h-7 text-muted-foreground" />
              </div>
              <h2 className="font-heading font-semibold text-xl mb-2">
                {t('Det var inte för mig', 'It wasn\'t for me')}
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                {t(
                  'Inga problem! Du får tillbaka din verifieringsavgift inom 7 arbetsdagar.',
                  'No problem! You\'ll get your verification fee back within 7 business days.'
                )}
              </p>
              <span className="inline-flex items-center gap-2 text-muted-foreground font-medium text-sm group-hover:gap-3 transition-all">
                {t('Begär återbetalning', 'Request refund')}
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          </AnimatedSection>
        </div>

        <AnimatedSection animation="fade-up" delay={300} className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            {t('Har du frågor innan du bestämmer dig? ', 'Have questions before deciding? ')}
            <Link to="/kontakt" className="text-accent hover:underline">
              {t('Kontakta oss', 'Contact us')}
            </Link>
          </p>
        </AnimatedSection>
      </div>
    </div>
  );
}
