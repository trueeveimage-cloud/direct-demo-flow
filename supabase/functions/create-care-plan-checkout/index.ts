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
function isValidCarePlanId(id: unknown): id is string {
  return typeof id === "string" && ["basic", "standard", "pro"].includes(id);
}

function isValidEmail(email: unknown): email is string {
  if (typeof email !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

// Care plan price IDs from Stripe (EUR)
const CARE_PLAN_PRICES: Record<string, { monthly: string; yearly: string }> = {
  basic: {
    monthly: "price_1SjVDL74JfaAfHsd1i1pFby6",  // €25/month
    yearly: "price_1SjVDP74JfaAfHsdsgUuSbuU",   // €240/year
  },
  standard: {
    monthly: "price_1SjVDM74JfaAfHsdOemLHRqh", // €45/month
    yearly: "price_1SjVDR74JfaAfHsduWagejHS",  // €432/year
  },
  pro: {
    monthly: "price_1SjVDO74JfaAfHsdfwTpnk0Y", // €75/month
    yearly: "price_1SjVDS74JfaAfHsdwdQM3Seh",  // €720/year
  },
};

interface CheckoutRequest {
  carePlanId: string;
  isYearly: boolean;
  email?: string;
  customerType?: 'private' | 'business';
  vatVerified?: boolean;
  country?: string;
}

// Helper to get or create a 25% VAT tax rate
async function getOrCreateVatTaxRate(stripe: Stripe): Promise<string> {
  const existingRates = await stripe.taxRates.list({ limit: 100, active: true });
  const vatRate = existingRates.data.find(
    (rate: Stripe.TaxRate) => rate.percentage === 25 && rate.display_name.toLowerCase().includes("vat") && rate.inclusive === false
  );
  
  if (vatRate) {
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
  
  return newRate.id;
}

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);
  
  console.log("[CREATE-CARE-PLAN-CHECKOUT] Function started", { origin });

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 405,
    });
  }

  // Validate origin
  if (!isAllowedOrigin(origin)) {
    console.error("[CREATE-CARE-PLAN-CHECKOUT] Invalid origin", { origin });
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 403,
    });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.error("[CREATE-CARE-PLAN-CHECKOUT] STRIPE_SECRET_KEY not set");
      throw new Error("STRIPE_SECRET_KEY is not set");
    }

    // Parse and validate request body
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

    // Validate required fields
    if (!isValidCarePlanId(requestData.carePlanId)) {
      console.error("[CREATE-CARE-PLAN-CHECKOUT] Invalid care plan ID", { carePlanId: requestData.carePlanId });
      return new Response(JSON.stringify({ error: "Invalid care plan ID" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const carePlanId = requestData.carePlanId;
    const isYearly = requestData.isYearly === true;
    const email = requestData.email && isValidEmail(requestData.email) ? requestData.email : undefined;
    const customerType = requestData.customerType === "private" || requestData.customerType === "business" 
      ? requestData.customerType : "private";
    const vatVerified = requestData.vatVerified === true;
    const customerCountry = typeof requestData.country === "string" ? requestData.country : "SE";

    console.log("[CREATE-CARE-PLAN-CHECKOUT] Request validated", { 
      carePlanId, 
      isYearly, 
      email: email ? "provided" : "none",
      customerType,
      vatVerified,
      customerCountry
    });

    const planPrices = CARE_PLAN_PRICES[carePlanId];
    const priceId = isYearly ? planPrices.yearly : planPrices.monthly;

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Determine if VAT should be applied
    const shouldApplyVat = customerType === "private" || 
      (customerType === "business" && customerCountry === "SE") ||
      (customerType === "business" && !vatVerified);

    let taxRateId: string | null = null;
    if (shouldApplyVat) {
      taxRateId = await getOrCreateVatTaxRate(stripe);
      console.log("[CREATE-CARE-PLAN-CHECKOUT] Will apply VAT tax rate", { taxRateId });
    } else {
      console.log("[CREATE-CARE-PLAN-CHECKOUT] No VAT (reverse charge for EU B2B)");
    }

    // Check for existing customer
    let customerId: string | undefined;
    if (email) {
      const customers = await stripe.customers.list({ email, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        console.log("[CREATE-CARE-PLAN-CHECKOUT] Found existing customer", { customerId });
      }
    }

    const safeOrigin = origin || "https://nomia.se";

    // Build line items with tax rates for subscriptions
    const lineItems: Array<{ price: string; quantity: number; tax_rates?: string[] }> = [
      {
        price: priceId,
        quantity: 1,
        ...(taxRateId ? { tax_rates: [taxRateId] } : {}),
      },
    ];

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      customer_email: customerId ? undefined : email,
      customer_creation: customerId ? undefined : 'always',
      billing_address_collection: 'required',
      line_items: lineItems,
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: `${safeOrigin}/betalning-klar?session_id={CHECKOUT_SESSION_ID}&care_complete=true`,
      cancel_url: `${safeOrigin}/betalning-avbruten`,
      tax_id_collection: { enabled: true },
      subscription_data: {
        metadata: {
          carePlanId,
          isYearly: String(isYearly),
          vatApplied: String(shouldApplyVat),
        },
      },
      metadata: {
        carePlanId,
        isYearly: String(isYearly),
        customerType,
        vatApplied: String(shouldApplyVat),
      },
    };

    const session = await stripe.checkout.sessions.create(sessionConfig);

    console.log("[CREATE-CARE-PLAN-CHECKOUT] Checkout session created", { 
      sessionId: session.id,
      vatApplied: shouldApplyVat 
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[CREATE-CARE-PLAN-CHECKOUT] Error", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
