-- Create admin_users table to store admin emails
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert the known admin email
INSERT INTO public.admin_users (email) VALUES ('nordicsite.help@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Enable RLS on admin_users table
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Only allow users to check if their own email is in admin list (prevents enumeration)
CREATE POLICY "Users can check their own admin status"
ON public.admin_users
FOR SELECT
TO authenticated
USING (email = auth.email());

-- Create security definer function to check admin status
-- This bypasses RLS safely since it only returns a boolean
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE email = auth.email()
  );
$$;

-- Drop the overly permissive SELECT policy on concept_requests
DROP POLICY IF EXISTS "Authenticated users can view concept requests" ON public.concept_requests;

-- Create admin-only SELECT policy on concept_requests
CREATE POLICY "Admin users can view concept requests"
ON public.concept_requests
FOR SELECT
TO authenticated
USING (public.is_admin_user());