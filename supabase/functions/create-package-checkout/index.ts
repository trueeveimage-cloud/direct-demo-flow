import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

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

type Currency = 'SEK' | 'USD';

// USD Package price IDs
const PACKAGE_PRICES_USD_FULL: Record<string, string> = {
  starter: "price_1SsvMI74JfaAfHsdKccBn8r0",
  standard: "price_1SsvMK74JfaAfHsdWF41mVKv",
  pro: "price_1SsvMM74JfaAfHsdrLoJpRoP",
};

const PACKAGE_PRICES_USD_DISCOUNTED: Record<string, string> = {
  starter: "price_1SsvMJ74JfaAfHsdaaLyo31Q",
  standard: "price_1SsvML74JfaAfHsdhJW3xA6E",
  pro: "price_1SsvMN74JfaAfHsdyEx42PtA",
};

const PACKAGE_PRICES_SEK_FULL: Record<string, string> = {
  starter: "price_1Ss9kD74JfaAfHsdYOiPQ9B8",
  standard: "price_1Ss9h474JfaAfHsdGHSjCHPa",
  pro: "price_1SoVft74JfaAfHsdMxKuptCm",
};

const PACKAGE_PRICES_SEK_DISCOUNTED: Record<string, string> = {
  starter: "price_1Ss9kG74JfaAfHsdzCs1Bjb0",
  standard: "price_1Ss9h674JfaAfHsd0NFDdcsu",
  pro: "price_1SoVfy74JfaAfHsdvxed2nJ0",
};

const BOOKING_ADDON_PRICE_USD = "price_1SsvMO74JfaAfHsd3KoBGuu2";
const BOOKING_ADDON_PRICE_SEK = "price_1SoVfz74JfaAfHsdcM6g7gyq";
const ADMIN_PANEL_PRICE_USD = "price_1SsvMP74JfaAfHsdhszpXick";
const ADMIN_PANEL_PRICE_SEK = "price_1SoVg074JfaAfHsdCfjHTSR4";
const CHECKOUT_ADDON_PRICE_USD = "price_1SsvMQ74JfaAfHsdU0jCEali";
const CHECKOUT_ADDON_PRICE_SEK = "price_1Ss7lg74JfaAfHsdnKn2RQjt";

const CARE_PLAN_MONTHLY_USD: Record<string, string> = {
  basic: "price_1SsvMV74JfaAfHsdMeGyB3Og",
  standard: "price_1SsvMW74JfaAfHsdGVZko9Jo",
  pro: "price_1SsvMX74JfaAfHsdf6yGoEYB",
};

const CARE_PLAN_MONTHLY_SEK: Record<string, string> = {
  basic: "price_1ShZ2W74JfaAfHsdZwoAI3AM",
  standard: "price_1ShZ3974JfaAfHsdJRyNwKZF",
  pro: "price_1ShZ3V74JfaAfHsdFTHkwZfX",
};

const CARE_PLAN_YEARLY_USD: Record<string, string> = {
  basic: "price_1SsvMZ74JfaAfHsdsr8ZRvGg",
  standard: "price_1SsvMa74JfaAfHsd2TF1U2oD",
  pro: "price_1SsvMb74JfaAfHsdZ339wqWK",
};

const CARE_PLAN_YEARLY_SEK: Record<string, string> = {
  basic: "price_1ShZ2074JfaAfHsdGOu9YrQQ",
  standard: "price_1ShZ2g74JfaAfHsdD4t1jtDb",
  pro: "price_1ShZ3F74JfaAfHsdWNdB6gHU",
};

// Countries with 0% VAT
const NON_VAT_COUNTRIES = ['US', 'CA', 'AU', 'GB'];
const EU_COUNTRIES = ['SE', 'NO', 'DK', 'FI', 'DE', 'NL', 'FR', 'ES', 'IT', 'BE', 'AT', 'PL', 'PT', 'IE'];

function getPackagePriceId(packageId: string, currency: Currency, isPostDemoFlow: boolean): string {
  if (currency === 'SEK') {
    return isPostDemoFlow ? PACKAGE_PRICES_SEK_DISCOUNTED[packageId] : PACKAGE_PRICES_SEK_FULL[packageId];
  }
  return isPostDemoFlow ? PACKAGE_PRICES_USD_DISCOUNTED[packageId] : PACKAGE_PRICES_USD_FULL[packageId];
}

function getBookingAddonPriceId(currency: Currency): string {
  return currency === 'SEK' ? BOOKING_ADDON_PRICE_SEK : BOOKING_ADDON_PRICE_USD;
}

function getAdminPanelPriceId(currency: Currency): string {
  return currency === 'SEK' ? ADMIN_PANEL_PRICE_SEK : ADMIN_PANEL_PRICE_USD;
}

function getCheckoutAddonPriceId(currency: Currency): string {
  return currency === 'SEK' ? CHECKOUT_ADDON_PRICE_SEK : CHECKOUT_ADDON_PRICE_USD;
}

function getCarePlanPriceId(planId: string, isYearly: boolean, currency: Currency): string | null {
  if (!planId || planId === 'skip') return null;
  if (isYearly) {
    return currency === 'SEK' ? CARE_PLAN_YEARLY_SEK[planId] : CARE_PLAN_YEARLY_USD[planId];
  }
  return currency === 'SEK' ? CARE_PLAN_MONTHLY_SEK[planId] : CARE_PLAN_MONTHLY_USD[planId];
}

