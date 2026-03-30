import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function escapeHtml(text: string): string {
  if (!text) return '';
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify admin auth
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the user is admin using their JWT
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data: adminCheck } = await supabase.from("admin_users").select("id").eq("email", user.email).single();
    if (!adminCheck) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { to, customerName, subject, message, originalMessage } = await req.json();

    if (!to || !message || !subject) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const safeName = escapeHtml(customerName || "");
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");
    const safeOriginal = originalMessage ? escapeHtml(originalMessage).replace(/\n/g, "<br>") : "";

    const emailResponse = await resend.emails.send({
      from: "Nomia <no-reply@nomia.se>",
      replyTo: "nordicsite.help@gmail.com",
      to: [to],
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 32px 20px; background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);">
            <h1 style="color: #fff; margin: 0; font-size: 28px;">NOMIA<span style="color: #f59e0b;">.</span></h1>
          </div>
          <div style="padding: 32px 20px;">
            <h2 style="color: #1a1a1a; margin-top: 0;">Hi ${safeName}!</h2>
            <div style="color: #4a4a4a; font-size: 15px; line-height: 1.7;">
              ${safeMessage}
            </div>
            ${safeOriginal ? `
            <div style="margin-top: 24px; padding: 16px; background: #f3f4f6; border-left: 3px solid #d1d5db; border-radius: 4px;">
              <p style="color: #6b7280; font-size: 12px; margin: 0 0 8px 0; font-weight: 600;">Your original message:</p>
              <p style="color: #6b7280; font-size: 13px; margin: 0; line-height: 1.5;">${safeOriginal}</p>
            </div>` : ""}
          </div>
          <div style="background: #1a1a1a; padding: 24px; text-align: center;">
            <p style="color: #9ca3af; margin: 0; font-size: 13px;">
              Nomia – Professional Websites for Modern Businesses<br>Gothenburg, Sweden
            </p>
          </div>
        </div>
      `,
    });

    console.log("[SEND-ADMIN-REPLY] Email sent", { to, emailId: emailResponse.data?.id });

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.data?.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("[SEND-ADMIN-REPLY] Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
