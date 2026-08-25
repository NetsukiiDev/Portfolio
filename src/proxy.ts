import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getSetupStatus } from "@/lib/setup";

const PUBLIC_ADMIN_ROUTES = ["/admin/login"];
const ADMIN_ROUTES = ["/admin"];

const PROTECTED_API_ROUTES = [
  "/api/projects",
  "/api/skills",
  "/api/experience",
  "/api/blog",
  "/api/ai-gallery",
  "/api/settings",
  "/api/upload",
  "/api/account",
  "/api/admin",
];

async function isValidSession(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get("admin-session")?.value;
  const secret = process.env.JWT_SECRET;
  if (!token || !secret) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // `/api/setup/*` routes check `getSetupStatus()` themselves and return JSON
  // either way — redirecting an API fetch here would be meaningless, and
  // calling it again in this gate would just double the wait when the
  // database is unreachable (each call pays its own connection timeout).
  const isApiSetupRoute = pathname.startsWith("/api/setup");

  if (!isApiSetupRoute) {
    const setupStatus = await getSetupStatus();

    if (setupStatus !== "complete") {
      if (pathname !== "/setup") {
        return NextResponse.redirect(new URL("/setup", request.url));
      }
    } else if (pathname === "/setup") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    if (PUBLIC_ADMIN_ROUTES.includes(pathname)) return NextResponse.next();

    if (!(await isValidSession(request))) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  if (PROTECTED_API_ROUTES.some((route) => pathname.startsWith(route))) {
    if (["POST", "PUT", "DELETE"].includes(method)) {
      if (!(await isValidSession(request))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
