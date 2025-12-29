import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, TrendingUp, ArrowRight, Target, Check, Phone, CalendarCheck, FileText, ShoppingCart, Award, Instagram, Search, Users, Megaphone, Globe, HelpCircle, Sparkles, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';

// Business type data with realistic conversion factors
const businessTypes = [
  { id: 'barber', label: { sv: 'Frisör / Barberare', en: 'Barber / Hair salon' } },
  { id: 'nail', label: { sv: 'Nagelsalong', en: 'Nail salon' } },
  { id: 'restaurant', label: { sv: 'Restaurang / Café', en: 'Restaurant / Café' } },
  { id: 'gym', label: { sv: 'Gym / PT', en: 'Gym / PT' } },
  { id: 'clinic', label: { sv: 'Klinik / Vårdmottagning', en: 'Clinic / Healthcare' } },
  { id: 'car', label: { sv: 'Bilverkstad / Detailing', en: 'Car workshop / Detailing' } },
  { id: 'cleaning', label: { sv: 'Städ / Hemtjänst', en: 'Cleaning / Home services' } },
  { id: 'realestate', label: { sv: 'Fastigheter / Mäklare', en: 'Real estate / Agent' } },
  { id: 'retail', label: { sv: 'Butik / E-handel', en: 'Retail / E-commerce' } },
  { id: 'consultant', label: { sv: 'Konsult / Byrå', en: 'Consultant / Agency' } },
  { id: 'other', label: { sv: 'Annat', en: 'Other' } },
];

const goalOptions = [
  { id: 'bookings', label: { sv: 'Fler bokningar', en: 'More bookings' }, icon: CalendarCheck },
  { id: 'calls', label: { sv: 'Fler samtal', en: 'More calls' }, icon: Phone },
  { id: 'quotes', label: { sv: 'Fler offertförfrågningar', en: 'More quote requests' }, icon: FileText },
  { id: 'sell', label: { sv: 'Sälja online', en: 'Sell online' }, icon: ShoppingCart },
  { id: 'trust', label: { sv: 'Bygga förtroende', en: 'Build trust / brand' }, icon: Award },
];

const currentPresenceOptions = [
  { id: 'social', label: { sv: 'Bara Instagram/TikTok', en: 'Instagram/TikTok only' }, icon: Instagram },
  { id: 'google', label: { sv: 'Google Maps / Sök', en: 'Google Maps / Search' }, icon: Search },
  { id: 'wordofmouth', label: { sv: 'Rekommendationer', en: 'Word of mouth' }, icon: Users },
  { id: 'ads', label: { sv: 'Annonser', en: 'Paid ads' }, icon: Megaphone },
  { id: 'oldsite', label: { sv: 'Gammal hemsida', en: 'Outdated website' }, icon: Globe },
];

const missedLeadsOptions = [
  { id: '0-2', label: '0–2', multiplier: 1 },
  { id: '3-5', label: '3–5', multiplier: 4 },
  { id: '6-10', label: '6–10', multiplier: 8 },
  { id: '10+', label: '10+', multiplier: 12 },
];

const calculationSteps = [
  { sv: 'Analyserar din nuvarande närvaro...', en: 'Analyzing your current presence...' },
  { sv: 'Uppskattar missade förfrågningar...', en: 'Estimating missed enquiries...' },
  { sv: 'Beräknar potentiell intäktsökning...', en: 'Calculating potential uplift...' },
  { sv: 'Förbereder rekommendationer...', en: 'Preparing recommendations...' },
];

