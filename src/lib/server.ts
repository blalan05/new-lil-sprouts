import { getRequestEvent } from "@solidjs/web";
import { db } from "./db";
import { hashPassword, needsRehash, verifyPassword } from "./password";
import { clearRoleCookie } from "~/server/role-cookie";
import { getSession } from "~/server/session";

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

export async function logout() {
  const session = await getSession();
  await session.destroy();
  await clearRoleCookie();
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

export { getSession } from "~/server/session";
