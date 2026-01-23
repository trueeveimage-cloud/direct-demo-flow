import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle2, Clock, Sparkles, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { trackEvent, getUtmParams } from '@/lib/posthog';

// Laptop mockup similar to the ad
function LaptopMockup() {
  return (
    <div className="relative mx-auto w-full max-w-2xl">
      {/* Laptop frame */}
      <div className="relative bg-gradient-to-b from-zinc-700 to-zinc-800 rounded-t-2xl p-2 shadow-2xl">
        {/* Screen bezel */}
        <div className="bg-zinc-900 rounded-lg overflow-hidden aspect-[16/10]">
          {/* Screen content - website preview */}
          <div className="w-full h-full bg-gradient-to-br from-background via-background to-accent/5 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                <div className="w-3 h-3 rounded-full bg-success/60" />
              </div>
              <div className="h-4 w-32 bg-muted/30 rounded-full" />
              <div className="flex gap-2">
                <div className="h-4 w-12 bg-muted/30 rounded" />
                <div className="h-4 w-12 bg-muted/30 rounded" />
              </div>
            </div>
            
            {/* Hero section preview */}
            <div className="text-center space-y-4">
              <div className="h-8 w-48 mx-auto bg-accent/20 rounded" />
              <div className="h-4 w-64 mx-auto bg-muted/20 rounded" />
              <div className="h-10 w-32 mx-auto bg-gradient-to-r from-amber-500 to-amber-400 rounded-lg mt-4" />
            </div>
            
            {/* Content blocks */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-muted/10 rounded-lg p-3 space-y-2">
                  <div className="h-3 w-full bg-muted/20 rounded" />
                  <div className="h-3 w-3/4 bg-muted/20 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Laptop base */}
      <div className="relative">
        <div className="h-4 bg-gradient-to-b from-zinc-700 to-zinc-600 rounded-b-lg mx-16" />
        <div className="h-2 bg-zinc-500 rounded-b-xl mx-8" />
      </div>
      
      {/* Glow effect */}
      <div className="absolute -inset-4 bg-accent/20 rounded-3xl blur-3xl -z-10" />
    </div>
  );
}

export default function CampaignLandingPage() {
  const { t, lang } = useLanguage();
  const [searchParams] = useSearchParams();
  const hasTracked = useRef(false);
  
  // Track campaign landing with UTM params
  useEffect(() => {
    if (hasTracked.current) return;
    hasTracked.current = true;
    
    const utmParams = getUtmParams();
    trackEvent('campaign_landing_view', {
      campaign_page: 'ad_landing',
      ...utmParams,
      // Also capture any custom params from URL
      ref: searchParams.get('ref') || undefined,
      ad_id: searchParams.get('ad_id') || undefined,
    });
  }, [searchParams]);
  
  // Price based on language (matching ad: 2900 SEK)
  const price = lang === 'sv' ? '2 900 kr' : '€290';
  const currency = lang === 'sv' ? 'SEK' : 'EUR';
  
  const features = [
    { icon: Zap, text: t('Leverans inom 14 dagar', 'Delivery in 14 days') },
    { icon: Shield, text: t('100% nöjd-garanti', '100% satisfaction guarantee') },
    { icon: CheckCircle2, text: t('Gratis koncept först', 'Free concept first') },
    { icon: Sparkles, text: t('Mobilanpassad design', 'Mobile-responsive design') },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-100px] left-[10%] w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px]" />
        <div className="absolute top-[200px] right-[5%] w-[400px] h-[400px] bg-accent/15 rounded-full blur-[100px]" />
      </div>
      
      {/* Header */}
      <header className="relative z-50 py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="font-heading font-extrabold text-3xl tracking-tighter">
            Nomia<span className="text-accent">.</span>
          </Link>
          <Button asChild variant="outline" size="sm">
            <Link to="/demo">
              {t('Få gratis koncept', 'Get free concept')}
            </Link>
          </Button>
        </div>
      </header>
      
      {/* Hero */}
      <main className="relative z-10 py-12 lg:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6 border border-accent/20">
                <Clock className="w-4 h-4" />
                {t('Begränsat erbjudande', 'Limited offer')}
              </div>
              
              {/* Main headline - matching ad */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
                {t('Din hemsida, snabbt och professionellt', 'Your website, fast and professional')}
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-lg">
                {t(
                  'Få en komplett, mobilanpassad hemsida designad för ditt företag. Inget krångel, bara resultat.',
                  'Get a complete, mobile-responsive website designed for your business. No hassle, just results.'
                )}
              </p>
              
              {/* Price highlight */}
              <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-accent/20 via-accent/10 to-transparent border border-accent/30 inline-block">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-muted-foreground">{t('Hemsida från', 'Website from')}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-accent">{price}</span>
                  <span className="text-muted-foreground">{t('engångsavgift', 'one-time')}</span>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  asChild 
                  variant="outline"
                  size="lg" 
                  className="border-accent/50 hover:bg-accent/10"
                >
                  <Link to="/demo">
                    {t('Få gratis prototyp', 'Get free prototype')}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-accent/50 hover:bg-accent/10">
                  <Link to="/bestall">
                    {t('Beställ direkt', 'Order directly')}
                  </Link>
                </Button>
              </div>
              
              {/* Features list */}
              <div className="grid grid-cols-2 gap-3">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <feature.icon className="w-4 h-4 text-accent shrink-0" />
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            
            {/* Right: Laptop mockup */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <LaptopMockup />
            </motion.div>
          </div>
        </div>
        
        {/* Trust section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl mx-auto px-6 mt-20"
        >
          <div className="text-center mb-8">
            <p className="text-sm text-muted-foreground uppercase tracking-wider">
              {t('Varför välja Nomia?', 'Why choose Nomia?')}
            </p>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                title: t('Gratis koncept', 'Free concept'),
                desc: t('Se din hemsida innan du betalar', 'See your website before you pay'),
              },
              {
                title: t('Snabb leverans', 'Fast delivery'),
                desc: t('Klar inom 2 veckor', 'Ready in 2 weeks'),
              },
              {
                title: t('Pengarna tillbaka', 'Money back'),
                desc: t('Om du inte gillar konceptet', 'If you don\'t like the concept'),
              },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 rounded-xl bg-muted/5 border border-border/50">
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Final CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="max-w-2xl mx-auto px-6 mt-20 text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {t('Redo att komma igång?', 'Ready to get started?')}
          </h2>
          <p className="text-muted-foreground mb-8">
            {t(
              'Få ett gratis designkoncept inom 72 timmar. Ingen risk.',
              'Get a free design concept within 72 hours. No risk.'
            )}
          </p>
          <Button 
            asChild 
            size="lg" 
            className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:via-amber-500 hover:to-yellow-600 text-background font-semibold shadow-lg shadow-amber-500/25"
          >
            <Link to="/demo">
              {t('Starta nu - det är gratis', 'Start now - it\'s free')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </main>
      
      {/* Minimal footer */}
      <footer className="relative z-10 py-8 border-t border-border/50 mt-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="font-heading font-bold text-foreground">
            Nomia<span className="text-accent">.</span>
          </div>
          <div className="flex gap-6">
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
