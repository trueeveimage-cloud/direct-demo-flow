import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ArrowLeft, Check, Package, Palette, Globe, FileText, Users, Search, Scale, CreditCard, Clock, Zap, Loader2, Briefcase, Target, Calendar, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { AnimatedSection } from '@/components/AnimatedSection';
import { InfoTooltip } from '@/components/InfoTooltip';
import { PackageCompareModal } from '@/components/PackageCompareModal';
import { CarePlansCompareModal } from '@/components/CarePlansCompareModal';

type FormStep = 1 | 2 | 3 | 4 | 5;

const BOOKING_ADDON_PRICE = 2000;

const packages = [
  { id: 'starter', name: 'Starter', price: 4900, priceDisplay: '4 900 kr', pages: { sv: 'Upp till 3 sidor', en: 'Up to 3 pages' }, maxPages: 3, delivery: 14, booking: false, features: { sv: ['Responsiv design', 'Kontaktformulär', 'SEO-grundläggande', '1 revision'], en: ['Responsive design', 'Contact form', 'Basic SEO', '1 revision'] }, bestFor: { sv: 'Nya företag', en: 'New businesses' } },
  { id: 'standard', name: 'Standard', price: 7900, priceDisplay: '7 900 kr', pages: { sv: 'Upp till 5 sidor', en: 'Up to 5 pages' }, popular: true, maxPages: 5, delivery: 10, booking: false, features: { sv: ['Allt i Starter', '2 revisioner', 'Google Maps', 'Sociala medier', 'Bildgalleri', 'Flerspråkstöd'], en: ['Everything in Starter', '2 revisions', 'Google Maps', 'Social media', 'Image gallery', 'Multi-language'] }, bestFor: { sv: 'Växande företag', en: 'Growing businesses' } },
  { id: 'pro', name: 'Pro', price: 12900, priceDisplay: '12 900 kr', pages: { sv: 'Upp till 8 sidor', en: 'Up to 8 pages' }, maxPages: 8, delivery: 7, booking: true, features: { sv: ['Allt i Standard', '3 revisioner', 'Bokningsintegration', 'Nyhetsbrev', 'Google Analytics', 'Prioriterad support', 'Flerspråkstöd'], en: ['Everything in Standard', '3 revisions', 'Booking integration', 'Newsletter', 'Google Analytics', 'Priority support', 'Multi-language'] }, bestFor: { sv: 'Etablerade företag', en: 'Established businesses' } },
];

const styles = [
  { id: 'minimal', name: 'Minimal', tooltip: { sv: 'Ren, mycket whitespace, modernt.', en: 'Clean, lots of whitespace, modern.' } },
  { id: 'luxury', name: 'Luxury', tooltip: { sv: 'Premiumkänsla, elegant typografi, hög kontrast.', en: 'Premium feel, elegant typography, high contrast.' } },
  { id: 'bold', name: 'Bold', tooltip: { sv: 'Starka rubriker, energifyllda sektioner.', en: 'Strong headlines, high energy sections.' } },
  { id: 'playful', name: 'Playful', tooltip: { sv: 'Vänligt, färgglatt, mjukare ton.', en: 'Friendly, colorful, softer tone.' } },
  { id: 'corporate', name: 'Corporate', tooltip: { sv: 'Professionellt, strukturerat, förtroendeingivande.', en: 'Professional, structured, trust-focused.' } },
];

const languages = [
  { id: 'sv', label: { sv: 'Svenska', en: 'Swedish' } },
  { id: 'en', label: { sv: 'Engelska', en: 'English' } },
  { id: 'both', label: { sv: 'Båda', en: 'Both' } },
];

