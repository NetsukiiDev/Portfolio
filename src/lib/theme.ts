export type PaletteKey = "violet" | "blue" | "emerald" | "rose" | "amber";
export type ThemeMode = "light" | "dark";

export const PALETTES: Record<PaletteKey, { label: string; accent: string; accentSoft: string }> = {
  violet: { label: "Violet", accent: "#7c6cf6", accentSoft: "rgba(124, 108, 246, 0.16)" },
  blue: { label: "Blue", accent: "#3b82f6", accentSoft: "rgba(59, 130, 246, 0.16)" },
  emerald: { label: "Emerald", accent: "#10b981", accentSoft: "rgba(16, 185, 129, 0.16)" },
  rose: { label: "Rose", accent: "#f43f5e", accentSoft: "rgba(244, 63, 94, 0.16)" },
  amber: { label: "Amber", accent: "#f59e0b", accentSoft: "rgba(245, 158, 11, 0.16)" },
};

export const PALETTE_KEYS = Object.keys(PALETTES) as PaletteKey[];

export function isPaletteKey(value: string): value is PaletteKey {
  return Object.prototype.hasOwnProperty.call(PALETTES, value);
}

export function isThemeMode(value: string): value is ThemeMode {
  return value === "light" || value === "dark";
}
