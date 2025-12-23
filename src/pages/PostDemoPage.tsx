import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, RefreshCcw, XCircle, ChevronDown, ChevronUp, Check, Star, Mail, Globe, FileText, Users, Search, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';
import { AnimatedSection } from '@/components/AnimatedSection';
import { toast } from '@/hooks/use-toast';

const packages = [
  { id: 'starter', name: 'Starter', price: '4 900 kr', pages: { sv: 'Upp till 3 sidor', en: 'Up to 3 pages' }, features: { sv: ['Responsiv design', 'Mobil-först', 'Kontaktformulär', 'SEO-grundläggande', '1 revision'], en: ['Responsive design', 'Mobile-first', 'Contact form', 'Basic SEO', '1 revision'] } },
  { id: 'standard', name: 'Standard', price: '7 900 kr', pages: { sv: 'Upp till 5 sidor', en: 'Up to 5 pages' }, popular: true, features: { sv: ['Allt i Starter', '2 revisioner', 'Google Maps', 'Sociala medier', 'Bildgalleri'], en: ['Everything in Starter', '2 revisions', 'Google Maps', 'Social media', 'Image gallery'] } },
  { id: 'pro', name: 'Pro', price: '12 900 kr', pages: { sv: 'Upp till 8 sidor', en: 'Up to 8 pages' }, features: { sv: ['Allt i Standard', '3 revisioner', 'Bokningsintegration', 'Nyhetsbrev', 'Google Analytics', 'Prioriterad support'], en: ['Everything in Standard', '3 revisions', 'Booking integration', 'Newsletter', 'Google Analytics', 'Priority support'] } },
];

const carePlans = [
  { id: 'basic', name: 'Basic', price: '249 kr/mån', features: { sv: ['Hosting', 'Uppdateringar', 'Säkerhetskopiering'], en: ['Hosting', 'Updates', 'Backups'] } },
  { id: 'standard', name: 'Standard', price: '449 kr/mån', popular: true, features: { sv: ['Allt i Basic', 'Domän ingår', 'Företagsmail', '1h ändringar/mån'], en: ['Everything in Basic', 'Domain included', 'Business email', '1h edits/month'] } },
  { id: 'pro', name: 'Pro', price: '749 kr/mån', features: { sv: ['Allt i Standard', '3h ändringar/mån', 'Prioriterad support'], en: ['Everything in Standard', '3h edits/month', 'Priority support'] } },
];

