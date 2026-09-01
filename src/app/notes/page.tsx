import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppLayoutShell } from "@/components/AppLayoutShell";
import { NotesClient } from "@/components/NotesClient";

export default async function NotesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <AppLayoutShell user={session.user}>
      <NotesClient currentUser={session.user} />
    </AppLayoutShell>
  );
}
