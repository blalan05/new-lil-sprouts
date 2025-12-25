import { action, query, redirect, reload } from "@solidjs/router";
import { db } from "./db";
import type { ReportType, ReportSeverity } from "@prisma/client";

export const getSessionReports = query(async (careSessionId: string) => {
  "use server";
  const reports = await db.sessionReport.findMany({
    where: { careSessionId },
    include: {
      child: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      reportedBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      timestamp: "desc",
    },
  });
  return reports;
}, "session-reports");

export const getChildReports = query(async (childId: string, limit?: number) => {
  "use server";
  const reports = await db.sessionReport.findMany({
    where: { childId },
    include: {
      careSession: {
        select: {
          id: true,
          scheduledStart: true,
          scheduledEnd: true,
        },
      },
      reportedBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      timestamp: "desc",
    },
    take: limit || undefined,
  });
  return reports;
}, "child-reports");

export const getFamilyReports = query(async (familyId: string, limit?: number) => {
  "use server";
  const reports = await db.sessionReport.findMany({
    where: {
      careSession: {
        familyId,
      },
    },
    include: {
      child: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      careSession: {
        select: {
          id: true,
          scheduledStart: true,
          scheduledEnd: true,
        },
      },
      reportedBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      timestamp: "desc",
    },
    take: limit || undefined,
  });
  return reports;
}, "family-reports");

export const getSessionReport = query(async (id: string) => {
  "use server";
  const report = await db.sessionReport.findUnique({
    where: { id },
    include: {
      child: true,
      careSession: {
        include: {
          family: true,
        },
      },
      reportedBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });
  if (!report) throw new Error("Report not found");
  return report;
}, "session-report");

export const createSessionReport = action(async (formData: FormData) => {
  "use server";
  try {
    const careSessionId = String(formData.get("careSessionId"));
    const childId = String(formData.get("childId"));
    const type = String(formData.get("type")) as ReportType;
    const severity = String(formData.get("severity")) as ReportSeverity;
    const title = String(formData.get("title"));
    const description = String(formData.get("description"));
    const timestamp = String(formData.get("timestamp"));
    const actionTaken = String(formData.get("actionTaken") || "");
    const followUpNeeded = formData.get("followUpNeeded") === "true";
    const reportedById = String(formData.get("reportedById") || "");

    if (!title) {
      return new Error("Title is required");
    }

    if (!description) {
      return new Error("Description is required");
    }

    if (!careSessionId) {
      return new Error("Care session is required");
    }

    if (!childId) {
      return new Error("Child is required");
    }

    const report = await db.sessionReport.create({
      data: {
        careSessionId,
        childId,
        type,
        severity,
        title,
        description,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        actionTaken: actionTaken || null,
        followUpNeeded,
        reportedById: reportedById || null,
      },
    });

    // Get the family ID for redirect
    const session = await db.careSession.findUnique({
      where: { id: careSessionId },
      select: { familyId: true },
    });

    return redirect(`/families/${session?.familyId}/sessions/${careSessionId}`);
  } catch (err) {
    console.error("Error creating session report:", err);
    return new Error(err instanceof Error ? err.message : "Failed to create report");
  }
});

export const updateSessionReport = action(async (formData: FormData) => {
  "use server";
  try {
    const id = String(formData.get("id"));
    const type = String(formData.get("type")) as ReportType;
    const severity = String(formData.get("severity")) as ReportSeverity;
    const title = String(formData.get("title"));
    const description = String(formData.get("description"));
    const timestamp = String(formData.get("timestamp"));
    const actionTaken = String(formData.get("actionTaken") || "");
    const followUpNeeded = formData.get("followUpNeeded") === "true";

    if (!title) {
      return new Error("Title is required");
    }

    if (!description) {
      return new Error("Description is required");
    }

    await db.sessionReport.update({
      where: { id },
      data: {
        type,
        severity,
        title,
        description,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        actionTaken: actionTaken || null,
        followUpNeeded,
      },
    });

    return reload();
  } catch (err) {
    console.error("Error updating session report:", err);
    return new Error(err instanceof Error ? err.message : "Failed to update report");
  }
});

export const deleteSessionReport = action(async (id: string) => {
  "use server";
  try {
    await db.sessionReport.delete({
      where: { id },
    });
    return reload();
  } catch (err) {
    console.error("Error deleting session report:", err);
    return new Error(err instanceof Error ? err.message : "Failed to delete report");
  }
});

// Get reports that need follow-up
export const getFollowUpReports = query(async () => {
  "use server";
  const reports = await db.sessionReport.findMany({
    where: {
      followUpNeeded: true,
    },
    include: {
      child: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      careSession: {
        include: {
          family: {
            select: {
              id: true,
              familyName: true,
            },
          },
        },
      },
      reportedBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      timestamp: "desc",
    },
  });
  return reports;
}, "follow-up-reports");

// Get recent reports across all families
export const getRecentReports = query(async (limit: number = 10) => {
  "use server";
  const reports = await db.sessionReport.findMany({
    include: {
      child: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      careSession: {
        include: {
          family: {
            select: {
              id: true,
              familyName: true,
            },
          },
        },
      },
      reportedBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      timestamp: "desc",
    },
    take: limit,
  });
  return reports;
}, "recent-reports");
