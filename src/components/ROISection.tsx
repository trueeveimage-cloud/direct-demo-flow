import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Loader2, ChevronRight, BarChart3, Target, DollarSign, HelpCircle, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '@/components/InfoTooltip';
import { useLanguage } from '@/contexts/LanguageContext';

interface ROISectionProps {
  businessType: string;
  onComplete?: () => void;
}

const businessTypeMultipliers: Record<string, number> = {
  barber: 3,
  nail: 2.5,
  restaurant: 4,
  gym: 2,
  clinic: 5,
  car: 3.5,
  cleaning: 2.5,
  realestate: 8,
  retail: 3,
  other: 2.5,
};

const revenueRanges = [
  { id: 'less10k', label: { sv: 'Under 10 000 kr', en: 'Under 10,000 kr' }, value: 10000 },
  { id: '10k-30k', label: { sv: '10 000 - 30 000 kr', en: '10,000 - 30,000 kr' }, value: 20000 },
  { id: '30k-50k', label: { sv: '30 000 - 50 000 kr', en: '30,000 - 50,000 kr' }, value: 40000 },
  { id: '50k-100k', label: { sv: '50 000 - 100 000 kr', en: '50,000 - 100,000 kr' }, value: 75000 },
  { id: '100k-200k', label: { sv: '100 000 - 200 000 kr', en: '100,000 - 200,000 kr' }, value: 150000 },
  { id: 'more200k', label: { sv: 'Över 200 000 kr', en: 'Over 200,000 kr' }, value: 250000 },
];

const businessGoalOptions = [
  { id: 'bookings', label: { sv: 'Fler bokningar', en: 'More bookings' }, icon: '📅' },
  { id: 'calls', label: { sv: 'Fler samtal', en: 'More calls' }, icon: '📞' },
  { id: 'quotes', label: { sv: 'Fler offertförfrågningar', en: 'More quote requests' }, icon: '📋' },
  { id: 'trust', label: { sv: 'Mer förtroende', en: 'More trust' }, icon: '🤝' },
  { id: 'sell', label: { sv: 'Sälja online', en: 'Sell online' }, icon: '🛒' },
];

