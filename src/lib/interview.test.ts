import { describe, it, expect } from "vitest";
import { validateEvaluation, validateQuestions, overallScore } from "./interview";
describe("interview validation", () => {
  it("score is the mean of the three rubric scores", () => {
    const e = validateEvaluation({ criteria: [{ name: "Technical correctness", score: 90 }, { name: "Relevance and completeness", score: 60 }, { name: "Problem-solving explanation", score: 30 }], feedback: "ok" }, "Technical");
    expect(e?.score).toBe(60);
  });
  it("rejects evaluation missing a rubric criterion", () => {
    expect(validateEvaluation({ criteria: [{ name: "Clarity and structure", score: 80 }], feedback: "x" }, "HR/Behavioral")).toBeNull();
  });
  it("clamps scores to 0-100", () => {
    const e = validateEvaluation({ criteria: [{ name: "Clarity and structure", score: 150 }, { name: "Relevance to the question", score: -5 }, { name: "Specificity and concrete examples", score: 50 }], feedback: "x" }, "HR/Behavioral");
    expect(e?.criteria.map((c) => c.score)).toEqual([100, 0, 50]);
  });
  it("rejects fewer questions than requested", () => {
    expect(validateQuestions({ questions: [{ text: "Explain closures in JS" }] }, 5, "Technical")).toBeNull();
  });
  it("overall score averages answers", () => {
    expect(overallScore([{ answer: "a", evaluation: { score: 40 } as never }, { answer: "b", evaluation: { score: 80 } as never }])).toBe(60);
  });
});
