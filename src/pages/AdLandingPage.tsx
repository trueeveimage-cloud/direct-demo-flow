import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle2, Clock, Shield, Star, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { trackEvent, getUtmParams } from '@/lib/posthog';
import { useRemainingSpots } from '@/hooks/useRemainingSpots';
import { GrainOverlay } from '@/components/PremiumEffects';
import { MoneyBackGuarantee } from '@/components/MoneyBackGuarantee';

export default function AdLandingPage() {
  const { t, lang } = useLanguage();
  const [searchParams] = useSearchParams();
  const hasTracked = useRef(false);
  const { remainingSpots, isLoading: spotsLoading } = useRemainingSpots();
  
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
    <div className="min-h-screen bg-background overflow-hidden relative">
      <GrainOverlay />
      
      {/* Subtle background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-100px] left-[10%] w-[400px] h-[400px] bg-accent/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-100px] right-[10%] w-[300px] h-[300px] bg-accent/10 rounded-full blur-[80px]" />
      </div>
      
      {/* Header - Mobile-first, no overlap */}
      <header className="relative z-50 py-4 px-4 sm:py-6 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/" className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tighter hover:opacity-80 transition-opacity">
            Nomia<span className="text-accent">.</span>
          </Link>
        </div>
      </header>
      
      {/* Hero - Mobile-first, clear value prop */}
      <main className="relative z-10 pt-6 sm:pt-12 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          {/* Trust Block - Above the fold */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6"
          >
            {/* Sale Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white text-xs sm:text-sm font-bold shadow-lg">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              {t('25% RABATT', '25% OFF')}
            </div>
            
            {/* Spots Left - Real urgency */}
            {!spotsLoading && remainingSpots > 0 && remainingSpots <= 3 && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-500 text-xs sm:text-sm font-semibold border border-amber-500/30">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                {remainingSpots} {t('plats kvar', 'spot left')}
              </div>
            )}
          </motion.div>
          
          {/* Main Headline - Outcome-driven */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center mb-6"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-4">
              {t('Din hemsida.', 'Your website.')}
              <br />
              <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
                {t('Klar inom 7 dagar.', 'Ready in 7 days.')}
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto">
              {t(
                'Se designen gratis först. Betala bara om du gillar den.',
                'See the design free first. Only pay if you love it.'
              )}
            </p>
          </motion.div>
          
          {/* Primary CTA - ONE action */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-col items-center gap-3 mb-6"
          >
            <Button 
              asChild 
              size="lg" 
              className="w-full sm:w-auto h-14 px-8 sm:px-12 text-base sm:text-lg font-semibold bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:via-amber-500 hover:to-yellow-600 text-background shadow-xl shadow-amber-500/25 border-0"
              onClick={() => handleCTAClick('get_free_prototype')}
            >
              <Link to="/demo">
                {t('Få gratis prototyp', 'Get free prototype')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="ghost"
              size="sm" 
              className="text-muted-foreground hover:text-foreground"
              onClick={() => handleCTAClick('order_directly')}
            >
              <Link to="/bestall">
                {t('Eller beställ direkt →', 'Or order directly →')}
              </Link>
            </Button>
          </motion.div>
          
          {/* Price + Guarantee - Clear, no surprises */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-center mb-10"
          >
            <p className="text-sm text-muted-foreground mb-2">
              {t('Hemsidor från', 'Websites from')} <span className="font-bold text-foreground">{price}</span> {t('engångsavgift', 'one-time')}
            </p>
            <p className="text-xs text-muted-foreground">
              {priceWithVAT} · {t('Inga dolda avgifter', 'No hidden fees')}
            </p>
          </motion.div>
          
          {/* How It Works - 3 steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-center text-lg sm:text-xl font-semibold mb-6">
              {t('Så här fungerar det', 'How it works')}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  step: '1',
                  title: t('Beskriv din verksamhet', 'Describe your business'),
                  desc: t('5 min formulär', '5 min form'),
                },
                {
                  step: '2',
                  title: t('Få designförslag', 'Get design proposal'),
                  desc: t('Inom 72 timmar', 'Within 72 hours'),
                },
                {
                  step: '3',
                  title: t('Betala om du gillar den', 'Pay if you like it'),
                  desc: t('100% nöjd-garanti', '100% satisfaction'),
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-secondary/30 border border-border/50">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-accent">{item.step}</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-12"
          >
            <div className="p-5 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
              <div className="flex justify-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <blockquote className="text-center text-sm sm:text-base italic text-foreground mb-3">
                "{t(
                  'Inom 2 veckor hade vi 3x fler bokningar. Nomia levererade precis vad vi behövde.',
                  'Within 2 weeks we had 3x more bookings. Nomia delivered exactly what we needed.'
                )}"
              </blockquote>
              <cite className="block text-center text-xs text-muted-foreground not-italic">
                — Maria L., {t('Salongsägare', 'Salon Owner')}
              </cite>
            </div>
          </motion.div>
          
          {/* What's Included */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-center text-lg sm:text-xl font-semibold mb-4">
              {t('Vad som ingår', "What's included")}
            </h2>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                t('Mobilanpassad design', 'Mobile-responsive'),
                t('Kontaktformulär', 'Contact form'),
                t('SEO-optimerad', 'SEO optimized'),
                t('Snabb hosting', 'Fast hosting'),
                t('Obegränsade ändringar', 'Unlimited revisions'),
                t('Klar inom 7 dagar', 'Ready in 7 days'),
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Trust Elements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mb-10"
          >
            <MoneyBackGuarantee variant="full" />
          </motion.div>
          
          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            className="text-center"
          >
            <Button 
              asChild 
              size="lg" 
              className="w-full sm:w-auto h-14 px-8 sm:px-12 text-base sm:text-lg font-semibold bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:via-amber-500 hover:to-yellow-600 text-background shadow-xl shadow-amber-500/25 border-0"
              onClick={() => handleCTAClick('final_cta')}
            >
              <Link to="/demo">
                {t('Starta nu – det är gratis', "Start now – it's free")}
                <ArrowRight className="w-5 h-5 ml-2" />
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
        </div>
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
