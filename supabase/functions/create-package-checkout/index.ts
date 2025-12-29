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
  if (origin.includes("lovableproject.com") || origin.includes("lovable.dev")) {
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

function isValidCarePlanId(id: unknown): id is string {
  return typeof id === "string" && ["basic", "standard", "pro"].includes(id);
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

// Package price IDs from Stripe (one-time payments in EUR)
const PACKAGE_PRICES: Record<string, string> = {
  starter: "price_1Shc6N74JfaAfHsdaVZU5rQL",   // €440 (€490 - €50 deposit)
  standard: "price_1Shc6274JfaAfHsdSQEMwWZ0", // €740 (€790 - €50 deposit)
  pro: "price_1Shc5k74JfaAfHsdT7xzOxfA",      // €1,240 (€1,290 - €50 deposit)
};

// Booking add-on price ID from Stripe (€200 one-time)
const BOOKING_ADDON_PRICE_ID = "price_1Shhqd74JfaAfHsdN70mmlQ8"; // €200 booking add-on

// Care plan price IDs from Stripe (subscriptions in EUR)
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
  businessType?: string;
  websiteGoal?: string;
  primaryColor?: string;
  accentColor?: string;
  services?: string;
}

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);
  
  console.log("[CREATE-PACKAGE-CHECKOUT] Function started", { origin });

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
    const carePlanId = isValidCarePlanId(requestData.carePlanId) ? requestData.carePlanId : undefined;
    const isYearly = requestData.isYearly === true;
    const wantsBooking = requestData.wantsBooking === true;
    const bookingAddonCost = typeof requestData.bookingAddonCost === "number" ? requestData.bookingAddonCost : 0;
    
    // Additional metadata fields
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
      bookingAddonCost
    });

    const priceId = PACKAGE_PRICES[packageId];

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Check for existing customer
    let customerId: string | undefined;
    if (email) {
      const customers = await stripe.customers.list({ email, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        console.log("[CREATE-PACKAGE-CHECKOUT] Found existing customer", { customerId });
      }
    }

    const safeOrigin = origin || "https://nomia.se";
    
    // Build line items - always include the package
    const lineItems: Array<{ price: string; quantity: number }> = [
      {
        price: priceId,
        quantity: 1,
      },
    ];

    // Add booking add-on if selected and not Pro package (Pro includes booking)
    if (wantsBooking && packageId !== "pro" && bookingAddonCost > 0) {
      lineItems.push({
        price: BOOKING_ADDON_PRICE_ID,
        quantity: 1,
      });
      console.log("[CREATE-PACKAGE-CHECKOUT] Added booking add-on to checkout", { bookingAddonCost });
    }

    // Determine checkout mode - if care plan is selected, we need subscription mode
    let mode: "payment" | "subscription" = "payment";
    
    // Add care plan subscription if selected
    if (carePlanId && CARE_PLAN_PRICES[carePlanId]) {
      const carePlanPrices = CARE_PLAN_PRICES[carePlanId];
      const carePlanPriceId = isYearly ? carePlanPrices.yearly : carePlanPrices.monthly;
      lineItems.push({
        price: carePlanPriceId,
        quantity: 1,
      });
      mode = "subscription"; // Switch to subscription mode when care plan is included
      console.log("[CREATE-PACKAGE-CHECKOUT] Added care plan to checkout", { carePlanId, isYearly, carePlanPriceId });
    }
    
    // Build success URL with metadata
    const successUrl = new URL(`${safeOrigin}/betalning-klar`);
    successUrl.searchParams.set("session_id", "{CHECKOUT_SESSION_ID}");
    if (conceptLink) successUrl.searchParams.set("concept", encodeURIComponent(conceptLink));

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : email,
      line_items: lineItems,
      mode,
      allow_promotion_codes: true,
      success_url: successUrl.toString(),
      cancel_url: `${safeOrigin}/betalning-avbruten`,
      metadata: {
        packageId,
        conceptLink: conceptLink || "",
        carePlanId: carePlanId || "",
        isYearly: String(isYearly),
        wantsBooking: String(wantsBooking),
        bookingAddonIncluded: packageId === "pro" ? "included" : (wantsBooking ? "addon" : "none"),
        businessName,
        contactPerson,
        phone,
        selectedStyle,
        selectedLanguage,
        businessType,
        websiteGoal,
        primaryColor,
        accentColor,
        services: services.slice(0, 500), // Stripe metadata limit
      },
    });

    console.log("[CREATE-PACKAGE-CHECKOUT] Checkout session created", { sessionId: session.id });

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