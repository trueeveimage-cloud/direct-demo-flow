import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, User, Info, CheckCircle, Loader2 } from 'lucide-react';
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
  billingAddress: string;
  vatVerified: boolean;
  vatVerifiedAt: string | null;
}

interface CustomerTypeSelectionProps {
  data: CustomerTypeData;
  onChange: (data: CustomerTypeData) => void;
}

// Countries list with VAT info - US and other non-EU countries have no VAT
const ALL_COUNTRIES = [
  // Nordic countries (first in list)
  { code: 'SE', name: 'Sweden', vatPrefix: 'SE', orgFormat: 'XXXXXX-XXXX', vatRate: 25, region: 'EU' },
  { code: 'NO', name: 'Norway', vatPrefix: 'NO', orgFormat: 'XXX XXX XXX', vatRate: 25, region: 'EEA' },
  { code: 'DK', name: 'Denmark', vatPrefix: 'DK', orgFormat: 'XXXXXXXX', vatRate: 25, region: 'EU' },
  { code: 'FI', name: 'Finland', vatPrefix: 'FI', orgFormat: 'XXXXXXXX', vatRate: 24, region: 'EU' },
  // US & non-EU (no VAT)
  { code: 'US', name: 'United States', vatPrefix: '', orgFormat: 'EIN', vatRate: 0, region: 'NON_EU' },
  { code: 'CA', name: 'Canada', vatPrefix: '', orgFormat: 'BN', vatRate: 0, region: 'NON_EU' },
  { code: 'AU', name: 'Australia', vatPrefix: '', orgFormat: 'ABN', vatRate: 0, region: 'NON_EU' },
  { code: 'GB', name: 'United Kingdom', vatPrefix: 'GB', orgFormat: 'XXXXXXXXX', vatRate: 20, region: 'NON_EU' },
  // EU countries
  { code: 'DE', name: 'Germany', vatPrefix: 'DE', orgFormat: 'XXXXXXXXXXX', vatRate: 19, region: 'EU' },
  { code: 'NL', name: 'Netherlands', vatPrefix: 'NL', orgFormat: 'XXXXXXXXXXXX', vatRate: 21, region: 'EU' },
  { code: 'FR', name: 'France', vatPrefix: 'FR', orgFormat: 'XXXXXXXXXXX', vatRate: 20, region: 'EU' },
  { code: 'ES', name: 'Spain', vatPrefix: 'ES', orgFormat: 'XXXXXXXXX', vatRate: 21, region: 'EU' },
  { code: 'IT', name: 'Italy', vatPrefix: 'IT', orgFormat: 'XXXXXXXXXXX', vatRate: 22, region: 'EU' },
];

// For backwards compatibility
const EU_COUNTRIES = ALL_COUNTRIES;

// Countries that don't require VAT (no VAT collection)
const isNonVatCountry = (countryCode: string): boolean => {
  const nonVatCountries = ['US', 'CA', 'AU'];
  return nonVatCountries.includes(countryCode);
};

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
  const { t } = useLanguage();
  const [isVerifyingVat, setIsVerifyingVat] = useState(false);
  const [vatError, setVatError] = useState<string | null>(null);
  const [orgError, setOrgError] = useState<string | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const updateField = <K extends keyof CustomerTypeData>(field: K, value: CustomerTypeData[K]) => {
    onChange({ ...data, [field]: value });
  };

  const selectedCountry = EU_COUNTRIES.find(c => c.code === data.country);

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

      {/* Country Selection (for all customers to determine VAT) */}
      <AnimatePresence>
        {data.customerType && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 bg-secondary/30 rounded-xl">
              <Label className="flex items-center gap-2 mb-2">
                {t('Ditt land', 'Your country')} *
                <InfoTooltip content={t('Välj ditt land för korrekt momshantering.', 'Select your country for correct tax handling.')} />
              </Label>
              <Select
                value={data.country}
                onValueChange={(value) => updateField('country', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('Välj land', 'Select country')} />
                </SelectTrigger>
                <SelectContent>
                  {ALL_COUNTRIES.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name} {country.vatRate === 0 ? '' : `(${country.vatRate}% VAT)`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isNonVatCountry(data.country) && (
                <p className="text-sm text-muted-foreground mt-2">
                  ✓ {t('Ingen moms tillämpas för ditt land', 'No VAT applied for your country')}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

              {/* Country */}
              <div>
                <Label className="flex items-center gap-2">
                  {t('Land', 'Country')} *
                  <InfoTooltip content={t('Välj det land där företaget är registrerat.', 'Select the country where the company is registered.')} />
                </Label>
                <Select
                  value={data.country}
                  onValueChange={(value) => updateField('country', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={t('Välj land', 'Select country')} />
                  </SelectTrigger>
                  <SelectContent>
                    {EU_COUNTRIES.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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

              {/* VAT Number */}
              <div>
                <Label className="flex items-center gap-2">
                  {t('VAT-nummer', 'VAT Number')}
                  <InfoTooltip 
                    content={t('Om ditt företag är momsregistrerat. Lämna tomt om ej tillämpligt.', 'If your company is VAT registered. Leave empty if not applicable.')}
                    example={`${selectedCountry?.vatPrefix || 'SE'}XXXXXXXXXXXX`}
                  />
                </Label>
                <div className="flex gap-2 mt-1">
                  <div className="relative flex-1">
                    <Input
                      value={data.vatNumber}
                      onChange={(e) => {
                        onChange({ 
                          ...data, 
                          vatNumber: e.target.value.toUpperCase(),
                          vatVerified: false,
                          vatVerifiedAt: null
                        });
                      }}
                      placeholder={`${selectedCountry?.vatPrefix || 'SE'}XXXXXXXXXXXX`}
                      className={cn(
                        'h-12 w-full bg-background', 
                        vatError && 'border-destructive', 
                        data.vatVerified && 'border-green-500 pr-10'
                      )}
                    />
                    {isVerifyingVat && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="w-5 h-5 animate-spin text-accent" />
                      </div>
                    )}
                    {data.vatVerified && !isVerifyingVat && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                    )}
                  </div>
                </div>
                {vatError && (
                  <p className="text-sm text-destructive mt-1">{vatError}</p>
                )}
                {data.vatVerified && (
                  <p className="text-sm text-green-500 mt-1 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {t('VAT-nummer verifierat', 'VAT number verified')}
                  </p>
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
                  placeholder={t('Gatuadress, Postnummer Ort', 'Street, Postal Code City')}
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

export const initialCustomerTypeData: CustomerTypeData = {
  customerType: null,
  companyName: '',
  orgNumber: '',
  vatNumber: '',
  country: 'US', // Default to US for international market
  billingAddress: '',
  vatVerified: false,
  vatVerifiedAt: null,
};

// Export countries list for use elsewhere
export { ALL_COUNTRIES, isNonVatCountry };

// Validation function
export const validateCustomerType = (data: CustomerTypeData): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.customerType) {
    errors.push('Please select Private or Business');
  }
  
  if (data.customerType === 'business') {
    if (!data.country) errors.push('Country is required');
    if (!data.companyName) errors.push('Company name is required');
    if (!data.orgNumber) errors.push('Organisation number is required');
    if (!data.billingAddress) errors.push('Billing address is required');
    
    // If VAT number is provided, it must be verified
    if (data.vatNumber && !data.vatVerified) {
      errors.push('VAT number must be verified');
    }
  }
  
  return { valid: errors.length === 0, errors };
};
