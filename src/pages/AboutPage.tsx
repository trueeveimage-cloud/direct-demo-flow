import { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, useMotionValueEvent } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, Sparkles } from 'lucide-react';
import { AmbientAudio } from '@/components/AmbientAudio';
import { useState } from 'react';

// Cinematic text reveal with blur and 3D effect
function RevealText({ 
  children, 
  className = '',
  delay = 0,
  direction = 'up'
}: { 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right';
}) {
  const initial = {
    up: { opacity: 0, y: 60, rotateX: 15, filter: 'blur(12px)' },
    left: { opacity: 0, x: -60, filter: 'blur(12px)' },
    right: { opacity: 0, x: 60, filter: 'blur(12px)' },
  };

  const animate = {
    opacity: 1, 
    y: 0, 
    x: 0,
    rotateX: 0,
    filter: 'blur(0px)'
  };

  return (
    <motion.div
      initial={initial[direction]}
      whileInView={animate}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ 
        duration: 1.4, 
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      style={{ transformPerspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Word-by-word reveal for dramatic effect
function WordReveal({ 
  text, 
  className = '',
  highlightWords = []
}: { 
  text: string; 
  className?: string;
  highlightWords?: string[];
}) {
  const words = text.split(' ');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ 
            duration: 0.6, 
            delay: i * 0.08,
            ease: [0.22, 1, 0.36, 1]
          }}
          className={`inline-block mr-[0.3em] ${
            highlightWords.includes(word.toLowerCase().replace(/[.,!?]/g, '')) 
              ? 'text-accent' 
              : ''
          }`}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

// Parallax wrapper with depth
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

// Horizontal line that draws in
function AnimatedLine({ className = '' }: { className?: string }) {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className={`h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent origin-left ${className}`}
    />
  );
}

// Floating particle effect with depth layers
function FloatingParticles() {
  const particles = useMemo(() => 
    [...Array(30)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: 5 + Math.random() * 8,
      delay: Math.random() * 3,
      opacity: Math.random() * 0.3 + 0.1,
    })), []
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-accent"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [p.opacity, p.opacity * 2, p.opacity],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

// Film grain overlay
function GrainOverlay() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[60] opacity-[0.025] mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

// Cinematic quote block
function CinematicQuote({ 
  quote, 
  author 
}: { 
  quote: string; 
  author?: string;
}) {
  return (
    <motion.blockquote
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative py-12 px-8 md:px-16"
    >
      <div className="absolute left-0 top-0 text-8xl text-accent/10 font-serif leading-none">"</div>
      <p className="text-2xl md:text-4xl font-heading font-light text-foreground/90 leading-relaxed italic">
        {quote}
      </p>
      {author && (
        <footer className="mt-6 text-sm text-muted-foreground tracking-widest uppercase">
          — {author}
        </footer>
      )}
    </motion.blockquote>
  );
}

// Philosophy statement with elegant entrance
function PhilosophyStatement({ text, index }: { text: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ 
        duration: 1,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1]
      }}
      className="group py-8 md:py-10 border-b border-accent/10 last:border-b-0"
    >
      <div className="flex items-start gap-6">
        <span className="text-accent/40 font-mono text-sm mt-2">0{index + 1}</span>
        <p className="text-xl md:text-3xl font-heading font-light text-foreground/90 tracking-tight group-hover:text-foreground transition-colors duration-500">
          {text}
        </p>
      </div>
    </motion.div>
  );
}

// Section divider with animation
function SectionDivider() {
  return (
    <div className="relative h-32 md:h-48 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-2 h-2 rounded-full bg-accent/50"
      />
      <motion.div
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="absolute w-px h-full bg-gradient-to-b from-transparent via-accent/20 to-transparent"
      />
    </div>
  );
}

