import { describe, it, expect, vi, beforeEach } from "vitest";
import { GoogleGenAI } from "@google/genai";

vi.mock("@google/genai", () => {
  return {
    GoogleGenAI: vi.fn().mockImplementation(function(this: any) {
      this.models = {
        generateContent: vi.fn().mockResolvedValue({ text: "Mock AI Response" })
      };
    })
  };
});

vi.mock("@tanstack/react-start", async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    createServerFn: (opts: any) => {
       const chain: any = {};
       chain.middleware = () => chain;
       chain.inputValidator = () => chain;
       chain.handler = (handler: any) => handler; // Return the raw handler
       return chain;
    }
  };
});

import { askInsights } from "./ai.functions";

describe("askInsights", () => {
  let mockSupabase: any;
  
  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { role: "admin" }, error: null })
      })
    };
    process.env["GEMINI_API_KEY"] = "fake-key";
  });

  it("handles missing credentials gracefully (fallback)", async () => {
    delete process.env["GEMINI_API_KEY"];
    mockSupabase.from = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { role: "student" }, error: null })
    });
    // mock student data
    const studentData = { roll_no: "1", name: "A", department: "CS", year: 1, cgpa: 9, attendance: 90, lms_activity: 90, engagement: 90, placement_readiness: 90, skills_score: 90, backlogs: 0 };
    mockSupabase.from.mockImplementation((table: string) => {
       if (table === "user_roles") return { select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: { role: "student" } }) }) }) };
       if (table === "students") return { select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: studentData }) }) }) };
       return {};
    });
    
    // cast askInsights to any to call the raw handler
    const res = await (askInsights as any)({ 
      data: { messages: [{ role: "user", content: "hello" }] }, 
      context: { user: { id: "u1" }, supabase: mockSupabase } 
    });
    expect(res.error).toBeNull();
    expect(res.reply).toContain("AI integration is pending");
  });

  it("returns generic error on Gemini failure", async () => {
    // force gemini to throw
    vi.mocked(GoogleGenAI).mockImplementationOnce(function(this: any) {
      this.models = {
        generateContent: vi.fn().mockRejectedValue(new Error("Quota Exceeded"))
      };
    } as any);
    
    mockSupabase.from.mockImplementation((table: string) => {
       if (table === "user_roles") return { select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: { role: "student" } }) }) }) };
       if (table === "students") return { select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: { roll_no: "1", name: "A", department: "CS", year: 1, cgpa: 9, attendance: 90, lms_activity: 90, engagement: 90, placement_readiness: 90, skills_score: 90, backlogs: 0 } }) }) }) };
       return {};
    });

    const res = await (askInsights as any)({ 
      data: { messages: [{ role: "user", content: "hello" }] }, 
      context: { user: { id: "u1" }, supabase: mockSupabase } 
    });
    expect(res.reply).toBe("");
    expect(res.error).toBe("The assistant is unavailable right now. Please try again later.");
  });

  it("fails on pending role", async () => {
    mockSupabase.from.mockImplementation((table: string) => {
       if (table === "user_roles") return { select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: { role: "pending" } }) }) }) };
       return {};
    });
    const res = await (askInsights as any)({ 
      data: { messages: [{ role: "user", content: "hello" }] }, 
      context: { user: { id: "u1" }, supabase: mockSupabase } 
    });
    expect(res.error).toBe("Account pending approval.");
  });

  it("fails on missing student data for student role", async () => {
    mockSupabase.from.mockImplementation((table: string) => {
       if (table === "user_roles") return { select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: { role: "student" } }) }) }) };
       if (table === "students") return { select: () => ({ eq: () => ({ single: () => Promise.resolve({ error: { code: "404", message: "Not found" } }) }) }) };
       return {};
    });
    const res = await (askInsights as any)({ 
      data: { messages: [{ role: "user", content: "hello" }] }, 
      context: { user: { id: "u1" }, supabase: mockSupabase } 
    });
    expect(res.error).toBe("Could not load student data.");
  });

  it("handles successful response", async () => {
    mockSupabase.from.mockImplementation((table: string) => {
       if (table === "user_roles") return { select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: { role: "student" } }) }) }) };
       if (table === "students") return { select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: { roll_no: "1", name: "A", department: "CS", year: 1, cgpa: 9, attendance: 90, lms_activity: 90, engagement: 90, placement_readiness: 90, skills_score: 90, backlogs: 0 } }) }) }) };
       return {};
    });
    const res = await (askInsights as any)({ 
      data: { messages: [{ role: "user", content: "hello" }] }, 
      context: { user: { id: "u1" }, supabase: mockSupabase } 
    });
    expect(res.error).toBeNull();
    expect(res.reply).toBe("Mock AI Response");
  });
});
