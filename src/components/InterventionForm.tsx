import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Scored } from "@/lib/scoring";
import { generateSuggestions } from "@/lib/interventions";

const sel = "h-11 w-full rounded-xl border bg-background px-3 text-sm";

type Existing = { id: string; student_id: string; title: string; category: string; priority: string; assigned_to: string; due_date: string | null; notes: string };

export function InterventionDialog({ students, defaultStudentId, trigger, existing }: { students: Scored[]; defaultStudentId?: string; trigger: React.ReactNode; existing?: Existing }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const blank = existing
    ? { student_id: existing.student_id, title: existing.title, category: existing.category, priority: existing.priority, assigned_to: existing.assigned_to, due_date: existing.due_date ?? "", notes: existing.notes }
    : { student_id: defaultStudentId ?? students[0]?.id ?? "", title: "", category: "Academic", priority: "Medium", assigned_to: "", due_date: "", notes: "" };
  const [f, setF] = useState(blank);
  const [busy, setBusy] = useState(false);

  const selectedStudent = useMemo(() => students.find(s => s.id === f.student_id), [students, f.student_id]);
  const suggestions = useMemo(() => selectedStudent ? generateSuggestions(selectedStudent) : [], [selectedStudent]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!f.title.trim()) { toast.error("Add a title"); return; }
    setBusy(true);
    let error;
    if (existing) {
      ({ error } = await supabase.from("interventions").update({ ...f, due_date: f.due_date || null }).eq("id", existing.id));
    } else {
      const { data: u } = await supabase.auth.getUser();
      ({ error } = await supabase.from("interventions").insert({ ...f, due_date: f.due_date || null, created_by: u.user?.id ?? null }));
    }
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success(existing ? "Intervention updated" : "Intervention created");
    qc.invalidateQueries({ queryKey: ["interventions"] });
    setOpen(false);
    if (!existing) setF((p) => ({ ...p, title: "", notes: "" }));
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (o && existing) setF(blank); }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader><DialogTitle>{existing ? "Edit intervention" : "New intervention"}</DialogTitle></DialogHeader>
        <form onSubmit={save} className="space-y-3">
          <select className={sel} value={f.student_id} onChange={(e) => setF({ ...f, student_id: e.target.value })}>
            {students.map((s) => <option key={s.id} value={s.id}>{s.name} · {s.roll_no}</option>)}
          </select>
          
          {!existing && suggestions.length > 0 && (
            <div className="space-y-2 rounded-xl bg-surface p-3">
              <div className="flex items-center gap-1.5 text-xs font-medium text-subtle"><Sparkles className="size-3.5" /> AI Suggestions based on indicators</div>
              <div className="grid gap-2">
                {suggestions.map((sg, i) => (
                  <button type="button" key={i} onClick={() => setF({ ...f, title: sg.action, category: sg.category, priority: sg.priority, notes: `Reason: ${sg.why}\n\nFollow-up: ${sg.followUp}` })} className="text-left rounded-lg border bg-background p-2 text-xs transition-colors hover:border-primary/50 hover:bg-surface">
                    <div className="font-medium text-foreground">{sg.issue}</div>
                    <div className="mt-1 text-muted-foreground">{sg.action}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

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
          <Textarea className="min-h-24 rounded-xl" placeholder="Notes (why this is relevant, follow-up actions)" value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} />
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button type="button" variant="secondary" className="h-11 rounded-xl" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={busy} className="h-11 rounded-xl">{busy ? "Saving…" : existing ? "Save changes" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
