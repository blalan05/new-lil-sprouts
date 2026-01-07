import { createAsync, type RouteDefinition, A, useParams, useSubmission } from "@solidjs/router";
import { Show, For, createSignal, createEffect } from "solid-js";
import { getFamily, formatParentNames } from "~/lib/families";
import {
  getFamilyMembers,
  deleteFamilyMember,
  inviteFamilyMember,
  revokeAccess,
} from "~/lib/family-members";
import {
  getCareSchedules,
  createCareSchedule,
  updateCareSchedule,
  deleteCareSchedule,
  generateSessionsFromSchedule,
} from "~/lib/care-schedules";
import { getChildren } from "~/lib/children";
import { getServices } from "~/lib/services";
import { utcToDatetimeLocal, formatDateLocal } from "~/lib/datetime";

export const route = {
  preload({ params }) {
    if (params.id) {
      getFamily(params.id);
      getFamilyMembers(params.id);
      getCareSchedules(params.id);
      getChildren(params.id);
      getServices();
    }
  },
} satisfies RouteDefinition;

export default function FamilyDetailPage() {
  const params = useParams();
  const family = createAsync(() => getFamily(params.id!));
  const familyMembers = createAsync(() => getFamilyMembers(params.id!));
  const schedules = createAsync(() => getCareSchedules(params.id!));
  const children = createAsync(() => getChildren(params.id!));
  const services = createAsync(() => getServices());
  
  const [showInviteModal, setShowInviteModal] = createSignal<string | null>(null);
  const [showScheduleDialog, setShowScheduleDialog] = createSignal<"view" | "create" | "edit" | null>(null);
  const [selectedScheduleId, setSelectedScheduleId] = createSignal<string | null>(null);
  const [showGenerateDialog, setShowGenerateDialog] = createSignal(false);
  const [generateScheduleId, setGenerateScheduleId] = createSignal<string | null>(null);
  
  const createScheduleSubmission = useSubmission(createCareSchedule);
  const updateScheduleSubmission = useSubmission(updateCareSchedule);
  const deleteScheduleSubmission = useSubmission(deleteCareSchedule);
  const generateSessionsSubmission = useSubmission(generateSessionsFromSchedule);
  
  const selectedSchedule = () => {
    if (!selectedScheduleId()) return null;
    return schedules()?.find(s => s.id === selectedScheduleId());
  };
  
  const openScheduleDialog = (mode: "view" | "create" | "edit", scheduleId?: string) => {
    if (scheduleId) setSelectedScheduleId(scheduleId);
    setShowScheduleDialog(mode);
  };
  
  const closeScheduleDialog = () => {
    setShowScheduleDialog(null);
    setSelectedScheduleId(null);
  };
  
  const openGenerateDialog = (scheduleId: string) => {
    setGenerateScheduleId(scheduleId);
    setShowGenerateDialog(true);
  };
  
  const closeGenerateDialog = () => {
    setShowGenerateDialog(false);
    setGenerateScheduleId(null);
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (date: string | Date) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "Scheduled";
      case "IN_PROGRESS":
        return "In Progress";
      case "COMPLETED":
        return "Completed";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return { bg: "#bee3f8", color: "#2c5282" };
      case "IN_PROGRESS":
        return { bg: "#feebc8", color: "#7c2d12" };
      case "COMPLETED":
        return { bg: "#c6f6d5", color: "#276749" };
      case "CANCELLED":
        return { bg: "#fed7d7", color: "#c53030" };
      default:
        return { bg: "#e2e8f0", color: "#2d3748" };
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return { bg: "#c6f6d5", color: "#276749" };
      case "PENDING":
        return { bg: "#feebc8", color: "#7c2d12" };
      case "OVERDUE":
        return { bg: "#fed7d7", color: "#c53030" };
      case "CANCELLED":
        return { bg: "#e2e8f0", color: "#718096" };
      default:
        return { bg: "#e2e8f0", color: "#2d3748" };
    }
  };

  const handleDeleteMember = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from the family?`)) {
      await deleteFamilyMember(id);
      window.location.reload();
    }
  };

  const handleInvite = async (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const result = await inviteFamilyMember(formData);
    if (result && "success" in result) {
      alert(result.message);
      setShowInviteModal(null);
      window.location.reload();
    }
  };

  const handleRevokeAccess = async (memberId: string, name: string) => {
    if (confirm(`Are you sure you want to revoke app access for ${name}?`)) {
      await revokeAccess(memberId);
      window.location.reload();
    }
  };

  const getRelationshipLabel = (rel: string) => {
    return rel
      .replace(/_/g, " ")
      .split(" ")
      .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <main
      style={{
        "max-width": "1400px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <Show
        when={family()}
        fallback={
          <div style={{ "text-align": "center", padding: "3rem" }}>Loading family details...</div>
        }
      >
        <header style={{ "margin-bottom": "2rem" }}>
          <A
            href="/families"
            style={{
              color: "#4299e1",
              "text-decoration": "none",
              "margin-bottom": "0.5rem",
              display: "inline-block",
            }}
          >
            ← Back to Families
          </A>
          <div
            style={{
              display: "flex",
              "justify-content": "space-between",
              "align-items": "center",
            }}
          >
            <h1 style={{ color: "#2d3748", "font-size": "2rem" }}>{family()?.familyName}</h1>
            <A
              href={`/families/${params.id}/edit`}
              style={{
                padding: "0.5rem 1.5rem",
                "background-color": "#4299e1",
                color: "white",
                border: "none",
                "border-radius": "4px",
                "text-decoration": "none",
                "font-weight": "600",
              }}
            >
              Edit Family
            </A>
          </div>
        </header>

        {/* Family Information */}
        <div
          style={{
            "background-color": "#fff",
            padding: "1.5rem",
            "border-radius": "8px",
            border: "1px solid #e2e8f0",
            "margin-bottom": "2rem",
          }}
        >
          <h2
            style={{
              "font-size": "1.25rem",
              "margin-bottom": "1rem",
              color: "#2d3748",
            }}
          >
            Family Information
          </h2>
          <div
            style={{
              display: "grid",
              "grid-template-columns": "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1rem",
            }}
          >
            <div>
              <strong style={{ color: "#4a5568" }}>Parents:</strong>
              <p style={{ margin: "0.25rem 0 0 0" }}>
                {family() && formatParentNames(
                  family()!.parentFirstName,
                  family()!.parentLastName,
                  family()!.familyMembers
                )}
              </p>
            </div>
            <div>
              <strong style={{ color: "#4a5568" }}>Email:</strong>
              <p style={{ margin: "0.25rem 0 0 0" }}>{family()?.email}</p>
            </div>
            <Show when={family()?.phone}>
              <div>
                <strong style={{ color: "#4a5568" }}>Phone:</strong>
                <p style={{ margin: "0.25rem 0 0 0" }}>{family()?.phone}</p>
              </div>
            </Show>
          </div>

          <Show when={family()?.address}>
            <div style={{ "margin-top": "1rem" }}>
              <strong style={{ color: "#4a5568" }}>Address:</strong>
              <p style={{ margin: "0.25rem 0 0 0" }}>
                {family()?.address}
                {family()?.city && `, ${family()?.city}`}
                {family()?.state && `, ${family()?.state}`}
                {family()?.zipCode && ` ${family()?.zipCode}`}
              </p>
            </div>
          </Show>

          <Show when={family()?.emergencyContact || family()?.emergencyPhone}>
            <div style={{ "margin-top": "1rem" }}>
              <strong style={{ color: "#4a5568" }}>Emergency Contact:</strong>
              <p style={{ margin: "0.25rem 0 0 0" }}>
                {family()?.emergencyContact}
                {family()?.emergencyPhone && ` - ${family()?.emergencyPhone}`}
              </p>
            </div>
          </Show>

          <Show when={family()?.notes}>
            <div style={{ "margin-top": "1rem" }}>
              <strong style={{ color: "#4a5568" }}>Notes:</strong>
              <p style={{ margin: "0.25rem 0 0 0", color: "#718096" }}>{family()?.notes}</p>
            </div>
          </Show>
        </div>

        {/* Children */}
        <div
          style={{
            "background-color": "#fff",
            padding: "1.5rem",
            "border-radius": "8px",
            border: "1px solid #e2e8f0",
            "margin-bottom": "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              "justify-content": "space-between",
              "align-items": "center",
              "margin-bottom": "1rem",
            }}
          >
            <h2 style={{ "font-size": "1.25rem", color: "#2d3748" }}>
              Children ({family()?.children?.length || 0})
            </h2>
            <A
              href={`/families/${params.id}/children/new`}
              style={{
                padding: "0.5rem 1rem",
                "background-color": "#48bb78",
                color: "white",
                border: "none",
                "border-radius": "4px",
                "text-decoration": "none",
                "font-size": "0.875rem",
              }}
            >
              + Add Child
            </A>
          </div>

          <Show
            when={family()?.children?.length}
            fallback={
              <p style={{ color: "#718096", "text-align": "center", padding: "2rem" }}>
                No children added yet. Add children to track their care sessions and information.
              </p>
            }
          >
            <div style={{ display: "grid", gap: "1rem" }}>
              <For each={family()?.children}>
                {(child) => (
                  <div
                    style={{
                      padding: "1rem",
                      border: "1px solid #e2e8f0",
                      "border-radius": "4px",
                      "background-color": "#f7fafc",
                    }}
                  >
                    <div style={{ display: "flex", "justify-content": "space-between" }}>
                      <div style={{ flex: "1" }}>
                        <div
                          style={{
                            display: "flex",
                            "align-items": "center",
                            gap: "0.5rem",
                            "margin-bottom": "0.5rem",
                          }}
                        >
                          <h3 style={{ color: "#2d3748", margin: "0" }}>
                            {child.firstName} {child.lastName}
                          </h3>
                          <Show when={child.allergies}>
                            <span
                              style={{
                                padding: "0.25rem 0.5rem",
                                "border-radius": "4px",
                                "background-color": "#fed7d7",
                                color: "#c53030",
                                "font-size": "0.75rem",
                                "font-weight": "600",
                              }}
                            >
                              ⚠️ Allergies
                            </span>
                          </Show>
                        </div>

                        <div
                          style={{
                            display: "grid",
                            "grid-template-columns": "repeat(auto-fit, minmax(200px, 1fr))",
                            gap: "0.5rem",
                            "font-size": "0.875rem",
                          }}
                        >
                          <div>
                            <strong style={{ color: "#4a5568" }}>Age:</strong>
                            <span style={{ color: "#718096" }}>
                              {" "}
                              {new Date().getFullYear() -
                                new Date(child.dateOfBirth).getFullYear()}{" "}
                              years
                            </span>
                          </div>
                          <Show when={child.gender}>
                            <div>
                              <strong style={{ color: "#4a5568" }}>Gender:</strong>
                              <span style={{ color: "#718096" }}>
                                {" "}
                                {child.gender
                                  ?.replace(/_/g, " ")
                                  .toLowerCase()
                                  .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                              </span>
                            </div>
                          </Show>
                          <Show when={child.schoolName}>
                            <div>
                              <strong style={{ color: "#4a5568" }}>School:</strong>
                              <span style={{ color: "#718096" }}> {child.schoolName}</span>
                            </div>
                          </Show>
                          <Show when={child.schoolGrade}>
                            <div>
                              <strong style={{ color: "#4a5568" }}>Grade:</strong>
                              <span style={{ color: "#718096" }}> {child.schoolGrade}</span>
                            </div>
                          </Show>
                        </div>

                        <Show when={child.allergies}>
                          <div style={{ "margin-top": "0.5rem", "font-size": "0.875rem" }}>
                            <strong style={{ color: "#c53030" }}>Allergies:</strong>
                            <span style={{ color: "#c53030" }}> {child.allergies}</span>
                          </div>
                        </Show>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          "flex-direction": "column",
                          gap: "0.5rem",
                          "margin-left": "1rem",
                        }}
                      >
                        <A
                          href={`/families/${params.id}/children/${child.id}`}
                          style={{
                            padding: "0.5rem 1rem",
                            "background-color": "#4299e1",
                            color: "white",
                            border: "none",
                            "border-radius": "4px",
                            "text-decoration": "none",
                            "font-size": "0.875rem",
                            "text-align": "center",
                          }}
                        >
                          View Details
                        </A>
                        <A
                          href={`/families/${params.id}/children/${child.id}/edit`}
                          style={{
                            padding: "0.5rem 1rem",
                            "background-color": "#edf2f7",
                            color: "#2d3748",
                            border: "1px solid #cbd5e0",
                            "border-radius": "4px",
                            "text-decoration": "none",
                            "font-size": "0.875rem",
                            "text-align": "center",
                          }}
                        >
                          Edit
                        </A>
                      </div>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </Show>
        </div>

        {/* Care Sessions */}
        <div
          style={{
            "background-color": "#fff",
            padding: "1.5rem",
            "border-radius": "8px",
            border: "1px solid #e2e8f0",
            "margin-bottom": "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              "justify-content": "space-between",
              "align-items": "center",
              "margin-bottom": "1rem",
            }}
          >
            <h2 style={{ "font-size": "1.25rem", color: "#2d3748" }}>
              Upcoming Sessions ({family()?.careSessions?.length || 0})
            </h2>
            <button
              onClick={() => openScheduleDialog("create")}
              style={{
                padding: "0.5rem 1rem",
                "background-color": "#805ad5",
                color: "white",
                border: "none",
                "border-radius": "4px",
                cursor: "pointer",
                "font-size": "0.875rem",
                "font-weight": "600",
              }}
            >
              + New Schedule
            </button>
          </div>

          <Show
            when={family()?.careSessions?.length}
            fallback={
              <div style={{ "text-align": "center", padding: "2rem" }}>
                <p style={{ color: "#718096", "margin-bottom": "1rem" }}>
                  No care sessions scheduled yet. Create one-time or recurring sessions.
                </p>
                <button
                  onClick={() => openScheduleDialog("create")}
                  style={{
                    padding: "0.75rem 1.5rem",
                    "background-color": "#805ad5",
                    color: "white",
                    border: "none",
                    "border-radius": "4px",
                    cursor: "pointer",
                    "font-weight": "600",
                    display: "inline-block",
                  }}
                >
                  Create First Schedule
                </button>
              </div>
            }
          >
            <div style={{ "overflow-x": "auto" }}>
              <table style={{ width: "100%", "border-collapse": "collapse" }}>
                <thead style={{ "background-color": "#f7fafc" }}>
                  <tr>
                    <th
                      style={{
                        padding: "0.75rem",
                        "text-align": "left",
                        "border-bottom": "1px solid #e2e8f0",
                      }}
                    >
                      Date/Time
                    </th>
                    <th
                      style={{
                        padding: "0.75rem",
                        "text-align": "left",
                        "border-bottom": "1px solid #e2e8f0",
                      }}
                    >
                      Children
                    </th>
                    <th
                      style={{
                        padding: "0.75rem",
                        "text-align": "left",
                        "border-bottom": "1px solid #e2e8f0",
                      }}
                    >
                      Status
                    </th>
                    <th
                      style={{
                        padding: "0.75rem",
                        "text-align": "left",
                        "border-bottom": "1px solid #e2e8f0",
                      }}
                    >
                      Confirmed
                    </th>
                    <th
                      style={{
                        padding: "0.75rem",
                        "text-align": "left",
                        "border-bottom": "1px solid #e2e8f0",
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <For each={family()?.careSessions}>
                    {(session) => {
                      const statusColors = getStatusColor(session.status);
                      return (
                        <tr style={{ "border-bottom": "1px solid #e2e8f0" }}>
                          <td style={{ padding: "0.75rem" }}>
                            {formatDateTime(session.scheduledStart)}
                          </td>
                          <td style={{ padding: "0.75rem" }}>
                            {session.children?.map((c: any) => c.firstName).join(", ") || "N/A"}
                          </td>
                          <td style={{ padding: "0.75rem" }}>
                            <span
                              style={{
                                padding: "0.25rem 0.75rem",
                                "border-radius": "9999px",
                                "background-color": statusColors.bg,
                                color: statusColors.color,
                                "font-size": "0.875rem",
                                "font-weight": "600",
                              }}
                            >
                              {formatStatus(session.status)}
                            </span>
                          </td>
                          <td style={{ padding: "0.75rem" }}>
                            {session.isConfirmed ? (
                              <span style={{ color: "#48bb78" }}>✓ Confirmed</span>
                            ) : (
                              <span style={{ color: "#ed8936" }}>⚠️ Not Confirmed</span>
                            )}
                          </td>
                          <td style={{ padding: "0.75rem" }}>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                              <A
                                href={`/families/${params.id}/sessions/${session.id}`}
                                style={{
                                  padding: "0.25rem 0.75rem",
                                  "background-color": "#4299e1",
                                  color: "#fff",
                                  "border-radius": "4px",
                                  "text-decoration": "none",
                                  "font-size": "0.875rem",
                                }}
                              >
                                View
                              </A>
                              <A
                                href={`/families/${params.id}/sessions/${session.id}/edit`}
                                style={{
                                  padding: "0.25rem 0.75rem",
                                  "background-color": "#805ad5",
                                  color: "#fff",
                                  "border-radius": "4px",
                                  "text-decoration": "none",
                                  "font-size": "0.875rem",
                                }}
                              >
                                Edit
                              </A>
                              <button
                                onClick={async () => {
                                  if (confirm("Are you sure you want to delete this session?")) {
                                    const formData = new FormData();
                                    formData.append("id", session.id);
                                    const { deleteCareSession } = await import("~/lib/schedule");
                                    await deleteCareSession(formData);
                                    window.location.reload();
                                  }
                                }}
                                style={{
                                  padding: "0.25rem 0.75rem",
                                  "background-color": "#f56565",
                                  color: "#fff",
                                  "border-radius": "4px",
                                  border: "none",
                                  cursor: "pointer",
                                  "font-size": "0.875rem",
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }}
                  </For>
                </tbody>
              </table>
            </div>
          </Show>
        </div>

        {/* Recurring Schedules */}
        <div
          style={{
            "background-color": "#fff",
            padding: "1.5rem",
            "border-radius": "8px",
            border: "1px solid #e2e8f0",
            "margin-bottom": "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              "justify-content": "space-between",
              "align-items": "center",
              "margin-bottom": "1rem",
            }}
          >
            <h2 style={{ "font-size": "1.25rem", color: "#2d3748" }}>
              Recurring Schedules ({schedules()?.length || 0})
            </h2>
            <button
              onClick={() => openScheduleDialog("create")}
              style={{
                padding: "0.5rem 1rem",
                "background-color": "#805ad5",
                color: "white",
                border: "none",
                "border-radius": "4px",
                cursor: "pointer",
                "font-size": "0.875rem",
                "font-weight": "600",
              }}
            >
              + New Schedule
            </button>
          </div>

          <Show
            when={schedules()?.length}
            fallback={
              <p style={{ color: "#718096", "text-align": "center", padding: "2rem" }}>
                No recurring schedules created yet. Create schedules to automatically generate sessions.
              </p>
            }
          >
            <div style={{ display: "grid", gap: "1rem" }}>
              <For each={schedules()}>
                {(schedule) => (
                  <div
                    style={{
                      padding: "1rem",
                      border: "1px solid #e2e8f0",
                      "border-radius": "4px",
                      "background-color": "#f7fafc",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        "justify-content": "space-between",
                        "align-items": "start",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            "align-items": "center",
                            gap: "0.5rem",
                            "margin-bottom": "0.5rem",
                          }}
                        >
                          <h3 style={{ color: "#2d3748", margin: 0 }}>{schedule.name}</h3>
                          <span
                            style={{
                              padding: "0.25rem 0.5rem",
                              "border-radius": "4px",
                              "background-color": schedule.isActive ? "#c6f6d5" : "#fed7d7",
                              color: schedule.isActive ? "#276749" : "#c53030",
                              "font-size": "0.75rem",
                              "font-weight": "600",
                            }}
                          >
                            {schedule.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <div style={{ color: "#718096", "font-size": "0.875rem" }}>
                          <div><strong>Service:</strong> {schedule.service.name}</div>
                          <div><strong>Pattern:</strong> {schedule.recurrence}</div>
                          <div>
                            <strong>Days:</strong> {schedule.daysOfWeek.join(", ")}
                          </div>
                          <div>
                            <strong>Time:</strong> {schedule.startTime} - {schedule.endTime}
                          </div>
                          <div>
                            <strong>Children:</strong>{" "}
                            {schedule.children.map((c: any) => c.firstName).join(", ") || "None"}
                          </div>
                          <div>
                            <strong>Sessions Generated:</strong> {schedule._count.careSessions}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", "flex-direction": "column", gap: "0.5rem" }}>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            onClick={() => openScheduleDialog("view", schedule.id)}
                            style={{
                              padding: "0.25rem 0.75rem",
                              "background-color": "#4299e1",
                              color: "#fff",
                              border: "none",
                              "border-radius": "4px",
                              cursor: "pointer",
                              "font-size": "0.875rem",
                            }}
                          >
                            View
                          </button>
                          <button
                            onClick={() => openScheduleDialog("edit", schedule.id)}
                            style={{
                              padding: "0.25rem 0.75rem",
                              "background-color": "#805ad5",
                              color: "#fff",
                              border: "none",
                              "border-radius": "4px",
                              cursor: "pointer",
                              "font-size": "0.875rem",
                            }}
                          >
                            Edit
                          </button>
                        </div>
                        <button
                          onClick={() => openGenerateDialog(schedule.id)}
                          style={{
                            padding: "0.25rem 0.75rem",
                            "background-color": "#48bb78",
                            color: "#fff",
                            border: "none",
                            "border-radius": "4px",
                            cursor: "pointer",
                            "font-size": "0.875rem",
                            "font-weight": "600",
                          }}
                        >
                          Generate Sessions
                        </button>
                        <form
                          action={deleteCareSchedule}
                          method="post"
                          onSubmit={(e) => {
                            if (!confirm(`Are you sure you want to delete "${schedule.name}"? This will not delete generated sessions.`)) {
                              e.preventDefault();
                            }
                          }}
                          style={{ display: "inline" }}
                        >
                          <input type="hidden" name="id" value={schedule.id} />
                          <button
                            type="submit"
                            style={{
                              padding: "0.25rem 0.75rem",
                              "background-color": "#f56565",
                              color: "#fff",
                              border: "none",
                              "border-radius": "4px",
                              cursor: "pointer",
                              "font-size": "0.875rem",
                            }}
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </Show>
        </div>

        {/* Family Members */}
        <div
          style={{
            "background-color": "#fff",
            padding: "1.5rem",
            "border-radius": "8px",
            border: "1px solid #e2e8f0",
            "margin-bottom": "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              "justify-content": "space-between",
              "align-items": "center",
              "margin-bottom": "1rem",
            }}
          >
            <h2 style={{ "font-size": "1.25rem", color: "#2d3748" }}>
              Family Members & Contacts ({familyMembers()?.length || 0})
            </h2>
            <A
              href={`/families/${params.id}/members/new`}
              style={{
                padding: "0.5rem 1rem",
                "background-color": "#4299e1",
                color: "white",
                border: "none",
                "border-radius": "4px",
                "text-decoration": "none",
                "font-size": "0.875rem",
              }}
            >
              + Add Member
            </A>
          </div>

          <Show
            when={familyMembers()?.length}
            fallback={
              <p style={{ color: "#718096", "text-align": "center", padding: "2rem" }}>
                No additional family members added yet. Add grandparents, babysitters, or other
                authorized contacts.
              </p>
            }
          >
            <div style={{ display: "grid", gap: "1rem" }}>
              <For each={familyMembers()}>
                {(member) => (
                  <div
                    style={{
                      padding: "1rem",
                      border: "1px solid #e2e8f0",
                      "border-radius": "4px",
                      "background-color": "#f7fafc",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        "justify-content": "space-between",
                        "align-items": "start",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            "align-items": "center",
                            gap: "0.5rem",
                            "margin-bottom": "0.5rem",
                          }}
                        >
                          <h3 style={{ color: "#2d3748", margin: 0 }}>
                            {member.firstName} {member.lastName}
                          </h3>
                          <span
                            style={{
                              padding: "0.25rem 0.5rem",
                              "border-radius": "4px",
                              "background-color": "#e6fffa",
                              color: "#234e52",
                              "font-size": "0.75rem",
                              "font-weight": "600",
                            }}
                          >
                            {getRelationshipLabel(member.relationship)}
                          </span>
                          <Show when={member.canPickup}>
                            <span
                              style={{
                                padding: "0.25rem 0.5rem",
                                "border-radius": "4px",
                                "background-color": "#c6f6d5",
                                color: "#276749",
                                "font-size": "0.75rem",
                                "font-weight": "600",
                              }}
                            >
                              ✓ Pickup Authorized
                            </span>
                          </Show>
                          <Show when={member.user}>
                            <span
                              style={{
                                padding: "0.25rem 0.5rem",
                                "border-radius": "4px",
                                "background-color": "#bee3f8",
                                color: "#2c5282",
                                "font-size": "0.75rem",
                                "font-weight": "600",
                              }}
                            >
                              📱 App Access
                            </span>
                          </Show>
                        </div>
                        <div
                          style={{
                            display: "grid",
                            "grid-template-columns": "repeat(auto-fit, minmax(200px, 1fr))",
                            gap: "0.5rem",
                            "font-size": "0.875rem",
                          }}
                        >
                          <Show when={member.email}>
                            <div>
                              <strong style={{ color: "#4a5568" }}>Email:</strong> {member.email}
                            </div>
                          </Show>
                          <Show when={member.phone}>
                            <div>
                              <strong style={{ color: "#4a5568" }}>Phone:</strong> {member.phone}
                            </div>
                          </Show>
                        </div>
                        <Show when={member.notes}>
                          <p
                            style={{
                              "margin-top": "0.5rem",
                              "font-size": "0.875rem",
                              color: "#718096",
                            }}
                          >
                            {member.notes}
                          </p>
                        </Show>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          "flex-direction": "column",
                          gap: "0.5rem",
                          "margin-left": "1rem",
                        }}
                      >
                        <A
                          href={`/families/${params.id}/members/${member.id}/edit`}
                          style={{
                            padding: "0.5rem 1rem",
                            "background-color": "#edf2f7",
                            color: "#2d3748",
                            border: "1px solid #cbd5e0",
                            "border-radius": "4px",
                            "text-decoration": "none",
                            "font-size": "0.875rem",
                            "text-align": "center",
                          }}
                        >
                          Edit
                        </A>
                        <Show
                          when={!member.user && member.email}
                          fallback={
                            <Show when={member.user}>
                              <button
                                onClick={() =>
                                  handleRevokeAccess(
                                    member.id,
                                    `${member.firstName} ${member.lastName}`,
                                  )
                                }
                                style={{
                                  padding: "0.5rem 1rem",
                                  "background-color": "#feebc8",
                                  color: "#7c2d12",
                                  border: "1px solid #f6ad55",
                                  "border-radius": "4px",
                                  cursor: "pointer",
                                  "font-size": "0.875rem",
                                }}
                              >
                                Revoke Access
                              </button>
                            </Show>
                          }
                        >
                          <button
                            onClick={() => setShowInviteModal(member.id)}
                            style={{
                              padding: "0.5rem 1rem",
                              "background-color": "#c6f6d5",
                              color: "#276749",
                              border: "1px solid #9ae6b4",
                              "border-radius": "4px",
                              cursor: "pointer",
                              "font-size": "0.875rem",
                            }}
                          >
                            Invite to App
                          </button>
                        </Show>
                        <button
                          onClick={() =>
                            handleDeleteMember(member.id, `${member.firstName} ${member.lastName}`)
                          }
                          style={{
                            padding: "0.5rem 1rem",
                            "background-color": "#fff5f5",
                            color: "#c53030",
                            border: "1px solid #feb2b2",
                            "border-radius": "4px",
                            cursor: "pointer",
                            "font-size": "0.875rem",
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </Show>
        </div>

        {/* Children */}
        <div
          style={{
            "background-color": "#fff",
            padding: "1.5rem",
            "border-radius": "8px",
            border: "1px solid #e2e8f0",
            "margin-bottom": "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              "justify-content": "space-between",
              "align-items": "center",
              "margin-bottom": "1rem",
            }}
          >
            <h2 style={{ "font-size": "1.25rem", color: "#2d3748" }}>
              Children ({family()?.children?.length || 0})
            </h2>
            <A
              href={`/families/${params.id}/children/new`}
              style={{
                padding: "0.5rem 1rem",
                "background-color": "#48bb78",
                color: "white",
                border: "none",
                "border-radius": "4px",
                "text-decoration": "none",
                "font-size": "0.875rem",
              }}
            >
              + Add Child
            </A>
          </div>

          <Show
            when={family()?.children?.length}
            fallback={
              <p style={{ color: "#718096", "text-align": "center", padding: "2rem" }}>
                No children added yet. Click "Add Child" to get started.
              </p>
            }
          >
            <div style={{ display: "grid", gap: "1rem" }}>
              <For each={family()?.children}>
                {(child) => (
                  <div
                    style={{
                      padding: "1rem",
                      border: "1px solid #e2e8f0",
                      "border-radius": "4px",
                      "background-color": "#f7fafc",
                    }}
                  >
                    <div style={{ display: "flex", "justify-content": "space-between" }}>
                      <div>
                        <h3 style={{ "margin-bottom": "0.5rem", color: "#2d3748" }}>
                          {child.firstName} {child.lastName}
                        </h3>
                        <p style={{ "font-size": "0.875rem", color: "#718096" }}>
                          Born: {formatDate(child.dateOfBirth)}
                        </p>
                        <Show when={child.allergies}>
                          <p style={{ "margin-top": "0.5rem", "font-size": "0.875rem" }}>
                            <strong style={{ color: "#c53030" }}>Allergies:</strong>{" "}
                            {child.allergies}
                          </p>
                        </Show>
                        <Show when={child.medications}>
                          <p style={{ "margin-top": "0.25rem", "font-size": "0.875rem" }}>
                            <strong style={{ color: "#4a5568" }}>Medications:</strong>{" "}
                            {child.medications}
                          </p>
                        </Show>
                        <Show when={child.specialNeeds}>
                          <p style={{ "margin-top": "0.25rem", "font-size": "0.875rem" }}>
                            <strong style={{ color: "#4a5568" }}>Special Needs:</strong>{" "}
                            {child.specialNeeds}
                          </p>
                        </Show>
                      </div>
                      <A
                        href={`/families/${params.id}/children/${child.id}/edit`}
                        style={{
                          padding: "0.5rem 1rem",
                          "background-color": "#edf2f7",
                          color: "#2d3748",
                          border: "1px solid #cbd5e0",
                          "border-radius": "4px",
                          "text-decoration": "none",
                          "font-size": "0.875rem",
                          height: "fit-content",
                        }}
                      >
                        Edit
                      </A>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </Show>
        </div>

        {/* Recent Care Sessions */}
        <div
          style={{
            "background-color": "#fff",
            padding: "1.5rem",
            "border-radius": "8px",
            border: "1px solid #e2e8f0",
            "margin-bottom": "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              "justify-content": "space-between",
              "align-items": "center",
              "margin-bottom": "1rem",
            }}
          >
            <h2 style={{ "font-size": "1.25rem", color: "#2d3748" }}>Recent Care Sessions</h2>
            <A
              href={`/schedules/new?familyId=${params.id}`}
              style={{
                padding: "0.5rem 1rem",
                "background-color": "#4299e1",
                color: "white",
                border: "none",
                "border-radius": "4px",
                "text-decoration": "none",
                "font-size": "0.875rem",
              }}
            >
              + Schedule Session
            </A>
          </div>

          <Show
            when={family()?.careSessions?.length}
            fallback={
              <p style={{ color: "#718096", "text-align": "center", padding: "2rem" }}>
                No care sessions scheduled yet.
              </p>
            }
          >
            <div style={{ "overflow-x": "auto" }}>
              <table style={{ width: "100%", "border-collapse": "collapse" }}>
                <thead>
                  <tr style={{ "background-color": "#f7fafc" }}>
                    <th
                      style={{
                        padding: "0.75rem",
                        "text-align": "left",
                        "border-bottom": "2px solid #e2e8f0",
                      }}
                    >
                      Date & Time
                    </th>
                    <th
                      style={{
                        padding: "0.75rem",
                        "text-align": "left",
                        "border-bottom": "2px solid #e2e8f0",
                      }}
                    >
                      Nanny
                    </th>
                    <th
                      style={{
                        padding: "0.75rem",
                        "text-align": "left",
                        "border-bottom": "2px solid #e2e8f0",
                      }}
                    >
                      Children
                    </th>
                    <th
                      style={{
                        padding: "0.75rem",
                        "text-align": "left",
                        "border-bottom": "2px solid #e2e8f0",
                      }}
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <For each={family()?.careSessions}>
                    {(session) => {
                      const statusColors = getStatusColor(session.status);
                      return (
                        <tr style={{ "border-bottom": "1px solid #e2e8f0" }}>
                          <td style={{ padding: "0.75rem" }}>
                            {formatDateTime(session.scheduledStart)}
                          </td>
                          <td style={{ padding: "0.75rem" }}>Lil Sprouts</td>
                          <td style={{ padding: "0.75rem" }}>
                            {session.children.length} child(ren)
                          </td>
                          <td style={{ padding: "0.75rem" }}>
                            <span
                              style={{
                                padding: "0.25rem 0.75rem",
                                "border-radius": "12px",
                                "background-color": statusColors.bg,
                                color: statusColors.color,
                                "font-size": "0.875rem",
                                "font-weight": "600",
                              }}
                            >
                              {session.status}
                            </span>
                          </td>
                        </tr>
                      );
                    }}
                  </For>
                </tbody>
              </table>
            </div>
          </Show>
        </div>

        {/* Recent Payments */}
        <div
          style={{
            "background-color": "#fff",
            padding: "1.5rem",
            "border-radius": "8px",
            border: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              display: "flex",
              "justify-content": "space-between",
              "align-items": "center",
              "margin-bottom": "1rem",
            }}
          >
            <h2 style={{ "font-size": "1.25rem", color: "#2d3748" }}>Recent Payments</h2>
            <A
              href={`/payments/new?familyId=${params.id}`}
              style={{
                padding: "0.5rem 1rem",
                "background-color": "#48bb78",
                color: "white",
                border: "none",
                "border-radius": "4px",
                "text-decoration": "none",
                "font-size": "0.875rem",
              }}
            >
              + Add Payment
            </A>
          </div>

          <Show
            when={family()?.payments?.length}
            fallback={
              <p style={{ color: "#718096", "text-align": "center", padding: "2rem" }}>
                No payment records yet.
              </p>
            }
          >
            <div style={{ "overflow-x": "auto" }}>
              <table style={{ width: "100%", "border-collapse": "collapse" }}>
                <thead>
                  <tr style={{ "background-color": "#f7fafc" }}>
                    <th
                      style={{
                        padding: "0.75rem",
                        "text-align": "left",
                        "border-bottom": "2px solid #e2e8f0",
                      }}
                    >
                      Date
                    </th>
                    <th
                      style={{
                        padding: "0.75rem",
                        "text-align": "left",
                        "border-bottom": "2px solid #e2e8f0",
                      }}
                    >
                      Amount
                    </th>
                    <th
                      style={{
                        padding: "0.75rem",
                        "text-align": "left",
                        "border-bottom": "2px solid #e2e8f0",
                      }}
                    >
                      Type
                    </th>
                    <th
                      style={{
                        padding: "0.75rem",
                        "text-align": "left",
                        "border-bottom": "2px solid #e2e8f0",
                      }}
                    >
                      Status
                    </th>
                    <th
                      style={{
                        padding: "0.75rem",
                        "text-align": "left",
                        "border-bottom": "2px solid #e2e8f0",
                      }}
                    >
                      Invoice #
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <For each={family()?.payments}>
                    {(payment) => {
                      const statusColors = getPaymentStatusColor(payment.status);
                      return (
                        <tr style={{ "border-bottom": "1px solid #e2e8f0" }}>
                          <td style={{ padding: "0.75rem" }}>{formatDate(payment.createdAt)}</td>
                          <td style={{ padding: "0.75rem", "font-weight": "600" }}>
                            ${payment.amount.toFixed(2)}
                          </td>
                          <td style={{ padding: "0.75rem" }}>{payment.method || "N/A"}</td>
                          <td style={{ padding: "0.75rem" }}>
                            <span
                              style={{
                                padding: "0.25rem 0.75rem",
                                "border-radius": "12px",
                                "background-color": statusColors.bg,
                                color: statusColors.color,
                                "font-size": "0.875rem",
                                "font-weight": "600",
                              }}
                            >
                              {payment.status}
                            </span>
                          </td>
                          <td style={{ padding: "0.75rem", "font-size": "0.875rem" }}>
                            {payment.invoiceNumber || "-"}
                          </td>
                        </tr>
                      );
                    }}
                  </For>
                </tbody>
              </table>
            </div>
          </Show>
        </div>
      </Show>

      {/* Invite Modal */}
      <Show when={showInviteModal()}>
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            "background-color": "rgba(0,0,0,0.5)",
            display: "flex",
            "align-items": "center",
            "justify-content": "center",
            "z-index": 1000,
          }}
          onClick={() => setShowInviteModal(null)}
        >
          <div
            style={{
              "background-color": "#fff",
              padding: "2rem",
              "border-radius": "8px",
              "max-width": "500px",
              width: "90%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ "margin-bottom": "1rem", color: "#2d3748" }}>
              Invite Family Member to App
            </h2>
            <p style={{ "margin-bottom": "1.5rem", color: "#718096", "font-size": "0.875rem" }}>
              Create login credentials for this family member so they can access the app and update
              information.
            </p>
            <form onSubmit={handleInvite}>
              <input type="hidden" name="memberId" value={showInviteModal()!} />
              <div style={{ "margin-bottom": "1rem" }}>
                <label
                  for="username"
                  style={{
                    display: "block",
                    "margin-bottom": "0.5rem",
                    "font-weight": "600",
                    color: "#2d3748",
                  }}
                >
                  Username *
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  placeholder="username"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #cbd5e0",
                    "border-radius": "4px",
                    "font-size": "1rem",
                  }}
                />
              </div>
              <div style={{ "margin-bottom": "1.5rem" }}>
                <label
                  for="password"
                  style={{
                    display: "block",
                    "margin-bottom": "0.5rem",
                    "font-weight": "600",
                    color: "#2d3748",
                  }}
                >
                  Temporary Password *
                </label>
                <input
                  id="password"
                  name="password"
                  type="text"
                  required
                  placeholder="Create a temporary password"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #cbd5e0",
                    "border-radius": "4px",
                    "font-size": "1rem",
                  }}
                />
                <p style={{ "margin-top": "0.5rem", "font-size": "0.75rem", color: "#718096" }}>
                  Share this with the family member so they can log in. They should change it after
                  first login.
                </p>
              </div>
              <div style={{ display: "flex", gap: "1rem", "justify-content": "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowInviteModal(null)}
                  style={{
                    padding: "0.75rem 1.5rem",
                    "background-color": "#edf2f7",
                    color: "#2d3748",
                    border: "1px solid #cbd5e0",
                    "border-radius": "4px",
                    cursor: "pointer",
                    "font-weight": "600",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "0.75rem 1.5rem",
                    "background-color": "#48bb78",
                    color: "white",
                    border: "none",
                    "border-radius": "4px",
                    cursor: "pointer",
                    "font-weight": "600",
                  }}
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      </Show>

      {/* Schedule Dialog Modals */}
      <Show when={showScheduleDialog()}>
        <div
          onClick={closeScheduleDialog}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            "background-color": "rgba(0, 0, 0, 0.5)",
            display: "flex",
            "align-items": "center",
            "justify-content": "center",
            "z-index": 1000,
            padding: "2rem",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              "background-color": "white",
              "border-radius": "8px",
              "max-width": "800px",
              width: "100%",
              "max-height": "90vh",
              "overflow-y": "auto",
              padding: "2rem",
            }}
          >
            {/* View Schedule Dialog */}
            <Show when={showScheduleDialog() === "view" && selectedSchedule()}>
              <div>
                <div style={{ display: "flex", "justify-content": "space-between", "margin-bottom": "1.5rem" }}>
                  <h2 style={{ color: "#2d3748", "font-size": "1.5rem", margin: 0 }}>
                    {selectedSchedule()?.name}
                  </h2>
                  <button
                    onClick={closeScheduleDialog}
                    style={{
                      background: "none",
                      border: "none",
                      "font-size": "1.5rem",
                      cursor: "pointer",
                      color: "#718096",
                    }}
                  >
                    ×
                  </button>
                </div>
                  
                <div style={{ display: "grid", gap: "1rem", "margin-bottom": "1.5rem" }}>
                  <div>
                    <strong style={{ color: "#4a5568" }}>Service:</strong>
                    <p style={{ margin: "0.25rem 0 0 0" }}>{selectedSchedule()?.service.name}</p>
                  </div>
                  <div>
                    <strong style={{ color: "#4a5568" }}>Pattern:</strong>
                    <p style={{ margin: "0.25rem 0 0 0" }}>{selectedSchedule()?.recurrence}</p>
                  </div>
                  <div>
                    <strong style={{ color: "#4a5568" }}>Days of Week:</strong>
                    <p style={{ margin: "0.25rem 0 0 0" }}>{selectedSchedule()?.daysOfWeek.join(", ")}</p>
                  </div>
                  <div>
                    <strong style={{ color: "#4a5568" }}>Time:</strong>
                    <p style={{ margin: "0.25rem 0 0 0" }}>
                      {selectedSchedule()?.startTime} - {selectedSchedule()?.endTime}
                    </p>
                  </div>
                  <div>
                    <strong style={{ color: "#4a5568" }}>Hourly Rate:</strong>
                    <p style={{ margin: "0.25rem 0 0 0" }}>
                      {selectedSchedule()?.hourlyRate ? `$${selectedSchedule()?.hourlyRate}` : "Service default"}
                    </p>
                  </div>
                  <div>
                    <strong style={{ color: "#4a5568" }}>Children:</strong>
                    <p style={{ margin: "0.25rem 0 0 0" }}>
                      {selectedSchedule()?.children.map((c: any) => `${c.firstName} ${c.lastName}`).join(", ") || "None"}
                    </p>
                  </div>
                  <div>
                    <strong style={{ color: "#4a5568" }}>Start Date:</strong>
                    <p style={{ margin: "0.25rem 0 0 0" }}>{selectedSchedule()?.startDate && formatDateLocal(selectedSchedule()!.startDate)}</p>
                  </div>
                  <Show when={selectedSchedule()?.endDate}>
                    <div>
                      <strong style={{ color: "#4a5568" }}>End Date:</strong>
                      <p style={{ margin: "0.25rem 0 0 0" }}>{selectedSchedule()?.endDate && formatDateLocal(selectedSchedule()!.endDate!)}</p>
                    </div>
                  </Show>
                  <div>
                    <strong style={{ color: "#4a5568" }}>Status:</strong>
                    <p style={{ margin: "0.25rem 0 0 0" }}>{selectedSchedule()?.isActive ? "Active" : "Inactive"}</p>
                  </div>
                  <div>
                    <strong style={{ color: "#4a5568" }}>Sessions Generated:</strong>
                    <p style={{ margin: "0.25rem 0 0 0" }}>{selectedSchedule()?._count.careSessions}</p>
                  </div>
                  <Show when={selectedSchedule()?.notes}>
                    <div>
                      <strong style={{ color: "#4a5568" }}>Notes:</strong>
                      <p style={{ margin: "0.25rem 0 0 0", color: "#718096" }}>{selectedSchedule()?.notes}</p>
                    </div>
                  </Show>
                </div>
                  
                <div style={{ display: "flex", gap: "1rem", "justify-content": "space-between" }}>
                  <form
                    action={deleteCareSchedule}
                    method="post"
                    onSubmit={(e) => {
                      if (!confirm(`Are you sure you want to delete "${selectedSchedule()?.name}"? This will not delete generated sessions.`)) {
                        e.preventDefault();
                      } else {
                        setTimeout(() => {
                          closeScheduleDialog();
                          window.location.reload();
                        }, 100);
                      }
                    }}
                    style={{ display: "inline" }}
                  >
                    <input type="hidden" name="id" value={selectedScheduleId()!} />
                    <button
                      type="submit"
                      style={{
                        padding: "0.5rem 1rem",
                        "background-color": "#f56565",
                        color: "#fff",
                        border: "none",
                        "border-radius": "4px",
                        cursor: "pointer",
                        "font-weight": "600",
                      }}
                    >
                      Delete Schedule
                    </button>
                  </form>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <button
                      onClick={() => openScheduleDialog("edit", selectedScheduleId()!)}
                      style={{
                        padding: "0.5rem 1rem",
                        "background-color": "#805ad5",
                        color: "#fff",
                        border: "none",
                        "border-radius": "4px",
                        cursor: "pointer",
                        "font-weight": "600",
                      }}
                    >
                      Edit Schedule
                    </button>
                    <button
                      onClick={closeScheduleDialog}
                      style={{
                        padding: "0.5rem 1rem",
                        "background-color": "#e2e8f0",
                        color: "#2d3748",
                        border: "none",
                        "border-radius": "4px",
                        cursor: "pointer",
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </Show>

            {/* Create/Edit Schedule Dialog */}
            <Show when={showScheduleDialog() === "create" || showScheduleDialog() === "edit"}>
              <div>
                <div style={{ display: "flex", "justify-content": "space-between", "margin-bottom": "1.5rem" }}>
                  <h2 style={{ color: "#2d3748", "font-size": "1.5rem", margin: 0 }}>
                    {showScheduleDialog() === "create" ? "Create New Schedule" : "Edit Schedule"}
                  </h2>
                  <button
                    onClick={closeScheduleDialog}
                    style={{
                      background: "none",
                      border: "none",
                      "font-size": "1.5rem",
                      cursor: "pointer",
                      color: "#718096",
                    }}
                  >
                    ×
                  </button>
                </div>

                <form
                  action={showScheduleDialog() === "create" ? createCareSchedule : updateCareSchedule}
                  method="post"
                  onSubmit={(e) => {
                    setTimeout(() => {
                      if (!createScheduleSubmission.pending && !updateScheduleSubmission.pending) {
                        closeScheduleDialog();
                        window.location.reload();
                      }
                    }, 100);
                  }}
                >
                  <input type="hidden" name="familyId" value={params.id} />
                  <Show when={showScheduleDialog() === "edit"}>
                    <input type="hidden" name="id" value={selectedScheduleId()!} />
                  </Show>

                  <div style={{ display: "grid", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", "margin-bottom": "0.5rem", "font-weight": "500", color: "#2d3748" }}>
                        Schedule Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={selectedSchedule()?.name || ""}
                        required
                        placeholder="e.g., Regular Mon/Wed Care"
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          border: "1px solid #cbd5e0",
                          "border-radius": "4px",
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", "margin-bottom": "0.5rem", "font-weight": "500", color: "#2d3748" }}>
                        Service *
                      </label>
                      <select
                        name="serviceId"
                        value={selectedSchedule()?.serviceId || ""}
                        required
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          border: "1px solid #cbd5e0",
                          "border-radius": "4px",
                        }}
                      >
                        <option value="">Select a service</option>
                        <For each={services()}>
                          {(service) => <option value={service.id}>{service.name}</option>}
                        </For>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", "margin-bottom": "0.5rem", "font-weight": "500", color: "#2d3748" }}>
                        Recurrence Pattern *
                      </label>
                      <select
                        name="recurrence"
                        value={selectedSchedule()?.recurrence || "WEEKLY"}
                        required
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          border: "1px solid #cbd5e0",
                          "border-radius": "4px",
                        }}
                      >
                        <option value="ONCE">One-time</option>
                        <option value="WEEKLY">Weekly</option>
                        <option value="BIWEEKLY">Bi-weekly</option>
                        <option value="MONTHLY">Monthly</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", "margin-bottom": "0.5rem", "font-weight": "500", color: "#2d3748" }}>
                        Days of Week *
                      </label>
                      <div style={{ display: "grid", "grid-template-columns": "repeat(4, 1fr)", gap: "0.5rem" }}>
                        <For each={["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]}>
                          {(day) => (
                            <label style={{ display: "flex", "align-items": "center", gap: "0.25rem" }}>
                              <input
                                type="checkbox"
                                name="daysOfWeek"
                                value={day}
                                checked={selectedSchedule()?.daysOfWeek.includes(day as any)}
                              />
                              <span style={{ "font-size": "0.875rem" }}>{day.slice(0, 3)}</span>
                            </label>
                          )}
                        </For>
                      </div>
                    </div>

                    <div style={{ display: "grid", "grid-template-columns": "1fr 1fr", gap: "1rem" }}>
                      <div>
                        <label style={{ display: "block", "margin-bottom": "0.5rem", "font-weight": "500", color: "#2d3748" }}>
                          Start Time *
                        </label>
                        <input
                          type="time"
                          name="startTime"
                          value={selectedSchedule()?.startTime || "09:00"}
                          required
                          style={{
                            width: "100%",
                            padding: "0.5rem",
                            border: "1px solid #cbd5e0",
                            "border-radius": "4px",
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", "margin-bottom": "0.5rem", "font-weight": "500", color: "#2d3748" }}>
                          End Time *
                        </label>
                        <input
                          type="time"
                          name="endTime"
                          value={selectedSchedule()?.endTime || "17:00"}
                          required
                          style={{
                            width: "100%",
                            padding: "0.5rem",
                            border: "1px solid #cbd5e0",
                            "border-radius": "4px",
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", "margin-bottom": "0.5rem", "font-weight": "500", color: "#2d3748" }}>
                        Hourly Rate (optional)
                      </label>
                      <input
                        type="number"
                        name="hourlyRate"
                        value={selectedSchedule()?.hourlyRate || ""}
                        step="0.01"
                        min="0"
                        placeholder="Leave empty for service default"
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          border: "1px solid #cbd5e0",
                          "border-radius": "4px",
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", "margin-bottom": "0.5rem", "font-weight": "500", color: "#2d3748" }}>
                        Children
                      </label>
                      <div style={{ display: "flex", "flex-direction": "column", gap: "0.5rem" }}>
                        <For each={children()}>
                          {(child) => (
                            <label style={{ display: "flex", "align-items": "center", gap: "0.5rem" }}>
                              <input
                                type="checkbox"
                                name="childIds"
                                value={child.id}
                                checked={selectedSchedule()?.children.some((c: any) => c.id === child.id)}
                              />
                              <span>{child.firstName} {child.lastName}</span>
                            </label>
                          )}
                        </For>
                      </div>
                    </div>

                    <div style={{ display: "grid", "grid-template-columns": "1fr 1fr", gap: "1rem" }}>
                      <div>
                        <label style={{ display: "block", "margin-bottom": "0.5rem", "font-weight": "500", color: "#2d3748" }}>
                          Start Date *
                        </label>
                        <input
                          type="date"
                          name="startDate"
                          value={selectedSchedule()?.startDate ? selectedSchedule()!.startDate.toString().split('T')[0] : ""}
                          required
                          style={{
                            width: "100%",
                            padding: "0.5rem",
                            border: "1px solid #cbd5e0",
                            "border-radius": "4px",
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", "margin-bottom": "0.5rem", "font-weight": "500", color: "#2d3748" }}>
                          End Date (optional)
                        </label>
                        <input
                          type="date"
                          name="endDate"
                          value={selectedSchedule()?.endDate ? selectedSchedule()!.endDate!.toString().split('T')[0] : ""}
                          style={{
                            width: "100%",
                            padding: "0.5rem",
                            border: "1px solid #cbd5e0",
                            "border-radius": "4px",
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "flex", "align-items": "center", gap: "0.5rem" }}>
                        <input
                          type="checkbox"
                          name="isActive"
                          value="true"
                          checked={selectedSchedule()?.isActive ?? true}
                        />
                        <span style={{ "font-weight": "500", color: "#2d3748" }}>Active</span>
                      </label>
                    </div>

                    <div>
                      <label style={{ display: "block", "margin-bottom": "0.5rem", "font-weight": "500", color: "#2d3748" }}>
                        Notes
                      </label>
                      <textarea
                        name="notes"
                        rows={3}
                        value={selectedSchedule()?.notes || ""}
                        placeholder="Any additional notes..."
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          border: "1px solid #cbd5e0",
                          "border-radius": "4px",
                          "font-family": "inherit",
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "1rem", "justify-content": "flex-end", "margin-top": "1.5rem" }}>
                    <button
                      type="button"
                      onClick={closeScheduleDialog}
                      style={{
                        padding: "0.5rem 1rem",
                        "background-color": "#e2e8f0",
                        color: "#2d3748",
                        border: "none",
                        "border-radius": "4px",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={createScheduleSubmission.pending || updateScheduleSubmission.pending}
                      style={{
                        padding: "0.5rem 1rem",
                        "background-color": "#805ad5",
                        color: "#fff",
                        border: "none",
                        "border-radius": "4px",
                        cursor: createScheduleSubmission.pending || updateScheduleSubmission.pending ? "not-allowed" : "pointer",
                        opacity: createScheduleSubmission.pending || updateScheduleSubmission.pending ? "0.6" : "1",
                        "font-weight": "600",
                      }}
                    >
                      {createScheduleSubmission.pending || updateScheduleSubmission.pending
                        ? "Saving..."
                        : showScheduleDialog() === "create"
                        ? "Create Schedule"
                        : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            </Show>
          </div>
        </div>
      </Show>

      {/* Generate Sessions Dialog */}
      <Show when={showGenerateDialog()}>
        <div
          onClick={closeGenerateDialog}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            "background-color": "rgba(0, 0, 0, 0.5)",
            display: "flex",
            "align-items": "center",
            "justify-content": "center",
            "z-index": 1000,
            padding: "2rem",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              "background-color": "white",
              "border-radius": "8px",
              "max-width": "500px",
              width: "100%",
              padding: "2rem",
            }}
          >
            <div style={{ display: "flex", "justify-content": "space-between", "margin-bottom": "1.5rem" }}>
              <h2 style={{ color: "#2d3748", "font-size": "1.5rem", margin: 0 }}>
                Generate Sessions
              </h2>
              <button
                onClick={closeGenerateDialog}
                style={{
                  background: "none",
                  border: "none",
                  "font-size": "1.5rem",
                  cursor: "pointer",
                  color: "#718096",
                }}
              >
                ×
              </button>
            </div>

            <p style={{ color: "#718096", "margin-bottom": "1.5rem" }}>
              Generate care sessions from this schedule for a specific date range.
            </p>

            <form
              action={generateSessionsFromSchedule}
              method="post"
              onSubmit={(e) => {
                setTimeout(() => {
                  if (!generateSessionsSubmission.pending) {
                    closeGenerateDialog();
                    window.location.reload();
                  }
                }, 100);
              }}
            >
              <input type="hidden" name="scheduleId" value={generateScheduleId()!} />

              <div style={{ display: "grid", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", "margin-bottom": "0.5rem", "font-weight": "500", color: "#2d3748" }}>
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    required
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #cbd5e0",
                      "border-radius": "4px",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", "margin-bottom": "0.5rem", "font-weight": "500", color: "#2d3748" }}>
                    End Date *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    required
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #cbd5e0",
                      "border-radius": "4px",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", "justify-content": "flex-end", "margin-top": "1.5rem" }}>
                <button
                  type="button"
                  onClick={closeGenerateDialog}
                  style={{
                    padding: "0.5rem 1rem",
                    "background-color": "#e2e8f0",
                    color: "#2d3748",
                    border: "none",
                    "border-radius": "4px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={generateSessionsSubmission.pending}
                  style={{
                    padding: "0.5rem 1rem",
                    "background-color": "#48bb78",
                    color: "#fff",
                    border: "none",
                    "border-radius": "4px",
                    cursor: generateSessionsSubmission.pending ? "not-allowed" : "pointer",
                    opacity: generateSessionsSubmission.pending ? "0.6" : "1",
                    "font-weight": "600",
                  }}
                >
                  {generateSessionsSubmission.pending ? "Generating..." : "Generate Sessions"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Show>
    </main>
  );
}
