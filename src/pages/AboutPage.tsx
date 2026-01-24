import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';

// Cinematic text reveal component
function RevealText({ 
  children, 
  className = '',
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ 
        duration: 1.2, 
        delay,
        ease: [0.25, 0.1, 0.25, 1] 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Line by line text reveal
function LineReveal({ 
  lines, 
  className = '' 
}: { 
  lines: string[]; 
  className?: string;
}) {
  return (
    <div className={className}>
      {lines.map((line, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ 
            duration: 0.8, 
            delay: i * 0.15,
            ease: [0.25, 0.1, 0.25, 1] 
          }}
          className="text-lg md:text-xl text-muted-foreground/80 leading-relaxed"
        >
          {line}
        </motion.p>
      ))}
    </div>
  );
}

// Parallax wrapper
function ParallaxLayer({ 
  children, 
  speed = 0.5,
  className = '' 
}: { 
  children: React.ReactNode; 
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed]);
  const smoothY = useSpring(y, { damping: 30, stiffness: 100 });

  return (
    <motion.div ref={ref} style={{ y: smoothY }} className={className}>
      {children}
    </motion.div>
  );
}

// Floating particle effect
function FloatingParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-accent/20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

// Grain overlay for texture
function GrainOverlay() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

// Philosophy statement with entrance animation
function PhilosophyStatement({ text, index }: { text: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ 
        duration: 1,
        delay: index * 0.2,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className="py-8 md:py-12 border-t border-accent/10 first:border-t-0"
    >
      <p className="text-2xl md:text-4xl font-heading font-light text-foreground/90 tracking-tight">
        {text}
      </p>
    </motion.div>
  );
}

