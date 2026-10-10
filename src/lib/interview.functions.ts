import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { geminiJson } from "./gemini.server";
import { LENGTHS, LEVELS, RUBRIC, ROLES, TYPES, overallScore, validateEvaluation, validateQuestions, validateSummary, type Answer, type Question } from "./interview";

const SYS = "You are a fair, encouraging interview coach. Judge only the typed answer text. Never comment on voice, confidence, body language or spoken communication. Never mention or ask for real student records.";

async function approved(supabase: any, userId: string) {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId).maybeSingle();
  return !!data && data.role !== "pending";
}

async function ownSession(userId: string, id: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.from("interview_sessions").select("*").eq("id", id).eq("user_id", userId).maybeSingle();
  return { supabaseAdmin, session: data };
}

export const startInterview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { role: string; type: string; level: string; count: number }) => {
    if (!ROLES.includes(d.role as never) || !TYPES.includes(d.type as never) || !LEVELS.includes(d.level as never) || !LENGTHS.includes(d.count as never)) throw new Error("Invalid setup");
    return d;
  })
  .handler(async ({ data, context }) => {
    if (!(await approved(context.supabase, context.userId))) return { id: null, questions: [] as Question[], error: "Your account is waiting for approval." };
    const mix = data.type === "Mixed" ? "Mix roughly half Technical and half HR/Behavioral questions and label each one's kind." : `All questions are ${data.type}.`;
    const res = await geminiJson(
      `Write exactly ${data.count} distinct ${data.level}-level interview questions for a ${data.role} candidate (Indian campus placements). ${mix} Each question must be answerable in a few typed paragraphs. Give each a short topic label.`,
      SYS,
      { type: "OBJECT", properties: { questions: { type: "ARRAY", items: { type: "OBJECT", properties: { text: { type: "STRING" }, kind: { type: "STRING", enum: ["Technical", "HR/Behavioral"] }, topic: { type: "STRING" } }, required: ["text", "kind", "topic"] } } }, required: ["questions"] },
    );
    if (res.error) return { id: null, questions: [], error: res.error };
    const questions = validateQuestions(res.data, data.count, data.type);
    if (!questions) return { id: null, questions: [], error: "The AI didn't return enough usable questions. Please retry." };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin.from("interview_sessions").insert({
      user_id: context.userId, target_role: data.role, interview_type: data.type, difficulty: data.level, questions: questions as never,
    }).select("id").single();
    if (error) return { id: null, questions: [], error: "Couldn't save the interview. Please retry." };
    return { id: row.id as string, questions, error: null };
  });

export const submitAnswer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; index: number; answer: string }) => {
    const answer = String(d.answer ?? "").trim();
    if (!answer) throw new Error("Answer is empty");
    return { id: String(d.id), index: Math.floor(Number(d.index)), answer: answer.slice(0, 5000) };
  })
  .handler(async ({ data, context }) => {
    if (!(await approved(context.supabase, context.userId))) return { evaluation: null, error: "Your account is waiting for approval." };
    const { supabaseAdmin, session } = await ownSession(context.userId, data.id);
    if (!session) return { evaluation: null, error: "Interview not found." };
    const questions = session.questions as unknown as Question[];
    const answers = session.answers as unknown as Answer[];
    if (session.status !== "in_progress" || data.index !== answers.length || !questions[data.index]) return { evaluation: null, error: "This question was already answered." };
    const q = questions[data.index];
    const crit = RUBRIC[q.kind];
    const res = await geminiJson(
      `Role: ${session.target_role}. Level: ${session.difficulty}. Question type: ${q.kind}.\nQuestion: ${q.text}\nCandidate's typed answer:\n"""${data.answer}"""\n\nScore each criterion 0-100: ${crit.join("; ")}. Use exactly those criterion names. Give short actionable feedback, 1-3 strengths, 1-3 improvements, and a concise example of a stronger answer. If the answer is off-topic or empty of substance, score low.`,
      SYS,
      { type: "OBJECT", properties: {
        criteria: { type: "ARRAY", items: { type: "OBJECT", properties: { name: { type: "STRING", enum: [...crit] }, score: { type: "INTEGER" } }, required: ["name", "score"] } },
        feedback: { type: "STRING" }, strengths: { type: "ARRAY", items: { type: "STRING" } }, improvements: { type: "ARRAY", items: { type: "STRING" } }, better_answer: { type: "STRING" },
      }, required: ["criteria", "feedback", "strengths", "improvements", "better_answer"] },
    );
    if (res.error) return { evaluation: null, error: res.error };
    const evaluation = validateEvaluation(res.data, q.kind);
    if (!evaluation) return { evaluation: null, error: "The AI feedback was incomplete. Please retry." };
    const { error } = await supabaseAdmin.from("interview_sessions").update({ answers: [...answers, { answer: data.answer, evaluation }] as never }).eq("id", data.id).eq("user_id", context.userId);
    if (error) return { evaluation: null, error: "Couldn't save your answer. Please retry." };
    return { evaluation, error: null };
  });

export const finishInterview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => ({ id: String(d.id) }))
  .handler(async ({ data, context }) => {
    if (!(await approved(context.supabase, context.userId))) return { error: "Your account is waiting for approval." };
    const { supabaseAdmin, session } = await ownSession(context.userId, data.id);
    if (!session) return { error: "Interview not found." };
    const questions = session.questions as unknown as Question[];
    const answers = session.answers as unknown as Answer[];
    if (answers.length === 0) return { error: "Answer at least one question first." };
    const transcript = answers.map((a, i) => `Q${i + 1} [${questions[i].kind}, ${questions[i].topic}] ${questions[i].text}\nAnswer: ${a.answer}\nScore: ${a.evaluation.score}. Improvements: ${a.evaluation.improvements.join("; ")}`).join("\n\n");
    const res = await geminiJson(
      `Summarise this ${session.target_role} mock interview (${session.difficulty}). Base everything only on these answers:\n\n${transcript}\n\nGive a short overview, recurring weaknesses, topics to practise and recommended next steps.`,
      SYS,
      { type: "OBJECT", properties: { overview: { type: "STRING" }, recurring_weaknesses: { type: "ARRAY", items: { type: "STRING" } }, topics_to_practise: { type: "ARRAY", items: { type: "STRING" } }, next_steps: { type: "ARRAY", items: { type: "STRING" } } }, required: ["overview", "recurring_weaknesses", "topics_to_practise", "next_steps"] },
    );
    if (res.error) return { error: res.error };
    const summary = validateSummary(res.data);
    if (!summary) return { error: "The AI summary was incomplete. Please retry." };
    const { error } = await supabaseAdmin.from("interview_sessions").update({
      summary: summary as never, overall_score: overallScore(answers), status: "completed", completed_at: new Date().toISOString(),
    }).eq("id", data.id).eq("user_id", context.userId);
    return { error: error ? "Couldn't save the summary. Please retry." : null };
  });
