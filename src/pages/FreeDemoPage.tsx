import { useState } from 'react';
import { CheckCircle2, Upload, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { AnimatedSection } from '@/components/AnimatedSection';

export default function FreeDemoPage() {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [noLogo, setNoLogo] = useState(false);
  const [useStock, setUseStock] = useState(false);
  const [confirmations, setConfirmations] = useState({
    info: false,
    fee: false,
    refund: false,
    deduct: false,
  });

  const allConfirmed = Object.values(confirmations).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allConfirmed) {
      toast({
        title: t('Bekräfta alla villkor', 'Confirm all terms'),
        description: t('Du måste bekräfta alla villkor för att fortsätta.', 'You must confirm all terms to continue.'),
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="section-padding py-20">
        <div className="container-narrow text-center">
          <AnimatedSection animation="scale-in">
            <div className="w-16 h-16 bg-accent-soft rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-3xl font-bold mb-4">
              {t('Bra jobbat!', 'Great job!')}
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {t(
                'Nu är det dags att betala 500 kr verifieringsavgift. Din demo påbörjas inom 72 timmar efter betalning.',
                'Now it\'s time to pay the 500 kr verification fee. Your demo will begin within 72 hours after payment.'
              )}
            </p>

            <div className="p-6 bg-secondary/50 rounded-lg border border-border max-w-sm mx-auto mb-8">
              <p className="font-heading font-semibold text-lg mb-2">
                {t('Verifieringsavgift', 'Verification Fee')}
              </p>
              <p className="text-3xl font-bold mb-4">500 kr</p>
              <p className="text-sm text-muted-foreground mb-4">
                {t('100% återbetalning om du inte gillar demon', '100% refund if you don\'t like the demo')}
              </p>
              <Button className="w-full" size="lg">
                {t('Betala 500 kr verifiering', 'Pay 500 kr verification')}
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              {t('Efter betalning får du en bekräftelse via e-post.', 'After payment, you\'ll receive a confirmation via email.')}
            </p>
          </AnimatedSection>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding py-12">
      <div className="container-narrow">
        <AnimatedSection animation="fade-up" className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            {t('Få din gratis webb-demo', 'Get your free website demo')}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t(
              'Fyll i all info nedan. När du skickat in formuläret visas betalningssteget (500 kr verifiering). Demon påbörjas efter betalning.',
              'Submit all info below. After submission, you\'ll see the payment step (500 kr verification). Demo starts after payment.'
            )}
          </p>
        </AnimatedSection>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* A) Contact */}
          <AnimatedSection animation="fade-up" delay={100}>
            <section className="space-y-4">
              <h2 className="font-heading font-semibold text-xl border-b border-border pb-2">
                A. {t('Kontaktuppgifter', 'Contact Information')}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">{t('Företagsnamn', 'Business Name')} *</Label>
                  <Input id="businessName" required placeholder={t('Ditt Företag AB', 'Your Company Ltd')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">{t('Kontaktperson', 'Contact Person')} *</Label>
                  <Input id="contactPerson" required placeholder="Anna Andersson" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-post *</Label>
                  <Input id="email" type="email" required placeholder="anna@foretag.se" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('Telefon', 'Phone')} *</Label>
                  <Input id="phone" type="tel" required placeholder="+46 70 123 45 67" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="location">{t('Ort / Land', 'City / Country')} *</Label>
                  <Input id="location" required placeholder="Göteborg, Sverige" />
                </div>
              </div>
            </section>
          </AnimatedSection>

          {/* B) Business Details */}
          <AnimatedSection animation="fade-up" delay={150}>
            <section className="space-y-4">
              <h2 className="font-heading font-semibold text-xl border-b border-border pb-2">
                B. {t('Om verksamheten', 'Business Details')}
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="whatYouDo">{t('Vad gör ni? (kort beskrivning)', 'What do you do? (short description)')} *</Label>
                  <Textarea id="whatYouDo" required placeholder={t('Vi driver en frisörsalong med fokus på...', 'We run a hair salon focusing on...')} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="openingHours">{t('Öppettider', 'Opening Hours')}</Label>
                    <Input id="openingHours" placeholder={t('Mån-Fre 10-18, Lör 10-15', 'Mon-Fri 10-18, Sat 10-15')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">{t('Adress', 'Address')}</Label>
                    <Input id="address" placeholder="Storgatan 1, 411 01 Göteborg" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mapsLink">Google Maps {t('länk', 'link')}</Label>
                  <Input id="mapsLink" placeholder="https://goo.gl/maps/..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="socials">{t('Sociala medier (Instagram, TikTok, Facebook)', 'Social Media (Instagram, TikTok, Facebook)')}</Label>
                  <Input id="socials" placeholder="@mittforetag" />
                </div>
              </div>
            </section>
          </AnimatedSection>

          {/* C) Brand Assets */}
          <AnimatedSection animation="fade-up" delay={200}>
            <section className="space-y-4">
              <h2 className="font-heading font-semibold text-xl border-b border-border pb-2">
                C. {t('Varumärke', 'Brand Assets')}
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{t('Logotyp', 'Logo')} *</Label>
                  {!noLogo && (
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {t('Dra och släpp eller klicka för att ladda upp', 'Drag and drop or click to upload')}
                      </p>
                      <input type="file" className="hidden" accept="image/*" />
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="noLogo"
                      checked={noLogo}
                      onCheckedChange={(checked) => setNoLogo(checked as boolean)}
                    />
                    <Label htmlFor="noLogo" className="font-normal text-sm">
                      {t('Jag har ingen logotyp', 'I don\'t have a logo')}
                    </Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="colors">{t('Färger (valfritt)', 'Colors (optional)')}</Label>
                  <Input id="colors" placeholder={t('Svart, vit, guld', 'Black, white, gold')} />
                </div>
                <div className="space-y-2">
                  <Label>{t('Stil', 'Style')} *</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {['Minimal', 'Bold', 'Luxury', 'Playful', 'Corporate'].map((style) => (
                      <label
                        key={style}
                        className="flex items-center justify-center p-3 border border-border rounded-lg cursor-pointer hover:border-accent transition-colors has-[:checked]:border-accent has-[:checked]:bg-accent-soft"
                      >
                        <input type="radio" name="style" value={style} className="sr-only" required />
                        <span className="text-sm font-medium">{style}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </AnimatedSection>

          {/* D) Content */}
          <AnimatedSection animation="fade-up" delay={250}>
            <section className="space-y-4">
              <h2 className="font-heading font-semibold text-xl border-b border-border pb-2">
                D. {t('Innehåll', 'Content')}
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="services">{t('Tjänster + priser', 'Services + prices')} *</Label>
                  <Textarea
                    id="services"
                    required
                    rows={4}
                    placeholder={t('Klippning dam: 450 kr\nKlippning herr: 350 kr\nFärgning: från 800 kr', 'Women\'s haircut: 450 kr\nMen\'s haircut: 350 kr\nColoring: from 800 kr')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aboutText">{t('Om oss (text eller punkter)', 'About us (text or bullets)')} *</Label>
                  <Textarea id="aboutText" required rows={4} placeholder={t('Berätta kort om ditt företag, er historia, vad ni står för...', 'Tell us briefly about your business, history, values...')} />
                </div>
                <div className="space-y-2">
                  <Label>{t('Foton', 'Photos')}</Label>
                  {!useStock && (
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {t('Ladda upp bilder på verksamheten', 'Upload photos of your business')}
                      </p>
                      <input type="file" className="hidden" accept="image/*" multiple />
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Checkbox id="useStock" checked={useStock} onCheckedChange={(checked) => setUseStock(checked as boolean)} />
                    <Label htmlFor="useStock" className="font-normal text-sm">{t('Använd stockbilder', 'Use stock photos')}</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reviews">{t('Recensioner / omdömen (valfritt)', 'Reviews / testimonials (optional)')}</Label>
                  <Textarea id="reviews" rows={3} placeholder={t('"Bästa frisören i stan!" - Anna K.', '"Best salon in town!" - Anna K.')} />
                </div>
              </div>
            </section>
          </AnimatedSection>

          {/* E) Website Needs */}
          <AnimatedSection animation="fade-up" delay={300}>
            <section className="space-y-4">
              <h2 className="font-heading font-semibold text-xl border-b border-border pb-2">
                E. {t('Webbplatsbehov', 'Website Needs')}
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{t('Vilka sidor vill du ha?', 'Which pages do you want?')} *</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { sv: 'Hem', en: 'Home' },
                      { sv: 'Tjänster', en: 'Services' },
                      { sv: 'Priser', en: 'Prices' },
                      { sv: 'Om oss', en: 'About' },
                      { sv: 'Galleri', en: 'Gallery' },
                      { sv: 'Kontakt', en: 'Contact' },
                      { sv: 'FAQ', en: 'FAQ' },
                      { sv: 'Hitta oss', en: 'Find us' },
                    ].map((page) => (
                      <label key={page.en} className="flex items-center gap-2 p-3 border border-border rounded-lg cursor-pointer hover:border-accent transition-colors has-[:checked]:border-accent has-[:checked]:bg-accent-soft">
                        <Checkbox />
                        <span className="text-sm">{t(page.sv, page.en)}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('Behövs bokning?', 'Need booking?')} *</Label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input type="radio" name="booking" value="yes" required />
                        <span className="text-sm">{t('Ja', 'Yes')}</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="booking" value="no" />
                        <span className="text-sm">{t('Nej', 'No')}</span>
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bookingPlatform">{t('Vilken plattform?', 'Which platform?')}</Label>
                    <Input id="bookingPlatform" placeholder="Bokadirekt, Calendly, etc." />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t('Språk på webbplatsen', 'Website language')} *</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="language" value="sv" required />
                      <span className="text-sm">{t('Svenska', 'Swedish')}</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="language" value="en" />
                      <span className="text-sm">{t('Engelska', 'English')}</span>
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialFeatures">{t('Speciella funktioner', 'Special features')}</Label>
                  <Textarea id="specialFeatures" rows={2} placeholder={t('T.ex. Instagram-flöde, Google recensioner, nyhetsbrev...', 'E.g. Instagram feed, Google reviews, newsletter...')} />
                </div>
              </div>
            </section>
          </AnimatedSection>

          {/* F) References */}
          <AnimatedSection animation="fade-up" delay={350}>
            <section className="space-y-4">
              <h2 className="font-heading font-semibold text-xl border-b border-border pb-2">
                F. {t('Referenser', 'References')}
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="likeSite1">{t('Webbplats du gillar #1', 'Website you like #1')} *</Label>
                  <Input id="likeSite1" required placeholder="https://..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="likeSite2">{t('Webbplats du gillar #2', 'Website you like #2')} *</Label>
                  <Input id="likeSite2" required placeholder="https://..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dislikeSite">{t('Webbplats du INTE gillar + varför', 'Website you dislike + why')} *</Label>
                  <Input id="dislikeSite" required placeholder="https://... - för rörig, dålig typografi..." />
                </div>
              </div>
            </section>
          </AnimatedSection>

          {/* G) Timeline */}
          <AnimatedSection animation="fade-up" delay={400}>
            <section className="space-y-4">
              <h2 className="font-heading font-semibold text-xl border-b border-border pb-2">
                G. {t('Tidslinje', 'Timeline')}
              </h2>
              <div className="space-y-2">
                <Label htmlFor="launchDate">{t('Önskat lanseringsdatum', 'Desired launch date')}</Label>
                <Input id="launchDate" type="date" />
              </div>
            </section>
          </AnimatedSection>

          {/* H) Confirmations */}
          <AnimatedSection animation="fade-up" delay={450}>
            <section className="space-y-4">
              <h2 className="font-heading font-semibold text-xl border-b border-border pb-2">
                H. {t('Bekräftelser', 'Confirmations')}
              </h2>
              <div className="space-y-3 p-4 bg-secondary/50 rounded-lg">
                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox checked={confirmations.info} onCheckedChange={(checked) => setConfirmations((prev) => ({ ...prev, info: checked as boolean }))} className="mt-0.5" />
                  <span className="text-sm">{t('Jag förstår att demon påbörjas efter att jag skickat in ALL info.', 'I understand the demo starts after I submit ALL info.')}</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox checked={confirmations.fee} onCheckedChange={(checked) => setConfirmations((prev) => ({ ...prev, fee: checked as boolean }))} className="mt-0.5" />
                  <span className="text-sm">{t('Jag förstår att jag betalar 500 kr verifiering innan arbetet startar.', 'I understand I pay 500 kr verification before work starts.')}</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox checked={confirmations.refund} onCheckedChange={(checked) => setConfirmations((prev) => ({ ...prev, refund: checked as boolean }))} className="mt-0.5" />
                  <span className="text-sm">{t('Jag förstår att 500 kr återbetalas om jag avvisar demon.', 'I understand the 500 kr is refundable if I reject the demo.')}</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox checked={confirmations.deduct} onCheckedChange={(checked) => setConfirmations((prev) => ({ ...prev, deduct: checked as boolean }))} className="mt-0.5" />
                  <span className="text-sm">{t('Jag förstår att 500 kr dras av från slutpriset om jag går vidare.', 'I understand the 500 kr is deducted from final price if I proceed.')}</span>
                </label>
              </div>
            </section>
          </AnimatedSection>

          {/* Submit */}
          <AnimatedSection animation="fade-up" delay={500}>
            <div className="pt-4">
              <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={!allConfirmed || isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('Skickar...', 'Submitting...')}
                  </>
                ) : (
                  <>
                    {t('Skicka och fortsätt till betalning', 'Submit and continue to payment')}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
              <p className="mt-3 text-sm text-muted-foreground">
                {t('Du kommer till betalningssteget efter att du skickat formuläret.', 'You\'ll proceed to payment after submitting the form.')}
              </p>
            </div>
          </AnimatedSection>
        </form>
      </div>
    </div>
  );
}
