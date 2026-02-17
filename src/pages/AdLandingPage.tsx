import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { trackEvent, trackFunnelEvent, getUtmParams } from '@/lib/posthog';
import { ArrowRight } from 'lucide-react';
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
    if (button.includes('concept')) {
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
      
      {/* Gold ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[600px] bg-accent/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-accent/6 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-2xl mx-auto text-center px-5 py-12">
        {/* Top bar: Logo + Read more */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-16 sm:mb-20"
        >
          <Link to="/" className="font-heading font-bold text-2xl tracking-tight">
            Nomia<span className="text-accent">.</span>
          </Link>
          <Link 
            to="/mer-info" 
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors duration-300"
            onClick={() => handleCTAClick('topbar_read_more')}
          >
            {t('Läs mer', 'Read more')}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extralight tracking-tight mb-5 leading-[1.1]"
        >
          {t(
            'Webbsidor som gör besökare till kunder.',
            'Websites that turn visitors into customers.'
          )}
        </motion.h1>
        
        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-base sm:text-lg text-muted-foreground font-light mb-10 max-w-md mx-auto"
        >
          {t(
            'Se din design först. Betala bara om du älskar den.',
            'See your design first. Pay only if you love it.'
          )}
        </motion.p>
        
        {/* CTA Buttons - tighter, unified gold */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-2.5 max-w-xs mx-auto"
        >
          {/* Get free concept - primary */}
          <Link
            to="/demo"
            onClick={() => handleCTAClick('hero_concept')}
            className="group flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-4 text-base font-medium rounded-full shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/35 transition-all duration-300"
          >
            <span className="flex flex-col items-center leading-tight">
              <span>{t('Få gratis koncept', 'Get free concept')}</span>
              <span className="text-[11px] font-normal opacity-75">{lang === 'sv' ? 'Från 2 900 kr' : 'From $290'}</span>
            </span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          {/* Order Now */}
          <Link
            to="/bestall"
            onClick={() => handleCTAClick('hero_order')}
            className="group flex items-center justify-center gap-2 bg-accent/80 hover:bg-accent/90 text-accent-foreground px-6 py-3.5 text-sm font-medium rounded-full shadow-md shadow-accent/15 hover:shadow-lg hover:shadow-accent/25 transition-all duration-300"
          >
            {t('Beställ nu', 'Order now')}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          {/* Read more */}
          <Link
            to="/mer-info"
            onClick={() => handleCTAClick('hero_read_more')}
            className="group flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-accent py-2 transition-colors duration-300"
          >
            {t('Läs mer om oss', 'Learn more about us')}
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
