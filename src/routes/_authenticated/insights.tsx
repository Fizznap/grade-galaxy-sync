import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useRef, useState, useEffect } from "react";
import { ArrowUp, RotateCcw, Sparkles, Square, SquarePen } from "lucide-react";
import { askInsights } from "@/lib/ai.functions";
import { PageHeader } from "@/components/kr";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/insights")({
  head: () => ({ meta: [{ title: "AI Insights — KRYPTEDU" }, { name: "description", content: "Ask evidence-backed questions about your students." }, { property: "og:title", content: "AI Insights — KRYPTEDU" }, { property: "og:description", content: "Ask evidence-backed questions about your students." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Insights,
});

const SUGGESTIONS = [
  "Which students need urgent academic support?",
  "Who has strong academics but low placement readiness?",
  "Compare departments by success score",
  "Suggest interventions for attendance risk",
];

type Msg = { role: "user" | "assistant"; content: string; failed?: boolean };

function render(text: string) {
  return text.split("\n").map((line, i) => {
    const html = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    const bullet = /^\s*[-*•]\s+/.test(line);
    return <p key={i} className={cn(bullet && "pl-4 -indent-3", !line.trim() && "h-2")} dangerouslySetInnerHTML={{ __html: bullet ? "• " + html.replace(/^\s*[-*•]\s+/, "") : html }} />;
  });
}

function Insights() {
  const ask = useServerFn(askInsights);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  const ctrl = useRef<AbortController | null>(null);
  useEffect(() => end.current?.scrollIntoView({ behavior: "smooth" }), [msgs, busy]);

  async function send(text: string, base: Msg[] = msgs) {
    if (!text.trim() || busy) return;
    const next = [...base, { role: "user" as const, content: text.trim() }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    const ac = new AbortController();
    ctrl.current = ac;
    try {
      const r = await ask({ data: { messages: next.filter((m) => !m.failed).map(({ role, content }) => ({ role, content })) }, signal: ac.signal });
      if (ac.signal.aborted) return;
      setMsgs([...next, { role: "assistant", content: r.error ?? r.reply, ...(r.error ? { failed: true } : {}) }]);
    } catch (e: unknown) {
      if (ac.signal.aborted) return;
      const status = (e as { status?: number })?.status ?? (e instanceof Response ? e.status : undefined);
      const msg = status === 401 ? "Your session expired. Please sign in again."
        : typeof navigator !== "undefined" && !navigator.onLine ? "You're offline. Check your connection and retry."
        : "Couldn't reach the assistant. Please retry.";
      setMsgs([...next, { role: "assistant", content: msg, failed: true }]);
    } finally {
      if (ctrl.current === ac) { ctrl.current = null; setBusy(false); }
    }
  }

  function stop() {
    const ac = ctrl.current;
    if (!ac) return;
    ac.abort();
    ctrl.current = null;
    setBusy(false);
    setMsgs((m) => [...m, { role: "assistant", content: "Stopped — no answer was generated.", failed: true }]);
  }

  return (
    <div className="flex min-h-[calc(100vh-14rem)] flex-col lg:min-h-[calc(100vh-6rem)]">
      <PageHeader eyebrow="KRYPTEDU AI" title="AI Insights" action={msgs.length > 0 ? <button type="button" disabled={busy} onClick={() => { if (confirm("Start a new conversation? This clears the current one.")) setMsgs([]); }} className="press flex items-center gap-1.5 rounded-full bg-secondary px-3 py-2 text-xs font-medium disabled:opacity-40"><SquarePen className="size-4" /> New chat</button> : undefined} />
      <div className="flex-1 space-y-4">
        {msgs.length === 0 && (
          <div className="py-10 text-center">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-primary text-primary-foreground"><Sparkles className="size-6" strokeWidth={1.6} /></div>
            <h2 className="mt-6 text-2xl font-semibold tracking-tight">How can I help today?</h2>
            <p className="mt-1 text-sm text-muted-foreground">Answers are grounded in your institution's student data.</p>
            <div className="mx-auto mt-6 flex max-w-xl flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => <button type="button" key={s} onClick={() => void send(s)} className="rounded-full border bg-surface px-4 py-2 text-xs hover:bg-surface-2">{s}</button>)}
            </div>
          </div>
        )}
        {msgs.map((m, i) => (
          <div key={i} className={cn("flex", m.role === "user" && "justify-end")}>
            <div className={cn("max-w-[85%] space-y-1 rounded-2xl px-4 py-3 text-sm leading-relaxed", m.role === "user" ? "bg-primary text-primary-foreground" : "card-surface")}>
              {m.role === "assistant" && <div className="mb-1 flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-subtle"><Sparkles className="size-3" /> Answer</div>}
              {render(m.content)}
              {m.failed && i === msgs.length - 1 && <button type="button" onClick={() => { const prev = msgs.slice(0, -1); const last = prev[prev.length - 1]; setMsgs(prev.slice(0, -1)); if (last) void send(last.content, prev.slice(0, -1)); }} className="press mt-2 flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium"><RotateCcw className="size-3.5" /> Retry</button>}
            </div>
          </div>
        ))}
        {busy && <div className="card-surface w-fit px-4 py-3 text-sm text-subtle">Analysing student data…</div>}
        <div ref={end} />
      </div>
      <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="sticky bottom-24 mt-4 flex items-center gap-2 rounded-2xl border bg-background p-2 shadow-soft lg:bottom-6">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about your students…" className="h-10 flex-1 bg-transparent px-3 text-sm outline-none" />
        {busy ? (
          <button type="button" onClick={stop} aria-label="Stop generating" className="press flex h-10 items-center gap-1.5 rounded-xl bg-foreground px-3 text-xs font-medium text-background"><Square className="size-3.5 fill-current" /> Stop</button>
        ) : (
          <button type="submit" disabled={!input.trim()} aria-label="Send" className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground disabled:opacity-40"><ArrowUp className="size-4" /></button>
        )}
      </form>
    </div>
  );
}
