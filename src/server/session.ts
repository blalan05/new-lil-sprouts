import { createCookie } from "@remix-run/cookie";
import { getRequestEvent } from "@solidjs/web";
import { env } from "virtual:env/server";

export type SessionData = {
  userId?: string;
};

const sessionCookie = createCookie("lilsprouts_session", {
  secrets: [env.SESSION_SECRET],
  sameSite: "lax",
  path: "/",
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 30,
});

export async function readSessionData(request?: Request): Promise<SessionData> {
  const event = getRequestEvent();
  const req = request ?? event?.request;
  const cookieHeader = req?.headers.get("Cookie") ?? "";
  const data = (await sessionCookie.parse(cookieHeader)) as SessionData | null;
  return data ?? {};
}

export async function getSession(request?: Request) {
  const event = getRequestEvent();
  let data = await readSessionData(request);

  return {
    get data() {
      return data;
    },
    async update(updater: (draft: SessionData) => void) {
      const next = { ...data };
      updater(next);
      data = next;
      const serialized = await sessionCookie.serialize(next);
      event?.response.headers.append("Set-Cookie", serialized);
    },
    async destroy() {
      data = {};
      const serialized = await sessionCookie.serialize("", { maxAge: 0 });
      event?.response.headers.append("Set-Cookie", serialized);
    },
  };
}

export async function commitSession(data: SessionData) {
  return sessionCookie.serialize(data);
}

export async function destroySessionCookie() {
  return sessionCookie.serialize("", { maxAge: 0 });
}
