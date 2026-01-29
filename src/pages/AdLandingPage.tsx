import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle2, Clock, Shield, Star, Sparkles, Code, Zap, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import { trackEvent, getUtmParams } from '@/lib/posthog';
import { useRemainingSpots } from '@/hooks/useRemainingSpots';
import { GrainOverlay } from '@/components/PremiumEffects';
import { MoneyBackGuarantee } from '@/components/MoneyBackGuarantee';

// Floating code snippets for visual effect
const FloatingCode = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 hidden sm:block">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 0.4, y: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="absolute top-[15%] left-[5%] font-mono text-[10px] text-accent/60"
    >
      <pre>{`const website = {
  design: "premium",
  delivery: "7 days",
  responsive: true
};`}</pre>
    </motion.div>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 0.3, y: 0 }}
      transition={{ duration: 1, delay: 0.8 }}
      className="absolute top-[35%] right-[3%] font-mono text-[10px] text-accent/50 text-right"
    >
      <pre>{`<Website 
  conversion={3x}
  loading="fast"
/>`}</pre>
    </motion.div>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 0.35, y: 0 }}
      transition={{ duration: 1, delay: 1.1 }}
      className="absolute bottom-[25%] left-[8%] font-mono text-[10px] text-accent/50"
    >
      <pre>{`function success() {
  return bookings * 3;
}`}</pre>
    </motion.div>
  </div>
);