// Get or create a 25% Swedish VAT tax rate
async function getOrCreateVatTaxRate(stripe: Stripe): Promise<string> {
  const existingRates = await stripe.taxRates.list({ limit: 100, active: true });
  const vatRate = existingRates.data.find(
    (rate: Stripe.TaxRate) => rate.percentage === 25 && rate.display_name.toLowerCase().includes("vat") && rate.inclusive === false
  );
  if (vatRate) return vatRate.id;
  
  const newRate = await stripe.taxRates.create({
    display_name: "VAT",
    description: "Swedish VAT 25%",
    percentage: 25,
    inclusive: false,
    country: "SE",
  });
  return newRate.id;
}

// Determine if VAT should be applied based on country and customer type
function shouldApplyVat(
  currency: Currency,
  customerCountry: string,
  customerType: string | null,
  vatVerified: boolean
): boolean {
  // USD currency = no VAT (international market)
  if (currency === 'USD') return false;
  
  // Non-VAT countries = no VAT
  if (NON_VAT_COUNTRIES.includes(customerCountry)) return false;
  
  // SEK currency rules:
  // Private customers = 25% Swedish VAT
  if (customerType === 'private') return true;
  
  // Swedish business = 25% Swedish VAT
  if (customerType === 'business' && customerCountry === 'SE') return true;
  
  // EU B2B with verified VAT = Reverse charge (0% VAT)
  if (customerType === 'business' && EU_COUNTRIES.includes(customerCountry) && vatVerified) return false;
  
  // EU B2B without verified VAT = 25% Swedish VAT
  if (customerType === 'business' && EU_COUNTRIES.includes(customerCountry) && !vatVerified) return true;
  
  // Default: no VAT for non-EU countries
  return false;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const body = await req.json();
    if (!isValidPackageId(body.packageId)) {
      return new Response(JSON.stringify({ error: "Invalid package ID" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const packageId = body.packageId;
    const email = body.email && isValidEmail(body.email) ? body.email : undefined;
    const carePlanId = sanitizeString(body.carePlanId, 20);
    const isYearly = body.isYearly === true;
    const wantsBooking = body.wantsBooking === true;
    const bookingAddonCost = typeof body.bookingAddonCost === "number" ? body.bookingAddonCost : 0;
    const addedAdminPanel = body.addedAdminPanel === true;
    const isPostDemoFlow = body.isPostDemoFlow === true;
    const currency: Currency = body.currency === "SEK" ? "SEK" : "USD";
    const customerType = body.customerType === "private" || body.customerType === "business" ? body.customerType : null;
    const vatVerified = body.vatVerified === true;
    const customerCountry = sanitizeString(body.country, 5) || (currency === 'SEK' ? 'SE' : 'US');

    const carePlanPriceId = getCarePlanPriceId(carePlanId, isYearly, currency);
    const hasCarePlan = !!carePlanPriceId;
    const priceId = getPackagePriceId(packageId, currency, isPostDemoFlow);

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Apply VAT only when appropriate
    const applyVat = shouldApplyVat(currency, customerCountry, customerType, vatVerified);
    let taxRateId: string | null = null;
    if (applyVat) {
      taxRateId = await getOrCreateVatTaxRate(stripe);
    }

    console.log("[CREATE-PACKAGE-CHECKOUT] VAT decision", { 
      currency, customerCountry, customerType, vatVerified, applyVat, taxRateId 
    });

    let customerId: string | undefined;
    if (email) {
      const customers = await stripe.customers.list({ email, limit: 1 });
      if (customers.data.length > 0) customerId = customers.data[0].id;
    }

    interface LineItemType { price: string; quantity: number; tax_rates?: string[]; }
    const lineItems: LineItemType[] = [];

    lineItems.push({
      price: priceId,
      quantity: 1,
      ...(taxRateId ? { tax_rates: [taxRateId] } : {}),
    });

    if (wantsBooking && packageId !== "pro" && bookingAddonCost > 0) {
      lineItems.push({
        price: getBookingAddonPriceId(currency),
        quantity: 1,
        ...(taxRateId ? { tax_rates: [taxRateId] } : {}),
      });
    }

    if (addedAdminPanel) {
      lineItems.push({
        price: getAdminPanelPriceId(currency),
        quantity: 1,
        ...(taxRateId ? { tax_rates: [taxRateId] } : {}),
      });
    }

    if (body.wantsCheckoutSystem === true && packageId === "starter") {
      lineItems.push({
        price: getCheckoutAddonPriceId(currency),
        quantity: 1,
        ...(taxRateId ? { tax_rates: [taxRateId] } : {}),
      });
    }

    if (hasCarePlan && carePlanPriceId) {
      lineItems.push({
        price: carePlanPriceId,
        quantity: 1,
        ...(taxRateId ? { tax_rates: [taxRateId] } : {}),
      });
    }

    const mode: "payment" | "subscription" = hasCarePlan ? "subscription" : "payment";
    const origin = req.headers.get("origin") || "https://nomia.se";
    
    const successUrl = new URL(`${origin}/betalning-klar`);
    successUrl.searchParams.set("session_id", "{CHECKOUT_SESSION_ID}");

    const metadata = {
      packageId,
      carePlanId: carePlanId || "",
      customerType: customerType || "private",
      customerCountry,
      vatApplied: String(applyVat),
      currency,
    };

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : email,
      ...(mode === 'payment' && !customerId ? { customer_creation: 'always' } : {}),
      billing_address_collection: 'required',
      line_items: lineItems,
      mode,
      allow_promotion_codes: true,
      success_url: successUrl.toString(),
      cancel_url: `${origin}/betalning-avbruten`,
      tax_id_collection: { enabled: true },
      metadata,
      ...(mode === 'subscription' ? { subscription_data: { metadata } } : {}),
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("[CREATE-PACKAGE-CHECKOUT] Error", error);
    return new Response(JSON.stringify({ error: String(error) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
