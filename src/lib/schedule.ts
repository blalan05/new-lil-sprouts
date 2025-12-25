import { query } from "@solidjs/router";
import { db } from "./db";

// Get care sessions for a date range
export const getCareSessionsForRange = query(
  async (startDate: Date, endDate: Date) => {
    "use server";
    const sessions = await db.careSession.findMany({
      where: {
        scheduledStart: {
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
        service: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        children: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        scheduledStart: "asc",
      },
    });
    return sessions;
  },
  "care-sessions-range"
);

// Get upcoming care sessions (next 7 days)
export const getUpcomingSessions = query(async (limit: number = 10) => {
  "use server";
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 7);

  const sessions = await db.careSession.findMany({
    where: {
      scheduledStart: {
        gte: now,
        lte: futureDate,
      },
      status: {
        not: "CANCELLED",
      },
    },
    include: {
      family: {
        select: {
          id: true,
          familyName: true,
        },
      },
      service: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
      children: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      scheduledStart: "asc",
    },
    take: limit,
  });
  return sessions;
}, "upcoming-sessions");

// Get a single care session by ID
export const getCareSession = query(async (id: string) => {
  "use server";
  const session = await db.careSession.findUnique({
    where: { id },
    include: {
      family: {
        select: {
          id: true,
          familyName: true,
        },
      },
      service: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
      children: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      schedule: {
        select: {
          id: true,
          name: true,
          recurrence: true,
        },
      },
    },
  });
  if (!session) throw new Error("Care session not found");
  return session;
}, "care-session");

// Get unavailabilities for a date range
export const getUnavailabilitiesForRange = query(
  async (startDate: Date, endDate: Date) => {
    "use server";
    const unavailabilities = await db.unavailability.findMany({
      where: {
        OR: [
          {
            // Unavailability starts within range
            startDate: {
              gte: startDate,
              lte: endDate,
            },
          },
          {
            // Unavailability ends within range
            endDate: {
              gte: startDate,
              lte: endDate,
            },
          },
          {
            // Unavailability spans the entire range
            AND: [
              {
                startDate: {
                  lte: startDate,
                },
              },
              {
                endDate: {
                  gte: endDate,
                },
              },
            ],
          },
        ],
      },
      orderBy: {
        startDate: "asc",
      },
    });
    return unavailabilities;
  },
  "unavailabilities-range"
);

