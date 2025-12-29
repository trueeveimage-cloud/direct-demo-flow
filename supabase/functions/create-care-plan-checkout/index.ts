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

    console.log("[CREATE-CARE-PLAN-CHECKOUT] Request validated", { carePlanId, isYearly, email: email ? "provided" : "none" });

    const planPrices = CARE_PLAN_PRICES[carePlanId];
    const priceId = isYearly ? planPrices.yearly : planPrices.monthly;

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

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

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: `${safeOrigin}/betalning-klar?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${safeOrigin}/betalning-avbruten`,
      metadata: {
        carePlanId,
        isYearly: String(isYearly),
      },
    });

    console.log("[CREATE-CARE-PLAN-CHECKOUT] Checkout session created", { sessionId: session.id });

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
