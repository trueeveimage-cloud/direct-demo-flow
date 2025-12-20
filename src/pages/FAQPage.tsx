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
      q: t('Är konceptet verkligen gratis?', 'Is the concept really free?'), 
      a: t('Ja, konceptet i sig är gratis. Du betalar en liten verifieringsavgift (10% av valt paket) för att boka din prioritetsplats. Om du inte gillar konceptet återbetalas avgiften helt.', 'Yes, the concept itself is free. You pay a small verification fee (10% of chosen package) to book your priority slot. If you don\'t like the concept, the fee is fully refunded.') 
    },
    { 
      q: t('Varför krävs verifieringsavgift?', 'Why is a verification fee required?'), 
      a: t('Avgiften visar att du är seriös och bokar en prioritetsplats. Den återbetalas om du inte vill gå vidare, eller dras av från slutpriset om du fortsätter.', 'The fee shows you\'re serious and books a priority slot. It\'s refunded if you don\'t proceed, or deducted from the final price if you do.') 
    },
    { 
      q: t('När börjar 72-timmarsnedräkningen?', 'When does the 72-hour countdown start?'), 
      a: t('Nedräkningen börjar först EFTER att: 1) du skickat in ALL obligatorisk info i formuläret, och 2) betalat verifieringsavgiften.', 'The countdown starts only AFTER: 1) you\'ve submitted ALL required info in the form, and 2) paid the verification fee.') 
    },
    { 
      q: t('Vad räknas som grund för återbetalning?', 'What counts as grounds for a refund?'), 
      a: t('Du kan avvisa konceptet inom 5 dagar efter leverans och få full återbetalning av verifieringsavgiften. Om du begär extra arbete utöver koncept-scopet innan du bestämt dig, kan återbetalning påverkas.', 'You can reject the concept within 5 days of delivery for a full refund of the verification fee. If you request extra work beyond the concept scope before deciding, the refund may be affected.') 
    },
    { 
      q: t('Hur många revisioner ingår?', 'How many revisions are included?'), 
      a: t('I konceptet ingår 1 revision. I de fullständiga paketen ingår 1-3 revisioner beroende på vilket paket du väljer.', 'The concept includes 1 revision. Full packages include 1-3 revisions depending on which package you choose.') 
    },
    { 
      q: t('Erbjuder ni hosting, domän och e-post?', 'Do you provide hosting, domain, and email?'), 
      a: t('Ja! Vi erbjuder månatliga vårdplaner som inkluderar hosting. Standard- och Pro-planerna inkluderar även domän och företagsmail.', 'Yes! We offer monthly care plans that include hosting. Standard and Pro plans also include domain and business email.') 
    },
    { 
      q: t('Kan ni lägga till bokning eller e-handel?', 'Can you add booking or e-commerce?'), 
      a: t('Bokning kan integreras med befintliga plattformar som Bokadirekt, Calendly, etc. För e-handel rekommenderar vi att diskutera dina specifika behov.', 'Booking can be integrated with existing platforms like Bokadirekt, Calendly, etc. For e-commerce, we recommend discussing your specific needs.') 
    },
    { 
      q: t('Vad händer om jag inte svarar på meddelanden?', 'What if I stop responding?'), 
      a: t('Om vi inte hör av dig på 14 dagar pausas projektet. Vi kontaktar dig innan paus.', 'If we don\'t hear from you for 14 days, the project is paused. We\'ll contact you before pausing.') 
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
