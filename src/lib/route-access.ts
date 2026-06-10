/** Owner-only URL prefixes (dashboard is exactly `/`). */
export const OWNER_ROUTE_PREFIXES = [
  "/families",
  "/schedule",
  "/payments",
  "/expenses",
  "/reports",
  "/services",
  "/children",
  "/unavailability",
] as const;

/** Paths reachable without a session. */
export const PUBLIC_PATHS = new Set(["/login"]);

/** Paths any authenticated user may visit. */
export const AUTH_PATHS = new Set(["/account", "/portal"]);

const SKIP_PREFIXES = ["/_server", "/_build", "/api", "/icons"];

const STATIC_FILE = /\.[a-z0-9]+$/i;

export function shouldSkipRouteGuard(pathname: string, method: string): boolean {
  if (method !== "GET" && method !== "HEAD") {
    return true;
  }
  if (pathname === "/service-worker.js" || pathname === "/favicon.ico") {
    return true;
  }
  if (SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return true;
  }
  if (STATIC_FILE.test(pathname)) {
    return true;
  }
  return false;
}

export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_PATHS.has(pathname);
}

export function isAuthRoute(pathname: string): boolean {
  return AUTH_PATHS.has(pathname) || pathname.startsWith("/portal/");
}

export function isOwnerRoute(pathname: string): boolean {
  if (pathname === "/") {
    return true;
  }
  return OWNER_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function ownerRedirectPath(isOwner: boolean): string {
  return isOwner ? "/" : "/portal";
}
