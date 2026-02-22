
-- Create a secure RPC to validate and use a coupon atomically
CREATE OR REPLACE FUNCTION public.use_coupon(_coupon_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.coupons
  SET uses_remaining = uses_remaining - 1
  WHERE id = _coupon_id
    AND active = true
    AND (uses_remaining IS NULL OR uses_remaining > 0);
END;
$$;
