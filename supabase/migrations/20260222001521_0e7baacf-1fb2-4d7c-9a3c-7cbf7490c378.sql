
CREATE TABLE public.social_links (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform text NOT NULL,
  url text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT '',
  display_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active social links" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "Admins can insert social links" ON public.social_links FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update social links" ON public.social_links FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete social links" ON public.social_links FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Seed default social links
INSERT INTO public.social_links (platform, url, icon, display_order) VALUES
  ('Facebook', 'https://facebook.com/titanxbolivia', 'facebook', 1),
  ('Instagram', 'https://instagram.com/titanxbolivia', 'instagram', 2),
  ('TikTok', 'https://tiktok.com/@titanxbolivia', 'tiktok', 3);
