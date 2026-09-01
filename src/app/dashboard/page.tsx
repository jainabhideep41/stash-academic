import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppLayoutShell } from "@/components/AppLayoutShell";
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
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const user = session.user;

  return (
    <AppLayoutShell user={user}>
      <div className="space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
              Welcome back, {user.name || "Student"}!
            </h1>
            <p className="text-sm text-neutral-400">
              Here is an overview of your course files, study notes, and upcoming academic deadlines.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/vault"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs transition shadow-sm"
            >
              <UploadCloud className="w-4 h-4 text-black" />
              Upload File
            </Link>
            <Link
              href="/notes"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white font-bold text-xs transition"
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
            className="bg-neutral-950 border border-neutral-800 hover:border-white rounded-2xl p-5 transition group"
          >
            <div className="flex items-center justify-between text-neutral-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <span>File Vault</span>
              <FolderArchive className="w-4 h-4 text-white group-hover:scale-105 transition" />
            </div>
            <div className="text-2xl font-black text-white">12 Files</div>
            <p className="text-[11px] text-neutral-400 mt-1">Open file repository &rarr;</p>
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
            <p className="text-[11px] text-neutral-400 mt-1">Open notes hub &rarr;</p>
          </Link>

          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <span>Deadlines</span>
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div className="text-2xl font-black text-white">3 Tasks</div>
            <p className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3 text-white" /> Next in 2 days
            </p>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <span>Active Shares</span>
              <Share2 className="w-4 h-4 text-white" />
            </div>
            <div className="text-2xl font-black text-white">18 Links</div>
            <p className="text-[11px] text-white mt-1 flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3 h-3 text-white" /> Public Links Active
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
                  className="bg-neutral-950 border border-neutral-800 hover:border-white rounded-2xl p-5 space-y-3 group transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-black text-white border border-neutral-700 text-[10px] font-mono font-bold uppercase">
                      {course.code}
                    </span>
                    <span className="text-xs font-mono text-neutral-400">{course.files}</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-sm leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-1">{course.topics}</p>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-neutral-800">
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

      </div>
    </AppLayoutShell>
  );
}
