-- Add explicit deny policy for non-admin users on invoices table
-- This ensures customer billing information remains private

CREATE POLICY "Deny anonymous access to invoices"
ON public.invoices
FOR SELECT
TO anon
USING (false);

CREATE POLICY "Deny non-admin authenticated access to invoices"
ON public.invoices
FOR SELECT
TO authenticated
USING (public.is_admin_user());