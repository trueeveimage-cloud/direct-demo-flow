// Shared configuration for the Website Order Wizard
// This is the SINGLE SOURCE OF TRUTH for both DirectCheckout and PostDemo flows

export const BOOKING_ADDON_PRICE = 2000;
export const VERIFICATION_FEE = 500;

export interface BookingService {
  name: string;
  duration: string;
  price: string;
}

export interface WizardFormData {
  // Step 1: Contact
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  businessType: string;
  businessTypeOther: string;
  websiteGoal: string;
  
  // Step 2: Package & Style
  selectedPackage: string;
  selectedStyle: string;
  selectedLanguage: string;
  wantsBooking: boolean | null;
  bookingPlatform: string;
  primaryColor: string;
  accentColor: string;
  noColorPreference: boolean;
  
  // Step 3: Pages & Content
  selectedPages: string[];
  customPages: string[];
  services: string;
  noLogo: boolean;
  useStock: boolean;
  openingHours: string;
  appointmentLengths: string[];
  customAppointmentLength: string;
  bookingServices: BookingService[];
  bufferTime: string;
  maxBookingsPerDay: string;
  advanceBookingDays: string;
  
  // Step 4: Care Plan
  selectedCarePlan: string | null;
  isYearlyCarePlan: boolean;
  
  // Step 5: Details & Payment
  pageNotes: string;
  brandPreferences: string;
  competitors: string;
  seoKeywords: string;
  legalPages: string[];
  termsExplanation: string;
  extraNotes: string;
  
  // For post-demo flow
  conceptLink?: string;
}

export const initialFormData: WizardFormData = {
  businessName: '',
  contactPerson: '',
  email: '',
  phone: '',
  businessType: '',
  businessTypeOther: '',
  websiteGoal: '',
  selectedPackage: 'standard',
  selectedStyle: '',
  selectedLanguage: 'sv',
  wantsBooking: null,
  bookingPlatform: '',
  primaryColor: '',
  accentColor: '',
  noColorPreference: false,
  selectedPages: [],
  customPages: [''],
  services: '',
  noLogo: false,
  useStock: false,
  openingHours: '',
  appointmentLengths: [],
  customAppointmentLength: '',
  bookingServices: [{ name: '', duration: '', price: '' }],
  bufferTime: '',
  maxBookingsPerDay: '',
  advanceBookingDays: '',
  selectedCarePlan: 'standard',
  isYearlyCarePlan: false,
  pageNotes: '',
  brandPreferences: '',
  competitors: '',
  seoKeywords: '',
  legalPages: [],
  termsExplanation: '',
  extraNotes: '',
};

export const packages = [
  { 
    id: 'starter', 
    name: 'Starter', 
    price: 4900, 
    priceDisplay: '4 900 kr', 
    pages: { sv: 'Upp till 3 sidor', en: 'Up to 3 pages' }, 
    maxPages: 3, 
    delivery: 14, 
    booking: false, 
    features: { 
      sv: ['Responsiv design', 'Kontaktformulär', 'SEO-grundläggande', '1 revision'], 
      en: ['Responsive design', 'Contact form', 'Basic SEO', '1 revision'] 
    }, 
    bestFor: { sv: 'Nya företag', en: 'New businesses' } 
  },
  { 
    id: 'standard', 
    name: 'Standard', 
    price: 7900, 
    priceDisplay: '7 900 kr', 
    pages: { sv: 'Upp till 5 sidor', en: 'Up to 5 pages' }, 
    popular: true, 
    maxPages: 5, 
    delivery: 10, 
    booking: false, 
    features: { 
      sv: ['Allt i Starter', '2 revisioner', 'Google Maps', 'Sociala medier', 'Bildgalleri', 'Flerspråkstöd'], 
      en: ['Everything in Starter', '2 revisions', 'Google Maps', 'Social media', 'Image gallery', 'Multi-language'] 
    }, 
    bestFor: { sv: 'Växande företag', en: 'Growing businesses' } 
  },
  { 
    id: 'pro', 
    name: 'Pro', 
    price: 12900, 
    priceDisplay: '12 900 kr', 
    pages: { sv: 'Upp till 8 sidor', en: 'Up to 8 pages' }, 
    maxPages: 8, 
    delivery: 7, 
    booking: true, 
    features: { 
      sv: ['Allt i Standard', '3 revisioner', 'Bokningsintegration', 'Nyhetsbrev', 'Google Analytics', 'Prioriterad support', 'Flerspråkstöd'], 
      en: ['Everything in Standard', '3 revisions', 'Booking integration', 'Newsletter', 'Google Analytics', 'Priority support', 'Multi-language'] 
    }, 
    bestFor: { sv: 'Etablerade företag', en: 'Established businesses' } 
  },
];

