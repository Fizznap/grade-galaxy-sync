import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { score, type StudentRow } from "./scoring";
import { GoogleGenAI } from "@google/genai";

type Msg = { role: "user" | "assistant"; content: string };

export const askInsights = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { messages: Msg[] }) => {
    if (!Array.isArray(d?.messages) || d.messages.length === 0) throw new Error("No messages");
    return { messages: d.messages.slice(-12).map((m) => ({ role: m.role, content: String(m.content).slice(0, 4000) })) };
  })
  .handler(async ({ data, context }) => {
    const reqId = Math.random().toString(36).slice(2, 10);
    const t0 = Date.now();
    const mark: Record<string, number> = {};
    const lap = (k: string, since: number) => { mark[k] = Date.now() - since; };
    const { data: roleData } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId).single();
    lap("auth_ms", t0);
    const userRole = roleData?.role || "pending";
    if (userRole === "pending") return { reply: "", error: "Account pending approval." };

    const key = process.env["GOOGLE_API_KEY"] || process.env["GEMINI_API_KEY"];

    let system = "";
    let systemInstruction = "";
    let responseSchema = undefined;
    let fallbackReply = "";

    if (userRole === "student") {
      const { data: student, error } = await context.supabase.from("students").select("*").eq("user_id", context.userId).single();
      if (error || !student) return { reply: "", error: "Could not load student data." };
      
      const scoredStudent = score(student as unknown as StudentRow);
      
      systemInstruction = `You are a personalized KRYPTEDU academic advisor for a student named ${scoredStudent.name}. Provide structured feedback based on their metrics.`;
      
      system = `Student Profile:
Name: ${scoredStudent.name} (Roll No: ${scoredStudent.roll_no})
Department: ${scoredStudent.department}, Year: ${scoredStudent.year}
CGPA: ${scoredStudent.cgpa}
Attendance: ${scoredStudent.attendance}
LMS Activity: ${scoredStudent.lms_activity}
Engagement: ${scoredStudent.engagement}
Placement Readiness: ${scoredStudent.placement_readiness}
Skills Score: ${scoredStudent.skills_score}
Backlogs: ${scoredStudent.backlogs}
Success Score: ${scoredStudent.successScore}/100
Academic Risk: ${scoredStudent.academicRisk}
Placement Risk: ${scoredStudent.placementRisk}
Segment: ${scoredStudent.segment}
Risk Factors: ${scoredStudent.riskFactors.join(", ")}

Analyze this student data and the user query to provide insights in JSON format.`;

      responseSchema = {
        type: "OBJECT",
        properties: {
          summary: { type: "STRING", description: "Overall brief summary of performance" },
          observed_indicators: { type: "ARRAY", items: { type: "STRING" }, description: "Key metrics observed" },
          strengths: { type: "ARRAY", items: { type: "STRING" }, description: "Student strengths" },
          improvement_areas: { type: "ARRAY", items: { type: "STRING" }, description: "Areas needing improvement" },
          recommended_actions: { type: "ARRAY", items: { type: "STRING" }, description: "Actionable steps" },
          suggested_timeline: { type: "STRING", description: "When to take actions" },
          suggested_follow_up_metrics: { type: "ARRAY", items: { type: "STRING" }, description: "Metrics to track next" },
          caveats: { type: "STRING", description: "Any warnings or caveats" }
        },
        required: ["summary", "observed_indicators", "strengths", "improvement_areas", "recommended_actions", "suggested_timeline", "suggested_follow_up_metrics", "caveats"]
      };

      if (!key) {
         fallbackReply = JSON.stringify({
            summary: "AI integration is pending. Showing deterministic analysis.",
            observed_indicators: [`CGPA: ${scoredStudent.cgpa}`, `Attendance: ${scoredStudent.attendance}%`, `Success Score: ${scoredStudent.successScore}`],
            strengths: ["Historical academic data"],
            improvement_areas: scoredStudent.riskFactors.length > 0 ? scoredStudent.riskFactors : ["General consistency"],
            recommended_actions: ["Maintain attendance above 80%", "Complete pending LMS assignments"],
            suggested_timeline: "Immediate",
            suggested_follow_up_metrics: ["Next semester CGPA", "Mid-term attendance"],
            caveats: "This is a deterministic fallback since the AI is not configured."
         });
      }
    } else {
      let roleInstructions = "Answer only from the institutional data below.";
      if (userRole === "placement") {
        roleInstructions = "You must ONLY discuss topics related to placement readiness, skills, and mock interviews. Refuse to discuss general academics or other unrelated topics.";
      } else if (userRole === "faculty") {
        roleInstructions = "You must focus your analysis on academics, attendance, and learning outcomes.";
      }

      const tq = Date.now();
      const { data: rows, error } = await context.supabase
        .from("students")
        .select("roll_no,name,department,year,cgpa,attendance,lms_activity,engagement,placement_readiness,skills_score,backlogs");
      lap("db_ms", tq);
      if (error) return { reply: "", error: "Could not load student data." };
      const scored = (rows as unknown as StudentRow[]).map(score);
      const table = scored
        .map((s) => `${s.roll_no}|${s.name}|${s.department}|Y${s.year}|CGPA ${s.cgpa}|Att ${s.attendance}|LMS ${s.lms_activity}|Eng ${s.engagement}|Plc ${s.placement_readiness}|Skl ${s.skills_score}|Backlogs ${s.backlogs}|Success ${s.successScore}|AcadRisk ${s.academicRisk}|PlcRisk ${s.placementRisk}|${s.segment}`)
        .join("\n");
      const tally = (k: (s: (typeof scored)[number]) => string) =>
        Object.entries(scored.reduce<Record<string, number>>((a, s) => { a[k(s)] = (a[k(s)] ?? 0) + 1; return a; }, {})).map(([n, c]) => `${n}: ${c}`).join(", ");
      const facts = `Exact counts (use these for any "how many" question): total ${scored.length}; by department — ${tally((s) => s.department)}; by year — ${tally((s) => `Y${s.year}`)}; academic risk — ${tally((s) => s.academicRisk)}; placement risk — ${tally((s) => s.placementRisk)}.`;
      
      systemInstruction = `You are the KRYPTEDU AI Insights assistant for campus leadership. ${roleInstructions}`;
      system = `Be concise and structured: start with a one-line answer, then short bullet points with evidence (names, roll numbers, numbers). Suggest concrete interventions when relevant. Use markdown sparingly (bold, bullets). ${facts}\nData:\n${table}`;

      if (!key) {
        const q = data.messages[data.messages.length - 1]?.content.toLowerCase() || "";
        let reply = "**AI integration is pending.** Returning calculated deterministic statistics:\n\n";
        reply += `• **Total Students:** ${scored.length}\n`;
        reply += `• **High Academic Risk:** ${scored.filter(s => s.academicRisk === 'High').length}\n`;
        reply += `• **High Placement Risk:** ${scored.filter(s => s.placementRisk === 'High').length}\n`;
        
        if (q.includes("department") || q.includes("compare")) {
          reply += `\n**By Department:**\n` + Object.entries(scored.reduce<Record<string, number>>((a, s) => { a[s.department] = (a[s.department] ?? 0) + 1; return a; }, {})).map(([n, c]) => `• ${n}: ${c} students`).join("\n");
        }
        if (q.includes("urgent") || q.includes("support") || q.includes("risk")) {
           const urgent = scored.filter(s => s.academicRisk === 'High' || s.placementRisk === 'High').sort((a, b) => a.successScore - b.successScore).slice(0, 8);
           reply += `\n\n**Students flagged for urgent support:**\n` + urgent.map(s => `• **${s.name}** (${s.roll_no}): Segment: ${s.segment}.`).join("\n");
        }
        if (q.includes("intervention")) {
           reply += `\n\n**Common Risk Factors Detected:**\n` + Object.entries(scored.flatMap(s => s.riskFactors).reduce<Record<string, number>>((a, r) => { a[r] = (a[r] ?? 0) + 1; return a; }, {})).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([n, c]) => `• ${n} (${c} students)`).join("\n");
        }
        fallbackReply = reply;
      }
    }

    if (!key) {
      return { reply: fallbackReply, error: null };
    }

    mark["prompt_chars"] = system.length + systemInstruction.length;
    const tg = Date.now();
    try {
      const ai = new GoogleGenAI({ apiKey: key });
      const modelId = process.env["GEMINI_MODEL"] || "gemini-3.8-flash";
      const response = await ai.models.generateContent({
        model: modelId,
        contents: [
          { role: "user", parts: [{ text: system }] },
          ...data.messages.map(m => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }))
        ],
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: responseSchema ? "application/json" : "text/plain",
          responseSchema: responseSchema as any,
          // Low thinking keeps answers grounded but avoids long reasoning delays.
          thinkingConfig: { thinkingLevel: "low" } as any,
          abortSignal: AbortSignal.timeout(45000),
        }
      });
      lap("gemini_ms", tg);
      lap("total_ms", t0);
      console.log(`[ai ${reqId}] ok`, JSON.stringify(mark));
      return { reply: response.text ?? "", error: null };
    } catch (err: any) {
      lap("gemini_ms", tg);
      lap("total_ms", t0);
      const status = err?.status ?? err?.name ?? "error";
      console.error(`[ai ${reqId}] failed status=${status}`, JSON.stringify(mark));
      if (err?.name === "TimeoutError" || err?.name === "AbortError")
        return { reply: "", error: "The assistant took too long to respond. Please try again." };
      if (status === 429) return { reply: "", error: "The assistant is busy right now. Please wait a moment and retry." };
      return { reply: "", error: "The assistant is unavailable right now." };
    }
  });
