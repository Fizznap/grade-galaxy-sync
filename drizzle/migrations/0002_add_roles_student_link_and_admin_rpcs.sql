ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'student';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'placement';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'pending';

ALTER TABLE public.students ADD COLUMN IF NOT EXISTS user_id uuid;
CREATE UNIQUE INDEX IF NOT EXISTS students_user_id_key ON public.students (user_id) WHERE user_id IS NOT NULL;

CREATE POLICY "Students can view own record" ON public.students FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.get_all_users()
RETURNS TABLE (id uuid, user_id uuid, email text, role public.app_role)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT u.id, u.id, u.email::text, ur.role
  FROM auth.users u
  LEFT JOIN public.user_roles ur ON ur.user_id = u.id
  WHERE public.has_role(auth.uid(), 'admin')
$$;

CREATE OR REPLACE FUNCTION public.set_user_role(target_user_id uuid, new_role public.app_role)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'not authorized';
  END IF;
  DELETE FROM public.user_roles WHERE user_id = target_user_id;
  INSERT INTO public.user_roles (user_id, role) VALUES (target_user_id, new_role);
END
$$;

GRANT EXECUTE ON FUNCTION public.get_all_users() TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_user_role(uuid, public.app_role) TO authenticated;