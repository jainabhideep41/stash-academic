"use client";

import React, { useState } from "react";
import { completeRegistration } from "@/app/actions/register";
import {
  User,
  CreditCard,
  GraduationCap,
  Mail,
  CheckCircle2,
  Calendar,
  Save,
  Loader2,
  Copy,
  Check,
  Building2,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

interface ProfileClientProps {
  initialUser: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  studentDetails: {
    branch: string;
    yearOfStudy: string;
    uidNumber: string;
  };
}

const BRANCH_OPTIONS = [
  "Computer Science & Engineering",
  "Information Technology",
  "AI & Data Science",
  "Electronics & Communication",
  "Electrical & Electronics",
  "Mechanical Engineering",
  "Civil Engineering",
  "Mathematics & Computing",
  "Biotechnology",
  "Business & Management",
  "Other / Multidisciplinary",
];

const YEAR_OPTIONS = ["I", "II", "III", "IV", "V"];

export function ProfileClient({ initialUser, studentDetails }: ProfileClientProps) {
  const [name, setName] = useState(initialUser.name || "");
  const [branch, setBranch] = useState(studentDetails.branch);
  const [yearOfStudy, setYearOfStudy] = useState(studentDetails.yearOfStudy);
  const [uidNumber, setUidNumber] = useState(studentDetails.uidNumber);
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copiedUid, setCopiedUid] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleCopyUid = () => {
    navigator.clipboard.writeText(uidNumber);
    setCopiedUid(true);
    setTimeout(() => setCopiedUid(false), 2000);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await completeRegistration({
        name,
        branch,
        yearOfStudy,
        uidNumber,
      });

      if (res.success) {
        setMessage({ type: "success", text: "Profile details updated successfully!" });
        setIsEditing(false);
      } else {
        setMessage({ type: "error", text: res.error || "Failed to update profile." });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "An unexpected error occurred." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black text-white font-display tracking-tight">
          Student Profile
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your verified academic credentials, university enrollment, and account settings.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl text-xs font-mono border flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-rose-500/10 border-rose-500/30 text-rose-400"
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      {/* Grid: Left ID Card Preview & Right Detailed Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Academic Student ID Card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="fused-card border-prismatic rounded-3xl p-6 relative overflow-hidden space-y-6">
            
            {/* Header Badge */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-widest text-purple-300 uppercase px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30">
                STASH ✳︎ STUDENT ID
              </span>
              <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified
              </span>
            </div>

            {/* Profile Avatar & Name */}
            <div className="flex flex-col items-center text-center space-y-3 pt-2">
              {initialUser.image ? (
                <img
                  src={initialUser.image}
                  alt={name}
                  className="w-20 h-20 rounded-full border-2 border-white/20 object-cover shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-white text-black font-black text-2xl flex items-center justify-center shadow-lg">
                  {name.charAt(0) || "S"}
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-white leading-tight">{name}</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{initialUser.email}</p>
              </div>
            </div>

            {/* UID Bar */}
            <div className="bg-black/50 border border-white/10 rounded-2xl p-3 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Student UID
                </span>
                <span className="text-sm font-mono font-black text-white tracking-widest">
                  {uidNumber}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyUid}
                title="Copy UID"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
              >
                {copiedUid ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Academic Highlights */}
            <div className="space-y-2.5 pt-2 border-t border-white/10 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5 font-mono">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                  Branch
                </span>
                <span className="font-semibold text-white truncate max-w-[140px] text-right">
                  {branch}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  Academic Year
                </span>
                <span className="font-semibold text-white">Year {yearOfStudy}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  SSO Linked
                </span>
                <span className="font-mono text-[11px] text-emerald-400">Google / GitHub</span>
              </div>
            </div>

          </div>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold text-xs transition cursor-pointer"
          >
            {isEditing ? "Cancel Editing" : "Edit Academic Details"}
          </button>
        </div>

        {/* Detailed Form & Settings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="fused-card rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  {isEditing ? "Edit Profile Information" : "Academic Credentials Overview"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isEditing
                    ? "Update your enrollment records and university student ID."
                    : "Your university credentials as verified on the Stash platform."}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold uppercase">
                Active Student
              </span>
            </div>

            {isEditing ? (
              /* Editable Form */
              <form onSubmit={handleUpdate} className="space-y-5">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:outline-none focus:border-white transition"
                  />
                </div>

                {/* Email (Readonly) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    University / SSO Email (Locked)
                  </label>
                  <input
                    type="email"
                    value={initialUser.email || ""}
                    disabled
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 text-sm cursor-not-allowed"
                  />
                </div>

                {/* Branch */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Course / Branch
                  </label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:outline-none focus:border-white transition cursor-pointer"
                  >
                    {BRANCH_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-neutral-950 text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year of Study */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Year of Study
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {YEAR_OPTIONS.map((yr) => (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => setYearOfStudy(yr)}
                        className={`py-2.5 rounded-xl text-xs font-mono font-bold border transition cursor-pointer ${
                          yearOfStudy === yr
                            ? "bg-white text-black border-white shadow-md"
                            : "bg-black/60 text-slate-400 border-white/10 hover:border-white/30 hover:text-white"
                        }`}
                      >
                        Year {yr}
                      </button>
                    ))}
                  </div>
                </div>

                {/* UID */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Student UID / Roll Number
                  </label>
                  <input
                    type="text"
                    value={uidNumber}
                    onChange={(e) => setUidNumber(e.target.value)}
                    required
                    placeholder="e.g. 23CS01049"
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white text-sm font-mono focus:outline-none focus:border-white transition"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-slate-400 text-xs font-bold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-black text-xs font-bold transition flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <Save className="w-4 h-4 text-black" />}
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Read-only Detailed View */
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      Full Legal Name
                    </span>
                    <span className="text-sm font-bold text-white block">{name}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      University UID
                    </span>
                    <span className="text-sm font-mono font-bold text-purple-300 block">{uidNumber}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      Department / Branch
                    </span>
                    <span className="text-sm font-bold text-white block">{branch}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      Academic Year
                    </span>
                    <span className="text-sm font-bold text-cyan-300 block">Year {yearOfStudy}</span>
                  </div>
                </div>

                {/* Additional University Vault Metadata */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Cloud Vault Storage Allocation
                  </span>
                  <div className="w-full bg-neutral-900 rounded-full h-2 overflow-hidden border border-white/10">
                    <div className="bg-gradient-to-r from-purple-500 to-rose-500 h-2 rounded-full w-1/4" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                    <span>1.2 GB used of 15 GB</span>
                    <span className="text-emerald-400">Normal Usage</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
