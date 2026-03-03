import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowRight, FileText, Zap, CheckCircle2, Clock, Shield, Info, Sparkles, TrendingDown, Eye, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { TestimonialsCarousel } from '@/components/TestimonialsCarousel';
import { TrustBadges } from '@/components/TrustBadges';
import { ROICalculator } from '@/components/ROICalculator';
import { motion } from 'framer-motion';
import { useRemainingSpots } from '@/hooks/useRemainingSpots';
import { ParallaxSection, AnimatedText, TiltCard } from '@/components/ParallaxSection';
import { ScrollTriggeredCounter } from '@/components/ScrollTriggeredCounter';
import { GrainOverlay } from '@/components/PremiumEffects';

// Import portfolio images
import gailsHairImg from '@/assets/portfolio-gailshair.png';
import ohMyCoffeeImg from '@/assets/portfolio-ohmycoffee.png';
import bambaImg from '@/assets/portfolio-bamba.png';
import enDeliHagaImg from '@/assets/portfolio-endelihaga.png';

// Before/After images
import beforeSwedenCarImg from '@/assets/before-swedencar.png';
import afterSwedenCarImg from '@/assets/after-swedencar.png';

// Simplified hero background - static CSS only
function HeroBackground() {
  return (
    <div className="fixed top-0 left-0 right-0 h-screen pointer-events-none z-0 overflow-hidden motion-reduce:hidden">
      <div className="hidden md:block h-full">
        <div className="absolute top-[-150px] left-[5%] w-[600px] h-[600px] rounded-full bg-accent/10 blur-[100px]" />
        <div className="absolute top-[50px] right-[10%] w-[500px] h-[500px] bg-accent/8 blur-[80px]" />
        <div className="absolute top-[300px] left-[35%] w-[400px] h-[400px] rounded-full bg-accent/6 blur-[60px]" />
      </div>
      <div className="md:hidden h-full">
        <div className="absolute top-[-100px] left-[10%] w-[300px] h-[300px] bg-accent/8 rounded-full blur-[80px]" />
        <div className="absolute top-[-50px] right-[10%] w-[200px] h-[200px] bg-accent/6 rounded-full blur-[60px]" />
      </div>
    </div>
  );
}

