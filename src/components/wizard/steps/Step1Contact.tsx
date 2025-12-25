import { motion } from 'framer-motion';
import { Users, Briefcase, Target, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { InfoTooltip } from '@/components/InfoTooltip';
import { WizardFormData, businessTypes, websiteGoals } from '../wizardConfig';

interface Step1ContactProps {
  formData: WizardFormData;
  setFormData: (data: WizardFormData) => void;
  errors: Record<string, boolean>;
  showConceptOption?: boolean;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.3, ease: "easeOut" as const }
  })
};

export function Step1Contact({ formData, setFormData, errors, showConceptOption = false }: Step1ContactProps) {
  const { t, lang } = useLanguage();

  const updateField = <K extends keyof WizardFormData>(field: K, value: WizardFormData[K]) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Concept Link Option - only show in direct checkout */}
      {showConceptOption && (
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="p-6 bg-accent/10 border border-accent/30 rounded-xl space-y-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <ExternalLink className="w-5 h-5 text-accent" />
            <h2 className="font-semibold text-lg">{t('Har du fått ett concept?', 'Did you receive a concept?')}</h2>
            <InfoTooltip content={t('Om du har fått en demo-länk från oss, klistra in den här.', 'If you received a demo link from us, paste it here.')} />
          </div>
          <Input 
            value={formData.conceptLink || ''} 
            onChange={(e) => updateField('conceptLink', e.target.value)} 
            placeholder={t('Klistra in din concept-länk här...', 'Paste your concept link here...')} 
            className="h-12 transition-all focus:ring-2 focus:ring-accent/20"
          />
          <p className="text-xs text-muted-foreground">
            {t('Lämna tomt om du vill beställa utan att ha sett ett concept.', 'Leave empty if you want to order without having seen a concept.')}
          </p>
        </motion.div>
      )}

      {/* Contact Info */}
      <motion.div
        custom={showConceptOption ? 1 : 0}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="p-6 bg-secondary/50 rounded-xl space-y-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-accent" />
          <h2 className="font-semibold text-lg">{t('Kontaktuppgifter', 'Contact information')}</h2>
        </div>
        
        <div className="space-y-4">
          <motion.div whileFocus={{ scale: 1.01 }} className="space-y-1">
            <Label className={errors.businessName ? 'text-destructive' : ''}>
              {t('Företagsnamn', 'Business name')} *
            </Label>
            <Input 
              value={formData.businessName} 
              onChange={(e) => updateField('businessName', e.target.value)} 
              placeholder={t('Ditt företagsnamn', 'Your business name')} 
              className={`h-12 transition-all focus:ring-2 focus:ring-accent/20 ${errors.businessName ? 'border-destructive animate-shake' : ''}`}
            />
          </motion.div>
          
          <div className="space-y-1">
            <Label className={errors.contactPerson ? 'text-destructive' : ''}>
              {t('Kontaktperson', 'Contact person')} *
            </Label>
            <Input 
              value={formData.contactPerson} 
              onChange={(e) => updateField('contactPerson', e.target.value)} 
              placeholder={t('Ditt namn', 'Your name')} 
              className={`h-12 transition-all focus:ring-2 focus:ring-accent/20 ${errors.contactPerson ? 'border-destructive animate-shake' : ''}`}
            />
          </div>
          
          <div className="space-y-1">
            <Label className={errors.email ? 'text-destructive' : ''}>
              {t('E-post', 'Email')} *
            </Label>
            <Input 
              type="email" 
              value={formData.email} 
              onChange={(e) => updateField('email', e.target.value)} 
              placeholder="name@example.com" 
              className={`h-12 transition-all focus:ring-2 focus:ring-accent/20 ${errors.email ? 'border-destructive animate-shake' : ''}`}
            />
          </div>
          
          <div className="space-y-1">
            <Label className={errors.phone ? 'text-destructive' : ''}>
              {t('Telefon', 'Phone')} *
            </Label>
            <Input 
              type="tel" 
              value={formData.phone} 
              onChange={(e) => updateField('phone', e.target.value)} 
              placeholder="+46 70 123 45 67" 
              className={`h-12 transition-all focus:ring-2 focus:ring-accent/20 ${errors.phone ? 'border-destructive animate-shake' : ''}`}
            />
          </div>
        </div>
      </motion.div>

      {/* Business Type */}
      <motion.div
        custom={showConceptOption ? 2 : 1}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="p-6 bg-secondary/50 rounded-xl space-y-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <Briefcase className="w-5 h-5 text-accent" />
          <h2 className="font-semibold text-lg">{t('Företagstyp', 'Business type')} *</h2>
          <InfoTooltip content={t('Hjälper oss anpassa designen för din bransch.', 'Helps us tailor the design for your industry.')} />
        </div>
        <Select value={formData.businessType} onValueChange={(v) => updateField('businessType', v)}>
          <SelectTrigger className={`h-12 ${errors.businessType ? 'border-destructive animate-shake' : ''}`}>
            <SelectValue placeholder={t('Välj företagstyp', 'Select business type')} />
          </SelectTrigger>
          <SelectContent>
            {businessTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {lang === 'sv' ? type.label.sv : type.label.en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formData.businessType === 'other' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.2 }}
          >
            <Input 
              value={formData.businessTypeOther} 
              onChange={(e) => updateField('businessTypeOther', e.target.value)} 
              placeholder={t('Beskriv din bransch...', 'Describe your industry...')} 
              className={`h-12 mt-2 ${errors.businessTypeOther ? 'border-destructive animate-shake' : ''}`}
            />
          </motion.div>
        )}
      </motion.div>

      {/* Website Goal */}
      <motion.div
        custom={showConceptOption ? 3 : 2}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="p-6 bg-secondary/50 rounded-xl space-y-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-5 h-5 text-accent" />
          <h2 className="font-semibold text-lg">{t('Vad ska din webbplats uppnå?', 'What should your website achieve?')} *</h2>
          <InfoTooltip content={t('Vi anpassar layout och CTA baserat på ditt mål.', 'We tailor layout and CTA based on your goal.')} />
        </div>
        <Select value={formData.websiteGoal} onValueChange={(v) => updateField('websiteGoal', v)}>
          <SelectTrigger className={`h-12 ${errors.websiteGoal ? 'border-destructive animate-shake' : ''}`}>
            <SelectValue placeholder={t('Välj huvudmål', 'Select main goal')} />
          </SelectTrigger>
          <SelectContent>
            {websiteGoals.map((goal) => (
              <SelectItem key={goal.id} value={goal.id}>
                {lang === 'sv' ? goal.label.sv : goal.label.en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formData.websiteGoal === 'other' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.2 }}
          >
            <Input 
              value={formData.websiteGoalOther || ''} 
              onChange={(e) => updateField('websiteGoalOther', e.target.value)} 
              placeholder={t('Beskriv ditt mål...', 'Describe your goal...')} 
              className="h-12 mt-2"
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
