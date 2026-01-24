import { Star, Quote } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { AnimatedSection } from './AnimatedSection';

const testimonials = [
  {
    name: 'Gail',
    business: { sv: "Gail's Hair", en: "Gail's Hair" },
    quote: {
      sv: 'Fick en snygg bokningssida som matchar min stil perfekt. Kunderna säger att det är så enkelt att boka nu – och jag slipper svara på samtal hela dagarna.',
      en: 'Got a beautiful booking page that matches my style perfectly. Customers say it is so easy to book now – and I do not have to answer calls all day.'
    },
    rating: 5
  },
  {
    name: 'Marcus',
    business: { sv: 'Oh My Coffee', en: 'Oh My Coffee' },
    quote: {
      sv: 'Snyggt, snabbt och precis vad vi behövde. Folk hittar oss lättare och vi får fler besökare som sett menyn online först.',
      en: 'Clean, fast and exactly what we needed. People find us easier and we get more visitors who saw the menu online first.'
    },
    rating: 5
  },
  {
    name: 'Sofia',
    business: { sv: 'En Deli Haga', en: 'En Deli Haga' },
    quote: {
      sv: 'Äntligen en hemsida som visar hur mysigt det är hos oss. Beställde på fredag, hade demo på måndag. Otroligt smidigt!',
      en: 'Finally a website that shows how cozy it is here. Ordered on Friday, had demo on Monday. Incredibly smooth!'
    },
    rating: 5
  }
];

export function Testimonials() {
  const { t } = useLanguage();

  return (
    <section className="section-padding py-20 relative overflow-hidden">
      {/* Gradient fade overlay for seamless section blending */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background pointer-events-none" />
      <div className="container-wide relative">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((testimonial, index) => {
            // Sofia (index 2) gets special full-width treatment on mobile
            const isSofia = index === 2;
            return (
              <AnimatedSection 
                key={index} 
                animation="fade-up" 
                delay={index * 100}
                className={isSofia ? 'md:col-span-1' : ''}
              >
                <div className={`bg-background p-4 sm:p-6 rounded-lg border border-border h-full flex flex-col hover:border-accent hover:shadow-lg transition-all duration-300 ${
                  isSofia ? 'border-accent/30 bg-gradient-to-br from-accent/5 to-transparent' : ''
                }`}>
                  <Quote className={`mb-3 sm:mb-4 ${isSofia ? 'w-8 h-8 sm:w-10 sm:h-10 text-accent/50' : 'w-6 h-6 sm:w-8 sm:h-8 text-accent/30'}`} />
                  
                  <p className={`text-muted-foreground flex-grow mb-3 sm:mb-4 italic leading-relaxed ${
                    isSofia ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'
                  }`}>
                    "{t(testimonial.quote.sv, testimonial.quote.en)}"
                  </p>

                  <div className="flex gap-0.5 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className={`fill-accent text-accent ${isSofia ? 'w-5 h-5' : 'w-4 h-4'}`} />
                    ))}
                  </div>

                  <div>
                    <p className={`font-heading font-semibold ${isSofia ? 'text-lg' : ''}`}>{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {t(testimonial.business.sv, testimonial.business.en)}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
