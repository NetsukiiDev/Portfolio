import { getSettings } from "../data";
import { isTunnelRunning, startTunnel } from "./manager";

/**
 * Brings the tunnel up at server start when it's configured to. Deliberately
 * does not wait for cloudflared to finish connecting: `register()` blocks the
 * server from taking requests until it returns, and a tunnel that can't reach
 * Cloudflare must not keep the site itself down.
 */
export async function autoStartTunnel(): Promise<void> {
  try {
    const { tunnel } = await getSettings();
    if (!tunnel.enabled || isTunnelRunning()) return;

    void startTunnel(tunnel).catch((error) => {
      console.warn("[tunnel] autostart failed:", error);
    });
    console.log(`[tunnel] avvio automatico (${tunnel.mode})`);
  } catch {
    // No settings row yet — the site hasn't been through /setup. Nothing to
    // start, and this must never stop the server from booting.
  }
}
