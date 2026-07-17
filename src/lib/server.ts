import { useSession, clearSession, setCookie } from "vinxi/http";
import { getRequestEvent } from "solid-js/web";
import { db } from "./db";
import { hashPassword, needsRehash, verifyPassword } from "./password";
import { ROLE_COOKIE, roleCookieValue } from "./role-cookie";

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET environment variable is required");
  }
  return secret;
}

/** Always return a plain `{ password }` object for vinxi/h3 session APIs. */
export function sessionConfig(): { password: string } {
  return { password: getSessionSecret() };
}

/** @deprecated Prefer sessionConfig() so the password is a real own-property. */
export const SESSION_CONFIG = {
  get password() {
    return getSessionSecret();
  },
};

export function validateUsername(username: unknown) {
  if (typeof username !== "string" || username.length < 3) {
    return `Usernames must be at least 3 characters long`;
  }
}

export function validateEmail(email: unknown) {
  if (typeof email !== "string" || !email.includes("@")) {
    return `Please enter a valid email address`;
  }
}

export function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
  }
}

export async function login(usernameOrEmail: string, password: string) {
  const loginId = usernameOrEmail.trim();
  let user = await db.user.findUnique({ where: { username: loginId } });
  if (!user && loginId.includes("@")) {
    user = await db.user.findUnique({ where: { email: loginId } });
  }
  if (!user || !verifyPassword(password, user.password)) throw new Error("Invalid login");
  if (needsRehash(user.password)) {
    await db.user.update({
      where: { id: user.id },
      data: { password: hashPassword(password) },
    });
  }
  return user;
}

export async function logout(event?: unknown) {
  const target =
    (event as Parameters<typeof clearSession>[0] | undefined) ??
    getRequestEvent()?.nativeEvent;
  if (target) {
    await clearSession(target, sessionConfig());
    setCookie(target, ROLE_COOKIE, "", { path: "/", maxAge: 0 });
    return;
  }
  const session = await getSession();
  await session.update((d) => {
    d.userId = undefined;
  });
}

export async function register(username: string, email: string, password: string) {
  const existingUser = await db.user.findUnique({ where: { username } });
  if (existingUser) throw new Error("Username already exists");

  const existingEmail = await db.user.findUnique({ where: { email } });
  if (existingEmail) throw new Error("Email already exists");

  const isFirstUser = (await db.user.count()) === 0;

  return db.user.create({
    data: {
      username,
      email,
      password: hashPassword(password),
      isOwner: isFirstUser,
    },
  });
}

export async function getSession(event?: unknown) {
  const config = sessionConfig();
  if (event) {
    return await useSession(event as Parameters<typeof useSession>[0], config);
  }
  return await useSession(config);
}
