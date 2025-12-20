import { Link } from 'react-router-dom';
import { ArrowRight, FileText, CreditCard, Zap, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { AnimatedSection } from '@/components/AnimatedSection';

export default function Index() {
  const { t } = useLanguage();

  return (
    <div>
      {/* Hero Section */}
      <section className="section-padding py-20 lg:py-32">
        <div className="container-narrow text-center">
          <AnimatedSection animation="fade-up" delay={0}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-soft text-accent text-sm font-medium mb-6">
              <Clock className="w-4 h-4" />
              {t('Begränsade platser per vecka', 'Limited spots per week')}
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={100}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-balance">
              {t(
                'Få en gratis webb-demo',
                'Get a free website demo'
              )}
              <br />
              <span className="text-muted-foreground">
                {t('(inom 72 timmar)', '(within 72 hours)')}
              </span>
            </h1>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={200}>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              {t(
                'Fyll i all info först. När allt är inskickat betalar du 500 kr verifiering. Gillar du inte demon → full återbetalning. Gillar du den → 500 kr dras av från slutpriset.',
                'Submit all info first. Once complete, pay 500 kr verification. Don\'t like the demo → full refund. Like it → 500 kr deducted from final price.'
              )}
            </p>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={300}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="group">
                <Link to="/demo">
                  {t('Få en gratis webb-demo', 'Get a free website demo')}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/priser">
                  {t('Se priser', 'See pricing')}
                </Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* 3-Step Process */}
      <section className="section-padding py-20 bg-secondary/50">
        <div className="container-wide">
          <AnimatedSection animation="fade-up">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
              {t('Så här fungerar det', 'How it works')}
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                step: '01',
                title: t('Fyll i all info', 'Submit full info'),
                desc: t(
                  'Berätta om ditt företag, ladda upp logotyp och beskriv vad du behöver.',
                  'Tell us about your business, upload logo, and describe your needs.'
                ),
              },
              {
                icon: CreditCard,
                step: '02',
                title: t('Betala 500 kr verifiering', 'Pay 500 kr verification'),
                desc: t(
                  'Återbetalas om du inte gillar demon. Dras av om du fortsätter.',
                  'Refundable if you don\'t like the demo. Deducted if you proceed.'
                ),
              },
              {
                icon: Zap,
                step: '03',
                title: t('Få din demo inom 72h', 'Receive demo in 72h'),
                desc: t(
                  'Granska demon och bestäm om du vill gå vidare.',
                  'Review the demo and decide if you want to proceed.'
                ),
              },
            ].map((item, index) => (
              <AnimatedSection key={index} animation="fade-up" delay={index * 150}>
                <div className="relative p-6 bg-background rounded-lg border border-border hover:border-accent hover:shadow-lg transition-all duration-300">
                  <span className="absolute -top-3 left-6 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded">
                    {item.step}
                  </span>
                  <item.icon className="w-8 h-8 text-accent mb-4" />
                  <h3 className="font-heading font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="section-padding py-20">
        <div className="container-narrow">
          <AnimatedSection animation="fade-up">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
              {t('Vad ingår i demon?', 'What\'s included in the demo?')}
            </h2>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto">
            {[
              t('Startsida + en undersida', 'Home page + one inner page'),
              t('Mobil-först design', 'Mobile-first layout'),
              t('Grundläggande varumärkesriktning', 'Basic branding/style direction'),
              t('1 revision inkluderad', '1 demo revision included'),
            ].map((item, index) => (
              <AnimatedSection key={index} animation="fade-left" delay={index * 100}>
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent-soft transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{item}</span>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="section-padding py-20 bg-secondary/50">
        <div className="container-narrow">
          <div className="grid md:grid-cols-2 gap-12">
            <AnimatedSection animation="fade-right">
              <div>
                <h3 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                  {t('Detta passar dig om...', 'This is for you if...')}
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="hover:text-foreground transition-colors">• {t('Du driver ett litet företag', 'You run a small business')}</li>
                  <li className="hover:text-foreground transition-colors">• {t('Du behöver en professionell webbplats snabbt', 'You need a professional website fast')}</li>
                  <li className="hover:text-foreground transition-colors">• {t('Du vill se innan du köper', 'You want to see before you buy')}</li>
                  <li className="hover:text-foreground transition-colors">• {t('Du värderar enkelhet och kvalitet', 'You value simplicity and quality')}</li>
                </ul>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="fade-left">
              <div>
                <h3 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full border-2 border-muted-foreground flex items-center justify-center text-xs">✕</span>
                  {t('Detta är inte för dig om...', 'This is not for you if...')}
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="hover:text-foreground transition-colors">• {t('Du behöver en komplex e-handelsplattform', 'You need a complex e-commerce platform')}</li>
                  <li className="hover:text-foreground transition-colors">• {t('Du inte kan samla ihop din info', 'You can\'t gather your info')}</li>
                  <li className="hover:text-foreground transition-colors">• {t('Du söker gratis arbete utan åtagande', 'You\'re looking for free work with no commitment')}</li>
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="section-padding py-20">
        <div className="container-wide">
          <AnimatedSection animation="fade-up">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold">Portfolio</h2>
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
              { name: t('Frisörsalong', 'Hair Salon'), type: t('Skönhet', 'Beauty') },
              { name: 'Café Luna', type: t('Restaurang', 'Restaurant') },
              { name: t('Rörmokare AB', 'Plumber Co'), type: t('Hantverk', 'Trade') },
            ].map((project, index) => (
              <AnimatedSection key={index} animation="scale-in" delay={index * 100}>
                <div className="group relative aspect-[4/3] bg-secondary rounded-lg overflow-hidden border border-border hover:border-accent transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-primary-foreground font-heading font-semibold">{project.name}</p>
                    <p className="text-primary-foreground/70 text-sm">{project.type}</p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    <span className="text-sm">{t('Projekt förhandsvisning', 'Project preview')}</span>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Monthly Care Plan Teaser */}
      <section className="section-padding py-20 bg-primary text-primary-foreground">
        <AnimatedSection animation="fade-up" className="container-narrow text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {t('Månatlig webbvård', 'Monthly Care Plan')}
          </h2>
          <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
            {t(
              'Hosting, uppdateringar, säkerhet och support. Från 399 kr/mån.',
              'Hosting, updates, security, and support. From 399 kr/month.'
            )}
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
      <section className="section-padding py-20">
        <div className="container-narrow">
          <AnimatedSection animation="fade-up">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold">
                {t('Vanliga frågor', 'FAQ')}
              </h2>
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
                q: t('Är demon verkligen gratis?', 'Is the demo really free?'),
                a: t(
                  'Ja. Du betalar 500 kr verifiering som återbetalas om du inte gillar demon.',
                  'Yes. You pay 500 kr verification which is refunded if you don\'t like the demo.'
                ),
              },
              {
                q: t('Varför behövs 500 kr verifiering?', 'Why the 500 kr verification fee?'),
                a: t(
                  'Det visar att du är seriös och filtrerar bort de som bara är nyfikna.',
                  'It shows you\'re serious and filters out tire-kickers.'
                ),
              },
            ].map((faq, index) => (
              <AnimatedSection key={index} animation="fade-up" delay={index * 100}>
                <div className="p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors">
                  <h4 className="font-heading font-semibold mb-2">{faq.q}</h4>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding py-20 bg-accent-soft">
        <AnimatedSection animation="scale-in" className="container-narrow text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {t('Redo att komma igång?', 'Ready to get started?')}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            {t(
              'Fyll i formuläret och få din demo inom 72 timmar.',
              'Fill out the form and get your demo within 72 hours.'
            )}
          </p>
          <Button asChild size="lg" className="group">
            <Link to="/demo">
              {t('Få en gratis webb-demo', 'Get a free website demo')}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            {t('Begränsade platser per vecka', 'Limited spots per week')}
          </p>
        </AnimatedSection>
      </section>
    </div>
  );
}
