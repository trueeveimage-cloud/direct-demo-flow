import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, User, CheckCircle, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { InfoTooltip } from '@/components/InfoTooltip';
import { cn } from '@/lib/utils';

export interface CustomerTypeData {
  customerType: 'private' | 'business' | null;
  companyName: string;
  orgNumber: string;
  vatNumber: string;
  country: string;
  state: string; // US state for tax compliance
  billingAddress: string;
  vatVerified: boolean;
  vatVerifiedAt: string | null;
}

// Initial state for customer type data
export const initialCustomerTypeData: CustomerTypeData = {
  customerType: null,
  companyName: '',
  orgNumber: '',
  vatNumber: '',
  country: '',
  state: '',
  billingAddress: '',
  vatVerified: false,
  vatVerifiedAt: null,
};

// Validate customer type data
export function validateCustomerType(data: CustomerTypeData): boolean {
  if (!data.customerType) return false;
  if (!data.country) return false;
  if (data.country === 'US' && !data.state) return false;
  if (data.customerType === 'business') {
    if (!data.companyName) return false;
    if (!data.orgNumber) return false;
  }
  return true;
}

interface CustomerTypeSelectionProps {
  data: CustomerTypeData;
  onChange: (data: CustomerTypeData) => void;
}

// Only 5 countries supported with their VAT rates
export const ALL_COUNTRIES = [
  // Nordic countries with 25% VAT
  { code: 'SE', name: 'Sweden', nameSv: 'Sverige', vatPrefix: 'SE', orgFormat: 'XXXXXX-XXXX', vatRate: 25, region: 'EU' },
  { code: 'NO', name: 'Norway', nameSv: 'Norge', vatPrefix: 'NO', orgFormat: 'XXX XXX XXX', vatRate: 25, region: 'EEA' },
  { code: 'DK', name: 'Denmark', nameSv: 'Danmark', vatPrefix: 'DK', orgFormat: 'XXXXXXXX', vatRate: 25, region: 'EU' },
  // Non-VAT countries (0% VAT)
  { code: 'US', name: 'United States', nameSv: 'USA', vatPrefix: '', orgFormat: 'EIN', vatRate: 0, region: 'NON_EU' },
  { code: 'CA', name: 'Canada', nameSv: 'Kanada', vatPrefix: '', orgFormat: 'BN', vatRate: 0, region: 'NON_EU' },
];

// US States for tax compliance
export const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
  { code: 'DC', name: 'District of Columbia' },
];

// Get VAT rate for a specific country
export function getVatRateForCountry(countryCode: string): number {
  const country = ALL_COUNTRIES.find(c => c.code === countryCode);
  return country?.vatRate || 0;
}

// Countries that don't require VAT (no VAT collection)
export function isNonVatCountry(countryCode: string): boolean {
  const nonVatCountries = ['US', 'CA'];
  return nonVatCountries.includes(countryCode);
}

// Calculate VAT for an order based on country
// Only 5 countries: SE, NO, DK = 25% VAT | US, CA = 0% VAT
export function calculateVat(
  netAmount: number,
  customerType: 'private' | 'business' | null,
  country: string,
  _vatVerified: boolean = false
): { vatRate: number; vatAmount: number; showVat: boolean; isReverseCharge: boolean } {
  // US and CA = no VAT
  if (isNonVatCountry(country)) {
    return { vatRate: 0, vatAmount: 0, showVat: false, isReverseCharge: false };
  }

  // SE, NO, DK = 25% VAT for all customers
  const vatCountries = ['SE', 'NO', 'DK'];
  if (vatCountries.includes(country)) {
    return { 
      vatRate: 25, 
      vatAmount: Math.round(netAmount * 0.25), 
      showVat: true, 
      isReverseCharge: false 
    };
  }
  
  // Default: no VAT
  return { vatRate: 0, vatAmount: 0, showVat: false, isReverseCharge: false };
}

// Basic VAT format validation per country
const validateVatFormat = (vatNumber: string, countryCode: string): boolean => {
  if (!vatNumber) return true; // VAT is optional
  if (isNonVatCountry(countryCode)) return true; // No VAT format for non-VAT countries
  
  const patterns: Record<string, RegExp> = {
    SE: /^SE\d{12}$/i,
    NO: /^NO\d{9}MVA$/i,
    DK: /^DK\d{8}$/i,
    FI: /^FI\d{8}$/i,
    DE: /^DE\d{9}$/i,
    NL: /^NL\d{9}B\d{2}$/i,
    GB: /^GB(\d{9}|\d{12}|GD\d{3}|HA\d{3})$/i,
    FR: /^FR[A-Z0-9]{2}\d{9}$/i,
    ES: /^ES[A-Z0-9]\d{7}[A-Z0-9]$/i,
    IT: /^IT\d{11}$/i,
  };
  
  const pattern = patterns[countryCode];
  if (!pattern) return true; // Accept if no pattern defined
  
  return pattern.test(vatNumber.replace(/[\s.-]/g, ''));
};

