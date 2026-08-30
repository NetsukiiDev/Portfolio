import { spawn, type ChildProcess } from "child_process";
import { existsSync } from "fs";
import { bin as managedBin, install as installManagedBin } from "cloudflared";
import type { TunnelSettings, TunnelState, TunnelStatus } from "./types";

/**
 * Owns the `cloudflared` child process. Server-only: never import this from a
 * client component — it spawns processes.
 *
 * The state lives on globalThis for the same reason the Prisma client does:
 * a dev-mode hot reload re-evaluates this module, and a fresh module-level
 * variable would lose the handle on a process that is still running, leaving
 * an orphan nobody can stop.
 */
interface TunnelRuntime {
  child: ChildProcess | null;
  state: TunnelState;
  url: string | null;
  error: string | null;
  logs: string[];
  startedAt: number | null;
}

const globalForTunnel = globalThis as unknown as { tunnelRuntime?: TunnelRuntime };

function runtime(): TunnelRuntime {
  if (!globalForTunnel.tunnelRuntime) {
    globalForTunnel.tunnelRuntime = {
      child: null,
      state: "stopped",
      url: null,
      error: null,
      logs: [],
      startedAt: null,
    };
  }
  return globalForTunnel.tunnelRuntime;
}

const MAX_LOG_LINES = 60;

/** Recognises the address Cloudflare prints for a quick tunnel. */
const QUICK_URL = /https:\/\/[a-z0-9-]+\.trycloudflare\.com/i;

/** cloudflared says this once per edge connection it establishes. */
const REGISTERED = /Registered tunnel connection|Connection [a-z0-9-]+ registered/i;

/**
 * The only real logic in what cloudflared prints: the address a quick tunnel
 * was handed, and whether a connection is up. Pure and exported so it can be
 * checked against actual cloudflared output without spawning anything.
 */
export function readTunnelOutput(text: string): { url: string | null; connected: boolean } {
  return {
    url: text.match(QUICK_URL)?.[0] ?? null,
    connected: REGISTERED.test(text),
  };
}

/**
 * Which cloudflared to run, in order: one the admin pointed at explicitly,
 * the copy the `cloudflared` package fetches into node_modules on install,
 * or whatever is on PATH.
 *
 * The managed copy is why this doesn't ask anyone to install anything: it
 * arrives with `npm install`, lives outside the repo, and can be re-fetched
 * from the panel if it's missing.
 */
function binary(settings: TunnelSettings): string {
  const explicit = settings.binaryPath.trim();
  if (explicit) return explicit;
  if (existsSync(managedBin)) return managedBin;
  return "cloudflared";
}

/** True when the bundled copy is on disk, as opposed to one found on PATH. */
export function hasManagedBinary(): boolean {
  return existsSync(managedBin);
}

/**
 * Fetches the bundled copy from Cloudflare's own release channel. Only
 * needed when `npm install` couldn't (no network at the time, or install
 * scripts skipped).
 */
export async function downloadBinary(): Promise<void> {
  await installManagedBin(managedBin);
}

/**
 * cloudflared echoes its arguments in some error paths, so anything captured
 * from its output has the token stripped before being stored or shown.
 */
function redact(line: string, token: string): string {
  if (!token) return line;
  return line.split(token).join("«token»");
}

function log(line: string, token: string) {
  const state = runtime();
  for (const part of line.split(/\r?\n/)) {
    const trimmed = redact(part, token).trim();
    if (!trimmed) continue;
    state.logs.push(trimmed);
  }
  if (state.logs.length > MAX_LOG_LINES) {
    state.logs.splice(0, state.logs.length - MAX_LOG_LINES);
  }
}

function port(): string {
  return process.env.PORT ?? "3000";
}

function argsFor(settings: TunnelSettings): string[] {
  // --no-autoupdate: an update would restart the process out from under us,
  // and on a self-hosted box the admin decides when binaries change.
  const common = ["--no-autoupdate"];
  if (settings.mode === "quick") {
    return [...common, "tunnel", "--url", `http://localhost:${port()}`];
  }
  return [...common, "tunnel", "run", "--token", settings.token];
}

