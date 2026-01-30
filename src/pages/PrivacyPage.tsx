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
                  'Nomia ("vi", "oss", "vår") respekterar din integritet och är engagerade i att skydda dina personuppgifter i enlighet med GDPR. Denna integritetspolicy förklarar hur vi samlar in, använder och skyddar dina uppgifter när du använder våra tjänster.',
                  'Nomia ("we", "us", "our") respects your privacy and is committed to protecting your personal data in accordance with GDPR. This privacy policy explains how we collect, use, and protect your information when you use our services.'
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
                  {t('Företagsuppgifter: företagsnamn, organisationsnummer, VAT-nummer, adress, land', 'Business information: company name, organization number, VAT number, address, country')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  {t('Projektmaterial: logotyp, bilder, texter, beskrivningar, uppladdade filer', 'Project materials: logo, images, texts, descriptions, uploaded files')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  {t('Betalningsinformation: hanteras säkert av vår betalningsleverantör Stripe. Vi lagrar aldrig dina kortuppgifter.', 'Payment information: handled securely by our payment provider Stripe. We never store your card details.')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  {t('Teknisk data: IP-adress, webbläsartyp, besöksstatistik (endast för Pro-kunder med Google Analytics)', 'Technical data: IP address, browser type, visit statistics (only for Pro customers with Google Analytics)')}
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
                  {t('Skapa konceptdemos och webbplatser åt dig', 'Create concept demos and websites for you')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  {t('Kommunicera om projektframsteg och leveranser', 'Communicate about project progress and deliveries')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  {t('Behandla betalningar, verifieringsavgifter och fakturering', 'Process payments, verification fees, and invoicing')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  {t('Skicka bekräftelsemail för beställningar och vårdplaner', 'Send confirmation emails for orders and care plans')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  {t('Verifiera VAT-nummer via EU VIES för momshantering', 'Verify VAT numbers via EU VIES for tax handling')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  {t('Förbättra våra tjänster baserat på feedback', 'Improve our services based on feedback')}
                </li>
              </ul>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={250}>
            <section>
              <h2 className="text-xl font-heading font-semibold mb-3">
                {t('Lagring och säkerhet', 'Storage and security')}
              </h2>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  {t('Projektdata lagras så länge det behövs för att utföra tjänsterna, plus 6 månader efter projektets slut.', 'Project data is stored for as long as needed to provide services, plus 6 months after project completion.')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  {t('Faktureringsdata sparas enligt svensk bokföringslag (7 år).', 'Invoicing data is kept per Swedish accounting law (7 years).')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  {t('Vi använder kryptering (TLS/SSL) och branschstandardiserade säkerhetsåtgärder.', 'We use encryption (TLS/SSL) and industry-standard security measures.')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  {t('Data lagras hos våra EU-baserade underleverantörer.', 'Data is stored with our EU-based sub-processors.')}
                </li>
              </ul>
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
                  {t('Rätt att få tillgång till dina uppgifter (dataportabilitet)', 'Right to access your data (data portability)')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  {t('Rätt att korrigera felaktiga uppgifter', 'Right to rectify inaccurate data')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  {t('Rätt att radera dina uppgifter ("rätten att bli glömd")', 'Right to erase your data ("right to be forgotten")')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  {t('Rätt att invända mot behandling', 'Right to object to processing')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  {t('Rätt att begränsa behandling', 'Right to restrict processing')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  {t('Rätt att lämna in klagomål till Integritetsskyddsmyndigheten (IMY)', 'Right to lodge a complaint with the Swedish Data Protection Authority (IMY)')}
                </li>
              </ul>
              <p className="text-muted-foreground mt-3">
                {t('För att utöva dina rättigheter, kontakta oss på nordicsite.help@gmail.com. Vi svarar inom 30 dagar.', 'To exercise your rights, contact us at nordicsite.help@gmail.com. We respond within 30 days.')}
              </p>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={350}>
            <section>
              <h2 className="text-xl font-heading font-semibold mb-3">
                {t('Cookies och spårning', 'Cookies and tracking')}
              </h2>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  {t('Vår webbplats (nomia.se) använder endast nödvändiga cookies för grundläggande funktionalitet och sessionshantering.', 'Our website (nomia.se) only uses essential cookies for basic functionality and session management.')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  {t('Vi använder inga spårningscookies eller marknadsföringscookies på denna webbplats.', 'We do not use tracking cookies or marketing cookies on this website.')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  {t('Pro-paketet inkluderar Google Analytics — din webbplats kommer då att använda spårningscookies, och vi hjälper dig sätta upp en GDPR-kompatibel cookie-banner.', 'Pro package includes Google Analytics — your website will then use tracking cookies, and we help you set up a GDPR-compliant cookie banner.')}
                </li>
              </ul>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={400}>
            <section>
              <h2 className="text-xl font-heading font-semibold mb-3">
                {t('Tredjepartstjänster', 'Third-party services')}
              </h2>
              <p className="text-muted-foreground mb-3">
                {t('Vi använder följande tredjepartstjänster som kan behandla dina uppgifter:', 'We use the following third-party services that may process your data:')}
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  <strong>Stripe</strong> — {t('betalningshantering och fakturering', 'payment processing and invoicing')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  <strong>Resend</strong> — {t('e-postleverans för bekräftelsemail', 'email delivery for confirmation emails')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  <strong>Lovable Cloud (Supabase)</strong> — {t('hosting, databas och edge functions (EU)', 'hosting, database and edge functions (EU)')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  <strong>EU VIES</strong> — {t('VAT-nummerverifiering', 'VAT number verification')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">•</span>
                  <strong>Google Analytics</strong> — {t('endast för Pro-kunders webbplatser', 'only for Pro customers\' websites')}
                </li>
              </ul>
              <p className="text-muted-foreground mt-3">
                {t('Dessa leverantörer har egna integritetspolicyer och är GDPR-kompatibla.', 'These providers have their own privacy policies and are GDPR compliant.')}
              </p>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={450}>
            <section>
              <h2 className="text-xl font-heading font-semibold mb-3">
                {t('Dataöverföringar', 'Data transfers')}
              </h2>
              <p className="text-muted-foreground">
                {t(
                  'Dina uppgifter behandlas primärt inom EU/EES. Om uppgifter överförs utanför EU (t.ex. till USA via Stripe), sker detta enligt godkända överföringsmekanismer som standardavtalsklausuler (SCC) eller EU-US Data Privacy Framework.',
                  'Your data is primarily processed within the EU/EEA. If data is transferred outside the EU (e.g., to the US via Stripe), this is done according to approved transfer mechanisms such as Standard Contractual Clauses (SCC) or the EU-US Data Privacy Framework.'
                )}
              </p>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={500}>
            <section className="pt-8 border-t border-border">
              <p className="text-muted-foreground">
                {t(
                  'Har du frågor om vår integritetspolicy? Kontakta oss på nordicsite.help@gmail.com',
                  'Questions about our privacy policy? Contact us at nordicsite.help@gmail.com'
                )}
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                {t('Senast uppdaterad:', 'Last updated:')} 2025-01-30
              </p>
            </section>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
