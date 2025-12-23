import { Link } from 'react-router-dom';
import { XCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { AnimatedSection } from '@/components/AnimatedSection';

export default function PaymentCancelledPage() {
  const { t } = useLanguage();

  return (
    <div className="section-padding py-20 min-h-[70vh] flex items-center">
      <div className="container-narrow text-center">
        <AnimatedSection animation="scale-in">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-8">
            <XCircle className="w-10 h-10 text-muted-foreground" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            {t('Betalning avbruten', 'Payment cancelled')}
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            {t(
              'Din betalning har avbrutits. Inget har debiterats.',
              'Your payment has been cancelled. Nothing has been charged.'
            )}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline">
              <Link to="/">
                {t('Tillbaka till start', 'Back to home')}
              </Link>
            </Button>
            <Button asChild>
              <Link to="/efter-demo">
                {t('Prova igen', 'Try again')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-8">
            {t('Har du frågor?', 'Have questions?')}{' '}
            <Link to="/kontakt" className="text-accent hover:underline">
              {t('Kontakta oss', 'Contact us')}
            </Link>
          </p>
        </AnimatedSection>
      </div>
    </div>
  );
}
