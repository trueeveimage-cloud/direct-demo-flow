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
                  'Nomia ("vi", "oss", "vår") respekterar din integritet och är engagerade i att skydda dina personuppgifter. Denna integritetspolicy förklarar hur vi samlar in, använder och skyddar dina uppgifter när du använder våra tjänster.',
                  'Nomia ("we", "us", "our") respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and protect your information when you use our services.'
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
                  {t('Företagsuppgifter: företagsnamn, adress, bransch', 'Business information: company name, address, industry')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  {t('Projektmaterial: logotyp, bilder, texter, beskrivningar', 'Project materials: logo, images, texts, descriptions')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  {t('Betalningsinformation: hanteras säkert av vår betalningsleverantör (Stripe)', 'Payment information: handled securely by our payment provider (Stripe)')}
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
                  {t('För att skapa ditt koncept och webbplats', 'To create your concept and website')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  {t('För att kommunicera med dig om ditt projekt', 'To communicate with you about your project')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  {t('För att behandla betalningar och fakturering', 'To process payments and invoicing')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  {t('För att förbättra våra tjänster', 'To improve our services')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  {t('För att skicka viktig information om vårdplaner', 'To send important information about care plans')}
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
                  'Vi lagrar dina uppgifter så länge det behövs för att utföra våra tjänster eller enligt lagkrav. Projektmaterial sparas i 6 månader efter projektets avslut. Vi använder kryptering och branschstandardiserade säkerhetsåtgärder.',
                  'We store your data for as long as necessary to provide our services or as required by law. Project materials are kept for 6 months after project completion. We use encryption and industry-standard security measures.'
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
              <p className="text-muted-foreground mt-3">
                {t('För att utöva dina rättigheter, kontakta oss på nordicsite.help@gmail.com', 'To exercise your rights, contact us at nordicsite.help@gmail.com')}
              </p>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={350}>
            <section>
              <h2 className="text-xl font-heading font-semibold mb-3">
                {t('Cookies', 'Cookies')}
              </h2>
              <p className="text-muted-foreground">
                {t(
                  'Vår webbplats använder endast nödvändiga cookies för grundläggande funktionalitet. Vi använder inga spårningscookies eller marknadsföringscookies på denna webbplats. Om du väljer Pro-paketet med Google Analytics för din webbplats, kommer den att använda cookies för spårning och vi hjälper dig sätta upp en cookie-banner.',
                  'Our website only uses essential cookies for basic functionality. We do not use tracking cookies or marketing cookies on this website. If you choose the Pro package with Google Analytics for your website, it will use cookies for tracking and we will help you set up a cookie banner.'
                )}
              </p>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={400}>
            <section>
              <h2 className="text-xl font-heading font-semibold mb-3">
                {t('Tredjepartstjänster', 'Third-party services')}
              </h2>
              <p className="text-muted-foreground mb-3">
                {t('Vi använder följande tredjepartstjänster:', 'We use the following third-party services:')}
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  <strong>Stripe</strong> - {t('betalningshantering', 'payment processing')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  <strong>Vercel</strong> - {t('hosting och infrastruktur', 'hosting and infrastructure')}
                </li>
              </ul>
              <p className="text-muted-foreground mt-3">
                {t('Dessa leverantörer har egna integritetspolicyer som vi rekommenderar att du läser.', 'These providers have their own privacy policies which we recommend you review.')}
              </p>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={450}>
            <section className="pt-8 border-t border-border">
              <p className="text-muted-foreground">
                {t(
                  'Har du frågor om vår integritetspolicy? Kontakta oss på nordicsite.help@gmail.com',
                  'Questions about our privacy policy? Contact us at nordicsite.help@gmail.com'
                )}
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                {t('Senast uppdaterad:', 'Last updated:')} 2024-12-23
              </p>
            </section>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}