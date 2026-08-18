CREATE OR REPLACE FUNCTION public.join_class_by_code(_code text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _class_id uuid;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not signed in';
  END IF;

  SELECT id INTO _class_id FROM public.classes WHERE upper(join_code) = upper(trim(_code));
  IF _class_id IS NULL THEN
    RAISE EXCEPTION 'No class found for that code';
  END IF;

  INSERT INTO public.class_members (class_id, user_id)
  VALUES (_class_id, auth.uid())
  ON CONFLICT (class_id, user_id) DO NOTHING;

  RETURN _class_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.join_class_by_code(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.join_class_by_code(text) TO authenticated;