import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { ArrowRight, FileText, Zap, CheckCircle2, Clock, Shield, Info, Sparkles, TrendingDown, Eye, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { TestimonialsCarousel } from '@/components/TestimonialsCarousel';
import { TrustBadges } from '@/components/TrustBadges';
import { ROICalculator } from '@/components/ROICalculator';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useRemainingSpots } from '@/hooks/useRemainingSpots';
import { ParallaxSection, FloatingShapes, AnimatedText, TiltCard } from '@/components/ParallaxSection';
import { MagneticButton } from '@/components/MagneticButton';
import { ScrollTriggeredCounter } from '@/components/ScrollTriggeredCounter';
import { GrainOverlay, FloatingParticles, ScrollingAmbientGlow } from '@/components/PremiumEffects';

// Import portfolio images
import gailsHairImg from '@/assets/portfolio-gailshair.png';
import ohMyCoffeeImg from '@/assets/portfolio-ohmycoffee.png';
import bambaImg from '@/assets/portfolio-bamba.png';
import enDeliHagaImg from '@/assets/portfolio-endelihaga.png';

// Before/After images
import beforeSwedenCarImg from '@/assets/before-swedencar.png';
import afterSwedenCarImg from '@/assets/after-swedencar.png';

// ═══════════════════════════════════════════════════════════════════
// ADVANCED PARALLAX HERO BACKGROUND - "Holy shit" effect
// ═══════════════════════════════════════════════════════════════════
function ParallaxHeroBackground() {
  const { scrollY } = useScroll();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring physics for mouse movement
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);
  
  // Scroll-based parallax transforms
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const y3 = useTransform(scrollY, [0, 500], [0, 200]);
  const scale1 = useTransform(scrollY, [0, 300], [1, 1.3]);
  const opacity1 = useTransform(scrollY, [0, 400], [1, 0]);
  const rotate1 = useTransform(scrollY, [0, 500], [0, 45]);
  const rotate2 = useTransform(scrollY, [0, 500], [0, -30]);
  const gridOpacity = useTransform(scrollY, [0, 300], [0.03, 0]);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      // Normalize mouse position to -1 to 1
      mouseX.set((clientX / innerWidth - 0.5) * 2);
      mouseY.set((clientY / innerHeight - 0.5) * 2);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);
  
  // Combine scroll and mouse for 3D parallax
  const orbX1 = useTransform(smoothMouseX, [-1, 1], [-30, 30]);
  const orbY1 = useTransform(smoothMouseY, [-1, 1], [-30, 30]);
  const orbX2 = useTransform(smoothMouseX, [-1, 1], [40, -40]);
  const orbY2 = useTransform(smoothMouseY, [-1, 1], [20, -20]);
  const orbX3 = useTransform(smoothMouseX, [-1, 1], [-20, 20]);
  const orbY3 = useTransform(smoothMouseY, [-1, 1], [-40, 40]);
  
  return (
    <div className="fixed top-0 left-0 right-0 h-screen pointer-events-none z-0 overflow-hidden motion-reduce:hidden">
      {/* Desktop: Full parallax experience - hidden on mobile for performance */}
      <div className="hidden md:block h-full">
        {/* Primary glow orb - largest, slowest */}
        <motion.div
          style={{ 
            y: y1, 
            x: orbX1, 
            scale: scale1,
            rotate: rotate1,
            opacity: opacity1
          }}
          className="absolute top-[-150px] left-[5%] w-[600px] h-[600px]"
        >
          <div className="w-full h-full rounded-full bg-gradient-radial from-accent/30 via-accent/10 to-transparent blur-[100px] animate-orb-pulse" />
        </motion.div>
        
        {/* Secondary orb - medium speed with morph */}
        <motion.div
          style={{ 
            y: y2, 
            x: orbX2,
            rotate: rotate2,
            opacity: opacity1
          }}
          className="absolute top-[50px] right-[10%] w-[500px] h-[500px]"
        >
          <div className="w-full h-full bg-gradient-radial from-accent/25 via-accent/10 to-transparent blur-[80px] animate-morph" />
        </motion.div>
        
        {/* Tertiary orb - fastest parallax */}
        <motion.div
          style={{ 
            y: y3,
            x: orbX3,
            opacity: opacity1
          }}
          className="absolute top-[300px] left-[35%] w-[400px] h-[400px]"
        >
          <div className="w-full h-full rounded-full bg-gradient-radial from-accent/20 via-accent/5 to-transparent blur-[60px] animate-float-3d" />
        </motion.div>
        
        {/* Removed floating geometric shapes for cleaner aesthetic */}
        
        {/* Floating particles - CSS animated dots */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              style={{ opacity: opacity1 }}
              className="absolute rounded-full bg-accent"
              initial={false}
            >
              <div 
                className="rounded-full bg-accent animate-pulse"
                style={{
                  position: 'absolute',
                  left: `${5 + (i * 4.5) % 90}%`,
                  top: `${3 + (i * 7) % 60}%`,
                  width: 2 + (i % 4) * 2,
                  height: 2 + (i % 4) * 2,
                  opacity: 0.2 + (i % 5) * 0.1,
                  animationDelay: `${i * 0.15}s`
                }}
              />
            </motion.div>
          ))}
        </div>
        
        {/* Animated gradient mesh overlay */}
        <motion.div 
          style={{ opacity: opacity1 }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent"
        />
        
        {/* Grid lines for tech feel */}
        <motion.div 
          style={{ opacity: gridOpacity }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--accent) / 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--accent) / 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }} />
        </motion.div>
        
        {/* Horizontal scan line effect */}
        <motion.div
          style={{ 
            y: useTransform(scrollY, [0, 1000], [0, 500]),
            opacity: useTransform(scrollY, [0, 300], [0.3, 0])
          }}
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
        />
      </div>
      
      {/* Mobile: Simplified static gradient */}
      <div className="md:hidden h-full">
        <div className="absolute top-[-100px] left-[10%] w-[300px] h-[300px] bg-accent/15 rounded-full blur-[80px]" />
        <div className="absolute top-[-50px] right-[10%] w-[200px] h-[200px] bg-accent/10 rounded-full blur-[60px]" />
      </div>
    </div>
  );
}

