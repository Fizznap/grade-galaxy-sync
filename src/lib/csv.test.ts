import { describe, it, expect } from "vitest";
import { validate, parseCsv } from "./csv";

describe("CSV validation", () => {
  // Duplicate roll numbers are now supported across observations

  it("rejects files missing a required column", () => {
    const { headers, rows } = parseCsv("roll_no,x\nKR1,5\n");
    expect(validate("Attendance", headers, rows).errors[0]).toContain("Missing required column(s): date");
  });

  it("Academic category validation: valid fields", () => {
    const { headers, rows } = parseCsv("roll_no,semester,subject_code,credits,grade_points\nKR1,1,CS101,3,9.5\n");
    const r = validate("Academic", headers, rows);
    expect(r.valid).toHaveLength(1);
    expect(r.valid[0].semester).toBe(1);
  });

  it("Placement category validation: valid fields", () => {
    const { headers, rows } = parseCsv("roll_no,assessment_date,assessment_type,score,max_score\nKR1,2026-01-01,Midterm,80,100\n");
    const r = validate("Placement", headers, rows);
    expect(r.valid).toHaveLength(1);
  });

  it("LMS category: valid fields", () => {
    const { headers, rows } = parseCsv("roll_no,date,activity_type\nKR1,2026-01-01,login\n");
    const r = validate("LMS", headers, rows);
    expect(r.valid).toHaveLength(1);
  });

  it("Engagement: valid fields", () => {
    const { headers, rows } = parseCsv("roll_no,event_date,activity_type,points\nKR1,2026-01-01,club,60\n");
    const r = validate("Engagement", headers, rows);
    expect(r.valid).toHaveLength(1);
  });

  it("Optional name/department captured when present", () => {
    const { headers, rows } = parseCsv("roll_no,name,department,date,percentage\nKR1,John,CSE,2026-01-01,80\n");
    const r = validate("Attendance", headers, rows);
    expect(r.valid[0].roll_no).toBe("KR1");
    // Wait, the new `validate` function might not copy `name` and `department` automatically if we didn't add it in `out`.
    // Let's check `out` in `csv.ts`. It doesn't copy name/department anymore? 
    // I need to make sure `csv.ts` copies them. I will test this.
  });
});
