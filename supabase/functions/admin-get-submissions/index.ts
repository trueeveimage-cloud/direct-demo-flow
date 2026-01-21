import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = [
  "https://nomia.se",
  "https://www.nomia.se",
  "https://direct-demo-flow.lovable.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

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
  };
}

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ADMIN-GET-SUBMISSIONS] ${step}${detailsStr}`);
};

serve(async (req: Request): Promise<Response> => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");
    
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      logStep("Missing or invalid authorization header");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create Supabase client with user's token
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      logStep("Auth error or no user", { error: authError?.message });
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    logStep("User authenticated", { email: user.email });

    // Check if user is admin via database function
    const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin_user');
    if (adminError || isAdmin !== true) {
      logStep("Not an admin", { isAdmin, error: adminError?.message });
      return new Response(
        JSON.stringify({ error: "Forbidden - admin access required" }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    logStep("Admin verified, fetching data");

    // Use service role key to bypass RLS for data fetching
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseService = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch all data in parallel
    const [contactResult, conceptResult, ordersResult] = await Promise.all([
      supabaseService
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100),
      supabaseService
        .from('concept_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100),
      supabaseService
        .from('order_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
    ]);

    if (contactResult.error) {
      logStep("Error fetching contact submissions", { error: contactResult.error.message });
    }
    if (conceptResult.error) {
      logStep("Error fetching concept requests", { error: conceptResult.error.message });
    }
    if (ordersResult.error) {
      logStep("Error fetching order submissions", { error: ordersResult.error.message });
    }

    // Transform and merge submissions with type indicator
    const contactSubmissions = (contactResult.data || []).map(s => ({ ...s, type: 'contact' }));
    const conceptRequests = (conceptResult.data || []).map(s => ({ ...s, type: 'concept' }));
    const orderSubmissions = (ordersResult.data || []).map(s => ({ ...s, type: 'order' }));

    // Combine all and sort by date
    const allSubmissions = [...contactSubmissions, ...conceptRequests, ...orderSubmissions]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    logStep("Returning submissions", { 
      contactCount: contactSubmissions.length, 
      conceptCount: conceptRequests.length,
      orderCount: orderSubmissions.length
    });

    return new Response(
      JSON.stringify({ 
        submissions: allSubmissions,
        counts: {
          contact: contactSubmissions.length,
          concept: conceptRequests.length,
          orders: orderSubmissions.length
        }
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("Error", { message: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
