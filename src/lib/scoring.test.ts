import { describe, it, expect } from "vitest";
import { score, dataCompleteness, type StudentRow } from "./scoring";

const base: StudentRow = {
  id: "1", roll_no: "R1", name: "A", department: "CS", year: 2,
  cgpa: 8, attendance: 80, lms_activity: 70, engagement: 60,
  placement_readiness: 70, skills_score: 60, feedback_score: 80, backlogs: 0,
};

describe("scoring", () => {
  it("computes success score from weighted indices", () => {
    const s = score(base);
    expect(s.academicIndex).toBe(78); // 40 + 24 + 14
    expect(s.placementIndex).toBe(69); // 35 + 18 + 16
    expect(s.successScore).toBe(71); // 35.1 + 24.15 + 12
  });
  it("flags high academic risk with 2+ backlogs", () => {
    expect(score({ ...base, backlogs: 2 }).academicRisk).toBe("High");
  });
  it("flags high placement risk below 45", () => {
    expect(score({ ...base, placement_readiness: 20, skills_score: 20, feedback_score: 40 }).placementRisk).toBe("High");
  });
  it("assigns segment", () => {
    expect(score(base).segment).toBe("High Academic / High Placement");
  });

  // 1. NaN handling: score with null/undefined fields should produce valid numbers, not NaN
  it("NaN handling: score with null/undefined fields should produce valid numbers", () => {
    const s = score({ ...base, cgpa: undefined as any, attendance: null as any, lms_activity: NaN });
    expect(Number.isNaN(s.academicIndex)).toBe(false);
    expect(s.academicIndex).toBe(0);
  });

  // 2. All-zero student: score should be 0
  it("All-zero student: score should be 0", () => {
    const s = score({ ...base, cgpa: 0, attendance: 0, lms_activity: 0, engagement: 0, placement_readiness: 0, skills_score: 0, feedback_score: 0, backlogs: 0 });
    expect(s.successScore).toBe(0);
  });

  // 3. Boundary values: academicIndex at exactly 55 (medium not high), at 54 (high)
  it("Boundary values: academicIndex at exactly 55 and 54", () => {
    // 55 academic: cgpa 8 (40), attendance 60 (18), lms 0 (-3? wait, clamp(58)) -> just use values that give exactly 55 and >=60 att
    expect(score({ ...base, cgpa: 7.4, attendance: 60, lms_activity: 0, backlogs: 0 }).academicRisk).toBe("Medium"); // 37 + 18 = 55
    expect(score({ ...base, cgpa: 7.2, attendance: 60, lms_activity: 0, backlogs: 0 }).academicRisk).toBe("High"); // 36 + 18 = 54
  });

  // 4. Boundary values: placementIndex at exactly 45 (medium not high), at 44 (high)
  it("Boundary values: placementIndex at exactly 45 and 44", () => {
    expect(score({ ...base, placement_readiness: 90, skills_score: 0, feedback_score: 0 }).placementRisk).toBe("Medium"); // 45
    expect(score({ ...base, placement_readiness: 88, skills_score: 0, feedback_score: 0 }).placementRisk).toBe("High"); // 44
  });

  // 5. Boundary values: attendance at 60 (high threshold), 59 (high), 75 (medium threshold), 74 (medium)
  it("Boundary values: attendance thresholds", () => {
    expect(score({ ...base, attendance: 60, cgpa: 10, lms_activity: 100 }).academicRisk).not.toBe("High");
    expect(score({ ...base, attendance: 59, cgpa: 10, lms_activity: 100 }).academicRisk).toBe("High");
    expect(score({ ...base, attendance: 75, cgpa: 10, lms_activity: 100 }).academicRisk).toBe("Low");
    expect(score({ ...base, attendance: 74, cgpa: 10, lms_activity: 100 }).academicRisk).toBe("Medium");
  });

  // 6. Backlogs: 1 backlog is low risk (if index is high), 2 backlogs high
  it("Backlogs: 1 backlog low, 2 backlogs high", () => {
    expect(score({ ...base, backlogs: 1, cgpa: 10, attendance: 100 }).academicRisk).toBe("Low");
    expect(score({ ...base, backlogs: 2, cgpa: 10, attendance: 100 }).academicRisk).toBe("High");
  });

  // 7. dataCompleteness: all fields filled, some missing
  it("dataCompleteness: all fields filled, some missing", () => {
    const all = dataCompleteness(base);
    expect(all.filled).toBe(all.total);
    const missing = dataCompleteness({ ...base, cgpa: null as any, attendance: 0 });
    expect(missing.filled).toBe(missing.total - 2);
    expect(missing.missing).toContain("cgpa");
    expect(missing.missing).toContain("attendance");
  });

  // 8. riskFactors: verify specific factors for a student with known issues
  it("riskFactors: verify specific factors", () => {
    const factors = score({ ...base, cgpa: 5, backlogs: 1 }).riskFactors;
    expect(factors).toContain("Low CGPA (5)");
    expect(factors).toContain("1 active backlog");
  });

  // 9. Segment assignment for all 4 quadrants
  it("Segment assignment for all 4 quadrants", () => {
    expect(score({ ...base, cgpa: 10, placement_readiness: 100 }).segment).toBe("High Academic / High Placement");
    expect(score({ ...base, cgpa: 10, placement_readiness: 0, skills_score: 0, feedback_score: 0 }).segment).toBe("High Academic / Low Placement");
    expect(score({ ...base, cgpa: 0, attendance: 0, lms_activity: 0, placement_readiness: 100 }).segment).toBe("Low Academic / High Placement");
    expect(score({ ...base, cgpa: 0, attendance: 0, lms_activity: 0, placement_readiness: 0, skills_score: 0, feedback_score: 0 }).segment).toBe("Low Academic / Low Placement");
  });

  // 10. Maximum score (all perfect values)
  it("Maximum score", () => {
    const perfect = score({ ...base, cgpa: 10, attendance: 100, lms_activity: 100, engagement: 100, placement_readiness: 100, skills_score: 100, feedback_score: 100 });
    expect(perfect.academicIndex).toBe(100);
    expect(perfect.placementIndex).toBe(100);
    expect(perfect.successScore).toBe(100);
  });
});
