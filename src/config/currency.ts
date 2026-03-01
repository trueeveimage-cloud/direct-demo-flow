// Currency configuration based on language selection
// SEK for Swedish, USD for English (targeting US market)

export type Currency = 'SEK' | 'USD';

// Exchange rate: 1 USD = ~10.5 SEK (approximate, can be adjusted)
const USD_TO_SEK_RATE = 10.5;

export interface PriceConfig {
  usd: number;
  sek: number;
}

// Package prices
export const packagePrices: Record<string, PriceConfig> = {
  starter: { usd: 290, sek: 2900 },
  standard: { usd: 590, sek: 5900 },
  pro: { usd: 1290, sek: 12900 },
};

// Care plan prices (monthly)
export const carePlanMonthlyPrices: Record<string, PriceConfig> = {
  basic: { usd: 25, sek: 249 },
  standard: { usd: 45, sek: 449 },
  pro: { usd: 75, sek: 749 },
};

// Care plan prices (yearly - 20% discount)
export const carePlanYearlyPrices: Record<string, PriceConfig> = {
  basic: { usd: 20, sek: 199 },
  standard: { usd: 36, sek: 359 },
  pro: { usd: 60, sek: 599 },
};

// Add-on prices
export const addonPrices: Record<string, PriceConfig> = {
  booking: { usd: 200, sek: 1990 },
  adminPanel: { usd: 100, sek: 990 },
  verification: { usd: 50, sek: 499 },
  checkout: { usd: 50, sek: 499 },
};

// Get currency based on language
export function getCurrencyFromLang(lang: string): Currency {
  // Scandinavian countries use SEK pricing, others use USD
  return (lang === 'sv' || lang === 'no' || lang === 'dk') ? 'SEK' : 'USD';
}

// Format price with currency symbol
export function formatPrice(amount: number, currency: Currency): string {
  if (currency === 'USD') {
    return `$${amount.toLocaleString('en-US')}`;
  } else {
    return `${amount.toLocaleString('sv-SE')} kr`;
  }
}

// Get package price
export function getPackagePrice(packageId: string, currency: Currency): number {
  const prices = packagePrices[packageId];
  if (!prices) return 0;
  return currency === 'USD' ? prices.usd : prices.sek;
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
  return currency === 'USD' ? prices.usd : prices.sek;
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
  return currency === 'USD' ? prices.usd : prices.sek;
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

// Get Stripe price ID for package
export function getPackageStripePriceId(packageId: string, currency: Currency): string {
  const priceIds = stripePriceIds.packages[packageId as keyof typeof stripePriceIds.packages];
  if (!priceIds) return '';
  return currency === 'USD' ? priceIds.usd : priceIds.sek;
}

// Get Stripe price ID for care plan
export function getCarePlanStripePriceId(planId: string, isYearly: boolean, currency: Currency): string {
  const plan = stripePriceIds.carePlans[planId as keyof typeof stripePriceIds.carePlans];
  if (!plan) return '';
  const period = isYearly ? 'yearly' : 'monthly';
  return currency === 'USD' ? plan[period].usd : plan[period].sek;
}

// Get Stripe price ID for addon
export function getAddonStripePriceId(addonId: string, currency: Currency): string {
  const priceIds = stripePriceIds.addons[addonId as keyof typeof stripePriceIds.addons];
  if (!priceIds) return '';
  return currency === 'USD' ? priceIds.usd : priceIds.sek;
}
