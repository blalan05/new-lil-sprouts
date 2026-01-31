import { action, query, redirect, reload } from "@solidjs/router";
import { db } from "./db";
import { datetimeLocalToUTC, parseFormDate } from "./datetime";
import { getSession } from "./server";
import { getSettingValue } from "./settings";
import { calculateServiceRate } from "./services";
import type { DayOfWeek, RecurrencePattern } from "../generated/prisma-client/client.js";

export const getCareSchedules = query(async (familyId: string) => {
  "use server";
  const schedules = await db.careSchedule.findMany({
    where: { familyId },
    include: {
      children: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      service: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
      _count: {
        select: {
          careSessions: true,
        },
      },
    },
    orderBy: {
      startDate: "desc",
    },
  });
  return schedules;
}, "care-schedules");

export const getCareSchedule = query(async (id: string) => {
  "use server";
  const schedule = await db.careSchedule.findUnique({
    where: { id },
    include: {
      family: true,
      children: true,
      careSessions: {
        orderBy: {
          scheduledStart: "desc",
        },
        take: 20,
      },
    },
  });
  if (!schedule) throw new Error("Care schedule not found");
  return schedule;
}, "care-schedule");

export const createCareSchedule = action(async (formData: FormData) => {
  "use server";
  try {
    const session = await getSession();
    const userId = session.data.userId;

    const familyId = String(formData.get("familyId"));
    const name = String(formData.get("name"));
    const serviceId = String(formData.get("serviceId"));
    const recurrence = String(formData.get("recurrence")) as RecurrencePattern;
    const startTime = String(formData.get("startTime"));
    const endTime = String(formData.get("endTime"));
    const hourlyRate = String(formData.get("hourlyRate") || "");
    const startDate = String(formData.get("startDate"));
    const endDate = String(formData.get("endDate") || "");
    const notes = String(formData.get("notes") || "");

    // Get selected days of week
    const daysOfWeek: DayOfWeek[] = [];
    const allDays: DayOfWeek[] = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ];
    for (const day of allDays) {
      if (formData.get(`day_${day}`) === "true") {
        daysOfWeek.push(day);
      }
    }

    // Get selected children
    const childIds: string[] = [];
    const childIdData = formData.getAll("childIds");
    for (const id of childIdData) {
      if (id) childIds.push(String(id));
    }

    // For ONCE schedules, use auto-generated name if not provided
    const scheduleName =
      name ||
      (recurrence === "ONCE" ? `Session on ${new Date(startDate).toLocaleDateString()}` : "");

    if (!scheduleName && recurrence !== "ONCE") {
      return new Error("Schedule name is required");
    }

    if (!startTime || !endTime) {
      return new Error("Start and end times are required");
    }

    if (!startDate) {
      return new Error("Start date is required");
    }

    if (recurrence !== "ONCE" && daysOfWeek.length === 0) {
      return new Error("Please select at least one day of the week");
    }

    if (!serviceId || serviceId === "") {
      return new Error("Please select a service");
    }

    // Get the service to check requirements and calculate rate
    const service = await db.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return new Error("Service not found");
    }

    // Check if service requires children
    if (service.requiresChildren && childIds.length === 0) {
      return new Error(`Please select at least one child for ${service.name}`);
    }

    // Get default hourly rate from service if not provided
    let finalHourlyRate: number | null = null;
    if (hourlyRate) {
      finalHourlyRate = parseFloat(hourlyRate);
    } else {
      finalHourlyRate = await calculateServiceRate(serviceId, childIds.length);
    }

    // For ONCE schedules, set daysOfWeek to empty array since it's not used
    const finalDaysOfWeek = recurrence === "ONCE" ? [] : daysOfWeek;

    const schedule = await db.careSchedule.create({
      data: {
        familyId,
        name: scheduleName,
        serviceId,
        recurrence,
        daysOfWeek: finalDaysOfWeek,
        startTime,
        endTime,
        hourlyRate: finalHourlyRate,
        startDate: parseFormDate(startDate),
        endDate: endDate ? parseFormDate(endDate) : null,
        notes: notes || null,
        children: {
          connect: childIds.map((id) => ({ id })),
        },
      },
    });

    // Get timezone offset from form (in minutes, convert to hours for the function)
    const timezoneOffsetMinutes = formData.get("timezoneOffset")
      ? parseInt(String(formData.get("timezoneOffset")))
      : undefined;
    const timezoneOffsetHours = timezoneOffsetMinutes !== undefined ? timezoneOffsetMinutes / 60 : undefined;

    // For ONCE schedules, automatically create the session
    if (recurrence === "ONCE") {
      // Combine date and time into datetime-local format and convert to UTC
      // This ensures the time is interpreted in the user's timezone, not the server's
      const sessionStart = datetimeLocalToUTC(`${startDate}T${startTime}`, timezoneOffsetHours);
      const sessionEnd = datetimeLocalToUTC(`${startDate}T${endTime}`, timezoneOffsetHours);

      await db.careSession.create({
        data: {
          familyId,
          scheduleId: schedule.id,
          serviceId,
          scheduledStart: sessionStart,
          scheduledEnd: sessionEnd,
          hourlyRate: finalHourlyRate,
          status: "SCHEDULED",
          isConfirmed: true, // One-time sessions are auto-confirmed
          notes: notes || null,
          children: {
            connect: childIds.map((id) => ({ id })),
          },
        },
      });

      // Redirect to family page for one-time sessions
      return redirect(`/families/${familyId}`);
    }

    return redirect(`/families/${familyId}/schedules/${schedule.id}`);
  } catch (err) {
    console.error("Error creating care schedule:", err);
    return new Error(err instanceof Error ? err.message : "Failed to create care schedule");
  }
});

