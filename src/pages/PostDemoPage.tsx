import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2, XCircle, FileText, Star, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { AnimatedSection } from '@/components/AnimatedSection';
import { toast } from '@/hooks/use-toast';
import { setVerificationPaid } from '@/config/stripe';
import { WebsiteOrderWizard } from '@/components/wizard';

export default function PostDemoPage() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [selectedOption, setSelectedOption] = useState<'proceed' | 'refund' | null>(null);
  const [conceptLink, setConceptLink] = useState('');
  const [conceptLinkError, setConceptLinkError] = useState(false);
  
  // Refund flow state
  const [refundStep, setRefundStep] = useState(1);
  const [wantsRevision, setWantsRevision] = useState<boolean | null>(null);
  const [revisionFeedback, setRevisionFeedback] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackReasons, setFeedbackReasons] = useState<string[]>([]);
  const [feedbackStyleCorrect, setFeedbackStyleCorrect] = useState<boolean | null>(null);
  const [feedbackMissing, setFeedbackMissing] = useState('');
  const [feedbackImprove, setFeedbackImprove] = useState('');
  
  useEffect(() => {
    const success = searchParams.get('success');
    if (success === 'true') {
      setVerificationPaid();
    }
  }, [searchParams]);

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

  // If user chose to proceed, show the shared wizard
  if (selectedOption === 'proceed') {
    return <WebsiteOrderWizard isPostDemoFlow={true} conceptLink={conceptLink} />;
  }

  // Refund Flow
  if (selectedOption === 'refund') {
    // Refund confirmed
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

    // Revision request submitted
    if (refundStep === 2 && wantsRevision) {
      return (
        <div className="section-padding py-20">
          <div className="container-narrow text-center">
            <AnimatedSection animation="scale-in">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-accent" />
              </div>
              <h1 className="text-3xl font-bold mb-4">{t('Revisionsbegäran mottagen!', 'Revision request received!')}</h1>
              <p className="text-muted-foreground mb-8">{t('Vi återkommer inom 48 timmar med ett uppdaterat koncept.', 'We\'ll get back to you within 48 hours with an updated concept.')}</p>
              <Button asChild><Link to="/">{t('Tillbaka till start', 'Back to home')}</Link></Button>
            </AnimatedSection>
          </div>
        </div>
      );
    }

    // Refund feedback form
    if (refundStep === 2 && !wantsRevision) {
      return (
        <div className="section-padding py-12">
          <div className="container-narrow">
            <AnimatedSection animation="fade-up" className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t('Återbetalning', 'Refund')}</h1>
              <p className="text-muted-foreground">{t('Hjälp oss förbättra genom att svara på några frågor.', 'Help us improve by answering a few questions.')}</p>
            </AnimatedSection>

            <div className="space-y-6 max-w-lg mx-auto">
              <div className="p-6 bg-secondary/50 rounded-xl space-y-6">
                <div className="space-y-2">
                  <Label>{t('Betygsätt konceptet 1-5', 'Rate the concept 1-5')} *</Label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(n => (
                      <button key={n} onClick={() => setFeedbackRating(n)} className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all ${feedbackRating >= n ? 'bg-accent text-accent-foreground border-accent' : 'border-border hover:border-accent/50'}`}>
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
                      <button key={reason.en} onClick={() => toggleFeedbackReason(reason.en)} className={`p-3 text-sm rounded-lg border-2 transition-all ${feedbackReasons.includes(reason.en) ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/50'}`}>
                        {t(reason.sv, reason.en)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t('Var stilriktningen korrekt?', 'Was the style direction correct?')} *</Label>
                  <div className="flex gap-4">
                    <button onClick={() => setFeedbackStyleCorrect(true)} className={`px-6 py-3 rounded-lg border-2 transition-all ${feedbackStyleCorrect === true ? 'border-accent bg-accent/10' : 'border-border'}`}>{t('Ja', 'Yes')}</button>
                    <button onClick={() => setFeedbackStyleCorrect(false)} className={`px-6 py-3 rounded-lg border-2 transition-all ${feedbackStyleCorrect === false ? 'border-accent bg-accent/10' : 'border-border'}`}>{t('Nej', 'No')}</button>
                  </div>
                </div>

                <Input value={feedbackMissing} onChange={(e) => setFeedbackMissing(e.target.value)} placeholder={t('Saknade funktioner? (valfritt)', 'Missing features? (optional)')} className="h-12" />
                <Textarea value={feedbackImprove} onChange={(e) => setFeedbackImprove(e.target.value)} placeholder={t('Vad skulle göra det acceptabelt? (valfritt)', 'What would make it acceptable? (optional)')} rows={3} />
              </div>

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
                    await fetch('https://getform.io/f/agdvpmpb', { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } });
                  } catch {}
                  setRefundStep(3);
                }} className="flex-1">{t('Skicka begäran', 'Submit request')}</Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Step 1: Revision or refund choice
    return (
      <div className="section-padding py-12">
        <div className="container-narrow">
          <AnimatedSection animation="fade-up" className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t('Inte helt nöjd?', 'Not fully satisfied?')}</h1>
            <p className="text-muted-foreground">{t('Vi vill att du ska bli nöjd! Låt oss göra ändringar innan du bestämmer dig.', 'We want you to be happy! Let us make changes before you decide.')}</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-8">
            <button onClick={() => setWantsRevision(true)} className={`w-full p-8 rounded-xl border-2 text-left transition-all relative ${wantsRevision === true ? 'border-accent bg-accent/10 shadow-lg' : 'border-accent/50 bg-accent/5 hover:border-accent'}`}>
              <span className="absolute -top-3 left-4 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded">{t('Rekommenderas', 'Recommended')}</span>
              <div className="w-14 h-14 bg-accent/20 rounded-full flex items-center justify-center mb-4"><FileText className="w-7 h-7 text-accent" /></div>
              <h2 className="font-semibold text-xl mb-2">{t('Gör ändringar', 'Request changes')}</h2>
              <p className="text-sm text-muted-foreground">{t('Berätta vad du vill ändra så uppdaterar vi konceptet utan extra kostnad.', 'Tell us what to change and we\'ll update the concept at no extra cost.')}</p>
            </button>

            <button onClick={() => setWantsRevision(false)} className={`w-full p-8 rounded-xl border-2 text-left transition-all ${wantsRevision === false ? 'border-muted-foreground bg-secondary shadow-lg' : 'border-border bg-secondary/50 hover:border-muted-foreground'}`}>
              <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mb-4"><XCircle className="w-7 h-7 text-muted-foreground" /></div>
              <h2 className="font-semibold text-xl mb-2">{t('Begär återbetalning', 'Request refund')}</h2>
              <p className="text-sm text-muted-foreground">{t('Full återbetalning inom 7 arbetsdagar.', 'Full refund within 7 business days.')}</p>
            </button>
          </div>

          {wantsRevision === true && (
            <div className="max-w-lg mx-auto space-y-6">
              <div className="p-6 bg-secondary/50 rounded-xl">
                <Label>{t('Beskriv ändringarna du vill ha', 'Describe the changes you want')} *</Label>
                <Textarea value={revisionFeedback} onChange={(e) => setRevisionFeedback(e.target.value)} placeholder={t('Exempelvis: Jag vill ha andra färger...', 'For example: I want different colors...')} rows={5} className="mt-2" />
              </div>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setWantsRevision(null)}>{t('Avbryt', 'Cancel')}</Button>
                <Button onClick={async () => {
                  if (!revisionFeedback.trim()) { toast({ title: t('Beskriv ändringarna', 'Describe the changes'), variant: 'destructive' }); return; }
                  try {
                    const formData = new FormData();
                    formData.append('form_type', 'Revision Request');
                    formData.append('concept_link', conceptLink);
                    formData.append('revision_feedback', revisionFeedback);
                    await fetch('https://getform.io/f/agdvpmpb', { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } });
                  } catch {}
                  setRefundStep(2);
                }} className="flex-1">{t('Skicka ändringsförslag', 'Submit change request')} <ArrowRight className="w-4 h-4 ml-2" /></Button>
              </div>
            </div>
          )}

          {wantsRevision === false && (
            <div className="max-w-lg mx-auto flex gap-4">
              <Button variant="outline" onClick={() => setWantsRevision(null)}>{t('Avbryt', 'Cancel')}</Button>
              <Button onClick={() => setRefundStep(2)} className="flex-1" variant="secondary">{t('Fortsätt till återbetalning', 'Continue to refund')}</Button>
            </div>
          )}

          <div className="mt-8 text-center">
            <Button variant="ghost" onClick={() => setSelectedOption(null)}>{t('← Tillbaka', '← Back')}</Button>
          </div>
        </div>
      </div>
    );
  }

  // Initial page - concept link input
  return (
    <div className="section-padding py-20">
      <div className="container-narrow text-center">
        <AnimatedSection animation="fade-up">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl sm:text-4xl font-bold mb-4">
            {t('Har du fått ditt koncept?', 'Have you received your concept?')}
          </motion.h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {t('Klistra in länken till ditt koncept för att fortsätta.', 'Paste the link to your concept to continue.')}
          </p>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={100}>
          <div className="max-w-md mx-auto mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Label>{t('Konceptlänk', 'Concept link')} *</Label>
              {conceptLinkError && <AlertCircle className="w-4 h-4 text-destructive" />}
            </div>
            <Input
              value={conceptLink}
              onChange={(e) => { setConceptLink(e.target.value); setConceptLinkError(false); }}
              placeholder="https://..."
              className={`h-14 text-center ${conceptLinkError ? 'border-destructive' : ''}`}
            />
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={200}>
          <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto">
            <Button size="lg" onClick={() => handleOptionSelect('proceed')} className="h-16">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              {t('Jag gillar konceptet', 'I like the concept')}
            </Button>
            <Button size="lg" variant="outline" onClick={() => handleOptionSelect('refund')} className="h-16">
              <XCircle className="w-5 h-5 mr-2" />
              {t('Inte nöjd', 'Not satisfied')}
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
