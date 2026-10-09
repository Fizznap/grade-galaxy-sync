-- Migration: 0002_outcome_tracking
-- Adds intervention outcome tracking with baseline and follow-up observations

CREATE TABLE IF NOT EXISTS public.intervention_observations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  intervention_id uuid NOT NULL REFERENCES public.interventions(id) ON DELETE CASCADE,
  observation_type text NOT NULL DEFAULT 'baseline',  -- 'baseline' | 'follow_up'
  observed_at timestamptz NOT NULL DEFAULT now(),
  
  -- Snapshot of relevant metrics at observation time
  attendance numeric(5,2),
  cgpa numeric(4,2),
  lms_activity integer,
  engagement integer,
  placement_readiness integer,
  skills_score integer,
  feedback_score integer,
  backlogs integer,
  
  -- Computed at observation time
  academic_index integer,
  placement_index integer,
  success_score integer,
  
  notes text NOT NULL DEFAULT '',
  is_synthetic boolean NOT NULL DEFAULT false,  -- Label synthetic demo data
  recorded_by uuid,  -- Who recorded this observation
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_observations_intervention ON public.intervention_observations(intervention_id);
CREATE INDEX idx_observations_type ON public.intervention_observations(observation_type);

-- RLS
ALTER TABLE public.intervention_observations ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.intervention_observations TO authenticated;
GRANT ALL ON public.intervention_observations TO service_role;

CREATE POLICY "staff_all_observations"
  ON public.intervention_observations FOR ALL
  TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));