export const updateCareSchedule = action(async (formData: FormData) => {
  "use server";
  try {
    const id = String(formData.get("id"));
    const familyId = String(formData.get("familyId"));
    const name = String(formData.get("name"));
    const serviceId = String(formData.get("serviceId"));
    const recurrence = String(formData.get("recurrence")) as RecurrencePattern;
    const startTime = String(formData.get("startTime"));
    const endTime = String(formData.get("endTime"));
    const hourlyRate = String(formData.get("hourlyRate") || "");
    const startDate = String(formData.get("startDate"));
    const endDate = String(formData.get("endDate") || "");
    const notes = String(formData.get("notes") || "");
    const isActive = formData.get("isActive") === "true";

    // Get selected days of week
    const daysOfWeek: DayOfWeek[] = [];
    const allDays: DayOfWeek[] = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ];
    for (const day of allDays) {
      if (formData.get(`day_${day}`) === "true") {
        daysOfWeek.push(day);
      }
    }

    // Get selected children
    const childIds: string[] = [];
    const childIdData = formData.getAll("childIds");
    for (const id of childIdData) {
      if (id) childIds.push(String(id));
    }

    if (!name) {
      return new Error("Schedule name is required");
    }

    if (!startTime || !endTime) {
      return new Error("Start and end times are required");
    }

    if (!startDate) {
      return new Error("Start date is required");
    }

    if (recurrence === "WEEKLY" && daysOfWeek.length === 0) {
      return new Error("Please select at least one day of the week");
    }

    // Get the service to check requirements
    const service = await db.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return new Error("Service not found");
    }

    // Check if service requires children
    if (service.requiresChildren && childIds.length === 0) {
      return new Error(`Please select at least one child for ${service.name}`);
    }

    await db.careSchedule.update({
      where: { id },
      data: {
        name,
        serviceId,
        recurrence,
        daysOfWeek,
        startTime,
        endTime,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
        startDate: parseFormDate(startDate),
        endDate: endDate ? parseFormDate(endDate) : null,
        notes: notes || null,
        isActive,
        children: {
          set: childIds.map((id) => ({ id })),
        },
      },
    });

    return redirect(`/families/${familyId}/schedules/${id}`);
  } catch (err) {
    console.error("Error updating care schedule:", err);
    return new Error(err instanceof Error ? err.message : "Failed to update care schedule");
  }
});

export const deleteCareSchedule = action(async (formData: FormData) => {
  "use server";
  try {
    const id = String(formData.get("id"));

    if (!id) {
      return new Error("Schedule ID is required");
    }

    await db.careSchedule.delete({
      where: { id },
    });
    return reload();
  } catch (err) {
    console.error("Error deleting care schedule:", err);
    return new Error(err instanceof Error ? err.message : "Failed to delete care schedule");
  }
});

