import { useSession } from "vinxi/http";
import { db } from "./db";
import { hashPassword, isHashedPassword, verifyPassword } from "./password";

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

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET environment variable is required");
  }
  return secret;
}

export async function login(username: string, password: string) {
  const user = await db.user.findUnique({ where: { username } });
  if (!user || !(await verifyPassword(password, user.password))) {
    throw new Error("Invalid login");
  }

  if (!isHashedPassword(user.password)) {
    await db.user.update({
      where: { id: user.id },
      data: { password: await hashPassword(password) },
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
  const userCount = await db.user.count();
  const allowRegistration =
    process.env.ALLOW_REGISTRATION === "true" || userCount === 0;

  if (!allowRegistration) {
    throw new Error("Registration is disabled");
  }

  const existingUser = await db.user.findUnique({ where: { username } });
  if (existingUser) throw new Error("Username already exists");

  const existingEmail = await db.user.findUnique({ where: { email } });
  if (existingEmail) throw new Error("Email already exists");

  const hashed = await hashPassword(password);

  return db.user.create({
    data: {
      username,
      email,
      password: hashed,
      isOwner: userCount === 0,
    },
  });
}

export function getSession() {
  return useSession({
    password: getSessionSecret(),
  });
}

export { hashPassword, verifyPassword };
