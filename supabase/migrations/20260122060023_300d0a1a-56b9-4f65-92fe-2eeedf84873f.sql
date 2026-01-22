-- Drop the conflicting anonymous deny policy that blocks admin access
DROP POLICY IF EXISTS "Deny anonymous read on contact_submissions" ON public.contact_submissions;