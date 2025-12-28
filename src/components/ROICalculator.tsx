import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, TrendingUp, DollarSign, Users, Calendar, ArrowRight, Building, Globe, Target, Percent, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';

const businessTypeMultipliers: Record<string, { lowCustomers: number; highCustomers: number; avgVisitsPerYear: number }> = {
  barber: { lowCustomers: 8, highCustomers: 15, avgVisitsPerYear: 8 },
  nail: { lowCustomers: 6, highCustomers: 12, avgVisitsPerYear: 12 },
  restaurant: { lowCustomers: 15, highCustomers: 30, avgVisitsPerYear: 6 },
  gym: { lowCustomers: 5, highCustomers: 12, avgVisitsPerYear: 36 },
  clinic: { lowCustomers: 4, highCustomers: 10, avgVisitsPerYear: 4 },
  car: { lowCustomers: 3, highCustomers: 8, avgVisitsPerYear: 2 },
  cleaning: { lowCustomers: 4, highCustomers: 10, avgVisitsPerYear: 12 },
  realestate: { lowCustomers: 2, highCustomers: 5, avgVisitsPerYear: 1 },
  retail: { lowCustomers: 10, highCustomers: 25, avgVisitsPerYear: 4 },
  other: { lowCustomers: 5, highCustomers: 10, avgVisitsPerYear: 4 },
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
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Basic fields
  const [businessType, setBusinessType] = useState('');
  const [averageOrder, setAverageOrder] = useState('');
  
  // Advanced fields for more accuracy
  const [hasWebsite, setHasWebsite] = useState<'no' | 'old' | 'modern'>('no');
  const [monthlyCustomers, setMonthlyCustomers] = useState('');
  const [socialMediaFollowers, setSocialMediaFollowers] = useState('');
  const [repeatCustomerPercent, setRepeatCustomerPercent] = useState([35]);
  const [competitionLevel, setCompetitionLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [localPopulation, setLocalPopulation] = useState<'small' | 'medium' | 'large'>('medium');
  const [currentOnlinePresence, setCurrentOnlinePresence] = useState<'none' | 'social' | 'both'>('none');
  
  const [showResult, setShowResult] = useState(false);

  const result = useMemo(() => {
    if (!businessType || !averageOrder) return null;
    
    const orderValue = parseFloat(averageOrder) || 0;
    const multiplier = businessTypeMultipliers[businessType] || businessTypeMultipliers.other;
    
    // Base new customers from website
    let newCustomersLow = multiplier.lowCustomers;
    let newCustomersHigh = multiplier.highCustomers;
    
    // Adjust based on current website status
    if (hasWebsite === 'old') {
      // Old website means less improvement potential
      newCustomersLow *= 0.7;
      newCustomersHigh *= 0.8;
    } else if (hasWebsite === 'modern') {
      // Already have modern site, less ROI
      newCustomersLow *= 0.3;
      newCustomersHigh *= 0.4;
    } else {
      // No website = biggest impact
      newCustomersLow *= 1.2;
      newCustomersHigh *= 1.3;
    }
    
    // Adjust based on competition
    if (competitionLevel === 'low') {
      newCustomersLow *= 1.3;
      newCustomersHigh *= 1.4;
    } else if (competitionLevel === 'high') {
      newCustomersLow *= 0.7;
      newCustomersHigh *= 0.8;
    }
    
    // Adjust based on local population
    if (localPopulation === 'large') {
      newCustomersLow *= 1.4;
      newCustomersHigh *= 1.5;
    } else if (localPopulation === 'small') {
      newCustomersLow *= 0.6;
      newCustomersHigh *= 0.7;
    }
    
    // Adjust based on online presence
    if (currentOnlinePresence === 'both') {
      newCustomersLow *= 1.2;
      newCustomersHigh *= 1.3;
    } else if (currentOnlinePresence === 'none') {
      newCustomersLow *= 0.9;
      newCustomersHigh *= 0.95;
    }
    
    // Social media boost
    const followers = parseInt(socialMediaFollowers) || 0;
    if (followers > 5000) {
      newCustomersLow *= 1.3;
      newCustomersHigh *= 1.4;
    } else if (followers > 1000) {
      newCustomersLow *= 1.15;
      newCustomersHigh *= 1.2;
    }
    
    // Round values
    newCustomersLow = Math.round(newCustomersLow);
    newCustomersHigh = Math.round(newCustomersHigh);
    
    // Repeat customer factor based on input or default
    const repeatFactor = 1 + (repeatCustomerPercent[0] / 100);
    
    // First year: new customers + some repeats
    const lowMonthly = orderValue * newCustomersLow * repeatFactor;
    const highMonthly = orderValue * newCustomersHigh * repeatFactor;
    
    // Yearly with compounding repeat customers
    const avgVisitsPerYear = multiplier.avgVisitsPerYear;
    const lowYearly = (lowMonthly * 12) + (orderValue * newCustomersLow * avgVisitsPerYear * (repeatCustomerPercent[0] / 100));
    const highYearly = (highMonthly * 12) + (orderValue * newCustomersHigh * avgVisitsPerYear * ((repeatCustomerPercent[0] + 15) / 100));
    
    // Website cost comparison
    const websiteCost = 7900; // Standard package
    const roiMonthsLow = websiteCost / lowMonthly;
    const roiMonthsHigh = websiteCost / highMonthly;
    
    return {
      lowCustomers: newCustomersLow,
      highCustomers: newCustomersHigh,
      lowMonthly: Math.round(lowMonthly),
      highMonthly: Math.round(highMonthly),
      lowYearly: Math.round(lowYearly),
      highYearly: Math.round(highYearly),
      avgVisitsPerYear,
      roiMonthsLow: Math.round(roiMonthsLow * 10) / 10,
      roiMonthsHigh: Math.round(roiMonthsHigh * 10) / 10,
      websiteCost,
    };
  }, [businessType, averageOrder, hasWebsite, competitionLevel, localPopulation, currentOnlinePresence, socialMediaFollowers, repeatCustomerPercent]);

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
    setHasWebsite('no');
    setMonthlyCustomers('');
    setSocialMediaFollowers('');
    setRepeatCustomerPercent([35]);
    setCompetitionLevel('medium');
    setLocalPopulation('medium');
    setCurrentOnlinePresence('none');
    setShowAdvanced(false);
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
        {t('💸 Hur mycket pengar förlorar jag?', '💸 How much money am I losing?')}
        <TrendingUp className="w-4 h-4 ml-2 text-accent group-hover:translate-x-1 transition-transform" />
      </Button>

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
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
                    'Fyll i information om ditt företag för att se hur mycket extra intäkter en professionell hemsida kan generera.',
                    'Fill in information about your business to see how much extra revenue a professional website can generate.'
                  )}
                </p>

                {/* Business Type */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-accent" />
                    {t('Vilken typ av verksamhet har du?', 'What type of business do you have?')} *
                  </Label>
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
                  <Label className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-accent" />
                    {t('Genomsnittligt ordervärde (kr)', 'Average order value (SEK)')} *
                  </Label>
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
                </div>

                {/* Current Website Status */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-accent" />
                    {t('Har du en hemsida idag?', 'Do you have a website today?')}
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'no', label: { sv: 'Nej', en: 'No' } },
                      { id: 'old', label: { sv: 'Ja, gammal', en: 'Yes, outdated' } },
                      { id: 'modern', label: { sv: 'Ja, modern', en: 'Yes, modern' } },
                    ].map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setHasWebsite(option.id as typeof hasWebsite)}
                        className={`p-3 rounded-lg border-2 text-sm transition-all ${
                          hasWebsite === option.id
                            ? 'border-accent bg-accent/10'
                            : 'border-border hover:border-accent/50'
                        }`}
                      >
                        {lang === 'sv' ? option.label.sv : option.label.en}
                      </button>
                    ))}
                  </div>
                  {hasWebsite === 'no' && (
                    <p className="text-xs text-accent">
                      {t('🚀 Största potentialen! Du kan vinna många nya kunder.', '🚀 Biggest potential! You can win many new customers.')}
                    </p>
                  )}
                </div>

                {/* Advanced Options Toggle */}
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-sm text-accent hover:underline"
                >
                  {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {t('Mer info för noggrannare beräkning', 'More info for accurate calculation')}
                </button>

                {/* Advanced Options */}
                <AnimatePresence>
                  {showAdvanced && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 p-4 bg-secondary/50 rounded-xl"
                    >
                      {/* Competition Level */}
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-accent" />
                          {t('Konkurrensnivå i ditt område', 'Competition level in your area')}
                        </Label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: 'low', label: { sv: 'Låg', en: 'Low' } },
                            { id: 'medium', label: { sv: 'Medel', en: 'Medium' } },
                            { id: 'high', label: { sv: 'Hög', en: 'High' } },
                          ].map((option) => (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => setCompetitionLevel(option.id as typeof competitionLevel)}
                              className={`p-2 rounded-lg border text-xs transition-all ${
                                competitionLevel === option.id
                                  ? 'border-accent bg-accent/10'
                                  : 'border-border hover:border-accent/50'
                              }`}
                            >
                              {lang === 'sv' ? option.label.sv : option.label.en}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Local Population */}
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-accent" />
                          {t('Storlek på ditt område', 'Size of your area')}
                        </Label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: 'small', label: { sv: 'Liten stad', en: 'Small town' } },
                            { id: 'medium', label: { sv: 'Mellanstor', en: 'Medium city' } },
                            { id: 'large', label: { sv: 'Storstad', en: 'Large city' } },
                          ].map((option) => (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => setLocalPopulation(option.id as typeof localPopulation)}
                              className={`p-2 rounded-lg border text-xs transition-all ${
                                localPopulation === option.id
                                  ? 'border-accent bg-accent/10'
                                  : 'border-border hover:border-accent/50'
                              }`}
                            >
                              {lang === 'sv' ? option.label.sv : option.label.en}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Online Presence */}
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-accent" />
                          {t('Nuvarande online-närvaro', 'Current online presence')}
                        </Label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: 'none', label: { sv: 'Ingen', en: 'None' } },
                            { id: 'social', label: { sv: 'Sociala medier', en: 'Social media' } },
                            { id: 'both', label: { sv: 'Social + Google', en: 'Social + Google' } },
                          ].map((option) => (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => setCurrentOnlinePresence(option.id as typeof currentOnlinePresence)}
                              className={`p-2 rounded-lg border text-xs transition-all ${
                                currentOnlinePresence === option.id
                                  ? 'border-accent bg-accent/10'
                                  : 'border-border hover:border-accent/50'
                              }`}
                            >
                              {lang === 'sv' ? option.label.sv : option.label.en}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Social Media Followers */}
                      <div className="space-y-2">
                        <Label>{t('Antal följare på sociala medier', 'Social media followers')}</Label>
                        <Input
                          type="number"
                          placeholder={t('T.ex. 500', 'E.g. 500')}
                          value={socialMediaFollowers}
                          onChange={(e) => setSocialMediaFollowers(e.target.value)}
                        />
                      </div>

                      {/* Repeat Customer Percentage */}
                      <div className="space-y-3">
                        <Label className="flex items-center gap-2">
                          <Percent className="w-4 h-4 text-accent" />
                          {t('Hur många blir återkommande kunder?', 'How many become repeat customers?')} ({repeatCustomerPercent[0]}%)
                        </Label>
                        <Slider
                          value={repeatCustomerPercent}
                          onValueChange={setRepeatCustomerPercent}
                          min={10}
                          max={80}
                          step={5}
                          className="py-2"
                        />
                        <p className="text-xs text-muted-foreground">
                          {t('Typiskt: 30-50% för tjänsteföretag', 'Typical: 30-50% for service businesses')}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

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
                className="space-y-5 py-4"
              >
                {result && (
                  <>
                    {/* Monthly Stats */}
                    <div className="p-5 rounded-xl bg-accent/10 border border-accent/30 space-y-4">
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
                    <div className="p-5 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/40 space-y-4">
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

                    {/* ROI Payback */}
                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-2">
                        <Clock className="w-5 h-5" />
                        <span className="font-semibold">{t('ROI Återbetalningstid', 'ROI Payback Period')}</span>
                      </div>
                      <p className="text-sm">
                        {t(
                          `En hemsida för ${formatCurrency(result.websiteCost)} betalar sig själv på bara ${result.roiMonthsHigh}-${result.roiMonthsLow} månader!`,
                          `A website for ${formatCurrency(result.websiteCost)} pays for itself in just ${result.roiMonthsHigh}-${result.roiMonthsLow} months!`
                        )}
                      </p>
                    </div>

                    {/* Website Impact Note */}
                    {hasWebsite === 'no' && (
                      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                        <p className="text-sm">
                          🎯 {t(
                            'Utan hemsida idag är din potential störst! Du missar kunder som söker online.',
                            'Without a website today, your potential is biggest! You\'re missing customers who search online.'
                          )}
                        </p>
                      </div>
                    )}

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
