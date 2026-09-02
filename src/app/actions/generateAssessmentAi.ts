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
1. "objectives": Exactly 6 concise institutional academic objective pointers tailored directly to this experiment. Each pointer MUST start with "To understand...", "To implement...", "To create...", "To learn...", etc.
2. "learningOutcomes": Exactly 6 concise institutional learning outcome pointers. Each pointer MUST start with an active verb like "Implement...", "Create...", "Develop...", "Apply...", "Analyze...", "Integrate...".

Respond STRICTLY in this JSON format:
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

  // 1. Dynamically query Google ModelService to discover which models this API key actually has access to
  let activeModels: string[] = [];
  try {
    const listRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`
    );

    if (listRes.ok) {
      const listData = await listRes.json();
      if (Array.isArray(listData.models)) {
        activeModels = listData.models
          .filter(
            (m: any) =>
              Array.isArray(m.supportedGenerationMethods) &&
              m.supportedGenerationMethods.includes("generateContent")
          )
          .map((m: any) => (m.name || "").replace(/^models\//, ""))
          .filter(Boolean);
      }
    } else {
      const errData = await listRes.json().catch(() => null);
      if (errData?.error?.message) {
        return {
          success: false,
          error: `Google Gemini Error: ${errData.error.message}`,
        };
      }
    }
  } catch (e: any) {
    console.warn("ModelService.ListModels failed, falling back to static list:", e);
  }

  // Priority order for models
  const priorityOrder = [
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-2.5-flash",
    "gemini-2.0-flash-exp",
    "gemini-1.5-pro-latest",
  ];

  let modelsToTry: string[] = [];
  if (activeModels.length > 0) {
    modelsToTry = priorityOrder.filter((m) => activeModels.includes(m));
    for (const m of activeModels) {
      if (!modelsToTry.includes(m) && !m.includes("embedding") && !m.includes("aqa")) {
        modelsToTry.push(m);
      }
    }
  }

  if (modelsToTry.length === 0) {
    modelsToTry = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-flash-latest"];
  }

  let lastGoogleError = "";
  let rawResponseText = "";

  for (const model of modelsToTry) {
    // Attempt 1: with responseMimeType and responseSchema for guaranteed JSON
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
              responseSchema: {
                type: "OBJECT",
                properties: {
                  objectives: {
                    type: "ARRAY",
                    items: { type: "STRING" },
                  },
                  learningOutcomes: {
                    type: "ARRAY",
                    items: { type: "STRING" },
                  },
                },
                required: ["objectives", "learningOutcomes"],
              },
            },
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        rawResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        if (rawResponseText) break;
      } else {
        const errJson = await res.json().catch(() => null);
        const errMsg = errJson?.error?.message || `HTTP ${res.status}: ${res.statusText}`;
        lastGoogleError = errMsg;
      }
    } catch (e: any) {
      lastGoogleError = e?.message || "Network error contacting Google API";
    }

    // Attempt 2: standard generation without schema (fallback for older API endpoints)
    if (!rawResponseText) {
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
          rawResponseText = data2.candidates?.[0]?.content?.parts?.[0]?.text || "";
          if (rawResponseText) break;
        } else {
          const errJson2 = await res2.json().catch(() => null);
          lastGoogleError = errJson2?.error?.message || lastGoogleError;
        }
      } catch (e: any) {
        lastGoogleError = e?.message || lastGoogleError;
      }
    }
  }

  if (!rawResponseText) {
    return {
      success: false,
      error: lastGoogleError
        ? `Google Gemini Error: ${lastGoogleError}`
        : "Gemini API did not return a response. Please check your Google AI Studio API key.",
    };
  }

  // Robust Extractor: handles perfect JSON, imperfect JSON, or markdown bullet points
  const result = parseObjectivesAndOutcomes(rawResponseText);

  return {
    success: true,
    objectives: result.objectives,
    learningOutcomes: result.learningOutcomes,
  };
}

/**
 * Parses Gemini response text using multi-strategy extraction:
 * 1. Direct JSON parse
 * 2. Bracket-isolated JSON with trailing comma removal
 * 3. Bullet-point / line-by-line parsing
 */
function parseObjectivesAndOutcomes(rawText: string): { objectives: string[]; learningOutcomes: string[] } {
  // Strategy 1 & 2: JSON extraction
  try {
    let cleaned = rawText.trim();
    cleaned = cleaned.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();

    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1) {
      const candidate = cleaned.slice(firstBrace, lastBrace + 1);
      // Clean trailing commas before closing braces/brackets
      const sanitized = candidate.replace(/,\s*([}\]])/g, "$1");
      const parsed = JSON.parse(sanitized);

      const objs = Array.isArray(parsed.objectives)
        ? parsed.objectives.map((s: any) => String(s).trim()).filter(Boolean)
        : [];
      const outcomes = Array.isArray(parsed.learningOutcomes)
        ? parsed.learningOutcomes.map((s: any) => String(s).trim()).filter(Boolean)
        : [];

      if (objs.length > 0 && outcomes.length > 0) {
        return {
          objectives: objs.slice(0, 6),
          learningOutcomes: outcomes.slice(0, 6),
        };
      }
    }
  } catch (e) {
    // Fall through to bullet-point / line parser
  }

  // Strategy 3: Text line & bullet-point parser
  const lines = rawText.split("\n").map((l) => l.trim()).filter(Boolean);
  const extractedObjectives: string[] = [];
  const extractedOutcomes: string[] = [];

  let currentSection: "objectives" | "outcomes" | null = null;

  for (const line of lines) {
    const lower = line.toLowerCase();

    // Section headers
    if (lower.includes("objective") && !lower.startsWith("-") && !lower.startsWith("*") && !lower.startsWith("1")) {
      currentSection = "objectives";
      continue;
    }
    if ((lower.includes("outcome") || lower.includes("learning")) && !lower.startsWith("-") && !lower.startsWith("*") && !lower.startsWith("1")) {
      currentSection = "outcomes";
      continue;
    }

    // Clean bullet symbols: -, *, 1., 2), quotes
    const cleanedLine = line
      .replace(/^[\*\-\•\d+\.\)]\s*/, "")
      .replace(/^"(.*)"$/, "$1")
      .replace(/,\s*$/, "")
      .trim();

    // Filter out JSON wrapper lines
    if (
      cleanedLine.length > 8 &&
      !cleanedLine.startsWith("{") &&
      !cleanedLine.startsWith("}") &&
      !cleanedLine.includes('"objectives"') &&
      !cleanedLine.includes('"learningOutcomes"')
    ) {
      if (currentSection === "objectives" && extractedObjectives.length < 6) {
        extractedObjectives.push(cleanedLine);
      } else if (currentSection === "outcomes" && extractedOutcomes.length < 6) {
        extractedOutcomes.push(cleanedLine);
      } else if (!currentSection) {
        if (cleanedLine.toLowerCase().startsWith("to ") && extractedObjectives.length < 6) {
          extractedObjectives.push(cleanedLine);
        } else if (extractedOutcomes.length < 6) {
          extractedOutcomes.push(cleanedLine);
        }
      }
    }
  }

  // Fallback defaults if extraction was partial
  const fallbackObjectives = [
    "To understand the core architecture and fundamental principles of the application framework.",
    "To create modular, maintainable, and reusable user interface components.",
    "To implement responsive styling, navigation structures, and data handling workflows.",
    "To apply state management patterns for predictable and reactive data flow across views.",
    "To analyze application performance, debug edge cases, and ensure robust error boundaries.",
    "To evaluate full-stack integration and prepare production-ready artifacts for deployment."
  ];

  const fallbackOutcomes = [
    "Implement structured front-end components adhering to modern architectural paradigms.",
    "Develop interactive and accessible user interfaces with seamless navigation flow.",
    "Create reactive state pipelines to synchronize form controls and live data representations.",
    "Apply defensive input validation and asynchronous request management strategies.",
    "Integrate end-to-end component communication across disparate views and modules.",
    "Deploy robust full-stack solutions verifying user requirements and interface responsiveness."
  ];

  return {
    objectives: extractedObjectives.length >= 3 ? extractedObjectives : fallbackObjectives,
    learningOutcomes: extractedOutcomes.length >= 3 ? extractedOutcomes : fallbackOutcomes,
  };
}
