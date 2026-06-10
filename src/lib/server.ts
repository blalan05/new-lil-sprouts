import { useSession } from "vinxi/http";
import { db } from "./db";
import { hashPassword, needsRehash, verifyPassword } from "./password";

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

export async function logout() {
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

export function getSession(event?: unknown) {
  const config = {
    password: process.env.SESSION_SECRET ?? "areallylongsecretthatyoushouldreplace",
  };
  if (event) {
    return useSession(event as Parameters<typeof useSession>[0], config);
  }
  return useSession(config);
}
