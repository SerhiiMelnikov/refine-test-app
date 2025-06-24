// src/middleware.ts
import { authProviderServer } from "@providers/auth-provider/auth-provider.server";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const publicPaths = ["/login", "/register", "/forgot-password"];

  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const { authenticated, redirectTo } = await authProviderServer.check();

  if (!authenticated) {
    const loginUrl = new URL(redirectTo || "/login", request.url);
    loginUrl.searchParams.set("returnTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};