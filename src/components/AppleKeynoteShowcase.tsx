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
} from "lucide-react";

export function AppleKeynoteShowcase() {
  const [activeTab, setActiveTab] = useState<"vault" | "notes" | "architecture">("vault");
  const [copiedLink, setCopiedLink] = useState(false);
  const [typedFormula, setTypedFormula] = useState(
    "\\sum_{k=1}^{n} k^2 = \\frac{n(n+1)(2n+1)}{6}"
  );

  const handleCopy = () => {
    navigator.clipboard.writeText("https://stash-academic.vercel.app/vault/share/algorithms-pro-pack");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <section id="showcase" className="py-24 relative overflow-hidden">
      {/* Apple Subtle Radial Ambient Light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-blue-600/10 via-purple-600/10 to-rose-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 relative z-10">
        
        {/* Apple Keynote Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full apple-badge text-xs font-mono tracking-widest uppercase text-neutral-300">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Designed for Peak Academic Performance
          </div>
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight apple-title-gradient">
            Power in every pixel.
          </h2>
          <p className="text-neutral-400 text-lg sm:text-xl font-normal leading-relaxed">
            Engineered with the simplicity of Apple software and the raw speed of edge cloud infrastructure.
          </p>
        </div>

        {/* macOS Style Interactive Window Container */}
        <div className="apple-card rounded-3xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 hover:border-white/20">
          
          {/* macOS Title Bar */}
          <div className="h-12 bg-neutral-900/80 border-b border-white/10 px-4 flex items-center justify-between backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
              <span className="text-xs text-neutral-500 font-mono ml-2 hidden sm:inline-block">
                stash-academic.app &bull; Pro Workspace
              </span>
            </div>

            {/* Apple Segmented Switcher */}
            <div className="flex items-center gap-1 bg-neutral-950/80 p-1 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => setActiveTab("vault")}
                className={`px-3.5 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "vault"
                    ? "bg-white text-black shadow-md"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <FolderArchive className="w-3.5 h-3.5" />
                <span>Vault</span>
              </button>
              <button
                onClick={() => setActiveTab("notes")}
                className={`px-3.5 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "notes"
                    ? "bg-white text-black shadow-md"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Notes & Math</span>
              </button>
              <button
                onClick={() => setActiveTab("architecture")}
                className={`px-3.5 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "architecture"
                    ? "bg-white text-black shadow-md"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Edge Engine</span>
              </button>
            </div>

            <div className="w-16 hidden sm:block text-right">
              <span className="text-[10px] font-mono text-emerald-400 font-bold">ONLINE</span>
            </div>
          </div>

          {/* Interactive Window Body */}
          <div className="p-6 sm:p-10 min-h-[380px] flex flex-col justify-center">
            
            {/* Tab 1: Interactive Vault */}
            {activeTab === "vault" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Instant Cloud File Vault
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-400">
                      Drag, drop, and distribute course slides and problem sets with zero friction.
                    </p>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black font-semibold text-xs transition hover:bg-neutral-200 active:scale-95 cursor-pointer shadow-md"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5 text-black" />}
                    <span>{copiedLink ? "Link Copied to Clipboard" : "Copy Test Share Link"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-neutral-950/80 border border-white/10 hover:border-white/30 rounded-2xl p-5 space-y-3 transition group">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-mono text-[10px] font-bold">
                        CS 301
                      </span>
                      <span className="text-[11px] font-mono text-neutral-500">4.8 MB</span>
                    </div>
                    <h4 className="font-semibold text-sm text-white leading-snug group-hover:text-blue-400 transition">
                      Advanced Algorithms & Dynamic Trees.pdf
                    </h4>
                    <p className="text-xs text-neutral-400">Uploaded by Verified Student</p>
                  </div>

                  <div className="bg-neutral-950/80 border border-white/10 hover:border-white/30 rounded-2xl p-5 space-y-3 transition group">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-mono text-[10px] font-bold">
                        CS 305
                      </span>
                      <span className="text-[11px] font-mono text-neutral-500">2.1 MB</span>
                    </div>
                    <h4 className="font-semibold text-sm text-white leading-snug group-hover:text-purple-400 transition">
                      Relational Database Query Optimization.docx
                    </h4>
                    <p className="text-xs text-neutral-400">Uploaded by Verified Student</p>
                  </div>

                  <div className="bg-neutral-950/80 border border-white/10 hover:border-white/30 rounded-2xl p-5 space-y-3 transition group">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-mono text-[10px] font-bold">
                        MATH 202
                      </span>
                      <span className="text-[11px] font-mono text-neutral-500">3.4 MB</span>
                    </div>
                    <h4 className="font-semibold text-sm text-white leading-snug group-hover:text-rose-400 transition">
                      Eigenvalues & Matrix Spectral Theorem.pdf
                    </h4>
                    <p className="text-xs text-neutral-400">Uploaded by Verified Student</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Notes & LaTeX Engine */}
            {activeTab === "notes" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                      Interactive LaTeX Formula Input
                    </label>
                    <textarea
                      rows={5}
                      value={typedFormula}
                      onChange={(e) => setTypedFormula(e.target.value)}
                      className="w-full bg-neutral-950 border border-white/10 rounded-2xl p-4 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-white/40"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                      Live High-Fidelity Rendering
                    </label>
                    <div className="bg-neutral-950 border border-white/10 rounded-2xl p-5 min-h-[120px] flex flex-col justify-center space-y-3">
                      <span className="text-[10px] font-mono uppercase text-blue-400 font-bold">
                        Calculus & Discrete Mathematics
                      </span>
                      <div className="text-base sm:text-lg font-mono text-white bg-white/5 p-4 rounded-xl border border-white/10 overflow-x-auto">
                        {typedFormula}
                      </div>
                      <p className="text-xs text-neutral-400">
                        Rendered with KaTeX engine & typography optimized for high-density displays.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Edge Engine Architecture */}
            {activeTab === "architecture" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                  <div className="bg-neutral-950/80 border border-white/10 p-6 rounded-2xl space-y-2">
                    <div className="text-3xl sm:text-4xl font-black text-white font-display">
                      &lt; 20ms
                    </div>
                    <div className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                      Edge Network Latency
                    </div>
                    <p className="text-xs text-neutral-400">
                      Global CDN distribution with zero routing bottlenecks.
                    </p>
                  </div>

                  <div className="bg-neutral-950/80 border border-white/10 p-6 rounded-2xl space-y-2">
                    <div className="text-3xl sm:text-4xl font-black text-white font-display">
                      AES-256
                    </div>
                    <div className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
                      Hardware Encryption
                    </div>
                    <p className="text-xs text-neutral-400">
                      All uploaded materials and database records fully encrypted at rest.
                    </p>
                  </div>

                  <div className="bg-neutral-950/80 border border-white/10 p-6 rounded-2xl space-y-2">
                    <div className="text-3xl sm:text-4xl font-black text-white font-display">
                      100%
                    </div>
                    <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                      Cloud Availability
                    </div>
                    <p className="text-xs text-neutral-400">
                      Serverless database synchronization operates 24/7 without PC reliance.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Apple Style Bento Grid: Feature Powerhouse */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="apple-card rounded-3xl p-8 flex flex-col justify-between space-y-6 hover:scale-[1.01] transition-all duration-300">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">Speed</span>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Near-telepathic response times.
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Engineered on Next.js 15 App Router and Vercel edge runtime for lightning-quick page transitions and instantaneous search filtering.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-neutral-400">
              <span>Next.js 15 Engine</span>
              <span className="text-white font-bold">&rarr;</span>
            </div>
          </div>

          <div className="apple-card rounded-3xl p-8 flex flex-col justify-between space-y-6 hover:scale-[1.01] transition-all duration-300">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">Authentication</span>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Single Sign-On. Simple as a tap.
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Connect seamlessly with your Google Student account or GitHub developer profile. No passwords to remember or reset.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-neutral-400">
              <span>NextAuth v5</span>
              <span className="text-white font-bold">&rarr;</span>
            </div>
          </div>

          <div className="apple-card rounded-3xl p-8 flex flex-col justify-between space-y-6 hover:scale-[1.01] transition-all duration-300">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                <Database className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">Reliability</span>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Cloud Sync. Works everywhere.
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Your notes, files, and course materials are stored remotely 24/7 on Supabase & PostgreSQL. Available on phone, tablet, or desktop.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-neutral-400">
              <span>Prisma & Supabase</span>
              <span className="text-white font-bold">&rarr;</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
