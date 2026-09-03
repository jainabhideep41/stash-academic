/**
 * Voice Assistant & Speech Synthesis Engine with Multiple Voice Personas
 * Alexa US, Alexa British, Alexa Aussie, Calm Morning, and Drill Commander
 * Powered by Google Gemini AI & Web Speech API
 */

import { loadTasks } from "./taskAlarmStorage";

export type VoicePersona =
  | "alexa_us"
  | "alexa_uk"
  | "alexa_au"
  | "alexa_calm"
  | "alexa_drill";

export interface VoicePersonaInfo {
  id: VoicePersona;
  name: string;
  accent: string;
  description: string;
  iconText: string;
  pitch: number;
  rate: number;
}

export const VOICE_PERSONA_OPTIONS: VoicePersonaInfo[] = [
  {
    id: "alexa_us",
    name: "Amazon Alexa (US)",
    accent: "US English",
    description: "Warm, clear, and articulate energetic assistant",
    iconText: "🎙️",
    pitch: 1.15,
    rate: 1.02,
  },
  {
    id: "alexa_uk",
    name: "Alexa British (UK)",
    accent: "UK English",
    description: "Crisp, polite, and refined academic tone",
    iconText: "🇬🇧",
    pitch: 1.1,
    rate: 1.0,
  },
  {
    id: "alexa_au",
    name: "Alexa Aussie (AU)",
    accent: "Australian",
    description: "Friendly, upbeat, and motivating voice",
    iconText: "🦘",
    pitch: 1.18,
    rate: 1.05,
  },
  {
    id: "alexa_calm",
    name: "Calm Morning Wake",
    accent: "Gentle",
    description: "Soothing, peaceful, and soft-spoken wake-up",
    iconText: "🌅",
    pitch: 0.95,
    rate: 0.9,
  },
  {
    id: "alexa_drill",
    name: "Drill Sergeant Alarm",
    accent: "High Urgency",
    description: "Fast, loud, commanding wake-up alert",
    iconText: "🎖️",
    pitch: 1.25,
    rate: 1.2,
  },
];

const VOICE_PERSONA_KEY = "stash_selected_voice_persona";

class VoiceAssistantEngine {
  private synth: SpeechSynthesis | null = null;
  private recognition: any = null;
  private currentPersona: VoicePersona = "alexa_us";

  constructor() {
    if (typeof window !== "undefined") {
      this.synth = window.speechSynthesis || null;
      this.initSpeechRecognition();
      this.loadSavedPersona();
    }
  }

  public getSavedPersona(): VoicePersona {
    if (typeof window === "undefined") return "alexa_us";
    try {
      const saved = localStorage.getItem(VOICE_PERSONA_KEY) as VoicePersona;
      if (saved && VOICE_PERSONA_OPTIONS.some((p) => p.id === saved)) {
        return saved;
      }
    } catch {}
    return "alexa_us";
  }

  public setPersona(persona: VoicePersona): void {
    this.currentPersona = persona;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(VOICE_PERSONA_KEY, persona);
        window.dispatchEvent(
          new CustomEvent("stash_voice_persona_updated", { detail: persona })
        );
      } catch {}
    }
  }

  private loadSavedPersona() {
    this.currentPersona = this.getSavedPersona();
  }

  // Find matching synthesis voice based on persona accent
  private matchVoiceForPersona(persona: VoicePersona): SpeechSynthesisVoice | null {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    if (voices.length === 0) return null;

    let targetLang = "en-US";
    let preferredNames: string[] = [];

    switch (persona) {
      case "alexa_uk":
        targetLang = "en-GB";
        preferredNames = [
          "Google UK English Female",
          "Microsoft Libby Online (Natural)",
          "Microsoft Sonia Online (Natural)",
          "Victoria",
          "en-GB",
        ];
        break;
      case "alexa_au":
        targetLang = "en-AU";
        preferredNames = [
          "Google Australian English Female",
          "Microsoft Natasha Online (Natural)",
          "Karen",
          "en-AU",
        ];
        break;
      case "alexa_calm":
        preferredNames = [
          "Microsoft Jenny Online (Natural)",
          "Samantha",
          "Google US English",
        ];
        break;
      case "alexa_drill":
        preferredNames = [
          "Google UK English Female",
          "Microsoft Aria Online (Natural)",
          "Zira",
        ];
        break;
      case "alexa_us":
      default:
        preferredNames = [
          "Google UK English Female",
          "Microsoft Jenny Online (Natural)",
          "Microsoft Aria Online (Natural)",
          "Google US English",
          "Samantha",
          "Victoria",
          "Zira",
        ];
        break;
    }

    // 1. Check exact name matches
    for (const name of preferredNames) {
      const match = voices.find((v) =>
        v.name.toLowerCase().includes(name.toLowerCase())
      );
      if (match) return match;
    }

    // 2. Check language match
    const langMatch = voices.find(
      (v) =>
        v.lang.toLowerCase().startsWith(targetLang.toLowerCase()) &&
        (v.name.toLowerCase().includes("female") ||
          v.name.toLowerCase().includes("natural") ||
          v.name.toLowerCase().includes("girl"))
    );
    if (langMatch) return langMatch;

    // 3. Fallback: Any English voice
    return voices.find((v) => v.lang.startsWith("en")) || voices[0] || null;
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

  // Speak text with the selected voice persona parameters
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
      this.synth.cancel();

      const cleanText = text
        .replace(/[*#`_~]/g, "")
        .replace(/https?:\/\/\S+/g, "link")
        .trim();

      if (!cleanText) {
        onEnd?.();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      const personaInfo =
        VOICE_PERSONA_OPTIONS.find((p) => p.id === this.currentPersona) ||
        VOICE_PERSONA_OPTIONS[0];

      const voice = this.matchVoiceForPersona(this.currentPersona);
      if (voice) {
        utterance.voice = voice;
      }

      utterance.pitch = personaInfo.pitch;
      utterance.rate = personaInfo.rate;
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

    let apiKey = "";
    try {
      apiKey = localStorage.getItem("stash_gemini_api_key") || "";
    } catch {}

    const tasks = loadTasks();
    const pendingTasks = tasks.filter((t) => t.status === "pending" || t.status === "snoozed");
    const taskSummary = pendingTasks
      .slice(0, 5)
      .map((t) => `${t.title} (${t.category}, due ${t.dueDate} at ${t.dueTime}, priority: ${t.priority})`)
      .join("; ");

    const personaInfo =
      VOICE_PERSONA_OPTIONS.find((p) => p.id === this.currentPersona) ||
      VOICE_PERSONA_OPTIONS[0];

    const systemInstruction = `
You are the voice assistant for Stash Academic Portal, speaking with the personality: "${personaInfo.name}" (${personaInfo.description}).
Keep your responses between 1 to 3 short sentences (max 40 words), perfectly formatted for voice output.
Do not use markdown formatting, bullets, asterisks, or code blocks.
Student's current active tasks: ${taskSummary || "No upcoming deadlines right now."}
`.trim();

    if (!apiKey) {
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
