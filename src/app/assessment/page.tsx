import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AppLayoutShell } from "@/components/AppLayoutShell";
import { AssessmentStudioClient } from "@/components/AssessmentStudioClient";
import { prisma } from "@/lib/prisma";

export default async function AssessmentPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const user = session.user;
  const normalizedEmail = user.email ? user.email.toLowerCase().trim() : "";
  const emailKey = normalizedEmail ? Buffer.from(normalizedEmail).toString("hex") : "";

  // Retrieve unified profile
  const cookieStore = await cookies();
  const emailProfileRaw = emailKey ? cookieStore.get(`stash_reg_${emailKey}`)?.value : null;
  let emailProfile: any = null;
  if (emailProfileRaw) {
    try {
      emailProfile = JSON.parse(emailProfileRaw);
    } catch {}
  }

  let dbUser = null;
  if (normalizedEmail && process.env.DATABASE_URL) {
    try {
      dbUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });
    } catch (e) {
      console.warn("DB user fetch fallback:", e);
    }
  }

  const studentDetails = {
    branch: dbUser?.branch || emailProfile?.branch || "Computer Science & Engineering",
    yearOfStudy: dbUser?.yearOfStudy || emailProfile?.yearOfStudy || "III",
    uidNumber: dbUser?.uidNumber || emailProfile?.uidNumber || "23CS01049",
  };

  return (
    <AppLayoutShell user={user}>
      <AssessmentStudioClient currentUser={user} studentDetails={studentDetails} />
    </AppLayoutShell>
  );
}
