import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const ALLOWED_ORIGINS = [
  "https://nomia.se",
  "https://www.nomia.se",
  "http://localhost:5173",
  "http://localhost:3000",
];

function isAllowedOrigin(origin: string | null) {
  if (!origin) return false;
  if (origin.includes("lovableproject.com") || origin.includes("lovable.dev") || origin.includes("lovable.app")) return true;
  return ALLOWED_ORIGINS.includes(origin);
}

function corsHeaders(origin: string | null) {
  return {
    "Access-Control-Allow-Origin": isAllowedOrigin(origin) ? origin! : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

serve(async (req) => {
  const origin = req.headers.get("origin");
  const headers = corsHeaders(origin);

  if (req.method === "OPTIONS") return new Response(null, { headers });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }
  if (!isAllowedOrigin(origin)) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json() as { sessionId?: unknown };
    const sessionId = typeof body.sessionId === "string" ? body.sessionId : "";
    if (!/^cs_(test_|live_)?[A-Za-z0-9_]+$/.test(sessionId) || sessionId.length > 255) {
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const checkoutType = session.metadata?.type === "verification_fee"
      ? "verification_fee"
      : session.metadata?.packageId
        ? "package_order"
        : session.metadata?.carePlanId
          ? "care_plan"
          : null;
    const paid = session.payment_status === "paid" && checkoutType !== null;

    return new Response(JSON.stringify({
      paid,
      type: checkoutType,
      orderId: checkoutType ? session.metadata?.orderId || null : null,
      amountTotal: paid ? session.amount_total : null,
      currency: paid ? session.currency?.toUpperCase() || null : null,
    }), {
      status: paid ? 200 : 402,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[VERIFY-CHECKOUT-SESSION] Verification failed", {
      message: error instanceof Error ? error.message : String(error),
    });
    return new Response(JSON.stringify({ error: "Unable to verify payment" }), {
      status: 500,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }
});
