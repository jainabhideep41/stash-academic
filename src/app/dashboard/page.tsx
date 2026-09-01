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
    <div className="min-h-screen bg-black text-white flex flex-col justify-between selection:bg-white selection:text-black">
      {/* Top Navbar */}
      <header className="border-b border-neutral-800 bg-black/90 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <FolderArchive className="w-5 h-5 text-black" />
            </div>
            <span className="font-extrabold text-lg text-white font-display">STASH</span>
          </Link>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-4 text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
              <Link href="/vault" className="hover:text-white flex items-center gap-1.5 transition">
                <FolderArchive className="w-4 h-4 text-white" />
                <span>File Vault</span>
              </Link>
              <Link href="/notes" className="hover:text-white flex items-center gap-1.5 transition">
                <FileText className="w-4 h-4 text-white" />
                <span>Notes Hub</span>
              </Link>
            </nav>

            <UserAccountNav />
          </div>
        </div>
      </header>

      {/* Dashboard Main View */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow space-y-8">
        {/* Welcome Banner */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "Student profile"}
                  className="w-16 h-16 rounded-2xl border-2 border-white shadow-md object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-2xl font-bold text-black shadow-md">
                  {user.name?.charAt(0) || "S"}
                </div>
              )}
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-neutral-900 border border-neutral-700 text-white text-xs font-mono uppercase tracking-widest mb-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Authenticated Student
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
                  Welcome, {user.name}!
                </h1>
                <p className="text-sm text-neutral-400">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/vault"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-sm font-bold transition shadow-sm"
              >
                <UploadCloud className="w-4 h-4 text-black" />
                Upload to Vault
              </Link>
              <Link
                href="/notes"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white text-sm font-bold transition"
              >
                <FileText className="w-4 h-4 text-white" />
                New Note
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/vault"
            className="bg-neutral-950 border border-neutral-800 hover:border-white rounded-2xl p-5 transition group"
          >
            <div className="flex items-center justify-between text-neutral-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <span>File Vault</span>
              <FolderArchive className="w-4 h-4 text-white group-hover:scale-105 transition" />
            </div>
            <div className="text-2xl font-black text-white">12 Files</div>
            <p className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1">
              Open repository &rarr;
            </p>
          </Link>

          <Link
            href="/notes"
            className="bg-neutral-950 border border-neutral-800 hover:border-white rounded-2xl p-5 transition group"
          >
            <div className="flex items-center justify-between text-neutral-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <span>Saved Notes</span>
              <FileText className="w-4 h-4 text-white group-hover:scale-105 transition" />
            </div>
            <div className="text-2xl font-black text-white">24 Notes</div>
            <p className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1">
              Open notes hub &rarr;
            </p>
          </Link>

          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <span>Deadlines</span>
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div className="text-2xl font-black text-white">3 Tasks</div>
            <p className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-white" /> Next due in 2 days
            </p>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <span>Share Links</span>
              <Share2 className="w-4 h-4 text-white" />
            </div>
            <div className="text-2xl font-black text-white">18 Links</div>
            <p className="text-[11px] text-white mt-1 flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3 h-3 text-white" /> Active & Public
            </p>
          </div>
        </div>

        {/* Core Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 font-display">
                <BookOpen className="w-5 h-5 text-white" />
                Current Courses & Syllabi
              </h2>
            </div>

            <div className="space-y-3">
              {[
                { code: "CS 301", title: "Data Structures & Algorithms", topics: "Binary Trees, Graphs, Sorting" },
                { code: "CS 305", title: "Database Management Systems", topics: "Relational Schema, SQL, Normalization" },
                { code: "MATH 202", title: "Linear Algebra & Calculus", topics: "Eigenvectors, Matrices, Integrals" },
                { code: "CS 310", title: "Computer Networks & Web Security", topics: "TCP/IP, HTTP/3, TLS Encryption" },
              ].map((course, idx) => (
                <div
                  key={idx}
                  className="bg-neutral-950 border border-neutral-800 hover:border-white rounded-2xl p-4 flex items-center justify-between group transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-black border border-neutral-700 flex items-center justify-center text-xs font-mono font-bold text-white">
                      {course.code}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">
                        {course.title}
                      </h3>
                      <p className="text-xs text-neutral-400">{course.topics}</p>
                    </div>
                  </div>
                  <Link
                    href={`/vault?course=${encodeURIComponent(course.code)}`}
                    className="flex items-center gap-1 text-xs font-mono font-bold text-white hover:underline"
                  >
                    Vault &rarr;
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 font-display">
              <Calendar className="w-5 h-5 text-white" />
              Upcoming Tasks
            </h2>

            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 space-y-4">
              <div className="border-l-2 border-white pl-3 py-1">
                <span className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">Due in 2 days</span>
                <h4 className="text-sm font-bold text-white">Algorithms Homework 4</h4>
                <p className="text-xs text-neutral-400">CS 301 &bull; Dynamic Programming</p>
              </div>

              <div className="border-l-2 border-neutral-500 pl-3 py-1">
                <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">Due Friday</span>
                <h4 className="text-sm font-bold text-white">Database Project Phase 2</h4>
                <p className="text-xs text-neutral-400">CS 305 &bull; Schema ER Diagrams</p>
              </div>

              <div className="border-l-2 border-neutral-500 pl-3 py-1">
                <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">Next Week</span>
                <h4 className="text-sm font-bold text-white">Midterm Exam Revision</h4>
                <p className="text-xs text-neutral-400">MATH 202 &bull; Linear Algebra</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
