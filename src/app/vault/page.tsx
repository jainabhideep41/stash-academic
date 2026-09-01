import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AppLayoutShell } from "@/components/AppLayoutShell";
import { FileVaultClient } from "@/components/FileVaultClient";
import { prisma } from "@/lib/prisma";

export default async function VaultPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  // Enforce registration check
  const cookieStore = await cookies();
  const isRegisteredCookie = cookieStore.get("stash_registered")?.value === "true";

  let dbUser = null;
  if (session.user.email && process.env.DATABASE_URL) {
    try {
      dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
    } catch (e) {
      console.warn("DB check fallback:", e);
    }
  }

  const isRegistered = isRegisteredCookie || (dbUser?.isRegistered === true);

  if (!isRegistered) {
    redirect("/onboarding");
  }

  return (
    <AppLayoutShell user={session.user}>
      <FileVaultClient currentUser={session.user} />
    </AppLayoutShell>
  );
}
