// Currency configuration based on language selection
// SEK for Swedish, NOK for Norwegian, DKK for Danish, USD for English

export type Currency = 'SEK' | 'USD' | 'NOK' | 'DKK';

// Stripe only has SEK and USD prices, so NOK/DKK map to SEK at checkout
export type StripeCurrency = 'SEK' | 'USD';

// Exchange rate: 1 USD = ~10.5 SEK (approximate, can be adjusted)
const USD_TO_SEK_RATE = 10.5;

export interface PriceConfig {
  usd: number;
  sek: number;
  nok: number;
  dkk: number;
}

// Package prices
export const packagePrices: Record<string, PriceConfig> = {
  starter: { usd: 290, sek: 2900, nok: 3100, dkk: 2100 },
  standard: { usd: 590, sek: 5900, nok: 6300, dkk: 4200 },
  pro: { usd: 1290, sek: 12900, nok: 13800, dkk: 9200 },
};

// Care plan prices (monthly)
export const carePlanMonthlyPrices: Record<string, PriceConfig> = {
  basic: { usd: 25, sek: 249, nok: 269, dkk: 179 },
  standard: { usd: 45, sek: 449, nok: 479, dkk: 319 },
  pro: { usd: 75, sek: 749, nok: 799, dkk: 529 },
};

// Care plan prices (yearly - 20% discount)
export const carePlanYearlyPrices: Record<string, PriceConfig> = {
  basic: { usd: 20, sek: 199, nok: 215, dkk: 145 },
  standard: { usd: 36, sek: 359, nok: 385, dkk: 259 },
  pro: { usd: 60, sek: 599, nok: 639, dkk: 429 },
};

// Add-on prices
export const addonPrices: Record<string, PriceConfig> = {
  booking: { usd: 200, sek: 1990, nok: 2130, dkk: 1420 },
  adminPanel: { usd: 100, sek: 990, nok: 1060, dkk: 710 },
  verification: { usd: 50, sek: 499, nok: 535, dkk: 359 },
  checkout: { usd: 50, sek: 499, nok: 535, dkk: 359 },
};

// Get currency based on language
export function getCurrencyFromLang(lang: string): Currency {
  switch (lang) {
    case 'no': return 'NOK';
    case 'dk': return 'DKK';
    case 'en': return 'USD';
    default: return 'SEK';
  }
}

// Map display currency to Stripe checkout currency (only SEK and USD supported in Stripe)
export function toStripeCurrency(currency: Currency): StripeCurrency {
  return (currency === 'USD') ? 'USD' : 'SEK';
}

// Format price with currency symbol
export function formatPrice(amount: number, currency: Currency): string {
  switch (currency) {
    case 'USD': return `$${amount.toLocaleString('en-US')}`;
    case 'NOK': return `${amount.toLocaleString('nb-NO')} kr`;
    case 'DKK': return `${amount.toLocaleString('da-DK')} kr`;
    default: return `${amount.toLocaleString('sv-SE')} kr`;
  }
}

// Get currency symbol for display
export function getCurrencySymbol(currency: Currency): string {
  return currency === 'USD' ? '$' : 'kr';
}

// Helper to pick price from config based on currency
function pickPrice(config: PriceConfig, currency: Currency): number {
  switch (currency) {
    case 'USD': return config.usd;
    case 'NOK': return config.nok;
    case 'DKK': return config.dkk;
    default: return config.sek;
  }
}

// Get package price
export function getPackagePrice(packageId: string, currency: Currency): number {
  const prices = packagePrices[packageId];
  if (!prices) return 0;
  return pickPrice(prices, currency);
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
  return pickPrice(prices, currency);
}

// Get care plan price display string
export function getCarePlanPriceDisplay(planId: string, isYearly: boolean, currency: Currency): string {
  const price = getCarePlanPrice(planId, isYearly, currency);
  return `${formatPrice(price, currency)}/${currency === 'USD' ? 'mo' : 'mån'}`;
}

