import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AlertCircle, Clock } from "lucide-react";
import { studentsQuery, interventionsQuery } from "@/lib/data";
import { Empty, PageHeader, StudentLink } from "@/components/kr";

export const Route = createFileRoute("/_authenticated/notifications")({
  head: () => ({ meta: [{ title: "Notifications — KRYPTEDU" }, { name: "description", content: "Risk alerts and follow-ups." }] }),
  loader: ({ context }) => Promise.all([context.queryClient.ensureQueryData(studentsQuery), context.queryClient.ensureQueryData(interventionsQuery)]),
  component: Notifications,
});

function Notifications() {
  const { data: students } = useSuspenseQuery(studentsQuery);
  const { data: ints } = useSuspenseQuery(interventionsQuery);
  const soon = new Date(); soon.setDate(soon.getDate() + 7);
  const due = ints.filter((i) => i.status !== "Completed" && i.due_date && new Date(i.due_date) <= soon);
  const high = students.filter((s) => s.academicRisk === "High" && s.placementRisk === "High");
  const name = new Map(students.map((s) => [s.id, s.name]));
  return (
    <>
      <PageHeader eyebrow="Alerts" title="Notifications" />
      {due.length + high.length === 0 ? <Empty title="You're all caught up" /> : (
        <div className="card-surface divide-y">
          {due.map((i) => (
            <StudentLink key={i.id} id={i.student_id} className="flex gap-3 p-4 hover:bg-surface">
              <Clock className="mt-0.5 size-4 shrink-0" strokeWidth={1.6} />
              <div><div className="text-sm font-medium">Follow-up due {i.due_date}</div><div className="text-xs text-subtle">{i.title} · {name.get(i.student_id)}</div></div>
            </StudentLink>
          ))}
          {high.map((s) => (
            <StudentLink key={s.id} id={s.id} className="flex gap-3 p-4 hover:bg-surface">
              <AlertCircle className="mt-0.5 size-4 shrink-0" strokeWidth={1.6} />
              <div><div className="text-sm font-medium">{s.name} is high risk on both academics and placement</div><div className="text-xs text-subtle">Success Score {s.successScore} · {s.riskFactors.slice(0, 2).join(", ")}</div></div>
            </StudentLink>
          ))}
        </div>
      )}
    </>
  );
}
