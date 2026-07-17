import { action, query, reload } from "@solidjs/router";
import { db } from "./db";
import { requireParent, getCurrentFamilyId } from "./auth";
import { calculateHours, serializeMoneyDeep } from "./money";
import { sendDailySummary } from "./notification-helpers";

export const getMyFamily = query(async () => {
  "use server";
  const user = await requireParent();
  const family = await db.family.findUnique({
    where: { id: user.familyId },
    include: {
      children: {
        orderBy: { firstName: "asc" },
      },
    },
  });
  if (!family) throw new Error("Family not found");
  return family;
}, "portal-family");

export const getMyUpcomingSessions = query(async () => {
  "use server";
  const user = await requireParent();
  const now = new Date();
  const sessions = await db.careSession.findMany({
    where: {
      familyId: user.familyId,
      scheduledStart: { gte: now },
      status: { not: "CANCELLED" },
    },
    include: {
      service: { select: { name: true } },
      children: { select: { id: true, firstName: true, lastName: true } },
    },
    orderBy: { scheduledStart: "asc" },
    take: 10,
  });
  return serializeMoneyDeep(sessions);
}, "portal-upcoming-sessions");

export const getMyChildren = query(async () => {
  "use server";
  const user = await requireParent();
  return db.child.findMany({
    where: { familyId: user.familyId },
    orderBy: { firstName: "asc" },
  });
}, "portal-children");

export const getMyChildReports = query(async (limit = 20) => {
  "use server";
  const user = await requireParent();
  const childIds = (
    await db.child.findMany({
      where: { familyId: user.familyId },
      select: { id: true },
    })
  ).map((child) => child.id);

  if (childIds.length === 0) return [];

  return db.sessionReport.findMany({
    where: { childId: { in: childIds } },
    include: {
      child: { select: { id: true, firstName: true, lastName: true } },
      careSession: {
        select: {
          id: true,
          scheduledStart: true,
          breakfastCount: true,
          morningSnackCount: true,
          lunchCount: true,
          afternoonSnackCount: true,
          dinnerCount: true,
        },
      },
    },
    orderBy: { timestamp: "desc" },
    take: limit,
  });
}, "portal-child-reports");

export const getMyDailyDigest = query(async (date?: Date) => {
  "use server";
  const user = await requireParent();
  const day = date ?? new Date();
  const start = new Date(day);
  start.setHours(0, 0, 0, 0);
  const end = new Date(day);
  end.setHours(23, 59, 59, 999);

  await sendDailySummary(user.familyId, start);

  const sessions = await db.careSession.findMany({
    where: {
      familyId: user.familyId,
      scheduledStart: { gte: start, lte: end },
      status: { not: "CANCELLED" },
    },
    include: {
      children: { select: { firstName: true, lastName: true } },
      reports: {
        include: {
          child: { select: { firstName: true, lastName: true } },
        },
      },
    },
    orderBy: { scheduledStart: "asc" },
  });

  return sessions.map((session) => ({
    id: session.id,
    scheduledStart: session.scheduledStart,
    scheduledEnd: session.scheduledEnd,
    hours: calculateHours(session.scheduledStart, session.scheduledEnd),
    children: session.children,
    mealCounts: {
      breakfast: session.breakfastCount,
      morningSnack: session.morningSnackCount,
      lunch: session.lunchCount,
      afternoonSnack: session.afternoonSnackCount,
      dinner: session.dinnerCount,
    },
    reports: session.reports,
  }));
}, "portal-daily-digest");

export const confirmMySession = action(async (sessionId: string) => {
  "use server";
  const user = await requireParent();
  const session = await db.careSession.findFirst({
    where: { id: sessionId, familyId: user.familyId },
  });
  if (!session) {
    return new Error("Session not found");
  }
  await db.careSession.update({
    where: { id: sessionId },
    data: { isConfirmed: true },
  });
  return reload();
});

export const getPortalContext = query(async () => {
  "use server";
  const familyId = await getCurrentFamilyId();
  return { familyId };
}, "portal-context");
