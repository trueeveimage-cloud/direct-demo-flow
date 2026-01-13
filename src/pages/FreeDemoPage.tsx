import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Loader2, CreditCard, User, Palette, Globe, FileText, AlertCircle, Briefcase, Target, Calendar, Plus, Trash2, Image as ImageIcon, Check, X, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { AnimatedSection } from '@/components/AnimatedSection';
import { InfoTooltip } from '@/components/InfoTooltip';
import { setVerificationPaid } from '@/config/stripe';
import { getCurrencyFromLang, getAddonPrice, formatPrice } from '@/config/currency';

import { PhotoUpload } from '@/components/PhotoUpload';
import { useRemainingSpots, recordConceptRequest } from '@/hooks/useRemainingSpots';

type FormStep = 1 | 2;

const styles = [
  { id: 'minimal', name: 'Minimal', tooltip: { sv: 'Ren, mycket whitespace, modernt.', en: 'Clean, lots of whitespace, modern.' } },
  { id: 'luxury', name: 'Luxury', tooltip: { sv: 'Premiumkänsla, elegant typografi, hög kontrast.', en: 'Premium feel, elegant typography, high contrast.' } },
  { id: 'bold', name: 'Bold', tooltip: { sv: 'Starka rubriker, energifyllda sektioner.', en: 'Strong headlines, high energy sections.' } },
  { id: 'playful', name: 'Playful', tooltip: { sv: 'Vänligt, färgglatt, mjukare ton.', en: 'Friendly, colorful, softer tone.' } },
  { id: 'corporate', name: 'Corporate', tooltip: { sv: 'Professionellt, strukturerat, förtroendeingivande.', en: 'Professional, structured, trust-focused.' } },
];

const businessTypes = [
  { id: 'barber', label: { sv: 'Frisör / Barberare', en: 'Barber / Hair salon' } },
  { id: 'nail', label: { sv: 'Nagelsalong', en: 'Nail salon' } },
  { id: 'restaurant', label: { sv: 'Restaurang / Café', en: 'Restaurant / Café' } },
  { id: 'gym', label: { sv: 'Gym / PT', en: 'Gym / PT' } },
  { id: 'clinic', label: { sv: 'Klinik', en: 'Clinic' } },
  { id: 'car', label: { sv: 'Bilverkstad', en: 'Car workshop' } },
  { id: 'cleaning', label: { sv: 'Städtjänst', en: 'Cleaning service' } },
  { id: 'realestate', label: { sv: 'Fastigheter', en: 'Real estate' } },
  { id: 'retail', label: { sv: 'Butik', en: 'Retail store' } },
  { id: 'other', label: { sv: 'Annat', en: 'Other' } },
];

const websiteGoals = [
  { id: 'bookings', label: { sv: 'Få bokningar', en: 'Get bookings' } },
  { id: 'calls', label: { sv: 'Få samtal', en: 'Get calls' } },
  { id: 'leads', label: { sv: 'Få leads / offertförfrågningar', en: 'Get leads / quote requests' } },
  { id: 'sell', label: { sv: 'Sälja online', en: 'Sell online' } },
];

const appointmentDurations = ['15', '30', '45', '60', '90', 'custom'];

interface BookingService {
  name: string;
  duration: string;
  price: string;
}

const DEMO_STORAGE_KEY = 'nomia_demo_intake_v2';
const DEMO_SESSION_KEY = 'nomia_demo_session';