// Goal-based recommendations
const getRecommendations = (goal: string, lang: 'sv' | 'en') => {
  const recommendations: Record<string, { sv: string[]; en: string[] }> = {
    bookings: {
      sv: ['Tydlig bokningsknapp på varje sida', 'Visa lediga tider direkt', 'Snabb mobilvänlig upplevelse'],
      en: ['Clear booking button on every page', 'Show available slots directly', 'Fast mobile-first experience'],
    },
    calls: {
      sv: ['Click-to-call knapp i headern', 'Visa telefonnummer tydligt', 'Kontaktformulär som backup'],
      en: ['Click-to-call button in header', 'Display phone number prominently', 'Contact form as backup'],
    },
    quotes: {
      sv: ['Enkel offertförfrågan-formulär', 'Visa tidigare projekt/case', 'Priser eller prisintervall synliga'],
      en: ['Simple quote request form', 'Showcase previous projects/cases', 'Prices or price ranges visible'],
    },
    sell: {
      sv: ['Smidig checkout-upplevelse', 'Tydliga produktbilder', 'Betalningsalternativ synliga tidigt'],
      en: ['Smooth checkout experience', 'Clear product images', 'Payment options visible early'],
    },
    trust: {
      sv: ['Google-recensioner integrerade', 'Professionella bilder & design', 'Tydlig "Om oss" sektion'],
      en: ['Google reviews integrated', 'Professional photos & design', 'Clear "About us" section'],
    },
  };
  return recommendations[goal]?.[lang] || recommendations.trust[lang];
};

