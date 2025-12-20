import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, RefreshCcw, Globe, Shield, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { AnimatedSection } from '@/components/AnimatedSection';

export default function PostDemoPage() {
  const { t } = useLanguage();
  const [selectedOption, setSelectedOption] = useState<'proceed' | 'refund' | null>(null);

  if (selectedOption === 'proceed') {
    return (
      <div className="section-padding py-20">
        <div className="container-narrow">
          <AnimatedSection animation="scale-in" className="text-center">
            <div className="w-16 h-16 bg-accent-soft rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              {t('Fantastiskt val!', 'Great choice!')}
            </h1>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              {t(
                'Välj hur du vill gå vidare med din nya webbplats.',
                'Choose how you want to proceed with your new website.'
              )}
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <AnimatedSection animation="fade-up" delay={100}>
              <div className="p-6 bg-background border border-border rounded-lg hover:border-accent transition-colors h-full flex flex-col">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">
                  {t('Färdig webbplats', 'Complete Website')}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 flex-grow">
                  {t(
                    'Vi bygger färdigt din webbplats baserat på demon. 500 kr dras av från slutpriset.',
                    'We complete your website based on the demo. 500 kr deducted from final price.'
                  )}
                </p>
                <p className="text-2xl font-bold mb-4">{t('Från', 'From')} 4 500 kr</p>
                <Button asChild className="w-full">
                  <Link to="/kontakt">
                    {t('Kontakta oss', 'Contact us')}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={200}>
              <div className="p-6 bg-accent-soft border-2 border-accent rounded-lg h-full flex flex-col relative">
                <span className="absolute -top-3 left-4 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded">
                  {t('Populärast', 'Most popular')}
                </span>
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">
                  {t('Webbplats + Månatlig webbvård', 'Website + Monthly Care')}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 flex-grow">
                  {t(
                    'Komplett webbplats plus hosting, underhåll, support och uppdateringar varje månad.',
                    'Complete website plus hosting, maintenance, support, and updates every month.'
                  )}
                </p>
                <p className="text-2xl font-bold mb-1">{t('Från', 'From')} 4 500 kr</p>
                <p className="text-sm text-muted-foreground mb-4">+ 399 kr/mån</p>
                <Button asChild className="w-full">
                  <Link to="/priser">
                    {t('Se vårdplaner', 'See care plans')}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={300}>
              <div className="p-6 bg-background border border-border rounded-lg hover:border-accent transition-colors h-full flex flex-col">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-4">
                  <RefreshCcw className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">
                  {t('Endast månatlig webbvård', 'Monthly Care Only')}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 flex-grow">
                  {t(
                    'Har du redan en webbplats? Vi sköter hosting, säkerhet och uppdateringar.',
                    'Already have a website? We handle hosting, security, and updates.'
                  )}
                </p>
                <p className="text-2xl font-bold mb-4">{t('Från', 'From')} 399 kr/mån</p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/priser">
                    {t('Se priser', 'See pricing')}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection animation="fade-up" delay={400} className="text-center mt-12">
            <p className="text-sm text-muted-foreground">
              {t(
                'Har du frågor? Kontakta oss på hej@nordicsite.se',
                'Questions? Contact us at hello@nordicsite.se'
              )}
            </p>
          </AnimatedSection>
        </div>
      </div>
    );
  }

  if (selectedOption === 'refund') {
    return (
      <div className="section-padding py-20">
        <div className="container-narrow text-center">
          <AnimatedSection animation="scale-in">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <RefreshCcw className="w-8 h-8 text-muted-foreground" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              {t('Vi förstår', 'We understand')}
            </h1>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              {t(
                'Tack för att du provade vår demo. Vi behandlar din återbetalning inom 7 arbetsdagar.',
                'Thank you for trying our demo. We\'ll process your refund within 7 business days.'
              )}
            </p>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={100}>
            <div className="p-6 bg-secondary/50 rounded-lg max-w-md mx-auto mb-8">
              <h3 className="font-heading font-semibold mb-2">
                {t('Återbetalningsprocess', 'Refund Process')}
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2 text-left">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  {t('Begäran mottagen', 'Request received')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-muted-foreground mt-0.5 flex-shrink-0" />
                  {t('Behandlas (1-3 arbetsdagar)', 'Processing (1-3 business days)')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-muted-foreground mt-0.5 flex-shrink-0" />
                  {t('500 kr återbetalas till din betalningsmetod', '500 kr refunded to your payment method')}
                </li>
              </ul>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={200}>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {t(
                  'Vi skulle uppskatta om du kunde berätta varför demon inte passade dig, så vi kan förbättra oss.',
                  'We\'d appreciate if you could tell us why the demo didn\'t work for you, so we can improve.'
                )}
              </p>
              <Button asChild variant="outline">
                <Link to="/kontakt">
                  {t('Ge feedback', 'Give feedback')}
                </Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding py-20">
      <div className="container-narrow">
        <AnimatedSection animation="fade-up" className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            {t('Fått din demo?', 'Got your demo?')}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t(
              'Grattis! Nu är det dags att bestämma hur du vill gå vidare.',
              'Congratulations! Now it\'s time to decide how you want to proceed.'
            )}
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <AnimatedSection animation="fade-right" delay={100}>
            <button
              onClick={() => setSelectedOption('proceed')}
              className="w-full p-8 bg-accent-soft border-2 border-accent rounded-lg text-left hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-accent/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-7 h-7 text-accent" />
              </div>
              <h2 className="font-heading font-semibold text-xl mb-2">
                {t('Jag gillar demon! 🎉', 'I love the demo! 🎉')}
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                {t(
                  'Fantastiskt! Låt oss fortsätta och bygga din riktiga webbplats. Du kan välja att lägga till månatlig webbvård också.',
                  'Awesome! Let\'s continue and build your real website. You can choose to add monthly care as well.'
                )}
              </p>
              <span className="inline-flex items-center gap-2 text-accent font-medium text-sm group-hover:gap-3 transition-all">
                {t('Fortsätt', 'Continue')}
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          </AnimatedSection>

          <AnimatedSection animation="fade-left" delay={200}>
            <button
              onClick={() => setSelectedOption('refund')}
              className="w-full p-8 bg-secondary/50 border border-border rounded-lg text-left hover:border-muted-foreground transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <XCircle className="w-7 h-7 text-muted-foreground" />
              </div>
              <h2 className="font-heading font-semibold text-xl mb-2">
                {t('Det var inte för mig', 'It wasn\'t for me')}
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                {t(
                  'Inga problem! Du får tillbaka dina 500 kr inom 7 arbetsdagar. Inga frågor, inga krångel.',
                  'No problem! You\'ll get your 500 kr back within 7 business days. No questions, no hassle.'
                )}
              </p>
              <span className="inline-flex items-center gap-2 text-muted-foreground font-medium text-sm group-hover:gap-3 transition-all">
                {t('Begär återbetalning', 'Request refund')}
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          </AnimatedSection>
        </div>

        <AnimatedSection animation="fade-up" delay={300} className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            {t(
              'Har du frågor innan du bestämmer dig? ',
              'Have questions before deciding? '
            )}
            <Link to="/kontakt" className="text-accent hover:underline">
              {t('Kontakta oss', 'Contact us')}
            </Link>
          </p>
        </AnimatedSection>
      </div>
    </div>
  );
}
