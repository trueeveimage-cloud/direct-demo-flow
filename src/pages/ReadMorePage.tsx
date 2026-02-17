import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, DollarSign, FolderOpen, Palette, Briefcase, HelpCircle, Phone, ShoppingCart, FileText, Shield, Utensils, Scissors, Store, BookOpen, Sparkles } from 'lucide-react';
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
      title: t('Gratis koncept', 'Free concept'),
      description: t('Få ett designförslag utan kostnad.', 'Get a design proposal at no cost.'),
      href: '/demo',
      icon: Sparkles,
    },
    {
      title: t('Vårt arbete', 'Our work'),
      description: t('Se tidigare projekt och resultat.', 'See previous projects and results.'),
      href: '/portfolio',
      icon: FolderOpen,
    },
    {
      title: t('Kundcase', 'Case studies'),
      description: t('Läs om hur vi hjälpt andra.', 'Read how we\'ve helped others.'),
      href: '/kundcase',
      icon: BookOpen,
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
      title: t('Restauranger', 'Restaurants'),
      description: t('Webbsidor för restauranger och caféer.', 'Websites for restaurants and cafés.'),
      href: '/tjanster/restauranger',
      icon: Utensils,
    },
    {
      title: t('Salonger', 'Salons'),
      description: t('Webbsidor för skönhet och frisörer.', 'Websites for beauty and hair salons.'),
      href: '/tjanster/salonger',
      icon: Scissors,
    },
    {
      title: t('E-handel', 'E-commerce'),
      description: t('Webbsidor för onlinebutiker.', 'Websites for online stores.'),
      href: '/tjanster/e-handel',
      icon: Store,
    },
    {
      title: t('Beställ', 'Order'),
      description: t('Beställ din hemsida direkt.', 'Order your website directly.'),
      href: '/bestall',
      icon: ShoppingCart,
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
    {
      title: t('Villkor', 'Terms'),
      description: t('Läs våra allmänna villkor.', 'Read our terms and conditions.'),
      href: '/villkor',
      icon: FileText,
    },
    {
      title: t('Integritetspolicy', 'Privacy policy'),
      description: t('Hur vi hanterar dina uppgifter.', 'How we handle your data.'),
      href: '/integritet',
      icon: Shield,
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
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent/8 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-2xl mx-auto px-5 py-14 sm:py-20">
        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-12"
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
          className="text-3xl sm:text-4xl font-extralight tracking-tight mb-2"
        >
          {t('Utforska mer', 'Explore more')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-muted-foreground font-light mb-10"
        >
          {t('Välj vad du vill veta mer om.', 'Choose what you want to learn more about.')}
        </motion.p>

        <div className="grid gap-1.5">
          {pages.map((page, i) => (
            <motion.div
              key={page.href}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.12 + i * 0.03 }}
            >
              <Link
                to={page.href}
                className="group flex items-center gap-3.5 px-4 py-3 rounded-lg hover:bg-accent/5 transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-md bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors duration-300">
                  <page.icon className="w-4 h-4 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium group-hover:text-accent transition-colors duration-300">
                    {page.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {page.description}
                  </p>
                </div>
                <ArrowRight className="w-3 h-3 text-muted-foreground/40 group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-300 flex-shrink-0" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
