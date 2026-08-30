import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getSetupStatus, isMaintenanceOn } from "@/lib/setup";

const PUBLIC_ADMIN_ROUTES = ["/admin/login"];
const ADMIN_ROUTES = ["/admin"];

const PROTECTED_API_ROUTES = [
  "/api/projects",
  "/api/skills",
  "/api/tools",
  "/api/experience",
  "/api/blog",
  "/api/ai-gallery",
  "/api/settings",
  "/api/upload",
  "/api/account",
  "/api/admin",
];

// This runs on every single request, and getSetupStatus() is two database
// queries — so the answer is held briefly. The window is short on purpose:
// a site reset wipes the schema without restarting the process, and the
// wizard has to become reachable again straight after.
const STATE_TTL_MS = 5000;
let cachedStatus: { at: number; value: Awaited<ReturnType<typeof getSetupStatus>> } | null = null;
let cachedMaintenance: { at: number; value: boolean } | null = null;

async function readSetupStatus() {
  if (cachedStatus && Date.now() - cachedStatus.at < STATE_TTL_MS) return cachedStatus.value;
  const value = await getSetupStatus();
  cachedStatus = { at: Date.now(), value };
  return value;
}

async function readMaintenance() {
  if (cachedMaintenance && Date.now() - cachedMaintenance.at < STATE_TTL_MS) return cachedMaintenance.value;
  const value = await isMaintenanceOn();
  cachedMaintenance = { at: Date.now(), value };
  return value;
}

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

  const isSetupRoute = pathname === "/setup" || pathname.startsWith("/api/setup");

  const setupStatus = await readSetupStatus();

  if (setupStatus !== "complete") {
    if (!isSetupRoute) {
      return NextResponse.redirect(new URL("/setup", request.url));
    }
  } else if (pathname === "/setup") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // With maintenance on, the public site is replaced outright — the admin,
  // its API and the wizard stay reachable, and so does the site itself for
  // whoever is logged in, so you can check your own work.
  const isPublicPage =
    !pathname.startsWith("/admin") &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/_next") &&
    !isSetupRoute &&
    pathname !== "/maintenance";

  if (isPublicPage && (await readMaintenance()) && !(await isValidSession(request))) {
    return NextResponse.rewrite(new URL("/maintenance", request.url));
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
