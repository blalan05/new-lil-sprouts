import { action, query, reload } from "@solidjs/router";
import { db } from "./db";

// Get all expenses for a session
export const getSessionExpenses = query(async (sessionId: string) => {
  "use server";
  const expenses = await db.sessionExpense.findMany({
    where: {
      sessionId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return expenses;
}, "session-expenses");

// Create a new expense
export const createExpense = action(async (formData: FormData) => {
  "use server";
  try {
    const sessionId = String(formData.get("sessionId"));
    const description = String(formData.get("description"));
    const amount = String(formData.get("amount"));
    const category = String(formData.get("category") || "");
    const notes = String(formData.get("notes") || "");

    if (!sessionId || !description || !amount) {
      return new Error("Session ID, description, and amount are required");
    }

    const expense = await db.sessionExpense.create({
      data: {
        sessionId,
        description,
        amount: parseFloat(amount),
        category: category || null,
        notes: notes || null,
      },
    });

    return { success: true, expense };
  } catch (err) {
    console.error("Error creating expense:", err);
    return new Error(err instanceof Error ? err.message : "Failed to create expense");
  }
});

// Update an expense
export const updateExpense = action(async (formData: FormData) => {
  "use server";
  try {
    const id = String(formData.get("id"));
    const description = String(formData.get("description"));
    const amount = String(formData.get("amount"));
    const category = String(formData.get("category") || "");
    const notes = String(formData.get("notes") || "");

    if (!description || !amount) {
      return new Error("Description and amount are required");
    }

    await db.sessionExpense.update({
      where: { id },
      data: {
        description,
        amount: parseFloat(amount),
        category: category || null,
        notes: notes || null,
      },
    });

    return { success: true };
  } catch (err) {
    console.error("Error updating expense:", err);
    return new Error(err instanceof Error ? err.message : "Failed to update expense");
  }
});

// Delete an expense
export const deleteExpense = action(async (formData: FormData) => {
  "use server";
  try {
    const id = String(formData.get("id"));

    await db.sessionExpense.delete({
      where: { id },
    });

    return { success: true };
  } catch (err) {
    console.error("Error deleting expense:", err);
    return new Error(err instanceof Error ? err.message : "Failed to delete expense");
  }
});

// Get total expenses for a session
export const getSessionExpenseTotal = query(async (sessionId: string) => {
  "use server";
  const expenses = await db.sessionExpense.findMany({
    where: {
      sessionId,
    },
    select: {
      amount: true,
    },
  });

  return expenses.reduce((total, expense) => total + expense.amount, 0);
}, "session-expense-total");

// Get all standalone expenses (optionally filtered by family)
export const getExpenses = query(async (familyId?: string) => {
  "use server";
  const expenses = await db.expense.findMany({
    where: familyId ? { familyId } : {},
    include: {
      family: {
        select: {
          id: true,
          familyName: true,
        },
      },
    },
    orderBy: {
      expenseDate: "desc",
    },
  });
  return expenses;
}, "expenses");

// Get expenses for a specific date range (for reports)
export const getExpensesByDateRange = query(async (startDate: Date, endDate: Date, familyId?: string) => {
  "use server";
  const expenses = await db.expense.findMany({
    where: {
      expenseDate: {
        gte: startDate,
        lte: endDate,
      },
      ...(familyId ? { familyId } : {}),
    },
    include: {
      family: {
        select: {
          id: true,
          familyName: true,
        },
      },
    },
    orderBy: {
      expenseDate: "desc",
    },
  });
  return expenses;
}, "expenses-by-date-range");

// Create a standalone expense
export const createStandaloneExpense = action(async (formData: FormData) => {
  "use server";
  try {
    const description = String(formData.get("description"));
    const amount = String(formData.get("amount"));
    const category = String(formData.get("category") || "");
    const expenseDate = String(formData.get("expenseDate") || "");
    const familyId = String(formData.get("familyId") || "");
    const notes = String(formData.get("notes") || "");

    if (!description || !amount) {
      return new Error("Description and amount are required");
    }

    await db.expense.create({
      data: {
        description,
        amount: parseFloat(amount),
        category: category || null,
        expenseDate: expenseDate ? parseFormDate(expenseDate) : new Date(),
        familyId: familyId || null,
        notes: notes || null,
      },
    });

    return reload();
  } catch (err) {
    console.error("Error creating expense:", err);
    return new Error(err instanceof Error ? err.message : "Failed to create expense");
  }
});

// Update a standalone expense
export const updateStandaloneExpense = action(async (formData: FormData) => {
  "use server";
  try {
    const id = String(formData.get("id"));
    const description = String(formData.get("description"));
    const amount = String(formData.get("amount"));
    const category = String(formData.get("category") || "");
    const expenseDate = String(formData.get("expenseDate") || "");
    const familyId = String(formData.get("familyId") || "");
    const notes = String(formData.get("notes") || "");

    if (!id || !description || !amount) {
      return new Error("ID, description, and amount are required");
    }

    await db.expense.update({
      where: { id },
      data: {
        description,
        amount: parseFloat(amount),
        category: category || null,
        expenseDate: expenseDate ? parseFormDate(expenseDate) : new Date(),
        familyId: familyId || null,
        notes: notes || null,
      },
    });

    return reload();
  } catch (err) {
    console.error("Error updating expense:", err);
    return new Error(err instanceof Error ? err.message : "Failed to update expense");
  }
});

// Delete a standalone expense
export const deleteStandaloneExpense = action(async (formData: FormData) => {
  "use server";
  try {
    const id = String(formData.get("id"));
    if (!id) {
      return new Error("Expense ID is required");
    }

    await db.expense.delete({
      where: { id },
    });

    return reload();
  } catch (err) {
    console.error("Error deleting expense:", err);
    return new Error(err instanceof Error ? err.message : "Failed to delete expense");
  }
});