export default function AboutPage() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgressValue, setScrollProgressValue] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  // Track scroll progress for ambient audio
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollProgressValue(latest);
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  const philosophyStatements = [
    t("Design med syfte, inte för att fylla utrymme.", "Design with purpose, not to fill space."),
    t("Hemsidor som jobbar medan du sover.", "Websites that work while you sleep."),
    t("Inga blinda betalningar. Inga veckor av väntan.", "No blind payments. No weeks of waiting."),
    t("Skönhet i varje pixel. Funktion i varje klick.", "Beauty in every pixel. Function in every click."),
    t("Teknik som förstärker, inte komplicerar.", "Technology that amplifies, not complicates."),
  ];

  return (
    <div ref={containerRef} className="relative bg-background min-h-screen overflow-hidden">
      <FloatingParticles />
      <GrainOverlay />
      
      {/* Ambient audio that fades in with scroll */}
      <AmbientAudio scrollProgress={scrollProgressValue} maxVolume={0.12} />
      
      {/* Progress bar */}
      <motion.div 
        className="fixed top-0 left-0 h-[2px] bg-gradient-to-r from-accent via-accent to-accent/50 z-[70]"
        style={{ width: progressWidth }}
      />

      {/* ===== OPENING SCENE ===== */}
      <section className="relative min-h-[100vh] flex items-center justify-center px-6">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: backgroundY }}
        >
          {/* Ambient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[800px] bg-accent/[0.03] rounded-full blur-[200px]" />
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-accent/[0.02] rounded-full blur-[150px]" />
        </motion.div>

        <motion.div 
          className="relative z-10 max-w-5xl mx-auto text-center"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 text-accent/70 text-sm tracking-[0.4em] uppercase">
              <Sparkles className="w-4 h-4" />
              {t("Vår berättelse", "Our Story")}
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 60, filter: 'blur(20px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-5xl md:text-7xl lg:text-8xl font-extralight tracking-tight leading-[1.05]"
          >
            <span className="text-foreground">Nomia {t("föddes ur", "was born from")}</span>
            <br />
            <span className="bg-gradient-to-r from-accent via-accent to-accent/70 bg-clip-text text-transparent">{t("frustration", "frustration")}</span>
            <br />
            <span className="text-foreground/80">— {t("och ambition", "and ambition")}.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 2 }}
            className="mt-20"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="text-muted-foreground/40"
            >
              <span className="text-xs tracking-[0.3em] uppercase">{t("Scrolla för att upptäcka", "Scroll to discover")}</span>
              <div className="mt-6 mx-auto w-px h-16 bg-gradient-to-b from-accent/40 to-transparent" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <SectionDivider />

      {/* ===== THE PROBLEM ===== */}
      <section className="relative min-h-[90vh] flex items-center px-6 py-32">
        <div className="max-w-4xl mx-auto">
          <RevealText className="mb-6">
            <span className="text-accent/50 text-xs tracking-[0.4em] uppercase font-medium">
              {t("Kapitel ett", "Chapter One")}
            </span>
          </RevealText>

          <RevealText delay={0.1}>
            <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-extralight text-foreground mb-16 leading-tight tracking-tight">
              <WordReveal 
                text={t("Webbbranschen var trasig.", "The web industry was broken.")} 
                highlightWords={['trasig', 'broken']}
              />
            </h2>
          </RevealText>

          <AnimatedLine className="mb-16" />

          <div className="space-y-12">
            <ParallaxLayer speed={0.15}>
              <RevealText delay={0.2} direction="left">
                <p className="text-xl md:text-2xl text-muted-foreground/70 leading-relaxed font-light">
                  {t("Företag betalade tiotusentals kronor för hemsidor som tog månader att leverera.", 
                     "Businesses were paying tens of thousands for websites that took months to deliver.")}
                </p>
              </RevealText>
            </ParallaxLayer>

            <ParallaxLayer speed={0.2}>
              <RevealText delay={0.35} direction="left">
                <p className="text-xl md:text-2xl text-muted-foreground/70 leading-relaxed font-light">
                  {t("Byråer som inte lyssnade. Designers som inte förstod affärer. Resultat som aldrig fungerade.",
                     "Agencies that didn't listen. Designers who didn't understand business. Results that never worked.")}
                </p>
              </RevealText>
            </ParallaxLayer>

            <ParallaxLayer speed={0.25}>
              <RevealText delay={0.5} direction="left">
                <p className="text-2xl md:text-3xl text-foreground/90 leading-relaxed font-light">
                  {t("Det var inte rätt. Det behövde inte vara så.",
                     "It wasn't right. It didn't have to be this way.")}
                </p>
              </RevealText>
            </ParallaxLayer>
          </div>
        </div>

        {/* Background accent */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.04 }}
          viewport={{ once: true }}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-[500px] bg-gradient-to-l from-destructive/30 to-transparent blur-[120px] pointer-events-none"
        />
      </section>

      <SectionDivider />

      {/* ===== THE TURNING POINT ===== */}
      <section className="relative min-h-[90vh] flex items-center px-6 py-32">
        <div className="max-w-4xl mx-auto">
          <RevealText className="mb-6">
            <span className="text-accent/50 text-xs tracking-[0.4em] uppercase font-medium">
              {t("Kapitel två", "Chapter Two")}
            </span>
          </RevealText>

          <RevealText delay={0.1}>
            <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-extralight text-foreground mb-16 leading-tight tracking-tight">
              <WordReveal 
                text={t("Två vänner från Sverige bestämde sig.", "Two friends from Sweden decided.")} 
                highlightWords={['sverige', 'sweden']}
              />
            </h2>
          </RevealText>

          <AnimatedLine className="mb-16" />

          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            <ParallaxLayer speed={0.1}>
              <RevealText delay={0.2}>
                <p className="text-xl md:text-2xl text-muted-foreground/70 leading-relaxed font-light">
                  {t("Med en passion för ren, skandinavisk design och en förståelse för modern teknik.",
                     "With a passion for clean, Scandinavian design and an understanding of modern technology.")}
                </p>
              </RevealText>
            </ParallaxLayer>

            <ParallaxLayer speed={0.15}>
              <RevealText delay={0.35}>
                <p className="text-xl md:text-2xl text-muted-foreground/70 leading-relaxed font-light">
                  {t("Vi såg vad som var möjligt. Vi såg vad som saknades. Vi byggde Nomia.",
                     "We saw what was possible. We saw what was missing. We built Nomia.")}
                </p>
              </RevealText>
            </ParallaxLayer>
          </div>

          <RevealText delay={0.5} className="mt-16">
            <p className="text-2xl md:text-3xl text-foreground/90 leading-relaxed font-light text-center">
              {t("Inte en traditionell byrå. Något helt nytt.",
                 "Not a traditional agency. Something entirely new.")}
            </p>
          </RevealText>
        </div>

        {/* Scandinavian geometric elements */}
        <motion.div
          initial={{ opacity: 0, rotate: 45, scale: 0.8 }}
          whileInView={{ opacity: 0.05, rotate: 45, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:block"
        >
          <div className="w-48 h-48 border border-accent/40" />
          <div className="absolute top-6 left-6 w-48 h-48 border border-accent/20" />
          <div className="absolute top-12 left-12 w-48 h-48 border border-accent/10" />
        </motion.div>
      </section>

      <SectionDivider />

      {/* ===== CINEMATIC QUOTE ===== */}
      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <CinematicQuote 
            quote={t(
              "Vi tror att varje företag förtjänar en hemsida som speglar deras ambition — inte deras budget.",
              "We believe every business deserves a website that reflects their ambition — not their budget."
            )}
          />
        </div>
      </section>

      <SectionDivider />

      {/* ===== THE SOLUTION ===== */}
      <section className="relative min-h-[90vh] flex items-center px-6 py-32 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <RevealText className="mb-6">
            <span className="text-accent/50 text-xs tracking-[0.4em] uppercase font-medium">
              {t("Kapitel tre", "Chapter Three")}
            </span>
          </RevealText>

          <RevealText delay={0.1}>
            <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-extralight text-foreground mb-16 leading-tight tracking-tight">
              <WordReveal 
                text={t("Mänsklig design. Modern teknik.", "Human design. Modern technology.")} 
                highlightWords={['design', 'teknik', 'technology']}
              />
            </h2>
          </RevealText>

          <AnimatedLine className="mb-16" />

          <div className="space-y-12">
            <RevealText delay={0.2}>
              <p className="text-xl md:text-2xl text-muted-foreground/70 leading-relaxed font-light">
                {t("Vi kombinerar det bästa av två världar: det mänskliga ögat för skönhet och AI:s precision för effektivitet.",
                   "We combine the best of two worlds: the human eye for beauty and AI's precision for efficiency.")}
              </p>
            </RevealText>

            <RevealText delay={0.35}>
              <p className="text-xl md:text-2xl text-muted-foreground/70 leading-relaxed font-light">
                {t("Resultatet? Hemsidor som levereras snabbare, kostar mindre och presterar bättre.",
                   "The result? Websites delivered faster, costing less, and performing better.")}
              </p>
            </RevealText>

            <RevealText delay={0.5}>
              <p className="text-2xl md:text-3xl text-foreground/90 leading-relaxed font-light">
                {t("Varje hemsida är unik. Varje projekt är personligt.",
                   "Every website is unique. Every project is personal.")}
              </p>
            </RevealText>
          </div>
        </div>

        {/* Floating UI mockups */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 0.1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[400px] h-[500px] hidden lg:block"
        >
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-0 w-64 h-44 rounded-xl border border-accent/40 bg-accent/5"
          />
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-20 right-24 w-48 h-32 rounded-xl border border-accent/30 bg-accent/3"
          />
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-1/2 right-8 w-56 h-36 rounded-xl border border-accent/20 bg-accent/5"
          />
        </motion.div>
      </section>

      <SectionDivider />

      {/* ===== THE PHILOSOPHY ===== */}
      <section className="relative min-h-[80vh] flex items-center px-6 py-32">
        <div className="max-w-4xl mx-auto w-full">
          <RevealText className="mb-6">
            <span className="text-accent/50 text-xs tracking-[0.4em] uppercase font-medium">
              {t("Vår filosofi", "Our Philosophy")}
            </span>
          </RevealText>

          <RevealText delay={0.1} className="mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-extralight text-foreground/80 tracking-tight">
              {t("Principer vi lever efter.", "Principles we live by.")}
            </h2>
          </RevealText>

          <AnimatedLine className="mb-8" />

          <div>
            {philosophyStatements.map((statement, i) => (
              <PhilosophyStatement key={i} text={statement} index={i} />
            ))}
          </div>
        </div>

        {/* Ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-accent/[0.02] rounded-full blur-[180px] pointer-events-none" />
      </section>

      <SectionDivider />

      {/* ===== CLOSING SCENE ===== */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-6 py-32">
        <div className="max-w-4xl mx-auto text-center">
          <RevealText delay={0}>
            <p className="text-lg md:text-xl text-muted-foreground/50 mb-12 tracking-wide font-light">
              {t("Du har nått slutet av vår berättelse.", "You've reached the end of our story.")}
            </p>
          </RevealText>

          <RevealText delay={0.2}>
            <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-extralight text-foreground/90 mb-6 leading-tight tracking-tight">
              {t("Det här är hur moderna", "This is how modern")}
            </h2>
          </RevealText>

          <RevealText delay={0.35}>
            <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-extralight mb-16 leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-accent via-accent to-accent/70 bg-clip-text text-transparent">
                {t("hemsidor ska kännas.", "websites should feel.")}
              </span>
            </h2>
          </RevealText>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button 
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-10 py-7 text-lg hover:scale-105 transition-all duration-300 rounded-full"
            >
              <Link to="/bestall" className="flex items-center gap-3">
                {t("Skapa din hemsida", "Create Your Website")}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            
            <Button 
              asChild
              variant="outline"
              size="lg"
              className="px-10 py-7 text-lg rounded-full border-border/50 hover:border-accent/50 transition-all duration-300"
            >
              <Link to="/demo">
                {t("Eller börja med gratis demo", "Or start with free demo")}
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Final ambient glow */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-t from-accent/[0.08] to-transparent blur-[120px] pointer-events-none"
        />
      </section>

      {/* Spacer */}
      <div className="h-24" />
    </div>
  );
}
