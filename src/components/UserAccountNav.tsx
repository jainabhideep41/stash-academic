"use client";

import { signOut, useSession } from "next-auth/react";
import React from "react";
import { LogOut, BookOpen } from "lucide-react";
import Link from "next/link";

export function UserAccountNav() {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  const user = session.user;

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/dashboard"
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-sm font-medium hover:bg-indigo-600/30 transition"
      >
        <BookOpen className="w-4 h-4 text-indigo-400" />
        <span>Dashboard</span>
      </Link>

      <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-full px-3 py-1.5">
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || "Student profile"}
            className="w-7 h-7 rounded-full border border-slate-700 object-cover"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
            {user.name?.charAt(0) || "S"}
          </div>
        )}
        <span className="text-sm text-slate-200 font-medium hidden sm:inline">
          {user.name || user.email}
        </span>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          title="Sign Out"
          className="text-slate-400 hover:text-rose-400 p-1 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
