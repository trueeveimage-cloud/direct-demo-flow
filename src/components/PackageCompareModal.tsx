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
    features: {
      sv: ['Responsiv design', 'Mobil-först', 'Kontaktformulär', 'SEO-grundläggande', '1 revision'],
      en: ['Responsive design', 'Mobile-first', 'Contact form', 'Basic SEO', '1 revision']
    },
    booking: false,
    multiLanguage: false
  },
  { 
    id: 'standard', 
    name: 'Standard', 
    price: '7 900 kr',
    pages: 5,
    delivery: 10,
    popular: true,
    features: {
      sv: ['Allt i Starter', '2 revisioner', 'Google Maps', 'Sociala medier', 'Bildgalleri'],
      en: ['Everything in Starter', '2 revisions', 'Google Maps', 'Social media', 'Image gallery']
    },
    booking: false,
    multiLanguage: true
  },
  { 
    id: 'pro', 
    name: 'Pro', 
    price: '12 900 kr',
    pages: 8,
    delivery: 7,
    features: {
      sv: ['Allt i Standard', '3 revisioner', 'Bokningsintegration', 'Nyhetsbrev', 'Google Analytics', 'Prioriterad support'],
      en: ['Everything in Standard', '3 revisions', 'Booking integration', 'Newsletter', 'Google Analytics', 'Priority support']
    },
    booking: true,
    multiLanguage: true
  },
];

export function PackageCompareModal({ open, onOpenChange }: PackageCompareModalProps) {
  const { t, lang } = useLanguage();

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
                <td className="p-3 font-medium">{t('Flera språk', 'Multi-language')}</td>
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
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
