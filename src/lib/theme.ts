export type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "lilsprouts-theme";

export function getStoredTheme(): Theme {
  if (typeof localStorage === "undefined") return "system";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") return stored;
  return "system";
}

export function resolveTheme(theme: Theme): "light" | "dark" {
  if (theme === "light" || theme === "dark") return theme;
  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const resolved = resolveTheme(theme);
  const root = document.documentElement;
  root.setAttribute("data-theme", resolved);
  // Web Awesome dark tokens activate via .wa-dark on an ancestor
  root.classList.toggle("wa-dark", resolved === "dark");
  root.classList.toggle("wa-light", resolved === "light");
}

export function setTheme(theme: Theme) {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(STORAGE_KEY, theme);
  }
  applyTheme(theme);
}

export function initTheme() {
  applyTheme(getStoredTheme());
}

/** Inline script to prevent flash of wrong theme — inject in document head */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}")||"system";var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;r.setAttribute("data-theme",d?"dark":"light");r.classList.toggle("wa-dark",d);r.classList.toggle("wa-light",!d);}catch(e){}})();`;
