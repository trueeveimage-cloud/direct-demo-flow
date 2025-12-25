import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { InfoTooltip } from '@/components/InfoTooltip';
import { businessTypeFollowUps, WizardFormData, FollowUpQuestion } from '../wizardConfig';

interface BusinessTypeFollowUpProps {
  formData: WizardFormData;
  setFormData: (data: WizardFormData) => void;
}

function BusinessTypeFollowUpComponent({ formData, setFormData }: BusinessTypeFollowUpProps) {
  const { t, lang } = useLanguage();
  
  // Find follow-up questions for current business type
  const followUp = businessTypeFollowUps.find(f => 
    f.businessTypes.includes(formData.businessType)
  );
  
  if (!followUp) return null;
  
  const updateFollowUp = (questionId: string, value: string | boolean | string[]) => {
    setFormData({
      ...formData,
      businessFollowUps: {
        ...formData.businessFollowUps,
        [questionId]: value,
      },
    });
  };
  
  const toggleMultiSelect = (questionId: string, optionId: string) => {
    const current = (formData.businessFollowUps[questionId] as string[]) || [];
    const updated = current.includes(optionId)
      ? current.filter(id => id !== optionId)
      : [...current, optionId];
    updateFollowUp(questionId, updated);
  };
  
  const renderQuestion = (question: FollowUpQuestion, index: number) => {
    const value = formData.businessFollowUps[question.id];
    
    return (
      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.2 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">
            {lang === 'sv' ? question.label.sv : question.label.en}
            {question.required && ' *'}
          </Label>
          {question.tooltip && (
            <InfoTooltip content={lang === 'sv' ? question.tooltip.sv : question.tooltip.en} />
          )}
        </div>
        
        {question.type === 'toggle' && (
          <div className="flex items-center gap-3">
            <Switch
              checked={value as boolean || false}
              onCheckedChange={(checked) => updateFollowUp(question.id, checked)}
            />
            <span className="text-sm text-muted-foreground">
              {value ? t('Ja', 'Yes') : t('Nej', 'No')}
            </span>
          </div>
        )}
        
        {question.type === 'text' && (
          <Input
            value={(value as string) || ''}
            onChange={(e) => updateFollowUp(question.id, e.target.value)}
            placeholder={question.placeholder ? (lang === 'sv' ? question.placeholder.sv : question.placeholder.en) : ''}
            className="h-10"
          />
        )}
        
        {question.type === 'select' && question.options && (
          <Select
            value={(value as string) || ''}
            onValueChange={(v) => updateFollowUp(question.id, v)}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder={t('Välj...', 'Select...')} />
            </SelectTrigger>
            <SelectContent>
              {question.options.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {lang === 'sv' ? option.label.sv : option.label.en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        
        {question.type === 'multiselect' && question.options && (
          <div className="flex flex-wrap gap-2">
            {question.options.map((option) => {
              const selected = ((value as string[]) || []).includes(option.id);
              return (
                <motion.button
                  key={option.id}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleMultiSelect(question.id, option.id)}
                  className={`px-3 py-2 rounded-lg border-2 text-sm transition-all ${
                    selected ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/50'
                  }`}
                >
                  {lang === 'sv' ? option.label.sv : option.label.en}
                </motion.button>
              );
            })}
          </div>
        )}
      </motion.div>
    );
  };
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className="p-5 bg-accent/5 border border-accent/20 rounded-xl space-y-4 mt-4"
      >
        <p className="text-sm font-medium text-accent">
          {t('Några frågor för att skapa en bättre webbplats', 'A few questions to create a better website')}
        </p>
        {followUp.questions.map((q, i) => renderQuestion(q, i))}
      </motion.div>
    </AnimatePresence>
  );
}

export const BusinessTypeFollowUp = memo(BusinessTypeFollowUpComponent);