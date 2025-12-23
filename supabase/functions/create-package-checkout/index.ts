import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Package price IDs from Stripe (one-time payments)
const PACKAGE_PRICES: Record<string, string> = {
  starter: "price_1ShYyX74JfaAfHsd9Bsgi0bK",   // 4,900 kr
  standard: "price_1ShYyp74JfaAfHsdLj5pMJLF", // 7,900 kr
  pro: "price_1ShYz774JfaAfHsdpobK6ORT",      // 12,900 kr
};

// Care plan price IDs from Stripe (subscriptions)
const CARE_PLAN_PRICES: Record<string, { monthly: string; yearly: string }> = {
  basic: {
    monthly: "price_1ShZ2W74JfaAfHsdZwoAI3AM",  // 249 kr/month
    yearly: "price_1ShZ0L74JfaAfHsd2ZD8f0jx",   // yearly
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
  packageId: string;
  email?: string;
  conceptLink?: string;
  carePlanId?: string;
  isYearly?: boolean;
}

serve(async (req) => {
  console.log("[CREATE-PACKAGE-CHECKOUT] Function started");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.error("[CREATE-PACKAGE-CHECKOUT] STRIPE_SECRET_KEY not set");
      throw new Error("STRIPE_SECRET_KEY is not set");
    }

    const { packageId, email, conceptLink, carePlanId, isYearly }: CheckoutRequest = await req.json();
    console.log("[CREATE-PACKAGE-CHECKOUT] Request received", { packageId, email, carePlanId, isYearly });

    const priceId = PACKAGE_PRICES[packageId];
    if (!priceId) {
      console.error("[CREATE-PACKAGE-CHECKOUT] Invalid package ID", { packageId });
      throw new Error(`Invalid package ID: ${packageId}`);
    }

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

    const origin = req.headers.get("origin") || "https://lovable.dev";
    
    // Build line items - always include the package
    const lineItems: Array<{ price: string; quantity: number }> = [
      {
        price: priceId,
        quantity: 1,
      },
    ];

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
    const successUrl = new URL(`${origin}/betalning-klar`);
    successUrl.searchParams.set("session_id", "{CHECKOUT_SESSION_ID}");
    if (conceptLink) successUrl.searchParams.set("concept", encodeURIComponent(conceptLink));

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : email,
      line_items: lineItems,
      mode,
      success_url: successUrl.toString(),
      cancel_url: `${origin}/betalning-avbruten`,
      metadata: {
        packageId,
        conceptLink: conceptLink || "",
        carePlanId: carePlanId || "",
        isYearly: String(isYearly || false),
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
