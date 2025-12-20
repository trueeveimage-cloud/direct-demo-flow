import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { AnimatedSection } from '@/components/AnimatedSection';

export default function PricingPage() {
  const { t } = useLanguage();

  const packages = [
    { name: 'Starter', price: '4 900', pages: t('Upp till 3 sidor', 'Up to 3 pages'), features: [t('Responsiv design', 'Responsive design'), t('Mobil-först', 'Mobile-first'), t('Kontaktformulär', 'Contact form'), t('SEO-grundläggande', 'Basic SEO'), t('1 revision', '1 revision')] },
    { name: 'Standard', price: '7 900', pages: t('Upp till 5 sidor', 'Up to 5 pages'), popular: true, features: [t('Allt i Starter', 'Everything in Starter'), t('2 revisioner', '2 revisions'), t('Google Maps integration', 'Google Maps integration'), t('Sociala medier-länkar', 'Social media links'), t('Bildgalleri', 'Image gallery')] },
    { name: 'Pro', price: '12 900', pages: t('Upp till 8 sidor', 'Up to 8 pages'), features: [t('Allt i Standard', 'Everything in Standard'), t('3 revisioner', '3 revisions'), t('Bokningsintegration', 'Booking integration'), t('Nyhetsbrev-setup', 'Newsletter setup'), t('Google Analytics', 'Google Analytics'), t('Prioriterad support', 'Priority support')] },
  ];

  const carePlans = [
    { name: 'Basic', price: '399', features: [t('Hosting', 'Hosting'), t('Uppdateringar', 'Updates'), t('Säkerhetskopiering', 'Backups'), t('Uptime-övervakning', 'Uptime monitoring')] },
    { name: 'Standard', price: '699', features: [t('Allt i Basic', 'Everything in Basic'), t('Domän ingår', 'Domain included'), t('Företagsmail', 'Business email'), t('1 timme ändringar/mån', '1 hour edits/month')] },
    { name: 'Pro', price: '1 199', features: [t('Allt i Standard', 'Everything in Standard'), t('3 timmar ändringar/mån', '3 hours edits/month'), t('Prioriterad support', 'Priority support'), t('Prestanda-optimering', 'Performance optimization')] },
  ];

  return (
    <div className="section-padding py-20">
      <div className="container-wide">
        <AnimatedSection animation="fade-up" className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t('Enkla, transparenta priser', 'Simple, transparent pricing')}</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">{t('500 kr verifieringsavgift dras av från slutpriset om du går vidare.', '500 kr verification fee is deducted from the final price if you proceed.')}</p>
        </AnimatedSection>

        <div className="mb-20">
          <AnimatedSection animation="fade-up"><h2 className="text-2xl font-bold text-center mb-8">{t('Webbpaket (engångskostnad)', 'Website Packages (one-time)')}</h2></AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {packages.map((pkg, index) => (
              <AnimatedSection key={index} animation="fade-up" delay={index * 100}>
                <div className={`relative p-6 rounded-lg border hover:shadow-lg transition-all duration-300 ${pkg.popular ? 'border-accent bg-accent-soft' : 'border-border bg-background hover:border-accent'}`}>
                  {pkg.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">{t('Populärast', 'Most Popular')}</span>}
                  <h3 className="font-heading font-semibold text-xl mb-1">{pkg.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{pkg.pages}</p>
                  <div className="mb-6"><span className="text-4xl font-bold">{pkg.price}</span><span className="text-muted-foreground ml-1">kr</span></div>
                  <ul className="space-y-2 mb-6">{pkg.features.map((feature, i) => (<li key={i} className="flex items-start gap-2 text-sm"><Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" /><span>{feature}</span></li>))}</ul>
                  <Button asChild variant={pkg.popular ? 'default' : 'outline'} className="w-full"><Link to="/demo">{t('Få en gratis demo', 'Get a free demo')}</Link></Button>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>

        <div>
          <AnimatedSection animation="fade-up"><h2 className="text-2xl font-bold text-center mb-4">{t('Månatlig webbvård', 'Monthly Care Plans')}</h2><p className="text-center text-muted-foreground mb-8 max-w-xl mx-auto">{t('Håll din webbplats snabb, säker och uppdaterad.', 'Keep your website fast, secure, and up-to-date.')}</p></AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {carePlans.map((plan, index) => (
              <AnimatedSection key={index} animation="fade-up" delay={index * 100}>
                <div className="p-6 rounded-lg border border-border bg-background hover:border-accent hover:shadow-lg transition-all duration-300">
                  <h3 className="font-heading font-semibold text-lg mb-4">{plan.name}</h3>
                  <div className="mb-6"><span className="text-3xl font-bold">{plan.price}</span><span className="text-muted-foreground ml-1">kr/mån</span></div>
                  <ul className="space-y-2">{plan.features.map((feature, i) => (<li key={i} className="flex items-start gap-2 text-sm"><Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" /><span>{feature}</span></li>))}</ul>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>

        <AnimatedSection animation="scale-in" className="mt-16 text-center">
          <Button asChild size="lg" className="group"><Link to="/demo">{t('Få en gratis webb-demo', 'Get a free website demo')}<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></Link></Button>
        </AnimatedSection>
      </div>
    </div>
  );
}
