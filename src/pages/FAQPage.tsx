import { Link } from 'react-router-dom';
import { ArrowRight, Plus, Minus, HelpCircle, Sparkles, MessageSquare, Zap } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence, useInView } from 'framer-motion';

// Static floating element component - no animation for performance
const FloatingIcon = ({ children, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <div className={`absolute pointer-events-none ${className}`}>
    {children}
  </div>
);

// FAQ Item component with smooth animations
const FAQItem = ({ 
  question, 
  answer, 
  isOpen, 
  onClick
}: { 
  question: string; 
  answer: string; 
  isOpen: boolean; 
  onClick: () => void; 
  index: number;
}) => {
  return (
    <div
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
        <span className="font-semibold pr-4 text-base sm:text-lg group-hover:text-accent transition-colors">
          {question}
        </span>
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
            isOpen ? 'bg-accent text-accent-foreground rotate-180' : 'bg-muted text-muted-foreground group-hover:bg-accent/20 group-hover:text-accent'
          }`}
        >
          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </div>
      </button>
      
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}
      >
        <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
          <p className="text-muted-foreground leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function FAQPage() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const faqs = [
    { 
      q: t('Hur fungerar "gratis koncept"?', 'How does "free concept" work?'), 
      a: t('Du får ett gratis designkoncept för din webbplats. Du betalar en verifieringsavgift (€50) för att boka din plats. Om du inte gillar konceptet återbetalas avgiften helt. Om du går vidare dras den från slutpriset.', 'You get a free design concept for your website. You pay a verification fee (€50) to book your spot. If you don\'t like the concept, the fee is fully refunded. If you proceed, it\'s deducted from the final price.') 
    },
    { 
      q: t('Kan jag beställa direkt utan koncept?', 'Can I order directly without a concept?'), 
      a: t('Ja! Du kan använda vår direktbeställning för att gå direkt till produktion. Du fyller i alla detaljer i formuläret och vi börjar bygga din webbplats omedelbart.', 'Yes! You can use our direct checkout to go straight to production. You fill in all details in the form and we start building your website immediately.') 
    },
    { 
      q: t('Vilka paket erbjuder ni?', 'What packages do you offer?'), 
      a: t('Vi har tre paket: Starter (€490, 3 sidor), Standard (€790, 5 sidor, flerspråk), och Pro (€1,290, 8 sidor, flerspråk, bokningssystem, Google Analytics).', 'We have three packages: Starter (€490, 3 pages), Standard (€790, 5 pages, multi-language), and Pro (€1,290, 8 pages, multi-language, booking system, Google Analytics).') 
    },
    { 
      q: t('Vad ingår i bokningssystemet?', 'What\'s included in the booking system?'), 
      a: t('Vi skapar ditt helt egna bokningssystem integrerat med din webbplats. Det kan kopplas till plattformar som Bokadirekt, Calendly, Timely m.fl. Bokningssystem ingår endast i Pro-paketet.', 'We create your very own booking system integrated with your website. It can connect to platforms like Bokadirekt, Calendly, Timely, etc. Booking system is only included in the Pro package.') 
    },
    { 
      q: t('Hur skickar jag bilder och logotyp?', 'How do I send images and logo?'), 
      a: t('Efter din beställning får du en länk där du kan ladda upp allt material. Du kan också skicka dem via e-post till oss. Om du inte har bilder kan vi använda stockbilder, och om du inte har logotyp kan vi skapa en enkel åt dig.', 'After your order, you\'ll receive a link where you can upload all materials. You can also send them via email to us. If you don\'t have images, we can use stock photos, and if you don\'t have a logo, we can create a simple one for you.') 
    },
    { 
      q: t('Erbjuder ni hosting och domän?', 'Do you provide hosting and domain?'), 
      a: t('Ja! Vi erbjuder månatliga vårdplaner: Basic (€25/mån - hosting, uppdateringar), Standard (€45/mån - + domän, e-post, 1h ändringar/mån), och Pro (€75/mån - + 3h ändringar/mån, prioriterad support). Med årsbetalning sparar du 20%.', 'Yes! We offer monthly care plans: Basic (€25/month - hosting, updates), Standard (€45/month - + domain, email, 1h edits/month), and Pro (€75/month - + 3h edits/month, priority support). Save 20% with yearly payment.') 
    },
    { 
      q: t('Hur lång är leveranstiden?', 'What\'s the delivery time?'), 
      a: t('Leveranstiden beror på paketet: Starter 14 dagar, Standard 10 dagar, Pro 7 dagar. För konceptet levererar vi inom 72 timmar efter att du betalat verifieringsavgiften.', 'Delivery time depends on package: Starter 14 days, Standard 10 days, Pro 7 days. For concept, we deliver within 72 hours after you pay the verification fee.') 
    },
    { 
      q: t('Vad händer om jag vill ha ändringar?', 'What if I want changes?'), 
      a: t('I paketen ingår 1-3 revisioner beroende på paket. Med en vårdplan får du löpande ändringar varje månad (1h för Standard, 3h för Pro).', 'Packages include 1-3 revisions depending on package. With a care plan, you get ongoing changes every month (1h for Standard, 3h for Pro).') 
    },
    { 
      q: t('Får jag flerspråkig webbplats?', 'Do I get a multi-language website?'), 
      a: t('Ja, flerspråkig webbplats (svenska och engelska) ingår i Standard och Pro-paketen. För Starter kan det läggas till som tillägg.', 'Yes, multi-language website (Swedish and English) is included in Standard and Pro packages. For Starter, it can be added as an addon.') 
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-[10%] w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-[10%] w-[300px] h-[300px] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      {/* Floating decorative elements - hidden on mobile */}
      <div className="hidden md:block">
        <FloatingIcon delay={0} className="top-32 left-[8%]">
          <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-accent/40" />
          </div>
        </FloatingIcon>
        <FloatingIcon delay={1} className="top-48 right-[12%]">
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-primary/40" />
          </div>
        </FloatingIcon>
        <FloatingIcon delay={2} className="bottom-40 left-[15%]">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
            <Zap className="w-4 h-4 text-accent/40" />
          </div>
        </FloatingIcon>
      </div>

      <div className="section-padding pt-28 pb-20 relative z-10">
        <div className="container-narrow">
          {/* Header */}
          <motion.div 
            ref={heroRef}
            initial={{ opacity: 0, y: 40 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={heroInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6"
            >
              <HelpCircle className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">
                {t('Svar på vanliga frågor', 'Answers to common questions')}
              </span>
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              {t('Vanliga ', 'Frequently Asked ')}
              <span className="bg-gradient-to-r from-accent via-orange-400 to-accent bg-clip-text text-transparent">
                {t('frågor', 'Questions')}
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              {t('Hitta svar på de vanligaste frågorna om vår tjänst.', 'Find answers to the most common questions about our service.')}
            </p>
          </motion.div>

          {/* FAQ List */}
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

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-accent/5 to-accent/10 rounded-2xl blur-xl" />
            <div className="relative bg-gradient-to-br from-secondary/80 to-secondary/40 backdrop-blur-xl rounded-2xl border border-border/50 p-8 sm:p-12 text-center overflow-hidden">
              {/* Animated corner accents */}
              <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-accent/20 rounded-tl-2xl" />
              <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-accent/20 rounded-br-2xl" />
              
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Sparkles className="w-10 h-10 text-accent mx-auto mb-4" />
              </motion.div>
              
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                {t('Har du fler frågor?', 'Have more questions?')}
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                {t('Kontakta oss så svarar vi inom 24 timmar.', 'Contact us and we\'ll reply within 24 hours.')}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                  <Link to="/kontakt">{t('Kontakta oss', 'Contact us')}</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full px-8 group">
                  <Link to="/demo">
                    {t('Få ditt gratis koncept', 'Get your free concept')}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}