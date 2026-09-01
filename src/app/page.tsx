import React from "react";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { GitHubSignInButton } from "@/components/GitHubSignInButton";
import { UserAccountNav } from "@/components/UserAccountNav";
import { AppleKeynoteShowcase } from "@/components/AppleKeynoteShowcase";
import {
  FolderArchive,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Layers,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7] flex flex-col justify-between selection:bg-white selection:text-black relative overflow-x-hidden">
      
      {/* Apple Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] bg-gradient-to-b from-neutral-800/20 via-neutral-900/10 to-transparent rounded-full blur-[180px] pointer-events-none" />

      {/* Floating Apple-style Navigation Bar */}
      <header className="apple-nav sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-black shadow-sm group-hover:scale-105 transition-transform">
              <FolderArchive className="w-4 h-4 text-black" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white font-display">
                Stash
              </span>
              <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">
                PRO
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-neutral-400">
            <a href="#showcase" className="hover:text-white transition">Overview</a>
            <a href="#features" className="hover:text-white transition">Vault</a>
            <a href="#features" className="hover:text-white transition">Notes & Math</a>
            <a href="#showcase" className="hover:text-white transition">Specs</a>
          </nav>

          <div className="flex items-center gap-4">
            {session?.user ? (
              <UserAccountNav />
            ) : (
              <a
                href="#signin-card"
                className="px-4 py-1.5 rounded-full bg-white text-black font-semibold text-xs transition hover:bg-neutral-200 active:scale-95 shadow-sm"
              >
                Sign In
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 flex-grow space-y-28 relative z-10">
        
        {/* Apple Cinematic Hero Section */}
        <div className="text-center max-w-4xl mx-auto space-y-8">
          
          {/* Top Pill Announcement */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full apple-badge text-xs font-medium text-neutral-300 backdrop-blur-xl">
            <span className="text-neutral-400">Introducing Stash 2.0</span>
            <span className="w-1 h-1 rounded-full bg-neutral-500" />
            <span className="text-white font-semibold">The Academic Vault &rarr;</span>
          </div>

          {/* Giant Apple Headline */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter apple-title-gradient leading-[1.04]">
            Brains. Speed.<br />Unstoppable.
          </h1>

          {/* Apple Subheadline */}
          <p className="text-lg sm:text-2xl text-neutral-400 max-w-2xl mx-auto font-normal leading-relaxed">
            The academic workspace engineered for high performers. Course slides, Markdown notes, LaTeX equations, and instant sharing. All in one place.
          </p>

          {/* Action CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="#signin-card"
              className="px-7 py-3.5 rounded-full bg-white text-black font-semibold text-sm transition hover:bg-neutral-200 active:scale-95 shadow-2xl flex items-center gap-2 group"
            >
              <span>Launch Your Vault</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition text-black" />
            </a>
            <a
              href="#showcase"
              className="px-7 py-3.5 rounded-full bg-neutral-900 border border-white/10 text-white font-semibold text-sm transition hover:bg-neutral-800 active:scale-95 flex items-center gap-2"
            >
              <span>Explore Interactive Demo</span>
            </a>
          </div>
        </div>

        {/* Apple Keynote Interactive Window Showcase & Bento Grid */}
        <AppleKeynoteShowcase />

        {/* Student SSO Login Section */}
        <div id="signin-card" className="max-w-xl mx-auto scroll-mt-24">
          <div className="apple-card rounded-3xl p-8 sm:p-10 text-center space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mx-auto text-black shadow-lg">
              <ShieldCheck className="w-6 h-6 text-black" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
                Access Your Workspace
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
                Sign in with your Google or GitHub account to sync your files and study materials across all devices.
              </p>
            </div>

            {session?.user ? (
              <div className="space-y-4 py-4 bg-neutral-950/80 rounded-2xl p-6 border border-white/10">
                <div className="flex justify-center">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt="Profile"
                      className="w-16 h-16 rounded-full border-2 border-white shadow-md object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-xl font-bold text-black">
                      {session.user.name?.charAt(0) || "S"}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Welcome, {session.user.name}!
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">{session.user.email}</p>
                </div>
                <Link
                  href="/dashboard"
                  className="block w-full text-center py-3 px-4 rounded-full bg-white text-black font-semibold text-sm transition hover:bg-neutral-200 shadow-md"
                >
                  Go to Dashboard &rarr;
                </Link>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <GoogleSignInButton buttonText="Continue with Google" />
                <GitHubSignInButton buttonText="Continue with GitHub" />

                <div className="pt-4 border-t border-white/10 text-left">
                  <div className="flex items-center gap-2 text-xs text-neutral-300 font-semibold mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Zero password friction
                  </div>
                  <p className="text-[11px] text-neutral-500 leading-relaxed">
                    Uses official OAuth 2.0 single sign-on. Your university credentials and GitHub profile remain fully private.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      </main>

      {/* Apple Style Minimalist Footer */}
      <footer className="border-t border-white/10 bg-neutral-950 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-xs text-neutral-500">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-white">Stash Academic</span>
              <span>&bull;</span>
              <span>Cloud Vault for Higher Education</span>
              <span>&bull;</span>
              <span>&copy; {new Date().getFullYear()}</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
              <span>ALL SYSTEMS OPERATIONAL</span>
            </div>
          </div>
          <p className="text-[11px] text-neutral-600 leading-relaxed">
            Stash is an open academic platform deployable 24/7 on Vercel Edge with Supabase and Prisma cloud synchronization.
          </p>
        </div>
      </footer>
    </div>
  );
}
