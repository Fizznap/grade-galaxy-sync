import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight, ArrowRight, Users, BarChart3, ClipboardCheck, Database, Bell, UserCircle } from "lucide-react";
import { Bar as RBar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { studentsQuery, interventionsQuery, avg } from "@/lib/data";
import { Card, RiskBadge, SectionTitle, Stat, StudentLink } from "@/components/kr";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Home — KRYPTEDU" }, { name: "description", content: "Institutional student success overview." }, { property: "og:title", content: "Home — KRYPTEDU" }, { property: "og:description", content: "Institutional student success overview." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  loader: ({ context }) =>
    Promise.all([context.queryClient.ensureQueryData(studentsQuery), context.queryClient.ensureQueryData(interventionsQuery)]),
  component: Dashboard,
  errorComponent: ({ error }) => <div role="alert" className="text-sm">{String((error as Error)?.message ?? error)}</div>,
});

const tooltipStyle = { borderRadius: 12, border: "1px solid var(--color-border)", fontSize: 12 };
const quickAccess = [
  { to: "/students", label: "Students", icon: Users },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/interventions", label: "Interventions", icon: ClipboardCheck },
  { to: "/integration", label: "Import data", icon: Database },
] as const;

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
      <header className="mb-7 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">Your campus, connected</p>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" className="rounded-full"><Link to="/notifications" aria-label="Notifications"><Bell className="size-4" /></Link></Button>
          <Button asChild variant="secondary" size="icon" className="rounded-full border border-glass-border"><Link to="/profile" aria-label="Profile"><UserCircle className="size-5" /></Link></Button>
        </div>
      </header>
      <div className="rise mb-6">
        <p className="mb-2 text-xs font-medium text-primary-deep">KRYPTEDU · CAMPUS WORKSPACE</p>
        <h1 className="text-[28px] font-semibold leading-tight sm:text-4xl">Who needs your<br className="sm:hidden" /> attention today?</h1>
      </div>
      <Link to="/insights" className="press rise mb-7 flex flex-col justify-between gap-5 rounded-2xl bg-primary p-5 text-primary-foreground shadow-soft sm:flex-row sm:items-center sm:p-6">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold"><span aria-hidden className="grid size-7 place-items-center rounded-full border border-primary-foreground/40">K</span> Ask KRYPTEDU</div>
          <p className="mt-3 text-lg font-medium">A clearer picture of student success.</p>
          <p className="mt-1 text-sm text-primary-foreground/80">Explore your cohort’s academic and placement signals.</p>
        </div>
        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
          <span className="rounded-full bg-primary-foreground/15 px-3 py-1 text-xs">{students.length} students · {depts.length} departments</span>
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-foreground text-primary-deep"><ArrowRight className="size-4" /></span>
        </div>
      </Link>
      <SectionTitle title="Quick access" />
      <div className="mb-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {quickAccess.map(({ to, label, icon: Icon }) => <Link key={to} to={to} className="card-surface press flex min-w-0 items-center gap-3 p-3.5"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-primary-deep"><Icon className="size-[18px]" /></span><span className="text-sm font-medium">{label}</span></Link>)}
      </div>
      <SectionTitle title="Campus overview" />
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
