// ==========================================
// STRIPE PAYMENT LINKS CONFIGURATION
// ==========================================
// Replace these placeholder URLs with your actual Stripe Payment Links
// These are the ONLY places you need to update Stripe links

export const STRIPE_LINKS = {
  // Verification fee (500 kr) - "Get your concept" flow
  VERIFICATION_500: 'https://buy.stripe.com/PLACEHOLDER_VERIFICATION_500',
  
  // Package one-time payments - "Direct order" flow
  STARTER: 'https://buy.stripe.com/PLACEHOLDER_STARTER_4900',
  STANDARD: 'https://buy.stripe.com/PLACEHOLDER_STANDARD_7900',
  PRO: 'https://buy.stripe.com/PLACEHOLDER_PRO_12900',
  
  // Care plan subscriptions (monthly)
  CARE_BASIC_MONTHLY: 'https://buy.stripe.com/PLACEHOLDER_CARE_BASIC_MONTHLY',
  CARE_STANDARD_MONTHLY: 'https://buy.stripe.com/PLACEHOLDER_CARE_STANDARD_MONTHLY',
  CARE_PRO_MONTHLY: 'https://buy.stripe.com/PLACEHOLDER_CARE_PRO_MONTHLY',
  
  // Care plan subscriptions (yearly)
  CARE_BASIC_YEARLY: 'https://buy.stripe.com/PLACEHOLDER_CARE_BASIC_YEARLY',
  CARE_STANDARD_YEARLY: 'https://buy.stripe.com/PLACEHOLDER_CARE_STANDARD_YEARLY',
  CARE_PRO_YEARLY: 'https://buy.stripe.com/PLACEHOLDER_CARE_PRO_YEARLY',
} as const;

// Helper to get package payment link
export function getPackageStripeLink(packageId: string): string {
  switch (packageId) {
    case 'starter':
      return STRIPE_LINKS.STARTER;
    case 'standard':
      return STRIPE_LINKS.STANDARD;
    case 'pro':
      return STRIPE_LINKS.PRO;
    default:
      return STRIPE_LINKS.STANDARD;
  }
}

// Helper to get care plan payment link
export function getCarePlanStripeLink(carePlanId: string, isYearly: boolean): string {
  if (isYearly) {
    switch (carePlanId) {
      case 'basic':
        return STRIPE_LINKS.CARE_BASIC_YEARLY;
      case 'standard':
        return STRIPE_LINKS.CARE_STANDARD_YEARLY;
      case 'pro':
        return STRIPE_LINKS.CARE_PRO_YEARLY;
      default:
        return STRIPE_LINKS.CARE_STANDARD_YEARLY;
    }
  } else {
    switch (carePlanId) {
      case 'basic':
        return STRIPE_LINKS.CARE_BASIC_MONTHLY;
      case 'standard':
        return STRIPE_LINKS.CARE_STANDARD_MONTHLY;
      case 'pro':
        return STRIPE_LINKS.CARE_PRO_MONTHLY;
      default:
        return STRIPE_LINKS.CARE_STANDARD_MONTHLY;
    }
  }
}

// Local storage key for verification payment status
export const VERIFICATION_PAID_KEY = 'nomia_verification_paid';

// Check if verification has been paid
export function hasVerificationPaid(): boolean {
  return localStorage.getItem(VERIFICATION_PAID_KEY) === 'true';
}

// Mark verification as paid
export function setVerificationPaid(): void {
  localStorage.setItem(VERIFICATION_PAID_KEY, 'true');
}

// Clear verification paid status
export function clearVerificationPaid(): void {
  localStorage.removeItem(VERIFICATION_PAID_KEY);
}
