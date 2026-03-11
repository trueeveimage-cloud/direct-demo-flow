import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Settings, Check, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

interface AdminPanelUpsellModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
  onDecline: () => void;
}

export function AdminPanelUpsellModal({ 
  open, 
  onOpenChange, 
  onAccept, 
  onDecline 
}: AdminPanelUpsellModalProps) {
  const { t } = useLanguage();

  const features = [
    { sv: 'Se besöksstatistik i realtid', en: 'View visitor statistics in real-time' },
    { sv: 'Lägg till och ta bort sidor', en: 'Add and remove pages' },
    { sv: 'Uppdatera priser och erbjudanden', en: 'Update prices and offers' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <motion.div 
              className="w-16 h-16 bg-gradient-to-br from-accent/20 to-purple-500/20 rounded-2xl flex items-center justify-center"
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <Settings className="w-8 h-8 text-accent" />
            </motion.div>
          </div>
          <DialogTitle className="text-center text-xl">
            {t('Vill du ha en adminpanel?', 'Would you like an admin panel?')}
          </DialogTitle>
          <DialogDescription className="text-center">
            {t(
              'Hantera din webbplats själv utan att behöva kontakta oss för varje ändring.',
              'Manage your website yourself without needing to contact us for every change.'
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 my-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 text-sm"
            >
              <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-accent" />
              </div>
              <span>{t(feature.sv, feature.en)}</span>
            </motion.div>
          ))}
        </div>

        <div className="p-4 bg-secondary/50 rounded-xl text-center mb-4">
          <p className="text-2xl font-bold text-accent">+€100</p>
          <p className="text-xs text-muted-foreground">{t('Engångsavgift', 'One-time fee')}</p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onDecline}
            className="flex-1"
          >
            <X className="w-4 h-4 mr-2" />
            {t('Nej tack', 'No thanks')}
          </Button>
          <Button
            onClick={onAccept}
            className="flex-1"
          >
            <Check className="w-4 h-4 mr-2" />
            {t('Lägg till', 'Add it')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
