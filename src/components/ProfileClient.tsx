"use client";

import React, { useState, useEffect } from "react";
import { completeRegistration, saveUserGeminiApiKey } from "@/app/actions/register";
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
  Key,
  Eye,
  EyeOff,
  ExternalLink,
  Sparkles,
  Trash2,
  Smartphone,
  Download,
  RefreshCw,
} from "lucide-react";
import { CURRENT_APP_VERSION, GITHUB_RELEASES_URL } from "@/lib/appVersion";

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
  initialGeminiKey?: string;
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

export function ProfileClient({ initialUser, studentDetails, initialGeminiKey = "" }: ProfileClientProps) {
  const [name, setName] = useState(initialUser.name || "");
  const [branch, setBranch] = useState(studentDetails.branch);
  const [yearOfStudy, setYearOfStudy] = useState(studentDetails.yearOfStudy);
  const [uidNumber, setUidNumber] = useState(studentDetails.uidNumber);
  
  // Gemini API Key State
  const [geminiKey, setGeminiKey] = useState(initialGeminiKey);
  const [showKey, setShowKey] = useState(false);
  const [keySaved, setKeySaved] = useState(false);
  const [keyRemoved, setKeyRemoved] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copiedUid, setCopiedUid] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load once on initial mount only - NO LOOP when user clears input!
  useEffect(() => {
    if (!initialGeminiKey) {
      const saved = localStorage.getItem("stash_gemini_api_key");
      if (saved) setGeminiKey(saved);
    }
  }, []);

  const handleRemoveApiKey = async () => {
    setGeminiKey("");
    localStorage.removeItem("stash_gemini_api_key");
    document.cookie = "stash_gemini_key=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    
    try {
      await saveUserGeminiApiKey("");
    } catch (e) {
      console.warn("DB remove key error:", e);
    }

    setKeyRemoved(true);
    setTimeout(() => setKeyRemoved(false), 2500);
  };

  const handleSaveApiKey = async () => {
    if (!geminiKey.trim()) {
      await handleRemoveApiKey();
      return;
    }

    localStorage.setItem("stash_gemini_api_key", geminiKey.trim());
    // Also save in cookie for server actions
    document.cookie = `stash_gemini_key=${encodeURIComponent(geminiKey.trim())}; path=/; max-age=31536000; SameSite=Lax`;
    
    // Save to Database / Account server action
    try {
      await saveUserGeminiApiKey(geminiKey.trim());
    } catch (e) {
      console.warn("DB save warning:", e);
    }

    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2500);
  };

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
          Manage your verified academic credentials, university enrollment, and AI settings.
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
          
          {/* 1. Academic Credentials Box */}
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

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Student UID / Roll Number
                  </label>
                  <input
                    type="text"
                    value={uidNumber}
                    onChange={(e) => setUidNumber(e.target.value)}
                    required
                    placeholder="e.g. 24BCS10694"
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
              </div>
            )}
          </div>

          {/* 2. Google Gemini AI API Configuration Card */}
          <div className="fused-card rounded-3xl p-6 sm:p-8 space-y-5 border border-purple-500/20">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    Google Gemini AI Key
                  </h3>
                  <p className="text-xs text-slate-400">
                    Powers live AI Objectives & Learning Outcomes generation in Assessment Studio.
                  </p>
                </div>
              </div>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-mono text-purple-400 hover:text-purple-300 font-bold hover:underline"
              >
                <span>Get Free Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-purple-400" />
                  <span>Google AI Studio API Key (Gemini)</span>
                </label>
                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-black/60 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-purple-400 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition p-1"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-mono">
                  Your key is saved locally to your device and used exclusively for your assessment synthesis.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                {geminiKey && (
                  <button
                    type="button"
                    onClick={handleRemoveApiKey}
                    className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{keyRemoved ? "Removed!" : "Remove Key"}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSaveApiKey}
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-black text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  {keySaved ? <Check className="w-4 h-4 text-emerald-600" /> : <Save className="w-4 h-4 text-black" />}
                  <span>{keySaved ? "API Key Saved!" : "Save Gemini Key"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Software Version & In-App Updates Card */}
          <div className="p-6 rounded-3xl bg-neutral-900/50 border border-neutral-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">App Version & Updates</h3>
                  <p className="text-[11px] font-mono text-neutral-400">
                    Stash Academic Mobile & Web Software Manager
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>v{CURRENT_APP_VERSION} Installed</span>
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 font-mono leading-relaxed">
              Stash supports direct in-app software updates. Check for the newest releases containing hardware DND alarm features, AI assessment generators, and speed optimizations.
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <a
                href={GITHUB_RELEASES_URL}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-neutral-400 hover:text-white font-mono flex items-center gap-1.5 transition"
              >
                <span>View Release Notes on GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent("stash_check_updates"))}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
                  <span>Check for Updates</span>
                </button>

                <a
                  href={`${GITHUB_RELEASES_URL}/download/v1.3.0-mobile-ui/Stash-Academic-v1.3.0-Mobile.apk`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-200 text-black text-xs font-bold transition flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-black" />
                  <span>Download v1.3.0 APK</span>
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
