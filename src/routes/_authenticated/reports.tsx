import { toast } from "sonner";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { studentsQuery, interventionsQuery } from "@/lib/data";
import type { Scored } from "@/lib/scoring";
import { Card, PageHeader } from "@/components/kr";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/reports")({
  head: () => ({ meta: [{ title: "Reports — KRYPTEDU" }, { name: "description", content: "Export student success reports." }, { property: "og:title", content: "Reports — KRYPTEDU" }, { property: "og:description", content: "Export student success reports." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  loader: ({ context }) => Promise.all([context.queryClient.ensureQueryData(studentsQuery), context.queryClient.ensureQueryData(interventionsQuery)]),
  component: Reports,
});

function download(name: string, rows: (string | number)[][]) {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = name;
  a.click();
  if (rows.length <= 1) toast.info("No matching records — the file has column headers only.");
}
const studentRows = (l: Scored[]) => [
  ["Roll", "Name", "Department", "Year", "CGPA", "Attendance", "Success", "Academic risk", "Placement risk", "Segment"],
  ...l.map((s) => [s.roll_no, s.name, s.department, s.year, s.cgpa, s.attendance, s.successScore, s.academicRisk, s.placementRisk, s.segment]),
];

function Reports() {
  const { data: students } = useSuspenseQuery(studentsQuery);
  const { data: ints } = useSuspenseQuery(interventionsQuery);
  const reports = [
    { t: "Full cohort success report", d: `${students.length} students with scores, risks and segments`, go: () => download("kryptedu-cohort.csv", studentRows(students)) },
    { t: "At-risk students", d: "High academic or placement risk", go: () => download("kryptedu-at-risk.csv", studentRows(students.filter((s) => s.academicRisk === "High" || s.placementRisk === "High"))) },
    { t: "Interventions log", d: `${ints.length} interventions with status`, go: () => download("kryptedu-interventions.csv", [["Title", "Category", "Priority", "Status", "Assigned", "Due"], ...ints.map((i) => [i.title, i.category, i.priority, i.status, i.assigned_to, i.due_date ?? ""])]) },
  ];
  return (
    <>
      <PageHeader eyebrow="Exports" title="Reports" />
      <div className="space-y-3">
        {reports.map((r) => (
          <Card key={r.t} className="flex items-center gap-4">
            <div className="flex-1"><div className="font-medium">{r.t}</div><div className="text-xs text-subtle">{r.d}</div></div>
            <Button variant="secondary" className="rounded-xl border" onClick={r.go}><Download className="size-4" /> CSV</Button>
          </Card>
        ))}
      </div>
    </>
  );
}
