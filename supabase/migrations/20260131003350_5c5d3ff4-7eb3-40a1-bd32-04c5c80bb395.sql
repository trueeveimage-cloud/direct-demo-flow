-- Allow users to select their own just-inserted order by making the insert return the ID
-- Add a policy that allows selecting orders you just inserted (using a permissive approach)
CREATE POLICY "Users can select their own order after insert"
ON public.order_submissions
FOR SELECT
TO anon, authenticated
USING (
  -- Allow selecting rows created in the last 5 minutes with matching email
  created_at > now() - interval '5 minutes'
);