// Animated grid background
const GridBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div 
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `linear-gradient(hsl(var(--accent) / 0.3) 1px, transparent 1px),
                          linear-gradient(90deg, hsl(var(--accent) / 0.3) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
  </div>
);

export default function AdLandingPage() {
  const { t, lang } = useLanguage();
  const [searchParams] = useSearchParams();
  const hasTracked = useRef(false);
  const { remainingSpots, isLoading: spotsLoading } = useRemainingSpots();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  
  // Track ad landing with UTM params
  useEffect(() => {
    if (hasTracked.current) return;
    hasTracked.current = true;
    
    const utmParams = getUtmParams();
    trackEvent('ad_landing_view', {
      campaign_page: 'ad_landing',
      ...utmParams,
      ref: searchParams.get('ref') || undefined,
      ad_id: searchParams.get('ad_id') || undefined,
    });
  }, [searchParams]);
  
  const price = lang === 'sv' ? '2 900 kr' : '$290';
  const priceWithVAT = lang === 'sv' ? '3 625 kr inkl. moms' : '$290 (no VAT for US)';

  const handleCTAClick = (button: string) => {
    trackEvent('ad_cta_click', { button, page: '/ad', ...getUtmParams() });
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-background overflow-hidden relative">
      <GrainOverlay />
      <GridBackground />
      <FloatingCode />
      
      {/* Animated background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-100px] left-[5%] w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-150px] right-[5%] w-[400px] h-[400px] bg-accent/15 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[80px]" 
        />
      </div>
      
      {/* Header - Mobile-first, clean */}
      <header className="relative z-50 py-4 px-4 sm:py-6 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/" className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tighter hover:opacity-80 transition-opacity">
            Nomia<span className="text-accent">.</span>
          </Link>
        </div>
      </header>
      
      {/* Hero - Mobile-first, immersive */}
      <main className="relative z-10 pt-4 sm:pt-8 pb-8">
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-4xl mx-auto px-4 sm:px-6"
        >
          
          {/* Trust Block - Above the fold */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6"
          >
            {/* Sale Badge */}
            <motion.div 
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-red-500/30"
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              {t('25% RABATT', '25% OFF')}
            </motion.div>
            
            {/* Spots Left - Real urgency */}
            {!spotsLoading && remainingSpots > 0 && remainingSpots <= 3 && (
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-400 text-xs sm:text-sm font-semibold border border-amber-500/30"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                {remainingSpots} {t('plats kvar', 'spot left')}
              </motion.div>
            )}
          </motion.div>
          
          {/* Main Headline - Cinematic reveal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-6"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-4">
              <span className="block">{t('Din hemsida.', 'Your website.')}</span>
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="block bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent"
              >
                {t('Klar inom 7 dagar.', 'Ready in 7 days.')}
              </motion.span>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-lg mx-auto"
            >
              {t(
                'Se designen gratis först. Betala bara om du gillar den.',
                'See the design free first. Only pay if you love it.'
              )}
            </motion.p>
          </motion.div>
          
          {/* Primary CTA - Prominent */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6"
          >
            <Button 
              asChild 
              size="lg" 
              className="w-full sm:w-auto h-14 sm:h-16 px-8 sm:px-12 text-base sm:text-lg font-semibold bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:via-amber-500 hover:to-yellow-600 text-background shadow-2xl shadow-amber-500/30 border-0 group"
              onClick={() => handleCTAClick('get_free_prototype')}
            >
              <Link to="/demo">
                {t('Få gratis prototyp', 'Get free prototype')}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <Button 
              asChild 
              size="lg"
              variant="outline"
              className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 font-semibold border-accent/50 text-foreground hover:bg-accent/10 hover:border-accent"
              onClick={() => handleCTAClick('order_directly')}
            >
              <Link to="/bestall">
                {t('Eller beställ direkt', 'Or order directly')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
          
          {/* Price + Guarantee */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="text-center mb-10"
          >
            <p className="text-sm text-muted-foreground mb-2">
              {t('Hemsidor från', 'Websites from')} <span className="font-bold text-foreground text-lg">{price}</span> {t('engångsavgift', 'one-time')}
            </p>
            <p className="text-xs text-muted-foreground">
              {priceWithVAT} · {t('Inga dolda avgifter', 'No hidden fees')}
            </p>
          </motion.div>
        </motion.div>
        
        {/* How It Works - 3 steps with icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 mb-12"
        >
          <h2 className="text-center text-lg sm:text-xl font-semibold mb-6">
            {t('Så här fungerar det', 'How it works')}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                step: '1',
                icon: Palette,
                title: t('Beskriv din verksamhet', 'Describe your business'),
                desc: t('5 min formulär', '5 min form'),
              },
              {
                step: '2',
                icon: Code,
                title: t('Få designförslag', 'Get design proposal'),
                desc: t('Inom 72 timmar', 'Within 72 hours'),
              },
              {
                step: '3',
                icon: Zap,
                title: t('Betala om du gillar den', 'Pay if you like it'),
                desc: t('100% nöjd-garanti', '100% satisfaction'),
              },
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative flex flex-col items-center text-center p-5 rounded-2xl bg-gradient-to-br from-secondary/50 to-secondary/20 border border-accent/20 backdrop-blur-sm group hover:border-accent/40 transition-colors"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                <div className="relative w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-3 group-hover:bg-accent/30 transition-colors">
                  <item.icon className="w-6 h-6 text-accent" />
                </div>
                <span className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-accent text-background text-xs font-bold flex items-center justify-center">
                  {item.step}
                </span>
                <p className="font-medium text-sm mb-1">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 mb-12"
        >
          <div className="p-6 rounded-2xl bg-gradient-to-br from-accent/15 via-accent/10 to-accent/5 border border-accent/20 backdrop-blur-sm">
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-accent text-accent" />
              ))}
            </div>
            <blockquote className="text-center text-base sm:text-lg italic text-foreground mb-4 max-w-md mx-auto">
              "{t(
                'Inom 4 dagar hade vi 3x fler bokningar. Nomia levererade precis vad vi behövde.',
                'Within 4 days we had 3x more bookings. Nomia delivered exactly what we needed.'
              )}"
            </blockquote>
            <cite className="block text-center text-sm text-muted-foreground not-italic">
              — Maria L., {t('Salongsägare', 'Salon Owner')}
            </cite>
          </div>
        </motion.div>
        
        {/* What's Included */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 mb-12"
        >
          <h2 className="text-center text-lg sm:text-xl font-semibold mb-6">
            {t('Vad som ingår', "What's included")}
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              t('Mobilanpassad design', 'Mobile-responsive'),
              t('Kontaktformulär', 'Contact form'),
              t('SEO-optimerad', 'SEO optimized'),
              t('Snabb hosting', 'Fast hosting'),
              t('Obegränsade ändringar', 'Unlimited revisions'),
              t('Klar inom 7 dagar', 'Ready in 7 days'),
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-2 text-sm p-3 rounded-xl bg-secondary/30 border border-border/50"
              >
                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                <span>{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Trust Elements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 mb-10"
        >
          <MoneyBackGuarantee variant="full" />
        </motion.div>
        
        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 text-center"
        >
          <Button 
            asChild 
            size="lg" 
            className="w-full sm:w-auto h-14 sm:h-16 px-8 sm:px-12 text-base sm:text-lg font-semibold bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:via-amber-500 hover:to-yellow-600 text-background shadow-2xl shadow-amber-500/30 border-0 group"
            onClick={() => handleCTAClick('final_cta')}
          >
            <Link to="/demo">
              {t('Starta nu – det är gratis', "Start now – it's free")}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {t('5 min att fylla i', '5 min to complete')}
            </span>
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              {t('Ingen förpliktelse', 'No commitment')}
            </span>
          </div>
        </motion.div>
      </main>
      
      {/* Minimal footer */}
      <footer className="relative z-10 py-6 border-t border-border/50 mt-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="font-heading font-bold text-foreground text-sm">
            Nomia<span className="text-accent">.</span>
          </div>
          <div className="flex gap-4">
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
