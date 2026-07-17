import { action, query, reload } from "@solidjs/router";
import { db } from "./db";
import type { ReportType, ReportSeverity } from "../generated/prisma-client/client.js";
import { serverRedirect } from "./server-redirect";
import {
  assertOwnerAction,
  familyIdWhere,
  requireFamilyAccess,
  requireUser,
} from "./auth";

async function requireSessionAccess(careSessionId: string) {
  const session = await db.careSession.findUnique({
    where: { id: careSessionId },
    select: { familyId: true },
  });
  if (!session) throw new Error("Care session not found");
  await requireFamilyAccess(session.familyId);
}

export const getSessionReports = query(async (careSessionId: string) => {
  "use server";
  await requireSessionAccess(careSessionId);
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
  const child = await db.child.findUnique({
    where: { id: childId },
    select: { familyId: true },
  });
  if (!child) throw new Error("Child not found");
  await requireFamilyAccess(child.familyId);

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
  await requireFamilyAccess(familyId);
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
  await requireFamilyAccess(report.careSession.familyId);
  return report;
}, "session-report");

export const createSessionReport = action(async (formData: FormData) => {
  "use server";
  try {
    const owner = await assertOwnerAction();
    if (owner instanceof Error) return owner;

    const careSessionId = String(formData.get("careSessionId"));
    const childId = String(formData.get("childId"));
    const type = String(formData.get("type")) as ReportType;
    const severity = String(formData.get("severity")) as ReportSeverity;
    const title = String(formData.get("title"));
    const description = String(formData.get("description"));
    const timestamp = String(formData.get("timestamp"));
    const actionTaken = String(formData.get("actionTaken") || "");
    const followUpNeeded = formData.get("followUpNeeded") === "true";
    const reportedById = String(formData.get("reportedById") || owner.id);

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

    await db.sessionReport.create({
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

    const session = await db.careSession.findUnique({
      where: { id: careSessionId },
      select: { familyId: true },
    });

    return serverRedirect(`/families/${session?.familyId}/sessions/${careSessionId}`);
  } catch (err) {
    console.error("Error creating session report:", err);
    return new Error(err instanceof Error ? err.message : "Failed to create report");
  }
});

export const updateSessionReport = action(async (formData: FormData) => {
  "use server";
  try {
    const owner = await assertOwnerAction();
    if (owner instanceof Error) return owner;

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
    const owner = await assertOwnerAction();
    if (owner instanceof Error) return owner;

    await db.sessionReport.delete({
      where: { id },
    });
    return reload();
  } catch (err) {
    console.error("Error deleting session report:", err);
    return new Error(err instanceof Error ? err.message : "Failed to delete report");
  }
});

export const getFollowUpReports = query(async () => {
  "use server";
  const user = await requireUser();
  const scope = familyIdWhere(user);
  const reports = await db.sessionReport.findMany({
    where: {
      followUpNeeded: true,
      ...(scope.familyId
        ? {
            careSession: {
              familyId: scope.familyId,
            },
          }
        : {}),
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

export const getRecentReports = query(async (limit: number = 10) => {
  "use server";
  const user = await requireUser();
  const scope = familyIdWhere(user);
  const reports = await db.sessionReport.findMany({
    where: scope.familyId
      ? {
          careSession: {
            familyId: scope.familyId,
          },
        }
      : {},
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
