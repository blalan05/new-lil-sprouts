import { action, query, reload } from "@solidjs/router";
import { db } from "./db";
import { requireUser } from "./auth";

export const getMyNotifications = query(async (limit = 20) => {
  "use server";
  const user = await requireUser();
  return db.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}, "my-notifications");

export const getUnreadCount = query(async () => {
  "use server";
  const user = await requireUser();
  return db.notification.count({
    where: { userId: user.id, read: false },
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
