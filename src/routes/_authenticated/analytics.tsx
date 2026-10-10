import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Bar as RBar, BarChart, CartesianGrid, Line, LineChart, ReferenceArea, ReferenceLine, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts";
import { studentsQuery, avg } from "@/lib/data";
import { SEGMENTS, SUPPORT_GROUPS, supportGroups, type SupportGroup } from "@/lib/scoring";
import { Card, PageHeader, Pill, SectionTitle, StudentLink } from "@/components/kr";

export const Route = createFileRoute("/_authenticated/analytics")({
  head: () => ({ meta: [{ title: "Analytics — KRYPTEDU" }, { name: "description", content: "Segmentation and cohort analytics." }, { property: "og:title", content: "Analytics — KRYPTEDU" }, { property: "og:description", content: "Segmentation and cohort analytics." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(studentsQuery),
  component: Analytics,
  errorComponent: ({ error }) => <div role="alert" className="text-sm">{String((error as Error)?.message ?? error)}</div>,
});

const tt = { borderRadius: 12, border: "1px solid var(--color-border)", fontSize: 12 };
const segFill = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)"];
const segShape = ["circle", "square", "triangle", "diamond"] as const;

function Analytics() {
  const { data } = useSuspenseQuery(studentsQuery);
  const [dept, setDept] = useState("All");
  const [seg, setSeg] = useState<string | null>(null);
  const [grp, setGrp] = useState<SupportGroup | null>(null);
  const depts = ["All", ...new Set(data.map((s) => s.department))];
  const list = data.filter((s) => dept === "All" || s.department === dept);

  const years = [2, 3, 4].map((y) => {
    const g = list.filter((s) => s.year === y);
    return { year: `Year ${y}`, academic: avg(g.map((s) => s.academicIndex)), placement: avg(g.map((s) => s.placementIndex)), success: avg(g.map((s) => s.successScore)) };
  });
  const risk = ["High", "Medium", "Low"].map((r) => ({
    r, academic: list.filter((s) => s.academicRisk === r).length, placement: list.filter((s) => s.placementRisk === r).length,
  }));
  const segCounts = SEGMENTS.map((sg) => ({ sg, n: list.filter((s) => s.segment === sg).length }));
  const grpCounts = SUPPORT_GROUPS.map((g) => ({ ...g, list: list.filter((s) => supportGroups(s).includes(g.id)) }));
  const grpList = grp ? grpCounts.find((g) => g.id === grp)?.list ?? [] : [];
  const segList = seg ? list.filter((s) => s.segment === seg) : [];

  return (
    <>
      <PageHeader eyebrow="Analytics & segmentation" title="Cohort intelligence" />
      <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-2">
        {depts.map((d) => <Pill key={d} active={dept === d} onClick={() => setDept(d)}>{d}</Pill>)}
      </div>

      <Card>
        <SectionTitle title="Student segmentation" action={<span className="text-xs text-subtle">Academic index × Placement index</span>} />
        <div className="h-80">
          <ResponsiveContainer>
            <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
              <ReferenceArea x1={65} x2={100} y1={60} y2={100} fill="var(--color-surface-2)" />
              <ReferenceArea x1={0} x2={65} y1={0} y2={60} fill="var(--color-surface)" />
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="2 4" />
              <XAxis type="number" dataKey="academicIndex" domain={[0, 100]} name="Academic" fontSize={11} tickLine={false} label={{ value: "Academic index", position: "insideBottom", offset: -10, fontSize: 11 }} />
              <YAxis type="number" dataKey="placementIndex" domain={[0, 100]} name="Placement" fontSize={11} tickLine={false} width={30} />
              <ZAxis range={[60, 60]} />
              <ReferenceLine x={65} stroke="var(--color-chart-2)" strokeDasharray="4 4" />
              <ReferenceLine y={60} stroke="var(--color-chart-2)" strokeDasharray="4 4" />
              <Tooltip contentStyle={tt} formatter={(v) => v} labelFormatter={() => ""} />
              {SEGMENTS.map((sg, i) => (
                <Scatter key={sg} name={sg} data={list.filter((s) => s.segment === sg)} fill={segFill[i]} shape={segShape[i]} onClick={() => setSeg(sg)} />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
          {segCounts.map(({ sg, n }, i) => (
            <button key={sg} onClick={() => setSeg(seg === sg ? null : sg)} className={`rounded-xl border p-3 text-left transition-colors ${seg === sg ? "border-primary bg-selected" : "hover:bg-surface"}`}>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground"><span aria-hidden>{["●", "■", "▲", "◆"][i]}</span>{sg}</div>
              <div className="mt-1 text-2xl font-semibold tabular-nums">{n}</div>
            </button>
          ))}
        </div>
        {seg && (
          <div className="mt-4 border-t pt-4">
            <div className="mb-2 text-xs text-subtle">{seg} · {segList.length} students</div>
            <div className="flex flex-wrap gap-2">
              {segList.map((s) => <StudentLink key={s.id} id={s.id} className="rounded-full border px-3 py-1.5 text-xs hover:bg-surface">{s.name} · {s.successScore}</StudentLink>)}
            </div>
          </div>
        )}
      </Card>

      <Card className="mt-4">
        <SectionTitle title="Support groups" action={<span className="text-xs text-subtle">Tap a group to see its students</span>} />
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-5">
          {grpCounts.map((g) => (
            <button key={g.id} aria-pressed={grp === g.id} onClick={() => setGrp(grp === g.id ? null : g.id)} className={`rounded-xl border p-3 text-left transition-colors ${grp === g.id ? "border-primary bg-selected" : "hover:bg-surface"}`}>
              <div className="text-2xl font-semibold">{g.list.length}</div>
              <div className="text-sm font-medium">{g.id}</div>
              <div className="mt-1 text-[11px] text-subtle">{g.rule}</div>
            </button>
          ))}
        </div>
        {grp && (
          <div className="mt-4 divide-y">
            {grpList.length === 0 ? <p className="py-3 text-sm text-muted-foreground">No students in this group{dept !== "All" ? ` in ${dept}` : ""}.</p> :
              [...grpList].sort((a, b) => a.successScore - b.successScore).map((s) => (
                <div key={s.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <StudentLink id={s.id} name={s.name} />
                  <span className="text-xs text-subtle">{s.roll_no} · Score {s.successScore} · Att. {s.attendance}% · CGPA {s.cgpa}</span>
                </div>
              ))}
          </div>
        )}
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <SectionTitle title="Indices by year" />
          <div className="h-56"><ResponsiveContainer><LineChart data={years}><CartesianGrid stroke="var(--color-border)" strokeDasharray="2 4" vertical={false} /><XAxis dataKey="year" fontSize={11} tickLine={false} axisLine={false} /><YAxis domain={[0, 100]} fontSize={11} width={28} tickLine={false} axisLine={false} /><Tooltip contentStyle={tt} />
            <Line dataKey="success" name="Success" stroke="var(--color-chart-1)" strokeWidth={2.5} />
            <Line dataKey="academic" name="Academic" stroke="var(--color-chart-3)" strokeWidth={2} strokeDasharray="5 4" />
            <Line dataKey="placement" name="Placement" stroke="var(--color-chart-4)" strokeWidth={2} strokeDasharray="1 3" />
          </LineChart></ResponsiveContainer></div>
          <div className="mt-2 flex gap-4 text-[11px] text-muted-foreground"><span>━ Success</span><span>╍ Academic</span><span>┈ Placement</span></div>
        </Card>
        <Card>
          <SectionTitle title="Risk distribution" />
          <div className="h-56"><ResponsiveContainer><BarChart data={risk}><XAxis dataKey="r" fontSize={11} tickLine={false} axisLine={false} /><YAxis allowDecimals={false} fontSize={11} width={24} tickLine={false} axisLine={false} /><Tooltip contentStyle={tt} cursor={{ fill: "var(--color-surface)" }} />
            <RBar dataKey="academic" name="Academic" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
            <RBar dataKey="placement" name="Placement" fill="var(--color-chart-4)" radius={[6, 6, 0, 0]} />
          </BarChart></ResponsiveContainer></div>
          <div className="mt-2 flex gap-4 text-[11px] text-muted-foreground"><span>■ Academic (dark)</span><span>□ Placement (light)</span></div>
        </Card>
      </div>
    </>
  );
}
