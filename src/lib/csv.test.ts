import { describe, it, expect } from "vitest";
import { validate, parseCsv } from "./csv";

describe("CSV validation", () => {
  it("rejects files missing a required column", () => {
    const { headers, rows } = parseCsv("roll_no,x\nKR1,5\n");
    expect(validate("Attendance", headers, rows).errors[0]).toContain("Missing required column(s): date");
  });

  it("Empty roll_no rejected", () => {
    const { headers, rows } = parseCsv("roll_no,date\n,2026-01-01\n");
    const r = validate("Attendance", headers, rows);
    expect(r.valid).toHaveLength(0);
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
    expect(r.valid[0].name).toBe("John");
    expect(r.valid[0].department).toBe("CSE");
  });

  it("Boundary values: attendance percentage exactly 0 and 100 accepted", () => {
    const r = validate("Attendance", ["roll_no", "date", "percentage"], [
      { roll_no: "1", date: "2026-01-01", percentage: "0" }, 
      { roll_no: "2", date: "2026-01-02", percentage: "100" }
    ]);
    expect(r.valid).toHaveLength(2);
  });

  it("Rejects out of range attendance percentages", () => {
    const r = validate("Attendance", ["roll_no", "date", "percentage"], [
      { roll_no: "1", date: "2026-01-01", percentage: "-1" }, 
      { roll_no: "2", date: "2026-01-02", percentage: "101" }
    ]);
    expect(r.valid).toHaveLength(0);
    expect(r.errors.length).toBe(2);
  });
});
