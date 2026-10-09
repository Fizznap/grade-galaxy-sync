import { describe, it, expect } from "vitest";
import { score, type StudentRow } from "./scoring";

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
});
