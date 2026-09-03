import React from "react";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { GitHubSignInButton } from "@/components/GitHubSignInButton";
import { UserAccountNav } from "@/components/UserAccountNav";
import { AppleKeynoteShowcase } from "@/components/AppleKeynoteShowcase";
import { VoiceAssistantOverlay } from "@/components/VoiceAssistantOverlay";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  FolderArchive,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Smartphone,
  Download,
  Mic,
  Volume2,
  AlarmClock,
  Music,
} from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { CURRENT_APP_VERSION, GITHUB_RELEASES_URL } from "@/lib/appVersion";

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

  const APK_DIRECT_URL = `https://github.com/jainabhideep41/stash-academic/releases/download/v${CURRENT_APP_VERSION}/Stash-v${CURRENT_APP_VERSION}.apk`;

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
            <a href="#alarms" className="hover:text-white transition flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-purple-400" />
              <span>60+ Sounds</span>
            </a>
            <a href="#android" className="hover:text-cyan-400 transition flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
              <span>Android APK</span>
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {/* Direct Android APK Download Button in Navbar */}
            <a
              href={APK_DIRECT_URL}
              download
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-200 text-xs font-mono font-bold transition shadow-sm active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-purple-300" />
              <span>Get APK v{CURRENT_APP_VERSION}</span>
            </a>

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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex-grow space-y-24 relative z-10">
        
        {/* Apple Cinematic Hero Section with Goddess Shimmer */}
        <div className="text-center max-w-4xl mx-auto space-y-8">
          
          {/* Top Pill Announcement */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-purple-500/30 text-xs font-medium text-purple-200 backdrop-blur-xl shadow-sm">
            <span className="text-slate-400">Stash v{CURRENT_APP_VERSION} Live</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white font-semibold">60+ Alarm Sounds &amp; Alexa Voice Assistant &rarr;</span>
          </div>

          {/* Giant Apple Headline with Holographic Word */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-[1.04]">
            Brains. Speed.<br /><span className="text-holographic">Unstoppable.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-2xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            The academic workspace engineered for high performers. Course vaults, Markdown notes, LaTeX equations, Alexa voice assistant, and 60+ Samsung &amp; Xiaomi alarm ringtones.
          </p>

          {/* Action CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href={session?.user ? (isRegistered ? "/dashboard" : "/onboarding") : "#signin-card"}
              className="px-8 py-4 rounded-full bg-white text-black font-semibold text-sm transition hover:bg-slate-200 active:scale-95 shadow-2xl shadow-white/10 flex items-center gap-2 group cursor-pointer"
            >
              <span>Launch Your Vault</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition text-black" />
            </a>

            <a
              href={APK_DIRECT_URL}
              download
              className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm transition active:scale-95 flex items-center gap-2 shadow-lg shadow-purple-600/30 cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-white" />
              <span>Download Android APK (v{CURRENT_APP_VERSION})</span>
            </a>
          </div>
        </div>

        {/* Apple Keynote Interactive Window Showcase */}
        <AppleKeynoteShowcase />

        {/* Dedicated Features Grid: Voice Assistant & 60+ Sounds */}
        <div id="alarms" className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black text-white font-display">
              Voice Intelligence &amp; 60+ Alarm Sounds
            </h2>
            <p className="text-sm text-slate-400">
              Never sleep through a deadline again with our multimodal hardware wake-up suite.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="fused-card rounded-3xl p-6 sm:p-8 space-y-4 border border-purple-500/20">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-display">
                Alexa-Style Voice Assistant
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                Powered by Google Gemini AI with 5 distinct vocal personas (US, UK, Aussie, Calm, Drill Commander). Alexa announces your scheduled tasks aloud.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="fused-card rounded-3xl p-6 sm:p-8 space-y-4 border border-cyan-500/20">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                <Volume2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-display">
                60+ Authentic Ringtones
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                100% offline Web Audio synthesizers: Samsung Horizon, Xiaomi Fireflies, Apple Radar, Nuclear Siren, Heavy Air Horn, Big Ben, and Tibetan Singing Bowls.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="fused-card rounded-3xl p-6 sm:p-8 space-y-4 border border-rose-500/20">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-300">
                <AlarmClock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-display">
                Customizable Disarm Challenges
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                Configure whether turning off alarms requires typing a confirmation phrase, voice recognition confirmation ("I am awake"), both, or standard 1-tap.
              </p>
            </div>

          </div>
        </div>

        {/* Dedicated Android App Download Banner Section */}
        <div id="android" className="fused-card border-prismatic rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden space-y-6">
          <div className="w-14 h-14 rounded-3xl bg-white flex items-center justify-center mx-auto text-black shadow-xl shadow-white/10">
            <Smartphone className="w-7 h-7 text-black" />
          </div>

          <div className="space-y-2 max-w-2xl mx-auto">
            <span className="text-[10px] font-mono font-bold tracking-widest text-purple-300 uppercase px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30">
              ANDROID APK v{CURRENT_APP_VERSION}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight mt-2">
              Install Stash on Your Phone
            </h2>
            <p className="text-sm text-slate-300">
              Get hardware DND bypass alarms, native Google One-Tap authentication, 60+ synthesized ringtones, and offline study notes.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href={APK_DIRECT_URL}
              download
              className="px-8 py-4 rounded-full bg-white text-black font-black text-sm transition hover:bg-slate-200 active:scale-95 shadow-2xl flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-black" />
              <span>Download Stash-v{CURRENT_APP_VERSION}.apk (5.14 MB)</span>
            </a>

            <a
              href={GITHUB_RELEASES_URL}
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 rounded-full bg-slate-900/90 border border-white/10 text-white font-semibold text-sm transition hover:bg-slate-800 active:scale-95 flex items-center gap-2"
            >
              <span>GitHub Release Notes &rarr;</span>
            </a>
          </div>
        </div>

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

      {/* Mount Voice Assistant Overlay Globally on Website */}
      <VoiceAssistantOverlay />

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
              <span>ALL SYSTEMS OPERATIONAL (v{CURRENT_APP_VERSION})</span>
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
