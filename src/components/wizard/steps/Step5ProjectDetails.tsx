import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Scale } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';
import { InfoTooltip } from '@/components/InfoTooltip';
import { WizardFormData } from '../wizardConfig';

interface Step5ProjectDetailsProps {
  formData: WizardFormData;
  setFormData: (data: WizardFormData) => void;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.3, ease: "easeOut" as const }
  })
};

export function Step5ProjectDetails({ formData, setFormData }: Step5ProjectDetailsProps) {
  const { t } = useLanguage();

  const updateField = <K extends keyof WizardFormData>(field: K, value: WizardFormData[K]) => {
    setFormData({ ...formData, [field]: value });
  };

  const toggleLegalPage = (page: string, checked: boolean) => {
    if (checked) {
      updateField('legalPages', [...formData.legalPages, page]);
    } else {
      updateField('legalPages', formData.legalPages.filter(p => p !== page));
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Project Details */}
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="p-6 bg-secondary/50 rounded-xl space-y-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-5 h-5 text-accent" />
          <h3 className="font-semibold">{t('Projektdetaljer (valfritt)', 'Project details (optional)')}</h3>
        </div>
        <div>
          <Label>{t('Sidstruktur & anteckningar', 'Page structure & notes')}</Label>
          <Textarea 
            value={formData.pageNotes} 
            onChange={(e) => updateField('pageNotes', e.target.value)} 
            placeholder={t('Beskriv varje sida...', 'Describe each page...')} 
            rows={3} 
            className="mt-1"
          />
        </div>
        <div>
          <Label>{t('Varumärke & preferenser', 'Brand & preferences')}</Label>
          <Textarea 
            value={formData.brandPreferences} 
            onChange={(e) => updateField('brandPreferences', e.target.value)} 
            placeholder={t('Färger, typsnitt, ton...', 'Colors, fonts, tone...')} 
            rows={2} 
            className="mt-1"
          />
        </div>
        <div>
          <Label>{t('Webbplatser du gillar (konkurrenter)', 'Websites you like (competitors)')}</Label>
          <Input 
            value={formData.competitors} 
            onChange={(e) => updateField('competitors', e.target.value)} 
            placeholder="https://..." 
            className="h-12 mt-1"
          />
        </div>
        <div>
          <Label>{t('SEO-sökord', 'SEO keywords')}</Label>
          <Input 
            value={formData.seoKeywords} 
            onChange={(e) => updateField('seoKeywords', e.target.value)} 
            placeholder={t('Sökord, lokalområde...', 'Keywords, local area...')} 
            className="h-12 mt-1"
          />
        </div>
      </motion.div>

      {/* Legal Pages */}
      <motion.div
        custom={1}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="p-6 bg-secondary/50 rounded-xl space-y-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <Scale className="w-5 h-5 text-accent" />
          <h3 className="font-semibold">{t('Juridiska sidor', 'Legal pages')}</h3>
          <InfoTooltip content={t('Juridiska sidor som integritetspolicy och villkor är viktiga för att skydda ditt företag och uppfylla lagar som GDPR.', 'Legal pages like privacy policy and terms are important to protect your business and comply with laws like GDPR.')} />
        </div>
        <div className="flex flex-wrap gap-3">
          <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-accent/5 transition-colors">
            <Checkbox 
              checked={formData.legalPages.includes('GDPR')} 
              onCheckedChange={(checked) => toggleLegalPage('GDPR', checked === true)}
            />
            <span className="text-sm">GDPR</span>
          </label>
          
          <label 
            className={`flex items-center gap-2 p-3 border rounded-lg transition-colors ${
              formData.selectedPackage === 'pro' 
                ? 'bg-accent/10 border-accent/30 cursor-not-allowed' 
                : 'cursor-pointer hover:bg-accent/5'
            }`}
          >
            <Checkbox 
              checked={formData.legalPages.includes('Cookies') || formData.selectedPackage === 'pro'} 
              disabled={formData.selectedPackage === 'pro'}
              onCheckedChange={(checked) => toggleLegalPage('Cookies', checked === true)}
            />
            <span className="text-sm">Cookies</span>
            {formData.selectedPackage === 'pro' && (
              <InfoTooltip content={t('Cookies-sida krävs för Pro-paketet eftersom Google Analytics använder cookies för spårning.', 'Cookies page is required for Pro package because Google Analytics uses cookies for tracking.')} />
            )}
          </label>
          
          <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-accent/5 transition-colors">
            <Checkbox 
              checked={formData.legalPages.includes('Terms')} 
              onCheckedChange={(checked) => toggleLegalPage('Terms', checked === true)}
            />
            <span className="text-sm">{t('Villkor', 'Terms')}</span>
          </label>
        </div>
        
        {formData.legalPages.includes('Terms') && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <Label className="text-sm">{t('Förklara dina villkor', 'Explain your terms')}</Label>
            <Textarea 
              value={formData.termsExplanation} 
              onChange={(e) => updateField('termsExplanation', e.target.value)} 
              placeholder={t('T.ex. betalningsvillkor, leveransvillkor, returpolicy...', 'E.g. payment terms, delivery terms, return policy...')}
              rows={2}
              className="mt-1"
            />
          </motion.div>
        )}
      </motion.div>

      {/* Extra Notes */}
      <motion.div
        custom={2}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="p-6 bg-secondary/50 rounded-xl"
      >
        <Label>{t('Övriga anteckningar', 'Additional notes')}</Label>
        <Textarea 
          value={formData.extraNotes} 
          onChange={(e) => updateField('extraNotes', e.target.value)} 
          placeholder={t('Något annat vi bör veta?', 'Anything else we should know?')}
          rows={3}
          className="mt-1"
        />
      </motion.div>
    </div>
  );
}
