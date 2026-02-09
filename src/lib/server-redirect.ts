import { redirect as solidRedirect } from "@solidjs/router";

type RedirectInit = number | ResponseInit | undefined;

function normalizeOrigin(origin: string | undefined): string | null {
  if (!origin) return null;
  let o = origin.trim();
  if (!o) return null;
  if (!/^https?:\/\//i.test(o)) o = `https://${o}`;
  o = o.replace(/\/+$/, "");
  return o || null;
}

function getPublicOrigin(): string {
  const direct = [
    process.env.PUBLIC_ORIGIN,
    process.env.APP_ORIGIN,
    process.env.SITE_URL,
    process.env.URL, // Netlify
  ];

  for (const candidate of direct) {
    const normalized = normalizeOrigin(candidate);
    if (normalized) return normalized;
  }

  const hostOnly = [
    process.env.VERCEL_URL, // host only
    process.env.RENDER_EXTERNAL_HOSTNAME, // host only
    process.env.RAILWAY_PUBLIC_DOMAIN, // host only
  ];

  for (const candidate of hostOnly) {
    const normalized = normalizeOrigin(candidate);
    if (normalized) return normalized;
  }

  // Last-resort fallbacks to avoid crashing on missing Host headers.
  // Prefer setting PUBLIC_ORIGIN in production instead of relying on this.
  if (process.env.NODE_ENV === "production") return "https://lilsprouts.io";
  return "http://localhost:3000";
}

export function serverRedirect(location: string, init?: RedirectInit) {
  const absolute =
    /^https?:\/\//i.test(location) ? location : new URL(location, getPublicOrigin()).toString();

  // `redirect` supports multiple init shapes across Solid Router versions.
  return solidRedirect(absolute, init as any);
}

