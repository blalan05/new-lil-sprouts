import { action, query, reload } from "@solidjs/router";
import { db } from "./db";
import { requireUser } from "./auth";
import { getSession } from "./server";

async function currentUserId(): Promise<string | null> {
  const session = await getSession();
  return session.data?.userId ?? null;
}

export const getMyNotifications = query(async (limit = 20) => {
  "use server";
  // Soft-auth: never redirect from shell queries (avoids SSR hangs on /login).
  const userId = await currentUserId();
  if (!userId) return [];
  return db.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}, "my-notifications");

export const getUnreadCount = query(async () => {
  "use server";
  const userId = await currentUserId();
  if (!userId) return 0;
  return db.notification.count({
    where: { userId, read: false },
  });
}, "unread-notification-count");

export const markNotificationRead = action(async (id: string) => {
  "use server";
  const user = await requireUser();
  await db.notification.updateMany({
    where: { id, userId: user.id },
    data: { read: true },
  });
  return reload();
});

export const markAllNotificationsRead = action(async () => {
  "use server";
  const user = await requireUser();
  await db.notification.updateMany({
    where: { userId: user.id, read: false },
    data: { read: true },
  });
  return reload();
});
