-- ----------------------------------------------------
-- 1. Table Definitions & Constraints
-- ----------------------------------------------------

-- 1. Alter Data Imports (already exists in schema)
ALTER TABLE public.data_imports ADD COLUMN IF NOT EXISTS import_hash text UNIQUE;

CREATE TABLE public.academic_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    import_id uuid REFERENCES public.data_imports(id) ON DELETE SET NULL,
    source_record_hash text UNIQUE NOT NULL, 
    supersedes_record_id uuid REFERENCES public.academic_records(id) ON DELETE SET NULL,
    semester integer NOT NULL,
    subject_code text NOT NULL,
    credits numeric NOT NULL CHECK (credits > 0),
    grade_points numeric NOT NULL CHECK (grade_points BETWEEN 0 AND 10),
    is_backlog boolean NOT NULL DEFAULT false,
    recorded_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.attendance_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    import_id uuid REFERENCES public.data_imports(id) ON DELETE SET NULL,
    source_record_hash text UNIQUE NOT NULL, 
    supersedes_record_id uuid REFERENCES public.attendance_records(id) ON DELETE SET NULL,
    date date NOT NULL,
    subject_code text,
    classes_total integer CHECK (classes_total > 0),
    classes_attended integer CHECK (classes_attended >= 0),
    percentage numeric CHECK (percentage >= 0 AND percentage <= 100),
    recorded_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT valid_attendance CHECK (
        (classes_total IS NULL OR classes_attended <= classes_total) AND
        (classes_total IS NOT NULL OR percentage IS NOT NULL)
    )
);

CREATE TABLE public.lms_activity_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    import_id uuid REFERENCES public.data_imports(id) ON DELETE SET NULL,
    source_record_hash text UNIQUE NOT NULL,
    supersedes_record_id uuid REFERENCES public.lms_activity_records(id) ON DELETE SET NULL,
    date date NOT NULL,
    session_id text,
    activity_type text NOT NULL,
    duration_minutes integer CHECK (duration_minutes >= 0),
    recorded_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.engagement_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    import_id uuid REFERENCES public.data_imports(id) ON DELETE SET NULL,
    source_record_hash text UNIQUE NOT NULL,
    supersedes_record_id uuid REFERENCES public.engagement_records(id) ON DELETE SET NULL,
    event_date date NOT NULL,
    activity_type text NOT NULL, 
    points integer NOT NULL CHECK (points >= 0),
    recorded_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.placement_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    import_id uuid REFERENCES public.data_imports(id) ON DELETE SET NULL,
    source_record_hash text UNIQUE NOT NULL,
    supersedes_record_id uuid REFERENCES public.placement_records(id) ON DELETE SET NULL,
    assessment_date date NOT NULL,
    assessment_type text NOT NULL,
    attempt_number integer NOT NULL DEFAULT 1 CHECK (attempt_number >= 1),
    score numeric NOT NULL CHECK (score >= 0),
    max_score numeric NOT NULL CHECK (max_score > 0),
    recorded_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT valid_placement_score CHECK (score <= max_score)
);

CREATE TABLE public.skills_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    import_id uuid REFERENCES public.data_imports(id) ON DELETE SET NULL,
    source_record_hash text UNIQUE NOT NULL,
    supersedes_record_id uuid REFERENCES public.skills_records(id) ON DELETE SET NULL,
    assessment_date date NOT NULL,
    skill_name text NOT NULL,
    score numeric NOT NULL CHECK (score >= 0),
    max_score numeric NOT NULL CHECK (max_score > 0),
    recorded_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT valid_skills_score CHECK (score <= max_score)
);

CREATE TABLE public.feedback_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    import_id uuid REFERENCES public.data_imports(id) ON DELETE SET NULL,
    source_record_hash text UNIQUE NOT NULL,
    supersedes_record_id uuid REFERENCES public.feedback_records(id) ON DELETE SET NULL,
    submitted_by uuid REFERENCES auth.users(id) NOT NULL,
    category text NOT NULL CHECK (category IN ('student_satisfaction', 'faculty_feedback', 'peer_review', 'advisor_note')),
    score numeric CHECK (score >= 0),
    max_score numeric CHECK (max_score > 0),
    notes text,
    is_confidential boolean DEFAULT false,
    recorded_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT valid_feedback_score CHECK (
        (score IS NULL AND max_score IS NULL) OR
        (score IS NOT NULL AND max_score IS NOT NULL AND score <= max_score)
    )
);

