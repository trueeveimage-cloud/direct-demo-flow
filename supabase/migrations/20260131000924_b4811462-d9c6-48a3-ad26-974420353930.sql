-- Fix the order_submissions INSERT policy to be PERMISSIVE (allows anonymous order submissions)
-- The current policy is RESTRICTIVE which blocks public inserts

DROP POLICY IF EXISTS "Anyone can insert orders" ON public.order_submissions;

-- Create as PERMISSIVE policy (default) so anonymous users can insert orders
CREATE POLICY "Anyone can insert orders" 
ON public.order_submissions 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);