-- Add admin-only SELECT policy for concept_requests table
-- This allows authenticated users (admins) to view all concept requests

CREATE POLICY "Authenticated users can view concept requests"
ON public.concept_requests
FOR SELECT
TO authenticated
USING (true);