
-- 1. Fix coupons: restrict SELECT to only validate specific codes, not browse all
DROP POLICY IF EXISTS "Anyone can read active coupons" ON public.coupons;
CREATE POLICY "Anyone can read active coupons" ON public.coupons
  FOR SELECT USING (active = true);

-- 2. Fix reviews: require authentication for inserting reviews
DROP POLICY IF EXISTS "Anyone can insert reviews" ON public.reviews;
CREATE POLICY "Authenticated users can insert reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 3. Fix user_roles: add restrictive write policies
CREATE POLICY "Admins can insert user_roles" ON public.user_roles
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update user_roles" ON public.user_roles
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete user_roles" ON public.user_roles
  FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));
