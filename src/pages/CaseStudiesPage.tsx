import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { AnimatedSection } from '@/components/AnimatedSection';
import { SEOHead } from '@/components/SEOHead';
import { supabase } from '@/integrations/supabase/client';

interface Metric {
  label_sv: string;
  label_en: string;
  value: string;
}

interface CaseStudy {
  id: string;
  slug: string;
  client_name: string;
  industry: string;
  challenge_sv: string;
  challenge_en: string;
  solution_sv: string;
  solution_en: string;
  results_sv: string;
  results_en: string;
  metrics: Metric[] | null;
  before_image_url: string | null;
  after_image_url: string | null;
  website_url: string | null;
  testimonial_quote: string | null;
  testimonial_author: string | null;
}

export default function CaseStudiesPage() {
  const { t, lang } = useLanguage();
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchCaseStudies = async () => {
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (!error && data) {
        // Parse metrics from JSON safely
        const parsed = data.map(item => ({
          ...item,
          metrics: Array.isArray(item.metrics) ? (item.metrics as unknown as Metric[]) : null,
        }));
        setCaseStudies(parsed);
      }
      setIsLoading(false);
    };

    fetchCaseStudies();
  }, []);

  return (
    <>
      <SEOHead
        title={t('Kundcase | Nomia', 'Case Studies | Nomia')}
        description={t(
          'Se hur vi hjälpt företag att växa online med professionella hemsidor.',
          'See how we\'ve helped businesses grow online with professional websites.'
        )}
      />

      <div className="min-h-screen section-padding py-20">
        <div className="container-wide">
          {/* Header */}
          <AnimatedSection animation="fade-up" className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              {t('Kundcase', 'Case Studies')}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('Verkliga resultat för verkliga företag', 'Real results for real businesses')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t(
                'Upptäck hur våra kunder har transformerat sin online-närvaro och ökat sina intäkter.',
                'Discover how our clients have transformed their online presence and increased revenue.'
              )}
            </p>
          </AnimatedSection>

          {/* Loading state */}
          {isLoading && (
            <div className="text-center py-20">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          )}

          {/* Empty state */}
          {!isLoading && caseStudies.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-6">
                {t('Inga kundcase publicerade än.', 'No case studies published yet.')}
              </p>
              <Button asChild>
                <Link to="/portfolio">
                  {t('Se vår portfolio', 'View our portfolio')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          )}

          {/* Case studies grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {caseStudies.map((study, index) => (
              <AnimatedSection
                key={study.id}
                animation="fade-up"
                delay={index * 0.1}
              >
                <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
                  {/* Before/After images */}
                  {(study.before_image_url || study.after_image_url) && (
                    <div className="relative h-64 bg-secondary/50">
                      {study.after_image_url && (
                        <img
                          src={study.after_image_url}
                          alt={`${study.client_name} website`}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {study.before_image_url && study.after_image_url && (
                        <div className="absolute top-4 left-4">
                          <Badge variant="secondary">
                            {t('Efter', 'After')}
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}

                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {study.industry}
                        </Badge>
                        <h2 className="text-2xl font-bold">{study.client_name}</h2>
                      </div>
                      {study.website_url && (
                        <Button variant="ghost" size="icon" asChild>
                          <a href={study.website_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>

                    {/* Metrics */}
                    {study.metrics && study.metrics.length > 0 && (
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        {study.metrics.slice(0, 4).map((metric, i) => (
                          <div key={i} className="bg-secondary/50 rounded-lg p-3 text-center">
                            <p className="text-2xl font-bold text-accent">{metric.value}</p>
                            <p className="text-sm text-muted-foreground">
                              {lang === 'sv' ? metric.label_sv : metric.label_en}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Challenge & Solution */}
                    <div className="space-y-4 mb-6">
                      <div>
                        <h3 className="font-semibold mb-1">{t('Utmaning', 'Challenge')}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {lang === 'sv' ? study.challenge_sv : study.challenge_en}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{t('Resultat', 'Results')}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {lang === 'sv' ? study.results_sv : study.results_en}
                        </p>
                      </div>
                    </div>

                    {/* Testimonial */}
                    {study.testimonial_quote && (
                      <blockquote className="border-l-2 border-accent pl-4 italic text-muted-foreground">
                        "{study.testimonial_quote}"
                        {study.testimonial_author && (
                          <footer className="mt-2 text-sm not-italic font-medium">
                            — {study.testimonial_author}
                          </footer>
                        )}
                      </blockquote>
                    )}

                    <Button variant="outline" className="w-full mt-6" asChild>
                      <Link to={`/case/${study.slug}`}>
                        {t('Läs hela caset', 'Read full case study')}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>

          {/* CTA */}
          <AnimatedSection animation="fade-up" className="text-center mt-16">
            <div className="bg-secondary/50 rounded-2xl p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {t('Vill du bli vårt nästa kundcase?', 'Want to be our next case study?')}
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {t(
                  'Få ett gratis designkoncept och se hur vi kan hjälpa ditt företag att växa online.',
                  'Get a free design concept and see how we can help your business grow online.'
                )}
              </p>
              <Button asChild size="lg">
                <Link to="/gratis-demo">
                  {t('Få ditt gratis koncept', 'Get your free concept')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </>
  );
}
