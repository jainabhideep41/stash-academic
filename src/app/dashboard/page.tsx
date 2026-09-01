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

  const branch = dbUser?.branch || emailProfile?.branch || "Computer Science & Engineering";
  const yearOfStudy = dbUser?.yearOfStudy || emailProfile?.yearOfStudy || "III";
  const uidNumber = dbUser?.uidNumber || emailProfile?.uidNumber || "23CS01049";

  return (
    <AppLayoutShell user={user}>
      <div className="space-y-8">
        
        {/* Welcome Header with Verified Academic Badges & Direct Profile Access */}
        <div className="fused-card border-prismatic rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/profile"
                title="View & Edit Profile"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider hover:bg-emerald-500/20 transition cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Student
              </Link>
              <Link
                href="/profile"
                title="View & Edit Profile"
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold hover:bg-purple-500/20 transition cursor-pointer"
              >
                <CreditCard className="w-3 h-3" />
                UID: {uidNumber}
              </Link>
              <Link
                href="/profile"
                title="View & Edit Profile"
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold hover:bg-cyan-500/20 transition cursor-pointer"
              >
                <GraduationCap className="w-3 h-3" />
                Year {yearOfStudy} &bull; {branch}
              </Link>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
              Welcome back, {user.name || "Student"}!
            </h1>
            <p className="text-sm text-slate-400">
              Here is an overview of your course files, study notes, and upcoming academic deadlines.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/assessment"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-200 text-black font-bold text-xs transition shadow-md cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              Assessment Studio
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-white/10 text-white font-bold text-xs transition cursor-pointer"
            >
              <UserCircle className="w-4 h-4 text-purple-400" />
              Student Profile
            </Link>
            <Link
              href="/vault"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-white/10 text-white font-bold text-xs transition cursor-pointer"
            >
              <UploadCloud className="w-4 h-4 text-white" />
              Upload File
            </Link>
            <Link
              href="/notes"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-white/10 text-white font-bold text-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white" />
              Create Note
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/vault"
            className="fused-card rounded-2xl p-5 transition group"
          >
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <span>File Vault</span>
              <FolderArchive className="w-4 h-4 text-white group-hover:scale-105 transition" />
            </div>
            <div className="text-2xl font-black text-white">12 Files</div>
            <p className="text-[11px] text-slate-400 mt-1">Open file repository &rarr;</p>
          </Link>

          <Link
            href="/notes"
            className="fused-card rounded-2xl p-5 transition group"
          >
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <span>Saved Notes</span>
              <FileText className="w-4 h-4 text-white group-hover:scale-105 transition" />
            </div>
            <div className="text-2xl font-black text-white">24 Notes</div>
            <p className="text-[11px] text-slate-400 mt-1">Open notes hub &rarr;</p>
          </Link>

          <div className="fused-card rounded-2xl p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <span>Deadlines</span>
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div className="text-2xl font-black text-white">3 Tasks</div>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3 text-white" /> Next in 2 days
            </p>
          </div>

          <div className="fused-card rounded-2xl p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <span>Active Shares</span>
              <Share2 className="w-4 h-4 text-white" />
            </div>
            <div className="text-2xl font-black text-white">18 Links</div>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Public Links Active
            </p>
          </div>
        </div>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Columns: Course Vault Quick Access */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 font-display">
                <BookOpen className="w-5 h-5 text-white" />
                Course Repositories & Materials
              </h2>
              <Link href="/vault" className="text-xs font-mono font-bold text-white hover:underline">
                View All Vaults &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { code: "CS 301", title: "Data Structures & Algorithms", files: "5 Files", topics: "AVL Trees, Graphs, Sorting" },
                { code: "CS 305", title: "Database Management Systems", files: "3 Files", topics: "SQL, ER Diagrams, B-Trees" },
                { code: "MATH 202", title: "Linear Algebra & Calculus", files: "2 Files", topics: "Eigenvalues, Diagonalization" },
                { code: "CS 310", title: "Computer Networks & Security", files: "2 Files", topics: "TCP/IP, Wireshark, TLS" },
              ].map((course, idx) => (
                <div
                  key={idx}
                  className="fused-card rounded-2xl p-5 space-y-3 group transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-white/10 text-white border border-white/10 text-[10px] font-mono font-bold uppercase">
                      {course.code}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{course.files}</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-sm leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{course.topics}</p>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-white/10">
                    <Link
                      href={`/vault?course=${encodeURIComponent(course.code)}`}
                      className="text-xs font-mono font-bold text-white hover:underline flex items-center gap-1"
                    >
                      Open Vault
                      <ArrowRight className="w-3.5 h-3.5 text-white group-hover:translate-x-1 transition" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Deadlines & Quick Tasks */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 font-display">
              <Calendar className="w-5 h-5 text-white" />
              Academic Tasks & Deadlines
            </h2>

            <div className="fused-card rounded-2xl p-5 space-y-4">
              <div className="border-l-2 border-purple-500 pl-3 py-1">
                <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest">Due in 2 days</span>
                <h4 className="text-sm font-bold text-white">Algorithms Homework 4</h4>
                <p className="text-xs text-slate-400">CS 301 &bull; Dynamic Programming</p>
              </div>

              <div className="border-l-2 border-cyan-500 pl-3 py-1">
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">Due Friday</span>
                <h4 className="text-sm font-bold text-white">Database Project Phase 2</h4>
                <p className="text-xs text-slate-400">CS 305 &bull; Schema ER Diagrams</p>
              </div>

              <div className="border-l-2 border-rose-500 pl-3 py-1">
                <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-widest">Next Week</span>
                <h4 className="text-sm font-bold text-white">Midterm Exam Revision</h4>
                <p className="text-xs text-slate-400">MATH 202 &bull; Linear Algebra</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </AppLayoutShell>
  );
}