export function ROICalculator() {
  const { t, lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  
  // Form state
  const [businessType, setBusinessType] = useState('');
  const [primaryGoal, setPrimaryGoal] = useState('');
  const [weeklyLeads, setWeeklyLeads] = useState('');
  const [avgCustomerValue, setAvgCustomerValue] = useState('');
  const [currentPresence, setCurrentPresence] = useState<string[]>([]);
  const [missedLeads, setMissedLeads] = useState('');
  
  // UI state
  const [step, setStep] = useState<'form' | 'calculating' | 'result'>('form');
  const [calcProgress, setCalcProgress] = useState(0);
  const [calcStepIndex, setCalcStepIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // Calculate result
  const result = useMemo(() => {
    const value = parseFloat(avgCustomerValue) || 0;
    const missedData = missedLeadsOptions.find(m => m.id === missedLeads);
    const missedMultiplier = missedData?.multiplier || 4;
    
    // Calculate monthly missed revenue range
    const weeksPerMonth = 4;
    const lowMissed = Math.max(1, missedMultiplier - 2);
    const highMissed = missedMultiplier + 2;
    
    const lowMonthly = Math.round(lowMissed * value * weeksPerMonth);
    const highMonthly = Math.round(highMissed * value * weeksPerMonth);
    
    // Yearly projection
    const lowYearly = lowMonthly * 12;
    const highYearly = highMonthly * 12;
    
    return {
      lowMonthly,
      highMonthly,
      lowYearly,
      highYearly,
      recommendations: getRecommendations(primaryGoal || 'trust', lang),
    };
  }, [avgCustomerValue, missedLeads, primaryGoal, lang]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EU', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};
    if (!businessType) newErrors.businessType = true;
    if (!primaryGoal) newErrors.primaryGoal = true;
    if (!weeklyLeads) newErrors.weeklyLeads = true;
    if (!avgCustomerValue) newErrors.avgCustomerValue = true;
    if (currentPresence.length === 0) newErrors.currentPresence = true;
    if (!missedLeads) newErrors.missedLeads = true;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validateForm()) return;
    
    setStep('calculating');
    setCalcProgress(0);
    setCalcStepIndex(0);
    
    // Animate through calculation steps
    const totalDuration = 3000;
    const stepDuration = totalDuration / calculationSteps.length;
    
    calculationSteps.forEach((_, index) => {
      setTimeout(() => {
        setCalcStepIndex(index);
        setCalcProgress(((index + 1) / calculationSteps.length) * 100);
      }, stepDuration * index);
    });
    
    setTimeout(() => {
      setStep('result');
    }, totalDuration + 300);
  };

  const resetCalculator = () => {
    setBusinessType('');
    setPrimaryGoal('');
    setWeeklyLeads('');
    setAvgCustomerValue('');
    setCurrentPresence([]);
    setMissedLeads('');
    setStep('form');
    setCalcProgress(0);
    setCalcStepIndex(0);
    setErrors({});
  };

  const togglePresence = (id: string) => {
    setCurrentPresence(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
    setErrors(prev => ({ ...prev, currentPresence: false }));
  };

  const InfoTip = ({ content }: { content: string }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" className="ml-1.5 text-muted-foreground hover:text-foreground">
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-[200px] text-xs">
        {content}
      </TooltipContent>
    </Tooltip>
  );

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
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <Calculator className="w-4 h-4 text-accent" />
              </div>
              {t('Intäktskalkylator', 'Revenue Calculator')}
            </DialogTitle>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {/* FORM STEP */}
            {step === 'form' && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5 py-2"
              >
                {/* 1. Business Type */}
                <div className="space-y-2">
                  <Label className={`flex items-center ${errors.businessType ? 'text-destructive' : ''}`}>
                    {t('Verksamhetstyp', 'Business type')} *
                  </Label>
                  <Select value={businessType} onValueChange={(v) => { setBusinessType(v); setErrors(e => ({...e, businessType: false})); }}>
                    <SelectTrigger className={errors.businessType ? 'border-destructive' : ''}>
                      <SelectValue placeholder={t('Välj...', 'Select...')} />
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

                {/* 2. Primary Goal */}
                <div className="space-y-2">
                  <Label className={`flex items-center ${errors.primaryGoal ? 'text-destructive' : ''}`}>
                    <Target className="w-4 h-4 mr-1.5 text-muted-foreground" />
                    {t('Primärt mål', 'Primary goal')} *
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {goalOptions.map((goal) => {
                      const Icon = goal.icon;
                      const isSelected = primaryGoal === goal.id;
                      return (
                        <button
                          key={goal.id}
                          type="button"
                          onClick={() => { setPrimaryGoal(goal.id); setErrors(e => ({...e, primaryGoal: false})); }}
                          className={`px-3 py-2 rounded-lg border-2 text-sm transition-all flex items-center gap-1.5 ${
                            isSelected 
                              ? 'border-accent bg-accent/10 text-foreground' 
                              : errors.primaryGoal 
                                ? 'border-destructive/50 hover:border-destructive' 
                                : 'border-border hover:border-accent/50'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-accent' : 'text-muted-foreground'}`} />
                          <span>{lang === 'sv' ? goal.label.sv : goal.label.en}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Lead Volume */}
                <div className="space-y-2">
                  <Label className={`flex items-center ${errors.weeklyLeads ? 'text-destructive' : ''}`}>
                    {t('Önskade förfrågningar/vecka', 'Desired enquiries/week')} *
                    <InfoTip content={t('Bokningar, samtal eller offertförfrågningar du vill ha.', 'Bookings, calls, or quote requests you want.')} />
                  </Label>
                  <Input
                    type="number"
                    placeholder={t('T.ex. 10', 'E.g. 10')}
                    value={weeklyLeads}
                    onChange={(e) => { setWeeklyLeads(e.target.value); setErrors(er => ({...er, weeklyLeads: false})); }}
                    className={errors.weeklyLeads ? 'border-destructive' : ''}
                  />
                </div>

                {/* 4. Average Customer Value */}
                <div className="space-y-2">
                  <Label className={`flex items-center ${errors.avgCustomerValue ? 'text-destructive' : ''}`}>
                    {t('Genomsnittligt kundvärde', 'Average customer value')} *
                    <InfoTip content={t('Hur mycket spenderar en typisk kund? Uppskatta om osäker.', 'How much does a typical customer spend? Estimate if unsure.')} />
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder={t('T.ex. 80', 'E.g. 80')}
                      value={avgCustomerValue}
                      onChange={(e) => { setAvgCustomerValue(e.target.value); setErrors(er => ({...er, avgCustomerValue: false})); }}
                      className={`pr-10 ${errors.avgCustomerValue ? 'border-destructive' : ''}`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">€</span>
                  </div>
                </div>

                {/* 5. Current Presence */}
                <div className="space-y-2">
                  <Label className={`flex items-center ${errors.currentPresence ? 'text-destructive' : ''}`}>
                    {t('Var hittar kunder dig idag?', 'Where do customers find you today?')} *
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {currentPresenceOptions.map((option) => {
                      const Icon = option.icon;
                      const isSelected = currentPresence.includes(option.id);
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => togglePresence(option.id)}
                          className={`px-3 py-2 rounded-lg border-2 text-sm transition-all flex items-center gap-1.5 ${
                            isSelected 
                              ? 'border-accent bg-accent/10 text-foreground' 
                              : errors.currentPresence 
                                ? 'border-destructive/50' 
                                : 'border-border hover:border-accent/50'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-accent' : 'text-muted-foreground'}`} />
                          <span>{lang === 'sv' ? option.label.sv : option.label.en}</span>
                          {isSelected && <Check className="w-3 h-3 text-accent" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 6. Missed Leads */}
                <div className="space-y-2">
                  <Label className={`flex items-center ${errors.missedLeads ? 'text-destructive' : ''}`}>
                    {t('Missade förfrågningar/vecka pga svag närvaro?', 'Missed enquiries/week due to weak presence?')} *
                    <InfoTip content={t('Uppskatta hur många som inte hittar eller kontaktar dig.', 'Estimate how many don\'t find or contact you.')} />
                  </Label>
                  <div className="grid grid-cols-4 gap-2">
                    {missedLeadsOptions.map((option) => {
                      const isSelected = missedLeads === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => { setMissedLeads(option.id); setErrors(e => ({...e, missedLeads: false})); }}
                          className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                            isSelected 
                              ? 'border-accent bg-accent/10' 
                              : errors.missedLeads 
                                ? 'border-destructive/50' 
                                : 'border-border hover:border-accent/50'
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Button 
                  onClick={handleCalculate}
                  className="w-full h-12 mt-4"
                  size="lg"
                >
                  {t('Beräkna min förlorade intäkt', 'Calculate my lost revenue')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}

            {/* CALCULATING STEP */}
            {step === 'calculating' && (
              <motion.div
                key="calculating"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-12 space-y-8"
              >
                <div className="text-center space-y-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 mx-auto rounded-full border-4 border-accent/20 border-t-accent"
                  />
                  
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={calcStepIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-lg font-medium"
                    >
                      {lang === 'sv' ? calculationSteps[calcStepIndex]?.sv : calculationSteps[calcStepIndex]?.en}
                    </motion.p>
                  </AnimatePresence>
                </div>

                <div className="space-y-2">
                  <Progress value={calcProgress} className="h-2" />
                  <p className="text-center text-sm text-muted-foreground">
                    {Math.round(calcProgress)}%
                  </p>
                </div>
              </motion.div>
            )}

            {/* RESULT STEP */}
            {step === 'result' && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-5 py-2"
              >
                {/* Main Result Card */}
                <div className="p-5 rounded-xl bg-gradient-to-br from-destructive/15 to-destructive/5 border border-destructive/30 space-y-3">
                  <div className="flex items-center gap-2 text-destructive text-sm font-medium">
                    <TrendingUp className="w-4 h-4" />
                    {t('Uppskattad missad intäkt/månad', 'Estimated missed revenue/month')}
                  </div>
                  
                  <div className="text-center py-2">
                    <p className="text-3xl sm:text-4xl font-bold text-foreground">
                      {formatCurrency(result.lowMonthly)} – {formatCurrency(result.highMonthly)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('per månad', 'per month')} · {formatCurrency(result.lowYearly)} – {formatCurrency(result.highYearly)} {t('per år', 'per year')}
                    </p>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="p-4 rounded-xl bg-secondary/50 border border-border space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Lightbulb className="w-4 h-4 text-accent" />
                    {t('Vad som skulle göra störst skillnad', 'What would move the needle fastest')}
                  </div>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTAs */}
                <div className="space-y-3 pt-2">
                  <Button asChild className="w-full h-12 group" size="lg">
                    <Link to="/demo" onClick={() => setIsOpen(false)}>
                      <Sparkles className="w-4 h-4 mr-2" />
                      {t('Få mitt gratis konceptförslag', 'Get my free concept demo')}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" className="w-full" size="lg">
                    <Link to="/bestall" onClick={() => setIsOpen(false)}>
                      {t('Beställ direkt', 'Order directly')}
                    </Link>
                  </Button>
                </div>

                {/* Disclaimer */}
                <p className="text-xs text-muted-foreground text-center pt-2">
                  {t(
                    'Uppskattningar baseras på dina svar och typiska konverteringsintervall.',
                    'Estimates are based on your inputs and typical conversion ranges.'
                  )}
                </p>

                {/* Calculate Again */}
                <Button 
                  variant="ghost" 
                  className="w-full text-muted-foreground text-sm"
                  onClick={resetCalculator}
                >
                  {t('Beräkna igen', 'Calculate again')}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
}
