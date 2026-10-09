import { describe, it, expect } from "vitest";
import { parseCsv, validate } from "./csv";

describe("CSV validation", () => {
  it("skips duplicate roll numbers and names the row", () => {
    const { headers, rows } = parseCsv("roll_no,attendance\nKR1,80\nKR1,90\n");
    const r = validate("Attendance", headers, rows);
    expect(r.valid).toHaveLength(1);
    expect(r.errors[0]).toContain("Row 3");
  });
  
  it("rejects files missing a required column", () => {
    const { headers, rows } = parseCsv("roll_no,x\nKR1,5\n");
    expect(validate("Attendance", headers, rows).errors[0]).toBe("Missing column(s): attendance");
  });
  
  it("rejects out-of-range values", () => {
    const { headers, rows } = parseCsv("roll_no,attendance\nKR1,abc\n");
    expect(validate("Attendance", headers, rows).valid).toHaveLength(0);
  });

  it("Academic category validation: valid cgpa and backlogs", () => {
    const { headers, rows } = parseCsv("roll_no,cgpa,backlogs\nKR1,8.5,0\n");
    const r = validate("Academic", headers, rows);
    expect(r.valid).toHaveLength(1);
  });

  it("Academic category: cgpa out of range (>10) rejected", () => {
    const { headers, rows } = parseCsv("roll_no,cgpa,backlogs\nKR1,11,0\n");
    const r = validate("Academic", headers, rows);
    expect(r.valid).toHaveLength(0);
  });

  it("Placement category validation: valid placement_readiness", () => {
    const { headers, rows } = parseCsv("roll_no,placement_readiness\nKR1,85\n");
    const r = validate("Placement", headers, rows);
    expect(r.valid).toHaveLength(1);
  });

  it("Skills and Feedback category: both columns required", () => {
    const { headers, rows } = parseCsv("roll_no,skills_score\nKR1,80\n");
    const r = validate("Skills and Feedback", headers, rows);
    expect(r.errors[0]).toMatch(/Missing column\(s\)/);
  });

  it("LMS category: valid lms_activity", () => {
    const { headers, rows } = parseCsv("roll_no,lms_activity\nKR1,75\n");
    const r = validate("LMS", headers, rows);
    expect(r.valid).toHaveLength(1);
  });

  it("Engagement: valid engagement value", () => {
    const { headers, rows } = parseCsv("roll_no,engagement\nKR1,60\n");
    const r = validate("Engagement", headers, rows);
    expect(r.valid).toHaveLength(1);
  });

  it("Empty roll_no rejected", () => {
    const { headers, rows } = parseCsv("roll_no,attendance\n,80\n");
    const r = validate("Attendance", headers, rows);
    expect(r.valid).toHaveLength(0);
  });

  it("Multiple categories missing columns", () => {
    const { headers, rows } = parseCsv("roll_no,x\nKR1,80\n");
    const r = validate("Academic", headers, rows);
    expect(r.errors[0]).toMatch(/Missing column\(s\)/);
  });

  it("Optional name/department captured when present", () => {
    const { headers, rows } = parseCsv("roll_no,name,department,attendance\nKR1,John,CSE,80\n");
    const r = validate("Attendance", headers, rows);
    expect(r.valid[0].name).toBe("John");
    expect(r.valid[0].department).toBe("CSE");
  });

  it("Boundary values: cgpa exactly 0 and 10 accepted, attendance exactly 0 and 100 accepted", () => {
    const r1 = validate("Academic", ["roll_no", "cgpa", "backlogs"], [{ roll_no: "1", cgpa: "0", backlogs: "0" }, { roll_no: "2", cgpa: "10", backlogs: "0" }]);
    expect(r1.valid).toHaveLength(2);

    const r2 = validate("Attendance", ["roll_no", "attendance"], [{ roll_no: "1", attendance: "0" }, { roll_no: "2", attendance: "100" }]);
    expect(r2.valid).toHaveLength(2);
  });
});
