import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, Palette, DollarSign, Briefcase, HelpCircle, Phone, FolderOpen } from 'lucide-react';
import { GrainOverlay } from '@/components/PremiumEffects';
import { SEOHead } from '@/components/SEOHead';

interface PageLink {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function ReadMorePage() {
  const { t } = useLanguage();

  const pages: PageLink[] = [
    {
      title: t('Priser', 'Pricing'),
      description: t('Se våra paket och vad som ingår.', 'See our packages and what\'s included.'),
      href: '/priser',
      icon: DollarSign,
    },
    {
      title: t('Vårt arbete', 'Our work'),
      description: t('Se tidigare projekt och resultat.', 'See previous projects and results.'),
      href: '/portfolio',
      icon: FolderOpen,
    },
    {
      title: t('Hur det fungerar', 'How it works'),
      description: t('Steg för steg, från idé till lansering.', 'Step by step, from idea to launch.'),
      href: '/hur-det-fungerar',
      icon: Palette,
    },
    {
      title: t('Om oss', 'About us'),
      description: t('Vilka vi är och varför vi gör det här.', 'Who we are and why we do this.'),
      href: '/om-oss',
      icon: Briefcase,
    },
    {
      title: t('Vanliga frågor', 'FAQ'),
      description: t('Svar på de vanligaste frågorna.', 'Answers to the most common questions.'),
      href: '/faq',
      icon: HelpCircle,
    },
    {
      title: t('Kontakt', 'Contact'),
      description: t('Har du frågor? Hör av dig.', 'Have questions? Get in touch.'),
      href: '/kontakt',
      icon: Phone,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <SEOHead 
        title={t('Läs mer | Nomia', 'Read more | Nomia')}
        description={t('Utforska allt vi erbjuder.', 'Explore everything we offer.')}
      />
      <GrainOverlay />

      {/* Gold ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent/8 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-2xl mx-auto px-5 py-16 sm:py-24">
        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-16"
        >
          <Link 
            to="/ad" 
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors duration-300"
          >
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            {t('Tillbaka', 'Back')}
          </Link>
          <Link to="/" className="font-heading font-bold text-lg tracking-tight">
            Nomia<span className="text-accent">.</span>
          </Link>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-5xl font-extralight tracking-tight mb-3"
        >
          {t('Utforska mer', 'Explore more')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-muted-foreground font-light mb-14 text-lg"
        >
          {t('Välj vad du vill veta mer om.', 'Choose what you want to learn more about.')}
        </motion.p>

        <div className="grid gap-2.5">
          {pages.map((page, i) => (
            <motion.div
              key={page.href}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.05 }}
            >
              <Link
                to={page.href}
                className="group flex items-center gap-4 p-4 sm:p-5 rounded-xl bg-secondary/20 border border-border/20 hover:border-accent/40 hover:bg-accent/5 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors duration-300">
                  <page.icon className="w-4.5 h-4.5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium group-hover:text-accent transition-colors duration-300">
                    {page.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {page.description}
                  </p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-accent group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-14 text-center"
        >
          <Link
            to="/bestall"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-3 rounded-full text-sm font-medium shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300"
          >
            {t('Beställ nu', 'Order now')}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
