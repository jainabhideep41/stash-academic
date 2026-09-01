import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UserAccountNav } from "@/components/UserAccountNav";
import {
  FolderArchive,
  BookOpen,
  FileText,
  Calendar,
  Sparkles,
  UploadCloud,
  GraduationCap,
  ArrowRight,
  Clock,
  CheckCircle2,
  Share2,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-[#0b0f19]/90 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <FolderArchive className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white">Stash</span>
          </Link>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-300">
              <Link href="/vault" className="hover:text-indigo-400 flex items-center gap-1.5 transition">
                <FolderArchive className="w-4 h-4 text-indigo-400" />
                <span>File Vault</span>
              </Link>
              <Link href="/notes" className="hover:text-purple-400 flex items-center gap-1.5 transition">
                <FileText className="w-4 h-4 text-purple-400" />
                <span>Notes & Summaries</span>
              </Link>
            </nav>

            <UserAccountNav />
          </div>
        </div>
      </header>

      {/* Dashboard Main View */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-900/60 via-slate-900 to-purple-900/40 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "Student profile"}
                  className="w-16 h-16 rounded-2xl border-2 border-indigo-400 shadow-md object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-2xl font-bold text-white shadow-md">
                  {user.name?.charAt(0) || "S"}
                </div>
              )}
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Authenticated Student
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Welcome, {user.name}!
                </h1>
                <p className="text-sm text-slate-400">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/vault"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition shadow-md shadow-indigo-600/20"
              >
                <UploadCloud className="w-4 h-4" />
                Upload to Vault
              </Link>
              <Link
                href="/notes"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition shadow-md shadow-purple-600/20"
              >
                <FileText className="w-4 h-4" />
                New Note
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/vault"
            className="bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-5 transition group"
          >
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
              <span>File Vault Repository</span>
              <FolderArchive className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition" />
            </div>
            <div className="text-2xl font-bold text-white">12 Files</div>
            <p className="text-[11px] text-indigo-300 mt-1 flex items-center gap-1">
              Click to open file vault &rarr;
            </p>
          </Link>

          <Link
            href="/notes"
            className="bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-5 transition group"
          >
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
              <span>Saved Notes</span>
              <FileText className="w-4 h-4 text-purple-400 group-hover:scale-110 transition" />
            </div>
            <div className="text-2xl font-bold text-white">24 Notes</div>
            <p className="text-[11px] text-purple-300 mt-1 flex items-center gap-1">
              Click to view study notes &rarr;
            </p>
          </Link>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
              <span>Upcoming Deadlines</span>
              <Calendar className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-white">3 Tasks</div>
            <p className="text-[11px] text-amber-400 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Next due in 2 days
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
              <span>Share Links Active</span>
              <Share2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white">18 Links</div>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Publicly accessible
            </p>
          </div>
        </div>

        {/* Core Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                Current Courses & Syllabi
              </h2>
            </div>

            <div className="space-y-3">
              {[
                { code: "CS 301", title: "Data Structures & Algorithms", topics: "Binary Trees, Graphs, Sorting", color: "indigo" },
                { code: "CS 305", title: "Database Management Systems", topics: "Relational Schema, SQL, Normalization", color: "purple" },
                { code: "MATH 202", title: "Linear Algebra & Calculus", topics: "Eigenvectors, Matrices, Integrals", color: "cyan" },
                { code: "CS 310", title: "Computer Networks & Web Security", topics: "TCP/IP, HTTP/3, TLS Encryption", color: "emerald" },
              ].map((course, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-4 flex items-center justify-between group transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-indigo-300">
                      {course.code}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-indigo-300 transition">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-400">{course.topics}</p>
                    </div>
                  </div>
                  <Link
                    href={`/vault?course=${encodeURIComponent(course.code)}`}
                    className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                  >
                    Open Vault
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              Upcoming Tasks
            </h2>

            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="border-l-2 border-amber-400 pl-3 py-1">
                <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">Due in 2 days</span>
                <h4 className="text-sm font-semibold text-white">Algorithms Homework 4</h4>
                <p className="text-xs text-slate-400">CS 301 &bull; Dynamic Programming</p>
              </div>

              <div className="border-l-2 border-indigo-400 pl-3 py-1">
                <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">Due Friday</span>
                <h4 className="text-sm font-semibold text-white">Database Project Phase 2</h4>
                <p className="text-xs text-slate-400">CS 305 &bull; Schema ER Diagrams</p>
              </div>

              <div className="border-l-2 border-emerald-400 pl-3 py-1">
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Next Week</span>
                <h4 className="text-sm font-semibold text-white">Midterm Exam Revision</h4>
                <p className="text-xs text-slate-400">MATH 202 &bull; Linear Algebra</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
