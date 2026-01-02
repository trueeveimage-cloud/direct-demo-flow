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
              <h2 className="text-xl font-heading font-semibold mb-3">{t('Webbpaket (EUR)', 'Website Packages (EUR)')}</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span><strong>Starter:</strong> €490 — {t('Upp till 3 sidor, 14 dagars leverans, 1 revision', 'Up to 3 pages, 14-day delivery, 1 revision')}</li>
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span><strong>Standard:</strong> €790 — {t('Upp till 5 sidor, 10 dagars leverans, 2 revisioner, flerspråk', 'Up to 5 pages, 10-day delivery, 2 revisions, multi-language')}</li>
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span><strong>Pro:</strong> €1,290 — {t('Upp till 8 sidor, 7 dagars leverans, 3 revisioner, flerspråk, bokningssystem, Google Analytics', 'Up to 8 pages, 7-day delivery, 3 revisions, multi-language, booking system, Google Analytics')}</li>
              </ul>
              <p className="text-muted-foreground mt-3">{t('Tillägg: Bokningssystem €200 (ingår i Pro), Adminpanel €100.', 'Add-ons: Booking system €200 (included in Pro), Admin panel €100.')}</p>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={300}>
            <section>
              <h2 className="text-xl font-heading font-semibold mb-3">{t('Månatlig webbvård (EUR)', 'Monthly Care Plans (EUR)')}</h2>
              <p className="text-muted-foreground mb-3">{t('Webbvårdsplaner faktureras separat som återkommande prenumerationer (månadsvis eller årsvis).', 'Care plans are billed separately as recurring subscriptions (monthly or yearly).')}</p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span><strong>Basic:</strong> €25/{t('mån', 'mo')} (€240/{t('år', 'yr')} — {t('spara 20%', 'save 20%')}) — {t('Hosting, uppdateringar, säkerhetskopiering', 'Hosting, updates, backups')}</li>
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span><strong>Aktiv:</strong> €45/{t('mån', 'mo')} (€432/{t('år', 'yr')} — {t('spara 20%', 'save 20%')}) — {t('Allt i Basic + domän, e-post, 1h ändringar/mån', 'Everything in Basic + domain, email, 1h edits/month')}</li>
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span><strong>Pro:</strong> €75/{t('mån', 'mo')} (€720/{t('år', 'yr')} — {t('spara 20%', 'save 20%')}) — {t('Allt i Aktiv + 3h ändringar/mån, prioriterad support', 'Everything in Aktiv + 3h edits/month, priority support')}</li>
              </ul>
              <p className="text-muted-foreground mt-3">{t('Vårdplaner kan avslutas när som helst med 30 dagars uppsägning.', 'Care plans can be cancelled anytime with 30 days notice.')}</p>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={350}>
            <section>
              <h2 className="text-xl font-heading font-semibold mb-3">{t('Leveranstider', 'Delivery Times')}</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span>{t('Gratis koncept: 72 timmar efter betald verifieringsavgift (€50)', 'Free concept: 72 hours after paid verification fee (€50)')}</li>
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span>{t('Starter: 14 arbetsdagar', 'Starter: 14 business days')}</li>
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span>{t('Standard: 10 arbetsdagar', 'Standard: 10 business days')}</li>
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span>{t('Pro: 7 arbetsdagar', 'Pro: 7 business days')}</li>
              </ul>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={400}>
            <section>
              <h2 className="text-xl font-heading font-semibold mb-3">{t('Moms och betalning (VAT)', 'VAT and Payment')}</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span>{t('Alla priser anges i EUR (euro).', 'All prices are in EUR (euros).')}</li>
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span>{t('Privatpersoner och svenska företag: 25% moms tillkommer.', 'Private individuals and Swedish businesses: 25% VAT applies.')}</li>
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span>{t('EU-företag med giltigt VAT-nummer: Omvänd moms (0%).', 'EU businesses with valid VAT number: Reverse charge (0%).')}</li>
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span>{t('Betalningar hanteras säkert via Stripe. Klarna delbetalning tillgänglig.', 'Payments are securely handled via Stripe. Klarna installments available.')}</li>
              </ul>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={450}>
            <section>
              <h2 className="text-xl font-heading font-semibold mb-3">{t('Material och innehåll', 'Materials and Content')}</h2>
              <p className="text-muted-foreground">{t('Efter beställning får du en länk för att ladda upp bilder, logotyp och annat material. Du ansvarar för att du har rätt att använda allt material du tillhandahåller.', 'After ordering, you\'ll receive a link to upload images, logo and other materials. You are responsible for ensuring you have the rights to use all materials you provide.')}</p>
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
              <p className="text-sm text-muted-foreground mt-4">{t('Senast uppdaterad:', 'Last updated:')} 2024-12-31</p>
            </section>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
