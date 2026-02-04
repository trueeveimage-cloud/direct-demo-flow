import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, useSpring, useMotionValue } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { trackEvent, getUtmParams } from '@/lib/posthog';
import { ArrowRight, Check } from 'lucide-react';
import { GrainOverlay, FloatingParticles, ScrollingAmbientGlow } from '@/components/PremiumEffects';

// ═══════════════════════════════════════════════════════════════════
// PARALLAX HERO BACKGROUND - Gold/Black premium feel
// ═══════════════════════════════════════════════════════════════════
function ParallaxHeroBackground() {
  const { scrollY } = useScroll();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);
  
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const scale1 = useTransform(scrollY, [0, 300], [1, 1.3]);
  const opacity1 = useTransform(scrollY, [0, 400], [1, 0]);
  const rotate1 = useTransform(scrollY, [0, 500], [0, 45]);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX / innerWidth - 0.5) * 2);
      mouseY.set((clientY / innerHeight - 0.5) * 2);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);
  
  const orbX1 = useTransform(smoothMouseX, [-1, 1], [-30, 30]);
  const orbY1 = useTransform(smoothMouseY, [-1, 1], [-30, 30]);
  const orbX2 = useTransform(smoothMouseX, [-1, 1], [40, -40]);
  const orbY2 = useTransform(smoothMouseY, [-1, 1], [20, -20]);
  
  return (
    <div className="fixed top-0 left-0 right-0 h-screen pointer-events-none z-0 overflow-hidden motion-reduce:hidden">
      <div className="hidden md:block h-full">
        <motion.div
          style={{ y: y1, x: orbX1, scale: scale1, rotate: rotate1, opacity: opacity1 }}
          className="absolute top-[-150px] left-[5%] w-[600px] h-[600px]"
        >
          <div className="w-full h-full rounded-full bg-gradient-radial from-accent/30 via-accent/10 to-transparent blur-[100px] animate-orb-pulse" />
        </motion.div>
        
        <motion.div
          style={{ y: y2, x: orbX2, opacity: opacity1 }}
          className="absolute top-[50px] right-[10%] w-[500px] h-[500px]"
        >
          <div className="w-full h-full bg-gradient-radial from-accent/25 via-accent/10 to-transparent blur-[80px] animate-morph" />
        </motion.div>
        
        {/* Shimmer effect */}
        <motion.div
          style={{ opacity: opacity1 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent shimmer"
        />
      </div>
      
      {/* Mobile: Simplified */}
      <div className="md:hidden h-full">
        <div className="absolute top-[-100px] left-[10%] w-[300px] h-[300px] bg-accent/15 rounded-full blur-[80px]" />
        <div className="absolute top-[-50px] right-[10%] w-[200px] h-[200px] bg-accent/10 rounded-full blur-[60px]" />
      </div>
    </div>
  );
}

// Reveal component for sections
function Reveal({ children, className = '', delay = 0 }: { 
  children: React.ReactNode; 
  className?: string; 
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Side reveal for flowing animations
function SideReveal({ children, className = '', direction = 'left', delay = 0 }: { 
  children: React.ReactNode; 
  className?: string; 
  direction?: 'left' | 'right';
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: direction === 'left' ? -60 : 60 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: direction === 'left' ? -60 : 60 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Parallax section with flowing gradient
function FlowingSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  
  return (
    <section ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Seamless gradient blend */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/[0.02] to-transparent pointer-events-none" />
      <motion.div style={{ y }} className="relative">
        {children}
      </motion.div>
    </section>
  );
}

// Timeline step with animated line and hover glow effects
function TimelineStep({ 
  number, 
  title, 
  description, 
  isLast = false,
  index 
}: { 
  number: string; 
  title: string; 
  description: string;
  isLast?: boolean;
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
      className="relative pl-14 pb-12 last:pb-0 group/step"
    >
      {/* Animated vertical line */}
      {!isLast && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: "easeOut" }}
          className="absolute left-[15px] top-10 w-px h-[calc(100%-24px)] bg-gradient-to-b from-accent/50 via-accent/20 to-transparent origin-top"
        />
      )}
      
      {/* Number circle with enhanced hover glow */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
        className="absolute left-0 top-0"
      >
        <div className="relative cursor-pointer">
          {/* Outer glow - intensifies on hover */}
          <div className="absolute -inset-2 bg-accent/20 rounded-full blur-xl opacity-50 group-hover/step:opacity-100 group-hover/step:bg-accent/40 transition-all duration-500" />
          {/* Inner glow */}
          <div className="absolute inset-0 bg-accent/30 rounded-full blur-md group-hover/step:blur-lg group-hover/step:bg-accent/50 transition-all duration-300" />
          {/* Circle with pulse on hover */}
          <motion.div 
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="relative w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent/70 border border-accent/50 flex items-center justify-center shadow-lg shadow-accent/20 group-hover/step:shadow-accent/50 group-hover/step:shadow-xl group-hover/step:border-accent transition-all duration-300"
          >
            <span className="text-xs font-bold text-accent-foreground">{number}</span>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Title with subtle glow on hover */}
      <h4 className="text-xl font-medium text-foreground mb-2 group-hover/step:text-accent transition-colors duration-300">{title}</h4>
      <p className="text-muted-foreground leading-relaxed max-w-md group-hover/step:text-muted-foreground/90 transition-colors duration-300">{description}</p>
    </motion.div>
  );
}

// Glowing CTA Button component
function GlowingButton({ 
  children, 
  to, 
  variant = 'primary',
  onClick 
}: { 
  children: React.ReactNode; 
  to: string; 
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}) {
  if (variant === 'primary') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative group/btn"
      >
        {/* Glow effect behind button */}
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-accent to-amber-500 rounded-xl blur-lg opacity-40 group-hover/btn:opacity-70 transition-opacity duration-300" />
        <Button 
          asChild 
          size="lg" 
          className="relative h-14 px-10 font-medium bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-foreground hover:from-amber-400 hover:via-amber-300 hover:to-yellow-400 shadow-lg shadow-amber-500/30 border-0 group-hover/btn:shadow-amber-500/50 group-hover/btn:shadow-xl transition-all duration-300"
          onClick={onClick}
        >
          <Link to={to}>
            {children}
          </Link>
        </Button>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative group/btn"
    >
      {/* Subtle glow for secondary */}
      <div className="absolute -inset-0.5 bg-accent/20 rounded-xl opacity-0 group-hover/btn:opacity-100 blur-md transition-opacity duration-300" />
      <Button 
        asChild 
        size="lg"
        variant="outline"
        className="relative h-14 px-10 font-normal border-accent/30 text-foreground hover:bg-accent/10 hover:border-accent/50 transition-all duration-300"
        onClick={onClick}
      >
        <Link to={to}>
          {children}
        </Link>
      </Button>
    </motion.div>
  );
}

