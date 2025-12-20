import { Star, Quote } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { AnimatedSection } from './AnimatedSection';

const testimonials = [
  {
    name: 'Anna Lindberg',
    business: { sv: 'Salong Glow', en: 'Salon Glow' },
    quote: {
      sv: 'Fantastisk service! Fick min demo inom 48 timmar och webbplatsen var precis som jag hade föreställt mig. Bokningarna har ökat med 40% sedan lanseringen.',
      en: 'Amazing service! Got my demo within 48 hours and the website was exactly as I imagined. Bookings have increased by 40% since launch.'
    },
    rating: 5
  },
  {
    name: 'Erik Johansson',
    business: { sv: 'Johansson Bygg', en: 'Johansson Construction' },
    quote: {
      sv: 'Professionellt och snabbt. De förstod precis vad mitt företag behövde. Nu får jag förfrågningar via webbplatsen varje vecka.',
      en: 'Professional and fast. They understood exactly what my business needed. Now I get inquiries via the website every week.'
    },
    rating: 5
  },
  {
    name: 'Maria Svensson',
    business: { sv: 'Café Solsken', en: 'Café Sunshine' },
    quote: {
      sv: 'Bästa investeringen för mitt café. Enkel att uppdatera menyn och kunderna älskar designen. Rekommenderar varmt!',
      en: 'Best investment for my café. Easy to update the menu and customers love the design. Highly recommend!'
    },
    rating: 5
  }
];

export function Testimonials() {
  const { t } = useLanguage();

  return (
    <section className="section-padding py-20 bg-secondary/30">
      <div className="container-wide">
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              {t('Vad våra kunder säger', 'What our customers say')}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t(
                'Lyssna på företagare som valt oss för sin webbplats.',
                'Hear from business owners who chose us for their website.'
              )}
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <AnimatedSection key={index} animation="fade-up" delay={index * 100}>
              <div className="bg-background p-6 rounded-lg border border-border h-full flex flex-col hover:border-accent hover:shadow-lg transition-all duration-300">
                <Quote className="w-8 h-8 text-accent/30 mb-4" />
                
                <p className="text-sm text-muted-foreground flex-grow mb-4 italic">
                  "{t(testimonial.quote.sv, testimonial.quote.en)}"
                </p>

                <div className="flex gap-0.5 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>

                <div>
                  <p className="font-heading font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {t(testimonial.business.sv, testimonial.business.en)}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