// Generate sessions from a schedule for a given date range
export const generateSessionsFromSchedule = action(async (formData: FormData) => {
  "use server";
  try {
    const scheduleId = String(formData.get("scheduleId"));
    const startDate = parseFormDate(String(formData.get("startDate")));
    const endDate = parseFormDate(String(formData.get("endDate")));

    const schedule = await db.careSchedule.findUnique({
      where: { id: scheduleId },
      include: {
        children: true,
        service: true,
      },
    });

    if (!schedule) {
      return new Error("Schedule not found");
    }

    if (!schedule.isActive) {
      return new Error("Cannot generate sessions from inactive schedule");
    }

    const sessions: any[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayOfWeek = [
        "SUNDAY",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
      ][currentDate.getDay()] as DayOfWeek;

      // Check if this day is in the schedule
      if (schedule.daysOfWeek.includes(dayOfWeek)) {
        // Format the current date as YYYY-MM-DD
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const day = String(currentDate.getDate()).padStart(2, "0");
        const dateString = `${year}-${month}-${day}`;

        // Get timezone offset from form (in minutes, convert to hours for the function)
        const timezoneOffsetMinutes = formData.get("timezoneOffset")
          ? parseInt(String(formData.get("timezoneOffset")))
          : undefined;
        const timezoneOffsetHours = timezoneOffsetMinutes !== undefined ? timezoneOffsetMinutes / 60 : undefined;

        // Combine date and time into datetime-local format and convert to UTC
        // This ensures the time is interpreted in the user's timezone, not the server's
        const scheduledStart = datetimeLocalToUTC(`${dateString}T${schedule.startTime}`, timezoneOffsetHours);
        const scheduledEnd = datetimeLocalToUTC(`${dateString}T${schedule.endTime}`, timezoneOffsetHours);

        // Check if session already exists for this date
        const existingSession = await db.careSession.findFirst({
          where: {
            scheduleId,
            scheduledStart,
          },
        });

        if (!existingSession) {
          // Calculate hourly rate: if schedule has a rate, use it; otherwise use service default
          let sessionHourlyRate = schedule.hourlyRate;
          if (!sessionHourlyRate && schedule.service) {
            sessionHourlyRate = await calculateServiceRate(
              schedule.service.id,
              schedule.children.length,
            );
          }

          sessions.push({
            familyId: schedule.familyId,
            scheduleId: schedule.id,
            serviceId: schedule.serviceId,
            scheduledStart,
            scheduledEnd,
            hourlyRate: sessionHourlyRate,
            status: "SCHEDULED",
            isConfirmed: false,
            children: {
              connect: schedule.children.map((child) => ({ id: child.id })),
            },
          });
        }
      }

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Create all sessions
    for (const sessionData of sessions) {
      await db.careSession.create({
        data: sessionData,
      });
    }

    return {
      success: true,
      count: sessions.length,
      message: `Generated ${sessions.length} care session(s)`,
    };
  } catch (err) {
    console.error("Error generating sessions:", err);
    return new Error(err instanceof Error ? err.message : "Failed to generate sessions");
  }
});

// Record drop-off
export const recordDropOff = action(async (formData: FormData) => {
  "use server";
  try {
    const sessionId = String(formData.get("sessionId"));
    const dropOffBy = String(formData.get("dropOffBy"));
    const dropOffById = String(formData.get("dropOffById") || "");
    const dropOffTime = String(formData.get("dropOffTime") || "");

    if (!sessionId) {
      return new Error("Session ID is required");
    }

    if (!dropOffBy) {
      return new Error("Drop-off person is required");
    }

    await db.careSession.update({
      where: { id: sessionId },
      data: {
        dropOffBy,
        dropOffById: dropOffById || null,
        dropOffTime: dropOffTime ? datetimeLocalToUTC(dropOffTime) : new Date(),
        status: "IN_PROGRESS",
        isConfirmed: true,
      },
    });

    return reload();
  } catch (err) {
    console.error("Error recording drop-off:", err);
    return new Error(err instanceof Error ? err.message : "Failed to record drop-off");
  }
});

// Record pick-up
export const recordPickUp = action(async (formData: FormData) => {
  "use server";
  try {
    const sessionId = String(formData.get("sessionId"));
    const pickUpBy = String(formData.get("pickUpBy"));
    const pickUpById = String(formData.get("pickUpById") || "");
    const pickUpTime = String(formData.get("pickUpTime") || "");

    if (!sessionId) {
      return new Error("Session ID is required");
    }

    if (!pickUpBy) {
      return new Error("Pick-up person is required");
    }

    await db.careSession.update({
      where: { id: sessionId },
      data: {
        pickUpBy,
        pickUpById: pickUpById || null,
        pickUpTime: pickUpTime ? datetimeLocalToUTC(pickUpTime) : new Date(),
        status: "COMPLETED",
        isConfirmed: true,
      },
    });

    return reload();
  } catch (err) {
    console.error("Error recording pick-up:", err);
    return new Error(err instanceof Error ? err.message : "Failed to record pick-up");
  }
});
