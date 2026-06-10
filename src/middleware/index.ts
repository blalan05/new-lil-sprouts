import { createMiddleware } from "@solidjs/start/middleware";
import { sendRedirect } from "vinxi/http";
import { db } from "../lib/db";
import { getSession } from "../lib/server";
import {
  shouldSkipRouteGuard,
  isPublicRoute,
  isAuthRoute,
  isOwnerRoute,
  ownerRedirectPath,
} from "../lib/route-access";

async function resolveIsOwner(userId: string): Promise<boolean | null> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { isOwner: true },
  });
  return user?.isOwner ?? null;
}

function redirectTo(event: { nativeEvent?: unknown }, location: string, request: Request) {
  if (event.nativeEvent) {
    return sendRedirect(event.nativeEvent as Parameters<typeof sendRedirect>[0], location, 302);
  }
  return Response.redirect(new URL(location, request.url), 302);
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

    const session = getSession(event.nativeEvent);
    const userId = session.data.userId as string | undefined;

    if (isPublicRoute(pathname)) {
      if (!userId) {
        return;
      }
      const isOwner = await resolveIsOwner(userId);
      if (isOwner === null) {
        await session.update((data) => {
          data.userId = undefined;
        });
        return;
      }
      return redirectTo(event, ownerRedirectPath(isOwner), event.request);
    }

    if (!userId) {
      return redirectTo(event, "/login", event.request);
    }

    const isOwner = await resolveIsOwner(userId);
    if (isOwner === null) {
      await session.update((data) => {
        data.userId = undefined;
      });
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
      // Unknown app routes default to owner-only (e.g. future pages under /settings).
      if (!isOwner) {
        return redirectTo(event, "/portal", event.request);
      }
    }
  },
});
