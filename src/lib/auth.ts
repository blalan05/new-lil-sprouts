import { db } from "./db";
import { getSession } from "./server";
import { serverRedirect } from "./server-redirect";

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  isOwner: boolean;
  familyId: string | null;
};

export async function requireUser(): Promise<AuthUser> {
  "use server";
  const session = await getSession();
  const userId = session.data.userId;
  if (userId === undefined) {
    throw serverRedirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      familyMember: {
        select: { familyId: true },
      },
    },
  });

  if (!user) {
    throw serverRedirect("/login");
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    isOwner: user.isOwner,
    familyId: user.familyMember?.familyId ?? null,
  };
}

export async function requireOwner(): Promise<AuthUser> {
  const user = await requireUser();
  if (!user.isOwner) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireFamilyAccess(familyId: string): Promise<AuthUser> {
  const user = await requireUser();
  if (user.isOwner || user.familyId === familyId) {
    return user;
  }
  throw new Error("Unauthorized");
}

/** Where-clause helper: owners see all families; family users see only theirs. */
export function familyWhere(user: AuthUser): { id?: string } {
  if (user.isOwner) return {};
  if (user.familyId) return { id: user.familyId };
  throw new Error("Unauthorized");
}

/** Where-clause helper for entities scoped by familyId. */
export function familyIdWhere(user: AuthUser): { familyId?: string } {
  if (user.isOwner) return {};
  if (user.familyId) return { familyId: user.familyId };
  throw new Error("Unauthorized");
}

export async function assertOwnerAction(): Promise<AuthUser | Error> {
  try {
    return await requireOwner();
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return new Error("Unauthorized");
    }
    throw err;
  }
}

export async function assertFamilyAccessAction(familyId: string): Promise<AuthUser | Error> {
  try {
    return await requireFamilyAccess(familyId);
  } catch {
    return new Error("Unauthorized");
  }
}
