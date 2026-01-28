import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, Clock, Sparkles, Shield, Zap, Play, Star, ChevronDown, ShieldCheck, Lock, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import { trackEvent, getUtmParams } from '@/lib/posthog';
import { useRemainingSpots } from '@/hooks/useRemainingSpots';
import { MoneyBackGuarantee } from '@/components/MoneyBackGuarantee';
import { CountdownTimer } from '@/components/CountdownTimer';
import { getCountryVatRate } from '@/components/wizard/steps/Step1Contact';

// Animated gradient background
function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Multiple layered gradients for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />
      
      {/* Animated orbs */}
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-gradient-radial from-amber-500/30 via-amber-500/10 to-transparent blur-[100px] rounded-full"
      />
      <motion.div
        animate={{
          x: [0, -20, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-gradient-radial from-accent/25 via-accent/5 to-transparent blur-[120px] rounded-full"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] bg-gradient-radial from-amber-400/20 to-transparent blur-[80px] rounded-full"
      />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black_40%,transparent_100%)]" />
      
      {/* Grain texture */}
      <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIi8+PC9zdmc+')]" />
    </div>
  );
}

// Floating code snippet animation
function FloatingCodeSnippet() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotate: -3 }}
      animate={{ opacity: 1, y: 0, rotate: -3 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="hidden lg:block absolute right-[5%] top-[15%] w-72 p-4 bg-zinc-900/90 backdrop-blur-xl rounded-xl border border-zinc-700/50 shadow-2xl"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
      </div>
      <pre className="text-xs font-mono text-zinc-300">
        <code>
          <span className="text-pink-400">const</span> <span className="text-blue-400">website</span> = {`{`}{'\n'}
          {'  '}<span className="text-green-400">design</span>: <span className="text-amber-300">"premium"</span>,{'\n'}
          {'  '}<span className="text-green-400">speed</span>: <span className="text-amber-300">"blazing"</span>,{'\n'}
          {'  '}<span className="text-green-400">converts</span>: <span className="text-purple-400">true</span>{'\n'}
          {`}`};
        </code>
      </pre>
    </motion.div>
  );
}

