import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Info, Sparkles, Zap, Crown, Star, ChevronRight, ShieldCheck, RefreshCw } from 'lucide-react';
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
import { GrainOverlay } from '@/components/PremiumEffects';

// Helper for per-month suffix
function perMonthSuffix(lang: string): string {
  switch (lang) {
    case 'en': return '/mo';
    case 'no': return '/mnd';
    case 'dk': return '/md';
    default: return '/mån';
  }
}

// Animated pricing card with 3D effects
const PricingCard = ({ 
  pkg, 
  index, 
  t, 
  lang 
}: { 
  pkg: any; 
  index: number; 
  t: (sv: string, en: string, overrides?: { no?: string; dk?: string }) => string;
  lang: string;
}) => {
  const icons = [Zap, Crown, Star];
  const Icon = icons[index];
  const isPopular = pkg.popular;
  const isStarter = pkg.id === 'starter';
  const isPro = pkg.id === 'pro';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className={`h-full ${isPopular ? 'md:-mt-4 md:mb-4' : ''} ${isStarter ? 'md:mt-4' : ''}`}
    >
      <div className={`relative rounded-2xl h-full flex flex-col overflow-hidden group transition-all duration-300 ${
        isPopular 
          ? 'p-6 sm:p-8 border-2 border-accent bg-gradient-to-br from-accent/20 via-accent/10 to-accent/5 shadow-2xl shadow-accent/20 ring-1 ring-accent/30' 
          : isStarter
            ? 'p-5 sm:p-6 border border-border/60 bg-secondary/30 shadow-md hover:border-accent/30 hover:shadow-lg'
            : 'p-6 sm:p-8 border-2 border-accent/40 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent shadow-xl shadow-accent/10 hover:border-accent/60 hover:shadow-2xl hover:shadow-accent/15'
      }`}>
        {isPopular && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--accent)/0.25),transparent_60%)] pointer-events-none opacity-70 group-hover:opacity-100 transition-opacity duration-500 z-0" />
        )}
        {isPro && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--accent)/0.12),transparent_60%)] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500 z-0" />
        )}
        
        {/* Popular badge */}
        {isPopular && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="px-5 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-bold tracking-[0.15em] uppercase shadow-lg shadow-accent/30">
              {t('Mest populär', 'Most popular', { no: 'Mest populær', dk: 'Mest populær' })}
            </div>
          </div>
        )}

        {/* Premium badge for Pro */}
        {isPro && (
          <div className="absolute top-5 right-5 z-20">
            <div className="px-3 py-1 rounded-full bg-accent/15 border border-accent/40 text-[10px] font-bold tracking-[0.2em] uppercase text-accent">
              Premium
            </div>
          </div>
        )}

        {/* 25% Discount badge - only on popular */}
        {isPopular && (
          <div className="absolute top-5 right-5 z-20">
            <div className="relative px-3.5 py-1.5 rounded-lg bg-gradient-to-br from-amber-500/25 via-yellow-400/15 to-amber-500/10 border border-amber-400/50 backdrop-blur-sm shadow-md shadow-amber-500/15">
              <span className="relative text-[11px] font-bold tracking-[0.2em] uppercase bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">save 25%</span>
            </div>
          </div>
        )}
        
        <div className={`relative rounded-xl flex items-center justify-center mb-5 z-10 ${
          isPopular ? 'w-14 h-14 bg-accent/25' : isStarter ? 'w-12 h-12 bg-muted' : 'w-14 h-14 bg-accent/20'
        } group-hover:bg-accent/30 transition-colors`}>
          {isPopular && <div className="absolute inset-0 bg-accent/30 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />}
          <Icon className={`relative z-10 ${isPopular ? 'w-7 h-7 text-accent' : isStarter ? 'w-6 h-6 text-muted-foreground' : 'w-7 h-7 text-accent'}`} />
        </div>

        <h3 className={`font-heading mb-2 relative z-10 ${isPopular ? 'font-medium text-2xl' : isStarter ? 'font-light text-xl' : 'font-light text-2xl'}`}>{pkg.name}</h3>
        
        <div className="flex items-baseline gap-2 mb-2 relative z-10">
          <span className={`font-bold ${isPopular ? 'text-4xl sm:text-5xl text-accent' : isStarter ? 'text-3xl sm:text-4xl text-foreground' : 'text-4xl sm:text-5xl text-accent'}`}>{pkg.price}</span>
          <span className={`line-through ${isStarter ? 'text-base text-muted-foreground/40' : 'text-lg text-muted-foreground/60'}`}>{pkg.oldPrice}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-2 relative z-10">{pkg.delivery}</p>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 relative z-10">{pkg.description}</p>
        <p className="text-sm font-medium text-foreground mb-5 flex items-center gap-2 relative z-10">
          <span className={`w-2 h-2 rounded-full ${isStarter ? 'bg-muted-foreground/50' : 'bg-accent'}`} />
          {pkg.pages}
        </p>
        
        <ul className="space-y-3 mb-8 flex-grow relative z-10">
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
                <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isStarter ? 'text-muted-foreground' : 'text-accent'}`} />
                <span className="leading-tight flex items-center gap-1 flex-wrap">
                  {feature.text}
                  {tooltip && (
                    <Popover modal>
                      <PopoverTrigger asChild>
                        <button 
                          type="button" 
                          className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-muted hover:bg-accent/20 transition-colors"
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
        
        <div className="space-y-2 mt-auto relative">
          {isPopular ? (
            <Button 
              className="w-full rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground h-12 text-base font-semibold shadow-lg shadow-accent/25"
              onClick={() => window.location.href = `/bestall?package=${pkg.id}`}
            >
              {t('Beställ nu', 'Order now', { no: 'Bestill nå', dk: 'Bestil nu' })}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button 
              className={`w-full rounded-xl ${isStarter ? 'bg-secondary hover:bg-secondary/80 text-foreground' : 'bg-accent/80 hover:bg-accent/70 text-accent-foreground'}`}
              onClick={() => window.location.href = `/demo?package=${pkg.id}`}
            >
              {t('Få koncept', 'Get concept', { no: 'Få konsept', dk: 'Få koncept' })}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          )}
          {isPopular && (
            <Button 
              variant="ghost" 
              className="w-full text-sm hover:bg-accent/10"
              onClick={() => window.location.href = `/demo?package=${pkg.id}`}
            >
              {t('Eller få gratis koncept först', 'Or get free concept first', { no: 'Eller få gratis konsept først', dk: 'Eller få gratis koncept først' })}
            </Button>
          )}
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

  const getOldPrice = (packageId: string) => {
    const current = getPackagePrice(packageId, currency);
    const original = Math.round(current / 0.75);
    const rounded = currency === 'USD' ? Math.round(original / 5) * 5 : Math.round(original / 100) * 100;
    return formatPrice(rounded, currency);
  };

  const packages = [
    { 
      id: 'starter',
      name: 'Starter', 
      price: formatPrice(getPackagePrice('starter', currency), currency),
      oldPrice: getOldPrice('starter'),
      delivery: t('7 dagar', '7 days', { no: '7 dager', dk: '7 dage' }),
      description: t('Perfekt för dig som vill ha en tydlig, professionell närvaro på nätet.', 'Perfect for those who need a clear and professional online presence.', { no: 'Perfekt for deg som ønsker en tydelig, profesjonell tilstedeværelse på nett.', dk: 'Perfekt til dig der ønsker en tydelig, professionel tilstedeværelse på nettet.' }),
      pages: t('Upp till 3 sidor', 'Up to 3 pages', { no: 'Opptil 3 sider', dk: 'Op til 3 sider' }), 
      features: [
        { text: t('Mobilanpassad design', 'Mobile-responsive design', { no: 'Mobiltilpasset design', dk: 'Mobiltilpasset design' }), key: 'Mobilanpassad design' },
        { text: t('Kontaktformulär', 'Contact form', { no: 'Kontaktskjema', dk: 'Kontaktformular' }), key: 'Kontaktformulär' },
        { text: t('Google Maps (vid behov)', 'Google Maps (if relevant)', { no: 'Google Maps (ved behov)', dk: 'Google Maps (ved behov)' }), key: 'Google Maps' },
        { text: t('Grundläggande SEO', 'Basic SEO', { no: 'Grunnleggende SEO', dk: 'Grundlæggende SEO' }), key: 'Grundläggande SEO' },
        { text: t('10 ändringsrundor', '10 revision rounds', { no: '10 endringsrunder', dk: '10 ændringsrunder' }), key: '10 revisionsrunda' },
        { text: t('Driftsättning + genomgång', 'Launch + walkthrough', { no: 'Lansering + gjennomgang', dk: 'Lancering + gennemgang' }), key: 'Lansering' }
      ]
    },
    { 
      id: 'standard',
      name: 'Standard', 
      price: formatPrice(getPackagePrice('standard', currency), currency),
      oldPrice: getOldPrice('standard'),
      delivery: t('7 dagar', '7 days', { no: '7 dager', dk: '7 dage' }),
      description: t('Bästa värdet för de flesta företag.', 'Best value for most businesses.', { no: 'Best verdi for de fleste bedrifter.', dk: 'Bedste værdi for de fleste virksomheder.' }),
      pages: t('Upp till 5 sidor', 'Up to 5 pages', { no: 'Opptil 5 sider', dk: 'Op til 5 sider' }), 
      popular: true, 
      features: [
        { text: t('Allt i Starter', 'Everything in Starter', { no: 'Alt i Starter', dk: 'Alt i Starter' }), key: 'Allt i Starter' },
        { text: t('20 ändringsrundor', '20 revision rounds', { no: '20 endringsrunder', dk: '20 ændringsrunder' }), key: '20 revisionsrundor' },
        { text: t('Bildgalleri och sektioner', 'Image gallery/sections', { no: 'Bildegalleri og seksjoner', dk: 'Billedgalleri og sektioner' }), key: 'Bildgalleri/sektioner' },
        { text: t('Sociala medier + klickbar telefon/e-post', 'Social links + clickable phone/email', { no: 'Sosiale medier + klikkbar telefon/e-post', dk: 'Sociale medier + klikbar telefon/e-mail' }), key: 'Sociala' },
        { text: t('Google Analytics', 'Google Analytics'), key: 'Google Analytics' },
        { text: t('Nyhetsbrev-integration', 'Newsletter setup', { no: 'Nyhetsbrev-integrasjon', dk: 'Nyhedsbrev-integration' }), key: 'Nyhetsbrev setup' },
        { text: t('Flerspråkig sida', 'Multi-language', { no: 'Flerspråklig side', dk: 'Flersproget side' }), key: 'Flerspråkig' }
      ]
    },
    { 
      id: 'pro',
      name: 'Pro', 
      price: formatPrice(getPackagePrice('pro', currency), currency),
      oldPrice: getOldPrice('pro'),
      delivery: t('7 dagar', '7 days', { no: '7 dager', dk: '7 dage' }),
      description: t('För företag som vill ha bokningssystem och mer.', 'For businesses wanting booking + more growth.', { no: 'For bedrifter som ønsker bookingsystem og mer.', dk: 'For virksomheder der ønsker bookingsystem og mere.' }),
      pages: t('Obegränsade sidor', 'Unlimited pages', { no: 'Ubegrensede sider', dk: 'Ubegrænsede sider' }), 
      features: [
        { text: t('Allt i Standard', 'Everything in Standard', { no: 'Alt i Standard', dk: 'Alt i Standard' }), key: 'Allt i Standard' },
        { text: t('Obegränsade ändringar', 'Unlimited revisions', { no: 'Ubegrensede endringer', dk: 'Ubegrænsede ændringer' }), key: 'Obegränsade revisioner' },
        { text: t('Bokningssystem', 'Booking system', { no: 'Bookingsystem', dk: 'Bookingsystem' }), key: 'Bokningssystem' },
        { text: t('Avancerad SEO', 'Advanced SEO', { no: 'Avansert SEO', dk: 'Avanceret SEO' }), key: 'Avancerad SEO' },
        { text: t('Prioriterad support', 'Priority support', { no: 'Prioritert support', dk: 'Prioriteret support' }), key: 'Prioriterad support' },
        { text: t('Skräddarsydda integrationer', 'Custom integrations', { no: 'Skreddersydde integrasjoner', dk: 'Skræddersyede integrationer' }), key: 'Custom integrationer' }
      ] 
    },
  ];

  const carePlansData = [
    { 
      id: 'basic',
      name: 'Basic',
      description: t('Slipp tänka på teknik — vi sköter det åt dig.', 'You don\'t need to think about tech.', { no: 'Slipp å tenke på teknikk — vi tar oss av det.', dk: 'Slip at tænke på teknik — vi klarer det for dig.' }),
      note: t('De flesta uppgraderar till Standard inom 60 dagar.', 'Most clients on Basic upgrade within 60 days.', { no: 'De fleste oppgraderer til Standard innen 60 dager.', dk: 'De fleste opgraderer til Standard inden 60 dage.' }),
      features: [
        t('Domän ingår', 'Domain included', { no: 'Domene inkludert', dk: 'Domæne inkluderet' }),
        t('Hosting (snabb + SSL)', 'Hosting (fast + SSL)', { no: 'Hosting (rask + SSL)', dk: 'Hosting (hurtig + SSL)' }), 
        t('Säkerhetsuppdateringar', 'Security updates', { no: 'Sikkerhetsoppdateringer', dk: 'Sikkerhedsopdateringer' }), 
        t('Dagliga/veckovisa säkerhetskopior', 'Daily/weekly backups', { no: 'Daglige/ukentlige sikkerhetskopier', dk: 'Daglige/ugentlige sikkerhedskopier' }), 
        t('Prestanda- och säkerhetsgenomgång 1×/mån', 'Performance/security check 1x/month', { no: 'Ytelses- og sikkerhetsgjennomgang 1×/mnd', dk: 'Ydelses- og sikkerhedsgennemgang 1×/md' })
      ] 
    },
    { 
      id: 'standard',
      name: 'Standard', 
      description: t('Allt i Basic — och sidan kan uppdateras när som helst utan krångel.', 'Everything in Basic + the site can always be changed without hassle.', { no: 'Alt i Basic — og siden kan oppdateres når som helst uten styr.', dk: 'Alt i Basic — og siden kan opdateres når som helst uden bøvl.' }),
      popular: true, 
      features: [
        t('Allt i Basic', 'Everything in Basic', { no: 'Alt i Basic', dk: 'Alt i Basic' }), 
        t('Företags-e-post (1–3 adresser)', 'Business email (1-3 addresses)', { no: 'Bedrifts-e-post (1–3 adresser)', dk: 'Virksomheds-e-mail (1–3 adresser)' }), 
        t('Hastighets- och prestandaoptimering', 'Speed optimization', { no: 'Hastighets- og ytelsesoptimalisering', dk: 'Hastigheds- og ydeevneoptimering' }),
        t('Skadlig kod-rensning', 'Malware cleanup', { no: 'Skadelig kode-rensing', dk: 'Skadelig kode-rensning' }),
        t('Support inom 24–48h', 'Support within 24-48h', { no: 'Support innen 24–48t', dk: 'Support inden 24–48t' })
      ] 
    },
    { 
      id: 'pro',
      name: 'Pro',
      description: t('För växande företag som vill ha snabbare svar och prioriterad hantering.', 'For growing businesses wanting more speed + priority.', { no: 'For voksende bedrifter som ønsker raskere svar og prioritert håndtering.', dk: 'For voksende virksomheder der ønsker hurtigere svar og prioriteret håndtering.' }),
      features: [
        t('Allt i Standard', 'Everything in Standard', { no: 'Alt i Standard', dk: 'Alt i Standard' }), 
        t('Driftsövervakning dygnet runt', 'Uptime monitoring', { no: 'Driftsovervåking døgnet rundt', dk: 'Driftsovervågning døgnet rundt' }),
        t('Återställning och säkerhetskopiering', 'Rollback / restore', { no: 'Gjenoppretting og sikkerhetskopiering', dk: 'Gendannelse og sikkerhedskopiering' }),
        t('Prioriterad support', 'Priority support', { no: 'Prioritert support', dk: 'Prioriteret support' }), 
        t('SEO-genomgång 1×/mån', 'Basic SEO check 1x/month', { no: 'SEO-gjennomgang 1×/mnd', dk: 'SEO-gennemgang 1×/md' })
      ] 
    },
  ];

  const suffix = perMonthSuffix(lang);

  const getCarePlanPriceFormatted = (planId: string) => {
    const price = getCarePlanPrice(planId, isYearly, currency);
    return formatPrice(price, currency) + suffix;
  };

  const getCarePlanOldPrice = (planId: string) => {
    const price = getCarePlanPrice(planId, false, currency);
    return formatPrice(price, currency) + suffix;
  };

  return (
    <div className="relative overflow-hidden">
      <GrainOverlay />

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
                className="flex flex-wrap items-center justify-center gap-3 mb-8"
              >
                <div className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-400/15 to-amber-500/20 border border-amber-400/40 shadow-lg shadow-amber-500/15 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-sm shadow-amber-400/50" />
                  <span className="text-sm font-bold tracking-[0.15em] uppercase bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                    {t('25% rabatt på alla paket', '25% off all packages', { no: '25% rabatt på alle pakker', dk: '25% rabat på alle pakker' })}
                  </span>
                </div>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-7xl font-extralight mb-6 tracking-tight"
              >
                {t('Välj ditt ', 'Choose your ', { no: 'Velg din ', dk: 'Vælg din ' })}
                <span className="text-accent">
                  {t('paket', 'package', { no: 'pakke', dk: 'pakke' })}
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto"
              >
                {t('Inga dolda avgifter. Fast pris. Resultat garanterat.', 'No hidden fees. Fixed price. Results guaranteed.', { no: 'Ingen skjulte avgifter. Fastpris. Resultat garantert.', dk: 'Ingen skjulte gebyrer. Fast pris. Resultat garanteret.' })}
              </motion.p>

              {/* Stats */}
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
                  <div className="text-sm text-muted-foreground">{t('Nöjda kunder', 'Happy clients', { no: 'Fornøyde kunder', dk: 'Tilfredse kunder' })}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-accent">
                    <ScrollTriggeredCounter end={100} suffix="%" duration={2000} />
                  </div>
                  <div className="text-sm text-muted-foreground">{t('Nöjdhetsgaranti', 'Satisfaction', { no: 'Tilfredshetsgaranti', dk: 'Tilfredshedsgaranti' })}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-accent">
                    <ScrollTriggeredCounter end={7} duration={1500} />
                  </div>
                  <div className="text-sm text-muted-foreground">{t('Dagars leverans', 'Day delivery', { no: 'Dagers levering', dk: 'Dages levering' })}</div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Website Packages */}
      <ParallaxSection speed={0.2} accentGlow>
        <section className="pb-32 relative z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background pointer-events-none z-0" />
          <FloatingShapes />
          <div className="container-wide section-padding relative z-10">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-foreground relative z-10">{t('Webbpaket', 'Website Packages', { no: 'Nettpakker', dk: 'Hjemmesidepakker' })}</h2>
              <Button variant="outline" size="sm" onClick={() => setCompareOpen(true)} className="rounded-full group relative z-10">
                {t('Jämför paket', 'Compare packages', { no: 'Sammenlign pakker', dk: 'Sammenlign pakker' })}
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
                  {t('Delbetala enkelt – välj att betala senare eller dela upp i 3 delbetalningar', 'Easily pay in installments – choose to pay later or split into 3 payments', { no: 'Delbetal enkelt – velg å betale senere eller del opp i 3 delbetalinger', dk: 'Delbetal nemt – vælg at betale senere eller del op i 3 delbetalinger' })}
                </span>
              </div>
            </motion.div>
          </div>
        </section>
      </ParallaxSection>

      {/* Care Plans */}
      <ParallaxSection speed={0.15}>
        <section className="pb-32 relative z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background pointer-events-none" />
          <div className="container-wide section-padding relative">
            <div className="text-center mb-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
              >
                <h2 className="text-2xl sm:text-3xl font-bold">{t('Månatlig webbvård', 'Monthly Care Plans', { no: 'Månedlig nettpleie', dk: 'Månedlig webpleje' })}</h2>
                <Button variant="outline" size="sm" onClick={() => setCarePlansCompareOpen(true)} className="rounded-full group">
                  {t('Jämför planer', 'Compare plans', { no: 'Sammenlign planer', dk: 'Sammenlign planer' })}
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                {t('Håll din webbplats snabb, uppdaterad och redigerbar.', 'Keep your site fast, updated, and editable.', { no: 'Hold nettsiden din rask, oppdatert og redigerbar.', dk: 'Hold din hjemmeside hurtig, opdateret og redigerbar.' })}
              </p>
              
              <div className="flex items-center justify-center gap-4 p-4 rounded-full bg-secondary/50 border border-border/50 inline-flex">
                <span className={`text-sm transition-colors ${!isYearly ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {t('Månadsvis', 'Monthly', { no: 'Månedlig', dk: 'Månedlig' })}
                </span>
                <Switch 
                  checked={isYearly} 
                  onCheckedChange={setIsYearly}
                  className="data-[state=checked]:bg-accent"
                />
                <span className={`text-sm transition-colors ${isYearly ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {t('Årsvis', 'Yearly', { no: 'Årlig', dk: 'Årligt' })}
                  <span className="ml-2 text-xs bg-accent/20 text-accent font-semibold px-2 py-0.5 rounded-full">
                    {t('Spara 20%', 'Save 20%', { no: 'Spar 20%', dk: 'Spar 20%' })}
                  </span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                {t('Avsluta när du vill.', 'Cancel anytime.', { no: 'Avslutt når du vil.', dk: 'Opsig når du vil.' })}
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

      {/* Money-Back Guarantee */}
      <section className="pb-16 relative z-10">
        <div className="container-wide section-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-green-500/15 via-green-500/10 to-green-500/5 border border-green-500/30"
          >
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <div className="p-4 bg-green-500/20 rounded-2xl flex-shrink-0">
                <ShieldCheck className="w-8 h-8 text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-medium mb-3">
                  {t('100% Nöjd-garanti', '100% Satisfaction Guarantee', { no: '100% Fornøyd-garanti', dk: '100% Tilfreds-garanti' })}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {t(
                    'Älskar du inte resultatet? Få full återbetalning inom 5 dagar. Vi tar all risk – du betalar bara för det du gillar.',
                    "Don't love the result? Get a full refund within 5 days. We take all the risk – you only pay for what you love.",
                    { no: 'Elsker du ikke resultatet? Få full refusjon innen 5 dager. Vi tar all risiko – du betaler bare for det du liker.', dk: 'Elsker du ikke resultatet? Få fuld refundering inden 5 dage. Vi tager al risiko – du betaler kun for det du kan lide.' }
                  )}
                </p>
                <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                  <RefreshCw className="w-4 h-4" />
                  <span>{t('5 dagars ångerrätt', '5-day refund period', { no: '5 dagers angrerett', dk: '5 dages fortrydelsesret' })}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background pointer-events-none" />
        
        <div className="container-wide section-padding text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <Sparkles className="w-10 h-10 text-accent mx-auto mb-6" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              {t('Har du fler frågor?', 'Have more questions?', { no: 'Har du flere spørsmål?', dk: 'Har du flere spørgsmål?' })}
            </h2>
            <p className="text-muted-foreground mb-8">
              {t('Kontakta oss så svarar vi inom 24 timmar.', 'Contact us and we\'ll reply within 24 hours.', { no: 'Kontakt oss så svarer vi innen 24 timer.', dk: 'Kontakt os så svarer vi inden 24 timer.' })}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                <Link to="/kontakt">
                  {t('Kontakta oss', 'Contact us', { no: 'Kontakt oss', dk: 'Kontakt os' })}
                </Link>
              </Button>
              <Button asChild size="lg" className="rounded-full px-8 group bg-accent hover:bg-accent/90">
                <Link to="/demo">
                  {t('Få ditt gratis koncept', 'Get your free concept', { no: 'Få ditt gratis konsept', dk: 'Få dit gratis koncept' })}
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
