import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, TrendingUp, DollarSign, Users, Calendar, ArrowRight, Target, BarChart3, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { InfoTooltip } from '@/components/InfoTooltip';

const businessTypeMultipliers: Record<string, { lowCustomers: number; highCustomers: number; multiplier: number }> = {
  barber: { lowCustomers: 8, highCustomers: 15, multiplier: 3 },
  nail: { lowCustomers: 6, highCustomers: 12, multiplier: 2.5 },
  restaurant: { lowCustomers: 15, highCustomers: 30, multiplier: 4 },
  gym: { lowCustomers: 5, highCustomers: 12, multiplier: 2 },
  clinic: { lowCustomers: 4, highCustomers: 10, multiplier: 5 },
  car: { lowCustomers: 3, highCustomers: 8, multiplier: 3.5 },
  cleaning: { lowCustomers: 4, highCustomers: 10, multiplier: 2.5 },
  realestate: { lowCustomers: 2, highCustomers: 5, multiplier: 8 },
  retail: { lowCustomers: 10, highCustomers: 25, multiplier: 3 },
  other: { lowCustomers: 5, highCustomers: 10, multiplier: 2.5 },
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

const revenueRanges = [
  { id: 'less1k', label: { sv: 'Under €1,000', en: 'Under €1,000' }, value: 1000 },
  { id: '1k-3k', label: { sv: '€1,000 - €3,000', en: '€1,000 - €3,000' }, value: 2000 },
  { id: '3k-5k', label: { sv: '€3,000 - €5,000', en: '€3,000 - €5,000' }, value: 4000 },
  { id: '5k-10k', label: { sv: '€5,000 - €10,000', en: '€5,000 - €10,000' }, value: 7500 },
  { id: '10k-20k', label: { sv: '€10,000 - €20,000', en: '€10,000 - €20,000' }, value: 15000 },
  { id: 'more20k', label: { sv: 'Över €20,000', en: 'Over €20,000' }, value: 25000 },
];

const businessGoalOptions = [
  { id: 'bookings', label: { sv: 'Fler bokningar', en: 'More bookings' }, icon: '📅' },
  { id: 'calls', label: { sv: 'Fler samtal', en: 'More calls' }, icon: '📞' },
  { id: 'quotes', label: { sv: 'Fler offertförfrågningar', en: 'More quote requests' }, icon: '📋' },
  { id: 'trust', label: { sv: 'Mer förtroende', en: 'More trust' }, icon: '🤝' },
  { id: 'sell', label: { sv: 'Sälja online', en: 'Sell online' }, icon: '🛒' },
];

export function ROICalculator() {
  const { t, lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [businessType, setBusinessType] = useState('');
  const [averageOrder, setAverageOrder] = useState('');
  const [hasWebsite, setHasWebsite] = useState<boolean | null>(null);
  const [businessGoal, setBusinessGoal] = useState('');
  const [targetCustomersPerWeek, setTargetCustomersPerWeek] = useState('');
  const [revenueRange, setRevenueRange] = useState('');
  const [websiteImpact, setWebsiteImpact] = useState<number[]>([5]);
  const [showResult, setShowResult] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const result = useMemo(() => {
    if (!businessType || !averageOrder) return null;
    
    const orderValue = parseFloat(averageOrder) || 0;
    const data = businessTypeMultipliers[businessType] || businessTypeMultipliers.other;
    const targetCustomers = parseFloat(targetCustomersPerWeek) || 0;
    const impact = websiteImpact[0] / 10;
    const revenue = revenueRanges.find(r => r.id === revenueRange)?.value || 0;
    
    // Calculate new customers from website
    const newCustomersLow = data.lowCustomers;
    const newCustomersHigh = data.highCustomers;
    
    // Repeat customer factor
    const repeatFactor = 1.4;
    
    // Average visits per year per repeat customer
    const avgVisitsPerYear = businessType === 'barber' ? 8 : businessType === 'nail' ? 12 : businessType === 'restaurant' ? 6 : businessType === 'gym' ? 36 : 4;
    
    // Base monthly calculation
    let lowMonthly = orderValue * newCustomersLow * repeatFactor;
    let highMonthly = orderValue * newCustomersHigh * repeatFactor;
    
    // Factor in website impact and target customers if provided
    if (targetCustomers > 0) {
      const baseFromOrders = orderValue * targetCustomers * 4 * impact * data.multiplier;
      lowMonthly = Math.max(lowMonthly, baseFromOrders * 0.7);
      highMonthly = Math.max(highMonthly, baseFromOrders);
    }
    
    // Factor in revenue range if provided
    if (revenue > 0) {
      const baseFromRevenue = revenue * impact * 0.15;
      lowMonthly = Math.max(lowMonthly, baseFromRevenue * 0.7);
      highMonthly = Math.max(highMonthly, baseFromRevenue);
    }
    
    // Apply no-website penalty
    if (hasWebsite === false) {
      lowMonthly *= 1.3;
      highMonthly *= 1.3;
    }
    
    // Yearly with compounding repeat customers
    const lowYearly = (lowMonthly * 12) + (orderValue * newCustomersLow * avgVisitsPerYear * 0.3);
    const highYearly = (highMonthly * 12) + (orderValue * newCustomersHigh * avgVisitsPerYear * 0.5);
    
    // Package recommendation
    let packageSuggestion = '';
    if (revenue > 50000 || highYearly > 100000) {
      packageSuggestion = 'Pro';
    } else if (revenue > 20000 || highYearly > 50000) {
      packageSuggestion = 'Standard';
    } else {
      packageSuggestion = 'Starter';
    }
    
    return {
      lowCustomers: newCustomersLow,
      highCustomers: newCustomersHigh,
      lowMonthly: Math.round(lowMonthly),
      highMonthly: Math.round(highMonthly),
      lowYearly: Math.round(lowYearly),
      highYearly: Math.round(highYearly),
      avgVisitsPerYear,
      packageSuggestion,
      hasWebsite,
    };
  }, [businessType, averageOrder, hasWebsite, targetCustomersPerWeek, revenueRange, websiteImpact]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EU', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  const handleCalculate = () => {
    if (businessType && averageOrder) {
      setIsCalculating(true);
      setTimeout(() => {
        setIsCalculating(false);
        setShowResult(true);
      }, 1500);
    }
  };

  const resetCalculator = () => {
    setBusinessType('');
    setAverageOrder('');
    setHasWebsite(null);
    setBusinessGoal('');
    setTargetCustomersPerWeek('');
    setRevenueRange('');
    setWebsiteImpact([5]);
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
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
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
                className="space-y-5 py-4"
              >
                <p className="text-muted-foreground text-sm">
                  {t(
                    'Se hur mycket intäkter du förlorar utan en professionell hemsida.',
                    'See how much revenue you\'re losing without a professional website.'
                  )}
                </p>

                {/* Has Website */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    {t('Har du en hemsida idag?', 'Do you have a website today?')} *
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setHasWebsite(true)}
                      className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                        hasWebsite === true ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/50'
                      }`}
                    >
                      <Check className={`w-4 h-4 ${hasWebsite === true ? 'text-accent' : ''}`} />
                      <span className="font-medium">{t('Ja', 'Yes')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasWebsite(false)}
                      className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                        hasWebsite === false ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/50'
                      }`}
                    >
                      <span className="font-medium">{t('Nej', 'No')}</span>
                    </button>
                  </div>
                </div>

                {/* Business Type */}
                <div className="space-y-2">
                  <Label>{t('Vilken typ av verksamhet har du?', 'What type of business do you have?')} *</Label>
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

                {/* Business Goal */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    {t('Vad skulle hjälpa dig mest?', 'What would help you most?')}
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {businessGoalOptions.map((goal) => (
                      <button
                        key={goal.id}
                        type="button"
                        onClick={() => setBusinessGoal(goal.id)}
                        className={`px-3 py-1.5 rounded-lg border-2 text-sm transition-all flex items-center gap-1.5 ${
                          businessGoal === goal.id ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/50'
                        }`}
                      >
                        <span>{goal.icon}</span>
                        <span>{lang === 'sv' ? goal.label.sv : goal.label.en}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Average Order Value */}
                <div className="space-y-2">
                  <Label>{t('Genomsnittligt ordervärde (€)', 'Average order value (€)')} *</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder={t('T.ex. 50', 'E.g. 50')}
                      value={averageOrder}
                      onChange={(e) => setAverageOrder(e.target.value)}
                      className="pr-12"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      €
                    </span>
                  </div>
                </div>

                {/* Target Customers */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    {t('Målantal kunder/vecka', 'Target customers/week')}
                    <InfoTooltip content={t('Hur många kunder vill du nå per vecka?', 'How many customers do you want to reach per week?')} />
                  </Label>
                  <Input
                    type="number"
                    placeholder={t('T.ex. 20', 'E.g. 20')}
                    value={targetCustomersPerWeek}
                    onChange={(e) => setTargetCustomersPerWeek(e.target.value)}
                  />
                </div>

                {/* Monthly Revenue Range */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-muted-foreground" />
                    {t('Nuvarande månadsintäkt', 'Current monthly revenue')}
                  </Label>
                  <Select value={revenueRange} onValueChange={setRevenueRange}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('Välj intervall', 'Select range')} />
                    </SelectTrigger>
                    <SelectContent>
                      {revenueRanges.map((range) => (
                        <SelectItem key={range.id} value={range.id}>
                          {lang === 'sv' ? range.label.sv : range.label.en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Website Impact Slider */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    {t('Hur mycket tror du en hemsida skulle hjälpa?', 'How much would a website help?')}
                  </Label>
                  <div className="px-2">
                    <Slider
                      value={websiteImpact}
                      onValueChange={setWebsiteImpact}
                      min={1}
                      max={10}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{t('Lite', 'Little')}</span>
                      <span className="font-bold text-accent">{websiteImpact[0]}/10</span>
                      <span>{t('Mycket', 'A lot')}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleCalculate}
                  className="w-full h-12"
                  disabled={!businessType || !averageOrder || isCalculating}
                >
                  {isCalculating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t('Beräknar...', 'Calculating...')}
                    </>
                  ) : (
                    <>
                      {t('Beräkna min förlorade intäkt', 'Calculate my lost revenue')}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
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
                    {/* No Website Warning */}
                    {result.hasWebsite === false && (
                      <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                        {t(
                          '⚠️ Utan hemsida går du miste om kunder varje dag!',
                          '⚠️ Without a website you\'re losing customers every day!'
                        )}
                      </div>
                    )}

                    {/* Monthly Stats */}
                    <div className="p-5 rounded-xl bg-destructive/10 border border-destructive/30 space-y-3">
                      <div className="flex items-center gap-2 text-destructive">
                        <Users className="w-5 h-5" />
                        <span className="font-semibold">
                          {t('Potentiell förlust per månad', 'Potential loss per month')}
                        </span>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-muted-foreground text-sm mb-2">
                          {t(
                            `${result.lowCustomers}-${result.highCustomers} missade kunder/månad`,
                            `${result.lowCustomers}-${result.highCustomers} missed customers/month`
                          )}
                        </p>
                        <p className="text-3xl font-bold text-destructive">
                          {formatCurrency(result.lowMonthly)} - {formatCurrency(result.highMonthly)}
                        </p>
                      </div>
                    </div>

                    {/* Yearly Stats */}
                    <div className="p-5 rounded-xl bg-gradient-to-br from-destructive/20 to-destructive/5 border border-destructive/40 space-y-3">
                      <div className="flex items-center gap-2 text-destructive">
                        <Calendar className="w-5 h-5" />
                        <span className="font-semibold">
                          {t('Potentiell förlust per år', 'Potential loss per year')}
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

                    {/* Package Recommendation */}
                    <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                      <p className="text-sm font-semibold">
                        {t('Rekommenderat paket:', 'Recommended package:')} <span className="text-accent">{result.packageSuggestion}</span>
                      </p>
                    </div>

                    {/* CTA */}
                    <div className="space-y-3">
                      <Button asChild className="w-full h-12" size="lg">
                        <Link to="/demo" onClick={() => setIsOpen(false)}>
                          {t('Sluta förlora intäkter - Kom igång', 'Stop losing revenue - Get started')}
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
