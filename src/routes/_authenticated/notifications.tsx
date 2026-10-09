import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AlertCircle, CheckCheck, Clock } from "lucide-react";
import { Pill } from "@/components/kr";
import { cn } from "@/lib/utils";
import { studentsQuery, interventionsQuery } from "@/lib/data";
import { Empty, PageHeader, StudentLink } from "@/components/kr";

export const Route = createFileRoute("/_authenticated/notifications")({
  head: () => ({ meta: [{ title: "Notifications — KRYPTEDU" }, { name: "description", content: "Risk alerts and follow-ups." }, { property: "og:title", content: "Notifications — KRYPTEDU" }, { property: "og:description", content: "Risk alerts and follow-ups." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
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
  const [read, setRead] = useState<Set<string>>(new Set());
  const [cat, setCat] = useState("All");
  useEffect(() => { try { setRead(new Set(JSON.parse(localStorage.getItem("kr-read") ?? "[]"))); } catch { /* ignore */ } }, []);
  const mark = (ids: string[]) => { const n = new Set([...read, ...ids]); setRead(n); localStorage.setItem("kr-read", JSON.stringify([...n])); };
  const allIds = [...due.map((i) => "i" + i.id), ...high.map((s) => "s" + s.id)];
  const unread = allIds.filter((x) => !read.has(x)).length;
  const showDue = cat === "All" || cat === "Follow-ups";
  const showHigh = cat === "All" || cat === "Risk alerts";
  const dot = (k: string) => <span aria-label={read.has(k) ? undefined : "Unread"} className={cn("ml-auto mt-1.5 size-2 shrink-0 rounded-full", read.has(k) ? "bg-transparent" : "bg-primary-deep")} />;
  return (
    <>
      <PageHeader eyebrow={`${unread} unread`} title="Notifications" action={unread > 0 ? <button type="button" onClick={() => mark(allIds)} className="press flex items-center gap-1.5 rounded-full bg-secondary px-3 py-2 text-xs font-medium"><CheckCheck className="size-4" /> Mark all read</button> : undefined} />
      <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-2">{["All", "Follow-ups", "Risk alerts"].map((c) => <Pill key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Pill>)}</div>
      {due.length + high.length === 0 ? <Empty title="You're all caught up" /> : (
        <div className="card-surface divide-y">
          {showDue && due.map((i) => (
            <StudentLink key={i.id} id={i.student_id} onClick={() => mark(["i" + i.id])} className="flex gap-3 p-4 hover:bg-surface">
              <Clock className="mt-0.5 size-4 shrink-0" strokeWidth={1.6} />
              <div><div className="text-sm font-medium">Follow-up due {i.due_date}</div><div className="text-xs text-subtle">{i.title} · {name.get(i.student_id)}</div></div>{dot("i" + i.id)}
            </StudentLink>
          ))}
          {showHigh && high.map((s) => (
            <StudentLink key={s.id} id={s.id} onClick={() => mark(["s" + s.id])} className="flex gap-3 p-4 hover:bg-surface">
              <AlertCircle className="mt-0.5 size-4 shrink-0" strokeWidth={1.6} />
              <div><div className="text-sm font-medium">{s.name} is high risk on both academics and placement</div><div className="text-xs text-subtle">Success Score {s.successScore} · {s.riskFactors.slice(0, 2).join(", ")}</div></div>{dot("s" + s.id)}
            </StudentLink>
          ))}
        </div>
      )}
    </>
  );
}
