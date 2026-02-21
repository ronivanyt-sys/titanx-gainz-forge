
-- Sales log for inventory tracking (manual sales entry by admin)
CREATE TABLE public.sales_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  sale_price NUMERIC NOT NULL DEFAULT 0,
  customer_name TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.sales_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read sales_log" ON public.sales_log FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert sales_log" ON public.sales_log FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update sales_log" ON public.sales_log FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete sales_log" ON public.sales_log FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Reviews table (public read, authenticated insert)
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  author_name TEXT NOT NULL DEFAULT 'Anónimo',
  rating INTEGER NOT NULL DEFAULT 5,
  comment TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Anyone can insert reviews" ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can delete reviews" ON public.reviews FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Coupons table (admin managed)
CREATE TABLE public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  discount_percent INTEGER NOT NULL DEFAULT 10,
  active BOOLEAN NOT NULL DEFAULT true,
  min_amount NUMERIC NOT NULL DEFAULT 0,
  uses_remaining INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active coupons" ON public.coupons FOR SELECT USING (true);
CREATE POLICY "Admins can insert coupons" ON public.coupons FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update coupons" ON public.coupons FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete coupons" ON public.coupons FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Function to decrement stock when a sale is logged
CREATE OR REPLACE FUNCTION public.decrement_stock_on_sale()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.products
  SET stock = stock - NEW.quantity
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_decrement_stock
AFTER INSERT ON public.sales_log
FOR EACH ROW
EXECUTE FUNCTION public.decrement_stock_on_sale();