export default function AboutPage() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const problemLines = [
    t("Företag betalade tiotusentals kronor för hemsidor som tog månader att leverera.", 
      "Businesses were paying tens of thousands for websites that took months to deliver."),
    t("Byråer som inte lyssnade. Resultat som inte fungerade.",
      "Agencies that didn't listen. Results that didn't work."),
    t("Det var inte rätt. Det behövde inte vara så.",
      "It wasn't right. It didn't have to be this way."),
  ];

  const philosophyStatements = [
    t("Design med syfte.", "Design with purpose."),
    t("Hemsidor som jobbar medan du sover.", "Websites that work while you sleep."),
    t("Inga blinda betalningar. Ingen väntan i veckor.", "No blind payments. No waiting weeks."),
    t("Skönhet i varje pixel. Funktion i varje klick.", "Beauty in every pixel. Function in every click."),
  ];

  return (
    <div ref={containerRef} className="relative bg-background min-h-screen overflow-hidden">
      <FloatingParticles />
      <GrainOverlay />
      
      {/* Progress bar */}
      <motion.div 
        className="fixed top-0 left-0 h-[2px] bg-accent z-50"
        style={{ width: progressWidth }}
      />

      {/* Hero / Opening Scene */}
      <section className="relative min-h-[100vh] flex items-center justify-center px-6">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: backgroundY }}
        >
          {/* Subtle radial gradient */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-accent/5 rounded-full blur-[150px]" />
        </motion.div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="inline-block text-accent/80 text-sm tracking-[0.3em] uppercase mb-8"
          >
            {t("Vår historia", "Our Story")}
          </motion.span>
          
          <motion.h1
            initial={{ opacity: 0, y: 40, filter: 'blur(20px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.5, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-heading text-4xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.1]"
          >
            <span className="text-foreground">Nomia {t("föddes ur", "was born from")}</span>
            <br />
            <span className="text-accent">{t("frustration", "frustration")}</span>
            <span className="text-foreground"> — {t("och ambition", "and ambition")}.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
            className="mt-16"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-muted-foreground/50"
            >
              <span className="text-sm tracking-widest uppercase">{t("Scrolla", "Scroll")}</span>
              <div className="mt-4 mx-auto w-[1px] h-12 bg-gradient-to-b from-accent/50 to-transparent" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* The Problem */}
      <section className="relative min-h-[80vh] flex items-center px-6 py-32">
        <div className="max-w-3xl mx-auto">
          <RevealText className="mb-12">
            <span className="text-accent/60 text-sm tracking-[0.3em] uppercase">
              {t("Problemet", "The Problem")}
            </span>
          </RevealText>

          <ParallaxLayer speed={0.2}>
            <RevealText delay={0.2}>
              <h2 className="font-heading text-3xl md:text-5xl font-light text-foreground/90 mb-12 leading-tight">
                {t("Webbbranschen var trasig.", "The web industry was broken.")}
              </h2>
            </RevealText>
          </ParallaxLayer>

          <LineReveal lines={problemLines} className="space-y-6" />
        </div>

        {/* Background visual element */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.03 }}
          viewport={{ once: true }}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-[400px] bg-gradient-to-l from-destructive/20 to-transparent blur-[100px] pointer-events-none"
        />
      </section>

      {/* The Turning Point */}
      <section className="relative min-h-[80vh] flex items-center px-6 py-32">
        <div className="max-w-3xl mx-auto">
          <RevealText className="mb-12">
            <span className="text-accent/60 text-sm tracking-[0.3em] uppercase">
              {t("Vändpunkten", "The Turning Point")}
            </span>
          </RevealText>

          <ParallaxLayer speed={0.3}>
            <RevealText delay={0.2}>
              <h2 className="font-heading text-3xl md:text-5xl font-light text-foreground/90 mb-12 leading-tight">
                {t("Två vänner från Sverige bestämde sig för att göra det bättre.", 
                   "Two friends from Sweden decided to do it better.")}
              </h2>
            </RevealText>
          </ParallaxLayer>

          <RevealText delay={0.4}>
            <p className="text-lg md:text-xl text-muted-foreground/80 leading-relaxed mb-8">
              {t("Med en passion för ren design och en förståelse för modern teknik, skapade vi Nomia.",
                 "With a passion for clean design and an understanding of modern technology, we created Nomia.")}
            </p>
          </RevealText>

          <RevealText delay={0.6}>
            <p className="text-lg md:text-xl text-muted-foreground/80 leading-relaxed">
              {t("Inte en traditionell byrå. Något helt nytt.",
                 "Not a traditional agency. Something entirely new.")}
            </p>
          </RevealText>
        </div>

        {/* Scandinavian abstract element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.06, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="absolute left-10 top-1/2 -translate-y-1/2 hidden lg:block"
        >
          <div className="w-64 h-64 border border-accent/20 rotate-45" />
          <div className="absolute top-4 left-4 w-64 h-64 border border-accent/10 rotate-45" />
        </motion.div>
      </section>

      {/* The Solution */}
      <section className="relative min-h-[80vh] flex items-center px-6 py-32 overflow-hidden">
        <div className="max-w-3xl mx-auto">
          <RevealText className="mb-12">
            <span className="text-accent/60 text-sm tracking-[0.3em] uppercase">
              {t("Lösningen", "The Solution")}
            </span>
          </RevealText>

          <ParallaxLayer speed={0.2}>
            <RevealText delay={0.2}>
              <h2 className="font-heading text-3xl md:text-5xl font-light text-foreground/90 mb-12 leading-tight">
                {t("Mänsklig design. Modern teknik. Perfekt harmoni.", 
                   "Human design. Modern technology. Perfect harmony.")}
              </h2>
            </RevealText>
          </ParallaxLayer>

          <RevealText delay={0.4}>
            <p className="text-lg md:text-xl text-muted-foreground/80 leading-relaxed mb-8">
              {t("Vi kombinerar hantverk och AI för att leverera snabbare, bättre och mer prisvärt än någon annan.",
                 "We combine craftsmanship and AI to deliver faster, better, and more affordable than anyone else.")}
            </p>
          </RevealText>

          <RevealText delay={0.6}>
            <p className="text-lg md:text-xl text-muted-foreground/80 leading-relaxed">
              {t("Varje hemsida är unik. Varje projekt är personligt.",
                 "Every website is unique. Every project is personal.")}
            </p>
          </RevealText>
        </div>

        {/* Animated UI elements in background */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 0.08, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[400px] hidden lg:block"
        >
          <div className="relative w-full h-full">
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 right-0 w-72 h-48 rounded-lg border border-accent/30 bg-accent/5"
            />
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-0 right-20 w-56 h-36 rounded-lg border border-accent/20 bg-accent/3"
            />
          </div>
        </motion.div>
      </section>

      {/* The Philosophy */}
      <section className="relative min-h-[80vh] flex items-center px-6 py-32">
        <div className="max-w-3xl mx-auto w-full">
          <RevealText className="mb-16">
            <span className="text-accent/60 text-sm tracking-[0.3em] uppercase">
              {t("Vår filosofi", "Our Philosophy")}
            </span>
          </RevealText>

          <div>
            {philosophyStatements.map((statement, i) => (
              <PhilosophyStatement key={i} text={statement} index={i} />
            ))}
          </div>
        </div>

        {/* Soft glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />
      </section>

      {/* Closing Scene */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-6 py-32">
        <div className="max-w-4xl mx-auto text-center">
          <RevealText delay={0}>
            <p className="text-lg md:text-xl text-muted-foreground/60 mb-8 tracking-wide">
              {t("Du har nått slutet.", "You've reached the end.")}
            </p>
          </RevealText>

          <RevealText delay={0.3}>
            <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-light text-foreground/90 mb-12 leading-tight">
              {t("Det här är hur moderna hemsidor ska kännas.", 
                 "This is how modern websites should feel.")}
            </h2>
          </RevealText>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <Button 
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-10 py-6 text-lg hover:scale-105 transition-transform duration-300"
            >
              <Link to="/bestall" className="flex items-center gap-3">
                {t("Skapa din hemsida", "Create Your Website")}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </motion.div>

          <RevealText delay={0.9}>
            <p className="mt-12 text-sm text-muted-foreground/40">
              {t("Eller", "Or")} <Link to="/demo" className="text-accent/80 hover:text-accent transition-colors underline underline-offset-4">{t("börja med en gratis demo", "start with a free demo")}</Link>
            </p>
          </RevealText>
        </div>

        {/* Final ambient glow */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-t from-accent/10 to-transparent blur-[100px] pointer-events-none"
        />
      </section>

      {/* Spacer for scroll */}
      <div className="h-32" />
    </div>
  );
}
