// Feature tooltips for pricing items
export const featureTooltips: Record<string, { sv: string; en: string }> = {
  'Bokningssystem': {
    sv: 'Integration med Bokadirekt, Calendly eller liknande. Låter kunder boka tid direkt på sidan.',
    en: 'Integration with Bokadirekt, Calendly or similar. Lets customers book appointments directly on the site.'
  },
  'Booking system': {
    sv: 'Integration med Bokadirekt, Calendly eller liknande. Låter kunder boka tid direkt på sidan.',
    en: 'Integration with Bokadirekt, Calendly or similar. Lets customers book appointments directly on the site.'
  },
  'Google Analytics': {
    sv: 'Spåra besökare, sidvisningar och konverteringar för att förstå din trafik.',
    en: 'Track visitors, page views and conversions to understand your traffic.'
  },
  'Google Analytics / tracking': {
    sv: 'Spåra besökare, sidvisningar och konverteringar för att förstå din trafik.',
    en: 'Track visitors, page views and conversions to understand your traffic.'
  },
  'Nyhetsbrev setup': {
    sv: 'Mailchimp eller liknande setup för att samla e-postadresser och skicka nyhetsbrev.',
    en: 'Mailchimp or similar setup to collect email addresses and send newsletters.'
  },
  'Newsletter setup': {
    sv: 'Mailchimp eller liknande setup för att samla e-postadresser och skicka nyhetsbrev.',
    en: 'Mailchimp or similar setup to collect email addresses and send newsletters.'
  },
  'Prioriterad support': {
    sv: 'Snabbare svarstider och direkt kontakt under projektet.',
    en: 'Faster response times and direct contact during the project.'
  },
  'Priority support': {
    sv: 'Snabbare svarstider och direkt kontakt under projektet.',
    en: 'Faster response times and direct contact during the project.'
  },
  'Grundläggande SEO': {
    sv: 'Titlar, metabeskrivningar och struktur optimerad för sökmotorer.',
    en: 'Titles, meta descriptions and structure optimized for search engines.'
  },
  'Basic SEO': {
    sv: 'Titlar, metabeskrivningar och struktur optimerad för sökmotorer.',
    en: 'Titles, meta descriptions and structure optimized for search engines.'
  },
  'Flerspråkig': {
    sv: 'Webbplatsen finns på både svenska och engelska.',
    en: 'The website is available in both Swedish and English.'
  },
  'Multi-language': {
    sv: 'Webbplatsen finns på både svenska och engelska.',
    en: 'The website is available in both Swedish and English.'
  },
  'Bildgalleri/sektioner': {
    sv: 'Snygga galleri med dina bilder, t.ex. före/efter, tjänster, prislista.',
    en: 'Nice galleries with your images, e.g. before/after, services, price list.'
  },
  'Image gallery/sections': {
    sv: 'Snygga galleri med dina bilder, t.ex. före/efter, tjänster, prislista.',
    en: 'Nice galleries with your images, e.g. before/after, services, price list.'
  },
  'Domän inkluderad': {
    sv: 'Vi hanterar din domän åt dig, ingår i månadsavgiften.',
    en: 'We manage your domain for you, included in the monthly fee.'
  },
  'Domain included': {
    sv: 'Vi hanterar din domän åt dig, ingår i månadsavgiften.',
    en: 'We manage your domain for you, included in the monthly fee.'
  },
  'Företagsmail': {
    sv: '1-3 e-postadresser som info@dittforetag.se.',
    en: '1-3 email addresses like info@yourcompany.com.'
  },
  'Business email': {
    sv: '1-3 e-postadresser som info@dittforetag.se.',
    en: '1-3 email addresses like info@yourcompany.com.'
  },
  'Prestandaoptimering': {
    sv: 'Månatlig optimering av laddtid och Core Web Vitals.',
    en: 'Monthly optimization of load time and Core Web Vitals.'
  },
  'Performance optimization': {
    sv: 'Månatlig optimering av laddtid och Core Web Vitals.',
    en: 'Monthly optimization of load time and Core Web Vitals.'
  },
  'SEO-check': {
    sv: 'Månatlig kontroll av metadata, indexering och trasiga länkar.',
    en: 'Monthly check of metadata, indexing and broken links.'
  },
  'SEO check': {
    sv: 'Månatlig kontroll av metadata, indexering och trasiga länkar.',
    en: 'Monthly check of metadata, indexing and broken links.'
  },
};

export function getTooltip(feature: string, lang: 'sv' | 'en'): string | undefined {
  const tooltip = featureTooltips[feature];
  if (tooltip) {
    return tooltip[lang];
  }
  // Check partial matches
  for (const key of Object.keys(featureTooltips)) {
    if (feature.includes(key) || key.includes(feature.split(' ')[0])) {
      return featureTooltips[key][lang];
    }
  }
  return undefined;
}
