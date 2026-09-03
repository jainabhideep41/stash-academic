"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  FolderArchive,
  FileText,
  UserCircle,
} from "lucide-react";
import { HapticEngine } from "@/lib/hapticEngine";

export function NativeMobileTabBar() {
  const pathname = usePathname();

  const tabs = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Assessment",
      href: "/assessment",
      icon: Sparkles,
    },
    {
      name: "Vault",
      href: "/vault",
      icon: FolderArchive,
    },
    {
      name: "Notes",
      href: "/notes",
      icon: FileText,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: UserCircle,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/90 backdrop-blur-xl border-t border-neutral-800/80 pb-[max(env(safe-area-inset-bottom),10px)] pt-2 px-3 shadow-2xl">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              onClick={() => HapticEngine.trigger("selection")}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? "text-white font-bold"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <div
                className={`relative p-1.5 rounded-xl transition-all ${
                  isActive
                    ? "bg-white text-black shadow-md scale-105"
                    : "hover:bg-neutral-900"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-black" : "text-neutral-400"}`} />
              </div>
              <span className="text-[10px] tracking-tight font-medium">
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
