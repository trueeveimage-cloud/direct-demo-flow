import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Palette, Globe, Calendar, Check, MapPin, Star, Image, CreditCard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { InfoTooltip } from '@/components/InfoTooltip';
import { WizardFormData, packages, styles, languages, businessTypeFollowUps } from '../wizardConfig';
import { playSound } from '@/lib/haptics';

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

function Step2PackageComponent({ formData, setFormData, errors, onComparePackages }: Step2PackageProps) {
  const { t, lang } = useLanguage();

  const updateField = <K extends keyof WizardFormData>(field: K, value: WizardFormData[K]) => {
    setFormData({ ...formData, [field]: value });
  };

  // Check if business type supports before/after
  const showBeforeAfter = ['barber', 'nail', 'clinic', 'car'].includes(formData.businessType);

  return (
    <div className="space-y-8">
      {/* Package Selection */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Package className="w-5 h-5 text-accent" />
            {t('Välj paket', 'Choose package', { no: 'Velg pakke', dk: 'Vælg pakke' })} *
          </h2>
          <Button variant="ghost" size="sm" onClick={onComparePackages}>
            {t('Jämför paket', 'Compare packages', { no: 'Sammenlign pakker', dk: 'Sammenlign pakker' })}
          </Button>
        </div>
        <div className="grid md:grid-cols-3 gap-4 package-selection" data-field="package">
          {packages.map((p, i) => (
            <motion.button
              key={p.id}
              custom={i}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
              variants={cardVariants}
              onClick={() => {
                updateField('selectedPackage', p.id);
                playSound('successChime');
              }}
              className={`p-6 rounded-xl border-2 text-left transition-all relative border-accent bg-gradient-to-br from-accent/10 via-accent/5 to-transparent shadow-lg ${
                formData.selectedPackage === p.id 
                  ? 'ring-2 ring-accent/40 shadow-accent/20' 
                  : errors.package 
                    ? 'border-destructive' 
                    : 'hover:shadow-xl'
              }`}
            >
              {p.popular && (
                <span className="absolute -top-3 left-4 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded">
                  {t('Populärast', 'Popular', { no: 'Mest populær', dk: 'Mest populær' })}
                </span>
              )}
              
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
          {t('Välj stil', 'Choose style', { no: 'Velg stil', dk: 'Vælg stil' })} *
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
              onClick={() => {
                updateField('selectedStyle', style.id);
                playSound('confirm');
              }}
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
          <h2 className="font-semibold text-lg">{t('Färgpreferenser', 'Color preferences', { no: 'Fargepreferanser', dk: 'Farvepræferencer' })}</h2>
          <InfoTooltip content={t('Färger används för knappar, highlights och varumärkeskänsla.', 'Colors are used for buttons, highlights, and brand feel.')} />
        </div>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>{t('Primärfärg', 'Primary color', { no: 'Primærfarge', dk: 'Primærfarve' })}</Label>
              <Input 
                value={formData.primaryColor} 
                onChange={(e) => updateField('primaryColor', e.target.value)} 
                placeholder={t('t.ex. Mörkblå, #1a2b3c', 'e.g. Dark blue, #1a2b3c')} 
                className="h-12 mt-1"
                disabled={formData.noColorPreference}
              />
            </div>
            <div>
              <Label>{t('Accentfärg', 'Accent color', { no: 'Aksentfarge', dk: 'Accentfarve' })}</Label>
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
              {t('Ingen preferens – Nomia väljer', 'No preference – Nomia chooses', { no: 'Ingen preferanse – Nomia velger', dk: 'Ingen præference – Nomia vælger' })}
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
          {t('Webbplatsens språk', 'Website language', { no: 'Nettsidespråk', dk: 'Hjemmesidens sprog' })}
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
        
        {/* Custom language input */}
        <AnimatePresence>
          {formData.selectedLanguage === 'custom' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4"
            >
              <Label className="text-sm font-medium">
                {t('Lista alla språk du behöver', 'List all languages you need')} *
              </Label>
              <Input 
                value={formData.customLanguages}
                onChange={(e) => updateField('customLanguages', e.target.value)}
                placeholder={t('t.ex. Svenska, Engelska, Arabiska, Franska...', 'e.g. Swedish, English, Arabic, French...')}
                className="h-12 mt-1"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                {t('Du kan lägga till hur många språk du vill.', 'You can add as many languages as you want.')}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {formData.selectedLanguage === 'custom' && formData.selectedPackage === 'starter' && (
          <p className="text-sm text-destructive mt-2">
            {t('Flera språk kräver Standard eller Pro.', 'Multiple languages require Standard or Pro.')}
          </p>
        )}
      </motion.div>

      {/* FREE Essentials */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 bg-accent/5 border border-accent/20 rounded-xl space-y-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <Check className="w-5 h-5 text-accent" />
          <h2 className="font-semibold text-lg">{t('Gratis funktioner', 'FREE features', { no: 'Gratisfunksjoner', dk: 'Gratis funktioner' })}</h2>
          <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full font-medium">INGÅR</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          {t('Välj vilka gratisfunktioner du vill ha på din webbplats.', 'Choose which free features you want on your website.', { no: 'Velg hvilke gratisfunksjoner du vil ha på nettsiden din.', dk: 'Vælg hvilke gratis funktioner du vil have på din hjemmeside.' })}
        </p>
        
        <div className="space-y-3">
          {/* Google Maps */}
          <div className="flex items-start gap-3">
            <Checkbox 
              checked={formData.wantsGoogleMaps} 
              onCheckedChange={(c) => updateField('wantsGoogleMaps', c === true)} 
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" />
                <span className="font-medium text-sm">{t('Google Maps', 'Google Maps')}</span>
                <span className="text-xs text-accent font-medium">GRATIS</span>
              </div>
              <AnimatePresence>
                {formData.wantsGoogleMaps && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2"
                  >
                    <Input 
                      value={formData.googleMapsAddress}
                      onChange={(e) => updateField('googleMapsAddress', e.target.value)}
                      placeholder={t('Din adress eller Google Maps-länk', 'Your address or Google Maps link')}
                      className="h-10"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Google Reviews */}
          <div className="flex items-start gap-3">
            <Checkbox 
              checked={formData.wantsGoogleReviews} 
              onCheckedChange={(c) => updateField('wantsGoogleReviews', c === true)} 
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-accent" />
                <span className="font-medium text-sm">{t('Google Recensioner', 'Google Reviews')}</span>
                <span className="text-xs text-accent font-medium">GRATIS</span>
              </div>
              <AnimatePresence>
                {formData.wantsGoogleReviews && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2"
                  >
                    <Input 
                      value={formData.googleBusinessLink}
                      onChange={(e) => updateField('googleBusinessLink', e.target.value)}
                      placeholder={t('Din Google Business-länk', 'Your Google Business link')}
                      className="h-10"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Before/After - only for relevant business types */}
          {showBeforeAfter && (
            <div className="flex items-start gap-3">
              <Checkbox 
                checked={formData.wantsBeforeAfter} 
                onCheckedChange={(c) => updateField('wantsBeforeAfter', c === true)} 
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Image className="w-4 h-4 text-accent" />
                  <span className="font-medium text-sm">{t('Före/Efter-sektion', 'Before/After section')}</span>
                  <span className="text-xs text-accent font-medium">GRATIS</span>
                  <InfoTooltip content={t('Visar dina transformationer – ökar konverteringar.', 'Shows your transformations – increases conversions.')} />
                </div>
              </div>
            </div>
          )}
          
          {/* Checkout System - €50 addon, free with Standard/Pro */}
          <div className="flex items-start gap-3">
            <Checkbox 
              checked={formData.wantsCheckoutSystem} 
              onCheckedChange={(c) => updateField('wantsCheckoutSystem', c === true)} 
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-accent" />
                <span className="font-medium text-sm">{t('Kassasystem', 'Checkout system')}</span>
                {formData.selectedPackage === 'starter' ? (
                  <span className="text-xs text-accent font-medium">+€50</span>
                ) : (
                  <span className="text-xs text-green-500 font-medium">{t('INGÅR', 'INCLUDED')}</span>
                )}
                <InfoTooltip content={t('Enkelt betalningsformulär för produkter/tjänster.', 'Simple payment form for products/services.')} />
              </div>
              {formData.selectedPackage === 'starter' && (
                <p className="text-xs text-muted-foreground mt-1">
                  {t('Gratis med Standard & Pro', 'Free with Standard & Pro')}
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Booking System */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="p-6 bg-secondary/50 rounded-xl"
      >
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-accent" />
          <h2 className="font-semibold text-lg">{t('Vill du ha ett bokningssystem?', 'Do you want a booking system?', { no: 'Vil du ha et bookingsystem?', dk: 'Vil du have et bookingsystem?' })}</h2>
          <InfoTooltip content={t('Vi bygger ditt helt egna bokningssystem – inga avgifter till tredjeparter som Bokadirekt.', 'We build your very own booking system – no fees to third parties like Bokadirekt.')} />
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          <span className="font-semibold text-accent">+€200</span>
          <span className="ml-2">– {t('Eget bokningssystem, inga tredjepartsavgifter', 'Your own booking system, no third-party fees')}</span>
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

export const Step2Package = memo(Step2PackageComponent);