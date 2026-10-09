import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, Plus } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { studentsQuery, interventionsQuery } from "@/lib/data";
import { Bar, Card, Empty, PageHeader, RiskBadge, ScoreRing, SectionTitle } from "@/components/kr";
import { Button } from "@/components/ui/button";
import { InterventionDialog } from "@/components/InterventionForm";

export const Route = createFileRoute("/_authenticated/students/$id")({
  head: () => ({ meta: [{ title: "Student profile — KRYPTEDU" }, { name: "description", content: "Student intelligence profile." }] }),
  loader: async ({ context, params }) => {
    const list = await context.queryClient.ensureQueryData(studentsQuery);
    await context.queryClient.ensureQueryData(interventionsQuery);
    if (!list.find((s) => s.id === params.id)) throw notFound();
  },
  component: Profile,
  notFoundComponent: () => <Empty title="Student not found" />,
  errorComponent: ({ error }) => <div role="alert" className="text-sm">{String((error as Error)?.message ?? error)}</div>,
});

// Deterministic trend derived from current values (semester history placeholder for demo data)
function trend(seed: number, end: number, spread: number, n = 6) {
  return Array.from({ length: n }, (_, i) => {
    const wobble = Math.sin(seed * 13 + i * 1.7) * spread;
    return +(end - (n - 1 - i) * (spread / 4) + wobble).toFixed(2);
  }).map((v, i, a) => (i === a.length - 1 ? end : v));
}

function Profile() {
  const { id } = Route.useParams();
  const { data: students } = useSuspenseQuery(studentsQuery);
  const { data: interventions } = useSuspenseQuery(interventionsQuery);
  const s = students.find((x) => x.id === id)!;
  const seed = s.roll_no.charCodeAt(s.roll_no.length - 1);
  const gpa = trend(seed, s.cgpa, 0.6).map((v, i) => ({ sem: `S${i + 1}`, v: Math.min(10, Math.max(4, v)) }));
  const att = trend(seed + 3, s.attendance, 8).map((v, i) => ({ m: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"][i], v: Math.min(100, Math.max(30, Math.round(v))) }));
  const mine = interventions.filter((i) => i.student_id === s.id);
  const tt = { borderRadius: 12, border: "1px solid var(--color-border)", fontSize: 12 };

  return (
    <>
      <Link to="/students" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Students</Link>
      <PageHeader
        eyebrow={`${s.roll_no} · ${s.department} · Year ${s.year}`}
        title={s.name}
        action={<InterventionDialog students={students} defaultStudentId={s.id} trigger={<Button className="rounded-xl"><Plus className="size-4" /> <span className="hidden sm:inline">Create intervention</span></Button>} />}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="flex flex-col items-center gap-4">
          <ScoreRing value={s.successScore} />
          <div className="flex flex-wrap justify-center gap-2">
            <RiskBadge risk={s.academicRisk} label="Academic" />
            <RiskBadge risk={s.placementRisk} label="Placement" />
          </div>
          <div className="text-center text-xs text-subtle">{s.segment}</div>
        </Card>
        <Card className="lg:col-span-2">
          <SectionTitle title="Score components" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Bar label="Academic index (45%)" value={s.academicIndex} />
            <Bar label="Placement index (35%)" value={s.placementIndex} />
            <Bar label="Engagement (20%)" value={s.engagement} />
            <Bar label="Attendance" value={s.attendance} right={`${s.attendance}%`} />
            <Bar label="LMS activity" value={s.lms_activity} />
            <Bar label="CGPA" value={s.cgpa * 10} right={String(s.cgpa)} />
          </div>
        </Card>
        <Card>
          <SectionTitle title="Academic trend (CGPA)" />
          <div className="h-40"><ResponsiveContainer><LineChart data={gpa}><XAxis dataKey="sem" fontSize={11} tickLine={false} axisLine={false} /><YAxis domain={[4, 10]} fontSize={11} width={24} tickLine={false} axisLine={false} /><Tooltip contentStyle={tt} /><Line dataKey="v" stroke="var(--color-chart-1)" strokeWidth={2} dot={{ r: 3, fill: "var(--color-chart-1)" }} /></LineChart></ResponsiveContainer></div>
        </Card>
        <Card>
          <SectionTitle title="Attendance history" />
          <div className="h-40"><ResponsiveContainer><LineChart data={att}><XAxis dataKey="m" fontSize={11} tickLine={false} axisLine={false} /><YAxis domain={[30, 100]} fontSize={11} width={24} tickLine={false} axisLine={false} /><Tooltip contentStyle={tt} /><Line dataKey="v" stroke="var(--color-chart-3)" strokeWidth={2} strokeDasharray="4 3" dot={{ r: 3, fill: "var(--color-chart-3)" }} /></LineChart></ResponsiveContainer></div>
        </Card>
        <Card>
          <SectionTitle title="Placement readiness" />
          <div className="space-y-4">
            <Bar label="Readiness" value={s.placement_readiness} />
            <Bar label="Skills" value={s.skills_score} />
            <Bar label="Faculty feedback" value={s.feedback_score} />
          </div>
        </Card>
        <Card className="lg:col-span-2">
          <SectionTitle title="Contributing risk factors" />
          {s.riskFactors.length === 0 ? <div className="text-sm text-muted-foreground">No significant risk factors.</div> : (
            <ul className="grid gap-2 sm:grid-cols-2">
              {s.riskFactors.map((r) => <li key={r} className="flex items-center gap-2 rounded-xl bg-surface px-3 py-2.5 text-sm"><span className="size-1.5 rounded-full bg-primary" />{r}</li>)}
            </ul>
          )}
        </Card>
        <Card>
          <SectionTitle title="Interventions" />
          {mine.length === 0 ? <div className="text-sm text-muted-foreground">None yet.</div> : (
            <ul className="space-y-2">{mine.map((i) => <li key={i.id} className="text-sm"><div className="font-medium">{i.title}</div><div className="text-xs text-subtle">{i.status} · {i.priority} priority</div></li>)}</ul>
          )}
        </Card>
      </div>
    </>
  );
}
