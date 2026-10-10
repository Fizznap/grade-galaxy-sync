CREATE OR REPLACE FUNCTION public.student_feedback() RETURNS TABLE(id uuid, feedback_score integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$ select s.id, s.feedback_score from public.students s
  where public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'faculty')
     or (s.user_id = auth.uid() and public.has_role(auth.uid(),'student')) $$;