export default function AdLandingPage() {
  const { t } = useLanguage();
  const hasTracked = useRef(false);
  
  useEffect(() => {
    if (hasTracked.current) return;
    hasTracked.current = true;
    trackEvent('ad_landing_view', { campaign_page: 'ad_landing', ...getUtmParams() });
  }, []);

  const handleCTAClick = (button: string) => {
    trackEvent('ad_cta_click', { button, page: '/ad', ...getUtmParams() });
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      <GrainOverlay />
      <FloatingParticles count={15} />
      <ScrollingAmbientGlow />
      <ParallaxHeroBackground />
      
      {/* ═══════════════════════════════════════════════════════════════
          HERO — Above the fold
      ═══════════════════════════════════════════════════════════════ */}
      <section className="min-h-[90vh] flex flex-col justify-center px-6 sm:px-8 lg:px-16 relative">
        <div className="max-w-4xl mx-auto w-full relative z-10">
          
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-12 sm:mb-16"
          >
            <Link to="/" className="font-heading font-bold text-2xl tracking-tight">
              Nomia<span className="text-accent">.</span>
            </Link>
          </motion.div>
          
          {/* Main headline - CHANGED */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight tracking-tight leading-[1.1] mb-6"
          >
            <span className="text-reveal-gradient">{t('Din vision.', 'Your vision.')}</span>
            <br />
            <span className="text-muted-foreground font-light">
              {t('Professionellt utförande.', 'Professional execution.')}
            </span>
          </motion.h1>
          
          {/* Subline - CHANGED */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-muted-foreground font-light mb-10 max-w-xl"
          >
            {t(
              'Webbplatser som bygger förtroende och driver resultat.',
              'Websites that build trust and drive results.'
            )}
          </motion.p>
          
          {/* CTAs with gold styling and hover glow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <GlowingButton 
              to="/demo" 
              variant="primary" 
              onClick={() => handleCTAClick('hero_concept')}
            >
              {t('Få ett gratis koncept', 'Get a free concept')}
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover/btn:translate-x-1" />
            </GlowingButton>
            
            <GlowingButton 
              to="/priser" 
              variant="secondary" 
              onClick={() => handleCTAClick('hero_pricing')}
            >
              {t('Se priser', 'View pricing')}
            </GlowingButton>
          </motion.div>
        </div>
        
        {/* Trust layer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="max-w-4xl mx-auto w-full mt-16 sm:mt-20 pt-8 border-t border-accent/20 relative z-10"
        >
          <p className="text-xs text-accent/60 mb-4 tracking-widest uppercase">
            {t('Förtroende från växande företag', 'Trusted by growing businesses')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-accent" />
              {t('Konverteringsfokuserad design', 'Conversion-focused design')}
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-accent" />
              {t('Byggt för långsiktigt förtroende', 'Built for long-term trust')}
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-accent" />
              {t('Genomtänkt genomförande', 'Measured execution')}
            </span>
          </div>
        </motion.div>
      </section>
      
      {/* ═══════════════════════════════════════════════════════════════
          SCROLL 1 — The Problem (flowing from hero)
      ═══════════════════════════════════════════════════════════════ */}
      <FlowingSection className="py-24 sm:py-32 px-6 sm:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <SideReveal direction="left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extralight tracking-tight leading-tight mb-6">
              {t('De flesta hemsidor pratar för mycket.', 'Most websites talk too much.')}
            </h2>
          </SideReveal>
          
          <SideReveal direction="right" delay={0.2}>
            <p className="text-xl sm:text-2xl text-muted-foreground font-extralight leading-relaxed max-w-2xl">
              {t(
                'De bästa låter designen göra jobbet.',
                'The best ones let the design do the work.'
              )}
            </p>
          </SideReveal>
          
          <Reveal delay={0.4}>
            <p className="text-base text-muted-foreground/60 mt-10 max-w-lg">
              {t(
                'Röriga sidor konverterar inte. Tydliga upplevelser gör det.',
                'Cluttered pages don\'t convert. Clear experiences do.'
              )}
            </p>
          </Reveal>
        </div>
      </FlowingSection>
      
      {/* ═══════════════════════════════════════════════════════════════
          SCROLL 2 — Philosophy (parallax effect)
      ═══════════════════════════════════════════════════════════════ */}
      <FlowingSection className="py-24 sm:py-32 px-6 sm:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto relative">
          {/* Accent glow behind text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
          
          <SideReveal direction="right" className="relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extralight tracking-tight leading-tight mb-6">
              {t('Vi börjar inte med mallar.', 'We don\'t start with templates.')}
              <br />
              <span className="text-accent/80">
                {t('Vi börjar med känsla.', 'We start with feeling.')}
              </span>
            </h2>
          </SideReveal>
          
          <SideReveal direction="left" delay={0.2} className="relative z-10">
            <p className="text-base text-muted-foreground max-w-lg leading-relaxed">
              {t(
                'Varje layoutval görs för att minska friktion och öka förtroende.',
                'Every layout choice is made to reduce friction and increase confidence.'
              )}
            </p>
          </SideReveal>
        </div>
      </FlowingSection>
      
      {/* ═══════════════════════════════════════════════════════════════
          SCROLL 3 — The Process (Timeline with animated line)
      ═══════════════════════════════════════════════════════════════ */}
      <FlowingSection className="py-24 sm:py-32 px-6 sm:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <Reveal className="mb-12">
            <span className="text-xs text-accent tracking-widest uppercase">
              {t('Processen', 'The Process')}
            </span>
          </Reveal>
          
          <div className="space-y-0">
            <TimelineStep
              number="01"
              title={t('Förstå', 'Understand')}
              description={t(
                'Vi lär känna ditt företag innan vi rör designen.',
                'We learn your business before touching design.'
              )}
              index={0}
            />
            <TimelineStep
              number="02"
              title={t('Designa', 'Design')}
              description={t(
                'Ett fokuserat koncept byggt för att konvertera utan press.',
                'A focused concept built to convert without pressure.'
              )}
              index={1}
            />
            <TimelineStep
              number="03"
              title={t('Förfina', 'Refine')}
              description={t(
                'Detaljer, spacing, rörelse — inget förhastigt.',
                'Details, spacing, motion — nothing rushed.'
              )}
              index={2}
            />
            <TimelineStep
              number="04"
              title={t('Leverera', 'Deliver')}
              description={t(
                'En hemsida som känns färdig, genomtänkt och trovärdig.',
                'A site that feels finished, intentional, and trustworthy.'
              )}
              isLast
              index={3}
            />
          </div>
        </div>
      </FlowingSection>
      
      {/* ═══════════════════════════════════════════════════════════════
          SCROLL 4 — Visual Proof
      ═══════════════════════════════════════════════════════════════ */}
      <FlowingSection className="py-24 sm:py-32 px-6 sm:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-accent/5 rounded-full blur-[80px] pointer-events-none" />
          
          <Reveal className="relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extralight tracking-tight leading-tight mb-6">
              {t('Design som håller sig i bakgrunden', 'Design that stays out of the way')} —
              <br />
              <span className="text-muted-foreground">
                {t('tills den behöver tala.', 'until it needs to speak.')}
              </span>
            </h2>
          </Reveal>
          
          <Reveal delay={0.3} className="relative z-10">
            <p className="text-base text-muted-foreground/60 max-w-md mx-auto">
              {t(
                'Bra design märks inte. Dålig design minns man.',
                'Good design isn\'t noticed. Bad design is remembered.'
              )}
            </p>
          </Reveal>
        </div>
      </FlowingSection>
      
      {/* ═══════════════════════════════════════════════════════════════
          SCROLL 5 — Social Proof (One testimonial)
      ═══════════════════════════════════════════════════════════════ */}
      <FlowingSection className="py-24 sm:py-32 px-6 sm:px-8 lg:px-16">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <blockquote className="text-xl sm:text-2xl md:text-3xl font-extralight leading-relaxed mb-8 text-foreground/90">
              &ldquo;{t(
                'Inom några dagar kändes vår hemsida tydligare. Kunder litade på oss direkt.',
                'Within days, our site felt clearer. Customers trusted us immediately.'
              )}&rdquo;
            </blockquote>
          </Reveal>
          
          <Reveal delay={0.2}>
            <cite className="text-sm text-accent not-italic">
              — Maria Lindberg, {t('Salongsägare', 'Salon Owner')}
            </cite>
          </Reveal>
        </div>
      </FlowingSection>
      
      {/* ═══════════════════════════════════════════════════════════════
          SCROLL 6 — Choice Section (Split with equal weight)
      ═══════════════════════════════════════════════════════════════ */}
      <FlowingSection className="py-24 sm:py-32 px-6 sm:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            
            {/* Free concept */}
            <SideReveal direction="left">
              <div className="p-8 rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/5 to-transparent hover:border-accent/40 transition-all duration-300 h-full group/card">
                {/* Card glow on hover */}
                <div className="absolute inset-0 -z-10 rounded-2xl bg-accent/5 opacity-0 group-hover/card:opacity-100 blur-xl transition-opacity duration-500" />
                
                <h3 className="text-2xl font-light mb-4">
                  {t('Få ett gratis koncept', 'Get a free concept')}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {t(
                    'Se hur vi skulle designa din hemsida — innan du bestämmer dig.',
                    'See how we would design your site — before committing.'
                  )}
                </p>
                
                {/* Primary CTA with glow */}
                <div className="relative group/btn">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 via-accent to-amber-500 rounded-xl blur opacity-30 group-hover/btn:opacity-60 transition-opacity duration-300" />
                  <Button 
                    asChild 
                    className="relative w-full h-12 font-medium bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-foreground hover:from-amber-400 hover:via-amber-300 hover:to-yellow-400 shadow-lg shadow-amber-500/30 border-0 group-hover/btn:shadow-amber-500/50 transition-all duration-300"
                    onClick={() => handleCTAClick('choice_concept')}
                  >
                    <Link to="/demo">
                      {t('Starta med ett gratis koncept', 'Start with a free concept')}
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </SideReveal>
            
            {/* Pricing */}
            <SideReveal direction="right" delay={0.1}>
              <div className="p-8 rounded-2xl border border-border/50 bg-gradient-to-br from-secondary/30 to-transparent hover:border-accent/30 transition-all duration-300 h-full group/card">
                <h3 className="text-2xl font-light mb-4">
                  {t('Se priser', 'View pricing')}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {t(
                    'Tydliga, transparenta paket. Inga dolda avgifter eller överraskningar.',
                    'Clear, transparent packages. No hidden fees or surprises.'
                  )}
                </p>
                
                {/* Secondary CTA with subtle glow */}
                <div className="relative group/btn">
                  <div className="absolute -inset-0.5 bg-accent/10 rounded-xl opacity-0 group-hover/btn:opacity-100 blur transition-opacity duration-300" />
                  <Button 
                    asChild 
                    variant="outline"
                    className="relative w-full h-12 font-normal border-accent/30 hover:bg-accent/10 hover:border-accent/50 transition-all duration-300"
                    onClick={() => handleCTAClick('choice_pricing')}
                  >
                    <Link to="/priser">
                      {t('Se våra priser', 'View our pricing')}
                    </Link>
                  </Button>
                </div>
              </div>
            </SideReveal>
          </div>
        </div>
      </FlowingSection>
      
      {/* ═══════════════════════════════════════════════════════════════
          SCROLL 7 — Guarantee
      ═══════════════════════════════════════════════════════════════ */}
      <FlowingSection className="py-24 sm:py-32 px-6 sm:px-8 lg:px-16">
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[80px] pointer-events-none" />
          
          <Reveal className="relative z-10">
            <h3 className="text-2xl sm:text-3xl font-light mb-4">
              {t('100% nöjdhetsgaranti', '100% satisfaction guarantee')}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {t(
                'Om det inte känns rätt, fortsätter du inte. Så enkelt är det.',
                'If it doesn\'t feel right, you don\'t continue. Simple as that.'
              )}
            </p>
          </Reveal>
        </div>
      </FlowingSection>
      
      {/* ═══════════════════════════════════════════════════════════════
          FINAL — Close without selling
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 px-6 sm:px-8 lg:px-16 border-t border-accent/10">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extralight tracking-tight leading-tight mb-6">
              {t('Design ska kännas självklar.', 'Design should feel obvious.')}
              <br />
              <span className="text-muted-foreground">
                {t('Annars är den inte färdig.', 'If it doesn\'t, it isn\'t finished.')}
              </span>
            </h2>
          </Reveal>
          
          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              {/* Primary CTA with glow effect */}
              <div className="relative group/btn">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-accent to-amber-500 rounded-xl blur-lg opacity-40 group-hover/btn:opacity-70 transition-opacity duration-300" />
                <Button 
                  asChild 
                  size="lg" 
                  className="relative h-14 px-10 font-medium bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-foreground hover:from-amber-400 hover:via-amber-300 hover:to-yellow-400 shadow-lg shadow-amber-500/30 border-0 group-hover/btn:shadow-amber-500/50 group-hover/btn:shadow-xl transition-all duration-300"
                  onClick={() => handleCTAClick('final_concept')}
                >
                  <Link to="/demo">
                    {t('Få ett gratis koncept', 'Get a free concept')}
                    <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </div>
              
              {/* Secondary CTA with subtle glow */}
              <div className="relative group/btn2">
                <div className="absolute -inset-0.5 bg-accent/10 rounded-xl opacity-0 group-hover/btn2:opacity-100 blur transition-opacity duration-300" />
                <Button 
                  asChild 
                  size="lg"
                  variant="ghost"
                  className="relative h-14 px-10 font-normal text-muted-foreground hover:text-foreground transition-all duration-300"
                  onClick={() => handleCTAClick('final_pricing')}
                >
                  <Link to="/priser">
                    {t('Se priser', 'View pricing')}
                  </Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
