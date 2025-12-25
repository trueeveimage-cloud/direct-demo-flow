import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { AnimatedSection } from '@/components/AnimatedSection';
import { PackageCompareModal } from '@/components/PackageCompareModal';
import { CarePlansCompareModal } from '@/components/CarePlansCompareModal';
import { Switch } from '@/components/ui/switch';
import { getTooltip } from '@/components/PricingTooltips';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function PricingPage() {
  const { t, lang } = useLanguage();
  const [compareOpen, setCompareOpen] = useState(false);
  const [carePlansCompareOpen, setCarePlansCompareOpen] = useState(false);
  const [isYearly, setIsYearly] = useState(false);

  const packages = [
    { 
      name: 'Starter', 
      price: '4 900 kr',
      delivery: t('14 dagar', '14 days'),
      description: t('För små företag som bara behöver något snyggt och tydligt.', 'For small businesses that just need something nice and clear.'),
      pages: t('Upp till 3 sidor', 'Up to 3 pages'), 
      features: [
        { text: t('Mobilanpassad design', 'Mobile-responsive design'), key: 'Mobilanpassad design' },
        { text: t('Kontaktformulär', 'Contact form'), key: 'Kontaktformulär' },
        { text: t('Google Maps (om relevant)', 'Google Maps (if relevant)'), key: 'Google Maps' },
        { text: t('Grundläggande SEO', 'Basic SEO'), key: 'Grundläggande SEO' },
        { text: t('1 revisionsrunda', '1 revision round'), key: '1 revisionsrunda' },
        { text: t('Lansering + genomgång', 'Launch + walkthrough'), key: 'Lansering' }
      ] 
    },
    { 
      name: 'Standard', 
      price: '7 900 kr',
      delivery: t('10 dagar', '10 days'),
      description: t('Bästa värdet för de flesta företag.', 'Best value for most businesses.'),
      pages: t('Upp till 5 sidor', 'Up to 5 pages'), 
      popular: true, 
      features: [
        { text: t('Allt i Starter', 'Everything in Starter'), key: 'Allt i Starter' },
        { text: t('2 revisionsrundor', '2 revision rounds'), key: '2 revisionsrundor' },
        { text: t('Bildgalleri/sektioner', 'Image gallery/sections'), key: 'Bildgalleri/sektioner' },
        { text: t('Sociala länkar + klickbar telefon/mail', 'Social links + clickable phone/email'), key: 'Sociala' },
        { text: t('Flerspråkig', 'Multi-language'), key: 'Flerspråkig' }
      ] 
    },
    { 
      name: 'Pro', 
      price: '12 900 kr',
      delivery: t('7 dagar', '7 days'),
      description: t('För företag som vill ha bokning + mer tillväxt.', 'For businesses wanting booking + more growth.'),
      pages: t('Upp till 8 sidor', 'Up to 8 pages'), 
      features: [
        { text: t('Allt i Standard', 'Everything in Standard'), key: 'Allt i Standard' },
        { text: t('3 revisionsrundor', '3 revision rounds'), key: '3 revisionsrundor' },
        { text: t('Bokningssystem', 'Booking system'), key: 'Bokningssystem' },
        { text: t('Google Analytics / tracking', 'Google Analytics / tracking'), key: 'Google Analytics' },
        { text: t('Nyhetsbrev setup', 'Newsletter setup'), key: 'Nyhetsbrev setup' },
        { text: t('Flerspråkig', 'Multi-language'), key: 'Flerspråkig' }
      ] 
    },
  ];

  const carePlans = [
    { 
      name: 'Basic',
      monthlyPrice: 249,
      yearlyPrice: 199,
      description: t('Du behöver inte tänka på teknik.', 'You don\'t need to think about tech.'),
      features: [
        t('Hosting (snabb + SSL)', 'Hosting (fast + SSL)'), 
        t('Säkerhetsuppdateringar', 'Security updates'), 
        t('Dagliga/veckovisa backups', 'Daily/weekly backups'), 
        t('Uptime monitoring + alert', 'Uptime monitoring + alerts'),
        t('Prestanda/säkerhetscheck 1x/mån', 'Performance/security check 1x/month')
      ] 
    },
    { 
      name: 'Standard', 
      monthlyPrice: 449,
      yearlyPrice: 359,
      description: t('Allt i Basic + sidan kan alltid ändras utan krångel.', 'Everything in Basic + the site can always be changed without hassle.'),
      popular: true, 
      features: [
        t('Allt i Basic', 'Everything in Basic'), 
        t('Domän inkluderad', 'Domain included'), 
        t('Företagsmail (1–3 adresser)', 'Business email (1-3 addresses)'), 
        t('1 timme ändringar/mån', '1 hour edits/month'),
        t('Support inom 24–48h', 'Support within 24-48h')
      ] 
    },
    { 
      name: 'Pro',
      monthlyPrice: 749,
      yearlyPrice: 599,
      description: t('För företag som växer och vill ha mer fart + prioritet.', 'For growing businesses wanting more speed + priority.'),
      features: [
        t('Allt i Standard', 'Everything in Standard'), 
        t('3 timmar ändringar/mån', '3 hours edits/month'), 
        t('Prioriterad support', 'Priority support'), 
        t('Prestandaoptimering 1x/mån', 'Performance optimization 1x/month'),
        t('Basic SEO-check 1x/mån', 'Basic SEO check 1x/month')
      ] 
    },
  ];

  const getCarePlanPrice = (plan: typeof carePlans[0]) => {
    const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
    return `${price} kr/mån`;
  };

  return (
    <div className="section-padding py-20">
      <div className="container-wide">
        <AnimatedSection animation="fade-up" className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">{t('Våra paket', 'Our Packages')}</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">{t('Välj det paket som passar dig bäst.', 'Choose the package that suits you best.')}</p>
        </AnimatedSection>

        {/* Website Packages with prices */}
        <div className="mb-16">
          <AnimatedSection animation="fade-up">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-center">{t('Webbpaket', 'Website Packages')}</h2>
              <Button variant="outline" size="sm" onClick={() => setCompareOpen(true)}>
                {t('Jämför paket', 'Compare packages')}
              </Button>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-3 gap-2 sm:gap-6">
            {packages.map((pkg, index) => (
              <AnimatedSection key={index} animation="fade-up" delay={index * 100}>
                <div className={`relative p-3 sm:p-8 rounded-xl border-2 hover:shadow-xl transition-all duration-300 h-full flex flex-col ${pkg.popular ? 'border-accent bg-accent/5' : 'border-border bg-background hover:border-accent/50'}`}>
                  {pkg.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-[10px] sm:text-xs font-bold px-2 sm:px-4 py-1 rounded-full whitespace-nowrap">
                      {t('Populärast', 'Most Popular')}
                    </span>
                  )}
                  <h3 className="font-heading font-semibold text-base sm:text-2xl mb-1 sm:mb-2">{pkg.name}</h3>
                  <p className="text-lg sm:text-3xl font-bold text-accent mb-0.5 sm:mb-1">{pkg.price}</p>
                  <p className="text-[9px] sm:text-xs text-muted-foreground mb-1 sm:mb-2">{pkg.delivery}</p>
                  <p className="text-[9px] sm:text-xs text-muted-foreground mb-2 sm:mb-4 line-clamp-2">{pkg.description}</p>
                  <p className="text-[10px] sm:text-sm font-medium text-foreground mb-2 sm:mb-4">{pkg.pages}</p>
                  <ul className="space-y-1.5 sm:space-y-3 mb-4 sm:mb-8 flex-grow">
                    {pkg.features.map((feature, i) => {
                      const tooltip = getTooltip(feature.key, lang);
                      return (
                        <li key={i} className="flex items-start gap-1.5 sm:gap-3 text-[9px] sm:text-sm">
                          <Check className="w-3 h-3 sm:w-4 sm:h-4 text-accent flex-shrink-0 mt-0.5" />
                          <span className="leading-tight flex items-center gap-1">
                            {feature.text}
                            {tooltip && (
                              <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button type="button" className="inline-flex items-center justify-center w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-muted hover:bg-accent/20 transition-colors">
                                      <Info className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-muted-foreground" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="max-w-xs p-2">
                                    <p className="text-xs">{tooltip}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="space-y-2">
                    <Button asChild variant={pkg.popular ? 'default' : 'outline'} className="w-full text-[10px] sm:text-sm h-8 sm:h-10">
                      <Link to="/demo">{t('Få koncept', 'Get concept')}</Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full text-[10px] sm:text-sm h-8 sm:h-10">
                      <Link to="/bestall">{t('Beställ direkt', 'Order directly')}</Link>
                    </Button>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
          
          {/* Klarna banner */}
          <AnimatedSection animation="fade-up" delay={300}>
            <div className="mt-8 flex items-center justify-center gap-3 p-4 rounded-xl bg-secondary/50 border border-border/50">
              <svg className="w-14 h-6" viewBox="0 0 67 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.34 0H0v16h6.34V0zM13.7 0c0 2.75-1.1 5.39-3.06 7.33l4.64 8.67H8.13l-4.65-8.67C5.43 5.39 6.52 2.75 6.52 0h7.18zM14.35 0v16h6.34V0h-6.34zM40.32 3.8c-.86-.86-2.03-1.33-3.28-1.33a4.65 4.65 0 00-4.65 4.65c0 2.57 2.08 4.65 4.65 4.65 1.25 0 2.42-.48 3.28-1.33v1.08h5.55V2.72h-5.55v1.08zm-2.15 4.07c-.82 0-1.49-.67-1.49-1.49s.67-1.49 1.49-1.49 1.49.67 1.49 1.49-.67 1.49-1.49 1.49zM53.72 2.47c-1.3 0-2.43.47-3.24 1.33V2.72h-5.55v8.8h5.76V7.7c0-.82.67-1.49 1.49-1.49s1.49.67 1.49 1.49v3.82h5.76V6.38c0-2.16-1.75-3.91-3.91-3.91h-1.8zM67 11.52V2.72h-5.55v8.8H67zM67 0h-5.55v1.85H67V0zM28.74 11.52V0h-5.55v11.52h5.55zM24.34 12.35a2.78 2.78 0 002.78 2.78 2.78 2.78 0 002.78-2.78h-5.56z" fill="currentColor"/>
              </svg>
              <span className="text-sm text-muted-foreground">{t('Delbetala enkelt med Klarna – välj att betala senare eller dela upp i 3 delbetalningar', 'Easily pay in installments with Klarna – choose to pay later or split into 3 payments')}</span>
            </div>
          </AnimatedSection>
        </div>

        {/* Monthly Care Plans with prices */}
        <div>
          <AnimatedSection animation="fade-up">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-center">{t('Månatlig webbvård', 'Monthly Care Plans')}</h2>
              <Button variant="outline" size="sm" onClick={() => setCarePlansCompareOpen(true)}>
                {t('Jämför planer', 'Compare plans')}
              </Button>
            </div>
            <p className="text-center text-muted-foreground mb-2 max-w-xl mx-auto">
              {t('Håll din webbplats snabb, uppdaterad och redigerbar.', 'Keep your site fast, updated, and editable.')}
            </p>
            
            {/* Yearly Toggle */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className={`text-sm ${!isYearly ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                {t('Månadsvis', 'Monthly')}
              </span>
              <Switch 
                checked={isYearly} 
                onCheckedChange={setIsYearly}
                className="data-[state=checked]:bg-accent"
              />
              <span className={`text-sm ${isYearly ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                {t('Årsvis', 'Yearly')}
                <span className="ml-1 text-xs text-accent font-semibold">
                  {t('Spara 20%', 'Save 20%')}
                </span>
              </span>
            </div>
            
            <p className="text-center text-sm text-muted-foreground mb-10">
              {t('Avsluta när du vill.', 'Cancel anytime.')}
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-3 gap-2 sm:gap-6">
            {carePlans.map((plan, index) => (
              <AnimatedSection key={index} animation="fade-up" delay={index * 100}>
                <div className={`p-3 sm:p-8 rounded-xl border-2 hover:shadow-xl transition-all duration-300 h-full relative flex flex-col ${plan.popular ? 'border-accent bg-accent/5' : 'border-border bg-background hover:border-accent/50'}`}>
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-[10px] sm:text-xs font-bold px-2 sm:px-4 py-1 rounded-full whitespace-nowrap">
                      {t('Rekommenderas', 'Recommended')}
                    </span>
                  )}
                  <h3 className="font-heading font-semibold text-base sm:text-2xl mb-1 sm:mb-2">{plan.name}</h3>
                  <div className="mb-1 sm:mb-2">
                    <span className="text-lg sm:text-2xl font-bold text-accent">{getCarePlanPrice(plan)}</span>
                    {isYearly && (
                      <span className="ml-2 text-xs text-muted-foreground line-through">
                        {plan.monthlyPrice} kr/mån
                      </span>
                    )}
                  </div>
                  <p className="text-[9px] sm:text-xs text-muted-foreground mb-3 sm:mb-4 line-clamp-2">{plan.description}</p>
                  <ul className="space-y-1.5 sm:space-y-3 flex-grow">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-1.5 sm:gap-3 text-[9px] sm:text-sm">
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-accent flex-shrink-0 mt-0.5" />
                        <span className="leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>

        <AnimatedSection animation="scale-in" className="mt-16 text-center">
          <Button asChild size="lg" className="group">
            <Link to="/demo">
              {t('Få ditt koncept (72h)', 'Get your concept (72h)')}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </AnimatedSection>
      </div>

      <PackageCompareModal open={compareOpen} onOpenChange={setCompareOpen} />
      <CarePlansCompareModal open={carePlansCompareOpen} onOpenChange={setCarePlansCompareOpen} isYearly={isYearly} />
    </div>
  );
}