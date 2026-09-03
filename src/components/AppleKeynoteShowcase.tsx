"use client";

import React, { useState } from "react";
import {
  FolderArchive,
  FileText,
  Cpu,
  Share2,
  Copy,
  Check,
  Code2,
  Sparkles,
  Zap,
  Lock,
  Globe,
  Database,
  ArrowRight,
  Shield,
  Layers,
  Volume2,
  Mic,
  Music,
  AlarmClock,
} from "lucide-react";
import { alarmAudio, ALARM_TONE_OPTIONS } from "@/lib/alarmAudioEngine";
import { voiceAssistant } from "@/lib/voiceAssistantEngine";
import { HapticEngine } from "@/lib/hapticEngine";

export function AppleKeynoteShowcase() {
  const [activeTab, setActiveTab] = useState<"vault" | "notes" | "alarms" | "architecture">("alarms");
  const [copiedLink, setCopiedLink] = useState(false);
  const [playingTone, setPlayingTone] = useState<string | null>(null);
  const [isSpeakingPreview, setIsSpeakingPreview] = useState(false);
  const [typedFormula, setTypedFormula] = useState(
    "\\sum_{k=1}^{n} k^2 = \\frac{n(n+1)(2n+1)}{6}"
  );

  const handleCopy = () => {
    navigator.clipboard.writeText("https://stash-academic.vercel.app/vault/share/algorithms-pro-pack");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePreviewTone = (toneId: string) => {
    if (playingTone === toneId) {
      alarmAudio.stopAlarm();
      setPlayingTone(null);
    } else {
      HapticEngine.trigger("selection");
      alarmAudio.startAlarm(toneId, 8);
      setPlayingTone(toneId);
    }
  };

  const handleTestAlexa = () => {
    HapticEngine.trigger("medium");
    setIsSpeakingPreview(true);
    voiceAssistant.speakAlexaVoice(
      "Hello! Welcome to Stash Academic Portal. I am your Alexa voice assistant. I can announce your wake-up alarms and guide your studies.",
      () => setIsSpeakingPreview(true),
      () => setIsSpeakingPreview(false)
    );
  };

  return (
    <section id="showcase" className="py-24 relative overflow-hidden">
      {/* Radiant Prismatic Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-y-1/2 w-[600px] h-[350px] bg-rose-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-[600px] h-[350px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-purple-500/30 text-xs font-mono tracking-widest uppercase text-purple-300 backdrop-blur-xl">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Designed for Peak Academic Performance
          </div>
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Power in every pixel. <span className="text-holographic">Pure precision.</span>
          </h2>
          <p className="text-slate-400 text-lg sm:text-xl font-normal leading-relaxed">
            The simplicity of Apple design fused with Alexa voice intelligence, 60+ alarm sounds, and edge performance.
          </p>
        </div>

        {/* Fused macOS Interactive Window */}
        <div className="fused-card border-prismatic rounded-3xl overflow-hidden shadow-2xl">
          
          {/* macOS Title Bar */}
          <div className="h-12 bg-slate-950/90 border-b border-white/10 px-4 flex items-center justify-between backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
              <span className="text-xs text-slate-400 font-mono ml-2 hidden sm:inline-block">
                stash-academic.app &bull; Pro Workspace
              </span>
            </div>

            {/* Apple Segmented Switcher */}
            <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10 text-xs overflow-x-auto">
              <button
                onClick={() => setActiveTab("alarms")}
                className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === "alarms"
                    ? "bg-white text-black shadow-md font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Voice &amp; 60+ Alarms</span>
              </button>
              <button
                onClick={() => setActiveTab("vault")}
                className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === "vault"
                    ? "bg-white text-black shadow-md font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <FolderArchive className="w-3.5 h-3.5" />
                <span>Vault</span>
              </button>
              <button
                onClick={() => setActiveTab("notes")}
                className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === "notes"
                    ? "bg-white text-black shadow-md font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Notes &amp; Math</span>
              </button>
              <button
                onClick={() => setActiveTab("architecture")}
                className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === "architecture"
                    ? "bg-white text-black shadow-md font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Edge Engine</span>
              </button>
            </div>

            <div className="w-20 hidden sm:flex items-center justify-end gap-1.5 font-mono text-[10px] text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE
            </div>
          </div>

          {/* Interactive Window Body */}
          <div className="p-6 sm:p-10 min-h-[380px] flex flex-col justify-center">
            
            {/* Tab: Voice & 60+ Alarms Showcase (NEW) */}
            {activeTab === "alarms" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                      <span>Alexa Voice &amp; 60+ Alarm Sounds</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-mono font-bold">
                        v2.1.0 Feature
                      </span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                      Test Samsung, Xiaomi, and emergency sirens right in your browser with zero latency.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleTestAlexa}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-500 text-white font-semibold text-xs transition hover:opacity-90 active:scale-95 cursor-pointer shadow-md"
                    >
                      <Mic className="w-3.5 h-3.5 text-white animate-pulse" />
                      <span>{isSpeakingPreview ? "Alexa Speaking..." : "Test Alexa Voice"}</span>
                    </button>
                    <button
                      onClick={() => window.dispatchEvent(new CustomEvent("stash_open_voice_assistant"))}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black font-semibold text-xs transition hover:bg-slate-200 active:scale-95 cursor-pointer shadow-md"
                    >
                      <span>Open Voice Assistant &rarr;</span>
                    </button>
                  </div>
                </div>

                {/* Popular Sound Previews */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {[
                    { id: "samsung_horizon", name: "Samsung Horizon", icon: "🌌", category: "Samsung" },
                    { id: "xiaomi_fireflies", name: "Xiaomi Fireflies", icon: "✨", category: "Xiaomi" },
                    { id: "ios_radar", name: "Apple Radar", icon: "📡", category: "Apple" },
                    { id: "nuclear_siren", name: "Nuclear Siren", icon: "☢️", category: "Extreme" },
                    { id: "air_horn", name: "Air Horn", icon: "📢", category: "Extreme" },
                    { id: "church_bells", name: "Westminster Big Ben", icon: "🕰️", category: "Melodic" },
                  ].map((s) => {
                    const isPlaying = playingTone === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handlePreviewTone(s.id)}
                        className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between gap-2 active:scale-95 cursor-pointer ${
                          isPlaying
                            ? "bg-purple-500/20 border-purple-500 ring-2 ring-purple-500/40"
                            : "bg-black/60 hover:bg-black/80 border-white/10 hover:border-purple-500/40"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">{s.icon}</span>
                          <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? "text-purple-400 animate-pulse" : "text-neutral-500"}`} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white leading-tight truncate">{s.name}</p>
                          <span className="text-[10px] font-mono text-purple-400 uppercase font-bold">{s.category}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Info Badges */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-slate-300">1.5+ Min DND Wake-Up Alarms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-slate-300">Spoken Task Reminders by Alexa</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                    <span className="text-slate-300">Type &amp; Voice Disarm Verification</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 1: Interactive Vault */}
            {activeTab === "vault" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Instant Cloud File Vault
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400">
                      Drag, drop, and distribute course slides and problem sets with zero friction.
                    </p>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black font-semibold text-xs transition hover:bg-slate-200 active:scale-95 cursor-pointer shadow-md"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5 text-black" />}
                    <span>{copiedLink ? "Link Copied to Clipboard" : "Copy Test Share Link"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-black/60 border border-white/10 hover:border-cyan-500/50 rounded-2xl p-5 space-y-3 transition group">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-mono text-[10px] font-bold">
                        CS 301
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">4.8 MB</span>
                    </div>
                    <h4 className="font-semibold text-sm text-white leading-snug group-hover:text-cyan-300 transition">
                      Advanced Algorithms & Dynamic Trees.pdf
                    </h4>
                    <p className="text-xs text-slate-400">Uploaded by Verified Contributor</p>
                  </div>

                  <div className="bg-black/60 border border-white/10 hover:border-purple-500/50 rounded-2xl p-5 space-y-3 transition group">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/30 font-mono text-[10px] font-bold">
                        CS 305
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">2.1 MB</span>
                    </div>
                    <h4 className="font-semibold text-sm text-white leading-snug group-hover:text-purple-300 transition">
                      Relational Database Query Optimization.docx
                    </h4>
                    <p className="text-xs text-slate-400">Uploaded by Verified Contributor</p>
                  </div>

                  <div className="bg-black/60 border border-white/10 hover:border-rose-500/50 rounded-2xl p-5 space-y-3 transition group">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/30 font-mono text-[10px] font-bold">
                        MATH 202
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">3.4 MB</span>
                    </div>
                    <h4 className="font-semibold text-sm text-white leading-snug group-hover:text-rose-300 transition">
                      Eigenvalues & Matrix Spectral Theorem.pdf
                    </h4>
                    <p className="text-xs text-slate-400">Uploaded by Verified Contributor</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Notes & LaTeX Engine */}
            {activeTab === "notes" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
                      Interactive LaTeX Formula Input
                    </label>
                    <textarea
                      rows={5}
                      value={typedFormula}
                      onChange={(e) => setTypedFormula(e.target.value)}
                      className="w-full bg-black/80 border border-white/10 rounded-2xl p-4 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
                      Live High-Fidelity Rendering
                    </label>
                    <div className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 flex items-center justify-center min-h-[120px]">
                      <span className="font-mono text-base text-yellow-300">
                        {typedFormula}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Architecture & Security */}
            {activeTab === "architecture" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                      <Zap className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-white">Edge Accelerated</h4>
                    <p className="text-xs text-slate-400">Global low-latency delivery on Next.js Turbopack.</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                      <Shield className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-white">Encrypted Storage</h4>
                    <p className="text-xs text-slate-400">OWASP MASVS Hardened with TLS 1.3 encryption.</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Globe className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-white">Cross-Platform Sync</h4>
                    <p className="text-xs text-slate-400">Seamless synchronization between Android and Web.</p>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
