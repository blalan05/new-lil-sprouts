import { query, action, reload, redirect } from "@solidjs/router";
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

// Get sessions for a specific day
export const getSessionsForDay = query(async (date: Date) => {
  "use server";
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const sessions = await db.careSession.findMany({
    where: {
      scheduledStart: {
        gte: startOfDay,
        lte: endOfDay,
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
  });
  return sessions;
}, "sessions-for-day");

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
          parentFirstName: true,
          parentLastName: true,
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

// Update a care session (including meal counts)
export const updateCareSession = action(async (formData: FormData) => {
  "use server";
  try {
    const sessionId = String(formData.get("sessionId"));
    const breakfastCount = parseInt(String(formData.get("breakfastCount") || "0"));
    const morningSnackCount = parseInt(String(formData.get("morningSnackCount") || "0"));
    const lunchCount = parseInt(String(formData.get("lunchCount") || "0"));
    const afternoonSnackCount = parseInt(String(formData.get("afternoonSnackCount") || "0"));
    const dinnerCount = parseInt(String(formData.get("dinnerCount") || "0"));
    const notes = String(formData.get("notes") || "");

    if (!sessionId) {
      return new Error("Session ID is required");
    }

    const updatedSession = await db.careSession.update({
      where: { id: sessionId },
      data: {
        breakfastCount,
        morningSnackCount,
        lunchCount,
        afternoonSnackCount,
        dinnerCount,
        notes: notes || null,
      },
      select: {
        familyId: true,
      },
    });

    return redirect(`/families/${updatedSession.familyId}/sessions/${sessionId}`);
  } catch (err) {
    console.error("Error updating care session:", err);
    return new Error(err instanceof Error ? err.message : "Failed to update care session");
  }
});

// Edit full care session details (dates, times, children, etc.)
export const editCareSessionFull = action(async (formData: FormData) => {
  "use server";
  try {
    const sessionId = String(formData.get("sessionId"));
    const scheduledStart = String(formData.get("scheduledStart"));
    const scheduledEnd = String(formData.get("scheduledEnd"));
    const hourlyRate = formData.get("hourlyRate") ? parseFloat(String(formData.get("hourlyRate"))) : null;
    const notes = String(formData.get("notes") || "");
    const isConfirmed = formData.get("isConfirmed") === "true";
    const status = String(formData.get("status"));
    
    // Get child IDs from form
    const childIds: string[] = [];
    formData.forEach((value, key) => {
      if (key.startsWith("child_")) {
        childIds.push(String(value));
      }
    });

    if (!sessionId || !scheduledStart || !scheduledEnd) {
      return new Error("Session ID, start time, and end time are required");
    }

    // Import datetime utility
    const { datetimeLocalToUTC } = await import("./datetime");

    const updatedSession = await db.careSession.update({
      where: { id: sessionId },
      data: {
        scheduledStart: datetimeLocalToUTC(scheduledStart),
        scheduledEnd: datetimeLocalToUTC(scheduledEnd),
        hourlyRate,
        notes: notes || null,
        isConfirmed,
        status: status as any,
        children: {
          set: childIds.map((id) => ({ id })),
        },
      },
      select: {
        familyId: true,
      },
    });

    return redirect(`/families/${updatedSession.familyId}/sessions/${sessionId}`);
  } catch (err) {
    console.error("Error editing care session:", err);
    return new Error(err instanceof Error ? err.message : "Failed to edit care session");
  }
});

// Delete a care session
export const deleteCareSession = action(async (formData: FormData) => {
  "use server";
  try {
    const id = String(formData.get("id"));

    if (!id) {
      return new Error("Session ID is required");
    }

    await db.careSession.delete({
      where: { id },
    });

    return reload();
  } catch (err) {
    console.error("Error deleting care session:", err);
    return new Error(err instanceof Error ? err.message : "Failed to delete care session");
  }
});



