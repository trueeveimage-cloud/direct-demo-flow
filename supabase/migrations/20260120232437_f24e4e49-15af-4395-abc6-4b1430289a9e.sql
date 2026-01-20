-- Add explicit deny policy for public access to order_submissions
-- This ensures that only admins can read order data through the is_admin_user() function
-- The existing "Admin users can view all orders" policy allows admin access

-- First check if the policy already exists and drop it if needed
DROP POLICY IF EXISTS "Deny public read access" ON public.order_submissions;

-- Note: The existing policies already use is_admin_user() for SELECT which is restrictive
-- But we should ensure the table is secure by verifying the RLS policies are correct

-- Add explicit deny for anonymous/public users (those not authenticated)
-- This is a defense-in-depth measure
CREATE POLICY "Authenticated users only for select"
ON public.order_submissions
FOR SELECT
TO anon
USING (false);

-- Also protect contact_submissions and concept_requests similarly
DROP POLICY IF EXISTS "Deny anonymous read on contact_submissions" ON public.contact_submissions;
CREATE POLICY "Deny anonymous read on contact_submissions"
ON public.contact_submissions
FOR SELECT
TO anon
USING (false);

DROP POLICY IF EXISTS "Deny anonymous read on concept_requests" ON public.concept_requests;
CREATE POLICY "Deny anonymous read on concept_requests"
ON public.concept_requests
FOR SELECT
TO anon
USING (false);