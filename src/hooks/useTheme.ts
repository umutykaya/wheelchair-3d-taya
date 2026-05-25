import { useEffect } from "react";
import { useConfigStore } from "@/store/useConfigStore";

/**
 * Ensures the `dark` class on <html> always reflects the store theme.
 * Returns { theme, toggle, setTheme }.
 */
export function useTheme(): {
  theme: "light" | "dark";
  toggle: () => void;
  setTheme: (t: "light" | "dark") => void;
} {
  const theme = useConfigStore((s) => s.theme);
  const setTheme = useConfigStore((s) => s.setTheme);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return {
    theme,
    setTheme,
    toggle: () => setTheme(theme === "dark" ? "light" : "dark"),
  };
}
