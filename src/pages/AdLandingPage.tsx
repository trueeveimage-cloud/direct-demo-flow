import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, Clock, Sparkles, Shield, Zap, Star, Users, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { trackEvent, getUtmParams } from '@/lib/posthog';
import { useRemainingSpots } from '@/hooks/useRemainingSpots';
import { GrainOverlay, FloatingParticles } from '@/components/PremiumEffects';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AdLandingPage() {
  const { t, lang } = useLanguage();
  const [searchParams] = useSearchParams();
  const hasTracked = useRef(false);
  const { remainingSpots, isLoading: spotsLoading } = useRemainingSpots();
  const [showSpotsDialog, setShowSpotsDialog] = useState(false);
  
  // Track campaign landing with UTM params
  useEffect(() => {
    if (hasTracked.current) return;
    hasTracked.current = true;
    
    const utmParams = getUtmParams();
    trackEvent('ad_landing_view', {
      campaign_page: 'high_conversion_landing',
      ...utmParams,
      ref: searchParams.get('ref') || undefined,
      ad_id: searchParams.get('ad_id') || undefined,
    });
  }, [searchParams]);
  
  // Price based on language
  const price = lang === 'sv' ? '2 900 kr' : '$290';

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      <GrainOverlay />
      <FloatingParticles count={12} />
      
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-150px] left-[5%] w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px]" />
        <div className="absolute top-[100px] right-[0%] w-[500px] h-[500px] bg-accent/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-100px] left-[30%] w-[400px] h-[400px] bg-accent/10 rounded-full blur-[80px]" />
      </div>
      
      {/* Header */}
      <header className="relative z-50 py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="font-heading font-extrabold text-3xl tracking-tighter hover:opacity-80 transition-opacity cursor-pointer">
            Nomia<span className="text-accent">.</span>
          </Link>
          <Button asChild variant="outline" size="sm" className="border-accent/50 hover:bg-accent/10">
            <Link to="/demo">
              {t('Få gratis prototyp', 'Get free prototype')}
            </Link>
          </Button>
        </div>
      </header>
      
      {/* Hero */}
      <main className="relative z-10 pt-8 lg:pt-16 pb-12">
        <div className="max-w-5xl mx-auto px-6">
          {/* Urgency Badge - Clickable */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center gap-3 mb-8"
          >
            <Dialog open={showSpotsDialog} onOpenChange={setShowSpotsDialog}>
              <DialogTrigger asChild>
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent/20 to-accent/30 text-accent text-sm font-semibold backdrop-blur-sm border border-accent/40 hover:border-accent/60 transition-all cursor-pointer shadow-lg shadow-accent/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                  </span>
                  {spotsLoading ? (
                    <span className="animate-pulse">{t('Laddar...', 'Loading...')}</span>
                  ) : remainingSpots > 0 ? (
                    <span className="font-bold">{remainingSpots} {remainingSpots === 1 ? t('plats kvar', 'spot left') : t('platser kvar', 'spots left')}</span>
                  ) : (
                    <span className="text-warning font-bold">{t('Fullbokat', 'Fully booked')}</span>
                  )}
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-accent">
                    <Calendar className="w-5 h-5" />
                    {t('Veckans platser', 'Weekly Spots')}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <p className="text-muted-foreground">
                    {t(
                      'Vi tar endast emot 7 nya koncept per vecka för att säkerställa högsta kvalitet på varje design.',
                      'We only accept 7 new concepts per week to ensure the highest quality for each design.'
                    )}
                  </p>
                  <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                    <div className="text-center mb-4">
                      <span className="text-4xl font-bold text-accent">{remainingSpots}</span>
                      <span className="text-lg text-muted-foreground ml-2">{remainingSpots === 1 ? t('plats kvar', 'spot left') : t('platser kvar', 'spots left')}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      {[...Array(7)].map((_, i) => (
                        <div 
                          key={i}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            i < (7 - remainingSpots) 
                              ? 'bg-accent/30 text-accent/50' 
                              : 'bg-accent text-accent-foreground'
                          }`}
                        >
                          {i < (7 - remainingSpots) ? '✓' : i + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 text-muted-foreground text-sm font-medium backdrop-blur-sm border border-border/50">
              <Clock className="w-4 h-4" />
              {t('Klar inom 72h', 'Ready in 72h')}
            </div>
          </motion.div>
          
          {/* Main Headline - Results focused */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
              {t(
                'Förvandla besökare till',
                'Turn visitors into'
              )}
              <br />
              <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
                {t('betalande kunder', 'paying customers')}
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto mb-4">
              {t(
                'Få en hemsida som automatiskt genererar bokningar, leads och försäljning – dygnet runt.',
                'Get a website that automatically generates bookings, leads, and sales – 24/7.'
              )}
            </p>
            
            <p className="text-lg text-accent font-medium">
              {t(
                'Se din hemsida först – betala sen.',
                'See your website first – pay later.'
              )}
            </p>
          </motion.div>
          
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Button 
              asChild 
              size="lg" 
              className="h-14 px-10 text-lg font-semibold bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:via-amber-500 hover:to-yellow-600 text-background shadow-2xl shadow-amber-500/30 border-0"
              onClick={() => trackEvent('ad_cta_click', { button: 'get_prototype', ...getUtmParams() })}
            >
              <Link to="/demo">
                {t('Få min gratis prototyp', 'Get my free prototype')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline"
              size="lg" 
              className="h-14 px-8 text-base border-accent/50 hover:bg-accent/10"
              onClick={() => trackEvent('ad_cta_click', { button: 'see_before_pay', ...getUtmParams() })}
            >
              <Link to="/demo">
                {t('Se min hemsida innan jag betalar', 'See my website before I pay')}
              </Link>
            </Button>
          </motion.div>
          
          {/* Price + Social proof row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 mb-16"
          >
            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-accent">{price}</span>
              <span className="text-muted-foreground">{t('engångsavgift', 'one-time')}</span>
            </div>
            
            {/* Divider */}
            <div className="hidden sm:block w-px h-10 bg-border/50" />
            
            {/* Social proof */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 border-2 border-background flex items-center justify-center text-xs font-semibold text-accent">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <span className="font-semibold text-foreground">50+</span>
                <span className="text-muted-foreground"> {t('nöjda företag', 'happy businesses')}</span>
              </div>
            </div>
          </motion.div>
          
          {/* Key Results Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid sm:grid-cols-3 gap-6 mb-16"
          >
            {[
              {
                icon: TrendingUp,
                title: t('Mer bokningar', 'More bookings'),
                desc: t('Automatiserad bokningsmotor som fyller din kalender', 'Automated booking engine that fills your calendar'),
              },
              {
                icon: Users,
                title: t('Fler leads', 'More leads'),
                desc: t('Konverteringsoptimerad design som fångar intresse', 'Conversion-optimized design that captures interest'),
              },
              {
                icon: Zap,
                title: t('Högre försäljning', 'Higher sales'),
                desc: t('Professionell närvaro som bygger förtroende', 'Professional presence that builds trust'),
              },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl bg-gradient-to-br from-secondary/50 to-secondary/20 border border-border/50 backdrop-blur-sm text-center">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </motion.div>
          
          {/* Trust elements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 mb-16"
          >
            {[
              { icon: Zap, text: t('Leverans inom 1 vecka', 'Delivery in 1 week') },
              { icon: Shield, text: t('100% nöjd-garanti', '100% satisfaction guarantee') },
              { icon: CheckCircle2, text: t('Gratis prototyp först', 'Free prototype first') },
              { icon: Sparkles, text: t('Mobilanpassad design', 'Mobile-responsive design') },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <item.icon className="w-4 h-4 text-accent shrink-0" />
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>
          
          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="max-w-2xl mx-auto mb-16"
          >
            <div className="p-8 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 text-center">
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>
              <blockquote className="text-lg italic text-foreground mb-4">
                "{t(
                  'Inom 2 veckor hade vi fått 3x fler bokningar än tidigare. Nomia förstod exakt vad vi behövde.',
                  'Within 2 weeks we had 3x more bookings than before. Nomia understood exactly what we needed.'
                )}"
              </blockquote>
              <cite className="text-sm text-muted-foreground not-italic">
                — Maria L., {t('Salongsägare', 'Salon Owner')}
              </cite>
            </div>
          </motion.div>
          
          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              {t('Redo att växa?', 'Ready to grow?')}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              {t(
                'Få din gratis prototyp inom 72 timmar. Ingen risk, ingen förpliktelse.',
                'Get your free prototype within 72 hours. No risk, no commitment.'
              )}
            </p>
            <Button 
              asChild 
              size="lg" 
              className="h-14 px-12 text-lg font-semibold bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:via-amber-500 hover:to-yellow-600 text-background shadow-2xl shadow-amber-500/30 border-0"
            >
              <Link to="/demo">
                {t('Starta nu – det är gratis', 'Start now – it\'s free')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </main>
      
      {/* Minimal footer */}
      <footer className="relative z-10 py-8 border-t border-border/50 mt-12">
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
