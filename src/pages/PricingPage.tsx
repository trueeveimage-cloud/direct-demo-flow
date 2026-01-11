import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Info, Sparkles, Zap, Crown, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { PackageCompareModal } from '@/components/PackageCompareModal';
import { CarePlansCompareModal } from '@/components/CarePlansCompareModal';
import { Switch } from '@/components/ui/switch';
import { getTooltip } from '@/components/PricingTooltips';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion, useInView } from 'framer-motion';
import { getCurrencyFromLang, formatPrice, getPackagePrice, getCarePlanPrice } from '@/config/currency';

// Floating card component
const PricingCard = ({ 
  pkg, 
  index, 
  t, 
  lang 
}: { 
  pkg: any; 
  index: number; 
  t: (sv: string, en: string) => string;
  lang: 'en' | 'sv';
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const icons = [Zap, Crown, Star];
  const Icon = icons[index];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="h-full"
    >
      <div className={`relative p-6 sm:p-8 rounded-2xl border-2 h-full flex flex-col transition-all duration-300 overflow-hidden border-accent bg-gradient-to-br from-accent/10 via-accent/5 to-transparent shadow-xl shadow-accent/10`}>
        {/* Glow effect for all cards */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--accent)/0.15),transparent_60%)] pointer-events-none" />

        {/* Popular badge - removed for equal treatment */}

        {/* Icon */}
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-accent/20"
        >
          <Icon className="w-6 h-6 text-accent" />
        </motion.div>

        <h3 className="font-heading font-bold text-2xl mb-2">{pkg.name}</h3>
        
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-4xl font-bold text-accent">{pkg.price}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-2">{pkg.delivery}</p>
        <p className="text-sm text-muted-foreground mb-4">{pkg.description}</p>
        <p className="text-sm font-medium text-foreground mb-4">{pkg.pages}</p>
        
        <ul className="space-y-3 mb-8 flex-grow">
          {pkg.features.map((feature: any, i: number) => {
            const tooltip = getTooltip(feature.key, lang);
            return (
              <motion.li 
                key={i} 
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
                className="flex items-start gap-3 text-sm"
              >
                <Check className="w-4 h-4 flex-shrink-0 mt-0.5 text-accent" />
                <span className="leading-tight flex items-center gap-1 flex-wrap">
                  {feature.text}
                  {tooltip && (
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button type="button" className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-muted hover:bg-accent/20 transition-colors">
                            <Info className="w-3 h-3 text-muted-foreground" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs p-2">
                          <p className="text-xs">{tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </span>
              </motion.li>
            );
          })}
        </ul>
        
        <div className="space-y-2 mt-auto">
          <Button asChild variant="default" className="w-full rounded-xl group">
            <Link to="/demo">
              {t('Få koncept', 'Get concept')}
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full text-sm">
            <Link to="/bestall">{t('Beställ direkt', 'Order directly')}</Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default function PricingPage() {
  const { t, lang } = useLanguage();
  const [compareOpen, setCompareOpen] = useState(false);
  const [carePlansCompareOpen, setCarePlansCompareOpen] = useState(false);
  const [isYearly, setIsYearly] = useState(false);
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const currency = getCurrencyFromLang(lang);

  const packages = [
    { 
      id: 'starter',
      name: 'Starter', 
      price: formatPrice(getPackagePrice('starter', currency), currency),
      delivery: t('14 dagar', '14 days'),
      description: t('Perfekt för dig som behöver en tydlig och professionell närvaro online.', 'Perfect for those who need a clear and professional online presence.'),
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
      id: 'standard',
      name: 'Standard', 
      price: formatPrice(getPackagePrice('standard', currency), currency),
      delivery: t('10 dagar', '10 days'),
      description: t('Bästa värdet för de flesta företag.', 'Best value for most businesses.'),
      pages: t('Upp till 5 sidor', 'Up to 5 pages'), 
      popular: true, 
      features: [
        { text: t('Allt i Starter', 'Everything in Starter'), key: 'Allt i Starter' },
        { text: t('2 revisionsrundor', '2 revision rounds'), key: '2 revisionsrundor' },
        { text: t('Bildgalleri/sektioner', 'Image gallery/sections'), key: 'Bildgalleri/sektioner' },
        { text: t('Sociala länkar + klickbar telefon/mail', 'Social links + clickable phone/email'), key: 'Sociala' },
        { text: t('Google Analytics', 'Google Analytics'), key: 'Google Analytics' },
        { text: t('Nyhetsbrev setup', 'Newsletter setup'), key: 'Nyhetsbrev setup' },
        { text: t('Flerspråkig', 'Multi-language'), key: 'Flerspråkig' }
      ]
    },
    { 
      id: 'pro',
      name: 'Pro', 
      price: formatPrice(getPackagePrice('pro', currency), currency),
      delivery: t('7 dagar', '7 days'),
      description: t('För företag som vill ha bokning + mer tillväxt.', 'For businesses wanting booking + more growth.'),
      pages: t('Upp till 8 sidor', 'Up to 8 pages'), 
      features: [
        { text: t('Allt i Standard', 'Everything in Standard'), key: 'Allt i Standard' },
        { text: t('3 revisionsrundor', '3 revision rounds'), key: '3 revisionsrundor' },
        { text: t('Bokningssystem', 'Booking system'), key: 'Bokningssystem' },
        { text: t('Avancerad SEO', 'Advanced SEO'), key: 'Avancerad SEO' },
        { text: t('Prioriterad support', 'Priority support'), key: 'Prioriterad support' },
        { text: t('Custom integrationer', 'Custom integrations'), key: 'Custom integrationer' }
      ] 
    },
  ];

  const carePlansData = [
    { 
      id: 'basic',
      name: 'Basic',
      description: t('Du behöver inte tänka på teknik.', 'You don\'t need to think about tech.'),
      note: t('De flesta på Basic uppgraderar inom 60 dagar.', 'Most clients on Basic upgrade within 60 days.'),
      features: [
        t('Domän ingår', 'Domain included'),
        t('Hosting (snabb + SSL)', 'Hosting (fast + SSL)'), 
        t('Säkerhetsuppdateringar', 'Security updates'), 
        t('Dagliga/veckovisa backups', 'Daily/weekly backups'), 
        t('Prestanda/säkerhetscheck 1x/mån', 'Performance/security check 1x/month')
      ] 
    },
    { 
      id: 'standard',
      name: 'Standard', 
      description: t('Allt i Basic + sidan kan alltid ändras utan krångel.', 'Everything in Basic + the site can always be changed without hassle.'),
      popular: true, 
      features: [
        t('Allt i Basic', 'Everything in Basic'), 
        t('Företagsmail (1–3 adresser)', 'Business email (1-3 addresses)'), 
        t('1 timme ändringar/mån', '1 hour edits/month'),
        t('Hastighetsoptimering', 'Speed optimization'),
        t('Skadedjursrensning', 'Malware cleanup'),
        t('Support inom 24–48h', 'Support within 24-48h')
      ] 
    },
    { 
      id: 'pro',
      name: 'Pro',
      description: t('För företag som växer och vill ha mer fart + prioritet.', 'For growing businesses wanting more speed + priority.'),
      features: [
        t('Allt i Standard', 'Everything in Standard'), 
        t('3 timmar ändringar/mån', '3 hours edits/month'), 
        t('Uptime-övervakning', 'Uptime monitoring'),
        t('Rollback / återställ', 'Rollback / restore'),
        t('Prioriterad support', 'Priority support'), 
        t('Basic SEO-check 1x/mån', 'Basic SEO check 1x/month')
      ] 
    },
  ];

  const getCarePlanPriceFormatted = (planId: string) => {
    const price = getCarePlanPrice(planId, isYearly, currency);
    const suffix = lang === 'sv' ? '/mån' : '/mo';
    return formatPrice(price, currency) + suffix;
  };

  const getCarePlanOldPrice = (planId: string) => {
    const price = getCarePlanPrice(planId, false, currency);
    const suffix = lang === 'sv' ? '/mån' : '/mo';
    return formatPrice(price, currency) + suffix;
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px]" />
      </div>

      <div className="section-padding py-20 relative z-10">
        <div className="container-wide">
          {/* Hero */}
          <motion.div 
            ref={heroRef}
            initial={{ opacity: 0, y: 40 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={heroInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">
                {t('Transparent prissättning', 'Transparent pricing')}
              </span>
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              {t('Välj ditt ', 'Choose your ')}
              <span className="bg-gradient-to-r from-accent via-orange-400 to-accent bg-clip-text text-transparent">
                {t('paket', 'package')}
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              {t('Inga dolda avgifter. Fast pris. Resultat garanterat.', 'No hidden fees. Fixed price. Results guaranteed.')}
            </p>
          </motion.div>

          {/* Website Packages */}
          <div className="mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <h2 className="text-2xl sm:text-3xl font-bold">{t('Webbpaket', 'Website Packages')}</h2>
              <Button variant="outline" size="sm" onClick={() => setCompareOpen(true)} className="rounded-full">
                {t('Jämför paket', 'Compare packages')}
              </Button>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {packages.map((pkg, index) => (
                <PricingCard key={index} pkg={pkg} index={index} t={t} lang={lang} />
              ))}
            </div>
            
            {/* Klarna banner */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-10"
            >
              <div className="flex items-center justify-center gap-4 p-5 rounded-xl bg-secondary/50 border border-border/50 backdrop-blur-sm">
                <span className="font-bold text-xl tracking-tight">Klarna</span>
                <span className="text-sm text-muted-foreground">
                  {t('Delbetala enkelt – välj att betala senare eller dela upp i 3 delbetalningar', 'Easily pay in installments – choose to pay later or split into 3 payments')}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Care Plans */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
                <h2 className="text-2xl sm:text-3xl font-bold">{t('Månatlig webbvård', 'Monthly Care Plans')}</h2>
                <Button variant="outline" size="sm" onClick={() => setCarePlansCompareOpen(true)} className="rounded-full">
                  {t('Jämför planer', 'Compare plans')}
                </Button>
              </div>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                {t('Håll din webbplats snabb, uppdaterad och redigerbar.', 'Keep your site fast, updated, and editable.')}
              </p>
              
              {/* Yearly Toggle */}
              <div className="flex items-center justify-center gap-4">
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
                  <span className="ml-2 text-xs bg-accent/20 text-accent font-semibold px-2 py-0.5 rounded-full">
                    {t('Spara 20%', 'Save 20%')}
                  </span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {t('Avsluta när du vill.', 'Cancel anytime.')}
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {carePlansData.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className={`p-6 sm:p-8 rounded-2xl border-2 h-full relative flex flex-col transition-all duration-300 border-accent bg-gradient-to-br from-accent/10 to-transparent shadow-xl shadow-accent/10`}
                >
{/* Popular badge removed for equal treatment */}
                  <h3 className="font-heading font-bold text-2xl mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-accent">{getCarePlanPriceFormatted(plan.id)}</span>
                    {isYearly && (
                      <span className="ml-2 text-sm text-muted-foreground line-through">
                        {getCarePlanOldPrice(plan.id)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{plan.description}</p>
                  {'note' in plan && plan.note && (
                    <p className="text-xs text-muted-foreground/70 italic mb-4">{plan.note}</p>
                  )}
                  <ul className="space-y-3 flex-grow">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <Check className="w-4 h-4 flex-shrink-0 mt-0.5 text-accent" />
                        <span className="leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 text-center"
          >
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl" />
              <Button asChild variant="outline" size="lg" className="relative rounded-full text-lg px-10 group">
                <Link to="/demo">
                  {t('Få ditt koncept (72h)', 'Get your concept (72h)')}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <PackageCompareModal open={compareOpen} onOpenChange={setCompareOpen} />
      <CarePlansCompareModal open={carePlansCompareOpen} onOpenChange={setCarePlansCompareOpen} isYearly={isYearly} />
    </div>
  );
}