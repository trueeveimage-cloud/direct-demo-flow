import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, Zap, CheckCircle2, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Testimonials } from '@/components/Testimonials';
import { TrustBadges } from '@/components/TrustBadges';
import { motion } from 'framer-motion';

// Import portfolio images
import gailsHairImg from '@/assets/portfolio-gailshair.png';
import ohMyCoffeeImg from '@/assets/portfolio-ohmycoffee.png';
import bambaImg from '@/assets/portfolio-bamba.png';
import enDeliHagaImg from '@/assets/portfolio-endelihaga.png';

// Before/After images
import beforeSwedenCarImg from '@/assets/before-swedencar.png';
import afterSwedenCarImg from '@/assets/after-swedencar.png';
export default function Index() {
  const {
    t
  } = useLanguage();
  const navigate = useNavigate();
  return <div className="overflow-hidden">
      {/* Gold Blur Background - Static on mobile, animated on desktop for performance */}
      <div className="fixed top-0 left-0 right-0 h-[600px] pointer-events-none z-0 overflow-hidden">
        {/* Static blurs for mobile, animated for desktop */}
        <div className="hidden md:block">
          <motion.div 
            className="absolute top-[-100px] left-[10%] w-[400px] h-[400px] bg-accent/20 rounded-full blur-[120px] will-change-transform" 
            animate={{
              x: [0, 100, -50, 0],
              y: [0, 50, -30, 0],
            }} 
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }} 
          />
          <motion.div 
            className="absolute top-[-50px] right-[15%] w-[300px] h-[300px] bg-accent/15 rounded-full blur-[100px] will-change-transform" 
            animate={{
              x: [0, -80, 60, 0],
              y: [0, 80, -40, 0],
            }} 
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "linear",
              delay: 2
            }} 
          />
        </div>
        {/* Static blurs for mobile - no animation, better performance */}
        <div className="md:hidden">
          <div className="absolute top-[-100px] left-[10%] w-[300px] h-[300px] bg-accent/15 rounded-full blur-[80px]" />
          <div className="absolute top-[-50px] right-[10%] w-[200px] h-[200px] bg-accent/10 rounded-full blur-[60px]" />
        </div>
      </div>

      {/* Hero Logo - Clean, static */}
      <motion.div initial={{
      opacity: 0,
      y: 10
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5,
      ease: "easeOut"
    }} className="pt-8 pb-4 text-center relative z-10">
        <span className="font-heading font-bold text-5xl sm:text-6xl lg:text-7xl tracking-tighter">
          Nomia<span className="text-accent">.</span>
        </span>
      </motion.div>

      {/* Hero Section - Clean, no parallax */}
      <section className="min-h-[55vh] flex items-center relative overflow-hidden">
        <div className="container-narrow text-center relative z-10 section-padding py-16">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0
        }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-8 backdrop-blur-sm border border-accent/20">
            <Clock className="w-4 h-4" />
            {t('Begränsade platser', 'Limited spots')}
          </motion.div>

          <motion.h1 initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.1
        }} className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.15] tracking-tight max-w-2xl mx-auto">
            {t('Skapa din hemsida.', 'Create your website.')}
            <br />
            <span className="text-muted-foreground">
              {t('Se hur din framtida webbsida kan se ut innan du betalar.', 'See how your future website can look before you pay.')}
            </span>
          </motion.h1>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.3
        }} className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
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
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground"
          >
            <svg className="w-12 h-5" viewBox="0 0 67 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.34 0H0v16h6.34V0zM13.7 0c0 2.75-1.1 5.39-3.06 7.33l4.64 8.67H8.13l-4.65-8.67C5.43 5.39 6.52 2.75 6.52 0h7.18zM14.35 0v16h6.34V0h-6.34zM40.32 3.8c-.86-.86-2.03-1.33-3.28-1.33a4.65 4.65 0 00-4.65 4.65c0 2.57 2.08 4.65 4.65 4.65 1.25 0 2.42-.48 3.28-1.33v1.08h5.55V2.72h-5.55v1.08zm-2.15 4.07c-.82 0-1.49-.67-1.49-1.49s.67-1.49 1.49-1.49 1.49.67 1.49 1.49-.67 1.49-1.49 1.49zM53.72 2.47c-1.3 0-2.43.47-3.24 1.33V2.72h-5.55v8.8h5.76V7.7c0-.82.67-1.49 1.49-1.49s1.49.67 1.49 1.49v3.82h5.76V6.38c0-2.16-1.75-3.91-3.91-3.91h-1.8zM67 11.52V2.72h-5.55v8.8H67zM67 0h-5.55v1.85H67V0zM28.74 11.52V0h-5.55v11.52h5.55zM24.34 12.35a2.78 2.78 0 002.78 2.78 2.78 2.78 0 002.78-2.78h-5.56z" fill="currentColor"/>
            </svg>
            <span>{t('Delbetala enkelt', 'Easy installments')}</span>
          </motion.div>
          <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          duration: 0.6,
          delay: 0.5
        }} className="mt-4">
            <Link to="/efter-demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t('Har du fått ditt koncept?', 'Have you received your concept?')}
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.button onClick={() => {
        const nextSection = document.querySelector('section:nth-of-type(2)');
        if (nextSection) {
          nextSection.scrollIntoView({
            behavior: 'smooth'
          });
        } else {
          window.scrollTo({
            top: window.innerHeight * 0.6,
            behavior: 'smooth'
          });
        }
      }} className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer group" animate={{
        y: [0, 10, 0]
      }} transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }} aria-label="Scroll down">
          
        </motion.button>
      </section>

      {/* Trust Badges */}
      <TrustBadges />

      {/* Before/After Transformation Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />
        
        <div className="container-wide section-padding relative">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {t('Före & Efter', 'Before & After')}
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {t('Se hur vi förvandlar webbplatser.', 'See how we transform websites.')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {/* Before */}
            <motion.div initial={{
            opacity: 0,
            x: -30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }} className="relative">
              <div className="absolute -top-3 left-4 z-10">
                <span className="bg-muted-foreground/80 text-background px-4 py-1.5 rounded-full text-sm font-semibold">
                  {t('Före', 'Before')}
                </span>
              </div>
              <div className="aspect-[4/3] rounded-xl overflow-hidden border-2 border-border/50">
                <img src={beforeSwedenCarImg} alt={t('Före transformation', 'Before transformation')} className="w-full h-full object-cover object-top" />
              </div>
            </motion.div>

            {/* After */}
            <motion.div initial={{
            opacity: 0,
            x: 30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6,
            delay: 0.1
          }} className="relative">
              <div className="absolute -top-3 left-4 z-10">
                <span className="bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-sm font-semibold">
                  {t('Efter', 'After')}
                </span>
              </div>
              <div className="aspect-[4/3] rounded-xl overflow-hidden border-2 border-accent/50 shadow-lg shadow-accent/10">
                <img src={afterSwedenCarImg} alt={t('Efter transformation', 'After transformation')} className="w-full h-full object-cover object-top" />
              </div>
            </motion.div>
          </div>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5,
          delay: 0.3
        }} className="text-center mt-8">
            <p className="text-muted-foreground mb-4">
              <span className="font-semibold text-foreground">Sweden Car AB</span> — {t('Från gammaldags till modernt och professionellt', 'From outdated to modern and professional')}
            </p>
            <Button asChild variant="outline" className="group">
              <Link to="/portfolio">
                {t('Se fler exempel', 'See more examples')}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* 3-Step Process - Staggered layout with scroll animations */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/30 to-transparent pointer-events-none" />
        
        <div className="container-wide section-padding relative">
          <motion.h2 initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true,
          margin: "-100px"
        }} transition={{
          duration: 0.6
        }} className="text-3xl sm:text-4xl font-bold text-center mb-20">
            {t('Så här fungerar det', 'How it works')}
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[{
            icon: FileText,
            step: '01',
            title: t('Välj paket & stil', 'Choose package & style'),
            desc: t('Berätta om ditt företag och välj riktning.', 'Tell us about your business and choose direction.')
          }, {
            icon: Shield,
            step: '02',
            title: t('Bekräfta din plats', 'Confirm your slot'),
            desc: t('Boka en prioritetsplats, helt återbetalningsbar.', 'Book a priority slot, fully refundable.')
          }, {
            icon: Zap,
            step: '03',
            title: t('Få koncept inom 72h', 'Get concept in 72h'),
            desc: t('Granska och bestäm om du vill fortsätta.', 'Review and decide if you want to proceed.')
          }].map((item, index) => <motion.div key={index} initial={{
            opacity: 0,
            y: 50
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true,
            margin: "-50px"
          }} transition={{
            duration: 0.6,
            delay: index * 0.15
          }} className="relative group" style={{
            marginTop: index === 1 ? '2rem' : index === 2 ? '4rem' : '0'
          }}>
                <div className="absolute -inset-4 bg-gradient-to-br from-accent/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <motion.div className="relative p-8 bg-background/50 backdrop-blur-sm rounded-xl border border-border/50 hover:border-accent/30 transition-all duration-500" whileHover={{
              y: -5,
              scale: 1.02
            }} transition={{
              type: "spring",
              stiffness: 300
            }}>
                  <span className="text-6xl font-bold text-accent/10 absolute top-4 right-4">
                    {item.step}
                  </span>
                  <item.icon className="w-10 h-10 text-accent mb-6" />
                  <h3 className="font-heading font-semibold text-xl mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </motion.div>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Vad du får - Benefits section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent pointer-events-none" />
        
        <div className="container-narrow section-padding relative">
          <motion.h2 initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true,
          margin: "-100px"
        }} transition={{
          duration: 0.6
        }} className="text-3xl sm:text-4xl font-bold text-center mb-12">
            {t('Vad du får', 'What you get')}
          </motion.h2>

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {[{
            title: t('Tydlig design', 'Clear design'),
            desc: t('Modern, professionell och fokuserad på konvertering.', 'Modern, professional and focused on conversion.')
          }, {
            title: t('Snabb leverans', 'Fast delivery'),
            desc: t('Första koncept inom 72 timmar, garanterat.', 'First concept within 72 hours, guaranteed.')
          }, {
            title: t('Fler bokningar', 'More bookings'),
            desc: t('Optimerad för att få kunder att boka eller kontakta dig.', 'Optimized to get customers to book or contact you.')
          }, {
            title: t('Fast pris', 'Fixed price'),
            desc: t('Inga dolda avgifter eller överraskningar.', 'No hidden fees or surprises.')
          }].map((item, index) => <motion.div key={index} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5,
            delay: index * 0.1
          }} className="p-6 rounded-xl border border-border/50 hover:border-accent/30 hover:bg-accent/5 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </div>
                </div>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />



      {/* Portfolio Preview - Full width, layered */}
      <section className="py-24 bg-secondary/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        
        <div className="container-wide section-padding">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }} className="flex items-center justify-between mb-12">
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
            {[{
            name: "Gail's Hair",
            type: t('Frisörsalong', 'Hair Salon'),
            url: 'https://gailshairgallery.lovable.app/book',
            image: gailsHairImg
          }, {
            name: 'Oh My Coffee',
            type: t('Café', 'Café'),
            url: 'https://ohmycoffee-gbg-web.lovable.app/',
            image: ohMyCoffeeImg
          }, {
            name: 'Bamba',
            type: t('Restaurang', 'Restaurant'),
            url: 'https://bamba.lovable.app/',
            image: bambaImg
          }, {
            name: 'En Deli Haga',
            type: t('Delikatess', 'Deli'),
            url: 'https://en-deli-cozy-vibes.lovable.app/',
            image: enDeliHagaImg
          }].map((project, index) => <motion.div key={index} initial={{
            opacity: 0,
            scale: 0.9
          }} whileInView={{
            opacity: 1,
            scale: 1
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5,
            delay: index * 0.1
          }}>
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-border/50 hover:border-accent/50 transition-all duration-500 block">
                  <img src={project.image} alt={project.name} className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="text-primary-foreground font-heading font-semibold text-sm sm:text-lg">{project.name}</p>
                    <p className="text-primary-foreground/70 text-xs sm:text-sm">{project.type}</p>
                  </div>
                </a>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Monthly Care Teaser - Accent section */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl" />
        </div>
        
        <motion.div initial={{
        opacity: 0,
        y: 40
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.7
      }} className="container-narrow section-padding text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            {t('Månatlig webbvård', 'Monthly Care')}
          </h2>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            {t('Håll din webbplats snabb, uppdaterad och redigerbar.', 'Keep your site fast, updated, and editable.')}
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
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }} className="flex items-center justify-between mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">FAQ</h2>
            <Button asChild variant="ghost" className="group">
              <Link to="/faq">
                {t('Se alla', 'View all')}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>

          <div className="space-y-4">
            {[{
            q: t('Är konceptet gratis?', 'Is the concept free?'),
            a: t('Ja, du betalar endast en återbetalningsbar verifieringsavgift.', 'Yes, you only pay a refundable verification fee.')
          }, {
            q: t('Varför verifieringsavgift?', 'Why the verification fee?'),
            a: t('Det visar att du är seriös och bokar din plats.', 'It shows you\'re serious and books your slot.')
          }].map((faq, index) => <motion.div key={index} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5,
            delay: index * 0.1
          }} whileHover={{
            scale: 1.01
          }} className="p-6 rounded-xl border border-border/50 hover:border-accent/30 hover:bg-accent/5 transition-all duration-300">
                <h4 className="font-heading font-semibold text-lg mb-2">{faq.q}</h4>
                <p className="text-muted-foreground">{faq.a}</p>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Final CTA - Minimal */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />
        
        <motion.div initial={{
        opacity: 0,
        scale: 0.95
      }} whileInView={{
        opacity: 1,
        scale: 1
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6
      }} className="container-narrow section-padding text-center relative">
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
    </div>;
}