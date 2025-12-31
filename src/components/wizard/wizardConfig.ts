// Shared configuration for the Website Order Wizard
// This is the SINGLE SOURCE OF TRUTH for both DirectCheckout and PostDemo flows

export const BOOKING_ADDON_PRICE = 200;
export const VERIFICATION_FEE = 50;

export interface BookingService {
  name: string;
  duration: string;
  price: string;
}

// Business type specific follow-up questions
export interface FollowUpQuestion {
  id: string;
  type: 'toggle' | 'text' | 'select' | 'multiselect';
  label: { sv: string; en: string };
  tooltip?: { sv: string; en: string };
  options?: { id: string; label: { sv: string; en: string } }[];
  placeholder?: { sv: string; en: string };
  required?: boolean;
}

export interface BusinessTypeFollowUp {
  businessTypes: string[];
  questions: FollowUpQuestion[];
}

// Follow-up questions based on business type
export const businessTypeFollowUps: BusinessTypeFollowUp[] = [
  {
    // Salon/Barber/Nails
    businessTypes: ['barber', 'nail'],
    questions: [
      {
        id: 'dropInOrBooking',
        type: 'select',
        label: { sv: 'Erbjuder ni drop-in eller endast bokning?', en: 'Do you offer drop-in or booking only?' },
        tooltip: { sv: 'Hjälper oss skapa rätt CTA på webbplatsen.', en: 'Helps us create the right CTA on the website.' },
        options: [
          { id: 'dropin', label: { sv: 'Drop-in tillåtet', en: 'Drop-in allowed' } },
          { id: 'bookingOnly', label: { sv: 'Endast bokning', en: 'Booking only' } },
          { id: 'both', label: { sv: 'Både drop-in och bokning', en: 'Both drop-in and booking' } },
        ],
      },
      {
        id: 'topServices',
        type: 'text',
        label: { sv: 'Topp 3 tjänster + priser', en: 'Top 3 services + prices' },
        placeholder: { sv: 'T.ex. Herrklipp 350kr, Fade 400kr, Skägg 200kr', en: 'E.g. Men\'s cut $35, Fade $40, Beard $20' },
      },
      {
        id: 'hasBeforeAfter',
        type: 'toggle',
        label: { sv: 'Har ni före/efter-bilder?', en: 'Do you have before/after images?' },
        tooltip: { sv: 'Före/efter-bilder ökar konverteringar.', en: 'Before/after images increase conversions.' },
      },
      {
        id: 'instagramLink',
        type: 'text',
        label: { sv: 'Instagram-länk', en: 'Instagram link' },
        placeholder: { sv: 'https://instagram.com/...', en: 'https://instagram.com/...' },
        required: true,
      },
    ],
  },
  {
    // Car workshop
    businessTypes: ['car'],
    questions: [
      {
        id: 'carServices',
        type: 'multiselect',
        label: { sv: 'Vilka tjänster erbjuder ni?', en: 'Which services do you offer?' },
        options: [
          { id: 'repair', label: { sv: 'Reparation', en: 'Repair' } },
          { id: 'service', label: { sv: 'Service/underhåll', en: 'Service/maintenance' } },
          { id: 'detailing', label: { sv: 'Rekond/detailing', en: 'Detailing' } },
          { id: 'diagnostics', label: { sv: 'Diagnostik', en: 'Diagnostics' } },
          { id: 'tires', label: { sv: 'Däckbyte', en: 'Tire change' } },
        ],
      },
      {
        id: 'offersQuotes',
        type: 'toggle',
        label: { sv: 'Erbjuder ni offertförfrågningar?', en: 'Do you offer quote requests?' },
      },
      {
        id: 'emergencyContact',
        type: 'text',
        label: { sv: 'Öppettider + ev. jourtelefon', en: 'Opening hours + emergency contact' },
        placeholder: { sv: 'T.ex. Mån-Fre 07-17, Jour: 070-...', en: 'E.g. Mon-Fri 7-5, Emergency: +46...' },
      },
    ],
  },
  {
    // Restaurant/Café
    businessTypes: ['restaurant'],
    questions: [
      {
        id: 'menuLink',
        type: 'text',
        label: { sv: 'Meny-länk eller uppladdning', en: 'Menu link or upload' },
        placeholder: { sv: 'Länk till er meny eller beskriv menytyp', en: 'Link to your menu or describe menu type' },
      },
      {
        id: 'wantsTableBooking',
        type: 'toggle',
        label: { sv: 'Behövs bordbokning?', en: 'Do you need table booking?' },
      },
      {
        id: 'deliveryOptions',
        type: 'multiselect',
        label: { sv: 'Leveransalternativ', en: 'Delivery options' },
        options: [
          { id: 'eatIn', label: { sv: 'Äta på plats', en: 'Dine-in' } },
          { id: 'takeaway', label: { sv: 'Takeaway', en: 'Takeaway' } },
          { id: 'delivery', label: { sv: 'Utkörning', en: 'Delivery' } },
        ],
      },
    ],
  },
  {
    // Clinic
    businessTypes: ['clinic'],
    questions: [
      {
        id: 'appointmentDurations',
        type: 'text',
        label: { sv: 'Tidslängder för bokningar', en: 'Appointment duration options' },
        placeholder: { sv: 'T.ex. 30 min, 60 min, 90 min', en: 'E.g. 30 min, 60 min, 90 min' },
      },
      {
        id: 'hasDisclaimers',
        type: 'toggle',
        label: { sv: 'Behöver ni visa medicinska varningar/disclaimers?', en: 'Do you need medical disclaimers?' },
        tooltip: { sv: 'För behandlingar som kräver juridisk information.', en: 'For treatments requiring legal information.' },
      },
      {
        id: 'treatmentTypes',
        type: 'text',
        label: { sv: 'Vilka behandlingar erbjuder ni?', en: 'What treatments do you offer?' },
        placeholder: { sv: 'Lista era huvudbehandlingar', en: 'List your main treatments' },
      },
    ],
  },
  {
    // Gym/PT
    businessTypes: ['gym'],
    questions: [
      {
        id: 'membershipTypes',
        type: 'text',
        label: { sv: 'Medlemskapstyper och priser', en: 'Membership types and prices' },
        placeholder: { sv: 'T.ex. Dagspass 100kr, Månadskort 500kr', en: 'E.g. Day pass $10, Monthly $50' },
      },
      {
        id: 'offersPT',
        type: 'toggle',
        label: { sv: 'Erbjuder ni PT/personlig träning?', en: 'Do you offer personal training?' },
      },
      {
        id: 'hasClassSchedule',
        type: 'toggle',
        label: { sv: 'Har ni gruppträning/schema?', en: 'Do you have group classes/schedule?' },
      },
    ],
  },
];

