import { query } from "@solidjs/router";
import { db } from "./db";
import {
  calculateHours as calcHours,
  calculateSessionCost,
  sumMoney,
  roundMoney,
} from "./money";
import { familyIdWhere, requireUser } from "./auth";

function sessionScopeWhere(user: Awaited<ReturnType<typeof requireUser>>) {
  return familyIdWhere(user);
}

function periodRange(period: "lastWeek" | "thisWeek" | "month" | "ytd") {
  const now = new Date();
  let startDate: Date;
  let endDate: Date = new Date(now);
  endDate.setHours(23, 59, 59, 999);

  switch (period) {
    case "lastWeek": {
      const lastWeekStart = new Date(now);
      lastWeekStart.setDate(now.getDate() - now.getDay() - 6);
      lastWeekStart.setHours(0, 0, 0, 0);
      startDate = lastWeekStart;
      const lastWeekEnd = new Date(lastWeekStart);
      lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
      endDate = lastWeekEnd;
      endDate.setHours(23, 59, 59, 999);
      break;
    }
    case "thisWeek": {
      const thisWeekStart = new Date(now);
      thisWeekStart.setDate(now.getDate() - now.getDay() + 1);
      thisWeekStart.setHours(0, 0, 0, 0);
      startDate = thisWeekStart;
      const thisWeekEnd = new Date(thisWeekStart);
      thisWeekEnd.setDate(thisWeekStart.getDate() + 6);
      endDate = thisWeekEnd;
      endDate.setHours(23, 59, 59, 999);
      break;
    }
    case "month": {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      break;
    }
    case "ytd": {
      startDate = new Date(now.getFullYear(), 0, 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    }
  }

  return { startDate, endDate };
}

function sumSessionHours(sessions: Array<{ scheduledStart: Date; scheduledEnd: Date }>) {
  return sessions.reduce((total, session) => {
    return (
      total + calcHours(new Date(session.scheduledStart), new Date(session.scheduledEnd))
    );
  }, 0);
}

function sumSessionMoney(
  sessions: Array<{
    scheduledStart: Date;
    scheduledEnd: Date;
    hourlyRate: number | null;
    expenses?: Array<{ amount: number }>;
  }>,
) {
  const moneyAmounts: number[] = [];
  for (const session of sessions) {
    const sessionHours = calcHours(
      new Date(session.scheduledStart),
      new Date(session.scheduledEnd),
    );
    const rate = session.hourlyRate || 0;
    moneyAmounts.push(calculateSessionCost(sessionHours, rate));

    const expenseTotal = sumMoney((session.expenses || []).map((exp) => exp.amount));
    if (expenseTotal > 0) {
      moneyAmounts.push(expenseTotal);
    }
  }
  return roundMoney(sumMoney(moneyAmounts));
}

// Get stats for a specific time period
export const getStatsForPeriod = query(
  async (period: "lastWeek" | "thisWeek" | "month" | "ytd") => {
    "use server";
    const user = await requireUser();
    const { startDate, endDate } = periodRange(period);

    const sessions = await db.careSession.findMany({
      where: {
        scheduledStart: {
          gte: startDate,
          lte: endDate,
        },
        status: {
          in: ["COMPLETED", "IN_PROGRESS"],
        },
        ...sessionScopeWhere(user),
      },
      include: {
        expenses: {
          select: {
            amount: true,
          },
        },
      },
    });

    return {
      hours: sumSessionHours(sessions),
      money: sumSessionMoney(sessions),
      period,
    };
  },
  "stats-for-period",
);

// Get weekly stats (hours worked and money made) - kept for backward compatibility
export const getWeeklyStats = query(async () => {
  "use server";
  const user = await requireUser();
  const now = new Date();

  const thisWeekStart = new Date(now);
  thisWeekStart.setDate(now.getDate() - now.getDay() + 1);
  thisWeekStart.setHours(0, 0, 0, 0);

  const thisWeekEnd = new Date(thisWeekStart);
  thisWeekEnd.setDate(thisWeekStart.getDate() + 6);
  thisWeekEnd.setHours(23, 59, 59, 999);

  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(thisWeekStart.getDate() - 7);

  const lastWeekEnd = new Date(thisWeekEnd);
  lastWeekEnd.setDate(thisWeekEnd.getDate() - 7);

  const sessionInclude = {
    expenses: {
      select: {
        amount: true,
      },
    },
  };

  const scope = sessionScopeWhere(user);

  const thisWeekSessions = await db.careSession.findMany({
    where: {
      scheduledStart: {
        gte: thisWeekStart,
        lte: thisWeekEnd,
      },
      status: {
        in: ["COMPLETED", "IN_PROGRESS"],
      },
      ...scope,
    },
    include: sessionInclude,
  });

  const lastWeekSessions = await db.careSession.findMany({
    where: {
      scheduledStart: {
        gte: lastWeekStart,
        lte: lastWeekEnd,
      },
      status: {
        in: ["COMPLETED", "IN_PROGRESS"],
      },
      ...scope,
    },
    include: sessionInclude,
  });

  return {
    thisWeek: {
      hours: sumSessionHours(thisWeekSessions),
      money: sumSessionMoney(thisWeekSessions),
    },
    lastWeek: {
      hours: sumSessionHours(lastWeekSessions),
      money: sumSessionMoney(lastWeekSessions),
    },
  };
}, "weekly-stats");

// Get dashboard stats
export const getDashboardStats = query(async () => {
  "use server";
  const user = await requireUser();
  const now = new Date();
  const scope = sessionScopeWhere(user);

  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const activeFamiliesCount = user.isOwner
    ? await db.family.count({
        where: {
          careSessions: {
            some: {
              scheduledStart: {
                gte: thisMonthStart,
              },
            },
          },
        },
      })
    : 1;

  const upcomingDate = new Date();
  upcomingDate.setDate(upcomingDate.getDate() + 7);

  const upcomingSessionsCount = await db.careSession.count({
    where: {
      scheduledStart: {
        gte: now,
        lte: upcomingDate,
      },
      status: {
        not: "CANCELLED",
      },
      ...scope,
    },
  });

  const unpaidSessionsCount = user.isOwner
    ? await db.careSession.count({
        where: {
          isConfirmed: true,
          status: {
            in: ["SCHEDULED", "COMPLETED"],
          },
          payments: {
            none: {
              status: "PAID",
            },
          },
          ...scope,
        },
      })
    : 0;

  const thisMonthSessions = await db.careSession.findMany({
    where: {
      scheduledStart: {
        gte: thisMonthStart,
        lte: thisMonthEnd,
      },
      status: {
        in: ["COMPLETED", "IN_PROGRESS"],
      },
      ...scope,
    },
  });

  const thisMonthSessionsWithExpenses = await db.careSession.findMany({
    where: {
      scheduledStart: {
        gte: thisMonthStart,
        lte: thisMonthEnd,
      },
      status: {
        in: ["COMPLETED", "IN_PROGRESS"],
      },
      ...scope,
    },
    include: {
      expenses: {
        select: {
          amount: true,
        },
      },
    },
  });

  const sessionsWithRates = thisMonthSessions.filter((s) => s.hourlyRate && s.hourlyRate > 0);
  const averageHourlyRate =
    sessionsWithRates.length > 0
      ? sessionsWithRates.reduce((sum, s) => sum + (s.hourlyRate || 0), 0) /
        sessionsWithRates.length
      : 0;

  return {
    activeFamilies: activeFamiliesCount,
    upcomingSessions: upcomingSessionsCount,
    unpaidSessions: unpaidSessionsCount,
    thisMonthHours: sumSessionHours(thisMonthSessions),
    thisMonthMoney: user.isOwner ? sumSessionMoney(thisMonthSessionsWithExpenses) : 0,
    averageHourlyRate: user.isOwner ? averageHourlyRate : 0,
  };
}, "dashboard-stats");
