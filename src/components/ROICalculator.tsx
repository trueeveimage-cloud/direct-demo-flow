import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, TrendingUp, X, DollarSign, Users, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';

const businessTypeMultipliers: Record<string, { lowCustomers: number; highCustomers: number }> = {
  barber: { lowCustomers: 8, highCustomers: 15 },
  nail: { lowCustomers: 6, highCustomers: 12 },
  restaurant: { lowCustomers: 15, highCustomers: 30 },
  gym: { lowCustomers: 5, highCustomers: 12 },
  clinic: { lowCustomers: 4, highCustomers: 10 },
  car: { lowCustomers: 3, highCustomers: 8 },
  cleaning: { lowCustomers: 4, highCustomers: 10 },
  realestate: { lowCustomers: 2, highCustomers: 5 },
  retail: { lowCustomers: 10, highCustomers: 25 },
  other: { lowCustomers: 5, highCustomers: 10 },
};

const businessTypes = [
  { id: 'barber', label: { sv: 'Frisör / Barberare', en: 'Barber / Hair salon' } },
  { id: 'nail', label: { sv: 'Nagelsalong', en: 'Nail salon' } },
  { id: 'restaurant', label: { sv: 'Restaurang / Café', en: 'Restaurant / Café' } },
  { id: 'gym', label: { sv: 'Gym / PT', en: 'Gym / PT' } },
  { id: 'clinic', label: { sv: 'Klinik', en: 'Clinic' } },
  { id: 'car', label: { sv: 'Bilverkstad', en: 'Car workshop' } },
  { id: 'cleaning', label: { sv: 'Städtjänst', en: 'Cleaning service' } },
  { id: 'realestate', label: { sv: 'Fastigheter', en: 'Real estate' } },
  { id: 'retail', label: { sv: 'Butik', en: 'Retail store' } },
  { id: 'other', label: { sv: 'Annat', en: 'Other' } },
];

export function ROICalculator() {
  const { t, lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [businessType, setBusinessType] = useState('');
  const [averageOrder, setAverageOrder] = useState('');
  const [showResult, setShowResult] = useState(false);

  const result = useMemo(() => {
    if (!businessType || !averageOrder) return null;
    
    const orderValue = parseFloat(averageOrder) || 0;
    const multiplier = businessTypeMultipliers[businessType] || businessTypeMultipliers.other;
    
    // Calculate new customers from website
    const newCustomersLow = multiplier.lowCustomers;
    const newCustomersHigh = multiplier.highCustomers;
    
    // Repeat customer factor (30-50% of new customers become repeat)
    const repeatFactor = 1.4;
    
    // Average visits per year per repeat customer
    const avgVisitsPerYear = businessType === 'barber' ? 8 : businessType === 'nail' ? 12 : businessType === 'restaurant' ? 6 : businessType === 'gym' ? 36 : 4;
    
    // First year: new customers + some repeats
    const lowMonthly = orderValue * newCustomersLow * repeatFactor;
    const highMonthly = orderValue * newCustomersHigh * repeatFactor;
    
    // Yearly with compounding repeat customers
    const lowYearly = (lowMonthly * 12) + (orderValue * newCustomersLow * avgVisitsPerYear * 0.3);
    const highYearly = (highMonthly * 12) + (orderValue * newCustomersHigh * avgVisitsPerYear * 0.5);
    
    return {
      lowCustomers: newCustomersLow,
      highCustomers: newCustomersHigh,
      lowMonthly: Math.round(lowMonthly),
      highMonthly: Math.round(highMonthly),
      lowYearly: Math.round(lowYearly),
      highYearly: Math.round(highYearly),
      avgVisitsPerYear,
    };
  }, [businessType, averageOrder]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sv-SE', { 
      style: 'currency', 
      currency: 'SEK',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  const handleCalculate = () => {
    if (businessType && averageOrder) {
      setShowResult(true);
    }
  };

  const resetCalculator = () => {
    setBusinessType('');
    setAverageOrder('');
    setShowResult(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <Button 
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="lg"
        className="group h-12 px-6 border-accent/50 hover:border-accent hover:bg-accent/10 text-foreground"
      >
        <Calculator className="w-5 h-5 mr-2 text-accent" />
        {t('Hur mycket omsättning går jag miste om?', 'How much revenue am I losing?')}
        <TrendingUp className="w-4 h-4 ml-2 text-accent group-hover:translate-x-1 transition-transform" />
      </Button>

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-accent" />
              {t('ROI-kalkylator', 'ROI Calculator')}
            </DialogTitle>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 py-4"
              >
                <p className="text-muted-foreground">
                  {t(
                    'Se hur mycket extra intäkter en professionell hemsida kan generera för ditt företag.',
                    'See how much extra revenue a professional website can generate for your business.'
                  )}
                </p>

                {/* Business Type */}
                <div className="space-y-2">
                  <Label>{t('Vilken typ av verksamhet har du?', 'What type of business do you have?')}</Label>
                  <Select value={businessType} onValueChange={setBusinessType}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('Välj verksamhetstyp', 'Select business type')} />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {lang === 'sv' ? type.label.sv : type.label.en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Average Order Value */}
                <div className="space-y-2">
                  <Label>{t('Genomsnittligt ordervärde (kr)', 'Average order value (SEK)')}</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder={t('T.ex. 500', 'E.g. 500')}
                      value={averageOrder}
                      onChange={(e) => setAverageOrder(e.target.value)}
                      className="pr-12"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      kr
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t(
                      'Vad betalar en typisk kund för ett besök/köp?',
                      'What does a typical customer pay per visit/purchase?'
                    )}
                  </p>
                </div>

                <Button 
                  onClick={handleCalculate}
                  className="w-full h-12"
                  disabled={!businessType || !averageOrder}
                >
                  {t('Beräkna min förlorade intäkt', 'Calculate my lost revenue')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6 py-4"
              >
                {result && (
                  <>
                    {/* Monthly Stats */}
                    <div className="p-6 rounded-xl bg-accent/10 border border-accent/30 space-y-4">
                      <div className="flex items-center gap-2 text-accent">
                        <Users className="w-5 h-5" />
                        <span className="font-semibold">
                          {t('Per månad', 'Per month')}
                        </span>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-muted-foreground text-sm mb-2">
                          {t(
                            `${result.lowCustomers}-${result.highCustomers} nya kunder/månad + återkommande besök`,
                            `${result.lowCustomers}-${result.highCustomers} new customers/month + repeat visits`
                          )}
                        </p>
                        <p className="text-3xl font-bold text-accent">
                          {formatCurrency(result.lowMonthly)} - {formatCurrency(result.highMonthly)}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t('extra intäkter per månad', 'extra revenue per month')}
                        </p>
                      </div>
                    </div>

                    {/* Yearly Stats */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/40 space-y-4">
                      <div className="flex items-center gap-2 text-accent">
                        <Calendar className="w-5 h-5" />
                        <span className="font-semibold">
                          {t('Per år', 'Per year')}
                        </span>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-4xl font-bold text-foreground">
                          {formatCurrency(result.lowYearly)} - {formatCurrency(result.highYearly)}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t('som du lämnar på bordet', 'that you\'re leaving on the table')}
                        </p>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="space-y-3">
                      <Button asChild className="w-full h-12" size="lg">
                        <Link to="/demo" onClick={() => setIsOpen(false)}>
                          {t('Sluta missa intäkter - Kom igång', 'Stop missing revenue - Get started')}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        className="w-full text-muted-foreground"
                        onClick={resetCalculator}
                      >
                        {t('Beräkna igen', 'Calculate again')}
                      </Button>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
}
