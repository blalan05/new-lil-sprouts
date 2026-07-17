import { action, query } from "@solidjs/router";
import { db } from "./db";
import { serverRedirect } from "./server-redirect";
import {
  getSession,
  login,
  logout as logoutSession,
  register,
  validateEmail,
  validatePassword,
  validateUsername,
  hashPassword,
  verifyPassword,
} from "./server";
import { requireUser } from "./auth";

export const getUser = query(async () => {
  "use server";
  try {
    return await requireUser();
  } catch {
    await logoutSession();
    throw serverRedirect("/login");
  }
}, "user");

export const updateUser = action(async (formData: FormData) => {
  "use server";
  try {
    const user = await requireUser();

    const firstName = String(formData.get("firstName") || "");
    const lastName = String(formData.get("lastName") || "");
    const email = String(formData.get("email") || "");
    const phone = String(formData.get("phone") || "");

    if (!email) {
      return new Error("Email is required");
    }

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser && existingUser.id !== user.id) {
      return new Error("Email is already in use");
    }

    await db.user.update({
      where: { id: user.id },
      data: {
        firstName: firstName || null,
        lastName: lastName || null,
        email,
        phone: phone || null,
      },
    });

    return serverRedirect("/account");
  } catch (err) {
    console.error("Error updating user:", err);
    return new Error(err instanceof Error ? err.message : "Failed to update user");
  }
});

export const updatePassword = action(async (formData: FormData) => {
  "use server";
  try {
    const authUser = await requireUser();

    const currentPassword = String(formData.get("currentPassword"));
    const newPassword = String(formData.get("newPassword"));
    const confirmPassword = String(formData.get("confirmPassword"));

    if (!currentPassword || !newPassword || !confirmPassword) {
      return new Error("All password fields are required");
    }

    if (newPassword !== confirmPassword) {
      return new Error("New passwords do not match");
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) return new Error(passwordError);

    const user = await db.user.findUnique({ where: { id: authUser.id } });
    if (!user || !(await verifyPassword(currentPassword, user.password))) {
      return new Error("Current password is incorrect");
    }

    await db.user.update({
      where: { id: authUser.id },
      data: {
        password: await hashPassword(newPassword),
      },
    });

    return serverRedirect("/account");
  } catch (err) {
    console.error("Error updating password:", err);
    return new Error(err instanceof Error ? err.message : "Failed to update password");
  }
});

export const loginOrRegister = action(async (formData: FormData) => {
  "use server";
  const username = String(formData.get("username"));
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password"));
  const loginType = String(formData.get("loginType"));
  const redirectTo = String(formData.get("redirectTo") || "/");
  const safeRedirect =
    redirectTo.startsWith("/") && !redirectTo.startsWith("//") ? redirectTo : "/";

  let error = validateUsername(username) || validatePassword(password);
  if (error) return new Error(error);

  if (loginType !== "login") {
    const emailError = validateEmail(email);
    if (emailError) return new Error(emailError);
  }

  try {
    const user = await (loginType !== "login"
      ? register(username, email, password)
      : login(username, password));
    const session = await getSession();
    await session.update((d) => {
      d.userId = user.id;
    });
  } catch (err) {
    return err as Error;
  }
  return serverRedirect(safeRedirect);
});

export const logout = action(async () => {
  "use server";
  await logoutSession();
  return serverRedirect("/login");
});
