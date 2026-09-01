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
  const cookieKey =
    (emailKey ? cookieStore.get(`stash_gemini_${emailKey}`)?.value : "") ||
    cookieStore.get("stash_gemini_key")?.value ||
    "";

  let dbKey = "";
  if (normalizedEmail && process.env.DATABASE_URL) {
    try {
      const u = await prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (u?.geminiApiKey) dbKey = u.geminiApiKey;
    } catch (e) {
      console.warn("DB key fetch fallback:", e);
    }
  }

  const apiKey = params.apiKey?.trim() || cookieKey?.trim() || dbKey?.trim() || process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    return {
      success: false,
      error: "No Gemini API key found. Please add your free Google AI Studio API key in your Profile settings.",
    };
  }

  const prompt = `
You are an expert academic curriculum coordinator in Computer Science & Engineering.
Analyze the following laboratory assessment requirements:

Course: ${params.courseTitle}
Aim (Easy): ${params.aimEasy}
Aim (Medium): ${params.aimMedium}
Aim (Hard): ${params.aimHard}
${params.codeSnippet ? `Key Code Sample:\n${params.codeSnippet.slice(0, 600)}` : ""}

Generate EXACTLY:
1. "OBJECTIVES": Exactly 6 concise institutional academic objective pointers tailored directly to this experiment. Each pointer MUST start with "To understand...", "To implement...", "To create...", "To learn...", etc.
2. "LEARNING OUTCOMES": Exactly 6 concise institutional learning outcome pointers. Each pointer MUST start with an active past/present verb like "Implement...", "Create...", "Develop...", "Apply...", "Analyze...", "Integrate...".

Respond STRICTLY in this JSON format without markdown code fences:
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

  try {
    // Call Gemini API (supports latest models with fallback)
    const modelsToTry = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"];
    let jsonText = "";

    for (const model of modelsToTry) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
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
        }
      } catch (e) {
        console.warn(`Model ${model} request failed, trying fallback:`, e);
      }
    }

    if (!jsonText) {
      return {
        success: false,
        error: "Gemini API did not return a valid response. Please check your API key permissions.",
      };
    }

    // Clean any accidental markdown wrap
    const cleanedJson = jsonText.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    const parsed = JSON.parse(cleanedJson);

    return {
      success: true,
      objectives: parsed.objectives || [],
      learningOutcomes: parsed.learningOutcomes || [],
    };
  } catch (err: any) {
    console.error("Gemini synthesis error:", err);
    return {
      success: false,
      error: err.message || "Failed to generate AI objectives and outcomes.",
    };
  }
}
