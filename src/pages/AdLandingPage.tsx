import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { trackEvent, getUtmParams } from '@/lib/posthog';
import { ArrowRight, Check, Shield, Zap, Smartphone, Star } from 'lucide-react';
import { GrainOverlay } from '@/components/PremiumEffects';
import { useRemainingSpots } from '@/hooks/useRemainingSpots';
import { SEOHead } from '@/components/SEOHead';

// Before/After images
import beforeImage from '@/assets/before-swedencar.png';
import afterImage from '@/assets/after-swedencar.png';

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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEOHead 
        title={t('Webbsidor som konverterar | Nomia', 'Websites that convert | Nomia')}
        description={t('Se din design först. Betala bara om du älskar den.', 'See your design first. Pay only if you love it.')}
      />
      <GrainOverlay />
      
      <HeroSection onCTAClick={handleCTAClick} />
      <ProblemSection />
      <SolutionSection />
      <TrustSection />
      <ProofSection />
      <PricingSection onCTAClick={handleCTAClick} />
      <UrgencySection />
      <FinalCTASection onCTAClick={handleCTAClick} />
    </div>
  );
}

// ============================================
// HERO SECTION - Emotional hook
// ============================================
function HeroSection({ onCTAClick }: { onCTAClick: (button: string) => void }) {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="relative min-h-[90vh] flex items-center justify-center py-20 px-4 sm:px-6">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Link to="/" className="font-heading font-bold text-2xl tracking-tight">
            Nomia<span className="text-accent">.</span>
          </Link>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extralight tracking-tight mb-6"
        >
          {t(
            'Webbsidor som gor besokare till kunder.',
            'Websites that turn visitors into customers.'
          )}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-lg sm:text-xl text-muted-foreground font-light mb-10 max-w-2xl mx-auto"
        >
          {t(
            'Se din design forst. Betala bara om du alskar den.',
            'See your design first. Pay only if you love it.'
          )}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
        >
          <Button
            asChild
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-base font-medium rounded-full shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300"
            onClick={() => onCTAClick('hero_concept')}
          >
            <Link to="/gratis-demo">
              {t('Fa gratis koncept', 'Get free concept')}
            </Link>
          </Button>
          
          <Button
            asChild
            variant="outline"
            size="lg"
            className="px-8 py-6 text-base font-medium rounded-full border-border/50 hover:border-accent/50 hover:bg-secondary/50 transition-all duration-300"
            onClick={() => onCTAClick('hero_pricing')}
          >
            <Link to="/priser">
              {t('Se priser', 'View pricing')}
            </Link>
          </Button>
        </motion.div>
        
        {/* Trust micro-line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-muted-foreground"
        >
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-accent" />
            {t('Gratis koncept', 'Free concept')}
          </span>
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-accent" />
            {t('Ingen risk', 'No risk')}
          </span>
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-accent" />
            {t('Avbryt nar som helst', 'Cancel anytime')}
          </span>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// PROBLEM SECTION - Make them feel understood
// ============================================
function ProblemSection() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const problems = [
    t('Besokare lamnar utan att kontakta dig', 'Visitors leave without contacting you'),
    t('Du far trafik, men inga bokningar', 'You get traffic, but no bookings'),
    t('Din sida bygger inte fortroende', 'Your site does not build trust'),
  ];

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-background to-background" />
      
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-3xl sm:text-4xl font-light tracking-tight mb-6">
              {t(
                'De flesta smaforetagshemsidor ser bra ut.',
                'Most small business websites look fine.'
              )}
              <br />
              <span className="text-muted-foreground">
                {t('Men de konverterar inte.', 'But they do not convert.')}
              </span>
            </h2>
            
            <ul className="space-y-4 mb-8">
              {problems.map((problem, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="flex items-start gap-3 text-muted-foreground"
                >
                  <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0" />
                  {problem}
                </motion.li>
              ))}
            </ul>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg font-light"
            >
              {t(
                'En battre webbsida ser inte bara bra ut. Den saljer at dig.',
                'A better website does not just look good. It sells for you.'
              )}
            </motion.p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-2xl bg-secondary/30 border border-border/30 overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-8">
                  <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4">
                    <ArrowRight className="w-6 h-6 text-accent" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('Transformation borjar har', 'Transformation starts here')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// SOLUTION SECTION - What you actually do
// ============================================
function SolutionSection() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      number: '01',
      title: t('Beratta om din verksamhet', 'Tell us about your business'),
      description: t('5 minuter, helt gratis', '5 minutes, completely free'),
    },
    {
      number: '02',
      title: t('Vi designar din webbsida', 'We design your website'),
      description: t('Gratis koncept inom 72 timmar', 'Free concept in 72 hours'),
    },
    {
      number: '03',
      title: t('Du godkanner, vi lanserar', 'You approve, we launch'),
      description: t('Betala endast om du alskar det', 'Pay only if you love it'),
    },
  ];

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 relative">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight mb-4">
            {t(
              'Vi designar konverteringsfokuserade webbsidor.',
              'We design conversion-focused websites.'
            )}
          </h2>
          <p className="text-lg text-muted-foreground font-light max-w-2xl mx-auto">
            {t(
              'Du ser hela designen forst. Du betalar bara om du alskar den.',
              'You see the full design first. You only pay if you love it.'
            )}
          </p>
        </motion.div>

        {/* Steps with connecting line */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-12 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
                className="text-center relative group"
              >
                {/* Step number with hover glow */}
                <div className="relative inline-flex mb-6">
                  <div className="absolute -inset-4 bg-accent/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative w-20 h-20 rounded-full bg-secondary/50 border border-border/50 flex items-center justify-center group-hover:border-accent/30 transition-colors duration-300">
                    <span className="text-2xl font-light text-accent">{step.number}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-medium mb-2 group-hover:text-accent transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// TRUST SECTION - Why trust you? (CRITICAL)
// ============================================
function TrustSection() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const trustItems = [
    {
      icon: Star,
      title: t('50+ nojda foretag', '50+ happy businesses'),
      description: t('Beprovad kvalitet', 'Proven quality'),
    },
    {
      icon: Shield,
      title: t('100% pengarna tillbaka', '100% money-back guarantee'),
      description: t('Ingen risk for dig', 'No risk for you'),
    },
    {
      icon: Zap,
      title: t('Snabb leverans', 'Fast delivery'),
      description: t('Klar inom 7 dagar', 'Ready in 7 days'),
    },
    {
      icon: Smartphone,
      title: t('Mobilanpassad och SEO-redo', 'Mobile-first, SEO-ready'),
      description: t('Optimerad for alla enheter', 'Optimized for all devices'),
    },
  ];

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />
      
      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight">
            {t('Varfor lita pa oss?', 'Why trust us?')}
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
              className="group p-6 rounded-2xl bg-secondary/30 border border-border/30 hover:border-accent/20 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors duration-300">
                <item.icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-medium mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-10 text-muted-foreground"
        >
          {t('Inga kontrakt. Ingen risk. Inga overraskningar.', 'No contracts. No risk. No surprises.')}
        </motion.p>
      </div>
    </section>
  );
}

