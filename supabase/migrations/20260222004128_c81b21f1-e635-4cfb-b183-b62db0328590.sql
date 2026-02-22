
-- Add validation trigger for reviews to enforce input constraints server-side
CREATE OR REPLACE FUNCTION public.validate_review()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Enforce rating between 1 and 5
  IF NEW.rating < 1 OR NEW.rating > 5 THEN
    RAISE EXCEPTION 'Rating must be between 1 and 5';
  END IF;
  -- Enforce comment max length
  IF LENGTH(NEW.comment) > 1000 THEN
    RAISE EXCEPTION 'Comment must be 1000 characters or less';
  END IF;
  -- Enforce author_name max length
  IF LENGTH(NEW.author_name) > 100 THEN
    RAISE EXCEPTION 'Author name must be 100 characters or less';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_review_before_insert
  BEFORE INSERT ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_review();
