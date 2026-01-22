-- Fix security vulnerabilities in concept_requests and order_submissions tables

-- 1. Drop the conflicting "Deny anonymous read" policy on concept_requests
-- The admin policy already restricts access properly
DROP POLICY IF EXISTS "Deny anonymous read on concept_requests" ON public.concept_requests;

-- 2. Fix order_submissions security by removing header-based policies 
-- and relying only on admin access for viewing/updating orders
DROP POLICY IF EXISTS "Users can select own order by session id" ON public.order_submissions;
DROP POLICY IF EXISTS "Users can update own order by session id" ON public.order_submissions;

-- 3. Create a simple, secure policy that only allows admins to view orders
-- (The service role used in edge functions bypasses RLS anyway)
CREATE POLICY "Only admins can select orders"
ON public.order_submissions
FOR SELECT
USING (is_admin_user());

-- 4. Keep admin update policy (if it doesn't exist already)
-- The existing "Admin users can update orders" policy is sufficient