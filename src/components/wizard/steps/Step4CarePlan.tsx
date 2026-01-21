import { motion } from 'framer-motion';
import { Clock, Check } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { WizardFormData, carePlans, getCurrencyFromLang, formatPrice, getCarePlanPrice } from '../wizardConfig';
import { playSound } from '@/lib/haptics';

interface Step4CarePlanProps {
  formData: WizardFormData;
  setFormData: (data: WizardFormData) => void;
  onCompareCarePlans: () => void;
  errors?: Record<string, boolean>;
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.3, ease: "easeOut" as const }
  }),
  hover: { scale: 1.02, y: -4, transition: { duration: 0.2 } },
  tap: { scale: 0.98 }
};

export function Step4CarePlan({ formData, setFormData, onCompareCarePlans, errors = {} }: Step4CarePlanProps) {
  const { t, lang } = useLanguage();
  const currency = getCurrencyFromLang(lang);
  const hasError = errors.selectedCarePlan && !formData.selectedCarePlan;

  const updateField = <K extends keyof WizardFormData>(field: K, value: WizardFormData[K]) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-accent" />
        </div>
        <h2 className="text-2xl font-bold mb-2">{t('Lägg till månatlig webbvård?', 'Add monthly care?')}</h2>
        <p className="text-muted-foreground">{t('Håll din webbplats uppdaterad och säker.', 'Keep your website updated and secure.')}</p>
        <Button variant="ghost" size="sm" onClick={onCompareCarePlans} className="mt-2">
          {t('Jämför vårdplaner', 'Compare care plans')}
        </Button>
      </motion.div>

      {/* Yearly Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-center gap-4 mb-8 p-4 bg-secondary/50 rounded-xl w-fit mx-auto"
      >
        <span className={`text-sm transition-all ${!formData.isYearlyCarePlan ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
          {t('Månadsvis', 'Monthly')}
        </span>
        <Switch 
          checked={formData.isYearlyCarePlan} 
          onCheckedChange={(c) => updateField('isYearlyCarePlan', c)} 
          className="data-[state=checked]:bg-accent" 
        />
        <span className={`text-sm transition-all ${formData.isYearlyCarePlan ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
          {t('Årsvis', 'Yearly')}
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-2 text-xs text-accent font-semibold bg-accent/10 px-2 py-0.5 rounded-full"
          >
            {t('Spara 20%', 'Save 20%')}
          </motion.span>
        </span>
      </motion.div>

      {/* Error message */}
      {hasError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4"
        >
          <p className="text-sm text-destructive font-medium">
            {t('Vänligen välj en vårdplan för att fortsätta', 'Please select a care plan to continue')}
          </p>
        </motion.div>
      )}

      <div className={`grid md:grid-cols-3 gap-6 care-plan-selection ${hasError ? 'animate-shake' : ''}`} data-field="carePlan">
        {carePlans.map((c, i) => {
          const price = getCarePlanPrice(c.id, formData.isYearlyCarePlan, currency);
          const oldPrice = getCarePlanPrice(c.id, false, currency);
          const isSelected = formData.selectedCarePlan === c.id;
          
          return (
            <motion.button
              key={c.id}
              custom={i}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
              variants={cardVariants}
              onClick={() => {
                updateField('selectedCarePlan', isSelected ? null : c.id);
                if (!isSelected) playSound('successChime');
              }}
              className={`p-6 rounded-xl border-2 text-left transition-all relative border-accent bg-gradient-to-br from-accent/10 via-accent/5 to-transparent shadow-lg ${
                isSelected 
                  ? 'ring-2 ring-accent/40 shadow-accent/20' 
                  : 'hover:shadow-xl'
              }`}
            >
              {c.popular && (
                <motion.span 
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className="absolute -top-3 left-4 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full"
                >
                  {t('Rekommenderas', 'Recommended')}
                </motion.span>
              )}
              
              {/* Selection indicator with pulse */}
              {isSelected && (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center z-10"
                  >
                    <Check className="w-4 h-4 text-accent-foreground" />
                  </motion.div>
                  <motion.div
                    className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </>
              )}
              
              <h3 className="font-semibold text-xl mb-2">{c.name}</h3>
              <div className="mb-4">
                <span className="text-2xl font-bold text-accent">{formatPrice(price, currency)}</span>
                <span className="text-muted-foreground">/{lang === 'sv' ? 'mån' : 'mo'}</span>
                {formData.isYearlyCarePlan && (
                  <span className="ml-2 text-xs text-muted-foreground line-through">
                    {formatPrice(oldPrice, currency)}/{lang === 'sv' ? 'mån' : 'mo'}
                  </span>
                )}
              </div>
              {'note' in c && c.note && (
                <p className="text-xs text-muted-foreground/70 italic mb-3">
                  {lang === 'sv' ? c.note.sv : c.note.en}
                </p>
              )}
              <ul className="space-y-2">
                {(lang === 'sv' ? c.features.sv : c.features.en).map((f, idx) => (
                  <motion.li 
                    key={idx} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.05 }}
                    className="flex items-start gap-2 text-sm"
                  >
                    <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    {f}
                  </motion.li>
                ))}
              </ul>
            </motion.button>
          );
        })}
      </div>

      {/* Mandatory notice - no skip option */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-6"
      >
        <p className="text-sm text-muted-foreground">
          {t('Webbvård krävs för att hålla din webbplats uppdaterad och säker.', 'Web care is required to keep your website updated and secure.')}
        </p>
      </motion.div>
    </div>
  );
}