export function ROISection({ businessType, onComplete }: ROISectionProps) {
  const { t, lang } = useLanguage();
  
  const [hasWebsite, setHasWebsite] = useState<boolean | null>(null);
  const [businessGoal, setBusinessGoal] = useState<string>('');
  const [targetCustomersPerWeek, setTargetCustomersPerWeek] = useState<string>('');
  const [averageOrderValue, setAverageOrderValue] = useState<string>('');
  const [revenueRange, setRevenueRange] = useState<string>('');
  const [websiteImpact, setWebsiteImpact] = useState<number[]>([5]);
  const [showResult, setShowResult] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const multiplier = businessTypeMultipliers[businessType] || 2.5;

  const result = useMemo(() => {
    const avgOrder = parseFloat(averageOrderValue) || 0;
    const targetCustomers = parseFloat(targetCustomersPerWeek) || 0;
    const impact = websiteImpact[0] / 10;
    const revenue = revenueRanges.find(r => r.id === revenueRange)?.value || 0;
    
    // Calculate potential based on various factors
    const baseFromOrders = avgOrder * targetCustomers * 4 * impact * multiplier;
    const baseFromRevenue = revenue * impact * 0.15;
    
    const monthlyPotential = Math.max(baseFromOrders, baseFromRevenue) || avgOrder * 15 * multiplier;
    const yearlyPotential = monthlyPotential * 12;
    
    // Recommendation based on inputs
    let recommendation = '';
    let packageSuggestion = '';
    
    if (hasWebsite === false) {
      recommendation = lang === 'sv' 
        ? 'En ny professionell hemsida kan öka din synlighet dramatiskt och hjälpa dig nå fler kunder.'
        : 'A new professional website can dramatically increase your visibility and help you reach more customers.';
      packageSuggestion = revenue > 50000 ? 'Pro' : revenue > 20000 ? 'Standard' : 'Starter';
    } else {
      recommendation = lang === 'sv'
        ? 'En uppgradering av din hemsida kan hjälpa dig konvertera fler besökare till kunder.'
        : 'Upgrading your website can help you convert more visitors into customers.';
      packageSuggestion = 'Standard';
    }
    
    return {
      monthly: monthlyPotential,
      yearly: yearlyPotential,
      recommendation,
      packageSuggestion,
    };
  }, [averageOrderValue, targetCustomersPerWeek, websiteImpact, revenueRange, multiplier, hasWebsite, lang]);

  const handleCalculate = () => {
    if (hasWebsite === null) return;
    
    setIsCalculating(true);
    // Fake calculation delay for effect
    setTimeout(() => {
      setIsCalculating(false);
      setShowResult(true);
      onComplete?.();
    }, 2000);
  };

  const formatCurrency = (value: number) => {
    return Math.round(value).toLocaleString('sv-SE') + ' kr';
  };

  return (
    <Card className="border-2 border-accent/20 bg-gradient-to-br from-accent/5 via-background to-background">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-accent" />
          <h2 className="font-semibold text-lg">{t('Potentiell intäktsförlust', 'Potential revenue loss')}</h2>
          <InfoTooltip content={t('Hjälper oss ge dig en rekommendation baserat på din verksamhet.', 'Helps us give you a recommendation based on your business.')} />
        </div>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              {/* Has Website - Required */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  {t('Har du en hemsida idag?', 'Do you have a website today?')} *
                  <InfoTooltip content={t('Om du inte har en hemsida går du miste om potentiella kunder varje dag.', "If you don't have a website, you're missing potential customers every day.")} />
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setHasWebsite(true)}
                    className={`p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                      hasWebsite === true ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/50'
                    }`}
                  >
                    <Check className={`w-5 h-5 ${hasWebsite === true ? 'text-accent' : ''}`} />
                    <span className="font-medium">{t('Ja', 'Yes')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasWebsite(false)}
                    className={`p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                      hasWebsite === false ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/50'
                    }`}
                  >
                    <span className="font-medium">{t('Nej', 'No')}</span>
                  </button>
                </div>
              </div>

              {/* Business Goal */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  {t('Vad skulle hjälpa ditt företag mest?', 'What would help your business most?')}
                </Label>
                <div className="flex flex-wrap gap-2">
                  {businessGoalOptions.map((goal) => (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => setBusinessGoal(goal.id)}
                      className={`px-3 py-2 rounded-lg border-2 text-sm transition-all flex items-center gap-1.5 ${
                        businessGoal === goal.id ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/50'
                      }`}
                    >
                      <span>{goal.icon}</span>
                      <span>{lang === 'sv' ? goal.label.sv : goal.label.en}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Customers */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  {t('Hur många kunder vill du ha per vecka?', 'How many customers do you want per week?')}
                  <InfoTooltip content={t('Ditt målantal kunder per vecka. Lämna tomt om du är osäker.', 'Your target number of customers per week. Leave empty if unsure.')} />
                </Label>
                <Input
                  type="number"
                  value={targetCustomersPerWeek}
                  onChange={(e) => setTargetCustomersPerWeek(e.target.value)}
                  placeholder={t('t.ex. 20', 'e.g. 20')}
                  className="h-12"
                />
              </div>

              {/* Average Order Value */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  {t('Genomsnittligt ordervärde', 'Average order value')}
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={averageOrderValue}
                    onChange={(e) => setAverageOrderValue(e.target.value)}
                    placeholder={t('t.ex. 350', 'e.g. 350')}
                    className="h-12"
                  />
                  <span className="flex items-center px-4 bg-secondary rounded-lg text-muted-foreground">kr</span>
                </div>
              </div>

              {/* Monthly Revenue Range */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-muted-foreground" />
                  {t('Nuvarande månadsintäkt (ungefär)', 'Current monthly revenue (approx)')}
                </Label>
                <Select value={revenueRange} onValueChange={setRevenueRange}>
                  <SelectTrigger className="h-12">
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
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  {t('Hur mycket tror du en bättre hemsida skulle hjälpa?', 'How much would a better website help?')}
                  <InfoTooltip content={t('1 = liten skillnad, 10 = enorm skillnad', '1 = small difference, 10 = huge difference')} />
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
                    <span>{t('Liten skillnad', 'Small diff')}</span>
                    <span className="font-bold text-accent">{websiteImpact[0]}/10</span>
                    <span>{t('Enorm skillnad', 'Huge diff')}</span>
                  </div>
                </div>
              </div>

              {/* Calculate Button */}
              <Button
                type="button"
                onClick={handleCalculate}
                disabled={hasWebsite === null || isCalculating}
                className="w-full h-12"
              >
                {isCalculating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('Beräknar missade intäkter...', 'Calculating missed revenue...')}
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    {t('Beräkna potentiell förlust', 'Calculate potential loss')}
                  </>
                )}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              {/* Results */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-destructive/10 rounded-xl text-center border border-destructive/20">
                  <p className="text-xs text-muted-foreground mb-1">{t('Potentiell förlust/månad', 'Potential loss/month')}</p>
                  <p className="text-2xl font-bold text-destructive">{formatCurrency(result.monthly)}</p>
                </div>
                <div className="p-4 bg-destructive/10 rounded-xl text-center border border-destructive/20">
                  <p className="text-xs text-muted-foreground mb-1">{t('Potentiell förlust/år', 'Potential loss/year')}</p>
                  <p className="text-2xl font-bold text-destructive">{formatCurrency(result.yearly)}</p>
                </div>
              </div>

              {/* Recommendation */}
              <div className="p-4 bg-accent/10 rounded-xl border border-accent/20">
                <p className="text-sm mb-2">{result.recommendation}</p>
                <p className="text-sm font-semibold">
                  {t('Rekommenderat paket:', 'Recommended package:')} <span className="text-accent">{result.packageSuggestion}</span>
                </p>
              </div>

              {/* Reset */}
              <button
                type="button"
                onClick={() => setShowResult(false)}
                className="text-sm text-muted-foreground hover:text-foreground underline"
              >
                {t('Beräkna om', 'Recalculate')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
