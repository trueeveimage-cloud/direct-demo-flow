import { Link } from 'react-router-dom';
import { MessageCircle, HelpCircle, Mail, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function FloatingContactButton() {
  const { t } = useLanguage();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground rounded-full shadow-2xl shadow-accent/30 hover:shadow-accent/50 transition-all duration-300 group border border-accent/50"
          aria-label={t('Hjälp & Kontakt', 'Help & Contact')}
        >
          {/* Pulsing ring effect */}
          <span className="absolute inset-0 rounded-full animate-ping bg-accent/30 opacity-75" style={{ animationDuration: '2s' }} />
          <span className="absolute inset-0 rounded-full animate-pulse bg-accent/20" style={{ animationDuration: '3s' }} />
          
          {/* Icon with sparkle */}
          <span className="relative flex items-center gap-2">
            <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-white animate-pulse" />
            <MessageCircle className="w-5 h-5 text-white" />
            <span className="text-sm font-semibold text-white hidden sm:inline">
              {t('Frågor?', 'Questions?')}
            </span>
          </span>
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
