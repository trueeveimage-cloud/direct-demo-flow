import { motion } from 'framer-motion';
import { Check, Users, Package, FileText, Clock, CreditCard, Settings } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { FormStep, stepInfo } from './wizardConfig';

interface WizardStepperProps {
  currentStep: FormStep;
  onStepClick?: (step: FormStep) => void;
}

const stepIcons = {
  1: Users,
  2: Package,
  3: FileText,
  4: Clock,
  5: Settings,
  6: CreditCard,
};

export function WizardStepper({ currentStep, onStepClick }: WizardStepperProps) {
  const { t } = useLanguage();

  return (
    <div className="mb-6 sm:mb-10">
      {/* Mobile: Compact horizontal scroll with numbers only */}
      <div className="flex sm:hidden items-center justify-center gap-2 px-4">
        {stepInfo.map((s, index) => {
          const isActive = currentStep === s.num;
          const isCompleted = currentStep > s.num;
          const isClickable = onStepClick && isCompleted;

          return (
            <div key={s.num} className="flex items-center">
              <motion.button
                type="button"
                onClick={() => isClickable && onStepClick(s.num as FormStep)}
                disabled={!isClickable}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isActive 
                    ? 'bg-accent text-accent-foreground scale-110' 
                    : isCompleted 
                      ? 'bg-accent/20 text-accent cursor-pointer' 
                      : 'bg-secondary text-muted-foreground'
                }`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : s.num}
              </motion.button>
              
              {index < stepInfo.length - 1 && (
                <div className={`w-4 h-0.5 mx-1 ${currentStep > s.num ? 'bg-accent' : 'bg-border'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: Current step label */}
      <div className="sm:hidden text-center mt-3">
        <span className="text-sm font-medium text-accent">
          {t(stepInfo[currentStep - 1]?.labelSv, stepInfo[currentStep - 1]?.labelEn)}
        </span>
        <span className="text-xs text-muted-foreground ml-2">({currentStep}/6)</span>
      </div>

      {/* Desktop: Full stepper with labels */}
      <div className="hidden sm:flex items-center justify-center">
        {stepInfo.map((s, index) => {
          const Icon = stepIcons[s.num as keyof typeof stepIcons];
          const isActive = currentStep === s.num;
          const isCompleted = currentStep > s.num;
          const isClickable = onStepClick && isCompleted;

          return (
            <div key={s.num} className="flex items-center">
              <motion.button
                type="button"
                onClick={() => isClickable && onStepClick(s.num as FormStep)}
                disabled={!isClickable}
                className={`flex items-center justify-center px-3 py-2 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-accent text-accent-foreground' 
                    : isCompleted 
                      ? 'bg-accent/20 text-accent cursor-pointer hover:bg-accent/30' 
                      : 'bg-secondary text-muted-foreground'
                }`}
                whileHover={isClickable ? { scale: 1.02 } : {}}
                whileTap={isClickable ? { scale: 0.98 } : {}}
              >
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </motion.div>
                  ) : (
                    s.num
                  )}
                </span>
                <span className="text-sm font-medium ml-2 whitespace-nowrap">
                  {t(s.labelSv, s.labelEn)}
                </span>
              </motion.button>
              
              {index < stepInfo.length - 1 && (
                <div className="relative w-6 mx-1">
                  <div className="h-0.5 bg-border w-full" />
                  {currentStep > s.num && (
                    <motion.div
                      className="absolute top-0 left-0 h-0.5 bg-accent"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
