import { useEffect, useRef } from 'react';
import { ArrowRight, Palette, Code, Rocket, CheckCircle2, MessageSquare, ChevronDown, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ParallaxSection, TiltCard } from '@/components/ParallaxSection';
import { GrainOverlay } from '@/components/PremiumEffects';

// Step component with parallax
const StepCard = ({ 
  number, 
  title, 
  description, 
  icon: Icon, 
  features,
  index
}: { 
  number: string; 
  title: string; 
  description: string; 
  icon: any;
  features: string[];
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50, rotateY: 10 }}
      whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.15 }}
      className="relative pl-0 lg:pl-20"
    >
      {/* Step number badge - positioned on timeline */}
      <motion.div 
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.15 + 0.2, type: "spring" }}
        className="hidden lg:flex absolute left-0 top-8 w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 items-center justify-center z-10"
      >
        <span className="text-2xl font-bold text-accent">{number}</span>
      </motion.div>

      {/* Main card with tilt */}
      <TiltCard>
        <div className="relative bg-gradient-to-br from-secondary/90 to-secondary/50 backdrop-blur-xl rounded-2xl border border-border/50 overflow-hidden p-8 lg:p-10 glass-premium spotlight">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          
          {/* Mobile step number */}
          <div className="lg:hidden flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <span className="text-lg font-bold text-accent">{number}</span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-accent/30 to-transparent" />
          </div>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 relative z-10">
            {/* Icon section with animation */}
            <motion.div 
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="shrink-0"
            >
              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20">
                <Icon className="w-8 h-8 lg:w-10 lg:h-10 text-accent" />
              </div>
            </motion.div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-2xl lg:text-3xl font-light mb-3 tracking-tight">{title}</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {description}
              </p>
              
              {/* Features with staggered animation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {features.map((feature, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 + i * 0.05 }}
                    className="flex items-center gap-2 text-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Corner accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent/10 to-transparent rounded-bl-full opacity-50" />
        </div>
      </TiltCard>
    </motion.div>
  );
};

// Path comparison card with enhanced effects
const PathCard = ({ 
  title, 
  description, 
  steps, 
  icon: Icon, 
  buttonText, 
  buttonLink,
  index
}: { 
  title: string; 
  description: string; 
  steps: string[];
  icon: any;
  buttonText: string;
  buttonLink: string;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: -10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
    >
      <TiltCard className="h-full">
        <div className="relative bg-gradient-to-br from-secondary/90 to-secondary/50 backdrop-blur-xl rounded-2xl border border-border/50 overflow-hidden p-8 h-full glass-premium spotlight">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-start gap-4 mb-6">
              <motion.div 
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20 shrink-0"
              >
                <Icon className="w-7 h-7 text-accent" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold mb-1">{title}</h3>
                <p className="text-muted-foreground text-sm">{description}</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
              {steps.map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-accent">{i + 1}</span>
                  </div>
                  <span className="text-muted-foreground">{step}</span>
                </motion.div>
              ))}
            </div>
            
            <Button asChild className="w-full rounded-xl group">
              <Link to={buttonLink}>
                {buttonText}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
};

export default function HowItWorksPage() {
  const { t } = useLanguage();
  const heroRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const steps = [
    {
      number: "01",
      title: t("Berätta om ditt företag", "Tell us about your business"),
      description: t(
        "Fyll i vårt enkla formulär. Vi vill veta vad du gör, vad du vill uppnå och hur din drömwebbplats ser ut.",
        "Fill out our quick form. Tell us about your business, your goals, and your dream website."
      ),
      icon: MessageSquare,
      features: [
        t("5 minuters formulär", "5-minute form"),
        t("Ladda upp inspiration", "Upload inspiration"),
        t("Beskriv målgruppen", "Define your audience"),
        t("Välj färger & stil", "Choose colors & style"),
        t("Dela din logotyp", "Share your logo"),
        t("Inget köptvång", "No commitment"),
      ]
    },
    {
      number: "02",
      title: t("Vi designar ditt koncept", "We design your concept"),
      description: t(
        "Din dedikerade webbdesigner skapar ett skräddarsytt koncept inom 72 timmar. Du får en interaktiv preview med färgpalett och layout.",
        "Your dedicated web designer creates a tailored concept within 72 hours. You get an interactive preview with color palette and layouts."
      ),
      icon: Palette,
      features: [
        t("Dedikerad webbdesigner", "Dedicated web designer"),
        t("Gratis logotyp", "Free logo creation"),
        t("Mobilanpassat", "Mobile-optimized"),
        t("Interaktiv preview", "Interactive preview"),
        t("Färgpalett", "Color palette"),
        t("Revisioner", "Revisions"),
      ]
    },
    {
      number: "03",
      title: t("Vi bygger din hemsida", "We build your website"),
      description: t(
        "När du godkänner konceptet börjar vi bygga. Modern teknik, snabb laddning, SEO – allt ingår.",
        "Once you approve the concept, we start building. Modern tech, fast loading, SEO – all included."
      ),
      icon: Code,
      features: [
        t("Responsiv design", "Responsive design"),
        t("SEO-optimerad", "SEO-optimized"),
        t("SSL-certifikat", "SSL certificate"),
        t("Snabb laddtid", "Fast loading"),
        t("Tillgänglighet", "Accessibility"),
        t("Analytics", "Analytics"),
      ]
    },
    {
      number: "04",
      title: t("Lansering & support", "Launch & support"),
      description: t(
        "Vi publicerar din hemsida och säkerställer att allt fungerar. Du får full support och vi sköter tekniken.",
        "We publish your website and ensure everything works. You get full support and we handle the tech."
      ),
      icon: Rocket,
      features: [
        t("Gratis domän", "Free domain"),
        t("Hosting ingår", "Hosting included"),
        t("Löpande support", "Ongoing support"),
        t("Säkerhetsuppdateringar", "Security updates"),
        t("Prestanda", "Performance"),
        t("Backup", "Backup"),
      ]
    }
  ];

  return (
    <div className="relative overflow-hidden">
      <GrainOverlay />
      {/* Cinematic ambient glows — same vibe as About Us */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-accent/6 rounded-full blur-[180px]" />
        <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-accent/4 rounded-full blur-[140px]" />
      </div>

      {/* Hero Section with full parallax */}
      <section ref={heroRef} className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-24">
        {/* Cinematic dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--accent)/0.06)_0%,_transparent_65%)]" />

        <motion.div 
          style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
          className="relative z-10 container mx-auto px-4 text-center"
        >
          {/* Cinematic label */}
          <motion.div 
            initial={{ opacity: 0, letterSpacing: '0.5em' }}
            animate={{ opacity: 1, letterSpacing: '0.3em' }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10"
          >
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-accent/70">
              {t("Fyra steg. Sju dagar.", "Four steps. Seven days.")}
            </span>
          </motion.div>

          {/* Main headline — cinematic film-title style */}
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl md:text-8xl lg:text-9xl font-extralight mb-8 tracking-tighter leading-none"
          >
            <span className="block">{t("Så fungerar", "How it")}</span>
            <span className="block text-accent">{t("det.", "works.")}</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, filter: 'blur(8px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-14 font-light"
          >
            {t(
              "Från första kontakt till färdig hemsida på sju dagar — utan krångel.",
              "From first contact to finished website in seven days — no fuss."
            )}
          </motion.p>

          {/* Scroll hint */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs text-muted-foreground/60 tracking-widest uppercase">{t("Scrolla", "Scroll")}</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown className="w-4 h-4 text-accent/50" />
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Fade transition overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-background pointer-events-none" />
      </section>

      {/* Process Steps with parallax */}
      <ParallaxSection speed={0.3} floatingElements accentGlow>
        <section className="py-24 lg:py-32 relative -mt-16">
          {/* Top fade for seamless blend */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />
          
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-20"
            >
              <span className="text-accent text-sm font-semibold tracking-widest uppercase mb-4 block">
                {t("Processen", "The Process")}
              </span>
              <h2 className="text-3xl md:text-5xl font-light mb-4 tracking-tight">
                {t("Steg för steg", "Step by step")}
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                {t("Så här skapar vi din hemsida.", "This is how we create your website.")}
              </p>
            </motion.div>

            <div className="relative max-w-4xl mx-auto">
              {/* Timeline line with gradient */}
              <motion.div 
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 }}
                className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent/50 via-accent/30 to-accent/10 hidden lg:block origin-top" 
              />

              <div className="space-y-12">
                {steps.map((step, index) => (
                  <StepCard key={step.number} {...step} index={index} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </ParallaxSection>


      {/* Two paths section with parallax */}
      <ParallaxSection speed={0.25} scaleOnView>
        <section className="py-24 lg:py-32 relative overflow-hidden">
          {/* Gradient fade overlay for seamless section blending */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background pointer-events-none" />
          
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-light mb-4 tracking-tight">
                {t("Välj din väg", "Choose your path")}
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                {t("Prova gratis eller beställ direkt – du bestämmer.", "Try for free or order directly – you decide.")}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <PathCard
                icon={Gift}
                title={t("Gratis koncept", "Free concept")}
                description={t("Perfekt om du vill se vad vi kan göra först", "Perfect if you want to see what we can do first")}
                steps={[
                  t("Fyll i formuläret", "Fill out the form"),
                  t("Få koncept inom 72h", "Get concept within 72h"),
                  t("Beställ om du gillar det", "Order if you like it"),
                ]}
                buttonText={t("Få gratis koncept", "Get free concept")}
                buttonLink="/demo"
                index={0}
              />
              <PathCard
                icon={Rocket}
                title={t("Beställ direkt", "Order directly")}
                description={t("För dig som vet vad du vill ha", "For those who know what they want")}
                steps={[
                  t("Välj paket", "Choose package"),
                  t("Anpassa detaljer", "Customize details"),
                  t("Vi börjar bygga direkt", "We start building immediately"),
                ]}
                buttonText={t("Beställ nu", "Order now")}
                buttonLink="/bestall"
                index={1}
              />
            </div>
          </div>
        </section>
      </ParallaxSection>


      {/* Final CTA with parallax */}
      <ParallaxSection speed={0.2} accentGlow>
        <section className="py-24 relative overflow-hidden">
          {/* Gradient fade overlay for seamless section blending */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background pointer-events-none" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              {t("Redo att komma igång?", "Ready to get started?")}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto"
            >
              {t("Få ett gratis designkoncept inom 72 timmar.", "Get a free design concept within 72 hours.")}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button asChild size="lg" className="group h-14 px-10 bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/30 border-0">
                <Link to="/demo">
                  {t("Få gratis koncept", "Get free concept")}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="group h-14 px-10 border-accent/50 hover:bg-accent/10">
                <Link to="/bestall">
                  {t("Beställ direkt", "Order directly")}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </ParallaxSection>
    </div>
  );
}
