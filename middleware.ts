import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const PUBLIC_ACCOUNT_PATHS = ["/account/login", "/account/signup"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin") && pathname !== "/admin/login" && pathname !== "/admin/setup";
  const isAccountRoute = pathname.startsWith("/account") && !PUBLIC_ACCOUNT_PATHS.includes(pathname);
  const isApiRoute = pathname.startsWith("/api/admin");

  if ((isAdminRoute || isAccountRoute || isApiRoute) && !req.auth) {
    const loginUrl = new URL(isAccountRoute ? "/account/login" : "/admin/login", req.nextUrl.origin);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/api/admin/:path*"],
};
