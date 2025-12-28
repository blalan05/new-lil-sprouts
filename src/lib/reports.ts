import { query } from "@solidjs/router";
import { db } from "./db";
import { formatParentNames } from "./families";

export interface YearEndFamilyReport {
  familyId: string;
  familyName: string;
  parentName: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  children: Array<{
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
  }>;
  sessions: Array<{
    id: string;
    date: Date;
    startTime: Date;
    endTime: Date;
    serviceName: string;
    children: Array<{
      id: string;
      firstName: string;
      lastName: string;
    }>;
    hours: number;
    hourlyRate: number | null;
    sessionAmount: number;
    expenses: number;
    totalAmount: number;
    status: string;
  }>;
  standaloneExpenses: Array<{
    amount: number;
    description: string;
    category: string | null;
    expenseDate: Date;
  }>;
  totalHours: number;
  totalSessions: number;
  totalAmount: number;
  totalPaid: number;
  totalOutstanding: number;
  totalStandaloneExpenses: number;
}

// Get year-end report for a specific family
export const getYearEndFamilyReport = query(async (familyId: string, year: number) => {
  "use server";
  return generateYearEndReport(familyId, year);
});

// Get all families for year-end reports
export const getAllFamiliesForReports = query(async () => {
  "use server";
  const families = await db.family.findMany({
    select: {
      id: true,
      familyName: true,
      parentFirstName: true,
      parentLastName: true,
      familyMembers: {
        where: {
          relationship: "PARENT",
        },
        select: {
          firstName: true,
          lastName: true,
          relationship: true,
        },
      },
    },
    orderBy: {
      familyName: "asc",
    },
  });
  return families;
});

// Helper function to generate a report (not a query, used internally)
async function generateYearEndReport(familyId: string, year: number): Promise<YearEndFamilyReport> {
  const startDate = new Date(year, 0, 1); // January 1st
  const endDate = new Date(year, 11, 31, 23, 59, 59, 999); // December 31st

  // Get family details
  const family = await db.family.findUnique({
    where: { id: familyId },
    include: {
      children: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          dateOfBirth: true,
        },
        orderBy: {
          firstName: "asc",
        },
      },
      familyMembers: {
        where: {
          relationship: "PARENT",
        },
        select: {
          firstName: true,
          lastName: true,
          relationship: true,
        },
      },
    },
  });

  if (!family) {
    throw new Error("Family not found");
  }

  // Get all sessions for the year
  const sessions = await db.careSession.findMany({
    where: {
      familyId,
      scheduledStart: {
        gte: startDate,
        lte: endDate,
      },
      status: {
        in: ["COMPLETED", "IN_PROGRESS", "SCHEDULED"],
      },
    },
    include: {
      service: {
        select: {
          id: true,
          name: true,
        },
      },
      children: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      expenses: {
        select: {
          amount: true,
        },
      },
      payments: {
        where: {
          status: "PAID",
        },
        select: {
          amount: true,
          paidDate: true,
        },
      },
    },
    orderBy: {
      scheduledStart: "asc",
    },
  });

  // Calculate totals
  let totalHours = 0;
  let totalAmount = 0;
  let totalPaid = 0;

  const sessionReports = sessions.map((session) => {
    const startTime = new Date(session.scheduledStart).getTime();
    const endTime = new Date(session.scheduledEnd).getTime();
    const hours = (endTime - startTime) / (1000 * 60 * 60);
    
    const hourlyRate = session.hourlyRate || 0;
    const sessionAmount = hours * hourlyRate;
    
    const expenses = session.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const sessionTotal = sessionAmount + expenses;
    
    totalHours += hours;
    totalAmount += sessionTotal;
    
    // Calculate paid amount for this session
    const sessionPaid = session.payments.reduce((sum, pay) => sum + pay.amount, 0);
    totalPaid += sessionPaid;

    return {
      id: session.id,
      date: session.scheduledStart,
      startTime: session.scheduledStart,
      endTime: session.scheduledEnd,
      serviceName: session.service.name,
      children: session.children,
      hours,
      hourlyRate: session.hourlyRate,
      sessionAmount,
      expenses,
      totalAmount: sessionTotal,
      status: session.status,
    };
  });

  // Get all payments for the year
  const allPayments = await db.payment.findMany({
    where: {
      familyId,
      paidDate: {
        gte: startDate,
        lte: endDate,
      },
      status: "PAID",
    },
    select: {
      amount: true,
    },
  });

  const totalPaidFromPayments = allPayments.reduce((sum, pay) => sum + pay.amount, 0);
  totalPaid = Math.max(totalPaid, totalPaidFromPayments);
  
  // Get standalone expenses for this family in the year
  const standaloneExpenses = await db.expense.findMany({
    where: {
      familyId: family.id,
      expenseDate: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      amount: true,
      description: true,
      category: true,
      expenseDate: true,
    },
  });
  
  const totalStandaloneExpenses = standaloneExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalOutstanding = totalAmount - totalPaid;

  return {
    familyId: family.id,
    familyName: family.familyName,
    parentName: formatParentNames(
      family.parentFirstName,
      family.parentLastName,
      family.familyMembers
    ),
    email: family.email,
    phone: family.phone,
    address: family.address,
    city: family.city,
    state: family.state,
    zipCode: family.zipCode,
    children: family.children,
    sessions: sessionReports,
    standaloneExpenses,
    totalHours,
    totalSessions: sessions.length,
    totalAmount,
    totalPaid,
    totalOutstanding,
    totalStandaloneExpenses,
  } as YearEndFamilyReport;
}

