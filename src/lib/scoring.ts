export type StudentRow = {
  id: string;
  roll_no: string;
  name: string;
  department: string;
  year: number;
  cgpa: number;
  attendance: number;
  lms_activity: number;
  engagement: number;
  placement_readiness: number;
  skills_score: number;
  feedback_score: number;
  backlogs: number;
};

export type Risk = "High" | "Medium" | "Low";
export type Segment =
  | "High Academic / High Placement"
  | "High Academic / Low Placement"
  | "Low Academic / High Placement"
  | "Low Academic / Low Placement";

export type Scored = StudentRow & {
  academicIndex: number;
  placementIndex: number;
  successScore: number;
  academicRisk: Risk;
  placementRisk: Risk;
  segment: Segment;
  riskFactors: string[];
};

const clamp = (num: number) => Math.max(0, Math.min(100, num));
const round = (num: number) => Math.round(num);
const n = (v: unknown): number => { const x = Number(v); return Number.isFinite(x) ? x : 0; };

/** Academic index: CGPA 50%, attendance 30%, LMS activity 20%, minus 5 per backlog. */
export function academicIndex(s: StudentRow) {
  return round(
    clamp((n(s.cgpa) / 10) * 100 * 0.5 + n(s.attendance) * 0.3 + n(s.lms_activity) * 0.2 - n(s.backlogs) * 5),
  );
}

/** Placement index: readiness 50%, skills 30%, feedback 20%. */
export function placementIndex(s: StudentRow) {
  return round(clamp(n(s.placement_readiness) * 0.5 + n(s.skills_score) * 0.3 + n(s.feedback_score) * 0.2));
}

/** Student Success Score: academic 45%, placement 35%, engagement 20%. */
export function successScore(s: StudentRow) {
  return round(clamp(academicIndex(s) * 0.45 + placementIndex(s) * 0.35 + n(s.engagement) * 0.2));
}

export function academicRisk(s: StudentRow): Risk {
  const a = academicIndex(s);
  if (a < 55 || n(s.backlogs) >= 2 || n(s.attendance) < 60) return "High";
  if (a < 70 || n(s.attendance) < 75) return "Medium";
  return "Low";
}

export function placementRisk(s: StudentRow): Risk {
  const p = placementIndex(s);
  if (p < 45) return "High";
  if (p < 65) return "Medium";
  return "Low";
}

export function segmentOf(s: StudentRow): Segment {
  const hiA = academicIndex(s) >= 65;
  const hiP = placementIndex(s) >= 60;
  return `${hiA ? "High" : "Low"} Academic / ${hiP ? "High" : "Low"} Placement` as Segment;
}

export function riskFactors(s: StudentRow) {
  const f: string[] = [];
  if (n(s.cgpa) < 6) f.push(`Low CGPA (${n(s.cgpa)})`);
  if (n(s.attendance) < 75) f.push(`Attendance below 75% (${n(s.attendance)}%)`);
  if (n(s.backlogs) > 0) f.push(`${n(s.backlogs)} active backlog${n(s.backlogs) > 1 ? "s" : ""}`);
  if (n(s.lms_activity) < 45) f.push(`Low LMS activity (${n(s.lms_activity)})`);
  if (n(s.engagement) < 40) f.push(`Low campus engagement (${n(s.engagement)})`);
  if (n(s.placement_readiness) < 45) f.push(`Low placement readiness (${n(s.placement_readiness)})`);
  if (n(s.skills_score) < 40) f.push(`Skill gaps (${n(s.skills_score)})`);
  return f;
}

export function dataCompleteness(s: StudentRow): { filled: number; total: number; missing: string[] } {
  const fields = ['cgpa', 'attendance', 'lms_activity', 'engagement', 'placement_readiness', 'skills_score', 'feedback_score'] as const;
  const missing = fields.filter(f => !Number.isFinite(Number(s[f])) || Number(s[f]) === 0);
  return { filled: fields.length - missing.length, total: fields.length, missing: [...missing] };
}

export function score(s: StudentRow): Scored {
  return {
    ...s,
    cgpa: n(s.cgpa),
    academicIndex: academicIndex(s),
    placementIndex: placementIndex(s),
    successScore: successScore(s),
    academicRisk: academicRisk(s),
    placementRisk: placementRisk(s),
    segment: segmentOf(s),
    riskFactors: riskFactors(s),
  };
}

export const SEGMENTS: Segment[] = [
  "High Academic / High Placement",
  "High Academic / Low Placement",
  "Low Academic / High Placement",
  "Low Academic / Low Placement",
];

/** Challenge support groups (a student may match several; insufficient-data students match only that group). */
export type SupportGroup = "Urgent support" | "Strong academics, low placement" | "Good academics, poor attendance" | "Placement-ready, low risk" | "Insufficient data";
export const SUPPORT_GROUPS: { id: SupportGroup; rule: string }[] = [
  { id: "Urgent support", rule: "High academic risk and high placement risk" },
  { id: "Strong academics, low placement", rule: "Academic index ≥ 65, placement index < 60" },
  { id: "Good academics, poor attendance", rule: "CGPA ≥ 7 and attendance < 75%" },
  { id: "Placement-ready, low risk", rule: "Low placement risk and low academic risk" },
  { id: "Insufficient data", rule: "2 or more indicators missing (recorded as 0)" },
];
export function supportGroups(s: StudentRow): SupportGroup[] {
  if (dataCompleteness(s).missing.length >= 2) return ["Insufficient data"];
  const g: SupportGroup[] = [];
  const a = academicRisk(s), p = placementRisk(s);
  if (a === "High" && p === "High") g.push("Urgent support");
  if (academicIndex(s) >= 65 && placementIndex(s) < 60) g.push("Strong academics, low placement");
  if (n(s.cgpa) >= 7 && n(s.attendance) < 75) g.push("Good academics, poor attendance");
  if (a === "Low" && p === "Low") g.push("Placement-ready, low risk");
  return g;
}
