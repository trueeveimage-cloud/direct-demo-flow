-- Create a table to store all contact submissions
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  contact_reason TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false
);

-- Enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Admin can view all submissions
CREATE POLICY "Admin users can view all submissions"
  ON public.contact_submissions
  FOR SELECT
  USING (public.is_admin_user());

-- Admin can update (mark as read)
CREATE POLICY "Admin users can update submissions"
  ON public.contact_submissions
  FOR UPDATE
  USING (public.is_admin_user());

-- Anyone can insert (from contact form)
CREATE POLICY "Anyone can submit contact form"
  ON public.contact_submissions
  FOR INSERT
  WITH CHECK (true);
