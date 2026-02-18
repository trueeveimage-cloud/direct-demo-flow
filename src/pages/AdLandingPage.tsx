import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { trackEvent, trackFunnelEvent, getUtmParams } from '@/lib/posthog';
import { ArrowRight, Shield, Clock, Star } from 'lucide-react';
import { GrainOverlay } from '@/components/PremiumEffects';
import { SEOHead } from '@/components/SEOHead';

export default function AdLandingPage() {
  const { t, lang } = useLanguage();
  const hasTracked = useRef(false);
  
  useEffect(() => {
    if (hasTracked.current) return;
    hasTracked.current = true;
    trackEvent('ad_landing_view', { campaign_page: 'ad_landing', ...getUtmParams() });
    trackFunnelEvent('LANDING_VIEW', { source: 'ad_page', ...getUtmParams() });
  }, []);

  const handleCTAClick = (button: string) => {
    trackEvent('ad_cta_click', { button, page: '/ad', ...getUtmParams() });
    if (button.includes('order')) {
      trackFunnelEvent('DEMO_REQUEST', { source: 'ad_page', cta: button, ...getUtmParams() });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center relative overflow-hidden">
      <SEOHead 
        title={t('Webbsidor som konverterar | Nomia', 'Websites that convert | Nomia')}
        description={t('Se din design först. Betala bara om du älskar den.', 'See your design first. Pay only if you love it.')}
      />
      <GrainOverlay />
      
      {/* Layered gold ambient glows for depth */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[700px] bg-accent/12 rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[400px] bg-accent/8 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[350px] h-[350px] bg-accent/6 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-20 right-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: 'linear-gradient(hsl(var(--accent)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--accent)) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      
      <div className="relative z-10 w-full max-w-sm mx-auto text-center px-5 py-10">
        {/* Top bar: Logo + Read more */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-14"
        >
          <Link to="/" className="font-heading font-bold text-2xl tracking-tight">
            Nomia<span className="text-accent">.</span>
          </Link>
          <Link 
            to="/mer-info" 
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors duration-300"
            onClick={() => handleCTAClick('topbar_read_more')}
          >
            {t('Läs mer', 'Read more')}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        {/* Social proof micro-signal */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="flex items-center justify-center gap-1.5 mb-6"
        >
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-accent text-accent" />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">{t('50+ nöjda kunder', '50+ happy clients')}</span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-5xl font-extralight tracking-tight mb-4 leading-[1.1]"
        >
          {t('Din hemsida.', 'Your website.')}{' '}
          <span className="text-accent">{t('Klar på 7 dagar.', 'Ready in 7 days.')}</span>
        </motion.h1>
        
        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-sm sm:text-base text-muted-foreground font-light mb-8 max-w-xs mx-auto leading-relaxed"
        >
          {t(
            'Professionell design som faktiskt konverterar — med pengarna-tillbaka-garanti.',
            'Professional design that actually converts — with a money-back guarantee.'
          )}
        </motion.p>
        
        {/* PRIMARY CTA: Order now — big gold, conversion-first */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-2 max-w-xs mx-auto"
        >
          <Link
            to="/bestall"
            onClick={() => handleCTAClick('hero_order')}
            className="group relative flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-4 text-base font-semibold rounded-2xl shadow-xl shadow-accent/30 hover:shadow-2xl hover:shadow-accent/40 transition-all duration-300 overflow-hidden"
          >
            {/* Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="flex flex-col items-center leading-tight relative z-10">
              <span className="text-base font-semibold">{t('Beställ nu', 'Order now')}</span>
              <span className="text-[11px] font-normal opacity-80">{lang === 'sv' ? 'Från 2 900 kr' : 'From $290'}</span>
            </span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform relative z-10" />
          </Link>

          {/* Secondary: free concept */}
          <Link
            to="/demo"
            onClick={() => handleCTAClick('hero_concept')}
            className="group flex items-center justify-center gap-2 border border-accent/40 hover:border-accent/70 hover:bg-accent/8 text-foreground px-6 py-3.5 text-sm font-medium rounded-2xl transition-all duration-300"
          >
            {t('Få gratis koncept först', 'Get free concept first')}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        {/* Trust signals row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-center gap-4 mt-6"
        >
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Shield className="w-3 h-3 text-accent" />
            {t('Pengarna tillbaka', 'Money-back')}
          </div>
          <span className="text-muted-foreground/30 text-xs">|</span>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock className="w-3 h-3 text-accent" />
            {t('Klar på 7 dagar', 'Done in 7 days')}
          </div>
          <span className="text-muted-foreground/30 text-xs">|</span>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Star className="w-3 h-3 text-accent" />
            {t('50+ kunder', '50+ clients')}
          </div>
        </motion.div>

        {/* Scarcity */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="mt-5"
        >
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/70">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            {t('Endast 3 platser kvar denna vecka', 'Only 3 spots left this week')}
          </span>
        </motion.div>
      </div>
    </div>
  );
}
