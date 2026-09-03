import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
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
    Credentials({
      id: "google-native",
      name: "Google Native",
      credentials: {
        email: { label: "Email", type: "text" },
        name: { label: "Name", type: "text" },
        image: { label: "Image", type: "text" },
        idToken: { label: "ID Token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        const email = (credentials.email as string).toLowerCase().trim();
        
        // Upsert user in database if DB is attached
        if (process.env.DATABASE_URL) {
          try {
            await prisma.user.upsert({
              where: { email },
              update: {
                name: (credentials.name as string) || undefined,
                image: (credentials.image as string) || undefined,
              },
              create: {
                email,
                name: (credentials.name as string) || "Student",
                image: (credentials.image as string) || null,
              },
            });
          } catch (e) {
            console.warn("DB upsert fallback for native Google signin:", e);
          }
        }

        return {
          id: email,
          email: email,
          name: (credentials.name as string) || "Student",
          image: (credentials.image as string) || null,
        };
      },
    }),
  ],
  pages: {
    signIn: "/",
    error: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.email) {
        const normalizedEmail = user.email.toLowerCase().trim();
        token.email = normalizedEmail;
        token.sub = normalizedEmail;
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
