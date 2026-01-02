-- Add DELETE policy for concept requests (admin can delete via authenticated session)
CREATE POLICY "Anyone can delete concept requests"
ON public.concept_requests
FOR DELETE
USING (true);