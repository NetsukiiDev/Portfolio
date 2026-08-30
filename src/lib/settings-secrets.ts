import { maskStorageSecrets } from "./storage/types";
import { maskTunnelSecrets } from "./tunnel/types";
import type { Settings } from "@/types";

/**
 * Every secret in the settings blob, replaced with a placeholder.
 *
 * One function rather than a mask per slice at each call site: settings reach
 * the browser from four admin pages and the settings API, and when the
 * masking was spelled out at each of them one page had already been missed.
 * A PUT that sends a masked value back is understood as "leave it alone"
 * (see the settings route), so a form can round-trip what it never saw.
 */
export function maskSettingsSecrets(settings: Settings): Settings {
  return {
    ...settings,
    storage: maskStorageSecrets(settings.storage),
    tunnel: maskTunnelSecrets(settings.tunnel),
  };
}
