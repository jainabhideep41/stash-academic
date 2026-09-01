import React from "react";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { UserAccountNav } from "@/components/UserAccountNav";
import {
  GraduationCap,
  FolderArchive,
  CheckCircle2,
  BookOpenCheck,
  Zap,
  ShieldCheck,
  Share2,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Dynamic Background Glow Effect */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 backdrop-blur-md bg-[#0b0f19]/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <FolderArchive className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-white flex items-center gap-2">
                Stash
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                  Academic
                </span>
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {session?.user ? (
              <UserAccountNav />
            ) : (
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                Student Authorization Portal
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 flex-grow flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hero Copy & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              Your All-in-One Academic Vault
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Organize <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">everything</span> academic in one place.
            </h1>

            <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
              Stash is built for students to store course notes, track exam syllabi, collect lecture slides, manage assignment deadlines, and access study packs anywhere.
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-800/60">
                <BookOpenCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">Course Materials</h4>
                  <p className="text-xs text-slate-400">Class notes, slides, and syllabus repository.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-800/60">
                <Zap className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">Fast Search & Indexing</h4>
                  <p className="text-xs text-slate-400">Instant query across all subject topics.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Student Google Authorization Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="text-center space-y-2 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-6 h-6 text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Student Sign In
                </h2>
                <p className="text-sm text-slate-400">
                  Authenticate with your Google account to access your Stash workspace.
                </p>
              </div>

              {session?.user ? (
                <div className="space-y-4 text-center py-4 bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
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
                    <h3 className="text-lg font-semibold text-white">
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
                <div className="space-y-6">
                  <GoogleSignInButton buttonText="Sign in with Google" />

                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-slate-800"></div>
                    <span className="flex-shrink mx-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Authorization Notice
                    </span>
                    <div className="flex-grow border-t border-slate-800"></div>
                  </div>

                  <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 text-xs text-slate-400 space-y-2">
                    <div className="flex items-center gap-2 text-slate-300 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      Student Single Sign-On (SSO)
                    </div>
                    <p className="leading-relaxed">
                      Use your official university or personal Google account. No registration passwords required.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-20 pt-12 border-t border-slate-800/60 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700 transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4">
              <FolderArchive className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Centralized Vault</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Keep syllabus outlines, lab manuals, slides, and assignment files organized by semester and subject.
            </p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700 transition">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
              <FileText className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Academic Notes</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Fast, clutter-free environment designed for lecture capture, summary sheets, and exam revision guides.
            </p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700 transition">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
              <Share2 className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Peer Collaboration</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Seamlessly share study materials and resources with your classmates and project partners.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 bg-[#080c14] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} Stash Academic Portal</span>
            <span>&bull;</span>
            <span className="text-slate-400">Deployable on Vercel</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
              Auth Status: Google OAuth Ready
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
