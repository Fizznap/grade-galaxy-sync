import Papa from "papaparse";

export const CATEGORIES = {
  Academic: ["semester", "subject_code", "credits", "grade_points"],
  Attendance: ["date"], // Either classes_total & classes_attended OR percentage
  LMS: ["date", "activity_type"],
  Engagement: ["event_date", "activity_type", "points"],
  Placement: ["assessment_date", "assessment_type", "score", "max_score"],
  Skills: ["assessment_date", "skill_name", "score", "max_score"],
  Feedback: ["category"],
} as const;

export type Category = keyof typeof CATEGORIES;

export function parseCsv(text: string) {
  const parsed = Papa.parse<Record<string, string>>(text.trim(), {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase(),
  });
  
  if (!parsed.data.length || !parsed.meta.fields) {
    return { headers: [] as string[], rows: [] as Record<string, string>[] };
  }
  
  return { headers: parsed.meta.fields, rows: parsed.data };
}

export type Validated = { valid: Record<string, string | number | boolean>[]; errors: string[] };

export function validate(category: Category, headers: string[], rows: Record<string, string>[]): Validated {
  const errors: string[] = [];
  const needed = ["roll_no", ...CATEGORIES[category]];
  const missing = needed.filter((h) => !headers.includes(h));
  if (missing.length) return { valid: [], errors: [`Missing required column(s): ${missing.join(", ")}`] };

  const valid: Record<string, string | number | boolean>[] = [];
  
  rows.forEach((r, idx) => {
    const line = idx + 2;
    const roll = r["roll_no"];
    if (!roll) { errors.push(`Row ${line}: roll_no is empty`); return; }

    const out: Record<string, string | number | boolean> = { roll_no: roll };
    if (r["name"]) out.name = r["name"];
    if (r["department"]) out.department = r["department"];
    if (r["year"]) out.year = Number(r["year"]) || 1;
    let hasError = false;

    // Helper for numeric
    const parseNum = (field: string, min?: number, max?: number, allowEmpty = true): number | undefined => {
      if (!(field in r) || r[field] === "") {
        if (!allowEmpty) { errors.push(`Row ${line}: ${field} is required`); hasError = true; }
        return undefined;
      }
      const val = Number(r[field]);
      if (Number.isNaN(val)) {
        errors.push(`Row ${line}: ${field} must be a number`);
        hasError = true;
        return undefined;
      }
      if (min !== undefined && val < min) {
        errors.push(`Row ${line}: ${field} must be >= ${min}`);
        hasError = true;
      }
      if (max !== undefined && val > max) {
        errors.push(`Row ${line}: ${field} must be <= ${max}`);
        hasError = true;
      }
      return val;
    };

    const parseStr = (field: string, allowEmpty = true) => {
      const val = r[field]?.trim();
      if (!val && !allowEmpty) {
        errors.push(`Row ${line}: ${field} is required`);
        hasError = true;
      }
      return val;
    };

    // Category specific validations
    if (category === "Academic") {
      out.semester = parseNum("semester", 1, 10, false)!;
      out.subject_code = parseStr("subject_code", false)!;
      out.credits = parseNum("credits", 0.5, undefined, false)!;
      out.grade_points = parseNum("grade_points", 0, undefined, false)!;
      out.is_backlog = r["is_backlog"]?.toLowerCase() === "true";
    } 
    else if (category === "Attendance") {
      out.date = parseStr("date", false)!;
      out.subject_code = parseStr("subject_code", true) || "";
      const ct = parseNum("classes_total", 1, undefined, true);
      const ca = parseNum("classes_attended", 0, undefined, true);
      const pct = parseNum("percentage", 0, 100, true);
      if (ct !== undefined && ca !== undefined && ca > ct) {
        errors.push(`Row ${line}: classes_attended cannot exceed classes_total`);
        hasError = true;
      }
      if (ct === undefined && pct === undefined) {
        errors.push(`Row ${line}: must provide either classes_total/attended or percentage`);
        hasError = true;
      }
      if (ct !== undefined) out.classes_total = ct;
      if (ca !== undefined) out.classes_attended = ca;
      if (pct !== undefined) out.percentage = pct;
    }
    else if (category === "LMS") {
      out.date = parseStr("date", false)!;
      out.activity_type = parseStr("activity_type", false)!;
      out.session_id = parseStr("session_id", true) || "";
      const dur = parseNum("duration_minutes", 0, undefined, true);
      if (dur !== undefined) out.duration_minutes = dur;
    }
    else if (category === "Engagement") {
      out.event_date = parseStr("event_date", false)!;
      out.activity_type = parseStr("activity_type", false)!;
      out.points = parseNum("points", 0, undefined, false)!;
    }
    else if (category === "Placement") {
      out.assessment_date = parseStr("assessment_date", false)!;
      out.assessment_type = parseStr("assessment_type", false)!;
      out.score = parseNum("score", 0, undefined, false)!;
      out.max_score = parseNum("max_score", 1, undefined, false)!;
      if (out.score !== undefined && out.max_score !== undefined && out.score > out.max_score) {
        errors.push(`Row ${line}: score cannot exceed max_score`);
        hasError = true;
      }
      const attempt = parseNum("attempt_number", 1, undefined, true);
      out.attempt_number = attempt !== undefined ? attempt : 1;
    }
    else if (category === "Skills") {
      out.assessment_date = parseStr("assessment_date", false)!;
      out.skill_name = parseStr("skill_name", false)!;
      out.score = parseNum("score", 0, undefined, false)!;
      out.max_score = parseNum("max_score", 1, undefined, false)!;
      if (out.score !== undefined && out.max_score !== undefined && out.score > out.max_score) {
        errors.push(`Row ${line}: score cannot exceed max_score`);
        hasError = true;
      }
    }
    else if (category === "Feedback") {
      const validCats = ['student_satisfaction', 'faculty_feedback', 'peer_review', 'advisor_note'];
      const catVal = parseStr("category", false)!;
      if (!validCats.includes(catVal)) {
        errors.push(`Row ${line}: category must be one of: ${validCats.join(', ')}`);
        hasError = true;
      }
      out.category = catVal;
      out.score = parseNum("score", 0, undefined, true) ?? "";
      out.max_score = parseNum("max_score", 1, undefined, true) ?? "";
      if (typeof out.score === 'number' && typeof out.max_score === 'number' && out.score > out.max_score) {
        errors.push(`Row ${line}: score cannot exceed max_score`);
        hasError = true;
      }
      out.notes = parseStr("notes", true) || "";
      out.is_confidential = r["is_confidential"]?.toLowerCase() === "true";
      out.submitted_by = parseStr("submitted_by", true) || "";
    }

    if (!hasError) valid.push(out);
  });

  return { valid, errors };
}