-- ----------------------------------------------------
-- 2. Master Cache Update Trigger
-- ----------------------------------------------------

CREATE OR REPLACE FUNCTION public.update_student_cache()
RETURNS TRIGGER AS $$
DECLARE
    target_ids uuid[];
    target_id uuid;
BEGIN
    IF TG_OP = 'DELETE' THEN
        target_ids := ARRAY[OLD.student_id];
    ELSIF TG_OP = 'UPDATE' AND OLD.student_id != NEW.student_id THEN
        target_ids := ARRAY[OLD.student_id, NEW.student_id];
    ELSE
        target_ids := ARRAY[NEW.student_id];
    END IF;

    FOR target_id IN SELECT unnest(target_ids) LOOP
        UPDATE public.students s
        SET 
            cgpa = (
                SELECT SUM(credits * grade_points) / NULLIF(SUM(credits), 0)
                FROM public.academic_records
                WHERE student_id = target_id AND supersedes_record_id IS NULL
            ),
            backlogs = (
                SELECT COUNT(*)::integer
                FROM (
                    SELECT DISTINCT ON (subject_code) is_backlog
                    FROM public.academic_records
                    WHERE student_id = target_id AND supersedes_record_id IS NULL
                    ORDER BY subject_code, recorded_at DESC
                ) latest_subjects
                WHERE is_backlog = true
            ),
            attendance = (
                SELECT COALESCE(
                    SUM(classes_attended)::numeric / NULLIF(SUM(classes_total), 0) * 100,
                    AVG(percentage)
                )
                FROM public.attendance_records
                WHERE student_id = target_id AND supersedes_record_id IS NULL
            ),
            lms_activity = (
                SELECT SUM(duration_minutes)::numeric
                FROM public.lms_activity_records
                WHERE student_id = target_id AND supersedes_record_id IS NULL
            ),
            engagement = (
                SELECT SUM(points)::numeric
                FROM public.engagement_records
                WHERE student_id = target_id AND supersedes_record_id IS NULL
            ),
            placement_readiness = (
                SELECT AVG(score / NULLIF(max_score, 0) * 100)
                FROM public.placement_records
                WHERE student_id = target_id AND supersedes_record_id IS NULL
            ),
            skills_score = (
                SELECT AVG(score / NULLIF(max_score, 0) * 100)
                FROM public.skills_records
                WHERE student_id = target_id AND supersedes_record_id IS NULL
            ),
            feedback_score = (
                SELECT AVG(score / NULLIF(max_score, 0) * 100)
                FROM public.feedback_records
                WHERE student_id = target_id AND supersedes_record_id IS NULL AND is_confidential = false
            )
        WHERE id = target_id;
    END LOOP;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

REVOKE ALL ON FUNCTION public.update_student_cache() FROM PUBLIC;

CREATE TRIGGER on_academic_change AFTER INSERT OR UPDATE OR DELETE ON public.academic_records FOR EACH ROW EXECUTE FUNCTION public.update_student_cache();
CREATE TRIGGER on_attendance_change AFTER INSERT OR UPDATE OR DELETE ON public.attendance_records FOR EACH ROW EXECUTE FUNCTION public.update_student_cache();
CREATE TRIGGER on_lms_change AFTER INSERT OR UPDATE OR DELETE ON public.lms_activity_records FOR EACH ROW EXECUTE FUNCTION public.update_student_cache();
CREATE TRIGGER on_engagement_change AFTER INSERT OR UPDATE OR DELETE ON public.engagement_records FOR EACH ROW EXECUTE FUNCTION public.update_student_cache();
CREATE TRIGGER on_placement_change AFTER INSERT OR UPDATE OR DELETE ON public.placement_records FOR EACH ROW EXECUTE FUNCTION public.update_student_cache();
CREATE TRIGGER on_skills_change AFTER INSERT OR UPDATE OR DELETE ON public.skills_records FOR EACH ROW EXECUTE FUNCTION public.update_student_cache();
CREATE TRIGGER on_feedback_change AFTER INSERT OR UPDATE OR DELETE ON public.feedback_records FOR EACH ROW EXECUTE FUNCTION public.update_student_cache();

