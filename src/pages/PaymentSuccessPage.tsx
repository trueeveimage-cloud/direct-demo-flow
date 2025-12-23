import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { AnimatedSection } from '@/components/AnimatedSection';

export default function PaymentSuccessPage() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="section-padding py-20 min-h-[70vh] flex items-center">
      <div className="container-narrow text-center">
        <AnimatedSection animation="scale-in">
          <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10 text-accent" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            {t('Tack för din betalning!', 'Thank you for your payment!')}
          </h1>
          
          <p className="text-lg text-muted-foreground mb-6 max-w-md mx-auto">
            {t(
              'Vi har mottagit din beställning och börjar arbeta direkt.',
              'We\'ve received your order and will start working right away.'
            )}
          </p>

          <div className="bg-secondary/50 rounded-xl p-6 mb-8 max-w-md mx-auto">
            <h3 className="font-semibold mb-2">{t('Vad händer nu?', 'What happens next?')}</h3>
            <ul className="text-sm text-muted-foreground space-y-2 text-left">
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">1.</span>
                {t('Du får ett bekräftelsemail inom kort.', 'You\'ll receive a confirmation email shortly.')}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">2.</span>
                {t('Vi kontaktar dig om vi behöver mer information.', 'We\'ll contact you if we need more information.')}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">3.</span>
                {t('Din webbplats levereras enligt valt paket.', 'Your website will be delivered according to your chosen package.')}
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline">
              <Link to="/">
                {t('Tillbaka till start', 'Back to home')}
              </Link>
            </Button>
            <Button asChild>
              <Link to="/kontakt">
                {t('Kontakta oss', 'Contact us')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          {sessionId && (
            <p className="text-xs text-muted-foreground mt-8">
              {t('Referens:', 'Reference:')} {sessionId.slice(0, 20)}...
            </p>
          )}
        </AnimatedSection>
      </div>
    </div>
  );
}