export const styles = [
  { id: 'minimal', name: 'Minimal', tooltip: { sv: 'Ren, mycket whitespace, modernt.', en: 'Clean, lots of whitespace, modern.' } },
  { id: 'luxury', name: 'Luxury', tooltip: { sv: 'Premiumkänsla, elegant typografi, hög kontrast.', en: 'Premium feel, elegant typography, high contrast.' } },
  { id: 'bold', name: 'Bold', tooltip: { sv: 'Starka rubriker, energifyllda sektioner.', en: 'Strong headlines, high energy sections.' } },
  { id: 'playful', name: 'Playful', tooltip: { sv: 'Vänligt, färgglatt, mjukare ton.', en: 'Friendly, colorful, softer tone.' } },
  { id: 'corporate', name: 'Corporate', tooltip: { sv: 'Professionellt, strukturerat, förtroendeingivande.', en: 'Professional, structured, trust-focused.' } },
];

export const languages = [
  { id: 'sv', label: { sv: 'Svenska', en: 'Swedish' } },
  { id: 'en', label: { sv: 'Engelska', en: 'English' } },
  { id: 'both', label: { sv: 'Båda', en: 'Both' } },
];

export const carePlans = [
  { id: 'basic', name: 'Basic', monthlyPrice: 249, yearlyPrice: 199, features: { sv: ['Hosting', 'Uppdateringar', 'Säkerhetskopiering'], en: ['Hosting', 'Updates', 'Backups'] } },
  { id: 'standard', name: 'Standard', monthlyPrice: 449, yearlyPrice: 359, popular: true, features: { sv: ['Allt i Basic', 'Domän ingår', 'Företagsmail', '1h ändringar/mån'], en: ['Everything in Basic', 'Domain included', 'Business email', '1h edits/month'] } },
  { id: 'pro', name: 'Pro', monthlyPrice: 749, yearlyPrice: 599, features: { sv: ['Allt i Standard', '3h ändringar/mån', 'Prioriterad support'], en: ['Everything in Standard', '3h edits/month', 'Priority support'] } },
];

export const businessTypes = [
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

export const websiteGoals = [
  { id: 'bookings', label: { sv: 'Få bokningar', en: 'Get bookings' } },
  { id: 'calls', label: { sv: 'Få samtal', en: 'Get calls' } },
  { id: 'leads', label: { sv: 'Få leads / offertförfrågningar', en: 'Get leads / quote requests' } },
  { id: 'sell', label: { sv: 'Sälja online', en: 'Sell online' } },
];

export const appointmentDurations = ['15', '30', '45', '60', '90', 'custom'];

export const pageOptions = [
  { id: 'home', label: { sv: 'Startsida', en: 'Home' } },
  { id: 'about', label: { sv: 'Om oss', en: 'About' } },
  { id: 'services', label: { sv: 'Tjänster', en: 'Services' } },
  { id: 'contact', label: { sv: 'Kontakt', en: 'Contact' } },
  { id: 'gallery', label: { sv: 'Galleri', en: 'Gallery' } },
  { id: 'pricing', label: { sv: 'Priser', en: 'Pricing' } },
  { id: 'team', label: { sv: 'Team', en: 'Team' } },
  { id: 'faq', label: { sv: 'FAQ', en: 'FAQ' } },
];

export type FormStep = 1 | 2 | 3 | 4 | 5;

export const stepInfo = [
  { num: 1, labelSv: 'Kontakt', labelEn: 'Contact' },
  { num: 2, labelSv: 'Paket', labelEn: 'Package' },
  { num: 3, labelSv: 'Sidor', labelEn: 'Pages' },
  { num: 4, labelSv: 'Vårdplan', labelEn: 'Care plan' },
  { num: 5, labelSv: 'Betalning', labelEn: 'Payment' },
];
