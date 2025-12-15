import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth((req: NextRequest & { auth?: any }) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Public routes (giriş yapmadan erişilebilir)
  const publicRoutes = ["/", "/signin", "/signup"];
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  // Semi-public routes (görüntülenebilir ama işlem için giriş gerekli)
  const semiPublicRoutes = ["/invite"];
  const isSemiPublicRoute = semiPublicRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  // Protected routes (giriş gerekli)
  const protectedRoutes = [
    "/dashboard",
    "/projects", 
    "/calendar", 
    "/team",
    "/admin",
    "/settings",
    "/workspaces",
  ];
  const isProtectedRoute = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  // Auth sayfaları (signin/signup) - giriş yapmışsa dashboard'a yönlendir
  const isAuthRoute = ["/signin", "/signup"].includes(nextUrl.pathname);
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Ana sayfa - giriş yapmışsa dashboard'a yönlendir
  if (nextUrl.pathname === "/" && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Protected route - giriş yapmamışsa signin'e yönlendir
  if (isProtectedRoute && !isLoggedIn) {
    const callbackUrl = encodeURIComponent(nextUrl.pathname);
    return NextResponse.redirect(new URL(`/signin?callbackUrl=${callbackUrl}`, nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.ico$).*)"],
};

