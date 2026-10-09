import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { Bar as RBar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { studentsQuery, interventionsQuery, avg } from "@/lib/data";
import { Card, PageHeader, RiskBadge, SectionTitle, Stat, StudentLink } from "@/components/kr";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Home — KRYPTEDU" }, { name: "description", content: "Institutional student success overview." }] }),
  loader: ({ context }) =>
    Promise.all([context.queryClient.ensureQueryData(studentsQuery), context.queryClient.ensureQueryData(interventionsQuery)]),
  component: Dashboard,
  errorComponent: ({ error }: { error: Error }) => <div role="alert" className="text-sm">{error.message}</div>,
});

const tooltipStyle = { borderRadius: 12, border: "1px solid var(--color-border)", fontSize: 12 };

function Dashboard() {
  const { data: students } = useSuspenseQuery(studentsQuery);
  const { data: interventions } = useSuspenseQuery(interventionsQuery);
  const acHigh = students.filter((s) => s.academicRisk === "High").length;
  const plHigh = students.filter((s) => s.placementRisk === "High").length;

  const bins = ["0-39", "40-49", "50-59", "60-69", "70-79", "80+"].map((b, i) => ({
    bin: b,
    count: students.filter((s) => {
      const v = s.successScore;
      return i === 0 ? v < 40 : i === 5 ? v >= 80 : v >= 30 + i * 10 && v < 40 + i * 10;
    }).length,
  }));
  const depts = [...new Set(students.map((s) => s.department))].map((d) => {
    const g = students.filter((s) => s.department === d);
    return { dept: d.replace("Information Tech", "IT").replace("Computer Science", "CS"), score: avg(g.map((s) => s.successScore)) };
  });
  const priority = [...students]
    .filter((s) => s.academicRisk === "High" || s.placementRisk === "High")
    .sort((a, b) => a.successScore - b.successScore)
    .slice(0, 5);
  const open = interventions.filter((i) => i.status !== "Completed").length;
  const bestDept = [...depts].sort((a, b) => b.score - a.score)[0];
  const worstDept = [...depts].sort((a, b) => a.score - b.score)[0];

  return (
    <>
      <PageHeader eyebrow="Institution overview" title="Student success, at a glance" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Total students" value={students.length} hint={`${depts.length} departments`} />
        <Stat label="Avg. Success Score" value={avg(students.map((s) => s.successScore))} hint="out of 100" />
        <Stat label="Academic risk · High" value={acHigh} hint={`${Math.round((acHigh / students.length) * 100)}% of cohort`} />
        <Stat label="Placement risk · High" value={plHigh} hint={`${Math.round((plHigh / students.length) * 100)}% of cohort`} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <SectionTitle title="Success Score distribution" />
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={bins}>
                <XAxis dataKey="bin" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={11} width={24} />
                <Tooltip cursor={{ fill: "var(--color-surface)" }} contentStyle={tooltipStyle} />
                <RBar dataKey="count" radius={[6, 6, 0, 0]}>
                  {bins.map((_, i) => <Cell key={i} fill={`var(--color-chart-${i < 2 ? 1 : i < 4 ? 3 : 4})`} />)}
                </RBar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <SectionTitle title="Department comparison" action={<span className="text-xs text-subtle">Avg. Success Score</span>} />
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={depts} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis type="category" dataKey="dept" tickLine={false} axisLine={false} fontSize={11} width={80} />
                <Tooltip cursor={{ fill: "var(--color-surface)" }} contentStyle={tooltipStyle} />
                <RBar dataKey="score" fill="var(--color-chart-2)" radius={[0, 6, 6, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionTitle title="Priority cases" action={<Link to="/students" className="text-xs text-muted-foreground hover:text-foreground">View all →</Link>} />
          <div className="divide-y">
            {priority.map((s) => (
              <StudentLink key={s.id} id={s.id} className="flex items-center gap-3 py-3 hover:opacity-80">
                <div className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-2 text-sm font-semibold tabular-nums">{s.successScore}</div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{s.name}</div>
                  <div className="truncate text-xs text-subtle">{s.department} · {s.riskFactors[0] ?? "—"}</div>
                </div>
                <div className="hidden gap-1 sm:flex">
                  <RiskBadge risk={s.academicRisk} label="Acad" />
                  <RiskBadge risk={s.placementRisk} label="Plc" />
                </div>
                <ArrowUpRight className="size-4 text-subtle" />
              </StudentLink>
            ))}
          </div>
        </Card>
        <Card>
          <SectionTitle title="Recent insights" />
          <ul className="space-y-4 text-sm">
            <li><div className="font-medium">{bestDept?.dept} leads</div><div className="text-xs text-muted-foreground">Highest avg. success score at {bestDept?.score}.</div></li>
            <li><div className="font-medium">{worstDept?.dept} needs attention</div><div className="text-xs text-muted-foreground">Lowest avg. success score at {worstDept?.score}.</div></li>
            <li><div className="font-medium">{students.filter((s) => s.segment === "High Academic / Low Placement").length} strong students not placement-ready</div><div className="text-xs text-muted-foreground">Good academics, weak placement readiness.</div></li>
            <li><div className="font-medium">{open} open interventions</div><div className="text-xs text-muted-foreground"><Link to="/interventions" className="underline underline-offset-2">Review follow-ups</Link></div></li>
          </ul>
        </Card>
      </div>
    </>
  );
}
