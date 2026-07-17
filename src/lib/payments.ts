import { action, query } from "@solidjs/router";
import { db } from "./db";
import { getSessionExpenseTotal } from "./expenses";
import { calculateHours, calculateSessionCost, sumMoney, addMoney, roundMoney } from "./money";
import { serverRedirect } from "./server-redirect";
import { assertOwnerAction, familyIdWhere, requireOwner } from "./auth";

export const getUnpaidSessions = query(async (familyId: string) => {
  "use server";
  await requireOwner();

  const allSessions = await db.careSession.findMany({
    where: {
      familyId,
      isConfirmed: true,
      status: {
        in: ["SCHEDULED", "IN_PROGRESS", "COMPLETED"],
      },
    },
    include: {
      service: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
      children: true,
      expenses: {
        select: {
          amount: true,
        },
      },
      payments: {
        where: {
          status: "PAID",
        },
      },
    },
    orderBy: {
      scheduledStart: "asc",
    },
  });

  return allSessions.filter((session) => session.payments.length === 0);
}, "unpaidSessions");

export const createPayment = action(async (formData: FormData) => {
  "use server";
  try {
    const owner = await assertOwnerAction();
    if (owner instanceof Error) return owner;

    const familyId = String(formData.get("familyId"));
    const sessionIds = formData.getAll("sessionIds") as string[];
    const tips = String(formData.get("tips") || "0");
    const method = String(formData.get("method") || "");
    const notes = String(formData.get("notes") || "");
    const paidDate = String(formData.get("paidDate") || new Date().toISOString());

    if (!familyId) {
      return new Error("Family is required");
    }

    if (sessionIds.length === 0) {
      return new Error("Please select at least one session");
    }

    const sessions = await db.careSession.findMany({
      where: {
        id: {
          in: sessionIds,
        },
        familyId,
      },
      include: {
        children: true,
      },
    });

    if (sessions.length === 0) {
      return new Error("No sessions found");
    }

    const sessionAmounts: number[] = [];

    for (const session of sessions) {
      const hours = calculateHours(
        new Date(session.scheduledStart),
        new Date(session.scheduledEnd),
      );

      const rate = session.hourlyRate || 0;
      const sessionCost = calculateSessionCost(hours, rate);
      sessionAmounts.push(sessionCost);

      const expenses = await db.sessionExpense.findMany({
        where: { sessionId: session.id },
        select: { amount: true },
      });
      const expenseTotal = sumMoney(expenses.map((exp) => exp.amount));
      sessionAmounts.push(expenseTotal);
    }

    const tipsAmount = parseFloat(tips) || 0;
    if (tipsAmount > 0) {
      sessionAmounts.push(tipsAmount);
    }

    const totalAmount = roundMoney(sumMoney(sessionAmounts));

    if (totalAmount <= 0) {
      return new Error("Total amount must be greater than 0");
    }

    const today = new Date();
    const dateStr = today.toISOString().split("T")[0].replace(/-/g, "");
    const randomSuffix = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    const baseInvoiceNumber = `INV-${dateStr}-${randomSuffix}`;

    let sessionIndex = 0;
    for (const sessionId of sessionIds) {
      const session = sessions.find((s) => s.id === sessionId);
      if (session) {
        const hours = calculateHours(
          new Date(session.scheduledStart),
          new Date(session.scheduledEnd),
        );
        const rate = session.hourlyRate || 0;
        const sessionAmount = calculateSessionCost(hours, rate);

        const expenses = await db.sessionExpense.findMany({
          where: { sessionId },
          select: { amount: true },
        });
        const expenseTotal = sumMoney(expenses.map((exp) => exp.amount));
        const totalSessionAmount = roundMoney(addMoney(sessionAmount, expenseTotal));

        await db.payment.create({
          data: {
            familyId,
            careSessionId: sessionId,
            amount: totalSessionAmount,
            status: "PAID",
            paidDate: new Date(paidDate),
            method: method || null,
            notes: notes || null,
            invoiceNumber: `${baseInvoiceNumber}-${(sessionIndex + 1).toString().padStart(2, "0")}`,
            taxYear: today.getFullYear(),
          },
        });
        sessionIndex++;
      }
    }

    if (tipsAmount > 0) {
      await db.payment.create({
        data: {
          familyId,
          amount: tipsAmount,
          status: "PAID",
          paidDate: new Date(paidDate),
          method: method || null,
          notes: `Tips/Bonus${notes ? ` - ${notes}` : ""}`,
          invoiceNumber: `${baseInvoiceNumber}-TIPS`,
          taxYear: today.getFullYear(),
        },
      });
    }

    return serverRedirect(`/payments?success=true`);
  } catch (err) {
    console.error("Error creating payment:", err);
    return new Error(err instanceof Error ? err.message : "Failed to create payment");
  }
});

export const getPayments = query(async (year?: number) => {
  "use server";
  const user = await requireOwner();
  const where: Record<string, unknown> = {
    ...familyIdWhere(user),
  };

  if (year) {
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59);
    where.OR = [
      { paidDate: { gte: startOfYear, lte: endOfYear } },
      { paidDate: null, createdAt: { gte: startOfYear, lte: endOfYear } },
    ];
  }

  const payments = await db.payment.findMany({
    where,
    include: {
      family: {
        select: {
          id: true,
          familyName: true,
        },
      },
      careSession: {
        select: {
          id: true,
          scheduledStart: true,
          scheduledEnd: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return payments;
}, "payments");