-- ----------------------------------------------------
-- 3. Row Level Security & Grants
-- ----------------------------------------------------

ALTER TABLE public.data_imports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lms_activity_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engagement_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_records ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.data_imports TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.academic_records TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.attendance_records TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lms_activity_records TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.engagement_records TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.placement_records TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.skills_records TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.feedback_records TO authenticated;

-- Imports RLS
CREATE POLICY "Admin full imports" ON public.data_imports FOR ALL TO authenticated USING (public.has_role('admin', auth.uid())) WITH CHECK (public.has_role('admin', auth.uid()));
CREATE POLICY "Staff select imports" ON public.data_imports FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

-- Standard Domain RLS
DO $$ 
DECLARE
    tbl text;
    allowed_role text;
BEGIN
    FOR tbl IN SELECT unnest(ARRAY[
        'academic_records', 'attendance_records', 'lms_activity_records', 
        'engagement_records', 'placement_records', 'skills_records'
    ]) LOOP
        -- Define which role accesses which domain
        IF tbl IN ('academic_records', 'attendance_records', 'lms_activity_records', 'engagement_records') THEN
            allowed_role := 'faculty';
        ELSE
            allowed_role := 'placement';
        END IF;

        EXECUTE format('CREATE POLICY "Admin %I" ON public.%I FOR ALL TO authenticated USING (public.has_role(''admin'', auth.uid())) WITH CHECK (public.has_role(''admin'', auth.uid()));', tbl, tbl);
        EXECUTE format('CREATE POLICY "Staff %I" ON public.%I FOR SELECT TO authenticated USING (public.has_role(%L, auth.uid()));', tbl, tbl, allowed_role);
        EXECUTE format('CREATE POLICY "Student %I" ON public.%I FOR SELECT TO authenticated USING (public.has_role(''student'', auth.uid()) AND student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()));', tbl, tbl);
    END LOOP;
END $$;

-- Feedback RLS
CREATE POLICY "Admin feedback" ON public.feedback_records FOR ALL TO authenticated USING (public.has_role('admin', auth.uid())) WITH CHECK (public.has_role('admin', auth.uid()));
CREATE POLICY "Staff select feedback" ON public.feedback_records FOR SELECT TO authenticated USING (
    (public.has_role('faculty', auth.uid()) AND is_confidential = false) OR 
    submitted_by = auth.uid() OR
    public.has_role('admin', auth.uid())
);
CREATE POLICY "Staff insert feedback" ON public.feedback_records FOR INSERT TO authenticated WITH CHECK (public.has_role('faculty', auth.uid()) OR public.has_role('admin', auth.uid()));
CREATE POLICY "Student view feedback" ON public.feedback_records FOR SELECT TO authenticated USING (
    public.has_role('student', auth.uid()) AND 
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()) AND
    is_confidential = false
);

-- ----------------------------------------------------
-- 4. Atomic Server-Side Import RPC
-- ----------------------------------------------------
CREATE OR REPLACE FUNCTION public.import_domain_data(
    p_category text,
    p_filename text,
    p_records jsonb
) RETURNS jsonb AS $$
DECLARE
    v_import_id uuid;
    v_record jsonb;
    v_student_id uuid;
    v_inserted integer := 0;
    v_row_hash text;
    v_prev_record_id uuid;
    v_new_id uuid;
    v_caller_uid uuid := auth.uid();
