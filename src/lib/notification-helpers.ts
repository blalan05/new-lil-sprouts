import { db } from "./db";

type CreateNotificationInput = {
  userId: string;
  type: string;
  title: string;
  body: string;
  familyId?: string | null;
  careSessionId?: string | null;
};

export async function createNotification(input: CreateNotificationInput) {
  return db.notification.create({
    data: {
      userId: input.userId,
      type: input.type,
      title: input.title,
      body: input.body,
      familyId: input.familyId ?? null,
      careSessionId: input.careSessionId ?? null,
    },
  });
}

export async function notifyIncidentReport(params: {
  familyId: string;
  careSessionId: string;
  title: string;
  body: string;
  severity: string;
  followUpNeeded: boolean;
}) {
  const recipientIds = new Set<string>();

  const owners = await db.user.findMany({
    where: { isOwner: true },
    select: { id: true },
  });
  owners.forEach((owner) => recipientIds.add(owner.id));

  const parentMembers = await db.familyMember.findMany({
    where: {
      familyId: params.familyId,
      userId: { not: null },
    },
    select: { userId: true },
  });
  parentMembers.forEach((member) => {
    if (member.userId) recipientIds.add(member.userId);
  });

  const type =
    params.severity === "SEVERE" ? "INCIDENT_SEVERE" : "INCIDENT_FOLLOWUP";

  await Promise.all(
    Array.from(recipientIds).map((userId) =>
      createNotification({
        userId,
        type,
        title: params.title,
        body: params.body,
        familyId: params.familyId,
        careSessionId: params.careSessionId,
      }),
    ),
  );
}

/** Extension point for future email/cron daily digest. */
export async function sendDailySummary(_familyId: string, _date: Date): Promise<void> {
  // Reserved for future email/cron integration.
}
