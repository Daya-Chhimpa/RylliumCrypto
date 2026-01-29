import { NextResponse } from "next/server";
const AUTH_COOKIE = "auth";

export function middleware(request) {
  const isAuth = request.cookies.get(AUTH_COOKIE)?.value === "1";
  const { pathname } = request.nextUrl;
  
  // Define protected routes
  const protectedRoutes = ["/dashboard", "/settings", "/wallets"]; 
  // Should adjust this list based on actual app structure
  
  // Define auth routes (public but redirect to dashboard if logged in)
  const authRoutes = ["/signin", "/signup", "/forgot-password"];

  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  if (isProtected && !isAuth) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (isAuthRoute && isAuth) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
