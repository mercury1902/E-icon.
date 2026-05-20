CREATE OR REPLACE FUNCTION confirm_user(user_id UUID)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE auth.users SET email_confirmed_at = now(), updated_at = now() WHERE id = user_id AND email_confirmed_at IS NULL;
  RETURN FOUND;
END;
$$;