// Before/After Section with Parallax Effect
function BeforeAfterSection({ t, beforeImg, afterImg }: { t: (sv: string, en: string, overrides?: { no?: string; dk?: string }) => string; beforeImg: string; afterImg: string }) {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-1/2 h-1/2 bg-gradient-to-l from-accent/5 to-transparent blur-3xl" />
      </div>
      
      <div className="container-wide section-padding relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              <Eye className="w-4 h-4" />
              {t('Transformation', 'Transformation', { no: 'Transformasjon', dk: 'Transformation' })}
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light mb-6 leading-tight tracking-tight">
              {t('Från föråldrad till professionell', 'From outdated to professional', { no: 'Fra utdatert til profesjonell', dk: 'Fra forældet til professionel' })}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t('Vi förvandlar webbplatser som skrämmer bort kunder till webbplatser som konverterar besökare till bokningar.', 'We transform websites that scare away customers into websites that convert visitors into bookings.', { no: 'Vi forvandler nettsider som skremmer bort kunder til nettsider som konverterer besøkende til bestillinger.', dk: 'Vi forvandler hjemmesider der skræmmer kunder væk til hjemmesider der konverterer besøgende til bookinger.' })}
            </p>
            
            <div className="mb-8">
              <p className="text-muted-foreground mb-2">
                <span className="font-semibold text-foreground">Sweden Car AB</span>
              </p>
              <p className="text-sm text-muted-foreground">
                {t('Från gammaldags design till modernt och professionellt intryck.', 'From outdated design to a modern, professional impression.', { no: 'Fra gammeldags design til et moderne og profesjonelt inntrykk.', dk: 'Fra gammeldags design til et moderne og professionelt indtryk.' })}
              </p>
            </div>
            
            <Button asChild variant="outline" className="group">
              <Link to="/portfolio">
                {t('Se fler transformationer', 'See more transformations', { no: 'Se flere transformasjoner', dk: 'Se flere transformationer' })}
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
          
          {/* Right: Before/After Images */}
          <div className="relative">
            <div className="relative z-10 hidden md:block">
              <div className="absolute -top-3 left-4 z-20">
                <span className="bg-muted-foreground/80 text-background px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                  {t('Före', 'Before', { no: 'Før', dk: 'Før' })}
                </span>
              </div>
              <div className="aspect-[4/3] rounded-xl overflow-hidden border-2 border-border/50 shadow-xl">
                <img src={beforeImg} alt={t('Före transformation', 'Before transformation', { no: 'Før transformasjon', dk: 'Før transformation' })} className="w-full h-full object-cover object-top" />
              </div>
            </div>
            
            <div className="relative z-10 md:hidden">
              <div className="absolute -top-3 left-4 z-20">
                <span className="bg-muted-foreground/80 text-background px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                  {t('Före', 'Before', { no: 'Før', dk: 'Før' })}
                </span>
              </div>
              <div className="aspect-[4/3] rounded-xl overflow-hidden border-2 border-border/50 shadow-xl">
                <img src={beforeImg} alt={t('Före transformation', 'Before transformation', { no: 'Før transformasjon', dk: 'Før transformation' })} className="w-full h-full object-cover object-top" />
              </div>
            </div>
            
            <div className="relative z-20 -mt-24 ml-12 lg:ml-20 hidden md:block">
              <div className="absolute -top-3 left-4 z-20">
                <span className="bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                  {t('Efter', 'After', { no: 'Etter', dk: 'Efter' })}
                </span>
              </div>
              <div className="aspect-[4/3] rounded-xl overflow-hidden border-2 border-accent/50 shadow-2xl shadow-accent/20">
                <img src={afterImg} alt={t('Efter transformation', 'After transformation', { no: 'Etter transformasjon', dk: 'Efter transformation' })} className="w-full h-full object-cover object-top" />
              </div>
            </div>
            
            <div className="relative z-20 -mt-16 ml-8 md:hidden">
              <div className="absolute -top-3 left-4 z-20">
                <span className="bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                  {t('Efter', 'After', { no: 'Etter', dk: 'Efter' })}
                </span>
              </div>
              <div className="aspect-[4/3] rounded-xl overflow-hidden border-2 border-accent/50 shadow-2xl shadow-accent/20">
                <img src={afterImg} alt={t('Efter transformation', 'After transformation', { no: 'Etter transformasjon', dk: 'Efter transformation' })} className="w-full h-full object-cover object-top" />
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
  const [showSpotsDialog, setShowSpotsDialog] = useState(false);

  return (
    <div className="overflow-hidden relative">
      <GrainOverlay />
      <HeroBackground />

      {/* Hero Content */}
      <section className="min-h-[60vh] flex items-center relative overflow-hidden pt-24">
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-20" />
        <div className="container-narrow text-center relative z-10 section-padding py-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="pb-6"
          >
            <span className="font-heading font-light text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter">
              <AnimatedText text="Nomia" delay={0.2} stagger={0.06} />
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.3, ease: 'easeOut' }}
                className="text-accent inline-block"
              >.</motion.span>
            </span>
          </motion.div>

          {/* Sale Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5, ease: 'easeOut' }}
            className="flex flex-wrap items-center justify-center gap-3 mb-8"
          >
            <div className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-accent/15 border border-accent/40 shadow-lg shadow-accent/15 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-sm shadow-accent/50" />
              <span className="text-sm font-bold tracking-[0.15em] uppercase text-accent">
                {t('25% rabatt', '25% off', { no: '25% rabatt', dk: '25% rabat' })}
              </span>
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6, ease: 'easeOut' }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extralight leading-[1.1] tracking-tight max-w-3xl mx-auto mb-4"
          >
            <span className="text-reveal-gradient">{t('Webbsidor som säljer.', 'Websites that sell.', { no: 'Nettsider som selger.', dk: 'Hjemmesider der sælger.' })}</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5, ease: 'easeOut' }}
            className="text-xl sm:text-2xl text-muted-foreground max-w-xl mx-auto"
          >
            {t('Få ett designkoncept gratis — klart inom 72 timmar.', 'Get a free design concept in 72 hours.', { no: 'Få et gratis designkonsept — klart innen 72 timer.', dk: 'Få et gratis designkoncept — klar inden 72 timer.' })}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.5, ease: 'easeOut' }}
            className="mt-10 flex flex-col items-center gap-3"
          >
            <Button 
              asChild 
              size="lg" 
              className="group h-14 px-10 text-base font-semibold bg-accent text-accent-foreground hover:bg-accent/90 shadow-xl shadow-accent/30 border-0"
              onClick={() => {
                import('@/lib/posthog').then(({ trackEvent, getUtmParams }) => {
                  trackEvent('cta_click', { button: 'hero_order_standard', page: 'index', ...getUtmParams() });
                });
              }}
            >
              <Link to="/bestall?package=standard">
                <span className="flex flex-col items-center leading-tight">
                  <span>{t('Beställ Standard', 'Order Standard', { no: 'Bestill Standard', dk: 'Bestil Standard' })}</span>
                  <span className="text-xs opacity-80 font-normal">{t('5 sidor · Mest populär', '5 pages · Most popular', { no: '5 sider · Mest populær', dk: '5 sider · Mest populær' })}</span>
                </span>
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="ghost"
              className="group h-12 px-8 text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => {
                import('@/lib/posthog').then(({ trackEvent, getUtmParams }) => {
                  trackEvent('cta_click', { button: 'hero_get_concept', page: 'index', ...getUtmParams() });
                });
              }}
            >
              <Link to="/demo">
                {t('Eller få gratis koncept först', 'Or get free concept first', { no: 'Eller få gratis konsept først', dk: 'Eller få gratis koncept først' })}
                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>

          {/* Spots indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.5 }}
            className="mt-8 flex flex-col items-center gap-3"
          >
            <Dialog open={showSpotsDialog} onOpenChange={setShowSpotsDialog}>
              <DialogTrigger asChild>
                <button className="group flex items-center gap-3 px-6 py-3 rounded-full bg-accent/10 border border-accent/30 hover:bg-accent/20 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 cursor-pointer">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-accent" />
                  </span>
                  <span className="text-sm font-semibold text-accent">
                    {spotsLoading ? (
                      t('Laddar...', 'Loading...', { no: 'Laster...', dk: 'Indlæser...' })
                    ) : remainingSpots > 0 ? (
                      `${remainingSpots} ${remainingSpots === 1 ? t('plats kvar denna vecka', 'spot left this week', { no: 'plass igjen denne uken', dk: 'plads tilbage denne uge' }) : t('platser kvar denna vecka', 'spots left this week', { no: 'plasser igjen denne uken', dk: 'pladser tilbage denne uge' })}`
                    ) : (
                      t('Fullbokat denna vecka', 'Fully booked this week', { no: 'Fullbooket denne uken', dk: 'Fuldt booket denne uge' })
                    )}
                  </span>
                  <ArrowRight className="w-4 h-4 text-accent transition-transform duration-300 group-hover:translate-x-0.5" />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-accent">
                    <Calendar className="w-5 h-5" />
                    {t('Veckans platser', 'Weekly Spots', { no: 'Ukens plasser', dk: 'Ugens pladser' })}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <p className="text-muted-foreground">
                    {t(
                      'Vi tar endast emot 7 nya koncept per vecka för att säkerställa högsta kvalitet på varje design.',
                      'We only accept 7 new concepts per week to ensure the highest quality for each design.',
                      { no: 'Vi tar kun imot 7 nye konsepter per uke for å sikre høyeste kvalitet på hvert design.', dk: 'Vi tager kun imod 7 nye koncepter per uge for at sikre højeste kvalitet på hvert design.' }
                    )}
                  </p>
                  <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                    <div className="text-center mb-4">
                      <span className="text-4xl font-bold text-accent">{remainingSpots}</span>
                      <span className="text-lg text-muted-foreground ml-2">{remainingSpots === 1 ? t('plats kvar', 'spot left', { no: 'plass igjen', dk: 'plads tilbage' }) : t('platser kvar', 'spots left', { no: 'plasser igjen', dk: 'pladser tilbage' })}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      {[...Array(7)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-6 h-6 rounded-full border-2 border-background transition-colors ${
                            i < (7 - remainingSpots) ? 'bg-muted-foreground/40' : 'bg-accent'
                          }`} 
                        />
                      ))}
                    </div>
                    <p className="text-center text-xs text-muted-foreground mt-3">
                      {7 - remainingSpots}/7 {t('bokade denna vecka', 'booked this week', { no: 'booket denne uken', dk: 'booket denne uge' })}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t(
                      'Platserna återställs varje måndag. Boka din plats nu för att garantera leverans.',
                      'Spots reset every Monday. Book your spot now to guarantee delivery.',
                      { no: 'Plassene tilbakestilles hver mandag. Book din plass nå for å garantere levering.', dk: 'Pladserne nulstilles hver mandag. Book din plads nu for at garantere levering.' }
                    )}
                  </p>
                </div>
              </DialogContent>
            </Dialog>

            <Link to="/efter-demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t('Har du fått ditt koncept?', 'Have you received your concept?', { no: 'Har du fått konseptet ditt?', dk: 'Har du fået dit koncept?' })}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadges />

      {/* 2. THE SOLUTION - Before/After Transformation */}
      <BeforeAfterSection t={t} beforeImg={beforeSwedenCarImg} afterImg={afterSwedenCarImg} />

      {/* 4. HOW IT WORKS */}
      <ParallaxSection speed={0.3} floatingElements accentGlow>
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background pointer-events-none" />
          
          <div className="container-wide section-padding relative">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                {t('Snabb & enkel process', 'Fast & simple process', { no: 'Rask & enkel prosess', dk: 'Hurtig & enkel proces' })}
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light mb-4 tracking-tight">
                {t('Så här fungerar det', 'How it works', { no: 'Slik fungerer det', dk: 'Sådan fungerer det' })}
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                {t('Från idé till färdig webbplats på några dagar.', 'From idea to finished website in just days.', { no: 'Fra idé til ferdig nettside på noen dager.', dk: 'Fra idé til færdig hjemmeside på få dage.' })}
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
              {[
                { num: '01', title: t('Beskriv', 'Describe', { no: 'Beskriv', dk: 'Beskriv' }), desc: t('Berätta om ditt företag', 'Tell us about your business', { no: 'Fortell oss om bedriften din', dk: 'Fortæl os om din virksomhed' }), icon: FileText },
                { num: '02', title: t('Granska', 'Review', { no: 'Gjennomgå', dk: 'Gennemgå' }), desc: t('Få ditt koncept inom 72h', 'Get your concept within 72h', { no: 'Få konseptet ditt innen 72t', dk: 'Få dit koncept inden 72t' }), icon: Eye, counterValue: 72 },
                { num: '03', title: t('Finjustera', 'Refine', { no: 'Finjuster', dk: 'Finjuster' }), desc: t('Vi anpassar efter dina önskemål', 'We adapt to your wishes', { no: 'Vi tilpasser etter dine ønsker', dk: 'Vi tilpasser efter dine ønsker' }), icon: Sparkles, counterValue: null },
                { num: '04', title: t('Lansera', 'Launch', { no: 'Lanser', dk: 'Lancér' }), desc: t('Din webbplats är live!', 'Your website is live!', { no: 'Nettsiden din er live!', dk: 'Din hjemmeside er live!' }), icon: CheckCircle2 },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="p-5 sm:p-6 rounded-xl border border-accent/30 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent hover:border-accent/50 transition-colors duration-300 h-full glass-premium">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-accent font-bold text-lg">{step.num}</span>
                      <step.icon className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="font-semibold text-base mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center"
            >
              <Button asChild className="group bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to="/hur-det-fungerar">
                  {t('Läs mer om processen', 'Learn more about the process', { no: 'Les mer om prosessen', dk: 'Læs mere om processen' })}
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </ParallaxSection>

      {/* 5. PROOF - Portfolio Showcase */}
      <ParallaxSection speed={0.4} scaleOnView>
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/15 to-background pointer-events-none" />
          
          <div className="container-wide section-padding">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-16 gap-4"
            >
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight">{t('Våra projekt', 'Our Work', { no: 'Våre prosjekter', dk: 'Vores projekter' })}</h2>
                <p className="text-muted-foreground mt-3 text-lg">{t('Riktiga resultat för riktiga företag', 'Real results for real businesses', { no: 'Ekte resultater for ekte bedrifter', dk: 'Ægte resultater for ægte virksomheder' })}</p>
              </div>
              <Button asChild variant="outline" className="group hidden sm:flex">
                <Link to="/portfolio">
                  {t('Se alla projekt', 'View all projects', { no: 'Se alle prosjekter', dk: 'Se alle projekter' })}
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { name: "Gail's Hair", type: t('Frisörsalong', 'Hair Salon', { no: 'Frisørsalong', dk: 'Frisørsalon' }), stat: '+89%', statLabel: t('bokningar', 'bookings', { no: 'bestillinger', dk: 'bookinger' }), url: 'https://gailshairgallery.lovable.app/book', image: gailsHairImg },
                { name: 'Oh My Coffee', type: t('Café & Restaurang', 'Café & Restaurant', { no: 'Kafé & Restaurang', dk: 'Café & Restaurant' }), stat: null, url: 'https://ohmycoffee-gbg-web.lovable.app/', image: ohMyCoffeeImg },
                { name: 'Bamba', type: t('Restaurang', 'Restaurant'), stat: '+177%', statLabel: t('bokningar/vecka', 'bookings/week', { no: 'bestillinger/uke', dk: 'bookinger/uge' }), url: 'https://bamba.lovable.app/', image: bambaImg },
                { name: 'En Deli Haga', type: t('Delikatess & Café', 'Deli & Café'), stat: null, url: 'https://en-deli-cozy-vibes.lovable.app/', image: enDeliHagaImg },
              ].map((project, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group"
                >
                  <TiltCard>
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border/50 hover:border-accent/50 transition-all duration-500 block shadow-lg hover:shadow-xl hover:shadow-accent/20 spotlight">
                      {project.stat && (
                        <div className="absolute top-3 right-3 z-10 bg-accent text-accent-foreground px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animated-border">
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
                  </TiltCard>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-10 text-center sm:hidden">
              <Button asChild variant="outline" className="group">
                <Link to="/portfolio">
                  {t('Se alla projekt', 'View all projects', { no: 'Se alle prosjekter', dk: 'Se alle projekter' })}
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </ParallaxSection>

      {/* ROI CALCULATOR */}
      <ParallaxSection speed={0.2} accentGlow>
        <section className="py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-destructive/5 to-background pointer-events-none" />
          
          <div className="container-narrow section-padding relative">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive text-sm font-medium mb-6">
                <TrendingDown className="w-4 h-4" />
                {t('Varje dag utan hemsida kostar dig', 'Every day without a website costs you', { no: 'Hver dag uten nettside koster deg', dk: 'Hver dag uden hjemmeside koster dig' })}
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light mb-6 tracking-tight">
                {t('Hur mycket intäkter förlorar du?', 'How much revenue are you losing?', { no: 'Hvor mye inntekter taper du?', dk: 'Hvor mange indtægter taber du?' })}
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
                {t('En föråldrad eller saknad webbplats kostar mer än du tror.', 'An outdated or missing website costs more than you think.', { no: 'En utdatert eller manglende nettside koster mer enn du tror.', dk: 'En forældet eller manglende hjemmeside koster mere end du tror.' })}
              </p>
              
              <ROICalculator />
            </motion.div>
          </div>
        </section>
      </ParallaxSection>

      {/* 6. SOCIAL PROOF */}
      <TestimonialsCarousel />

      {/* WHAT YOU GET */}
      <ParallaxSection speed={0.35} floatingElements skewOnScroll>
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background pointer-events-none" />
          <div className="container-wide section-padding relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light mb-4 tracking-tight">
                {t('Vad ingår i din webbplats', 'What\'s included in your website', { no: 'Hva er inkludert i nettsiden din', dk: 'Hvad er inkluderet i din hjemmeside' })}
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                {t('En komplett lösning redo att ta emot kunder från dag ett.', 'A complete solution ready to receive customers from day one.', { no: 'En komplett løsning klar til å ta imot kunder fra dag én.', dk: 'En komplet løsning klar til at modtage kunder fra dag ét.' })}
              </p>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                { title: t('Responsiv design', 'Responsive design', { no: 'Responsivt design', dk: 'Responsivt design' }), desc: t('Ser perfekt ut på mobil, surfplatta och dator.', 'Looks perfect on mobile, tablet, and desktop.', { no: 'Ser perfekt ut på mobil, nettbrett og PC.', dk: 'Ser perfekt ud på mobil, tablet og computer.' }) },
                { title: t('Snabb leverans', 'Fast delivery', { no: 'Rask levering', dk: 'Hurtig levering' }), desc: t('7-14 dagars leverans beroende på paket.', '7-14 day delivery depending on package.', { no: '7-14 dagers levering avhengig av pakke.', dk: '7-14 dages levering afhængigt af pakke.' }) },
                { title: t('SEO-optimerad', 'SEO optimized', { no: 'SEO-optimalisert', dk: 'SEO-optimeret' }), desc: t('Grundläggande sökmotoroptimering för bättre synlighet.', 'Basic search engine optimization for better visibility.', { no: 'Grunnleggende søkemotoroptimalisering for bedre synlighet.', dk: 'Grundlæggende søgemaskineoptimering for bedre synlighed.' }) },
                { title: t('Kontaktformulär', 'Contact form', { no: 'Kontaktskjema', dk: 'Kontaktformular' }), desc: t('Få leads direkt till din inbox.', 'Get leads directly to your inbox.', { no: 'Få leads direkte til innboksen din.', dk: 'Få leads direkte til din indbakke.' }) },
                { title: t('Revisioner ingår', 'Revisions included', { no: 'Revisjoner inkludert', dk: 'Revisioner inkluderet' }), desc: t('1-3 revideringsrundor beroende på paket.', '1-3 revision rounds depending on package.', { no: '1-3 revisjonsrunder avhengig av pakke.', dk: '1-3 revisionsrunder afhængigt af pakke.' }) },
                { title: t('Fast pris', 'Fixed price', { no: 'Fastpris', dk: 'Fast pris' }), desc: t('Inga dolda kostnader eller överraskningar.', 'No hidden costs or surprises.', { no: 'Ingen skjulte kostnader eller overraskelser.', dk: 'Ingen skjulte omkostninger eller overraskelser.' }) },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  className="group"
                >
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="w-full text-left">
                        <div className="p-5 rounded-xl border border-border/50 bg-secondary/30 hover:border-accent/30 hover:bg-accent/5 transition-all duration-300 h-full glass-premium spotlight cursor-pointer">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="font-medium text-base">{item.title}</h3>
                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                              <Info className="w-3 h-3" />
                            </div>
                          </div>
                        </div>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent side="top" className="text-sm max-w-[200px]">
                      {item.desc}
                    </PopoverContent>
                  </Popover>
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
                  {t('Se alla paket och priser', 'See all packages and prices', { no: 'Se alle pakker og priser', dk: 'Se alle pakker og priser' })}
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </ParallaxSection>

      {/* FAQ */}
      <ParallaxSection speed={0.25}>
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background pointer-events-none" />
          <div className="container-narrow section-padding">
            <div className="flex items-center justify-between mb-12 animate-fade-in">
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight">FAQ</h2>
              <Button asChild variant="ghost" className="group">
                <Link to="/faq">
                  {t('Se alla', 'View all', { no: 'Se alle', dk: 'Se alle' })}
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>

            <div className="space-y-4">
              {[
                { q: t('Är konceptet verkligen gratis?', 'Is the concept really free?', { no: 'Er konseptet virkelig gratis?', dk: 'Er konceptet virkelig gratis?' }), a: t('Ja! Du betalar endast €50 i verifieringsavgift som dras av från priset om du fortsätter, eller återbetalas helt om du tackar nej.', 'Yes! You only pay a €50 verification fee that\'s deducted from the price if you continue, or fully refunded if you decline.', { no: 'Ja! Du betaler kun en verifikasjonsavgift på €50 som trekkes fra prisen hvis du fortsetter, eller refunderes fullt ut hvis du takker nei.', dk: 'Ja! Du betaler kun et bekræftelsesgebyr på €50 som trækkes fra prisen hvis du fortsætter, eller refunderes fuldt ud hvis du takker nej.' }) },
                { q: t('Hur lång tid tar leveransen?', 'How long does delivery take?', { no: 'Hvor lang tid tar leveringen?', dk: 'Hvor lang tid tager leveringen?' }), a: t('Beroende på paket: Starter 14 dagar, Standard 10 dagar, Pro 7 dagar. Koncept levereras inom 72h.', 'Depending on package: Starter 14 days, Standard 10 days, Pro 7 days. Concepts delivered within 72h.', { no: 'Avhengig av pakke: Starter 14 dager, Standard 10 dager, Pro 7 dager. Konsepter leveres innen 72t.', dk: 'Afhængigt af pakke: Starter 14 dage, Standard 10 dage, Pro 7 dage. Koncepter leveres inden 72t.' }) },
                { q: t('Erbjuder ni Klarna?', 'Do you offer Klarna?', { no: 'Tilbyr dere Klarna?', dk: 'Tilbyder I Klarna?' }), a: t('Ja! Delbetala med Klarna – betala senare eller dela upp i 3 delbetalningar.', 'Yes! Pay in installments with Klarna – pay later or split into 3 payments.', { no: 'Ja! Delbetal med Klarna – betal senere eller del opp i 3 delbetalinger.', dk: 'Ja! Delbetal med Klarna – betal senere eller del op i 3 delbetalinger.' }) },
              ].map((faq, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 rounded-xl border border-border/50 hover:border-accent/30 hover:bg-accent/5 transition-all duration-300 glass-premium"
                >
                  <h4 className="font-heading font-medium text-lg mb-2">{faq.q}</h4>
                  <p className="text-muted-foreground">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </ParallaxSection>

      {/* FINAL CTA */}
      <ParallaxSection speed={0.3} accentGlow rotate3D>
        <section className="py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background pointer-events-none" />
          
          <div className="container-wide section-padding relative">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light mb-4 tracking-tight">
                {t('Välj din väg', 'Choose your path', { no: 'Velg din vei', dk: 'Vælg din vej' })}
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                {t('Två sätt att komma igång – välj det som passar dig bäst.', 'Two ways to get started – choose what suits you best.', { no: 'To måter å komme i gang – velg det som passer deg best.', dk: 'To måder at komme i gang – vælg det der passer dig bedst.' })}
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Free Concept Path */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <TiltCard className="h-full">
                  <div className="relative p-8 rounded-2xl border border-border/50 bg-background/80 backdrop-blur-sm hover:border-accent/30 transition-all duration-300 h-full glass-premium spotlight">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20 shrink-0">
                        <Sparkles className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{t('Gratis koncept', 'Free Concept', { no: 'Gratis konsept', dk: 'Gratis koncept' })}</h3>
                        <p className="text-muted-foreground text-sm">{t('Se din framtida webbplats innan du bestämmer dig.', 'See your future website before you decide.', { no: 'Se din fremtidige nettside før du bestemmer deg.', dk: 'Se din fremtidige hjemmeside før du beslutter dig.' })}</p>
                      </div>
                    </div>
                    <div className="space-y-4 mb-8">
                      {[
                        t('Berätta om ditt företag och välj stil', 'Tell us about your business and choose style', { no: 'Fortell om bedriften din og velg stil', dk: 'Fortæl om din virksomhed og vælg stil' }),
                        t('Betala €50 verifieringsavgift (återbetalbar)', 'Pay €50 verification fee (refundable)', { no: 'Betal €50 verifikasjonsavgift (refunderbar)', dk: 'Betal €50 bekræftelsesgebyr (refunderbart)' }),
                        t('Få ett custom koncept inom 72h', 'Get a custom concept within 72h', { no: 'Få et skreddersydd konsept innen 72t', dk: 'Få et skræddersyet koncept inden 72t' }),
                        t('Gillar du det? Avgiften dras från priset. Gillar inte? Full återbetalning.', 'Like it? Fee deducted from price. Don\'t like it? Full refund.', { no: 'Liker du det? Avgiften trekkes fra prisen. Liker ikke? Full refusjon.', dk: 'Kan du lide det? Gebyret trækkes fra prisen. Kan du ikke lide det? Fuld refundering.' }),
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
                        {t('Få gratis koncept', 'Get free concept', { no: 'Få gratis konsept', dk: 'Få gratis koncept' })}
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </TiltCard>
              </motion.div>

              {/* Direct Order Path */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <TiltCard className="h-full">
                  <div className="relative p-8 rounded-2xl border border-border/50 bg-background/80 backdrop-blur-sm hover:border-accent/30 transition-all duration-300 h-full glass-premium spotlight">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20 shrink-0">
                        <Zap className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{t('Direktbeställning', 'Direct Order', { no: 'Direkte bestilling', dk: 'Direkte bestilling' })}</h3>
                        <p className="text-muted-foreground text-sm">{t('Vet du redan vad du vill ha? Hoppa direkt till beställning.', 'Already know what you want? Skip straight to ordering.', { no: 'Vet du allerede hva du vil ha? Hopp rett til bestilling.', dk: 'Ved du allerede hvad du vil have? Spring direkte til bestilling.' })}</p>
                      </div>
                    </div>
                    <div className="space-y-4 mb-8">
                      {[
                        t('Välj paket och anpassa din beställning', 'Choose package and customize your order', { no: 'Velg pakke og tilpass bestillingen din', dk: 'Vælg pakke og tilpas din bestilling' }),
                        t('Ladda upp material och beskriv dina önskemål', 'Upload materials and describe your wishes', { no: 'Last opp materialer og beskriv dine ønsker', dk: 'Upload materialer og beskriv dine ønsker' }),
                        t('Betala och vi börjar bygga direkt', 'Pay and we start building immediately', { no: 'Betal og vi begynner å bygge med en gang', dk: 'Betal og vi begynder at bygge med det samme' }),
                        t('Din webbplats levererad inom 7-14 dagar', 'Your website delivered within 7-14 days', { no: 'Nettsiden din levert innen 7-14 dager', dk: 'Din hjemmeside leveret inden 7-14 dage' }),
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
                        {t('Beställ direkt', 'Order directly', { no: 'Bestill direkte', dk: 'Bestil direkte' })}
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </TiltCard>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="text-center mt-10"
            >
              <Link 
                to="/efter-demo" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
              >
                {t('Har du redan fått ditt koncept?', 'Already received your concept?', { no: 'Har du allerede fått konseptet ditt?', dk: 'Har du allerede fået dit koncept?' })}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>
      </ParallaxSection>
    </div>
  );
}
