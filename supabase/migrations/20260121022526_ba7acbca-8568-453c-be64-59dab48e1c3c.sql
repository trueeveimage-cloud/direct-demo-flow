-- Create email_captures table for early lead tracking
CREATE TABLE public.email_captures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  business_name TEXT,
  captured_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  source TEXT NOT NULL DEFAULT 'wizard', -- 'wizard', 'exit_popup', 'demo_form'
  converted_to_order BOOLEAN DEFAULT false,
  order_id UUID REFERENCES public.order_submissions(id),
  ip_address TEXT,
  user_agent TEXT
);

-- Enable RLS
ALTER TABLE public.email_captures ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can insert email captures" 
ON public.email_captures 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admin users can view email captures" 
ON public.email_captures 
FOR SELECT 
USING (is_admin_user());

CREATE POLICY "Admin users can update email captures" 
ON public.email_captures 
FOR UPDATE 
USING (is_admin_user());

-- Create case_studies table
CREATE TABLE public.case_studies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  slug TEXT NOT NULL UNIQUE,
  client_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  challenge_sv TEXT NOT NULL,
  challenge_en TEXT NOT NULL,
  solution_sv TEXT NOT NULL,
  solution_en TEXT NOT NULL,
  results_sv TEXT NOT NULL,
  results_en TEXT NOT NULL,
  metrics JSONB DEFAULT '[]'::jsonb, -- Array of {label_sv, label_en, value}
  before_image_url TEXT,
  after_image_url TEXT,
  website_url TEXT,
  testimonial_quote TEXT,
  testimonial_author TEXT,
  is_published BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;

-- Policies for case_studies
CREATE POLICY "Anyone can view published case studies" 
ON public.case_studies 
FOR SELECT 
USING (is_published = true OR is_admin_user());

CREATE POLICY "Admin users can insert case studies" 
ON public.case_studies 
FOR INSERT 
WITH CHECK (is_admin_user());

CREATE POLICY "Admin users can update case studies" 
ON public.case_studies 
FOR UPDATE 
USING (is_admin_user());

CREATE POLICY "Admin users can delete case studies" 
ON public.case_studies 
FOR DELETE 
USING (is_admin_user());

-- Create invoices table
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  order_id UUID REFERENCES public.order_submissions(id),
  invoice_number TEXT NOT NULL UNIQUE,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  company_name TEXT,
  org_number TEXT,
  vat_number TEXT,
  billing_address TEXT,
  line_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal INTEGER NOT NULL, -- in cents
  vat_amount INTEGER DEFAULT 0,
  total INTEGER NOT NULL, -- in cents
  currency TEXT NOT NULL DEFAULT 'EUR',
  status TEXT NOT NULL DEFAULT 'paid', -- 'draft', 'sent', 'paid'
  pdf_url TEXT,
  stripe_payment_intent_id TEXT
);

-- Enable RLS
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Policies for invoices
CREATE POLICY "Admin users can view all invoices" 
ON public.invoices 
FOR SELECT 
USING (is_admin_user());

CREATE POLICY "Service role can insert invoices" 
ON public.invoices 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admin users can update invoices" 
ON public.invoices 
FOR UPDATE 
USING (is_admin_user());

-- Add recovery_email_sent_at column to order_submissions for abandoned cart tracking
ALTER TABLE public.order_submissions 
ADD COLUMN IF NOT EXISTS recovery_email_sent_at TIMESTAMP WITH TIME ZONE;

-- Add index for finding pending orders for recovery emails
CREATE INDEX IF NOT EXISTS idx_order_submissions_pending_recovery 
ON public.order_submissions (payment_status, created_at) 
WHERE payment_status = 'pending' AND recovery_email_sent_at IS NULL;

-- Create trigger for case_studies updated_at
CREATE TRIGGER update_case_studies_updated_at
BEFORE UPDATE ON public.case_studies
FOR EACH ROW
EXECUTE FUNCTION public.update_order_submissions_updated_at();