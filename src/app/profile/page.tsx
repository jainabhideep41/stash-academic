import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppLayoutShell } from "@/components/AppLayoutShell";
import { ProfileClient } from "@/components/ProfileClient";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const user = session.user;

  // Retrieve user details from database if available
  let dbUser = null;
  if (user.email && process.env.DATABASE_URL) {
    try {
      dbUser = await prisma.user.findUnique({
        where: { email: user.email },
      });
    } catch (e) {
      console.warn("DB user fetch fallback:", e);
    }
  }

  const studentDetails = {
    branch: dbUser?.branch || "Computer Science & Engineering",
    yearOfStudy: dbUser?.yearOfStudy || "III",
    uidNumber: dbUser?.uidNumber || "23CS01049",
  };

  return (
    <AppLayoutShell user={user}>
      <ProfileClient initialUser={user} studentDetails={studentDetails} />
    </AppLayoutShell>
  );
}
