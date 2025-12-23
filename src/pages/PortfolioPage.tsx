import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { AnimatedSection } from '@/components/AnimatedSection';

// Import portfolio images
import gailsHairImg from '@/assets/portfolio-gailshair.png';
import ohMyCoffeeImg from '@/assets/portfolio-ohmycoffee.png';
import bambaImg from '@/assets/portfolio-bamba.png';
import enDeliHagaImg from '@/assets/portfolio-endelihaga.png';

export default function PortfolioPage() {
  const { t } = useLanguage();

  const projects = [
    {
      slug: 'gails-hair',
      name: "Gail's Hair",
      type: t('Frisörsalong', 'Hair Salon'),
      description: t('Premium frisörsalong med online-bokning och Google-recensioner.', 'Premium hair salon with online booking and Google reviews.'),
      tags: [t('Bokning', 'Booking'), t('Responsiv', 'Responsive'), 'SEO'],
      externalUrl: 'https://gailshairgallery.lovable.app/book',
      image: gailsHairImg,
    },
    {
      slug: 'oh-my-coffee',
      name: 'Oh My Coffee',
      type: t('Café & Restaurang', 'Café & Restaurant'),
      description: t('Kafé i Göteborg med meny, beställning och hitta oss.', 'Coffee shop in Gothenburg with menu, ordering, and find us.'),
      tags: [t('Meny', 'Menu'), t('Beställning', 'Order'), t('Karta', 'Map')],
      externalUrl: 'https://ohmycoffee-gbg-web.lovable.app/',
      image: ohMyCoffeeImg,
    },
    {
      slug: 'bamba',
      name: 'Bamba',
      type: t('Restaurang', 'Restaurant'),
      description: t('Klassisk svensk restaurang med bordbokning och meny.', 'Classic Swedish restaurant with table booking and menu.'),
      tags: [t('Bokning', 'Booking'), t('Meny', 'Menu'), t('Atmosfär', 'Atmosphere')],
      externalUrl: 'https://bamba.lovable.app/',
      image: bambaImg,
    },
    {
      slug: 'en-deli-haga',
      name: 'En Deli Haga',
      type: t('Delikatess & Café', 'Deli & Café'),
      description: t('Mobil-först webbplats för café i Haga med meny och adress.', 'Mobile-first website for café in Haga with menu and location.'),
      tags: [t('Mobil-först', 'Mobile-first'), t('Meny', 'Menu'), t('Lokal', 'Local')],
      externalUrl: 'https://en-deli-cozy-vibes.lovable.app/',
      image: enDeliHagaImg,
    },
  ];

  return (
    <div className="section-padding py-20">
      <div className="container-wide">
        {/* Header */}
        <AnimatedSection animation="fade-up" className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Portfolio</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t('Ett urval av webbplatser vi byggt för småföretag.', 'A selection of websites we\'ve built for small businesses.')}
          </p>
        </AnimatedSection>

        {/* Projects Grid - Show 4 items on mobile (2x2) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
          {projects.map((project, index) => (
            <AnimatedSection key={index} animation="fade-up" delay={index * 50}>
              <a
                href={project.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-background border border-border rounded-lg overflow-hidden hover:border-accent transition-all duration-300 block h-full"
              >
                {/* Project Image */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-3 sm:p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-heading font-semibold text-sm sm:text-base">{project.name}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">{project.type}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>

                  <div className="flex flex-wrap gap-1">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-secondary rounded">{tag}</span>
                    ))}
                  </div>
                </div>
              </a>
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