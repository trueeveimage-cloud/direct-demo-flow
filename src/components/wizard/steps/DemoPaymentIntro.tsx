import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RefreshCw, Tag } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DemoPaymentIntroProps {
  onContinue: () => void;
  feeAmount: string;
}

type Slide = 0 | 1 | 2 | 3;

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

const transition = { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] };

export function DemoPaymentIntro({ onContinue, feeAmount }: DemoPaymentIntroProps) {
  const { t } = useLanguage();
  const [slide, setSlide] = useState<Slide>(0);

  const advance = () => {
    if (slide < 3) setSlide((s) => (s + 1) as Slide);
  };

  return (
    <div className="relative min-h-[60vh] flex flex-col items-center justify-center px-4 text-center select-none">
      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.035] mix-blend-overlay rounded-2xl"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <AnimatePresence mode="wait">
        {/* Slide 0 — Promise */}
        {slide === 0 && (
          <motion.div
            key="slide0"
            variants={fadeUp}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
            className="max-w-lg space-y-4"
          >
            <div className="text-5xl mb-6">✦</div>
            <h2 className="text-3xl sm:text-4xl font-light tracking-tight leading-snug">
              {t(
                'Du kommer få ett unikt designkoncept inom 72 timmar.',
                "You'll receive a unique design concept within 72 hours."
              )}
            </h2>
            <p className="text-muted-foreground text-base">
              {t(
                'Baserat på dina preferenser och din bransch.',
                'Tailored to your preferences and industry.'
              )}
            </p>
            <button onClick={advance} className="mt-6 text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors">
              {t('Fortsätt', 'Continue')}
            </button>
          </motion.div>
        )}

        {/* Slide 1 — Effort */}
        {slide === 1 && (
          <motion.div
            key="slide1"
            variants={fadeUp}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
            className="max-w-lg space-y-4"
          >
            <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">
              {t('Varför kostar det något?', 'Why is there a fee?')}
            </p>
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight leading-snug">
              {t(
                'Det tar tid och arbete att skapa varje gratis koncept.',
                'Creating each free concept takes real time and effort.'
              )}
            </h2>
            <button onClick={advance} className="mt-6 text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors">
              {t('Fortsätt', 'Continue')}
            </button>
          </motion.div>
        )}

        {/* Slide 2 — Explanation */}
        {slide === 2 && (
          <motion.div
            key="slide2"
            variants={fadeUp}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
            className="max-w-lg space-y-5"
          >
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight leading-snug">
              {t(
                'Därför ber vi om en liten designinsats för att säkerställa seriöst intresse.',
                'So we ask for a small design deposit to ensure serious interest.'
              )}
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 mt-6 text-left">
              <div className="flex items-start gap-3 flex-1">
                <div className="mt-1 p-2 rounded-full bg-accent/10">
                  <RefreshCw className="w-4 h-4 text-accent" />
                </div>
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
                <div className="mt-1 p-2 rounded-full bg-accent/10">
                  <Tag className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-sm">
                    {t('Gillar du det?', 'Love it?')}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {t('Det dras av från slutpriset.', 'It gets deducted from the final price.')}
                  </p>
                </div>
              </div>
            </div>
            <button onClick={advance} className="mt-4 text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors">
              {t('Fortsätt', 'Continue')}
            </button>
          </motion.div>
        )}

        {/* Slide 3 — CTA */}
        {slide === 3 && (
          <motion.div
            key="slide3"
            variants={fadeUp}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
            className="max-w-md space-y-8 flex flex-col items-center"
          >
            <div className="space-y-3 text-center">
              <p className="text-muted-foreground text-sm uppercase tracking-widest">
                {t('Designinsats', 'Design deposit')}
              </p>
              <p className="text-6xl font-light tracking-tight text-foreground">
                {feeAmount}
              </p>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                {t(
                  'Återbetalningsbart om du inte är nöjd. Avdraget om du beställer.',
                  'Refundable if not satisfied. Deducted if you order.'
                )}
              </p>
            </div>

            <motion.button
              onClick={onContinue}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group flex items-center gap-3 px-8 py-4 bg-accent text-accent-foreground rounded-full font-semibold text-base shadow-lg shadow-accent/25 hover:bg-accent/90 transition-colors"
            >
              {t('Fortsätt till betalning', 'Continue to payment')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <button
              onClick={onContinue}
              className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
            >
              {t('Hoppa över', 'Skip')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dot progress */}
      <div className="absolute bottom-8 flex gap-2">
        {([0, 1, 2, 3] as Slide[]).map((i) => (
          <motion.div
            key={i}
            animate={{ width: slide === i ? 24 : 8, opacity: slide === i ? 1 : 0.3 }}
            transition={{ duration: 0.3 }}
            className="h-1.5 rounded-full bg-accent cursor-pointer"
            onClick={() => setSlide(i)}
          />
        ))}
      </div>
    </div>
  );
}
