import { NextResponse } from "next/server";

export function middleware(request) {
  const accessToken = request.cookies.get("accessCookie")?.value;
  const refreshToken = request.cookies.get("refreshCookie")?.value;
  const { pathname } = request.nextUrl;
  
  console.log("Middleware check:", { pathname, accessToken, refreshToken });
  // 🔒 ProtectedRoute equivalent
  if (!accessToken && !refreshToken && pathname.startsWith("/chat")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 🌐 PublicRoute equivalent
  if ((accessToken || refreshToken) && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/chat/:path*"],
};