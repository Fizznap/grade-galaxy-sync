export const ROLES = ["Software Developer", "Data Analyst", "AI/ML Engineer", "General Technical"] as const;
export const TYPES = ["Technical", "HR/Behavioral", "Mixed"] as const;
export const LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;
export const LENGTHS = [5, 10, 15] as const;

export type Question = { text: string; kind: "Technical" | "HR/Behavioral"; topic: string };
export type Criterion = { name: string; score: number };
export type Evaluation = { score: number; criteria: Criterion[]; feedback: string; strengths: string[]; improvements: string[]; better_answer: string };
export type Answer = { answer: string; evaluation: Evaluation };
export type Summary = { overview: string; recurring_weaknesses: string[]; topics_to_practise: string[]; next_steps: string[] };

export const RUBRIC = {
  Technical: ["Technical correctness", "Relevance and completeness", "Problem-solving explanation"],
  "HR/Behavioral": ["Clarity and structure", "Relevance to the question", "Specificity and concrete examples"],
} as const;

const str = (v: unknown, max = 2000) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const strs = (v: unknown) => (Array.isArray(v) ? v.map((x) => str(x, 500)).filter(Boolean).slice(0, 6) : []);
const pct = (v: unknown) => { const n = Math.round(Number(v)); return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : null; };

export function validateQuestions(raw: unknown, count: number, type: string): Question[] | null {
  const list = (raw as { questions?: unknown })?.questions;
  if (!Array.isArray(list)) return null;
  const qs = list.map((q: any) => ({
    text: str(q?.text, 600),
    kind: type === "Mixed" ? (q?.kind === "HR/Behavioral" ? "HR/Behavioral" : "Technical") : (type as Question["kind"]),
    topic: str(q?.topic, 80) || "General",
  })).filter((q) => q.text.length > 5);
  return qs.length >= count ? qs.slice(0, count) : null;
}

/** Checks the AI evaluation; the overall score is the mean of the rubric scores so it can't drift from them. */
export function validateEvaluation(raw: unknown, kind: Question["kind"]): Evaluation | null {
  const r = raw as any;
  const names = RUBRIC[kind];
  const criteria: Criterion[] = [];
  for (const name of names) {
    const hit = Array.isArray(r?.criteria) ? r.criteria.find((c: any) => str(c?.name).toLowerCase() === name.toLowerCase()) : null;
    const s = pct(hit?.score);
    if (s === null) return null;
    criteria.push({ name, score: s });
  }
  const feedback = str(r?.feedback);
  if (!feedback) return null;
  return {
    score: Math.round(criteria.reduce((a, c) => a + c.score, 0) / criteria.length),
    criteria, feedback, strengths: strs(r?.strengths), improvements: strs(r?.improvements), better_answer: str(r?.better_answer, 3000),
  };
}

export function validateSummary(raw: unknown): Summary | null {
  const r = raw as any;
  const overview = str(r?.overview);
  if (!overview) return null;
  return { overview, recurring_weaknesses: strs(r?.recurring_weaknesses), topics_to_practise: strs(r?.topics_to_practise), next_steps: strs(r?.next_steps) };
}

export function overallScore(answers: Answer[]) {
  return answers.length ? Math.round(answers.reduce((a, x) => a + x.evaluation.score, 0) / answers.length) : 0;
}