export default function FreeDemoPage() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<FormStep>(1);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showResumeBanner, setShowResumeBanner] = useState(false);
  const { remainingSpots, isLoading: spotsLoading } = useRemainingSpots();
  
  // Check for payment success from Stripe redirect
  useEffect(() => {
    const success = searchParams.get('success');
    if (success === 'true') {
      setVerificationPaid();
      setSubmitted(true);
    }
  }, [searchParams]);
  
  // Form state - Contact info
  const [businessName, setBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currentWebsite, setCurrentWebsite] = useState('');

  // Business info
  const [businessType, setBusinessType] = useState('');
  const [businessTypeOther, setBusinessTypeOther] = useState('');
  const [websiteGoal, setWebsiteGoal] = useState('');

  // Style and colors
  const [selectedStyle, setSelectedStyle] = useState('');
  const [primaryColor, setPrimaryColor] = useState('');
  const [accentColor, setAccentColor] = useState('');
  const [noColorPreference, setNoColorPreference] = useState(false);

  // Services
  const [services, setServices] = useState('');

  // Booking
  const [wantsBooking, setWantsBooking] = useState<boolean | null>(null);
  const [openingHours, setOpeningHours] = useState('');
  const [appointmentLengths, setAppointmentLengths] = useState<string[]>([]);
  const [customAppointmentLength, setCustomAppointmentLength] = useState('');
  const [bookingServices, setBookingServices] = useState<BookingService[]>([{ name: '', duration: '', price: '' }]);
  const [bufferTime, setBufferTime] = useState('');
  const [maxBookingsPerDay, setMaxBookingsPerDay] = useState('');
  const [advanceBookingDays, setAdvanceBookingDays] = useState('');

  // Extra notes
  const [extraNotes, setExtraNotes] = useState('');
  
  // Photo uploads
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // Dynamic currency based on language
  const currency = getCurrencyFromLang(lang);
  const verificationFee = getAddonPrice('verification', currency);
  const formattedVerificationFee = formatPrice(verificationFee, currency);

  // Check for saved data on mount
  useEffect(() => {
    const wasSessionActive = sessionStorage.getItem(DEMO_SESSION_KEY);
    const stored = localStorage.getItem(DEMO_STORAGE_KEY);
    
    if (stored && !wasSessionActive) {
      try {
        const parsed = JSON.parse(stored);
        if (Date.now() - parsed.lastSaved < 7 * 24 * 60 * 60 * 1000) {
          setShowResumeBanner(true);
        } else {
          localStorage.removeItem(DEMO_STORAGE_KEY);
        }
      } catch {
        localStorage.removeItem(DEMO_STORAGE_KEY);
      }
    }
    
    sessionStorage.setItem(DEMO_SESSION_KEY, 'true');
  }, []);

  // Auto-save data
  useEffect(() => {
    const timer = setTimeout(() => {
      const toSave = {
        step,
        businessName, contactPerson, email, phone, currentWebsite,
        businessType, businessTypeOther, websiteGoal,
        selectedStyle, primaryColor, accentColor, noColorPreference,
        services, wantsBooking, openingHours, appointmentLengths,
        customAppointmentLength, bookingServices, bufferTime,
        maxBookingsPerDay, advanceBookingDays, extraNotes,
        lastSaved: Date.now()
      };
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(toSave));
    }, 1000);
    return () => clearTimeout(timer);
  }, [step, businessName, contactPerson, email, phone, currentWebsite,
      businessType, businessTypeOther, websiteGoal, selectedStyle,
      primaryColor, accentColor, noColorPreference, services, wantsBooking,
      openingHours, appointmentLengths, customAppointmentLength, bookingServices,
      bufferTime, maxBookingsPerDay, advanceBookingDays, extraNotes]);

  const loadSavedData = () => {
    const stored = localStorage.getItem(DEMO_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setStep(parsed.step || 1);
      setBusinessName(parsed.businessName || '');
      setContactPerson(parsed.contactPerson || '');
      setEmail(parsed.email || '');
      setPhone(parsed.phone || '');
      setCurrentWebsite(parsed.currentWebsite || '');
      setBusinessType(parsed.businessType || '');
      setBusinessTypeOther(parsed.businessTypeOther || '');
      setWebsiteGoal(parsed.websiteGoal || '');
      setSelectedStyle(parsed.selectedStyle || '');
      setPrimaryColor(parsed.primaryColor || '');
      setAccentColor(parsed.accentColor || '');
      setNoColorPreference(parsed.noColorPreference || false);
      setServices(parsed.services || '');
      setWantsBooking(parsed.wantsBooking ?? null);
      setOpeningHours(parsed.openingHours || '');
      setAppointmentLengths(parsed.appointmentLengths || []);
      setCustomAppointmentLength(parsed.customAppointmentLength || '');
      setBookingServices(parsed.bookingServices || [{ name: '', duration: '', price: '' }]);
      setBufferTime(parsed.bufferTime || '');
      setMaxBookingsPerDay(parsed.maxBookingsPerDay || '');
      setAdvanceBookingDays(parsed.advanceBookingDays || '');
      setExtraNotes(parsed.extraNotes || '');
    }
    setShowResumeBanner(false);
  };

  const clearSavedData = () => {
    localStorage.removeItem(DEMO_STORAGE_KEY);
    setShowResumeBanner(false);
  };

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
    updated[index] = { ...updated[index], [field]: value };
    setBookingServices(updated);
  };

  const toggleAppointmentLength = (duration: string) => {
    if (appointmentLengths.includes(duration)) {
      setAppointmentLengths(appointmentLengths.filter(d => d !== duration));
    } else {
      setAppointmentLengths([...appointmentLengths, duration]);
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    
    if (!businessName.trim()) newErrors.businessName = true;
    if (!contactPerson.trim()) newErrors.contactPerson = true;
    if (!email.trim()) newErrors.email = true;
    if (!phone.trim()) newErrors.phone = true;
    if (!businessType) newErrors.businessType = true;
    if (businessType === 'other' && !businessTypeOther.trim()) newErrors.businessTypeOther = true;
    if (!websiteGoal) newErrors.websiteGoal = true;
    if (!selectedStyle) newErrors.style = true;
    if (!services.trim()) newErrors.services = true;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep1()) {
      toast({
        title: t('Fyll i alla obligatoriska fält', 'Fill in all required fields'),
        variant: 'destructive',
      });
      return;
    }
    
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePayment = async () => {
    setIsLoading(true);
    
    try {
      // Submit form data to getform for record keeping
      const formData = new FormData();
      formData.append('form_type', 'Concept Request - 500kr');
      formData.append('business_name', businessName);
      formData.append('contact_person', contactPerson);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('current_website', currentWebsite);
      formData.append('business_type', businessType === 'other' ? businessTypeOther : businessType);
      formData.append('website_goal', websiteGoal);
      formData.append('selected_style', selectedStyle);
      formData.append('primary_color', noColorPreference ? 'No preference' : primaryColor);
      formData.append('accent_color', noColorPreference ? 'No preference' : accentColor);
      formData.append('services', services);
      formData.append('wants_booking', String(wantsBooking));
      
      if (wantsBooking) {
        formData.append('opening_hours', openingHours);
        formData.append('appointment_lengths', appointmentLengths.join(', ') + (customAppointmentLength ? `, ${customAppointmentLength}` : ''));
        formData.append('booking_services', JSON.stringify(bookingServices.filter(s => s.name.trim())));
        formData.append('buffer_time', bufferTime);
        formData.append('max_bookings_per_day', maxBookingsPerDay);
        formData.append('advance_booking_days', advanceBookingDays);
      }
      
      formData.append('extra_notes', extraNotes);
      formData.append('verification_fee', formattedVerificationFee);

      await fetch('https://getform.io/f/agdvpmpb', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
      });

      // Record the concept request in Supabase for tracking
      await recordConceptRequest(email, businessName);

      // Use edge function for Stripe checkout
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      if (!SUPABASE_URL) {
        throw new Error('Payment not configured');
      }

      const response = await fetch(`${SUPABASE_URL}/functions/v1/create-verification-checkout`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({
          email,
          businessName,
          contactPerson,
          phone,
          selectedStyle,
          businessType: businessType === 'other' ? businessTypeOther : businessType,
          websiteGoal,
          services,
          wantsBooking,
          currency,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.url) {
        window.open(data.url, '_blank');
        toast({ 
          title: t('Stripe-kassan öppnad', 'Stripe checkout opened'), 
          description: t('Slutför betalningen i det nya fönstret.', 'Complete payment in the new window.') 
        });
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      toast({ 
        title: t('Något gick fel', 'Something went wrong'), 
        description: t('Försök igen eller kontakta oss.', 'Try again or contact us.'),
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Success screen
  if (submitted) {
    return (
      <div className="min-h-screen section-padding py-20">
        <div className="container-narrow text-center">
          <AnimatedSection animation="scale-in">
            <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-10 h-10 text-accent" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              {t('Tack!', 'Thank you!')}
            </h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-md mx-auto">
              {t(
                'Din betalning har mottagits. Vi börjar med ditt koncept omedelbart.',
                'Your payment has been received. We\'ll start working on your concept immediately.'
              )}
            </p>

            <Card className="max-w-sm mx-auto mb-10">
              <CardContent className="p-6">
                <p className="font-heading font-semibold text-xl mb-2">
                  {t('Verifieringsavgift betald', 'Verification fee paid')}
                </p>
                <p className="text-muted-foreground text-sm mb-4">
                  {t('Du får ditt koncept inom 72 timmar', 'You\'ll receive your concept within 72 hours')}
                </p>
                <div className="p-3 bg-accent/10 rounded-lg">
                  <p className="text-sm font-medium">
                    {formattedVerificationFee}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                {t(
                  'När du har fått konceptet, besök "Har du fått ditt koncept?" för att fortsätta.',
                  'Once you receive your concept, visit "Have you received your concept?" to continue.'
                )}
              </p>
              <Button asChild variant="outline">
                <Link to="/efter-demo">
                  {t('Har du fått ditt koncept?', 'Have you received your concept?')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen section-padding py-8 sm:py-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 -left-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative px-3 sm:px-6">
        {/* Resume Banner */}
        <AnimatePresence>
          {showResumeBanner && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto mb-4 sm:mb-6 p-3 sm:p-4 bg-accent/10 border border-accent/20 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-sm">{t('Fortsätt där du slutade?', 'Continue where you left off?')}</p>
                  <p className="text-xs text-muted-foreground">{t('Vi har sparat dina svar.', 'We\'ve saved your answers.')}</p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="ghost" size="sm" onClick={clearSavedData} className="flex-1 sm:flex-initial">
                  {t('Börja om', 'Start over')}
                </Button>
                <Button size="sm" onClick={loadSavedData} className="flex-1 sm:flex-initial">
                  {t('Fortsätt', 'Continue')}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <AnimatedSection animation="fade-up" className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 text-orange-400 text-sm font-medium mb-4 backdrop-blur-sm border border-orange-500/30">
            <Clock className="w-4 h-4" />
            {spotsLoading ? (
              <span className="animate-pulse">{t('Laddar...', 'Loading...')}</span>
            ) : remainingSpots > 0 ? (
              <span className="font-bold">{t(`Endast ${remainingSpots} platser kvar`, `Only ${remainingSpots} spots left`)}</span>
            ) : (
              <span className="font-bold text-red-400">{t('Fullbokat denna vecka', 'Fully booked this week')}</span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2">
            {t('Se hur din framtida hemsida kan se ut gratis innan du betalar', 'See how your future website can look for free before you pay')}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            {t(
              'Fyll i formuläret så skapar vi ett unikt webb-koncept för dig inom 72 timmar.',
              'Fill in the form and we\'ll create a unique website concept for you within 72 hours.'
            )}
          </p>
        </AnimatedSection>

        {/* Step Indicator */}
        <AnimatedSection animation="fade-up" delay={50} className="mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <div className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full ${step === 1 ? 'bg-accent text-accent-foreground' : 'bg-secondary text-muted-foreground'}`}>
              <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-background/20 flex items-center justify-center text-xs sm:text-sm font-bold">1</span>
              <span className="font-medium text-sm sm:text-base">{t('Information', 'Information')}</span>
            </div>
            <div className="w-4 sm:w-8 h-0.5 bg-border" />
            <div className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full ${step === 2 ? 'bg-accent text-accent-foreground' : 'bg-secondary text-muted-foreground'}`}>
              <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-background/20 flex items-center justify-center text-xs sm:text-sm font-bold">2</span>
              <span className="font-medium text-sm sm:text-base">{t('Verifiering', 'Verification')}</span>
            </div>
          </div>
        </AnimatedSection>

        <div className="max-w-2xl mx-auto">
          {/* Form */}
          <div>
            <AnimatePresence mode="wait">
              {/* Step 1: Form */}
              {step === 1 && (
                <motion.form
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmitForm}
                  className="space-y-6"
                >
              {/* Contact Info */}
              <AnimatedSection animation="fade-up" delay={100}>
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-5 h-5 text-accent" />
                      <h2 className="font-semibold text-lg">{t('Kontaktuppgifter', 'Contact information')}</h2>
                    </div>
                    
                    <div>
                      <Label className={errors.businessName ? 'text-destructive' : ''}>{t('Företagsnamn', 'Business name')} *</Label>
                      <Input 
                        value={businessName} 
                        onChange={(e) => setBusinessName(e.target.value)} 
                        placeholder={t('Ditt företagsnamn', 'Your business name')} 
                        className={`h-12 mt-1 ${errors.businessName ? 'border-destructive' : ''}`} 
                      />
                    </div>
                    <div>
                      <Label className={errors.contactPerson ? 'text-destructive' : ''}>{t('Kontaktperson', 'Contact person')} *</Label>
                      <Input 
                        value={contactPerson} 
                        onChange={(e) => setContactPerson(e.target.value)} 
                        placeholder={t('Ditt namn', 'Your name')} 
                        className={`h-12 mt-1 ${errors.contactPerson ? 'border-destructive' : ''}`} 
                      />
                    </div>
                    <div>
                      <Label className={errors.email ? 'text-destructive' : ''}>{t('E-post', 'Email')} *</Label>
                      <Input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="namn@exempel.se" 
                        className={`h-12 mt-1 ${errors.email ? 'border-destructive' : ''}`} 
                      />
                    </div>
                    <div>
                      <Label className={errors.phone ? 'text-destructive' : ''}>{t('Telefon', 'Phone')} *</Label>
                      <Input 
                        type="tel" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        placeholder="070 123 45 67" 
                        className={`h-12 mt-1 ${errors.phone ? 'border-destructive' : ''}`} 
                      />
                    </div>
                    <div>
                      <Label>{t('Nuvarande webbplats', 'Current website')}</Label>
                      <Input 
                        value={currentWebsite} 
                        onChange={(e) => setCurrentWebsite(e.target.value)} 
                        placeholder="www.dittforetag.se" 
                        className="h-12 mt-1" 
                      />
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>

              {/* Business Type */}
              <AnimatedSection animation="fade-up" delay={120}>
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="w-5 h-5 text-accent" />
                      <h2 className="font-semibold text-lg">{t('Företagstyp', 'Business type')} *</h2>
                      <InfoTooltip content={t('Hjälper oss anpassa designen för din bransch.', 'Helps us tailor the design for your industry.')} />
                    </div>
                    <Select value={businessType} onValueChange={setBusinessType}>
                      <SelectTrigger className={`h-12 ${errors.businessType ? 'border-destructive' : ''}`}>
                        <SelectValue placeholder={t('Välj företagstyp', 'Select business type')} />
                      </SelectTrigger>
                      <SelectContent>
                        {businessTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {lang === 'sv' ? type.label.sv : type.label.en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {businessType === 'other' && (
                      <Input 
                        value={businessTypeOther} 
                        onChange={(e) => setBusinessTypeOther(e.target.value)} 
                        placeholder={t('Beskriv din bransch...', 'Describe your industry...')} 
                        className={`h-12 mt-2 ${errors.businessTypeOther ? 'border-destructive' : ''}`}
                      />
                    )}
                  </CardContent>
                </Card>
              </AnimatedSection>

              {/* Website Goal */}
              <AnimatedSection animation="fade-up" delay={130}>
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-accent" />
                      <h2 className="font-semibold text-lg">{t('Vad ska din webbplats uppnå?', 'What should your website achieve?')} *</h2>
                      <InfoTooltip content={t('Vi anpassar layout och CTA baserat på ditt mål.', 'We tailor layout and CTA based on your goal.')} />
                    </div>
                    <Select value={websiteGoal} onValueChange={setWebsiteGoal}>
                      <SelectTrigger className={`h-12 ${errors.websiteGoal ? 'border-destructive' : ''}`}>
                        <SelectValue placeholder={t('Välj huvudmål', 'Select main goal')} />
                      </SelectTrigger>
                      <SelectContent>
                        {websiteGoals.map((goal) => (
                          <SelectItem key={goal.id} value={goal.id}>
                            {lang === 'sv' ? goal.label.sv : goal.label.en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              </AnimatedSection>

              {/* Services & Prices */}
              <AnimatedSection animation="fade-up" delay={140}>
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-accent" />
                      <h2 className="font-semibold text-lg">{t('Tjänster & priser', 'Services & prices')} *</h2>
                      <InfoTooltip content={t('Detta innehåll kommer att användas på din webbplats.', 'This content will be used on your website.')} />
                    </div>
                    <Textarea
                      value={services}
                      onChange={(e) => setServices(e.target.value)}
                      rows={4}
                      placeholder={t(
                        'Klippning – 350 kr\nSkägg – 200 kr\nHår + Skägg – 500 kr',
                        'Haircut – 350 kr\nBeard – 200 kr\nHair + Beard – 500 kr'
                      )}
                      className={errors.services ? 'border-destructive' : ''}
                    />
                  </CardContent>
                </Card>
              </AnimatedSection>

              {/* Style Selection */}
              <AnimatedSection animation="fade-up" delay={150}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Palette className="w-5 h-5 text-accent" />
                      <h2 className="font-semibold text-lg">{t('Stilriktning', 'Style direction')} *</h2>
                    </div>
                    <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 ${errors.style ? 'ring-2 ring-destructive rounded-lg p-2' : ''}`}>
                      {styles.map((style) => (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => setSelectedStyle(style.id)}
                          className={`p-4 text-center rounded-xl border-2 transition-all hover:scale-105 ${
                            selectedStyle === style.id
                              ? 'border-accent bg-accent/10'
                              : 'border-border hover:border-accent/50'
                          }`}
                        >
                          <span className="font-medium block">{style.name}</span>
                          <InfoTooltip content={lang === 'sv' ? style.tooltip.sv : style.tooltip.en} />
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>

              {/* Color Preferences - with visual picker */}
              <AnimatedSection animation="fade-up" delay={160}>
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Palette className="w-5 h-5 text-accent" />
                      <h2 className="font-semibold text-lg">{t('Färgpreferenser', 'Color preferences')}</h2>
                      <InfoTooltip content={t('Klicka på en färg för att se den i förhandsgranskningen!', 'Click a color to see it in the preview!')} />
                    </div>
                    
                    {/* Color Preset Buttons */}
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">{t('Snabbval', 'Quick pick')}</Label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { name: 'Guld', color: '#D4AF37' },
                          { name: 'Ocean', color: '#0077B6' },
                          { name: 'Skog', color: '#2D6A4F' },
                          { name: 'Lila', color: '#9D4EDD' },
                          { name: 'Röd', color: '#E63946' },
                          { name: 'Svart', color: '#1A1A2E' },
                        ].map((preset) => (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => {
                              setPrimaryColor(preset.color);
                              setNoColorPreference(false);
                            }}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all hover:scale-105 ${
                              primaryColor === preset.color ? 'border-accent ring-2 ring-accent/30' : 'border-border hover:border-accent/50'
                            }`}
                          >
                            <span 
                              className="w-5 h-5 rounded-full border border-border/50 shadow-sm"
                              style={{ backgroundColor: preset.color }}
                            />
                            <span className="text-xs font-medium">{preset.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label>{t('Primärfärg', 'Primary color')}</Label>
                        <div className="flex gap-2 mt-1">
                          <Input 
                            value={primaryColor} 
                            onChange={(e) => setPrimaryColor(e.target.value)} 
                            placeholder={t('t.ex. #1a2b3c', 'e.g. #1a2b3c')} 
                            className="h-12 flex-1"
                            disabled={noColorPreference}
                          />
                          <input 
                            type="color"
                            value={primaryColor || '#D4AF37'}
                            onChange={(e) => {
                              setPrimaryColor(e.target.value);
                              setNoColorPreference(false);
                            }}
                            className="h-12 w-12 rounded-lg border border-border cursor-pointer"
                            disabled={noColorPreference}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>{t('Accentfärg', 'Accent color')}</Label>
                        <div className="flex gap-2 mt-1">
                          <Input 
                            value={accentColor} 
                            onChange={(e) => setAccentColor(e.target.value)} 
                            placeholder={t('t.ex. #ffd700', 'e.g. #ffd700')} 
                            className="h-12 flex-1"
                            disabled={noColorPreference}
                          />
                          <input 
                            type="color"
                            value={accentColor || '#FFD700'}
                            onChange={(e) => {
                              setAccentColor(e.target.value);
                              setNoColorPreference(false);
                            }}
                            className="h-12 w-12 rounded-lg border border-border cursor-pointer"
                            disabled={noColorPreference}
                          />
                        </div>
                      </div>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Checkbox checked={noColorPreference} onCheckedChange={(c) => setNoColorPreference(c === true)} />
                      <span className="text-sm">{t('Ingen preferens – Nomia väljer', 'No preference – Nomia chooses')}</span>
                    </label>
                  </CardContent>
                </Card>
              </AnimatedSection>

              {/* Booking System - Redesigned with Yes/No cards */}
              <AnimatedSection animation="fade-up" delay={170}>
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-accent" />
                      <h2 className="font-semibold text-lg">{t('Vill du ha ett bokningssystem?', 'Do you want a booking system?')}</h2>
                      <InfoTooltip content={t('Vi skapar ditt helt egna bokningssystem integrerat med din webbplats.', 'We create your very own booking system integrated with your website.')} />
                    </div>
                    
                    {/* Yes/No Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setWantsBooking(true)}
                        className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3 hover:scale-[1.02] ${
                          wantsBooking === true 
                            ? 'border-accent bg-accent/10 ring-2 ring-accent/30' 
                            : 'border-border hover:border-accent/50'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          wantsBooking === true ? 'bg-accent text-accent-foreground' : 'bg-secondary'
                        }`}>
                          <Check className="w-6 h-6" />
                        </div>
                        <span className="font-semibold">{t('Ja, tack!', 'Yes, please!')}</span>
                        <span className="text-xs text-muted-foreground text-center">
                          {t('Kunder kan boka direkt online', 'Customers can book directly online')}
                        </span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setWantsBooking(false)}
                        className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3 hover:scale-[1.02] ${
                          wantsBooking === false 
                            ? 'border-accent bg-accent/10 ring-2 ring-accent/30' 
                            : 'border-border hover:border-accent/50'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          wantsBooking === false ? 'bg-accent text-accent-foreground' : 'bg-secondary'
                        }`}>
                          <X className="w-6 h-6" />
                        </div>
                        <span className="font-semibold">{t('Nej, tack', 'No, thanks')}</span>
                        <span className="text-xs text-muted-foreground text-center">
                          {t('Jag kontaktas via telefon/e-post', 'I prefer phone/email contact')}
                        </span>
                      </button>
                    </div>

                    {/* Booking Requirements */}
                    {wantsBooking === true && (
                      <div className="space-y-4 pt-4 border-t border-border mt-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Label>{t('Öppettider', 'Opening hours')}</Label>
                            <InfoTooltip content={t('När kan kunder boka? T.ex. "Mån-Fre 09-18, Lör 10-15"', 'When can customers book? E.g. "Mon-Fri 09-18, Sat 10-15"')} />
                          </div>
                          <Textarea
                            value={openingHours}
                            onChange={(e) => setOpeningHours(e.target.value)}
                            rows={2}
                            placeholder={t('Mån-Fre 09:00-18:00\nLör 10:00-15:00', 'Mon-Fri 09:00-18:00\nSat 10:00-15:00')}
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Label>{t('Tidslängder för bokningar', 'Appointment durations')}</Label>
                            <InfoTooltip content={t('Välj vilka tidslängder som ska vara tillgängliga.', 'Choose which durations should be available.')} />
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {appointmentDurations.filter(d => d !== 'custom').map((duration) => (
                              <Button
                                key={duration}
                                type="button"
                                variant={appointmentLengths.includes(duration) ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => toggleAppointmentLength(duration)}
                              >
                                {duration} min
                              </Button>
                            ))}
                          </div>
                          <Input
                            value={customAppointmentLength}
                            onChange={(e) => setCustomAppointmentLength(e.target.value)}
                            placeholder={t('Annan längd (t.ex. 120 min)', 'Other duration (e.g. 120 min)')}
                            className="h-10 mt-2"
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Label>{t('Bokningsbara tjänster', 'Bookable services')}</Label>
                            <InfoTooltip content={t('Lägg till tjänster som kunder kan boka.', 'Add services that customers can book.')} />
                          </div>
                          <div className="space-y-2">
                            {bookingServices.map((service, index) => (
                              <div key={index} className="flex gap-2 items-start">
                                <Input
                                  value={service.name}
                                  onChange={(e) => updateBookingService(index, 'name', e.target.value)}
                                  placeholder={t('Tjänstnamn', 'Service name')}
                                  className="h-10 flex-1"
                                />
                                <Input
                                  value={service.duration}
                                  onChange={(e) => updateBookingService(index, 'duration', e.target.value)}
                                  placeholder={t('Tid (min)', 'Duration')}
                                  className="h-10 w-24"
                                />
                                <Input
                                  value={service.price}
                                  onChange={(e) => updateBookingService(index, 'price', e.target.value)}
                                  placeholder={t('Pris', 'Price')}
                                  className="h-10 w-24"
                                />
                                {bookingServices.length > 1 && (
                                  <Button type="button" variant="ghost" size="icon" onClick={() => removeBookingService(index)} className="h-10 w-10">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={addBookingService}>
                              <Plus className="w-4 h-4 mr-1" /> {t('Lägg till tjänst', 'Add service')}
                            </Button>
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-4">
                          <div>
                            <Label>{t('Bufferttid', 'Buffer time')}</Label>
                            <Input
                              value={bufferTime}
                              onChange={(e) => setBufferTime(e.target.value)}
                              placeholder={t('t.ex. 15 min', 'e.g. 15 min')}
                              className="h-10 mt-1"
                            />
                          </div>
                          <div>
                            <Label>{t('Max bokningar/dag', 'Max bookings/day')}</Label>
                            <Input
                              value={maxBookingsPerDay}
                              onChange={(e) => setMaxBookingsPerDay(e.target.value)}
                              placeholder={t('t.ex. 10', 'e.g. 10')}
                              className="h-10 mt-1"
                            />
                          </div>
                          <div>
                            <Label>{t('Förbokning (dagar)', 'Advance booking (days)')}</Label>
                            <Input
                              value={advanceBookingDays}
                              onChange={(e) => setAdvanceBookingDays(e.target.value)}
                              placeholder={t('t.ex. 30', 'e.g. 30')}
                              className="h-10 mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </AnimatedSection>

              {/* Photo Upload Section */}
              <AnimatedSection animation="fade-up" delay={175}>
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ImageIcon className="w-5 h-5 text-accent" />
                      <h2 className="font-semibold text-lg">{t('Bilder', 'Photos')}</h2>
                      <InfoTooltip content={t('Ladda upp din logotyp, bilder från verksamheten, eller designinspiration.', 'Upload your logo, photos from your business, or design inspiration.')} />
                      <span className="text-sm text-muted-foreground ml-auto">{t('Valfritt', 'Optional')}</span>
                    </div>
                    <PhotoUpload 
                      photos={uploadedPhotos} 
                      onChange={setUploadedPhotos}
                      maxPhotos={5}
                    />
                  </CardContent>
                </Card>
              </AnimatedSection>

              {/* Extra Notes */}
              <AnimatedSection animation="fade-up" delay={180}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-5 h-5 text-accent" />
                      <h2 className="font-semibold text-lg">{t('Extra information', 'Extra information')}</h2>
                      <span className="text-sm text-muted-foreground ml-auto">{t('Valfritt', 'Optional')}</span>
                    </div>
                    <Textarea
                      value={extraNotes}
                      onChange={(e) => setExtraNotes(e.target.value)}
                      rows={3}
                      placeholder={t('Speciella önskemål, inspiration, etc...', 'Special requests, inspiration, etc...')}
                    />
                  </CardContent>
                </Card>
              </AnimatedSection>

              {/* Submit Button */}
              <AnimatedSection animation="fade-up" delay={200}>
                <Button type="submit" size="lg" className="w-full h-14 text-lg">
                  {t('Fortsätt till verifiering', 'Continue to verification')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </AnimatedSection>
            </motion.form>
          )}

          {/* Step 2: Verification */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 max-w-lg mx-auto"
            >
              <AnimatedSection animation="fade-up">
                <Button type="button" variant="ghost" onClick={() => setStep(1)} className="mb-2 -ml-2">
                  ← {t('Tillbaka', 'Back')}
                </Button>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={50}>
                <Card className="border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
                  <CardContent className="p-6 sm:p-8">
                    {/* Explanation first - why we verify */}
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8 text-accent" />
                      </div>
                      <h2 className="text-2xl font-bold mb-3">
                        {t('Nästan klar!', 'Almost there!')}
                      </h2>
                      <p className="text-muted-foreground max-w-md mx-auto mb-4">
                        {t(
                          'Vi lägger tid och energi på att skapa ett unikt koncept för dig. För att säkerställa att vi arbetar med seriösa företag tar vi en liten verifieringsavgift.',
                          'We invest time and energy creating a unique concept for you. To ensure we\'re working with serious businesses, we ask for a small verification fee.'
                        )}
                      </p>
                    </div>

                    {/* Fee details */}
                    <div className="bg-secondary/50 rounded-xl p-5 mb-6 text-center">
                      <p className="text-sm text-muted-foreground mb-2">{t('Verifieringsavgift', 'Verification fee')}</p>
                      <p className="text-3xl font-bold text-accent mb-2">
                        {verificationFee.toLocaleString()} kr
                      </p>
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span>{t('Dras av från slutpriset', 'Deducted from final price')}</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-1">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span>{t('100% återbetalning om du avvisar', '100% refund if you reject')}</span>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-secondary/50 rounded-xl p-6 mb-6">
                      <h3 className="font-semibold mb-4">{t('Din beställning', 'Your order')}</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t('Företag', 'Business')}</span>
                          <span className="font-medium">{businessName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t('Bransch', 'Industry')}</span>
                          <span className="font-medium capitalize">{businessType === 'other' ? businessTypeOther : businessType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t('Mål', 'Goal')}</span>
                          <span className="font-medium capitalize">{websiteGoal}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t('Stil', 'Style')}</span>
                          <span className="font-medium capitalize">{selectedStyle}</span>
                        </div>
                        {wantsBooking !== null && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{t('Bokningssystem', 'Booking system')}</span>
                            <span className="font-medium">{wantsBooking ? t('Ja', 'Yes') : t('Nej', 'No')}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t('Leverans', 'Delivery')}</span>
                          <span className="font-medium">{t('Inom 72 timmar', 'Within 72 hours')}</span>
                        </div>
                        <div className="border-t border-border pt-3 mt-3">
                          <div className="flex justify-between text-lg font-bold">
                            <span>{t('Att betala', 'To pay')}</span>
                            <span className="text-accent">{verificationFee.toLocaleString()} kr</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Info box */}
                    <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-6">
                      <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">
                        {t(
                          'Avgiften dras av från slutpriset om du väljer att gå vidare med projektet.',
                          'The fee is deducted from the final price if you choose to proceed with the project.'
                        )}
                      </p>
                    </div>

                    <Button 
                      onClick={handlePayment} 
                      size="lg" 
                      className="w-full h-14 text-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          {t('Öppnar Stripe...', 'Opening Stripe...')}
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5 mr-2" />
                          {t('Betala med Stripe', 'Pay with Stripe')}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </motion.div>
          )}
        </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
