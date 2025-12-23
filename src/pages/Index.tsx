import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, Zap, CheckCircle2, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Testimonials } from '@/components/Testimonials';
import { TrustBadges } from '@/components/TrustBadges';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

// Import portfolio images
import gailsHairImg from '@/assets/portfolio-gailshair.png';
import ohMyCoffeeImg from '@/assets/portfolio-ohmycoffee.png';
import bambaImg from '@/assets/portfolio-bamba.png';
import enDeliHagaImg from '@/assets/portfolio-endelihaga.png';

// Before/After images
import beforeSwedenCarImg from '@/assets/before-swedencar.png';
import afterSwedenCarImg from '@/assets/after-swedencar.png';

export default function Index() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  
  // Strong parallax transforms for hero logo - much greater effect, faster fade
  const logoY = useTransform(scrollYProgress, [0, 0.08], [0, -120]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const logoScale = useTransform(scrollYProgress, [0, 0.08], [1, 0.8]);
  
  // Background parallax - stronger effect
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const bgCircle1Y = useTransform(scrollYProgress, [0, 1], [0, 500]);
  const bgCircle2Y = useTransform(scrollYProgress, [0, 1], [0, -350]);

  return (
    <div className="overflow-hidden">
      {/* Hero Logo - BIGGER with strong scroll parallax fade */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ y: logoY, opacity: logoOpacity, scale: logoScale }}
        className="pt-16 pb-8 text-center"
      >
        <span className="font-heading font-bold text-7xl sm:text-8xl lg:text-9xl tracking-tighter">
          Nomia<span className="text-accent">.</span>
        </span>
      </motion.div>

      {/* Hero Section - Full height, immersive with parallax */}
      <section ref={heroRef} className="min-h-[65vh] flex items-center relative overflow-hidden">
        {/* Animated parallax background */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-gradient-to-br from-accent/10 via-accent/5 to-transparent rounded-full blur-3xl"
            style={{ y: bgCircle1Y }}
          />
          <motion.div 
            className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-accent/8 via-transparent to-transparent rounded-full blur-3xl"
            style={{ y: bgCircle2Y }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-gradient-radial from-accent/3 to-transparent rounded-full" />
        </div>
        
        <motion.div 
          className="container-narrow text-center relative z-10 section-padding py-20"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-8 backdrop-blur-sm border border-accent/20"
          >
            <Clock className="w-4 h-4" />
            {t('Begränsade platser', 'Limited spots')}
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight"
          >
            {t('Webb-koncept', 'Website concept')}
            <br />
            <span className="text-accent">
              {t('på 72 timmar', 'in 72 hours')}
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 text-lg sm:text-xl text-muted-foreground max-w-lg mx-auto"
          >
            {t(
              'Se din framtida webbplats innan du bestämmer dig.',
              'See your future website before you commit.'
            )}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button asChild size="lg" className="group h-14 px-8 text-base hover:scale-105 transition-transform">
              <Link to="/demo">
                {t('Få ditt koncept', 'Get your concept')}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="group h-14 px-8 text-base hover:scale-105 transition-transform">
              <Link to="/bestall">
                {t('Beställ direkt', 'Order directly')}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-4"
          >
            <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Link to="/efter-demo">
                {t('Har du fått ditt koncept?', 'Have you received your concept?')}
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2">
            <motion.div 
              className="w-1 h-2 bg-muted-foreground/50 rounded-full"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Trust Badges */}
      <TrustBadges />

      {/* 3-Step Process - Staggered layout with scroll animations */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/30 to-transparent pointer-events-none" />
        
        <div className="container-wide section-padding relative">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-center mb-20"
          >
            {t('Så här fungerar det', 'How it works')}
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                icon: FileText,
                step: '01',
                title: t('Välj paket & stil', 'Choose package & style'),
                desc: t('Berätta om ditt företag och välj riktning.', 'Tell us about your business and choose direction.'),
              },
              {
                icon: Shield,
                step: '02',
                title: t('Bekräfta din plats', 'Confirm your slot'),
                desc: t('Boka en prioritetsplats, helt återbetalningsbar.', 'Book a priority slot, fully refundable.'),
              },
              {
                icon: Zap,
                step: '03',
                title: t('Få koncept inom 72h', 'Get concept in 72h'),
                desc: t('Granska och bestäm om du vill fortsätta.', 'Review and decide if you want to proceed.'),
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative group"
                style={{ marginTop: index === 1 ? '2rem' : index === 2 ? '4rem' : '0' }}
              >
                <div className="absolute -inset-4 bg-gradient-to-br from-accent/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <motion.div 
                  className="relative p-8 bg-background/50 backdrop-blur-sm rounded-xl border border-border/50 hover:border-accent/30 transition-all duration-500"
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="text-6xl font-bold text-accent/10 absolute top-4 right-4">
                    {item.step}
                  </span>
                  <item.icon className="w-10 h-10 text-accent mb-6" />
                  <h3 className="font-heading font-semibold text-xl mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get - Minimal list */}
      <section className="py-24">
        <div className="container-narrow section-padding">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-center mb-16"
          >
            {t('Vad ingår', 'What\'s included')}
          </motion.h2>

          <div className="grid sm:grid-cols-2 gap-6 max-w-xl mx-auto">
            {[
              t('Startsida + undersida', 'Home + inner page'),
              t('Varumärkesriktning', 'Brand direction'),
              t('1 revision', '1 revision'),
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, x: 5 }}
                className="flex items-center gap-4 p-4 rounded-lg border border-border/50 hover:border-accent/30 hover:bg-accent/5 transition-all duration-300 cursor-default"
              >
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="font-medium">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Who This Is For - Clean two-column */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent pointer-events-none" />
        
        <div className="container-narrow section-padding relative">
          <div className="grid md:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="font-heading font-semibold text-lg mb-6 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-accent" />
                {t('Detta passar dig om...', 'This is for you if...')}
              </h3>
              <ul className="space-y-4">
                {[
                  t('Du driver ett litet företag', 'You run a small business'),
                  t('Du behöver en professionell webb snabbt', 'You need a professional site fast'),
                  t('Du vill se innan du köper', 'You want to see before buying'),
                ].map((item, i) => (
                  <motion.li 
                    key={i} 
                    className="text-muted-foreground hover:text-foreground transition-colors pl-4 border-l-2 border-accent/30 hover:border-accent"
                    whileHover={{ x: 5 }}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="font-heading font-semibold text-lg mb-6 flex items-center gap-3">
                <span className="w-6 h-6 rounded-full border-2 border-muted-foreground flex items-center justify-center text-xs">✕</span>
                {t('Inte för dig om...', 'Not for you if...')}
              </h3>
              <ul className="space-y-4">
                {[
                  t('Du behöver komplex e-handel', 'You need complex e-commerce'),
                  t('Du söker gratis arbete', 'You\'re looking for free work'),
                ].map((item, i) => (
                  <motion.li 
                    key={i} 
                    className="text-muted-foreground hover:text-foreground transition-colors pl-4 border-l-2 border-border hover:border-muted-foreground"
                    whileHover={{ x: 5 }}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Before/After Transformation Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />
        
        <div className="container-wide section-padding relative">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {t('Före & Efter', 'Before & After')}
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {t('Se hur vi förvandlar webbplatser.', 'See how we transform websites.')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {/* Before */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute -top-3 left-4 z-10">
                <span className="bg-muted-foreground/80 text-background px-4 py-1.5 rounded-full text-sm font-semibold">
                  {t('Före', 'Before')}
                </span>
              </div>
              <div className="aspect-[4/3] rounded-xl overflow-hidden border-2 border-border/50">
                <img 
                  src={beforeSwedenCarImg} 
                  alt={t('Före transformation', 'Before transformation')}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </motion.div>

            {/* After */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative"
            >
              <div className="absolute -top-3 left-4 z-10">
                <span className="bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-sm font-semibold">
                  {t('Efter', 'After')}
                </span>
              </div>
              <div className="aspect-[4/3] rounded-xl overflow-hidden border-2 border-accent/50 shadow-lg shadow-accent/10">
                <img 
                  src={afterSwedenCarImg} 
                  alt={t('Efter transformation', 'After transformation')}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-8"
          >
            <p className="text-muted-foreground mb-4">
              <span className="font-semibold text-foreground">Sweden Car AB</span> — {t('Från gammaldags till modernt och professionellt', 'From outdated to modern and professional')}
            </p>
            <Button asChild variant="outline" className="group">
              <a href="https://premium-car-boutique.lovable.app/" target="_blank" rel="noopener noreferrer">
                {t('Se live-sidan', 'View live site')}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Preview - Full width, layered */}
      <section className="py-24 bg-secondary/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        
        <div className="container-wide section-padding">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold">Portfolio</h2>
            <Button asChild variant="ghost" className="group">
              <Link to="/portfolio">
                {t('Se alla', 'View all')}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>

          {/* Real portfolio items with images */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { name: "Gail's Hair", type: t('Frisörsalong', 'Hair Salon'), url: 'https://gailshairgallery.lovable.app/book', image: gailsHairImg },
              { name: 'Oh My Coffee', type: t('Café', 'Café'), url: 'https://ohmycoffee-gbg-web.lovable.app/', image: ohMyCoffeeImg },
              { name: 'Bamba', type: t('Restaurang', 'Restaurant'), url: 'https://bamba.lovable.app/', image: bambaImg },
              { name: 'En Deli Haga', type: t('Delikatess', 'Deli'), url: 'https://en-deli-cozy-vibes.lovable.app/', image: enDeliHagaImg },
            ].map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <a 
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-border/50 hover:border-accent/50 transition-all duration-500 block"
                >
                  <img 
                    src={project.image} 
                    alt={project.name}
                    className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="text-primary-foreground font-heading font-semibold text-sm sm:text-lg">{project.name}</p>
                    <p className="text-primary-foreground/70 text-xs sm:text-sm">{project.type}</p>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Monthly Care Teaser - Accent section with parallax */}
      <section className="py-24 bg-background relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          style={{ y: useTransform(scrollYProgress, [0.5, 1], [0, -50]) }}
        >
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl" />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="container-narrow section-padding text-center relative z-10"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            {t('Månatlig webbvård', 'Monthly Care')}
          </h2>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            {t(
              'Håll din webbplats snabb, uppdaterad och redigerbar.',
              'Keep your site fast, updated, and editable.'
            )}
          </p>
          <p className="text-muted-foreground/70 text-sm mb-8">
            {t('Avsluta när du vill.', 'Cancel anytime.')}
          </p>
          <Button asChild variant="secondary" className="group hover:scale-105 transition-transform">
            <Link to="/priser">
              {t('Se vårdplaner', 'See care plans')}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </section>

      {/* FAQ Preview */}
      <section className="py-24">
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
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: t('Är konceptet gratis?', 'Is the concept free?'),
                a: t('Ja, du betalar endast en återbetalningsbar verifieringsavgift.', 'Yes, you only pay a refundable verification fee.'),
              },
              {
                q: t('Varför verifieringsavgift?', 'Why the verification fee?'),
                a: t('Det visar att du är seriös och bokar din plats.', 'It shows you\'re serious and books your slot.'),
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
                className="p-6 rounded-xl border border-border/50 hover:border-accent/30 hover:bg-accent/5 transition-all duration-300"
              >
                <h4 className="font-heading font-semibold text-lg mb-2">{faq.q}</h4>
                <p className="text-muted-foreground">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Minimal */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container-narrow section-padding text-center relative"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            {t('Få ditt koncept', 'Get your concept')}
          </h2>
          <p className="text-muted-foreground mb-10">
            {t('Inom 72 timmar.', 'Within 72 hours.')}
          </p>
          <Button asChild size="lg" className="group h-14 px-10 text-base hover:scale-105 transition-transform">
            <Link to="/demo">
              {t('Börja här', 'Start here')}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
