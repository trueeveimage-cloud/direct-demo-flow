import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { AnimatedSection } from '@/components/AnimatedSection';

export default function PricingPage() {
  const { t } = useLanguage();

  const packages = [
    { name: 'Starter', pages: t('Upp till 3 sidor', 'Up to 3 pages'), features: [t('Responsiv design', 'Responsive design'), t('Mobil-först', 'Mobile-first'), t('Kontaktformulär', 'Contact form'), t('SEO-grundläggande', 'Basic SEO'), t('1 revision', '1 revision')] },
    { name: 'Standard', pages: t('Upp till 5 sidor', 'Up to 5 pages'), popular: true, features: [t('Allt i Starter', 'Everything in Starter'), t('2 revisioner', '2 revisions'), t('Google Maps integration', 'Google Maps integration'), t('Sociala medier-länkar', 'Social media links'), t('Bildgalleri', 'Image gallery')] },
    { name: 'Pro', pages: t('Upp till 8 sidor', 'Up to 8 pages'), features: [t('Allt i Standard', 'Everything in Standard'), t('3 revisioner', '3 revisions'), t('Bokningsintegration', 'Booking integration'), t('Nyhetsbrev-setup', 'Newsletter setup'), t('Google Analytics', 'Google Analytics'), t('Prioriterad support', 'Priority support')] },
  ];

  const carePlans = [
    { name: 'Basic', features: [t('Hosting', 'Hosting'), t('Uppdateringar', 'Updates'), t('Säkerhetskopiering', 'Backups'), t('Uptime-övervakning', 'Uptime monitoring')] },
    { name: 'Standard', popular: true, features: [t('Allt i Basic', 'Everything in Basic'), t('Domän ingår', 'Domain included'), t('Företagsmail', 'Business email'), t('1 timme ändringar/mån', '1 hour edits/month')] },
    { name: 'Pro', features: [t('Allt i Standard', 'Everything in Standard'), t('3 timmar ändringar/mån', '3 hours edits/month'), t('Prioriterad support', 'Priority support'), t('Prestanda-optimering', 'Performance optimization')] },
  ];

  return (
    <div className="section-padding py-20">
      <div className="container-wide">
        <AnimatedSection animation="fade-up" className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t('Våra paket', 'Our Packages')}</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">{t('Välj det paket som passar dig bäst. Se fullständiga priser i villkoren.', 'Choose the package that suits you best. See full pricing in our terms.')}</p>
        </AnimatedSection>

        {/* CTA Banner */}
        <AnimatedSection animation="fade-up" className="mb-12">
          <div className="bg-accent-soft rounded-lg p-6 text-center">
            <h3 className="font-heading font-semibold text-lg mb-2">
              {t('Vill du se hur din sida kan se ut först?', 'Want to see how your site could look first?')}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t('Få ett gratis webb-koncept inom 72 timmar, helt riskfritt.', 'Get a free website concept within 72 hours, completely risk-free.')}
            </p>
            <Button asChild className="group">
              <Link to="/demo">
                {t('Få ditt gratis koncept', 'Get your free concept')}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </AnimatedSection>

        <div className="mb-20">
          <AnimatedSection animation="fade-up"><h2 className="text-2xl font-bold text-center mb-8">{t('Webbpaket', 'Website Packages')}</h2></AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {packages.map((pkg, index) => (
              <AnimatedSection key={index} animation="fade-up" delay={index * 100}>
                <div className={`relative p-6 rounded-lg border hover:shadow-lg transition-all duration-300 h-full ${pkg.popular ? 'border-accent bg-accent-soft' : 'border-border bg-background hover:border-accent'}`}>
                  {pkg.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">{t('Populärast', 'Most Popular')}</span>}
                  <h3 className="font-heading font-semibold text-xl mb-1">{pkg.name}</h3>
                  <p className="text-sm text-muted-foreground mb-6">{pkg.pages}</p>
                  <ul className="space-y-2 mb-6">{pkg.features.map((feature, i) => (<li key={i} className="flex items-start gap-2 text-sm"><Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" /><span>{feature}</span></li>))}</ul>
                  <Button asChild variant={pkg.popular ? 'default' : 'outline'} className="w-full"><Link to="/demo">{t('Få ditt gratis koncept', 'Get your free concept')}</Link></Button>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>

        <div>
          <AnimatedSection animation="fade-up">
            <h2 className="text-2xl font-bold text-center mb-4">{t('Månatlig webbvård', 'Monthly Care Plans')}</h2>
            <p className="text-center text-muted-foreground mb-3 max-w-xl mx-auto">
              {t('De flesta kunder väljer Standard-vårdplanen så att webbplatsen förblir snabb, uppdaterad och redigerbar.', 'Most clients choose the Standard Care Plan so the site stays fast, updated, and editable.')}
            </p>
            <p className="text-center text-sm text-muted-foreground mb-8">
              {t('Avsluta när du vill.', 'Cancel anytime.')}
            </p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {carePlans.map((plan, index) => (
              <AnimatedSection key={index} animation="fade-up" delay={index * 100}>
                <div className={`p-6 rounded-lg border hover:shadow-lg transition-all duration-300 h-full relative ${plan.popular ? 'border-accent bg-accent-soft' : 'border-border bg-background hover:border-accent'}`}>
                  {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">{t('Rekommenderas', 'Recommended')}</span>}
                  <h3 className="font-heading font-semibold text-lg mb-4">{plan.name}</h3>
                  <ul className="space-y-2">{plan.features.map((feature, i) => (<li key={i} className="flex items-start gap-2 text-sm"><Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" /><span>{feature}</span></li>))}</ul>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>

        <AnimatedSection animation="scale-in" className="mt-16 text-center">
          <Button asChild size="lg" className="group"><Link to="/demo">{t('Få ditt gratis webb-koncept (72h)', 'Get your free website concept (72h)')}<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></Link></Button>
        </AnimatedSection>
      </div>
    </div>
  );
}
