import { useLanguage } from '@/contexts/LanguageContext';
import { AnimatedSection } from '@/components/AnimatedSection';

export default function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <div className="section-padding py-20">
      <div className="container-narrow">
        <AnimatedSection animation="fade-up">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8">
            {t('Integritetspolicy', 'Privacy Policy')}
          </h1>
        </AnimatedSection>

        <div className="prose prose-sm max-w-none space-y-8">
          <AnimatedSection animation="fade-up" delay={100}>
            <section>
              <h2 className="text-xl font-heading font-semibold mb-3">
                {t('Inledning', 'Introduction')}
              </h2>
              <p className="text-muted-foreground">
                {t(
                  'NordicSite Studio ("vi", "oss", "vår") respekterar din integritet och är engagerade i att skydda dina personuppgifter. Denna integritetspolicy förklarar hur vi samlar in, använder och skyddar dina uppgifter.',
                  'NordicSite Studio ("we", "us", "our") respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and protect your information.'
                )}
              </p>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={150}>
            <section>
              <h2 className="text-xl font-heading font-semibold mb-3">
                {t('Vilka uppgifter samlar vi in?', 'What data do we collect?')}
              </h2>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  {t('Kontaktuppgifter: namn, e-post, telefonnummer', 'Contact information: name, email, phone number')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  {t('Företagsuppgifter: företagsnamn, adress, öppettider', 'Business information: company name, address, opening hours')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  {t('Projektuppgifter: logotyp, färger, bilder, beskrivningar', 'Project information: logo, colors, images, descriptions')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  {t('Betalningsinformation: hanteras av vår betalningsleverantör', 'Payment information: handled by our payment provider')}
                </li>
              </ul>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={200}>
            <section>
              <h2 className="text-xl font-heading font-semibold mb-3">
                {t('Hur använder vi dina uppgifter?', 'How do we use your data?')}
              </h2>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  {t('För att skapa din webb-demo och webbplats', 'To create your website demo and website')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  {t('För att kommunicera med dig om ditt projekt', 'To communicate with you about your project')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  {t('För att behandla betalningar', 'To process payments')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  {t('För att förbättra våra tjänster', 'To improve our services')}
                </li>
              </ul>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={250}>
            <section>
              <h2 className="text-xl font-heading font-semibold mb-3">
                {t('Lagring och säkerhet', 'Storage and security')}
              </h2>
              <p className="text-muted-foreground">
                {t(
                  'Vi lagrar dina uppgifter så länge det behövs för att utföra våra tjänster eller enligt lagkrav. Vi använder branschstandardiserade säkerhetsåtgärder för att skydda dina uppgifter.',
                  'We store your data for as long as necessary to provide our services or as required by law. We use industry-standard security measures to protect your information.'
                )}
              </p>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={300}>
            <section>
              <h2 className="text-xl font-heading font-semibold mb-3">
                {t('Dina rättigheter (GDPR)', 'Your rights (GDPR)')}
              </h2>
              <p className="text-muted-foreground mb-3">
                {t(
                  'Enligt GDPR har du följande rättigheter:',
                  'Under GDPR, you have the following rights:'
                )}
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  {t('Rätt att få tillgång till dina uppgifter', 'Right to access your data')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  {t('Rätt att korrigera felaktiga uppgifter', 'Right to rectify inaccurate data')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  {t('Rätt att radera dina uppgifter', 'Right to erase your data')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  {t('Rätt att invända mot behandling', 'Right to object to processing')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  {t('Rätt till dataportabilitet', 'Right to data portability')}
                </li>
              </ul>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={350}>
            <section>
              <h2 className="text-xl font-heading font-semibold mb-3">
                {t('Cookies', 'Cookies')}
              </h2>
              <p className="text-muted-foreground">
                {t(
                  'Vi använder endast nödvändiga cookies för att webbplatsen ska fungera. Vi använder inga spårningscookies eller marknadsföringscookies.',
                  'We only use essential cookies for the website to function. We do not use tracking cookies or marketing cookies.'
                )}
              </p>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={400}>
            <section>
              <h2 className="text-xl font-heading font-semibold mb-3">
                {t('Tredjepartstjänster', 'Third-party services')}
              </h2>
              <p className="text-muted-foreground">
                {t(
                  'Vi kan använda tredjepartstjänster för betalningar och hosting. Dessa leverantörer har egna integritetspolicyer som vi rekommenderar att du läser.',
                  'We may use third-party services for payments and hosting. These providers have their own privacy policies which we recommend you review.'
                )}
              </p>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={450}>
            <section className="pt-8 border-t border-border">
              <p className="text-muted-foreground">
                {t(
                  'Har du frågor om vår integritetspolicy? Kontakta oss på hej@nordicsite.se',
                  'Questions about our privacy policy? Contact us at hello@nordicsite.se'
                )}
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                {t('Senast uppdaterad:', 'Last updated:')} {new Date().toLocaleDateString()}
              </p>
            </section>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
