-- Allow anonymous users to insert into order_submissions (for checkout without auth)
CREATE POLICY "Allow anonymous inserts" ON public.order_submissions
FOR INSERT
WITH CHECK (true);

-- Also ensure updates work for payment status changes
CREATE POLICY "Allow anonymous updates" ON public.order_submissions
FOR UPDATE
USING (true)
WITH CHECK (true);