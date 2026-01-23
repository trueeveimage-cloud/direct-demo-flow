import { Link } from 'react-router-dom';
import { ArrowRight, Instagram, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ROICalculator } from '@/components/ROICalculator';

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-secondary/30">
      {/* ROI Calculator Banner */}
      <div className="border-b border-border/50 py-8">
        <div className="container-wide section-padding">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-heading font-bold text-lg mb-1">
                {t('Hur mycket pengar förlorar du?', 'How much money are you losing?')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('Räkna ut vad en föråldrad webbplats kostar dig.', 'Calculate what an outdated website costs you.')}
              </p>
            </div>
            <ROICalculator />
          </div>
        </div>
      </div>

      <div className="section-padding py-12">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <Link to="/" className="font-heading font-extrabold text-2xl tracking-tight">
                Nomia<span className="text-accent">.</span>
              </Link>
              <p className="mt-3 text-sm text-muted-foreground max-w-sm">
                {t('Snabba, snygga webbplatser som konverterar. Vi gör det enkelt att växa online.', 'Fast, beautiful websites that convert. We make it easy to grow online.')}
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Göteborg, Sweden</span>
              </div>
              <div className="mt-6 flex gap-3">
                <Button asChild size="sm" className="group">
                  <Link to="/demo">
                    {t('Få ditt gratis koncept', 'Get your free concept')}
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link to="/bestall">
                    {t('Beställ direkt', 'Order directly')}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-heading font-semibold text-sm mb-3">{t('Snabblänkar', 'Quick Links')}</h4>
              <nav className="space-y-2">
                <Link to="/hur-det-fungerar" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t('Hur det fungerar', 'How it works')}</Link>
                <Link to="/priser" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t('Priser', 'Pricing')}</Link>
                <Link to="/portfolio" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Portfolio</Link>
                <Link to="/faq" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
              </nav>
            </div>

            {/* Get Started */}
            <div>
              <h4 className="font-heading font-semibold text-sm mb-3">{t('Kom igång', 'Get Started')}</h4>
              <nav className="space-y-2">
                <Link to="/demo" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t('Gratis koncept', 'Free concept')}</Link>
                <Link to="/bestall" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t('Beställ direkt', 'Order directly')}</Link>
                <Link to="/efter-demo" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t('Fått ditt koncept?', 'Got your concept?')}</Link>
                <Link to="/kontakt" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t('Kontakt', 'Contact')}</Link>
              </nav>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-heading font-semibold text-sm mb-3">{t('Juridiskt', 'Legal')}</h4>
              <nav className="space-y-2">
                <Link to="/villkor" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t('Villkor', 'Terms')}</Link>
                <Link to="/integritet" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t('Integritetspolicy', 'Privacy Policy')}</Link>
              </nav>
            </div>
          </div>

          {/* Klarna banner */}
          <div className="mt-10 p-4 rounded-xl bg-background/50 border border-border/50 flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
            <span className="font-bold text-lg tracking-tight">Klarna</span>
            <span className="text-sm text-muted-foreground">
              {t('Delbetala enkelt – välj att betala senare eller dela upp i 3 delbetalningar.', 'Easily pay in installments – choose to pay later or split into 3 payments.')}
            </span>
          </div>

          <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Nomia. {t('Alla rättigheter förbehållna.', 'All rights reserved.')}</p>
            <div className="flex items-center gap-4">
              <a 
                href="https://www.instagram.com/nomia.se/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://www.tiktok.com/@nomia.se" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="TikTok"
              >
                <TikTokIcon />
              </a>
              <a 
                href="https://mail.google.com/mail/?view=cm&fs=1&to=nordicsite.help@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
              <button 
                onClick={() => (window as any).__nomiaReplayIntro?.()}
                className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
              >
                {t('Spela intro igen', 'Replay intro')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
