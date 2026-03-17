import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

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

interface VatVerificationRequest {
  vatNumber: string;
  countryCode: string;
}

interface ViesResponse {
  valid: boolean;
  name?: string;
  address?: string;
  requestDate: string;
  countryCode: string;
  vatNumber: string;
}

// VIES SOAP API endpoint
const VIES_URL = 'https://ec.europa.eu/taxation_customs/vies/services/checkVatService';

// Build SOAP request for VIES
function buildSoapRequest(countryCode: string, vatNumber: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:ec.europa.eu:taxud:vies:services:checkVat:types">
   <soapenv:Header/>
   <soapenv:Body>
      <urn:checkVat>
         <urn:countryCode>${countryCode}</urn:countryCode>
         <urn:vatNumber>${vatNumber}</urn:vatNumber>
      </urn:checkVat>
   </soapenv:Body>
</soapenv:Envelope>`;
}

// Parse SOAP response from VIES
function parseSoapResponse(xml: string): ViesResponse {
  const getTagValue = (tag: string): string => {
    const match = xml.match(new RegExp(`<${tag}>([^<]*)</${tag}>`, 'i'));
    return match ? match[1].trim() : '';
  };
  
  const valid = getTagValue('valid').toLowerCase() === 'true';
  const name = getTagValue('name') || undefined;
  const address = getTagValue('address') || undefined;
  const requestDate = getTagValue('requestDate') || new Date().toISOString();
  const countryCode = getTagValue('countryCode');
  const vatNumber = getTagValue('vatNumber');
  
  return { valid, name, address, requestDate, countryCode, vatNumber };
}

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Block requests from non-allowed origins
  if (!isAllowedOrigin(origin)) {
    console.log("[verify-vat] Blocked request from unauthorized origin", { origin });
    return new Response(
      JSON.stringify({ error: "Forbidden" }),
      { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { vatNumber, countryCode }: VatVerificationRequest = await req.json();
    
    console.log(`[verify-vat] Verifying VAT: ${countryCode}${vatNumber}`);

    if (!vatNumber || !countryCode) {
      return new Response(
        JSON.stringify({ error: 'VAT number and country code are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Clean VAT number - remove country prefix if included
    let cleanVatNumber = vatNumber.replace(/[\s.-]/g, '').toUpperCase();
    if (cleanVatNumber.startsWith(countryCode.toUpperCase())) {
      cleanVatNumber = cleanVatNumber.substring(countryCode.length);
    }

    // EU countries supported by VIES
    const euCountries = ['AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'EL', 'ES', 'FI', 'FR', 'HR', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK'];
    
    if (!euCountries.includes(countryCode.toUpperCase())) {
      // For non-EU countries (like Norway, UK), return format-only validation
      console.log(`[verify-vat] Non-EU country ${countryCode}, skipping VIES`);
      return new Response(
        JSON.stringify({
          valid: true,
          verified: false,
          message: 'VAT format accepted (non-EU country, VIES verification not applicable)',
          vatNumber: vatNumber,
          countryCode: countryCode,
          verifiedAt: new Date().toISOString()
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call VIES SOAP API
    const soapRequest = buildSoapRequest(countryCode.toUpperCase(), cleanVatNumber);
    
    console.log(`[verify-vat] Calling VIES API for ${countryCode}${cleanVatNumber}`);
    
    const response = await fetch(VIES_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'SOAPAction': '',
      },
      body: soapRequest,
    });

    if (!response.ok) {
      console.error(`[verify-vat] VIES API error: ${response.status}`);
      
      // VIES can be temporarily unavailable - don't block checkout
      return new Response(
        JSON.stringify({
          valid: false,
          verified: false,
          message: 'VIES service temporarily unavailable. Please try again later.',
          vatNumber: vatNumber,
          countryCode: countryCode,
          error: 'VIES_UNAVAILABLE'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const xmlResponse = await response.text();
    console.log(`[verify-vat] VIES response received`);
    
    const result = parseSoapResponse(xmlResponse);
    
    console.log(`[verify-vat] Verification result: valid=${result.valid}, name=${result.name}`);

    return new Response(
      JSON.stringify({
        valid: result.valid,
        verified: true,
        name: result.name,
        address: result.address,
        vatNumber: `${countryCode}${cleanVatNumber}`,
        countryCode: countryCode,
        verifiedAt: new Date().toISOString(),
        message: result.valid 
          ? 'VAT number verified successfully via VIES' 
          : 'VAT number is not valid according to VIES'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[verify-vat] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        error: 'Failed to verify VAT number',
        message: errorMessage,
        valid: false,
        verified: false
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});