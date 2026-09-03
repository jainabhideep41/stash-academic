"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  FolderArchive,
  LayoutDashboard,
  FileText,
  UploadCloud,
  LogOut,
  Plus,
  ChevronRight,
  UserCircle,
  Sparkles,
} from "lucide-react";
import { GlobalAlarmProvider } from "./GlobalAlarmProvider";
import { AppUpdateModal } from "./AppUpdateModal";
import { NativeMobileTabBar } from "./NativeMobileTabBar";
import { CURRENT_APP_VERSION } from "@/lib/appVersion";
import { NativeMobileEngine } from "@/lib/nativeMobileEngine";
import { HapticEngine } from "@/lib/hapticEngine";

interface AppLayoutShellProps {
  children: React.ReactNode;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function AppLayoutShell({ children, user }: AppLayoutShellProps) {
  const pathname = usePathname();

  // Initialize native status bar, splash screen, and hardware back button
  React.useEffect(() => {
    NativeMobileEngine.init();
  }, []);

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Assessment Studio",
      href: "/assessment",
      icon: Sparkles,
    },
    {
      name: "File Vault",
      href: "/vault",
      icon: FolderArchive,
    },
    {
      name: "Notes Hub",
      href: "/notes",
      icon: FileText,
    },
    {
      name: "My Profile",
      href: "/profile",
      icon: UserCircle,
    },
  ];

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname === "/assessment") return "Assessment Studio";
    if (pathname === "/vault") return "File Vault";
    if (pathname === "/notes") return "Notes Hub";
    if (pathname === "/profile") return "Profile & Settings";
    return "Stash";
  };

  return (
    <GlobalAlarmProvider>
      <div className="min-h-screen bg-black text-white flex flex-col md:flex-row selection:bg-white selection:text-black">
        
        {/* Native Mobile App Bar (Fixed Top with AMOLED Blur & Safe Area Inset) */}
        <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-black/85 backdrop-blur-xl border-b border-neutral-800/80 pt-[max(env(safe-area-inset-top),8px)] pb-3 px-4 shadow-lg flex items-center justify-between">
          <Link
            href="/profile"
            onClick={() => HapticEngine.trigger("selection")}
            className="flex items-center gap-2.5 active:scale-95 transition-transform"
          >
            <div className="relative">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "Student"}
                  className="w-8 h-8 rounded-full border border-neutral-700 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-xs font-black text-white shadow-sm">
                  {user.name?.charAt(0) || "S"}
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-black" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-mono text-neutral-400 leading-none">
                Student Portal
              </span>
              <span className="text-xs font-bold text-white truncate max-w-[120px] leading-tight">
                {user.name || "Student"}
              </span>
            </div>
          </Link>

          {/* Screen Title */}
          <div className="text-center">
            <h1 className="text-sm font-black text-white tracking-tight font-display">
              {getPageTitle()}
            </h1>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                HapticEngine.trigger("light");
                window.dispatchEvent(new CustomEvent("stash_check_updates"));
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 active:scale-95 transition text-[11px] font-mono font-bold"
              title="App Version & Updates"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>v{CURRENT_APP_VERSION}</span>
            </button>
          </div>
        </header>

        {/* Desktop Sidebar Navigation (Visible on md+ screens only) */}
        <aside className="hidden md:flex flex-col justify-between w-64 bg-neutral-950 border-r border-neutral-800 p-4 shrink-0 min-h-screen sticky top-0">
          <div className="space-y-6">
            {/* App Logo Header */}
            <Link href="/dashboard" className="flex items-center gap-3 px-2 pt-2 group">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-black font-bold shadow-sm group-hover:scale-105 transition-transform">
                <FolderArchive className="w-5 h-5 text-black" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg tracking-tight text-white font-display">
                  STASH
                </span>
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-neutral-400">
                  ✳︎ ACADEMIC VAULT
                </span>
              </div>
            </Link>

            {/* Quick Upload / Action Button */}
            <div className="pt-2">
              <Link
                href="/vault"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs transition shadow-sm"
              >
                <UploadCloud className="w-4 h-4 text-black" />
                <span>Upload File</span>
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1 pt-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-500 px-3 block mb-2">
                Navigation
              </span>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                      isActive
                        ? "bg-neutral-900 text-white border border-neutral-700 shadow-sm"
                        : "text-neutral-400 hover:text-white hover:bg-neutral-900/50"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-neutral-400"}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Account Footer Block with Direct Profile Link & Update Checker */}
          <div className="border-t border-neutral-800 pt-4 space-y-3">
            {/* Version & Update Trigger Badge */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("stash_check_updates"))}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-neutral-900/70 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white text-xs font-mono transition group cursor-pointer"
              title="Check for App Updates"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[11px] font-bold text-slate-300">v{CURRENT_APP_VERSION}</span>
              </div>
              <span className="text-[10px] text-purple-400 font-bold group-hover:underline">
                Updates &rarr;
              </span>
            </button>

            <div className="flex items-center justify-between px-2">
              <Link
                href="/profile"
                title="View & Edit Profile"
                className="flex items-center gap-3 overflow-hidden group hover:opacity-80 transition cursor-pointer"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "Student"}
                    className="w-8 h-8 rounded-full border border-neutral-700 object-cover shrink-0 group-hover:border-purple-500 transition"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-bold text-black shrink-0">
                    {user.name?.charAt(0) || "S"}
                  </div>
                )}
                <div className="overflow-hidden text-left">
                  <h4 className="text-xs font-bold text-white truncate group-hover:text-purple-300 transition">
                    {user.name || "Student"}
                  </h4>
                  <p className="text-[10px] text-neutral-500 font-mono truncate">View Profile &rarr;</p>
                </div>
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                title="Sign Out"
                className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main App Workspace Content */}
        <div className="flex-1 flex flex-col min-w-0 bg-black">
          
          {/* Desktop Top Header Bar */}
          <header className="hidden md:flex items-center justify-between h-16 px-8 border-b border-neutral-800 bg-black/90 backdrop-blur-md sticky top-0 z-30">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-neutral-500">Stash</span>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
              <span className="text-white font-bold">{getPageTitle()}</span>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("stash_check_updates"))}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-mono font-bold transition cursor-pointer"
                title="Check for software updates"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>v{CURRENT_APP_VERSION}</span>
              </button>

              <Link
                href="/notes"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white text-xs font-bold transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Note</span>
              </Link>

              <Link
                href="/profile"
                className="flex items-center gap-2 pl-3 border-l border-neutral-800 hover:opacity-80 transition"
                title="My Student Profile"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "Profile"}
                    className="w-7 h-7 rounded-full border border-neutral-700 object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-white text-black font-bold text-xs flex items-center justify-center">
                    {user.name?.charAt(0) || "S"}
                  </div>
                )}
                <span className="text-xs font-bold text-slate-300 hidden xl:inline">
                  {user.name || "Profile"}
                </span>
              </Link>
            </div>
          </header>

          {/* Page Content Body (Top-padded on mobile for app bar, bottom-padded for bottom bar) */}
          <main className="p-3 sm:p-6 lg:p-8 flex-1 pt-18 md:pt-6 pb-28 md:pb-8">{children}</main>

          {/* In-App Auto-Update Modal & Banners */}
          <AppUpdateModal />

          {/* Native Mobile Bottom Tab Bar */}
          <NativeMobileTabBar />

        </div>

      </div>
    </GlobalAlarmProvider>
  );
}
