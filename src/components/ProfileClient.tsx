"use client";

import React, { useState, useEffect } from "react";
import { completeRegistration, saveUserGeminiApiKey } from "@/app/actions/register";
import {
  User,
  CreditCard,
  GraduationCap,
  Mail,
  CheckCircle2,
  Calendar,
  Save,
  Loader2,
  Copy,
  Check,
  Building2,
  ShieldCheck,
  Key,
  Eye,
  EyeOff,
  ExternalLink,
  Sparkles,
  Trash2,
  Smartphone,
  Download,
  RefreshCw,
  Mic,
  Volume2,
  Lock,
  AlarmClock,
  Music,
} from "lucide-react";
import { CURRENT_APP_VERSION, GITHUB_RELEASES_URL } from "@/lib/appVersion";
import { getAlarmAckMode, setAlarmAckMode, AlarmAckMode, getDefaultAlarmTone, setDefaultAlarmTone } from "@/lib/taskAlarmStorage";
import { voiceAssistant, VOICE_PERSONA_OPTIONS, VoicePersona } from "@/lib/voiceAssistantEngine";
import { ALARM_TONE_OPTIONS } from "@/lib/alarmAudioEngine";
import { AlarmSoundPickerModal } from "./AlarmSoundPickerModal";
import { HapticEngine } from "@/lib/hapticEngine";

interface ProfileClientProps {
  initialUser: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  studentDetails: {
    branch: string;
    yearOfStudy: string;
    uidNumber: string;
  };
  initialGeminiKey?: string;
}

const BRANCH_OPTIONS = [
  "Computer Science & Engineering",
  "Information Technology",
  "AI & Data Science",
  "Electronics & Communication",
  "Electrical & Electronics",
  "Mechanical Engineering",
  "Civil Engineering",
  "Mathematics & Computing",
  "Biotechnology",
  "Business & Management",
  "Other / Multidisciplinary",
];

const YEAR_OPTIONS = ["I", "II", "III", "IV", "V"];

