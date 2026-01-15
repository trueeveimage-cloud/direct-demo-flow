import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// HTML escape function to prevent XSS in email content
function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  "https://nomia.se",
  "https://www.nomia.se",
  "http://localhost:5173",
  "http://localhost:3000",
];

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  // Allow Lovable preview domains
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

interface ContactEmailRequest {
  name: string;
  email: string;
  message: string;
  contactReason: string;
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SEND-CONTACT-EMAIL] ${step}${detailsStr}`);
};

serve(async (req: Request): Promise<Response> => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Block requests from non-allowed origins
  if (!isAllowedOrigin(origin)) {
    logStep("Blocked request from unauthorized origin", { origin });
    return new Response(
      JSON.stringify({ error: "Forbidden" }),
      {
        status: 403,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  try {
    logStep("Function started");
    
    const { name, email, message, contactReason }: ContactEmailRequest = await req.json();
    
    if (!name || !email || !message) {
      throw new Error("Missing required fields: name, email, or message");
    }
    
    logStep("Received contact form submission", { name, email, contactReason });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Save submission to database
    const { error: dbError } = await supabase
      .from('contact_submissions')
      .insert({
        name,
        email,
        message,
        contact_reason: contactReason || 'general-question',
      });

    if (dbError) {
      logStep("Database insert error", { error: dbError.message });
      // Continue anyway - still send notification
    } else {
      logStep("Submission saved to database");
    }

    // Map contact reason to readable text
    const reasonLabels: Record<string, string> = {
      'concept-received': 'I received my concept',
      'general-question': 'General question',
      'pricing': 'Question about pricing',
      'support': 'Support / Help',
      'partnership': 'Partnership',
      'other': 'Other',
    };
    const reasonText = reasonLabels[contactReason] || contactReason;

    // Sanitize user inputs before embedding in HTML
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);

    // Send SHORT notification to the team (just that a submission came in)
    const teamEmailResponse = await resend.emails.send({
      from: "Nomia Contact <no-reply@nomia.se>",
      to: ["nordicsite.help@gmail.com"],
      subject: `📬 New Submission: ${reasonText}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a;">New Contact Form Submission</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>From:</strong> ${safeName} (${safeEmail})</p>
            <p><strong>Reason:</strong> ${reasonText}</p>
          </div>
          <div style="text-align: center; margin: 24px 0;">
            <a href="https://nomia.se/admin" style="display: inline-block; background: #f59e0b; color: #000; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold;">
              View in Admin Dashboard →
            </a>
          </div>
          <p style="color: #6c757d; font-size: 12px; margin-top: 20px;">
            Log in to the admin dashboard to read the full message and respond.
          </p>
        </div>
      `,
    });

    logStep("Team notification sent", { teamEmailResponse });

    // Send confirmation to the customer
    const customerEmailResponse = await resend.emails.send({
      from: "Nomia <no-reply@nomia.se>",
      to: [email],
      subject: "We received your message - Nomia",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 40px 20px; background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);">
            <h1 style="color: #fff; margin: 0; font-size: 32px;">NOMIA<span style="color: #f59e0b;">.</span></h1>
          </div>
          
          <div style="padding: 40px 20px;">
            <h2 style="color: #1a1a1a; margin-top: 0;">Hi ${safeName}!</h2>
            <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
              Thank you for reaching out to us. We've received your message and will get back to you within 24 hours.
            </p>
            
            <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
              In the meantime, feel free to check out our website for more information about our services.
            </p>
            
            <div style="text-align: center; margin: 32px 0;">
              <a href="https://nomia.se" style="display: inline-block; background: #f59e0b; color: #000; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold;">
                Visit Our Website
              </a>
            </div>
          </div>
          
          <div style="background: #1a1a1a; padding: 24px; text-align: center;">
            <p style="color: #9ca3af; margin: 0; font-size: 14px;">
              Nomia - Professional Websites for Modern Businesses<br>
              Gothenburg, Sweden
            </p>
          </div>
        </div>
      `,
    });

    logStep("Customer confirmation sent", { customerEmailResponse });

    return new Response(
      JSON.stringify({ 
        success: true, 
        teamEmailId: teamEmailResponse.data?.id,
        customerEmailId: customerEmailResponse.data?.id 
      }), 
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    logStep("Error", { message: error.message });
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});