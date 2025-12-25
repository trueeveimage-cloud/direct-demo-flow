import { motion } from 'framer-motion';
import { Package, Palette, Globe, Calendar, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { InfoTooltip } from '@/components/InfoTooltip';
import { WizardFormData, packages, styles, languages } from '../wizardConfig';

interface Step2PackageProps {
  formData: WizardFormData;
  setFormData: (data: WizardFormData) => void;
  errors: Record<string, boolean>;
  onComparePackages: () => void;
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.05, duration: 0.2 }
  }),
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap: { scale: 0.98 }
};

export function Step2Package({ formData, setFormData, errors, onComparePackages }: Step2PackageProps) {
  const { t, lang } = useLanguage();

  const updateField = <K extends keyof WizardFormData>(field: K, value: WizardFormData[K]) => {
    setFormData({ ...formData, [field]: value });
  };


  return (
    <div className="space-y-8">
      {/* Package Selection */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Package className="w-5 h-5 text-accent" />
            {t('Välj paket', 'Choose package')} *
          </h2>
          <Button variant="ghost" size="sm" onClick={onComparePackages}>
            {t('Jämför paket', 'Compare packages')}
          </Button>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {packages.map((p, i) => (
            <motion.button
              key={p.id}
              custom={i}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
              variants={cardVariants}
              onClick={() => updateField('selectedPackage', p.id)}
              className={`p-6 rounded-xl border-2 text-left transition-all relative ${
                formData.selectedPackage === p.id 
                  ? 'border-accent bg-accent/5 shadow-lg ring-2 ring-accent/20' 
                  : errors.package 
                    ? 'border-destructive' 
                    : 'border-border hover:border-accent/50'
              }`}
            >
              {p.popular && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-3 left-4 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded"
                >
                  {t('Populärast', 'Popular')}
                </motion.span>
              )}
              
              {/* Selection indicator */}
              {formData.selectedPackage === p.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-accent-foreground" />
                </motion.div>
              )}
              
              <h3 className="font-semibold text-xl mb-1">{p.name}</h3>
              <p className="text-2xl font-bold text-accent mb-1">{p.priceDisplay}</p>
              <p className="text-sm text-muted-foreground mb-2">{lang === 'sv' ? p.pages.sv : p.pages.en}</p>
              <p className="text-xs text-muted-foreground">{t('Leverans', 'Delivery')}: {p.delivery} {t('dagar', 'days')}</p>
              <ul className="mt-4 space-y-1">
                {(lang === 'sv' ? p.features.sv : p.features.en).slice(0, 4).map((f, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <Check className="w-3 h-3 text-accent flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Style Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-accent" />
          {t('Välj stil', 'Choose style')} *
        </h2>
        <div className="flex flex-wrap gap-3">
          {styles.map((style, i) => (
            <motion.button
              key={style.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 + i * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateField('selectedStyle', style.id)}
              className={`px-6 py-3 rounded-lg border-2 transition-all flex items-center gap-2 ${
                formData.selectedStyle === style.id 
                  ? 'border-accent bg-accent/10 shadow-md' 
                  : errors.style 
                    ? 'border-destructive' 
                    : 'border-border hover:border-accent/50'
              }`}
            >
              {style.name}
              <InfoTooltip content={lang === 'sv' ? style.tooltip.sv : style.tooltip.en} />
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Color Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 bg-secondary/50 rounded-xl"
      >
        <div className="flex items-center gap-2 mb-4">
          <h2 className="font-semibold text-lg">{t('Färgpreferenser', 'Color preferences')}</h2>
          <InfoTooltip content={t('Färger används för knappar, highlights och varumärkeskänsla.', 'Colors are used for buttons, highlights, and brand feel.')} />
        </div>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>{t('Primärfärg', 'Primary color')}</Label>
              <Input 
                value={formData.primaryColor} 
                onChange={(e) => updateField('primaryColor', e.target.value)} 
                placeholder={t('t.ex. Mörkblå, #1a2b3c', 'e.g. Dark blue, #1a2b3c')} 
                className="h-12 mt-1"
                disabled={formData.noColorPreference}
              />
            </div>
            <div>
              <Label>{t('Accentfärg', 'Accent color')}</Label>
              <Input 
                value={formData.accentColor} 
                onChange={(e) => updateField('accentColor', e.target.value)} 
                placeholder={t('t.ex. Guld, #ffd700', 'e.g. Gold, #ffd700')} 
                className="h-12 mt-1"
                disabled={formData.noColorPreference}
              />
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer group">
            <Checkbox 
              checked={formData.noColorPreference} 
              onCheckedChange={(c) => updateField('noColorPreference', c === true)} 
            />
            <span className="text-sm group-hover:text-foreground transition-colors">
              {t('Ingen preferens – Nomia väljer', 'No preference – Nomia chooses')}
            </span>
          </label>
        </div>
      </motion.div>

      {/* Language Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-accent" />
          {t('Webbplatsens språk', 'Website language')}
        </h2>
        <div className="flex flex-wrap gap-3">
          {languages.map((l) => (
            <motion.button
              key={l.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateField('selectedLanguage', l.id)}
              className={`px-6 py-3 rounded-lg border-2 transition-all ${
                formData.selectedLanguage === l.id 
                  ? 'border-accent bg-accent/10' 
                  : 'border-border hover:border-accent/50'
              }`}
            >
              {lang === 'sv' ? l.label.sv : l.label.en}
            </motion.button>
          ))}
        </div>
        {formData.selectedLanguage === 'both' && formData.selectedPackage === 'starter' && (
          <p className="text-sm text-destructive mt-2">
            {t('Flerspråk kräver Standard eller Pro.', 'Multi-language requires Standard or Pro.')}
          </p>
        )}
      </motion.div>

      {/* Booking System */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 bg-secondary/50 rounded-xl"
      >
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-accent" />
          <h2 className="font-semibold text-lg">{t('Vill du ha ett bokningssystem?', 'Do you want a booking system?')}</h2>
          <InfoTooltip content={t('Vi skapar ditt helt egna bokningssystem integrerat med din webbplats.', 'We create your very own booking system integrated with your website.')} />
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          <span className="font-semibold text-accent">+2 000 kr</span>
          <span className="ml-2">– {t('Tillval för bokningsfunktion', 'Add-on for booking functionality')}</span>
          <span className="block text-xs mt-1">{t('(Ingår GRATIS i Pro-paketet)', '(Included FREE in Pro package)')}</span>
        </p>
        <div className="flex gap-4">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => updateField('wantsBooking', true)} 
            className={`px-6 py-3 rounded-lg border-2 transition-all ${
              formData.wantsBooking === true ? 'border-accent bg-accent/10' : 'border-border'
            }`}
          >
            {t('Ja', 'Yes')}
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => updateField('wantsBooking', false)} 
            className={`px-6 py-3 rounded-lg border-2 transition-all ${
              formData.wantsBooking === false ? 'border-accent bg-accent/10' : 'border-border'
            }`}
          >
            {t('Nej', 'No')}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
