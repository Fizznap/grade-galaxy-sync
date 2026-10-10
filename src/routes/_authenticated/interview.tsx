import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Mic, RotateCcw, Send, History, ChevronLeft, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, PageHeader, Pill, SectionTitle, Bar } from "@/components/kr";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LENGTHS, LEVELS, ROLES, TYPES, type Answer, type Question, type Summary } from "@/lib/interview";
import { finishInterview, startInterview, submitAnswer } from "@/lib/interview.functions";

export const Route = createFileRoute("/_authenticated/interview")({
  head: () => ({ meta: [{ title: "Mock Interview Studio — KRYPTEDU" }, { name: "description", content: "Practise placement interviews with indicative AI feedback." }, { property: "og:title", content: "Mock Interview Studio — KRYPTEDU" }, { property: "og:description", content: "Practise placement interviews with indicative AI feedback." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Studio,
});

type Session = { id: string; user_id: string; target_role: string; interview_type: string; difficulty: string; questions: Question[]; answers: Answer[]; summary: Summary | null; overall_score: number | null; status: string; created_at: string };

const NOTE = "AI scores and feedback are indicative only. They judge your typed answer, not voice, confidence or body language.";

function Studio() {
  const { user, role } = Route.useRouteContext() as { user: { id: string }; role: string };
  const qc = useQueryClient();
  const start = useServerFn(startInterview), submit = useServerFn(submitAnswer), finish = useServerFn(finishInterview);
  const [cfg, setCfg] = useState({ role: ROLES[0] as string, type: TYPES[0] as string, level: LEVELS[1] as string, count: 5 as number });
  const [active, setActive] = useState<{ id: string; questions: Question[]; answers: Answer[] } | null>(null);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState<null | "start" | "submit" | "finish">(null);
  const [err, setErr] = useState<{ msg: string; retry: () => void } | null>(null);
  const [view, setView] = useState<string | null>(null);
  const [scope, setScope] = useState<"mine" | "all">("mine");
  const canSeeAll = role === "admin" || role === "placement";

  const history = useQuery({
    queryKey: ["interviews", scope],
    queryFn: async () => {
      let q = supabase.from("interview_sessions").select("*").order("created_at", { ascending: false }).limit(50);
      if (scope === "mine") q = q.eq("user_id", user.id);
      const { data, error } = await q;
      if (error) throw error;
      return data as unknown as Session[];
    },
  });

  async function doStart() {
    setBusy("start"); setErr(null);
    try {
      const r = await start({ data: cfg });
      if (r.error || !r.id) setErr({ msg: r.error ?? "Couldn't start.", retry: doStart });
      else { setActive({ id: r.id, questions: r.questions, answers: [] }); setDraft(""); }
    } catch { setErr({ msg: "Couldn't reach the server. Please retry.", retry: doStart }); }
    setBusy(null);
  }
  async function doSubmit() {
    if (!active || !draft.trim()) return;
    const a = active, text = draft;
    setBusy("submit"); setErr(null);
    try {
      const r = await submit({ data: { id: a.id, index: a.answers.length, answer: text } });
      if (r.error || !r.evaluation) setErr({ msg: r.error ?? "Couldn't evaluate.", retry: doSubmit });
      else { setActive({ ...a, answers: [...a.answers, { answer: text, evaluation: r.evaluation }] }); setDraft(""); }
    } catch { setErr({ msg: "Couldn't reach the server. Please retry.", retry: doSubmit }); }
    setBusy(null);
  }
  async function doFinish() {
    if (!active) return;
    setBusy("finish"); setErr(null);
    try {
      const r = await finish({ data: { id: active.id } });
      if (r.error) setErr({ msg: r.error, retry: doFinish });
      else { await qc.invalidateQueries({ queryKey: ["interviews"] }); setView(active.id); setActive(null); setScope("mine"); toast.success("Interview saved"); }
    } catch { setErr({ msg: "Couldn't reach the server. Please retry.", retry: doFinish }); }
    setBusy(null);
  }

  const ErrorBox = err && (
    <div role="alert" className="mt-4 flex items-start gap-3 rounded-xl border bg-surface p-3 text-sm">
      <AlertTriangle className="mt-0.5 size-4 shrink-0" /><div className="flex-1">{err.msg}</div>
      <Button size="sm" variant="outline" onClick={err.retry} disabled={!!busy}><RotateCcw className="size-3.5" />Retry</Button>
    </div>
  );

  const viewed = view ? history.data?.find((s) => s.id === view) : null;
  if (viewed) return <Result s={viewed} onBack={() => setView(null)} />;

  if (active) {
    const i = active.answers.length, total = active.questions.length, done = i >= total;
    const last = active.answers[i - 1];
    return (
      <>
        <PageHeader eyebrow={`${cfg.role} · ${cfg.type} · ${cfg.level}`} title="Mock interview" action={<Button variant="ghost" size="sm" disabled={!!busy} onClick={() => { if (confirm("Leave this interview? Answers so far stay saved as unfinished.")) { setActive(null); qc.invalidateQueries({ queryKey: ["interviews"] }); } }}>Leave</Button>} />
        <div className="mb-4">
          <div className="mb-1 flex justify-between text-xs text-subtle"><span>{done ? "All questions answered" : `Question ${i + 1} of ${total}`}</span><span>{i}/{total} answered</span></div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-2"><div className="h-full bg-primary transition-all" style={{ width: `${(i / total) * 100}%` }} /></div>
        </div>
        {last && <EvalCard q={active.questions[i - 1]} a={last} n={i} />}
        {!done ? (
          <Card className="mt-4">
            <div className="text-[11px] font-medium uppercase tracking-wider text-subtle">{active.questions[i].kind} · {active.questions[i].topic}</div>
            <p className="mt-2 text-base font-medium">{active.questions[i].text}</p>
            <Textarea aria-label="Your answer" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Type your answer…" className="mt-4 min-h-40" disabled={busy === "submit"} maxLength={5000} />
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-xs text-subtle">{draft.length}/5000</span>
              <div className="flex gap-2">
                {i > 0 && <Button variant="outline" onClick={doFinish} disabled={!!busy}>{busy === "finish" ? "Summarising…" : "End early"}</Button>}
                <Button onClick={doSubmit} disabled={!draft.trim() || !!busy}><Send className="size-4" />{busy === "submit" ? "Evaluating…" : "Submit answer"}</Button>
              </div>
            </div>
            {ErrorBox}
          </Card>
        ) : (
          <Card className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">You've answered every question.</p>
            <Button className="mt-3" onClick={doFinish} disabled={!!busy}>{busy === "finish" ? "Summarising…" : "See final feedback"}</Button>
            {ErrorBox}
          </Card>
        )}
        <p className="mt-4 text-xs text-subtle">{NOTE}</p>
      </>
    );
  }

  return (
    <>
      <PageHeader eyebrow="Placement practice" title="Mock Interview Studio" />
      <Card>
        <SectionTitle title="Set up your interview" />
        <Choice label="Target role" opts={ROLES} value={cfg.role} set={(v) => setCfg({ ...cfg, role: v })} />
        <Choice label="Interview type" opts={TYPES} value={cfg.type} set={(v) => setCfg({ ...cfg, type: v })} />
        <Choice label="Difficulty" opts={LEVELS} value={cfg.level} set={(v) => setCfg({ ...cfg, level: v })} />
        <Choice label="Questions" opts={LENGTHS.map(String)} value={String(cfg.count)} set={(v) => setCfg({ ...cfg, count: Number(v) })} />
        <Button className="mt-5 h-11 rounded-xl" onClick={doStart} disabled={!!busy}><Mic className="size-4" />{busy === "start" ? "Preparing questions…" : "Start interview"}</Button>
        {ErrorBox}
        <p className="mt-4 text-xs text-subtle">{NOTE}</p>
      </Card>

      <Card className="mt-4">
        <SectionTitle title="Interview history" action={canSeeAll ? <div className="flex gap-2"><Pill active={scope === "mine"} onClick={() => setScope("mine")}>Mine</Pill><Pill active={scope === "all"} onClick={() => setScope("all")}>All users</Pill></div> : <History className="size-4 text-subtle" />} />
        {history.isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> :
          history.isError ? <p role="alert" className="text-sm">Couldn't load history. <button className="underline" onClick={() => history.refetch()}>Retry</button></p> :
          !history.data?.length ? <p className="text-sm text-muted-foreground">No interviews yet. Start one above.</p> :
          <div className="divide-y">
            {history.data.map((s) => (
              <button key={s.id} onClick={() => setView(s.id)} className="flex w-full items-center gap-3 py-3 text-left text-sm hover:bg-surface">
                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface-2 font-semibold">{s.overall_score ?? "–"}</div>
                <div className="min-w-0 flex-1"><div className="truncate font-medium">{s.target_role} · {s.interview_type}</div><div className="text-xs text-subtle">{s.difficulty} · {s.answers.length}/{s.questions.length} answered · {s.status === "completed" ? "Completed" : "Unfinished"}{scope === "all" && s.user_id !== user.id ? " · other user" : ""}</div></div>
                <div className="text-xs text-subtle">{new Date(s.created_at).toLocaleDateString()}</div>
              </button>
            ))}
          </div>}
      </Card>
    </>
  );
}

function Choice({ label, opts, value, set }: { label: string; opts: readonly string[]; value: string; set: (v: string) => void }) {
  return (
    <div className="mt-4" role="group" aria-label={label}>
      <div className="mb-2 text-xs font-medium text-muted-foreground">{label}</div>
      <div className="flex flex-wrap gap-2">{opts.map((o) => <Pill key={o} active={value === o} onClick={() => set(o)}>{o}</Pill>)}</div>
    </div>
  );
}

function EvalCard({ q, a, n }: { q: Question; a: Answer; n: number }) {
  const e = a.evaluation;
  return (
    <Card className="mt-4">
      <div className="flex items-start justify-between gap-3">
        <div><div className="text-[11px] font-medium uppercase tracking-wider text-subtle">Q{n} · {q.kind}</div><p className="mt-1 text-sm font-medium">{q.text}</p></div>
        <div className="shrink-0 text-right"><div className="text-2xl font-semibold">{e.score}</div><div className="text-[10px] text-subtle">indicative</div></div>
      </div>
      <details className="mt-2 text-sm"><summary className="cursor-pointer text-xs text-subtle">Your answer</summary><p className="mt-1 whitespace-pre-wrap text-muted-foreground">{a.answer}</p></details>
      <div className="mt-3 space-y-2">{e.criteria.map((c) => <Bar key={c.name} value={c.score} label={c.name} right={String(c.score)} />)}</div>
      <p className="mt-3 text-sm">{e.feedback}</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 text-sm">
        <List title="Strengths" items={e.strengths} /><List title="Improve" items={e.improvements} />
      </div>
      {e.better_answer && <div className="mt-3 rounded-xl bg-surface p-3 text-sm"><div className="mb-1 text-xs font-medium text-subtle">A stronger answer</div><p className="whitespace-pre-wrap">{e.better_answer}</p></div>}
    </Card>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return <div><div className="mb-1 text-xs font-medium text-subtle">{title}</div><ul className="list-disc space-y-1 pl-4">{items.map((x) => <li key={x}>{x}</li>)}</ul></div>;
}

function Result({ s, onBack }: { s: Session; onBack: () => void }) {
  return (
    <>
      <PageHeader eyebrow={`${s.target_role} · ${s.interview_type} · ${s.difficulty}`} title="Interview feedback" action={<Button variant="ghost" size="sm" onClick={onBack}><ChevronLeft className="size-4" />Back</Button>} />
      <Card>
        <div className="flex items-center gap-4">
          <div className="grid size-16 place-items-center rounded-2xl bg-surface-2 text-2xl font-semibold">{s.overall_score ?? "–"}</div>
          <div className="text-sm"><div className="font-medium">Indicative interview score</div><div className="text-xs text-subtle">{s.answers.length} of {s.questions.length} answered · {new Date(s.created_at).toLocaleString()}. Separate from the Success Score.</div></div>
        </div>
        {s.summary ? (
          <>
            <p className="mt-4 text-sm">{s.summary.overview}</p>
            <div className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
              <List title="Recurring weaknesses" items={s.summary.recurring_weaknesses} />
              <List title="Topics to practise" items={s.summary.topics_to_practise} />
              <List title="Next steps" items={s.summary.next_steps} />
            </div>
          </>
        ) : <p className="mt-4 text-sm text-muted-foreground">This interview wasn't finished, so there's no final summary.</p>}
      </Card>
      {s.answers.map((a, i) => <EvalCard key={i} q={s.questions[i]} a={a} n={i + 1} />)}
      <p className="mt-4 text-xs text-subtle">{NOTE}</p>
    </>
  );
}
