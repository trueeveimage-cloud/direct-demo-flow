import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
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
      
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-accent/8 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="relative z-10 max-w-3xl mx-auto text-center px-5 py-16">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <Link to="/" className="font-heading font-bold text-2xl tracking-tight">
            Nomia<span className="text-accent">.</span>
          </Link>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extralight tracking-tight mb-6"
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
          className="text-lg sm:text-xl text-muted-foreground font-light mb-12 max-w-xl mx-auto"
        >
          {t(
            'Se din design först. Betala bara om du älskar den.',
            'See your design first. Pay only if you love it.'
          )}
        </motion.p>
        
        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-5"
        >
          {/* Order Now */}
          <Button
            asChild
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-base sm:text-lg font-medium rounded-full shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300 min-h-[56px]"
            onClick={() => handleCTAClick('hero_order')}
          >
            <Link to="/bestall">
              {t('Beställ nu', 'Order now')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>

          {/* Get free concept */}
          <Button
            asChild
            variant="outline"
            size="lg"
            className="px-8 py-6 text-base sm:text-lg font-medium rounded-full border-accent/40 hover:border-accent hover:bg-accent/10 transition-all duration-300 min-h-[56px]"
            onClick={() => handleCTAClick('hero_concept')}
          >
            <Link to="/demo">
              {t('Få gratis koncept', 'Get free concept')}
            </Link>
          </Button>
        </motion.div>

        {/* Price indicator */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-sm text-muted-foreground mb-10"
        >
          {lang === 'sv' ? 'Från 2 900 kr' : 'From $290'}
        </motion.p>
        
        {/* Read more link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <Link 
            to="/mer-info"
            onClick={() => handleCTAClick('hero_read_more')}
            className="text-sm text-muted-foreground hover:text-accent transition-colors duration-300 underline underline-offset-4 decoration-border hover:decoration-accent"
          >
            {t('Läs mer', 'Read more')}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
