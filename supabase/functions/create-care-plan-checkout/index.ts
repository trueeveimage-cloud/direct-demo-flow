import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Care plan price IDs from Stripe
const CARE_PLAN_PRICES: Record<string, { monthly: string; yearly: string }> = {
  basic: {
    monthly: "price_1ShZ2W74JfaAfHsdZwoAI3AM",  // 249 kr/month
    yearly: "price_1ShZ0L74JfaAfHsd2ZD8f0jx",   // Note: This has wrong price in Stripe
  },
  standard: {
    monthly: "price_1ShZ3974JfaAfHsdJRyNwKZF", // 449 kr/month
    yearly: "price_1ShZ1A74JfaAfHsdbIkMmI0K",  // 4,300 kr/year
  },
  pro: {
    monthly: "price_1ShZ3V74JfaAfHsdFTHkwZfX", // 749 kr/month
    yearly: "price_1ShZ2574JfaAfHsdGOu9YrQQ",  // 7,190 kr/year
  },
};

interface CheckoutRequest {
  carePlanId: string;
  isYearly: boolean;
  email?: string;
}

serve(async (req) => {
  console.log("[CREATE-CARE-PLAN-CHECKOUT] Function started");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.error("[CREATE-CARE-PLAN-CHECKOUT] STRIPE_SECRET_KEY not set");
      throw new Error("STRIPE_SECRET_KEY is not set");
    }

    const { carePlanId, isYearly, email }: CheckoutRequest = await req.json();
    console.log("[CREATE-CARE-PLAN-CHECKOUT] Request received", { carePlanId, isYearly, email });

    const planPrices = CARE_PLAN_PRICES[carePlanId];
    if (!planPrices) {
      console.error("[CREATE-CARE-PLAN-CHECKOUT] Invalid care plan ID", { carePlanId });
      throw new Error(`Invalid care plan ID: ${carePlanId}`);
    }

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

    const origin = req.headers.get("origin") || "https://lovable.dev";

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
      success_url: `${origin}/betalning-klar?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/betalning-avbruten`,
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
