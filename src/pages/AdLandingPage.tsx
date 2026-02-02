import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle2, Clock, Shield, Star, Sparkles, Zap, Award, BadgeCheck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, useInView } from 'framer-motion';
import { trackEvent, getUtmParams } from '@/lib/posthog';
import { useRemainingSpots } from '@/hooks/useRemainingSpots';
import { CountdownTimer } from '@/components/CountdownTimer';
import { useIsMobile } from '@/hooks/use-mobile';

// Simple fade-up animation for mobile-friendly performance
function RevealSection({ children, className = '', delay = 0 }: { 
  children: React.ReactNode; 
  className?: string; 
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function AdLandingPage() {
  const { t, lang } = useLanguage();
  const [searchParams] = useSearchParams();
  const hasTracked = useRef(false);
  const { remainingSpots, isLoading: spotsLoading } = useRemainingSpots();
  const isMobile = useIsMobile();
  
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
    <div className="min-h-screen bg-background overflow-hidden">
      
      {/* Minimal Header - Mobile optimized */}
      <header className="sticky top-0 z-50 py-4 px-4 sm:px-6 bg-background/80 backdrop-blur-md border-b border-border/20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="font-heading font-extrabold text-xl sm:text-2xl tracking-tighter">
            Nomia<span className="text-accent">.</span>
          </Link>
          
          {/* Urgency indicator - compact on mobile */}
          {!spotsLoading && remainingSpots > 0 && remainingSpots <= 3 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
              </span>
              <span className="text-[10px] sm:text-xs font-medium text-amber-400">
                {remainingSpots} {t('kvar', 'left')}
              </span>
            </motion.div>
          )}
        </div>
      </header>
      
      {/* ========== HERO SECTION - Mobile First ========== */}
      <section className="relative px-4 sm:px-6 pt-8 sm:pt-16 pb-12 sm:pb-20">
        {/* Subtle gradient background - no overlapping orbs */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative max-w-3xl mx-auto text-center">
          
          {/* Sale Badge - Compact */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-semibold">
              <Sparkles className="w-3 h-3" />
              {t('25% RABATT', '25% OFF')}
            </span>
          </motion.div>
          
          {/* Main Headline - Mobile optimized sizing */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-4 sm:mb-6"
          >
            <span className="text-foreground">{t('Hemsidor som', 'Websites that')}</span>
            <br />
            <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              {t('säljer.', 'sell.')}
            </span>
          </motion.h1>
          
          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto mb-8 px-2"
          >
            {t(
              'Se designen gratis innan du bestämmer dig. Leverans inom 7 dagar.',
              'See the design free before you decide. Delivery within 7 days.'
            )}
          </motion.p>
          
          {/* CTA Buttons - Stacked on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-3 mb-6 max-w-sm mx-auto"
          >
            <Button 
              asChild 
              size="lg" 
              className="w-full h-14 text-base font-semibold bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:via-amber-500 hover:to-yellow-600 text-background shadow-lg shadow-amber-500/20 border-0"
              onClick={() => handleCTAClick('hero_prototype')}
            >
              <Link to="/demo">
                {t('Få gratis prototyp', 'Get free prototype')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            
            <Button 
              asChild 
              size="lg"
              variant="outline"
              className="w-full h-12 font-medium border-border/50 hover:bg-secondary/50"
              onClick={() => handleCTAClick('hero_order')}
            >
              <Link to="/bestall">
                {t('Beställ direkt', 'Order directly')}
              </Link>
            </Button>
          </motion.div>
          
          {/* Price & Trust - Horizontal on mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-4 text-sm text-muted-foreground"
          >
            <span>{t('Från', 'From')} <strong className="text-foreground">{price}</strong></span>
            <span className="w-px h-3 bg-border" />
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-green-500" />
              {t('Nöjd-garanti', 'Money-back')}
            </span>
          </motion.div>
        </div>
      </section>
      
      {/* ========== SOCIAL PROOF BAR - Cleaner grid ========== */}
      <section className="py-6 sm:py-8 border-y border-border/20 bg-secondary/30">
        <div className="max-w-lg mx-auto px-4">
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { value: '50+', label: t('Kunder', 'Clients') },
              { value: '4.9', label: t('Betyg', 'Rating'), icon: Star },
              { value: '7', label: t('Dagar', 'Days') },
              { value: '100%', label: t('Garanti', 'Guarantee'), color: 'text-green-500' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <p className={`text-xl sm:text-2xl font-bold ${item.color || 'text-accent'}`}>
                  {item.value}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-0.5">
                  {item.icon && <item.icon className="w-2.5 h-2.5 fill-accent text-accent" />}
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* ========== HOW IT WORKS - Clean cards ========== */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <RevealSection className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              {t('Enkelt. Snabbt. Utan risk.', 'Simple. Fast. Risk-free.')}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              {t('Tre steg till din nya hemsida', 'Three steps to your new website')}
            </p>
          </RevealSection>
          
          <div className="space-y-4">
            {[
              {
                step: '01',
                title: t('Berätta om dig', 'Tell us about you'),
                desc: t('Fyll i ett kort formulär. Tar 5 minuter.', 'Fill out a short form. Takes 5 minutes.'),
                icon: Users,
              },
              {
                step: '02',
                title: t('Se din design', 'See your design'),
                desc: t('Vi skapar en unik prototyp inom 72 timmar. Helt gratis.', 'We create a unique prototype within 72 hours. Completely free.'),
                icon: Sparkles,
              },
              {
                step: '03',
                title: t('Betala om du älskar den', 'Pay if you love it'),
                desc: t('Ingen risk. Pengarna tillbaka om du inte är nöjd.', 'No risk. Money back if not satisfied.'),
                icon: Shield,
              },
            ].map((item, i) => (
              <RevealSection key={i} delay={i * 0.1}>
                <div className="relative p-5 sm:p-6 rounded-2xl bg-secondary/40 border border-border/30">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent/15 flex items-center justify-center">
                      <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-accent/60">{item.step}</span>
                        <h3 className="text-base sm:text-lg font-semibold">{item.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>
      
      {/* ========== TESTIMONIAL - Clean card ========== */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-xl mx-auto">
          <RevealSection>
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-accent/10 via-accent/5 to-transparent border border-accent/20">
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              
              <blockquote className="text-base sm:text-lg font-light italic leading-relaxed mb-5 text-foreground/90">
                &quot;{t(
                  'Inom 4 dagar hade vi 3x fler bokningar. Nomia förstod exakt vad vi behövde.',
                  'Within 4 days we had 3x more bookings. Nomia understood exactly what we needed.'
                )}&quot;
              </blockquote>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <BadgeCheck className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <cite className="not-italic font-medium text-sm">Maria Lindberg</cite>
                  <p className="text-xs text-muted-foreground">{t('Salongsägare', 'Salon Owner')}</p>
                </div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>
      
      {/* ========== WHAT'S INCLUDED - Compact list ========== */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-secondary/20">
        <div className="max-w-lg mx-auto">
          <RevealSection className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              {t('Allt ingår', 'Everything included')}
            </h2>
          </RevealSection>
          
          <div className="grid grid-cols-1 gap-2.5">
            {[
              t('Mobilanpassad design', 'Mobile-responsive design'),
              t('SEO-optimerad', 'SEO optimized'),
              t('Snabb hosting', 'Fast hosting'),
              t('SSL-certifikat', 'SSL certificate'),
              t('Kontaktformulär', 'Contact form'),
              t('Obegränsade ändringar', 'Unlimited revisions'),
              t('Klar inom 7 dagar', 'Ready in 7 days'),
              t('Support ingår', 'Support included'),
            ].map((item, i) => (
              <RevealSection key={i} delay={i * 0.03}>
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-background/60 border border-border/30">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>
      
      {/* ========== GUARANTEE ========== */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-md mx-auto">
          <RevealSection>
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent border border-green-500/20 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-500/15 mb-4">
                <Award className="w-7 h-7 text-green-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-green-400">
                {t('100% Nöjd-garanti', '100% Satisfaction Guarantee')}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(
                  'Full återbetalning om du inte är nöjd. Ingen risk för dig.',
                  'Full refund if not satisfied. Zero risk for you.'
                )}
              </p>
            </div>
          </RevealSection>
        </div>
      </section>
      
      {/* ========== FINAL CTA ========== */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-gradient-to-t from-accent/5 to-transparent">
        <div className="max-w-md mx-auto text-center">
          <RevealSection>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              {t('Redo att komma igång?', 'Ready to get started?')}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              {t(
                'Få din gratis prototyp idag.',
                'Get your free prototype today.'
              )}
            </p>
            
            {/* Countdown Timer - Compact */}
            <div className="mb-6">
              <CountdownTimer variant="compact" className="justify-center" />
            </div>
            
            <Button 
              asChild 
              size="lg" 
              className="w-full max-w-xs h-14 text-base font-semibold bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:via-amber-500 hover:to-yellow-600 text-background shadow-lg shadow-amber-500/20 border-0"
              onClick={() => handleCTAClick('final_cta')}
            >
              <Link to="/demo">
                {t('Starta nu – gratis', "Start now – free")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            
            <div className="flex items-center justify-center gap-3 mt-5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                72h
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-green-500" />
                {t('Ingen risk', 'No risk')}
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-accent" />
                {t('Gratis', 'Free')}
              </span>
            </div>
          </RevealSection>
        </div>
      </section>
      
      {/* Footer - Minimal */}
      <footer className="py-6 px-4 border-t border-border/20">
        <div className="max-w-lg mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <Link to="/" className="font-heading font-bold text-base">
            Nomia<span className="text-accent">.</span>
          </Link>
          <div className="flex items-center gap-4">
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
