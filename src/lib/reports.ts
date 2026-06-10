import { query } from "@solidjs/router";
import { db, dbIncludingDeleted } from "./db";
import { requireOwner, assertFamilyExists } from "./auth";
import { formatParentNames } from "./families";
import {
  calculateSessionCost,
  calculateHours,
  sumMoney,
  addMoney,
  subtractMoney,
  moneyToString,
  compareMoney,
  serializeMoneyDeep,
} from "./money";

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
    hourlyRate: string | null;
    sessionAmount: string;
    expenses: string;
    totalAmount: string;
    status: string;
  }>;
  standaloneExpenses: Array<{
    amount: string;
    description: string;
    category: string | null;
    expenseDate: Date;
  }>;
  totalHours: number;
  totalSessions: number;
  totalAmount: string;
  totalPaid: string;
  totalOutstanding: string;
  totalStandaloneExpenses: string;
}

// Get year-end report for a specific family
export const getYearEndFamilyReport = query(async (familyId: string, year: number) => {
  "use server";
  await requireOwner();
  return generateYearEndReport(familyId, year);
});

// Get all families for year-end reports
export const getAllFamiliesForReports = query(async () => {
  "use server";
  await requireOwner();
  const families = await dbIncludingDeleted.family.findMany({
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
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

  const family = await dbIncludingDeleted.family.findUnique({
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
  const sessions = await dbIncludingDeleted.careSession.findMany({
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

  let totalHours = 0;
  let totalAmount = sumMoney([]);
  let totalPaid = sumMoney([]);

  const sessionReports = sessions.map((session) => {
    const hours = calculateHours(session.scheduledStart, session.scheduledEnd);
    const sessionAmount = calculateSessionCost(hours, session.hourlyRate);
    const expenses = sumMoney(session.expenses.map((exp) => exp.amount));
    const sessionTotal = addMoney(sessionAmount, expenses);

    totalHours += hours;
    totalAmount = addMoney(totalAmount, sessionTotal);

    const sessionPaid = sumMoney(session.payments.map((pay) => pay.amount));
    totalPaid = addMoney(totalPaid, sessionPaid);

    return {
      id: session.id,
      date: session.scheduledStart,
      startTime: session.scheduledStart,
      endTime: session.scheduledEnd,
      serviceName: session.service.name,
      children: session.children,
      hours,
      hourlyRate: session.hourlyRate != null ? moneyToString(session.hourlyRate) : null,
      sessionAmount: moneyToString(sessionAmount),
      expenses: moneyToString(expenses),
      totalAmount: moneyToString(sessionTotal),
      status: session.status,
    };
  });

  const allPayments = await dbIncludingDeleted.payment.findMany({
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

  const totalPaidFromPayments = sumMoney(allPayments.map((pay) => pay.amount));
  if (compareMoney(totalPaidFromPayments, totalPaid) > 0) {
    totalPaid = totalPaidFromPayments;
  }

  const standaloneExpenses = await dbIncludingDeleted.expense.findMany({
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
  
  const totalStandaloneExpenses = sumMoney(standaloneExpenses.map((exp) => exp.amount));
  const totalOutstanding = subtractMoney(totalAmount, totalPaid);

  return serializeMoneyDeep({
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
    totalAmount: moneyToString(totalAmount),
    totalPaid: moneyToString(totalPaid),
    totalOutstanding: moneyToString(totalOutstanding),
    totalStandaloneExpenses: moneyToString(totalStandaloneExpenses),
  }) as YearEndFamilyReport;
}

// Get year-end report for all families
export const getAllYearEndReports = query(async (year: number) => {
  "use server";
  await requireOwner();
  const families = await dbIncludingDeleted.family.findMany({
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
  grossIncome: string;
  totalExpenses: string;
  netIncome: string;
  paymentCount: number;
  expenseCount: number;
  byFamily: Array<{
    familyId: string;
    familyName: string;
    amount: string;
    paymentCount: number;
  }>;
  byMonth: Array<{
    month: string;
    grossIncome: string;
    expenses: string;
    netIncome: string;
  }>;
}

// Get income report for a specific period (year or year-month)
export const getIncomeReport = query(async (year: number, month?: number) => {
  "use server";
  await requireOwner();
  
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
  const payments = await dbIncludingDeleted.payment.findMany({
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
  const grossIncome = sumMoney(payments.map((payment) => payment.amount));

  const sessions = await dbIncludingDeleted.careSession.findMany({
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

  const expenses = await dbIncludingDeleted.sessionExpense.findMany({
    where: {
      sessionId: {
        in: sessionIds,
      },
    },
  });

  const totalExpenses = sumMoney(expenses.map((exp) => exp.amount));
  const netIncome = subtractMoney(grossIncome, totalExpenses);

  const familyMap = new Map<
    string,
    { familyName: string; amount: ReturnType<typeof sumMoney>; paymentCount: number }
  >();
  payments.forEach((payment) => {
    if (payment.familyId && payment.family) {
      const existing = familyMap.get(payment.familyId) || {
        familyName: payment.family.familyName,
        amount: sumMoney([]),
        paymentCount: 0,
      };
      existing.amount = addMoney(existing.amount, payment.amount);
      existing.paymentCount += 1;
      familyMap.set(payment.familyId, existing);
    }
  });

  const byFamily = Array.from(familyMap.entries()).map(([familyId, data]) => ({
    familyId,
    familyName: data.familyName,
    amount: moneyToString(data.amount),
    paymentCount: data.paymentCount,
  }));

  const monthMap = new Map<
    string,
    { grossIncome: ReturnType<typeof sumMoney>; expenses: ReturnType<typeof sumMoney> }
  >();
  
  // Initialize all months in the period
  if (month !== undefined && month !== null) {
    // Single month
    monthMap.set(period, { grossIncome: sumMoney([]), expenses: sumMoney([]) });
  } else {
    for (let m = 1; m <= 12; m++) {
      monthMap.set(`${year}-${String(m).padStart(2, "0")}`, {
        grossIncome: sumMoney([]),
        expenses: sumMoney([]),
      });
    }
  }

  payments.forEach((payment) => {
    if (payment.paidDate) {
      const paymentDate = new Date(payment.paidDate);
      const monthKey = `${paymentDate.getFullYear()}-${String(paymentDate.getMonth() + 1).padStart(2, "0")}`;
      const existing = monthMap.get(monthKey);
      if (existing) {
        existing.grossIncome = addMoney(existing.grossIncome, payment.amount);
        monthMap.set(monthKey, existing);
      }
    }
  });

  expenses.forEach((expense) => {
    const session = sessions.find((s) => s.id === expense.sessionId);
    if (session && session.scheduledStart) {
      const sessionDate = new Date(session.scheduledStart);
      const monthKey = `${sessionDate.getFullYear()}-${String(sessionDate.getMonth() + 1).padStart(2, "0")}`;
      const existing = monthMap.get(monthKey);
      if (existing) {
        existing.expenses = addMoney(existing.expenses, expense.amount);
        monthMap.set(monthKey, existing);
      }
    }
  });

  const byMonth = Array.from(monthMap.entries())
    .map(([month, data]) => ({
      month,
      grossIncome: moneyToString(data.grossIncome),
      expenses: moneyToString(data.expenses),
      netIncome: moneyToString(subtractMoney(data.grossIncome, data.expenses)),
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return {
    period,
    startDate,
    endDate,
    grossIncome: moneyToString(grossIncome),
    totalExpenses: moneyToString(totalExpenses),
    netIncome: moneyToString(netIncome),
    paymentCount: payments.length,
    expenseCount: expenses.length,
    byFamily: byFamily.sort((a, b) => compareMoney(b.amount, a.amount)),
    byMonth,
  } as IncomeReport;
});

export interface ExpenseCategorySummary {
  category: string;
  amount: string;
  count: number;
}

export interface AnnualTaxSummary {
  year: number;
  grossIncome: string;
  totalExpenses: string;
  netIncome: string;
  paymentCount: number;
  byCategory: ExpenseCategorySummary[];
}

async function getExpenseCategoriesForYear(year: number, familyId?: string): Promise<ExpenseCategorySummary[]> {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

  const standalone = await dbIncludingDeleted.expense.findMany({
    where: {
      expenseDate: { gte: startDate, lte: endDate },
      ...(familyId ? { familyId } : {}),
    },
    select: { amount: true, category: true },
  });

  const sessions = await dbIncludingDeleted.careSession.findMany({
    where: {
      scheduledStart: { gte: startDate, lte: endDate },
      ...(familyId ? { familyId } : {}),
    },
    select: { id: true },
  });

  const sessionExpenses = await dbIncludingDeleted.sessionExpense.findMany({
    where: { sessionId: { in: sessions.map((s) => s.id) } },
    select: { amount: true, category: true },
  });

  const categoryMap = new Map<string, { total: ReturnType<typeof sumMoney>; count: number }>();

  for (const expense of [...standalone, ...sessionExpenses]) {
    const category = expense.category || "UNCATEGORIZED";
    const existing = categoryMap.get(category) ?? { total: sumMoney([]), count: 0 };
    categoryMap.set(category, {
      total: addMoney(existing.total, expense.amount),
      count: existing.count + 1,
    });
  }

  return Array.from(categoryMap.entries())
    .map(([category, data]) => ({
      category,
      amount: moneyToString(data.total),
      count: data.count,
    }))
    .sort((a, b) => compareMoney(b.amount, a.amount));
}

export const getAnnualTaxSummary = query(async (year: number, familyId?: string) => {
  "use server";
  await requireOwner();
  if (familyId) {
    await assertFamilyExists(familyId);
  }

  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

  const payments = await dbIncludingDeleted.payment.findMany({
    where: {
      status: "PAID",
      OR: [
        { taxYear: year },
        { paidDate: { gte: startDate, lte: endDate } },
      ],
      ...(familyId ? { familyId } : {}),
    },
    select: { amount: true },
  });

  const grossIncome = sumMoney(payments.map((p) => p.amount));
  const byCategory = await getExpenseCategoriesForYear(year, familyId);
  const totalExpenses = sumMoney(byCategory.map((c) => c.amount));

  return {
    year,
    grossIncome: moneyToString(grossIncome),
    totalExpenses: moneyToString(totalExpenses),
    netIncome: moneyToString(subtractMoney(grossIncome, totalExpenses)),
    paymentCount: payments.length,
    byCategory,
  } satisfies AnnualTaxSummary;
}, "annual-tax-summary");

function csvEscape(value: string | number | null | undefined): string {
  const str = value == null ? "" : String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function buildYearEndCsv(report: YearEndFamilyReport, taxSummary: AnnualTaxSummary): string {
  const rows: string[] = [];
  rows.push(`Year-End Report ${taxSummary.year},${csvEscape(report.familyName)}`);
  rows.push(`Parent,${csvEscape(report.parentName)}`);
  rows.push(`Email,${csvEscape(report.email)}`);
  rows.push("");
  rows.push("Annual Summary (cash basis - payments received)");
  rows.push(`Gross Income,${csvEscape(taxSummary.grossIncome)}`);
  rows.push(`Total Expenses,${csvEscape(taxSummary.totalExpenses)}`);
  rows.push(`Net Income,${csvEscape(taxSummary.netIncome)}`);
  rows.push("");
  rows.push("Expenses by Category");
  rows.push("Category,Amount,Count");
  taxSummary.byCategory.forEach((row) => {
    rows.push(`${csvEscape(row.category)},${csvEscape(row.amount)},${row.count}`);
  });
  rows.push("");
  rows.push("Sessions");
  rows.push("Date,Service,Hours,Rate,Session Amount,Expenses,Total,Status");
  report.sessions.forEach((session) => {
    rows.push(
      [
        csvEscape(new Date(session.date).toLocaleDateString()),
        csvEscape(session.serviceName),
        session.hours.toFixed(2),
        csvEscape(session.hourlyRate ?? ""),
        csvEscape(session.sessionAmount),
        csvEscape(session.expenses),
        csvEscape(session.totalAmount),
        csvEscape(session.status),
      ].join(","),
    );
  });
  rows.push("");
  rows.push(`Total Hours,${report.totalHours.toFixed(2)}`);
  rows.push(`Total Sessions,${report.totalSessions}`);
  rows.push(`Total Amount,${csvEscape(report.totalAmount)}`);
  rows.push(`Total Paid,${csvEscape(report.totalPaid)}`);
  rows.push(`Outstanding,${csvEscape(report.totalOutstanding)}`);
  return rows.join("\n");
}

export const exportYearEndCsv = query(async (year: number, familyId?: string) => {
  "use server";
  await requireOwner();

  if (familyId) {
    const report = await generateYearEndReport(familyId, year);
    const taxSummary = await getExpenseCategoriesForYear(year, familyId).then(async (byCategory) => {
      const payments = await dbIncludingDeleted.payment.findMany({
        where: {
          status: "PAID",
          familyId,
          OR: [
            { taxYear: year },
            {
              paidDate: {
                gte: new Date(year, 0, 1),
                lte: new Date(year, 11, 31, 23, 59, 59, 999),
              },
            },
          ],
        },
        select: { amount: true },
      });
      const grossIncome = sumMoney(payments.map((p) => p.amount));
      const totalExpenses = sumMoney(byCategory.map((c) => c.amount));
      return {
        year,
        grossIncome: moneyToString(grossIncome),
        totalExpenses: moneyToString(totalExpenses),
        netIncome: moneyToString(subtractMoney(grossIncome, totalExpenses)),
        paymentCount: payments.length,
        byCategory,
      } satisfies AnnualTaxSummary;
    });

    return {
      filename: `year-end-${year}-${report.familyName.replace(/\s+/g, "-").toLowerCase()}.csv`,
      content: buildYearEndCsv(report, taxSummary),
    };
  }

  const families = await dbIncludingDeleted.family.findMany({ select: { id: true } });
  const sections: string[] = [];
  for (const family of families) {
    const report = await generateYearEndReport(family.id, year);
    const taxSummary = {
      year,
      grossIncome: report.totalPaid,
      totalExpenses: moneyToString(
        addMoney(report.totalStandaloneExpenses, sumMoney(report.sessions.map((s) => s.expenses))),
      ),
      netIncome: moneyToString(subtractMoney(report.totalPaid, report.totalAmount)),
      paymentCount: 0,
      byCategory: await getExpenseCategoriesForYear(year, family.id),
    } satisfies AnnualTaxSummary;
    sections.push(buildYearEndCsv(report, taxSummary));
    sections.push("");
  }
  return {
    filename: `year-end-${year}-all-families.csv`,
    content: sections.join("\n"),
  };
}, "export-year-end-csv");

