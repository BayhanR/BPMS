import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth((req: NextRequest & { auth?: any }) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Public routes
  const publicRoutes = ["/", "/signin", "/signup"];
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  // Protected routes
  const protectedRoutes = ["/dashboard", "/projects", "/calendar", "/team"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  // If on public route and logged in, redirect to dashboard
  if (isPublicRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // If on protected route and not logged in, redirect to signin
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/signin", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

