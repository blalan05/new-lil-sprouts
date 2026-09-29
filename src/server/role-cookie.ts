import { createCookie } from "@remix-run/cookie";
import { getRequestEvent } from "@solidjs/web";
import { ROLE_COOKIE } from "~/lib/role-cookie";

const roleCookie = createCookie(ROLE_COOKIE, {
  path: "/",
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 365,
});

export async function serializeRoleCookie(value: string) {
  return roleCookie.serialize(value);
}

export async function serializeClearRoleCookie() {
  return roleCookie.serialize("", { maxAge: 0 });
}

export async function setRoleCookie(value: string) {
  const event = getRequestEvent();
  const serialized = await serializeRoleCookie(value);
  event?.response.headers.append("Set-Cookie", serialized);
}

export async function clearRoleCookie() {
  const event = getRequestEvent();
  const serialized = await serializeClearRoleCookie();
  event?.response.headers.append("Set-Cookie", serialized);
}

export async function readRoleCookie(request?: Request) {
  const event = getRequestEvent();
  const req = request ?? event?.request;
  const cookieHeader = req?.headers.get("Cookie") ?? "";
  return (await roleCookie.parse(cookieHeader)) as string | null;
}
