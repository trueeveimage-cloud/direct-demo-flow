import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Loader2, CreditCard, User, Palette, Globe, FileText, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { AnimatedSection } from '@/components/AnimatedSection';
import { setVerificationPaid } from '@/config/stripe';

type FormStep = 1 | 2;

const styles = [
  { id: 'minimal', name: 'Minimal', desc: { sv: 'Ren och enkel', en: 'Clean and simple' } },
  { id: 'luxury', name: 'Luxury', desc: { sv: 'Elegant och exklusiv', en: 'Elegant and exclusive' } },
  { id: 'bold', name: 'Bold', desc: { sv: 'Stark och modern', en: 'Strong and modern' } },
  { id: 'playful', name: 'Playful', desc: { sv: 'Lekfull och kreativ', en: 'Playful and creative' } },
  { id: 'corporate', name: 'Corporate', desc: { sv: 'Professionell och seriös', en: 'Professional and serious' } },
];

export default function FreeDemoPage() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<FormStep>(1);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Check for payment success from Stripe redirect
  useEffect(() => {
    const success = searchParams.get('success');
    if (success === 'true') {
      setVerificationPaid();
      setSubmitted(true);
    }
  }, [searchParams]);
  
  // Form state
  const [businessName, setBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currentWebsite, setCurrentWebsite] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [extraNotes, setExtraNotes] = useState('');
  
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const verificationFee = 500;

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    
    if (!businessName.trim()) newErrors.businessName = true;
    if (!contactPerson.trim()) newErrors.contactPerson = true;
    if (!email.trim()) newErrors.email = true;
    if (!phone.trim()) newErrors.phone = true;
    if (!selectedStyle) newErrors.style = true;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep1()) {
      toast({
        title: t('Fyll i alla obligatoriska fält', 'Fill in all required fields'),
        variant: 'destructive',
      });
      return;
    }
    
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePayment = async () => {
    setIsLoading(true);
    
    try {
      // Submit form data to getform for record keeping
      const formData = new FormData();
      formData.append('form_type', 'Concept Request - 500kr');
      formData.append('business_name', businessName);
      formData.append('contact_person', contactPerson);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('current_website', currentWebsite);
      formData.append('selected_style', selectedStyle);
      formData.append('extra_notes', extraNotes);
      formData.append('verification_fee', '500 kr');

      await fetch('https://getform.io/f/agdvpmpb', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
      });

      // Use edge function for Stripe checkout (same as working package checkout)
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      if (!SUPABASE_URL) {
        throw new Error('Payment not configured');
      }

      const response = await fetch(`${SUPABASE_URL}/functions/v1/create-verification-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          businessName,
          contactPerson,
          phone,
          selectedStyle,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.url) {
        window.open(data.url, '_blank');
        toast({ 
          title: t('Stripe-kassan öppnad', 'Stripe checkout opened'), 
          description: t('Slutför betalningen i det nya fönstret.', 'Complete payment in the new window.') 
        });
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      toast({ 
        title: t('Något gick fel', 'Something went wrong'), 
        description: t('Försök igen eller kontakta oss.', 'Try again or contact us.'),
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Success screen
  if (submitted) {
    return (
      <div className="min-h-screen section-padding py-20">
        <div className="container-narrow text-center">
          <AnimatedSection animation="scale-in">
            <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-10 h-10 text-accent" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              {t('Tack!', 'Thank you!')}
            </h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-md mx-auto">
              {t(
                'Din betalning har mottagits. Vi börjar med ditt koncept omedelbart.',
                'Your payment has been received. We\'ll start working on your concept immediately.'
              )}
            </p>

            <Card className="max-w-sm mx-auto mb-10">
              <CardContent className="p-6">
                <p className="font-heading font-semibold text-xl mb-2">
                  {t('Verifieringsavgift betald', 'Verification fee paid')}
                </p>
                <p className="text-muted-foreground text-sm mb-4">
                  {t('Du får ditt koncept inom 72 timmar', 'You\'ll receive your concept within 72 hours')}
                </p>
                <div className="p-3 bg-accent/10 rounded-lg">
                  <p className="text-sm font-medium">
                    {verificationFee.toLocaleString()} kr
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                {t(
                  'När du har fått konceptet, besök "Har du fått ditt koncept?" för att fortsätta.',
                  'Once you receive your concept, visit "Have you received your concept?" to continue.'
                )}
              </p>
              <Button asChild variant="outline">
                <Link to="/efter-demo">
                  {t('Har du fått ditt koncept?', 'Have you received your concept?')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen section-padding py-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 -left-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container-narrow relative">
        {/* Header */}
        <AnimatedSection animation="fade-up" className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            {t('Få ditt koncept', 'Get your concept')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {t(
              'Fyll i formuläret så skapar vi ett unikt webb-koncept för dig inom 72 timmar.',
              'Fill in the form and we\'ll create a unique website concept for you within 72 hours.'
            )}
          </p>
        </AnimatedSection>

        {/* Step Indicator */}
        <AnimatedSection animation="fade-up" delay={50} className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${step === 1 ? 'bg-accent text-accent-foreground' : 'bg-secondary text-muted-foreground'}`}>
              <span className="w-6 h-6 rounded-full bg-background/20 flex items-center justify-center text-sm font-bold">1</span>
              <span className="font-medium">{t('Information', 'Information')}</span>
            </div>
            <div className="w-8 h-0.5 bg-border" />
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${step === 2 ? 'bg-accent text-accent-foreground' : 'bg-secondary text-muted-foreground'}`}>
              <span className="w-6 h-6 rounded-full bg-background/20 flex items-center justify-center text-sm font-bold">2</span>
              <span className="font-medium">{t('Betalning', 'Payment')}</span>
            </div>
          </div>
        </AnimatedSection>

        <AnimatePresence mode="wait">
          {/* Step 1: Form */}
          {step === 1 && (
            <motion.form
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmitForm}
              className="space-y-6 max-w-lg mx-auto"
            >
              {/* Contact Info */}
              <AnimatedSection animation="fade-up" delay={100}>
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-5 h-5 text-accent" />
                      <h2 className="font-semibold text-lg">{t('Kontaktuppgifter', 'Contact information')}</h2>
                    </div>
                    
                    <div>
                      <Label className={errors.businessName ? 'text-destructive' : ''}>{t('Företagsnamn', 'Business name')} *</Label>
                      <Input 
                        value={businessName} 
                        onChange={(e) => setBusinessName(e.target.value)} 
                        placeholder={t('Ditt företagsnamn', 'Your business name')} 
                        className={`h-12 mt-1 ${errors.businessName ? 'border-destructive' : ''}`} 
                      />
                    </div>
                    <div>
                      <Label className={errors.contactPerson ? 'text-destructive' : ''}>{t('Kontaktperson', 'Contact person')} *</Label>
                      <Input 
                        value={contactPerson} 
                        onChange={(e) => setContactPerson(e.target.value)} 
                        placeholder={t('Ditt namn', 'Your name')} 
                        className={`h-12 mt-1 ${errors.contactPerson ? 'border-destructive' : ''}`} 
                      />
                    </div>
                    <div>
                      <Label className={errors.email ? 'text-destructive' : ''}>{t('E-post', 'Email')} *</Label>
                      <Input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="namn@exempel.se" 
                        className={`h-12 mt-1 ${errors.email ? 'border-destructive' : ''}`} 
                      />
                    </div>
                    <div>
                      <Label className={errors.phone ? 'text-destructive' : ''}>{t('Telefon', 'Phone')} *</Label>
                      <Input 
                        type="tel" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        placeholder="070 123 45 67" 
                        className={`h-12 mt-1 ${errors.phone ? 'border-destructive' : ''}`} 
                      />
                    </div>
                    <div>
                      <Label>{t('Nuvarande webbplats', 'Current website')}</Label>
                      <Input 
                        value={currentWebsite} 
                        onChange={(e) => setCurrentWebsite(e.target.value)} 
                        placeholder="www.dittforetag.se" 
                        className="h-12 mt-1" 
                      />
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>

              {/* Style Selection */}
              <AnimatedSection animation="fade-up" delay={150}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Palette className="w-5 h-5 text-accent" />
                      <h2 className="font-semibold text-lg">{t('Stilriktning', 'Style direction')} *</h2>
                    </div>
                    <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 ${errors.style ? 'ring-2 ring-destructive rounded-lg p-2' : ''}`}>
                      {styles.map((style) => (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => setSelectedStyle(style.id)}
                          className={`p-4 text-center rounded-xl border-2 transition-all hover:scale-105 ${
                            selectedStyle === style.id
                              ? 'border-accent bg-accent/10'
                              : 'border-border hover:border-accent/50'
                          }`}
                        >
                          <span className="font-medium block">{style.name}</span>
                          <span className="text-xs text-muted-foreground">{t(style.desc.sv, style.desc.en)}</span>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>

              {/* Extra Notes */}
              <AnimatedSection animation="fade-up" delay={200}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-5 h-5 text-accent" />
                      <h2 className="font-semibold text-lg">{t('Extra information', 'Extra information')}</h2>
                      <span className="text-sm text-muted-foreground ml-auto">{t('Valfritt', 'Optional')}</span>
                    </div>
                    <Textarea
                      value={extraNotes}
                      onChange={(e) => setExtraNotes(e.target.value)}
                      rows={3}
                      placeholder={t('Beskriv din verksamhet, vad du erbjuder, speciella önskemål...', 'Describe your business, what you offer, special requests...')}
                    />
                  </CardContent>
                </Card>
              </AnimatedSection>

              {/* Submit Button */}
              <AnimatedSection animation="fade-up" delay={250}>
                <Button type="submit" size="lg" className="w-full h-14 text-lg">
                  {t('Fortsätt till betalning', 'Continue to payment')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </AnimatedSection>
            </motion.form>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 max-w-lg mx-auto"
            >
              <AnimatedSection animation="fade-up">
                <Button type="button" variant="ghost" onClick={() => setStep(1)} className="mb-2 -ml-2">
                  ← {t('Tillbaka', 'Back')}
                </Button>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={50}>
                <Card className="border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
                  <CardContent className="p-6 sm:p-8">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CreditCard className="w-8 h-8 text-accent" />
                      </div>
                      <h2 className="text-2xl font-bold mb-2">
                        {t('Verifieringsavgift', 'Verification fee')}
                      </h2>
                      <p className="text-4xl font-bold text-accent mb-4">
                        {verificationFee.toLocaleString()} kr
                      </p>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        {t(
                          'Bekräftar att du är seriös. Helt återbetalningsbar om du avvisar konceptet.',
                          'Confirms you\'re serious. Fully refundable if you reject the concept.'
                        )}
                      </p>
                    </div>

                    {/* Summary */}
                    <div className="bg-secondary/50 rounded-xl p-6 mb-6">
                      <h3 className="font-semibold mb-4">{t('Din beställning', 'Your order')}</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t('Företag', 'Business')}</span>
                          <span className="font-medium">{businessName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t('Stil', 'Style')}</span>
                          <span className="font-medium capitalize">{selectedStyle}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t('Leverans', 'Delivery')}</span>
                          <span className="font-medium">{t('Inom 72 timmar', 'Within 72 hours')}</span>
                        </div>
                        <div className="border-t border-border pt-3 mt-3">
                          <div className="flex justify-between text-lg font-bold">
                            <span>{t('Att betala', 'To pay')}</span>
                            <span className="text-accent">{verificationFee.toLocaleString()} kr</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Info box */}
                    <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-6">
                      <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">
                        {t(
                          'Avgiften dras av från slutpriset om du väljer att gå vidare med projektet.',
                          'The fee is deducted from the final price if you choose to proceed with the project.'
                        )}
                      </p>
                    </div>

                    <Button 
                      onClick={handlePayment} 
                      size="lg" 
                      className="w-full h-14 text-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          {t('Öppnar Stripe...', 'Opening Stripe...')}
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5 mr-2" />
                          {t('Betala med Stripe', 'Pay with Stripe')}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