// Get year-end report for all families
export const getAllYearEndReports = query(async (year: number) => {
  "use server";
  const families = await db.family.findMany({
    select: {
      id: true,
    },
    orderBy: {
      familyName: "asc",
    },
  });

  const reports = await Promise.all(
    families.map((family) => generateYearEndReport(family.id, year))
  );

  return reports;
});

export interface IncomeReport {
  period: string; // e.g., "2024" or "2024-01"
  startDate: Date;
  endDate: Date;
  grossIncome: number;
  totalExpenses: number;
  netIncome: number;
  paymentCount: number;
  expenseCount: number;
  byFamily: Array<{
    familyId: string;
    familyName: string;
    amount: number;
    paymentCount: number;
  }>;
  byMonth: Array<{
    month: string; // "YYYY-MM"
    grossIncome: number;
    expenses: number;
    netIncome: number;
  }>;
}

// Get income report for a specific period (year or year-month)
export const getIncomeReport = query(async (year: number, month?: number) => {
  "use server";
  
  let startDate: Date;
  let endDate: Date;
  let period: string;

  if (month !== undefined && month !== null) {
    // Specific month
    startDate = new Date(year, month - 1, 1);
    endDate = new Date(year, month, 0, 23, 59, 59, 999);
    period = `${year}-${String(month).padStart(2, "0")}`;
  } else {
    // Entire year
    startDate = new Date(year, 0, 1);
    endDate = new Date(year, 11, 31, 23, 59, 59, 999);
    period = String(year);
  }

  // Get all paid payments in the period
  const payments = await db.payment.findMany({
    where: {
      status: "PAID",
      paidDate: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      family: {
        select: {
          id: true,
          familyName: true,
        },
      },
    },
  });

  // Calculate gross income
  const grossIncome = payments.reduce((sum, payment) => sum + payment.amount, 0);

  // Get all expenses in the period (from sessions that occurred in this period)
  const sessions = await db.careSession.findMany({
    where: {
      scheduledStart: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      id: true,
      scheduledStart: true,
    },
  });

  const sessionIds = sessions.map((s) => s.id);

  const expenses = await db.sessionExpense.findMany({
    where: {
      sessionId: {
        in: sessionIds,
      },
    },
  });

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const netIncome = grossIncome - totalExpenses;

  // Group by family
  const familyMap = new Map<string, { familyName: string; amount: number; paymentCount: number }>();
  payments.forEach((payment) => {
    if (payment.familyId && payment.family) {
      const existing = familyMap.get(payment.familyId) || {
        familyName: payment.family.familyName,
        amount: 0,
        paymentCount: 0,
      };
      existing.amount += payment.amount;
      existing.paymentCount += 1;
      familyMap.set(payment.familyId, existing);
    }
  });

  const byFamily = Array.from(familyMap.entries()).map(([familyId, data]) => ({
    familyId,
    familyName: data.familyName,
    amount: data.amount,
    paymentCount: data.paymentCount,
  }));

  // Group by month
  const monthMap = new Map<string, { grossIncome: number; expenses: number }>();
  
  // Initialize all months in the period
  if (month !== undefined && month !== null) {
    // Single month
    monthMap.set(period, { grossIncome: 0, expenses: 0 });
  } else {
    // All months in the year
    for (let m = 1; m <= 12; m++) {
      monthMap.set(`${year}-${String(m).padStart(2, "0")}`, { grossIncome: 0, expenses: 0 });
    }
  }

  // Add payments to months
  payments.forEach((payment) => {
    if (payment.paidDate) {
      const paymentDate = new Date(payment.paidDate);
      const monthKey = `${paymentDate.getFullYear()}-${String(paymentDate.getMonth() + 1).padStart(2, "0")}`;
      const existing = monthMap.get(monthKey);
      if (existing) {
        existing.grossIncome += payment.amount;
        monthMap.set(monthKey, existing);
      }
    }
  });

  // Add expenses to months
  expenses.forEach((expense) => {
    const session = sessions.find((s) => s.id === expense.sessionId);
    if (session && session.scheduledStart) {
      const sessionDate = new Date(session.scheduledStart);
      const monthKey = `${sessionDate.getFullYear()}-${String(sessionDate.getMonth() + 1).padStart(2, "0")}`;
      const existing = monthMap.get(monthKey);
      if (existing) {
        existing.expenses += expense.amount;
        monthMap.set(monthKey, existing);
      }
    }
  });

  const byMonth = Array.from(monthMap.entries())
    .map(([month, data]) => ({
      month,
      grossIncome: data.grossIncome,
      expenses: data.expenses,
      netIncome: data.grossIncome - data.expenses,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return {
    period,
    startDate,
    endDate,
    grossIncome,
    totalExpenses,
    netIncome,
    paymentCount: payments.length,
    expenseCount: expenses.length,
    byFamily: byFamily.sort((a, b) => b.amount - a.amount),
    byMonth,
  } as IncomeReport;
});