// ============================================
// PROOF SECTION - Show, don't tell
// ============================================
function ProofSection() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const cases = [
    {
      result: t('+3x fler bokningar pa 4 dagar', '+3x more bookings in 4 days'),
      business: t('Frisorsalong', 'Hair Salon'),
      quote: t(
        'Kunderna sager att det ar sa enkelt att boka nu.',
        'Customers say it is so easy to book now.'
      ),
      author: 'Gail',
    },
    {
      result: t('200% okning i besokare', '200% increase in visitors'),
      business: t('Bilhandlare', 'Car Dealer'),
      quote: t(
        'Forvandlingen var otrolig. Nagot vi ar stolta over att visa.',
        'The transformation was incredible. Something we are proud to show.'
      ),
      author: 'Erik',
    },
  ];

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 relative">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight">
            {t('Resultat som talar', 'Results that speak')}
          </h2>
        </motion.div>

        {/* Before/After comparison */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <div className="grid md:grid-cols-2 gap-4 p-2 rounded-2xl bg-secondary/20 border border-border/30">
            <div className="relative rounded-xl overflow-hidden">
              <img src={beforeImage} alt="Before" className="w-full h-auto" />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs font-medium">
                {t('Fore', 'Before')}
              </div>
            </div>
            <div className="relative rounded-xl overflow-hidden">
              <img src={afterImage} alt="After" className="w-full h-auto" />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">
                {t('Efter', 'After')}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Case cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {cases.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
              className="p-6 rounded-2xl bg-secondary/30 border border-border/30"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-accent font-medium">{item.result}</span>
                <span className="text-muted-foreground text-sm">/ {item.business}</span>
              </div>
              <p className="text-muted-foreground italic mb-4">"{item.quote}"</p>
              <p className="text-sm font-medium">- {item.author}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// PRICING SECTION - Simple, calm, not aggressive
// ============================================
function PricingSection({ onCTAClick }: { onCTAClick: (button: string) => void }) {
  const { t, lang } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    t('Upp till 3 sidor', 'Up to 3 pages'),
    t('Mobilanpassad', 'Mobile responsive'),
    t('Grundlaggande SEO', 'Basic SEO'),
    t('Revisioner inkluderade', 'Revisions included'),
    t('Lansering + genomgang', 'Launch + walkthrough'),
  ];

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />
      
      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight mb-4">
            {t('Enkel och transparent prissattning', 'Simple, transparent pricing')}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="p-8 rounded-3xl bg-secondary/30 border border-border/30"
        >
          <div className="text-center mb-8">
            <p className="text-sm text-muted-foreground mb-2">{t('Webbsida fran', 'Website from')}</p>
            <p className="text-5xl font-light">
              {lang === 'sv' ? '2 900 kr' : '$290'}
            </p>
            <p className="text-sm text-muted-foreground mt-2">{t('engangsbetalning', 'one-time payment')}</p>
          </div>

          <ul className="space-y-3 mb-8">
            {features.map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-muted-foreground">
                <Check className="w-4 h-4 text-accent flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              asChild
              className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground py-6 rounded-full"
              onClick={() => onCTAClick('pricing_concept')}
            >
              <Link to="/gratis-demo">
                {t('Fa gratis koncept', 'Get free concept')}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1 py-6 rounded-full border-border/50 hover:border-accent/50"
              onClick={() => onCTAClick('pricing_packages')}
            >
              <Link to="/priser">
                {t('Se alla paket', 'View all packages')}
              </Link>
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6 flex items-center justify-center gap-2">
            <Shield className="w-4 h-4 text-accent" />
            {t('Du betalar inte forran du godkant designen.', 'You do not pay until you approve the design.')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// URGENCY SECTION - Classy, not aggressive
// ============================================
function UrgencySection() {
  const { t } = useLanguage();
  const { remainingSpots } = useRemainingSpots();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-2xl mx-auto text-center"
      >
        <p className="text-muted-foreground mb-2">
          {t(
            'Begransade platser varje vecka for att sakerstalla kvalitet.',
            'Limited spots each week to keep quality high.'
          )}
        </p>
        <p className="text-lg">
          <span className="text-accent font-medium">{remainingSpots}</span>
          {' '}
          {t('plats kvar denna vecka', 'spot available this week')}
        </p>
      </motion.div>
    </section>
  );
}

// ============================================
// FINAL CTA SECTION - Decision moment
// ============================================
function FinalCTASection({ onCTAClick }: { onCTAClick: (button: string) => void }) {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-t from-secondary/20 via-background to-background" />
      
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight mb-8"
        >
          {t('Redo att se din webbsida?', 'Ready to see your website?')}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
        >
          <Button
            asChild
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground px-10 py-6 text-base font-medium rounded-full shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300"
            onClick={() => onCTAClick('final_concept')}
          >
            <Link to="/gratis-demo">
              {t('Fa mitt gratis koncept', 'Get my free concept')}
            </Link>
          </Button>
          
          <Button
            asChild
            variant="outline"
            size="lg"
            className="px-10 py-6 text-base font-medium rounded-full border-border/50 hover:border-accent/50 hover:bg-secondary/50 transition-all duration-300"
            onClick={() => onCTAClick('final_pricing')}
          >
            <Link to="/priser">
              {t('Se priser', 'View pricing')}
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-muted-foreground"
        >
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-accent" />
            {t('Tar 5 minuter', 'Takes 5 minutes')}
          </span>
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-accent" />
            {t('Ingen betalning kravs', 'No payment required')}
          </span>
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-accent" />
            {t('Ingen risk', 'No risk')}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
