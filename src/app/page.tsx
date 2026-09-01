import React from "react";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { GitHubSignInButton } from "@/components/GitHubSignInButton";
import { UserAccountNav } from "@/components/UserAccountNav";
import { AppleKeynoteShowcase } from "@/components/AppleKeynoteShowcase";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  FolderArchive,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";

export default async function HomePage() {
  const session = await auth();

  // Check registration status if user is signed in
  let isRegistered = false;
  if (session?.user) {
    const cookieStore = await cookies();
    const isRegisteredCookie = cookieStore.get("stash_registered")?.value === "true";

    let dbUser = null;
    if (session.user.email && process.env.DATABASE_URL) {
      try {
        dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
        });
      } catch (e) {
        console.warn("DB check fallback on home:", e);
      }
    }

    isRegistered = isRegisteredCookie || (dbUser?.isRegistered === true);
  }

  return (
    <div className="min-h-screen bg-[#02040a] text-[#f5f5f7] flex flex-col justify-between selection:bg-white selection:text-black relative overflow-x-hidden">
      
      {/* Radiant Background Ambient Radial Light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-purple-600/15 via-rose-600/10 to-transparent rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Floating Fused Navigation Bar */}
      <header className="fused-nav sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-black shadow-lg shadow-white/10 group-hover:scale-105 transition-transform">
              <FolderArchive className="w-4 h-4 text-black" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white font-display">
                Stash
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                PRO ✳︎ VAULT
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-400">
            <a href="#showcase" className="hover:text-white transition">Overview</a>
            <a href="#showcase" className="hover:text-white transition">Vault</a>
            <a href="#showcase" className="hover:text-white transition">Notes & Math</a>
            <a href="#showcase" className="hover:text-cyan-400 transition flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Specs
            </a>
          </nav>

          <div className="flex items-center gap-4">
            {session?.user ? (
              <div className="flex items-center gap-3">
                <Link
                  href={isRegistered ? "/dashboard" : "/onboarding"}
                  className="px-4 py-1.5 rounded-full bg-white text-black font-semibold text-xs transition hover:bg-slate-200 active:scale-95 shadow-md"
                >
                  {isRegistered ? "Open Dashboard" : "Complete Registration"}
                </Link>
                <UserAccountNav />
              </div>
            ) : (
              <a
                href="#signin-card"
                className="px-5 py-2 rounded-full bg-white text-black font-semibold text-xs transition hover:bg-slate-200 active:scale-95 shadow-md"
              >
                Sign In
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 flex-grow space-y-28 relative z-10">
        
        {/* Apple Cinematic Hero Section with Goddess Shimmer */}
        <div className="text-center max-w-4xl mx-auto space-y-8">
          
          {/* Top Pill Announcement */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-purple-500/30 text-xs font-medium text-purple-200 backdrop-blur-xl shadow-sm">
            <span className="text-slate-400">Introducing Stash 2.0</span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-white font-semibold">The Academic Vault &rarr;</span>
          </div>

          {/* Giant Apple Headline with Holographic Word */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-[1.04]">
            Brains. Speed.<br /><span className="text-holographic">Unstoppable.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-2xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            The academic workspace engineered for high performers. Course slides, Markdown notes, LaTeX equations, and instant peer sharing. All in one place.
          </p>

          {/* Action CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="#signin-card"
              className="px-8 py-4 rounded-full bg-white text-black font-semibold text-sm transition hover:bg-slate-200 active:scale-95 shadow-2xl shadow-white/10 flex items-center gap-2 group cursor-pointer"
            >
              <span>Launch Your Vault</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition text-black" />
            </a>
            <a
              href="#showcase"
              className="px-8 py-4 rounded-full bg-slate-900/90 border border-white/10 text-white font-semibold text-sm transition hover:bg-slate-800 active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Interactive Demo</span>
            </a>
          </div>
        </div>

        {/* Apple Keynote Interactive Window Showcase & Fused Bento Grid */}
        <AppleKeynoteShowcase />

        {/* Student SSO Login Section */}
        <div id="signin-card" className="max-w-xl mx-auto scroll-mt-24">
          <div className="fused-card border-prismatic rounded-3xl p-8 sm:p-10 text-center space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mx-auto text-black shadow-lg shadow-white/10">
              <ShieldCheck className="w-6 h-6 text-black" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
                {session?.user ? "Your Authenticated Account" : "Access Your Workspace"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                {session?.user
                  ? "Manage your verified student profile and access your course vaults."
                  : "Sign in with your Google or GitHub account to sync your files and study materials across all devices."}
              </p>
            </div>

            {session?.user ? (
              <div className="space-y-4 py-4 bg-slate-950/80 rounded-2xl p-6 border border-white/10">
                <div className="flex justify-center">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt="Profile"
                      className="w-16 h-16 rounded-full border-2 border-purple-500 shadow-md object-cover"
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
                  <p className="text-xs text-slate-400 mt-1">{session.user.email}</p>
                </div>

                {isRegistered ? (
                  <Link
                    href="/dashboard"
                    className="block w-full text-center py-3.5 px-4 rounded-full bg-white text-black font-semibold text-sm transition hover:bg-slate-200 shadow-md"
                  >
                    Open Student Dashboard &rarr;
                  </Link>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/onboarding"
                      className="block w-full text-center py-3.5 px-4 rounded-full bg-gradient-to-r from-purple-500 to-rose-500 text-white font-bold text-sm transition hover:opacity-90 shadow-lg shadow-purple-500/20"
                    >
                      Complete Registration (Branch, Year, UID) &rarr;
                    </Link>
                    <p className="text-[11px] text-amber-400/90 font-mono">
                      * Profile verification required before accessing course files
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <GoogleSignInButton buttonText="Continue with Google" />
                <GitHubSignInButton buttonText="Continue with GitHub" />

                <div className="pt-4 border-t border-white/10 text-left">
                  <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Zero password friction
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Uses official OAuth 2.0 single sign-on. Your university credentials and GitHub profile remain fully private.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      </main>

      {/* Fused Minimalist Footer */}
      <footer className="border-t border-white/10 bg-[#02040a] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-xs text-slate-500">
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
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Stash is an open academic platform deployable 24/7 on Vercel Edge with Supabase and Prisma cloud synchronization.
          </p>
        </div>
      </footer>
    </div>
  );
}
