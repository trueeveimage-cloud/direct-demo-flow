import { Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';

interface CarePlansCompareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isYearly: boolean;
}

const carePlans = [
  { 
    id: 'basic', 
    name: 'Basic', 
    monthlyPrice: 25,
    yearlyPrice: 20,
    features: {
      sv: [
        'Hosting (snabb + SSL)',
        'Säkerhetsuppdateringar',
        'Dagliga/veckovisa backups',
        'Uptime monitoring + alert',
        'Prestanda/säkerhetscheck 1x/mån'
      ],
      en: [
        'Hosting (fast + SSL)',
        'Security updates',
        'Daily/weekly backups',
        'Uptime monitoring + alerts',
        'Performance/security check 1x/month'
      ]
    },
    domain: true,
    email: false,
    editHours: 0,
    prioritySupport: false,
    seoCheck: false,
    speedOptimization: false,
    uptimeMonitoring: false,
    malwareCleanup: false,
    rollbackRestore: false
  },
  { 
    id: 'standard', 
    name: 'Standard', 
    monthlyPrice: 45,
    yearlyPrice: 36,
    popular: true,
    features: {
      sv: [
        'Allt i Basic',
        'Företagsmail (1–3 adresser)',
        '1 timme ändringar/mån',
        'Support inom 24–48h vardagar'
      ],
      en: [
        'Everything in Basic',
        'Business email (1-3 addresses)',
        '1 hour edits/month',
        'Support within 24-48h weekdays'
      ]
    },
    domain: true,
    email: true,
    editHours: 1,
    prioritySupport: false,
    seoCheck: false,
    speedOptimization: true,
    uptimeMonitoring: false,
    malwareCleanup: true,
    rollbackRestore: false
  },
  { 
    id: 'pro', 
    name: 'Pro', 
    monthlyPrice: 75,
    yearlyPrice: 60,
    features: {
      sv: [
        'Allt i Standard',
        '3 timmar ändringar/mån',
        'Prioriterad support',
        'Prestandaoptimering 1x/mån',
        'Basic SEO-check 1x/mån'
      ],
      en: [
        'Everything in Standard',
        '3 hours edits/month',
        'Priority support',
        'Performance optimization 1x/month',
        'Basic SEO check 1x/month'
      ]
    },
    domain: true,
    email: true,
    editHours: 3,
    prioritySupport: true,
    seoCheck: true,
    speedOptimization: true,
    uptimeMonitoring: true,
    malwareCleanup: true,
    rollbackRestore: true
  },
];

export function CarePlansCompareModal({ open, onOpenChange, isYearly }: CarePlansCompareModalProps) {
  const { t } = useLanguage();

  const getPrice = (plan: typeof carePlans[0]) => {
    const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
    return `€${price}/mo`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{t('Jämför vårdplaner', 'Compare care plans')}</DialogTitle>
        </DialogHeader>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3"></th>
                {carePlans.map(plan => (
                  <th key={plan.id} className={`text-center p-3 ${plan.popular ? 'bg-accent/10' : ''}`}>
                    <div className="font-semibold text-lg">{plan.name}</div>
                    <div className="text-accent font-bold">{getPrice(plan)}</div>
                    {isYearly && (
                      <div className="text-xs text-muted-foreground line-through">
                        €{plan.monthlyPrice}/mo
                      </div>
                    )}
                    {plan.popular && (
                      <span className="inline-block text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded mt-1">
                        {t('Rekommenderas', 'Recommended')}
                      </span>
                    )}
                    {plan.id === 'basic' && (
                      <p className="text-xs text-muted-foreground mt-2 italic">
                        {t('De flesta på Basic uppgraderar inom 60 dagar.', 'Most clients on Basic upgrade within 60 days.')}
                      </p>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="p-3 font-medium">{t('Domän ingår', 'Domain included')}</td>
                {carePlans.map(plan => (
                  <td key={plan.id} className={`text-center p-3 ${plan.popular ? 'bg-accent/5' : ''}`}>
                    {plan.domain ? (
                      <Check className="w-5 h-5 text-accent mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border">
                <td className="p-3 font-medium">{t('Företagsmail', 'Business email')}</td>
                {carePlans.map(plan => (
                  <td key={plan.id} className={`text-center p-3 ${plan.popular ? 'bg-accent/5' : ''}`}>
                    {plan.email ? (
                      <Check className="w-5 h-5 text-accent mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border">
                <td className="p-3 font-medium">{t('Ändringar/månad', 'Edits/month')}</td>
                {carePlans.map(plan => (
                  <td key={plan.id} className={`text-center p-3 ${plan.popular ? 'bg-accent/5' : ''}`}>
                    {plan.editHours === 0 ? (
                      <X className="w-5 h-5 text-muted-foreground mx-auto" />
                    ) : (
                      `${plan.editHours} ${t('timmar', 'hours')}`
                    )}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border">
                <td className="p-3 font-medium">{t('Hastighetsoptimering', 'Speed optimization')}</td>
                {carePlans.map(plan => (
                  <td key={plan.id} className={`text-center p-3 ${plan.popular ? 'bg-accent/5' : ''}`}>
                    {plan.speedOptimization ? (
                      <Check className="w-5 h-5 text-accent mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border">
                <td className="p-3 font-medium">{t('Uptime-övervakning', 'Uptime monitoring')}</td>
                {carePlans.map(plan => (
                  <td key={plan.id} className={`text-center p-3 ${plan.popular ? 'bg-accent/5' : ''}`}>
                    {plan.uptimeMonitoring ? (
                      <Check className="w-5 h-5 text-accent mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border">
                <td className="p-3 font-medium">{t('Skadedjursrensning', 'Malware cleanup')}</td>
                {carePlans.map(plan => (
                  <td key={plan.id} className={`text-center p-3 ${plan.popular ? 'bg-accent/5' : ''}`}>
                    {plan.malwareCleanup ? (
                      <Check className="w-5 h-5 text-accent mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border">
                <td className="p-3 font-medium">{t('Rollback / återställ', 'Rollback / restore')}</td>
                {carePlans.map(plan => (
                  <td key={plan.id} className={`text-center p-3 ${plan.popular ? 'bg-accent/5' : ''}`}>
                    {plan.rollbackRestore ? (
                      <Check className="w-5 h-5 text-accent mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border">
                <td className="p-3 font-medium">{t('Prioriterad support', 'Priority support')}</td>
                {carePlans.map(plan => (
                  <td key={plan.id} className={`text-center p-3 ${plan.popular ? 'bg-accent/5' : ''}`}>
                    {plan.prioritySupport ? (
                      <Check className="w-5 h-5 text-accent mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border">
                <td className="p-3 font-medium">{t('SEO-check', 'SEO check')}</td>
                {carePlans.map(plan => (
                  <td key={plan.id} className={`text-center p-3 ${plan.popular ? 'bg-accent/5' : ''}`}>
                    {plan.seoCheck ? (
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
