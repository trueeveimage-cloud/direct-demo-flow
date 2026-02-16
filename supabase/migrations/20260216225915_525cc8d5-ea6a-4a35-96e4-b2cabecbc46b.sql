
-- Create rate limiting table for sensitive endpoints
CREATE TABLE public.rate_limit_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint text NOT NULL,
  ip_hash text NOT NULL,
  attempted_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rate_limit_attempts ENABLE ROW LEVEL SECURITY;

-- No public access - only service role can read/write
-- (edge functions use service role key)

-- Index for efficient lookups
CREATE INDEX idx_rate_limit_endpoint_ip ON public.rate_limit_attempts (endpoint, ip_hash, attempted_at);

-- Auto-cleanup old attempts (older than 1 hour)
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.rate_limit_attempts
  WHERE attempted_at < now() - interval '1 hour';
$$;
