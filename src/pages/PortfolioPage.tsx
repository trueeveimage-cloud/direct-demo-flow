import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { AnimatedSection } from '@/components/AnimatedSection';

export default function PortfolioPage() {
  const { t } = useLanguage();

  const projects = [
    {
      slug: 'salong-nova',
      name: t('Salong Nova', 'Salon Nova'),
      type: t('Frisörsalong', 'Hair Salon'),
      description: t('Modern webbplats med online-bokning och prislista.', 'Modern website with online booking and price list.'),
      tags: [t('Responsiv', 'Responsive'), t('Bokning', 'Booking'), 'SEO'],
    },
    {
      slug: 'cafe-luna',
      name: 'Café Luna',
      type: t('Café & Bageri', 'Café & Bakery'),
      description: t('Stilren design med meny och öppettider.', 'Clean design with menu and opening hours.'),
      tags: [t('Meny', 'Menu'), 'Instagram', t('Karta', 'Map')],
    },
    {
      slug: 'rormokare-svensson',
      name: t('Rörmokare Svensson', 'Svensson Plumbing'),
      type: t('Rörmokare', 'Plumber'),
      description: t('Snabb laddning, tydliga tjänster och kontaktformulär.', 'Fast loading, clear services, and contact form.'),
      tags: [t('Snabb', 'Fast'), t('Tjänster', 'Services'), t('Kontakt', 'Contact')],
    },
    {
      slug: 'iron-fitness',
      name: 'Iron Fitness',
      type: t('Gym', 'Gym'),
      description: t('Energisk design med schema och medlemskap-info.', 'Energetic design with schedule and membership info.'),
      tags: [t('Schema', 'Schedule'), t('Medlemskap', 'Membership'), t('Priser', 'Prices')],
    },
    {
      slug: 'vardcentralen-plus',
      name: t('Vårdcentralen Plus', 'HealthCare Plus'),
      type: t('Klinik', 'Clinic'),
      description: t('Professionell design med tjänster och tidsbokning.', 'Professional design with services and appointment booking.'),
      tags: [t('Professionell', 'Professional'), t('Bokning', 'Booking'), t('Tillgänglig', 'Accessible')],
    },
    {
      slug: 'hem-tradgard',
      name: t('Butiken Hem & Trädgård', 'Home & Garden Store'),
      type: t('Butik', 'Retail'),
      description: t('Produktvisning med öppettider och hitta oss-karta.', 'Product showcase with opening hours and find us map.'),
      tags: [t('Produkter', 'Products'), t('Butik', 'Store'), t('Karta', 'Map')],
    },
  ];

  return (
    <div className="section-padding py-20">
      <div className="container-wide">
        {/* Header */}
        <AnimatedSection animation="fade-up" className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Portfolio</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t('Ett urval av webbplatser vi byggt för småföretag. Klicka för att läsa mer.', 'A selection of websites we\'ve built for small businesses. Click to read more.')}
          </p>
        </AnimatedSection>

        {/* Projects Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {projects.map((project, index) => (
            <AnimatedSection key={index} animation="fade-up" delay={index * 75}>
              <Link
                to={`/portfolio/${project.slug}`}
                className="group relative bg-background border border-border rounded-lg overflow-hidden hover:border-accent transition-colors block"
              >
                {/* Placeholder Image */}
                <div className="aspect-[4/3] bg-secondary flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">{t('Förhandsvisning', 'Preview')}</span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-heading font-semibold">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">{project.type}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">{project.description}</p>

                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 bg-secondary rounded">{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        {/* CTA */}
        <AnimatedSection animation="fade-up" className="text-center bg-secondary/50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">{t('Vill du se din webbplats här?', 'Want to see your website here?')}</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {t('Få en gratis demo och se hur din webbplats kan se ut.', 'Get a free demo and see what your website could look like.')}
          </p>
          <Button asChild size="lg">
            <Link to="/demo">
              {t('Få en gratis webb-demo', 'Get a free website demo')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </AnimatedSection>
      </div>
    </div>
  );
}
