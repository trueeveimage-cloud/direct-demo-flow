import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface SEOHeadProps {
  title?: string;
  description?: string;
  type?: 'website' | 'article' | 'product';
  image?: string;
}

// JSON-LD Structured Data for the organization
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Nomia',
  url: 'https://nomia.se',
  logo: 'https://nomia.se/og-image.png',
  description: 'Professional web design for businesses. Get a free website concept in 72 hours.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Gothenburg',
    addressCountry: 'SE'
  },
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'nordicsite.help@gmail.com',
    contactType: 'customer service'
  },
  sameAs: []
};

// JSON-LD for Local Business
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Nomia',
  url: 'https://nomia.se',
  image: 'https://nomia.se/og-image.png',
  description: 'Webbyrå i Göteborg. Professionella hemsidor för företag – klara på 7 dagar med pengarna-tillbaka-garanti.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Gothenburg',
    addressRegion: 'Västra Götaland',
    addressCountry: 'SE'
  },
  priceRange: '2900 - 12900 SEK',
  openingHours: 'Mo-Fr 09:00-17:00',
  areaServed: [
    { '@type': 'Country', name: 'Sweden' },
    { '@type': 'Country', name: 'Norway' },
    { '@type': 'Country', name: 'Denmark' }
  ],
  knowsLanguage: ['sv', 'en', 'no', 'da'],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Webbpaket',
    itemListElement: [
      {
        '@type': 'Offer',
        name: 'Starter',
        description: 'Upp till 3 sidor, mobilanpassad design, SEO-optimering',
        price: '2900',
        priceCurrency: 'SEK'
      },
      {
        '@type': 'Offer',
        name: 'Standard',
        description: 'Upp till 5 sidor, flerspråkig, bildgalleri, Google Reviews',
        price: '5900',
        priceCurrency: 'SEK'
      },
      {
        '@type': 'Offer',
        name: 'Pro',
        description: 'Upp till 8 sidor, bokningssystem, Google Analytics, adminpanel',
        price: '12900',
        priceCurrency: 'SEK'
      }
    ]
  }
};

// FAQ Schema for FAQ page
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Hur fungerar det gratis konceptet?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Du betalar en verifieringsavgift på 500 kr för att boka din plats. Om du inte gillar konceptet, får du full återbetalning. Om du fortsätter dras avgiften från slutpriset.'
      }
    },
    {
      '@type': 'Question',
      name: 'Vilka paket erbjuder ni?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vi har tre paket: Starter (2 900 kr, 3 sidor), Standard (5 900 kr, 5 sidor, flerspråkig), och Pro (12 900 kr, 8 sidor, bokningssystem, Google Analytics).'
      }
    },
    {
      '@type': 'Question',
      name: 'Vad är leveranstiden?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Leveranstid beror på paket: Starter 14 dagar, Standard 10 dagar, Pro 7 dagar. Gratis designkoncept levereras inom 72 timmar.'
      }
    },
    {
      '@type': 'Question',
      name: 'Ingår hosting i priset?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ja, hosting ingår i våra serviceplaner som börjar från 250 kr/mån. Du kan också välja att hosta hemsidan själv.'
      }
    }
  ]
};

// WebSite schema for sitelinks searchbox
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Nomia',
  url: 'https://nomia.se',
  description: 'Professionell webbdesign för företag. Gratis designkoncept på 72 timmar.',
  inLanguage: ['sv', 'en'],
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://nomia.se/?q={search_term_string}',
    'query-input': 'required name=search_term_string'
  }
};

export function SEOHead({ title, description, type = 'website', image }: SEOHeadProps) {
  const location = useLocation();
  const { lang } = useLanguage();
  
  const defaultTitle = lang === 'sv' 
    ? 'Nomia | Webbdesign på 72 timmar – Gratis koncept'
    : 'Nomia | Web Design in 72 Hours – Free Concept';
  const defaultDescription = lang === 'sv'
    ? 'Få ett gratis designkoncept för din hemsida på 72 timmar. Professionella hemsidor för företag från 2 900 kr. Pengarna-tillbaka-garanti.'
    : 'Get a free website design concept in 72 hours. Professional websites for businesses from €290. Money-back guarantee.';
  const defaultImage = 'https://nomia.se/og-image.png';
  
  const pageTitle = title || defaultTitle;
  const pageDescription = description || defaultDescription;
  const pageImage = image || defaultImage;
  const pageUrl = `https://nomia.se${location.pathname}`;
  
  useEffect(() => {
    // Update document title
    document.title = pageTitle;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', pageDescription);
    }
    
    // Update OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    const ogType = document.querySelector('meta[property="og:type"]');
    
    if (ogTitle) ogTitle.setAttribute('content', pageTitle);
    if (ogDescription) ogDescription.setAttribute('content', pageDescription);
    if (ogImage) ogImage.setAttribute('content', pageImage);
    if (ogUrl) ogUrl.setAttribute('content', pageUrl);
    if (ogType) ogType.setAttribute('content', type);
    
    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    
    if (twitterTitle) twitterTitle.setAttribute('content', pageTitle);
    if (twitterDescription) twitterDescription.setAttribute('content', pageDescription);
    if (twitterImage) twitterImage.setAttribute('content', pageImage);
    
    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', pageUrl);
    }
    
    // Update HTML lang attribute
    document.documentElement.lang = lang === 'sv' ? 'sv' : lang === 'no' ? 'nb' : lang === 'dk' ? 'da' : 'en';
    
    // Add/update hreflang links
    const hreflangData = [
      { lang: 'sv', href: pageUrl },
      { lang: 'en', href: pageUrl },
      { lang: 'x-default', href: pageUrl },
    ];
    
    // Remove existing hreflang links
    document.querySelectorAll('link[hreflang]').forEach(el => el.remove());
    
    // Add new hreflang links
    hreflangData.forEach(({ lang: hLang, href }) => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = hLang;
      link.href = href;
      document.head.appendChild(link);
    });
    
    // Update JSON-LD structured data - remove all existing and add fresh
    document.querySelectorAll('script[type="application/ld+json"]').forEach(el => el.remove());
    
    // Always add WebSite schema on homepage
    if (location.pathname === '/') {
      const wsScript = document.createElement('script');
      wsScript.type = 'application/ld+json';
      wsScript.textContent = JSON.stringify(websiteSchema);
      document.head.appendChild(wsScript);
    }
    
    // Page-specific schema
    let schema;
    if (location.pathname === '/faq') {
      schema = faqSchema;
    } else if (location.pathname === '/priser' || location.pathname === '/') {
      schema = localBusinessSchema;
    } else {
      schema = organizationSchema;
    }
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }, [pageTitle, pageDescription, pageImage, pageUrl, type, location.pathname, lang]);
  
  return null;
}
