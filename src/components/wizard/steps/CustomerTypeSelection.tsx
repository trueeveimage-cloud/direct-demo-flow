import { useState, useMemo, useCallback } from 'react';
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
  billingAddress: string;
  vatVerified: boolean;
  vatVerifiedAt: string | null;
}

interface CustomerTypeSelectionProps {
  data: CustomerTypeData;
  onChange: (data: CustomerTypeData) => void;
}

const EU_COUNTRIES = [
  { code: 'SE', name: 'Sweden', vatPrefix: 'SE', orgFormat: 'XXXXXX-XXXX' },
  { code: 'NO', name: 'Norway', vatPrefix: 'NO', orgFormat: 'XXX XXX XXX' },
  { code: 'DK', name: 'Denmark', vatPrefix: 'DK', orgFormat: 'XXXXXXXX' },
  { code: 'FI', name: 'Finland', vatPrefix: 'FI', orgFormat: 'XXXXXXXX' },
  { code: 'DE', name: 'Germany', vatPrefix: 'DE', orgFormat: 'XXXXXXXXXXX' },
  { code: 'NL', name: 'Netherlands', vatPrefix: 'NL', orgFormat: 'XXXXXXXXXXXX' },
  { code: 'GB', name: 'United Kingdom', vatPrefix: 'GB', orgFormat: 'XXXXXXXXX' },
  { code: 'FR', name: 'France', vatPrefix: 'FR', orgFormat: 'XXXXXXXXXXX' },
  { code: 'ES', name: 'Spain', vatPrefix: 'ES', orgFormat: 'XXXXXXXXX' },
  { code: 'IT', name: 'Italy', vatPrefix: 'IT', orgFormat: 'XXXXXXXXXXX' },
];

// Basic VAT format validation per country
const validateVatFormat = (vatNumber: string, countryCode: string): boolean => {
  if (!vatNumber) return true;
  
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
  if (!pattern) return true;
  
  return pattern.test(vatNumber.replace(/[\s.-]/g, ''));
};

// Basic org number format validation
const validateOrgFormat = (orgNumber: string, countryCode: string): boolean => {
  if (!orgNumber) return true; // Empty is valid (will be caught by required check)
  
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

  const updateField = useCallback(<K extends keyof CustomerTypeData>(field: K, value: CustomerTypeData[K]) => {
    onChange({ ...data, [field]: value });
  }, [data, onChange]);

  const selectedCountry = useMemo(() => 
    EU_COUNTRIES.find(c => c.code === data.country), 
    [data.country]
  );

  // Compute validation errors without useEffect (prevents infinite loops)
  const vatError = useMemo(() => {
    if (!data.vatNumber || !data.country) return null;
    const isValidFormat = validateVatFormat(data.vatNumber, data.country);
    if (!isValidFormat) {
      return t('Ogiltigt format. Förväntat: ', 'Invalid format. Expected: ') + `${selectedCountry?.vatPrefix}XXXXXXXXX`;
    }
    return null;
  }, [data.vatNumber, data.country, selectedCountry?.vatPrefix, t]);

  const orgError = useMemo(() => {
    if (!data.orgNumber || !data.country) return null;
    const isValidFormat = validateOrgFormat(data.orgNumber, data.country);
    if (!isValidFormat) {
      return t('Ogiltigt format. Förväntat: ', 'Invalid format. Expected: ') + selectedCountry?.orgFormat;
    }
    return null;
  }, [data.orgNumber, data.country, selectedCountry?.orgFormat, t]);

  // Mock VIES verification
  const verifyVat = useCallback(async () => {
    if (!data.vatNumber || vatError) return;
    
    setIsVerifyingVat(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const isValid = data.vatNumber.length >= 10;
    
    onChange({
      ...data,
      vatVerified: isValid,
      vatVerifiedAt: isValid ? new Date().toISOString() : null,
    });
    
    setIsVerifyingVat(false);
  }, [data, vatError, onChange]);

  const handleVatChange = useCallback((value: string) => {
    onChange({
      ...data,
      vatNumber: value.toUpperCase(),
      vatVerified: false,
      vatVerifiedAt: null,
    });
  }, [data, onChange]);

  return (
    <div className="space-y-6">
      {/* Customer Type Selection */}
      <div>
        <Label className="text-sm font-medium mb-3 block">
          {t('Jag köper som', 'I am purchasing as')} *
        </Label>
        <div className="grid grid-cols-2 gap-4">
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
            transition={{ duration: 0.2 }}
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
                  <Input
                    value={data.vatNumber}
                    onChange={(e) => handleVatChange(e.target.value)}
                    placeholder={`${selectedCountry?.vatPrefix || 'SE'}XXXXXXXXXXXX`}
                    className={cn('h-12 flex-1', vatError && 'border-destructive', data.vatVerified && 'border-green-500')}
                  />
                  {data.vatNumber && !vatError && (
                    <button
                      type="button"
                      onClick={verifyVat}
                      disabled={isVerifyingVat || data.vatVerified}
                      className={cn(
                        'px-4 h-12 rounded-lg font-medium transition-colors',
                        data.vatVerified 
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-accent text-accent-foreground hover:bg-accent/90'
                      )}
                    >
                      {isVerifyingVat ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : data.vatVerified ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        t('Verifiera', 'Verify')
                      )}
                    </button>
                  )}
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
  country: 'SE',
  billingAddress: '',
  vatVerified: false,
  vatVerifiedAt: null,
};

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
    
    if (data.vatNumber && !data.vatVerified) {
      errors.push('VAT number must be verified');
    }
  }
  
  return { valid: errors.length === 0, errors };
};
