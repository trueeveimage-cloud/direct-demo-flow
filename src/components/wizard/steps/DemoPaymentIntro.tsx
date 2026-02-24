import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RefreshCw, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DemoPaymentIntroProps {
  onContinue: () => void;
  feeAmount: string;
}

type Slide = 0 | 1 | 2 | 3;

// Direction-aware variants for cinematic transitions
const slideVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? 30 : -30,
    scale: 0.97,
  }),
  center: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  exit: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? -20 : 20,
    scale: 0.98,
  }),
};

const cinematicTransition = {
  duration: 0.5,
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
};

// Stagger children for dramatic reveals
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export function DemoPaymentIntro({ onContinue, feeAmount }: DemoPaymentIntroProps) {
  const { t } = useLanguage();
  const [slide, setSlide] = useState<Slide>(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback((target: Slide) => {
    setDirection(target > slide ? 1 : -1);
    setSlide(target);
  }, [slide]);

  const advance = () => {
    if (slide < 3) goTo((slide + 1) as Slide);
  };

  const goBack = () => {
    if (slide > 0) goTo((slide - 1) as Slide);
  };

  return (
    <div className="relative min-h-[65vh] flex flex-col items-center justify-center px-4 text-center select-none overflow-hidden"
    >
      {/* Cinematic grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Ambient glow that shifts per slide */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        animate={{
          background: slide === 3
            ? 'radial-gradient(ellipse at 50% 40%, hsl(var(--accent) / 0.08) 0%, transparent 70%)'
            : 'radial-gradient(ellipse at 50% 50%, hsl(var(--accent) / 0.04) 0%, transparent 60%)',
        }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      />

      {/* Floating orb */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full bg-accent/[0.06] blur-[100px] pointer-events-none z-0"
        animate={{
          x: slide * 40 - 60,
          y: slide * -20 + 30,
          scale: slide === 3 ? 1.5 : 1,
        }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />

      {/* Subtle navigation arrows */}
      <AnimatePresence>
        {slide > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            whileHover={{ opacity: 0.7 }}
            onClick={goBack}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {slide < 3 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            whileHover={{ opacity: 0.7 }}
            onClick={advance}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait" custom={direction}>
        {/* Slide 0 — Promise */}
        {slide === 0 && (
          <motion.div
            key="slide0"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={cinematicTransition}
            className="max-w-lg z-10"
          >
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
              <motion.div variants={childVariants} className="text-5xl sm:text-6xl mb-6">✦</motion.div>
              <motion.h2 variants={childVariants} className="text-3xl sm:text-4xl font-light tracking-tight leading-snug">
                {t(
                  'Du kommer få ett unikt designkoncept inom 72 timmar.',
                  "You'll receive a unique design concept within 72 hours."
                )}
              </motion.h2>
              <motion.p variants={childVariants} className="text-muted-foreground text-base">
                {t(
                  'Baserat på dina preferenser och din bransch.',
                  'Tailored to your preferences and industry.'
                )}
              </motion.p>
              <motion.button variants={childVariants} onClick={advance} className="mt-6 text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors">
                {t('Fortsätt', 'Continue')}
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* Slide 1 — Handcrafted value */}
        {slide === 1 && (
          <motion.div
            key="slide1"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={cinematicTransition}
            className="max-w-lg z-10"
          >
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
              <motion.p variants={childVariants} className="text-muted-foreground text-sm uppercase tracking-widest font-medium">
                {t('Handgjord design', 'Handcrafted design')}
              </motion.p>
              <motion.h2 variants={childVariants} className="text-2xl sm:text-3xl font-light tracking-tight leading-snug">
                {t(
                  'Varje koncept designas för hand av vårt team — inte genererat av AI.',
                  'Every concept is handcrafted by our design team — not AI-generated.'
                )}
              </motion.h2>
              <motion.p variants={childVariants} className="text-muted-foreground text-sm">
                {t(
                  'En liten designinsats säkerställer att vi lägger vår fulla energi på just ditt projekt.',
                  'A small design deposit ensures we dedicate our full energy to your project.'
                )}
              </motion.p>
              <motion.button variants={childVariants} onClick={advance} className="mt-6 text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors">
                {t('Fortsätt', 'Continue')}
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* Slide 2 — Explanation */}
        {slide === 2 && (
          <motion.div
            key="slide2"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={cinematicTransition}
            className="max-w-lg z-10"
          >
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
              <motion.h2 variants={childVariants} className="text-2xl sm:text-3xl font-light tracking-tight leading-snug">
                {t(
                  'Därför ber vi om en liten designinsats för att säkerställa seriöst intresse.',
                  'So we ask for a small design deposit to ensure serious interest.'
                )}
              </motion.h2>
              <motion.div variants={childVariants} className="flex flex-col sm:flex-row gap-4 mt-6 text-left">
                <div className="flex items-start gap-3 flex-1">
                  <motion.div
                    className="mt-1 p-2 rounded-full bg-accent/10"
                    whileHover={{ scale: 1.15, rotate: 180 }}
                    transition={{ duration: 0.5 }}
                  >
                    <RefreshCw className="w-4 h-4 text-accent" />
                  </motion.div>
                  <div>
                    <p className="font-medium text-sm">
                      {t('Gillar du det inte?', "Don't like it?")}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {t('Vi återbetalar hela beloppet.', 'We refund the full amount.')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 flex-1">
                  <motion.div
                    className="mt-1 p-2 rounded-full bg-accent/10"
                    whileHover={{ scale: 1.15, rotate: -15 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Tag className="w-4 h-4 text-accent" />
                  </motion.div>
                  <div>
                    <p className="font-medium text-sm">
                      {t('Gillar du det?', 'Love it?')}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {t('Det dras av från slutpriset.', 'It gets deducted from the final price.')}
                    </p>
                  </div>
                </div>
              </motion.div>
              <motion.button variants={childVariants} onClick={advance} className="mt-4 text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors">
                {t('Fortsätt', 'Continue')}
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* Slide 3 — CTA */}
        {slide === 3 && (
          <motion.div
            key="slide3"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={cinematicTransition}
            className="max-w-md z-10 flex flex-col items-center"
          >
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8 flex flex-col items-center">
              <motion.div variants={childVariants} className="space-y-3 text-center">
                <p className="text-muted-foreground text-sm uppercase tracking-widest">
                  {t('Designinsats', 'Design deposit')}
                </p>
                <motion.p
                  className="text-6xl sm:text-7xl font-light tracking-tight text-foreground"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  {feeAmount}
                </motion.p>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                  {t(
                    'Återbetalningsbart om du inte är nöjd. Avdraget om du beställer.',
                    'Refundable if not satisfied. Deducted if you order.'
                  )}
                </p>
              </motion.div>

              <motion.div variants={childVariants}>
                <motion.button
                  onClick={onContinue}
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px -10px hsl(var(--accent) / 0.4)' }}
                  whileTap={{ scale: 0.96 }}
                  className="group flex items-center gap-3 px-8 py-4 bg-accent text-accent-foreground rounded-full font-semibold text-base shadow-lg shadow-accent/25 hover:bg-accent/90 transition-colors"
                >
                  {t('Fortsätt till betalning', 'Continue to payment')}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>

              <motion.button
                variants={childVariants}
                onClick={onContinue}
                className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
              >
                {t('Hoppa över', 'Skip')}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic dot progress */}
      <div className="absolute bottom-8 flex gap-2.5 z-20">
        {([0, 1, 2, 3] as Slide[]).map((i) => (
          <motion.div
            key={i}
            animate={{
              width: slide === i ? 28 : 8,
              opacity: slide === i ? 1 : 0.25,
              backgroundColor: slide === i ? 'hsl(var(--accent))' : 'hsl(var(--muted-foreground))',
            }}
            whileHover={{ opacity: 0.7, scale: 1.2 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="h-1.5 rounded-full cursor-pointer"
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
