import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  "https://nomia.se",
  "https://www.nomia.se",
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

// Simple hash for IP anonymization
async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + "reset-admin-salt");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("").substring(0, 16);
}

const MAX_ATTEMPTS = 3;
const LOCKOUT_MINUTES = 60;

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Block requests from non-allowed origins
  if (!isAllowedOrigin(origin)) {
    console.log("[RESET-ADMIN-PASSWORD] Blocked request from unauthorized origin", { origin });
    return new Response(
      JSON.stringify({ error: "Forbidden" }),
      { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false }
    });

    // --- Server-side rate limiting ---
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("cf-connecting-ip") || "unknown";
    const ipHash = await hashIP(clientIP);
    const endpoint = "reset-admin-password";

    // Clean up old attempts
    await supabase.from("rate_limit_attempts")
      .delete()
      .lt("attempted_at", new Date(Date.now() - LOCKOUT_MINUTES * 60 * 1000).toISOString());

    // Check recent attempts
    const cutoff = new Date(Date.now() - LOCKOUT_MINUTES * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("rate_limit_attempts")
      .select("*", { count: "exact", head: true })
      .eq("endpoint", endpoint)
      .eq("ip_hash", ipHash)
      .gte("attempted_at", cutoff);

    if ((count ?? 0) >= MAX_ATTEMPTS) {
      console.log("[RESET-ADMIN-PASSWORD] Rate limited", { ipHash });
      return new Response(JSON.stringify({ error: "Too many attempts. Try again later." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 429,
      });
    }

    // Get the admin email and new password from request
    const { email, newPassword, adminSecret } = await req.json();
    
    // Secure secret check using environment variable
    const expectedSecret = Deno.env.get("ADMIN_RESET_SECRET");
    if (!expectedSecret || adminSecret !== expectedSecret) {
      // Record failed attempt
      await supabase.from("rate_limit_attempts").insert({
        endpoint,
        ip_hash: ipHash,
      });

      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      });
    }

    // Require a strong password - no fallback allowed
    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 12) {
      return new Response(JSON.stringify({ error: "Password must be at least 12 characters" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Get admin email from environment variable
    const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL");
    if (!ADMIN_EMAIL) {
      console.error("[RESET-ADMIN-PASSWORD] ADMIN_EMAIL environment variable not set");
      return new Response(JSON.stringify({ error: "Server misconfiguration" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    if (email !== ADMIN_EMAIL) {
      // Record failed attempt for wrong email too
      await supabase.from("rate_limit_attempts").insert({
        endpoint,
        ip_hash: ipHash,
      });

      return new Response(JSON.stringify({ error: "Invalid email" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Find the user by email
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      throw new Error(`Failed to list users: ${listError.message}`);
    }

    const adminUser = users.users.find(u => u.email === email);
    
    if (!adminUser) {
      // User doesn't exist, create them
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: email,
        password: newPassword,
        email_confirm: true,
      });

      if (createError) {
        throw new Error(`Failed to create user: ${createError.message}`);
      }

      console.log("[RESET-ADMIN-PASSWORD] Created new admin user", { userId: newUser.user?.id });
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Admin user created with password",
        userId: newUser.user?.id 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Update the user's password
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      adminUser.id,
      { password: newPassword }
    );

    if (updateError) {
      throw new Error(`Failed to update password: ${updateError.message}`);
    }

    console.log("[RESET-ADMIN-PASSWORD] Password reset successful", { userId: adminUser.id });

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Password reset successful",
      userId: adminUser.id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[RESET-ADMIN-PASSWORD] Error", { message: errorMessage });
    return new Response(JSON.stringify({ error: "An unexpected error occurred" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
