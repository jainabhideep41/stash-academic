"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { completeRegistration } from "@/app/actions/register";
import {
  FolderArchive,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Mail,
  User,
  BookOpen,
  Calendar,
  CreditCard,
  ArrowRight,
  Loader2,
  Sparkles,
} from "lucide-react";

interface OnboardingClientProps {
  initialUser: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function OnboardingClient({ initialUser }: OnboardingClientProps) {
  const router = useRouter();
  const [name, setName] = useState(initialUser.name || "");
  const [email] = useState(initialUser.email || "");
  const [branch, setBranch] = useState("Computer Science & Engineering");
  const [yearOfStudy, setYearOfStudy] = useState("III");
  const [uidNumber, setUidNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const years = ["I", "II", "III", "IV", "V"];

  const branches = [
    "Computer Science & Engineering",
    "Information Technology",
    "Artificial Intelligence & Data Science",
    "Electronics & Communication",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Mathematics & Computing",
    "Biotechnology",
    "Physics / Applied Sciences",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !uidNumber.trim()) {
      setError("Please confirm your profile name and enter your Student UID.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await completeRegistration({
        name,
        branch,
        yearOfStudy,
        uidNumber,
      });

      if (!res.success) {
        setError(res.error || "Failed to complete registration.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-[#f5f5f7] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-white selection:text-black">
      
      {/* Radiant Background Ambient Light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-purple-600/15 via-rose-600/10 to-cyan-500/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-xl w-full relative z-10 space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mx-auto text-black shadow-lg shadow-white/10">
            <FolderArchive className="w-6 h-6 text-black" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-mono uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Step 2 of 2 &bull; Profile Verification
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            Complete Student Registration
          </h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            You are authenticated via Single Sign-On. Please confirm your academic details to link your university vault.
          </p>
        </div>

        {/* Success Modal Toast */}
        {success ? (
          <div className="fused-card border-prismatic rounded-3xl p-8 text-center space-y-5 animate-in fade-in duration-300 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white font-display">
                Bingo! You&apos;re Registered.
              </h2>
              <p className="text-sm text-slate-300">
                A welcome confirmation email has been dispatched to <strong>{email}</strong>.
              </p>
              <p className="text-xs text-purple-400 font-mono pt-2">
                Redirecting to your academic dashboard...
              </p>
            </div>
          </div>
        ) : (
          /* Registration Form Card */
          <form
            onSubmit={handleSubmit}
            className="fused-card border-prismatic rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl"
          >
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
                {error}
              </div>
            )}

            {/* Email (Read-only OAuth field) */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Authenticated Email
              </label>
              <div className="flex items-center justify-between bg-black/60 border border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-300">
                <span className="truncate">{email}</span>
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                  <CheckCircle2 className="w-3 h-3" /> Verified SSO
                </span>
              </div>
            </div>

            {/* Confirm Profile Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Confirm Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Abhideep Jain"
                className="w-full bg-black/60 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500 transition"
                required
              />
            </div>

            {/* Course / Branch */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                Course / Engineering Branch
              </label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500 transition"
              >
                {branches.map((b) => (
                  <option key={b} value={b} className="bg-neutral-900 text-white">
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Year of Study (I, II, III, IV, V) */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Year of Study
              </label>
              <div className="grid grid-cols-5 gap-2">
                {years.map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setYearOfStudy(yr)}
                    className={`py-2.5 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
                      yearOfStudy === yr
                        ? "bg-white text-black shadow-lg shadow-white/20"
                        : "bg-black/60 border border-white/10 text-slate-400 hover:text-white hover:border-white/30"
                    }`}
                  >
                    Year {yr}
                  </button>
                ))}
              </div>
            </div>

            {/* Student UID Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                Student UID / Roll Number
              </label>
              <input
                type="text"
                value={uidNumber}
                onChange={(e) => setUidNumber(e.target.value)}
                placeholder="e.g. 23CS01049 or 2024UID1092"
                className="w-full bg-black/60 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-purple-500 transition"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-200 text-black font-bold text-sm transition shadow-xl active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Verifying Profile & Sending Confirmation...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Registration & Enter Vault</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