export interface WizardFormData {
  // Step 1: Contact
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  businessType: string;
  businessTypeOther: string;
  websiteGoal: string;
  websiteGoalOther: string;
  
  // Business type follow-up answers
  businessFollowUps: Record<string, string | boolean | string[]>;
  
  // Step 2: Package & Style
  selectedPackage: string;
  selectedStyle: string;
  selectedLanguage: string;
  customLanguages: string; // NEW: For custom language input
  wantsBooking: boolean | null;
  bookingPlatform: string;
  primaryColor: string;
  accentColor: string;
  noColorPreference: boolean;
  
  // FREE essentials
  wantsGoogleMaps: boolean;
  googleMapsAddress: string;
  wantsGoogleReviews: boolean;
  googleBusinessLink: string;
  wantsBeforeAfter: boolean;
  wantsCheckoutSystem: boolean;
  
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
  websiteGoalOther: '',
  businessFollowUps: {},
  selectedPackage: '',
  selectedStyle: '',
  selectedLanguage: 'sv',
  customLanguages: '',
  wantsBooking: null,
  bookingPlatform: '',
  primaryColor: '',
  accentColor: '',
  noColorPreference: false,
  wantsGoogleMaps: false,
  googleMapsAddress: '',
  wantsGoogleReviews: false,
  googleBusinessLink: '',
  wantsBeforeAfter: false,
  wantsCheckoutSystem: false,
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
  selectedCarePlan: null,
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
    price: 490, 
    priceDisplay: '€490', 
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
    price: 790, 
    priceDisplay: '€790', 
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
    price: 1290, 
    priceDisplay: '€1,290', 
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
  { id: 'both', label: { sv: 'Svenska + Engelska', en: 'Swedish + English' } },
  { id: 'custom', label: { sv: 'Annat/Flera språk', en: 'Other/Multiple languages' } },
];

export const carePlans = [
  { id: 'basic', name: 'Basic', monthlyPrice: 25, yearlyPrice: 20, features: { sv: ['Hosting', 'Uppdateringar', 'Säkerhetskopiering'], en: ['Hosting', 'Updates', 'Backups'] } },
  { id: 'standard', name: 'Standard', monthlyPrice: 45, yearlyPrice: 36, popular: true, features: { sv: ['Allt i Basic', 'Domän ingår', 'Företagsmail', '1h ändringar/mån'], en: ['Everything in Basic', 'Domain included', 'Business email', '1h edits/month'] } },
  { id: 'pro', name: 'Pro', monthlyPrice: 75, yearlyPrice: 60, features: { sv: ['Allt i Standard', '3h ändringar/mån', 'Prioriterad support'], en: ['Everything in Standard', '3h edits/month', 'Priority support'] } },
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
  { id: 'other', label: { sv: 'Annat', en: 'Other' } },
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

// FREE essentials that are included
export const freeEssentials = [
  { id: 'responsive', label: { sv: 'Mobilanpassad design', en: 'Mobile responsive design' }, always: true },
  { id: 'googleMaps', label: { sv: 'Google Maps', en: 'Google Maps' }, always: false },
  { id: 'googleReviews', label: { sv: 'Google Recensioner', en: 'Google Reviews' }, always: false },
  { id: 'beforeAfter', label: { sv: 'Före/Efter-sektion', en: 'Before/After section' }, always: false },
  { id: 'checkout', label: { sv: 'Kassasystem', en: 'Checkout system' }, always: false },
];

export type FormStep = 1 | 2 | 3 | 4 | 5 | 6;

export const stepInfo = [
  { num: 1, labelSv: 'Kontakt', labelEn: 'Contact' },
  { num: 2, labelSv: 'Paket', labelEn: 'Package' },
  { num: 3, labelSv: 'Sidor', labelEn: 'Pages' },
  { num: 4, labelSv: 'Vårdplan', labelEn: 'Care plan' },
  { num: 5, labelSv: 'Detaljer', labelEn: 'Details' },
  { num: 6, labelSv: 'Betalning', labelEn: 'Payment' },
];