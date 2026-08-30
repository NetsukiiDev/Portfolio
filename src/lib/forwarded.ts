import type { NextRequest } from "next/server";

/**
 * Reading the request as the *visitor* made it, not as it reached this
 * process. Behind a reverse proxy — Cloudflare Tunnel, nginx, Caddy — the hop
 * to the origin is plain HTTP even when the browser is on HTTPS, so anything
 * that depends on the scheme has to ask the forwarded headers instead.
 *
 * These headers are trivially spoofable by anyone who can reach the origin
 * directly, so only use them for decisions where a lie makes the result
 * stricter (a Secure cookie), never for access control.
 */
export function getRequestProtocol(request: NextRequest): "http" | "https" {
  // cloudflared and every mainstream proxy set this.
  const forwarded = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim().toLowerCase();
  if (forwarded === "https" || forwarded === "http") return forwarded;

  // Cloudflare also sends the scheme as JSON; worth reading when a proxy in
  // front of cloudflared has already consumed x-forwarded-proto.
  const visitor = request.headers.get("cf-visitor");
  if (visitor?.includes('"https"')) return "https";

  return request.nextUrl.protocol === "https:" ? "https" : "http";
}

/**
 * Whether the browser is talking HTTPS. Used for the `Secure` cookie flag:
 * keying it off NODE_ENV instead means a production build served over plain
 * HTTP on a LAN sets a cookie the browser then refuses to send back, and
 * logging in fails with no visible reason.
 */
export function isSecureRequest(request: NextRequest): boolean {
  return getRequestProtocol(request) === "https";
}
