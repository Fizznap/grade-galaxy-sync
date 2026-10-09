import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { studentsQuery } from "@/lib/data";
import { Card, Empty, PageHeader, Pill, RiskBadge, StudentLink } from "@/components/kr";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_authenticated/students/")({
  head: () => ({ meta: [{ title: "Students — KRYPTEDU" }, { name: "description", content: "Student directory with success scores and risk." }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(studentsQuery),
  component: Students,
  errorComponent: ({ error }: { error: Error }) => <div role="alert" className="text-sm">{error.message}</div>,
});

const RISK = ["All", "High academic", "High placement"] as const;

function Students() {
  const { data } = useSuspenseQuery(studentsQuery);
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("All");
  const [risk, setRisk] = useState<(typeof RISK)[number]>("All");
  const depts = ["All", ...new Set(data.map((s) => s.department))];

  const list = useMemo(
    () =>
      data.filter(
        (s) =>
          (dept === "All" || s.department === dept) &&
          (risk === "All" || (risk === "High academic" ? s.academicRisk === "High" : s.placementRisk === "High")) &&
          (s.name.toLowerCase().includes(q.toLowerCase()) || s.roll_no.toLowerCase().includes(q.toLowerCase())),
      ),
    [data, q, dept, risk],
  );

  return (
    <>
      <PageHeader eyebrow={`${data.length} students`} title="Student directory" />
      <div className="relative mb-3">
        <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-subtle" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or roll number" className="h-12 rounded-xl pl-11" />
      </div>
      <div className="-mx-4 mb-2 flex gap-2 overflow-x-auto px-4 pb-2">
        {depts.map((d) => <Pill key={d} active={dept === d} onClick={() => setDept(d)}>{d}</Pill>)}
      </div>
      <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-2">
        {RISK.map((r) => <Pill key={r} active={risk === r} onClick={() => setRisk(r)}>{r}</Pill>)}
      </div>

      {list.length === 0 ? (
        <Empty title="No students match" text="Try a different search or filter." />
      ) : (
        <>
          <div className="space-y-2 md:hidden">
            {list.map((s) => (
              <StudentLink key={s.id} id={s.id} className="card-surface block p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate font-medium">{s.name}</div>
                    <div className="text-xs text-subtle">{s.roll_no} · {s.department}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-semibold tabular-nums">{s.successScore}</div>
                    <div className="text-[10px] uppercase tracking-wider text-subtle">Success</div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>CGPA {s.cgpa}</span><span>·</span><span>Att {s.attendance}%</span>
                  <span className="ml-auto flex gap-1"><RiskBadge risk={s.academicRisk} label="A" /><RiskBadge risk={s.placementRisk} label="P" /></span>
                </div>
              </StudentLink>
            ))}
          </div>
          <Card className="hidden overflow-x-auto p-0 md:block">
            <table className="w-full text-sm">
              <thead className="border-b text-left text-xs text-subtle">
                <tr>{["Student", "Department", "CGPA", "Attendance", "Success", "Academic risk", "Placement risk"].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y">
                {list.map((s) => (
                  <tr key={s.id} className="hover:bg-surface">
                    <td className="px-4 py-3"><StudentLink id={s.id} className="font-medium hover:underline">{s.name}</StudentLink><div className="text-xs text-subtle">{s.roll_no}</div></td>
                    <td className="px-4 py-3 text-muted-foreground">{s.department}</td>
                    <td className="px-4 py-3 tabular-nums">{s.cgpa}</td>
                    <td className="px-4 py-3 tabular-nums">{s.attendance}%</td>
                    <td className="px-4 py-3 font-semibold tabular-nums">{s.successScore}</td>
                    <td className="px-4 py-3"><RiskBadge risk={s.academicRisk} /></td>
                    <td className="px-4 py-3"><RiskBadge risk={s.placementRisk} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}
    </>
  );
}
