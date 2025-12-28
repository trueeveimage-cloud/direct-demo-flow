import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useLanguage } from '@/contexts/LanguageContext';

export function PreviewInfoTooltip() {
  const { t } = useLanguage();
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <button 
            type="button" 
            className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent/20 text-accent hover:bg-accent/30 transition-colors"
            aria-label={t('Info om förhandsgranskning', 'Preview info')}
          >
            <Info className="w-3 h-3" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[280px] p-3">
          <p className="text-sm font-medium mb-1">
            {t('Detta är en konceptvisning', 'This is a concept preview')}
          </p>
          <p className="text-xs text-muted-foreground">
            {t(
              'Förhandsgranskningen visar en ungefärlig layout baserat på dina val – inte den slutgiltiga designen. Vi skapar ditt unika koncept manuellt.',
              'The preview shows an approximate layout based on your choices – not the final design. We create your unique concept manually.'
            )}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
