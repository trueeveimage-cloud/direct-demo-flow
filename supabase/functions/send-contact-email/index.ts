import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");
    
    const { name, email, message, contactReason }: ContactEmailRequest = await req.json();
    
    if (!name || !email || !message) {
      throw new Error("Missing required fields: name, email, or message");
    }
    
    logStep("Received contact form submission", { name, email, contactReason });

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

    // Send notification to the team
    const teamEmailResponse = await resend.emails.send({
      from: "Nomia Contact <no-reply@nomia.se>",
      to: ["nordicsite.help@gmail.com"],
      reply_to: email,
      subject: `New Contact: ${reasonText} - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a;">New Contact Form Submission</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Reason:</strong> ${reasonText}</p>
          </div>
          <div style="background: #fff; border: 1px solid #e9ecef; padding: 20px; border-radius: 8px;">
            <h3 style="margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <p style="color: #6c757d; font-size: 12px; margin-top: 20px;">
            Reply directly to this email to respond to the customer.
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
            <h2 style="color: #1a1a1a; margin-top: 0;">Hi ${name}!</h2>
            <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
              Thank you for reaching out to us. We've received your message and will get back to you within 24 hours.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #f59e0b;">
              <p style="margin: 0; color: #4a4a4a; font-style: italic;">"${message.substring(0, 200)}${message.length > 200 ? '...' : ''}"</p>
            </div>
            
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
