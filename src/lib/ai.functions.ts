import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { score, type StudentRow } from "./scoring";

type Msg = { role: "user" | "assistant"; content: string };

export const askInsights = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { messages: Msg[] }) => {
    if (!Array.isArray(d?.messages) || d.messages.length === 0) throw new Error("No messages");
    return { messages: d.messages.slice(-12).map((m) => ({ role: m.role, content: String(m.content).slice(0, 4000) })) };
  })
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase.from("students").select("*");
    if (error) return { reply: "", error: "Could not load student data." };
    const scored = (rows as unknown as StudentRow[]).map(score);
    const table = scored
      .map((s) => `${s.roll_no}|${s.name}|${s.department}|Y${s.year}|CGPA ${s.cgpa}|Att ${s.attendance}|LMS ${s.lms_activity}|Eng ${s.engagement}|Plc ${s.placement_readiness}|Skl ${s.skills_score}|Backlogs ${s.backlogs}|Success ${s.successScore}|AcadRisk ${s.academicRisk}|PlcRisk ${s.placementRisk}|${s.segment}`)
      .join("\n");
    const system = `You are the KRYPTEDU AI Insights assistant for campus leadership. Answer only from the institutional data below. Be concise and structured: start with a one-line answer, then short bullet points with evidence (names, roll numbers, numbers). Suggest concrete interventions when relevant. Use markdown sparingly (bold, bullets). Data:\n${table}`;

    const key = process.env.LOVABLE_API_KEY;
    if (!key) return { reply: "", error: "AI is not configured." };
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: system }, ...data.messages],
      }),
    });
    if (res.status === 429) return { reply: "", error: "Too many requests — please wait a moment." };
    if (res.status === 402) return { reply: "", error: "AI credits are exhausted for this workspace." };
    if (!res.ok) {
      console.error("AI gateway", res.status, await res.text());
      return { reply: "", error: "The assistant is unavailable right now." };
    }
    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    return { reply: json.choices?.[0]?.message?.content ?? "", error: null as string | null };
  });
