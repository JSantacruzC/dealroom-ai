import { useEffect } from "react";
import { useThemeStore, applyTheme } from "@/store/theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((s) => s.theme);
  const accent = useThemeStore((s) => s.accent);

  useEffect(() => {
    applyTheme(theme, accent);
  }, [theme, accent]);

  useEffect(() => {
    if (theme !== "system" || typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system", accent);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, [theme, accent]);

  return <>{children}</>;
}
