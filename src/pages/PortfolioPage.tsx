import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { AnimatedSection } from '@/components/AnimatedSection';
import { motion } from 'framer-motion';

// Import portfolio images
import gailsHairImg from '@/assets/portfolio-gailshair.png';
import ohMyCoffeeImg from '@/assets/portfolio-ohmycoffee.png';
import bambaImg from '@/assets/portfolio-bamba.png';
import enDeliHagaImg from '@/assets/portfolio-endelihaga.png';
import trueEveImg from '@/assets/portfolio-trueeve.png';
import swedenCarImg from '@/assets/after-swedencar.png';

type Category = 'all' | 'food' | 'beauty' | 'automotive' | 'lifestyle';

export default function PortfolioPage() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  const categories: { id: Category; label: string }[] = [
    { id: 'all', label: t('Alla', 'All') },
    { id: 'food', label: t('Mat & Dryck', 'Food & Drink') },
    { id: 'beauty', label: t('Skönhet', 'Beauty') },
    { id: 'automotive', label: t('Fordon', 'Automotive') },
    { id: 'lifestyle', label: t('Livsstil', 'Lifestyle') },
  ];

  const projects = [
    {
      slug: 'gails-hair',
      name: "Gail's Hair",
      category: 'beauty' as Category,
      type: t('Frisörsalong', 'Hair Salon'),
      description: t('Premium frisörsalong med online-bokning och Google-recensioner.', 'Premium hair salon with online booking and Google reviews.'),
      tags: [t('Bokning', 'Booking'), t('Responsiv', 'Responsive'), 'SEO'],
      externalUrl: 'https://gailshairgallery.lovable.app/book',
      image: gailsHairImg,
      resultBadge: t('+89% fler bokningar', '+89% more bookings'),
      accentColor: 'from-pink-500/20 to-purple-500/20',
    },
    {
      slug: 'oh-my-coffee',
      name: 'Oh My Coffee',
      category: 'food' as Category,
      type: t('Café & Restaurang', 'Café & Restaurant'),
      description: t('Kafé i Göteborg med meny, beställning och hitta oss.', 'Coffee shop in Gothenburg with menu, ordering, and find us.'),
      tags: [t('Meny', 'Menu'), t('Beställning', 'Order'), t('Karta', 'Map')],
      externalUrl: 'https://ohmycoffee-gbg-web.lovable.app/',
      image: ohMyCoffeeImg,
      resultBadge: undefined,
      accentColor: 'from-amber-500/20 to-orange-500/20',
    },
    {
      slug: 'bamba',
      name: 'Bamba',
      category: 'food' as Category,
      type: t('Restaurang', 'Restaurant'),
      description: t('Klassisk svensk restaurang med bordbokning och meny.', 'Classic Swedish restaurant with table booking and menu.'),
      tags: [t('Bokning', 'Booking'), t('Meny', 'Menu'), t('Atmosfär', 'Atmosphere')],
      externalUrl: 'https://bamba.lovable.app/',
      image: bambaImg,
      resultBadge: t('+177% bokningar/vecka', '+177% bookings/week'),
      accentColor: 'from-emerald-500/20 to-teal-500/20',
    },
    {
      slug: 'en-deli-haga',
      name: 'En Deli Haga',
      category: 'food' as Category,
      type: t('Delikatess & Café', 'Deli & Café'),
      description: t('Mobil-först webbplats för café i Haga med meny och adress.', 'Mobile-first website for café in Haga with menu and location.'),
      tags: [t('Mobil-först', 'Mobile-first'), t('Meny', 'Menu'), t('Lokal', 'Local')],
      externalUrl: 'https://en-deli-cozy-vibes.lovable.app/',
      image: enDeliHagaImg,
      resultBadge: undefined,
      accentColor: 'from-rose-500/20 to-pink-500/20',
    },
    {
      slug: 'trueeve',
      name: 'TrueEve',
      category: 'lifestyle' as Category,
      type: t('Coaching & Livsstil', 'Coaching & Lifestyle'),
      description: t('Lyxigt landingpage för personlig utveckling och coaching.', 'Luxury landing page for personal development and coaching.'),
      tags: [t('Lyxig', 'Luxury'), t('Landingpage', 'Landing page'), t('Coaching', 'Coaching')],
      externalUrl: 'https://trueeve.se/',
      image: trueEveImg,
      resultBadge: undefined,
      accentColor: 'from-violet-500/20 to-purple-500/20',
    },
    {
      slug: 'sweden-car',
      name: 'Sweden Car AB',
      category: 'automotive' as Category,
      type: t('Bilförsäljning & Service', 'Car Sales & Service'),
      description: t('Premium bilhandlare med försäljning, service och finansiering.', 'Premium car dealer with sales, service and financing.'),
      tags: [t('Bilar', 'Cars'), t('Service', 'Service'), t('Finansiering', 'Financing')],
      externalUrl: 'https://premium-car-boutique.lovable.app/',
      image: swedenCarImg,
      resultBadge: t('+62% fler förfrågningar', '+62% more inquiries'),
      accentColor: 'from-blue-500/20 to-cyan-500/20',
    },
  ];

  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <div className="section-padding py-20">
      <div className="container-wide">
        {/* Header */}
        <AnimatedSection animation="fade-up" className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            {t('Våra arbeten', 'Our Work')}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            {t('Webbplatser som levererar resultat för småföretag.', 'Websites that deliver results for small businesses.')}
          </p>
        </AnimatedSection>

        {/* Category Filter */}
        <AnimatedSection animation="fade-up" delay={100} className="mb-12">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* Projects Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16"
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.slug}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <a
                href={project.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-background border border-border rounded-2xl overflow-hidden hover:border-accent/50 transition-all duration-500 block h-full"
              >
                {/* Gradient overlay based on category */}
                <div className={`absolute inset-0 bg-gradient-to-br ${project.accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                
                {/* Result Sticker */}
                {project.resultBadge && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-accent text-accent-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                      {project.resultBadge}
                    </span>
                  </div>
                )}

                {/* Project Image */}
                <div className="aspect-[16/10] overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Content */}
                <div className="p-6 relative">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-heading font-semibold text-xl mb-1 group-hover:text-accent transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{project.type}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-secondary/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 translate-x-2">
                      <ExternalLink className="w-4 h-4 text-foreground" />
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <span 
                        key={i} 
                        className="text-xs px-2.5 py-1 bg-secondary/80 rounded-full text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <AnimatedSection animation="fade-up" className="text-center">
          <div className="relative p-8 sm:p-12 rounded-2xl overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent/5" />
            <div className="absolute inset-0 border border-accent/20 rounded-2xl" />
            
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                {t('Nästa projekt kan vara ditt', 'Your project could be next')}
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                {t('Få ett gratis koncept och se hur din webbplats kan se ut.', 'Get a free concept and see what your website could look like.')}
              </p>
              <Button asChild size="lg" className="group">
                <Link to="/demo">
                  {t('Starta ditt projekt', 'Start your project')}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
