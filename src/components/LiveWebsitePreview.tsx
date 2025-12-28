import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Instagram, Clock, Menu, Star, ChevronRight, Calendar, Check, Users, Sparkles } from 'lucide-react';
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

// Booking system needs check
const bookingBusinessTypes = ['barber', 'nail', 'gym', 'clinic', 'cleaning'];

export const LiveWebsitePreview = memo(function LiveWebsitePreview({
  businessName,
  businessType,
  selectedStyle,
  primaryColor,
  accentColor,
  services,
  websiteGoal,
  phone,
  email,
}: LiveWebsitePreviewProps) {
  const { t, lang } = useLanguage();
  
  const theme = useMemo(() => styleThemes[selectedStyle] || styleThemes.minimal, [selectedStyle]);
  const content = useMemo(() => businessTypeContent[businessType] || businessTypeContent.other, [businessType]);
  const showBooking = useMemo(() => bookingBusinessTypes.includes(businessType), [businessType]);
  
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
  
  const customBorderStyle = useMemo(() => {
    const color = primaryColor || accentColor;
    if (color && (color.startsWith('#') || color.startsWith('rgb'))) {
      return { borderColor: color };
    }
    return undefined;
  }, [primaryColor, accentColor]);

  const customTextStyle = useMemo(() => {
    const color = primaryColor || accentColor;
    if (color && (color.startsWith('#') || color.startsWith('rgb'))) {
      return { color };
    }
    return undefined;
  }, [primaryColor, accentColor]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full rounded-lg overflow-hidden shadow-2xl border border-border/50"
    >
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
          <motion.span 
            key={displayName}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-bold text-sm truncate max-w-[120px]"
          >
            {displayName}
          </motion.span>
          <div className="flex items-center gap-3">
            <span className="text-xs hidden sm:inline">{t('Om oss', 'About')}</span>
            <span className="text-xs hidden sm:inline">{t('Tjänster', 'Services')}</span>
            <span className="text-xs hidden sm:inline">{t('Kontakt', 'Contact')}</span>
            <Menu className="w-4 h-4 sm:hidden" />
          </div>
        </div>

        {/* Hero Section */}
        <div className="px-4 py-8 text-center relative">
          <motion.div
            key={`${businessType}-${selectedStyle}-${primaryColor}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-xl sm:text-2xl font-bold mb-2 leading-tight">
              {heroText}
            </h1>
            <p className="text-xs opacity-70 mb-4 max-w-[200px] mx-auto">
              {lang === 'sv' 
                ? 'Professionell service och kvalitet i världsklass' 
                : 'Professional service and world-class quality'}
            </p>
            
            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              className={`${theme.accent} px-4 py-2 rounded-md text-xs font-semibold text-white transition-all`}
              style={customAccentStyle}
            >
              {ctaText}
              <ChevronRight className="w-3 h-3 inline ml-1" />
            </motion.button>
          </motion.div>

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
          <motion.div 
            className="px-4 py-4 border-t border-current/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-xs font-semibold mb-2 opacity-70">
              {t('Våra tjänster', 'Our services')}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {serviceList.map((service, i) => (
                <motion.div
                  key={service}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="text-xs bg-current/5 rounded px-2 py-1.5 truncate border border-current/10"
                  style={customBorderStyle}
                >
                  {service}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Improved Booking Section - Shows for booking-type businesses */}
        {showBooking && (
          <motion.div 
            className="mx-4 my-4 rounded-xl overflow-hidden border border-current/20 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Booking Header */}
            <div 
              className="px-4 py-3 flex items-center justify-between"
              style={customAccentStyle ? { ...customAccentStyle, color: 'white' } : undefined}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" style={customAccentStyle ? { color: 'white' } : undefined} />
                <span className="text-sm font-semibold" style={customAccentStyle ? { color: 'white' } : undefined}>
                  {t('Boka online', 'Book online')}
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 bg-white/20 rounded-full">
                {t('24/7', '24/7')}
              </span>
            </div>
            
            <div className="bg-current/5 p-3 space-y-3">
              {/* Date Selection */}
              <div className="flex items-center justify-between text-xs">
                <span className="opacity-70">{t('Välj datum', 'Select date')}</span>
                <span className="font-medium" style={customTextStyle}>{new Date().toLocaleDateString(lang === 'sv' ? 'sv-SE' : 'en-US', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
              </div>
              
              {/* Time Slots - More polished */}
              <div className="grid grid-cols-4 gap-1.5">
                {['09:00', '10:30', '13:00', '15:30'].map((time, i) => (
                  <motion.button 
                    key={time}
                    className={`text-[10px] py-2 rounded-md border transition-all ${
                      i === 1 
                        ? 'text-white border-transparent' 
                        : 'border-current/20 hover:border-current/40'
                    }`}
                    style={i === 1 ? customAccentStyle : undefined}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {time}
                  </motion.button>
                ))}
              </div>
              
              {/* Features */}
              <div className="flex items-center justify-between pt-2 border-t border-current/10">
                <div className="flex items-center gap-1 text-[10px] opacity-70">
                  <Check className="w-3 h-3" style={customTextStyle} />
                  <span>{t('Direkt bekräftelse', 'Instant confirmation')}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] opacity-70">
                  <Users className="w-3 h-3" style={customTextStyle} />
                  <span>{t('Gratis avbokning', 'Free cancellation')}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Trust Badges */}
        <motion.div 
          className="px-4 py-3 flex items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-1 text-[10px] opacity-50">
            <Sparkles className="w-3 h-3" />
            <span>{t('Snabb service', 'Fast service')}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] opacity-50">
            <Check className="w-3 h-3" />
            <span>{t('Professionell', 'Professional')}</span>
          </div>
        </motion.div>

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
    </motion.div>
  );
});
