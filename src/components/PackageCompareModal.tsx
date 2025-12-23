import { Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';

interface PackageCompareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const packages = [
  { 
    id: 'starter', 
    name: 'Starter', 
    price: '4 900 kr',
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
    prioritySupport: false
  },
  { 
    id: 'standard', 
    name: 'Standard', 
    price: '7 900 kr',
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
    prioritySupport: false
  },
  { 
    id: 'pro', 
    name: 'Pro', 
    price: '12 900 kr',
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
    prioritySupport: true
  },
];

export function PackageCompareModal({ open, onOpenChange }: PackageCompareModalProps) {
  const { t } = useLanguage();

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
                <td className="p-3 font-medium">{t('Bokningssystem', 'Booking system')}</td>
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
                <td className="p-3 font-medium">{t('Google Analytics', 'Google Analytics')}</td>
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
                <td className="p-3 font-medium">{t('Nyhetsbrev setup', 'Newsletter setup')}</td>
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
                <td className="p-3 font-medium">{t('Prioriterad support', 'Priority support')}</td>
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