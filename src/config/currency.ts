// Currency configuration based on language selection
// SEK for Swedish, EUR for English

export type Currency = 'SEK' | 'EUR';

// Exchange rate: 1 EUR = ~11.5 SEK (approximate, can be adjusted)
const EUR_TO_SEK_RATE = 11.5;

export interface PriceConfig {
  eur: number;
  sek: number;
}

// Package prices
export const packagePrices: Record<string, PriceConfig> = {
  starter: { eur: 290, sek: 2900 },
  standard: { eur: 790, sek: 7900 },
  pro: { eur: 1290, sek: 12900 },
};

// Care plan prices (monthly)
export const carePlanMonthlyPrices: Record<string, PriceConfig> = {
  basic: { eur: 25, sek: 249 },
  standard: { eur: 45, sek: 449 },
  pro: { eur: 75, sek: 749 },
};

// Care plan prices (yearly - 20% discount)
export const carePlanYearlyPrices: Record<string, PriceConfig> = {
  basic: { eur: 20, sek: 199 },
  standard: { eur: 36, sek: 359 },
  pro: { eur: 60, sek: 599 },
};

// Add-on prices
export const addonPrices: Record<string, PriceConfig> = {
  booking: { eur: 200, sek: 1990 },
  adminPanel: { eur: 100, sek: 990 },
  verification: { eur: 50, sek: 499 },
};

// Get currency based on language
export function getCurrencyFromLang(lang: 'sv' | 'en'): Currency {
  return lang === 'sv' ? 'SEK' : 'EUR';
}

// Format price with currency symbol
export function formatPrice(amount: number, currency: Currency): string {
  if (currency === 'EUR') {
    return `€${amount.toLocaleString('en-EU')}`;
  } else {
    return `${amount.toLocaleString('sv-SE')} kr`;
  }
}

// Get package price
export function getPackagePrice(packageId: string, currency: Currency): number {
  const prices = packagePrices[packageId];
  if (!prices) return 0;
  return currency === 'EUR' ? prices.eur : prices.sek;
}

// Get package price display string
export function getPackagePriceDisplay(packageId: string, currency: Currency): string {
  const price = getPackagePrice(packageId, currency);
  return formatPrice(price, currency);
}

// Get care plan price
export function getCarePlanPrice(planId: string, isYearly: boolean, currency: Currency): number {
  const prices = isYearly ? carePlanYearlyPrices[planId] : carePlanMonthlyPrices[planId];
  if (!prices) return 0;
  return currency === 'EUR' ? prices.eur : prices.sek;
}

// Get care plan price display string
export function getCarePlanPriceDisplay(planId: string, isYearly: boolean, currency: Currency): string {
  const price = getCarePlanPrice(planId, isYearly, currency);
  return `${formatPrice(price, currency)}/${currency === 'EUR' ? 'mo' : 'mån'}`;
}

// Get addon price
export function getAddonPrice(addonId: string, currency: Currency): number {
  const prices = addonPrices[addonId];
  if (!prices) return 0;
  return currency === 'EUR' ? prices.eur : prices.sek;
}

// Get addon price display string
export function getAddonPriceDisplay(addonId: string, currency: Currency): string {
  const price = getAddonPrice(addonId, currency);
  return formatPrice(price, currency);
}

// Stripe price IDs for each currency
export const stripePriceIds = {
  packages: {
    starter: {
      eur: 'price_starter_eur',
      sek: 'price_starter_sek',
    },
    standard: {
      eur: 'price_standard_eur',
      sek: 'price_standard_sek',
    },
    pro: {
      eur: 'price_pro_eur',
      sek: 'price_pro_sek',
    },
  },
  carePlans: {
    basic: {
      monthly: { eur: 'price_care_basic_monthly_eur', sek: 'price_care_basic_monthly_sek' },
      yearly: { eur: 'price_care_basic_yearly_eur', sek: 'price_care_basic_yearly_sek' },
    },
    standard: {
      monthly: { eur: 'price_care_standard_monthly_eur', sek: 'price_care_standard_monthly_sek' },
      yearly: { eur: 'price_care_standard_yearly_eur', sek: 'price_care_standard_yearly_sek' },
    },
    pro: {
      monthly: { eur: 'price_care_pro_monthly_eur', sek: 'price_care_pro_monthly_sek' },
      yearly: { eur: 'price_care_pro_yearly_eur', sek: 'price_care_pro_yearly_sek' },
    },
  },
  addons: {
    booking: { eur: 'price_booking_eur', sek: 'price_booking_sek' },
    adminPanel: { eur: 'price_admin_panel_eur', sek: 'price_admin_panel_sek' },
    verification: { eur: 'price_verification_eur', sek: 'price_verification_sek' },
  },
};

// Get Stripe price ID for package
export function getPackageStripePriceId(packageId: string, currency: Currency): string {
  const priceIds = stripePriceIds.packages[packageId as keyof typeof stripePriceIds.packages];
  if (!priceIds) return '';
  return currency === 'EUR' ? priceIds.eur : priceIds.sek;
}

// Get Stripe price ID for care plan
export function getCarePlanStripePriceId(planId: string, isYearly: boolean, currency: Currency): string {
  const plan = stripePriceIds.carePlans[planId as keyof typeof stripePriceIds.carePlans];
  if (!plan) return '';
  const period = isYearly ? 'yearly' : 'monthly';
  return currency === 'EUR' ? plan[period].eur : plan[period].sek;
}

// Get Stripe price ID for addon
export function getAddonStripePriceId(addonId: string, currency: Currency): string {
  const priceIds = stripePriceIds.addons[addonId as keyof typeof stripePriceIds.addons];
  if (!priceIds) return '';
  return currency === 'EUR' ? priceIds.eur : priceIds.sek;
}
