import { createAPIHandler } from "filesystem-routing/api";
import routes from "virtual:file-routes";
import { db } from "~/lib/db";
import {
  authenticatedHomePath,
  isAuthRoute,
  isOwnerRoute,
  isPublicRoute,
  shouldSkipRouteGuard,
} from "~/lib/route-access";
import { roleCookieValue } from "~/lib/role-cookie";
import { serializeClearRoleCookie, serializeRoleCookie } from "~/server/role-cookie";
import { destroySessionCookie, readSessionData } from "~/server/session";

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

function redirectResponse(location: string, request: Request, cookieHeaders: string[] = []) {
  const headers = new Headers();
  for (const cookie of cookieHeaders) {
    headers.append("Set-Cookie", cookie);
  }
  return Response.redirect(new URL(location, request.url), 302);
}

async function authMiddleware(
  request: Request,
  next: (request?: Request) => Response | Promise<Response>,
) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (shouldSkipRouteGuard(pathname, request.method)) {
    return next(request);
  }

  const sessionData = await readSessionData(request);
  const userId = sessionData.userId;

  if (isPublicRoute(pathname)) {
    if (!userId) {
      return next(request);
    }
    const profile = await resolveSessionProfile(userId);
    if (profile === null) {
      return redirectResponse("/login", request, [
        await destroySessionCookie(),
        await serializeClearRoleCookie(),
      ]);
    }
    return redirectResponse(
      authenticatedHomePath(profile.isOwner, profile.familyId),
      request,
      [await serializeRoleCookie(roleCookieValue(profile.isOwner))],
    );
  }

  if (!userId) {
    return redirectResponse("/login", request);
  }

  const profile = await resolveSessionProfile(userId);
  if (profile === null) {
    return redirectResponse("/login", request, [
      await destroySessionCookie(),
      await serializeClearRoleCookie(),
    ]);
  }

  const parentHome = authenticatedHomePath(false, profile.familyId);

  if (isOwnerRoute(pathname) && !profile.isOwner) {
    return redirectResponse(parentHome, request);
  }

  if (pathname === "/portal" && profile.isOwner) {
    return redirectResponse("/", request);
  }

  if (isAuthRoute(pathname)) {
    return next(request);
  }

  if (!isOwnerRoute(pathname) && !isAuthRoute(pathname) && pathname !== "/login") {
    if (!profile.isOwner) {
      return redirectResponse(parentHome, request);
    }
  }

  return next(request);
}

export default [createAPIHandler(routes), authMiddleware];
