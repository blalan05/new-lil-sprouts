import { dbIncludingDeleted } from "./db";

/** Soft-delete a family and all related records (preserves payment history). */
export async function cascadeSoftDeleteFamily(familyId: string): Promise<void> {
  const now = new Date();

  await dbIncludingDeleted.$transaction(async (tx) => {
    const sessions = await tx.careSession.findMany({
      where: { familyId },
      select: { id: true },
    });
    const sessionIds = sessions.map((session) => session.id);

    if (sessionIds.length > 0) {
      await tx.sessionExpense.updateMany({
        where: { sessionId: { in: sessionIds } },
        data: { deletedAt: now },
      });
      await tx.sessionReport.updateMany({
        where: { careSessionId: { in: sessionIds } },
        data: { deletedAt: now },
      });
      await tx.payment.updateMany({
        where: { careSessionId: { in: sessionIds } },
        data: { deletedAt: now },
      });
    }

    await tx.careSession.updateMany({ where: { familyId }, data: { deletedAt: now } });
    await tx.careSchedule.updateMany({ where: { familyId }, data: { deletedAt: now } });
    await tx.child.updateMany({ where: { familyId }, data: { deletedAt: now } });
    await tx.familyMember.updateMany({ where: { familyId }, data: { deletedAt: now } });
    await tx.document.updateMany({ where: { familyId }, data: { deletedAt: now } });
    await tx.expense.updateMany({ where: { familyId }, data: { deletedAt: now } });
    await tx.familyService.updateMany({ where: { familyId }, data: { deletedAt: now } });
    await tx.payment.updateMany({ where: { familyId }, data: { deletedAt: now } });
    await tx.family.update({ where: { id: familyId }, data: { deletedAt: now } });
  });
}
