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
            The simplicity of Apple design fused with iridescent micro-accents and edge cloud performance.
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
            <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => setActiveTab("vault")}
                className={`px-3.5 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "vault"
                    ? "bg-white text-black shadow-md"
                    : "text-slate-400 hover:text-white"
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
                    : "text-slate-400 hover:text-white"
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
                    <div className="bg-black/80 border border-white/10 rounded-2xl p-5 min-h-[120px] flex flex-col justify-center space-y-3">
                      <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">
                        Calculus & Discrete Mathematics
                      </span>
                      <div className="text-base sm:text-lg font-mono text-white bg-purple-500/10 p-4 rounded-xl border border-purple-500/20 overflow-x-auto">
                        {typedFormula}
                      </div>
                      <p className="text-xs text-slate-400">
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
                  <div className="bg-black/60 border border-white/10 hover:border-cyan-500/40 p-6 rounded-2xl space-y-2 transition">
                    <div className="text-3xl sm:text-4xl font-black text-white font-display">
                      &lt; 20ms
                    </div>
                    <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                      Edge Network Latency
                    </div>
                    <p className="text-xs text-slate-400">
                      Global CDN distribution with zero routing bottlenecks.
                    </p>
                  </div>

                  <div className="bg-black/60 border border-white/10 hover:border-purple-500/40 p-6 rounded-2xl space-y-2 transition">
                    <div className="text-3xl sm:text-4xl font-black text-white font-display">
                      AES-256
                    </div>
                    <div className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
                      Hardware Encryption
                    </div>
                    <p className="text-xs text-slate-400">
                      All uploaded materials and database records fully encrypted at rest.
                    </p>
                  </div>

                  <div className="bg-black/60 border border-white/10 hover:border-rose-500/40 p-6 rounded-2xl space-y-2 transition">
                    <div className="text-3xl sm:text-4xl font-black text-white font-display">
                      100%
                    </div>
                    <div className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                      Cloud Availability
                    </div>
                    <p className="text-xs text-slate-400">
                      Serverless database synchronization operates 24/7 without PC reliance.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Fused Bento Grid with Radiant Micro-Accents */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="fused-card rounded-3xl p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">Speed</span>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Near-telepathic response times.
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Engineered on Next.js 15 App Router and Vercel edge runtime for lightning-quick page transitions and instantaneous search filtering.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Next.js 15 Engine</span>
              <span className="text-cyan-400 font-bold">&rarr;</span>
            </div>
          </div>

          <div className="fused-card rounded-3xl p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Lock className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-purple-400">Authentication</span>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Single Sign-On. Simple as a tap.
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Connect seamlessly with your Google Student account or GitHub developer profile. No passwords to remember or reset.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>NextAuth v5 & SSO</span>
              <span className="text-purple-400 font-bold">&rarr;</span>
            </div>
          </div>

          <div className="fused-card rounded-3xl p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Database className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-rose-400">Reliability</span>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Cloud Sync. Works everywhere.
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Your notes, files, and course materials are stored remotely 24/7 on Supabase & PostgreSQL. Available on phone, tablet, or desktop.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Prisma & Supabase</span>
              <span className="text-rose-400 font-bold">&rarr;</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
