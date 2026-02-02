import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { trackEvent, getUtmParams } from '@/lib/posthog';

// Fade up reveal for sections
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

// Slow text reveal for emphasis
function SlowReveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Parallax section wrapper
function ParallaxSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="relative">
        {children}
      </motion.div>
    </div>
  );
}

// Timeline step component
function TimelineStep({ 
  number, 
  title, 
  description, 
  isLast = false 
}: { 
  number: string; 
  title: string; 
  description: string;
  isLast?: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative pl-12 pb-12 last:pb-0"
    >
      {/* Vertical line */}
      {!isLast && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="absolute left-[11px] top-6 w-px h-full bg-gradient-to-b from-accent/40 to-transparent origin-top"
        />
      )}
      
      {/* Number dot */}
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : { scale: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="absolute left-0 top-0 w-6 h-6 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center"
      >
        <span className="text-[10px] font-medium text-accent">{number}</span>
      </motion.div>
      
      <h4 className="text-lg font-medium text-foreground mb-2">{title}</h4>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-md">{description}</p>
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
    <div className="min-h-screen bg-background text-foreground">
      
      {/* ═══════════════════════════════════════════════════════════════
          HERO — Above the fold
      ═══════════════════════════════════════════════════════════════ */}
      <section className="min-h-[90vh] flex flex-col justify-center px-6 sm:px-8 lg:px-16">
        <div className="max-w-3xl mx-auto w-full">
          
          {/* Minimal header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <Link to="/" className="font-heading font-bold text-xl tracking-tight">
              Nomia<span className="text-accent">.</span>
            </Link>
          </motion.div>
          
          {/* Main headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight leading-[1.1] mb-6"
          >
            {t('Hemsidor som konverterar', 'Websites that convert')}
            <span className="text-muted-foreground"> — </span>
            <br className="hidden sm:block" />
            <span className="text-muted-foreground font-extralight">
              {t('utan att kännas som marknadsföring.', 'without feeling like marketing.')}
            </span>
          </motion.h1>
          
          {/* Subline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-muted-foreground font-light mb-10 max-w-xl"
          >
            {t(
              'Designade för att bygga förtroende, inte jaga klick.',
              'Designed to earn trust, not chase clicks.'
            )}
          </motion.p>
          
          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button 
              asChild 
              size="lg" 
              className="h-12 px-8 font-normal bg-foreground text-background hover:bg-foreground/90"
              onClick={() => handleCTAClick('hero_concept')}
            >
              <Link to="/demo">
                {t('Få ett gratis koncept', 'Get a free concept')}
              </Link>
            </Button>
            
            <Button 
              asChild 
              size="lg"
              variant="ghost"
              className="h-12 px-8 font-normal text-muted-foreground hover:text-foreground"
              onClick={() => handleCTAClick('hero_pricing')}
            >
              <Link to="/priser">
                {t('Se priser', 'View pricing')}
              </Link>
            </Button>
          </motion.div>
        </div>
        
        {/* Trust layer — still above fold */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="max-w-3xl mx-auto w-full mt-20 pt-10 border-t border-border/30"
        >
          <p className="text-xs text-muted-foreground/60 mb-6 tracking-wide uppercase">
            {t('Används av växande företag som värdesätter trovärdighet.', 'Used by growing businesses that care about credibility.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-muted-foreground">
            <span>• {t('Konverteringsfokuserad design', 'Conversion-focused design')}</span>
            <span>• {t('Byggt för långsiktigt förtroende', 'Built for long-term trust')}</span>
            <span>• {t('Genomtänkt genomförande', 'Measured, intentional execution')}</span>
          </div>
        </motion.div>
      </section>
      
      {/* ═══════════════════════════════════════════════════════════════
          SCROLL 1 — The Problem
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-32 sm:py-40 px-6 sm:px-8 lg:px-16">
        <div className="max-w-3xl mx-auto">
          <SlowReveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight leading-tight mb-8">
              {t('De flesta hemsidor pratar för mycket.', 'Most websites talk too much.')}
            </h2>
          </SlowReveal>
          
          <Reveal delay={0.3}>
            <p className="text-xl sm:text-2xl text-muted-foreground font-extralight leading-relaxed">
              {t(
                'De bästa låter designen göra jobbet.',
                'The best ones let the design do the work.'
              )}
            </p>
          </Reveal>
          
          <Reveal delay={0.5}>
            <p className="text-base text-muted-foreground/70 mt-12 max-w-lg">
              {t(
                'Röriga sidor konverterar inte. Tydliga upplevelser gör det.',
                'Cluttered pages don\'t convert. Clear experiences do.'
              )}
            </p>
          </Reveal>
        </div>
      </section>
      
      {/* ═══════════════════════════════════════════════════════════════
          SCROLL 2 — Philosophy
      ═══════════════════════════════════════════════════════════════ */}
      <ParallaxSection className="py-32 sm:py-40 px-6 sm:px-8 lg:px-16 bg-secondary/20">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight leading-tight mb-8">
              {t('Vi börjar inte med mallar.', 'We don\'t start with templates.')}
              <br />
              <span className="text-muted-foreground">
                {t('Vi börjar med hur människor känner.', 'We start with how people feel.')}
              </span>
            </h2>
          </Reveal>
          
          <Reveal delay={0.3}>
            <p className="text-base text-muted-foreground max-w-lg leading-relaxed">
              {t(
                'Varje layoutval görs för att minska friktion och öka förtroende.',
                'Every layout choice is made to reduce friction and increase confidence.'
              )}
            </p>
          </Reveal>
        </div>
      </ParallaxSection>
      
      {/* ═══════════════════════════════════════════════════════════════
          SCROLL 3 — The Process (Timeline)
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-32 sm:py-40 px-6 sm:px-8 lg:px-16">
        <div className="max-w-3xl mx-auto">
          <Reveal className="mb-16">
            <h3 className="text-xs text-muted-foreground/60 tracking-widest uppercase mb-4">
              {t('Processen', 'The Process')}
            </h3>
          </Reveal>
          
          <div className="space-y-0">
            <TimelineStep
              number="01"
              title={t('Förstå', 'Understand')}
              description={t(
                'Vi lär oss ditt företag innan vi rör designen.',
                'We learn your business before touching design.'
              )}
            />
            <TimelineStep
              number="02"
              title={t('Designa', 'Design')}
              description={t(
                'Ett fokuserat koncept byggt för att konvertera utan press.',
                'A focused concept built to convert without pressure.'
              )}
            />
            <TimelineStep
              number="03"
              title={t('Förfina', 'Refine')}
              description={t(
                'Detaljer, spacing, rörelse — inget förhastigt.',
                'Details, spacing, motion — nothing rushed.'
              )}
            />
            <TimelineStep
              number="04"
              title={t('Leverera', 'Deliver')}
              description={t(
                'En hemsida som känns färdig, genomtänkt och trovärdig.',
                'A site that feels finished, intentional, and trustworthy.'
              )}
              isLast
            />
          </div>
        </div>
      </section>
      
      {/* ═══════════════════════════════════════════════════════════════
          SCROLL 4 — Visual Proof
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-32 sm:py-40 px-6 sm:px-8 lg:px-16 bg-secondary/10">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight leading-tight mb-6">
              {t('Design som håller sig i bakgrunden', 'Design that stays out of the way')} —
              <br />
              <span className="text-muted-foreground">
                {t('tills den behöver tala.', 'until it needs to speak.')}
              </span>
            </h2>
          </Reveal>
          
          <Reveal delay={0.3}>
            <p className="text-base text-muted-foreground/70 max-w-md mx-auto">
              {t(
                'Bra design märks inte. Dålig design minns man.',
                'Good design isn\'t noticed. Bad design is remembered.'
              )}
            </p>
          </Reveal>
        </div>
      </section>
      
      {/* ═══════════════════════════════════════════════════════════════
          SCROLL 5 — Social Proof (One testimonial)
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-32 sm:py-40 px-6 sm:px-8 lg:px-16">
        <div className="max-w-2xl mx-auto text-center">
          <Reveal>
            <blockquote className="text-xl sm:text-2xl font-light leading-relaxed mb-8 text-foreground/90">
              &ldquo;{t(
                'Inom några dagar kändes vår hemsida tydligare. Kunder litade på oss direkt.',
                'Within days, our site felt clearer. Customers trusted us immediately.'
              )}&rdquo;
            </blockquote>
          </Reveal>
          
          <Reveal delay={0.2}>
            <cite className="text-sm text-muted-foreground not-italic">
              — Maria Lindberg, {t('Salongsägare', 'Salon Owner')}
            </cite>
          </Reveal>
        </div>
      </section>
      
      {/* ═══════════════════════════════════════════════════════════════
          SCROLL 6 — Choice Section (Split)
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-32 sm:py-40 px-6 sm:px-8 lg:px-16 border-t border-border/20">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            
            {/* Free concept */}
            <Reveal>
              <div className="space-y-6">
                <h3 className="text-2xl font-light">
                  {t('Få ett gratis koncept', 'Get a free concept')}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t(
                    'Se hur vi skulle designa din hemsida — innan du bestämmer dig.',
                    'See how we would design your site — before committing.'
                  )}
                </p>
                <Button 
                  asChild 
                  className="h-11 px-6 font-normal bg-foreground text-background hover:bg-foreground/90"
                  onClick={() => handleCTAClick('choice_concept')}
                >
                  <Link to="/demo">
                    {t('Starta med ett gratis koncept', 'Start with a free concept')}
                  </Link>
                </Button>
              </div>
            </Reveal>
            
            {/* Pricing */}
            <Reveal delay={0.2}>
              <div className="space-y-6">
                <h3 className="text-2xl font-light">
                  {t('Se priser', 'View pricing')}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t(
                    'Tydliga, transparenta paket. Inga merförsäljningar. Inga överraskningar.',
                    'Clear, transparent packages. No upsells. No surprises.'
                  )}
                </p>
                <Button 
                  asChild 
                  variant="outline"
                  className="h-11 px-6 font-normal border-border/50 hover:bg-secondary/50"
                  onClick={() => handleCTAClick('choice_pricing')}
                >
                  <Link to="/priser">
                    {t('Se priser', 'View pricing')}
                  </Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
      
      {/* ═══════════════════════════════════════════════════════════════
          SCROLL 7 — Guarantee
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 px-6 sm:px-8 lg:px-16 bg-secondary/10">
        <div className="max-w-xl mx-auto text-center">
          <Reveal>
            <h3 className="text-xl sm:text-2xl font-light mb-4">
              {t('100% nöjdhetsgaranti', '100% satisfaction guarantee')}
            </h3>
            <p className="text-muted-foreground">
              {t(
                'Om det inte känns rätt, fortsätter du inte. Så enkelt är det.',
                'If it\'s not right, you don\'t continue. Simple as that.'
              )}
            </p>
          </Reveal>
        </div>
      </section>
      
      {/* ═══════════════════════════════════════════════════════════════
          FINAL — Close
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-32 sm:py-40 px-6 sm:px-8 lg:px-16">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight leading-tight mb-4">
              {t('Design ska kännas självklart.', 'Design should feel obvious.')}
            </h2>
            <p className="text-xl text-muted-foreground font-extralight mb-12">
              {t(
                'Om det inte gör det, är det inte färdigt.',
                'If it doesn\'t, it isn\'t finished.'
              )}
            </p>
          </Reveal>
          
          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                size="lg" 
                className="h-12 px-8 font-normal bg-foreground text-background hover:bg-foreground/90"
                onClick={() => handleCTAClick('final_concept')}
              >
                <Link to="/demo">
                  {t('Få ett gratis koncept', 'Get a free concept')}
                </Link>
              </Button>
              
              <Button 
                asChild 
                size="lg"
                variant="ghost"
                className="h-12 px-8 font-normal text-muted-foreground hover:text-foreground"
                onClick={() => handleCTAClick('final_pricing')}
              >
                <Link to="/priser">
                  {t('Se priser', 'View pricing')}
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border/20">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground/60">
          <Link to="/" className="font-heading font-medium text-sm text-foreground">
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
