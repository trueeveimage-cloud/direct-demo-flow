import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Hardcoded admin credentials (should match frontend)
const ADMIN_EMAIL = '38kqgt@gmail.com';
const ADMIN_PASSWORD = 'Guemir1453';

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ADMIN-GET-SUBMISSIONS] ${step}${detailsStr}`);
};

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");
    
    const { email, password } = await req.json();
    
    logStep("Checking credentials", { email });
    
    // Validate credentials
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      logStep("Invalid credentials");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    logStep("Credentials valid, fetching data");

    // Initialize Supabase client with service role key to bypass RLS
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch all data in parallel
    const [contactResult, conceptResult, ordersResult] = await Promise.all([
      supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100),
      supabase
        .from('concept_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100),
      supabase
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
