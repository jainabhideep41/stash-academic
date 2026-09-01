"use client";

import React, { useState } from "react";
import {
  Server,
  Database,
  Lock,
  Cloud,
  Layers,
  Cpu,
  Globe,
  Zap,
  CheckCircle2,
  Share2,
  FileText,
  Copy,
  Check,
  Code2,
} from "lucide-react";

export function ArchitectureShowcase() {
  const [activeTab, setActiveTab] = useState<"architecture" | "vault" | "notes">("architecture");
  const [copiedLink, setCopiedLink] = useState(false);
  const [sampleNote, setSampleNote] = useState(
    "# CS 301 Algorithms Note\n\nBalance Factor equation: $$|h_L - h_R| \\le 1$$\n\n- AVL Tree insertion: $O(\\log n)$\n- Rotations: Left, Right, Left-Right, Right-Left"
  );

  const handleCopyDemoLink = () => {
    navigator.clipboard.writeText("https://stash-academic.vercel.app/vault/share/demo-cs301-slides");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <section id="architecture" className="py-20 border-t border-slate-800/80 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono uppercase tracking-widest">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            Engineering & System Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            High-Performance Cloud Architecture
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Stash is built on serverless infrastructure with zero cold-starts, global CDN edge routing, and end-to-end cloud database synchronization.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center">
          <div className="bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl inline-flex gap-2 backdrop-blur-md">
            <button
              onClick={() => setActiveTab("architecture")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === "architecture"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Cloud System Map</span>
            </button>
            <button
              onClick={() => setActiveTab("vault")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === "vault"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>Live Vault Demo</span>
            </button>
            <button
              onClick={() => setActiveTab("notes")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === "notes"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Live Markdown & LaTeX</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Cloud System Architecture */}
        {activeTab === "architecture" && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 space-y-3 relative group hover:border-indigo-500/40 transition">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Globe className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest">Edge Layer 01</span>
                <h3 className="text-base font-bold text-white">Vercel Serverless CDN</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Global edge deployment with sub-20ms route rendering and zero cold-start API handlers.
                </p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 space-y-3 relative group hover:border-purple-500/40 transition">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Lock className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest">Auth Layer 02</span>
                <h3 className="text-base font-bold text-white">NextAuth v5 & SSO</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Google & GitHub OAuth 2.0 single sign-on with JWT session validation.
                </p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 space-y-3 relative group hover:border-cyan-500/40 transition">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Database className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">Data Layer 03</span>
                <h3 className="text-base font-bold text-white">Prisma & PostgreSQL</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Type-safe database ORM managing accounts, courses, notes, and file metadata.
                </p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 space-y-3 relative group hover:border-emerald-500/40 transition">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Cloud className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">Storage Layer 04</span>
                <h3 className="text-base font-bold text-white">Supabase Cloud Vault</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  CDN-cached object buckets for lecture slides, past question papers, and PDFs.
                </p>
              </div>

            </div>

            {/* Architecture Code Snippet */}
            <div className="bg-slate-950 rounded-2xl p-4 sm:p-6 border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
              <div className="flex items-center justify-between text-slate-500 pb-2 border-b border-slate-800">
                <span className="flex items-center gap-2 text-indigo-400">
                  <Code2 className="w-4 h-4" /> stash-architecture-config.ts
                </span>
                <span>Production Environment: Ready</span>
              </div>
              <pre className="text-slate-300 overflow-x-auto leading-relaxed pt-2">
{`export const StashSystemArchitecture = {
  framework: "Next.js 15 (App Router & Server Actions)",
  hosting: "Vercel Edge Network (Global CDN)",
  auth: ["Google OAuth 2.0", "GitHub OAuth 2.0"],
  database: "Supabase PostgreSQL via Prisma ORM v5",
  storage: "Supabase Cloud Buckets (AES-256 Encrypted)",
  security: "TLS 1.3, Strict CORS, Single Sign-On",
};`}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 2: Live Vault Demo */}
        {activeTab === "vault" && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white">Interactive Vault Preview</h3>
                <p className="text-xs text-slate-400">Try generating a shareable file link live in your browser.</p>
              </div>
              <button
                onClick={handleCopyDemoLink}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? "Share Link Copied!" : "Test Copy Share Link"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-bold text-xs">
                    PDF
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Algorithms_Lecture_04_AVL_Trees.pdf</h4>
                    <p className="text-xs text-slate-400">CS 301 &bull; 4.8 MB</p>
                  </div>
                </div>
                <span className="text-xs text-indigo-400 font-mono">Public</span>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs">
                    DOCX
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Database_Schema_ER_Diagram.docx</h4>
                    <p className="text-xs text-slate-400">CS 305 &bull; 1.2 MB</p>
                  </div>
                </div>
                <span className="text-xs text-purple-400 font-mono">Public</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Live Markdown & LaTeX Preview */}
        {activeTab === "notes" && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 backdrop-blur-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Live Editor Input</label>
                <textarea
                  rows={6}
                  value={sampleNote}
                  onChange={(e) => setSampleNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Live Preview Output</label>
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 min-h-[150px] text-xs text-slate-200 space-y-2 font-sans">
                  <div className="font-bold text-sm text-indigo-300 border-b border-slate-800 pb-1">
                    CS 301 Algorithms Note
                  </div>
                  <p className="text-slate-300">
                    Balance Factor equation: <code className="bg-slate-900 px-1.5 py-0.5 rounded text-indigo-300">|h_L - h_R| &le; 1</code>
                  </p>
                  <ul className="list-disc pl-4 text-slate-400 space-y-1">
                    <li>AVL Tree insertion: O(log n)</li>
                    <li>Rotations: Left, Right, Left-Right, Right-Left</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
