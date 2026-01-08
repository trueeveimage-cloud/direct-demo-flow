import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, ExternalLink, Clock, Zap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { AnimatedSection } from '@/components/AnimatedSection';

const caseStudies = {
  'salong-nova': {
    name: { sv: 'Salong Nova', en: 'Salon Nova' },
    type: { sv: 'Frisörsalong', en: 'Hair Salon' },
    description: {
      sv: 'Modern webbplats med online-bokning och prislista.',
      en: 'Modern website with online booking and price list.'
    },
    challenge: {
      sv: 'Salong Nova hade en föråldrad webbplats som inte fungerade på mobiler. Kunderna klagade på att de inte kunde boka tider online.',
      en: 'Salon Nova had an outdated website that didn\'t work on mobile. Customers complained about not being able to book appointments online.'
    },
    solution: {
      sv: 'Vi skapade en modern, mobil-först webbplats med integrerad bokning via Bokadirekt. Ny prislista och galleri med bilder på salongen.',
      en: 'We created a modern, mobile-first website with integrated booking via Bokadirekt. New price list and gallery with salon photos.'
    },
    results: [
      { sv: '40% fler bokningar första månaden', en: '40% more bookings first month' },
      { sv: '60% av besökarna från mobil', en: '60% of visitors from mobile' },
      { sv: '5-stjärnigt betyg på Google', en: '5-star Google rating' }
    ],
    tags: ['Responsive', 'Booking', 'SEO'],
    timeline: { sv: '5 dagar', en: '5 days' }
  },
  'cafe-luna': {
    name: { sv: 'Café Luna', en: 'Café Luna' },
    type: { sv: 'Café & Bageri', en: 'Café & Bakery' },
    description: {
      sv: 'Stilren design med meny och öppettider.',
      en: 'Clean design with menu and opening hours.'
    },
    challenge: {
      sv: 'Café Luna hade ingen webbplats alls och förlorade kunder till konkurrenter som syntes online.',
      en: 'Café Luna had no website at all and was losing customers to competitors visible online.'
    },
    solution: {
      sv: 'Vi byggde en varm, inbjudande webbplats som speglar cafeets atmosfär. Instagram-integration och lätt uppdaterbar meny.',
      en: 'We built a warm, inviting website that reflects the café\'s atmosphere. Instagram integration and easily updatable menu.'
    },
    results: [
      { sv: '200+ nya följare på Instagram', en: '200+ new Instagram followers' },
      { sv: 'Syns på första sidan i Google lokalt', en: 'Visible on first page of local Google' },
      { sv: '25% ökning i lunch-gäster', en: '25% increase in lunch guests' }
    ],
    tags: ['Menu', 'Instagram', 'Map'],
    timeline: { sv: '4 dagar', en: '4 days' }
  },
  'rormokare-svensson': {
    name: { sv: 'Rörmokare Svensson', en: 'Svensson Plumbing' },
    type: { sv: 'Rörmokare', en: 'Plumber' },
    description: {
      sv: 'Snabb laddning, tydliga tjänster och kontaktformulär.',
      en: 'Fast loading, clear services, and contact form.'
    },
    challenge: {
      sv: 'Företaget förlitade sig enbart på mun-till-mun och ville nå fler kunder i närområdet.',
      en: 'The business relied solely on word-of-mouth and wanted to reach more local customers.'
    },
    solution: {
      sv: 'Professionell webbplats med tydliga tjänster, priser och snabbt kontaktformulär. SEO-optimerad för lokala sökningar.',
      en: 'Professional website with clear services, prices, and quick contact form. SEO-optimized for local searches.'
    },
    results: [
      { sv: '10+ förfrågningar per vecka via webbplatsen', en: '10+ inquiries per week via website' },
      { sv: 'Laddningstid under 2 sekunder', en: 'Load time under 2 seconds' },
      { sv: 'Rankar #1 för "rörmokare Göteborg"', en: 'Ranks #1 for "plumber Gothenburg"' }
    ],
    tags: ['Fast', 'Services', 'Contact'],
    timeline: { sv: '3 dagar', en: '3 days' }
  },
  'iron-fitness': {
    name: { sv: 'Iron Fitness', en: 'Iron Fitness' },
    type: { sv: 'Gym', en: 'Gym' },
    description: {
      sv: 'Energisk design med schema och medlemskap-info.',
      en: 'Energetic design with schedule and membership info.'
    },
    challenge: {
      sv: 'Gymmet hade en rörig webbplats där det var svårt att hitta schemat och priser.',
      en: 'The gym had a cluttered website where it was hard to find the schedule and prices.'
    },
    solution: {
      sv: 'Ren, energisk design med tydligt schema, medlemskapsalternativ och enkel registrering.',
      en: 'Clean, energetic design with clear schedule, membership options, and easy sign-up.'
    },
    results: [
      { sv: '50% fler medlemsansökningar online', en: '50% more membership applications online' },
      { sv: '80% minskning i samtal om schema', en: '80% reduction in schedule-related calls' },
      { sv: 'Mobilvänlig schema-vy', en: 'Mobile-friendly schedule view' }
    ],
    tags: ['Schedule', 'Membership', 'Prices'],
    timeline: { sv: '6 dagar', en: '6 days' }
  },
  'vardcentralen-plus': {
    name: { sv: 'Vårdcentralen Plus', en: 'HealthCare Plus' },
    type: { sv: 'Klinik', en: 'Clinic' },
    description: {
      sv: 'Professionell design med tjänster och tidsbokning.',
      en: 'Professional design with services and appointment booking.'
    },
    challenge: {
      sv: 'Kliniken behövde en professionell, tillgänglig webbplats som följer tillgänglighetsstandarder.',
      en: 'The clinic needed a professional, accessible website following accessibility standards.'
    },
    solution: {
      sv: 'Tillgänglig webbplats med tydlig navigation, stor text och integrerad tidsbokning.',
      en: 'Accessible website with clear navigation, large text, and integrated appointment booking.'
    },
    results: [
      { sv: 'WCAG 2.1 AA-kompatibel', en: 'WCAG 2.1 AA compliant' },
      { sv: '30% fler online-bokningar', en: '30% more online bookings' },
      { sv: 'Positiv feedback från äldre patienter', en: 'Positive feedback from elderly patients' }
    ],
    tags: ['Professional', 'Booking', 'Accessible'],
    timeline: { sv: '7 dagar', en: '7 days' }
  },
  'hem-tradgard': {
    name: { sv: 'Butiken Hem & Trädgård', en: 'Home & Garden Store' },
    type: { sv: 'Butik', en: 'Retail' },
    description: {
      sv: 'Produktvisning med öppettider och hitta oss-karta.',
      en: 'Product showcase with opening hours and find us map.'
    },
    challenge: {
      sv: 'Butiken ville visa sitt sortiment online utan att sälja direkt via webben.',
      en: 'The store wanted to showcase their products online without selling directly on the web.'
    },
    solution: {
      sv: 'Visuell produktkatalog, säsongserbjudanden och tydlig karta till butiken.',
      en: 'Visual product catalog, seasonal offers, and clear map to the store.'
    },
    results: [
      { sv: '35% ökning i butiksbesök', en: '35% increase in store visits' },
      { sv: 'Kunder kommer förberedda på vad de vill köpa', en: 'Customers arrive knowing what they want' },
      { sv: 'Effektiv säsongsmarknadsföring', en: 'Effective seasonal marketing' }
    ],
    tags: ['Products', 'Store', 'Map'],
    timeline: { sv: '5 dagar', en: '5 days' }
  }
};

