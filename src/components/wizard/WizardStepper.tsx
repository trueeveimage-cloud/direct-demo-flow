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
    <div className="mb-6 sm:mb-10 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex items-center justify-start sm:justify-center gap-1 sm:gap-0 min-w-max sm:min-w-0">
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
                className={`flex items-center justify-center min-w-[32px] h-8 sm:min-w-0 sm:h-auto sm:px-3 sm:py-2 rounded-full sm:rounded-lg transition-all relative ${
                  isActive 
                    ? 'bg-accent text-accent-foreground' 
                    : isCompleted 
                      ? 'bg-accent/20 text-accent cursor-pointer hover:bg-accent/30' 
                      : 'bg-secondary text-muted-foreground'
                }`}
                whileHover={isClickable ? { scale: 1.02 } : {}}
                whileTap={isClickable ? { scale: 0.98 } : {}}
              >
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-bold relative z-10">
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <Check className="w-3 h-3" />
                    </motion.div>
                  ) : (
                    s.num
                  )}
                </span>
                <span className="text-xs sm:text-sm font-medium hidden sm:inline sm:ml-2 relative z-10 whitespace-nowrap">
                  {t(s.labelSv, s.labelEn)}
                </span>
              </motion.button>
              
              {index < stepInfo.length - 1 && (
                <div className="relative w-2 sm:w-6 mx-0.5 sm:mx-0 flex-shrink-0">
                  <div className="h-0.5 bg-border w-full" />
                  {currentStep > s.num && (
                    <motion.div
                      className="absolute top-0 left-0 h-0.5 bg-accent"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.3, delay: 0.1 }}
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