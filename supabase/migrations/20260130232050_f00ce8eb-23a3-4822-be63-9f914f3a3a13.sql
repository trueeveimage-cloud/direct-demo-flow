-- Drop the existing RESTRICTIVE insert policy and create a PERMISSIVE one
DROP POLICY IF EXISTS "Anyone can insert orders" ON public.order_submissions;

-- Create a PERMISSIVE policy for anonymous inserts (default is permissive)
CREATE POLICY "Anyone can insert orders"
ON public.order_submissions
FOR INSERT
TO public
WITH CHECK (true);