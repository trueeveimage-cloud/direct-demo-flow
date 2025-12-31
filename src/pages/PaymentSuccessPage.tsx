import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { AnimatedSection } from '@/components/AnimatedSection';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function PaymentSuccessPage() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const hasSentEmail = useRef(false);

  // Send order confirmation email when page loads
  useEffect(() => {
    const sendConfirmationEmail = async () => {
      // Prevent duplicate sends
      if (hasSentEmail.current || !sessionId) return;
      hasSentEmail.current = true;
      
      // Get order details from URL params or localStorage
      const conceptLink = searchParams.get('concept');
      const carePlan = searchParams.get('care_plan');
      const isYearly = searchParams.get('care_yearly') === 'true';
      
      // Try to get cached order data from sessionStorage
      const cachedOrder = sessionStorage.getItem('pending_order');
      if (!cachedOrder) {
        console.log('No cached order data found for email confirmation');
        return;
      }

      try {
        const orderData = JSON.parse(cachedOrder);
        
        // Build addons list
        const addons: string[] = [];
        if (orderData.wantsBooking && orderData.packageId !== 'pro') {
          addons.push('Booking System (€200)');
        }
        if (orderData.addedAdminPanel) {
          addons.push('Admin Panel (€100)');
        }

        // Map package name
        const packageNames: Record<string, string> = {
          starter: 'Starter',
          standard: 'Standard',
          pro: 'Pro',
        };
        const packagePrices: Record<string, string> = {
          starter: '€490',
          standard: '€790',
          pro: '€1,290',
        };
        const deliveryDays: Record<string, number> = {
          starter: 14,
          standard: 10,
          pro: 7,
        };

        const { data, error } = await supabase.functions.invoke('send-order-confirmation', {
          body: {
            email: orderData.email,
            customerName: orderData.contactPerson || orderData.businessName || 'Customer',
            packageName: packageNames[orderData.packageId] || orderData.packageId,
            packagePrice: packagePrices[orderData.packageId] || 'N/A',
            businessName: orderData.businessName,
            conceptLink: conceptLink ? decodeURIComponent(conceptLink) : orderData.conceptLink,
            addons,
            carePlan: carePlan ? `${carePlan} (${isYearly ? 'Yearly' : 'Monthly'})` : undefined,
            deliveryDays: deliveryDays[orderData.packageId] || 10,
          },
        });

        if (error) {
          console.error('Failed to send confirmation email:', error);
          setEmailError(true);
        } else {
          console.log('Order confirmation email sent successfully');
          setEmailSent(true);
          // Clear cached order data
          sessionStorage.removeItem('pending_order');
        }
      } catch (err) {
        console.error('Error sending confirmation email:', err);
        setEmailError(true);
      }
    };

    sendConfirmationEmail();
  }, [sessionId, searchParams]);

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

          {/* Email status indicator */}
          {!emailSent && !emailError && sessionId && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              {t('Skickar bekräftelsemail...', 'Sending confirmation email...')}
            </div>
          )}
          {emailSent && (
            <div className="text-sm text-accent mb-4">
              ✓ {t('Bekräftelsemail skickat!', 'Confirmation email sent!')}
            </div>
          )}

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
