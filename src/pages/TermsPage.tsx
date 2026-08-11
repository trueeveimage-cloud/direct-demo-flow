import { useLanguage } from '@/contexts/LanguageContext';
import { AnimatedSection } from '@/components/AnimatedSection';

export default function TermsPage() {
  const { t } = useLanguage();

  return (
    <div className="section-padding py-20">
      <div className="container-narrow">
        <AnimatedSection animation="fade-up">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8">{t('Villkor & Återbetalningspolicy', 'Terms & Refund Policy')}</h1>
        </AnimatedSection>

        <div className="prose prose-sm max-w-none space-y-8">
          <AnimatedSection animation="fade-up" delay={100}>
            <section>
              <h2 className="text-xl font-heading font-semibold mb-3">{t('Våra tjänster', 'Our Services')}</h2>
              <p className="text-muted-foreground">{t('Nomia erbjuder webbdesign och utvecklingstjänster för företag. Vi erbjuder två sätt att beställa: gratis koncept med verifieringsavgift eller direktbeställning med full betalning.', 'Nomia offers web design and development services for businesses. We offer two ways to order: free concept with verification fee or direct checkout with full payment.')}</p>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={150}>
            <section>
              <h2 className="text-xl font-heading font-semibold mb-3">{t('Gratis koncept', 'Free Concept')}</h2>
              <p className="text-muted-foreground mb-2">{t('Vid gratis koncept betalar du en återbetalningsbar verifieringsavgift på €50. Du får ett skräddarsytt webbkoncept inom 72 timmar efter betalning.', 'For free concept, you pay a refundable verification fee of €50. You receive a custom website concept within 72 hours after payment.')}</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-3">
                <li><strong>{t('Endast 10 platser tillgängliga per vecka.', 'Only 10 spots available per week.')}</strong> {t('Begränsat antal för att säkerställa kvalitet.', 'Limited to ensure quality.')}</li>
                <li>{t('Avgiften återbetalas helt om du avvisar konceptet inom 5 dagar efter leverans.', 'The fee is fully refunded if you reject the concept within 5 days after delivery.')}</li>
                <li>{t('Om du går vidare dras avgiften från slutpriset.', 'If you proceed, the fee is deducted from the final price.')}</li>
                <li>{t('Vid begäran om extra arbete utöver demo-omfattningen kan återbetalning ej garanteras.', 'If you request extra work beyond the demo scope, refund may not be guaranteed.')}</li>
                <li>{t('Om vi inte hör från dig på 14 dagar pausas projektet.', 'If we don\'t hear from you for 14 days, the project is paused.')}</li>
                <li><strong>{t('Förhandsvisningen av konceptet försvinner efter 7 dagar.', 'The concept preview will disappear after 7 days.')}</strong> {t('Fatta beslut inom denna period.', 'Make your decision within this period.')}</li>
              </ul>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={200}>
            <section>
              <h2 className="text-xl font-heading font-semibold mb-3">{t('Direktbeställning', 'Direct Checkout')}</h2>
              <p className="text-muted-foreground">{t('Vid direktbeställning betalar du hela paketet direkt och vi börjar bygga din webbplats omedelbart. Denna betalning är inte återbetalningsbar när arbetet har påbörjats.', 'With direct checkout, you pay the full package upfront and we start building your website immediately. This payment is non-refundable once work has begun.')}</p>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={250}>
            <section>
              <h2 className="text-xl font-heading font-semibold mb-3">{t('Webbpaket (med 25% rabatt)', 'Website Packages (with 25% off)')}</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span><strong>Starter:</strong> 2 900 kr / $290 <span className="line-through text-muted-foreground/60">(3 900 kr / $390)</span> — {t('Upp till 3 sidor, 7 dagars leverans, 1 revision', 'Up to 3 pages, 7-day delivery, 1 revision')}</li>
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span><strong>Standard:</strong> 5 900 kr / $590 <span className="line-through text-muted-foreground/60">(7 900 kr / $790)</span> — {t('Upp till 5 sidor, 7 dagars leverans, 2 revisioner, flerspråk', 'Up to 5 pages, 7-day delivery, 2 revisions, multi-language')}</li>
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span><strong>Pro:</strong> 12 900 kr / $1,290 <span className="line-through text-muted-foreground/60">(16 900 kr / $1,690)</span> — {t('Obegränsade sidor, 7 dagars leverans, obegränsade revisioner, flerspråk, bokningssystem, Google Analytics', 'Unlimited pages, 7-day delivery, unlimited revisions, multi-language, booking system, Google Analytics')}</li>
              </ul>
              <p className="text-muted-foreground mt-3">{t('Tillägg: Bokningssystem +2 000 kr/$200 (ingår i Pro), Adminpanel +1 000 kr/$100, Kassasystem +500 kr/$50 (ingår i Standard & Pro).', 'Add-ons: Booking system +2,000 kr/$200 (included in Pro), Admin panel +1,000 kr/$100, Checkout system +500 kr/$50 (included in Standard & Pro).')}</p>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={300}>
            <section>
              <h2 className="text-xl font-heading font-semibold mb-3">{t('Månatlig webbvård', 'Monthly Care Plans')}</h2>
              <p className="text-muted-foreground mb-3">{t('Webbvårdsplaner faktureras separat som återkommande prenumerationer (månadsvis eller årsvis).', 'Care plans are billed separately as recurring subscriptions (monthly or yearly).')}</p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span><strong>Basic:</strong> 250 kr/$25 {t('per mån', 'per mo')} (2 400 kr/$240 {t('per år', 'per yr')} — {t('spara 20%', 'save 20%')}) — {t('Hosting, uppdateringar, säkerhetskopiering', 'Hosting, updates, backups')}</li>
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span><strong>Aktiv:</strong> 450 kr/$45 {t('per mån', 'per mo')} (4 320 kr/$432 {t('per år', 'per yr')} — {t('spara 20%', 'save 20%')}) — {t('Allt i Basic + domän, e-post, 1h ändringar/mån', 'Everything in Basic + domain, email, 1h edits/month')}</li>
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span><strong>Pro:</strong> 750 kr/$75 {t('per mån', 'per mo')} (7 200 kr/$720 {t('per år', 'per yr')} — {t('spara 20%', 'save 20%')}) — {t('Allt i Aktiv + 3h ändringar/mån, prioriterad support', 'Everything in Aktiv + 3h edits/month, priority support')}</li>
              </ul>
              <p className="text-muted-foreground mt-3">{t('Vårdplaner kan avslutas när som helst med 30 dagars uppsägning.', 'Care plans can be cancelled anytime with 30 days notice.')}</p>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={350}>
            <section>
              <h2 className="text-xl font-heading font-semibold mb-3">{t('Leveranstider', 'Delivery Times')}</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span>{t('Gratis koncept: 72 timmar efter betald verifieringsavgift (500 kr / $50)', 'Free concept: 72 hours after paid verification fee (500 kr / $50)')}</li>
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span>{t('Alla webbpaket: 7 arbetsdagar', 'All website packages: 7 business days')}</li>
              </ul>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={400}>
            <section>
              <h2 className="text-xl font-heading font-semibold mb-3">{t('Moms och betalning (VAT)', 'VAT and Payment')}</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span>{t('Alla priser anges i SEK (svenska kronor) eller USD (dollar).', 'All prices are in SEK (Swedish kronor) or USD (dollars).')}</li>
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span>{t('Svenska kunder: 25% moms tillkommer.', 'Swedish customers: 25% VAT applies.')}</li>
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span>{t('Internationella kunder: Ingen moms tillämpas.', 'International customers: No VAT applied.')}</li>
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span>{t('Betalningar hanteras säkert via Stripe.', 'Payments are securely handled via Stripe.')}</li>
              </ul>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={450}>
            <section>
              <h2 className="text-xl font-heading font-semibold mb-3">{t('Material och innehåll', 'Materials and Content')}</h2>
              <p className="text-muted-foreground">{t('Efter beställning får du en länk för att ladda upp bilder, logotyp och annat material. Du ansvarar för att du har rätt att använda allt material du tillhandahåller.', 'After ordering, you\'ll receive a link to upload images, logo and other materials. You are responsible for ensuring you have the rights to use all materials you provide.')}</p>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={475}>
            <section>
              <h2 className="text-xl font-heading font-semibold mb-3">{t('Domäner', 'Domains')}</h2>
              <p className="text-muted-foreground">{t('Om vi köper och registrerar en domän åt dig hanteras domänen av oss. Alla ändringar av domänen – inklusive DNS-inställningar, e-postposter, omdirigeringar, förnyelser och överföringar – utförs uteslutande genom våra tjänster. Du kan när som helst begära ändringar eller en överföring av domänen till dig, och vi genomför den enligt gällande registrarregler.', 'If we purchase and register a domain on your behalf, the domain is managed by us. All changes to that domain — including DNS settings, email records, redirects, renewals and transfers — are carried out exclusively through our services. You may request changes or a transfer of the domain to you at any time, and we will process it in accordance with applicable registrar rules.')}</p>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={500}>
            <section>
              <h2 className="text-xl font-heading font-semibold mb-3">{t('Allmänna villkor', 'General Terms')}</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span>{t('Vi förbehåller oss rätten att avböja projekt som inte passar vårt arbetssätt.', 'We reserve the right to decline projects that don\'t fit our workflow.')}</li>
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span>{t('Dessa villkor kan uppdateras. Den senaste versionen gäller alltid.', 'These terms may be updated. The latest version always applies.')}</li>
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span>{t('Vid inaktivitet i 14 dagar pausas projektet. Kontakta oss för att återuppta.', 'If inactive for 14 days, the project is paused. Contact us to resume.')}</li>
              </ul>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={550}>
            <section className="pt-8 border-t border-border">
              <p className="text-muted-foreground">{t('Har du frågor om våra villkor? Kontakta oss på nordicsite.help@gmail.com', 'Questions about our terms? Contact us at nordicsite.help@gmail.com')}</p>
              <p className="text-sm text-muted-foreground mt-4">{t('Senast uppdaterad:', 'Last updated:')} 2026-02-18</p>
            </section>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