// Basic org number format validation
const validateOrgFormat = (orgNumber: string, countryCode: string): boolean => {
  if (!orgNumber) return false;
  
  const patterns: Record<string, RegExp> = {
    SE: /^\d{6}-?\d{4}$/,
    NO: /^\d{9}$/,
    DK: /^\d{8}$/,
    FI: /^\d{7}-?\d$/,
    DE: /^HRB?\s?\d+$/i,
    NL: /^\d{8}$/,
    GB: /^[A-Z]{2}\d{6}$|^\d{8}$/i,
    FR: /^\d{9}$/,
    ES: /^[A-Z]\d{7}[A-Z0-9]$/i,
    IT: /^\d{11}$/,
  };
  
  const pattern = patterns[countryCode];
  if (!pattern) return orgNumber.length >= 6;
  
  return pattern.test(orgNumber.replace(/[\s.-]/g, ''));
};

export function CustomerTypeSelection({ data, onChange }: CustomerTypeSelectionProps) {
  const { t, lang } = useLanguage();
  const [isVerifyingVat, setIsVerifyingVat] = useState(false);
  const [vatError, setVatError] = useState<string | null>(null);
  const [orgError, setOrgError] = useState<string | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const updateField = <K extends keyof CustomerTypeData>(field: K, value: CustomerTypeData[K]) => {
    onChange({ ...data, [field]: value });
  };

  const selectedCountry = ALL_COUNTRIES.find(c => c.code === data.country);

  // Set default country based on language ONLY on initial mount if not set
  useEffect(() => {
    if (!data.country) {
      const defaultCountry = lang === 'sv' ? 'SE' : 'US';
      onChange({ ...data, country: defaultCountry });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Real VIES verification via edge function
  const verifyVat = useCallback(async (vatToVerify: string, country: string, currentData: CustomerTypeData) => {
    if (!vatToVerify) return;
    
    // Check format first
    const isValidFormat = validateVatFormat(vatToVerify, country);
    if (!isValidFormat) {
      return;
    }
    
    setIsVerifyingVat(true);
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-vat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            vatNumber: vatToVerify,
            countryCode: country,
          }),
        }
      );
      
      const result = await response.json();
      
      if (result.valid) {
        onChange({ 
          ...currentData, 
          vatVerified: true, 
          vatVerifiedAt: result.verifiedAt || new Date().toISOString() 
        });
        setVatError(null);
      } else {
        // Localize error messages from edge function
        const errorMessage = result.error === 'VIES_UNAVAILABLE' 
          ? t('VIES-tjänsten är tillfälligt otillgänglig. Försök igen senare.', 'VIES service temporarily unavailable. Please try again later.')
          : result.message?.includes('not valid according to VIES')
            ? t('VAT-numret är ogiltigt enligt VIES', 'VAT number is not valid according to VIES')
            : t('VAT-nummer kunde inte verifieras', 'VAT number could not be verified');
        setVatError(errorMessage);
        onChange({ ...currentData, vatVerified: false, vatVerifiedAt: null });
      }
    } catch (error) {
      console.error('VAT verification error:', error);
      setVatError(t('Kunde inte verifiera VAT-nummer. Försök igen.', 'Could not verify VAT number. Please try again.'));
      onChange({ ...currentData, vatVerified: false, vatVerifiedAt: null });
    }
    
    setIsVerifyingVat(false);
  }, [t, onChange]);

  // Validate VAT number format and auto-verify with debounce
  useEffect(() => {
    if (data.vatNumber && data.country) {
      const isValidFormat = validateVatFormat(data.vatNumber, data.country);
      if (!isValidFormat) {
        setVatError(t('Ogiltigt format. Förväntat: ', 'Invalid format. Expected: ') + `${selectedCountry?.vatPrefix}XXXXXXXXX`);
      } else {
        setVatError(null);
        // Auto-verify with debounce when format is valid
        if (!data.vatVerified) {
          if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
          }
          debounceTimerRef.current = setTimeout(() => {
            verifyVat(data.vatNumber, data.country, data);
          }, 800);
        }
      }
    } else {
      setVatError(null);
    }
    
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [data.vatNumber, data.country, data.vatVerified, verifyVat, selectedCountry?.vatPrefix, t]);

  // Validate Org number
  useEffect(() => {
    if (data.orgNumber && data.country) {
      const isValidFormat = validateOrgFormat(data.orgNumber, data.country);
      if (!isValidFormat) {
        setOrgError(t('Ogiltigt format. Förväntat: ', 'Invalid format. Expected: ') + selectedCountry?.orgFormat);
      } else {
        setOrgError(null);
      }
    } else {
      setOrgError(null);
    }
  }, [data.orgNumber, data.country, selectedCountry?.orgFormat, t]);

  // Sort countries: put current language's default first
  const sortedCountries = [...ALL_COUNTRIES].sort((a, b) => {
    // Swedish users see SE first
    if (lang === 'sv') {
      if (a.code === 'SE') return -1;
      if (b.code === 'SE') return 1;
    } else {
      // English users see US first
      if (a.code === 'US') return -1;
      if (b.code === 'US') return 1;
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-6">
      {/* Customer Type Selection */}
      <div>
        <Label className="text-sm font-medium mb-3 block">
          {t('Jag köper som', 'I am purchasing as')} *
        </Label>
        <div className="grid grid-cols-2 gap-4 customer-type-selection" data-field="customerType">
          <button
            type="button"
            onClick={() => updateField('customerType', 'private')}
            className={cn(
              'p-4 rounded-xl border-2 transition-all duration-200 text-left',
              data.customerType === 'private'
                ? 'border-accent bg-accent/10'
                : 'border-border hover:border-accent/50'
            )}
          >
            <User className={cn('w-6 h-6 mb-2', data.customerType === 'private' ? 'text-accent' : 'text-muted-foreground')} />
            <p className="font-medium">{t('Privatperson', 'Private')}</p>
            <p className="text-sm text-muted-foreground">{t('Personligt köp', 'Personal purchase')}</p>
          </button>
          
          <button
            type="button"
            onClick={() => updateField('customerType', 'business')}
            className={cn(
              'p-4 rounded-xl border-2 transition-all duration-200 text-left',
              data.customerType === 'business'
                ? 'border-accent bg-accent/10'
                : 'border-border hover:border-accent/50'
            )}
          >
            <Building2 className={cn('w-6 h-6 mb-2', data.customerType === 'business' ? 'text-accent' : 'text-muted-foreground')} />
            <p className="font-medium">{t('Företag', 'Business')}</p>
            <p className="text-sm text-muted-foreground">{t('Företagsköp med faktura', 'Business purchase')}</p>
          </button>
        </div>
      </div>

      {/* Business Fields */}
      <AnimatePresence>
        {data.customerType === 'business' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 overflow-hidden"
          >
            <div className="p-4 bg-secondary/50 rounded-xl space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Building2 className="w-4 h-4 text-accent" />
                {t('Företagsuppgifter', 'Company Details')}
              </h4>

              {/* Company Name */}
              <div>
                <Label className="flex items-center gap-2">
                  {t('Företagsnamn', 'Company Name')} *
                  <InfoTooltip content={t('Det officiella registrerade företagsnamnet.', 'The official registered company name.')} />
                </Label>
                <Input
                  data-field="companyName"
                  value={data.companyName}
                  onChange={(e) => updateField('companyName', e.target.value)}
                  placeholder={t('AB Företaget', 'Company Ltd')}
                  className="mt-1 h-12"
                />
              </div>

              {/* Org Number */}
              <div>
                <Label className="flex items-center gap-2">
                  {t('Organisationsnummer', 'Organisation Number')} *
                  <InfoTooltip 
                    content={t('Ditt företags registreringsnummer.', 'Your company registration number.')}
                    example={selectedCountry?.orgFormat || 'XXXXXX-XXXX'}
                  />
                </Label>
                <Input
                  data-field="orgNumber"
                  value={data.orgNumber}
                  onChange={(e) => updateField('orgNumber', e.target.value)}
                  placeholder={selectedCountry?.orgFormat || 'XXXXXX-XXXX'}
                  className={cn('mt-1 h-12', orgError && 'border-destructive')}
                />
                {orgError && (
                  <p className="text-sm text-destructive mt-1">{orgError}</p>
                )}
              </div>

              {/* Billing Address */}
              <div>
                <Label className="flex items-center gap-2">
                  {t('Fakturaadress', 'Billing Address')} *
                  <InfoTooltip content={t('Företagets officiella adress för fakturering.', 'Company official address for billing.')} />
                </Label>
                <Input
                  value={data.billingAddress}
                  onChange={(e) => updateField('billingAddress', e.target.value)}
                  placeholder={t('Gatuadress, Postnummer, Stad', 'Street address, Postal code, City')}
                  className="mt-1 h-12"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
