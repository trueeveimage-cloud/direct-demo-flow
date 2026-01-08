import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Star, Users, TrendingUp, Calendar, Utensils, Sparkles, Car, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { AnimatedSection } from '@/components/AnimatedSection';
import { motion, AnimatePresence } from 'framer-motion';

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

  const categories: { id: Category; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: t('Alla', 'All'), icon: null },
    { id: 'food', label: t('Mat & Dryck', 'Food & Drink'), icon: <Utensils className="w-4 h-4" /> },
    { id: 'beauty', label: t('Skönhet', 'Beauty'), icon: <Sparkles className="w-4 h-4" /> },
    { id: 'automotive', label: t('Fordon', 'Automotive'), icon: <Car className="w-4 h-4" /> },
    { id: 'lifestyle', label: t('Livsstil', 'Lifestyle'), icon: <Heart className="w-4 h-4" /> },
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
      stats: { clients: '100+', rating: '5.0', bookings: '+89%' },
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
      stats: { visitors: '2.5k/mo', orders: '+45%' },
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
      stats: { bookings: '+177%', tables: '50+', rating: '4.8' },
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
      stats: { mobile: '85%', engagement: '+62%' },
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
      stats: { conversions: '+34%', sessions: '1.2k/mo' },
      featured: true,
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
      stats: { inquiries: '+62%', inventory: '150+', leads: '+48%' },
    },
  ];

  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  // Render different layouts based on category
  const renderCategoryContent = () => {
    switch (activeCategory) {
      case 'food':
        return renderFoodLayout();
      case 'beauty':
        return renderBeautyLayout();
      case 'automotive':
        return renderAutomotiveLayout();
      case 'lifestyle':
        return renderLifestyleLayout();
      default:
        return renderAllLayout();
    }
  };

  // ALL - Standard grid
  const renderAllLayout = () => (
    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
      {filteredProjects.map((project, index) => (
        <motion.div
          key={project.slug}
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
        >
          <a
            href={project.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative bg-background border border-border rounded-2xl overflow-hidden hover:border-accent/50 transition-all duration-500 block h-full"
          >
            {project.resultBadge && (
              <div className="absolute top-4 right-4 z-10">
                <span className="bg-accent text-accent-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  {project.resultBadge}
                </span>
              </div>
            )}
            <div className="aspect-[16/10] overflow-hidden">
              <img src={project.image} alt={project.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="p-6">
              <h3 className="font-heading font-semibold text-xl mb-1 group-hover:text-accent transition-colors">{project.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{project.type}</p>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 bg-secondary/80 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          </a>
        </motion.div>
      ))}
    </motion.div>
  );

  // FOOD & DRINK - Magazine style with featured hero
  const renderFoodLayout = () => {
    const foodProjects = projects.filter(p => p.category === 'food');
    const [hero, ...rest] = foodProjects;
    
    return (
      <div className="space-y-8">
        {/* Category intro */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-full text-amber-500 mb-4">
            <Utensils className="w-4 h-4" />
            <span className="text-sm font-medium">{t('Mat & Dryck', 'Food & Drink')}</span>
          </div>
          <p className="text-muted-foreground max-w-lg mx-auto">
            {t('Webbplatser som lockar gäster och ökar bokningar för restauranger och caféer.', 'Websites that attract guests and increase bookings for restaurants and cafés.')}
          </p>
        </motion.div>

        {/* Hero project - Full width */}
        {hero && (
          <motion.a
            href={hero.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group block relative rounded-3xl overflow-hidden border border-border hover:border-accent/50 transition-all"
          >
            <div className="aspect-[21/9] overflow-hidden">
              <img src={hero.image} alt={hero.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-end justify-between">
                <div>
                  {hero.resultBadge && (
                    <span className="inline-block bg-accent text-accent-foreground text-sm font-bold px-4 py-1.5 rounded-full mb-3">
                      {hero.resultBadge}
                    </span>
                  )}
                  <h3 className="text-3xl font-bold text-white mb-2">{hero.name}</h3>
                  <p className="text-white/70">{hero.description}</p>
                </div>
                <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                  {t('Besök', 'Visit')} <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </motion.a>
        )}

        {/* Rest in cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rest.map((project, index) => (
            <motion.a
              key={project.slug}
              href={project.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group block bg-background border border-border rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img src={project.image} alt={project.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg group-hover:text-amber-500 transition-colors">{project.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{project.type}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    );
  };

  // BEAUTY - Elegant masonry-like with stats
  const renderBeautyLayout = () => {
    const beautyProjects = projects.filter(p => p.category === 'beauty');
    
    return (
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 rounded-full text-pink-500 mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">{t('Skönhet', 'Beauty')}</span>
          </div>
          <p className="text-muted-foreground max-w-lg mx-auto">
            {t('Eleganta webbplatser för salonger som vill sticka ut och öka sina bokningar.', 'Elegant websites for salons that want to stand out and increase bookings.')}
          </p>
        </motion.div>

        {beautyProjects.map((project, index) => (
          <motion.a
            key={project.slug}
            href={project.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group block"
          >
            <div className="relative rounded-3xl overflow-hidden border border-border hover:border-pink-500/50 transition-all bg-gradient-to-br from-pink-500/5 to-purple-500/5">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="aspect-[4/3] md:aspect-auto overflow-hidden">
                  <img src={project.image} alt={project.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  {project.resultBadge && (
                    <span className="inline-block w-fit bg-pink-500 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-4">
                      {project.resultBadge}
                    </span>
                  )}
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-pink-500 transition-colors">{project.name}</h3>
                  <p className="text-muted-foreground mb-6">{project.description}</p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {project.stats && Object.entries(project.stats).slice(0, 3).map(([key, value]) => (
                      <div key={key} className="text-center p-3 rounded-xl bg-background/50">
                        <p className="text-lg font-bold text-pink-500">{value}</p>
                        <p className="text-xs text-muted-foreground capitalize">{key}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-pink-500 transition-colors">
                    <span>{t('Se projektet', 'View project')}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    );
  };

  // AUTOMOTIVE - Bold industrial look
  const renderAutomotiveLayout = () => {
    const autoProjects = projects.filter(p => p.category === 'automotive');
    
    return (
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full text-blue-500 mb-4">
            <Car className="w-4 h-4" />
            <span className="text-sm font-medium">{t('Fordon', 'Automotive')}</span>
          </div>
          <p className="text-muted-foreground max-w-lg mx-auto">
            {t('Kraftfulla webbplatser för bilbranschen som driver leads och försäljning.', 'Powerful websites for the automotive industry that drive leads and sales.')}
          </p>
        </motion.div>

        {autoProjects.map((project, index) => (
          <motion.a
            key={project.slug}
            href={project.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group block"
          >
            <div className="relative rounded-2xl overflow-hidden border-2 border-border hover:border-blue-500/50 transition-all bg-gradient-to-r from-blue-500/5 to-cyan-500/5">
              {/* Full width image with overlay */}
              <div className="aspect-[21/9] relative overflow-hidden">
                <img src={project.image} alt={project.name} className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
                
                {/* Content overlay */}
                <div className="absolute inset-0 p-8 flex items-center">
                  <div className="max-w-xl">
                    {project.resultBadge && (
                      <span className="inline-block bg-blue-500 text-white text-sm font-bold px-4 py-1.5 rounded mb-4">
                        {project.resultBadge}
                      </span>
                    )}
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">{project.name}</h3>
                    <p className="text-white/80 text-lg mb-6">{project.description}</p>
                    
                    {/* Stats row */}
                    <div className="flex gap-6 mb-6">
                      {project.stats && Object.entries(project.stats).slice(0, 3).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-2xl font-bold text-blue-400">{value}</p>
                          <p className="text-xs text-white/60 uppercase tracking-wider">{key}</p>
                        </div>
                      ))}
                    </div>
                    
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-none px-8">
                      {t('Utforska', 'Explore')} <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    );
  };

  // LIFESTYLE - Premium editorial style
  const renderLifestyleLayout = () => {
    const lifestyleProjects = projects.filter(p => p.category === 'lifestyle');
    
    return (
      <div className="space-y-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 rounded-full text-violet-500 mb-4">
            <Heart className="w-4 h-4" />
            <span className="text-sm font-medium">{t('Livsstil', 'Lifestyle')}</span>
          </div>
          <p className="text-muted-foreground max-w-lg mx-auto">
            {t('Inspirerande webbplatser för varumärken som vill göra skillnad.', 'Inspiring websites for brands that want to make a difference.')}
          </p>
        </motion.div>

        {lifestyleProjects.map((project, index) => (
          <motion.div
            key={project.slug}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            className="relative"
          >
            {/* Large featured card */}
            <a
              href={project.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="relative rounded-[2rem] overflow-hidden border border-violet-500/20 hover:border-violet-500/50 transition-all bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-pink-500/10">
                {/* Decorative elements */}
                <div className="absolute top-8 right-8 w-32 h-32 bg-violet-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-8 left-8 w-24 h-24 bg-pink-500/20 rounded-full blur-2xl" />
                
                <div className="relative p-8 md:p-12">
                  <div className="grid md:grid-cols-5 gap-8 items-center">
                    {/* Image - larger */}
                    <div className="md:col-span-3 aspect-[16/10] rounded-2xl overflow-hidden">
                      <img 
                        src={project.image} 
                        alt={project.name} 
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" 
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="md:col-span-2 space-y-6">
                      <div>
                        <p className="text-violet-400 text-sm font-medium mb-2">{project.type}</p>
                        <h3 className="text-3xl md:text-4xl font-bold mb-4 group-hover:text-violet-400 transition-colors">
                          {project.name}
                        </h3>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                          {project.description}
                        </p>
                      </div>
                      
                      {/* Stats */}
                      {project.stats && (
                        <div className="flex gap-6 pt-4 border-t border-border/50">
                          {Object.entries(project.stats).map(([key, value]) => (
                            <div key={key}>
                              <p className="text-xl font-bold text-violet-400">{value}</p>
                              <p className="text-xs text-muted-foreground capitalize">{key}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, i) => (
                          <span key={i} className="text-xs px-3 py-1.5 bg-violet-500/10 text-violet-400 rounded-full border border-violet-500/20">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-3 text-violet-400 font-medium group-hover:gap-4 transition-all">
                        <span>{t('Upplev webbplatsen', 'Experience the website')}</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="section-padding py-20">
      <div className="container-wide">
        {/* Header */}
        <AnimatedSection animation="fade-up" className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            {t('Våra arbeten', 'Our Work')}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            {t('Webbplatser som levererar mätbara resultat.', 'Websites that deliver measurable results.')}
          </p>
        </AnimatedSection>

        {/* Category Filter */}
        <AnimatedSection animation="fade-up" delay={100} className="mb-12">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* Dynamic Content Based on Category */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-16"
          >
            {renderCategoryContent()}
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <AnimatedSection animation="fade-up" className="text-center">
          <div className="relative p-8 sm:p-12 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent/5" />
            <div className="absolute inset-0 border border-accent/20 rounded-2xl" />
            
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                {t('Nästa projekt kan vara ditt', 'Your project could be next')}
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                {t('Få ett gratis koncept och se hur din webbplats kan se ut.', 'Get a free concept and see what your website could look like.')}
              </p>
              <Button asChild variant="outline" size="lg" className="group">
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
