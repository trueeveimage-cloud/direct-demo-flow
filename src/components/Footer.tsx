import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="section-padding py-12">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <Link to="/" className="font-heading font-extrabold text-2xl tracking-tight">
                Nomia<span className="text-accent">.</span>
              </Link>
              <p className="mt-3 text-sm text-muted-foreground max-w-sm">
                {t('Snabba, snygga webbplatser för småföretag.', 'Fast, beautiful websites for small businesses.')}
              </p>
              <div className="mt-6">
                <Button asChild size="sm" className="group">
                  <Link to="/demo">
                    {t('Få ditt koncept', 'Get your concept')}
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-heading font-semibold text-sm mb-3">{t('Sidor', 'Pages')}</h4>
              <nav className="space-y-2">
                <Link to="/demo" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t('Koncept', 'Concept')}</Link>
                <Link to="/priser" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t('Priser', 'Pricing')}</Link>
                <Link to="/portfolio" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Portfolio</Link>
                <Link to="/faq" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
                <Link to="/efter-demo" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t('Fått ditt koncept?', 'Got your concept?')}</Link>
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
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Nomia</p>
            <p className="text-sm text-muted-foreground">Göteborg</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
