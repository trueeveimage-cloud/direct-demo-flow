import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, Zap, CheckCircle2, Clock, Shield, Info, Sparkles, TrendingDown, Eye } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Testimonials } from '@/components/Testimonials';
import { TrustBadges } from '@/components/TrustBadges';
import { ROICalculator } from '@/components/ROICalculator';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRemainingSpots } from '@/hooks/useRemainingSpots';
import { useRef } from 'react';

// Import portfolio images
import gailsHairImg from '@/assets/portfolio-gailshair.png';
import ohMyCoffeeImg from '@/assets/portfolio-ohmycoffee.png';
import bambaImg from '@/assets/portfolio-bamba.png';
import enDeliHagaImg from '@/assets/portfolio-endelihaga.png';

// Before/After images
import beforeSwedenCarImg from '@/assets/before-swedencar.png';
import afterSwedenCarImg from '@/assets/after-swedencar.png';

// Before/After Section with Parallax Effect
function BeforeAfterSection({ t, beforeImg, afterImg }: { t: (sv: string, en: string) => string; beforeImg: string; afterImg: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  // Parallax transforms - before moves slower, after moves faster
  const beforeY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const afterY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  
  return (
    <section ref={sectionRef} className="py-32 relative overflow-hidden">
      {/* Asymmetric background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent/5 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
      
      <div className="container-wide section-padding relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              <Eye className="w-4 h-4" />
              {t('Transformation', 'Transformation')}
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {t('Från föråldrad till professionell', 'From outdated to professional')}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t('Vi förvandlar webbplatser som skrämmer bort kunder till webbplatser som konverterar besökare till bokningar.', 'We transform websites that scare away customers into websites that convert visitors into bookings.')}
            </p>
            
            <div className="mb-8">
              <p className="text-muted-foreground mb-2">
                <span className="font-semibold text-foreground">Sweden Car AB</span>
              </p>
              <p className="text-sm text-muted-foreground">
                {t('Från gammaldags design till modernt och professionellt intryck.', 'From outdated design to a modern, professional impression.')}
              </p>
            </div>
            
            <Button asChild variant="outline" className="group">
              <Link to="/portfolio">
                {t('Se fler transformationer', 'See more transformations')}
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
          
          {/* Right: Before/After Images with Parallax */}
          <div className="relative">
            {/* Before - positioned back and left, slower parallax */}
            <motion.div 
              style={{ y: beforeY }} 
              className="relative z-10 hidden md:block"
            >
              <div className="absolute -top-3 left-4 z-20">
                <span className="bg-muted-foreground/80 text-background px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                  {t('Före', 'Before')}
                </span>
              </div>
              <div className="aspect-[4/3] rounded-xl overflow-hidden border-2 border-border/50 shadow-xl">
                <img src={beforeImg} alt={t('Före transformation', 'Before transformation')} className="w-full h-full object-cover object-top" />
              </div>
            </motion.div>
            
            {/* Mobile: Static before image */}
            <div className="relative z-10 md:hidden">
              <div className="absolute -top-3 left-4 z-20">
                <span className="bg-muted-foreground/80 text-background px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                  {t('Före', 'Before')}
                </span>
              </div>
              <div className="aspect-[4/3] rounded-xl overflow-hidden border-2 border-border/50 shadow-xl">
                <img src={beforeImg} alt={t('Före transformation', 'Before transformation')} className="w-full h-full object-cover object-top" />
              </div>
            </div>
            
            {/* After - overlapping, faster parallax */}
            <motion.div 
              style={{ y: afterY }} 
              className="relative z-20 -mt-24 ml-12 lg:ml-20 hidden md:block"
            >
              <div className="absolute -top-3 left-4 z-20">
                <span className="bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                  {t('Efter', 'After')}
                </span>
              </div>
              <div className="aspect-[4/3] rounded-xl overflow-hidden border-2 border-accent/50 shadow-2xl shadow-accent/20">
                <img src={afterImg} alt={t('Efter transformation', 'After transformation')} className="w-full h-full object-cover object-top" />
              </div>
            </motion.div>
            
            {/* Mobile: Static after image */}
            <div className="relative z-20 -mt-16 ml-8 md:hidden">
              <div className="absolute -top-3 left-4 z-20">
                <span className="bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                  {t('Efter', 'After')}
                </span>
              </div>
              <div className="aspect-[4/3] rounded-xl overflow-hidden border-2 border-accent/50 shadow-2xl shadow-accent/20">
                <img src={afterImg} alt={t('Efter transformation', 'After transformation')} className="w-full h-full object-cover object-top" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Index() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { remainingSpots, isLoading: spotsLoading } = useRemainingSpots();

  return (
    <div className="overflow-hidden">
      {/* ═══════════════════════════════════════════════════════════════════
          1. HERO - Hook + Promise
      ═══════════════════════════════════════════════════════════════════ */}
      
      {/* Gold Blur Background - Static on mobile, animated on desktop */}
      <div className="fixed top-0 left-0 right-0 h-[600px] pointer-events-none z-0 overflow-hidden">
        <div className="hidden md:block">
          <motion.div 
            className="absolute top-[-100px] left-[10%] w-[400px] h-[400px] bg-accent/20 rounded-full blur-[120px] will-change-transform" 
            animate={{ x: [0, 100, -50, 0], y: [0, 50, -30, 0] }} 
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }} 
          />
          <motion.div 
            className="absolute top-[-50px] right-[15%] w-[300px] h-[300px] bg-accent/15 rounded-full blur-[100px] will-change-transform" 
            animate={{ x: [0, -80, 60, 0], y: [0, 80, -40, 0] }} 
            transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 2 }} 
          />
        </div>
        <div className="md:hidden">
          <div className="absolute top-[-100px] left-[10%] w-[300px] h-[300px] bg-accent/15 rounded-full blur-[80px]" />
          <div className="absolute top-[-50px] right-[10%] w-[200px] h-[200px] bg-accent/10 rounded-full blur-[60px]" />
        </div>
      </div>

      {/* Hero Logo */}
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="pt-12 pb-6 text-center relative z-10"
      >
        <span className="font-heading font-extrabold text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter">
          Nomia<span className="text-accent">.</span>
        </span>
      </motion.div>

      {/* Hero Content */}
      <section className="min-h-[50vh] flex items-center relative overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-background" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)' }} />
        <div className="container-narrow text-center relative z-10 section-padding py-12">
          {/* Urgency Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-8 backdrop-blur-sm border border-accent/20"
          >
            <Clock className="w-4 h-4" />
            {spotsLoading ? (
              <span className="animate-pulse">{t('Laddar...', 'Loading...')}</span>
            ) : remainingSpots > 0 ? (
              <span>{t(`Endast ${remainingSpots} platser kvar`, `Only ${remainingSpots} spots left`)}</span>
            ) : (
              <span className="text-orange-400">{t('Fullbokat denna vecka', 'Fully booked this week')}</span>
            )}
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight max-w-3xl mx-auto mb-4"
          >
            {t('Webbdesign, gjord på rätt sätt.', 'Web design, done properly.')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl sm:text-2xl text-muted-foreground max-w-xl mx-auto"
          >
            {t('Få ett gratis webbkoncept inom 72h.', 'Get a free website concept in 72h.')}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <Button asChild variant="outline" size="lg" className="group h-14 px-10 text-base font-medium border-border/50 hover:border-accent/50 hover:bg-accent/5">
              <Link to="/demo">
                {t('Få ditt gratis koncept', 'Get your free concept')}
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="group h-14 px-10 text-base font-medium border-border/50 hover:border-accent/50 hover:bg-accent/5">
              <Link to="/bestall">
                {t('Beställ direkt', 'Order directly')}
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.6, delay: 0.5 }} 
            className="mt-6"
          >
            <Link to="/efter-demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t('Har du fått ditt koncept?', 'Have you received your concept?')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges - Quick credibility */}
      <TrustBadges />


      {/* ═══════════════════════════════════════════════════════════════════
          2. THE PROBLEM - ROI Calculator (Show the pain)
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-32 relative">
        {/* Full-width layered background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-destructive/5 to-background pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        
        <div className="container-narrow section-padding relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive text-sm font-medium mb-6">
              <TrendingDown className="w-4 h-4" />
              {t('Varje dag utan hemsida kostar dig', 'Every day without a website costs you')}
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              {t('Hur mycket intäkter förlorar du?', 'How much revenue are you losing?')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
              {t('En föråldrad eller saknad webbplats kostar mer än du tror.', 'An outdated or missing website costs more than you think.')}
            </p>
            
            <ROICalculator />
          </motion.div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════════
          3. THE SOLUTION - Before/After Transformation with Parallax
      ═══════════════════════════════════════════════════════════════════ */}
      <BeforeAfterSection t={t} beforeImg={beforeSwedenCarImg} afterImg={afterSwedenCarImg} />


      {/* ═══════════════════════════════════════════════════════════════════
          4. PROOF - Portfolio Showcase
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-32 bg-secondary/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        
        <div className="container-wide section-padding">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-16 gap-4"
          >
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">{t('Våra projekt', 'Our Work')}</h2>
              <p className="text-muted-foreground mt-3 text-lg">{t('Riktiga resultat för riktiga företag', 'Real results for real businesses')}</p>
            </div>
            <Button asChild variant="outline" className="group hidden sm:flex">
              <Link to="/portfolio">
                {t('Se alla projekt', 'View all projects')}
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { name: "Gail's Hair", type: t('Frisörsalong', 'Hair Salon'), stat: '+89%', statLabel: t('bokningar', 'bookings'), url: 'https://gailshairgallery.lovable.app/book', image: gailsHairImg },
              { name: 'Oh My Coffee', type: t('Café & Restaurang', 'Café & Restaurant'), stat: null, url: 'https://ohmycoffee-gbg-web.lovable.app/', image: ohMyCoffeeImg },
              { name: 'Bamba', type: t('Restaurang', 'Restaurant'), stat: '+177%', statLabel: t('bokningar/vecka', 'bookings/week'), url: 'https://bamba.lovable.app/', image: bambaImg },
              { name: 'En Deli Haga', type: t('Delikatess & Café', 'Deli & Café'), stat: null, url: 'https://en-deli-cozy-vibes.lovable.app/', image: enDeliHagaImg },
            ].map((project, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border/50 hover:border-accent/50 transition-all duration-500 block shadow-lg hover:shadow-xl hover:shadow-accent/10">
                  {project.stat && (
                    <div className="absolute top-3 right-3 z-10 bg-accent text-accent-foreground px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                      {project.stat} {project.statLabel}
                    </div>
                  )}
                  <img src={project.image} alt={project.name} className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/95 via-foreground/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-6 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="text-primary-foreground font-heading font-bold text-lg">{project.name}</p>
                    <p className="text-primary-foreground/70 text-sm">{project.type}</p>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-10 text-center sm:hidden">
            <Button asChild variant="outline" className="group">
              <Link to="/portfolio">
                {t('Se alla projekt', 'View all projects')}
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════════
          5. SOCIAL PROOF - Testimonials
      ═══════════════════════════════════════════════════════════════════ */}
      <Testimonials />


      {/* ═══════════════════════════════════════════════════════════════════
          6. WHAT YOU GET - Features/Deliverables
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-32 relative overflow-hidden">
        {/* Layered background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-0 w-1/3 h-96 -translate-y-1/2 bg-gradient-to-r from-accent/5 to-transparent" />
          <div className="absolute top-1/2 right-0 w-1/3 h-96 -translate-y-1/2 bg-gradient-to-l from-accent/5 to-transparent" />
        </div>
        
        <div className="container-wide section-padding relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              {t('Vad ingår i din webbplats', 'What\'s included in your website')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              {t('En komplett lösning redo att ta emot kunder från dag ett.', 'A complete solution ready to receive customers from day one.')}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { title: t('Responsiv design', 'Responsive design'), desc: t('Ser perfekt ut på mobil, surfplatta och dator.', 'Looks perfect on mobile, tablet, and desktop.') },
              { title: t('Snabb leverans', 'Fast delivery'), desc: t('7-14 dagars leverans beroende på paket.', '7-14 day delivery depending on package.') },
              { title: t('SEO-optimerad', 'SEO optimized'), desc: t('Grundläggande sökmotoroptimering för bättre synlighet.', 'Basic search engine optimization for better visibility.') },
              { title: t('Kontaktformulär', 'Contact form'), desc: t('Få leads direkt till din inbox.', 'Get leads directly to your inbox.') },
              { title: t('Revisioner ingår', 'Revisions included'), desc: t('1-3 revideringsrundor beroende på paket.', '1-3 revision rounds depending on package.') },
              { title: t('Fast pris', 'Fixed price'), desc: t('Inga dolda kostnader eller överraskningar.', 'No hidden costs or surprises.') },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group"
              >
                <div className="p-5 rounded-xl border border-border/50 bg-secondary/30 hover:border-accent/30 hover:bg-accent/5 transition-all duration-300 h-full">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-base">{item.title}</h3>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="flex-shrink-0 w-5 h-5 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-accent/20 hover:text-accent transition-colors">
                          <Info className="w-3 h-3" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent side="top" className="text-sm max-w-[200px]">
                        {item.desc}
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Button asChild variant="outline" className="group">
              <Link to="/priser">
                {t('Se alla paket och priser', 'See all packages and prices')}
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════════
          7. HOW IT WORKS - Simple process
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-32 bg-secondary/20 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        
        <div className="container-narrow section-padding">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              {t('Så här fungerar det', 'How it works')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
              {t('En smidig process i fyra steg. Från första kontakt till färdig webbplats.', 'A smooth process in four steps. From first contact to finished website.')}
            </p>
            <Button asChild variant="outline" className="group">
              <Link to="/hur-det-fungerar">
                {t('Läs mer om processen', 'Learn more about the process')}
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════════
          8. FAQ - Handle objections
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-32">
        <div className="container-narrow section-padding">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold">FAQ</h2>
            <Button asChild variant="ghost" className="group">
              <Link to="/faq">
                {t('Se alla', 'View all')}
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>

          <div className="space-y-4">
            {[
              { q: t('Är konceptet verkligen gratis?', 'Is the concept really free?'), a: t('Ja! Du betalar endast €50 i verifieringsavgift som dras av från priset om du fortsätter, eller återbetalas helt om du tackar nej.', 'Yes! You only pay a €50 verification fee that\'s deducted from the price if you continue, or fully refunded if you decline.') },
              { q: t('Hur lång tid tar leveransen?', 'How long does delivery take?'), a: t('Beroende på paket: Starter 14 dagar, Standard 10 dagar, Pro 7 dagar. Koncept levereras inom 72h.', 'Depending on package: Starter 14 days, Standard 10 days, Pro 7 days. Concepts delivered within 72h.') },
              { q: t('Erbjuder ni Klarna?', 'Do you offer Klarna?'), a: t('Ja! Delbetala med Klarna – betala senare eller dela upp i 3 delbetalningar.', 'Yes! Pay in installments with Klarna – pay later or split into 3 payments.') },
            ].map((faq, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-xl border border-border/50 hover:border-accent/30 hover:bg-accent/5 transition-all duration-300"
              >
                <h4 className="font-heading font-semibold text-lg mb-2">{faq.q}</h4>
                <p className="text-muted-foreground">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════════
          9. FINAL CTA - Choose Your Path
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-accent/5 to-secondary/30 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        
        <div className="container-wide section-padding relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              {t('Välj din väg', 'Choose your path')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              {t('Två sätt att komma igång – välj det som passar dig bäst.', 'Two ways to get started – choose what suits you best.')}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Concept Path */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -5 }}
              className="relative p-8 rounded-2xl border border-border/50 bg-background/80 backdrop-blur-sm hover:border-accent/30 transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20 shrink-0">
                  <Sparkles className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{t('Gratis koncept', 'Free Concept')}</h3>
                  <p className="text-muted-foreground text-sm">{t('Se din framtida webbplats innan du bestämmer dig.', 'See your future website before you decide.')}</p>
                </div>
              </div>
              <div className="space-y-4 mb-8">
                {[
                  t('Berätta om ditt företag och välj stil', 'Tell us about your business and choose style'),
                  t('Betala €50 verifieringsavgift (återbetalbar)', 'Pay €50 verification fee (refundable)'),
                  t('Få ett custom koncept inom 72h', 'Get a custom concept within 72h'),
                  t('Gillar du det? Avgiften dras från priset. Gillar inte? Full återbetalning.', 'Like it? Fee deducted from price. Don\'t like it? Full refund.'),
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-sm font-bold text-accent flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground">{step}</span>
                  </div>
                ))}
              </div>
              <Button asChild variant="outline" className="w-full group">
                <Link to="/demo">
                  {t('Få gratis koncept', 'Get free concept')}
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>

            {/* Direct Order Path */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -5 }}
              className="relative p-8 rounded-2xl border border-border/50 bg-background/80 backdrop-blur-sm hover:border-accent/30 transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20 shrink-0">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{t('Direktbeställning', 'Direct Order')}</h3>
                  <p className="text-muted-foreground text-sm">{t('Vet du redan vad du vill ha? Hoppa direkt till beställning.', 'Already know what you want? Skip straight to ordering.')}</p>
                </div>
              </div>
              <div className="space-y-4 mb-8">
                {[
                  t('Välj paket och anpassa din beställning', 'Choose package and customize your order'),
                  t('Ladda upp material och beskriv dina önskemål', 'Upload materials and describe your wishes'),
                  t('Betala och vi börjar bygga direkt', 'Pay and we start building immediately'),
                  t('Din webbplats levererad inom 7-14 dagar', 'Your website delivered within 7-14 days'),
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-sm font-bold text-accent flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground">{step}</span>
                  </div>
                ))}
              </div>
              <Button asChild variant="outline" className="w-full group">
                <Link to="/bestall">
                  {t('Beställ direkt', 'Order directly')}
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center mt-10"
          >
            <Link 
              to="/efter-demo" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
            >
              {t('Har du redan fått ditt koncept?', 'Already received your concept?')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
