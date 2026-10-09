-- Alter the ENUM to add the new roles safely using a transaction block or separate statements
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'placement';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'pending';

-- Update handle_new_user() to ALWAYS default to 'pending'
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'pending'::public.app_role)
  ON CONFLICT DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Explicit RPC for safe, controlled demo setup
CREATE OR REPLACE FUNCTION public.setup_demo_accounts()
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  -- We assume demo accounts were created through normal signup and are currently 'pending'
  UPDATE public.user_roles SET role = 'admin' WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'admin@kryptedu.com');
  UPDATE public.user_roles SET role = 'faculty' WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'faculty@kryptedu.com');
  UPDATE public.user_roles SET role = 'placement' WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'placement@kryptedu.com');
  
  -- For student demo, find the user and map them to KR1
  UPDATE public.user_roles SET role = 'student' WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'student@kryptedu.com');
  UPDATE public.students SET user_id = (SELECT id FROM auth.users WHERE email = 'student@kryptedu.com') WHERE roll_no = 'KR1';
END;
$$;

-- Update is_staff to exclude pending
CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT exists (
    SELECT 1 FROM public.user_roles 
    WHERE user_id=_user_id AND role IN ('admin', 'faculty', 'placement')
  );
$$;

-- Update students RLS
DROP POLICY IF EXISTS "staff can read students" ON public.students;
DROP POLICY IF EXISTS "staff can insert students" ON public.students;
DROP POLICY IF EXISTS "staff can update students" ON public.students;
DROP POLICY IF EXISTS "staff can delete students" ON public.students;
DROP POLICY IF EXISTS "staff all students" ON public.students;

CREATE POLICY "Admin and Faculty can read all students" ON public.students
FOR SELECT USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'faculty'));

CREATE POLICY "Placement can read all students" ON public.students
FOR SELECT USING (public.has_role(auth.uid(), 'placement'));

CREATE POLICY "Admin can delete students" ON public.students
FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can insert students" ON public.students FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can update students" ON public.students FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Update interventions RLS
DROP POLICY IF EXISTS "staff all interventions" ON public.interventions;

CREATE POLICY "Admin can do ALL on interventions" ON public.interventions
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Faculty can do ALL on specific interventions" ON public.interventions
FOR ALL USING (
  public.has_role(auth.uid(), 'faculty') 
  AND (category NOT IN ('Placement', 'Skills') OR created_by = auth.uid())
);

CREATE POLICY "Placement can do ALL on specific interventions" ON public.interventions
FOR ALL USING (
  public.has_role(auth.uid(), 'placement') 
  AND (category IN ('Placement', 'Skills') OR created_by = auth.uid())
);

CREATE POLICY "EVERY staff member can SELECT all interventions" ON public.interventions
FOR SELECT USING (public.is_staff(auth.uid()));

-- Update data_imports RLS
DROP POLICY IF EXISTS "staff read imports" ON public.data_imports;
DROP POLICY IF EXISTS "staff add imports" ON public.data_imports;
DROP POLICY IF EXISTS "staff all data_imports" ON public.data_imports;

CREATE POLICY "Admin can ALL on data_imports" ON public.data_imports
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Helper functions for admin page
CREATE OR REPLACE FUNCTION public.get_all_users()
RETURNS TABLE (id uuid, user_id uuid, email varchar, role public.app_role)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  RETURN QUERY SELECT ur.id, ur.user_id, au.email::varchar, ur.role 
  FROM public.user_roles ur 
  JOIN auth.users au ON ur.user_id = au.id;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_user_role(target_user_id uuid, new_role public.app_role)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  UPDATE public.user_roles SET role = new_role WHERE user_id = target_user_id;
END;
$$;
