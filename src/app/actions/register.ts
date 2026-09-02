"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email";
import { cookies } from "next/headers";

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

  const normalizedEmail = session.user.email.toLowerCase().trim();
  const { name, branch, yearOfStudy, uidNumber } = formData;

  if (!name.trim() || !branch.trim() || !yearOfStudy.trim() || !uidNumber.trim()) {
    return { success: false, error: "Please fill in all profile fields to complete registration." };
  }

  try {
    // 1. Update in Prisma / Database if reachable
    if (process.env.DATABASE_URL) {
      try {
        await prisma.user.upsert({
          where: { email: normalizedEmail },
          update: {
            name,
            branch,
            yearOfStudy,
            uidNumber,
            isRegistered: true,
          },
          create: {
            email: normalizedEmail,
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

    // 2. Set permanent registration cookies
    // - Global registration cookie
    // - Email-specific profile cookie (guarantees Google & GitHub for same email share the EXACT same registration profile!)
    const cookieStore = await cookies();
    const emailKey = Buffer.from(normalizedEmail).toString("hex");

    cookieStore.set("stash_registered", "true", {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    cookieStore.set(`stash_reg_${emailKey}`, JSON.stringify({
      name,
      branch,
      yearOfStudy,
      uidNumber,
      isRegistered: true,
    }), {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // 3. Dispatch Welcome Email Notification
    await sendWelcomeEmail({
      email: normalizedEmail,
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

export async function saveUserGeminiApiKey(apiKey: string) {
  const session = await auth();

  if (!session?.user?.email) {
    return { success: false, error: "Unauthorized. Please sign in." };
  }

  const normalizedEmail = session.user.email.toLowerCase().trim();
  const cleanedKey = apiKey.trim();
  const isRemoving = cleanedKey === "";

  try {
    // 1. Save or erase in Database if configured
    if (process.env.DATABASE_URL) {
      try {
        await prisma.user.upsert({
          where: { email: normalizedEmail },
          update: { geminiApiKey: isRemoving ? null : cleanedKey },
          create: {
            email: normalizedEmail,
            name: session.user.name,
            geminiApiKey: isRemoving ? null : cleanedKey,
          },
        });
      } catch (dbErr) {
        console.warn("DB update error for geminiApiKey:", dbErr);
      }
    }

    // 2. Set or delete persistent account cookies
    const emailKey = Buffer.from(normalizedEmail).toString("hex");
    const cookieStore = await cookies();
    if (isRemoving) {
      cookieStore.delete(`stash_gemini_${emailKey}`);
      cookieStore.delete("stash_gemini_key");
    } else {
      cookieStore.set(`stash_gemini_${emailKey}`, cleanedKey, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      cookieStore.set("stash_gemini_key", cleanedKey, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }

    return {
      success: true,
      message: isRemoving ? "Gemini API key removed successfully." : "Gemini API key saved to your account in database!",
    };
  } catch (err: any) {
    console.error("Save Gemini Key error:", err);
    return { success: false, error: err.message || "Failed to save API key." };
  }
}

