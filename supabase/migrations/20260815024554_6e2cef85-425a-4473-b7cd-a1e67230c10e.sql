-- Anonymous checkout creates the UUID client-side, so it never needs to read the
-- newly inserted order back from this PII-bearing table.
DROP POLICY IF EXISTS "Users can read their own recent orders"
ON public.order_submissions;