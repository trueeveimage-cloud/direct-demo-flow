-- Fix 1: Remove the dangerous time-window SELECT policy on order_submissions
-- This policy exposes ALL orders created in the last 5 minutes to anyone
DROP POLICY IF EXISTS "Users can select their own order after insert" ON public.order_submissions;

-- Create a more secure approach: users can only select their own order by matching email
-- This requires a function that returns the order ID after insert (handled by the application)
-- For now, we rely on admin-only access via Edge Functions with service role

-- Fix 2: Verify analytics_events has proper SELECT restriction
-- The current policy should only allow admin access, but let's ensure it's correct
-- First, drop any potentially incorrect policies
DROP POLICY IF EXISTS "Anyone can view analytics events" ON public.analytics_events;
DROP POLICY IF EXISTS "Public can read analytics" ON public.analytics_events;

-- Ensure admin-only SELECT is properly in place (it already exists but we verify)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'analytics_events' 
        AND policyname = 'Admin users can view analytics'
    ) THEN
        CREATE POLICY "Admin users can view analytics" 
        ON public.analytics_events 
        FOR SELECT 
        USING (is_admin_user());
    END IF;
END $$;