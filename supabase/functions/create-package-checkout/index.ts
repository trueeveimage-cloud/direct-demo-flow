import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

// Allowed origins for CORS - restrict to your domains
const ALLOWED_ORIGINS = [
  "https://nomia.se",
  "https://www.nomia.se",
  "http://localhost:5173",
  "http://localhost:3000",
];

// Helper to validate origin
function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  // Allow Lovable preview domains
  if (origin.includes("lovableproject.com") || origin.includes("lovable.dev") || origin.includes("lovable.app")) {
    return true;
  }
  return ALLOWED_ORIGINS.some(allowed => origin === allowed || origin.startsWith(allowed));
}

function getCorsHeaders(origin: string | null) {
  const allowedOrigin = isAllowedOrigin(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin!,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

// Input validation helpers
function isValidPackageId(id: unknown): id is string {
  return typeof id === "string" && ["starter", "standard", "pro"].includes(id);
}

function isValidEmail(email: unknown): email is string {
  if (typeof email !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

function sanitizeString(str: unknown, maxLength = 500): string {
  if (typeof str !== "string") return "";
  return str.slice(0, maxLength).replace(/[<>]/g, "");
}

type Currency = 'SEK' | 'EUR';

// EUR Package price IDs from Stripe (one-time payments) - NET prices (without VAT)
const PACKAGE_PRICES_EUR_FULL: Record<string, string> = {
  starter: "price_1SmXpy74JfaAfHsddlqED2cw",   // €490 full price
  standard: "price_1SmXpz74JfaAfHsdvEqVaKSi", // €790 full price
  pro: "price_1SmXq074JfaAfHsdjKigI9Qr",      // €1,290 full price
};

const PACKAGE_PRICES_EUR_DISCOUNTED: Record<string, string> = {
  starter: "price_1Shc6N74JfaAfHsdaVZU5rQL",   // €440 (€490 - €50 deposit)
  standard: "price_1Shc6274JfaAfHsdSQEMwWZ0", // €740 (€790 - €50 deposit)
  pro: "price_1Shc5k74JfaAfHsdT7xzOxfA",      // €1,240 (€1,290 - €50 deposit)
};

// SEK Package price IDs from Stripe (one-time payments) - NET prices (without VAT)
const PACKAGE_PRICES_SEK_FULL: Record<string, string> = {
  starter: "price_1SqNLk74JfaAfHsdWQs79hL9",   // 2900 kr full price (UPDATED)
  standard: "price_1SoVfs74JfaAfHsdvR4tgHMF", // 7900 kr full price
  pro: "price_1SoVft74JfaAfHsdMxKuptCm",      // 12900 kr full price
};

const PACKAGE_PRICES_SEK_DISCOUNTED: Record<string, string> = {
  starter: "price_1SoVfv74JfaAfHsdqEKOpoDO",   // 2401 kr (2900 - 499 deposit) - needs updating in Stripe
  standard: "price_1SoVfw74JfaAfHsdUP3t0xEK", // 7401 kr (7900 - 499 deposit)
  pro: "price_1SoVfy74JfaAfHsdvxed2nJ0",      // 12401 kr (12900 - 499 deposit)
};

// Booking add-on price IDs from Stripe
const BOOKING_ADDON_PRICE_EUR = "price_1Shhqd74JfaAfHsdN70mmlQ8"; // €200 booking add-on
const BOOKING_ADDON_PRICE_SEK = "price_1SoVfz74JfaAfHsdcM6g7gyq"; // 1990 kr booking add-on

// Admin panel add-on price IDs from Stripe
const ADMIN_PANEL_PRICE_EUR = "price_1SjVDH74JfaAfHsdJ2bpHabL"; // €100 admin panel add-on
const ADMIN_PANEL_PRICE_SEK = "price_1SoVg074JfaAfHsdCfjHTSR4"; // 990 kr admin panel add-on

// Care plan price IDs from Stripe (monthly)
const CARE_PLAN_MONTHLY_EUR: Record<string, string> = {
  basic: "price_1SjVDL74JfaAfHsd1i1pFby6",    // €25/mo
  standard: "price_1SjVDM74JfaAfHsdOemLHRqh", // €45/mo
  pro: "price_1SjVDO74JfaAfHsdfwTpnk0Y",       // €75/mo
};

const CARE_PLAN_MONTHLY_SEK: Record<string, string> = {
  basic: "price_1ShZ2W74JfaAfHsdZwoAI3AM",    // 249 kr/mo
  standard: "price_1ShZ3974JfaAfHsdJRyNwKZF", // 449 kr/mo
  pro: "price_1ShZ3V74JfaAfHsdFTHkwZfX",       // 749 kr/mo
};

// Care plan price IDs from Stripe (yearly)
const CARE_PLAN_YEARLY_EUR: Record<string, string> = {
  basic: "price_1SjVDP74JfaAfHsdsgUuSbuU",    // €240/yr (€20/mo)
  standard: "price_1SjVDR74JfaAfHsduWagejHS", // €432/yr (€36/mo)
  pro: "price_1SjVDS74JfaAfHsdwdQM3Seh",       // €720/yr (€60/mo)
};

const CARE_PLAN_YEARLY_SEK: Record<string, string> = {
  basic: "price_1ShZ2074JfaAfHsdGOu9YrQQ",    // 2388 kr/yr (199 kr/mo)
  standard: "price_1ShZ2g74JfaAfHsdD4t1jtDb", // 4308 kr/yr (359 kr/mo)
  pro: "price_1ShZ3F74JfaAfHsdWNdB6gHU",       // 7188 kr/yr (599 kr/mo)
};

interface CheckoutRequest {
  packageId: string;
  email?: string;
  businessName?: string;
  contactPerson?: string;
  phone?: string;
  selectedStyle?: string;
  selectedLanguage?: string;
  conceptLink?: string;
  carePlanId?: string;
  isYearly?: boolean;
  wantsBooking?: boolean;
  bookingAddonCost?: number;
  addedAdminPanel?: boolean;
  isPostDemoFlow?: boolean;
  businessType?: string;
  websiteGoal?: string;
  primaryColor?: string;
  accentColor?: string;
  services?: string;
  customerType?: 'private' | 'business' | null;
  companyName?: string;
  orgNumber?: string;
  vatNumber?: string;
  vatVerified?: boolean;
  country?: string;
  currency?: 'SEK' | 'EUR';
}

// Helper to get or create a 25% VAT tax rate
async function getOrCreateVatTaxRate(stripe: Stripe): Promise<string> {
  const existingRates = await stripe.taxRates.list({ limit: 100, active: true });
  const vatRate = existingRates.data.find(
    (rate: Stripe.TaxRate) => rate.percentage === 25 && rate.display_name.toLowerCase().includes("vat") && rate.inclusive === false
  );
  
  if (vatRate) {
    console.log("[CREATE-PACKAGE-CHECKOUT] Found existing VAT tax rate", { id: vatRate.id });
    return vatRate.id;
  }
  
  const newRate = await stripe.taxRates.create({
    display_name: "VAT",
    description: "Swedish VAT 25%",
    percentage: 25,
    inclusive: false,
    country: "SE",
    jurisdiction: "Sweden",
  });
  
  console.log("[CREATE-PACKAGE-CHECKOUT] Created new VAT tax rate", { id: newRate.id });
  return newRate.id;
}

// Get correct price IDs based on currency
function getPackagePriceId(packageId: string, currency: Currency, isPostDemoFlow: boolean): string {
  if (currency === 'SEK') {
    return isPostDemoFlow ? PACKAGE_PRICES_SEK_DISCOUNTED[packageId] : PACKAGE_PRICES_SEK_FULL[packageId];
  }
  return isPostDemoFlow ? PACKAGE_PRICES_EUR_DISCOUNTED[packageId] : PACKAGE_PRICES_EUR_FULL[packageId];
}

function getBookingAddonPriceId(currency: Currency): string {
  return currency === 'SEK' ? BOOKING_ADDON_PRICE_SEK : BOOKING_ADDON_PRICE_EUR;
}

function getAdminPanelPriceId(currency: Currency): string {
  return currency === 'SEK' ? ADMIN_PANEL_PRICE_SEK : ADMIN_PANEL_PRICE_EUR;
}

function getCarePlanPriceId(planId: string, isYearly: boolean, currency: Currency): string | null {
  if (!planId || planId === 'skip') return null;
  
  if (isYearly) {
    return currency === 'SEK' 
      ? CARE_PLAN_YEARLY_SEK[planId] 
      : CARE_PLAN_YEARLY_EUR[planId];
  }
  return currency === 'SEK' 
    ? CARE_PLAN_MONTHLY_SEK[planId] 
    : CARE_PLAN_MONTHLY_EUR[planId];
}

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);
  
  console.log("[CREATE-PACKAGE-CHECKOUT] Function started", { origin });

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 405,
    });
  }

  if (!isAllowedOrigin(origin)) {
    console.error("[CREATE-PACKAGE-CHECKOUT] Invalid origin", { origin });
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 403,
    });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.error("[CREATE-PACKAGE-CHECKOUT] STRIPE_SECRET_KEY not set");
      throw new Error("STRIPE_SECRET_KEY is not set");
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const requestData = body as Record<string, unknown>;
    
    if (!isValidPackageId(requestData.packageId)) {
      console.error("[CREATE-PACKAGE-CHECKOUT] Invalid package ID", { packageId: requestData.packageId });
      return new Response(JSON.stringify({ error: "Invalid package ID" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const packageId = requestData.packageId;
    const email = requestData.email && isValidEmail(requestData.email) ? requestData.email : undefined;
    const conceptLink = sanitizeString(requestData.conceptLink, 2000);
    const carePlanId = sanitizeString(requestData.carePlanId, 20);
    const isYearly = requestData.isYearly === true;
    const wantsBooking = requestData.wantsBooking === true;
    const bookingAddonCost = typeof requestData.bookingAddonCost === "number" ? requestData.bookingAddonCost : 0;
    const addedAdminPanel = requestData.addedAdminPanel === true;
    const isPostDemoFlow = requestData.isPostDemoFlow === true;
    
    // Currency - default to EUR if not specified
    const currency: Currency = requestData.currency === "SEK" ? "SEK" : "EUR";
    
    const customerType = requestData.customerType === "private" || requestData.customerType === "business" 
      ? requestData.customerType : null;
    const vatNumber = sanitizeString(requestData.vatNumber, 50);
    const vatVerified = requestData.vatVerified === true;
    const customerCountry = sanitizeString(requestData.country, 5) || "SE";
    const orgNumber = sanitizeString(requestData.orgNumber, 50);
    
    const businessName = sanitizeString(requestData.businessName, 200);
    const contactPerson = sanitizeString(requestData.contactPerson, 200);
    const phone = sanitizeString(requestData.phone, 50);
    const selectedStyle = sanitizeString(requestData.selectedStyle, 50);
    const selectedLanguage = sanitizeString(requestData.selectedLanguage, 20);
    const businessType = sanitizeString(requestData.businessType, 100);
    const websiteGoal = sanitizeString(requestData.websiteGoal, 100);
    const primaryColor = sanitizeString(requestData.primaryColor, 50);
    const accentColor = sanitizeString(requestData.accentColor, 50);
    const services = sanitizeString(requestData.services, 2000);

    console.log("[CREATE-PACKAGE-CHECKOUT] Request validated", { 
      packageId, 
      email: email ? "provided" : "none", 
      carePlanId, 
      isYearly,
      wantsBooking,
      bookingAddonCost,
      addedAdminPanel,
      isPostDemoFlow,
      customerType,
      vatVerified,
      customerCountry,
      currency
    });

    // Get the correct price ID based on currency and flow type
    const priceId = getPackagePriceId(packageId, currency, isPostDemoFlow);

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // VAT logic
    const shouldApplyVat = customerType === "private" || 
      (customerType === "business" && customerCountry === "SE") ||
      (customerType === "business" && !vatVerified);

    let taxRateId: string | null = null;
    if (shouldApplyVat) {
      taxRateId = await getOrCreateVatTaxRate(stripe);
      console.log("[CREATE-PACKAGE-CHECKOUT] Will apply VAT tax rate", { taxRateId });
    } else {
      console.log("[CREATE-PACKAGE-CHECKOUT] No VAT (reverse charge for EU B2B)", { vatVerified, customerCountry });
    }

    let customerId: string | undefined;
    if (email) {
      const customers = await stripe.customers.list({ email, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        console.log("[CREATE-PACKAGE-CHECKOUT] Found existing customer", { customerId });
      }
    }

    const safeOrigin = origin || "https://nomia.se";
    
    const lineItems: Array<{ price: string; quantity: number; tax_rates?: string[] }> = [
      {
        price: priceId,
        quantity: 1,
        ...(taxRateId ? { tax_rates: [taxRateId] } : {}),
      },
    ];

    // Add booking add-on if selected and not Pro package
    if (wantsBooking && packageId !== "pro" && bookingAddonCost > 0) {
      lineItems.push({
        price: getBookingAddonPriceId(currency),
        quantity: 1,
        ...(taxRateId ? { tax_rates: [taxRateId] } : {}),
      });
      console.log("[CREATE-PACKAGE-CHECKOUT] Added booking add-on to checkout", { bookingAddonCost, currency });
    }

    // Add admin panel add-on if selected
    if (addedAdminPanel) {
      lineItems.push({
        price: getAdminPanelPriceId(currency),
        quantity: 1,
        ...(taxRateId ? { tax_rates: [taxRateId] } : {}),
      });
      console.log("[CREATE-PACKAGE-CHECKOUT] Added admin panel add-on to checkout", { currency });
    }

    // IMPORTANT: Care plans are billed separately as subscriptions, NOT included in the package checkout
    // This is because care plans have recurring prices which require mode: "subscription"
    // The care plan should be handled in a separate checkout flow after the initial package purchase
    const carePlanPriceId = getCarePlanPriceId(carePlanId, isYearly, currency);
    if (carePlanPriceId) {
      // Log that care plan was selected but will be handled separately
      console.log("[CREATE-PACKAGE-CHECKOUT] Care plan selected but will be billed separately", { carePlanId, isYearly, currency });
    }

    const mode: "payment" = "payment";
    
    const successUrl = new URL(`${safeOrigin}/betalning-klar`);
    successUrl.searchParams.set("session_id", "{CHECKOUT_SESSION_ID}");
    if (conceptLink) successUrl.searchParams.set("concept", encodeURIComponent(conceptLink));
    if (carePlanId) {
      successUrl.searchParams.set("care_plan", carePlanId);
      successUrl.searchParams.set("care_yearly", String(isYearly));
    }

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      customer_email: customerId ? undefined : email,
      customer_creation: customerId ? undefined : 'always',
      customer_update: customerId ? { name: 'auto', address: 'auto' } : undefined,
      billing_address_collection: 'required',
      line_items: lineItems,
      mode,
      allow_promotion_codes: true,
      success_url: successUrl.toString(),
      cancel_url: `${safeOrigin}/betalning-avbruten`,
      tax_id_collection: { enabled: true },
      metadata: {
        packageId,
        conceptLink: (conceptLink || "").slice(0, 500),
        carePlanId: carePlanId || "",
        isYearly: String(isYearly),
        wantsBooking: String(wantsBooking),
        bookingAddonIncluded: packageId === "pro" ? "included" : (wantsBooking ? "addon" : "none"),
        adminPanelIncluded: String(addedAdminPanel),
        customerType: customerType || "private",
        vatNumber: vatNumber || "",
        vatVerified: String(vatVerified),
        customerCountry: customerCountry,
        orgNumber: orgNumber || "",
        businessName: businessName.slice(0, 500),
        contactPerson: contactPerson.slice(0, 500),
        phone,
        selectedStyle,
        selectedLanguage,
        businessType,
        websiteGoal,
        primaryColor,
        accentColor,
        services: services.slice(0, 500),
        vatApplied: String(shouldApplyVat),
        currency: currency,
      },
    };

    const session = await stripe.checkout.sessions.create(sessionConfig);

    console.log("[CREATE-PACKAGE-CHECKOUT] Checkout session created", { 
      sessionId: session.id,
      vatApplied: shouldApplyVat,
      taxRateId,
      currency
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[CREATE-PACKAGE-CHECKOUT] Error", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
