import React from "react";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { GitHubSignInButton } from "@/components/GitHubSignInButton";
import { UserAccountNav } from "@/components/UserAccountNav";
import { ArchitectureShowcase } from "@/components/ArchitectureShowcase";
import {
  GraduationCap,
  FolderArchive,
  CheckCircle2,
  BookOpenCheck,
  Zap,
  ShieldCheck,
  Share2,
  FileText,
  ArrowRight,
  Sparkles,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative bg-grid-pattern overflow-x-hidden">
      
      {/* Dynamic Background Radial Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-600/15 via-purple-600/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Floating Glass Navbar */}
      <header className="glass-nav sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <FolderArchive className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white font-display">
                STASH
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                ✳︎ ACADEMIC
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#vault" className="hover:text-white transition">Vault</a>
            <a href="#notes" className="hover:text-white transition">Notes</a>
            <a href="#architecture" className="hover:text-indigo-400 transition flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Architecture
            </a>
          </nav>

          <div className="flex items-center gap-4">
            {session?.user ? (
              <UserAccountNav />
            ) : (
              <a
                href="#login-section"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-md shadow-indigo-600/30"
              >
                Student Sign In
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex-grow space-y-24">
        
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono tracking-widest uppercase">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              The Academic Vault for High Performers
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] font-display">
              Organize <span className="gradient-accent">everything</span> academic in one place.
            </h1>

            <p className="text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
              Stash is a high-speed academic workspace for storing lecture slides, authoring Markdown & LaTeX notes, tracking syllabus progress, and sharing study packs.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href="#login-section"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white transition shadow-xl shadow-indigo-600/30 text-sm group"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </a>
              <a
                href="#architecture"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 font-semibold text-slate-300 text-sm transition"
              >
                <span>View System Architecture</span>
              </a>
            </div>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-2xl glass-panel">
                <BookOpenCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-200">Course Materials</h4>
                  <p className="text-xs text-slate-400">Class notes, slides, and syllabus repository.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-2xl glass-panel">
                <Zap className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">Sub-20ms Edge Speed</h4>
                  <p className="text-xs text-slate-400">Global Vercel Edge CDN distribution.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Student SSO Authentication Card */}
          <div id="login-section" className="lg:col-span-5 scroll-mt-24">
            <div className="glass-panel border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="text-center space-y-2 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-6 h-6 text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight font-display">
                  Student Sign In
                </h2>
                <p className="text-sm text-slate-400">
                  Authenticate with Google or GitHub to access your Stash workspace.
                </p>
              </div>

              {session?.user ? (
                <div className="space-y-4 text-center py-4 bg-slate-950/60 rounded-2xl p-6 border border-slate-800">
                  <div className="flex justify-center">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt="Profile"
                        className="w-16 h-16 rounded-full border-2 border-indigo-500 shadow-md"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-xl font-bold text-white">
                        {session.user.name?.charAt(0) || "S"}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Welcome back, {session.user.name}!
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">{session.user.email}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    className="block w-full text-center py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-white transition shadow-lg shadow-indigo-600/30"
                  >
                    Open Student Dashboard &rarr;
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <GoogleSignInButton buttonText="Continue with Google" />
                  <GitHubSignInButton buttonText="Continue with GitHub" />

                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-slate-800"></div>
                    <span className="flex-shrink mx-3 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">
                      Authorization SSO
                    </span>
                    <div className="flex-grow border-t border-slate-800"></div>
                  </div>

                  <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800 text-xs text-slate-400 space-y-1.5">
                    <div className="flex items-center gap-2 text-slate-300 font-semibold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      Secure OAuth 2.0 Single Sign-On
                    </div>
                    <p className="leading-relaxed text-[11px] text-slate-400">
                      Use your official university Google account or GitHub developer account. Passwordless SSO authentication.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Feature Highlights Section */}
        <div id="features" className="scroll-mt-24 pt-12 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold text-white tracking-tight font-display">
              Built for Academic Speed & Simplicity
            </h2>
            <p className="text-sm text-slate-400">
              Everything you need to organize courses, manage files, and share resources.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div id="vault" className="glass-panel rounded-3xl p-8 hover:border-indigo-500/40 transition group space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition">
                <FolderArchive className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Centralized Cloud Vault</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Store syllabus outlines, lab manuals, slides, and assignment files organized by semester and course code.
              </p>
            </div>

            <div id="notes" className="glass-panel rounded-3xl p-8 hover:border-purple-500/40 transition group space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Academic Notes & LaTeX</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Fast, clutter-free environment designed for lecture capture, summary sheets, and exam formula guides.
              </p>
            </div>

            <div className="glass-panel rounded-3xl p-8 hover:border-cyan-500/40 transition group space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Peer File Sharing</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Generate instant shareable links for study materials and project resources with classmate study groups.
              </p>
            </div>
          </div>
        </div>

        {/* Architecture & Live Interactive Showcase Component */}
        <ArchitectureShowcase />

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#05070b] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">Stash Academic</span>
            <span>&bull;</span>
            <span>&copy; {new Date().getFullYear()}</span>
            <span>&bull;</span>
            <span className="text-slate-400">Deployable 24/7 on Vercel Edge</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
              AUTH: GOOGLE & GITHUB SSO READY
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
