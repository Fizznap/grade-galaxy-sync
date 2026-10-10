REVOKE INSERT, UPDATE, DELETE ON public.interview_sessions FROM anon, authenticated;
REVOKE SELECT ON public.interview_sessions FROM anon;