/** Whether the binary is there at all, which is the most common reason nothing happens. */
export async function isBinaryAvailable(settings: TunnelSettings): Promise<boolean> {
  return new Promise((resolve) => {
    const probe = spawn(binary(settings), ["--version"], { stdio: "ignore" });
    probe.on("error", () => resolve(false));
    probe.on("close", (code) => resolve(code === 0));
  });
}

export function getTunnelStatus(): Omit<TunnelStatus, "binaryFound" | "managedBinary"> {
  const state = runtime();
  return {
    state: state.state,
    url: state.url,
    error: state.error,
    logs: [...state.logs],
    startedAt: state.startedAt ? new Date(state.startedAt).toISOString() : null,
  };
}

export function isTunnelRunning(): boolean {
  const state = runtime();
  return state.child !== null && !state.child.killed;
}

export async function startTunnel(settings: TunnelSettings): Promise<TunnelStatus> {
  const state = runtime();

  if (isTunnelRunning()) return withBinary(settings);

  if (settings.mode === "token" && !settings.token.trim()) {
    state.state = "error";
    state.error = "Nessun token: incollalo qui sopra, oppure passa alla modalità rapida.";
    return withBinary(settings);
  }

  if (!(await isBinaryAvailable(settings))) {
    state.state = "error";
    state.error = settings.binaryPath
      ? `cloudflared non è eseguibile da "${settings.binaryPath}".`
      : "cloudflared non è disponibile. Scaricalo qui sopra, oppure indica dove si trova.";
    return withBinary(settings);
  }

  state.logs = [];
  state.url = settings.mode === "token" && settings.hostname ? `https://${settings.hostname}` : null;
  state.error = null;
  state.state = "starting";
  state.startedAt = Date.now();

  const child = spawn(binary(settings), argsFor(settings), {
    stdio: ["ignore", "pipe", "pipe"],
    // Survives nothing on purpose: the tunnel is only meant to be up while
    // the site it points at is.
    detached: false,
  });
  state.child = child;

  const onOutput = (chunk: Buffer) => {
    const text = chunk.toString();
    log(text, settings.token);

    const { url, connected } = readTunnelOutput(text);
    // Quick tunnels only learn their address from cloudflared's own output.
    if (url) state.url = url;
    if (connected) {
      state.state = "connected";
      state.error = null;
    }
  };

  child.stdout?.on("data", onOutput);
  // cloudflared logs to stderr by default, including ordinary progress.
  child.stderr?.on("data", onOutput);

  child.on("error", (error) => {
    state.state = "error";
    state.error = redact(error.message, settings.token);
    state.child = null;
  });

  child.on("close", (code, signal) => {
    state.child = null;
    if (state.state === "stopped") return; // asked to stop; not a failure
    state.state = "error";
    state.error =
      signal ? `cloudflared terminato dal segnale ${signal}.` : `cloudflared è uscito con codice ${code}.`;
  });

  return withBinary(settings);
}

export async function stopTunnel(): Promise<void> {
  const state = runtime();
  const child = state.child;

  state.state = "stopped";
  state.url = null;
  state.error = null;
  state.startedAt = null;

  if (!child) return;
  state.child = null;

  child.kill("SIGTERM");
  // SIGTERM is advisory on Windows; make sure it actually goes.
  await new Promise<void>((resolve) => {
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      resolve();
    }, 5000);
    child.once("close", () => {
      clearTimeout(timer);
      resolve();
    });
  });
}

export async function restartTunnel(settings: TunnelSettings): Promise<TunnelStatus> {
  await stopTunnel();
  return startTunnel(settings);
}

async function withBinary(settings: TunnelSettings): Promise<TunnelStatus> {
  return {
    ...getTunnelStatus(),
    binaryFound: await isBinaryAvailable(settings),
    managedBinary: hasManagedBinary(),
  };
}

export async function getFullStatus(settings: TunnelSettings): Promise<TunnelStatus> {
  return withBinary(settings);
}

// A tunnel outliving the server it points at would keep answering with a
// connection refused, so it goes down with the process.
if (!globalForTunnel.tunnelRuntime?.child) {
  for (const signal of ["SIGINT", "SIGTERM"] as const) {
    process.once(signal, () => {
      runtime().child?.kill("SIGKILL");
    });
  }
  process.once("exit", () => {
    runtime().child?.kill("SIGKILL");
  });
}
