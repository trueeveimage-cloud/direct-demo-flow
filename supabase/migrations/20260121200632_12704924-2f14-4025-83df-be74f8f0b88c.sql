-- Create spots configuration table for admin control
CREATE TABLE public.spots_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  max_spots INTEGER NOT NULL DEFAULT 7,
  current_spots INTEGER NOT NULL DEFAULT 7,
  last_reset_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.spots_config ENABLE ROW LEVEL SECURITY;

-- Anyone can read spots config (needed for frontend display)
CREATE POLICY "Anyone can read spots config" 
ON public.spots_config 
FOR SELECT 
USING (true);

-- Only admin users can update spots config
CREATE POLICY "Admin users can update spots config" 
ON public.spots_config 
FOR UPDATE 
USING (is_admin_user());

-- Insert initial config row
INSERT INTO public.spots_config (max_spots, current_spots) VALUES (7, 4);

-- Create trigger for updated_at
CREATE TRIGGER update_spots_config_updated_at
BEFORE UPDATE ON public.spots_config
FOR EACH ROW
EXECUTE FUNCTION public.update_order_submissions_updated_at();