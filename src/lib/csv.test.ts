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
});
