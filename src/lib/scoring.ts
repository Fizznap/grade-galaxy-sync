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

const clamp = (n: number) => Math.max(0, Math.min(100, n));
const round = (n: number) => Math.round(n);

/** Academic index: CGPA 50%, attendance 30%, LMS activity 20%, minus 5 per backlog. */
export function academicIndex(s: StudentRow) {
  return round(
    clamp((Number(s.cgpa) / 10) * 100 * 0.5 + s.attendance * 0.3 + s.lms_activity * 0.2 - s.backlogs * 5),
  );
}

/** Placement index: readiness 50%, skills 30%, feedback 20%. */
export function placementIndex(s: StudentRow) {
  return round(clamp(s.placement_readiness * 0.5 + s.skills_score * 0.3 + s.feedback_score * 0.2));
}

/** Student Success Score: academic 45%, placement 35%, engagement 20%. */
export function successScore(s: StudentRow) {
  return round(clamp(academicIndex(s) * 0.45 + placementIndex(s) * 0.35 + s.engagement * 0.2));
}

export function academicRisk(s: StudentRow): Risk {
  const a = academicIndex(s);
  if (a < 55 || s.backlogs >= 2 || s.attendance < 60) return "High";
  if (a < 70 || s.attendance < 75) return "Medium";
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
  if (Number(s.cgpa) < 6) f.push(`Low CGPA (${s.cgpa})`);
  if (s.attendance < 75) f.push(`Attendance below 75% (${s.attendance}%)`);
  if (s.backlogs > 0) f.push(`${s.backlogs} active backlog${s.backlogs > 1 ? "s" : ""}`);
  if (s.lms_activity < 45) f.push(`Low LMS activity (${s.lms_activity})`);
  if (s.engagement < 40) f.push(`Low campus engagement (${s.engagement})`);
  if (s.placement_readiness < 45) f.push(`Low placement readiness (${s.placement_readiness})`);
  if (s.skills_score < 40) f.push(`Skill gaps (${s.skills_score})`);
  return f;
}

export function score(s: StudentRow): Scored {
  return {
    ...s,
    cgpa: Number(s.cgpa),
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