export default function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useLanguage();
  
  const caseStudy = slug ? caseStudies[slug as keyof typeof caseStudies] : null;

  if (!caseStudy) {
    return (
      <div className="section-padding py-20">
        <div className="container-narrow text-center">
          <h1 className="text-2xl font-bold mb-4">
            {t('Projektet hittades inte', 'Project not found')}
          </h1>
          <Button asChild>
            <Link to="/portfolio">
              <ArrowLeft className="w-4 h-4" />
              {t('Tillbaka till portfolio', 'Back to portfolio')}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const caseStudyKeys = Object.keys(caseStudies);
  const currentIndex = caseStudyKeys.indexOf(slug || '');
  const nextSlug = caseStudyKeys[(currentIndex + 1) % caseStudyKeys.length];
  const nextCase = caseStudies[nextSlug as keyof typeof caseStudies];

  return (
    <div className="section-padding py-20">
      <div className="container-narrow">
        {/* Back link */}
        <AnimatedSection animation="fade-up">
          <Link 
            to="/portfolio" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('Tillbaka till portfolio', 'Back to portfolio')}
          </Link>
        </AnimatedSection>

        {/* Header */}
        <AnimatedSection animation="fade-up" delay={50}>
          <div className="mb-8">
            <span className="text-sm text-accent font-medium">{t(caseStudy.type.sv, caseStudy.type.en)}</span>
            <h1 className="text-3xl sm:text-4xl font-bold mt-1 mb-4">
              {t(caseStudy.name.sv, caseStudy.name.en)}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t(caseStudy.description.sv, caseStudy.description.en)}
            </p>
          </div>
        </AnimatedSection>

        {/* Preview placeholder */}
        <AnimatedSection animation="scale-in" delay={100}>
          <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center mb-12">
            <span className="text-muted-foreground">{t('Projektbild', 'Project image')}</span>
          </div>
        </AnimatedSection>

        {/* Stats */}
        <AnimatedSection animation="fade-up" delay={150}>
          <div className="grid grid-cols-3 gap-4 p-4 bg-secondary/50 rounded-lg mb-12">
            <div className="text-center">
              <Clock className="w-5 h-5 mx-auto text-accent mb-2" />
              <p className="text-sm text-muted-foreground">{t('Leveranstid', 'Delivery')}</p>
              <p className="font-semibold">{t(caseStudy.timeline.sv, caseStudy.timeline.en)}</p>
            </div>
            <div className="text-center">
              <Zap className="w-5 h-5 mx-auto text-accent mb-2" />
              <p className="text-sm text-muted-foreground">{t('Funktioner', 'Features')}</p>
              <p className="font-semibold">{caseStudy.tags.length}+</p>
            </div>
            <div className="text-center">
              <Users className="w-5 h-5 mx-auto text-accent mb-2" />
              <p className="text-sm text-muted-foreground">{t('Nöjd kund', 'Happy client')}</p>
              <p className="font-semibold">✓</p>
            </div>
          </div>
        </AnimatedSection>

        {/* Challenge */}
        <AnimatedSection animation="fade-up" delay={200}>
          <section className="mb-10">
            <h2 className="text-xl font-heading font-semibold mb-3">
              {t('Utmaningen', 'The Challenge')}
            </h2>
            <p className="text-muted-foreground">
              {t(caseStudy.challenge.sv, caseStudy.challenge.en)}
            </p>
          </section>
        </AnimatedSection>

        {/* Solution */}
        <AnimatedSection animation="fade-up" delay={250}>
          <section className="mb-10">
            <h2 className="text-xl font-heading font-semibold mb-3">
              {t('Lösningen', 'The Solution')}
            </h2>
            <p className="text-muted-foreground">
              {t(caseStudy.solution.sv, caseStudy.solution.en)}
            </p>
          </section>
        </AnimatedSection>

        {/* Results */}
        <AnimatedSection animation="fade-up" delay={300}>
          <section className="mb-10">
            <h2 className="text-xl font-heading font-semibold mb-4">
              {t('Resultat', 'Results')}
            </h2>
            <div className="space-y-3">
              {caseStudy.results.map((result, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-accent-soft rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span>{t(result.sv, result.en)}</span>
                </div>
              ))}
            </div>
          </section>
        </AnimatedSection>

        {/* Tags */}
        <AnimatedSection animation="fade-up" delay={350}>
          <div className="flex flex-wrap gap-2 mb-12">
            {caseStudy.tags.map((tag, i) => (
              <span key={i} className="text-sm px-3 py-1 bg-secondary rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection animation="fade-up" delay={400}>
          <div className="bg-accent-soft rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">
              {t('Vill du ha liknande resultat?', 'Want similar results?')}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t(
                'Få en gratis demo och se hur din webbplats kan se ut.',
                'Get a free demo and see what your website could look like.'
              )}
            </p>
            <Button asChild variant="outline" size="lg">
              <Link to="/demo">
                {t('Få en gratis demo', 'Get a free demo')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </AnimatedSection>

        {/* Next project */}
        <AnimatedSection animation="fade-up" delay={450}>
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-2">{t('Nästa projekt', 'Next project')}</p>
            <Link 
              to={`/portfolio/${nextSlug}`}
              className="group flex items-center justify-between p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
            >
              <div>
                <h3 className="font-heading font-semibold">{t(nextCase.name.sv, nextCase.name.en)}</h3>
                <p className="text-sm text-muted-foreground">{t(nextCase.type.sv, nextCase.type.en)}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
