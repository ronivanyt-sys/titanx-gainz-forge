
-- Replace use_coupon with a secure, race-condition-safe version
CREATE OR REPLACE FUNCTION public.use_coupon(_coupon_id uuid, _order_amount numeric DEFAULT 0)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_coupon RECORD;
BEGIN
  -- Lock and fetch coupon atomically
  SELECT * INTO v_coupon
  FROM public.coupons
  WHERE id = _coupon_id
  FOR UPDATE;

  -- Validate coupon exists and is active
  IF v_coupon IS NULL OR NOT v_coupon.active THEN
    RETURN false;
  END IF;

  -- Check uses remaining
  IF v_coupon.uses_remaining IS NOT NULL AND v_coupon.uses_remaining <= 0 THEN
    RETURN false;
  END IF;

  -- Validate minimum amount
  IF v_coupon.min_amount IS NOT NULL AND _order_amount < v_coupon.min_amount THEN
    RETURN false;
  END IF;

  -- Decrement uses
  IF v_coupon.uses_remaining IS NOT NULL THEN
    UPDATE public.coupons
    SET uses_remaining = uses_remaining - 1
    WHERE id = _coupon_id;
  END IF;

  RETURN true;
END;
$$;
