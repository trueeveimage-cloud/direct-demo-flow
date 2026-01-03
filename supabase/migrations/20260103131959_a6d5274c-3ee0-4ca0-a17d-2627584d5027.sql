-- Remove dangerous public SELECT policy that exposes customer data
DROP POLICY IF EXISTS "Anyone can count concept requests" ON public.concept_requests;

-- Remove dangerous public DELETE policy that allows anyone to delete data
DROP POLICY IF EXISTS "Anyone can delete concept requests" ON public.concept_requests;