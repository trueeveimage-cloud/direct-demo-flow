import { Link } from 'react-router-dom';
import { MessageCircle, HelpCircle, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
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
        <button 
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-secondary/80 backdrop-blur-md border border-border/50 rounded-full shadow-lg hover:bg-secondary hover:border-accent/30 transition-all duration-300 group"
          aria-label={t('Hjälp & Kontakt', 'Help & Contact')}
        >
          <MessageCircle className="w-5 h-5 text-accent" />
          <span className="text-sm font-medium hidden sm:inline">
            {t('Frågor?', 'Questions?')}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 mb-2">
        <DropdownMenuItem asChild>
          <Link to="/faq" className="flex items-center gap-2 cursor-pointer">
            <HelpCircle className="w-4 h-4 text-accent" />
            <span>{t('Vanliga frågor (FAQ)', 'FAQ')}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/kontakt" className="flex items-center gap-2 cursor-pointer">
            <Mail className="w-4 h-4 text-accent" />
            <span>{t('Kontakta oss', 'Contact us')}</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
