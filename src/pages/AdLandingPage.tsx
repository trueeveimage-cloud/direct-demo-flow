import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle2, Clock, Shield, Star, Sparkles, Zap, Award, BadgeCheck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { trackEvent, getUtmParams } from '@/lib/posthog';
import { useRemainingSpots } from '@/hooks/useRemainingSpots';
import { GrainOverlay } from '@/components/PremiumEffects';
import { CountdownTimer } from '@/components/CountdownTimer';

// Cinematic scroll-reveal section wrapper
function RevealSection({ children, className = '', delay = 0, direction = 'up' }: { 
  children: React.ReactNode; 
  className?: string; 
  delay?: number;
  direction?: 'up' | 'left' | 'right';
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const variants = {
    hidden: {
      opacity: 0,
      x: direction === 'left' ? -80 : direction === 'right' ? 80 : 0,
      y: direction === 'up' ? 60 : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
    }
  };
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Floating orb component for luxury feel
function FloatingOrb({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 2, delay }}
      className={className}
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="w-full h-full rounded-full blur-[100px]"
      />
    </motion.div>
  );
}

export default function AdLandingPage() {
  const { t, lang } = useLanguage();
  const [searchParams] = useSearchParams();
  const hasTracked = useRef(false);
  const { remainingSpots, isLoading: spotsLoading } = useRemainingSpots();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);
  
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

  const handleCTAClick = (button: string) => {
    trackEvent('ad_cta_click', { button, page: '/ad', ...getUtmParams() });
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-background overflow-hidden relative">
      <GrainOverlay />
      
      {/* Ambient Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <FloatingOrb className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] bg-accent/30" delay={0} />
        <FloatingOrb className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-accent/20" delay={0.5} />
        <FloatingOrb className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent/10" delay={1} />
      </div>
      
      {/* Minimal Header */}
      <header className="relative z-50 py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tighter hover:opacity-80 transition-opacity">
            Nomia<span className="text-accent">.</span>
          </Link>
          
          {/* Urgency indicator */}
          {!spotsLoading && remainingSpots > 0 && remainingSpots <= 3 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="text-xs font-medium text-amber-400">
                {remainingSpots} {t('plats kvar', 'spot left')}
              </span>
            </motion.div>
          )}
        </div>
      </header>
      
      {/* ========== HERO SECTION ========== */}
      <motion.section 
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative z-10 min-h-[85vh] flex flex-col items-center justify-center px-6 py-12"
      >
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Sale Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white text-sm font-bold shadow-xl shadow-red-500/25">
              <Sparkles className="w-4 h-4" />
              {t('25% RABATT – Begränsat erbjudande', '25% OFF – Limited offer')}
            </span>
          </motion.div>
          
          {/* Main Headline - Cinematic */}
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-6"
          >
            <span className="block text-foreground/90">{t('Hemsidor som', 'Websites that')}</span>
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="block bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent"
            >
              {t('säljer.', 'sell.')}
            </motion.span>
          </motion.h1>
          
          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-xl mx-auto mb-8 font-light"
          >
            {t(
              'Se designen gratis innan du bestämmer dig. Leverans inom 7 dagar.',
              'See the design free before you decide. Delivery within 7 days.'
            )}
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          >
            <Button 
              asChild 
              size="lg" 
              className="w-full sm:w-auto h-16 px-10 text-lg font-semibold bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:via-amber-500 hover:to-yellow-600 text-background shadow-2xl shadow-amber-500/30 border-0 group"
              onClick={() => handleCTAClick('hero_prototype')}
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
              className="w-full sm:w-auto h-14 px-8 font-medium border-accent/40 hover:bg-accent/10 hover:border-accent"
              onClick={() => handleCTAClick('hero_order')}
            >
              <Link to="/bestall">
                {t('Beställ direkt', 'Order directly')}
              </Link>
            </Button>
          </motion.div>
          
          {/* Price Tag */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="flex items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            <span>{t('Från', 'From')} <strong className="text-foreground text-lg">{price}</strong></span>
            <span className="w-px h-4 bg-border" />
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-green-500" />
              {t('Nöjd-garanti', 'Money-back')}
            </span>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-accent/30 flex items-start justify-center p-2"
          >
            <motion.div className="w-1.5 h-2.5 bg-accent rounded-full" />
          </motion.div>
        </motion.div>
      </motion.section>
      
      {/* ========== SOCIAL PROOF BAR ========== */}
      <section className="relative z-10 py-8 border-y border-border/30 bg-secondary/20 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-center">
            <div>
              <p className="text-3xl font-bold text-accent">50+</p>
              <p className="text-xs text-muted-foreground">{t('Nöjda kunder', 'Happy clients')}</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-accent">4.9</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 justify-center">
                <Star className="w-3 h-3 fill-accent text-accent" />
                {t('Betyg', 'Rating')}
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-accent">7</p>
              <p className="text-xs text-muted-foreground">{t('Dagars leverans', 'Day delivery')}</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-500">100%</p>
              <p className="text-xs text-muted-foreground">{t('Nöjd-garanti', 'Satisfaction')}</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* ========== HOW IT WORKS ========== */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <RevealSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              {t('Enkelt. Snabbt. Utan risk.', 'Simple. Fast. Risk-free.')}
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              {t('Tre steg till din nya hemsida', 'Three steps to your new website')}
            </p>
          </RevealSection>
          
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                step: '01',
                title: t('Berätta om dig', 'Tell us about you'),
                desc: t('Fyll i ett kort formulär om din verksamhet. Tar 5 minuter.', 'Fill out a short form about your business. Takes 5 minutes.'),
                icon: Users,
                direction: 'left' as const,
              },
              {
                step: '02',
                title: t('Se din design', 'See your design'),
                desc: t('Vi skapar en unik prototyp inom 72 timmar. Helt gratis.', 'We create a unique prototype within 72 hours. Completely free.'),
                icon: Sparkles,
                direction: 'up' as const,
              },
              {
                step: '03',
                title: t('Betala om du älskar den', 'Pay if you love it'),
                desc: t('Ingen risk. Pengarna tillbaka om du inte är 100% nöjd.', 'No risk. Money back if you are not 100% satisfied.'),
                icon: Shield,
                direction: 'right' as const,
              },
            ].map((item, i) => (
              <RevealSection key={i} delay={i * 0.15} direction={item.direction}>
                <div className="relative p-8 rounded-2xl bg-gradient-to-br from-secondary/60 via-secondary/40 to-transparent border border-accent/10 hover:border-accent/30 transition-all duration-500 group h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                  
                  <span className="absolute -top-4 left-6 text-5xl font-bold text-accent/20 font-mono">{item.step}</span>
                  
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-accent/15 flex items-center justify-center mb-5 group-hover:bg-accent/25 transition-colors">
                      <item.icon className="w-7 h-7 text-accent" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>
      
      {/* ========== TESTIMONIAL ========== */}
      <section className="relative z-10 py-24 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <RevealSection>
            <div className="relative p-10 md:p-16 rounded-3xl bg-gradient-to-br from-accent/15 via-accent/10 to-accent/5 border border-accent/20">
              <div className="absolute top-6 left-6 opacity-20">
                <svg className="w-16 h-16 text-accent" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>
              
              <blockquote className="text-xl sm:text-2xl md:text-3xl font-light italic leading-relaxed mb-8">
                &quot;{t(
                  'Inom 4 dagar hade vi 3x fler bokningar. Nomia förstod exakt vad vi behövde och levererade över förväntan.',
                  'Within 4 days we had 3x more bookings. Nomia understood exactly what we needed and delivered beyond expectations.'
                )}&quot;
              </blockquote>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <BadgeCheck className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <cite className="not-italic font-semibold">Maria Lindberg</cite>
                  <p className="text-sm text-muted-foreground">{t('Salongsägare, Stockholm', 'Salon Owner, Stockholm')}</p>
                </div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>
      
      {/* ========== WHAT'S INCLUDED ========== */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <RevealSection className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {t('Allt du behöver ingår', 'Everything you need is included')}
            </h2>
          </RevealSection>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { text: t('Mobilanpassad design', 'Mobile-responsive design'), icon: '📱' },
              { text: t('SEO-optimerad', 'SEO optimized'), icon: '🔍' },
              { text: t('Snabb hosting inkluderad', 'Fast hosting included'), icon: '⚡' },
              { text: t('SSL-certifikat', 'SSL certificate'), icon: '🔒' },
              { text: t('Kontaktformulär', 'Contact form'), icon: '✉️' },
              { text: t('Obegränsade ändringar', 'Unlimited revisions'), icon: '♾️' },
              { text: t('Klar inom 7 dagar', 'Ready in 7 days'), icon: '🚀' },
              { text: t('Support ingår', 'Support included'), icon: '💬' },
              { text: t('Google Analytics', 'Google Analytics'), icon: '📊' },
            ].map((item, i) => (
              <RevealSection key={i} delay={i * 0.05}>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/30 border border-border/50 hover:border-accent/30 transition-colors">
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.text}</span>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>
      
      {/* ========== GUARANTEE ========== */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <RevealSection>
            <div className="p-10 md:p-14 rounded-3xl bg-gradient-to-br from-green-500/15 via-green-500/10 to-green-500/5 border border-green-500/30 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6">
                <Award className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-green-400">
                {t('100% Nöjd-garanti', '100% Satisfaction Guarantee')}
              </h3>
              <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
                {t(
                  'Vi är så säkra på att du kommer älska din nya hemsida att vi ger full återbetalning om du inte är nöjd. Ingen risk för dig.',
                  'We are so confident you will love your new website that we offer a full refund if you are not satisfied. Zero risk for you.'
                )}
              </p>
            </div>
          </RevealSection>
        </div>
      </section>
      
      {/* ========== FINAL CTA ========== */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <RevealSection>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              {t('Redo att komma igång?', 'Ready to get started?')}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
              {t(
                'Få din gratis prototyp idag. Betala bara om du älskar den.',
                'Get your free prototype today. Pay only if you love it.'
              )}
            </p>
            
            {/* Countdown Timer */}
            <div className="mb-8">
              <CountdownTimer variant="full" className="max-w-sm mx-auto" />
            </div>
            
            <Button 
              asChild 
              size="lg" 
              className="h-16 px-12 text-lg font-semibold bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:via-amber-500 hover:to-yellow-600 text-background shadow-2xl shadow-amber-500/30 border-0 group"
              onClick={() => handleCTAClick('final_cta')}
            >
              <Link to="/demo">
                {t('Starta nu – det är gratis', "Start now – it's free")}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <div className="flex items-center justify-center gap-4 mt-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {t('72h leverans', '72h delivery')}
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-green-500" />
                {t('Ingen risk', 'No risk')}
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-accent" />
                {t('Helt gratis', 'Totally free')}
              </span>
            </div>
          </RevealSection>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-border/30">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <Link to="/" className="font-heading font-bold text-lg">
            Nomia<span className="text-accent">.</span>
          </Link>
          <div className="flex items-center gap-6">
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
        </div>
      </footer>
    </div>
  );
}
