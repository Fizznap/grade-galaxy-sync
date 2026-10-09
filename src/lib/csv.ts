export const CATEGORIES = {
  Academic: ["cgpa", "backlogs"],
  Attendance: ["attendance"],
  LMS: ["lms_activity"],
  Engagement: ["engagement"],
  Placement: ["placement_readiness"],
  "Skills and Feedback": ["skills_score", "feedback_score"],
} as const;
export type Category = keyof typeof CATEGORIES;

const RANGE: Record<string, [number, number]> = {
  cgpa: [0, 10], backlogs: [0, 30], attendance: [0, 100], lms_activity: [0, 100], engagement: [0, 100],
  placement_readiness: [0, 100], skills_score: [0, 100], feedback_score: [0, 100], year: [1, 6],
};

import Papa from "papaparse";

export function parseCsv(text: string) {
  const parsed = Papa.parse<Record<string, string>>(text.trim(), {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase(),
  });
  
  if (!parsed.data.length || !parsed.meta.fields) {
    return { headers: [] as string[], rows: [] as Record<string, string>[] };
  }
  
  const headers = parsed.meta.fields;
  const rows = parsed.data;
  
  return { headers, rows };
}

export type Validated = { valid: Record<string, string | number>[]; errors: string[] };

export function validate(category: Category, headers: string[], rows: Record<string, string>[]): Validated {
  const errors: string[] = [];
  const needed = ["roll_no", ...CATEGORIES[category]];
  const missing = needed.filter((h) => !headers.includes(h));
  if (missing.length) return { valid: [], errors: [`Missing column(s): ${missing.join(", ")}`] };
  const valid: Record<string, string | number>[] = [];
  const seen = new Map<string, number>();
  rows.forEach((r, idx) => {
    const line = idx + 2;
    const roll = r["roll_no"];
    if (!roll) { errors.push(`Row ${line}: roll_no is empty`); return; }
    const first = seen.get(roll);
    if (first) { errors.push(`Row ${line}: duplicate roll_no ${roll} (already in row ${first}), skipped`); return; }
    seen.set(roll, line);
    const out: Record<string, string | number> = { roll_no: roll };
    for (const f of [...CATEGORIES[category], "year"]) {
      if (!(f in r) || r[f] === "") continue;
      const n = Number(r[f]);
      const [lo, hi] = RANGE[f] ?? [0, 100];
      if (Number.isNaN(n) || n < lo || n > hi) {
        errors.push(`Row ${line}: ${f} must be between ${lo} and ${hi}`);
        return;
      }
      out[f] = f === "cgpa" ? n : Math.round(n);
    }
    if (r["name"]) out["name"] = r["name"];
    if (r["department"]) out["department"] = r["department"];
    valid.push(out);
  });
  return { valid, errors };
}
