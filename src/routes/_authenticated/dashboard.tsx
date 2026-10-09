import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight, ArrowRight, Users, BarChart3, ClipboardCheck, Database, Bell, UserCircle } from "lucide-react";
import { studentsQuery, interventionsQuery, avg } from "@/lib/data";
import { Card, RiskBadge, SectionTitle, Stat, StudentLink } from "@/components/kr";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Home — KRYPTEDU" }] }),
  loader: ({ context }) =>
    Promise.all([context.queryClient.ensureQueryData(studentsQuery), context.queryClient.ensureQueryData(interventionsQuery)]),
  component: Dashboard,
  errorComponent: ({ error }) => <div role="alert" className="text-sm">{String((error as Error)?.message ?? error)}</div>,
});

const quickAccess = [
  { to: "/students", label: "Students", icon: Users },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/interventions", label: "Interventions", icon: ClipboardCheck },
  { to: "/data", label: "Import data", icon: Database },
] as const;

function Dashboard() {
  const { data: students } = useSuspenseQuery(studentsQuery);
  const { data: interventions } = useSuspenseQuery(interventionsQuery);
  
  const acHigh = students.filter((s) => s.academicRisk === "High").length;
  const plHigh = students.filter((s) => s.placementRisk === "High").length;

  const validScores = students.filter(s => s.successScore > 0);
  const avgScore = validScores.length ? avg(validScores.map(s => s.successScore)) : 0;

  // Calculate generic completeness: % of fields > 0
  let fieldsCount = 0;
  let populatedCount = 0;
  students.forEach(s => {
     const fields = [s.cgpa, s.attendance, s.lms_activity, s.engagement, s.placement_readiness, s.skills_score, s.feedback_score];
     fieldsCount += fields.length;
     populatedCount += fields.filter(f => f > 0).length;
  });
  const dataCompleteness = fieldsCount ? Math.round((populatedCount / fieldsCount) * 100) : 0;

  const priority = [...students]
    .filter((s) => s.academicRisk === "High" || s.placementRisk === "High")
    .sort((a, b) => a.successScore - b.successScore)
    .slice(0, 5);
    
  const open = interventions.filter((i) => i.status !== "Completed").length;

  return (
    <>
      <header className="mb-7 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">Your campus, connected</p>
        <div className="hidden items-center gap-2 lg:flex">
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
          <span className="rounded-full bg-primary-foreground/15 px-3 py-1 text-xs">{students.length} students enrolled</span>
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-foreground text-primary-deep"><ArrowRight className="size-4" /></span>
        </div>
      </Link>
      
      <SectionTitle title="Quick access" />
      <div className="mb-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {quickAccess.map(({ to, label, icon: Icon }) => <Link key={to} to={to} className="card-surface press flex min-w-0 items-center gap-3 p-3.5"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-primary-deep"><Icon className="size-[18px]" /></span><span className="text-sm font-medium">{label}</span></Link>)}
      </div>
      
      <SectionTitle title="Campus overview" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Stat label="Total students" value={students.length} hint="Active enrollment" />
        <Stat label="Academic Risk" value={acHigh} hint="Support needed" />
        <Stat label="Placement Risk" value={plHigh} hint="Action required" />
        <Stat label="Avg Success Score" value={avgScore} hint="Valid profiles only" />
        <Stat label="Data Completeness" value={`${dataCompleteness}%`} hint="Overall coverage" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionTitle title="Priority cases (Needing attention)" action={<Link to="/students" className="text-xs text-muted-foreground hover:text-foreground">View all →</Link>} />
          <div className="divide-y">
            {priority.length === 0 ? <div className="text-sm text-subtle py-3">No priority cases currently identified.</div> : priority.map((s) => (
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
          <SectionTitle title="Action required" />
          <ul className="space-y-4 text-sm mt-2">
            <li>
               <div className="font-medium">{open} active interventions</div>
               <div className="text-xs text-muted-foreground"><Link to="/interventions" className="underline underline-offset-2">Review pending cases</Link></div>
            </li>
            <li>
               <div className="font-medium">Data Integration Status</div>
               <div className="text-xs text-muted-foreground mt-1">
                 {dataCompleteness < 50 ? "Significant gaps detected in student records. Import recent datasets to improve predictive accuracy." : "Data coverage is healthy."}
                 <br/><Link to="/data" className="underline underline-offset-2">Import data</Link>
               </div>
            </li>
          </ul>
        </Card>
      </div>
    </>
  );
}
