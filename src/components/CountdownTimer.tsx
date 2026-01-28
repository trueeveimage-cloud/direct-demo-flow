import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timer } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CountdownTimerProps {
  className?: string;
  variant?: 'compact' | 'full';
}

export function CountdownTimer({ className = '', variant = 'compact' }: CountdownTimerProps) {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Calculate time until midnight
    const calculateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      
      return {
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  if (variant === 'full') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-accent/10 to-amber-500/10 border border-accent/30 ${className}`}
      >
        <div className="flex items-center justify-center gap-2 text-accent text-sm font-medium mb-2">
          <Timer className="w-4 h-4" />
          <span>{t('Erbjudandet slutar om:', 'Offer ends in:')}</span>
        </div>
        <div className="flex items-center justify-center gap-3">
          <TimeBlock value={formatNumber(timeLeft.hours)} label={t('tim', 'hrs')} />
          <span className="text-2xl font-bold text-accent">:</span>
          <TimeBlock value={formatNumber(timeLeft.minutes)} label={t('min', 'min')} />
          <span className="text-2xl font-bold text-accent">:</span>
          <TimeBlock value={formatNumber(timeLeft.seconds)} label={t('sek', 'sec')} />
        </div>
      </motion.div>
    );
  }

  // Compact variant
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-sm ${className}`}
    >
      <Timer className="w-3.5 h-3.5 text-accent" />
      <span className="text-muted-foreground">{t('Slutar om:', 'Ends in:')}</span>
      <span className="font-mono font-bold text-accent">
        {formatNumber(timeLeft.hours)}:{formatNumber(timeLeft.minutes)}:{formatNumber(timeLeft.seconds)}
      </span>
    </motion.div>
  );
}

function TimeBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-accent/20">
        <span className="text-2xl font-bold font-mono text-foreground">{value}</span>
      </div>
      <span className="text-xs text-muted-foreground mt-1">{label}</span>
    </div>
  );
}