// Before/After Section with Parallax Effect
function BeforeAfterSection({ t, beforeImg, afterImg }: { t: (sv: string, en: string) => string; beforeImg: string; afterImg: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  // Parallax transforms - before moves slower, after moves faster
  const beforeY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const afterY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  
  return (
    <section ref={sectionRef} className="py-32 relative overflow-hidden">
      {/* Gradient fade overlay for seamless section blending */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />
      {/* Asymmetric accent glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-1/2 h-1/2 bg-gradient-to-l from-accent/5 to-transparent blur-3xl" />
      </div>
      
      <div className="container-wide section-padding relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              <Eye className="w-4 h-4" />
              {t('Transformation', 'Transformation')}
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light mb-6 leading-tight tracking-tight">
              {t('Från föråldrad till professionell', 'From outdated to professional')}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t('Vi förvandlar webbplatser som skrämmer bort kunder till webbplatser som konverterar besökare till bokningar.', 'We transform websites that scare away customers into websites that convert visitors into bookings.')}
            </p>
            
            <div className="mb-8">
              <p className="text-muted-foreground mb-2">
                <span className="font-semibold text-foreground">Sweden Car AB</span>
              </p>
              <p className="text-sm text-muted-foreground">
                {t('Från gammaldags design till modernt och professionellt intryck.', 'From outdated design to a modern, professional impression.')}
              </p>
            </div>
            
            <Button asChild variant="outline" className="group">
              <Link to="/portfolio">
                {t('Se fler transformationer', 'See more transformations')}
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
          
          {/* Right: Before/After Images with Parallax */}
          <div className="relative">
            {/* Before - positioned back and left, slower parallax */}
            <motion.div 
              style={{ y: beforeY }} 
              className="relative z-10 hidden md:block"
            >
              <div className="absolute -top-3 left-4 z-20">
                <span className="bg-muted-foreground/80 text-background px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                  {t('Före', 'Before')}
                </span>
              </div>
              <div className="aspect-[4/3] rounded-xl overflow-hidden border-2 border-border/50 shadow-xl">
                <img src={beforeImg} alt={t('Före transformation', 'Before transformation')} className="w-full h-full object-cover object-top" />
              </div>
            </motion.div>
            
            {/* Mobile: Static before image */}
            <div className="relative z-10 md:hidden">
              <div className="absolute -top-3 left-4 z-20">
                <span className="bg-muted-foreground/80 text-background px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                  {t('Före', 'Before')}
                </span>
              </div>
              <div className="aspect-[4/3] rounded-xl overflow-hidden border-2 border-border/50 shadow-xl">
                <img src={beforeImg} alt={t('Före transformation', 'Before transformation')} className="w-full h-full object-cover object-top" />
              </div>
            </div>
            
            {/* After - overlapping, faster parallax */}
            <motion.div 
              style={{ y: afterY }} 
              className="relative z-20 -mt-24 ml-12 lg:ml-20 hidden md:block"
            >
              <div className="absolute -top-3 left-4 z-20">
                <span className="bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                  {t('Efter', 'After')}
                </span>
              </div>
              <div className="aspect-[4/3] rounded-xl overflow-hidden border-2 border-accent/50 shadow-2xl shadow-accent/20">
                <img src={afterImg} alt={t('Efter transformation', 'After transformation')} className="w-full h-full object-cover object-top" />
              </div>
            </motion.div>
            
            {/* Mobile: Static after image */}
            <div className="relative z-20 -mt-16 ml-8 md:hidden">
              <div className="absolute -top-3 left-4 z-20">
                <span className="bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                  {t('Efter', 'After')}
                </span>
              </div>
              <div className="aspect-[4/3] rounded-xl overflow-hidden border-2 border-accent/50 shadow-2xl shadow-accent/20">
                <img src={afterImg} alt={t('Efter transformation', 'After transformation')} className="w-full h-full object-cover object-top" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Index() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { remainingSpots, isLoading: spotsLoading } = useRemainingSpots();
  const [showSpotsDialog, setShowSpotsDialog] = useState(false);

  // Scroll progress for global effects
  const { scrollY } = useScroll();
  const heroTextY = useTransform(scrollY, [0, 300], [0, 50]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.5]);

  return (
    <div className="overflow-hidden relative">
      <GrainOverlay />
      <FloatingParticles count={15} />
      <ScrollingAmbientGlow />
      {/* ═══════════════════════════════════════════════════════════════════
          1. HERO - Hook + Promise - SCROLL SNAP SECTION
      ═══════════════════════════════════════════════════════════════════ */}
      
      {/* ADVANCED PARALLAX HERO BACKGROUND */}
      <ParallaxHeroBackground />

      {/* Hero Content with staggered animations - SCROLL SNAP */}
      <section className="min-h-[60vh] flex items-center relative overflow-hidden pt-24">
        {/* Bottom gradient fade for seamless transition */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-20" />
        <div className="container-narrow text-center relative z-10 section-padding py-12">
          {/* Hero Logo with simplified mobile animation */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ y: heroTextY, opacity: heroOpacity }}
            className="pb-6"
          >
            <span className="font-heading font-light text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter">
              <AnimatedText text="Nomia" delay={0.2} stagger={0.06} />
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.3, ease: 'easeOut' }}
                className="text-accent inline-block"
              >.</motion.span>
            </span>
          </motion.div>

          {/* Sale Badge + Urgency Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5, ease: 'easeOut' }}
            className="flex flex-wrap items-center justify-center gap-3 mb-8"
          >
            {/* 25% SALE Badge */}
            <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white text-sm font-bold shadow-lg shadow-red-500/30">
              <Sparkles className="w-4 h-4" />
              {t('25% RABATT', '25% SALE')}
            </div>
            
            {/* Spots Badge - Clickable */}
            <Dialog open={showSpotsDialog} onOpenChange={setShowSpotsDialog}>
              <DialogTrigger asChild>
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium backdrop-blur-sm border border-accent/20 hover:bg-accent/20 hover:border-accent/30 transition-colors cursor-pointer">
                  <Clock className="w-4 h-4" />
                  {spotsLoading ? (
                    <span className="animate-pulse">{t('Laddar...', 'Loading...')}</span>
                  ) : remainingSpots > 0 ? (
                    <span>{remainingSpots} {remainingSpots === 1 ? t('plats kvar', 'spot left') : t('platser kvar', 'spots left')}</span>
                  ) : (
                    <span className="text-warning">{t('Fullbokat', 'Fully booked')}</span>
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
                        className={`w-6 h-6 rounded-full border-2 border-background transition-colors ${
                          i < (7 - remainingSpots) ? 'bg-muted-foreground/40' : 'bg-accent'
                        }`} 
                      />
                    ))}
                  </div>
                  <p className="text-center text-xs text-muted-foreground mt-3">
                    {7 - remainingSpots}/7 {t('bokade denna vecka', 'booked this week')}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t(
                    'Platserna återställs varje måndag. Boka din plats nu för att garantera leverans.',
                    'Spots reset every Monday. Book your spot now to guarantee delivery.'
                  )}
                </p>
              </div>
            </DialogContent>
          </Dialog>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6, ease: 'easeOut' }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extralight leading-[1.1] tracking-tight max-w-3xl mx-auto mb-4"
          >
            <span className="text-reveal-gradient">{t('Prissmarta webbsidor.', 'Websites that sell.')}</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5, ease: 'easeOut' }}
            className="text-xl sm:text-2xl text-muted-foreground max-w-xl mx-auto"
          >
            {t('Få ett gratis designkoncept inom 72 timmar.', 'Get a free design concept in 72 hours.')}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.5, ease: 'easeOut' }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <MagneticButton strength={0.4}>
              <Button 
                asChild 
                size="lg" 
                className="group h-14 px-10 text-base font-medium bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-foreground hover:from-amber-400 hover:via-amber-300 hover:to-yellow-400 shadow-lg shadow-amber-500/30 border-0"
                onClick={() => {
                  import('@/lib/posthog').then(({ trackEvent, getUtmParams }) => {
                    trackEvent('cta_click', { button: 'hero_get_concept', page: 'index', ...getUtmParams() });
                  });
                }}
              >
                <Link to="/demo">
                  {t('Få ditt gratis koncept', 'Get your free concept')}
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </MagneticButton>
            <MagneticButton strength={0.4}>
              <Button 
                asChild 
                size="lg" 
                className="group h-14 px-10 text-base font-medium bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-foreground hover:from-amber-400 hover:via-amber-300 hover:to-yellow-400 shadow-lg shadow-amber-500/30 border-0"
                onClick={() => {
                  import('@/lib/posthog').then(({ trackEvent, getUtmParams }) => {
                    trackEvent('cta_click', { button: 'hero_order_directly', page: 'index', ...getUtmParams() });
                  });
                }}
              >
                <Link to="/bestall">
                  <span className="flex flex-col items-start leading-tight">
                    <span>{t('Beställ direkt', 'Order directly')}</span>
                    <span className="text-xs opacity-80">{t('Hemsida från 2 900 kr', 'Website from $290')}</span>
                  </span>
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </MagneticButton>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
            className="mt-6"
          >
            <Link to="/efter-demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t('Har du fått ditt koncept?', 'Have you received your concept?')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges - Quick credibility */}
      <TrustBadges />


      {/* ═══════════════════════════════════════════════════════════════════
          2. THE SOLUTION - Before/After Transformation with Parallax
      ═══════════════════════════════════════════════════════════════════ */}
      <BeforeAfterSection t={t} beforeImg={beforeSwedenCarImg} afterImg={afterSwedenCarImg} />


      {/* ═══════════════════════════════════════════════════════════════════
          4. HOW IT WORKS - Simple process with steps preview + PARALLAX
      ═══════════════════════════════════════════════════════════════════ */}
      <ParallaxSection speed={0.3} floatingElements accentGlow>
        <section className="py-32 relative overflow-hidden">
          {/* Gradient fade overlay for seamless section blending */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background pointer-events-none" />
          
          <div className="container-wide section-padding relative">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                {t('Snabb & enkel process', 'Fast & simple process')}
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light mb-4 tracking-tight">
                {t('Så här fungerar det', 'How it works')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                {t('Från idé till färdig webbplats på några dagar.', 'From idea to finished website in just days.')}
              </p>
            </motion.div>

            {/* Steps Grid with 3D tilt cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
              {[
                { num: '01', title: t('Beskriv', 'Describe'), desc: t('Berätta om ditt företag', 'Tell us about your business'), icon: FileText },
                { num: '02', title: t('Granska', 'Review'), desc: t('Få ditt koncept inom 72h', 'Get your concept within 72h'), icon: Eye, counterValue: 72 },
                { num: '03', title: t('Finjustera', 'Refine'), desc: t('Vi anpassar efter dina önskemål', 'We adapt to your wishes'), icon: Sparkles, counterValue: null },
                { num: '04', title: t('Lansera', 'Launch'), desc: t('Din webbplats är live!', 'Your website is live!'), icon: CheckCircle2 },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="p-5 sm:p-6 rounded-xl border border-accent/30 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent hover:border-accent/50 transition-colors duration-300 h-full glass-premium">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-accent font-bold text-lg">{step.num}</span>
                      <step.icon className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="font-semibold text-base mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center"
            >
              <Button asChild className="group bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to="/hur-det-fungerar">
                  {t('Läs mer om processen', 'Learn more about the process')}
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </ParallaxSection>


      {/* ═══════════════════════════════════════════════════════════════════
          5. PROOF - Portfolio Showcase + PARALLAX
      ═══════════════════════════════════════════════════════════════════ */}
      <ParallaxSection speed={0.4} scaleOnView>
        <section className="py-32 relative overflow-hidden">
          {/* Gradient fade overlay for seamless section blending */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/15 to-background pointer-events-none" />
          
          <div className="container-wide section-padding">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-16 gap-4"
            >
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight">{t('Våra projekt', 'Our Work')}</h2>
                <p className="text-muted-foreground mt-3 text-lg">{t('Riktiga resultat för riktiga företag', 'Real results for real businesses')}</p>
              </div>
              <Button asChild variant="outline" className="group hidden sm:flex">
                <Link to="/portfolio">
                  {t('Se alla projekt', 'View all projects')}
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { name: "Gail's Hair", type: t('Frisörsalong', 'Hair Salon'), stat: '+89%', statLabel: t('bokningar', 'bookings'), url: 'https://gailshairgallery.lovable.app/book', image: gailsHairImg },
                { name: 'Oh My Coffee', type: t('Café & Restaurang', 'Café & Restaurant'), stat: null, url: 'https://ohmycoffee-gbg-web.lovable.app/', image: ohMyCoffeeImg },
                { name: 'Bamba', type: t('Restaurang', 'Restaurant'), stat: '+177%', statLabel: t('bokningar/vecka', 'bookings/week'), url: 'https://bamba.lovable.app/', image: bambaImg },
                { name: 'En Deli Haga', type: t('Delikatess & Café', 'Deli & Café'), stat: null, url: 'https://en-deli-cozy-vibes.lovable.app/', image: enDeliHagaImg },
              ].map((project, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 50, rotateY: -10 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  whileHover={{ y: -12, scale: 1.02 }}
                  className="group"
                >
                  <TiltCard>
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border/50 hover:border-accent/50 transition-all duration-500 block shadow-lg hover:shadow-xl hover:shadow-accent/20 spotlight">
                      {project.stat && (
                        <div className="absolute top-3 right-3 z-10 bg-accent text-accent-foreground px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animated-border">
                          {project.stat} {project.statLabel}
                        </div>
                      )}
                      <img src={project.image} alt={project.name} className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/95 via-foreground/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-6 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <p className="text-primary-foreground font-heading font-bold text-lg">{project.name}</p>
                        <p className="text-primary-foreground/70 text-sm">{project.type}</p>
                      </div>
                    </a>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-10 text-center sm:hidden">
              <Button asChild variant="outline" className="group">
                <Link to="/portfolio">
                  {t('Se alla projekt', 'View all projects')}
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </ParallaxSection>


      {/* ═══════════════════════════════════════════════════════════════════
          ROI CALCULATOR - Show the pain + PARALLAX
      ═══════════════════════════════════════════════════════════════════ */}
      <ParallaxSection speed={0.2} accentGlow>
        <section className="py-32 relative">
          {/* Gradient fade overlay for seamless section blending */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-destructive/5 to-background pointer-events-none" />
          
          <div className="container-narrow section-padding relative">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive text-sm font-medium mb-6">
                <TrendingDown className="w-4 h-4" />
                {t('Varje dag utan hemsida kostar dig', 'Every day without a website costs you')}
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light mb-6 tracking-tight">
                {t('Hur mycket intäkter förlorar du?', 'How much revenue are you losing?')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
                {t('En föråldrad eller saknad webbplats kostar mer än du tror.', 'An outdated or missing website costs more than you think.')}
              </p>
              
              <ROICalculator />
            </motion.div>
          </div>
        </section>
      </ParallaxSection>


      {/* ═══════════════════════════════════════════════════════════════════
          6. SOCIAL PROOF - Testimonials
      ═══════════════════════════════════════════════════════════════════ */}
      <TestimonialsCarousel />


      {/* ═══════════════════════════════════════════════════════════════════
          6. WHAT YOU GET - Features/Deliverables + PARALLAX
      ═══════════════════════════════════════════════════════════════════ */}
      <ParallaxSection speed={0.35} floatingElements skewOnScroll>
        <section className="py-32 relative overflow-hidden">
          {/* Gradient fade overlay for seamless section blending */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background pointer-events-none" />
          <div className="container-wide section-padding relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light mb-4 tracking-tight">
                {t('Vad ingår i din webbplats', 'What\'s included in your website')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                {t('En komplett lösning redo att ta emot kunder från dag ett.', 'A complete solution ready to receive customers from day one.')}
              </p>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                { title: t('Responsiv design', 'Responsive design'), desc: t('Ser perfekt ut på mobil, surfplatta och dator.', 'Looks perfect on mobile, tablet, and desktop.') },
                { title: t('Snabb leverans', 'Fast delivery'), desc: t('7-14 dagars leverans beroende på paket.', '7-14 day delivery depending on package.') },
                { title: t('SEO-optimerad', 'SEO optimized'), desc: t('Grundläggande sökmotoroptimering för bättre synlighet.', 'Basic search engine optimization for better visibility.') },
                { title: t('Kontaktformulär', 'Contact form'), desc: t('Få leads direkt till din inbox.', 'Get leads directly to your inbox.') },
                { title: t('Revisioner ingår', 'Revisions included'), desc: t('1-3 revideringsrundor beroende på paket.', '1-3 revision rounds depending on package.') },
                { title: t('Fast pris', 'Fixed price'), desc: t('Inga dolda kostnader eller överraskningar.', 'No hidden costs or surprises.') },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  className="group"
                >
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="w-full text-left">
                        <div className="p-5 rounded-xl border border-border/50 bg-secondary/30 hover:border-accent/30 hover:bg-accent/5 transition-all duration-300 h-full glass-premium spotlight cursor-pointer">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="font-medium text-base">{item.title}</h3>
                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                              <Info className="w-3 h-3" />
                            </div>
                          </div>
                        </div>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent side="top" className="text-sm max-w-[200px]">
                      {item.desc}
                    </PopoverContent>
                  </Popover>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center mt-12"
            >
              <Button asChild variant="outline" className="group">
                <Link to="/priser">
                  {t('Se alla paket och priser', 'See all packages and prices')}
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </ParallaxSection>

      {/* ═══════════════════════════════════════════════════════════════════
          8. FAQ - Handle objections + PARALLAX
      ═══════════════════════════════════════════════════════════════════ */}
      <ParallaxSection speed={0.25}>
        <section className="py-32 relative overflow-hidden">
          {/* Gradient fade overlay for seamless section blending */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background pointer-events-none" />
          <div className="container-narrow section-padding">
            <div className="flex items-center justify-between mb-12 animate-fade-in">
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight">FAQ</h2>
              <Button asChild variant="ghost" className="group">
                <Link to="/faq">
                  {t('Se alla', 'View all')}
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>

            <div className="space-y-4">
              {[
                { q: t('Är konceptet verkligen gratis?', 'Is the concept really free?'), a: t('Ja! Du betalar endast €50 i verifieringsavgift som dras av från priset om du fortsätter, eller återbetalas helt om du tackar nej.', 'Yes! You only pay a €50 verification fee that\'s deducted from the price if you continue, or fully refunded if you decline.') },
                { q: t('Hur lång tid tar leveransen?', 'How long does delivery take?'), a: t('Beroende på paket: Starter 14 dagar, Standard 10 dagar, Pro 7 dagar. Koncept levereras inom 72h.', 'Depending on package: Starter 14 days, Standard 10 days, Pro 7 days. Concepts delivered within 72h.') },
                { q: t('Erbjuder ni Klarna?', 'Do you offer Klarna?'), a: t('Ja! Delbetala med Klarna – betala senare eller dela upp i 3 delbetalningar.', 'Yes! Pay in installments with Klarna – pay later or split into 3 payments.') },
              ].map((faq, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 rounded-xl border border-border/50 hover:border-accent/30 hover:bg-accent/5 transition-all duration-300 glass-premium"
                >
                  <h4 className="font-heading font-medium text-lg mb-2">{faq.q}</h4>
                  <p className="text-muted-foreground">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </ParallaxSection>


      {/* ═══════════════════════════════════════════════════════════════════
          9. FINAL CTA - Choose Your Path + PARALLAX
      ═══════════════════════════════════════════════════════════════════ */}
      <ParallaxSection speed={0.3} accentGlow rotate3D>
        <section className="py-32 relative">
          {/* Gradient fade overlay for seamless section blending */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background pointer-events-none" />
          
          <div className="container-wide section-padding relative">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light mb-4 tracking-tight">
                {t('Välj din väg', 'Choose your path')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                {t('Två sätt att komma igång – välj det som passar dig bäst.', 'Two ways to get started – choose what suits you best.')}
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Free Concept Path */}
              <motion.div
                initial={{ opacity: 0, x: -50, rotateY: 10 }}
                whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                <TiltCard className="h-full">
                  <div className="relative p-8 rounded-2xl border border-border/50 bg-background/80 backdrop-blur-sm hover:border-accent/30 transition-all duration-300 h-full glass-premium spotlight">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20 shrink-0">
                        <Sparkles className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{t('Gratis koncept', 'Free Concept')}</h3>
                        <p className="text-muted-foreground text-sm">{t('Se din framtida webbplats innan du bestämmer dig.', 'See your future website before you decide.')}</p>
                      </div>
                    </div>
                    <div className="space-y-4 mb-8">
                      {[
                        t('Berätta om ditt företag och välj stil', 'Tell us about your business and choose style'),
                        t('Betala €50 verifieringsavgift (återbetalbar)', 'Pay €50 verification fee (refundable)'),
                        t('Få ett custom koncept inom 72h', 'Get a custom concept within 72h'),
                        t('Gillar du det? Avgiften dras från priset. Gillar inte? Full återbetalning.', 'Like it? Fee deducted from price. Don\'t like it? Full refund.'),
                      ].map((step, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-sm font-bold text-accent flex-shrink-0">
                            {i + 1}
                          </span>
                          <span className="text-muted-foreground">{step}</span>
                        </div>
                      ))}
                    </div>
                    <Button asChild variant="outline" className="w-full group">
                      <Link to="/demo">
                        {t('Få gratis koncept', 'Get free concept')}
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </TiltCard>
              </motion.div>

              {/* Direct Order Path */}
              <motion.div
                initial={{ opacity: 0, x: 50, rotateY: -10 }}
                whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <TiltCard className="h-full">
                  <div className="relative p-8 rounded-2xl border border-border/50 bg-background/80 backdrop-blur-sm hover:border-accent/30 transition-all duration-300 h-full glass-premium spotlight">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20 shrink-0">
                        <Zap className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{t('Direktbeställning', 'Direct Order')}</h3>
                        <p className="text-muted-foreground text-sm">{t('Vet du redan vad du vill ha? Hoppa direkt till beställning.', 'Already know what you want? Skip straight to ordering.')}</p>
                      </div>
                    </div>
                    <div className="space-y-4 mb-8">
                      {[
                        t('Välj paket och anpassa din beställning', 'Choose package and customize your order'),
                        t('Ladda upp material och beskriv dina önskemål', 'Upload materials and describe your wishes'),
                        t('Betala och vi börjar bygga direkt', 'Pay and we start building immediately'),
                        t('Din webbplats levererad inom 7-14 dagar', 'Your website delivered within 7-14 days'),
                      ].map((step, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-sm font-bold text-accent flex-shrink-0">
                            {i + 1}
                          </span>
                          <span className="text-muted-foreground">{step}</span>
                        </div>
                      ))}
                    </div>
                    <Button asChild variant="outline" className="w-full group">
                      <Link to="/bestall">
                        {t('Beställ direkt', 'Order directly')}
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </TiltCard>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="text-center mt-10"
            >
              <Link 
                to="/efter-demo" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
              >
                {t('Har du redan fått ditt koncept?', 'Already received your concept?')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>
      </ParallaxSection>
    </div>
  );
}
