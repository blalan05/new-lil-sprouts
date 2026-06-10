import { createMiddleware } from "@solidjs/start/middleware";
import { clearSession, getCookie, sendRedirect, setCookie, useSession } from "vinxi/http";
import { db } from "../lib/db";
import { SESSION_CONFIG } from "../lib/server";
import { ROLE_COOKIE, roleCookieValue } from "../lib/role-cookie";
import {
  shouldSkipRouteGuard,
  isPublicRoute,
  isAuthRoute,
  isOwnerRoute,
  authenticatedHomePath,
} from "../lib/route-access";

const SESSION_COOKIE_NAME = "h3";

type SessionProfile = {
  isOwner: boolean;
  familyId: string | null;
};

async function resolveSessionProfile(userId: string): Promise<SessionProfile | null> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      isOwner: true,
      familyMember: { select: { familyId: true } },
    },
  });
  if (!user) return null;
  return {
    isOwner: user.isOwner,
    familyId: user.familyMember?.familyId ?? null,
  };
}

function h3Event(event: { nativeEvent?: unknown }) {
  return (event.nativeEvent ?? event) as Parameters<typeof useSession>[0];
}

function redirectTo(event: { nativeEvent?: unknown }, location: string, request: Request) {
  const target = h3Event(event);
  if (target) {
    return sendRedirect(target, location, 302);
  }
  return Response.redirect(new URL(location, request.url), 302);
}

async function readUserId(event: { nativeEvent?: unknown }): Promise<string | undefined> {
  const target = h3Event(event);
  if (!target) return undefined;

  if (!getCookie(target, SESSION_COOKIE_NAME)) {
    return undefined;
  }

  try {
    const session = await useSession(target, SESSION_CONFIG);
    return session.data?.userId as string | undefined;
  } catch {
    try {
      await clearSession(target, SESSION_CONFIG);
    } catch {
      // Ignore invalid cookie cleanup failures.
    }
    return undefined;
  }
}

async function clearUserSession(event: { nativeEvent?: unknown }) {
  const target = h3Event(event);
  if (!target) return;
  try {
    await clearSession(target, SESSION_CONFIG);
  } catch {
    // Ignore if there is no session to clear.
  }
  setCookie(target, ROLE_COOKIE, "", { path: "/", maxAge: 0 });
}

function syncRoleCookie(event: { nativeEvent?: unknown }, profile: SessionProfile | null) {
  const target = h3Event(event);
  if (!target) return;
  if (!profile) {
    setCookie(target, ROLE_COOKIE, "", { path: "/", maxAge: 0 });
    return;
  }
  setCookie(target, ROLE_COOKIE, roleCookieValue(profile.isOwner), {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });
}

export default createMiddleware({
  onRequest: async (event) => {
    const nativeEvent: any = (event as any).nativeEvent;
    if (nativeEvent) {
      const absolute = new URL(event.request.url);
      const current = nativeEvent.url;
      try {
        if (!current) {
          nativeEvent.url = absolute;
        } else if (typeof current === "string") {
          nativeEvent.url = new URL(current, absolute);
        } else if (current instanceof URL) {
          if (!current.host) nativeEvent.url = absolute;
        } else {
          nativeEvent.url = absolute;
        }
      } catch {
        nativeEvent.url = absolute;
      }
    }

    const url = new URL(event.request.url);
    const pathname = url.pathname;

    if (shouldSkipRouteGuard(pathname, event.request.method)) {
      return;
    }

    const userId = await readUserId(event);

    if (isPublicRoute(pathname)) {
      if (!userId) {
        syncRoleCookie(event, null);
        return;
      }
      const profile = await resolveSessionProfile(userId);
      if (profile === null) {
        await clearUserSession(event);
        return;
      }
      syncRoleCookie(event, profile);
      return redirectTo(
        event,
        authenticatedHomePath(profile.isOwner, profile.familyId),
        event.request,
      );
    }

    if (!userId) {
      syncRoleCookie(event, null);
      return redirectTo(event, "/login", event.request);
    }

    const profile = await resolveSessionProfile(userId);
    if (profile === null) {
      await clearUserSession(event);
      return redirectTo(event, "/login", event.request);
    }

    syncRoleCookie(event, profile);

    const parentHome = authenticatedHomePath(false, profile.familyId);

    if (isOwnerRoute(pathname) && !profile.isOwner) {
      return redirectTo(event, parentHome, event.request);
    }

    if (pathname === "/portal" && profile.isOwner) {
      return redirectTo(event, "/", event.request);
    }

    if (isAuthRoute(pathname)) {
      return;
    }

    if (!isOwnerRoute(pathname) && !isAuthRoute(pathname) && pathname !== "/login") {
      if (!profile.isOwner) {
        return redirectTo(event, parentHome, event.request);
      }
    }
  },
});
