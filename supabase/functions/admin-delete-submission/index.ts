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
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  };
}

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[admin-delete-submission] ${step}${detailsStr}`);
};

interface DeleteItem {
  id: string;
  type: 'contact' | 'order' | 'concept';
}

serve(async (req: Request): Promise<Response> => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Starting deletion request");

    // Get the auth header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      logStep("No authorization header");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create Supabase client with user's token
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    // First verify the user is authenticated and is an admin
    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: adminCheck, error: adminError } = await userClient.rpc('is_admin_user');
    
    if (adminError || adminCheck !== true) {
      logStep("Not an admin user", { adminCheck, adminError });
      return new Response(JSON.stringify({ error: "Unauthorized - admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    logStep("Admin verified, processing request");

    // Parse request body - support both single item and batch deletion
    const body = await req.json();
    
    let items: DeleteItem[] = [];
    
    // Support both old format (single item) and new format (batch)
    if (body.items && Array.isArray(body.items)) {
      items = body.items;
    } else if (body.submissionId && body.submissionType) {
      // Legacy single-item format
      items = [{ id: body.submissionId, type: body.submissionType }];
    }
    
    if (items.length === 0) {
      return new Response(JSON.stringify({ error: "No items to delete" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    logStep("Deleting items", { count: items.length });

    // Use service role to delete (bypasses RLS)
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    const results = { success: 0, failed: 0, errors: [] as string[] };

    for (const item of items) {
      try {
        let deleteResult;
        
        if (item.type === 'contact') {
          deleteResult = await adminClient.from('contact_submissions').delete().eq('id', item.id);
        } else if (item.type === 'order') {
          deleteResult = await adminClient.from('order_submissions').delete().eq('id', item.id);
        } else if (item.type === 'concept') {
          deleteResult = await adminClient.from('concept_requests').delete().eq('id', item.id);
        } else {
          results.failed++;
          results.errors.push(`Invalid type for item ${item.id}`);
          continue;
        }

        if (deleteResult.error) {
          results.failed++;
          results.errors.push(`Failed to delete ${item.id}: ${deleteResult.error.message}`);
        } else {
          results.success++;
        }
      } catch (err) {
        results.failed++;
        results.errors.push(`Error deleting ${item.id}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    logStep("Deletion complete", results);

    return new Response(JSON.stringify({ 
      success: true, 
      deleted: results.success,
      failed: results.failed,
      errors: results.errors.length > 0 ? results.errors : undefined
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    logStep("Unexpected error", { message: error.message });
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
