import { GoogleGenAI } from "@google/genai";

/** Shared Gemini JSON call: same key, model and retry rules as AI Insights. */
export async function geminiJson(prompt: string, systemInstruction: string, responseSchema: unknown): Promise<{ data: unknown; error: string | null }> {
  const key = process.env["GOOGLE_API_KEY"] || process.env["GEMINI_API_KEY"];
  if (!key) return { data: null, error: "The AI service isn't configured." };
  const ai = new GoogleGenAI({ apiKey: key });
  const model = process.env["GEMINI_MODEL"] || "gemini-3.5-flash";
  const call = () => ai.models.generateContent({
    model,
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: responseSchema as never,
      thinkingConfig: { thinkingLevel: "low" } as never,
      abortSignal: AbortSignal.timeout(45000),
    },
  });
  try {
    let res;
    try { res = await call(); }
    catch (e: any) {
      if (e?.status !== 503 && e?.status !== 429) throw e;
      await new Promise((r) => setTimeout(r, 1200));
      res = await call();
    }
    try { return { data: JSON.parse(res.text ?? ""), error: null }; }
    catch { return { data: null, error: "The AI returned an unreadable answer. Please retry." }; }
  } catch (err: any) {
    console.error(`[gemini] failed status=${err?.status ?? err?.name ?? "error"}`);
    if (err?.name === "TimeoutError" || err?.name === "AbortError") return { data: null, error: "The AI took too long to respond. Please retry." };
    if (err?.status === 429 || err?.status === 503) return { data: null, error: "The AI is busy right now. Please wait a moment and retry." };
    return { data: null, error: "The AI is unavailable right now." };
  }
}
