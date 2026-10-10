-- New signups wait for admin approval
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$ begin insert into public.user_roles(user_id, role) values (new.id, 'pending') on conflict do nothing; return new; end $$;

-- Only real staff roles count as staff
CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$ select exists (select 1 from public.user_roles where user_id=_user_id and role in ('admin','faculty','placement')) $$;

-- Admin cannot remove the last admin (themselves included)
CREATE OR REPLACE FUNCTION public.set_user_role(target_user_id uuid, new_role app_role) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'not authorized'; END IF;
  IF new_role <> 'admin' AND public.has_role(target_user_id, 'admin')
     AND (SELECT count(*) FROM public.user_roles WHERE role = 'admin') <= 1 THEN
    RAISE EXCEPTION 'cannot remove the last admin';
  END IF;
  DELETE FROM public.user_roles WHERE user_id = target_user_id;
  INSERT INTO public.user_roles (user_id, role) VALUES (target_user_id, new_role);
END $$;

-- Feedback column hidden from direct reads; served only to admin/faculty
REVOKE SELECT ON public.students FROM authenticated, anon;
GRANT SELECT (id, roll_no, name, department, year, cgpa, attendance, lms_activity, engagement, placement_readiness, skills_score, backlogs, created_at, updated_at, user_id) ON public.students TO authenticated;

CREATE OR REPLACE FUNCTION public.student_feedback() RETURNS TABLE(id uuid, feedback_score integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$ select s.id, s.feedback_score from public.students s
  where public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'faculty') $$;
REVOKE ALL ON FUNCTION public.student_feedback() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.student_feedback() TO authenticated;

-- Staff edits limited to admin/faculty/placement (is_staff); students cannot write
DROP POLICY IF EXISTS "staff update students" ON public.students;
CREATE POLICY "staff update students" ON public.students FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));