import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderConfirmationRequest {
  email: string;
  customerName: string;
  packageName: string;
  packagePrice: string;
  businessName?: string;
  conceptLink?: string;
  addons?: string[];
  carePlan?: string;
  deliveryDays?: number;
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SEND-ORDER-CONFIRMATION] ${step}${detailsStr}`);
};

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");
    
    const { 
      email, 
      customerName, 
      packageName, 
      packagePrice,
      businessName,
      conceptLink,
      addons = [],
      carePlan,
      deliveryDays = 10
    }: OrderConfirmationRequest = await req.json();
    
    if (!email || !customerName || !packageName) {
      throw new Error("Missing required fields");
    }
    
    logStep("Sending order confirmation", { email, packageName });

    // Build addons HTML if any
    const addonsHtml = addons.length > 0 
      ? `<p style="margin: 8px 0;"><strong>Add-ons:</strong> ${addons.join(', ')}</p>` 
      : '';
    
    const carePlanHtml = carePlan 
      ? `<p style="margin: 8px 0;"><strong>Care Plan:</strong> ${carePlan}</p>` 
      : '';

    const conceptHtml = conceptLink
      ? `<p style="margin: 8px 0;"><strong>Concept Link:</strong> <a href="${conceptLink}" style="color: #f59e0b;">${conceptLink}</a></p>`
      : '';

    // Send confirmation to customer
    const customerEmailResponse = await resend.emails.send({
      from: "Nomia <no-reply@nomia.se>",
      to: [email],
      subject: `Order Confirmed - ${packageName} Website Package`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 40px 20px; background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);">
            <h1 style="color: #fff; margin: 0; font-size: 32px;">NOMIA<span style="color: #f59e0b;">.</span></h1>
          </div>
          
          <div style="padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="display: inline-block; background: #d4f4dd; color: #166534; padding: 8px 16px; border-radius: 20px; font-weight: bold;">
                ✓ Payment Confirmed
              </div>
            </div>
            
            <h2 style="color: #1a1a1a; margin-top: 0;">Thank you for your order, ${customerName}!</h2>
            <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
              We're excited to start working on your new website. Here's a summary of your order:
            </p>
            
            <div style="background: #f8f9fa; padding: 24px; border-radius: 12px; margin: 24px 0;">
              <h3 style="margin-top: 0; color: #1a1a1a; border-bottom: 2px solid #f59e0b; padding-bottom: 12px;">Order Details</h3>
              ${businessName ? `<p style="margin: 8px 0;"><strong>Business:</strong> ${businessName}</p>` : ''}
              <p style="margin: 8px 0;"><strong>Package:</strong> ${packageName}</p>
              <p style="margin: 8px 0;"><strong>Price:</strong> ${packagePrice}</p>
              ${addonsHtml}
              ${carePlanHtml}
              ${conceptHtml}
            </div>
            
            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 20px; border-radius: 12px; margin: 24px 0; text-align: center;">
              <p style="margin: 0; font-size: 18px; color: #92400e;">
                <strong>Estimated Delivery:</strong><br>
                <span style="font-size: 24px;">${deliveryDays} business days</span>
              </p>
            </div>
            
            <h3 style="color: #1a1a1a;">What happens next?</h3>
            <ol style="color: #4a4a4a; line-height: 2;">
              <li>We'll review your order and start working on your website</li>
              <li>You'll receive updates as we progress</li>
              <li>We'll send you a preview link for feedback</li>
              <li>After your approval, we'll launch your website!</li>
            </ol>
            
            <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
              If you have any questions, don't hesitate to reach out to us at <a href="mailto:nordicsite.help@gmail.com" style="color: #f59e0b;">nordicsite.help@gmail.com</a>
            </p>
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

    // Send notification to team
    const teamEmailResponse = await resend.emails.send({
      from: "Nomia Orders <no-reply@nomia.se>",
      to: ["nordicsite.help@gmail.com"],
      subject: `🎉 New Order: ${packageName} - ${customerName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #166534; background: #d4f4dd; padding: 20px; border-radius: 8px; text-align: center;">
            🎉 New Website Order!
          </h2>
          
          <div style="background: #f8f9fa; padding: 24px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Customer Details</h3>
            <p><strong>Name:</strong> ${customerName}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${businessName ? `<p><strong>Business:</strong> ${businessName}</p>` : ''}
          </div>
          
          <div style="background: #fff; border: 1px solid #e9ecef; padding: 24px; border-radius: 8px;">
            <h3 style="margin-top: 0;">Order Summary</h3>
            <p><strong>Package:</strong> ${packageName}</p>
            <p><strong>Price:</strong> ${packagePrice}</p>
            ${addons.length > 0 ? `<p><strong>Add-ons:</strong> ${addons.join(', ')}</p>` : ''}
            ${carePlan ? `<p><strong>Care Plan:</strong> ${carePlan}</p>` : ''}
            ${conceptLink ? `<p><strong>Concept:</strong> <a href="${conceptLink}">${conceptLink}</a></p>` : ''}
          </div>
          
          <p style="color: #6c757d; font-size: 12px; margin-top: 20px; text-align: center;">
            Time to start building! 🚀
          </p>
        </div>
      `,
    });

    logStep("Team notification sent", { teamEmailResponse });

    return new Response(
      JSON.stringify({ 
        success: true, 
        customerEmailId: customerEmailResponse.data?.id,
        teamEmailId: teamEmailResponse.data?.id 
      }), 
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    logStep("Error", { message: error.message });
    console.error("Error in send-order-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
