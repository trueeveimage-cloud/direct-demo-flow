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
              <h2 className="text-xl font-heading font-semibold mb-3">{t('Vad betyder "gratis koncept"?', 'What does "free concept" mean?')}</h2>
              <p className="text-muted-foreground">{t('"Gratis koncept" innebär att själva konceptet är kostnadsfritt. Dock krävs en verifieringsavgift (10% av valt paket) innan arbetet påbörjas. Om du inte gillar konceptet återbetalas avgiften. Om du går vidare dras avgiften av från slutpriset.', '"Free concept" means the concept itself is free. However, a verification fee (10% of chosen package) is required before work begins. If you don\'t like the concept, the fee is refunded. If you proceed, the fee is deducted from the final price.')}</p>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={150}>
            <section>
              <h2 className="text-xl font-heading font-semibold mb-3">{t('Verifieringsavgift', 'Verification Fee')}</h2>
              <p className="text-muted-foreground mb-2">{t('Verifieringsavgiften är 10% av det valda paketet:', 'The verification fee is 10% of the chosen package:')}</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Starter (4 900 kr): 490 kr {t('verifiering', 'verification')}</li>
                <li>Standard (7 900 kr): 790 kr {t('verifiering', 'verification')}</li>
                <li>Pro (12 900 kr): 1 290 kr {t('verifiering', 'verification')}</li>
              </ul>
              <p className="text-muted-foreground mt-3">{t('Denna avgift bokar din prioritetsplats och återbetalas helt om du avvisar konceptet.', 'This fee books your priority slot and is fully refunded if you reject the concept.')}</p>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={200}>
            <section>
              <h2 className="text-xl font-heading font-semibold mb-3">{t('När startar 72-timmarsfristen?', 'When does the 72-hour deadline start?')}</h2>
              <p className="text-muted-foreground mb-2">{t('Nedräkningen på 72 timmar börjar EFTER att båda dessa villkor är uppfyllda:', 'The 72-hour countdown starts AFTER both of these conditions are met:')}</p>
              <ol className="list-decimal list-inside text-muted-foreground space-y-1">
                <li>{t('All obligatorisk info har skickats in via formuläret.', 'All required info has been submitted via the form.')}</li>
                <li>{t('Verifieringsavgiften har betalats.', 'The verification fee has been paid.')}</li>
              </ol>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={250}>
            <section>
              <h2 className="text-xl font-heading font-semibold mb-3">{t('Återbetalningsregler', 'Refund Rules')}</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span>{t('Du kan avvisa konceptet inom 5 dagar efter leverans för full återbetalning av verifieringsavgiften.', 'You can reject the concept within 5 days of delivery for a full refund of the verification fee.')}</li>
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span>{t('Om du begär extra arbete utöver koncept-scopet innan du bestämt dig, kan återbetalning påverkas.', 'If you request extra work beyond the concept scope before deciding, the refund may be affected.')}</li>
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span>{t('Återbetalning sker till samma betalningsmetod inom 7 arbetsdagar.', 'Refunds are processed to the same payment method within 7 business days.')}</li>
              </ul>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={300}>
            <section>
              <h2 className="text-xl font-heading font-semibold mb-3">{t('Webbpaket (engångskostnad)', 'Website Packages (one-time)')}</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span><strong>Starter:</strong> 4 900 kr - {t('Upp till 3 sidor', 'Up to 3 pages')}</li>
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span><strong>Standard:</strong> 7 900 kr - {t('Upp till 5 sidor', 'Up to 5 pages')}</li>
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span><strong>Pro:</strong> 12 900 kr - {t('Upp till 8 sidor', 'Up to 8 pages')}</li>
              </ul>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={350}>
            <section>
              <h2 className="text-xl font-heading font-semibold mb-3">{t('Månatlig webbvård', 'Monthly Care Plans')}</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span><strong>Basic:</strong> 399 kr/mån - {t('Hosting, uppdateringar, säkerhetskopiering', 'Hosting, updates, backups')}</li>
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span><strong>Standard:</strong> 699 kr/mån - {t('Allt i Basic + domän, e-post, 1h ändringar/mån', 'Everything in Basic + domain, email, 1h edits/month')}</li>
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span><strong>Pro:</strong> 1 199 kr/mån - {t('Allt i Standard + 3h ändringar/mån, prioriterad support', 'Everything in Standard + 3h edits/month, priority support')}</li>
              </ul>
              <p className="text-muted-foreground mt-3">{t('Avsluta när du vill.', 'Cancel anytime.')}</p>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={400}>
            <section>
              <h2 className="text-xl font-heading font-semibold mb-3">{t('Inaktivitet', 'Inactivity')}</h2>
              <p className="text-muted-foreground">{t('Om vi inte hör från dig på 14 dagar pausas projektet. Vi kontaktar dig innan paus. Pausade projekt kan återupptas genom att kontakta oss.', 'If we don\'t hear from you for 14 days, the project is paused. We\'ll contact you before pausing. Paused projects can be resumed by contacting us.')}</p>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={450}>
            <section>
              <h2 className="text-xl font-heading font-semibold mb-3">{t('Allmänna villkor', 'General Terms')}</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span>{t('Alla priser anges i svenska kronor (SEK) inklusive moms.', 'All prices are in Swedish kronor (SEK) including VAT.')}</li>
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span>{t('Vi förbehåller oss rätten att avböja projekt som inte passar vårt arbetssätt.', 'We reserve the right to decline projects that don\'t fit our workflow.')}</li>
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span>{t('Dessa villkor kan uppdateras. Den senaste versionen gäller alltid.', 'These terms may be updated. The latest version always applies.')}</li>
              </ul>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={500}>
            <section className="pt-8 border-t border-border">
              <p className="text-muted-foreground">{t('Har du frågor om våra villkor? Kontakta oss på hej@nordicsite.se', 'Questions about our terms? Contact us at hello@nordicsite.se')}</p>
              <p className="text-sm text-muted-foreground mt-4">{t('Senast uppdaterad:', 'Last updated:')} {new Date().toLocaleDateString()}</p>
            </section>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
