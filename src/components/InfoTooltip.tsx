import { useState } from 'react';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface InfoTooltipProps {
  content: string;
  example?: string;
}

export function InfoTooltip({ content, example }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);

  // Use Popover for mobile (touch), Tooltip for desktop (hover)
  return (
    <>
      {/* Desktop: Tooltip with hover */}
      <div className="hidden sm:inline-flex">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-muted hover:bg-accent/20 transition-colors ml-1"
              >
                <Info className="w-3 h-3 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs p-3">
              <p className="text-sm">{content}</p>
              {example && (
                <p className="text-xs text-muted-foreground mt-1 italic">
                  {example}
                </p>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Mobile: Popover with click */}
      <div className="inline-flex sm:hidden">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-muted hover:bg-accent/20 transition-colors ml-1"
            >
              <Info className="w-3 h-3 text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent side="top" className="max-w-xs p-3">
            <p className="text-sm">{content}</p>
            {example && (
              <p className="text-xs text-muted-foreground mt-1 italic">
                {example}
              </p>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
