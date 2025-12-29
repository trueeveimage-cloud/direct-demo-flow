import { memo, useMemo } from 'react';
import { Phone, Mail, Menu, Star, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LiveWebsitePreviewProps {
  businessName: string;
  businessType: string;
  selectedStyle: string;
  primaryColor: string;
  accentColor: string;
  services: string;
  websiteGoal: string;
  phone: string;
  email: string;
  isLoading?: boolean;
}

const styleThemes: Record<string, { bg: string; text: string; accent: string; font: string }> = {
  minimal: { bg: 'bg-white', text: 'text-gray-900', accent: 'bg-gray-900', font: 'font-sans' },
  luxury: { bg: 'bg-stone-950', text: 'text-stone-100', accent: 'bg-amber-500', font: 'font-serif' },
  bold: { bg: 'bg-black', text: 'text-white', accent: 'bg-red-500', font: 'font-sans' },
  playful: { bg: 'bg-rose-50', text: 'text-rose-950', accent: 'bg-rose-500', font: 'font-sans' },
  corporate: { bg: 'bg-slate-50', text: 'text-slate-900', accent: 'bg-blue-600', font: 'font-sans' },
};

const businessTypeContent: Record<string, { heroText: { sv: string; en: string }; ctaText: { sv: string; en: string } }> = {
  barber: { heroText: { sv: 'Din nya look börjar här', en: 'Your new look starts here' }, ctaText: { sv: 'Boka tid', en: 'Book now' } },
  nail: { heroText: { sv: 'Perfekta naglar, varje gång', en: 'Perfect nails, every time' }, ctaText: { sv: 'Boka tid', en: 'Book now' } },
  restaurant: { heroText: { sv: 'Välkommen till en smakupplevelse', en: 'Welcome to a taste experience' }, ctaText: { sv: 'Se meny', en: 'View menu' } },
  gym: { heroText: { sv: 'Träna smartare, bli starkare', en: 'Train smarter, get stronger' }, ctaText: { sv: 'Börja nu', en: 'Start now' } },
  clinic: { heroText: { sv: 'Din hälsa, vår prioritet', en: 'Your health, our priority' }, ctaText: { sv: 'Boka tid', en: 'Book now' } },
  car: { heroText: { sv: 'Service du kan lita på', en: 'Service you can trust' }, ctaText: { sv: 'Kontakta oss', en: 'Contact us' } },
  cleaning: { heroText: { sv: 'Ett rent hem, ett lyckligt hem', en: 'A clean home, a happy home' }, ctaText: { sv: 'Få offert', en: 'Get quote' } },
  realestate: { heroText: { sv: 'Hitta ditt drömhem', en: 'Find your dream home' }, ctaText: { sv: 'Se objekt', en: 'View listings' } },
  retail: { heroText: { sv: 'Upptäck vårt sortiment', en: 'Discover our selection' }, ctaText: { sv: 'Shoppa nu', en: 'Shop now' } },
  other: { heroText: { sv: 'Välkommen till oss', en: 'Welcome' }, ctaText: { sv: 'Kontakt', en: 'Contact' } },
};

export const LiveWebsitePreview = memo(function LiveWebsitePreview({
  businessName,
  businessType,
  selectedStyle,
  primaryColor,
  accentColor,
  services,
  phone,
  email,
}: LiveWebsitePreviewProps) {
  const { t, lang } = useLanguage();
  
  const theme = useMemo(() => styleThemes[selectedStyle] || styleThemes.minimal, [selectedStyle]);
  const content = useMemo(() => businessTypeContent[businessType] || businessTypeContent.other, [businessType]);
  
  const displayName = businessName || (lang === 'sv' ? 'Ditt Företag' : 'Your Business');
  const heroText = lang === 'sv' ? content.heroText.sv : content.heroText.en;
  const ctaText = lang === 'sv' ? content.ctaText.sv : content.ctaText.en;
  
  const serviceList = useMemo(() => {
    if (!services) return [];
    return services.split(',').map(s => s.trim()).filter(Boolean).slice(0, 4);
  }, [services]);

  // Custom color styles - use hex colors if provided
  const customAccentStyle = useMemo(() => {
    const color = primaryColor || accentColor;
    if (color && (color.startsWith('#') || color.startsWith('rgb'))) {
      return { backgroundColor: color };
    }
    return undefined;
  }, [primaryColor, accentColor]);

  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-2xl border border-border/50">
      {/* Browser Chrome */}
      <div className="bg-muted/50 px-3 py-2 flex items-center gap-2 border-b border-border/50">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 mx-4">
          <div className="bg-background/80 rounded-md px-3 py-1 text-xs text-muted-foreground truncate">
            www.{displayName.toLowerCase().replace(/\s+/g, '')}.se
          </div>
        </div>
      </div>

      {/* Website Preview */}
      <div className={`${theme.bg} ${theme.text} ${theme.font} h-[500px] overflow-y-auto relative`}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-current/10 sticky top-0 backdrop-blur-sm" style={{ backgroundColor: 'inherit' }}>
          <span className="font-bold text-sm truncate max-w-[120px]">
            {displayName}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xs hidden sm:inline">{t('Om oss', 'About')}</span>
            <span className="text-xs hidden sm:inline">{t('Tjänster', 'Services')}</span>
            <span className="text-xs hidden sm:inline">{t('Kontakt', 'Contact')}</span>
            <Menu className="w-4 h-4 sm:hidden" />
          </div>
        </div>

        {/* Hero Section */}
        <div className="px-4 py-8 text-center relative">
          <h1 className="text-xl sm:text-2xl font-bold mb-2 leading-tight">
            {heroText}
          </h1>
          <p className="text-xs opacity-70 mb-4 max-w-[200px] mx-auto">
            {lang === 'sv' 
              ? 'Professionell service och kvalitet i världsklass' 
              : 'Professional service and world-class quality'}
          </p>
          
          {/* CTA Button */}
          <button
            className={`${theme.accent} px-4 py-2 rounded-md text-xs font-semibold text-white transition-transform hover:scale-105`}
            style={customAccentStyle}
          >
            {ctaText}
            <ChevronRight className="w-3 h-3 inline ml-1" />
          </button>

          {/* Rating */}
          <div className="flex items-center justify-center gap-1 mt-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="text-xs ml-1 opacity-70">5.0</span>
          </div>
        </div>

        {/* Services Section */}
        {serviceList.length > 0 && (
          <div className="px-4 py-4 border-t border-current/10">
            <h3 className="text-xs font-semibold mb-2 opacity-70">
              {t('Våra tjänster', 'Our services')}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {serviceList.map((service) => (
                <div
                  key={service}
                  className="text-xs bg-current/5 rounded px-2 py-1.5 truncate border border-current/10"
                >
                  {service}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Footer */}
        <div className="px-4 py-3 border-t border-current/10 bg-current/5 mt-4">
          <div className="flex items-center justify-center gap-4 text-xs opacity-70">
            {phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span className="truncate max-w-[80px]">{phone}</span>
              </span>
            )}
            {email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                <span className="truncate max-w-[100px]">{email}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
