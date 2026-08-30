/**
 * Cloudflare Tunnel, run by the app rather than alongside it: `cloudflared`
 * is spawned as a child process and driven from Impostazioni → Tunnel.
 *
 * Client-safe — no child_process here. The manager that actually spawns
 * anything lives in ./manager, which only API routes and instrumentation
 * import.
 */

/**
 * - `token`: a tunnel created in the Cloudflare Zero Trust dashboard. The
 *   hostname and routing live there; the app only needs the connector token.
 *   This is the one to use for a site meant to stay up.
 * - `quick`: no account, no token. Cloudflare hands out a random
 *   `*.trycloudflare.com` address that lasts as long as the process does —
 *   useful to put the site online for five minutes and show someone.
 */
export type TunnelMode = "token" | "quick";

export interface TunnelSettings {
  /** Start the tunnel with the server, rather than only by hand. */
  enabled: boolean;
  mode: TunnelMode;
  /** Connector token for `mode: "token"`. Masked everywhere it leaves the server. */
  token: string;
  /** The hostname routed to the tunnel in the dashboard. Only used to link to it. */
  hostname: string;
  /** Where cloudflared is installed, when it isn't simply on PATH. */
  binaryPath: string;
}

export const DEFAULT_TUNNEL_SETTINGS: TunnelSettings = {
  enabled: false,
  mode: "token",
  token: "",
  hostname: "",
  binaryPath: "",
};

export type TunnelState =
  | "stopped"
  /** Process spawned, no connection registered with Cloudflare yet. */
  | "starting"
  | "connected"
  /** Exited on its own, or never started. `error` says why. */
  | "error";

export interface TunnelStatus {
  state: TunnelState;
  /** The address the site is reachable at, once it's known. */
  url: string | null;
  error: string | null;
  /** Tail of cloudflared's own output, token redacted. Newest last. */
  logs: string[];
  startedAt: string | null;
  /** False when cloudflared isn't installed, which is its own kind of stopped. */
  binaryFound: boolean;
  /** Whether the copy that ships with the app is on disk, or only one on PATH. */
  managedBinary: boolean;
}

export const TUNNEL_SECRET_MASK = "••••••••";

export function maskTunnelSecrets(tunnel: TunnelSettings): TunnelSettings {
  return { ...tunnel, token: tunnel.token ? TUNNEL_SECRET_MASK : "" };
}

/** Fills in anything missing, so adding a field later doesn't break stored rows. */
export function mergeTunnelSettings(stored: unknown): TunnelSettings {
  const value = (stored ?? {}) as Partial<TunnelSettings>;
  return { ...DEFAULT_TUNNEL_SETTINGS, ...value };
}
