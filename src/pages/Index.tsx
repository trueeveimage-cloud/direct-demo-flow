import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, Zap, CheckCircle2, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { AnimatedSection } from '@/components/AnimatedSection';
import { Testimonials } from '@/components/Testimonials';
import { TrustBadges } from '@/components/TrustBadges';

export default function Index() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden">
      {/* Hero Section - Full height, immersive */}
      <section className="min-h-[90vh] flex items-center relative overflow-hidden">
        {/* Animated parallax background */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-gradient-to-br from-accent/10 via-accent/5 to-transparent rounded-full blur-3xl"
            style={{ transform: 'translateY(calc(var(--scroll-y, 0) * 0.3))' }}
          />
          <div 
            className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-accent/8 via-transparent to-transparent rounded-full blur-3xl"
            style={{ transform: 'translateY(calc(var(--scroll-y, 0) * -0.2))' }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-gradient-radial from-accent/3 to-transparent rounded-full" />
        </div>
        
        <div className="container-narrow text-center relative z-10 section-padding py-20">
          <AnimatedSection animation="fade-up" delay={0}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-8 backdrop-blur-sm border border-accent/20">
              <Clock className="w-4 h-4" />
              {t('Begränsade platser', 'Limited spots')}
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={100}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
              {t('Webb-koncept', 'Website concept')}
              <br />
              <span className="text-accent">
                {t('på 72 timmar', 'in 72 hours')}
              </span>
            </h1>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={200}>
            <p className="mt-8 text-lg sm:text-xl text-muted-foreground max-w-lg mx-auto">
              {t(
                'Se din framtida webbplats innan du bestämmer dig.',
                'See your future website before you commit.'
              )}
            </p>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={300}>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="group h-14 px-8 text-base">
                <Link to="/demo">
                  {t('Få ditt koncept', 'Get your concept')}
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="h-14 px-8 text-base">
                <Link to="/efter-demo">
                  {t('Har du fått ditt koncept?', 'Have you received your concept?')}
                </Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-muted-foreground/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadges />

      {/* 3-Step Process - Staggered layout */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/30 to-transparent pointer-events-none" />
        
        <div className="container-wide section-padding relative">
          <AnimatedSection animation="fade-up">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-20">
              {t('Så här fungerar det', 'How it works')}
            </h2>
          </AnimatedSection>

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
              <AnimatedSection key={index} animation="fade-up" delay={index * 150}>
                <div 
                  className="relative group"
                  style={{ marginTop: index === 1 ? '2rem' : index === 2 ? '4rem' : '0' }}
                >
                  <div className="absolute -inset-4 bg-gradient-to-br from-accent/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative p-8 bg-background/50 backdrop-blur-sm rounded-xl border border-border/50 hover:border-accent/30 transition-all duration-500">
                    <span className="text-6xl font-bold text-accent/10 absolute top-4 right-4">
                      {item.step}
                    </span>
                    <item.icon className="w-10 h-10 text-accent mb-6" />
                    <h3 className="font-heading font-semibold text-xl mb-3">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get - Minimal list */}
      <section className="py-24">
        <div className="container-narrow section-padding">
          <AnimatedSection animation="fade-up">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
              {t('Vad ingår', 'What\'s included')}
            </h2>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 gap-6 max-w-xl mx-auto">
            {[
              t('Startsida + undersida', 'Home + inner page'),
              t('Mobil-först design', 'Mobile-first layout'),
              t('Varumärkesriktning', 'Brand direction'),
              t('1 revision', '1 revision'),
            ].map((item, index) => (
              <AnimatedSection key={index} animation="fade-left" delay={index * 100}>
                <div className="flex items-center gap-4 p-4 rounded-lg border border-border/50 hover:border-accent/30 hover:bg-accent/5 transition-all duration-300">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="font-medium">{item}</span>
                </div>
              </AnimatedSection>
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
            <AnimatedSection animation="fade-right">
              <div>
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
                    <li key={i} className="text-muted-foreground hover:text-foreground transition-colors pl-4 border-l-2 border-accent/30 hover:border-accent">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="fade-left">
              <div>
                <h3 className="font-heading font-semibold text-lg mb-6 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full border-2 border-muted-foreground flex items-center justify-center text-xs">✕</span>
                  {t('Inte för dig om...', 'Not for you if...')}
                </h3>
                <ul className="space-y-4">
                  {[
                    t('Du behöver komplex e-handel', 'You need complex e-commerce'),
                    t('Du söker gratis arbete', 'You\'re looking for free work'),
                  ].map((item, i) => (
                    <li key={i} className="text-muted-foreground hover:text-foreground transition-colors pl-4 border-l-2 border-border hover:border-muted-foreground">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Portfolio Preview - Full width, layered */}
      <section className="py-24 bg-secondary/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        
        <div className="container-wide section-padding">
          <AnimatedSection animation="fade-up">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold">Portfolio</h2>
              <Button asChild variant="ghost" className="group">
                <Link to="/portfolio">
                  {t('Se alla', 'View all')}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: t('Frisörsalong', 'Hair Salon'), type: t('Skönhet', 'Beauty'), slug: 'salong-nova' },
              { name: 'Café Luna', type: t('Restaurang', 'Restaurant'), slug: 'cafe-luna' },
              { name: t('Rörmokare AB', 'Plumber Co'), type: t('Hantverk', 'Trade'), slug: 'rormokare-svensson' },
            ].map((project, index) => (
              <AnimatedSection key={index} animation="scale-in" delay={index * 100}>
                <Link 
                  to={`/portfolio/${project.slug}`} 
                  className="group relative aspect-[4/3] bg-gradient-to-br from-secondary to-secondary/50 rounded-xl overflow-hidden border border-border/50 hover:border-accent/50 transition-all duration-500 block"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="text-primary-foreground font-heading font-semibold text-lg">{project.name}</p>
                    <p className="text-primary-foreground/70 text-sm">{project.type}</p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground group-hover:opacity-0 transition-opacity">
                    <span className="text-sm">{t('Förhandsvisning', 'Preview')}</span>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Monthly Care Teaser - Accent section */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl" />
        </div>
        
        <AnimatedSection animation="fade-up" className="container-narrow section-padding text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            {t('Månatlig webbvård', 'Monthly Care')}
          </h2>
          <p className="text-primary-foreground/80 mb-4 max-w-md mx-auto">
            {t(
              'Håll din webbplats snabb, uppdaterad och redigerbar.',
              'Keep your site fast, updated, and editable.'
            )}
          </p>
          <p className="text-primary-foreground/60 text-sm mb-8">
            {t('Avsluta när du vill.', 'Cancel anytime.')}
          </p>
          <Button asChild variant="secondary" className="group">
            <Link to="/priser">
              {t('Se vårdplaner', 'See care plans')}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </AnimatedSection>
      </section>

      {/* FAQ Preview */}
      <section className="py-24">
        <div className="container-narrow section-padding">
          <AnimatedSection animation="fade-up">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold">FAQ</h2>
              <Button asChild variant="ghost" className="group">
                <Link to="/faq">
                  {t('Se alla', 'View all')}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </AnimatedSection>

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
              <AnimatedSection key={index} animation="fade-up" delay={index * 100}>
                <div className="p-6 rounded-xl border border-border/50 hover:border-accent/30 hover:bg-accent/5 transition-all duration-300">
                  <h4 className="font-heading font-semibold text-lg mb-2">{faq.q}</h4>
                  <p className="text-muted-foreground">{faq.a}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Minimal */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />
        
        <AnimatedSection animation="scale-in" className="container-narrow section-padding text-center relative">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            {t('Få ditt koncept', 'Get your concept')}
          </h2>
          <p className="text-muted-foreground mb-10">
            {t('Inom 72 timmar.', 'Within 72 hours.')}
          </p>
          <Button asChild size="lg" className="group h-14 px-10 text-base">
            <Link to="/demo">
              {t('Börja här', 'Start here')}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </AnimatedSection>
      </section>
    </div>
  );
}
