import { memo, useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, MapPin, Instagram, Clock, Menu, Star, ChevronRight, Calendar, Check, User, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PreviewSkeleton } from './PreviewSkeleton';

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
  isLoading = false,
}: LiveWebsitePreviewProps) {
  const { t, lang } = useLanguage();
  const [internalLoading, setInternalLoading] = useState(false);
  
  // Trigger loading state on significant changes
  useEffect(() => {
    setInternalLoading(true);
    const timer = setTimeout(() => setInternalLoading(false), 400);
    return () => clearTimeout(timer);
  }, [selectedStyle, businessType, primaryColor]);
  
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
  
  const customTextStyle = useMemo(() => {
    const color = primaryColor || accentColor;
    if (color && (color.startsWith('#') || color.startsWith('rgb'))) {
      return { color };
    }
    return undefined;
  }, [primaryColor, accentColor]);

  const showLoading = isLoading || internalLoading;

  return (
    <AnimatePresence mode="wait">
      {showLoading ? (
        <PreviewSkeleton key="skeleton" />
      ) : (
        <motion.div
          key="preview"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
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
                    >
                      {service}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Booking Section - Completely redesigned */}
            {showBooking && (
              <motion.div 
                className="mx-4 my-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="rounded-2xl overflow-hidden shadow-lg border border-current/10">
                  {/* Booking Header */}
                  <div 
                    className="px-4 py-3 flex items-center gap-3"
                    style={{ backgroundColor: primaryColor || accentColor || 'hsl(var(--accent))' }}
                  >
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{t('Boka online', 'Book online')}</p>
                      <p className="text-white/70 text-[10px]">{t('Snabbt & enkelt', 'Quick & easy')}</p>
                    </div>
                    <Sparkles className="w-4 h-4 text-white/60 ml-auto" />
                  </div>
                  
                  {/* Booking Content */}
                  <div className="p-4 bg-current/5 space-y-4">
                    {/* Service Selection */}
                    <div>
                      <p className="text-[10px] font-semibold opacity-60 mb-2 flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-current/10 flex items-center justify-center text-[8px] font-bold">1</span>
                        {t('Välj tjänst', 'Select service')}
                      </p>
                      <div className="space-y-1.5">
                        {['Klippning', 'Skägg', 'Klipp + Skägg'].slice(0, 3).map((service, i) => (
                          <motion.div
                            key={service}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + i * 0.05 }}
                            className={`flex items-center justify-between p-2 rounded-lg text-[10px] cursor-pointer transition-all ${
                              i === 0 ? 'bg-current/10 border-2' : 'bg-background/50 border border-current/10 hover:bg-current/5'
                            }`}
                            style={i === 0 ? { borderColor: primaryColor || accentColor || 'currentColor' } : undefined}
                          >
                            <span className="font-medium">{service}</span>
                            <span className="opacity-60">{i === 2 ? '450 kr' : i === 0 ? '350 kr' : '200 kr'}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Date/Time Grid */}
                    <div>
                      <p className="text-[10px] font-semibold opacity-60 mb-2 flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-current/10 flex items-center justify-center text-[8px] font-bold">2</span>
                        {t('Välj tid', 'Select time')}
                      </p>
                      <div className="grid grid-cols-3 gap-1.5">
                        {['09:00', '10:30', '11:00', '14:00', '15:30', '17:00'].map((time, i) => (
                          <motion.button
                            key={time}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 + i * 0.03 }}
                            className={`text-[10px] py-2 rounded-lg transition-all ${
                              i === 1 
                                ? 'text-white font-bold shadow-md' 
                                : 'bg-background/70 hover:bg-background border border-current/10'
                            }`}
                            style={i === 1 ? customAccentStyle : undefined}
                          >
                            {time}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Staff Selection - Mini */}
                    <div className="flex items-center gap-2 pt-1">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((_, i) => (
                          <div 
                            key={i} 
                            className="w-6 h-6 rounded-full bg-current/20 border-2 border-background flex items-center justify-center"
                          >
                            <User className="w-3 h-3 opacity-50" />
                          </div>
                        ))}
                      </div>
                      <span className="text-[9px] opacity-50">{t('Alla tillgängliga', 'All available')}</span>
                    </div>
                    
                    {/* Book Button */}
                    <motion.button
                      className="w-full py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 shadow-lg"
                      style={customAccentStyle || { backgroundColor: 'hsl(var(--accent))' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Check className="w-4 h-4" />
                      {t('Boka nu', 'Book now')}
                    </motion.button>
                  </div>
                </div>
                
                {/* Trust badges */}
                <div className="flex items-center justify-center gap-4 mt-3 text-[9px] opacity-40">
                  <span className="flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    {t('Gratis avbokning', 'Free cancellation')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    {t('SMS-påminnelse', 'SMS reminder')}
                  </span>
                </div>
              </motion.div>
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
        </motion.div>
      )}
    </AnimatePresence>
  );
});
