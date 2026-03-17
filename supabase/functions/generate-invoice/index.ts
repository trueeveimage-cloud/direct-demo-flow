import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// HTML escape function
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
  console.log(`[GENERATE-INVOICE] ${step}`, details ? JSON.stringify(details) : '');
};

interface InvoiceRequest {
  orderId: string;
  stripePaymentIntentId?: string;
}

serve(async (req: Request): Promise<Response> => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Block requests from non-allowed origins
  if (!isAllowedOrigin(origin)) {
    console.log("[GENERATE-INVOICE] Blocked request from unauthorized origin", { origin });
    return new Response(
      JSON.stringify({ error: "Forbidden" }),
      { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  try {
    logStep("Function started");

    const { orderId, stripePaymentIntentId }: InvoiceRequest = await req.json();

    if (!orderId) {
      throw new Error("Order ID is required");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch order details
    const { data: order, error: orderError } = await supabase
      .from('order_submissions')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      throw new Error(`Order not found: ${orderError?.message}`);
    }

    logStep("Order found", { email: order.email, package: order.selected_package });

    // Check if invoice already exists
    const { data: existingInvoice } = await supabase
      .from('invoices')
      .select('id, invoice_number')
      .eq('order_id', orderId)
      .single();

    if (existingInvoice) {
      logStep("Invoice already exists", { invoiceNumber: existingInvoice.invoice_number });
      return new Response(
        JSON.stringify({ success: true, invoiceNumber: existingInvoice.invoice_number, alreadyExists: true }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Generate invoice number (NOM-YYYYMMDD-XXXX)
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const { count } = await supabase
      .from('invoices')
      .select('id', { count: 'exact', head: true });
    const invoiceNumber = `NOM-${dateStr}-${String((count || 0) + 1).padStart(4, '0')}`;

    // Parse payment amount
    const paymentStr = order.payment_amount || '€0';
    const currency = paymentStr.includes('kr') ? 'SEK' : 'EUR';
    const amountMatch = paymentStr.replace(/[^\d]/g, '');
    const totalCents = parseInt(amountMatch) * 100 || 0;

    // Build line items
    const lineItems: Array<{ description: string; quantity: number; unit_price: number; total: number }> = [];

    // Package
    const packageNames: Record<string, string> = {
      starter: 'Starter Website Package',
      standard: 'Standard Website Package',
      pro: 'Pro Website Package',
    };
    const packagePrices: Record<string, Record<string, number>> = {
      starter: { EUR: 49000, SEK: 490000 },
      standard: { EUR: 79000, SEK: 790000 },
      pro: { EUR: 129000, SEK: 1290000 },
    };

    if (order.selected_package) {
      const pkgPrice = packagePrices[order.selected_package]?.[currency] || 0;
      lineItems.push({
        description: packageNames[order.selected_package] || 'Website Package',
        quantity: 1,
        unit_price: pkgPrice,
        total: pkgPrice,
      });
    }

    // Booking addon
    if (order.wants_booking && order.selected_package !== 'pro') {
      const bookingPrice = currency === 'SEK' ? 200000 : 20000;
      lineItems.push({
        description: 'Booking System Add-on',
        quantity: 1,
        unit_price: bookingPrice,
        total: bookingPrice,
      });
    }

    // Admin panel
    if (order.wants_admin_panel) {
      const adminPrice = currency === 'SEK' ? 100000 : 10000;
      lineItems.push({
        description: 'Admin Panel Add-on',
        quantity: 1,
        unit_price: adminPrice,
        total: adminPrice,
      });
    }

    // Calculate VAT (25% for Swedish companies, 0% for EU with valid VAT)
    const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
    const vatRate = order.vat_verified ? 0 : (order.country === 'SE' || !order.country ? 0.25 : 0);
    const vatAmount = Math.round(subtotal * vatRate);
    const total = subtotal + vatAmount;

    // Create invoice record
    const { data: invoice, error: insertError } = await supabase
      .from('invoices')
      .insert({
        order_id: orderId,
        invoice_number: invoiceNumber,
        customer_email: order.email,
        customer_name: order.contact_person || order.business_name,
        company_name: order.company_name,
        org_number: order.org_number,
        vat_number: order.vat_number,
        billing_address: null,
        line_items: lineItems,
        subtotal: subtotal,
        vat_amount: vatAmount,
        total: total,
        currency: currency,
        status: 'paid',
        stripe_payment_intent_id: stripePaymentIntentId,
      })
      .select('id, invoice_number')
      .single();

    if (insertError) {
      throw new Error(`Failed to create invoice: ${insertError.message}`);
    }

    logStep("Invoice created", { invoiceNumber: invoice.invoice_number });

    // Send invoice email
    const safeName = escapeHtml(order.contact_person || order.business_name || 'Customer');
    const formatAmount = (cents: number) => {
      if (currency === 'SEK') {
        return `${(cents / 100).toLocaleString('sv-SE')} kr`;
      }
      return `€${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    };

    const lineItemsHtml = lineItems.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${escapeHtml(item.description)}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatAmount(item.total)}</td>
      </tr>
    `).join('');

    await resend.emails.send({
      from: "Nomia <no-reply@nomia.se>",
      to: [order.email],
      subject: `Faktura ${invoiceNumber} - Nomia`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 40px 20px; background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);">
            <h1 style="color: #fff; margin: 0; font-size: 32px;">NOMIA<span style="color: #f59e0b;">.</span></h1>
          </div>
          
          <div style="padding: 40px 20px;">
            <h2 style="color: #1a1a1a; margin-top: 0;">Faktura</h2>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 24px;">
              <div>
                <p style="margin: 4px 0; color: #6c757d; font-size: 14px;">Fakturanummer</p>
                <p style="margin: 0; font-weight: bold;">${invoiceNumber}</p>
              </div>
              <div style="text-align: right;">
                <p style="margin: 4px 0; color: #6c757d; font-size: 14px;">Datum</p>
                <p style="margin: 0; font-weight: bold;">${today.toLocaleDateString('sv-SE')}</p>
              </div>
            </div>
            
            <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
              <p style="margin: 0; font-weight: bold;">${safeName}</p>
              ${order.company_name ? `<p style="margin: 4px 0 0;">${escapeHtml(order.company_name)}</p>` : ''}
              ${order.org_number ? `<p style="margin: 4px 0 0; color: #6c757d; font-size: 14px;">Org.nr: ${escapeHtml(order.org_number)}</p>` : ''}
              <p style="margin: 4px 0 0; color: #6c757d; font-size: 14px;">${escapeHtml(order.email)}</p>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <thead>
                <tr style="background: #f8f9fa;">
                  <th style="padding: 12px; text-align: left;">Beskrivning</th>
                  <th style="padding: 12px; text-align: center;">Antal</th>
                  <th style="padding: 12px; text-align: right;">Summa</th>
                </tr>
              </thead>
              <tbody>
                ${lineItemsHtml}
              </tbody>
            </table>
            
            <div style="text-align: right; border-top: 2px solid #1a1a1a; padding-top: 16px;">
              <p style="margin: 8px 0; color: #6c757d;">Delsumma: ${formatAmount(subtotal)}</p>
              ${vatAmount > 0 ? `<p style="margin: 8px 0; color: #6c757d;">Moms (25%): ${formatAmount(vatAmount)}</p>` : ''}
              <p style="margin: 8px 0; font-size: 20px; font-weight: bold;">Totalt: ${formatAmount(total)}</p>
            </div>
            
            <div style="background: #dcfce7; padding: 16px; border-radius: 8px; margin-top: 24px; text-align: center;">
              <p style="margin: 0; color: #166534; font-weight: bold;">✓ Betald</p>
            </div>
          </div>
          
          <div style="background: #1a1a1a; padding: 24px; text-align: center;">
            <p style="color: #fff; margin: 0 0 8px; font-weight: bold;">Nomia AB</p>
            <p style="color: #9ca3af; margin: 0; font-size: 14px;">
              Göteborg, Sverige<br>
              nordicsite.help@gmail.com
            </p>
          </div>
        </div>
      `,
    });

    logStep("Invoice email sent to", { email: order.email });

    return new Response(
      JSON.stringify({ success: true, invoiceNumber: invoice.invoice_number }),
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
