import { query } from "@solidjs/router";
import { db } from "./db";

// Get stats for a specific time period
export const getStatsForPeriod = query(async (period: "lastWeek" | "thisWeek" | "month" | "ytd") => {
  "use server";
  const now = new Date();
  let startDate: Date;
  let endDate: Date = new Date(now);
  endDate.setHours(23, 59, 59, 999);

  switch (period) {
    case "lastWeek": {
      // Calculate last week (Monday to Sunday)
      const lastWeekStart = new Date(now);
      lastWeekStart.setDate(now.getDate() - now.getDay() - 6); // Last Monday
      lastWeekStart.setHours(0, 0, 0, 0);
      startDate = lastWeekStart;
      const lastWeekEnd = new Date(lastWeekStart);
      lastWeekEnd.setDate(lastWeekStart.getDate() + 6); // Last Sunday
      endDate = lastWeekEnd;
      endDate.setHours(23, 59, 59, 999);
      break;
    }
    case "thisWeek": {
      // Calculate this week (Monday to Sunday)
      const thisWeekStart = new Date(now);
      thisWeekStart.setDate(now.getDate() - now.getDay() + 1); // Monday
      thisWeekStart.setHours(0, 0, 0, 0);
      startDate = thisWeekStart;
      const thisWeekEnd = new Date(thisWeekStart);
      thisWeekEnd.setDate(thisWeekStart.getDate() + 6); // Sunday
      endDate = thisWeekEnd;
      endDate.setHours(23, 59, 59, 999);
      break;
    }
    case "month": {
      // This month
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      break;
    }
    case "ytd": {
      // Year to date
      startDate = new Date(now.getFullYear(), 0, 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    }
  }

  // Get completed sessions for the period
  const sessions = await db.careSession.findMany({
    where: {
      scheduledStart: {
        gte: startDate,
        lte: endDate,
      },
      status: {
        in: ["COMPLETED", "IN_PROGRESS"],
      },
    },
    include: {
      expenses: {
        select: {
          amount: true,
        },
      },
    },
  });

  // Calculate hours worked
  const hours = sessions.reduce((total, session) => {
    const start = new Date(session.scheduledStart).getTime();
    const end = new Date(session.scheduledEnd).getTime();
    const sessionHours = (end - start) / (1000 * 60 * 60);
    return total + sessionHours;
  }, 0);

  // Calculate money made (including expenses)
  const money = sessions.reduce((total, session) => {
    const start = new Date(session.scheduledStart).getTime();
    const end = new Date(session.scheduledEnd).getTime();
    const sessionHours = (end - start) / (1000 * 60 * 60);
    const rate = session.hourlyRate || 0;
    const sessionAmount = sessionHours * rate;
    
    // Add expenses
    const expenseTotal = session.expenses?.reduce((sum: number, exp: any) => sum + exp.amount, 0) || 0;
    
    return total + sessionAmount + expenseTotal;
  }, 0);

  return {
    hours,
    money,
    period,
  };
}, "stats-for-period");

// Get weekly stats (hours worked and money made) - kept for backward compatibility
export const getWeeklyStats = query(async () => {
  "use server";
  const now = new Date();
  
  // Calculate this week (Monday to Sunday)
  const thisWeekStart = new Date(now);
  thisWeekStart.setDate(now.getDate() - now.getDay() + 1); // Monday
  thisWeekStart.setHours(0, 0, 0, 0);
  
  const thisWeekEnd = new Date(thisWeekStart);
  thisWeekEnd.setDate(thisWeekStart.getDate() + 6); // Sunday
  thisWeekEnd.setHours(23, 59, 59, 999);
  
  // Calculate last week
  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(thisWeekStart.getDate() - 7);
  
  const lastWeekEnd = new Date(thisWeekEnd);
  lastWeekEnd.setDate(thisWeekEnd.getDate() - 7);

  // Get completed sessions for this week
  const thisWeekSessions = await db.careSession.findMany({
    where: {
      scheduledStart: {
        gte: thisWeekStart,
        lte: thisWeekEnd,
      },
      status: {
        in: ["COMPLETED", "IN_PROGRESS"],
      },
    },
    include: {
      expenses: {
        select: {
          amount: true,
        },
      },
    },
  });

  // Get completed sessions for last week
  const lastWeekSessions = await db.careSession.findMany({
    where: {
      scheduledStart: {
        gte: lastWeekStart,
        lte: lastWeekEnd,
      },
      status: {
        in: ["COMPLETED", "IN_PROGRESS"],
      },
    },
    include: {
      expenses: {
        select: {
          amount: true,
        },
      },
    },
  });

  // Calculate hours worked
  const calculateHours = (sessions: any[]) => {
    return sessions.reduce((total, session) => {
      const start = new Date(session.scheduledStart).getTime();
      const end = new Date(session.scheduledEnd).getTime();
      const hours = (end - start) / (1000 * 60 * 60);
      return total + hours;
    }, 0);
  };

  // Calculate money made (including expenses)
  const calculateMoney = (sessions: any[]) => {
    return sessions.reduce((total, session) => {
      const start = new Date(session.scheduledStart).getTime();
      const end = new Date(session.scheduledEnd).getTime();
      const hours = (end - start) / (1000 * 60 * 60);
      const rate = session.hourlyRate || 0;
      const sessionAmount = hours * rate;
      
      // Add expenses
      const expenseTotal = session.expenses?.reduce((sum: number, exp: any) => sum + exp.amount, 0) || 0;
      
      return total + sessionAmount + expenseTotal;
    }, 0);
  };

  const thisWeekHours = calculateHours(thisWeekSessions);
  const lastWeekHours = calculateHours(lastWeekSessions);
  const thisWeekMoney = calculateMoney(thisWeekSessions);
  const lastWeekMoney = calculateMoney(lastWeekSessions);

  return {
    thisWeek: {
      hours: thisWeekHours,
      money: thisWeekMoney,
    },
    lastWeek: {
      hours: lastWeekHours,
      money: lastWeekMoney,
    },
  };
}, "weekly-stats");

// Get dashboard stats
export const getDashboardStats = query(async () => {
  "use server";
  const now = new Date();
  
  // This month
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  
  // Get active families count
  const activeFamiliesCount = await db.family.count({
    where: {
      careSessions: {
        some: {
          scheduledStart: {
            gte: thisMonthStart,
          },
        },
      },
    },
  });

  // Get upcoming sessions count (next 7 days)
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
    },
  });

  // Get unpaid sessions count
  const unpaidSessionsCount = await db.careSession.count({
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
    },
  });

  // Get total hours this month
  const thisMonthSessions = await db.careSession.findMany({
    where: {
      scheduledStart: {
        gte: thisMonthStart,
        lte: thisMonthEnd,
      },
      status: {
        in: ["COMPLETED", "IN_PROGRESS"],
      },
    },
  });

  const thisMonthHours = thisMonthSessions.reduce((total, session) => {
    const start = new Date(session.scheduledStart).getTime();
    const end = new Date(session.scheduledEnd).getTime();
    const hours = (end - start) / (1000 * 60 * 60);
    return total + hours;
  }, 0);

  // Get total money this month
  const thisMonthSessionsWithExpenses = await db.careSession.findMany({
    where: {
      scheduledStart: {
        gte: thisMonthStart,
        lte: thisMonthEnd,
      },
      status: {
        in: ["COMPLETED", "IN_PROGRESS"],
      },
    },
    include: {
      expenses: {
        select: {
          amount: true,
        },
      },
    },
  });

  const thisMonthMoney = thisMonthSessionsWithExpenses.reduce((total, session) => {
    const start = new Date(session.scheduledStart).getTime();
    const end = new Date(session.scheduledEnd).getTime();
    const hours = (end - start) / (1000 * 60 * 60);
    const rate = session.hourlyRate || 0;
    const sessionAmount = hours * rate;
    const expenseTotal = session.expenses?.reduce((sum: number, exp: any) => sum + exp.amount, 0) || 0;
    return total + sessionAmount + expenseTotal;
  }, 0);

  // Calculate average hourly rate
  const sessionsWithRates = thisMonthSessions.filter((s) => s.hourlyRate && s.hourlyRate > 0);
  const averageHourlyRate =
    sessionsWithRates.length > 0
      ? sessionsWithRates.reduce((sum, s) => sum + (s.hourlyRate || 0), 0) / sessionsWithRates.length
      : 0;

  return {
    activeFamilies: activeFamiliesCount,
    upcomingSessions: upcomingSessionsCount,
    unpaidSessions: unpaidSessionsCount,
    thisMonthHours,
    thisMonthMoney,
    averageHourlyRate,
  };
}, "dashboard-stats");

