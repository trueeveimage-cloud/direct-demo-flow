import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, ArrowRight, ArrowLeft, Check, 
  Palette, Clock, Calendar, Plus, Trash2, Info, Loader2, Building2,
  ShoppingBag, Utensils, Scissors, Briefcase, HelpCircle, Wrench, MessageSquare, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { AnimatedSection } from '@/components/AnimatedSection';
import { SEOHead } from '@/components/SEOHead';
import { getCurrencyFromLang, getAddonPrice, formatPrice } from '@/config/currency';
import { trackFunnelEvent, FunnelEvents, trackEvent, getUtmParams } from '@/lib/posthog';
import { useRemainingSpots } from '@/hooks/useRemainingSpots';
import { useEmailCapture } from '@/hooks/useEmailCapture';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const DEMO_STORAGE_KEY = 'nomia_demo_wizard_data';

interface BookingService {
  name: string;
  duration: string;
  price: string;
}

const businessTypes = [
  { id: 'ecommerce', labelSv: 'E-handel', labelEn: 'E-commerce', icon: ShoppingBag },
  { id: 'restaurant', labelSv: 'Restaurang / Café', labelEn: 'Restaurant / Café', icon: Utensils },
  { id: 'salon', labelSv: 'Salong / Spa', labelEn: 'Salon / Spa', icon: Scissors },
  { id: 'service', labelSv: 'Tjänsteföretag', labelEn: 'Service Business', icon: Briefcase },
  { id: 'portfolio', labelSv: 'Portfolio / Kreativ', labelEn: 'Portfolio / Creative', icon: Palette },
  { id: 'consulting', labelSv: 'Konsult / Byrå', labelEn: 'Consulting / Agency', icon: MessageSquare },
  { id: 'trades', labelSv: 'Hantverkare', labelEn: 'Trades / Contractor', icon: Wrench },
  { id: 'other', labelSv: 'Annat', labelEn: 'Other', icon: HelpCircle },
];

const websiteGoals = [
  { id: 'leads', labelSv: 'Få fler leads/förfrågningar', labelEn: 'Generate more leads/inquiries' },
  { id: 'bookings', labelSv: 'Ta emot bokningar online', labelEn: 'Accept online bookings' },
  { id: 'sales', labelSv: 'Sälja produkter online', labelEn: 'Sell products online' },
  { id: 'showcase', labelSv: 'Visa upp mitt arbete/portfolio', labelEn: 'Showcase my work/portfolio' },
  { id: 'information', labelSv: 'Ge information om mitt företag', labelEn: 'Provide information about my business' },
  { id: 'brand', labelSv: 'Bygga varumärke och trovärdighet', labelEn: 'Build brand and credibility' },
];

const styleOptions = [
  { id: 'modern', labelSv: 'Modernt & Minimalistiskt', labelEn: 'Modern & Minimalist' },
  { id: 'bold', labelSv: 'Djärvt & Färgstarkt', labelEn: 'Bold & Colorful' },
  { id: 'elegant', labelSv: 'Elegant & Sofistikerat', labelEn: 'Elegant & Sophisticated' },
  { id: 'playful', labelSv: 'Lekfullt & Kreativt', labelEn: 'Playful & Creative' },
  { id: 'professional', labelSv: 'Professionellt & Företagsmässigt', labelEn: 'Professional & Corporate' },
  { id: 'natural', labelSv: 'Naturligt & Organiskt', labelEn: 'Natural & Organic' },
];

const colorPresets = [
  { name: 'Ocean Blue', primary: '#0066CC', accent: '#00AAFF' },
  { name: 'Forest Green', primary: '#2D5016', accent: '#6B8E23' },
  { name: 'Sunset Orange', primary: '#E65100', accent: '#FF9800' },
  { name: 'Royal Purple', primary: '#6A1B9A', accent: '#AB47BC' },
  { name: 'Coral Pink', primary: '#E91E63', accent: '#F48FB1' },
  { name: 'Slate Gray', primary: '#37474F', accent: '#78909C' },
];

