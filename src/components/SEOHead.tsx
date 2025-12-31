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
  description: 'Professional web design for small businesses. Get a free website concept in 72 hours.',
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
  description: 'Web design agency specializing in fast, beautiful websites for small businesses.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Gothenburg',
    addressCountry: 'SE'
  },
  priceRange: '€490-€1290',
  openingHours: 'Mo-Fr 09:00-17:00',
  areaServed: {
    '@type': 'Country',
    name: 'Sweden'
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Website Packages',
    itemListElement: [
      {
        '@type': 'Offer',
        name: 'Starter Package',
        description: 'Up to 3 pages, mobile-responsive design, basic SEO',
        price: '490',
        priceCurrency: 'EUR'
      },
      {
        '@type': 'Offer',
        name: 'Standard Package',
        description: 'Up to 5 pages, multi-language, image gallery',
        price: '790',
        priceCurrency: 'EUR'
      },
      {
        '@type': 'Offer',
        name: 'Pro Package',
        description: 'Up to 8 pages, booking system, Google Analytics',
        price: '1290',
        priceCurrency: 'EUR'
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
      name: 'How does the free concept work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You get a free design concept for your website. You pay a €50 verification fee to book your spot. If you don\'t like the concept, the fee is fully refunded. If you proceed, it\'s deducted from the final price.'
      }
    },
    {
      '@type': 'Question',
      name: 'What packages do you offer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We have three packages: Starter (€490, 3 pages), Standard (€790, 5 pages, multi-language), and Pro (€1,290, 8 pages, multi-language, booking system, Google Analytics).'
      }
    },
    {
      '@type': 'Question',
      name: 'What\'s the delivery time?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Delivery time depends on package: Starter 14 days, Standard 10 days, Pro 7 days. For concept, we deliver within 72 hours after you pay the verification fee.'
      }
    }
  ]
};

export function SEOHead({ title, description, type = 'website', image }: SEOHeadProps) {
  const location = useLocation();
  const { lang } = useLanguage();
  
  const defaultTitle = 'Nomia | Web Design in 72 Hours';
  const defaultDescription = 'Get a free website concept in 72 hours. Professional websites for small businesses. €50 verification, 100% refund if you don\'t like the demo.';
  const defaultImage = 'https://nomia.se/og-image.png';
  
  const pageTitle = title ? `${title} | Nomia` : defaultTitle;
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
    document.documentElement.lang = lang;
    
    // Update JSON-LD structured data
    let existingScript = document.querySelector('script[type="application/ld+json"]');
    
    // Determine which schema to use based on page
    let schema;
    if (location.pathname === '/faq') {
      schema = faqSchema;
    } else if (location.pathname === '/priser') {
      schema = localBusinessSchema;
    } else {
      schema = organizationSchema;
    }
    
    if (existingScript) {
      existingScript.textContent = JSON.stringify(schema);
    } else {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }
  }, [pageTitle, pageDescription, pageImage, pageUrl, type, location.pathname, lang]);
  
  return null;
}
