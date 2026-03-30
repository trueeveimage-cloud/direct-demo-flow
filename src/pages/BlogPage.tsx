import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { SEOHead } from '@/components/SEOHead';
import { GrainOverlay } from '@/components/PremiumEffects';
import { AnimatedSection } from '@/components/AnimatedSection';
import { ArrowRight, Clock, Calendar, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

interface BlogPost {
  slug: string;
  titleSv: string;
  titleEn: string;
  excerptSv: string;
  excerptEn: string;
  category: string;
  readTime: number;
  date: string;
  contentSv: string[];
  contentEn: string[];
}

const blogPosts: BlogPost[] = [
  {
    slug: 'hur-mycket-kostar-en-hemsida-2026',
    titleSv: 'Hur mycket kostar en hemsida 2026?',
    titleEn: 'How much does a website cost in 2026?',
    excerptSv: 'Vi bryter ner alla kostnader för att skapa en professionell hemsida – från budget till premium. Lär dig vad du faktiskt behöver.',
    excerptEn: 'We break down all costs of creating a professional website – from budget to premium. Learn what you actually need.',
    category: 'Priser',
    readTime: 5,
    date: '2026-03-28',
    contentSv: [
      'Att skapa en hemsida kan kosta allt från 0 kr (gör det själv med Wix) till 100 000+ kr (skräddarsydd lösning från en stor byrå). Men för de flesta småföretag ligger det optimala priset någonstans däremellan.',
      '## Vad påverkar priset?',
      'Antal sidor, funktionalitet (bokning, e-handel, flerspråkighet), design-nivå och leveranstid är de största faktorerna. En enkel hemsida med 3 sidor kostar typiskt 2 000–5 000 kr, medan en hemsida med 5+ sidor, bildgalleri och Google Analytics landar runt 5 000–10 000 kr.',
      '## Dolda kostnader att tänka på',
      'Hosting (200–500 kr/mån), domännamn (100–200 kr/år), SSL-certifikat (ofta gratis med moderna hostar), och löpande underhåll. Många byråer tar betalt separat för ändringar efter lansering.',
      '## Vår rekommendation',
      'För de flesta småföretag räcker ett Standard-paket (5 sidor, ~5 900 kr) med en serviceplan (från 250 kr/mån för hosting och support). Du får en professionell hemsida som konverterar besökare till kunder – utan att ruinera dig.',
      '## Pengarna-tillbaka-garanti',
      'Hos Nomia får du se ett gratis designkoncept innan du bestämmer dig. Om du inte gillar det kostar det ingenting. Det tar bort all risk.'
    ],
    contentEn: [
      'Building a website can cost anything from $0 (DIY with Wix) to $10,000+ (custom solution from a large agency). But for most small businesses, the sweet spot is somewhere in between.',
      '## What affects the price?',
      'Number of pages, functionality (booking, e-commerce, multi-language), design level, and delivery time are the biggest factors. A simple 3-page website typically costs €200–500, while a 5+ page site with galleries and analytics lands around €500–1,000.',
      '## Hidden costs to watch for',
      'Hosting (€20–50/month), domain name (€10–20/year), SSL certificates (often free with modern hosts), and ongoing maintenance. Many agencies charge separately for changes after launch.',
      '## Our recommendation',
      'For most small businesses, a Standard package (5 pages, ~€590) with a care plan (from €25/month for hosting and support) is the sweet spot. You get a professional website that converts visitors to customers – without breaking the bank.',
      '## Money-back guarantee',
      'At Nomia, you see a free design concept before committing. If you don\'t like it, it costs nothing. That removes all risk.'
    ]
  },
  {
    slug: 'varfor-behover-ditt-foretag-en-hemsida',
    titleSv: 'Varför behöver ditt företag en hemsida 2026?',
    titleEn: 'Why does your business need a website in 2026?',
    excerptSv: '87% av kunder söker online innan de köper. Utan en hemsida förlorar du kunder till konkurrenter som syns.',
    excerptEn: '87% of customers search online before buying. Without a website, you\'re losing customers to competitors who show up.',
    category: 'Tillväxt',
    readTime: 4,
    date: '2026-03-25',
    contentSv: [
      'I en värld där 87% av konsumenter undersöker företag online innan de köper, är frågan inte längre "behöver jag en hemsida?" utan "hur snabbt kan jag få en?"',
      '## Din hemsida jobbar dygnet runt',
      'Till skillnad från din butik eller ditt kontor stänger aldrig din hemsida. Kunder kan hitta dig, läsa om dina tjänster och kontakta dig klockan 3 på natten. Det är som att ha en säljare som aldrig sover.',
      '## Google är nya gula sidorna',
      'När någon söker "frisör nära mig" eller "bra restaurang Göteborg" – vill du dyka upp. Utan en hemsida är du osynlig. Med en väloptimerad hemsida kan du hamna i toppen av sökresultaten.',
      '## Trovärdighet och förtroende',
      'En professionell hemsida signalerar att du tar ditt företag på allvar. Kunder litar mer på företag som har en snygg, uppdaterad hemsida med kundrecensioner och tydlig kontaktinformation.',
      '## Konkurrensfördelar',
      'Dina konkurrenter har förmodligen redan en hemsida. Om din är bättre – snabbare, snyggare, mer mobilanpassad – vinner du kunderna. Det är så enkelt.',
      '## Vad du kan göra idag',
      'Börja med ett gratis designkoncept. Du ser hur din hemsida kan se ut innan du spenderar en krona. Ingen risk, inget krångel.'
    ],
    contentEn: [
      'In a world where 87% of consumers research businesses online before buying, the question is no longer "do I need a website?" but "how fast can I get one?"',
      '## Your website works 24/7',
      'Unlike your store or office, your website never closes. Customers can find you, read about your services, and contact you at 3 AM. It\'s like having a salesperson who never sleeps.',
      '## Google is the new yellow pages',
      'When someone searches "hairdresser near me" or "good restaurant Gothenburg" – you want to show up. Without a website, you\'re invisible. With a well-optimized site, you can reach the top of search results.',
      '## Credibility and trust',
      'A professional website signals that you take your business seriously. Customers trust businesses that have a clean, updated website with reviews and clear contact information.',
      '## Competitive advantage',
      'Your competitors probably already have a website. If yours is better – faster, more beautiful, more mobile-friendly – you win the customers. It\'s that simple.',
      '## What you can do today',
      'Start with a free design concept. See what your website could look like before spending a dime. No risk, no hassle.'
    ]
  },
  {
    slug: '5-misstag-sma-foretag-gor-med-sin-hemsida',
    titleSv: '5 misstag småföretag gör med sin hemsida',
    titleEn: '5 mistakes small businesses make with their website',
    excerptSv: 'Från långsam laddtid till saknad mobilanpassning – dessa misstag kostar dig kunder varje dag.',
    excerptEn: 'From slow loading times to missing mobile optimization – these mistakes cost you customers every day.',
    category: 'Tips',
    readTime: 4,
    date: '2026-03-20',
    contentSv: [
      'Vi har sett hundratals småföretags hemsidor. Dessa fem misstag är de vanligaste – och de kostar dig pengar varje dag.',
      '## 1. Inte mobilanpassad',
      'Över 60% av alla besök kommer från mobilen. Om din hemsida inte ser bra ut på en telefon tappar du mer än hälften av dina potentiella kunder direkt.',
      '## 2. Ingen tydlig call-to-action',
      'Besökare ska veta exakt vad de ska göra: ringa dig, boka en tid, eller beställa. Om det inte finns en tydlig knapp eller uppmaning lämnar de sidan.',
      '## 3. Långsam laddningstid',
      'Om din hemsida tar mer än 3 sekunder att ladda tappar du 53% av besökarna. Stora bilder utan komprimering och dålig hosting är vanliga orsaker.',
      '## 4. Ingen Google-synlighet',
      'En hemsida utan SEO är som en butik utan skylt. Du behöver rätt sökord, meta-beskrivningar och snabb laddningstid för att Google ska visa din sida.',
      '## 5. Föråldrad design',
      'En hemsida från 2018 skriker "vi bryr oss inte." Modern design med ren typografi, bra bilder och genomtänkt layout bygger förtroende.',
      '## Lösningen?',
      'Låt oss granska din hemsida gratis. Vi berättar exakt vad som behöver fixas – och kan ha ett nytt designkoncept klart på 72 timmar.'
    ],
    contentEn: [
      'We\'ve seen hundreds of small business websites. These five mistakes are the most common – and they cost you money every single day.',
      '## 1. Not mobile-friendly',
      'Over 60% of all visits come from mobile devices. If your website doesn\'t look good on a phone, you\'re losing more than half your potential customers immediately.',
      '## 2. No clear call-to-action',
      'Visitors should know exactly what to do: call you, book an appointment, or order. If there\'s no clear button or prompt, they leave.',
      '## 3. Slow loading time',
      'If your website takes more than 3 seconds to load, you lose 53% of visitors. Large uncompressed images and poor hosting are common causes.',
      '## 4. No Google visibility',
      'A website without SEO is like a store without a sign. You need the right keywords, meta descriptions, and fast loading for Google to show your page.',
      '## 5. Outdated design',
      'A website from 2018 screams "we don\'t care." Modern design with clean typography, quality images, and thoughtful layout builds trust.',
      '## The solution?',
      'Let us review your website for free. We\'ll tell you exactly what needs fixing – and can have a new design concept ready in 72 hours.'
    ]
  },
  {
    slug: 'sa-valjer-du-ratt-webbyra',
    titleSv: 'Så väljer du rätt webbyrå för ditt företag',
    titleEn: 'How to choose the right web agency for your business',
    excerptSv: 'Stor byrå eller frilansare? Fast pris eller timmar? Vi hjälper dig navigera djungeln av webbyråer.',
    excerptEn: 'Big agency or freelancer? Fixed price or hourly? We help you navigate the jungle of web agencies.',
    category: 'Guide',
    readTime: 6,
    date: '2026-03-15',
    contentSv: [
      'Att välja webbyrå kan kännas överväldigande. Hundratals alternativ, vitt skilda priser, och det är svårt att veta vad man faktiskt behöver. Här är en guide som hjälper dig.',
      '## Frilansare vs byrå',
      'Frilansare är ofta billigare (1 000–5 000 kr) men du riskerar förseningar, bristande support och att de försvinner. En byrå kostar mer men ger trygghet, garantier och långsiktig support.',
      '## Fast pris vs timmar',
      'Undvik timbaserad prissättning om möjligt – det gör det omöjligt att budgetera. Fast pris ger dig kontroll och inga obehagliga överraskningar.',
      '## Vad du ska fråga',
      'Be om att se tidigare arbeten. Fråga om leveranstid, antal ändringsrundor, vad som ingår i priset, och vad som kostar extra. Fråga också om support efter lansering.',
      '## Varning: billigast är sällan bäst',
      'En hemsida för 500 kr ser ut som en hemsida för 500 kr. Dina kunder märker skillnaden. Investera i kvalitet – det betalar sig redan första månaden i nya kunder.',
      '## Vår approach',
      'Vi erbjuder fast pris, tydlig leveranstid (7 dagar), och du ser designen gratis innan du betalar. Inga dolda kostnader, pengarna tillbaka om du inte är nöjd.'
    ],
    contentEn: [
      'Choosing a web agency can feel overwhelming. Hundreds of options, wildly different prices, and it\'s hard to know what you actually need. Here\'s a guide to help.',
      '## Freelancer vs agency',
      'Freelancers are often cheaper ($100–500) but you risk delays, lacking support, and them disappearing. An agency costs more but provides security, guarantees, and long-term support.',
      '## Fixed price vs hourly',
      'Avoid hourly pricing if possible – it makes budgeting impossible. Fixed pricing gives you control and no unpleasant surprises.',
      '## What to ask',
      'Ask to see previous work. Ask about delivery time, number of revision rounds, what\'s included, and what costs extra. Also ask about post-launch support.',
      '## Warning: cheapest is rarely best',
      'A $50 website looks like a $50 website. Your customers notice the difference. Invest in quality – it pays for itself in new customers within the first month.',
      '## Our approach',
      'We offer fixed pricing, clear delivery time (7 days), and you see the design for free before paying. No hidden costs, money back if you\'re not happy.'
    ]
  }
];

function formatDate(dateStr: string, lang: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(lang === 'sv' ? 'sv-SE' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Blog post detail view
function BlogPostDetail({ post, t, lang }: { post: BlogPost; t: any; lang: string }) {
  const content = lang === 'sv' ? post.contentSv : post.contentEn;
  const title = lang === 'sv' ? post.titleSv : post.titleEn;

  return (
    <div className="container-narrow py-28 px-5">
      <SEOHead 
        title={title}
        description={lang === 'sv' ? post.excerptSv : post.excerptEn}
        type="article"
      />
      
      <Link 
        to="/blogg" 
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors mb-8"
      >
        ← {t('Tillbaka till bloggen', 'Back to blog')}
      </Link>
      
      <article>
        <header className="mb-10">
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
              <Tag className="w-3 h-3" />
              {post.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(post.date, lang)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime} min
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight leading-tight">
            {title}
          </h1>
        </header>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {content.map((paragraph, i) => {
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={i} className="text-xl sm:text-2xl font-light mt-10 mb-4 text-foreground">
                  {paragraph.replace('## ', '')}
                </h2>
              );
            }
            return (
              <p key={i} className="text-muted-foreground leading-relaxed mb-4">
                {paragraph}
              </p>
            );
          })}
        </div>
        
        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 p-8 rounded-2xl bg-accent/5 border border-accent/20 text-center"
        >
          <h3 className="text-xl font-light mb-2">
            {t('Redo att komma igång?', 'Ready to get started?')}
          </h3>
          <p className="text-sm text-muted-foreground mb-5">
            {t('Få ett gratis designkoncept för din hemsida på 72 timmar.', 'Get a free design concept for your website in 72 hours.')}
          </p>
          <Link
            to="/demo"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
          >
            {t('Gratis koncept', 'Free concept')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </article>
    </div>
  );
}

export default function BlogPage() {
  const { t, lang } = useLanguage();
  
  // Check if we're viewing a specific post
  const path = window.location.pathname;
  const postSlug = path.startsWith('/blogg/') ? path.replace('/blogg/', '') : null;
  
  if (postSlug) {
    const post = blogPosts.find(p => p.slug === postSlug);
    if (post) {
      return (
        <div className="relative overflow-hidden min-h-screen">
          <GrainOverlay />
          <BlogPostDetail post={post} t={t} lang={lang} />
        </div>
      );
    }
  }

  return (
    <div className="relative overflow-hidden min-h-screen">
      <SEOHead 
        title={t('Blogg – Tips om webbdesign & digitalt | Nomia', 'Blog – Web Design Tips & Digital Growth | Nomia')}
        description={t('Läs om webbdesign, priser, SEO och digitala strategier för småföretag. Expertråd från Nomia.', 'Read about web design, pricing, SEO and digital strategies for small businesses. Expert advice from Nomia.')}
      />
      <GrainOverlay />
      
      <div className="section-padding pt-28 pb-20 relative z-10">
        <div className="container-wide">
          {/* Header */}
          <AnimatedSection animation="fade-up" className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6"
            >
              <span className="text-xs font-medium text-accent">{t('Insikter & Tips', 'Insights & Tips')}</span>
            </motion.div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extralight mb-4 tracking-tight">
              {t('Bloggen', 'The Blog')}
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {t(
                'Praktiska tips om webbdesign, priser och hur du växer ditt företag online.',
                'Practical tips on web design, pricing, and growing your business online.'
              )}
            </p>
          </AnimatedSection>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {blogPosts.map((post, index) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link
                  to={`/blogg/${post.slug}`}
                  className="group block p-6 rounded-2xl bg-card/50 border border-border/50 hover:border-accent/30 hover:bg-card/80 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">
                      <Tag className="w-3 h-3" />
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime} min
                    </span>
                    <span>{formatDate(post.date, lang)}</span>
                  </div>
                  
                  <h2 className="text-lg font-medium mb-2 group-hover:text-accent transition-colors leading-snug">
                    {lang === 'sv' ? post.titleSv : post.titleEn}
                  </h2>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {lang === 'sv' ? post.excerptSv : post.excerptEn}
                  </p>
                  
                  <span className="inline-flex items-center gap-1 text-sm text-accent font-medium group-hover:gap-2 transition-all">
                    {t('Läs mer', 'Read more')}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <AnimatedSection animation="fade-up" className="text-center mt-20">
            <div className="p-8 rounded-2xl bg-accent/5 border border-accent/20 max-w-xl mx-auto">
              <h3 className="text-xl font-light mb-2">
                {t('Vill du ha en hemsida som konverterar?', 'Want a website that converts?')}
              </h3>
              <p className="text-sm text-muted-foreground mb-5">
                {t('Se din nya design gratis inom 72 timmar.', 'See your new design for free within 72 hours.')}
              </p>
              <Link
                to="/demo"
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
              >
                {t('Gratis designkoncept', 'Free design concept')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
