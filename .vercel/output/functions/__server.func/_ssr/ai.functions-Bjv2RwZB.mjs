import { a as TSS_SERVER_FUNCTION, l as createServerFn } from "./createServerFn-BhqelEmK.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-CMevzYJH.mjs";
import { t as score } from "./scoring-bzfziPB5.mjs";
import { t as GoogleGenAI } from "../_libs/@google/genai.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai.functions-Bjv2RwZB.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var askInsights_createServerFn_handler = createServerRpc({
	id: "861b5837d5d14a2cace1c0406cb690ef1f3ce322d9941ca5c4cd6af48ed23e1d",
	name: "askInsights",
	filename: "src/lib/ai.functions.ts"
}, (opts) => askInsights.__executeServer(opts));
var askInsights = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => {
	if (!Array.isArray(d?.messages) || d.messages.length === 0) throw new Error("No messages");
	return { messages: d.messages.slice(-12).map((m) => ({
		role: m.role,
		content: String(m.content).slice(0, 4e3)
	})) };
}).handler(askInsights_createServerFn_handler, async ({ data, context }) => {
	const reqId = globalThis.crypto?.randomUUID() || Math.random().toString(36).substring(2, 15);
	console.log(`[AI Insights] [${reqId}] Request received. User ID: ${context.user.id}`);
	const { data: roleData, error: roleError } = await context.supabase.from("user_roles").select("role").eq("user_id", context.user.id).single();
	if (roleError) console.error(`[AI Insights] [${reqId}] Session validation failed.`, {
		code: roleError.code,
		message: roleError.message
	});
	const userRole = roleData?.role || "pending";
	console.log(`[AI Insights] [${reqId}] Session validation complete. Role: ${userRole}`);
	if (userRole === "pending") {
		console.warn(`[AI Insights] [${reqId}] Access denied for pending role.`);
		return {
			reply: "",
			error: "Account pending approval."
		};
	}
	const key = process.env["GEMINI_API_KEY"];
	if (!key) console.warn(`[AI Insights] [${reqId}] GEMINI_API_KEY is not set. Falling back to deterministic response.`);
	let system = "";
	let systemInstruction = "";
	let responseSchema = void 0;
	let fallbackReply = "";
	if (userRole === "student") {
		console.log(`[AI Insights] [${reqId}] Fetching data for student ID: ${context.user.id}`);
		const { data: student, error } = await context.supabase.from("students").select("*").eq("user_id", context.user.id).single();
		if (error || !student) {
			console.error(`[AI Insights] [${reqId}] Could not load student data.`, {
				code: error?.code,
				message: error?.message
			});
			return {
				reply: "",
				error: "Could not load student data."
			};
		}
		const scoredStudent = score(student);
		console.log(`[AI Insights] [${reqId}] Data retrieval complete for student.`);
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
				summary: {
					type: "STRING",
					description: "Overall brief summary of performance"
				},
				observed_indicators: {
					type: "ARRAY",
					items: { type: "STRING" },
					description: "Key metrics observed"
				},
				strengths: {
					type: "ARRAY",
					items: { type: "STRING" },
					description: "Student strengths"
				},
				improvement_areas: {
					type: "ARRAY",
					items: { type: "STRING" },
					description: "Areas needing improvement"
				},
				recommended_actions: {
					type: "ARRAY",
					items: { type: "STRING" },
					description: "Actionable steps"
				},
				suggested_timeline: {
					type: "STRING",
					description: "When to take actions"
				},
				suggested_follow_up_metrics: {
					type: "ARRAY",
					items: { type: "STRING" },
					description: "Metrics to track next"
				},
				caveats: {
					type: "STRING",
					description: "Any warnings or caveats"
				}
			},
			required: [
				"summary",
				"observed_indicators",
				"strengths",
				"improvement_areas",
				"recommended_actions",
				"suggested_timeline",
				"suggested_follow_up_metrics",
				"caveats"
			]
		};
		if (!key) fallbackReply = JSON.stringify({
			summary: "AI integration is pending. Showing deterministic analysis.",
			observed_indicators: [
				`CGPA: ${scoredStudent.cgpa}`,
				`Attendance: ${scoredStudent.attendance}%`,
				`Success Score: ${scoredStudent.successScore}`
			],
			strengths: ["Historical academic data"],
			improvement_areas: scoredStudent.riskFactors.length > 0 ? scoredStudent.riskFactors : ["General consistency"],
			recommended_actions: ["Maintain attendance above 80%", "Complete pending LMS assignments"],
			suggested_timeline: "Immediate",
			suggested_follow_up_metrics: ["Next semester CGPA", "Mid-term attendance"],
			caveats: "This is a deterministic fallback since the AI is not configured."
		});
	} else {
		let roleInstructions = "Answer only from the institutional data below.";
		if (userRole === "placement") roleInstructions = "You must ONLY discuss topics related to placement readiness, skills, and mock interviews. Refuse to discuss general academics or other unrelated topics.";
		else if (userRole === "faculty") roleInstructions = "You must focus your analysis on academics, attendance, and learning outcomes.";
		console.log(`[AI Insights] [${reqId}] Fetching cohort data for role: ${userRole}`);
		const { data: rows, error } = await context.supabase.from("students").select("*");
		if (error) {
			console.error(`[AI Insights] [${reqId}] Could not load student data.`, {
				code: error.code,
				message: error.message
			});
			return {
				reply: "",
				error: "Could not load student data."
			};
		}
		const scored = rows.map(score);
		console.log(`[AI Insights] [${reqId}] Data retrieval complete. Cohort size: ${scored.length}`);
		const table = scored.map((s) => `${s.roll_no}|${s.name}|${s.department}|Y${s.year}|CGPA ${s.cgpa}|Att ${s.attendance}|LMS ${s.lms_activity}|Eng ${s.engagement}|Plc ${s.placement_readiness}|Skl ${s.skills_score}|Backlogs ${s.backlogs}|Success ${s.successScore}|AcadRisk ${s.academicRisk}|PlcRisk ${s.placementRisk}|${s.segment}`).join("\n");
		const tally = (k) => Object.entries(scored.reduce((a, s) => {
			a[k(s)] = (a[k(s)] ?? 0) + 1;
			return a;
		}, {})).map(([n, c]) => `${n}: ${c}`).join(", ");
		const facts = `Exact counts (use these for any "how many" question): total ${scored.length}; by department — ${tally((s) => s.department)}; by year — ${tally((s) => `Y${s.year}`)}; academic risk — ${tally((s) => s.academicRisk)}; placement risk — ${tally((s) => s.placementRisk)}.`;
		systemInstruction = `You are the KRYPTEDU AI Insights assistant for campus leadership. ${roleInstructions}`;
		system = `Be concise and structured: start with a one-line answer, then short bullet points with evidence (names, roll numbers, numbers). Suggest concrete interventions when relevant. Use markdown sparingly (bold, bullets). ${facts}\nData:\n${table}`;
		if (!key) {
			const q = data.messages[data.messages.length - 1]?.content.toLowerCase() || "";
			let reply = "**AI integration is pending.** Returning calculated deterministic statistics:\n\n";
			reply += `• **Total Students:** ${scored.length}\n`;
			reply += `• **High Academic Risk:** ${scored.filter((s) => s.academicRisk === "High").length}\n`;
			reply += `• **High Placement Risk:** ${scored.filter((s) => s.placementRisk === "High").length}\n`;
			if (q.includes("department") || q.includes("compare")) reply += `\n**By Department:**\n` + Object.entries(scored.reduce((a, s) => {
				a[s.department] = (a[s.department] ?? 0) + 1;
				return a;
			}, {})).map(([n, c]) => `• ${n}: ${c} students`).join("\n");
			if (q.includes("urgent") || q.includes("support") || q.includes("risk")) {
				const urgent = scored.filter((s) => s.academicRisk === "High" || s.placementRisk === "High").sort((a, b) => a.successScore - b.successScore).slice(0, 8);
				reply += `\n\n**Students flagged for urgent support:**\n` + urgent.map((s) => `• **${s.name}** (${s.roll_no}): Segment: ${s.segment}.`).join("\n");
			}
			if (q.includes("intervention")) reply += `\n\n**Common Risk Factors Detected:**\n` + Object.entries(scored.flatMap((s) => s.riskFactors).reduce((a, r) => {
				a[r] = (a[r] ?? 0) + 1;
				return a;
			}, {})).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([n, c]) => `• ${n} (${c} students)`).join("\n");
			fallbackReply = reply;
		}
	}
	if (!key) {
		console.log(`[AI Insights] [${reqId}] Sending deterministic fallback response.`);
		return {
			reply: fallbackReply,
			error: null
		};
	}
	try {
		const ai = new GoogleGenAI({ apiKey: key });
		const modelId = process.env["GEMINI_MODEL"] || "gemini-2.5-flash";
		console.log(`[AI Insights] [${reqId}] Sending request to Gemini using model ${modelId}`);
		const response = await ai.models.generateContent({
			model: modelId,
			contents: [{
				role: "user",
				parts: [{ text: system }]
			}, ...data.messages.map((m) => ({
				role: m.role,
				parts: [{ text: m.content }]
			}))],
			config: {
				systemInstruction,
				responseMimeType: responseSchema ? "application/json" : "text/plain",
				responseSchema
			}
		});
		console.log(`[AI Insights] [${reqId}] Gemini request successful.`);
		return {
			reply: response.text ?? "",
			error: null
		};
	} catch (err) {
		console.error(`[AI Insights] [${reqId}] AI gateway error`, {
			name: err.name,
			message: err.message,
			status: err.status
		});
		return {
			reply: "",
			error: "The assistant is unavailable right now. Please try again later."
		};
	}
});
//#endregion
export { askInsights_createServerFn_handler };
