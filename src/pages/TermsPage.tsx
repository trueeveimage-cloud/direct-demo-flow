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
              <h2 className="text-xl font-heading font-semibold mb-3">{t('Vad betyder "gratis demo"?', 'What does "free demo" mean?')}</h2>
              <p className="text-muted-foreground">{t('"Gratis demo" innebär att själva demon är kostnadsfri. Dock krävs en verifieringsavgift på 500 kr innan arbetet påbörjas. Om du inte gillar demon återbetalas 500 kr. Om du går vidare dras 500 kr av från slutpriset.', '"Free demo" means the demo itself is free. However, a 500 kr verification fee is required before work begins. If you don\'t like the demo, 500 kr is refunded. If you proceed, 500 kr is deducted from the final price.')}</p>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={150}>
            <section>
              <h2 className="text-xl font-heading font-semibold mb-3">{t('När startar 72-timmarsfristen?', 'When does the 72-hour deadline start?')}</h2>
              <p className="text-muted-foreground mb-2">{t('Nedräkningen på 72 timmar börjar EFTER att båda dessa villkor är uppfyllda:', 'The 72-hour countdown starts AFTER both of these conditions are met:')}</p>
              <ol className="list-decimal list-inside text-muted-foreground space-y-1">
                <li>{t('All obligatorisk info har skickats in via formuläret.', 'All required info has been submitted via the form.')}</li>
                <li>{t('Verifieringsavgiften på 500 kr har betalats.', 'The 500 kr verification fee has been paid.')}</li>
              </ol>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={200}>
            <section>
              <h2 className="text-xl font-heading font-semibold mb-3">{t('Återbetalningsregler', 'Refund Rules')}</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span>{t('Du kan avvisa demon inom 5 dagar efter leverans för full återbetalning av 500 kr.', 'You can reject the demo within 5 days of delivery for a full refund of 500 kr.')}</li>
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span>{t('Om du begär extra arbete utöver demo-scopet innan du bestämt dig, kan återbetalning påverkas.', 'If you request extra work beyond the demo scope before deciding, the refund may be affected.')}</li>
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span>{t('Återbetalning sker till samma betalningsmetod inom 7 arbetsdagar.', 'Refunds are processed to the same payment method within 7 business days.')}</li>
              </ul>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={250}>
            <section>
              <h2 className="text-xl font-heading font-semibold mb-3">{t('Inaktivitet', 'Inactivity')}</h2>
              <p className="text-muted-foreground">{t('Om vi inte hör från dig på 14 dagar pausas projektet. Vi kontaktar dig innan paus. Pausade projekt kan återupptas genom att kontakta oss.', 'If we don\'t hear from you for 14 days, the project is paused. We\'ll contact you before pausing. Paused projects can be resumed by contacting us.')}</p>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={300}>
            <section>
              <h2 className="text-xl font-heading font-semibold mb-3">{t('Verifieringsavgift vid fortsättning', 'Verification Fee on Proceeding')}</h2>
              <p className="text-muted-foreground">{t('Om du väljer att gå vidare med ett fullständigt webbprojekt efter demon, dras verifieringsavgiften på 500 kr av från slutfakturan.', 'If you choose to proceed with a full web project after the demo, the 500 kr verification fee is deducted from the final invoice.')}</p>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={350}>
            <section>
              <h2 className="text-xl font-heading font-semibold mb-3">{t('Allmänna villkor', 'General Terms')}</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span>{t('Alla priser anges i svenska kronor (SEK) inklusive moms.', 'All prices are in Swedish kronor (SEK) including VAT.')}</li>
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span>{t('Vi förbehåller oss rätten att avböja projekt som inte passar vårt arbetssätt.', 'We reserve the right to decline projects that don\'t fit our workflow.')}</li>
                <li className="flex items-start gap-2"><span className="font-semibold text-foreground">•</span>{t('Dessa villkor kan uppdateras. Den senaste versionen gäller alltid.', 'These terms may be updated. The latest version always applies.')}</li>
              </ul>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={400}>
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
