/**
 * Runs once when a server instance starts, before it takes requests.
 *
 * Used here to bring the Cloudflare Tunnel up with the site when it's set to
 * start automatically — otherwise "enabled" would only mean "someone pressed
 * Avvia in the admin at some point", and a reboot would quietly take the site
 * off the internet.
 */
export async function register() {
  // Also evaluated in the edge runtime, which has no child processes.
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { autoStartTunnel } = await import("@/lib/tunnel/autostart");
  await autoStartTunnel();
}
