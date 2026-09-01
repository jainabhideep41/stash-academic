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
} from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between selection:bg-white selection:text-black relative bg-grid-monochrome overflow-x-hidden">
      
      {/* Floating Glass Navbar */}
      <header className="glass-nav-bw sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <FolderArchive className="w-5 h-5 text-black" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight text-white font-display">
                STASH
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-neutral-900 text-white border border-neutral-700">
                ✳︎ ACADEMIC VAULT
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#vault" className="hover:text-white transition">Vault</a>
            <a href="#notes" className="hover:text-white transition">Notes</a>
            <a href="#architecture" className="hover:text-white transition flex items-center gap-1">
              <span>System Map</span>
            </a>
          </nav>

          <div className="flex items-center gap-4">
            {session?.user ? (
              <UserAccountNav />
            ) : (
              <a
                href="#login-section"
                className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs transition shadow-sm"
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
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-700 text-white text-xs font-mono tracking-widest uppercase">
              <GraduationCap className="w-4 h-4 text-white" />
              The Savvy Academic Vault for High Performers
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] font-display">
              Organize <span className="underline decoration-white/40 underline-offset-8">everything</span> academic in one place.
            </h1>

            <p className="text-lg text-neutral-300 max-w-2xl leading-relaxed font-normal">
              Stash is an ultra-minimalist, high-speed academic workspace for lecture slides, Markdown & LaTeX notes, syllabus tracking, and cloud file sharing.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href="#login-section"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-neutral-200 font-bold text-black transition shadow-xl text-sm group"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition text-black" />
              </a>
              <a
                href="#architecture"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 font-bold text-white text-sm transition"
              >
                <span>View System Architecture</span>
              </a>
            </div>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-2xl glass-panel-bw">
                <BookOpenCheck className="w-5 h-5 text-white shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Course Materials</h4>
                  <p className="text-xs text-neutral-400">Class notes, slides, and syllabus repository.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-2xl glass-panel-bw">
                <Zap className="w-5 h-5 text-white shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Sub-20ms Edge Speed</h4>
                  <p className="text-xs text-neutral-400">Global Vercel Edge CDN distribution.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Student SSO Authentication Card */}
          <div id="login-section" className="lg:col-span-5 scroll-mt-24">
            <div className="glass-panel-bw border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
              <div className="text-center space-y-2 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white border border-white flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-6 h-6 text-black" />
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight font-display">
                  Student Sign In
                </h2>
                <p className="text-sm text-neutral-400">
                  Authenticate with Google or GitHub to access your Stash workspace.
                </p>
              </div>

              {session?.user ? (
                <div className="space-y-4 text-center py-4 bg-neutral-950 rounded-2xl p-6 border border-neutral-800">
                  <div className="flex justify-center">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt="Profile"
                        className="w-16 h-16 rounded-full border-2 border-white shadow-md"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-xl font-bold text-black">
                        {session.user.name?.charAt(0) || "S"}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Welcome back, {session.user.name}!
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1">{session.user.email}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    className="block w-full text-center py-3 px-4 rounded-xl bg-white hover:bg-neutral-200 font-bold text-black transition shadow-md"
                  >
                    Open Student Dashboard &rarr;
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <GoogleSignInButton buttonText="Continue with Google" />
                  <GitHubSignInButton buttonText="Continue with GitHub" />

                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-neutral-800"></div>
                    <span className="flex-shrink mx-3 text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-500">
                      Authorization SSO
                    </span>
                    <div className="flex-grow border-t border-neutral-800"></div>
                  </div>

                  <div className="bg-neutral-950 rounded-xl p-3.5 border border-neutral-800 text-xs text-neutral-400 space-y-1.5">
                    <div className="flex items-center gap-2 text-white font-bold text-xs font-mono uppercase">
                      <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                      Secure Single Sign-On
                    </div>
                    <p className="leading-relaxed text-[11px] text-neutral-400">
                      Use your official Google account or GitHub developer account. Passwordless SSO authentication.
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
            <h2 className="text-3xl font-black text-white tracking-tight font-display">
              Built for Academic Speed & Simplicity
            </h2>
            <p className="text-sm text-neutral-400">
              Everything you need to organize courses, manage files, and share resources.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div id="vault" className="glass-panel-bw rounded-3xl p-8 hover:border-white transition group space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-white group-hover:scale-105 transition">
                <FolderArchive className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">Centralized Cloud Vault</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Store syllabus outlines, lab manuals, slides, and assignment files organized by semester and course code.
              </p>
            </div>

            <div id="notes" className="glass-panel-bw rounded-3xl p-8 hover:border-white transition group space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-white group-hover:scale-105 transition">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">Academic Notes & LaTeX</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Fast, clutter-free environment designed for lecture capture, summary sheets, and exam formula guides.
              </p>
            </div>

            <div className="glass-panel-bw rounded-3xl p-8 hover:border-white transition group space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-white group-hover:scale-105 transition">
                <Share2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">Peer File Sharing</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Generate instant shareable links for study materials and project resources with classmate study groups.
              </p>
            </div>
          </div>
        </div>

        {/* Architecture & Live Interactive Showcase Component */}
        <ArchitectureShowcase />

      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800 bg-black py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">Stash Academic</span>
            <span>&bull;</span>
            <span>&copy; {new Date().getFullYear()}</span>
            <span>&bull;</span>
            <span className="text-neutral-400">Deployable 24/7 on Vercel Edge</span>
          </div>
          <div className="flex items-center gap-4 text-neutral-400 font-mono text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white inline-block animate-pulse"></span>
              AUTH: GOOGLE & GITHUB SSO READY
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
