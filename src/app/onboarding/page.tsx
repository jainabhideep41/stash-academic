import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { OnboardingClient } from "@/components/OnboardingClient";
import { prisma } from "@/lib/prisma";

export default async function OnboardingPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const user = session.user;
  const normalizedEmail = user.email ? user.email.toLowerCase().trim() : "";
  const emailKey = normalizedEmail ? Buffer.from(normalizedEmail).toString("hex") : "";

  // Check if this student is ALREADY registered
  const cookieStore = await cookies();
  const isRegisteredCookie = cookieStore.get("stash_registered")?.value === "true";
  const emailProfileRaw = emailKey ? cookieStore.get(`stash_reg_${emailKey}`)?.value : null;

  let isAlreadyRegistered = isRegisteredCookie;

  if (emailProfileRaw) {
    try {
      const parsed = JSON.parse(emailProfileRaw);
      if (parsed.isRegistered) isAlreadyRegistered = true;
    } catch {}
  }

  if (normalizedEmail && process.env.DATABASE_URL) {
    try {
      const dbUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });
      if (dbUser?.isRegistered) {
        isAlreadyRegistered = true;
      }
    } catch (e) {
      console.warn("DB check fallback on onboarding:", e);
    }
  }

  // If already registered under this email, skip onboarding completely!
  if (isAlreadyRegistered) {
    redirect("/dashboard");
  }

  return <OnboardingClient initialUser={session.user} />;
}
