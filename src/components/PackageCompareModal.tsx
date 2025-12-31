import { Check, X, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PackageCompareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const tooltips: Record<string, { sv: string; en: string }> = {
  booking: {
    sv: 'Integration med Bokadirekt, Calendly eller liknande.',
    en: 'Integration with Bokadirekt, Calendly or similar.'
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
  }
};

const packages = [
  { 
    id: 'starter', 
    name: 'Starter', 
    price: '€490',
    pages: 3,
    delivery: 14,
    revisions: 1,
    features: {
      sv: ['Mobilanpassad design', 'Kontaktformulär', 'Google Maps', 'Grundläggande SEO', 'Lansering + genomgång'],
      en: ['Mobile-responsive design', 'Contact form', 'Google Maps', 'Basic SEO', 'Launch + walkthrough']
    },
    booking: false,
    analytics: false,
    newsletter: false,
    prioritySupport: false,
    multiLanguage: false
  },
  { 
    id: 'standard', 
    name: 'Standard', 
    price: '€790',
    pages: 5,
    delivery: 10,
    revisions: 2,
    popular: true,
    features: {
      sv: ['Allt i Starter', 'Bildgalleri/sektioner', 'Sociala länkar', 'Klickbar telefon/mail', 'Snabb laddtid'],
      en: ['Everything in Starter', 'Image gallery/sections', 'Social links', 'Clickable phone/email', 'Fast loading']
    },
    booking: false,
    analytics: false,
    newsletter: false,
    prioritySupport: false,
    multiLanguage: true
  },
  { 
    id: 'pro', 
    name: 'Pro', 
    price: '€1,290',
    pages: 8,
    delivery: 7,
    revisions: 3,
    features: {
      sv: ['Allt i Standard', 'Bokningssystem', 'Google Analytics', 'Nyhetsbrev setup', 'Prioriterad support'],
      en: ['Everything in Standard', 'Booking system', 'Google Analytics', 'Newsletter setup', 'Priority support']
    },
    booking: true,
    analytics: true,
    newsletter: true,
    prioritySupport: true,
    multiLanguage: true
  },
];

export function PackageCompareModal({ open, onOpenChange }: PackageCompareModalProps) {
  const { t, lang } = useLanguage();

  const InfoIcon = ({ tooltipKey }: { tooltipKey: keyof typeof tooltips }) => (
    <TooltipProvider delayDuration={300}>
      <Tooltip defaultOpen={false}>
        <TooltipTrigger asChild>
          <button type="button" className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-muted hover:bg-accent/20 transition-colors ml-1">
            <Info className="w-3 h-3 text-muted-foreground" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs p-2">
          <p className="text-xs">{tooltips[tooltipKey][lang]}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
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
                    {t(`Upp till ${pkg.pages}`, `Up to ${pkg.pages}`)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border">
                <td className="p-3 font-medium">{t('Leveranstid', 'Delivery')}</td>
                {packages.map(pkg => (
                  <td key={pkg.id} className={`text-center p-3 ${pkg.popular ? 'bg-accent/5' : ''}`}>
                    {pkg.delivery} {t('dagar', 'days')}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border">
                <td className="p-3 font-medium">{t('Revisionsrundor', 'Revision rounds')}</td>
                {packages.map(pkg => (
                  <td key={pkg.id} className={`text-center p-3 ${pkg.popular ? 'bg-accent/5' : ''}`}>
                    {pkg.revisions}
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
              <tr className="border-b border-border">
                <td className="p-3 font-medium flex items-center">
                  {t('Bokningssystem', 'Booking system')}
                  <InfoIcon tooltipKey="booking" />
                </td>
                {packages.map(pkg => (
                  <td key={pkg.id} className={`text-center p-3 ${pkg.popular ? 'bg-accent/5' : ''}`}>
                    {pkg.booking ? (
                      <Check className="w-5 h-5 text-accent mx-auto" />
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
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}