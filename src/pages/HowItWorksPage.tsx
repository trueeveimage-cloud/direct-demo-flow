import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Palette, Code, Rocket, CheckCircle2, Zap, MessageSquare, Play, MousePointer, Eye, Layers, Send, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

// Floating 3D-like cards component
const FloatingCard = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, rotateX: 15 }}
    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    whileHover={{ y: -8, scale: 1.02 }}
    className={`relative bg-gradient-to-br from-secondary/90 to-secondary/50 backdrop-blur-xl rounded-2xl border border-border/50 overflow-hidden ${className}`}
    style={{ transformStyle: 'preserve-3d' }}
  >
    {/* Shine effect */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
    {children}
  </motion.div>
);

// Animated timeline connector
const TimelineConnector = ({ progress }: { progress: number }) => (
  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border/30 hidden lg:block">
    <motion.div 
      className="w-full bg-gradient-to-b from-accent via-accent to-accent/50 origin-top"
      style={{ height: `${progress * 100}%` }}
    />
  </div>
);

// Interactive step component with hover effects
const InteractiveStep = ({ 
  number, 
  title, 
  description, 
  icon: Icon, 
  features,
  accent = "accent",
  delay = 0
}: { 
  number: string; 
  title: string; 
  description: string; 
  icon: any;
  features: string[];
  accent?: string;
  delay?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative pl-0 lg:pl-20"
    >
      {/* Step number badge - positioned on timeline */}
      <motion.div 
        className="hidden lg:flex absolute left-0 top-8 w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 items-center justify-center z-10"
        animate={{ scale: isHovered ? 1.1 : 1, rotate: isHovered ? 5 : 0 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <span className="text-2xl font-bold text-accent">{number}</span>
      </motion.div>

      {/* Main card */}
      <FloatingCard className="p-8 lg:p-10">
        {/* Mobile step number */}
        <div className="lg:hidden flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <span className="text-lg font-bold text-accent">{number}</span>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-accent/30 to-transparent" />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          {/* Icon section */}
          <motion.div 
            className="shrink-0"
            animate={{ rotate: isHovered ? [0, -5, 5, 0] : 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20">
              <Icon className="w-8 h-8 lg:w-10 lg:h-10 text-accent" />
            </div>
          </motion.div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-2xl lg:text-3xl font-bold mb-3">{title}</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {description}
            </p>
            
            {/* Features with staggered animation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.3, delay: delay + 0.3 + i * 0.1 }}
                  className="flex items-center gap-2 text-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Animated corner accent */}
        <motion.div
          className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent/10 to-transparent rounded-bl-full"
          animate={{ opacity: isHovered ? 1 : 0.5 }}
        />
      </FloatingCard>
    </motion.div>
  );
};

// Floating elements for visual interest - hidden on mobile for performance
const FloatingElement = ({ children, delay = 0, duration = 6 }: { children: React.ReactNode; delay?: number; duration?: number }) => (
  <motion.div
    className="hidden md:block"
    initial={{ opacity: 1 }}
    animate={{
      y: [0, -15, 0],
      rotate: [0, 3, -3, 0],
      opacity: 1,
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
      opacity: { duration: 0 }
    }}
  >
    {children}
  </motion.div>
);

// Comparison cards for the two paths
const PathCard = ({ 
  title, 
  description, 
  steps, 
  icon: Icon, 
  buttonText, 
  buttonLink,
  delay = 0
}: { 
  title: string; 
  description: string; 
  steps: string[];
  icon: any;
  buttonText: string;
  buttonLink: string;
  delay?: number;
}) => (
  <FloatingCard delay={delay} className="p-8 h-full">
    <div className="flex items-start gap-4 mb-6">
      <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20 shrink-0">
        <Icon className="w-7 h-7 text-accent" />
      </div>
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
          transition={{ delay: delay + 0.2 + i * 0.1 }}
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
  </FloatingCard>
);

export default function HowItWorksPage() {
  const { t, lang } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const heroScale = useTransform(smoothProgress, [0, 0.1], [1, 0.95]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.15], [1, 0]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const steps = [
    {
      number: "01",
      title: t("Berätta om ditt projekt", "Share your vision"),
      description: t(
        "Fyll i vårt enkla formulär med dina önskemål. Vi behöver veta vad du gör, vad du vill uppnå och hur din drömwebbplats ser ut.",
        "Fill out our quick form with your requirements. Tell us about your business, your goals, and your dream website aesthetic."
      ),
      icon: MessageSquare,
      features: [
        t("5-minuters formulär", "5-minute form"),
        t("Ladda upp inspiration", "Upload inspiration"),
        t("Beskriv din målgrupp", "Define your audience"),
        t("Välj färger & stil", "Choose colors & style"),
        t("Dela din logotyp", "Share your logo"),
        t("Inga krav", "No commitment"),
      ]
    },
    {
      number: "02",
      title: t("Vi designar ditt koncept", "We design your concept"),
      description: t(
        "Inom 72 timmar får du ett komplett designkoncept. Vi skapar mockups, väljer färger, typografi och layout som passar ditt varumärke.",
        "Within 72 hours, you'll receive a complete design concept. We create mockups with colors, typography, and layouts tailored to your brand."
      ),
      icon: Palette,
      features: [
        t("Komplett design", "Complete design"),
        t("Mobiloptimerat", "Mobile-optimized"),
        t("Interaktiv preview", "Interactive preview"),
        t("Färgpalett", "Color palette"),
        t("Typografival", "Typography"),
        t("Revisioner", "Revisions"),
      ]
    },
    {
      number: "03",
      title: t("Vi bygger din webbplats", "We build your website"),
      description: t(
        "När du godkänner konceptet börjar vi koda. Modern teknik, snabb laddning, SEO-optimerat – allt inkluderat.",
        "Once you approve the concept, we start building. Modern technology, lightning-fast loading, SEO-optimized – everything included."
      ),
      icon: Code,
      features: [
        t("Responsiv design", "Responsive design"),
        t("SEO-optimerad", "SEO-optimized"),
        t("SSL-certifikat", "SSL certificate"),
        t("Snabb laddtid", "Fast loading"),
        t("Tillgänglighet", "Accessibility"),
        t("Analytics-ready", "Analytics-ready"),
      ]
    },
    {
      number: "04",
      title: t("Lansering & support", "Launch & support"),
      description: t(
        "Vi publicerar din webbplats och ser till att allt fungerar perfekt. Du får full support och vi hanterar all teknisk underhåll.",
        "We publish your website and ensure everything works perfectly. You get full support and we handle all technical maintenance."
      ),
      icon: Rocket,
      features: [
        t("Gratis domän", "Free domain"),
        t("Hosting inkluderat", "Hosting included"),
        t("Löpande support", "Ongoing support"),
        t("Säkerhetsuppdateringar", "Security updates"),
        t("Prestanda", "Performance"),
        t("Backup", "Backup"),
      ]
    }
  ];

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      {/* Hero Section with Parallax */}
      <motion.section 
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
        style={{ scale: heroScale }}
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
          <motion.div 
            className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px]"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px]"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </div>

        {/* Floating decorative elements - hidden on mobile */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden hidden md:block">
          <FloatingElement delay={0} duration={7}>
            <div className="absolute top-[15%] left-[10%] w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Eye className="w-8 h-8 text-accent/50" />
            </div>
          </FloatingElement>
          <FloatingElement delay={1} duration={8}>
            <div className="absolute top-[25%] right-[15%] w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Layers className="w-6 h-6 text-primary/50" />
            </div>
          </FloatingElement>
          <FloatingElement delay={2} duration={6}>
            <div className="absolute bottom-[30%] left-[15%] w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Send className="w-7 h-7 text-accent/50" />
            </div>
          </FloatingElement>
          <FloatingElement delay={3} duration={9}>
            <div className="absolute bottom-[20%] right-[10%] w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Gift className="w-5 h-5 text-primary/50" />
            </div>
          </FloatingElement>
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent/10 border border-accent/20 mb-10"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-4 h-4 text-accent" />
              </motion.div>
              <span className="text-sm font-medium text-accent">
                {t("Från idé till lansering på dagar", "From idea to launch in days")}
              </span>
            </motion.div>

            {/* Main headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight">
              <motion.span 
                className="block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {t("Så fungerar", "How it")}
              </motion.span>
              <motion.span 
                className="block bg-gradient-to-r from-accent via-orange-400 to-accent bg-clip-text text-transparent bg-[length:200%_auto]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                style={{
                  animation: 'gradient 3s ease infinite',
                }}
              >
                {t("det", "works")}
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-14"
            >
              {t(
                "En smidig process i fyra steg. Från första kontakt till färdig webbplats.",
                "A smooth process in four steps. From first contact to finished website."
              )}
            </motion.p>

            {/* Scroll hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-sm text-muted-foreground">{t("Scrolla för att utforska", "Scroll to explore")}</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <MousePointer className="w-5 h-5 text-accent" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>


      {/* Process Steps with Timeline */}
      <section className="py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-accent text-sm font-semibold tracking-widest uppercase mb-4 block">
              {t("Processen", "The Process")}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {t("Steg för steg", "Step by step")}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t(
                "Så här skapar vi din perfekta webbplats.",
                "This is how we create your perfect website."
              )}
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-accent/50 via-accent/20 to-transparent hidden lg:block" />
            
            <div className="space-y-12">
              {steps.map((step, i) => (
                <InteractiveStep key={i} {...step} delay={i * 0.15} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Choose Your Path - Bottom Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("Välj din väg", "Choose your path")}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t(
                "Två sätt att komma igång – välj det som passar dig bäst.",
                "Two ways to get started – choose what suits you best."
              )}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <PathCard
              title={t("Gratis koncept", "Free Concept")}
              description={t(
                "Se din framtida webbplats innan du bestämmer dig.",
                "See your future website before you decide."
              )}
              steps={[
                t("Berätta om ditt företag och välj stil", "Tell us about your business and choose style"),
                t("Betala €50 verifieringsavgift (återbetalbar)", "Pay €50 verification fee (refundable)"),
                t("Få ett custom koncept inom 72h", "Get a custom concept within 72h"),
                t("Gillar du det? Avgiften dras från priset. Gillar inte? Full återbetalning.", "Like it? Fee deducted from price. Don't like it? Full refund."),
              ]}
              icon={Sparkles}
              buttonText={t("Få gratis koncept", "Get free concept")}
              buttonLink="/demo"
              delay={0.1}
            />
            
            <PathCard
              title={t("Direktbeställning", "Direct Order")}
              description={t(
                "Vet du redan vad du vill ha? Hoppa direkt till beställning.",
                "Already know what you want? Skip straight to ordering."
              )}
              steps={[
                t("Välj paket och anpassa din beställning", "Choose package and customize your order"),
                t("Ladda upp material och beskriv dina önskemål", "Upload materials and describe your wishes"),
                t("Betala och vi börjar bygga direkt", "Pay and we start building immediately"),
                t("Din webbplats levererad inom 7-14 dagar", "Your website delivered within 7-14 days"),
              ]}
              icon={Rocket}
              buttonText={t("Beställ direkt", "Order directly")}
              buttonLink="/bestall"
              delay={0.2}
            />
          </div>

          {/* Already received concept link */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center mt-8"
          >
            <Link 
              to="/efter-demo" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
            >
              {t("Har du redan fått ditt koncept?", "Already received your concept?")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Gradient animation keyframe */}
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}