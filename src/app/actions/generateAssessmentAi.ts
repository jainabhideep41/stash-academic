"use server";

import { auth } from "@/auth";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export interface GenerateAiParams {
  aimEasy: string;
  aimMedium: string;
  aimHard: string;
  courseTitle: string;
  codeSnippet?: string;
  apiKey?: string;
}

export async function generateAssessmentObjectivesAndOutcomes(params: GenerateAiParams) {
  const session = await auth();
  const normalizedEmail = session?.user?.email?.toLowerCase().trim() || "";
  const emailKey = normalizedEmail ? Buffer.from(normalizedEmail).toString("hex") : "";

  const cookieStore = await cookies();
  const rawCookieKey =
    (emailKey ? cookieStore.get(`stash_gemini_${emailKey}`)?.value : "") ||
    cookieStore.get("stash_gemini_key")?.value ||
    "";

  let cookieKey = "";
  if (rawCookieKey) {
    try {
      cookieKey = decodeURIComponent(rawCookieKey).trim();
    } catch {
      cookieKey = rawCookieKey.trim();
    }
  }

  let dbKey = "";
  if (normalizedEmail && process.env.DATABASE_URL) {
    try {
      const u = await prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (u?.geminiApiKey) dbKey = u.geminiApiKey.trim();
    } catch (e) {
      console.warn("DB key fetch fallback:", e);
    }
  }

  const rawKey = params.apiKey?.trim() || cookieKey || dbKey || process.env.GEMINI_API_KEY?.trim() || "";
  const apiKey = rawKey.trim();

  if (!apiKey) {
    return {
      success: false,
      error: "No Gemini API key provided. Please paste your Google Gemini API key.",
    };
  }

  const prompt = `
You are an expert academic curriculum coordinator in Computer Science & Engineering.
Analyze the following laboratory assessment requirements:

Course: ${params.courseTitle}
Aim (Easy): ${params.aimEasy || "Build initial functional module"}
Aim (Medium): ${params.aimMedium || "Enhance module with interactive functionality"}
Aim (Hard): ${params.aimHard || "Develop complete production-grade application"}
${params.codeSnippet ? `Key Code Sample:\n${params.codeSnippet.slice(0, 600)}` : ""}

Generate EXACTLY:
1. "OBJECTIVES": Exactly 6 concise institutional academic objective pointers tailored directly to this experiment. Each pointer MUST start with "To understand...", "To implement...", "To create...", "To learn...", etc.
2. "LEARNING OUTCOMES": Exactly 6 concise institutional learning outcome pointers. Each pointer MUST start with an active verb like "Implement...", "Create...", "Develop...", "Apply...", "Analyze...", "Integrate...".

Respond STRICTLY in valid JSON format without markdown code blocks:
{
  "objectives": [
    "To understand...",
    "To create...",
    "To implement...",
    "To apply...",
    "To analyze...",
    "To evaluate..."
  ],
  "learningOutcomes": [
    "Implement...",
    "Create...",
    "Develop...",
    "Apply...",
    "Analyze...",
    "Integrate..."
  ]
}
`.trim();

  const modelsToTry = [
    "gemini-1.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-pro",
  ];

  let lastGoogleError = "";
  let jsonText = "";

  for (const model of modelsToTry) {
    // Attempt 1: with responseMimeType: "application/json"
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: "application/json",
            },
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        if (jsonText) break;
      } else {
        const errJson = await res.json().catch(() => null);
        const errMsg = errJson?.error?.message || `HTTP ${res.status}: ${res.statusText}`;
        lastGoogleError = errMsg;
        console.warn(`Gemini (${model} JSON) failed:`, errMsg);
      }
    } catch (e: any) {
      lastGoogleError = e?.message || "Network error contacting Google API";
    }

    // Attempt 2: standard prompt without responseMimeType (fallback for models that don't support responseMimeType)
    if (!jsonText) {
      try {
        const res2 = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.2,
              },
            }),
          }
        );

        if (res2.ok) {
          const data2 = await res2.json();
          jsonText = data2.candidates?.[0]?.content?.parts?.[0]?.text || "";
          if (jsonText) break;
        } else {
          const errJson2 = await res2.json().catch(() => null);
          lastGoogleError = errJson2?.error?.message || lastGoogleError;
        }
      } catch (e: any) {
        lastGoogleError = e?.message || lastGoogleError;
      }
    }
  }

  if (!jsonText) {
    return {
      success: false,
      error: lastGoogleError
        ? `Google Gemini Error: ${lastGoogleError}`
        : "Gemini API did not return a response. Please check that your API key has Google Generative AI enabled in Google AI Studio.",
    };
  }

  try {
    // Clean any accidental markdown wrappers
    let cleaned = jsonText.trim();
    cleaned = cleaned.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();

    // Extract first JSON object if surrounded by prose
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1) {
      cleaned = cleaned.slice(firstBrace, lastBrace + 1);
    }

    const parsed = JSON.parse(cleaned);

    return {
      success: true,
      objectives: Array.isArray(parsed.objectives) ? parsed.objectives : [],
      learningOutcomes: Array.isArray(parsed.learningOutcomes) ? parsed.learningOutcomes : [],
    };
  } catch (parseErr) {
    console.error("Failed to parse Gemini JSON output:", jsonText);
    return {
      success: false,
      error: "Gemini returned non-JSON text. Please retry synthesis.",
    };
  }
}
