import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "dark" | "light" | "system";

export const ACCENT_PRESETS = [
  { hex: "#6366F1", name: "Indigo" },
  { hex: "#22D3EE", name: "Cyan" },
  { hex: "#10B981", name: "Emerald" },
  { hex: "#F59E0B", name: "Amber" },
  { hex: "#F43F5E", name: "Rose" },
  { hex: "#A78BFA", name: "Violet" },
] as const;

interface ThemeState {
  theme: ThemeMode;
  accent: string;
  setTheme: (t: ThemeMode) => void;
  setAccent: (hex: string) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      accent: "#6366F1",
      setTheme: (t) => set({ theme: t }),
      setAccent: (hex) => set({ accent: hex }),
      toggleTheme: () => {
        const cur = get().theme;
        set({ theme: cur === "dark" ? "light" : "dark" });
      },
    }),
    { name: "dro.theme" }
  )
);

// --- helpers to apply theme to <html> + inject accent overrides

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const num = parseInt(n, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

// Approximate hex -> oklch (good enough for accent tokens)
function hexToOklch(hex: string): { l: number; c: number; h: number } {
  const [R, G, B] = hexToRgb(hex).map((v) => v / 255);
  const lin = (u: number) => (u <= 0.04045 ? u / 12.92 : Math.pow((u + 0.055) / 1.055, 2.4));
  const r = lin(R),
    g = lin(G),
    b = lin(B);
  // OKLab
  const l_ = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m_ = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s_ = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const b2 = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
  const C = Math.sqrt(a * a + b2 * b2);
  let h = (Math.atan2(b2, a) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { l: L, c: C, h };
}

export function applyTheme(theme: ThemeMode, accent: string) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const prefersDark =
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : true;
  const dark = theme === "dark" || (theme === "system" && prefersDark);
  root.classList.toggle("dark", dark);
  root.classList.toggle("light", !dark);

  const { l, c, h } = hexToOklch(accent);
  // Build derived shades
  const primary = `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(2)})`;
  const primaryStrong = `oklch(${Math.max(0.45, l - 0.05).toFixed(3)} ${c.toFixed(3)} ${h.toFixed(2)})`;
  const ring = primary;
  // Cyan complement for gradient end
  const accentEnd = "#22D3EE";
  const gradient = `linear-gradient(135deg, ${accent} 0%, ${accentEnd} 100%)`;
  const glow = `0 0 40px -10px ${accent}80`;

  let styleEl = document.getElementById("dro-accent-overrides") as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "dro-accent-overrides";
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = `:root, .dark, .light {
    --primary: ${primary};
    --ring: ${ring};
    --sidebar-primary: ${primary};
    --sidebar-ring: ${ring};
    --chart-1: ${primary};
    --gradient-primary: ${gradient};
    --shadow-glow: ${glow};
  }
  :root .text-primary, .dark .text-primary, .light .text-primary { color: ${primary}; }
  /* reduce hard-coded indigo references */
  .accent-strong { color: ${primaryStrong}; }
  `;
}