// Results showcase section
function ResultsShowcase() {
  const { t } = useLanguage();
  
  const stats = [
    { value: '50+', label: t('Nöjda kunder', 'Happy clients') },
    { value: '7', label: t('Dagars leverans', 'Day delivery') },
    { value: '100%', label: t('Nöjdhetsgaranti', 'Satisfaction') },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
      className="flex flex-wrap justify-center gap-6 sm:gap-10 mt-8"
    >
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + i * 0.1 }}
          className="text-center"
        >
          <div className="text-3xl sm:text-4xl font-bold text-accent">{stat.value}</div>
          <div className="text-sm text-muted-foreground">{stat.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function CampaignLandingPage() {
  const { t, lang } = useLanguage();
  const [searchParams] = useSearchParams();
  const hasTracked = useRef(false);
  const { remainingSpots, isLoading: spotsLoading } = useRemainingSpots();
  const heroRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  
  // Track campaign landing with UTM params
  useEffect(() => {
    if (hasTracked.current) return;
    hasTracked.current = true;
    
    const utmParams = getUtmParams();
    trackEvent('campaign_landing_view', {
      campaign_page: 'campaign_landing',
      ...utmParams,
      ref: searchParams.get('ref') || undefined,
      ad_id: searchParams.get('ad_id') || undefined,
    });
  }, [searchParams]);
  
  // Price with VAT for Swedish users
  const country = lang === 'sv' ? 'SE' : 'US';
  const vatRate = getCountryVatRate(country);
  const basePrice = lang === 'sv' ? 2900 : 290;
  const vatAmount = Math.round(basePrice * (vatRate / 100));
  const totalWithVat = basePrice + vatAmount;
  
  const displayPrice = lang === 'sv' 
    ? `${basePrice.toLocaleString('sv-SE')} kr`
    : `$${basePrice}`;
  
  const displayTotalWithVat = lang === 'sv'
    ? `${totalWithVat.toLocaleString('sv-SE')} kr`
    : `$${basePrice}`;

  const handleCTAClick = (button: string) => {
    trackEvent('campaign_cta_click', {
      button,
      page: 'campaign_landing',
      ...getUtmParams()
    });
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <AnimatedBackground />
      
      {/* Minimal Header - Fixed for mobile */}
      <header className="fixed top-0 left-0 right-0 z-50 py-3 sm:py-4 px-4 sm:px-6 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="font-heading font-extrabold text-xl sm:text-2xl tracking-tighter hover:opacity-80 transition-opacity">
            Nomia<span className="text-accent">.</span>
          </Link>
          
          {/* Spots indicator - mobile optimized */}
          {!spotsLoading && remainingSpots > 0 && remainingSpots <= 3 && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span className="font-medium text-accent">{remainingSpots} {t('platser kvar', 'spots left')}</span>
            </div>
          )}
          
          <Button 
            asChild 
            size="sm" 
            className="bg-accent hover:bg-accent/90 text-accent-foreground text-xs sm:text-sm"
            onClick={() => handleCTAClick('header_cta')}
          >
            <Link to="/demo">
              {t('Gratis koncept', 'Free concept')}
            </Link>
          </Button>
        </div>
      </header>
      
      {/* Hero Section - Mobile First */}
      <main ref={heroRef} className="relative pt-20 sm:pt-24">
        <motion.div 
          style={{ opacity: heroOpacity, y: heroY }}
          className="min-h-[90vh] sm:min-h-screen flex flex-col justify-center relative"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <FloatingCodeSnippet />
            
            <div className="max-w-3xl mx-auto lg:mx-0">
              {/* Urgency Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap items-center gap-3 mb-6"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium border border-accent/20">
                  <Clock className="w-4 h-4" />
                  {t('Begränsat erbjudande', 'Limited offer')}
                </div>
                
                {!spotsLoading && remainingSpots > 0 && remainingSpots <= 5 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-500 text-sm font-bold border border-red-500/30"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    {remainingSpots} {t('platser kvar!', 'spots left!')}
                  </motion.div>
                )}
              </motion.div>
              
              {/* Main Headline - Mobile optimized typography */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6"
              >
                <span className="block">{t('Få fler', 'Get more')}</span>
                <span className="block bg-gradient-to-r from-accent via-amber-400 to-accent bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                  {t('bokningar & kunder', 'bookings & customers')}
                </span>
                <span className="block text-muted-foreground font-light">{t('automatiskt.', 'automatically.')}</span>
              </motion.h1>
              
              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl"
              >
                {t(
                  'Se din nya hemsida gratis inom 72 timmar. Ingen risk - gillar du det inte, kostar det ingenting.',
                  'See your new website free within 72 hours. No risk - if you don\'t like it, it costs nothing.'
                )}
              </motion.p>
              
              {/* Price Box with VAT */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8"
              >
                <div className="inline-block p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-accent/20 via-accent/10 to-transparent border border-accent/30 backdrop-blur-sm">
                  <div className="text-sm text-muted-foreground mb-1">{t('Komplett hemsida från', 'Complete website from')}</div>
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-4xl sm:text-5xl font-bold text-accent">{displayPrice}</span>
                    <span className="text-muted-foreground">{t('engångsavgift', 'one-time')}</span>
                  </div>
                  {vatRate > 0 && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{displayTotalWithVat}</span>
                      {' '}{t('inkl. moms', 'incl. VAT')} ({vatRate}%)
                    </div>
                  )}
                </div>
              </motion.div>
              
              {/* CTA Buttons - Mobile stacked, desktop inline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6"
              >
                <Button 
                  asChild 
                  size="lg" 
                  className="w-full sm:w-auto bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:via-amber-500 hover:to-yellow-600 text-background font-bold shadow-xl shadow-amber-500/30 text-base sm:text-lg h-14 sm:h-16 px-8"
                  onClick={() => handleCTAClick('hero_free_concept')}
                >
                  <Link to="/demo">
                    {t('Få gratis koncept', 'Get free concept')}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                
                <Button 
                  asChild 
                  size="lg" 
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-foreground/20 hover:bg-foreground/5 font-semibold text-base h-14 sm:h-16 px-8"
                  onClick={() => handleCTAClick('hero_order_directly')}
                >
                  <Link to="/bestall">
                    {t('Beställ direkt', 'Order directly')}
                  </Link>
                </Button>
              </motion.div>
              
              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <span>{t('Pengarna tillbaka-garanti', 'Money-back guarantee')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-accent" />
                  <span>{t('Säker betalning', 'Secure payment')}</span>
                </div>
              </motion.div>
              
              <ResultsShowcase />
            </div>
          </div>
          
          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2"
          >
            <span className="text-xs text-muted-foreground">{t('Scrolla för mer', 'Scroll for more')}</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Features Section */}
        <section className="py-16 sm:py-24 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                {t('Varför företag väljer Nomia', 'Why businesses choose Nomia')}
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                {t('Vi bygger hemsidor som faktiskt ger resultat', 'We build websites that actually deliver results')}
              </p>
            </motion.div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Zap,
                  title: t('Klar inom 7 dagar', 'Ready in 7 days'),
                  desc: t('Snabb leverans utan att kompromissa med kvalitet', 'Fast delivery without compromising quality')
                },
                {
                  icon: Shield,
                  title: t('Gratis koncept först', 'Free concept first'),
                  desc: t('Se och godkänn din design innan du betalar', 'See and approve your design before paying')
                },
                {
                  icon: CheckCircle2,
                  title: t('100% Nöjd-garanti', '100% Satisfaction'),
                  desc: t('Gillar du inte konceptet? Pengarna tillbaka.', "Don't like the concept? Money back.")
                },
                {
                  icon: Star,
                  title: t('Premium design', 'Premium design'),
                  desc: t('Modern, konverteringsoptimerad design', 'Modern, conversion-optimized design')
                },
                {
                  icon: CreditCard,
                  title: t('Fast pris, inga överraskningar', 'Fixed price, no surprises'),
                  desc: t('Du vet exakt vad det kostar från start', 'You know exactly what it costs from the start')
                },
                {
                  icon: Sparkles,
                  title: t('SEO optimerad', 'SEO optimized'),
                  desc: t('Syns bättre på Google från dag ett', 'Rank better on Google from day one')
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-secondary/50 border border-border/50 hover:border-accent/30 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Final CTA Section */}
        <section className="py-16 sm:py-24 relative">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                {t('Redo att ta nästa steg?', 'Ready to take the next step?')}
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                {t(
                  'Få ett gratis designkoncept inom 72 timmar. Gillar du det inte? Det kostar ingenting.',
                  "Get a free design concept within 72 hours. Don't like it? It costs nothing."
                )}
              </p>
              
              <CountdownTimer variant="full" className="mb-8 max-w-sm mx-auto" />
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:via-amber-500 hover:to-yellow-600 text-background font-bold shadow-xl shadow-amber-500/30 h-14 px-10 text-lg"
                  onClick={() => handleCTAClick('final_cta')}
                >
                  <Link to="/demo">
                    {t('Starta nu - gratis', 'Start now - free')}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>
              
              <MoneyBackGuarantee variant="compact" className="justify-center" />
            </motion.div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="font-heading font-bold text-foreground">
            Nomia<span className="text-accent">.</span>
          </div>
          <div className="flex gap-6">
            <Link to="/villkor" className="hover:text-foreground transition-colors">
              {t('Villkor', 'Terms')}
            </Link>
            <Link to="/integritet" className="hover:text-foreground transition-colors">
              {t('Integritet', 'Privacy')}
            </Link>
            <Link to="/kontakt" className="hover:text-foreground transition-colors">
              {t('Kontakt', 'Contact')}
            </Link>
          </div>
          <div>© 2025 Nomia</div>
        </div>
      </footer>
    </div>
  );
}
