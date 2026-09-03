"use client";

import React, { useState, useEffect } from "react";
import {
  Download,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  X,
  ExternalLink,
  Smartphone,
  ShieldCheck,
  ArrowUpRight,
  AlertCircle,
} from "lucide-react";
import {
  checkForAppUpdate,
  AppUpdateInfo,
  CURRENT_APP_VERSION,
  GITHUB_RELEASES_URL,
} from "@/lib/appVersion";

export function AppUpdateModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<AppUpdateInfo | null>(null);
  const [hasPromptedBanner, setHasPromptedBanner] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Perform update check
  const handleCheck = async (showModalIfUpToDate = true) => {
    setIsChecking(true);
    try {
      const info = await checkForAppUpdate();
      setUpdateInfo(info);
      if (info.hasUpdate || showModalIfUpToDate) {
        setIsOpen(true);
      }
    } catch (e) {
      console.warn("Update check failed:", e);
    } finally {
      setIsChecking(false);
    }
  };

  // Background check on initial mount (once per session)
  useEffect(() => {
    const lastChecked = sessionStorage.getItem("stash_last_update_check");
    if (!lastChecked) {
      sessionStorage.setItem("stash_last_update_check", Date.now().toString());
      checkForAppUpdate().then((info) => {
        setUpdateInfo(info);
        if (info.hasUpdate) {
          setHasPromptedBanner(true);
        }
      });
    }

    // Listen for custom trigger event
    const handleTrigger = () => handleCheck(true);
    window.addEventListener("stash_check_updates", handleTrigger);
    return () => window.removeEventListener("stash_check_updates", handleTrigger);
  }, []);

  // Handle in-place APK Download / Update action
  const handleInstallUpdate = () => {
    setIsDownloading(true);
    const url =
      updateInfo?.apkDownloadUrl ||
      `${GITHUB_RELEASES_URL}/download/v1.0.0-apk/Stash-Academic-Alarm-v1.0.apk`;

    // Trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = `Stash-Academic-v${updateInfo?.latestVersion || CURRENT_APP_VERSION}.apk`;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setDownloadSuccess(true);
    setTimeout(() => {
      setIsDownloading(false);
    }, 2000);
  };

  return (
    <>
      {/* Floating Auto-Update Prompt Banner when a newer release is detected */}
      {hasPromptedBanner && updateInfo?.hasUpdate && !isOpen && (
        <div className="fixed bottom-5 right-5 z-40 max-w-sm w-full bg-neutral-900 border border-purple-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400">
                  Update Available
                </span>
                <button
                  onClick={() => setHasPromptedBanner(false)}
                  className="text-neutral-500 hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <h4 className="text-sm font-bold text-white truncate mt-0.5">
                Stash v{updateInfo.latestVersion} is Ready!
              </h4>
              <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                New enhancements, DND alarm fixes, and academic tools.
              </p>
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => setIsOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-white text-black text-xs font-bold hover:bg-neutral-200 transition"
                >
                  View & Update
                </button>
                <button
                  onClick={() => setHasPromptedBanner(false)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 text-xs hover:text-white transition"
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main In-App Update Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-3xl p-6 shadow-2xl overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Stash App Updates</h3>
                  <p className="text-[11px] font-mono text-neutral-500">
                    In-App Software Management & Release Hub
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-neutral-900 text-neutral-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="py-5 space-y-5">
              
              {/* Version Comparison Card */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                    Installed Version
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white font-mono">
                      v{CURRENT_APP_VERSION}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-[10px] text-neutral-300 font-mono">
                      Current
                    </span>
                  </div>
                </div>

                <div
                  className={`p-3.5 rounded-2xl border ${
                    updateInfo?.hasUpdate
                      ? "bg-purple-500/10 border-purple-500/30"
                      : "bg-emerald-500/10 border-emerald-500/30"
                  }`}
                >
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                    Latest Remote Version
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-base font-bold font-mono ${
                        updateInfo?.hasUpdate ? "text-purple-400" : "text-emerald-400"
                      }`}
                    >
                      v{updateInfo?.latestVersion || CURRENT_APP_VERSION}
                    </span>
                    {updateInfo?.hasUpdate ? (
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold">
                        New!
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                        Latest ✓
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Message */}
              {isChecking ? (
                <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center gap-3 text-neutral-300">
                  <RefreshCw className="w-5 h-5 text-purple-400 animate-spin" />
                  <span className="text-xs font-mono">Checking GitHub Releases for updates...</span>
                </div>
              ) : updateInfo?.hasUpdate ? (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-purple-400 text-xs font-bold font-mono">
                      <Sparkles className="w-4 h-4" />
                      <span>Release: {updateInfo.releaseName}</span>
                    </div>
                    <div className="text-xs text-neutral-300 leading-relaxed whitespace-pre-wrap max-h-36 overflow-y-auto pr-2 font-mono text-[11px] bg-black/40 p-3 rounded-xl border border-white/5">
                      {updateInfo.releaseNotes}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      Updating will upgrade your app seamlessly without losing your saved tasks or profile data.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-400">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Stash is completely up to date!</h4>
                    <p className="text-[11px] text-emerald-400/80 font-mono mt-0.5">
                      You are running the newest build with native DND bypass and AI synthesis tools.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => handleCheck(true)}
                disabled={isChecking}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white text-xs font-mono font-bold transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? "animate-spin" : ""}`} />
                <span>Check Again</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={updateInfo?.releaseUrl || GITHUB_RELEASES_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white text-xs font-mono transition flex items-center gap-1.5"
                  title="View GitHub Releases"
                >
                  <span>Releases</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  type="button"
                  onClick={handleInstallUpdate}
                  disabled={isDownloading}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {downloadSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Download Started!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-black" />
                      <span>
                        {updateInfo?.hasUpdate ? "Download & Install Update" : "Download Latest APK"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
