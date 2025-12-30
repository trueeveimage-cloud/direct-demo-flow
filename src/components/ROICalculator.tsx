import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, TrendingUp, ArrowRight, Target, Check, Phone, CalendarCheck, FileText, ShoppingCart, Award, Instagram, Search, Users, Megaphone, Globe, Sparkles, Lightbulb, Building2, Clock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

// Industry-specific data with average customer values and website importance multipliers
const industryData: Record<string, {
  avgValue: { min: number; max: number; default: number };
  websiteImpact: number; // 0.1-0.5 - how much a website affects customer acquisition
  conversionLift: number; // potential conversion improvement with good website
  customerLabel: { sv: string; en: string };
  valueLabel: { sv: string; en: string };
}> = {
  barber: {
    avgValue: { min: 20, max: 100, default: 40 },
    websiteImpact: 0.25,
    conversionLift: 0.15,
    customerLabel: { sv: 'kunder', en: 'customers' },
    valueLabel: { sv: 'per besök', en: 'per visit' },
  },
  nail: {
    avgValue: { min: 30, max: 150, default: 60 },
    websiteImpact: 0.3,
    conversionLift: 0.2,
    customerLabel: { sv: 'kunder', en: 'customers' },
    valueLabel: { sv: 'per behandling', en: 'per treatment' },
  },
  restaurant: {
    avgValue: { min: 15, max: 80, default: 35 },
    websiteImpact: 0.35,
    conversionLift: 0.25,
    customerLabel: { sv: 'gäster', en: 'guests' },
    valueLabel: { sv: 'per nota', en: 'per check' },
  },
  gym: {
    avgValue: { min: 30, max: 200, default: 50 },
    websiteImpact: 0.4,
    conversionLift: 0.3,
    customerLabel: { sv: 'medlemmar', en: 'members' },
    valueLabel: { sv: 'per månad', en: 'per month' },
  },
  clinic: {
    avgValue: { min: 50, max: 500, default: 150 },
    websiteImpact: 0.5,
    conversionLift: 0.35,
    customerLabel: { sv: 'patienter', en: 'patients' },
    valueLabel: { sv: 'per besök', en: 'per visit' },
  },
  car: {
    avgValue: { min: 100, max: 1000, default: 300 },
    websiteImpact: 0.45,
    conversionLift: 0.3,
    customerLabel: { sv: 'kunder', en: 'customers' },
    valueLabel: { sv: 'per jobb', en: 'per job' },
  },
  cleaning: {
    avgValue: { min: 50, max: 300, default: 100 },
    websiteImpact: 0.4,
    conversionLift: 0.25,
    customerLabel: { sv: 'kunder', en: 'customers' },
    valueLabel: { sv: 'per uppdrag', en: 'per job' },
  },
  realestate: {
    avgValue: { min: 1000, max: 10000, default: 3000 },
    websiteImpact: 0.5,
    conversionLift: 0.35,
    customerLabel: { sv: 'affärer', en: 'deals' },
    valueLabel: { sv: 'provision per affär', en: 'commission per deal' },
  },
  retail: {
    avgValue: { min: 20, max: 200, default: 50 },
    websiteImpact: 0.35,
    conversionLift: 0.25,
    customerLabel: { sv: 'kunder', en: 'customers' },
    valueLabel: { sv: 'per köp', en: 'per purchase' },
  },
  consultant: {
    avgValue: { min: 500, max: 5000, default: 1500 },
    websiteImpact: 0.5,
    conversionLift: 0.35,
    customerLabel: { sv: 'kunder', en: 'clients' },
    valueLabel: { sv: 'per projekt', en: 'per project' },
  },
  other: {
    avgValue: { min: 50, max: 500, default: 100 },
    websiteImpact: 0.35,
    conversionLift: 0.25,
    customerLabel: { sv: 'kunder', en: 'customers' },
    valueLabel: { sv: 'per kund', en: 'per customer' },
  },
};

