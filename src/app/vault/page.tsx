import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UserAccountNav } from "@/components/UserAccountNav";
import { FileVaultClient } from "@/components/FileVaultClient";
import { FolderArchive, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function VaultPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-[#0b0f19]/90 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <FolderArchive className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white">Stash Vault</span>
            </Link>
          </div>

          <UserAccountNav />
        </div>
      </header>

      {/* Vault Client Interactive Component */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <FileVaultClient currentUser={session.user} />
      </main>
    </div>
  );
}
