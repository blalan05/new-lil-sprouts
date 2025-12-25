import { action, query, redirect } from "@solidjs/router";
import { db } from "./db";
import { getSessionExpenseTotal } from "./expenses";

// Get unpaid confirmed sessions for a family
export const getUnpaidSessions = query(async (familyId: string) => {
  "use server";
  
  // Get all confirmed sessions for the family
  const allSessions = await db.careSession.findMany({
    where: {
      familyId,
      isConfirmed: true,
      status: {
        in: ["SCHEDULED", "COMPLETED"],
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

  // Filter out sessions that already have a PAID payment
  const unpaidSessions = allSessions.filter(
    (session) => session.payments.length === 0
  );

  return unpaidSessions;
}, "unpaid-sessions");

// Create a payment for multiple sessions
export const createPayment = action(async (formData: FormData) => {
  "use server";
  try {
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

    // Get the sessions to calculate total
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

    // Calculate total amount
    // Note: hourlyRate is already the total rate (per-child rate * number of children)
    let totalAmount = 0;
    for (const session of sessions) {
      const startTime = new Date(session.scheduledStart).getTime();
      const endTime = new Date(session.scheduledEnd).getTime();
      const hours = (endTime - startTime) / (1000 * 60 * 60);
      
      // Use session hourly rate (which is already total rate for all children)
      const rate = session.hourlyRate || 0;
      totalAmount += hours * rate;

      // Add expenses for this session
      const expenses = await db.sessionExpense.findMany({
        where: { sessionId: session.id },
        select: { amount: true },
      });
      const expenseTotal = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      totalAmount += expenseTotal;
    }

    // Add tips/bonuses
    const tipsAmount = parseFloat(tips) || 0;
    totalAmount += tipsAmount;

    if (totalAmount <= 0) {
      return new Error("Total amount must be greater than 0");
    }

    // Generate invoice number (simple format: INV-YYYYMMDD-XXX)
    const today = new Date();
    const dateStr = today.toISOString().split("T")[0].replace(/-/g, "");
    const randomSuffix = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    const baseInvoiceNumber = `INV-${dateStr}-${randomSuffix}`;

    // Create individual payment records for each session to mark them as paid
    let sessionIndex = 0;
    for (const sessionId of sessionIds) {
      const session = sessions.find((s) => s.id === sessionId);
      if (session) {
        const startTime = new Date(session.scheduledStart).getTime();
        const endTime = new Date(session.scheduledEnd).getTime();
        const hours = (endTime - startTime) / (1000 * 60 * 60);
        const rate = session.hourlyRate || 0;
        const sessionAmount = hours * rate;

        // Get expenses for this session
        const expenses = await db.sessionExpense.findMany({
          where: { sessionId },
          select: { amount: true },
        });
        const expenseTotal = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const totalSessionAmount = sessionAmount + expenseTotal;

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

    // Create a separate payment record for tips if there are tips
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

    return redirect(`/payments?success=true`);
  } catch (err) {
    console.error("Error creating payment:", err);
    return new Error(err instanceof Error ? err.message : "Failed to create payment");
  }
});

// Get all payments with optional year filter
export const getPayments = query(async (year?: number) => {
  "use server";
  const where: any = {};
  
  // Filter by year if provided (based on paidDate or createdAt)
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

