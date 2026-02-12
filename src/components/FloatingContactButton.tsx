import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, HelpCircle, Mail, Sparkles, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function FloatingContactButton() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <motion.button 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all duration-300 ${
            isOpen 
              ? 'bg-gradient-to-r from-accent to-accent/80 shadow-accent/40 shadow-2xl border border-accent/50' 
              : 'bg-secondary/90 backdrop-blur-md border border-border/50 hover:border-accent/30 hover:bg-secondary'
          }`}
          aria-label={t('Hjälp & Kontakt', 'Help & Contact')}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.span
                key="open"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="relative flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
                <X className="w-5 h-5 text-white" />
              </motion.span>
            ) : (
              <motion.span
                key="closed"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2"
              >
                <MessageCircle className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium hidden sm:inline">
                  {t('Frågor?', 'Questions?')}
                </span>
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 mb-2 bg-card/95 backdrop-blur-md border-accent/20">
        <DropdownMenuItem asChild>
          <Link to="/faq" className="flex items-center gap-3 cursor-pointer py-3">
            <div className="p-2 rounded-full bg-accent/10">
              <HelpCircle className="w-4 h-4 text-accent" />
            </div>
            <span className="font-medium">{t('Vanliga frågor (FAQ)', 'FAQ')}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/kontakt" className="flex items-center gap-3 cursor-pointer py-3">
            <div className="p-2 rounded-full bg-accent/10">
              <Mail className="w-4 h-4 text-accent" />
            </div>
            <span className="font-medium">{t('Kontakta oss', 'Contact us')}</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
