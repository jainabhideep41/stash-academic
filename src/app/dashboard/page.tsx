import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AppLayoutShell } from "@/components/AppLayoutShell";
import { prisma } from "@/lib/prisma";
import {
  FolderArchive,
  BookOpen,
  FileText,
  Calendar,
  UploadCloud,
  ArrowRight,
  Clock,
  CheckCircle2,
  Share2,
  Plus,
  CreditCard,
  GraduationCap,
  UserCircle,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { DashboardTaskHub } from "@/components/DashboardTaskHub";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const user = session.user;
  const normalizedEmail = user.email ? user.email.toLowerCase().trim() : "";
  const emailKey = normalizedEmail ? Buffer.from(normalizedEmail).toString("hex") : "";

  // Check email-specific registration (unifies Google & GitHub for same email)
  const cookieStore = await cookies();
  const isRegisteredCookie = cookieStore.get("stash_registered")?.value === "true";
  const emailProfileRaw = emailKey ? cookieStore.get(`stash_reg_${emailKey}`)?.value : null;
  
  let emailProfile: any = null;
  if (emailProfileRaw) {
    try {
      emailProfile = JSON.parse(emailProfileRaw);
    } catch {}
  }

  let dbUser = null;
  if (normalizedEmail && process.env.DATABASE_URL) {
    try {
      dbUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });
    } catch (e) {
      console.warn("DB user fetch fallback:", e);
    }
  }

  const isRegistered =
    isRegisteredCookie ||
    emailProfile?.isRegistered === true ||
    dbUser?.isRegistered === true;

  if (!isRegistered) {
    redirect("/onboarding");
  }

  const branch = dbUser?.branch || emailProfile?.branch || "Computer Science";
  const yearOfStudy = dbUser?.yearOfStudy || emailProfile?.yearOfStudy || "III";
  const uidNumber = dbUser?.uidNumber || emailProfile?.uidNumber || "23CS01049";

  return (
    <AppLayoutShell user={user}>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Native App Banner: Student Verified Card */}
        <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-b from-neutral-900/90 to-neutral-950 border border-neutral-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold uppercase">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified Student
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-mono font-bold">
                  <CreditCard className="w-3 h-3" />
                  UID: {uidNumber}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold">
                  <GraduationCap className="w-3 h-3" />
                  Year {yearOfStudy} &bull; {branch}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight">
                Hello, {user.name || "Student"} 👋
              </h1>
              <p className="text-xs text-neutral-400 font-mono">
                Academic files, study notes, and wake-up alarm schedule.
              </p>
            </div>

            {/* Quick Action Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/assessment"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-200 text-black font-bold text-xs transition shadow-md active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>AI Assessment</span>
              </Link>
              <Link
                href="/vault"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white font-bold text-xs transition active:scale-95 cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5 text-white" />
                <span>Upload</span>
              </Link>
              <Link
                href="/notes"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white font-bold text-xs transition active:scale-95 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-white" />
                <span>Note</span>
              </Link>
            </div>

          </div>
        </div>

        {/* Glanceable Stats Carousel / Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Link
            href="/vault"
            className="p-4 rounded-2xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800/80 transition active:scale-[0.98] group"
          >
            <div className="flex items-center justify-between text-neutral-400 text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
              <span>Files</span>
              <FolderArchive className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xl font-black text-white">12 Docs</div>
            <p className="text-[10px] text-neutral-500 font-mono mt-0.5">Vault repository &rarr;</p>
          </Link>

          <Link
            href="/notes"
            className="p-4 rounded-2xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800/80 transition active:scale-[0.98] group"
          >
            <div className="flex items-center justify-between text-neutral-400 text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
              <span>Notes</span>
              <FileText className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xl font-black text-white">24 Guides</div>
            <p className="text-[10px] text-neutral-500 font-mono mt-0.5">Notes hub &rarr;</p>
          </Link>

          <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80">
            <div className="flex items-center justify-between text-neutral-400 text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
              <span>Alarms</span>
              <Calendar className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-xl font-black text-white">Active DND</div>
            <p className="text-[10px] text-rose-300 font-mono mt-0.5 flex items-center gap-1">
              <Clock className="w-3 h-3 text-rose-400" /> Auto-sync enabled
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80">
            <div className="flex items-center justify-between text-neutral-400 text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
              <span>Live Shares</span>
              <Share2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-black text-white">18 Links</div>
            <p className="text-[10px] text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Peer links active
            </p>
          </div>
        </div>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Columns: Course Vault Quick Access */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-white flex items-center gap-2 font-display">
                <BookOpen className="w-4 h-4 text-purple-400" />
                Course Repositories
              </h2>
              <Link href="/vault" className="text-xs font-mono font-bold text-neutral-400 hover:text-white transition">
                View All &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { code: "CS 301", title: "Data Structures & Algorithms", files: "5 Files", topics: "AVL Trees, Graphs, Sorting" },
                { code: "CS 305", title: "Database Management Systems", files: "3 Files", topics: "SQL, ER Diagrams, B-Trees" },
                { code: "MATH 202", title: "Linear Algebra & Calculus", files: "2 Files", topics: "Eigenvalues, Diagonalization" },
                { code: "CS 310", title: "Computer Networks & Security", files: "2 Files", topics: "TCP/IP, Wireshark, TLS" },
              ].map((course, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800/80 space-y-2.5 transition active:scale-[0.99] group"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-white/10 text-white text-[10px] font-mono font-bold uppercase">
                      {course.code}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400">{course.files}</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-sm leading-snug group-hover:text-purple-300 transition">
                      {course.title}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">{course.topics}</p>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-white/5">
                    <Link
                      href={`/vault?course=${encodeURIComponent(course.code)}`}
                      className="text-xs font-mono font-bold text-white hover:underline flex items-center gap-1"
                    >
                      <span>Open Vault</span>
                      <ArrowRight className="w-3.5 h-3.5 text-white group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Deadlines & Tasks Hub */}
          <div className="space-y-4">
            <DashboardTaskHub />
          </div>

        </div>

      </div>
    </AppLayoutShell>
  );
}
