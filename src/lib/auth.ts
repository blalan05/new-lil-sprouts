import { db } from "./db";
import { serverRedirect } from "./server-redirect";
import { getSession } from "./server";

export type UserRole = "owner" | "parent";

export type SessionUser = {
  id: string;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  isOwner: boolean;
  role: UserRole;
  familyId: string | null;
};

async function loadSessionUser(userId: string): Promise<SessionUser | null> {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      familyMember: {
        select: { familyId: true },
      },
    },
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    isOwner: user.isOwner,
    role: user.isOwner ? "owner" : "parent",
    familyId: user.familyMember?.familyId ?? null,
  };
}

export async function requireUser(): Promise<SessionUser> {
  const session = await getSession();
  const userId = session.data?.userId;
  if (userId === undefined) {
    throw serverRedirect("/login");
  }

  const user = await loadSessionUser(userId);
  if (!user) {
    throw serverRedirect("/login");
  }

  return user;
}

export async function requireOwner(): Promise<SessionUser> {
  const user = await requireUser();
  if (!user.isOwner) {
    throw serverRedirect("/portal");
  }
  return user;
}

export async function getCurrentFamilyId(user?: SessionUser): Promise<string | null> {
  const sessionUser = user ?? (await requireUser());
  if (sessionUser.isOwner) {
    return null;
  }
  return sessionUser.familyId;
}

export async function requireFamilyAccess(familyId: string): Promise<SessionUser> {
  const user = await requireUser();
  if (user.isOwner) {
    return user;
  }
  if (user.familyId !== familyId) {
    throw serverRedirect("/portal");
  }
  return user;
}

export async function requireParent(): Promise<SessionUser & { familyId: string }> {
  const user = await requireUser();
  if (user.isOwner || !user.familyId) {
    throw serverRedirect("/");
  }
  return { ...user, familyId: user.familyId };
}

export async function requireSessionFamilyAccess(sessionId: string): Promise<SessionUser> {
  const session = await db.careSession.findUnique({
    where: { id: sessionId },
    select: { familyId: true },
  });
  if (!session) {
    throw new Error("Session not found");
  }
  return requireFamilyAccess(session.familyId);
}

export async function assertFamilyExists(familyId: string): Promise<void> {
  const family = await db.family.findUnique({
    where: { id: familyId },
    select: { id: true },
  });
  if (!family) {
    throw new Error("Family not found");
  }
}

export async function requireChildAccess(childId: string): Promise<SessionUser & { familyId: string }> {
  const child = await db.child.findUnique({
    where: { id: childId },
    select: { familyId: true },
  });
  if (!child) {
    throw new Error("Child not found");
  }
  const user = await requireFamilyAccess(child.familyId);
  return { ...user, familyId: child.familyId };
}

export async function requireFamilyMemberAccess(memberId: string): Promise<SessionUser & { familyId: string }> {
  const member = await db.familyMember.findUnique({
    where: { id: memberId },
    select: { familyId: true },
  });
  if (!member) {
    throw new Error("Family member not found");
  }
  const user = await requireFamilyAccess(member.familyId);
  return { ...user, familyId: member.familyId };
}

export async function requireCareScheduleAccess(scheduleId: string): Promise<SessionUser & { familyId: string }> {
  const schedule = await db.careSchedule.findUnique({
    where: { id: scheduleId },
    select: { familyId: true },
  });
  if (!schedule) {
    throw new Error("Care schedule not found");
  }
  const user = await requireFamilyAccess(schedule.familyId);
  return { ...user, familyId: schedule.familyId };
}

/** Owner routes: verify a resource belongs to the claimed family. */
export async function assertChildInFamily(childId: string, familyId: string): Promise<void> {
  const child = await db.child.findUnique({
    where: { id: childId },
    select: { familyId: true },
  });
  if (!child) {
    throw new Error("Child not found");
  }
  if (child.familyId !== familyId) {
    throw new Error("Child does not belong to this family");
  }
}

export async function assertSessionInFamily(sessionId: string, familyId: string): Promise<void> {
  const session = await db.careSession.findUnique({
    where: { id: sessionId },
    select: { familyId: true },
  });
  if (!session) {
    throw new Error("Session not found");
  }
  if (session.familyId !== familyId) {
    throw new Error("Session does not belong to this family");
  }
}

export async function assertFamilyMemberInFamily(memberId: string, familyId: string): Promise<void> {
  const member = await db.familyMember.findUnique({
    where: { id: memberId },
    select: { familyId: true },
  });
  if (!member) {
    throw new Error("Family member not found");
  }
  if (member.familyId !== familyId) {
    throw new Error("Family member does not belong to this family");
  }
}

export async function assertScheduleInFamily(scheduleId: string, familyId: string): Promise<void> {
  const schedule = await db.careSchedule.findUnique({
    where: { id: scheduleId },
    select: { familyId: true },
  });
  if (!schedule) {
    throw new Error("Care schedule not found");
  }
  if (schedule.familyId !== familyId) {
    throw new Error("Care schedule does not belong to this family");
  }
}
