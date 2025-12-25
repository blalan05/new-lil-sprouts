import { createAsync, type RouteDefinition, A, useParams } from "@solidjs/router";
import { Show, For, createSignal } from "solid-js";
import { getFamily } from "~/lib/families";
import {
  getFamilyMembers,
  deleteFamilyMember,
  inviteFamilyMember,
  revokeAccess,
} from "~/lib/family-members";

export const route = {
  preload({ params }) {
    if (params.id) {
      getFamily(params.id);
      getFamilyMembers(params.id);
    }
  },
} satisfies RouteDefinition;

export default function FamilyDetailPage() {
  const params = useParams();
  const family = createAsync(() => getFamily(params.id!));
  const familyMembers = createAsync(() => getFamilyMembers(params.id!));
  const [showInviteModal, setShowInviteModal] = createSignal<string | null>(null);

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
                {family()?.parentFirstName} {family()?.parentLastName}
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
                                  .replace(/_/g, " ")
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
              Care Sessions ({family()?.careSessions?.length || 0})
            </h2>
            <A
              href={`/families/${params.id}/schedules/new`}
              style={{
                padding: "0.5rem 1rem",
                "background-color": "#805ad5",
                color: "white",
                border: "none",
                "border-radius": "4px",
                "text-decoration": "none",
                "font-size": "0.875rem",
              }}
            >
              + Schedule Care
            </A>
          </div>

          <Show
            when={family()?.careSessions?.length}
            fallback={
              <div style={{ "text-align": "center", padding: "2rem" }}>
                <p style={{ color: "#718096", "margin-bottom": "1rem" }}>
                  No care sessions scheduled yet. Create one-time or recurring sessions.
                </p>
                <A
                  href={`/families/${params.id}/schedules/new`}
                  style={{
                    padding: "0.75rem 1.5rem",
                    "background-color": "#805ad5",
                    color: "white",
                    border: "none",
                    "border-radius": "4px",
                    "text-decoration": "none",
                    "font-weight": "600",
                    display: "inline-block",
                  }}
                >
                  Schedule First Session
                </A>
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
                              {session.status}
                            </span>
                          </td>
                          <td style={{ padding: "0.75rem" }}>
                            {session.isConfirmed ? (
                              <span style={{ color: "#48bb78" }}>✓ Yes</span>
                            ) : (
                              <span style={{ color: "#ed8936" }}>⚠ Pending</span>
                            )}
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
    </main>
  );
}
