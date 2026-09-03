/**
 * Voice Assistant & Speech Synthesis Engine (Alexa-Style Female Voice + Web Speech STT)
 * Powered by Google Gemini AI & Web Speech API
 */

import { loadTasks } from "./taskAlarmStorage";

export interface VoiceAssistantState {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  response: string;
  error?: string;
}

class VoiceAssistantEngine {
  private synth: SpeechSynthesis | null = null;
  private recognition: any = null;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private isInitialized = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.synth = window.speechSynthesis || null;
      this.initSpeechRecognition();
      this.loadAlexaVoice();
    }
  }

  // Load and select high-definition female voice resembling Amazon Alexa
  public loadAlexaVoice(): SpeechSynthesisVoice | null {
    if (!this.synth) return null;

    const voices = this.synth.getVoices();
    if (voices.length === 0) return null;

    // Prioritized list of high-quality, friendly female English voices
    const preferredVoices = [
      "Google UK English Female",
      "Microsoft Jenny Online (Natural) - English (United States)",
      "Microsoft Aria Online (Natural) - English (United States)",
      "Microsoft Jenny - English (United States)",
      "Google US English",
      "Samantha",
      "Victoria",
      "Karen",
      "Moira",
      "Tessa",
      "Zira",
      "en-US-Neural2-F",
      "en-GB-Neural2-F",
    ];

    let match: SpeechSynthesisVoice | undefined;

    // 1. Check exact preferred names
    for (const name of preferredVoices) {
      match = voices.find(
        (v) => v.name.toLowerCase().includes(name.toLowerCase()) || v.name === name
      );
      if (match) break;
    }

    // 2. Fallback: Any English voice marked as female
    if (!match) {
      match = voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          (v.name.toLowerCase().includes("female") ||
            v.name.toLowerCase().includes("girl") ||
            v.name.toLowerCase().includes("woman") ||
            v.name.toLowerCase().includes("natural"))
      );
    }

    // 3. Fallback: First English voice
    if (!match) {
      match = voices.find((v) => v.lang.startsWith("en"));
    }

    this.selectedVoice = match || voices[0] || null;
    return this.selectedVoice;
  }

  // Initialize Speech-to-Text Recognition
  private initSpeechRecognition() {
    if (typeof window === "undefined") return;

    const SpeechRecognitionClass =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition ||
      null;

    if (SpeechRecognitionClass) {
      this.recognition = new SpeechRecognitionClass();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = "en-US";
    }
  }

  // Speak text with Alexa-style pitch and cadence
  public speakAlexaVoice(
    text: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (e: any) => void
  ): void {
    if (typeof window === "undefined" || !this.synth) {
      onEnd?.();
      return;
    }

    try {
      this.synth.cancel(); // Stop any pending speech

      const cleanText = text
        .replace(/[*#`_~]/g, "") // remove markdown syntax
        .replace(/https?:\/\/\S+/g, "link")
        .trim();

      if (!cleanText) {
        onEnd?.();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);

      // Re-query voice if null
      if (!this.selectedVoice) {
        this.loadAlexaVoice();
      }

      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }

      // Calibrated parameters for natural Alexa-like tone
      utterance.pitch = 1.15; // Slightly higher, youthful, upbeat female pitch
      utterance.rate = 1.02;  // Fluent, natural speaking tempo
      utterance.volume = 1.0;

      utterance.onstart = () => {
        onStart?.();
      };

      utterance.onend = () => {
        onEnd?.();
      };

      utterance.onerror = (e) => {
        console.warn("TTS Error:", e);
        onEnd?.();
        onError?.(e);
      };

      this.synth.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis failed:", e);
      onEnd?.();
    }
  }

  // Stop speaking
  public stopSpeaking(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  // Start Voice Recognition
  public startListening(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError?: (err: string) => void,
    onEnd?: () => void
  ): boolean {
    if (!this.recognition) {
      this.initSpeechRecognition();
    }

    if (!this.recognition) {
      onError?.("Speech recognition is not supported in this browser.");
      return false;
    }

    try {
      this.recognition.onresult = (event: any) => {
        let interim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        const currentText = final || interim;
        onResult(currentText, !!final);
      };

      this.recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        onError?.(event.error || "Speech recognition error");
      };

      this.recognition.onend = () => {
        onEnd?.();
      };

      this.recognition.start();
      return true;
    } catch (e: any) {
      console.warn("Recognition start error:", e);
      onError?.(e.message || "Failed to start microphone");
      return false;
    }
  }

  // Stop Voice Recognition
  public stopListening(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {}
    }
  }

  // Query Google Gemini AI with conversational student context
  public async queryGeminiVoiceAssistant(userQuery: string): Promise<string> {
    if (typeof window === "undefined") return "I am ready to help with your studies.";

    // 1. Retrieve stored Gemini API Key
    let apiKey = "";
    try {
      apiKey = localStorage.getItem("stash_gemini_api_key") || "";
    } catch {}

    // 2. Gather student academic context (tasks, deadlines, courses)
    const tasks = loadTasks();
    const pendingTasks = tasks.filter((t) => t.status === "pending" || t.status === "snoozed");
    const taskSummary = pendingTasks
      .slice(0, 5)
      .map((t) => `${t.title} (${t.category}, due ${t.dueDate} at ${t.dueTime}, priority: ${t.priority})`)
      .join("; ");

    const systemInstruction = `
You are the voice assistant for Stash Academic Portal, named "Stash".
You speak like Amazon Alexa: friendly, concise, intelligent, encouraging, and articulate.
Your responses will be read aloud via Text-to-Speech, so:
- Keep your answers between 1 to 3 short sentences (max 40 words).
- Speak naturally with no markdown bullet points, stars, or code blocks.
- Answer academic questions, help with deadlines, or give brief explanations.
- Student's current active tasks: ${taskSummary || "No upcoming deadlines right now."}
`.trim();

    if (!apiKey) {
      // Fallback response if no custom key is provided
      const lower = userQuery.toLowerCase();
      if (lower.includes("task") || lower.includes("deadline") || lower.includes("alarm") || lower.includes("schedule")) {
        if (pendingTasks.length > 0) {
          const next = pendingTasks[0];
          return `You have ${pendingTasks.length} active tasks. Your next priority is ${next.title} scheduled for ${next.dueTime}.`;
        }
        return "You have no upcoming deadlines scheduled right now! You're all caught up.";
      }
      if (lower.includes("hello") || lower.includes("hi") || lower.includes("who are you")) {
        return "Hello! I am Stash, your academic voice assistant. How can I help with your studies today?";
      }
      return `I heard you ask: "${userQuery}". To enable full conversational AI, please save your Gemini API key in Student Profile.`;
    }

    // Call Gemini API
    const models = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-flash-latest"];
    for (const model of models) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    { text: systemInstruction },
                    { text: `Student says: "${userQuery}"` },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 150,
              },
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return text.trim();
          }
        }
      } catch (e) {
        console.warn(`Gemini model ${model} voice error:`, e);
      }
    }

    return "I am having trouble connecting to Gemini AI right now, but I am still monitoring your scheduled alarms.";
  }
}

export const voiceAssistant = new VoiceAssistantEngine();
