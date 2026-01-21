import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// HTML escape function to prevent XSS
function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: unknown) => {
  console.log(`[RECOVERY-EMAIL] ${step}`, details ? JSON.stringify(details) : '');
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Initialize Supabase with service role for full access
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find pending orders that:
    // 1. Were created between 24-72 hours ago
    // 2. Haven't been sent a recovery email yet
    // 3. Haven't been paid
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const seventyTwoHoursAgo = new Date(now.getTime() - 72 * 60 * 60 * 1000);

    const { data: pendingOrders, error: fetchError } = await supabase
      .from('order_submissions')
      .select('*')
      .eq('payment_status', 'pending')
      .is('recovery_email_sent_at', null)
      .lt('created_at', twentyFourHoursAgo.toISOString())
      .gt('created_at', seventyTwoHoursAgo.toISOString())
      .limit(10);

    if (fetchError) {
      logStep("Error fetching pending orders", { error: fetchError.message });
      throw fetchError;
    }

    logStep(`Found ${pendingOrders?.length || 0} pending orders to process`);

    if (!pendingOrders || pendingOrders.length === 0) {
      return new Response(
        JSON.stringify({ success: true, processed: 0 }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    let processed = 0;
    let failed = 0;

    for (const order of pendingOrders) {
      try {
        const safeName = escapeHtml(order.contact_person || order.business_name || 'there');
        const safeBusinessName = escapeHtml(order.business_name);
        const packageName = order.selected_package ? 
          (order.selected_package.charAt(0).toUpperCase() + order.selected_package.slice(1)) : 'Website';

        // Send recovery email
        const emailResponse = await resend.emails.send({
          from: "Nomia <no-reply@nomia.se>",
          to: [order.email],
          subject: `Din beställning väntar - ${safeBusinessName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="text-align: center; padding: 40px 20px; background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);">
                <h1 style="color: #fff; margin: 0; font-size: 32px;">NOMIA<span style="color: #f59e0b;">.</span></h1>
              </div>
              
              <div style="padding: 40px 20px;">
                <h2 style="color: #1a1a1a; margin-top: 0;">Hej ${safeName}!</h2>
                
                <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                  Vi såg att du påbörjade en beställning för <strong>${safeBusinessName}</strong> men inte slutförde betalningen.
                </p>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin: 24px 0;">
                  <h3 style="margin-top: 0; color: #1a1a1a;">Din order:</h3>
                  <p style="margin: 8px 0; color: #4a4a4a;"><strong>Paket:</strong> ${packageName}</p>
                  <p style="margin: 8px 0; color: #4a4a4a;"><strong>Pris:</strong> ${order.payment_amount || 'Se prislista'}</p>
                </div>
                
                <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                  Din beställning är sparad och redo att slutföras. Klicka på knappen nedan för att fortsätta:
                </p>
                
                <div style="text-align: center; margin: 32px 0;">
                  <a href="https://nomia.se/bestall" style="display: inline-block; background: #f59e0b; color: #000; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                    Slutför beställningen →
                  </a>
                </div>
                
                <p style="color: #6c757d; font-size: 14px; line-height: 1.6;">
                  Har du frågor? Svara på detta mail så hjälper vi dig!
                </p>
              </div>
              
              <div style="background: #1a1a1a; padding: 24px; text-align: center;">
                <p style="color: #9ca3af; margin: 0; font-size: 14px;">
                  Nomia - Professionella hemsidor för moderna företag<br>
                  Göteborg, Sverige
                </p>
              </div>
            </div>
          `,
        });

        logStep(`Sent recovery email to ${order.email}`, { emailId: emailResponse.data?.id });

        // Mark as sent
        const { error: updateError } = await supabase
          .from('order_submissions')
          .update({ recovery_email_sent_at: new Date().toISOString() })
          .eq('id', order.id);

        if (updateError) {
          logStep(`Failed to update order ${order.id}`, { error: updateError.message });
        }

        processed++;
      } catch (orderError) {
        logStep(`Failed to process order ${order.id}`, { error: (orderError as Error).message });
        failed++;
      }
    }

    logStep(`Completed: ${processed} sent, ${failed} failed`);

    return new Response(
      JSON.stringify({ success: true, processed, failed }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logStep("Error", { message: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