BEGIN
    -- 1. Security & Role Validation
    IF v_caller_uid IS NULL THEN
        RAISE EXCEPTION 'Unauthorized: unauthenticated';
    END IF;

    IF public.has_role('admin', v_caller_uid) THEN
        -- Admin can import all categories
        NULL;
    ELSIF public.has_role('faculty', v_caller_uid) THEN
        IF p_category NOT IN ('Academic', 'Attendance', 'LMS', 'Engagement', 'Feedback') THEN
            RAISE EXCEPTION 'Unauthorized: Faculty cannot import %', p_category;
        END IF;
    ELSIF public.has_role('placement', v_caller_uid) THEN
        IF p_category NOT IN ('Placement', 'Skills') THEN
            RAISE EXCEPTION 'Unauthorized: Placement cannot import %', p_category;
        END IF;
    ELSE
        RAISE EXCEPTION 'Unauthorized: only authorized staff can import data';
    END IF;

    -- 2. Create import metadata
    INSERT INTO public.data_imports (import_hash, source_filename, category, row_count, imported_by, status)
    VALUES (pg_catalog.md5(p_filename || p_category || pg_catalog.now()::text), p_filename, p_category, pg_catalog.jsonb_array_length(p_records), v_caller_uid, 'completed')
    RETURNING id INTO v_import_id;

    -- 3. Process each record atomically
    FOR v_record IN SELECT * FROM pg_catalog.jsonb_array_elements(p_records) LOOP
        -- Resolve student
        SELECT id INTO v_student_id FROM public.students WHERE roll_no = v_record->>'roll_no';
        IF v_student_id IS NULL THEN
            RAISE EXCEPTION 'Unknown roll_no %; student creation is restricted to authorized workflows', v_record->>'roll_no';
        END IF;

        -- Deterministic hash of the logical record payload for idempotency
        v_row_hash := pg_catalog.md5(p_category || v_student_id::text || v_record::text);
        v_new_id := NULL;
        v_prev_record_id := NULL;

        IF p_category = 'Academic' THEN
            SELECT id INTO v_prev_record_id FROM public.academic_records 
            WHERE student_id = v_student_id AND semester = (v_record->>'semester')::integer AND subject_code = v_record->>'subject_code' AND supersedes_record_id IS NULL;

            INSERT INTO public.academic_records (student_id, import_id, source_record_hash, semester, subject_code, credits, grade_points, is_backlog)
            VALUES (v_student_id, v_import_id, v_row_hash, (v_record->>'semester')::integer, v_record->>'subject_code', (v_record->>'credits')::numeric, (v_record->>'grade_points')::numeric, COALESCE((v_record->>'is_backlog')::boolean, false))
            ON CONFLICT (source_record_hash) DO NOTHING RETURNING id INTO v_new_id;

            IF v_new_id IS NOT NULL AND v_prev_record_id IS NOT NULL THEN
                UPDATE public.academic_records SET supersedes_record_id = v_new_id WHERE id = v_prev_record_id;
            END IF;

        ELSIF p_category = 'Attendance' THEN
            SELECT id INTO v_prev_record_id FROM public.attendance_records 
            WHERE student_id = v_student_id AND date = (v_record->>'date')::date AND COALESCE(subject_code, '') = COALESCE(v_record->>'subject_code', '') AND supersedes_record_id IS NULL;

            INSERT INTO public.attendance_records (student_id, import_id, source_record_hash, date, subject_code, classes_total, classes_attended, percentage)
            VALUES (v_student_id, v_import_id, v_row_hash, (v_record->>'date')::date, v_record->>'subject_code', (v_record->>'classes_total')::integer, (v_record->>'classes_attended')::integer, (v_record->>'percentage')::numeric)
            ON CONFLICT (source_record_hash) DO NOTHING RETURNING id INTO v_new_id;

            IF v_new_id IS NOT NULL AND v_prev_record_id IS NOT NULL THEN
                UPDATE public.attendance_records SET supersedes_record_id = v_new_id WHERE id = v_prev_record_id;
            END IF;

        ELSIF p_category = 'LMS' THEN
            SELECT id INTO v_prev_record_id FROM public.lms_activity_records 
            WHERE student_id = v_student_id AND date = (v_record->>'date')::date AND activity_type = v_record->>'activity_type' AND COALESCE(session_id, '') = COALESCE(v_record->>'session_id', '') AND supersedes_record_id IS NULL;

            INSERT INTO public.lms_activity_records (student_id, import_id, source_record_hash, date, session_id, activity_type, duration_minutes)
            VALUES (v_student_id, v_import_id, v_row_hash, (v_record->>'date')::date, v_record->>'session_id', v_record->>'activity_type', (v_record->>'duration_minutes')::integer)
            ON CONFLICT (source_record_hash) DO NOTHING RETURNING id INTO v_new_id;

            IF v_new_id IS NOT NULL AND v_prev_record_id IS NOT NULL THEN
                UPDATE public.lms_activity_records SET supersedes_record_id = v_new_id WHERE id = v_prev_record_id;
            END IF;

        ELSIF p_category = 'Engagement' THEN
            SELECT id INTO v_prev_record_id FROM public.engagement_records 
            WHERE student_id = v_student_id AND event_date = (v_record->>'event_date')::date AND activity_type = v_record->>'activity_type' AND supersedes_record_id IS NULL;

            INSERT INTO public.engagement_records (student_id, import_id, source_record_hash, event_date, activity_type, points)
            VALUES (v_student_id, v_import_id, v_row_hash, (v_record->>'event_date')::date, v_record->>'activity_type', (v_record->>'points')::integer)
            ON CONFLICT (source_record_hash) DO NOTHING RETURNING id INTO v_new_id;

            IF v_new_id IS NOT NULL AND v_prev_record_id IS NOT NULL THEN
                UPDATE public.engagement_records SET supersedes_record_id = v_new_id WHERE id = v_prev_record_id;
            END IF;

        ELSIF p_category = 'Placement' THEN
            SELECT id INTO v_prev_record_id FROM public.placement_records 
            WHERE student_id = v_student_id AND assessment_date = (v_record->>'assessment_date')::date AND assessment_type = v_record->>'assessment_type' AND attempt_number = COALESCE((v_record->>'attempt_number')::integer, 1) AND supersedes_record_id IS NULL;

            INSERT INTO public.placement_records (student_id, import_id, source_record_hash, assessment_date, assessment_type, attempt_number, score, max_score)
            VALUES (v_student_id, v_import_id, v_row_hash, (v_record->>'assessment_date')::date, v_record->>'assessment_type', COALESCE((v_record->>'attempt_number')::integer, 1), (v_record->>'score')::numeric, (v_record->>'max_score')::numeric)
            ON CONFLICT (source_record_hash) DO NOTHING RETURNING id INTO v_new_id;

            IF v_new_id IS NOT NULL AND v_prev_record_id IS NOT NULL THEN
                UPDATE public.placement_records SET supersedes_record_id = v_new_id WHERE id = v_prev_record_id;
            END IF;

        ELSIF p_category = 'Skills' THEN
            SELECT id INTO v_prev_record_id FROM public.skills_records 
            WHERE student_id = v_student_id AND assessment_date = (v_record->>'assessment_date')::date AND skill_name = v_record->>'skill_name' AND supersedes_record_id IS NULL;

            INSERT INTO public.skills_records (student_id, import_id, source_record_hash, assessment_date, skill_name, score, max_score)
            VALUES (v_student_id, v_import_id, v_row_hash, (v_record->>'assessment_date')::date, v_record->>'skill_name', (v_record->>'score')::numeric, (v_record->>'max_score')::numeric)
            ON CONFLICT (source_record_hash) DO NOTHING RETURNING id INTO v_new_id;

            IF v_new_id IS NOT NULL AND v_prev_record_id IS NOT NULL THEN
                UPDATE public.skills_records SET supersedes_record_id = v_new_id WHERE id = v_prev_record_id;
            END IF;

        ELSIF p_category = 'Feedback' THEN
            SELECT id INTO v_prev_record_id FROM public.feedback_records 
            WHERE student_id = v_student_id AND category = v_record->>'category' AND submitted_by = COALESCE((v_record->>'submitted_by')::uuid, v_caller_uid) AND supersedes_record_id IS NULL;

            INSERT INTO public.feedback_records (student_id, import_id, source_record_hash, submitted_by, category, score, max_score, notes, is_confidential)
            VALUES (v_student_id, v_import_id, v_row_hash, COALESCE((v_record->>'submitted_by')::uuid, v_caller_uid), v_record->>'category', (v_record->>'score')::numeric, (v_record->>'max_score')::numeric, v_record->>'notes', COALESCE((v_record->>'is_confidential')::boolean, false))
            ON CONFLICT (source_record_hash) DO NOTHING RETURNING id INTO v_new_id;

            IF v_new_id IS NOT NULL AND v_prev_record_id IS NOT NULL THEN
                UPDATE public.feedback_records SET supersedes_record_id = v_new_id WHERE id = v_prev_record_id;
            END IF;
        END IF;
        
        IF v_new_id IS NOT NULL THEN
            v_inserted := v_inserted + 1;
        END IF;
    END LOOP;

    RETURN jsonb_build_object('success', true, 'import_id', v_import_id, 'rows_inserted', v_inserted);
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

REVOKE ALL ON FUNCTION public.import_domain_data(text, text, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.import_domain_data(text, text, jsonb) TO authenticated;
