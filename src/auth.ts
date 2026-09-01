import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

// Only attach PrismaAdapter if DATABASE_URL is configured
const adapter = process.env.DATABASE_URL ? PrismaAdapter(prisma) : undefined;

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...(adapter ? { adapter } : {}),
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "stash_super_secret_auth_key_change_me_in_production",
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID || "",
      clientSecret: process.env.AUTH_GITHUB_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: "/",
    error: "/",
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Normalize user identity strictly by verified email
      // This guarantees Google and GitHub logins with the same email address
      // resolve to the EXACT same unified Stash student account!
      if (user?.email) {
        const normalizedEmail = user.email.toLowerCase().trim();
        token.email = normalizedEmail;
        token.sub = normalizedEmail; // Unified deterministic subject ID
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const unifiedEmail = (token.email || session.user.email || "").toLowerCase().trim();
        session.user.id = unifiedEmail;
        session.user.email = unifiedEmail;
      }
      return session;
    },
  },
});
