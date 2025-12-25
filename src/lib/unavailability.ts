import { action, query, redirect, reload } from "@solidjs/router";
import { db } from "./db";

export const getUnavailabilities = query(async (userId?: string) => {
  "use server";
  const unavailabilities = await db.unavailability.findMany({
    where: userId ? { userId } : {},
    orderBy: {
      startDate: "desc",
    },
  });
  return unavailabilities;
}, "unavailabilities");

export const getUnavailability = query(async (id: string) => {
  "use server";
  const unavailability = await db.unavailability.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });
  if (!unavailability) throw new Error("Unavailability not found");
  return unavailability;
}, "unavailability");

export const createUnavailability = action(async (formData: FormData) => {
  "use server";
  try {
    const userId = String(formData.get("userId") || "");
    const startDate = String(formData.get("startDate"));
    const endDate = String(formData.get("endDate"));
    const allDay = formData.get("allDay") === "true";
    const startTime = String(formData.get("startTime") || "");
    const endTime = String(formData.get("endTime") || "");
    const reason = String(formData.get("reason") || "");
    const notes = String(formData.get("notes") || "");

    if (!startDate) {
      return new Error("Start date is required");
    }

    if (!endDate) {
      return new Error("End date is required");
    }

    if (!allDay && (!startTime || !endTime)) {
      return new Error("Start and end times are required for specific time blocks");
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      return new Error("End date must be after start date");
    }

    await db.unavailability.create({
      data: {
        userId: userId || null,
        startDate: start,
        endDate: end,
        allDay,
        startTime: !allDay && startTime ? startTime : null,
        endTime: !allDay && endTime ? endTime : null,
        reason: reason || null,
        notes: notes || null,
      },
    });

    return redirect("/schedule");
  } catch (err) {
    console.error("Error creating unavailability:", err);
    return new Error(err instanceof Error ? err.message : "Failed to create unavailability");
  }
});

export const updateUnavailability = action(async (formData: FormData) => {
  "use server";
  try {
    const id = String(formData.get("id"));
    const userId = String(formData.get("userId") || "");
    const startDate = String(formData.get("startDate"));
    const endDate = String(formData.get("endDate"));
    const allDay = formData.get("allDay") === "true";
    const startTime = String(formData.get("startTime") || "");
    const endTime = String(formData.get("endTime") || "");
    const reason = String(formData.get("reason") || "");
    const notes = String(formData.get("notes") || "");

    if (!startDate) {
      return new Error("Start date is required");
    }

    if (!endDate) {
      return new Error("End date is required");
    }

    if (!allDay && (!startTime || !endTime)) {
      return new Error("Start and end times are required for specific time blocks");
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      return new Error("End date must be after start date");
    }

    await db.unavailability.update({
      where: { id },
      data: {
        userId: userId || null,
        startDate: start,
        endDate: end,
        allDay,
        startTime: !allDay && startTime ? startTime : null,
        endTime: !allDay && endTime ? endTime : null,
        reason: reason || null,
        notes: notes || null,
      },
    });

    return redirect("/schedule");
  } catch (err) {
    console.error("Error updating unavailability:", err);
    return new Error(err instanceof Error ? err.message : "Failed to update unavailability");
  }
});

export const deleteUnavailability = action(async (id: string) => {
  "use server";
  try {
    await db.unavailability.delete({
      where: { id },
    });
    return reload();
  } catch (err) {
    console.error("Error deleting unavailability:", err);
    return new Error(err instanceof Error ? err.message : "Failed to delete unavailability");
  }
});

// Check if a date/time conflicts with unavailability
export const checkAvailability = query(
  async (date: Date, startTime?: string, endTime?: string) => {
    "use server";
    const conflicts = await db.unavailability.findMany({
      where: {
        AND: [
          { startDate: { lte: date } },
          { endDate: { gte: date } },
        ],
      },
    });

    // If checking specific times and there are conflicts
    if (startTime && endTime && conflicts.length > 0) {
      return conflicts.filter((c) => {
        // If the unavailability is all day, it conflicts
        if (c.allDay) return true;

        // If it has specific times, check for overlap
        if (c.startTime && c.endTime) {
          // Time overlap logic: conflicts if requested time overlaps with unavailable time
          return !(endTime <= c.startTime || startTime >= c.endTime);
        }

        return false;
      });
    }

    return conflicts;
  },
  "check-availability"
);

// Get upcoming unavailabilities
export const getUpcomingUnavailabilities = query(async (userId?: string) => {
  "use server";
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const unavailabilities = await db.unavailability.findMany({
    where: {
      userId: userId || undefined,
      endDate: {
        gte: today,
      },
    },
    orderBy: {
      startDate: "asc",
    },
  });

  return unavailabilities;
}, "upcoming-unavailabilities");
