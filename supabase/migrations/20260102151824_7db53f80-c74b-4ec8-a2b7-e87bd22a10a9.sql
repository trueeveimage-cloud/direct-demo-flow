-- Create table to track concept requests
CREATE TABLE public.concept_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  business_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.concept_requests ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (for tracking requests)
CREATE POLICY "Anyone can insert concept requests"
ON public.concept_requests
FOR INSERT
WITH CHECK (true);

-- Allow public to count requests (for displaying remaining spots)
CREATE POLICY "Anyone can count concept requests"
ON public.concept_requests
FOR SELECT
USING (true);

-- Create function to get remaining spots this week
CREATE OR REPLACE FUNCTION public.get_remaining_spots()
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT GREATEST(0, 10 - COUNT(*)::INTEGER)
  FROM public.concept_requests
  WHERE created_at >= date_trunc('week', now())
    AND created_at < date_trunc('week', now()) + interval '1 week';
$$;