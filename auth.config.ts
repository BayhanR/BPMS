import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/signin",
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true, // VDS için gerekli
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnProjects = nextUrl.pathname.startsWith("/projects");
      const isOnCalendar = nextUrl.pathname.startsWith("/calendar");
      const isOnTeam = nextUrl.pathname.startsWith("/team");
      const isOnAuth = nextUrl.pathname.startsWith("/signin") || nextUrl.pathname.startsWith("/signup");

      if (isOnAuth && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      if ((isOnDashboard || isOnProjects || isOnCalendar || isOnTeam) && !isLoggedIn) {
        return Response.redirect(new URL("/signin", nextUrl));
      }

      return true;
    },
  },
  providers: [], // Providers are added in auth.ts
} satisfies NextAuthConfig;

