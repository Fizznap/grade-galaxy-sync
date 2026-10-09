CREATE TABLE public.notification_reads (
  user_id uuid NOT NULL,
  notification_key text NOT NULL,
  read_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, notification_key)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notification_reads TO authenticated;
GRANT ALL ON public.notification_reads TO service_role;
ALTER TABLE public.notification_reads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own reads select" ON public.notification_reads FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own reads insert" ON public.notification_reads FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own reads update" ON public.notification_reads FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own reads delete" ON public.notification_reads FOR DELETE TO authenticated USING (auth.uid() = user_id);