// Get addon price
export function getAddonPrice(addonId: string, currency: Currency): number {
  const prices = addonPrices[addonId];
  if (!prices) return 0;
  return pickPrice(prices, currency);
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
      usd: 'price_1SsvMI74JfaAfHsdKccBn8r0',
      sek: 'price_1Ss9kD74JfaAfHsdYOiPQ9B8',
    },
    standard: {
      usd: 'price_1SsvMK74JfaAfHsdWF41mVKv',
      sek: 'price_1Ss9h474JfaAfHsdGHSjCHPa',
    },
    pro: {
      usd: 'price_1SsvMM74JfaAfHsdrLoJpRoP',
      sek: 'price_1SoVft74JfaAfHsdMxKuptCm',
    },
  },
  carePlans: {
    basic: {
      monthly: { usd: 'price_1SsvMV74JfaAfHsdMeGyB3Og', sek: 'price_1ShZ2W74JfaAfHsdZwoAI3AM' },
      yearly: { usd: 'price_1SsvMZ74JfaAfHsdsr8ZRvGg', sek: 'price_1ShZ2074JfaAfHsdGOu9YrQQ' },
    },
    standard: {
      monthly: { usd: 'price_1SsvMW74JfaAfHsdGVZko9Jo', sek: 'price_1ShZ3974JfaAfHsdJRyNwKZF' },
      yearly: { usd: 'price_1SsvMa74JfaAfHsd2TF1U2oD', sek: 'price_1ShZ2g74JfaAfHsdD4t1jtDb' },
    },
    pro: {
      monthly: { usd: 'price_1SsvMX74JfaAfHsdf6yGoEYB', sek: 'price_1ShZ3V74JfaAfHsdFTHkwZfX' },
      yearly: { usd: 'price_1SsvMb74JfaAfHsdZ339wqWK', sek: 'price_1ShZ3F74JfaAfHsdWNdB6gHU' },
    },
  },
  addons: {
    booking: { usd: 'price_1SsvMO74JfaAfHsd3KoBGuu2', sek: 'price_1SoVfz74JfaAfHsdcM6g7gyq' },
    adminPanel: { usd: 'price_1SsvMP74JfaAfHsdhszpXick', sek: 'price_1SoVg074JfaAfHsdCfjHTSR4' },
    verification: { usd: 'price_1SsvMR74JfaAfHsd4qoTlOHC', sek: 'price_1SpHJu74JfaAfHsdl0Vp76On' },
    checkout: { usd: 'price_1SsvMQ74JfaAfHsdU0jCEali', sek: 'price_1Ss7lg74JfaAfHsdnKn2RQjt' },
  },
};

// Get Stripe price ID for package (NOK/DKK fall back to SEK at checkout)
export function getPackageStripePriceId(packageId: string, currency: Currency): string {
  const priceIds = stripePriceIds.packages[packageId as keyof typeof stripePriceIds.packages];
  if (!priceIds) return '';
  const sc = toStripeCurrency(currency);
  return sc === 'USD' ? priceIds.usd : priceIds.sek;
}

// Get Stripe price ID for care plan
export function getCarePlanStripePriceId(planId: string, isYearly: boolean, currency: Currency): string {
  const plan = stripePriceIds.carePlans[planId as keyof typeof stripePriceIds.carePlans];
  if (!plan) return '';
  const period = isYearly ? 'yearly' : 'monthly';
  const sc = toStripeCurrency(currency);
  return sc === 'USD' ? plan[period].usd : plan[period].sek;
}

// Get Stripe price ID for addon
export function getAddonStripePriceId(addonId: string, currency: Currency): string {
  const priceIds = stripePriceIds.addons[addonId as keyof typeof stripePriceIds.addons];
  if (!priceIds) return '';
  const sc = toStripeCurrency(currency);
  return sc === 'USD' ? priceIds.usd : priceIds.sek;
}
