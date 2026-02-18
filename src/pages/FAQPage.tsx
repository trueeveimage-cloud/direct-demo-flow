import { Link } from 'react-router-dom';
import { ArrowRight, Plus, Minus, HelpCircle, Sparkles, MessageSquare, Zap } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ParallaxSection, FloatingShapes, TiltCard } from '@/components/ParallaxSection';
import { MagneticButton } from '@/components/MagneticButton';
import { GrainOverlay, FloatingParticles, ScrollingAmbientGlow } from '@/components/PremiumEffects';

// Static floating element component
const FloatingIcon = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`absolute pointer-events-none ${className}`}>
    {children}
  </div>
);

// FAQ Item component with smooth animations
const FAQItem = ({ 
  question, 
  answer, 
  isOpen, 
  onClick,
  index
}: { 
  question: string; 
  answer: string; 
  isOpen: boolean; 
  onClick: () => void; 
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: -10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={`relative border rounded-xl overflow-hidden transition-all duration-300 ${
        isOpen 
          ? 'border-accent/50 bg-accent/5 shadow-lg shadow-accent/5' 
          : 'border-border hover:border-accent/30 bg-background'
      }`}
    >
      {/* Glow effect when open */}
      {isOpen && (
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5 pointer-events-none" />
      )}

      <button 
        onClick={onClick} 
        className="w-full flex items-center justify-between p-5 sm:p-6 text-left group relative z-10"
      >
        <span className="font-medium pr-4 text-base sm:text-lg group-hover:text-accent transition-colors">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
            isOpen ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground group-hover:bg-accent/20 group-hover:text-accent'
          }`}
        >
          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </motion.div>
      </button>
      
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="overflow-hidden"
      >
        <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
          <p className="text-muted-foreground leading-relaxed">
            {answer}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function FAQPage() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Parallax for hero
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const faqs = [
    { 
      q: t('Hur fungerar det gratis konceptet?', 'How does the free concept work?'), 
      a: t('Du betalar en liten bokningsavgift (500 kr / $50) för att säkra din plats. Inom 72 timmar levererar vi ett skräddarsytt designförslag. Gillar du det inte? Pengarna tillbaka — inga frågor. Går du vidare räknas avgiften av på slutpriset.', 'You pay a small booking fee ($50 / 500 kr) to secure your spot. Within 72 hours we deliver a custom design proposal. Don\'t like it? Full refund — no questions asked. If you proceed, the fee is deducted from the final price.') 
    },
    { 
      q: t('Vad kostar en hemsida?', 'What does a website cost?'), 
      a: t('Vi har tre paket: Starter (2 900 kr / $290, 3 sidor), Standard (5 900 kr / $590, 5 sidor) och Pro (12 900 kr / $1 290, obegränsade sidor + bokningssystem). Just nu 25% rabatt på alla paket!', 'We have three packages: Starter ($290 / 2,900 kr, 3 pages), Standard ($590 / 5,900 kr, 5 pages), and Pro ($1,290 / 12,900 kr, unlimited pages + booking). Currently 25% off all packages!') 
    },
    { 
      q: t('Hur lång är leveranstiden?', 'How long does delivery take?'), 
      a: t('Designförslaget levereras inom 72 timmar. Den färdiga hemsidan är klar inom 7 arbetsdagar efter att du godkänt förslaget.', 'The design proposal is delivered within 72 hours. The finished website is ready within 7 business days after you approve the design.') 
    },
    { 
      q: t('Vad händer om jag inte gillar designen?', "What if I don't like the design?"), 
      a: t('Du har 5 dagars ångerfrist. Är du inte nöjd med konceptet återbetalas bokningsavgiften fullt ut — inga krångel. Vi vill att du ska vara hundra procent nöjd.', 'You have a 5-day refund window. Not happy with the concept? The booking fee is fully refunded — no hassle. We want you to be 100% satisfied.') 
    },
    { 
      q: t('Ingår hosting och domän?', 'Is hosting and domain included?'), 
      a: t('Ja! Våra vårdplaner börjar från 249 kr/mån och inkluderar hosting, domän, säkerhetsuppdateringar och support. Du kan också välja att hosta själv om du föredrar det.', 'Yes! Our care plans start from $25/month and include hosting, domain, security updates and support. You can also self-host if you prefer.') 
    },
    { 
      q: t('Kan jag hoppa över konceptsteget och beställa direkt?', 'Can I skip the concept and order directly?'), 
      a: t('Absolut. Om du redan vet vad du vill ha kan du använda vår direktbeställning och vi börjar bygga direkt.', 'Absolutely. If you already know what you want, use our direct order and we start building right away.') 
    },
    { 
      q: t('Hur många ändringar ingår?', 'How many revisions are included?'), 
      a: t('Starter: 10 ändringsrundor. Standard: 20 ändringsrundor. Pro: obegränsade ändringar. Vi jobbar tills du är nöjd.', 'Starter: 10 revision rounds. Standard: 20 revision rounds. Pro: unlimited revisions. We work until you\'re happy.') 
    },
    { 
      q: t('Är mina uppgifter säkra?', 'Is my data safe?'), 
      a: t('Ja. All data lagras säkert inom EU och hanteras i enlighet med GDPR. Vi använder krypterade anslutningar och delar aldrig dina uppgifter med tredje part utan ditt samtycke.', 'Yes. All data is stored securely within the EU and handled in accordance with GDPR. We use encrypted connections and never share your data with third parties without your consent.') 
    },
    { 
      q: t('Vad händer om ni inte håller leveranstiden?', 'What if you miss the delivery deadline?'), 
      a: t('Om vi inte levererar konceptet inom 72 timmar (eller hemsidan inom 7 dagar) kontaktar vi dig proaktivt. Vid förseningar från vår sida erbjuder vi kompensation eller full återbetalning.', 'If we don\'t deliver the concept within 72 hours (or the site within 7 days), we contact you proactively. For delays on our end, we offer compensation or a full refund.') 
    },
    { 
      q: t('Kan jag se era tidigare arbeten?', 'Can I see your previous work?'), 
      a: t('Ja! Kolla in vår portfolio-sida för exempel på hemsidor vi byggt för restauranger, salonger, butiker och andra företag.', 'Yes! Check out our portfolio page for examples of websites we\'ve built for restaurants, salons, shops and other businesses.') 
    },
  ];

  return (
    <div className="relative overflow-hidden">
      <GrainOverlay />
      <FloatingParticles count={12} />
      <ScrollingAmbientGlow />

      <div className="section-padding pt-28 pb-20 relative z-10">
        <div className="container-narrow">
          {/* Header with parallax */}
          <motion.div 
            ref={heroRef}
            style={{ y: heroY, opacity: heroOpacity }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6"
            >
              <HelpCircle className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">
                {t('Svar på vanliga frågor', 'Answers to common questions')}
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extralight mb-6 tracking-tight"
            >
              {t('Vanliga ', 'Frequently Asked ')}
              <span className="bg-gradient-to-r from-accent via-orange-400 to-accent bg-clip-text text-transparent">
                {t('frågor', 'Questions')}
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-xl mx-auto"
            >
              {t('Hitta svar på de vanligaste frågorna om vår tjänst.', 'Find answers to the most common questions about our service.')}
            </motion.p>
          </motion.div>

          {/* FAQ List with parallax wrapper */}
          <ParallaxSection speed={0.2} floatingElements>
            <div className="space-y-4 mb-20">
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.q}
                  answer={faq.a}
                  isOpen={openIndex === index}
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  index={index}
                />
              ))}
            </div>
          </ParallaxSection>

          {/* CTA Section with parallax */}
          <ParallaxSection speed={0.3} accentGlow scaleOnView>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-accent/5 to-accent/10 rounded-2xl blur-xl" />
              <TiltCard>
                <div className="relative bg-gradient-to-br from-secondary/80 to-secondary/40 backdrop-blur-xl rounded-2xl border border-border/50 p-8 sm:p-12 text-center overflow-hidden glass-premium">
                  {/* Animated corner accents */}
                  <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-accent/20 rounded-tl-2xl" />
                  <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-accent/20 rounded-br-2xl" />
                  
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Sparkles className="w-10 h-10 text-accent mx-auto mb-4" />
                  </motion.div>
                  
                  <h2 className="text-2xl sm:text-3xl font-light mb-4 tracking-tight">
                    {t('Har du fler frågor?', 'Have more questions?')}
                  </h2>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    {t('Kontakta oss så svarar vi inom 24 timmar.', 'Contact us and we\'ll reply within 24 hours.')}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <MagneticButton>
                      <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                        <Link to="/kontakt">{t('Kontakta oss', 'Contact us')}</Link>
                      </Button>
                    </MagneticButton>
                    <MagneticButton>
                      <Button asChild variant="outline" size="lg" className="rounded-full px-8 group">
                        <Link to="/demo">
                          {t('Få ditt gratis koncept', 'Get your free concept')}
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </MagneticButton>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          </ParallaxSection>
        </div>
      </div>
    </div>
  );
}