export function ProfileClient({ initialUser, studentDetails, initialGeminiKey = "" }: ProfileClientProps) {
  const [name, setName] = useState(initialUser.name || "");
  const [branch, setBranch] = useState(studentDetails.branch);
  const [yearOfStudy, setYearOfStudy] = useState(studentDetails.yearOfStudy);
  const [uidNumber, setUidNumber] = useState(studentDetails.uidNumber);
  
  // Gemini API Key State
  const [geminiKey, setGeminiKey] = useState(initialGeminiKey);
  const [showKey, setShowKey] = useState(false);
  const [keySaved, setKeySaved] = useState(false);
  const [keyRemoved, setKeyRemoved] = useState(false);

  // Alarm Acknowledgment Mode State
  const [ackMode, setAckModeState] = useState<AlarmAckMode>("type_only");
  const [ackSaved, setAckSaved] = useState(false);

  // Voice Persona State
  const [selectedPersona, setSelectedPersona] = useState<VoicePersona>("alexa_us");
  const [selectedTone, setSelectedTone] = useState("samsung_horizon");
  const [isSoundPickerOpen, setIsSoundPickerOpen] = useState(false);
  const [isPlayingVoicePreview, setIsPlayingVoicePreview] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copiedUid, setCopiedUid] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load once on mount
  useEffect(() => {
    if (!initialGeminiKey) {
      const saved = localStorage.getItem("stash_gemini_api_key");
      if (saved) setGeminiKey(saved);
    }
    setAckModeState(getAlarmAckMode());
    setSelectedPersona(voiceAssistant.getSavedPersona());
    setSelectedTone(getDefaultAlarmTone());
  }, []);

  const handleSelectAckMode = (mode: AlarmAckMode) => {
    HapticEngine.trigger("selection");
    setAckModeState(mode);
    setAlarmAckMode(mode);
    setAckSaved(true);
    setTimeout(() => setAckSaved(false), 2000);
  };

  const handleSelectPersona = (persona: VoicePersona) => {
    HapticEngine.trigger("selection");
    setSelectedPersona(persona);
    voiceAssistant.setPersona(persona);
    voiceAssistant.speakAlexaVoice(`Voice updated to ${VOICE_PERSONA_OPTIONS.find(p => p.id === persona)?.name}. How can I assist you?`);
  };

  const handleTestAlexaVoice = () => {
    HapticEngine.trigger("medium");
    setIsPlayingVoicePreview(true);
    const persona = VOICE_PERSONA_OPTIONS.find((p) => p.id === selectedPersona) || VOICE_PERSONA_OPTIONS[0];
    const previewMessage = `Hello ${name || "Student"}! I am your ${persona.name}. I am ready to announce your wake-up alarms with 60 distinct ringtones.`;
    voiceAssistant.speakAlexaVoice(
      previewMessage,
      () => setIsPlayingVoicePreview(true),
      () => setIsPlayingVoicePreview(false)
    );
  };

  const handleRemoveApiKey = async () => {
    setGeminiKey("");
    localStorage.removeItem("stash_gemini_api_key");
    document.cookie = "stash_gemini_key=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    
    try {
      await saveUserGeminiApiKey("");
    } catch (e) {
      console.warn("DB remove key error:", e);
    }

    setKeyRemoved(true);
    setTimeout(() => setKeyRemoved(false), 2500);
  };

  const handleSaveApiKey = async () => {
    if (!geminiKey.trim()) {
      await handleRemoveApiKey();
      return;
    }

    localStorage.setItem("stash_gemini_api_key", geminiKey.trim());
    document.cookie = `stash_gemini_key=${encodeURIComponent(geminiKey.trim())}; path=/; max-age=31536000; SameSite=Lax`;
    
    try {
      await saveUserGeminiApiKey(geminiKey.trim());
    } catch (e) {
      console.warn("DB save warning:", e);
    }

    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2500);
  };

  const handleCopyUid = () => {
    navigator.clipboard.writeText(uidNumber);
    setCopiedUid(true);
    setTimeout(() => setCopiedUid(false), 2000);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await completeRegistration({
        name,
        branch,
        yearOfStudy,
        uidNumber,
      });

      if (res.success) {
        setMessage({ type: "success", text: "Profile details updated successfully!" });
        setIsEditing(false);
      } else {
        setMessage({ type: "error", text: res.error || "Failed to update profile." });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "An unexpected error occurred." });
    } finally {
      setLoading(false);
    }
  };

  const currentToneMatch = ALARM_TONE_OPTIONS.find((t) => t.id === selectedTone) || ALARM_TONE_OPTIONS[0];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black text-white font-display tracking-tight">
          Student Profile &amp; Preferences
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your verified academic credentials, 60+ alarm sounds, disarm challenges, and voice assistant settings.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl text-xs font-mono border flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-rose-500/10 border-rose-500/30 text-rose-400"
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      {/* Grid: Left ID Card Preview & Right Detailed Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Academic Student ID Card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="fused-card border-prismatic rounded-3xl p-6 relative overflow-hidden space-y-6">
            
            {/* Header Badge */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-widest text-purple-300 uppercase px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30">
                STASH ✳︎ STUDENT ID
              </span>
              <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified
              </span>
            </div>

            {/* Profile Avatar & Name */}
            <div className="flex flex-col items-center text-center space-y-3 pt-2">
              {initialUser.image ? (
                <img
                  src={initialUser.image}
                  alt={name || "Student"}
                  className="w-20 h-20 rounded-full border-2 border-purple-500/40 object-cover shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-2xl font-black text-white shadow-lg">
                  {name ? name.charAt(0) : "S"}
                </div>
              )}
              <div>
                <h2 className="text-lg font-black text-white font-display tracking-tight">
                  {name || "Student"}
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{initialUser.email}</p>
              </div>
            </div>

            {/* Academic Badges */}
            <div className="space-y-2 pt-2 border-t border-white/10 text-xs font-mono">
              <div className="flex items-center justify-between py-1.5 px-3 rounded-xl bg-black/40 border border-white/5">
                <span className="text-slate-400">UID:</span>
                <span className="font-bold text-purple-300 font-mono">{uidNumber}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 px-3 rounded-xl bg-black/40 border border-white/5">
                <span className="text-slate-400">Branch:</span>
                <span className="font-bold text-white text-right truncate max-w-[140px]">{branch}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 px-3 rounded-xl bg-black/40 border border-white/5">
                <span className="text-slate-400">Year:</span>
                <span className="font-bold text-cyan-300">Year {yearOfStudy}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Academic Enrollment Credentials */}
          <div className="fused-card rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-white font-display">Academic Enrollment</h3>
                <p className="text-xs text-slate-400">University department &amp; UID number details</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-200 text-black font-bold text-xs transition shadow-sm cursor-pointer"
              >
                {isEditing ? "Cancel" : "Edit Credentials"}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-purple-400 transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                      Engineering Branch
                    </label>
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-purple-400 transition"
                    >
                      {BRANCH_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                      Year of Study
                    </label>
                    <select
                      value={yearOfStudy}
                      onChange={(e) => setYearOfStudy(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-purple-400 transition"
                    >
                      {YEAR_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          Year {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    University Roll / UID Number
                  </label>
                  <input
                    type="text"
                    required
                    value={uidNumber}
                    onChange={(e) => setUidNumber(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-purple-400 transition uppercase"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-black font-bold text-xs transition shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin text-black" />}
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Student UID Number
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold font-mono text-white">{uidNumber}</span>
                    <button
                      type="button"
                      onClick={handleCopyUid}
                      className="text-xs text-purple-400 hover:text-purple-300 font-mono flex items-center gap-1"
                    >
                      {copiedUid ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedUid ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Branch / Department
                  </span>
                  <span className="text-sm font-bold text-white block truncate">{branch}</span>
                </div>
              </div>
            )}
          </div>

          {/* 2. 60+ Alarm Sounds Library & Default Tone */}
          <div className="fused-card rounded-3xl p-6 sm:p-8 space-y-5 border border-purple-500/20">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
                  <Music className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    60+ Alarm Sounds Library
                  </h3>
                  <p className="text-xs text-slate-400">
                    Samsung, Xiaomi HyperOS, Apple, Sirens, Marimba &amp; Zen
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  HapticEngine.trigger("medium");
                  setIsSoundPickerOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-200 text-black font-bold text-xs transition shadow-sm cursor-pointer"
              >
                Browse All 60 Sounds
              </button>
            </div>

            {/* Current Default Tone Preview Card */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{currentToneMatch.iconText}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white font-display">
                      Default Tone: {currentToneMatch.name}
                    </span>
                    <span className="px-2 py-0.2 rounded-full bg-purple-500/20 text-purple-300 text-[9px] font-mono uppercase font-bold">
                      {currentToneMatch.category}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                    {currentToneMatch.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  HapticEngine.trigger("medium");
                  setIsSoundPickerOpen(true);
                }}
                className="text-xs text-purple-400 hover:text-purple-300 font-mono font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Change &rarr;</span>
              </button>
            </div>
          </div>

          {/* 3. Alarm Acknowledgment & Disarm Customization */}
          <div className="fused-card rounded-3xl p-6 sm:p-8 space-y-5 border border-rose-500/20">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <AlarmClock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    Alarm Acknowledgment Customization
                  </h3>
                  <p className="text-xs text-slate-400">
                    Choose what verification is required to turn off your wake-up alarms.
                  </p>
                </div>
              </div>
              {ackSaved && (
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold">
                  Saved ✓
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSelectAckMode("type_only")}
                className={`p-4 rounded-2xl border text-left transition active:scale-[0.98] cursor-pointer space-y-1.5 ${
                  ackMode === "type_only"
                    ? "bg-purple-500/15 border-purple-500 ring-2 ring-purple-500/30 shadow-lg"
                    : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-display">
                    📝 Type Phrase Only
                  </span>
                  {ackMode === "type_only" && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed font-mono">
                  You must type the exact challenge phrase to unlock the turn-off button.
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleSelectAckMode("voice_only")}
                className={`p-4 rounded-2xl border text-left transition active:scale-[0.98] cursor-pointer space-y-1.5 ${
                  ackMode === "voice_only"
                    ? "bg-cyan-500/15 border-cyan-500 ring-2 ring-cyan-500/30 shadow-lg"
                    : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-display">
                    🎙️ Voice Confirmation
                  </span>
                  {ackMode === "voice_only" && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed font-mono">
                  Speak into the microphone ("I am awake") to verify and disarm the alarm.
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleSelectAckMode("both")}
                className={`p-4 rounded-2xl border text-left transition active:scale-[0.98] cursor-pointer space-y-1.5 ${
                  ackMode === "both"
                    ? "bg-rose-500/15 border-rose-500 ring-2 ring-rose-500/30 shadow-lg"
                    : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-display">
                    🔐 Both (Max Urgency)
                  </span>
                  {ackMode === "both" && <CheckCircle2 className="w-4 h-4 text-rose-400" />}
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed font-mono">
                  Mandatory both: You must type the phrase AND speak the voice confirmation.
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleSelectAckMode("neither")}
                className={`p-4 rounded-2xl border text-left transition active:scale-[0.98] cursor-pointer space-y-1.5 ${
                  ackMode === "neither"
                    ? "bg-emerald-500/15 border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg"
                    : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-display">
                    ⚡ Neither (1-Tap Turn Off)
                  </span>
                  {ackMode === "neither" && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed font-mono">
                  Standard alarm behavior: Turns off immediately with 1 tap on the dismiss button.
                </p>
              </button>
            </div>
          </div>

          {/* 4. Multiple Alexa Voice Personas & Gemini Key */}
          <div className="fused-card rounded-3xl p-6 sm:p-8 space-y-5 border border-cyan-500/20">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    Voice Assistant Persona
                  </h3>
                  <p className="text-xs text-slate-400">
                    Choose your AI assistant vocal tone and accent
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleTestAlexaVoice}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold transition cursor-pointer active:scale-95"
              >
                <Volume2 className={`w-3.5 h-3.5 ${isPlayingVoicePreview ? "animate-pulse text-cyan-400" : ""}`} />
                <span>{isPlayingVoicePreview ? "Speaking..." : "Preview Voice"}</span>
              </button>
            </div>

            {/* Persona Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {VOICE_PERSONA_OPTIONS.map((persona) => {
                const isSelected = selectedPersona === persona.id;
                return (
                  <button
                    key={persona.id}
                    type="button"
                    onClick={() => handleSelectPersona(persona.id)}
                    className={`p-3.5 rounded-2xl border text-left transition active:scale-95 cursor-pointer space-y-1 ${
                      isSelected
                        ? "bg-cyan-500/15 border-cyan-500 ring-2 ring-cyan-500/30 shadow-md"
                        : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>{persona.iconText}</span>
                        <span className="text-xs font-bold text-white font-display">
                          {persona.name}
                        </span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <p className="text-[10px] font-mono text-neutral-400">
                      {persona.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Gemini Key Config */}
            <div className="space-y-3 pt-3 border-t border-white/10">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-purple-400" />
                    <span>Google Gemini API Key</span>
                  </div>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] font-mono text-purple-400 hover:underline flex items-center gap-1"
                  >
                    <span>Get Free Key</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </label>

                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-black/60 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-purple-400 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition p-1"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                {geminiKey && (
                  <button
                    type="button"
                    onClick={handleRemoveApiKey}
                    className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{keyRemoved ? "Removed!" : "Remove Key"}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSaveApiKey}
                  className="px-5 py-2 rounded-xl bg-white hover:bg-slate-200 text-black text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
                >
                  {keySaved ? <Check className="w-4 h-4 text-emerald-600" /> : <Save className="w-4 h-4 text-black" />}
                  <span>{keySaved ? "Saved!" : "Save Gemini Key"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 5. Software Version & Updates */}
          <div className="p-6 rounded-3xl bg-neutral-900/50 border border-neutral-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">App Version &amp; Updates</h3>
                  <p className="text-[11px] font-mono text-neutral-400">
                    Stash Academic Software Manager
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>v{CURRENT_APP_VERSION} Installed</span>
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <a
                href={GITHUB_RELEASES_URL}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-neutral-400 hover:text-white font-mono flex items-center gap-1.5 transition"
              >
                <span>View Release Notes on GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("stash_check_updates"))}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
                <span>Check for Updates</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* 60+ Sounds Picker Modal */}
      <AlarmSoundPickerModal
        isOpen={isSoundPickerOpen}
        selectedTone={selectedTone}
        onSelect={(t) => {
          setSelectedTone(t);
          setDefaultAlarmTone(t);
        }}
        onClose={() => setIsSoundPickerOpen(false)}
      />

    </div>
  );
}
