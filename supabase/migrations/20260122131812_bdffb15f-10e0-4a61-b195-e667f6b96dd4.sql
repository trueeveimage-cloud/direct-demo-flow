-- Drop all existing INSERT policies on order_submissions 
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.order_submissions;
DROP POLICY IF EXISTS "Anyone can submit orders" ON public.order_submissions;

-- Create a single PERMISSIVE INSERT policy that allows anyone to insert
CREATE POLICY "Anyone can insert orders"
ON public.order_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);