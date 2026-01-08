import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { ArrowRight, Sparkles, Palette, Code, Rocket, CheckCircle2, Zap, Clock, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const FloatingOrb = ({ delay = 0, size = 200, color = 'accent' }: { delay?: number; size?: number; color?: string }) => (
  <motion.div
    className={`absolute rounded-full blur-3xl opacity-20 bg-${color}`}
    style={{ width: size, height: size }}
    animate={{
      y: [0, -30, 0],
      x: [0, 20, 0],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 8,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
);

const ProcessStep = ({ 
  number, 
  title, 
  description, 
  icon: Icon, 
  features,
  reverse = false 
}: { 
  number: string; 
  title: string; 
  description: string; 
  icon: any;
  features: string[];
  reverse?: boolean;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-20`}
    >
      {/* Visual Side */}
      <div className="flex-1 relative">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative aspect-square max-w-md mx-auto"
        >
          {/* Glowing background */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-primary/10 to-transparent rounded-3xl blur-2xl" />
          
          {/* Main card */}
          <div className="relative h-full bg-gradient-to-br from-secondary/80 to-secondary/40 backdrop-blur-xl rounded-3xl border border-border/50 p-8 flex flex-col items-center justify-center overflow-hidden">
            {/* Animated lines */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent w-full"
                  style={{ top: `${20 + i * 15}%` }}
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 3 + i, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
                />
              ))}
            </div>
            
            {/* Step number */}
            <motion.span
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
              className="text-8xl lg:text-9xl font-bold text-accent/20 absolute -top-4 -left-4"
            >
              {number}
            </motion.span>
            
            {/* Icon */}
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              <div className="w-24 h-24 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20">
                <Icon className="w-12 h-12 text-accent" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Content Side */}
      <div className="flex-1 text-center lg:text-left">
        <motion.div
          initial={{ opacity: 0, x: reverse ? -50 : 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <span className="text-accent text-sm font-semibold tracking-widest uppercase mb-4 block">
            Step {number}
          </span>
          <h3 className="text-3xl lg:text-4xl font-bold mb-6">{title}</h3>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            {description}
          </p>
          
          {/* Features */}
          <div className="space-y-3">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                <span className="text-muted-foreground">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function HowItWorksPage() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const backgroundY = useTransform(smoothProgress, [0, 1], ['0%', '50%']);
  const scale = useTransform(smoothProgress, [0, 0.5], [1, 1.1]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const steps = [
    {
      number: "01",
      title: t("Berätta om ditt projekt", "Tell us about your project"),
      description: t(
        "Fyll i vårt enkla formulär med dina önskemål. Vi behöver veta vad du gör, vad du vill uppnå och hur din drömwebbplats ser ut.",
        "Fill out our simple form with your requirements. We need to know what you do, what you want to achieve, and what your dream website looks like."
      ),
      icon: MessageSquare,
      features: [
        t("5-minuters formulär", "5-minute form"),
        t("Ladda upp inspiration & logotyp", "Upload inspiration & logo"),
        t("Beskriv din målgrupp", "Describe your target audience"),
      ]
    },
    {
      number: "02",
      title: t("Vi designar ditt koncept", "We design your concept"),
      description: t(
        "Inom 72 timmar får du ett komplett designkoncept. Vi skapar mockups, väljer färger, typografi och layout som passar ditt varumärke.",
        "Within 72 hours, you'll receive a complete design concept. We create mockups, choose colors, typography, and layout that fits your brand."
      ),
      icon: Palette,
      features: [
        t("Komplett designförslag", "Complete design proposal"),
        t("Mobiloptimerad preview", "Mobile-optimized preview"),
        t("Obegränsade revisioner", "Unlimited revisions"),
      ]
    },
    {
      number: "03",
      title: t("Vi bygger din webbplats", "We build your website"),
      description: t(
        "När du godkänner konceptet börjar vi koda. Modern teknik, snabb laddning, SEO-optimerat – allt inkluderat.",
        "Once you approve the concept, we start coding. Modern technology, fast loading, SEO-optimized – everything included."
      ),
      icon: Code,
      features: [
        t("Responsiv design", "Responsive design"),
        t("SEO-optimerad", "SEO-optimized"),
        t("SSL-certifikat & säkerhet", "SSL certificate & security"),
      ]
    },
    {
      number: "04",
      title: t("Lansering & support", "Launch & support"),
      description: t(
        "Vi publicerar din webbplats och ser till att allt fungerar perfekt. Du får full support och vi hanterar all teknisk underhåll.",
        "We publish your website and make sure everything works perfectly. You get full support and we handle all technical maintenance."
      ),
      icon: Rocket,
      features: [
        t("Gratis domän första året", "Free domain first year"),
        t("Hosting inkluderat", "Hosting included"),
        t("Löpande support", "Ongoing support"),
      ]
    }
  ];

  const stats = [
    { value: "72h", label: t("Koncept levererat", "Concept delivered") },
    { value: "100%", label: t("Nöjda kunder", "Satisfied clients") },
    { value: "24/7", label: t("Support tillgängligt", "Support available") },
    { value: "0kr", label: t("Dolda avgifter", "Hidden fees") },
  ];

  return (
    <div ref={containerRef} className="relative">
      {/* Hero Section with Parallax */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <motion.div 
          className="absolute inset-0"
          style={{ y: backgroundY, scale }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        </motion.div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />

        {/* Floating orbs */}
        <FloatingOrb delay={0} size={300} />
        <FloatingOrb delay={2} size={200} />
        <FloatingOrb delay={4} size={250} />

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-8"
            >
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">
                {t("Från idé till lansering", "From idea to launch")}
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
              <span className="block">{t("Så fungerar", "How it")}</span>
              <span className="block bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                {t("det", "works")}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12">
              {t(
                "En smidig process i fyra steg. Från första kontakt till färdig webbplats.",
                "A smooth process in four steps. From first contact to finished website."
              )}
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button asChild size="lg" className="rounded-full text-lg px-8 group">
                <Link to="/demo">
                  {t("Starta idag", "Start today")}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2"
            >
              <motion.div
                animate={{ opacity: [1, 0], y: [0, 12] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-2 bg-accent rounded-full"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section with Parallax */}
      <section className="relative py-24 overflow-hidden">
        <motion.div
          style={{ y: useTransform(smoothProgress, [0, 0.3], ['0%', '-10%']) }}
          className="container mx-auto px-4"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Process Steps with Advanced Parallax */}
      <section className="relative py-24 lg:py-40">
        {/* Connecting line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent/20 to-transparent hidden lg:block" />
        
        <div className="container mx-auto px-4">
          <div className="space-y-32 lg:space-y-48">
            {steps.map((step, i) => (
              <ProcessStep key={i} {...step} reverse={i % 2 === 1} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <motion.div
          style={{ scale: useTransform(smoothProgress, [0.8, 1], [0.95, 1]) }}
          className="container mx-auto px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-secondary via-secondary/80 to-secondary rounded-3xl p-12 lg:p-20 text-center overflow-hidden"
          >
            {/* Background effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--accent-rgb),0.1),transparent_70%)]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
            
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-20 -right-20 w-40 h-40 border border-accent/10 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-20 -left-20 w-60 h-60 border border-accent/10 rounded-full"
            />

            <div className="relative z-10">
              <Sparkles className="w-12 h-12 text-accent mx-auto mb-6" />
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                {t("Redo att börja?", "Ready to start?")}
              </h2>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                {t(
                  "Få ett gratis designkoncept inom 72 timmar. Ingen betalning krävs.",
                  "Get a free design concept within 72 hours. No payment required."
                )}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="rounded-full text-lg px-8 group">
                  <Link to="/demo">
                    {t("Få gratis koncept", "Get free concept")}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full text-lg px-8">
                  <Link to="/portfolio">
                    {t("Se vårt arbete", "See our work")}
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}