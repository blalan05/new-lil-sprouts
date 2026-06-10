import { createMiddleware } from "@solidjs/start/middleware";
import { clearSession, getCookie, sendRedirect, useSession } from "vinxi/http";
import { db } from "../lib/db";
import { SESSION_CONFIG } from "../lib/server";
import {
  shouldSkipRouteGuard,
  isPublicRoute,
  isAuthRoute,
  isOwnerRoute,
  ownerRedirectPath,
} from "../lib/route-access";

const SESSION_COOKIE_NAME = "h3";

async function resolveIsOwner(userId: string): Promise<boolean | null> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { isOwner: true },
  });
  return user?.isOwner ?? null;
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
        return;
      }
      const isOwner = await resolveIsOwner(userId);
      if (isOwner === null) {
        await clearUserSession(event);
        return;
      }
      return redirectTo(event, ownerRedirectPath(isOwner), event.request);
    }

    if (!userId) {
      return redirectTo(event, "/login", event.request);
    }

    const isOwner = await resolveIsOwner(userId);
    if (isOwner === null) {
      await clearUserSession(event);
      return redirectTo(event, "/login", event.request);
    }

    if (isOwnerRoute(pathname) && !isOwner) {
      return redirectTo(event, "/portal", event.request);
    }

    if (pathname === "/portal" && isOwner) {
      return redirectTo(event, "/", event.request);
    }

    if (isAuthRoute(pathname)) {
      return;
    }

    if (!isOwnerRoute(pathname) && !isAuthRoute(pathname) && pathname !== "/login") {
      if (!isOwner) {
        return redirectTo(event, "/portal", event.request);
      }
    }
  },
});
