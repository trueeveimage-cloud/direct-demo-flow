import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-secondary/30">
      {/* CTA Section */}
      <div className="section-padding py-12 border-b border-border">
        <div className="container-narrow text-center">
          <h3 className="text-xl sm:text-2xl font-bold mb-3">
            {t('Redo att komma igång?', 'Ready to get started?')}
          </h3>
          <p className="text-muted-foreground mb-6">
            {t('Få ditt webb-koncept inom 72 timmar.', 'Get your website concept within 72 hours.')}
          </p>
          <Button asChild className="group">
            <Link to="/demo">
              {t('Få ditt gratis koncept', 'Get your free concept')}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="section-padding py-12">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <Link to="/" className="font-heading font-bold text-xl tracking-tight">
                NordicSite<span className="text-accent">.</span>
              </Link>
              <p className="mt-3 text-sm text-muted-foreground max-w-sm">
                {t('Vi bygger snabba, snygga webbplatser för småföretag. Göteborg, Sverige.', 'We build fast, beautiful websites for small businesses. Gothenburg, Sweden.')}
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-heading font-semibold text-sm mb-3">{t('Sidor', 'Pages')}</h4>
              <nav className="space-y-2">
                <Link to="/demo" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t('Gratis koncept', 'Free Concept')}</Link>
                <Link to="/priser" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t('Priser', 'Pricing')}</Link>
                <Link to="/portfolio" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Portfolio</Link>
                <Link to="/faq" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
                <Link to="/efter-demo" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t('Jag gillar konceptet', 'I like the concept')}</Link>
              </nav>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-heading font-semibold text-sm mb-3">{t('Juridiskt', 'Legal')}</h4>
              <nav className="space-y-2">
                <Link to="/villkor" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t('Villkor', 'Terms')}</Link>
                <Link to="/integritet" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t('Integritetspolicy', 'Privacy Policy')}</Link>
                <Link to="/kontakt" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t('Kontakt', 'Contact')}</Link>
              </nav>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} NordicSite Studio. {t('Alla rättigheter förbehållna.', 'All rights reserved.')}</p>
            <p className="text-sm text-muted-foreground">Göteborg, Sverige</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