// Business type data
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
  { id: 'social', label: { sv: 'Bara Instagram/TikTok', en: 'Instagram/TikTok only' }, icon: Instagram, lostFactor: 0.35 },
  { id: 'google', label: { sv: 'Google Maps / Sök', en: 'Google Maps / Search' }, icon: Search, lostFactor: 0.25 },
  { id: 'wordofmouth', label: { sv: 'Rekommendationer', en: 'Word of mouth' }, icon: Users, lostFactor: 0.2 },
  { id: 'ads', label: { sv: 'Annonser', en: 'Paid ads' }, icon: Megaphone, lostFactor: 0.3 },
  { id: 'oldsite', label: { sv: 'Gammal hemsida', en: 'Outdated website' }, icon: Globe, lostFactor: 0.15 },
];

const calculationSteps = [
  { sv: 'Analyserar din bransch...', en: 'Analyzing your industry...' },
  { sv: 'Beräknar marknadsandel...', en: 'Calculating market share...' },
  { sv: 'Uppskattar konverteringspotential...', en: 'Estimating conversion potential...' },
  { sv: 'Sammanställer resultat...', en: 'Compiling results...' },
];

// Goal-based recommendations per industry
const getRecommendations = (goal: string, businessType: string, lang: 'sv' | 'en') => {
  const baseRecs: Record<string, { sv: string[]; en: string[] }> = {
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

  const industryRecs: Record<string, { sv: string; en: string }> = {
    restaurant: { sv: 'Online-meny med bilder och priser', en: 'Online menu with photos and prices' },
    gym: { sv: 'Visa klassschema och medlemspriser', en: 'Display class schedule and membership prices' },
    clinic: { sv: 'Trygg patientinformation och kontakt', en: 'Secure patient info and easy contact' },
    car: { sv: 'Galleri med före/efter-bilder', en: 'Before/after photo gallery' },
    realestate: { sv: 'Objektlistning med sökfunktion', en: 'Property listings with search' },
  };

  const recs = baseRecs[goal]?.[lang] || baseRecs.trust[lang];
  const industryRec = industryRecs[businessType];
  
  if (industryRec) {
    return [industryRec[lang], ...recs.slice(0, 2)];
  }
  return recs;
};

export function ROICalculator() {
  const { t, lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  
  // Form state - Page 1
  const [businessType, setBusinessType] = useState('');
  const [primaryGoal, setPrimaryGoal] = useState('');
  const [currentCustomers, setCurrentCustomers] = useState([10]); // slider value
  const [avgCustomerValue, setAvgCustomerValue] = useState([50]); // slider value
  
  // Form state - Page 2
  const [currentPresence, setCurrentPresence] = useState<string[]>([]);
  const [yearsInBusiness, setYearsInBusiness] = useState([3]); // slider value
  
  // Email capture
  const [email, setEmail] = useState('');
  
  // UI state
  const [formPage, setFormPage] = useState(1);
  const [step, setStep] = useState<'form' | 'email' | 'calculating' | 'result'>('form');
  const [calcProgress, setCalcProgress] = useState(0);
  const [calcStepIndex, setCalcStepIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // Get industry config
  const industry = industryData[businessType] || industryData.other;

  // Calculate result based on industry-specific logic
  const result = useMemo(() => {
    const customers = currentCustomers[0];
    const value = avgCustomerValue[0];
    const years = yearsInBusiness[0];
    
    // Get lost factor from current presence (average of selected)
    const presenceFactors = currentPresence.map(p => 
      currentPresenceOptions.find(o => o.id === p)?.lostFactor || 0.25
    );
    const avgPresenceFactor = presenceFactors.length > 0 
      ? presenceFactors.reduce((a, b) => a + b, 0) / presenceFactors.length
      : 0.3;
    
    // Industry website impact multiplier
    const industryImpact = industry.websiteImpact;
    
    // Years multiplier (more established = more to lose from poor online presence)
    const yearsMultiplier = Math.min(1.5, 0.8 + (years * 0.07));
    
    // Calculate potential customers lost per week due to no/poor website
    // Formula: current customers × industry impact × presence factor × years multiplier
    const weeklyLostCustomers = customers * industryImpact * avgPresenceFactor * yearsMultiplier;
    
    // Yearly lost revenue
    const yearlyLost = weeklyLostCustomers * value * 52;
    
    // Create a range (±10% or max €1000 per side)
    const variance = Math.min(1000, yearlyLost * 0.1);
    const lowYearly = Math.max(0, Math.round(yearlyLost - variance));
    const highYearly = Math.round(yearlyLost + variance);
    
    return {
      lowYearly,
      highYearly,
      weeklyLost: Math.round(weeklyLostCustomers * 10) / 10,
      recommendations: getRecommendations(primaryGoal || 'trust', businessType, lang),
    };
  }, [avgCustomerValue, currentCustomers, currentPresence, yearsInBusiness, industry, primaryGoal, businessType, lang]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EU', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  const validatePage1 = () => {
    const newErrors: Record<string, boolean> = {};
    if (!businessType) newErrors.businessType = true;
    if (!primaryGoal) newErrors.primaryGoal = true;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePage2 = () => {
    const newErrors: Record<string, boolean> = {};
    if (currentPresence.length === 0) newErrors.currentPresence = true;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextPage = () => {
    if (validatePage1()) {
      setFormPage(2);
      setErrors({});
    }
  };

  const handleNextToEmail = () => {
    if (!validatePage2()) return;
    setStep('email');
    setErrors({});
  };

  const validateEmail = (emailValue: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const handleCalculate = () => {
    if (email && !validateEmail(email)) {
      setErrors({ email: true });
      return;
    }
    
    setStep('calculating');
    setCalcProgress(0);
    setCalcStepIndex(0);
    
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
      if (email) {
        toast.success(lang === 'sv' ? 'Resultat skickat till din e-post!' : 'Results sent to your email!');
      }
    }, totalDuration + 300);
  };

  const resetCalculator = () => {
    setBusinessType('');
    setPrimaryGoal('');
    setCurrentCustomers([10]);
    setAvgCustomerValue([50]);
    setCurrentPresence([]);
    setYearsInBusiness([3]);
    setEmail('');
    setFormPage(1);
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

  // Update sliders when business type changes
  const handleBusinessTypeChange = (value: string) => {
    setBusinessType(value);
    setErrors(e => ({...e, businessType: false}));
    
    const data = industryData[value];
    if (data) {
      setAvgCustomerValue([data.avgValue.default]);
    }
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
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <Calculator className="w-4 h-4 text-accent" />
              </div>
              {t('Intäktskalkylator', 'Revenue Calculator')}
            </DialogTitle>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {/* FORM PAGE 1 */}
            {step === 'form' && formPage === 1 && (
              <motion.div
                key="form-page-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5 py-2"
              >
                {/* Progress indicator */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <div className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">1</div>
                  <div className="h-0.5 flex-1 bg-border" />
                  <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold">2</div>
                </div>

                {/* 1. Business Type */}
                <div className="space-y-2">
                  <Label className={`flex items-center ${errors.businessType ? 'text-destructive' : ''}`}>
                    <Building2 className="w-4 h-4 mr-1.5 text-muted-foreground" />
                    {t('Verksamhetstyp', 'Business type')} *
                  </Label>
                  <Select value={businessType} onValueChange={handleBusinessTypeChange}>
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

                {/* 3. Current Customers per Week - SLIDER */}
                <div className="space-y-4">
                  <Label className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1.5 text-muted-foreground" />
                      {t('Kunder per vecka just nu', 'Current customers per week')}
                    </span>
                    <span className="text-lg font-bold text-accent">{currentCustomers[0]}</span>
                  </Label>
                  <Slider
                    value={currentCustomers}
                    onValueChange={setCurrentCustomers}
                    min={1}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1</span>
                    <span>50</span>
                    <span>100+</span>
                  </div>
                </div>

                {/* 4. Average Customer Value - SLIDER */}
                <div className="space-y-4">
                  <Label className="flex items-center justify-between">
                    <span className="flex items-center">
                      {t('Snittintäkt', 'Avg. revenue')} {businessType && (
                        <span className="text-muted-foreground ml-1">
                          ({lang === 'sv' ? industry.valueLabel.sv : industry.valueLabel.en})
                        </span>
                      )}
                    </span>
                    <span className="text-lg font-bold text-accent">€{avgCustomerValue[0]}</span>
                  </Label>
                  <Slider
                    value={avgCustomerValue}
                    onValueChange={setAvgCustomerValue}
                    min={industry.avgValue.min}
                    max={industry.avgValue.max}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>€{industry.avgValue.min}</span>
                    <span>€{Math.round((industry.avgValue.min + industry.avgValue.max) / 2)}</span>
                    <span>€{industry.avgValue.max}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleNextPage}
                  className="w-full h-12 mt-4"
                  size="lg"
                >
                  {t('Fortsätt', 'Continue')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}

            {/* FORM PAGE 2 */}
            {step === 'form' && formPage === 2 && (
              <motion.div
                key="form-page-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5 py-2"
              >
                {/* Progress indicator */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <div className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">
                    <Check className="w-3 h-3" />
                  </div>
                  <div className="h-0.5 flex-1 bg-accent" />
                  <div className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">2</div>
                </div>

                {/* 5. Current Presence */}
                <div className="space-y-2">
                  <Label className={`flex items-center ${errors.currentPresence ? 'text-destructive' : ''}`}>
                    <Globe className="w-4 h-4 mr-1.5 text-muted-foreground" />
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

                {/* 6. Years in Business - SLIDER */}
                <div className="space-y-4">
                  <Label className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1.5 text-muted-foreground" />
                      {t('År i branschen', 'Years in business')}
                    </span>
                    <span className="text-lg font-bold text-accent">
                      {yearsInBusiness[0]} {t('år', 'years')}
                    </span>
                  </Label>
                  <Slider
                    value={yearsInBusiness}
                    onValueChange={setYearsInBusiness}
                    min={0}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{t('Nystart', 'New')}</span>
                    <span>10</span>
                    <span>20+</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button 
                    variant="outline"
                    onClick={() => setFormPage(1)}
                    className="flex-1 h-12"
                    size="lg"
                  >
                    {t('Tillbaka', 'Back')}
                  </Button>
                  <Button 
                    onClick={handleNextToEmail}
                    className="flex-1 h-12"
                    size="lg"
                  >
                    {t('Fortsätt', 'Continue')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* EMAIL CAPTURE STEP */}
            {step === 'email' && (
              <motion.div
                key="email-capture"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 py-4"
              >
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
                    <Mail className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold">
                    {t('Nästan klar!', 'Almost there!')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t(
                      'Ange din e-post för att få resultatet skickat till dig.',
                      'Enter your email to receive the results.'
                    )}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className={`flex items-center ${errors.email ? 'text-destructive' : ''}`}>
                    <Mail className="w-4 h-4 mr-1.5 text-muted-foreground" />
                    {t('E-postadress', 'Email address')}
                  </Label>
                  <Input
                    type="email"
                    placeholder={t('din@email.se', 'your@email.com')}
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors(er => ({...er, email: false})); }}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">
                      {t('Ange en giltig e-postadress', 'Enter a valid email address')}
                    </p>
                  )}
                </div>

                <div className="space-y-3 pt-2">
                  <Button 
                    onClick={handleCalculate}
                    className="w-full h-12"
                    size="lg"
                  >
                    {t('Visa mitt resultat', 'Show my results')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  
                  <Button 
                    variant="ghost"
                    onClick={() => { setEmail(''); handleCalculate(); }}
                    className="w-full text-muted-foreground text-sm"
                  >
                    {t('Hoppa över', 'Skip')}
                  </Button>
                </div>
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
                {/* Main Result Card - YEARLY */}
                <div className="p-5 rounded-xl bg-gradient-to-br from-destructive/15 to-destructive/5 border border-destructive/30 space-y-3">
                  <div className="flex items-center gap-2 text-destructive text-sm font-medium">
                    <TrendingUp className="w-4 h-4" />
                    {t('Uppskattad förlorad intäkt per år', 'Estimated lost revenue per year')}
                  </div>
                  
                  <div className="text-center py-2">
                    <p className="text-3xl sm:text-4xl font-bold text-foreground">
                      {formatCurrency(result.lowYearly)} – {formatCurrency(result.highYearly)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('per år', 'per year')}
                    </p>
                  </div>
                  
                  {result.weeklyLost > 0 && (
                    <p className="text-center text-sm text-muted-foreground">
                      ≈ {result.weeklyLost} {lang === 'sv' ? industry.customerLabel.sv : industry.customerLabel.en} / {t('vecka', 'week')}
                    </p>
                  )}
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
                    'Uppskattningar baseras på dina svar och branschdata.',
                    'Estimates are based on your inputs and industry data.'
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
