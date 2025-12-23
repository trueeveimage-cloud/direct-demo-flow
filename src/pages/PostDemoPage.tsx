import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, XCircle, ChevronDown, ChevronUp, Check, Star, FileText, Users, Search, Scale, Globe, CreditCard, Link as LinkIcon, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';
import { AnimatedSection } from '@/components/AnimatedSection';
import { toast } from '@/hooks/use-toast';
import { InfoTooltip } from '@/components/InfoTooltip';
import { Switch } from '@/components/ui/switch';

// Edge function URL - uses Cloud functions
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const EDGE_FUNCTION_BASE = SUPABASE_URL ? `${SUPABASE_URL}/functions/v1` : '';

const packages = [
  { id: 'starter', name: 'Starter', price: 4900, priceDisplay: '4 900 kr', pages: { sv: 'Upp till 3 sidor', en: 'Up to 3 pages' }, delivery: 14, features: { sv: ['Responsiv design', 'Mobil-först', 'Kontaktformulär', 'SEO-grundläggande', '1 revision'], en: ['Responsive design', 'Mobile-first', 'Contact form', 'Basic SEO', '1 revision'] } },
  { id: 'standard', name: 'Standard', price: 7900, priceDisplay: '7 900 kr', pages: { sv: 'Upp till 5 sidor', en: 'Up to 5 pages' }, delivery: 10, popular: true, features: { sv: ['Allt i Starter', '2 revisioner', 'Google Maps', 'Sociala medier', 'Bildgalleri'], en: ['Everything in Starter', '2 revisions', 'Google Maps', 'Social media', 'Image gallery'] } },
  { id: 'pro', name: 'Pro', price: 12900, priceDisplay: '12 900 kr', pages: { sv: 'Upp till 8 sidor', en: 'Up to 8 pages' }, delivery: 7, features: { sv: ['Allt i Standard', '3 revisioner', 'Bokningsintegration', 'Nyhetsbrev', 'Google Analytics', 'Prioriterad support'], en: ['Everything in Standard', '3 revisions', 'Booking integration', 'Newsletter', 'Google Analytics', 'Priority support'] } },
];

const carePlans = [
  { id: 'basic', name: 'Basic', monthlyPrice: 249, yearlyPrice: 199, features: { sv: ['Hosting', 'Uppdateringar', 'Säkerhetskopiering'], en: ['Hosting', 'Updates', 'Backups'] } },
  { id: 'standard', name: 'Standard', monthlyPrice: 449, yearlyPrice: 359, popular: true, features: { sv: ['Allt i Basic', 'Domän ingår', 'Företagsmail', '1h ändringar/mån'], en: ['Everything in Basic', 'Domain included', 'Business email', '1h edits/month'] } },
  { id: 'pro', name: 'Pro', monthlyPrice: 749, yearlyPrice: 599, features: { sv: ['Allt i Standard', '3h ändringar/mån', 'Prioriterad support'], en: ['Everything in Standard', '3h edits/month', 'Priority support'] } },
];

