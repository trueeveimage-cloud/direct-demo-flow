import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, DollarSign, FolderOpen, Palette, Briefcase, HelpCircle, Phone, ShoppingCart, FileText, Shield, MessageSquare, Sparkles, Home, Info } from 'lucide-react';
import { GrainOverlay } from '@/components/PremiumEffects';
import { SEOHead } from '@/components/SEOHead';

interface PageLink {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
}

export default function ReadMorePage() {
  const { t } = useLanguage();

  const primaryPages: PageLink[] = [
    {
      title: t('Beställ nu', 'Order now'),
      description: t('Kom igång direkt — välj paket och betala.', 'Get started right away — pick a package and pay.'),
      href: '/bestall',
      icon: ShoppingCart,
      highlight: true,
    },
    {
      title: t('Fått ditt koncept?', 'Received your concept?'),
      description: t('Godkänn designen och gå vidare till betalning.', 'Approve the design and proceed to payment.'),
      href: '/efter-demo',
      icon: Sparkles,
      highlight: true,
    },
    {
      title: t('Gratis designförslag', 'Free design proposal'),
      description: t('Se hur din sida kan se ut — utan kostnad.', 'See how your site could look — at no cost.'),
      href: '/demo',
      icon: Palette,
    },
  ];

  const infoPages: PageLink[] = [
    {
      title: t('Priser', 'Pricing'),
      description: t('Paket från 2 900 kr — 25% rabatt just nu.', 'Packages from $290 — 25% off right now.'),
      href: '/priser',
      icon: DollarSign,
    },
    {
      title: t('Hur det fungerar', 'How it works'),
      description: t('Från idé till lansering på 7 dagar.', 'From idea to launch in 7 days.'),
      href: '/hur-det-fungerar',
      icon: Info,
    },
    {
      title: t('Vårt arbete', 'Our work'),
      description: t('Se exempel på sidor vi byggt.', 'See examples of sites we\'ve built.'),
      href: '/portfolio',
      icon: FolderOpen,
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
      description: t('Har du frågor? Vi svarar inom 24h.', 'Have questions? We respond within 24h.'),
      href: '/kontakt',
      icon: Phone,
    },
    {
      title: t('Startsida', 'Homepage'),
      description: t('Tillbaka till hemsidan.', 'Back to the main site.'),
      href: '/',
      icon: Home,
    },
  ];

  const legalPages: PageLink[] = [
    {
      title: t('Villkor', 'Terms'),
      description: t('Allmänna villkor och återbetalningspolicy.', 'General terms and refund policy.'),
      href: '/villkor',
      icon: FileText,
    },
    {
      title: t('Integritetspolicy', 'Privacy policy'),
      description: t('Hur vi hanterar dina uppgifter (GDPR).', 'How we handle your data (GDPR).'),
      href: '/integritet',
      icon: Shield,
    },
    {
      title: t('Kontakta oss', 'Contact us'),
      description: t('Mejl, frågor och support.', 'Email, questions and support.'),
      href: '/kontakt',
      icon: MessageSquare,
    },
  ];

  const renderLinks = (links: PageLink[], delay = 0) =>
    links.map((page, i) => (
      <motion.div
        key={page.href}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: delay + i * 0.04 }}
      >
        <Link
          to={page.href}
          className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-300 ${
            page.highlight
              ? 'bg-accent/10 border border-accent/25 hover:bg-accent/18 hover:border-accent/50'
              : 'hover:bg-accent/5 border border-transparent'
          }`}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
            page.highlight ? 'bg-accent/20 group-hover:bg-accent/35' : 'bg-muted group-hover:bg-accent/20'
          }`}>
            <page.icon className={`w-4 h-4 ${page.highlight ? 'text-accent' : 'text-muted-foreground group-hover:text-accent transition-colors'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`text-sm font-medium transition-colors duration-300 ${page.highlight ? 'text-accent' : 'group-hover:text-accent'}`}>
              {page.title}
            </h3>
            <p className="text-xs text-muted-foreground leading-tight">
              {page.description}
            </p>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-300 flex-shrink-0" />
        </Link>
      </motion.div>
    ));

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <SEOHead 
        title={t('Läs mer | Nomia', 'Read more | Nomia')}
        description={t('Utforska allt vi erbjuder.', 'Explore everything we offer.')}
      />
      <GrainOverlay />

      {/* Gold ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent/8 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-sm mx-auto px-4 py-12">
        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-10"
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
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-extralight tracking-tight mb-1"
        >
          {t('Vad vill du göra?', 'What would you like to do?')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="text-sm text-muted-foreground font-light mb-6"
        >
          {t('Välj ett alternativ nedan.', 'Choose an option below.')}
        </motion.p>

        {/* Primary actions */}
        <div className="space-y-1.5 mb-6">
          {renderLinks(primaryPages, 0.1)}
        </div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3 mb-4"
        >
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">{t('Mer information', 'More info')}</span>
          <div className="h-px flex-1 bg-border" />
        </motion.div>

        {/* Info pages */}
        <div className="space-y-0.5 mb-6">
          {renderLinks(infoPages, 0.25)}
        </div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-3 mb-4"
        >
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">{t('Juridiskt', 'Legal')}</span>
          <div className="h-px flex-1 bg-border" />
        </motion.div>

        {/* Legal pages */}
        <div className="space-y-0.5">
          {renderLinks(legalPages, 0.45)}
        </div>
      </div>
    </div>
  );
}
