import { describe, it, expect } from "vitest";
import { generateSuggestions } from "./interventions";
import { type Scored } from "./scoring";

describe("Intervention suggestions", () => {
  const baseStudent: Scored = {
    id: "uuid",
    roll_no: "KR1",
    department: "CSE",
    academic_risk: "Low",
    placement_risk: "Low",
    score_academic: 80,
    score_placement: 80,
    score_total: 80,
    risk_level: "Low",
    last_updated: new Date().toISOString(),
    name: "Test Student",
    cgpa: 8,
    attendance: 85,
    backlogs: 0,
    lms_activity: 80,
    placement_readiness: 80,
    skills_score: 80,
    feedback_score: 80,
    engagement: 80
  };

  it("High-risk student with multiple issues generates multiple suggestions", () => {
    const student = { ...baseStudent, attendance: 50, cgpa: 4.5, backlogs: 3, placement_readiness: 30 };
    const suggestions = generateSuggestions(student);
    expect(suggestions.length).toBeGreaterThan(1);
    expect(suggestions.some(s => s.priority === 'High')).toBe(true);
  });

  it("Low-risk student generates no suggestions (or only minor ones)", () => {
    const student = { ...baseStudent };
    const suggestions = generateSuggestions(student);
    expect(suggestions).toHaveLength(0);
  });

  it("Each suggestion has requiresFacultyReview: true", () => {
    const student = { ...baseStudent, attendance: 50, cgpa: 4.5 };
    const suggestions = generateSuggestions(student);
    expect(suggestions.length).toBeGreaterThan(0);
    suggestions.forEach(s => {
      expect(s.requiresFacultyReview).toBe(true);
    });
  });

  it("Attendance < 60 generates High priority suggestion", () => {
    const student = { ...baseStudent, attendance: 55 };
    const suggestions = generateSuggestions(student);
    const att = suggestions.find(s => s.indicator === "attendance");
    expect(att).toBeDefined();
    expect(att?.priority).toBe('High');
  });

  it("Skills < 40 generates Skills category suggestion", () => {
    const student = { ...baseStudent, skills_score: 35 };
    const suggestions = generateSuggestions(student);
    const skill = suggestions.find(s => s.indicator === "skills_score");
    expect(skill).toBeDefined();
    expect(skill?.category).toBe('Skills');
  });

  it("All suggestions have non-empty issue, action, why, followUp fields", () => {
    const student = { 
      ...baseStudent, 
      attendance: 55, 
      cgpa: 5.5, 
      backlogs: 1, 
      lms_activity: 40,
      placement_readiness: 40,
      skills_score: 30,
      feedback_score: 30,
      engagement: 20
    };
    const suggestions = generateSuggestions(student);
    expect(suggestions.length).toBeGreaterThan(0);
    suggestions.forEach(s => {
      expect(s.issue).toBeTruthy();
      expect(s.action).toBeTruthy();
      expect(s.why).toBeTruthy();
      expect(s.followUp).toBeTruthy();
    });
  });
});
