import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function FloatingContactButton() {
  const { t } = useLanguage();
  
  return (
    <Link 
      to="/kontakt" 
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-secondary/80 backdrop-blur-md border border-border/50 rounded-full shadow-lg hover:bg-secondary hover:border-accent/30 transition-all duration-300 group"
      aria-label={t('Kontakta oss', 'Contact us')}
    >
      <MessageCircle className="w-5 h-5 text-accent" />
      <span className="text-sm font-medium hidden sm:inline">
        {t('Frågor?', 'Questions?')}
      </span>
    </Link>
  );
}
