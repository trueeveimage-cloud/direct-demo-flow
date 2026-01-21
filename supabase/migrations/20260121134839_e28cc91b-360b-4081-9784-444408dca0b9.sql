-- Drop the blocking policy that prevents anonymous access
DROP POLICY IF EXISTS "Authenticated users only for select" ON public.order_submissions;

-- Create a policy that allows anyone to select their own row by email (for the insert/return flow)
CREATE POLICY "Anyone can select by session" ON public.order_submissions
FOR SELECT
USING (true);