export default function PostDemoPage() {
  const { t, lang } = useLanguage();
  const [selectedOption, setSelectedOption] = useState<'proceed' | 'refund' | null>(null);
  const [proceedStep, setProceedStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<string>('standard');
  const [selectedCarePlan, setSelectedCarePlan] = useState<string | null>('standard');
  const [isYearlyCarePlan, setIsYearlyCarePlan] = useState(false);
  const [expandedPackage, setExpandedPackage] = useState<string | null>(null);
  
  // Concept link - required for both flows
  const [conceptLink, setConceptLink] = useState('');
  const [conceptLinkError, setConceptLinkError] = useState(false);
  
  // Refund flow state - now includes revision option
  const [refundStep, setRefundStep] = useState(1);
  const [wantsRevision, setWantsRevision] = useState<boolean | null>(null);
  const [revisionFeedback, setRevisionFeedback] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackReasons, setFeedbackReasons] = useState<string[]>([]);
  const [feedbackStyleCorrect, setFeedbackStyleCorrect] = useState<boolean | null>(null);
  const [feedbackMissing, setFeedbackMissing] = useState('');
  const [feedbackImprove, setFeedbackImprove] = useState('');

  // Proceed flow state
  const [pageNotes, setPageNotes] = useState('');
  const [brandPreferences, setBrandPreferences] = useState('');
  const [competitors, setCompetitors] = useState('');
  const [copywritingNeeds, setCopywritingNeeds] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [bookingDetails, setBookingDetails] = useState('');
  const [imageReferences, setImageReferences] = useState('');
  const [legalPages, setLegalPages] = useState<string[]>([]);
  const [selectedLanguageProceed, setSelectedLanguageProceed] = useState('sv');
  const [extraNotes, setExtraNotes] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const pkg = packages.find(p => p.id === selectedPackage);
  const verificationFee = 500; // Flat 500 kr / ~$50 USD
  const remainingAmount = pkg ? pkg.price - verificationFee : 0;

  const validateConceptLink = (link: string): boolean => {
    try {
      new URL(link);
      return true;
    } catch {
      return false;
    }
  };

  const handleOptionSelect = (option: 'proceed' | 'refund') => {
    if (!conceptLink.trim()) {
      setConceptLinkError(true);
      toast({ title: t('Ange konceptlänken', 'Enter the concept link'), variant: 'destructive' });
      return;
    }
    if (!validateConceptLink(conceptLink)) {
      setConceptLinkError(true);
      toast({ title: t('Ogiltig URL', 'Invalid URL'), variant: 'destructive' });
      return;
    }
    setConceptLinkError(false);
    setSelectedOption(option);
  };

  const toggleFeedbackReason = (reason: string) => {
    if (feedbackReasons.includes(reason)) {
      setFeedbackReasons(feedbackReasons.filter(r => r !== reason));
    } else {
      setFeedbackReasons([...feedbackReasons, reason]);
    }
  };

  const handleRefundSubmit = async () => {
    if (feedbackRating === 0 || feedbackReasons.length === 0 || feedbackStyleCorrect === null) {
      toast({ title: t('Besvara alla frågor', 'Answer all questions'), variant: 'destructive' });
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('form_type', 'Refund Request');
      formData.append('concept_link', conceptLink);
      formData.append('feedback_rating', String(feedbackRating));
      formData.append('feedback_reasons', feedbackReasons.join(', '));
      formData.append('style_correct', String(feedbackStyleCorrect));
      formData.append('missing_features', feedbackMissing);
      formData.append('improvement_suggestions', feedbackImprove);

      await fetch('https://getform.io/f/agdvpmpb', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
      });
    } catch (error) {
      // Continue anyway
    }
    
    setRefundStep(2);
  };

  const handleRevisionSubmit = async () => {
    if (!revisionFeedback.trim()) {
      toast({ title: t('Beskriv ändringarna', 'Describe the changes'), variant: 'destructive' });
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('form_type', 'Revision Request');
      formData.append('concept_link', conceptLink);
      formData.append('revision_feedback', revisionFeedback);

      await fetch('https://getform.io/f/agdvpmpb', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
      });
    } catch (error) {
      // Continue anyway
    }
    
    setRefundStep(2);
  };

  const handleProceedSubmit = async () => {
    setIsProcessingPayment(true);
    
    try {
      // First, submit form data to getform for record keeping
      const formData = new FormData();
      formData.append('form_type', 'I Love My Concept - Order');
      formData.append('concept_link', conceptLink);
      formData.append('selected_package', selectedPackage);
      formData.append('package_price', pkg?.priceDisplay || '');
      formData.append('selected_care_plan', selectedCarePlan || 'none');
      formData.append('care_plan_billing', isYearlyCarePlan ? 'yearly' : 'monthly');
      formData.append('page_notes', pageNotes);
      formData.append('brand_preferences', brandPreferences);
      formData.append('competitors', competitors);
      formData.append('copywriting_needs', copywritingNeeds);
      formData.append('seo_keywords', seoKeywords);
      formData.append('booking_details', bookingDetails);
      formData.append('image_references', imageReferences);
      formData.append('legal_pages', legalPages.join(', '));
      formData.append('selected_language', selectedLanguageProceed);
      formData.append('extra_notes', extraNotes);
      formData.append('verification_fee_paid', '500 kr');
      formData.append('remaining_amount', remainingAmount.toLocaleString() + ' kr');

      await fetch('https://getform.io/f/agdvpmpb', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
      });

      // Now create Stripe checkout session
      if (!EDGE_FUNCTION_BASE) {
        toast({ 
          title: t('Betalning inte konfigurerad', 'Payment not configured'), 
          description: t('Vänligen kontakta oss för att slutföra beställningen.', 'Please contact us to complete your order.'),
          variant: 'destructive' 
        });
        setIsProcessingPayment(false);
        return;
      }

      const response = await fetch(`${EDGE_FUNCTION_BASE}/create-package-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: selectedPackage,
          conceptLink,
          carePlanId: selectedCarePlan,
          isYearly: isYearlyCarePlan,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.url) {
        // Open Stripe checkout in new tab
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
      setIsProcessingPayment(false);
    }
  };

  // Refund Flow - Now with revision option first
  if (selectedOption === 'refund') {
    // Step 3: Refund confirmed
    if (refundStep === 3) {
      return (
        <div className="section-padding py-20">
          <div className="container-narrow text-center">
            <AnimatedSection animation="scale-in">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-accent" />
              </div>
              <h1 className="text-3xl font-bold mb-4">{t('Begäran skickad', 'Request submitted')}</h1>
              <p className="text-muted-foreground mb-8">{t('Vi behandlar din återbetalning inom 7 arbetsdagar.', 'We\'ll process your refund within 7 business days.')}</p>
              <Button asChild variant="outline"><Link to="/">{t('Tillbaka till start', 'Back to home')}</Link></Button>
            </AnimatedSection>
          </div>
        </div>
      );
    }

    // Step 2.5: Revision request submitted
    if (refundStep === 2 && wantsRevision) {
      return (
        <div className="section-padding py-20">
          <div className="container-narrow text-center">
            <AnimatedSection animation="scale-in">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-accent" />
              </div>
              <h1 className="text-3xl font-bold mb-4">{t('Revisionsbegäran mottagen!', 'Revision request received!')}</h1>
              <p className="text-muted-foreground mb-4">{t('Vi har tagit emot dina ändringsförslag.', 'We\'ve received your change requests.')}</p>
              <p className="text-muted-foreground mb-8">{t('Vi återkommer inom 48 timmar med ett uppdaterat koncept.', 'We\'ll get back to you within 48 hours with an updated concept.')}</p>
              <Button asChild><Link to="/">{t('Tillbaka till start', 'Back to home')}</Link></Button>
            </AnimatedSection>
          </div>
        </div>
      );
    }

    // Step 2: Refund feedback (if they chose not to revise)
    if (refundStep === 2 && !wantsRevision) {
      return (
        <div className="section-padding py-12">
          <div className="container-narrow">
            <AnimatedSection animation="fade-up" className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t('Återbetalning', 'Refund')}</h1>
              <p className="text-muted-foreground">{t('Hjälp oss förbättra genom att svara på några frågor.', 'Help us improve by answering a few questions.')}</p>
            </AnimatedSection>

            <div className="space-y-6 max-w-lg mx-auto">
              <AnimatedSection animation="fade-up" delay={100}>
                <div className="space-y-6 p-6 bg-secondary/50 rounded-xl">
                  <div className="space-y-2">
                    <Label>{t('Betygsätt konceptet 1-5', 'Rate the concept 1-5')} *</Label>
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(n => (
                        <button key={n} type="button" onClick={() => setFeedbackRating(n)} className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all ${feedbackRating >= n ? 'bg-accent text-accent-foreground border-accent' : 'border-border hover:border-accent/50'}`}>
                          <Star className={`w-5 h-5 ${feedbackRating >= n ? 'fill-current' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('Vad gillade du inte?', 'What didn\'t you like?')} *</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { sv: 'Design/stil', en: 'Design/style' },
                        { sv: 'Funktioner saknas', en: 'Missing features' },
                        { sv: 'Inte vad jag förväntade', en: 'Not what I expected' },
                        { sv: 'Annat', en: 'Other' },
                      ].map(reason => (
                        <button key={reason.en} type="button" onClick={() => toggleFeedbackReason(reason.en)} className={`p-3 text-sm rounded-lg border-2 transition-all ${feedbackReasons.includes(reason.en) ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/50'}`}>
                          {t(reason.sv, reason.en)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('Var stilriktningen korrekt?', 'Was the style direction correct?')} *</Label>
                    <div className="flex gap-4">
                      <button type="button" onClick={() => setFeedbackStyleCorrect(true)} className={`px-6 py-3 rounded-lg border-2 transition-all ${feedbackStyleCorrect === true ? 'border-accent bg-accent/10' : 'border-border'}`}>{t('Ja', 'Yes')}</button>
                      <button type="button" onClick={() => setFeedbackStyleCorrect(false)} className={`px-6 py-3 rounded-lg border-2 transition-all ${feedbackStyleCorrect === false ? 'border-accent bg-accent/10' : 'border-border'}`}>{t('Nej', 'No')}</button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('Saknade funktioner?', 'Missing features?')}</Label>
                    <Input value={feedbackMissing} onChange={(e) => setFeedbackMissing(e.target.value)} placeholder={t('Valfritt...', 'Optional...')} className="h-12" />
                  </div>

                  <div className="space-y-2">
                    <Label>{t('Vad skulle göra det acceptabelt?', 'What would make it acceptable?')}</Label>
                    <Textarea value={feedbackImprove} onChange={(e) => setFeedbackImprove(e.target.value)} placeholder={t('Valfritt...', 'Optional...')} rows={3} />
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={200}>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setRefundStep(1)}>{t('Tillbaka', 'Back')}</Button>
                  <Button onClick={async () => {
                    if (feedbackRating === 0 || feedbackReasons.length === 0 || feedbackStyleCorrect === null) {
                      toast({ title: t('Besvara alla frågor', 'Answer all questions'), variant: 'destructive' });
                      return;
                    }
                    try {
                      const formData = new FormData();
                      formData.append('form_type', 'Refund Request');
                      formData.append('concept_link', conceptLink);
                      formData.append('feedback_rating', String(feedbackRating));
                      formData.append('feedback_reasons', feedbackReasons.join(', '));
                      formData.append('style_correct', String(feedbackStyleCorrect));
                      formData.append('missing_features', feedbackMissing);
                      formData.append('improvement_suggestions', feedbackImprove);

                      await fetch('https://getform.io/f/agdvpmpb', {
                        method: 'POST',
                        body: formData,
                        headers: { 'Accept': 'application/json' },
                      });
                    } catch (error) {
                      // Continue anyway
                    }
                    setRefundStep(3);
                  }} className="flex-1">{t('Skicka begäran', 'Submit request')}</Button>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      );
    }

    // Step 1: Ask if they want revision or refund
    return (
      <div className="section-padding py-12">
        <div className="container-narrow">
          <AnimatedSection animation="fade-up" className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t('Inte helt nöjd?', 'Not fully satisfied?')}</h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {t('Vi vill att du ska bli nöjd! Låt oss göra ändringar innan du bestämmer dig.', 'We want you to be happy! Let us make changes before you decide.')}
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-8">
            {/* Revision Option - Highlighted */}
            <AnimatedSection animation="fade-right" delay={100}>
              <button 
                onClick={() => setWantsRevision(true)} 
                className={`w-full p-8 rounded-xl border-2 text-left transition-all relative ${wantsRevision === true ? 'border-accent bg-accent/10 shadow-lg' : 'border-accent/50 bg-accent/5 hover:border-accent hover:shadow-lg'}`}
              >
                <span className="absolute -top-3 left-4 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded">
                  {t('Rekommenderas', 'Recommended')}
                </span>
                <div className="w-14 h-14 bg-accent/20 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-7 h-7 text-accent" />
                </div>
                <h2 className="font-heading font-semibold text-xl mb-2">{t('Gör ändringar', 'Request changes')}</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('Berätta vad du vill ändra så uppdaterar vi konceptet utan extra kostnad.', 'Tell us what to change and we\'ll update the concept at no extra cost.')}
                </p>
                <span className="inline-flex items-center gap-2 text-accent font-medium text-sm">
                  {t('Välj detta', 'Choose this')} <ArrowRight className="w-4 h-4" />
                </span>
              </button>
            </AnimatedSection>

            {/* Refund Option */}
            <AnimatedSection animation="fade-left" delay={200}>
              <button 
                onClick={() => setWantsRevision(false)} 
                className={`w-full p-8 rounded-xl border-2 text-left transition-all ${wantsRevision === false ? 'border-muted-foreground bg-secondary shadow-lg' : 'border-border bg-secondary/50 hover:border-muted-foreground'}`}
              >
                <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mb-4">
                  <XCircle className="w-7 h-7 text-muted-foreground" />
                </div>
                <h2 className="font-heading font-semibold text-xl mb-2">{t('Begär återbetalning', 'Request refund')}</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('Full återbetalning inom 7 arbetsdagar.', 'Full refund within 7 business days.')}
                </p>
                <span className="inline-flex items-center gap-2 text-muted-foreground font-medium text-sm">
                  {t('Välj detta', 'Choose this')} <ArrowRight className="w-4 h-4" />
                </span>
              </button>
            </AnimatedSection>
          </div>

          {/* Revision form - show when revision selected */}
          {wantsRevision === true && (
            <AnimatedSection animation="fade-up" delay={300}>
              <div className="max-w-lg mx-auto space-y-6">
                <div className="p-6 bg-secondary/50 rounded-xl space-y-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-accent" />
                    <Label className="font-medium">{t('Beskriv ändringarna du vill ha', 'Describe the changes you want')} *</Label>
                  </div>
                  <Textarea 
                    value={revisionFeedback} 
                    onChange={(e) => setRevisionFeedback(e.target.value)} 
                    placeholder={t('Exempelvis: Jag vill ha andra färger, en annan layout på startsidan, fler bilder...', 'For example: I want different colors, a different homepage layout, more images...')} 
                    rows={5}
                    className="resize-none"
                  />
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => { setWantsRevision(null); setRevisionFeedback(''); }}>{t('Avbryt', 'Cancel')}</Button>
                  <Button 
                    onClick={handleRevisionSubmit} 
                    className="flex-1"
                  >
                    {t('Skicka ändringsförslag', 'Submit change request')} <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </AnimatedSection>
          )}

          {/* Proceed to refund - show when refund selected */}
          {wantsRevision === false && (
            <AnimatedSection animation="fade-up" delay={300}>
              <div className="max-w-lg mx-auto">
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setWantsRevision(null)}>{t('Avbryt', 'Cancel')}</Button>
                  <Button onClick={() => setRefundStep(2)} className="flex-1" variant="secondary">
                    {t('Fortsätt till återbetalning', 'Continue to refund')} <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </AnimatedSection>
          )}

          <AnimatedSection animation="fade-up" delay={400} className="mt-8 text-center">
            <Button variant="ghost" onClick={() => setSelectedOption(null)}>
              {t('← Tillbaka', '← Back')}
            </Button>
          </AnimatedSection>
        </div>
      </div>
    );
  }

  // Proceed Flow
  if (selectedOption === 'proceed') {
    if (proceedStep === 4) {
      return (
        <div className="section-padding py-20">
          <div className="container-narrow text-center">
            <AnimatedSection animation="scale-in">
              <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-10 h-10 text-accent" />
              </div>
              <h1 className="text-3xl font-bold mb-4">{t('Tack!', 'Thank you!')}</h1>
              <p className="text-muted-foreground mb-4">{t('Vi har mottagit din beställning.', 'We\'ve received your order.')}</p>
              <div className="p-4 bg-accent/10 rounded-xl inline-block mb-8">
                <p className="text-lg font-medium">{t(`Leverans inom ${pkg?.delivery} dagar.`, `Delivery within ${pkg?.delivery} days.`)}</p>
              </div>
              <div className="flex justify-center">
                <Button asChild><Link to="/">{t('Tillbaka till start', 'Back to home')}</Link></Button>
              </div>
            </AnimatedSection>
          </div>
        </div>
      );
    }

    return (
      <div className="section-padding py-12">
        <div className="container-wide">
          {/* Step Indicator */}
          <AnimatedSection animation="fade-up" className="mb-12">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {[
                { num: 1, label: t('Paket', 'Package') },
                { num: 2, label: t('Vårdplan', 'Care plan') },
                { num: 3, label: t('Detaljer', 'Details') },
              ].map((step, index) => (
                <div key={step.num} className="flex items-center gap-2">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${proceedStep === step.num ? 'bg-accent text-accent-foreground' : proceedStep > step.num ? 'bg-accent/20 text-accent' : 'bg-secondary text-muted-foreground'}`}>
                    <span className="w-6 h-6 rounded-full bg-background/20 flex items-center justify-center text-sm font-bold">{proceedStep > step.num ? <Check className="w-4 h-4" /> : step.num}</span>
                    <span className="text-sm font-medium hidden sm:inline">{step.label}</span>
                  </div>
                  {index < 2 && <div className="w-8 h-0.5 bg-border hidden sm:block" />}
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Step 1: Package */}
          {proceedStep === 1 && (
            <div>
              <AnimatedSection animation="fade-up" className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t('Bekräfta paket', 'Confirm package')}</h1>
              </AnimatedSection>
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {packages.map((p, index) => (
                  <AnimatedSection key={p.id} animation="fade-up" delay={index * 100}>
                    <button onClick={() => setSelectedPackage(p.id)} className={`w-full p-6 rounded-xl border-2 text-left transition-all relative ${selectedPackage === p.id ? 'border-accent bg-accent/5 shadow-lg' : 'border-border hover:border-accent/50'}`}>
                      {p.popular && <span className="absolute -top-3 left-4 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded">{t('Populärast', 'Popular')}</span>}
                      <h3 className="font-semibold text-xl mb-1">{p.name}</h3>
                      <p className="text-2xl font-bold text-accent mb-1">{p.priceDisplay}</p>
                      <p className="text-sm text-muted-foreground mb-2">{lang === 'sv' ? p.pages.sv : p.pages.en}</p>
                      <p className="text-xs text-muted-foreground">{t('Leverans', 'Delivery')}: {p.delivery} {t('dagar', 'days')}</p>
                      <button type="button" onClick={(e) => { e.stopPropagation(); setExpandedPackage(expandedPackage === p.id ? null : p.id); }} className="text-sm text-accent hover:underline flex items-center gap-1 mt-2">
                        {t('Detaljer', 'Details')} {expandedPackage === p.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      {expandedPackage === p.id && (
                        <ul className="mt-4 space-y-2">
                          {(lang === 'sv' ? p.features.sv : p.features.en).map((f, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm"><Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />{f}</li>
                          ))}
                        </ul>
                      )}
                    </button>
                  </AnimatedSection>
                ))}
              </div>
              <div className="text-center mt-8"><Button size="lg" onClick={() => setProceedStep(2)}>{t('Fortsätt', 'Continue')} <ArrowRight className="w-4 h-4" /></Button></div>
            </div>
          )}

          {/* Step 2: Care Plan */}
          {proceedStep === 2 && (
            <div>
              <AnimatedSection animation="fade-up" className="text-center mb-4">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t('Lägg till månatlig webbvård?', 'Add monthly care?')}</h1>
              </AnimatedSection>
              
              {/* Yearly Toggle */}
              <div className="flex items-center justify-center gap-3 mb-8">
                <span className={`text-sm ${!isYearlyCarePlan ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {t('Månadsvis', 'Monthly')}
                </span>
                <Switch 
                  checked={isYearlyCarePlan} 
                  onCheckedChange={setIsYearlyCarePlan}
                  className="data-[state=checked]:bg-accent"
                />
                <span className={`text-sm ${isYearlyCarePlan ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {t('Årsvis', 'Yearly')}
                  <span className="ml-1 text-xs text-accent font-semibold">
                    {t('Spara 20%', 'Save 20%')}
                  </span>
                </span>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
                {carePlans.map((c, index) => {
                  const price = isYearlyCarePlan ? c.yearlyPrice : c.monthlyPrice;
                  return (
                    <AnimatedSection key={c.id} animation="fade-up" delay={index * 100}>
                      <button onClick={() => setSelectedCarePlan(selectedCarePlan === c.id ? null : c.id)} className={`w-full p-6 rounded-xl border-2 text-left transition-all relative ${selectedCarePlan === c.id ? 'border-accent bg-accent/5 shadow-lg' : 'border-border hover:border-accent/50'}`}>
                        {c.popular && <span className="absolute -top-3 left-4 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded">{t('Rekommenderas', 'Recommended')}</span>}
                        <h3 className="font-semibold text-xl mb-1">{c.name}</h3>
                        <div className="mb-4">
                          <span className="text-xl font-bold text-accent">{price} kr/mån</span>
                          {isYearlyCarePlan && (
                            <span className="ml-2 text-xs text-muted-foreground line-through">
                              {c.monthlyPrice} kr/mån
                            </span>
                          )}
                        </div>
                        <ul className="space-y-2">
                          {(lang === 'sv' ? c.features.sv : c.features.en).map((f, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm"><Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />{f}</li>
                          ))}
                        </ul>
                      </button>
                    </AnimatedSection>
                  );
                })}
              </div>
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={() => setProceedStep(1)}>{t('Tillbaka', 'Back')}</Button>
                <Button size="lg" onClick={() => setProceedStep(3)}>{t('Fortsätt', 'Continue')} <ArrowRight className="w-4 h-4" /></Button>
              </div>
            </div>
          )}

          {/* Step 3: Detailed form + Payment */}
          {proceedStep === 3 && (
            <div className="max-w-2xl mx-auto">
              <AnimatedSection animation="fade-up" className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t('Projektdetaljer', 'Project details')}</h1>
              </AnimatedSection>

              <div className="space-y-6">
                <AnimatedSection animation="fade-up" delay={100}>
                  <div className="p-6 bg-secondary/50 rounded-xl space-y-4">
                    <div className="flex items-center gap-2 mb-4"><FileText className="w-5 h-5 text-accent" /><h3 className="font-semibold">{t('Sidstruktur & anteckningar', 'Page structure & notes')}</h3><InfoTooltip content={t('Beskriv varje sida och vad den ska innehålla.', 'Describe each page and what it should contain.')} /></div>
                    <Textarea value={pageNotes} onChange={(e) => setPageNotes(e.target.value)} placeholder={t('Beskriv varje sida...', 'Describe each page...')} rows={4} />
                  </div>
                </AnimatedSection>

                <AnimatedSection animation="fade-up" delay={150}>
                  <div className="p-6 bg-secondary/50 rounded-xl space-y-4">
                    <div className="flex items-center gap-2 mb-4"><Users className="w-5 h-5 text-accent" /><h3 className="font-semibold">{t('Varumärke & konkurrenter', 'Brand & competitors')}</h3></div>
                    <Textarea value={brandPreferences} onChange={(e) => setBrandPreferences(e.target.value)} placeholder={t('Färger, typsnitt, ton...', 'Colors, fonts, tone...')} rows={3} />
                    <Input value={competitors} onChange={(e) => setCompetitors(e.target.value)} placeholder={t('Webbplatser du gillar...', 'Websites you like...')} />
                  </div>
                </AnimatedSection>

                <AnimatedSection animation="fade-up" delay={200}>
                  <div className="p-6 bg-secondary/50 rounded-xl space-y-4">
                    <div className="flex items-center gap-2 mb-4"><Search className="w-5 h-5 text-accent" /><h3 className="font-semibold">{t('SEO & sökord', 'SEO & keywords')}</h3></div>
                    <Input value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} placeholder={t('Sökord, lokalområde...', 'Keywords, local area...')} />
                  </div>
                </AnimatedSection>

                <AnimatedSection animation="fade-up" delay={250}>
                  <div className="p-6 bg-secondary/50 rounded-xl space-y-4">
                    <div className="flex items-center gap-2 mb-4"><Globe className="w-5 h-5 text-accent" /><h3 className="font-semibold">{t('Språk', 'Language')}</h3></div>
                    <div className="flex gap-4">
                      {['sv', 'en', 'both'].map(l => (
                        <button key={l} type="button" onClick={() => setSelectedLanguageProceed(l)} className={`px-4 py-2 rounded-lg border-2 text-sm transition-all ${selectedLanguageProceed === l ? 'border-accent bg-accent/10' : 'border-border'}`}>
                          {l === 'sv' ? t('Svenska', 'Swedish') : l === 'en' ? t('Engelska', 'English') : t('Båda', 'Both')}
                        </button>
                      ))}
                    </div>
                  </div>
                </AnimatedSection>

                <AnimatedSection animation="fade-up" delay={300}>
                  <div className="p-6 bg-secondary/50 rounded-xl space-y-4">
                    <div className="flex items-center gap-2 mb-4"><Scale className="w-5 h-5 text-accent" /><h3 className="font-semibold">{t('Juridiska sidor', 'Legal pages')}</h3></div>
                    <div className="flex flex-wrap gap-3">
                      {['GDPR', 'Cookies', t('Villkor', 'Terms')].map(page => (
                        <label key={page} className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-accent/5">
                          <Checkbox checked={legalPages.includes(page)} onCheckedChange={(checked) => { if (checked) setLegalPages([...legalPages, page]); else setLegalPages(legalPages.filter(p => p !== page)); }} />
                          <span className="text-sm">{page}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </AnimatedSection>

                <AnimatedSection animation="fade-up" delay={350}>
                  <div className="p-6 bg-secondary/50 rounded-xl space-y-4">
                    <div className="flex items-center gap-2 mb-4"><FileText className="w-5 h-5 text-accent" /><h3 className="font-semibold">{t('Extra önskemål', 'Extra notes')}</h3></div>
                    <Textarea value={extraNotes} onChange={(e) => setExtraNotes(e.target.value)} placeholder={t('Speciella önskemål...', 'Special requests...')} rows={3} />
                  </div>
                </AnimatedSection>

                {/* Payment Summary */}
                <AnimatedSection animation="fade-up" delay={400}>
                  <div className="p-6 bg-accent/10 rounded-xl border border-accent/30">
                    <h3 className="font-semibold mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-accent" />{t('Slutbetalning', 'Final payment')}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>{t('Paketpris', 'Package price')}</span><span>{pkg?.priceDisplay}</span></div>
                      <div className="flex justify-between text-muted-foreground"><span>{t('Redan betald handpenning', 'Already paid deposit')}</span><span>-{verificationFee.toLocaleString()} kr</span></div>
                      {selectedCarePlan && (() => {
                        const carePlan = carePlans.find(c => c.id === selectedCarePlan);
                        const carePlanPrice = carePlan ? (isYearlyCarePlan ? carePlan.yearlyPrice : carePlan.monthlyPrice) : 0;
                        return (
                          <div className="flex justify-between">
                            <span>{t('Vårdplan', 'Care plan')} ({carePlan?.name}) - {isYearlyCarePlan ? t('årsvis', 'yearly') : t('månadsvis', 'monthly')}</span>
                            <span>{carePlanPrice} kr/{t('mån', 'mo')}</span>
                          </div>
                        );
                      })()}
                      <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                        <span>{t('Att betala idag', 'To pay today')}</span>
                        <span className="text-accent">{remainingAmount.toLocaleString()} kr</span>
                      </div>
                      {selectedCarePlan && (
                        <p className="text-xs text-muted-foreground pt-1">
                          {t('+ vårdplan debiteras månatligen efter webbplatsen är klar', '+ care plan billed monthly after website is complete')}
                        </p>
                      )}
                    </div>
                  </div>
                </AnimatedSection>

                <AnimatedSection animation="fade-up" delay={450}>
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setProceedStep(2)} disabled={isProcessingPayment}>{t('Tillbaka', 'Back')}</Button>
                    <Button size="lg" onClick={handleProceedSubmit} className="flex-1" disabled={isProcessingPayment}>
                      {isProcessingPayment ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {t('Förbereder betalning...', 'Preparing payment...')}
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 mr-2" />
                          {t('Betala med Stripe', 'Pay with Stripe')} ({remainingAmount.toLocaleString()} kr)
                        </>
                      )}
                    </Button>
                  </div>
                </AnimatedSection>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Initial choice screen with concept link requirement
  return (
    <div className="section-padding py-20">
      <div className="container-narrow">
        <AnimatedSection animation="fade-up" className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            {t('Har du fått ditt koncept?', 'Have you received your concept?')}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t('Välj hur du vill gå vidare.', 'Choose how you want to proceed.')}
          </p>
        </AnimatedSection>

        {/* Concept Link - Required */}
        <AnimatedSection animation="fade-up" delay={50} className="max-w-md mx-auto mb-8">
          <div className={`p-6 bg-secondary/50 rounded-xl border-2 ${conceptLinkError ? 'border-destructive' : 'border-border'}`}>
            <div className="flex items-center gap-2 mb-3">
              <LinkIcon className="w-5 h-5 text-accent" />
              <Label className="font-medium">{t('Klistra in länken till konceptet', 'Paste the concept link')} *</Label>
              <InfoTooltip content={t('Länken du fick i mailet med ditt koncept.', 'The link you received in the email with your concept.')} />
            </div>
            <Input 
              value={conceptLink}
              onChange={(e) => { setConceptLink(e.target.value); setConceptLinkError(false); }}
              placeholder="https://..."
              className={`h-12 ${conceptLinkError ? 'border-destructive' : ''}`}
            />
            {conceptLinkError && (
              <p className="text-sm text-destructive mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {t('Ange en giltig URL', 'Enter a valid URL')}
              </p>
            )}
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <AnimatedSection animation="fade-right" delay={100}>
            <button onClick={() => handleOptionSelect('proceed')} className="w-full p-8 bg-accent/5 border-2 border-accent/30 rounded-xl text-left hover:shadow-lg hover:border-accent transition-all group">
              <div className="w-14 h-14 bg-accent/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-7 h-7 text-accent" />
              </div>
              <h2 className="font-heading font-semibold text-xl mb-2">{t('Jag gillar konceptet!', 'I love the concept!')}</h2>
              <p className="text-sm text-muted-foreground mb-4">{t('Fortsätt och bygg din webbplats.', 'Continue and build your website.')}</p>
              <span className="inline-flex items-center gap-2 text-accent font-medium text-sm">{t('Fortsätt', 'Continue')} <ArrowRight className="w-4 h-4" /></span>
            </button>
          </AnimatedSection>

          <AnimatedSection animation="fade-left" delay={200}>
            <button onClick={() => handleOptionSelect('refund')} className="w-full p-8 bg-secondary/50 border border-border rounded-xl text-left hover:border-muted-foreground transition-all group">
              <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <XCircle className="w-7 h-7 text-muted-foreground" />
              </div>
              <h2 className="font-heading font-semibold text-xl mb-2">{t('Det var inte för mig', 'It wasn\'t for me')}</h2>
              <p className="text-sm text-muted-foreground mb-4">{t('Begär återbetalning.', 'Request refund.')}</p>
              <span className="inline-flex items-center gap-2 text-muted-foreground font-medium text-sm">{t('Begär återbetalning', 'Request refund')} <ArrowRight className="w-4 h-4" /></span>
            </button>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
