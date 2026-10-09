import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Scored } from "@/lib/scoring";

const sel = "h-11 w-full rounded-xl border bg-background px-3 text-sm";

export function InterventionDialog({ students, defaultStudentId, trigger }: { students: Scored[]; defaultStudentId?: string; trigger: React.ReactNode }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({
    student_id: defaultStudentId ?? students[0]?.id ?? "",
    title: "", category: "Academic", priority: "Medium", assigned_to: "", due_date: "", notes: "",
  });
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!f.title.trim()) { toast.error("Add a title"); return; }
    setBusy(true);
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from("interventions").insert({ ...f, due_date: f.due_date || null, created_by: u.user?.id ?? null });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Intervention created");
    qc.invalidateQueries({ queryKey: ["interventions"] });
    setOpen(false);
    setF((p) => ({ ...p, title: "", notes: "" }));
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="rounded-2xl">
        <DialogHeader><DialogTitle>New intervention</DialogTitle></DialogHeader>
        <form onSubmit={save} className="space-y-3">
          <select className={sel} value={f.student_id} onChange={(e) => setF({ ...f, student_id: e.target.value })}>
            {students.map((s) => <option key={s.id} value={s.id}>{s.name} · {s.roll_no}</option>)}
          </select>
          <Input className="h-11 rounded-xl" placeholder="Title, e.g. Weekly mentoring" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
          <div className="grid grid-cols-2 gap-2">
            <select className={sel} value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}>
              {["Academic", "Attendance", "Placement", "Skills", "Engagement", "Wellbeing"].map((c) => <option key={c}>{c}</option>)}
            </select>
            <select className={sel} value={f.priority} onChange={(e) => setF({ ...f, priority: e.target.value })}>
              {["High", "Medium", "Low"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input className="h-11 rounded-xl" placeholder="Assigned faculty" value={f.assigned_to} onChange={(e) => setF({ ...f, assigned_to: e.target.value })} />
            <Input className="h-11 rounded-xl" type="date" value={f.due_date} onChange={(e) => setF({ ...f, due_date: e.target.value })} />
          </div>
          <Textarea className="rounded-xl" placeholder="Notes" value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} />
          <Button type="submit" disabled={busy} className="h-11 w-full rounded-xl">{busy ? "Saving…" : "Create intervention"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
