import { action, query, redirect } from "@solidjs/router";
import { db } from "./db";
import {
  getSession,
  login,
  logout as logoutSession,
  register,
  validateEmail,
  validatePassword,
  validateUsername,
} from "./server";

export const getUser = query(async () => {
  "use server";
  try {
    const session = await getSession();
    const userId = session.data.userId;
    if (userId === undefined) throw new Error("User not found");
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      isOwner: user.isOwner,
    };
  } catch {
    await logoutSession();
    throw redirect("/login");
  }
}, "user");

export const updateUser = action(async (formData: FormData) => {
  "use server";
  try {
    const session = await getSession();
    const userId = session.data.userId;
    if (userId === undefined) throw new Error("User not found");

    const firstName = String(formData.get("firstName") || "");
    const lastName = String(formData.get("lastName") || "");
    const email = String(formData.get("email") || "");
    const phone = String(formData.get("phone") || "");

    if (!email) {
      return new Error("Email is required");
    }

    // Check if email is already taken by another user
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser && existingUser.id !== userId) {
      return new Error("Email is already in use");
    }

    await db.user.update({
      where: { id: userId },
      data: {
        firstName: firstName || null,
        lastName: lastName || null,
        email,
        phone: phone || null,
      },
    });

    return redirect("/account");
  } catch (err) {
    console.error("Error updating user:", err);
    return new Error(err instanceof Error ? err.message : "Failed to update user");
  }
});

export const updatePassword = action(async (formData: FormData) => {
  "use server";
  try {
    const session = await getSession();
    const userId = session.data.userId;
    if (userId === undefined) throw new Error("User not found");

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

    // Verify current password
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user || user.password !== currentPassword) {
      return new Error("Current password is incorrect");
    }

    await db.user.update({
      where: { id: userId },
      data: {
        password: newPassword,
      },
    });

    return redirect("/account");
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
  return redirect("/");
});

export const logout = action(async () => {
  "use server";
  await logoutSession();
  return redirect("/login");
});
