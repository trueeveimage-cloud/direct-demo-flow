import { Link } from 'react-router-dom';
import { ArrowRight, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { AnimatedSection } from '@/components/AnimatedSection';

export default function FAQPage() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { 
      q: t('Hur fungerar "gratis koncept"?', 'How does "free concept" work?'), 
      a: t('Du får ett gratis designkoncept för din webbplats. Du betalar en verifieringsavgift (10% av paketet) för att boka din plats. Om du inte gillar konceptet återbetalas avgiften helt. Om du går vidare dras den från slutpriset.', 'You get a free design concept for your website. You pay a verification fee (10% of package) to book your spot. If you don\'t like the concept, the fee is fully refunded. If you proceed, it\'s deducted from the final price.') 
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
    <div className="section-padding py-20">
      <div className="container-narrow">
        {/* Header */}
        <AnimatedSection animation="fade-up" className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t('Vanliga frågor', 'Frequently Asked Questions')}</h1>
          <p className="text-muted-foreground">{t('Svar på de vanligaste frågorna om vår tjänst.', 'Answers to the most common questions about our service.')}</p>
        </AnimatedSection>

        {/* FAQ List */}
        <div className="space-y-3 mb-16">
          {faqs.map((faq, index) => (
            <AnimatedSection key={index} animation="fade-up" delay={index * 50}>
              <div className="border border-border rounded-lg overflow-hidden">
                <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/50 transition-colors">
                  <span className="font-heading font-semibold pr-4">{faq.q}</span>
                  {openIndex === index ? <Minus className="w-5 h-5 flex-shrink-0 text-accent" /> : <Plus className="w-5 h-5 flex-shrink-0 text-muted-foreground" />}
                </button>
                {openIndex === index && <div className="px-4 pb-4 text-muted-foreground text-sm animate-fade-in">{faq.a}</div>}
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* CTA */}
        <AnimatedSection animation="fade-up" className="text-center bg-secondary/50 rounded-lg p-8">
          <h2 className="text-xl font-bold mb-3">{t('Har du fler frågor?', 'Have more questions?')}</h2>
          <p className="text-muted-foreground mb-6">{t('Kontakta oss så svarar vi inom 24 timmar.', 'Contact us and we\'ll reply within 24 hours.')}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild variant="outline"><Link to="/kontakt">{t('Kontakta oss', 'Contact us')}</Link></Button>
            <Button asChild><Link to="/demo">{t('Få ditt gratis koncept', 'Get your free concept')}<ArrowRight className="w-4 h-4" /></Link></Button>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}