import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { AnimatedSection } from '@/components/AnimatedSection';
import { PackageCompareModal } from '@/components/PackageCompareModal';

export default function PricingPage() {
  const { t } = useLanguage();
  const [compareOpen, setCompareOpen] = useState(false);

  const packages = [
    { 
      name: 'Starter', 
      price: '4 900 kr',
      pages: t('Upp till 3 sidor', 'Up to 3 pages'), 
      features: [
        t('Responsiv design', 'Responsive design'), 
        t('Mobil-först', 'Mobile-first'), 
        t('Kontaktformulär', 'Contact form'), 
        t('SEO-grundläggande', 'Basic SEO'), 
        t('1 revision', '1 revision')
      ] 
    },
    { 
      name: 'Standard', 
      price: '7 900 kr',
      pages: t('Upp till 5 sidor', 'Up to 5 pages'), 
      popular: true, 
      features: [
        t('Allt i Starter', 'Everything in Starter'), 
        t('2 revisioner', '2 revisions'), 
        t('Google Maps integration', 'Google Maps integration'), 
        t('Sociala medier-länkar', 'Social media links'), 
        t('Bildgalleri', 'Image gallery')
      ] 
    },
    { 
      name: 'Pro', 
      price: '12 900 kr',
      pages: t('Upp till 8 sidor', 'Up to 8 pages'), 
      features: [
        t('Allt i Standard', 'Everything in Standard'), 
        t('3 revisioner', '3 revisions'), 
        t('Bokningsintegration', 'Booking integration'), 
        t('Nyhetsbrev-setup', 'Newsletter setup'), 
        t('Google Analytics', 'Google Analytics'), 
        t('Prioriterad support', 'Priority support')
      ] 
    },
  ];

  const carePlans = [
    { 
      name: 'Basic',
      price: '249 kr/mån',
      features: [
        t('Hosting', 'Hosting'), 
        t('Uppdateringar', 'Updates'), 
        t('Säkerhetskopiering', 'Backups'), 
        t('Uptime-övervakning', 'Uptime monitoring')
      ] 
    },
    { 
      name: 'Standard', 
      price: '449 kr/mån',
      popular: true, 
      features: [
        t('Allt i Basic', 'Everything in Basic'), 
        t('Domän ingår', 'Domain included'), 
        t('Företagsmail', 'Business email'), 
        t('1 timme ändringar/mån', '1 hour edits/month')
      ] 
    },
    { 
      name: 'Pro',
      price: '749 kr/mån',
      features: [
        t('Allt i Standard', 'Everything in Standard'), 
        t('3 timmar ändringar/mån', '3 hours edits/month'), 
        t('Prioriterad support', 'Priority support'), 
        t('Prestanda-optimering', 'Performance optimization')
      ] 
    },
  ];

  return (
    <div className="section-padding py-20">
      <div className="container-wide">
        <AnimatedSection animation="fade-up" className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">{t('Våra paket', 'Our Packages')}</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">{t('Välj det paket som passar dig bäst.', 'Choose the package that suits you best.')}</p>
        </AnimatedSection>

        {/* Website Packages with prices */}
        <div className="mb-16">
          <AnimatedSection animation="fade-up">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-center">{t('Webbpaket', 'Website Packages')}</h2>
              <Button variant="outline" size="sm" onClick={() => setCompareOpen(true)}>
                {t('Jämför paket', 'Compare packages')}
              </Button>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-3 gap-2 sm:gap-6">
            {packages.map((pkg, index) => (
              <AnimatedSection key={index} animation="fade-up" delay={index * 100}>
                <div className={`relative p-3 sm:p-8 rounded-xl border-2 hover:shadow-xl transition-all duration-300 h-full flex flex-col ${pkg.popular ? 'border-accent bg-accent/5' : 'border-border bg-background hover:border-accent/50'}`}>
                  {pkg.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-[10px] sm:text-xs font-bold px-2 sm:px-4 py-1 rounded-full whitespace-nowrap">
                      {t('Populärast', 'Most Popular')}
                    </span>
                  )}
                  <h3 className="font-heading font-semibold text-base sm:text-2xl mb-1 sm:mb-2">{pkg.name}</h3>
                  <p className="text-lg sm:text-3xl font-bold text-accent mb-1 sm:mb-2">{pkg.price}</p>
                  <p className="text-[10px] sm:text-sm text-muted-foreground mb-3 sm:mb-6">{pkg.pages}</p>
                  <ul className="space-y-1.5 sm:space-y-3 mb-4 sm:mb-8 flex-grow">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-1.5 sm:gap-3 text-[10px] sm:text-sm">
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-accent flex-shrink-0 mt-0.5" />
                        <span className="leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild variant={pkg.popular ? 'default' : 'outline'} className="w-full text-[10px] sm:text-sm h-8 sm:h-10">
                    <Link to="/demo">{t('Få koncept', 'Get concept')}</Link>
                  </Button>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>

        {/* Monthly Care Plans with prices */}
        <div>
          <AnimatedSection animation="fade-up">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">{t('Månatlig webbvård', 'Monthly Care Plans')}</h2>
            <p className="text-center text-muted-foreground mb-2 max-w-xl mx-auto">
              {t('Håll din webbplats snabb, uppdaterad och redigerbar.', 'Keep your site fast, updated, and editable.')}
            </p>
            <p className="text-center text-sm text-muted-foreground mb-10">
              {t('Avsluta när du vill.', 'Cancel anytime.')}
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-3 gap-2 sm:gap-6">
            {carePlans.map((plan, index) => (
              <AnimatedSection key={index} animation="fade-up" delay={index * 100}>
                <div className={`p-3 sm:p-8 rounded-xl border-2 hover:shadow-xl transition-all duration-300 h-full relative flex flex-col ${plan.popular ? 'border-accent bg-accent/5' : 'border-border bg-background hover:border-accent/50'}`}>
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-[10px] sm:text-xs font-bold px-2 sm:px-4 py-1 rounded-full whitespace-nowrap">
                      {t('Rekommenderas', 'Recommended')}
                    </span>
                  )}
                  <h3 className="font-heading font-semibold text-base sm:text-2xl mb-1 sm:mb-2">{plan.name}</h3>
                  <p className="text-lg sm:text-2xl font-bold text-accent mb-3 sm:mb-6">{plan.price}</p>
                  <ul className="space-y-1.5 sm:space-y-3 flex-grow">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-1.5 sm:gap-3 text-[10px] sm:text-sm">
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-accent flex-shrink-0 mt-0.5" />
                        <span className="leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>

        <AnimatedSection animation="scale-in" className="mt-16 text-center">
          <Button asChild size="lg" className="group">
            <Link to="/demo">
              {t('Få ditt koncept (72h)', 'Get your concept (72h)')}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </AnimatedSection>
      </div>

      <PackageCompareModal open={compareOpen} onOpenChange={setCompareOpen} />
    </div>
  );
}
