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

export function parseCsv(text: string) {
  const lines = text.replace(/\r/g, "").split("\n").filter((l) => l.trim());
  if (lines.length < 2) return { headers: [] as string[], rows: [] as Record<string, string>[] };
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const rows = lines.slice(1).map((l) => {
    const cells = l.split(",").map((c) => c.trim());
    return Object.fromEntries(headers.map((h, i) => [h, cells[i] ?? ""]));
  });
  return { headers, rows };
}

export type Validated = { valid: Record<string, string | number>[]; errors: string[] };

export function validate(category: Category, headers: string[], rows: Record<string, string>[]): Validated {
  const errors: string[] = [];
  const needed = ["roll_no", ...CATEGORIES[category]];
  const missing = needed.filter((h) => !headers.includes(h));
  if (missing.length) return { valid: [], errors: [`Missing column(s): ${missing.join(", ")}`] };
  const valid: Record<string, string | number>[] = [];
  rows.forEach((r, idx) => {
    const line = idx + 2;
    if (!r.roll_no) return errors.push(`Row ${line}: roll_no is empty`);
    const out: Record<string, string | number> = { roll_no: r.roll_no };
    for (const f of [...CATEGORIES[category], "year"]) {
      if (!(f in r) || r[f] === "") continue;
      const n = Number(r[f]);
      const [lo, hi] = RANGE[f];
      if (Number.isNaN(n) || n < lo || n > hi) {
        errors.push(`Row ${line}: ${f} must be between ${lo} and ${hi}`);
        return;
      }
      out[f] = f === "cgpa" ? n : Math.round(n);
    }
    if (r.name) out.name = r.name;
    if (r.department) out.department = r.department;
    valid.push(out);
  });
  return { valid, errors };
}