const carePlans = [
  { id: 'basic', name: 'Basic', monthlyPrice: 249, yearlyPrice: 199, features: { sv: ['Hosting', 'Uppdateringar', 'Säkerhetskopiering'], en: ['Hosting', 'Updates', 'Backups'] } },
  { id: 'standard', name: 'Standard', monthlyPrice: 449, yearlyPrice: 359, popular: true, features: { sv: ['Allt i Basic', 'Domän ingår', 'Företagsmail', '1h ändringar/mån'], en: ['Everything in Basic', 'Domain included', 'Business email', '1h edits/month'] } },
  { id: 'pro', name: 'Pro', monthlyPrice: 749, yearlyPrice: 599, features: { sv: ['Allt i Standard', '3h ändringar/mån', 'Prioriterad support'], en: ['Everything in Standard', '3h edits/month', 'Priority support'] } },
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

export default function DirectCheckoutPage() {
  const { t, lang } = useLanguage();
  const [step, setStep] = useState<FormStep>(1);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPackageCompare, setShowPackageCompare] = useState(false);
  const [showCarePlanCompare, setShowCarePlanCompare] = useState(false);

  // Step 1: Contact info + Business type
  const [businessName, setBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [businessTypeOther, setBusinessTypeOther] = useState('');
  const [websiteGoal, setWebsiteGoal] = useState('');

  // Step 2: Package & Style
  const [selectedPackage, setSelectedPackage] = useState('standard');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('sv');
  const [wantsBooking, setWantsBooking] = useState<boolean | null>(null);
  const [bookingPlatform, setBookingPlatform] = useState('');
  
  // Color preferences
  const [primaryColor, setPrimaryColor] = useState('');
  const [accentColor, setAccentColor] = useState('');
  const [noColorPreference, setNoColorPreference] = useState(false);

  // Step 3: Pages & Content
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [customPages, setCustomPages] = useState<string[]>(['']);
  const [services, setServices] = useState('');
  const [noLogo, setNoLogo] = useState(false);
  const [useStock, setUseStock] = useState(false);

  // Booking requirements (shown if wantsBooking === true)
  const [openingHours, setOpeningHours] = useState('');
  const [appointmentLengths, setAppointmentLengths] = useState<string[]>([]);
  const [customAppointmentLength, setCustomAppointmentLength] = useState('');
  const [bookingServices, setBookingServices] = useState<BookingService[]>([{ name: '', duration: '', price: '' }]);
  const [bufferTime, setBufferTime] = useState('');
  const [maxBookingsPerDay, setMaxBookingsPerDay] = useState('');
  const [advanceBookingDays, setAdvanceBookingDays] = useState('');

  // Step 4: Care Plan
  const [selectedCarePlan, setSelectedCarePlan] = useState<string | null>('standard');
  const [isYearlyCarePlan, setIsYearlyCarePlan] = useState(false);

  // Step 5: Details & Payment
  const [pageNotes, setPageNotes] = useState('');
  const [brandPreferences, setBrandPreferences] = useState('');
  const [competitors, setCompetitors] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [legalPages, setLegalPages] = useState<string[]>([]);
  const [termsExplanation, setTermsExplanation] = useState('');
  const [extraNotes, setExtraNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const pkg = packages.find(p => p.id === selectedPackage);
  const carePlan = carePlans.find(c => c.id === selectedCarePlan);
  const carePlanPrice = carePlan ? (isYearlyCarePlan ? carePlan.yearlyPrice : carePlan.monthlyPrice) : 0;
  
  // Calculate booking add-on cost
  const bookingAddonCost = wantsBooking && selectedPackage !== 'pro' ? BOOKING_ADDON_PRICE : 0;
  const totalPackagePrice = (pkg?.price || 0) + bookingAddonCost;

  const pageOptions = [
    { id: 'home', label: { sv: 'Startsida', en: 'Home' } },
    { id: 'about', label: { sv: 'Om oss', en: 'About' } },
    { id: 'services', label: { sv: 'Tjänster', en: 'Services' } },
    { id: 'contact', label: { sv: 'Kontakt', en: 'Contact' } },
    { id: 'gallery', label: { sv: 'Galleri', en: 'Gallery' } },
    { id: 'pricing', label: { sv: 'Priser', en: 'Pricing' } },
    { id: 'team', label: { sv: 'Team', en: 'Team' } },
    { id: 'faq', label: { sv: 'FAQ', en: 'FAQ' } },
  ];

  const getTotalPages = () => {
    return selectedPages.length + customPages.filter(p => p.trim()).length;
  };

  const getCurrentPackageLimit = () => {
    return pkg?.maxPages || 0;
  };

  const togglePage = (pageId: string) => {
    const total = getTotalPages();
    const limit = getCurrentPackageLimit();

    if (!selectedPages.includes(pageId)) {
      if (total >= limit) {
        toast({
          title: t('Sidbegränsning', 'Page limit'),
          description: t('Du behöver ett större paket för fler sidor.', 'You need a larger package for more pages.'),
          variant: 'destructive',
        });
        return;
      }
      setSelectedPages([...selectedPages, pageId]);
    } else {
      setSelectedPages(selectedPages.filter(p => p !== pageId));
    }
  };

  const addCustomPage = () => {
    const total = getTotalPages();
    const limit = getCurrentPackageLimit();
    if (total >= limit) {
      toast({
        title: t('Sidbegränsning', 'Page limit'),
        description: t('Du behöver ett större paket för fler sidor.', 'You need a larger package for more pages.'),
        variant: 'destructive',
      });
      return;
    }
    setCustomPages([...customPages, '']);
  };

  const removeCustomPage = (index: number) => {
    setCustomPages(customPages.filter((_, i) => i !== index));
  };

  const updateCustomPage = (index: number, value: string) => {
    const updated = [...customPages];
    updated[index] = value;
    setCustomPages(updated);
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    if (!selectedPackage) newErrors.package = true;
    if (!selectedStyle) newErrors.style = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    if (!services.trim()) newErrors.services = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && !validateStep1()) {
      toast({ title: t('Fyll i alla obligatoriska fält', 'Fill in all required fields'), variant: 'destructive' });
      return;
    }
    if (step === 2 && !validateStep2()) {
      toast({ title: t('Välj paket och stil', 'Select package and style'), variant: 'destructive' });
      return;
    }
    if (step === 3 && !validateStep3()) {
      toast({ title: t('Fyll i dina tjänster och priser', 'Fill in your services and prices'), variant: 'destructive' });
      return;
    }
    setStep((s) => Math.min(s + 1, 5) as FormStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setStep((s) => Math.max(s - 1, 1) as FormStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('sv-SE').replace(/\s/g, ' ') + ' kr';
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Submit form data for record keeping
      const formData = new FormData();
      formData.append('form_type', 'Direct Checkout Order');
      formData.append('business_name', businessName);
      formData.append('contact_person', contactPerson);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('business_type', businessType === 'other' ? businessTypeOther : businessType);
      formData.append('website_goal', websiteGoal);
      formData.append('selected_package', selectedPackage);
      formData.append('package_price', formatPrice(totalPackagePrice));
      formData.append('selected_style', selectedStyle);
      formData.append('primary_color', noColorPreference ? 'No preference' : primaryColor);
      formData.append('accent_color', noColorPreference ? 'No preference' : accentColor);
      formData.append('selected_language', selectedLanguage);
      formData.append('wants_booking', String(wantsBooking));
      formData.append('booking_addon_cost', wantsBooking && selectedPackage !== 'pro' ? formatPrice(BOOKING_ADDON_PRICE) : 'Included');
      formData.append('booking_platform', bookingPlatform);
      formData.append('selected_pages', selectedPages.join(', '));
      formData.append('custom_pages', customPages.filter(p => p.trim()).join(', '));
      formData.append('services', services);
      formData.append('no_logo', String(noLogo));
      formData.append('use_stock', String(useStock));
      
      // Booking requirements
      if (wantsBooking) {
        formData.append('opening_hours', openingHours);
        formData.append('appointment_lengths', appointmentLengths.join(', ') + (customAppointmentLength ? `, ${customAppointmentLength}` : ''));
        formData.append('booking_services', JSON.stringify(bookingServices.filter(s => s.name.trim())));
        formData.append('buffer_time', bufferTime);
        formData.append('max_bookings_per_day', maxBookingsPerDay);
        formData.append('advance_booking_days', advanceBookingDays);
      }
      
      formData.append('selected_care_plan', selectedCarePlan || 'none');
      formData.append('care_plan_billing', isYearlyCarePlan ? 'yearly' : 'monthly');
      formData.append('care_plan_price', isYearlyCarePlan 
        ? `${carePlanPrice * 12} kr/år` 
        : `${carePlanPrice} kr/mån`);
      formData.append('page_notes', pageNotes);
      formData.append('brand_preferences', brandPreferences);
      formData.append('competitors', competitors);
      formData.append('seo_keywords', seoKeywords);
      formData.append('legal_pages', legalPages.join(', '));
      formData.append('terms_explanation', termsExplanation);
      formData.append('extra_notes', extraNotes);

      await fetch('https://getform.io/f/agdvpmpb', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
      });

      // Use edge function for Stripe checkout
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      if (!SUPABASE_URL) {
        throw new Error('Payment not configured');
      }

      const response = await fetch(`${SUPABASE_URL}/functions/v1/create-package-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: selectedPackage,
          email,
          businessName,
          contactPerson,
          phone,
          selectedStyle,
          selectedLanguage,
          carePlanId: selectedCarePlan,
          isYearly: isYearlyCarePlan,
          wantsBooking,
          bookingAddonCost,
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
        setSubmitted(true);
      }
    } catch (error) {
      toast({ 
        title: t('Något gick fel', 'Something went wrong'), 
        description: t('Försök igen senare.', 'Please try again later.'), 
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stepInfo = [
    { num: 1, label: t('Kontakt', 'Contact'), icon: Users },
    { num: 2, label: t('Paket', 'Package'), icon: Package },
    { num: 3, label: t('Sidor', 'Pages'), icon: FileText },
    { num: 4, label: t('Vårdplan', 'Care plan'), icon: Clock },
    { num: 5, label: t('Betalning', 'Payment'), icon: CreditCard },
  ];

  if (submitted) {
    return (
      <div className="min-h-screen section-padding py-20">
        <div className="container-narrow text-center">
          <AnimatedSection animation="scale-in">
            <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-10 h-10 text-accent" />
            </div>
            <h1 className="text-4xl font-bold mb-4">{t('Tack för din beställning!', 'Thank you for your order!')}</h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-md mx-auto">
              {t('Vi har mottagit din beställning och börjar arbeta direkt.', 'We have received your order and will start working immediately.')}
            </p>
            <div className="p-6 bg-accent/10 rounded-xl inline-block mb-8">
              <p className="text-xl font-bold">{pkg?.name} — {formatPrice(totalPackagePrice)}</p>
              <p className="text-muted-foreground">{t('Leverans inom', 'Delivery within')} {pkg?.delivery} {t('dagar', 'days')}</p>
              {carePlan && (
                <p className="text-sm text-accent mt-2">
                  + {carePlan.name} {t('vårdplan', 'care plan')}: {isYearlyCarePlan 
                    ? `${carePlanPrice * 12} kr/${t('år', 'year')}`
                    : `${carePlanPrice} kr/${t('mån', 'month')}`}
                </p>
              )}
            </div>
            <Button asChild><Link to="/">{t('Tillbaka till start', 'Back to home')}</Link></Button>
          </AnimatedSection>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen section-padding py-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 -left-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <PackageCompareModal open={showPackageCompare} onOpenChange={setShowPackageCompare} />
      <CarePlansCompareModal open={showCarePlanCompare} onOpenChange={setShowCarePlanCompare} isYearly={isYearlyCarePlan} />

      <div className="container-wide relative">
        {/* Header */}
        <AnimatedSection animation="fade-up" className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            {t('Beställ direkt', 'Order directly')}
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            {t('Beställ din webbplats', 'Order your website')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {t('Fyll i formuläret så börjar vi bygga din webbplats direkt.', 'Fill out the form and we\'ll start building your website right away.')}
          </p>
        </AnimatedSection>

        {/* Step Indicator */}
        <AnimatedSection animation="fade-up" delay={50} className="mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-1 sm:gap-0">
            {stepInfo.map((s, index) => (
              <div key={s.num} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 sm:w-auto sm:h-auto sm:px-4 sm:py-2 rounded-full sm:rounded-lg transition-colors ${step === s.num ? 'bg-accent text-accent-foreground' : step > s.num ? 'bg-accent/20 text-accent' : 'bg-secondary text-muted-foreground'}`}>
                  <span className="w-6 h-6 rounded-full sm:bg-background/20 flex items-center justify-center text-xs sm:text-sm font-bold">
                    {step > s.num ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : s.num}
                  </span>
                  <span className="text-sm font-medium hidden sm:inline sm:ml-2">{s.label}</span>
                </div>
                {index < stepInfo.length - 1 && <div className="w-2 sm:w-8 h-0.5 bg-border mx-0.5 sm:mx-0" />}
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Step 1: Contact Info + Business Type + Goal */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-lg mx-auto"
            >
              <div className="p-6 bg-secondary/50 rounded-xl space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-accent" />
                  <h2 className="font-semibold text-lg">{t('Kontaktuppgifter', 'Contact information')}</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className={errors.businessName ? 'text-destructive' : ''}>{t('Företagsnamn', 'Business name')} *</Label>
                    <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder={t('Ditt företagsnamn', 'Your business name')} className={`h-12 mt-1 ${errors.businessName ? 'border-destructive' : ''}`} />
                  </div>
                  <div>
                    <Label className={errors.contactPerson ? 'text-destructive' : ''}>{t('Kontaktperson', 'Contact person')} *</Label>
                    <Input value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} placeholder={t('Ditt namn', 'Your name')} className={`h-12 mt-1 ${errors.contactPerson ? 'border-destructive' : ''}`} />
                  </div>
                  <div>
                    <Label className={errors.email ? 'text-destructive' : ''}>{t('E-post', 'Email')} *</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="namn@exempel.se" className={`h-12 mt-1 ${errors.email ? 'border-destructive' : ''}`} />
                  </div>
                  <div>
                    <Label className={errors.phone ? 'text-destructive' : ''}>{t('Telefon', 'Phone')} *</Label>
                    <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="070 123 45 67" className={`h-12 mt-1 ${errors.phone ? 'border-destructive' : ''}`} />
                  </div>
                </div>
              </div>

              {/* Business Type */}
              <div className="p-6 bg-secondary/50 rounded-xl space-y-4 mt-6">
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
              </div>

              {/* Website Goal */}
              <div className="p-6 bg-secondary/50 rounded-xl space-y-4 mt-6">
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
              </div>

              <div className="flex justify-end mt-6">
                <Button size="lg" onClick={handleNextStep}>{t('Fortsätt', 'Continue')} <ArrowRight className="w-4 h-4" /></Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Package & Style */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Package Selection */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-lg flex items-center gap-2">
                    <Package className="w-5 h-5 text-accent" />
                    {t('Välj paket', 'Choose package')} *
                  </h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowPackageCompare(true)}>
                    {t('Jämför paket', 'Compare packages')}
                  </Button>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {packages.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedPackage(p.id);
                        // Reset booking if switching away from pro
                        if (p.id !== 'pro' && wantsBooking === true) {
                          // Keep booking selection but show add-on pricing
                        }
                      }}
                      className={`p-6 rounded-xl border-2 text-left transition-all relative ${selectedPackage === p.id ? 'border-accent bg-accent/5 shadow-lg' : errors.package ? 'border-destructive' : 'border-border hover:border-accent/50'}`}
                    >
                      {p.popular && <span className="absolute -top-3 left-4 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded">{t('Populärast', 'Popular')}</span>}
                      <h3 className="font-semibold text-xl mb-1">{p.name}</h3>
                      <p className="text-2xl font-bold text-accent mb-1">{p.priceDisplay}</p>
                      <p className="text-sm text-muted-foreground mb-2">{lang === 'sv' ? p.pages.sv : p.pages.en}</p>
                      <p className="text-xs text-muted-foreground">{t('Leverans', 'Delivery')}: {p.delivery} {t('dagar', 'days')}</p>
                      <ul className="mt-4 space-y-1">
                        {(lang === 'sv' ? p.features.sv : p.features.en).slice(0, 4).map((f, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm"><Check className="w-3 h-3 text-accent" />{f}</li>
                        ))}
                      </ul>
                    </button>
                  ))}
                </div>
              </div>

              {/* Style Selection with tooltips */}
              <div className="mb-8">
                <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
                  <Palette className="w-5 h-5 text-accent" />
                  {t('Välj stil', 'Choose style')} *
                </h2>
                <div className="flex flex-wrap gap-3">
                  {styles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`px-6 py-3 rounded-lg border-2 transition-all flex items-center gap-2 ${selectedStyle === style.id ? 'border-accent bg-accent/10' : errors.style ? 'border-destructive' : 'border-border hover:border-accent/50'}`}
                    >
                      {style.name}
                      <InfoTooltip content={lang === 'sv' ? style.tooltip.sv : style.tooltip.en} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Preferences */}
              <div className="mb-8 p-6 bg-secondary/50 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="font-semibold text-lg">{t('Färgpreferenser', 'Color preferences')}</h2>
                  <InfoTooltip content={t('Färger används för knappar, highlights och varumärkeskänsla.', 'Colors are used for buttons, highlights, and brand feel.')} />
                </div>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>{t('Primärfärg', 'Primary color')}</Label>
                      <Input 
                        value={primaryColor} 
                        onChange={(e) => setPrimaryColor(e.target.value)} 
                        placeholder={t('t.ex. Mörkblå, #1a2b3c', 'e.g. Dark blue, #1a2b3c')} 
                        className="h-12 mt-1"
                        disabled={noColorPreference}
                      />
                    </div>
                    <div>
                      <Label>{t('Accentfärg', 'Accent color')}</Label>
                      <Input 
                        value={accentColor} 
                        onChange={(e) => setAccentColor(e.target.value)} 
                        placeholder={t('t.ex. Guld, #ffd700', 'e.g. Gold, #ffd700')} 
                        className="h-12 mt-1"
                        disabled={noColorPreference}
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox checked={noColorPreference} onCheckedChange={(c) => setNoColorPreference(c === true)} />
                    <span className="text-sm">{t('Ingen preferens – Nomia väljer', 'No preference – Nomia chooses')}</span>
                  </label>
                </div>
              </div>

              {/* Language Selection */}
              <div className="mb-8">
                <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
                  <Globe className="w-5 h-5 text-accent" />
                  {t('Webbplatsens språk', 'Website language')}
                </h2>
                <div className="flex flex-wrap gap-3">
                  {languages.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setSelectedLanguage(l.id)}
                      className={`px-6 py-3 rounded-lg border-2 transition-all ${selectedLanguage === l.id ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/50'}`}
                    >
                      {lang === 'sv' ? l.label.sv : l.label.en}
                    </button>
                  ))}
                </div>
                {selectedLanguage === 'both' && selectedPackage === 'starter' && (
                  <p className="text-sm text-destructive mt-2">{t('Flerspråk kräver Standard eller Pro.', 'Multi-language requires Standard or Pro.')}</p>
                )}
              </div>

              {/* Booking */}
              <div className="mb-8 p-6 bg-secondary/50 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-accent" />
                  <h2 className="font-semibold text-lg">{t('Vill du ha ett bokningssystem?', 'Do you want a booking system?')}</h2>
                  <InfoTooltip content={t('Vi skapar ditt helt egna bokningssystem integrerat med din webbplats.', 'We create your very own booking system integrated with your website.')} />
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {t('Bokningssystem tillägg:', 'Booking system add-on:')} <span className="font-semibold">{formatPrice(BOOKING_ADDON_PRICE)}</span> 
                  {selectedPackage === 'pro' && <span className="text-accent ml-1">({t('ingår i Pro', 'included with Pro')})</span>}
                </p>
                <div className="flex gap-4 mb-4">
                  <button 
                    onClick={() => setWantsBooking(true)} 
                    className={`px-6 py-3 rounded-lg border-2 transition-all ${wantsBooking === true ? 'border-accent bg-accent/10' : 'border-border'}`}
                  >
                    {t('Ja', 'Yes')}
                    {selectedPackage !== 'pro' && <span className="ml-2 text-xs text-muted-foreground">(+{formatPrice(BOOKING_ADDON_PRICE)})</span>}
                    {selectedPackage === 'pro' && <span className="ml-2 text-xs text-accent">({t('ingår', 'included')})</span>}
                  </button>
                  <button onClick={() => setWantsBooking(false)} className={`px-6 py-3 rounded-lg border-2 transition-all ${wantsBooking === false ? 'border-accent bg-accent/10' : 'border-border'}`}>{t('Nej', 'No')}</button>
                </div>
                {wantsBooking && (
                  <Input value={bookingPlatform} onChange={(e) => setBookingPlatform(e.target.value)} placeholder={t('Vilken bokningsplattform? (t.ex. Bokadirekt, Timely)', 'Which booking platform? (e.g. Calendly, Acuity)')} className="h-12" />
                )}
                {wantsBooking && selectedPackage !== 'pro' && (
                  <div className="p-3 bg-accent/10 rounded-lg border border-accent/30 mt-3">
                    <p className="text-sm text-accent font-medium">
                      {t('Bokningssystem läggs till för', 'Booking system added for')} {formatPrice(BOOKING_ADDON_PRICE)}. 
                      <button 
                        onClick={() => setSelectedPackage('pro')} 
                        className="underline ml-1 hover:no-underline"
                      >
                        {t('Uppgradera till Pro för att inkludera det', 'Upgrade to Pro to include it')}
                      </button>
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={handlePrevStep}><ArrowLeft className="w-4 h-4" /> {t('Tillbaka', 'Back')}</Button>
                <Button size="lg" onClick={handleNextStep}>{t('Fortsätt', 'Continue')} <ArrowRight className="w-4 h-4" /></Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Pages & Content */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="p-6 bg-secondary/50 rounded-xl mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-accent" />
                    {t('Välj sidor', 'Choose pages')}
                  </h2>
                  <span className="text-sm text-muted-foreground">{getTotalPages()}/{getCurrentPackageLimit()} {t('sidor', 'pages')}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {pageOptions.map((page) => (
                    <button
                      key={page.id}
                      onClick={() => togglePage(page.id)}
                      className={`p-3 rounded-lg border-2 text-sm transition-all ${selectedPages.includes(page.id) ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/50'}`}
                    >
                      {lang === 'sv' ? page.label.sv : page.label.en}
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label>{t('Egna sidor', 'Custom pages')}</Label>
                  {customPages.map((page, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={page}
                        onChange={(e) => updateCustomPage(index, e.target.value)}
                        placeholder={t('Sidnamn...', 'Page name...')}
                        className="h-10"
                      />
                      {customPages.length > 1 && (
                        <Button variant="ghost" size="sm" onClick={() => removeCustomPage(index)}>✕</Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addCustomPage}>{t('+ Lägg till sida', '+ Add page')}</Button>
                </div>
              </div>

              {/* Services & Prices - REQUIRED */}
              <div className="p-6 bg-secondary/50 rounded-xl mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Label className={errors.services ? 'text-destructive' : ''}>{t('Tjänster & priser', 'Services & prices')} *</Label>
                  <InfoTooltip content={t('Detta innehåll kommer användas på din webbplats. Lista dina tjänster med priser.', 'This content will be used on your website. List your services with prices.')} />
                </div>
                <Textarea 
                  value={services} 
                  onChange={(e) => setServices(e.target.value)} 
                  placeholder={`${t('Exempel:', 'Example:')}
Klippning – 350 kr
Skägg – 200 kr
Klippning + Skägg – 500 kr`}
                  rows={5} 
                  className={`mt-2 ${errors.services ? 'border-destructive' : ''}`}
                />
              </div>

              <div className="p-6 bg-secondary/50 rounded-xl mb-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{t('Bilder & Logotyp', 'Images & Logo')}</h3>
                  <InfoTooltip content={t('Ladda upp dina bilder och logotyp direkt nedan, eller kryssa i om du saknar material.', 'Upload your images and logo directly below, or check if you don\'t have materials.')} />
                </div>
                
                <div className="space-y-3">
                  <Label>{t('Ladda upp logotyp', 'Upload logo')}</Label>
                  <Input 
                    type="file" 
                    accept="image/*" 
                    className="h-12"
                    disabled={noLogo}
                  />
                </div>
                
                <div className="space-y-3">
                  <Label>{t('Ladda upp bilder', 'Upload images')}</Label>
                  <Input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    className="h-12"
                    disabled={useStock}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('Du kan välja flera bilder samtidigt.', 'You can select multiple images at once.')}
                  </p>
                </div>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox checked={noLogo} onCheckedChange={(c) => setNoLogo(c === true)} />
                  <span className="text-sm">{t('Jag har ingen logotyp (ni kan skapa en enkel)', 'I don\'t have a logo (you can create a simple one)')}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox checked={useStock} onCheckedChange={(c) => setUseStock(c === true)} />
                  <span className="text-sm">{t('Använd stockbilder (jag har inga egna bilder)', 'Use stock images (I don\'t have my own images)')}</span>
                </label>
              </div>

              {/* Booking Requirements - Progressive disclosure */}
              {wantsBooking && (
                <div className="p-6 bg-accent/5 border border-accent/20 rounded-xl mb-6 space-y-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-accent" />
                    <h3 className="font-semibold text-lg">{t('Bokningskrav', 'Booking requirements')}</h3>
                    <InfoTooltip content={t('Information som behövs för att konfigurera ditt bokningssystem.', 'Information needed to configure your booking system.')} />
                  </div>

                  <div>
                    <Label>{t('Öppettider', 'Opening hours')} *</Label>
                    <Textarea 
                      value={openingHours} 
                      onChange={(e) => setOpeningHours(e.target.value)} 
                      placeholder={`${t('Exempel:', 'Example:')}
Mån-Fre: 09:00-18:00
Lör: 10:00-15:00
Sön: Stängt`}
                      rows={4} 
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Label>{t('Tidsalternativ för bokningar', 'Appointment length options')}</Label>
                      <InfoTooltip content={t('Välj vilka tidslängder kunder kan boka.', 'Choose which time lengths customers can book.')} />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {appointmentDurations.filter(d => d !== 'custom').map((duration) => (
                        <button
                          key={duration}
                          onClick={() => toggleAppointmentLength(duration)}
                          className={`px-4 py-2 rounded-lg border-2 text-sm transition-all ${appointmentLengths.includes(duration) ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/50'}`}
                        >
                          {duration} min
                        </button>
                      ))}
                    </div>
                    <Input 
                      value={customAppointmentLength} 
                      onChange={(e) => setCustomAppointmentLength(e.target.value)} 
                      placeholder={t('Annan längd (t.ex. 120 min)', 'Other length (e.g. 120 min)')} 
                      className="h-10 mt-2"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Label>{t('Tjänster att boka', 'Services to book')}</Label>
                      <InfoTooltip content={t('Lista tjänster som kan bokas med längd och pris.', 'List services that can be booked with duration and price.')} />
                    </div>
                    <div className="space-y-2">
                      {bookingServices.map((service, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <Input 
                            value={service.name} 
                            onChange={(e) => updateBookingService(index, 'name', e.target.value)} 
                            placeholder={t('Tjänstnamn', 'Service name')} 
                            className="h-10 flex-1"
                          />
                          <Input 
                            value={service.duration} 
                            onChange={(e) => updateBookingService(index, 'duration', e.target.value)} 
                            placeholder={t('Längd', 'Duration')} 
                            className="h-10 w-24"
                          />
                          <Input 
                            value={service.price} 
                            onChange={(e) => updateBookingService(index, 'price', e.target.value)} 
                            placeholder={t('Pris', 'Price')} 
                            className="h-10 w-24"
                          />
                          {bookingServices.length > 1 && (
                            <Button variant="ghost" size="icon" onClick={() => removeBookingService(index)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={addBookingService}>
                        <Plus className="w-4 h-4 mr-1" /> {t('Lägg till tjänst', 'Add service')}
                      </Button>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <Label className="text-sm">{t('Bufferttid', 'Buffer time')}</Label>
                        <InfoTooltip content={t('Tid mellan bokningar.', 'Time between appointments.')} />
                      </div>
                      <Input 
                        value={bufferTime} 
                        onChange={(e) => setBufferTime(e.target.value)} 
                        placeholder={t('t.ex. 15 min', 'e.g. 15 min')} 
                        className="h-10"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <Label className="text-sm">{t('Max/dag', 'Max/day')}</Label>
                        <InfoTooltip content={t('Max antal bokningar per dag.', 'Max bookings per day.')} />
                      </div>
                      <Input 
                        value={maxBookingsPerDay} 
                        onChange={(e) => setMaxBookingsPerDay(e.target.value)} 
                        placeholder={t('t.ex. 10', 'e.g. 10')} 
                        className="h-10"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <Label className="text-sm">{t('Förbokning', 'Advance booking')}</Label>
                        <InfoTooltip content={t('Hur långt i förväg kan man boka?', 'How far in advance can one book?')} />
                      </div>
                      <Input 
                        value={advanceBookingDays} 
                        onChange={(e) => setAdvanceBookingDays(e.target.value)} 
                        placeholder={t('t.ex. 30 dagar', 'e.g. 30 days')} 
                        className="h-10"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={handlePrevStep}><ArrowLeft className="w-4 h-4" /> {t('Tillbaka', 'Back')}</Button>
                <Button size="lg" onClick={handleNextStep}>{t('Fortsätt', 'Continue')} <ArrowRight className="w-4 h-4" /></Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Care Plan */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">{t('Lägg till månatlig webbvård?', 'Add monthly care?')}</h2>
                <p className="text-muted-foreground">{t('Håll din webbplats uppdaterad och säker.', 'Keep your website updated and secure.')}</p>
                <Button variant="ghost" size="sm" onClick={() => setShowCarePlanCompare(true)} className="mt-2">
                  {t('Jämför vårdplaner', 'Compare care plans')}
                </Button>
              </div>

              {/* Yearly Toggle */}
              <div className="flex items-center justify-center gap-3 mb-8">
                <span className={`text-sm ${!isYearlyCarePlan ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {t('Månadsvis', 'Monthly')}
                </span>
                <Switch checked={isYearlyCarePlan} onCheckedChange={setIsYearlyCarePlan} className="data-[state=checked]:bg-accent" />
                <span className={`text-sm ${isYearlyCarePlan ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {t('Årsvis', 'Yearly')}
                  <span className="ml-1 text-xs text-accent font-semibold">{t('Spara 20%', 'Save 20%')}</span>
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-6">
                {carePlans.map((c) => {
                  const price = isYearlyCarePlan ? c.yearlyPrice : c.monthlyPrice;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCarePlan(selectedCarePlan === c.id ? null : c.id)}
                      className={`p-6 rounded-xl border-2 text-left transition-all relative ${selectedCarePlan === c.id ? 'border-accent bg-accent/5 shadow-lg' : 'border-border hover:border-accent/50'}`}
                    >
                      {c.popular && <span className="absolute -top-3 left-4 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded">{t('Rekommenderas', 'Recommended')}</span>}
                      <h3 className="font-semibold text-xl mb-1">{c.name}</h3>
                      <div className="mb-4">
                        <span className="text-xl font-bold text-accent">{price} kr/{isYearlyCarePlan ? t('mån', 'mo') : t('mån', 'mo')}</span>
                        {isYearlyCarePlan && (
                          <span className="ml-2 text-xs text-muted-foreground line-through">{c.monthlyPrice} kr/mån</span>
                        )}
                      </div>
                      <ul className="space-y-2">
                        {(lang === 'sv' ? c.features.sv : c.features.en).map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm"><Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />{f}</li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>


              <div className="flex justify-between mt-6 max-w-4xl mx-auto">
                <Button variant="outline" onClick={handlePrevStep}><ArrowLeft className="w-4 h-4" /> {t('Tillbaka', 'Back')}</Button>
                <Button size="lg" onClick={handleNextStep}>{t('Fortsätt', 'Continue')} <ArrowRight className="w-4 h-4" /></Button>
              </div>
            </motion.div>
          )}

          {/* Step 5: Details & Payment */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="space-y-6">
                <div className="p-6 bg-secondary/50 rounded-xl space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-accent" />
                    <h3 className="font-semibold">{t('Projektdetaljer (valfritt)', 'Project details (optional)')}</h3>
                  </div>
                  <div>
                    <Label>{t('Sidstruktur & anteckningar', 'Page structure & notes')}</Label>
                    <Textarea value={pageNotes} onChange={(e) => setPageNotes(e.target.value)} placeholder={t('Beskriv varje sida...', 'Describe each page...')} rows={3} className="mt-1" />
                  </div>
                  <div>
                    <Label>{t('Varumärke & preferenser', 'Brand & preferences')}</Label>
                    <Textarea value={brandPreferences} onChange={(e) => setBrandPreferences(e.target.value)} placeholder={t('Färger, typsnitt, ton...', 'Colors, fonts, tone...')} rows={2} className="mt-1" />
                  </div>
                  <div>
                    <Label>{t('Webbplatser du gillar (konkurrenter)', 'Websites you like (competitors)')}</Label>
                    <Input value={competitors} onChange={(e) => setCompetitors(e.target.value)} placeholder="https://..." className="h-12 mt-1" />
                  </div>
                  <div>
                    <Label>{t('SEO-sökord', 'SEO keywords')}</Label>
                    <Input value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} placeholder={t('Sökord, lokalområde...', 'Keywords, local area...')} className="h-12 mt-1" />
                  </div>
                </div>

                <div className="p-6 bg-secondary/50 rounded-xl space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Scale className="w-5 h-5 text-accent" />
                    <h3 className="font-semibold">{t('Juridiska sidor', 'Legal pages')}</h3>
                    <InfoTooltip content={t('Juridiska sidor som integritetspolicy och villkor är viktiga för att skydda ditt företag och uppfylla lagar som GDPR.', 'Legal pages like privacy policy and terms are important to protect your business and comply with laws like GDPR.')} />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-accent/5">
                      <Checkbox 
                        checked={legalPages.includes('GDPR')} 
                        onCheckedChange={(checked) => { 
                          if (checked) setLegalPages([...legalPages, 'GDPR']); 
                          else setLegalPages(legalPages.filter(p => p !== 'GDPR')); 
                        }} 
                      />
                      <span className="text-sm">GDPR</span>
                    </label>
                    
                    {/* Cookies - auto-selected and locked for Pro */}
                    <div className="relative">
                      <label 
                        className={`flex items-center gap-2 p-3 border rounded-lg ${selectedPackage === 'pro' ? 'bg-accent/10 border-accent/30 cursor-not-allowed' : 'cursor-pointer hover:bg-accent/5'}`}
                        title={selectedPackage === 'pro' ? t('Krävs för Pro-paketet pga Google Analytics', 'Required for Pro package due to Google Analytics') : ''}
                      >
                        <Checkbox 
                          checked={legalPages.includes('Cookies') || selectedPackage === 'pro'} 
                          disabled={selectedPackage === 'pro'}
                          onCheckedChange={(checked) => { 
                            if (selectedPackage !== 'pro') {
                              if (checked) setLegalPages([...legalPages, 'Cookies']); 
                              else setLegalPages(legalPages.filter(p => p !== 'Cookies')); 
                            }
                          }} 
                        />
                        <span className="text-sm">Cookies</span>
                        {selectedPackage === 'pro' && (
                          <InfoTooltip content={t('Cookies-sida krävs för Pro-paketet eftersom Google Analytics använder cookies för spårning.', 'Cookies page is required for Pro package because Google Analytics uses cookies for tracking.')} />
                        )}
                      </label>
                    </div>
                    
                    <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-accent/5">
                      <Checkbox 
                        checked={legalPages.includes(t('Villkor', 'Terms'))} 
                        onCheckedChange={(checked) => { 
                          if (checked) setLegalPages([...legalPages, t('Villkor', 'Terms')]); 
                          else {
                            setLegalPages(legalPages.filter(p => p !== t('Villkor', 'Terms'))); 
                            setTermsExplanation('');
                          }
                        }} 
                      />
                      <span className="text-sm">{t('Villkor', 'Terms')}</span>
                    </label>
                  </div>
                  
                  {legalPages.includes(t('Villkor', 'Terms')) && (
                    <div className="mt-4">
                      <Label className="flex items-center gap-2">
                        {t('Beskriv dina villkor', 'Describe your terms')} *
                        <InfoTooltip content={t('Förklara vilka villkor som gäller för dina tjänster, t.ex. avbokningsregler, betalningsvillkor, garantier.', 'Explain what terms apply to your services, e.g. cancellation rules, payment terms, guarantees.')} />
                      </Label>
                      <Textarea 
                        value={termsExplanation} 
                        onChange={(e) => setTermsExplanation(e.target.value)} 
                        placeholder={t('T.ex. avbokningsregler, betalningsvillkor, garantier...', 'E.g. cancellation rules, payment terms, guarantees...')} 
                        rows={3} 
                        className="mt-1" 
                      />
                    </div>
                  )}
                </div>

                <div className="p-6 bg-secondary/50 rounded-xl">
                  <Label>{t('Extra önskemål', 'Extra notes')}</Label>
                  <Textarea value={extraNotes} onChange={(e) => setExtraNotes(e.target.value)} placeholder={t('Speciella önskemål...', 'Special requests...')} rows={3} className="mt-1" />
                </div>

                {/* Order Summary */}
                <div className="p-6 bg-accent/10 rounded-xl border border-accent/30">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-accent" />
                    {t('Ordersammanfattning', 'Order summary')}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{pkg?.name} {t('webbpaket', 'web package')}</span>
                      <span>{pkg?.priceDisplay}</span>
                    </div>
                    {wantsBooking && selectedPackage !== 'pro' && (
                      <div className="flex justify-between">
                        <span>{t('Bokningssystem tillägg', 'Booking system add-on')}</span>
                        <span>{formatPrice(BOOKING_ADDON_PRICE)}</span>
                      </div>
                    )}
                    {wantsBooking && selectedPackage === 'pro' && (
                      <div className="flex justify-between text-accent">
                        <span>{t('Bokningssystem', 'Booking system')}</span>
                        <span>{t('Ingår', 'Included')}</span>
                      </div>
                    )}
                    {websiteGoal && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>{t('Huvudmål', 'Main goal')}</span>
                        <span>{websiteGoals.find(g => g.id === websiteGoal)?.[lang === 'sv' ? 'label' : 'label'][lang] || websiteGoal}</span>
                      </div>
                    )}
                    {carePlan && (
                      <div className="flex justify-between">
                        <span>{carePlan.name} {t('vårdplan', 'care plan')}</span>
                        <span>
                          {isYearlyCarePlan 
                            ? `${carePlanPrice * 12} kr/${t('år', 'year')}` 
                            : `${carePlanPrice} kr/${t('mån', 'month')}`}
                        </span>
                      </div>
                    )}
                    {carePlan && (
                      <p className="text-xs text-muted-foreground italic">
                        {isYearlyCarePlan 
                          ? t('Faktureras årligen (spara 20%).', 'Billed yearly (save 20%).') 
                          : t('Faktureras månadsvis.', 'Billed monthly.')}
                      </p>
                    )}
                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                      <span>{t('Totalt idag', 'Total today')}</span>
                      <span className="text-accent">{formatPrice(totalPackagePrice)}</span>
                    </div>
                    {carePlan && (
                      <p className="text-xs text-muted-foreground">
                        + {isYearlyCarePlan 
                          ? `${carePlanPrice * 12} kr/${t('år', 'year')}` 
                          : `${carePlanPrice} kr/${t('mån', 'month')}`} {t('börjar efter leverans', 'starts after delivery')}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={handlePrevStep}><ArrowLeft className="w-4 h-4" /> {t('Tillbaka', 'Back')}</Button>
                  <Button size="lg" onClick={handleSubmit} disabled={isLoading} className="flex-1">
                    {isLoading ? (
                      <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> {t('Bearbetar...', 'Processing...')}</span>
                    ) : (
                      <><CreditCard className="w-4 h-4" /> {t('Betala med Stripe', 'Pay with Stripe')} ({formatPrice(totalPackagePrice)})</>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
