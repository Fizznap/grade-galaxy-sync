import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Calendar, Check, Plus, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { interventionsQuery, studentsQuery } from "@/lib/data";
import { Empty, PageHeader, Pill, StudentLink } from "@/components/kr";
import { Button } from "@/components/ui/button";
import { InterventionDialog } from "@/components/InterventionForm";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/interventions")({
  head: () => ({ meta: [{ title: "Interventions — KRYPTEDU" }, { name: "description", content: "Track student support actions." }] }),
  loader: ({ context }) => Promise.all([context.queryClient.ensureQueryData(studentsQuery), context.queryClient.ensureQueryData(interventionsQuery)]),
  component: Interventions,
  errorComponent: ({ error }: { error: Error }) => <div role="alert" className="text-sm">{error.message}</div>,
});

const STATUSES = ["Open", "In Progress", "Completed"];

function Interventions() {
  const { data: students } = useSuspenseQuery(studentsQuery);
  const { data } = useSuspenseQuery(interventionsQuery);
  const qc = useQueryClient();
  const [filter, setFilter] = useState("All");
  const byId = new Map(students.map((s) => [s.id, s]));
  const list = data.filter((i) => filter === "All" || i.status === filter);

  async function setStatus(id: string, status: string) {
    const { error } = await supabase.from("interventions").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Marked ${status}`);
    qc.invalidateQueries({ queryKey: ["interventions"] });
  }

  return (
    <>
      <PageHeader
        eyebrow={`${data.filter((i) => i.status !== "Completed").length} active`}
        title="Interventions"
        action={<InterventionDialog students={students} trigger={<Button className="rounded-xl"><Plus className="size-4" /> New</Button>} />}
      />
      <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-2">
        {["All", ...STATUSES].map((s) => <Pill key={s} active={filter === s} onClick={() => setFilter(s)}>{s}</Pill>)}
      </div>
      {list.length === 0 ? <Empty title="No interventions here" text="Create one from a student profile or the New button." /> : (
        <div className="grid gap-3 md:grid-cols-2">
          {list.map((i) => {
            const s = byId.get(i.student_id);
            const overdue = i.due_date && i.status !== "Completed" && new Date(i.due_date) < new Date(new Date().toDateString());
            return (
              <div key={i.id} className="card-surface p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-subtle">{i.category}</div>
                    <div className="mt-1 font-medium">{i.title}</div>
                    {s && <StudentLink id={s.id} className="text-xs text-muted-foreground underline-offset-2 hover:underline">{s.name} · {s.roll_no}</StudentLink>}
                  </div>
                  <span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-medium", i.priority === "High" ? "border-primary bg-primary text-primary-foreground" : i.priority === "Medium" ? "bg-surface-2" : "")}>{i.priority}</span>
                </div>
                {i.notes && <p className="mt-2 text-sm text-muted-foreground">{i.notes}</p>}
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-subtle">
                  <span className="flex items-center gap-1"><User className="size-3.5" />{i.assigned_to || "Unassigned"}</span>
                  {i.due_date && <span className={cn("flex items-center gap-1", overdue && "font-semibold text-foreground")}><Calendar className="size-3.5" />{overdue ? "Overdue · " : ""}{i.due_date}</span>}
                </div>
                <div className="mt-4 flex gap-1 rounded-xl bg-surface p-1">
                  {STATUSES.map((st) => (
                    <button key={st} onClick={() => setStatus(i.id, st)} className={cn("flex flex-1 items-center justify-center gap-1 rounded-lg py-2 text-xs transition-colors", i.status === st ? "bg-background font-medium shadow-soft" : "text-subtle hover:text-foreground")}>
                      {i.status === st && <Check className="size-3" />}{st}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
