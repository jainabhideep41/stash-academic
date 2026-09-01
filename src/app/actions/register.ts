"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email";

export interface RegisterFormData {
  name: string;
  branch: string;
  yearOfStudy: string;
  uidNumber: string;
}

export async function completeRegistration(formData: RegisterFormData) {
  const session = await auth();

  if (!session?.user?.email) {
    return { success: false, error: "Unauthorized. Please sign in with Google or GitHub first." };
  }

  const { name, branch, yearOfStudy, uidNumber } = formData;

  if (!name.trim() || !branch.trim() || !yearOfStudy.trim() || !uidNumber.trim()) {
    return { success: false, error: "Please fill in all profile fields to complete registration." };
  }

  try {
    // 1. Update in Prisma / Database if reachable
    if (process.env.DATABASE_URL) {
      try {
        await prisma.user.upsert({
          where: { email: session.user.email },
          update: {
            name,
            branch,
            yearOfStudy,
            uidNumber,
            isRegistered: true,
          },
          create: {
            email: session.user.email,
            name,
            image: session.user.image,
            branch,
            yearOfStudy,
            uidNumber,
            isRegistered: true,
          },
        });
      } catch (dbErr) {
        console.warn("Prisma update warning (continuing with session update):", dbErr);
      }
    }

    // 2. Dispatch Welcome Email Notification
    await sendWelcomeEmail({
      email: session.user.email,
      name,
      branch,
      yearOfStudy,
      uidNumber,
    });

    return {
      success: true,
      message: "Registration completed successfully! Welcome email sent.",
    };
  } catch (err: any) {
    console.error("Registration error:", err);
    return { success: false, error: err.message || "Failed to complete registration." };
  }
}
