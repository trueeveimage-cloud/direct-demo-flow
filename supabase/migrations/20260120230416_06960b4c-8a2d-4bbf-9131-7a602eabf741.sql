-- Create order_submissions table to track all wizard submissions with full details
CREATE TABLE public.order_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Submission type: 'demo_request', 'direct_order', 'post_demo_order'
  submission_type TEXT NOT NULL,
  
  -- Contact info
  email TEXT NOT NULL,
  business_name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT,
  
  -- Business info
  business_type TEXT,
  website_goal TEXT,
  current_website TEXT,
  
  -- Package selection
  selected_package TEXT,
  selected_style TEXT,
  selected_language TEXT,
  primary_color TEXT,
  accent_color TEXT,
  
  -- Pages and services
  selected_pages TEXT[],
  custom_pages TEXT[],
  services TEXT,
  
  -- Booking info
  wants_booking BOOLEAN DEFAULT false,
  opening_hours TEXT,
  appointment_lengths TEXT[],
  booking_services JSONB,
  buffer_time TEXT,
  max_bookings_per_day TEXT,
  advance_booking_days TEXT,
  
  -- Care plan
  selected_care_plan TEXT,
  is_yearly_care_plan BOOLEAN DEFAULT false,
  
  -- Legal and notes
  legal_pages TEXT[],
  terms_explanation TEXT,
  page_notes TEXT,
  brand_preferences TEXT,
  competitors TEXT,
  seo_keywords TEXT,
  extra_notes TEXT,
  
  -- Customer type (B2B/B2C)
  customer_type TEXT,
  company_name TEXT,
  org_number TEXT,
  vat_number TEXT,
  vat_verified BOOLEAN DEFAULT false,
  country TEXT,
  
  -- Add-ons
  wants_admin_panel BOOLEAN DEFAULT false,
  wants_google_maps BOOLEAN DEFAULT false,
  google_maps_address TEXT,
  wants_google_reviews BOOLEAN DEFAULT false,
  google_business_link TEXT,
  wants_before_after BOOLEAN DEFAULT false,
  wants_checkout_system BOOLEAN DEFAULT false,
  
  -- Concept link (for post-demo flow)
  concept_link TEXT,
  
  -- Payment status
  payment_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'abandoned'
  payment_amount TEXT,
  stripe_session_id TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  
  -- Photos (stored as URLs or file names)
  uploaded_photos TEXT[],
  
  -- Business follow-ups (dynamic questions)
  business_followups JSONB,
  
  -- Is read by admin
  is_read BOOLEAN NOT NULL DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE public.order_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can submit orders" 
ON public.order_submissions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admin users can view all orders" 
ON public.order_submissions 
FOR SELECT 
USING (is_admin_user());

CREATE POLICY "Admin users can update orders" 
ON public.order_submissions 
FOR UPDATE 
USING (is_admin_user());

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_order_submissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_order_submissions_updated_at
BEFORE UPDATE ON public.order_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_order_submissions_updated_at();

-- Add index for faster queries
CREATE INDEX idx_order_submissions_email ON public.order_submissions(email);
CREATE INDEX idx_order_submissions_type ON public.order_submissions(submission_type);
CREATE INDEX idx_order_submissions_payment ON public.order_submissions(payment_status);
CREATE INDEX idx_order_submissions_created ON public.order_submissions(created_at DESC);