import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Info, Sparkles, Zap, Crown, Star, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { PackageCompareModal } from '@/components/PackageCompareModal';
import { CarePlansCompareModal } from '@/components/CarePlansCompareModal';
import { Switch } from '@/components/ui/switch';
import { getTooltip } from '@/components/PricingTooltips';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { getCurrencyFromLang, formatPrice, getPackagePrice, getCarePlanPrice } from '@/config/currency';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ScrollTriggeredCounter } from '@/components/ScrollTriggeredCounter';
import { ParallaxSection, FloatingShapes, TiltCard } from '@/components/ParallaxSection';
import { GrainOverlay, FloatingParticles } from '@/components/PremiumEffects';

// Animated pricing card with 3D effects
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
  const icons = [Zap, Crown, Star];
  const Icon = icons[index];

  return (
    <TiltCard>
      <motion.div 
        initial={{ opacity: 0, y: 40, rotateX: -10 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.15 }}
        className="h-full"
      >
        <div className={`relative p-6 sm:p-8 rounded-2xl border-2 h-full flex flex-col transition-all duration-500 overflow-hidden border-accent/50 bg-gradient-to-br from-accent/15 via-accent/5 to-transparent shadow-xl shadow-accent/10 hover:border-accent hover:shadow-2xl hover:shadow-accent/20 group`}>
          {/* Animated glow effect */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--accent)/0.2),transparent_60%)] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Floating particles on hover */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-accent rounded-full opacity-0 group-hover:opacity-60"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${10 + i * 20}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              />
            ))}
          </div>

          {/* Icon with glow */}
          <div className="relative w-14 h-14 rounded-xl flex items-center justify-center mb-5 bg-accent/20 group-hover:bg-accent/30 transition-colors">
            <div className="absolute inset-0 bg-accent/30 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <Icon className="w-7 h-7 text-accent relative z-10" />
          </div>

          <h3 className="font-heading font-light text-2xl mb-2">{pkg.name}</h3>
          
          {/* Animated price */}
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-4xl sm:text-5xl font-bold text-accent">{pkg.price}</span>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{pkg.delivery}</p>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{pkg.description}</p>
          <p className="text-sm font-medium text-foreground mb-5 flex items-center gap-2">
            <span className="w-2 h-2 bg-accent rounded-full" />
            {pkg.pages}
          </p>
          
          <ul className="space-y-3 mb-8 flex-grow">
            {pkg.features.map((feature: any, i: number) => {
              const tooltip = getTooltip(feature.key, lang);
              return (
                <motion.li 
                  key={i} 
                  className="flex items-start gap-3 text-sm"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                >
                  <Check className="w-4 h-4 flex-shrink-0 mt-0.5 text-accent" />
                  <span className="leading-tight flex items-center gap-1 flex-wrap">
                    {feature.text}
                    {tooltip && (
                      <Popover modal>
                        <PopoverTrigger asChild>
                          <button 
                            type="button" 
                            className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-muted hover:bg-accent/20 transition-colors relative z-50"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Info className="w-3 h-3 text-muted-foreground" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent side="top" className="max-w-xs p-3 z-[100]">
                          <p className="text-sm">{tooltip}</p>
                        </PopoverContent>
                      </Popover>
                    )}
                  </span>
                </motion.li>
              );
            })}
          </ul>
          
          <div className="space-y-2 mt-auto relative z-10">
            <Button asChild variant="default" className="w-full rounded-xl group/btn bg-accent hover:bg-accent/90">
              <Link to="/demo">
                {t('Få koncept', 'Get concept')}
                <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full text-sm hover:bg-accent/10">
              <Link to="/bestall">{t('Beställ direkt', 'Order directly')}</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </TiltCard>
  );
};

