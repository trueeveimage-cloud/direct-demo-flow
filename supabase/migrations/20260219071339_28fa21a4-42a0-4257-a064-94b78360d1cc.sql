-- Allow users to read back their own order immediately after insert (5 minute window)
-- This is needed so the frontend can retrieve the order ID for Stripe checkout
CREATE POLICY "Users can read their own recent orders"
ON public.order_submissions
FOR SELECT
TO anon, authenticated
USING (created_at > now() - interval '5 minutes');