"use client";

import React, { useState } from "react";
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
  Menu,
  X,
  ChevronRight,
  UserCircle,
  Sparkles,
} from "lucide-react";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    if (pathname === "/assessment") return "Assessment Studio & Synthesis";
    if (pathname === "/vault") return "File Vault & Sharing";
    if (pathname === "/notes") return "Notes & Study Guides";
    if (pathname === "/profile") return "Student Profile & Credentials";
    return "Workspace";
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row selection:bg-white selection:text-black">
      
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-neutral-950 border-b border-neutral-800 sticky top-0 z-50">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
            <FolderArchive className="w-4 h-4 text-black" />
          </div>
          <span className="font-black text-base tracking-tight text-white font-display">
            STASH
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/profile" className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800">
            {user.image ? (
              <img src={user.image} alt="Profile" className="w-6 h-6 rounded-full object-cover" />
            ) : (
              <UserCircle className="w-6 h-6 text-slate-300" />
            )}
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-neutral-400 hover:text-white"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-neutral-950 border-r border-neutral-800 flex flex-col justify-between p-4 transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
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
                  onClick={() => setSidebarOpen(false)}
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

        {/* User Account Footer Block with Direct Profile Link */}
        <div className="border-t border-neutral-800 pt-4 space-y-3">
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
        
        {/* Top Header Bar */}
        <header className="hidden md:flex items-center justify-between h-16 px-8 border-b border-neutral-800 bg-black/90 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-neutral-500">Stash</span>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
            <span className="text-white font-bold">{getPageTitle()}</span>
          </div>

          <div className="flex items-center gap-4">
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

        {/* Page Content Body */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">{children}</main>

      </div>

    </div>
  );
}
