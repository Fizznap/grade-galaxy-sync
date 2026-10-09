import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Activity, BookOpen, CalendarCheck, GraduationCap, Briefcase, Star, Upload, CheckCircle2, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { importsQuery, studentsQuery } from "@/lib/data";
import { CATEGORIES, parseCsv, validate, type Category } from "@/lib/csv";
import { Card, PageHeader, SectionTitle } from "@/components/kr";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/integration")({
  head: () => ({ meta: [{ title: "Data Integration — KRYPTEDU" }, { name: "description", content: "Import and validate institutional data." }] }),
  loader: ({ context }) => Promise.all([context.queryClient.ensureQueryData(importsQuery), context.queryClient.ensureQueryData(studentsQuery)]),
  component: Integration,
  errorComponent: ({ error }) => <div role="alert" className="text-sm">{error.message}</div>,
});

const ICONS: Record<Category, typeof Activity> = {
  Academic: GraduationCap, Attendance: CalendarCheck, LMS: BookOpen, Engagement: Activity, Placement: Briefcase, "Skills and Feedback": Star,
};

function Integration() {
  const { data: imports } = useSuspenseQuery(importsQuery);
  const { data: students } = useSuspenseQuery(studentsQuery);
  const qc = useQueryClient();
  const [cat, setCat] = useState<Category>("Academic");
  const [result, setResult] = useState<{ ok: number; errors: string[] } | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const quality = (c: Category) => {
    const f = CATEGORIES[c];
    const filled = students.filter((s) => f.every((k) => Number((s as unknown as Record<string, number>)[k]) > 0 || k === "backlogs")).length;
    return Math.round((filled / Math.max(1, students.length)) * 100);
  };

  async function onFile(file: File) {
    setBusy(true);
    setResult(null);
    const { headers, rows } = parseCsv(await file.text());
    const { valid, errors } = validate(cat, headers, rows);
    const known = new Map(students.map((s) => [s.roll_no, s.id]));
    let ok = 0;
    for (const row of valid) {
      const { roll_no, ...fields } = row;
      if (known.has(String(roll_no))) {
        const { error } = await supabase.from("students").update({ ...fields, updated_at: new Date().toISOString() }).eq("roll_no", String(roll_no));
        if (error) errors.push(`${roll_no}: ${error.message}`); else ok++;
      } else if (fields.name && fields.department) {
        const { error } = await supabase.from("students").insert({ roll_no: String(roll_no), ...fields } as never);
        if (error) errors.push(`${roll_no}: ${error.message}`); else ok++;
      } else {
        errors.push(`${roll_no}: unknown roll number (add name and department columns to create new students)`);
      }
    }
    const { data: u } = await supabase.auth.getUser();
    await supabase.from("data_imports").insert({
      category: cat, filename: file.name, row_count: ok,
      status: errors.length === 0 ? "Completed" : ok > 0 ? "Warning" : "Failed",
      message: errors.length ? `${errors.length} issue(s)` : "All rows validated", created_by: u.user?.id,
    });
    setResult({ ok, errors });
    setBusy(false);
    qc.invalidateQueries();
    if (ok) toast.success(`${ok} record(s) imported`); else toast.error("No rows imported");
  }

  return (
    <>
      <PageHeader eyebrow="Unified student data" title="Data integration" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {(Object.keys(CATEGORIES) as Category[]).map((c) => {
          const Icon = ICONS[c];
          const q = quality(c);
          const last = imports.find((i) => i.category === c);
          return (
            <button key={c} onClick={() => setCat(c)} className={cn("card-surface p-4 text-left transition-colors", cat === c ? "border-primary ring-1 ring-primary" : "hover:bg-surface")}>
              <div className="flex items-center justify-between">
                <div className="grid size-10 place-items-center rounded-xl bg-surface-2"><Icon className="size-[18px]" strokeWidth={1.6} /></div>
                <span className="text-[11px] text-subtle">{last ? "● Connected" : "○ Not synced"}</span>
              </div>
              <div className="mt-3 text-sm font-medium">{c}</div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2"><div className="h-full bg-primary" style={{ width: `${q}%` }} /></div>
              <div className="mt-1 text-[11px] text-subtle">Data quality {q}%</div>
            </button>
          );
        })}
      </div>

      <Card className="mt-4">
        <SectionTitle title={`Upload ${cat} CSV`} />
        <p className="text-sm text-muted-foreground">
          Required columns: <code className="rounded bg-surface-2 px-1.5 py-0.5 text-xs">roll_no, {CATEGORIES[cat].join(", ")}</code>. Optional: name, department, year (creates new students).
        </p>
        <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ""; }} />
        <Button onClick={() => fileRef.current?.click()} disabled={busy} className="mt-4 h-11 rounded-xl"><Upload className="size-4" />{busy ? "Validating…" : "Choose CSV file"}</Button>
        {result && (
          <div className="mt-4 space-y-2 rounded-xl bg-surface p-4 text-sm">
            <div className="flex items-center gap-2 font-medium"><CheckCircle2 className="size-4" />{result.ok} rows imported</div>
            {result.errors.slice(0, 8).map((e) => <div key={e} className="flex items-start gap-2 text-xs text-muted-foreground"><AlertTriangle className="mt-0.5 size-3.5 shrink-0" />{e}</div>)}
            {result.errors.length > 8 && <div className="text-xs text-subtle">+{result.errors.length - 8} more</div>}
          </div>
        )}
      </Card>

      <Card className="mt-4">
        <SectionTitle title="Import history" />
        <div className="divide-y">
          {imports.map((i) => (
            <div key={i.id} className="flex items-center gap-3 py-3 text-sm">
              <span className={cn("rounded-full border px-2 py-0.5 text-[11px]", i.status === "Failed" ? "border-primary bg-primary text-primary-foreground" : i.status === "Warning" ? "bg-surface-2" : "")}>{i.status}</span>
              <div className="min-w-0 flex-1"><div className="truncate font-medium">{i.filename}</div><div className="text-xs text-subtle">{i.category} · {i.row_count} rows · {i.message}</div></div>
              <div className="text-xs text-subtle">{new Date(i.created_at).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