export default function PostDemoPage() {
  const { t, lang } = useLanguage();
  const [selectedOption, setSelectedOption] = useState<'proceed' | 'refund' | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<string>('standard');
  const [selectedCarePlan, setSelectedCarePlan] = useState<string | null>('standard');
  const [expandedPackage, setExpandedPackage] = useState<string | null>(null);
  const [expandedCarePlan, setExpandedCarePlan] = useState<string | null>(null);
  
  // Refund flow state
  const [refundStep, setRefundStep] = useState(1);
  const [refundEmail, setRefundEmail] = useState('');
  const [refundWebsite, setRefundWebsite] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackReasons, setFeedbackReasons] = useState<string[]>([]);
  const [feedbackStyleCorrect, setFeedbackStyleCorrect] = useState<boolean | null>(null);
  const [feedbackMissing, setFeedbackMissing] = useState('');
  const [feedbackImprove, setFeedbackImprove] = useState('');

  // Proceed flow state
  const [proceedStep, setProceedStep] = useState(1);
  const [pageNotes, setPageNotes] = useState('');
  const [brandPreferences, setBrandPreferences] = useState('');
  const [competitors, setCompetitors] = useState('');
  const [copywritingNeeds, setCopywritingNeeds] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [bookingDetails, setBookingDetails] = useState('');
  const [imageReferences, setImageReferences] = useState('');
  const [legalPages, setLegalPages] = useState<string[]>([]);
  const [selectedLanguageProceed, setSelectedLanguageProceed] = useState('sv');

  const pkg = packages.find(p => p.id === selectedPackage);
  const care = carePlans.find(c => c.id === selectedCarePlan);

  const toggleFeedbackReason = (reason: string) => {
    if (feedbackReasons.includes(reason)) {
      setFeedbackReasons(feedbackReasons.filter(r => r !== reason));
    } else {
      setFeedbackReasons([...feedbackReasons, reason]);
    }
  };

  const handleRefundSubmit = () => {
    if (!refundEmail || !refundWebsite) {
      toast({ title: t('Fyll i alla fält', 'Fill in all fields'), variant: 'destructive' });
      return;
    }
    if (feedbackRating === 0 || feedbackReasons.length === 0 || feedbackStyleCorrect === null) {
      toast({ title: t('Besvara alla frågor', 'Answer all questions'), variant: 'destructive' });
      return;
    }
    setRefundStep(3);
  };

  // Refund Flow
  if (selectedOption === 'refund') {
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

    return (
      <div className="section-padding py-12">
        <div className="container-narrow">
          <AnimatedSection animation="fade-up" className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t('Återbetalning', 'Refund')}</h1>
            <p className="text-muted-foreground">{t('Hjälp oss förbättra genom att svara på några frågor.', 'Help us improve by answering a few questions.')}</p>
          </AnimatedSection>

          <div className="space-y-6 max-w-lg mx-auto">
            {/* Required info */}
            <AnimatedSection animation="fade-up" delay={100}>
              <div className="space-y-4 p-6 bg-secondary/50 rounded-xl">
                <div className="space-y-2">
                  <Label>{t('Gmail-adress', 'Gmail address')} *</Label>
                  <Input value={refundEmail} onChange={(e) => setRefundEmail(e.target.value)} type="email" placeholder="namn@gmail.com" className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label>{t('Webbplats/sociala medier', 'Website/social media')} *</Label>
                  <Input value={refundWebsite} onChange={(e) => setRefundWebsite(e.target.value)} placeholder="instagram.com/..." className="h-12" />
                </div>
              </div>
            </AnimatedSection>

            {/* Feedback questions */}
            <AnimatedSection animation="fade-up" delay={200}>
              <div className="space-y-6 p-6 bg-secondary/50 rounded-xl">
                {/* Rating */}
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

                {/* Reasons */}
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

                {/* Style correct */}
                <div className="space-y-2">
                  <Label>{t('Var stilriktningen korrekt?', 'Was the style direction correct?')} *</Label>
                  <div className="flex gap-4">
                    <button type="button" onClick={() => setFeedbackStyleCorrect(true)} className={`px-6 py-3 rounded-lg border-2 transition-all ${feedbackStyleCorrect === true ? 'border-accent bg-accent/10' : 'border-border'}`}>{t('Ja', 'Yes')}</button>
                    <button type="button" onClick={() => setFeedbackStyleCorrect(false)} className={`px-6 py-3 rounded-lg border-2 transition-all ${feedbackStyleCorrect === false ? 'border-accent bg-accent/10' : 'border-border'}`}>{t('Nej', 'No')}</button>
                  </div>
                </div>

                {/* Missing */}
                <div className="space-y-2">
                  <Label>{t('Saknade funktioner?', 'Missing features?')}</Label>
                  <Input value={feedbackMissing} onChange={(e) => setFeedbackMissing(e.target.value)} placeholder={t('Valfritt...', 'Optional...')} className="h-12" />
                </div>

                {/* Improve */}
                <div className="space-y-2">
                  <Label>{t('Vad skulle göra det acceptabelt?', 'What would make it acceptable?')}</Label>
                  <Textarea value={feedbackImprove} onChange={(e) => setFeedbackImprove(e.target.value)} placeholder={t('Valfritt...', 'Optional...')} rows={3} />
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={300}>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setSelectedOption(null)}>{t('Avbryt', 'Cancel')}</Button>
                <Button onClick={handleRefundSubmit} className="flex-1">{t('Skicka begäran', 'Submit request')}</Button>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    );
  }

  // Proceed Flow - Deeper form
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
              <p className="text-lg font-medium text-accent mb-8">{t('Vi levererar webbplatser inom 7 dagar beroende på paket.', 'We deliver websites within 7 days depending on package.')}</p>
              <Button asChild><Link to="/">{t('Tillbaka till start', 'Back to home')}</Link></Button>
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
                  <button onClick={() => setProceedStep(step.num)} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${proceedStep === step.num ? 'bg-accent text-accent-foreground' : proceedStep > step.num ? 'bg-accent/20 text-accent' : 'bg-secondary text-muted-foreground'}`}>
                    <span className="w-6 h-6 rounded-full bg-background/20 flex items-center justify-center text-sm font-bold">{proceedStep > step.num ? <Check className="w-4 h-4" /> : step.num}</span>
                    <span className="text-sm font-medium hidden sm:inline">{step.label}</span>
                  </button>
                  {index < 2 && <div className="w-8 h-0.5 bg-border hidden sm:block" />}
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Step 1: Package */}
          {proceedStep === 1 && (
            <div>
              <AnimatedSection animation="fade-up" className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t('Välj paket', 'Choose package')}</h1>
              </AnimatedSection>
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {packages.map((p, index) => (
                  <AnimatedSection key={p.id} animation="fade-up" delay={index * 100}>
                    <button onClick={() => setSelectedPackage(p.id)} className={`w-full p-6 rounded-xl border-2 text-left transition-all relative ${selectedPackage === p.id ? 'border-accent bg-accent/5 shadow-lg' : 'border-border hover:border-accent/50'}`}>
                      {p.popular && <span className="absolute -top-3 left-4 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded">{t('Populärast', 'Popular')}</span>}
                      <h3 className="font-semibold text-xl mb-1">{p.name}</h3>
                      <p className="text-2xl font-bold text-accent mb-1">{p.price}</p>
                      <p className="text-sm text-muted-foreground mb-4">{lang === 'sv' ? p.pages.sv : p.pages.en}</p>
                      <button type="button" onClick={(e) => { e.stopPropagation(); setExpandedPackage(expandedPackage === p.id ? null : p.id); }} className="text-sm text-accent hover:underline flex items-center gap-1">
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
              <AnimatedSection animation="fade-up" className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t('Lägg till månatlig webbvård?', 'Add monthly care?')}</h1>
                <p className="text-muted-foreground">{t('Avsluta när du vill.', 'Cancel anytime.')}</p>
              </AnimatedSection>
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
                {carePlans.map((c, index) => (
                  <AnimatedSection key={c.id} animation="fade-up" delay={index * 100}>
                    <button onClick={() => setSelectedCarePlan(selectedCarePlan === c.id ? null : c.id)} className={`w-full p-6 rounded-xl border-2 text-left transition-all relative ${selectedCarePlan === c.id ? 'border-accent bg-accent/5 shadow-lg' : 'border-border hover:border-accent/50'}`}>
                      {c.popular && <span className="absolute -top-3 left-4 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded">{t('Rekommenderas', 'Recommended')}</span>}
                      <h3 className="font-semibold text-xl mb-1">{c.name}</h3>
                      <p className="text-xl font-bold text-accent mb-4">{c.price}</p>
                      <ul className="space-y-2">
                        {(lang === 'sv' ? c.features.sv : c.features.en).map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm"><Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />{f}</li>
                        ))}
                      </ul>
                    </button>
                  </AnimatedSection>
                ))}
              </div>
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={() => setProceedStep(1)}>{t('Tillbaka', 'Back')}</Button>
                <Button size="lg" onClick={() => setProceedStep(3)}>{t('Fortsätt', 'Continue')} <ArrowRight className="w-4 h-4" /></Button>
              </div>
            </div>
          )}

          {/* Step 3: Detailed form - deeper than concept */}
          {proceedStep === 3 && (
            <div className="max-w-2xl mx-auto">
              <AnimatedSection animation="fade-up" className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t('Projektdetaljer', 'Project details')}</h1>
              </AnimatedSection>

              <div className="space-y-6">
                <AnimatedSection animation="fade-up" delay={100}>
                  <div className="p-6 bg-secondary/50 rounded-xl space-y-4">
                    <div className="flex items-center gap-2 mb-4"><FileText className="w-5 h-5 text-accent" /><h3 className="font-semibold">{t('Sidstruktur & anteckningar', 'Page structure & notes')}</h3></div>
                    <Textarea value={pageNotes} onChange={(e) => setPageNotes(e.target.value)} placeholder={t('Beskriv varje sida och vad den ska innehålla...', 'Describe each page and what it should contain...')} rows={4} />
                  </div>
                </AnimatedSection>

                <AnimatedSection animation="fade-up" delay={150}>
                  <div className="p-6 bg-secondary/50 rounded-xl space-y-4">
                    <div className="flex items-center gap-2 mb-4"><Palette className="w-5 h-5 text-accent" /><h3 className="font-semibold">{t('Varumärkespreferenser', 'Brand preferences')}</h3></div>
                    <Textarea value={brandPreferences} onChange={(e) => setBrandPreferences(e.target.value)} placeholder={t('Färger, typsnitt, ton...', 'Colors, fonts, tone...')} rows={3} />
                  </div>
                </AnimatedSection>

                <AnimatedSection animation="fade-up" delay={200}>
                  <div className="p-6 bg-secondary/50 rounded-xl space-y-4">
                    <div className="flex items-center gap-2 mb-4"><Users className="w-5 h-5 text-accent" /><h3 className="font-semibold">{t('Konkurrenter', 'Competitors')}</h3></div>
                    <Input value={competitors} onChange={(e) => setCompetitors(e.target.value)} placeholder={t('Webbplatser du gillar eller konkurrenter...', 'Websites you like or competitors...')} />
                  </div>
                </AnimatedSection>

                <AnimatedSection animation="fade-up" delay={250}>
                  <div className="p-6 bg-secondary/50 rounded-xl space-y-4">
                    <div className="flex items-center gap-2 mb-4"><Search className="w-5 h-5 text-accent" /><h3 className="font-semibold">{t('SEO & sökord', 'SEO & keywords')}</h3></div>
                    <Input value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} placeholder={t('Sökord, lokalområde...', 'Keywords, local area...')} />
                  </div>
                </AnimatedSection>

                <AnimatedSection animation="fade-up" delay={300}>
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

                <AnimatedSection animation="fade-up" delay={350}>
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

                <AnimatedSection animation="fade-up" delay={400}>
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setProceedStep(2)}>{t('Tillbaka', 'Back')}</Button>
                    <Button size="lg" onClick={() => setProceedStep(4)} className="flex-1">{t('Skicka beställning', 'Submit order')} <ArrowRight className="w-4 h-4" /></Button>
                  </div>
                </AnimatedSection>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Initial choice screen
  return (
    <div className="section-padding py-20">
      <div className="container-narrow">
        <AnimatedSection animation="fade-up" className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            {t('Har du fått ditt koncept?', 'Have you received your concept?')}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t('Välj hur du vill gå vidare.', 'Choose how you want to proceed.')}
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <AnimatedSection animation="fade-right" delay={100}>
            <button onClick={() => setSelectedOption('proceed')} className="w-full p-8 bg-accent/5 border-2 border-accent/30 rounded-xl text-left hover:shadow-lg hover:border-accent transition-all group">
              <div className="w-14 h-14 bg-accent/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-7 h-7 text-accent" />
              </div>
              <h2 className="font-heading font-semibold text-xl mb-2">{t('Jag gillar konceptet!', 'I love the concept!')}</h2>
              <p className="text-sm text-muted-foreground mb-4">{t('Fortsätt och bygg din webbplats.', 'Continue and build your website.')}</p>
              <span className="inline-flex items-center gap-2 text-accent font-medium text-sm">{t('Fortsätt', 'Continue')} <ArrowRight className="w-4 h-4" /></span>
            </button>
          </AnimatedSection>

          <AnimatedSection animation="fade-left" delay={200}>
            <button onClick={() => setSelectedOption('refund')} className="w-full p-8 bg-secondary/50 border border-border rounded-xl text-left hover:border-muted-foreground transition-all group">
              <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <XCircle className="w-7 h-7 text-muted-foreground" />
              </div>
              <h2 className="font-heading font-semibold text-xl mb-2">{t('Det var inte för mig', 'It wasn\'t for me')}</h2>
              <p className="text-sm text-muted-foreground mb-4">{t('Begär återbetalning inom 7 dagar.', 'Request refund within 7 days.')}</p>
              <span className="inline-flex items-center gap-2 text-muted-foreground font-medium text-sm">{t('Begär återbetalning', 'Request refund')} <ArrowRight className="w-4 h-4" /></span>
            </button>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}

const Palette = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"/></svg>
);
