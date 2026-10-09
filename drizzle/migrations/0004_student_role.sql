-- Migration: 0004_student_role
-- Add student role and user linking

ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'student';

ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL;

-- RLS for students
CREATE POLICY "student read own" 
  ON public.students FOR SELECT 
  TO authenticated 
  USING (user_id = auth.uid());

-- RLS for interventions
CREATE POLICY "student read own interventions" 
  ON public.interventions FOR SELECT 
  TO authenticated 
  USING (student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()));

-- RLS for intervention_observations
CREATE POLICY "student read own observations" 
  ON public.intervention_observations FOR SELECT 
  TO authenticated 
  USING (intervention_id IN (SELECT id FROM public.interventions WHERE student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())));

-- Update the handle_new_user trigger to NOT auto-link any records securely
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'pending')
  ON CONFLICT DO NOTHING;
  
  RETURN new;
END;
$$;

-- Explicit Admin RPC to link a user to a student record
CREATE OR REPLACE FUNCTION public.link_student_account(target_user_id uuid, target_student_id uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  
  -- Ensure the user is a student
  UPDATE public.user_roles SET role = 'student' WHERE user_id = target_user_id;
  
  -- Remove any existing mapping for this user
  UPDATE public.students SET user_id = NULL WHERE user_id = target_user_id;
  
  -- Link to the new student record
  UPDATE public.students SET user_id = target_user_id WHERE id = target_student_id;
END;
$$;
