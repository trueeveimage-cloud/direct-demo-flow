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
      q: t('Hur fungerar "gratis prototyp"?', 'How does "free prototype" work?'), 
      a: t('Du betalar en liten verifieringsavgift (500 kr / $50) för att boka din plats. Inom 72 timmar får du ett designförslag. Om du inte gillar det får du pengarna tillbaka – helt utan risk. Om du går vidare dras avgiften från slutpriset.', 'You pay a small verification fee ($50 / 500 kr) to book your spot. Within 72 hours you get a design proposal. If you don\'t like it, you get your money back – completely risk-free. If you proceed, the fee is deducted from the final price.') 
    },
    { 
      q: t('Vad kostar det?', 'What does it cost?'), 
      a: t('Vi har tre paket: Starter (2 900 kr / $290, 3 sidor), Standard (5 900 kr / $590, 5 sidor), och Pro (12 900 kr / $1,290, obegränsade sidor + bokningssystem). Just nu 25% rabatt på alla paket!', 'We have three packages: Starter ($290 / 2,900 kr, 3 pages), Standard ($590 / 5,900 kr, 5 pages), and Pro ($1,290 / 12,900 kr, unlimited pages + booking system). Currently 25% off all packages!') 
    },
    { 
      q: t('Hur lång är leveranstiden?', 'How long is the delivery time?'), 
      a: t('Din hemsida är klar inom 7 dagar efter godkänt koncept. Konceptet levereras inom 72 timmar efter din beställning.', 'Your website is ready within 7 days after approved concept. The concept is delivered within 72 hours of your order.') 
    },
    { 
      q: t('Vad händer om jag inte gillar designen?', "What if I don't like the design?"), 
      a: t('Du har 5 dagars ångerrätt. Om du inte är nöjd med konceptet får du tillbaka verifieringsavgiften utan frågor. Vi vill att du ska vara 100% nöjd.', 'You have a 5-day refund period. If you\'re not happy with the concept, you get the verification fee back, no questions asked. We want you to be 100% satisfied.') 
    },
    { 
      q: t('Ingår hosting och domän?', 'Is hosting and domain included?'), 
      a: t('Ja! Vi erbjuder vårdplaner från 249 kr/mån som inkluderar hosting, domän, säkerhetsuppdateringar och support. Du kan också välja att hosta själv.', 'Yes! We offer care plans from $25/month that include hosting, domain, security updates and support. You can also choose to host yourself.') 
    },
    { 
      q: t('Kan jag beställa utan att se koncept först?', 'Can I order without seeing a concept first?'), 
      a: t('Ja! Om du redan vet vad du vill ha kan du använda vår direktbeställning och hoppa över konceptsteget.', 'Yes! If you already know what you want, you can use our direct order option and skip the concept step.') 
    },
    { 
      q: t('Hur många ändringar ingår?', 'How many revisions are included?'), 
      a: t('Starter: 10 ändringar, Standard: 20 ändringar, Pro: Obegränsade ändringar. Vi slutar inte förrän du är nöjd.', 'Starter: 10 revisions, Standard: 20 revisions, Pro: Unlimited revisions. We don\'t stop until you\'re happy.') 
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
