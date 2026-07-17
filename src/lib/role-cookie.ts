/** Cookie synced from middleware on every request — source of truth for nav role on the client. */

export const ROLE_COOKIE = "ls-role";

export type RoleCookieValue = "owner" | "parent";

export function roleCookieValue(isOwner: boolean): RoleCookieValue {
  return isOwner ? "owner" : "parent";
}

export function readRoleCookie(): RoleCookieValue | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${ROLE_COOKIE}=([^;]+)`));
  const value = decodeURIComponent(match?.[1] ?? "");
  return value === "owner" || value === "parent" ? value : null;
}

export function isOwnerFromCookie(): boolean {
  return readRoleCookie() === "owner";
}