export default function FreeDemoPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { lang } = useLanguage();
  const t = (sv: string, en: string) => lang === 'sv' ? sv : en;
  const { remainingSpots, isLoading: spotsLoading } = useRemainingSpots();
  const [showSpotsDialog, setShowSpotsDialog] = useState(false);

  const [step, setStep] = useState(1);
  const totalSteps = 6; // Added package selection step
  const hasTrackedStart = useRef(false);

  // Track demo wizard start on mount
  useEffect(() => {
    if (!hasTrackedStart.current) {
      hasTrackedStart.current = true;
      trackFunnelEvent('WIZARD_START', { wizard_type: 'demo', step: 1 });
    }
  }, []);

  // Track step changes
  useEffect(() => {
    trackFunnelEvent('WIZARD_STEP', { wizard_type: 'demo', step });
  }, [step]);
  
  // Form state
  const [businessName, setBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currentWebsite, setCurrentWebsite] = useState('');
  const [country, setCountry] = useState(lang === 'sv' ? 'SE' : 'US'); // Country selection
  const [businessType, setBusinessType] = useState('');
  const [businessTypeOther, setBusinessTypeOther] = useState('');
  const [websiteGoal, setWebsiteGoal] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [primaryColor, setPrimaryColor] = useState('');
  const [accentColor, setAccentColor] = useState('');
  const [noColorPreference, setNoColorPreference] = useState(false);
  const [services, setServices] = useState('');
  const [wantsBooking, setWantsBooking] = useState<boolean | null>(null);
  const [openingHours, setOpeningHours] = useState('');
  const [appointmentLengths, setAppointmentLengths] = useState<string[]>([]);
  const [customAppointmentLength, setCustomAppointmentLength] = useState('');
  const [bookingServices, setBookingServices] = useState<BookingService[]>([{ name: '', duration: '', price: '' }]);
  const [bufferTime, setBufferTime] = useState('');
  const [maxBookingsPerDay, setMaxBookingsPerDay] = useState('');
  const [advanceBookingDays, setAdvanceBookingDays] = useState('');
  const [extraNotes, setExtraNotes] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<string>(searchParams.get('package') || '');
  
  // Only 5 countries supported
  const SUPPORTED_COUNTRIES = [
    { code: 'SE', name: { sv: 'Sverige', en: 'Sweden' } },
    { code: 'NO', name: { sv: 'Norge', en: 'Norway' } },
    { code: 'DK', name: { sv: 'Danmark', en: 'Denmark' } },
    { code: 'US', name: { sv: 'USA', en: 'United States' } },
    { code: 'CA', name: { sv: 'Kanada', en: 'Canada' } },
  ];
  
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // Dynamic currency based on language
  const currency = getCurrencyFromLang(lang);
  const verificationFee = getAddonPrice('verification', currency);
  const formattedVerificationFee = formatPrice(verificationFee, currency);

  // Booking services management
  const addBookingService = () => {
    setBookingServices([...bookingServices, { name: '', duration: '', price: '' }]);
  };

  const removeBookingService = (index: number) => {
    if (bookingServices.length > 1) {
      setBookingServices(bookingServices.filter((_, i) => i !== index));
    }
  };

  const updateBookingService = (index: number, field: keyof BookingService, value: string) => {
    const updated = [...bookingServices];
    updated[index][field] = value;
    setBookingServices(updated);
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, boolean> = {};
    
    switch (currentStep) {
      case 1:
        if (!businessName.trim()) newErrors.businessName = true;
        if (!contactPerson.trim()) newErrors.contactPerson = true;
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = true;
        if (!country) newErrors.country = true;
        break;
      case 2:
        if (!businessType) newErrors.businessType = true;
        if (businessType === 'other' && !businessTypeOther.trim()) newErrors.businessTypeOther = true;
        if (!websiteGoal) newErrors.websiteGoal = true;
        break;
      case 3:
        if (!selectedStyle) newErrors.selectedStyle = true;
        break;
      case 4:
        // Services info is optional
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < totalSteps) {
        setStep(step + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      toast({
        title: t('Fyll i alla obligatoriska fält', 'Please fill in all required fields'),
        variant: 'destructive'
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) {
      toast({
        title: t('Fyll i alla obligatoriska fält', 'Please fill in all required fields'),
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Track demo completion
      trackFunnelEvent('DEMO_REQUEST', { step: 'submit' });
      trackFunnelEvent('WIZARD_COMPLETE', { wizard_type: 'demo' });

      // First, save concept request to database
      const conceptData = {
        email,
        business_name: businessName,
      };

      const { error: conceptError } = await supabase
        .from('concept_requests')
        .insert(conceptData);

      if (conceptError) {
        console.error('Error saving concept request:', conceptError);
      }

      // Now, save the full order submission for design purposes
      const orderData = {
        email,
        business_name: businessName,
        contact_person: contactPerson,
        phone: phone || null,
        current_website: currentWebsite || null,
        country: country,
        business_type: businessType === 'other' ? businessTypeOther : businessType,
        website_goal: websiteGoal,
        selected_style: selectedStyle,
        selected_package: selectedPackage || null,
        primary_color: noColorPreference ? null : primaryColor,
        accent_color: noColorPreference ? null : accentColor,
        services: services || null,
        wants_booking: wantsBooking,
        opening_hours: openingHours || null,
        appointment_lengths: appointmentLengths.length > 0 ? appointmentLengths : null,
        booking_services: wantsBooking && bookingServices.some(s => s.name) ? JSON.parse(JSON.stringify(bookingServices)) : null,
        buffer_time: bufferTime || null,
        max_bookings_per_day: maxBookingsPerDay || null,
        advance_booking_days: advanceBookingDays || null,
        extra_notes: extraNotes || null,
        submission_type: 'free_demo',
        payment_status: 'pending'
      };

      const { data: orderResult, error: orderError } = await supabase
        .from('order_submissions')
        .insert(orderData as any)
        .select('id')
        .single();

      if (orderError) {
        console.error('Error saving order submission:', orderError);
        throw orderError;
      }

      // Redirect to Stripe for verification payment
      const { data, error } = await supabase.functions.invoke('create-verification-checkout', {
        body: {
          email,
          businessName,
          orderId: orderResult.id,
          currency,
          language: lang,
        }
      });

      if (error) throw error;

      if (data?.url) {
        // Clear storage on successful submission
        localStorage.removeItem(DEMO_STORAGE_KEY);
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }

    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: t('Något gick fel', 'Something went wrong'),
        description: t('Försök igen eller kontakta oss.', 'Please try again or contact us.'),
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Trigger haptic feedback on step change
  useEffect(() => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }, [step]);

  if (submitted) {
    return (
      <>
        <SEOHead 
          title={t('Tack! | Nomia', 'Thank You! | Nomia')}
          description={t('Din förfrågan har skickats.', 'Your request has been submitted.')}
        />
        <div className="min-h-screen flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-success" />
            </div>
            <h1 className="text-3xl font-light tracking-tight mb-4">
              {t('Tack för din förfrågan!', 'Thank you for your request!')}
            </h1>
            <p className="text-muted-foreground mb-8">
              {t('Vi återkommer inom 72 timmar med ditt designförslag.', 'We\'ll get back to you within 72 hours with your design concept.')}
            </p>
            <Button onClick={() => navigate('/')} variant="outline">
              {t('Tillbaka till startsidan', 'Back to homepage')}
            </Button>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead 
        title={t('Gratis Designkoncept | Nomia', 'Free Design Concept | Nomia')}
        description={t(
          'Få ett kostnadsfritt designförslag för din hemsida. Vi skapar ett unikt koncept baserat på ditt varumärke.',
          'Get a free design concept for your website. We create a unique concept based on your brand.'
        )}
      />
      
      <div className="min-h-screen py-8 sm:py-12 relative overflow-hidden">
        {/* Background Effects - Multiple Glow Bubbles */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {/* Primary large glow - top left */}
          <div className="absolute top-[-100px] left-[-50px] w-[500px] h-[500px] bg-accent/15 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s' }} />
          {/* Secondary glow - top right */}
          <div className="absolute top-[50px] right-[-100px] w-[400px] h-[400px] bg-accent/10 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
          {/* Tertiary glow - center */}
          <div className="absolute top-[30%] left-[40%] w-[300px] h-[300px] bg-accent/20 rounded-full blur-[60px]" />
          {/* Bottom left glow */}
          <div className="absolute bottom-[20%] left-[10%] w-[350px] h-[350px] bg-primary/15 rounded-full blur-[90px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
          {/* Bottom right glow */}
          <div className="absolute bottom-[-50px] right-[20%] w-[450px] h-[450px] bg-accent/12 rounded-full blur-[100px]" />
          {/* Small floating orbs */}
          <div className="absolute top-[15%] right-[30%] w-[150px] h-[150px] bg-accent/25 rounded-full blur-[40px] animate-pulse" style={{ animationDuration: '3s' }} />
          <div className="absolute top-[60%] left-[25%] w-[180px] h-[180px] bg-accent/18 rounded-full blur-[50px] animate-pulse" style={{ animationDuration: '4.5s', animationDelay: '0.5s' }} />
        </div>

        <div className="max-w-7xl mx-auto relative px-3 sm:px-6">
          {/* Logo */}
          <div className="text-center mb-6">
            <a href="/" className="inline-block font-heading font-semibold text-2xl tracking-tight hover:opacity-80 transition-opacity">
              Nomia<span className="text-accent">.</span>
            </a>
          </div>
          
          <AnimatedSection animation="fade-up" className="text-center mb-8 sm:mb-10">
            {/* Urgency Spots Badge - Prominent Button */}
            <Dialog open={showSpotsDialog} onOpenChange={setShowSpotsDialog}>
              <DialogTrigger asChild>
                <motion.button 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-accent/20 to-accent/30 text-accent text-sm font-semibold mb-6 backdrop-blur-sm border-2 border-accent/40 hover:border-accent/60 hover:from-accent/30 hover:to-accent/40 transition-all cursor-pointer shadow-lg shadow-accent/20"
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
                  </span>
                  {spotsLoading ? (
                    <span className="animate-pulse">{t('Laddar...', 'Loading...')}</span>
                  ) : remainingSpots > 0 ? (
                    <span className="font-bold">{remainingSpots} {remainingSpots === 1 ? t('plats kvar denna vecka', 'spot left this week') : t('platser kvar denna vecka', 'spots left this week')}</span>
                  ) : (
                    <span className="text-warning font-bold">{t('Fullbokat denna vecka', 'Fully booked this week')}</span>
                  )}
                </motion.button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-accent">
                    <Calendar className="w-5 h-5" />
                    {t('Veckans platser', 'Weekly Spots')}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <p className="text-muted-foreground">
                    {t(
                      'Vi tar endast emot 7 nya koncept per vecka för att säkerställa högsta kvalitet på varje design.',
                      'We only accept 7 new concepts per week to ensure the highest quality for each design.'
                    )}
                  </p>
                  <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                    <div className="text-center mb-4">
                      <span className="text-4xl font-bold text-accent">{remainingSpots}</span>
                      <span className="text-lg text-muted-foreground ml-2">{remainingSpots === 1 ? t('plats kvar', 'spot left') : t('platser kvar', 'spots left')}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      {[...Array(7)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-6 h-6 rounded-full border-2 border-background transition-colors ${
                            i < (7 - remainingSpots) ? 'bg-muted-foreground/40' : 'bg-accent'
                          }`} 
                        />
                      ))}
                    </div>
                    <p className="text-center text-xs text-muted-foreground mt-3">
                      {7 - remainingSpots}/7 {t('bokade denna vecka', 'booked this week')}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t(
                      'Platserna återställs varje måndag. Boka din plats nu för att garantera leverans.',
                      'Spots reset every Monday. Book your spot now to guarantee delivery.'
                    )}
                  </p>
                </div>
              </DialogContent>
            </Dialog>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight mb-3 sm:mb-4">
              {t('Få ditt ', 'Get your ')}
              <span className="text-accent">
                {t('gratis designkoncept', 'free design concept')}
              </span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              {t(
                'Berätta om ditt företag så skapar vi ett unikt designförslag.',
                'Tell us about your business and we\'ll create a unique design concept.'
              )}
            </p>
          </AnimatedSection>

          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
            <div className="flex items-center justify-between mb-2">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    i + 1 < step 
                      ? 'bg-accent text-accent-foreground' 
                      : i + 1 === step 
                        ? 'bg-accent/20 text-accent ring-2 ring-accent' 
                        : 'bg-secondary text-muted-foreground'
                  }`}>
                    {i + 1 < step ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  {i < totalSteps - 1 && (
                    <div className={`w-6 sm:w-12 md:w-20 h-1 mx-1 sm:mx-2 rounded transition-all ${
                      i + 1 < step ? 'bg-accent' : 'bg-secondary'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Steps */}
          <motion.div 
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-4 sm:p-6 md:p-8">
              
              {/* Step 1: Contact Info */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-xl sm:text-2xl font-light tracking-tight mb-2">
                      {t('Dina kontaktuppgifter', 'Your contact details')}
                    </h2>
                    <p className="text-muted-foreground text-sm sm:text-base">
                      {t('Så vi kan nå dig med designförslaget.', 'So we can reach you with the design concept.')}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className={errors.businessName ? 'text-destructive' : ''}>
                        {t('Företagsnamn', 'Business name')} *
                      </Label>
                      <Input
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder={t('ex. Mitt Företag AB', 'e.g. My Company Ltd')}
                        className={errors.businessName ? 'border-destructive' : ''}
                      />
                    </div>

                    <div>
                      <Label className={errors.contactPerson ? 'text-destructive' : ''}>
                        {t('Kontaktperson', 'Contact person')} *
                      </Label>
                      <Input
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
                        placeholder={t('Ditt namn', 'Your name')}
                        className={errors.contactPerson ? 'border-destructive' : ''}
                      />
                    </div>

                    <div>
                      <Label className={errors.email ? 'text-destructive' : ''}>
                        {t('E-post', 'Email')} *
                      </Label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="din@email.se"
                        className={errors.email ? 'border-destructive' : ''}
                      />
                    </div>

                    <div>
                      <Label>{t('Telefon', 'Phone')} ({t('valfritt', 'optional')})</Label>
                      <Input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+46 70 123 45 67"
                      />
                    </div>

                    <div>
                      <Label>{t('Nuvarande webbplats', 'Current website')} ({t('valfritt', 'optional')})</Label>
                      <Input
                        type="url"
                        value={currentWebsite}
                        onChange={(e) => setCurrentWebsite(e.target.value)}
                        placeholder="https://www.example.com"
                      />
                    </div>
                    
                    <div>
                      <Label className={errors.country ? 'text-destructive' : ''}>
                        {t('Land', 'Country')} *
                      </Label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className={`w-full h-12 px-3 rounded-md border bg-background text-foreground ${errors.country ? 'border-destructive' : 'border-input'}`}
                      >
                        {SUPPORTED_COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {lang === 'sv' ? c.name.sv : c.name.en}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Business Type & Goal */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-xl sm:text-2xl font-light tracking-tight mb-2">
                      {t('Om ditt företag', 'About your business')}
                    </h2>
                    <p className="text-muted-foreground text-sm sm:text-base">
                      {t('Hjälper oss förstå dina behov bättre.', 'Helps us understand your needs better.')}
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <Label className={`mb-3 block ${errors.businessType ? 'text-destructive' : ''}`}>
                        {t('Vilken typ av verksamhet har du?', 'What type of business do you have?')} *
                      </Label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {businessTypes.map((type) => {
                          const Icon = type.icon;
                          return (
                            <button
                              key={type.id}
                              type="button"
                              onClick={() => setBusinessType(type.id)}
                              className={`p-3 sm:p-4 rounded-xl border-2 transition-all text-center ${
                                businessType === type.id
                                  ? 'border-orange-500 bg-orange-500/10'
                                  : 'border-border hover:border-orange-500/50'
                              }`}
                            >
                              <Icon className={`w-6 h-6 mx-auto mb-2 ${businessType === type.id ? 'text-orange-500' : 'text-muted-foreground'}`} />
                              <span className="text-xs sm:text-sm font-medium">
                                {lang === 'sv' ? type.labelSv : type.labelEn}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      {businessType === 'other' && (
                        <div className="mt-3">
                          <Input
                            value={businessTypeOther}
                            onChange={(e) => setBusinessTypeOther(e.target.value)}
                            placeholder={t('Beskriv din verksamhet', 'Describe your business')}
                            className={errors.businessTypeOther ? 'border-destructive' : ''}
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className={`mb-3 block ${errors.websiteGoal ? 'text-destructive' : ''}`}>
                        {t('Vad är det viktigaste målet med din hemsida?', 'What is the main goal of your website?')} *
                      </Label>
                      <RadioGroup value={websiteGoal} onValueChange={setWebsiteGoal} className="space-y-2">
                        {websiteGoals.map((goal) => (
                          <div 
                            key={goal.id}
                            className={`flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer ${
                              websiteGoal === goal.id
                                ? 'border-orange-500 bg-orange-500/10'
                                : 'border-border hover:border-orange-500/50'
                            }`}
                            onClick={() => setWebsiteGoal(goal.id)}
                          >
                            <RadioGroupItem value={goal.id} id={goal.id} />
                            <Label htmlFor={goal.id} className="cursor-pointer flex-1 text-sm sm:text-base">
                              {lang === 'sv' ? goal.labelSv : goal.labelEn}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Design Style */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-xl sm:text-2xl font-light tracking-tight mb-2">
                      {t('Designpreferenser', 'Design preferences')}
                    </h2>
                    <p className="text-muted-foreground text-sm sm:text-base">
                      {t('Välj en stil som passar ditt varumärke.', 'Choose a style that fits your brand.')}
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <Label className={`mb-3 block ${errors.selectedStyle ? 'text-destructive' : ''}`}>
                        {t('Vilken stil tilltalar dig mest?', 'Which style appeals to you most?')} *
                      </Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {styleOptions.map((style) => (
                          <button
                            key={style.id}
                            type="button"
                            onClick={() => setSelectedStyle(style.id)}
                            className={`p-3 sm:p-4 rounded-xl border-2 transition-all text-center ${
                              selectedStyle === style.id
                                ? 'border-orange-500 bg-orange-500/10'
                                : 'border-border hover:border-orange-500/50'
                            }`}
                          >
                            <span className="text-sm font-medium">
                              {lang === 'sv' ? style.labelSv : style.labelEn}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Label>{t('Färgpreferenser', 'Color preferences')}</Label>
                        <div className="flex items-center gap-2">
                          <Checkbox 
                            id="noColor" 
                            checked={noColorPreference}
                            onCheckedChange={(checked) => setNoColorPreference(checked as boolean)}
                          />
                          <Label htmlFor="noColor" className="text-sm cursor-pointer">
                            {t('Ingen preferens', 'No preference')}
                          </Label>
                        </div>
                      </div>
                      
                      {!noColorPreference && (
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            {t('Klicka på en fördefinierad palett eller välj egna färger:', 'Click a preset or choose your own colors:')}
                          </p>
                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                            {colorPresets.map((preset) => (
                              <button
                                key={preset.name}
                                type="button"
                                onClick={() => {
                                  setPrimaryColor(preset.primary);
                                  setAccentColor(preset.accent);
                                }}
                                className={`aspect-square rounded-lg flex flex-col items-center justify-center p-2 transition-all border-2 ${
                                  primaryColor === preset.primary && accentColor === preset.accent
                                    ? 'border-orange-500 ring-2 ring-orange-500/50'
                                    : 'border-transparent hover:scale-105'
                                }`}
                                style={{ 
                                  background: `linear-gradient(135deg, ${preset.primary} 50%, ${preset.accent} 50%)`
                                }}
                                title={preset.name}
                              />
                            ))}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                              <Label className="text-sm">{t('Primär färg', 'Primary color')}</Label>
                              <div className="flex gap-2 mt-1">
                                <input
                                  type="color"
                                  value={primaryColor || '#0066CC'}
                                  onChange={(e) => setPrimaryColor(e.target.value)}
                                  className="w-12 h-10 rounded cursor-pointer"
                                />
                                <Input
                                  value={primaryColor}
                                  onChange={(e) => setPrimaryColor(e.target.value)}
                                  placeholder="#0066CC"
                                  className="flex-1"
                                />
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm">{t('Accentfärg', 'Accent color')}</Label>
                              <div className="flex gap-2 mt-1">
                                <input
                                  type="color"
                                  value={accentColor || '#00AAFF'}
                                  onChange={(e) => setAccentColor(e.target.value)}
                                  className="w-12 h-10 rounded cursor-pointer"
                                />
                                <Input
                                  value={accentColor}
                                  onChange={(e) => setAccentColor(e.target.value)}
                                  placeholder="#00AAFF"
                                  className="flex-1"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Services & Booking */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-xl sm:text-2xl font-light tracking-tight mb-2">
                      {t('Tjänster & Bokning', 'Services & Booking')}
                    </h2>
                    <p className="text-muted-foreground text-sm sm:text-base">
                      {t('Berätta mer om vad du erbjuder.', 'Tell us more about what you offer.')}
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <Label>{t('Vilka tjänster/produkter erbjuder du?', 'What services/products do you offer?')}</Label>
                      <Textarea
                        value={services}
                        onChange={(e) => setServices(e.target.value)}
                        placeholder={t(
                          'ex. Klippning, färgning, styling, ansiktsbehandlingar...',
                          'e.g. Haircuts, coloring, styling, facials...'
                        )}
                        className="mt-2"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label className="mb-3 block">
                        {t('Behöver du ett bokningssystem på hemsidan?', 'Do you need a booking system on your website?')}
                      </Label>
                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant={wantsBooking === true ? 'default' : 'outline'}
                          onClick={() => setWantsBooking(true)}
                          className={wantsBooking === true ? 'bg-orange-500 hover:bg-orange-600' : ''}
                        >
                          {t('Ja', 'Yes')}
                        </Button>
                        <Button
                          type="button"
                          variant={wantsBooking === false ? 'default' : 'outline'}
                          onClick={() => setWantsBooking(false)}
                          className={wantsBooking === false ? 'bg-orange-500 hover:bg-orange-600' : ''}
                        >
                          {t('Nej', 'No')}
                        </Button>
                        <Button
                          type="button"
                          variant={wantsBooking === null ? 'default' : 'outline'}
                          onClick={() => setWantsBooking(null)}
                          className={wantsBooking === null ? 'bg-orange-500 hover:bg-orange-600' : ''}
                        >
                          {t('Osäker', 'Not sure')}
                        </Button>
                      </div>
                    </div>

                    {wantsBooking === true && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-4 p-4 bg-secondary/50 rounded-xl"
                      >
                        <div>
                          <Label>{t('Öppettider', 'Opening hours')}</Label>
                          <Textarea
                            value={openingHours}
                            onChange={(e) => setOpeningHours(e.target.value)}
                            placeholder={t(
                              'ex. Mån-Fre 09:00-18:00, Lör 10:00-15:00',
                              'e.g. Mon-Fri 9am-6pm, Sat 10am-3pm'
                            )}
                            className="mt-2"
                            rows={2}
                          />
                        </div>

                        <div>
                          <Label className="mb-2 block">{t('Tjänstelängder', 'Appointment lengths')}</Label>
                          <div className="flex flex-wrap gap-2">
                            {['15 min', '30 min', '45 min', '60 min', '90 min', '120 min'].map((length) => (
                              <button
                                key={length}
                                type="button"
                                onClick={() => {
                                  if (appointmentLengths.includes(length)) {
                                    setAppointmentLengths(appointmentLengths.filter(l => l !== length));
                                  } else {
                                    setAppointmentLengths([...appointmentLengths, length]);
                                  }
                                }}
                                className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                                  appointmentLengths.includes(length)
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-secondary border border-border hover:border-orange-500/50'
                                }`}
                              >
                                {length}
                              </button>
                            ))}
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Input
                              value={customAppointmentLength}
                              onChange={(e) => setCustomAppointmentLength(e.target.value)}
                              placeholder={t('Annan längd...', 'Other length...')}
                              className="max-w-40"
                            />
                            {customAppointmentLength && (
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => {
                                  if (customAppointmentLength && !appointmentLengths.includes(customAppointmentLength)) {
                                    setAppointmentLengths([...appointmentLengths, customAppointmentLength]);
                                    setCustomAppointmentLength('');
                                  }
                                }}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label>{t('Bokningsbara tjänster', 'Bookable services')}</Label>
                            <Button type="button" size="sm" variant="outline" onClick={addBookingService}>
                              <Plus className="w-4 h-4 mr-1" />
                              {t('Lägg till', 'Add')}
                            </Button>
                          </div>
                          <div className="space-y-3">
                            {bookingServices.map((service, index) => (
                              <div key={index} className="flex gap-2 items-start">
                                <div className="flex-1 grid grid-cols-3 gap-2">
                                  <Input
                                    value={service.name}
                                    onChange={(e) => updateBookingService(index, 'name', e.target.value)}
                                    placeholder={t('Tjänstnamn', 'Service name')}
                                  />
                                  <Input
                                    value={service.duration}
                                    onChange={(e) => updateBookingService(index, 'duration', e.target.value)}
                                    placeholder={t('Längd', 'Duration')}
                                  />
                                  <Input
                                    value={service.price}
                                    onChange={(e) => updateBookingService(index, 'price', e.target.value)}
                                    placeholder={t('Pris', 'Price')}
                                  />
                                </div>
                                {bookingServices.length > 1 && (
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => removeBookingService(index)}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Label className="flex items-center gap-1 cursor-help">
                                    {t('Buffertid', 'Buffer time')}
                                    <Info className="w-3 h-3 text-muted-foreground" />
                                  </Label>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs text-sm">
                                    {t(
                                      'Tid mellan bokningar för förberedelse/rengöring',
                                      'Time between bookings for preparation/cleaning'
                                    )}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <Input
                              value={bufferTime}
                              onChange={(e) => setBufferTime(e.target.value)}
                              placeholder={t('ex. 15 min', 'e.g. 15 min')}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label>{t('Max bokningar/dag', 'Max bookings/day')}</Label>
                            <Input
                              value={maxBookingsPerDay}
                              onChange={(e) => setMaxBookingsPerDay(e.target.value)}
                              placeholder={t('ex. 8', 'e.g. 8')}
                              className="mt-1"
                            />
                          </div>
                        </div>

                        <div>
                          <Label>{t('Förbokning (dagar framåt)', 'Advance booking (days ahead)')}</Label>
                          <Input
                            value={advanceBookingDays}
                            onChange={(e) => setAdvanceBookingDays(e.target.value)}
                            placeholder={t('ex. 30 dagar', 'e.g. 30 days')}
                            className="mt-1"
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 5: Package Selection */}
              {step === 5 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-xl sm:text-2xl font-light tracking-tight mb-2">
                      {t('Vilket paket passar dig?', 'Which package suits you?')}
                    </h2>
                    <p className="text-muted-foreground text-sm sm:text-base">
                      {t('Välj vilket paket du är intresserad av (valfritt).', 'Select which package you\'re interested in (optional).')}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { id: 'starter', name: 'Starter', priceUsd: '$290', priceSek: '2 900 kr', pages: t('3 sidor', '3 pages') },
                      { id: 'standard', name: 'Standard', priceUsd: '$590', priceSek: '5 900 kr', pages: t('5 sidor', '5 pages'), popular: true },
                      { id: 'pro', name: 'Pro', priceUsd: '$1,290', priceSek: '12 900 kr', pages: t('Obegränsade sidor', 'Unlimited pages') },
                    ].map((pkg) => (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => setSelectedPackage(pkg.id)}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center justify-between ${
                          selectedPackage === pkg.id
                            ? 'border-accent bg-accent/10'
                            : 'border-border hover:border-accent/50'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{pkg.name}</span>
                            {pkg.popular && (
                              <span className="text-xs px-2 py-0.5 bg-accent/20 text-accent rounded-full">
                                {t('Populärast', 'Most popular')}
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">{pkg.pages}</span>
                        </div>
                        <span className="font-bold text-accent">
                          {currency === 'USD' ? pkg.priceUsd : pkg.priceSek}
                        </span>
                      </button>
                    ))}
                    
                    <button
                      type="button"
                      onClick={() => setSelectedPackage('')}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        selectedPackage === ''
                          ? 'border-accent bg-accent/10'
                          : 'border-border hover:border-accent/50'
                      }`}
                    >
                      <span className="font-medium">{t('Osäker / Vill diskutera', 'Not sure / Want to discuss')}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 6: Additional Info & Payment */}
              {step === 6 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-xl sm:text-2xl font-light tracking-tight mb-2">
                      {t('Nästan klart!', 'Almost done!')}
                    </h2>
                    <p className="text-muted-foreground text-sm sm:text-base">
                      {t('Något mer vi bör veta?', 'Anything else we should know?')}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>{t('Ytterligare önskemål eller information', 'Additional requests or information')}</Label>
                      <Textarea
                        value={extraNotes}
                        onChange={(e) => setExtraNotes(e.target.value)}
                        placeholder={t(
                          'Berätta gärna om specifika funktioner du vill ha, inspiration från andra sidor, eller annat som är viktigt för dig...',
                          'Tell us about specific features you want, inspiration from other sites, or anything else that\'s important to you...'
                        )}
                        className="mt-2"
                        rows={4}
                      />
                    </div>
                  </div>

                  {/* Payment Summary with Verification Fee Explanation */}
                  <div className="bg-accent/10 rounded-xl p-4 sm:p-6 border border-accent/30">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{t('Gratis designkoncept', 'Free design concept')}</h3>
                        <p className="text-sm text-muted-foreground">
                          {t('Levereras inom 72 timmar', 'Delivered within 72 hours')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>{t('Designkoncept', 'Design concept')}</span>
                        <span className="font-medium">{t('Gratis', 'Free')}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>{t('Verifieringsavgift', 'Verification fee')}</span>
                        <span>{formattedVerificationFee}</span>
                      </div>
                      <div className="border-t border-accent/30 pt-2 mt-2">
                        <div className="flex justify-between font-semibold">
                          <span>{t('Att betala nu', 'To pay now')}</span>
                          <span className="text-accent">{formattedVerificationFee}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Verification Fee Explanation */}
                  <div className="bg-secondary/50 rounded-xl p-4 border border-border space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Info className="w-4 h-4 text-accent" />
                      {t('Varför verifieringsavgift?', 'Why a verification fee?')}
                    </h4>
                    <div className="text-sm text-muted-foreground space-y-2">
                      <p>
                        {t(
                          'Verifieringsavgiften säkerställer att vi endast arbetar med seriösa förfrågningar. Det tar oss tid att skapa ett unikt designkoncept för ditt företag.',
                          'The verification fee ensures we only work with serious inquiries. It takes us time to create a unique design concept for your business.'
                        )}
                      </p>
                      <div className="pt-2 space-y-1.5">
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                          <span>{t('Avgiften avräknas helt om du beställer', 'Fee is fully deducted if you order')}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                          <span>{t('Full återbetalning om du inte gillar konceptet', 'Full refund if you don\'t like the concept')}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <RefreshCw className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>{t('Möjlighet till revidering innan du bestämmer dig', 'Option for revision before you decide')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span>
                      {t(
                        'Du får ett unikt designförslag baserat på dina preferenser inom 72 timmar.',
                        'You\'ll receive a unique design concept based on your preferences within 72 hours.'
                      )}
                    </span>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t border-border">
                {step > 1 ? (
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t('Tillbaka', 'Back')}
                  </Button>
                ) : (
                  <div />
                )}
                
                {step < totalSteps ? (
                  <Button onClick={handleNext} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    {t('Nästa', 'Next')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t('Bearbetar...', 'Processing...')}
                      </>
                    ) : (
                      <>
                        {t(`Betala ${formattedVerificationFee} & skicka`, `Pay ${formattedVerificationFee} & submit`)}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Trust Badges */}
          <div className="max-w-2xl mx-auto mt-8 text-center">
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-success" />
                <span>{t('100% anpassat design', '100% custom design')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-success" />
                <span>{t('Ingen bindning', 'No commitment')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-success" />
                <span>{t('Säker betalning', 'Secure payment')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
