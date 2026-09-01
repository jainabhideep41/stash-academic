import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppLayoutShell } from "@/components/AppLayoutShell";
import { FileVaultClient } from "@/components/FileVaultClient";

export default async function VaultPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <AppLayoutShell user={session.user}>
      <FileVaultClient currentUser={session.user} />
    </AppLayoutShell>
  );
}
