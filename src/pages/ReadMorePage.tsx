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

      <div className="max-w-3xl mx-auto px-5 py-20 sm:py-28">
        {/* Back to ad */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <Link 
            to="/ad" 
            className="text-sm text-muted-foreground hover:text-accent transition-colors duration-300"
          >
            &larr; {t('Tillbaka', 'Back')}
          </Link>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-extralight tracking-tight mb-4"
        >
          {t('Utforska mer', 'Explore more')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-muted-foreground font-light mb-12"
        >
          {t('Välj vad du vill veta mer om.', 'Choose what you want to learn more about.')}
        </motion.p>

        <div className="grid gap-3">
          {pages.map((page, i) => (
            <motion.div
              key={page.href}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
            >
              <Link
                to={page.href}
                className="group flex items-center gap-5 p-5 sm:p-6 rounded-2xl bg-secondary/30 border border-border/30 hover:border-accent/30 hover:bg-secondary/50 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors duration-300">
                  <page.icon className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium group-hover:text-accent transition-colors duration-300">
                    {page.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {page.description}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