export default function PricingPage() {
  const { t, lang } = useLanguage();
  const [compareOpen, setCompareOpen] = useState(false);
  const [carePlansCompareOpen, setCarePlansCompareOpen] = useState(false);
  const [isYearly, setIsYearly] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const currency = getCurrencyFromLang(lang);

  const packages = [
    { 
      id: 'starter',
      name: 'Starter', 
      price: formatPrice(getPackagePrice('starter', currency), currency),
      delivery: t('7 dagar', '7 days'),
      description: t('Perfekt för dig som behöver en tydlig och professionell närvaro online.', 'Perfect for those who need a clear and professional online presence.'),
      pages: t('Upp till 3 sidor', 'Up to 3 pages'), 
      features: [
        { text: t('Mobilanpassad design', 'Mobile-responsive design'), key: 'Mobilanpassad design' },
        { text: t('Kontaktformulär', 'Contact form'), key: 'Kontaktformulär' },
        { text: t('Google Maps (om relevant)', 'Google Maps (if relevant)'), key: 'Google Maps' },
        { text: t('Grundläggande SEO', 'Basic SEO'), key: 'Grundläggande SEO' },
        { text: t('10 revisionsrundor', '10 revision rounds'), key: '10 revisionsrunda' },
        { text: t('Lansering + genomgång', 'Launch + walkthrough'), key: 'Lansering' }
      ]
    },
    { 
      id: 'standard',
      name: 'Standard', 
      price: formatPrice(getPackagePrice('standard', currency), currency),
      delivery: t('7 dagar', '7 days'),
      description: t('Bästa värdet för de flesta företag.', 'Best value for most businesses.'),
      pages: t('Upp till 5 sidor', 'Up to 5 pages'), 
      popular: true, 
      features: [
        { text: t('Allt i Starter', 'Everything in Starter'), key: 'Allt i Starter' },
        { text: t('20 revisionsrundor', '20 revision rounds'), key: '20 revisionsrundor' },
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
      pages: t('Obegränsade sidor', 'Unlimited pages'), 
      features: [
        { text: t('Allt i Standard', 'Everything in Standard'), key: 'Allt i Standard' },
        { text: t('Obegränsade revisioner', 'Unlimited revisions'), key: 'Obegränsade revisioner' },
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
      <GrainOverlay />
      <FloatingParticles count={12} />
      {/* Advanced background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-accent/8 rounded-full blur-[200px]"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent/6 rounded-full blur-[150px]"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.6, 0.4, 0.6],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_70%)]" />
      </div>

      {/* Hero with parallax */}
      <div ref={heroRef} className="relative">
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="section-padding pt-28 pb-20 relative z-10"
        >
          <div className="container-wide">
            <div className="text-center mb-20">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent/10 border border-accent/20 mb-8"
              >
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">
                  {t('Transparent prissättning', 'Transparent pricing')}
                </span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-7xl font-extralight mb-6 tracking-tight"
              >
                {t('Välj ditt ', 'Choose your ')}
                <span className="bg-gradient-to-r from-accent via-amber-400 to-accent bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                  {t('paket', 'package')}
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto"
              >
                {t('Inga dolda avgifter. Fast pris. Resultat garanterat.', 'No hidden fees. Fixed price. Results guaranteed.')}
              </motion.p>

              {/* Stats row with animated counters */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap justify-center gap-8 mt-10"
              >
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-accent">
                    <ScrollTriggeredCounter end={50} suffix="+" duration={2000} />
                  </div>
                  <div className="text-sm text-muted-foreground">{t('Nöjda kunder', 'Happy clients')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-accent">
                    <ScrollTriggeredCounter end={100} suffix="%" duration={2000} />
                  </div>
                  <div className="text-sm text-muted-foreground">{t('Nöjdhetsgaranti', 'Satisfaction')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-accent">
                    <ScrollTriggeredCounter end={7} duration={1500} />
                  </div>
                  <div className="text-sm text-muted-foreground">{t('Dagars leverans', 'Day delivery')}</div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Website Packages */}
      <ParallaxSection speed={0.2} accentGlow>
        <section className="pb-32 relative z-10">
          <FloatingShapes />
          <div className="container-wide section-padding">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <h2 className="text-2xl sm:text-3xl font-light tracking-tight">{t('Webbpaket', 'Website Packages')}</h2>
              <Button variant="outline" size="sm" onClick={() => setCompareOpen(true)} className="rounded-full group">
                {t('Jämför paket', 'Compare packages')}
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
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
              className="mt-12"
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-secondary/80 via-secondary to-secondary/80 border border-border/50 backdrop-blur-sm">
                <span className="font-bold text-2xl tracking-tight bg-gradient-to-r from-pink-500 to-pink-400 bg-clip-text text-transparent">Klarna</span>
                <span className="text-sm text-muted-foreground text-center sm:text-left">
                  {t('Delbetala enkelt – välj att betala senare eller dela upp i 3 delbetalningar', 'Easily pay in installments – choose to pay later or split into 3 payments')}
                </span>
              </div>
            </motion.div>
          </div>
        </section>
      </ParallaxSection>

      {/* Care Plans */}
      <ParallaxSection speed={0.15}>
        <section className="pb-32 relative z-10">
          <div className="container-wide section-padding">
            <div className="text-center mb-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
              >
                <h2 className="text-2xl sm:text-3xl font-bold">{t('Månatlig webbvård', 'Monthly Care Plans')}</h2>
                <Button variant="outline" size="sm" onClick={() => setCarePlansCompareOpen(true)} className="rounded-full group">
                  {t('Jämför planer', 'Compare plans')}
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                {t('Håll din webbplats snabb, uppdaterad och redigerbar.', 'Keep your site fast, updated, and editable.')}
              </p>
              
              {/* Yearly Toggle with glow */}
              <div className="flex items-center justify-center gap-4 p-4 rounded-full bg-secondary/50 border border-border/50 inline-flex">
                <span className={`text-sm transition-colors ${!isYearly ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {t('Månadsvis', 'Monthly')}
                </span>
                <Switch 
                  checked={isYearly} 
                  onCheckedChange={setIsYearly}
                  className="data-[state=checked]:bg-accent"
                />
                <span className={`text-sm transition-colors ${isYearly ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {t('Årsvis', 'Yearly')}
                  <span className="ml-2 text-xs bg-accent/20 text-accent font-semibold px-2 py-0.5 rounded-full">
                    {t('Spara 20%', 'Save 20%')}
                  </span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                {t('Avsluta när du vill.', 'Cancel anytime.')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {carePlansData.map((plan, index) => (
                <TiltCard key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`p-6 sm:p-8 rounded-2xl border-2 h-full relative flex flex-col transition-all duration-500 border-accent/40 bg-gradient-to-br from-accent/10 to-transparent shadow-lg hover:border-accent/70 hover:shadow-xl hover:shadow-accent/10 group`}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--accent)/0.1),transparent_60%)] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
                    
                    <h3 className="font-heading font-bold text-2xl mb-3">{plan.name}</h3>
                    <div className="mb-3">
                      <span className="text-3xl sm:text-4xl font-bold text-accent">{getCarePlanPriceFormatted(plan.id)}</span>
                      {isYearly && (
                        <span className="ml-2 text-sm text-muted-foreground line-through">
                          {getCarePlanOldPrice(plan.id)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{plan.description}</p>
                    {'note' in plan && plan.note && (
                      <p className="text-xs text-muted-foreground/70 italic mb-5">{plan.note}</p>
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
                </TiltCard>
              ))}
            </div>
          </div>
        </section>
      </ParallaxSection>

      {/* Final CTA with dramatic styling */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
        <FloatingShapes />
        
        <div className="container-wide section-padding text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <Sparkles className="w-10 h-10 text-accent mx-auto mb-6" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              {t('Har du fler frågor?', 'Have more questions?')}
            </h2>
            <p className="text-muted-foreground mb-8">
              {t('Kontakta oss så svarar vi inom 24 timmar.', 'Contact us and we\'ll reply within 24 hours.')}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                <Link to="/kontakt">
                  {t('Kontakta oss', 'Contact us')}
                </Link>
              </Button>
              <Button asChild size="lg" className="rounded-full px-8 group bg-accent hover:bg-accent/90">
                <Link to="/demo">
                  {t('Få ditt gratis koncept', 'Get your free concept')}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <PackageCompareModal open={compareOpen} onOpenChange={setCompareOpen} />
      <CarePlansCompareModal open={carePlansCompareOpen} onOpenChange={setCarePlansCompareOpen} isYearly={isYearly} />
    </div>
  );
}