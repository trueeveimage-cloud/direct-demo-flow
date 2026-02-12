import { useEffect, useRef, useState } from 'react';
import { Star, Quote } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, useInView } from 'framer-motion';

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
  },
  {
    name: 'Maria',
    business: { sv: 'Lindberg Salong', en: 'Lindberg Salon' },
    quote: {
      sv: 'Inom några dagar kändes vår hemsida tydligare. Kunder litade på oss direkt.',
      en: 'Within days, our site felt clearer. Customers trusted us immediately.'
    },
    rating: 5
  },
  {
    name: 'Erik',
    business: { sv: 'Sweden Car AB', en: 'Sweden Car AB' },
    quote: {
      sv: 'Förvandlingen var otrolig. Från en föråldrad sida till något vi är stolta över att visa.',
      en: 'The transformation was incredible. From an outdated page to something we are proud to show.'
    },
    rating: 5
  }
];

export function TestimonialsCarousel() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);
  const [isPaused, setIsPaused] = useState(false);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  // Sync ref with state
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const scrollPosRef = useRef(0);

  // Auto-scroll effect
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrame: number;
    const scrollSpeed = 0.5;

    const scroll = () => {
      if (!container) return;
      
      if (!isPausedRef.current) {
        scrollPosRef.current += scrollSpeed;
        
        const halfWidth = container.scrollWidth / 2;
        if (scrollPosRef.current >= halfWidth) {
          scrollPosRef.current = 0;
        }
        
        container.scrollLeft = scrollPosRef.current;
      }
      
      animationFrame = requestAnimationFrame(scroll);
    };

    animationFrame = requestAnimationFrame(scroll);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  // Duplicate testimonials for infinite scroll effect
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Gradient fade overlay for seamless section blending */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background pointer-events-none" />
      
      <div className="container-wide section-padding relative">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight mb-4">
            {t('Vad våra kunder säger', 'What our customers say')}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t(
              'Lyssna på företagare som valt oss för sin webbplats.',
              'Hear from business owners who chose us for their website.'
            )}
          </p>
        </motion.div>

        {/* Carousel container with fade edges */}
        <div className="relative">
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          
        <div 
            ref={containerRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto py-4 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
            onMouseEnter={() => { setIsPaused(true); }}
            onMouseLeave={() => { if (containerRef.current) scrollPosRef.current = containerRef.current.scrollLeft; setIsPaused(false); }}
            onTouchStart={() => { setIsPaused(true); }}
            onTouchEnd={() => { if (containerRef.current) scrollPosRef.current = containerRef.current.scrollLeft; setIsPaused(false); }}
          >
            {duplicatedTestimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: (index % testimonials.length) * 0.1 }}
                className="flex-shrink-0 w-[300px] sm:w-[350px]"
              >
                <div className="h-full p-5 sm:p-6 rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/5 via-background to-background backdrop-blur-sm hover:border-accent/40 transition-all duration-300 group">
                  <Quote className="w-6 h-6 text-accent/40 mb-4 group-hover:text-accent/60 transition-colors" />
                  
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4 italic">
                    "{t(testimonial.quote.sv, testimonial.quote.en)}"
                  </p>

                  <div className="flex gap-0.5 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>

                  <div>
                    <p className="font-medium text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {t(testimonial.business.sv, testimonial.business.en)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
