import { useSession, clearSession } from "vinxi/http";
import { db } from "./db";
import { hashPassword, needsRehash, verifyPassword } from "./password";

export const SESSION_CONFIG = {
  password: process.env.SESSION_SECRET ?? "areallylongsecretthatyoushouldreplace",
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

export async function login(username: string, password: string) {
  const user = await db.user.findUnique({ where: { username } });
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
  const target = event ?? undefined;
  if (target) {
    await clearSession(target as Parameters<typeof clearSession>[0], SESSION_CONFIG);
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
  if (event) {
    return await useSession(event as Parameters<typeof useSession>[0], SESSION_CONFIG);
  }
  return await useSession(SESSION_CONFIG);
}
