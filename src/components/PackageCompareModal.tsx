import { Check, X, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { getCurrencyFromLang, formatPrice, getPackagePrice, getAddonPrice } from '@/config/currency';

interface PackageCompareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const tooltips: Record<string, { sv: string; en: string }> = {
  booking: {
    sv: 'Vi bygger ditt helt egna bokningssystem – inga tredjepartsavgifter.',
    en: 'We build your very own booking system – no third-party fees.'
  },
  analytics: {
    sv: 'Spåra besökare och konverteringar.',
    en: 'Track visitors and conversions.'
  },
  newsletter: {
    sv: 'Mailchimp eller liknande setup.',
    en: 'Mailchimp or similar setup.'
  },
  multiLanguage: {
    sv: 'Webbplatsen finns på både svenska och engelska.',
    en: 'The website is available in both Swedish and English.'
  },
  prioritySupport: {
    sv: 'Snabbare svarstider under projektet.',
    en: 'Faster response times during the project.'
  },
  checkoutSystem: {
    sv: 'Enkelt betalningsformulär för produkter/tjänster.',
    en: 'Simple payment form for products/services.'
  },
  revisions: {
    sv: 'Antal ändringsrundor som ingår.',
    en: 'Number of revision rounds included.'
  }
};

const freeInclusions = {
  sv: ['Mobilanpassad design', 'Kontaktformulär', 'Google Maps', 'SSL-certifikat', 'Grundläggande SEO', 'Lansering + genomgång'],
  en: ['Mobile-responsive design', 'Contact form', 'Google Maps', 'SSL certificate', 'Basic SEO', 'Launch + walkthrough']
};

export function PackageCompareModal({ open, onOpenChange }: PackageCompareModalProps) {
  const { t, lang } = useLanguage();
  const textLang = (lang === 'en' ? 'en' : 'sv') as 'sv' | 'en';
  const currency = getCurrencyFromLang(lang);
  
  // Build packages with dynamic pricing
  const bookingAddonPrice = formatPrice(getAddonPrice('booking', currency), currency);
  
  const packages = [
    { 
      id: 'starter', 
      name: 'Starter', 
      price: formatPrice(getPackagePrice('starter', currency), currency),
      pages: { sv: 'Upp till 3', en: 'Up to 3' },
      revisions: 10,
      features: {
        sv: ['Mobilanpassad design', 'Kontaktformulär', 'Google Maps', 'Grundläggande SEO', 'Lansering + genomgång'],
        en: ['Mobile-responsive design', 'Contact form', 'Google Maps', 'Basic SEO', 'Launch + walkthrough']
      },
      booking: false,
      bookingAddon: true,
      bookingAddonPrice,
      analytics: false,
      newsletter: false,
      prioritySupport: false,
      multiLanguage: false,
      checkoutSystem: false,
      checkoutAddon: true,
      checkoutAddonPrice: formatPrice(getAddonPrice('checkout', currency), currency)
    },
    { 
      id: 'standard', 
      name: 'Standard', 
      price: formatPrice(getPackagePrice('standard', currency), currency),
      pages: { sv: 'Upp till 5', en: 'Up to 5' },
      revisions: 20,
      popular: true,
      features: {
        sv: ['Allt i Starter', 'Bildgalleri/sektioner', 'Sociala länkar', 'Klickbar telefon/mail', 'Snabb laddtid'],
        en: ['Everything in Starter', 'Image gallery/sections', 'Social links', 'Clickable phone/email', 'Fast loading']
      },
      booking: false,
      bookingAddon: true,
      bookingAddonPrice,
      analytics: true,
      newsletter: true,
      prioritySupport: true,
      multiLanguage: true,
      checkoutSystem: true,
      checkoutAddon: false
    },
    { 
      id: 'pro', 
      name: 'Pro', 
      price: formatPrice(getPackagePrice('pro', currency), currency),
      pages: { sv: 'Obegränsat', en: 'Unlimited' },
      revisions: '∞',
      features: {
        sv: ['Allt i Standard', 'Bokningssystem ingår', 'Avancerad SEO', 'Custom integrationer', 'Dedicerad support'],
        en: ['Everything in Standard', 'Booking system included', 'Advanced SEO', 'Custom integrations', 'Dedicated support']
      },
      booking: true,
      bookingAddon: false,
      analytics: true,
      newsletter: true,
      prioritySupport: true,
      multiLanguage: true,
      checkoutSystem: true,
      checkoutAddon: false
    },
  ];

  const InfoIcon = ({ tooltipKey }: { tooltipKey: keyof typeof tooltips }) => (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-muted hover:bg-accent/20 transition-colors ml-1">
          <Info className="w-3 h-3 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" className="max-w-xs p-2">
        <p className="text-xs">{tooltips[tooltipKey][textLang]}</p>
      </PopoverContent>
    </Popover>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{t('Jämför paket', 'Compare packages')}</DialogTitle>
        </DialogHeader>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3"></th>
                {packages.map(pkg => (
                  <th key={pkg.id} className={`text-center p-3 ${pkg.popular ? 'bg-accent/10' : ''}`}>
                    <div className="font-semibold text-lg">{pkg.name}</div>
                    <div className="text-accent font-bold">{pkg.price}</div>
                    {pkg.popular && (
                      <span className="inline-block text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded mt-1">
                        {t('Populärast', 'Popular')}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="p-3 font-medium">{t('Antal sidor', 'Pages')}</td>
                {packages.map(pkg => (
                  <td key={pkg.id} className={`text-center p-3 ${pkg.popular ? 'bg-accent/5' : ''}`}>
                    {textLang === 'sv' ? pkg.pages.sv : pkg.pages.en}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border">
                <td className="p-3 font-medium flex items-center">
                  {t('Revisionsrundor', 'Revision rounds')}
                  <InfoIcon tooltipKey="revisions" />
                </td>
                {packages.map(pkg => (
                  <td key={pkg.id} className={`text-center p-3 ${pkg.popular ? 'bg-accent/5' : ''}`}>
                    {pkg.revisions === '∞' ? (
                      <span className="text-accent font-bold">{t('Obegränsat', 'Unlimited')}</span>
                    ) : (
                      pkg.revisions
                    )}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border">
                <td className="p-3 font-medium flex items-center">
                  {t('Bokningssystem', 'Booking system')}
                  <InfoIcon tooltipKey="booking" />
                </td>
                {packages.map(pkg => (
                  <td key={pkg.id} className={`text-center p-3 ${pkg.popular ? 'bg-accent/5' : ''}`}>
                    {pkg.booking ? (
                      <div className="flex flex-col items-center">
                        <Check className="w-5 h-5 text-accent mx-auto" />
                        <span className="text-xs text-green-500">{t('Ingår', 'Included')}</span>
                      </div>
                    ) : pkg.bookingAddon ? (
                      <span className="text-xs text-muted-foreground">+{pkg.bookingAddonPrice}</span>
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border">
                <td className="p-3 font-medium flex items-center">
                  {t('Kassasystem', 'Checkout system')}
                  <InfoIcon tooltipKey="checkoutSystem" />
                </td>
                {packages.map(pkg => (
                  <td key={pkg.id} className={`text-center p-3 ${pkg.popular ? 'bg-accent/5' : ''}`}>
                    {pkg.checkoutSystem ? (
                      <div className="flex flex-col items-center">
                        <Check className="w-5 h-5 text-accent mx-auto" />
                        <span className="text-xs text-green-500">{t('Ingår', 'Included')}</span>
                      </div>
                    ) : pkg.checkoutAddon ? (
                      <span className="text-xs text-muted-foreground">{pkg.checkoutAddonPrice}</span>
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border">
                <td className="p-3 font-medium flex items-center">
                  {t('Google Analytics', 'Google Analytics')}
                  <InfoIcon tooltipKey="analytics" />
                </td>
                {packages.map(pkg => (
                  <td key={pkg.id} className={`text-center p-3 ${pkg.popular ? 'bg-accent/5' : ''}`}>
                    {pkg.analytics ? (
                      <Check className="w-5 h-5 text-accent mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border">
                <td className="p-3 font-medium flex items-center">
                  {t('Nyhetsbrev setup', 'Newsletter setup')}
                  <InfoIcon tooltipKey="newsletter" />
                </td>
                {packages.map(pkg => (
                  <td key={pkg.id} className={`text-center p-3 ${pkg.popular ? 'bg-accent/5' : ''}`}>
                    {pkg.newsletter ? (
                      <Check className="w-5 h-5 text-accent mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border">
                <td className="p-3 font-medium flex items-center">
                  {t('Prioriterad support', 'Priority support')}
                  <InfoIcon tooltipKey="prioritySupport" />
                </td>
                {packages.map(pkg => (
                  <td key={pkg.id} className={`text-center p-3 ${pkg.popular ? 'bg-accent/5' : ''}`}>
                    {pkg.prioritySupport ? (
                      <Check className="w-5 h-5 text-accent mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border">
                <td className="p-3 font-medium flex items-center">
                  {t('Flerspråkig', 'Multi-language')}
                  <InfoIcon tooltipKey="multiLanguage" />
                </td>
                {packages.map(pkg => (
                  <td key={pkg.id} className={`text-center p-3 ${pkg.popular ? 'bg-accent/5' : ''}`}>
                    {pkg.multiLanguage ? (
                      <Check className="w-5 h-5 text-accent mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground mx-auto" />
                    )}
                  </td>
                ))}
              </tr>

              {/* Free inclusions section */}
              <tr className="border-b border-border bg-accent/5">
                <td colSpan={4} className="p-3 pt-6">
                  <div className="font-semibold text-sm text-accent mb-2">{t('Alltid inkluderat (gratis)', 'Always included (free)')}</div>
                  <div className="flex flex-wrap gap-2">
                    {freeInclusions[textLang].map((item, i) => (
                      <span key={i} className="text-xs bg-background/50 px-2 py-1 rounded-full text-muted-foreground">
                        {item}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}