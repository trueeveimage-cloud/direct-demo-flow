-- Fix order_submissions RLS policies to prevent public data exposure
-- Remove overly permissive policies

DROP POLICY IF EXISTS "Anyone can select by session" ON public.order_submissions;
DROP POLICY IF EXISTS "Allow anonymous updates" ON public.order_submissions;

-- Create a secure SELECT policy: users can only select orders by matching stripe_session_id
-- This allows the payment success page to verify the order without exposing all data
CREATE POLICY "Users can select own order by session id"
ON public.order_submissions
FOR SELECT
USING (
  is_admin_user() OR 
  (stripe_session_id IS NOT NULL AND stripe_session_id = current_setting('request.headers', true)::json->>'x-stripe-session-id')
);

-- Create a secure UPDATE policy: users can only update orders by matching stripe_session_id or id
-- This allows payment status updates without exposing other orders
CREATE POLICY "Users can update own order by session id"
ON public.order_submissions
FOR UPDATE
USING (
  is_admin_user() OR
  (stripe_session_id IS NOT NULL AND stripe_session_id = current_setting('request.headers', true)::json->>'x-stripe-session-id')
)
WITH CHECK (
  is_admin_user() OR
  (stripe_session_id IS NOT NULL AND stripe_session_id = current_setting('request.headers', true)::json->>'x-stripe-session-id')
);