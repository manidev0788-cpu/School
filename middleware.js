import { NextResponse } from "next/server";
import {
  AUTH_COOKIE,
  PUBLIC_PATHS,
  ROLE_HOME,
  matchesAdminRoute,
  matchesParentRoute,
  matchesTeacherRoute,
} from "@/lib/auth-config";

const VALID_ROLES = new Set(["admin", "teacher", "parent"]);

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const raw = request.cookies.get(AUTH_COOKIE)?.value;
  const role = raw && VALID_ROLES.has(raw) ? raw : null;

  // Public marketing / login
  if (PUBLIC_PATHS.has(pathname)) {
    if (pathname === "/" && role) {
      const home = ROLE_HOME[role];
      return NextResponse.redirect(new URL(home, request.url));
    }
    return NextResponse.next();
  }

  if (!role) {
    const login = new URL("/", request.url);
    login.searchParams.set("from", pathname);
    return NextResponse.redirect(login);
  }

  if (matchesAdminRoute(pathname)) {
    if (role === "admin") return NextResponse.next();
    return NextResponse.redirect(new URL(ROLE_HOME[role], request.url));
  }

  if (matchesTeacherRoute(pathname)) {
    if (role === "teacher") return NextResponse.next();
    return NextResponse.redirect(new URL(ROLE_HOME[role], request.url));
  }

  if (matchesParentRoute(pathname)) {
    if (role === "parent") return NextResponse.next();
    return NextResponse.redirect(new URL(ROLE_HOME[role], request.url));
  }

  if (role === "admin") return NextResponse.next();

  return NextResponse.redirect(new URL(ROLE_HOME[role], request.url));
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.ico|.*\\.jpg|.*\\.jpeg|.*\\.webp|.*\\.gif).*)",
  ],
};
