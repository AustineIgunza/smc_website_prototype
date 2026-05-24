import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible auth config (used by middleware).
 * Does NOT include Credentials provider or Prisma (Node-only deps).
 */
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected =
        nextUrl.pathname.startsWith("/admin") ||
        nextUrl.pathname.startsWith("/dashboard");

      if (isProtected && !isLoggedIn) {
        return Response.redirect(new URL("/login", nextUrl));
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
